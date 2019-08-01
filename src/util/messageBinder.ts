import * as WebSocket from "ws";
import MqttWrapper from "../mqtt";
import { OnMessageCallback } from "mqtt";
import logger from "./logger";
import { Server } from "ws";
import Soracom, { ISoracomAuth, ISoracomSession } from "./soracom";
import { SORACOM_AUTH } from "./secrets";

class WebsocketClient {
  websocket: WebSocket;
  idToken: string;
  constructor(ws: WebSocket, idToken: string) {
    this.websocket = ws;
    this.idToken = idToken;
  }
}

// Setup Soracom API
const soracom = new Soracom((JSON.parse(SORACOM_AUTH) as ISoracomAuth));

class MessageBinder {
  private mqtt: MqttWrapper;
  private wsServer: Server;
  private websocketConnections: WebSocket[];
  constructor(websocketSever: Server, mqttBrokerAddr: string) {
    this.websocketConnections = [];
    this.wsServer = websocketSever;
    this.mqtt = new MqttWrapper(mqttBrokerAddr);

    this.mqtt.onMessage(this.handleMqttMessage);
    this.mqtt.subscribe("evt/#", (err) => {
      if (err) {
        logger.warning(err.message);
      }
    });
    this.wsServer.on("connection", this.handleWebsocketConnect);
  }

  broadcastToAllWebsockets = (messageBody: string) => {
    this.websocketConnections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageBody);
      } else {
        // TODO: Remove or request removal of websocket from connection pool
      }
    });
  };

  handleMqttMessage: OnMessageCallback = (topic, body) => {
    logger.debug(`${topic}:${body}`);
    let payload = {};
    try {
      payload = JSON.parse(body.toString());
    } catch (e) {}

    if (topic.startsWith("evt/") && topic.endsWith("/cell")) {
      const data = JSON.parse(body.toString());
      const {
        sim: {
          imsi
        },
        location
      } = data;

      if (location) {
       // Use modem's report
      const {
        cid,
        lac,
        mcc,
        mnc,
        // tac,
      } = location;

        soracom.getCellLocations(mcc, mnc, lac, cid).then(res => {
          console.warn("cell-location data", res);
          this.broadcastToAllWebsockets(JSON.stringify({
            "topic": `${topic}/cell-location`,
            "payload": res,
          }));
        }).catch(console.error);

      } else {
        // Lookup session in Soracom

        soracom.listSessionEvents(imsi).then((res: Array<ISoracomSession>) => {
          if (res.length > 0) {
            this.broadcastToAllWebsockets(JSON.stringify({
              "topic": `${topic}/latest-session`,
              "payload": res,
            }));
            const cellData = res[0];
            soracom.getCellLocations(cellData.cell.mcc, cellData.cell.mnc, cellData.cell.tac, cellData.cell.eci).then(res => {
              this.broadcastToAllWebsockets(JSON.stringify({
                "topic": `${topic}/location`,
                "payload": res,
              }));
            }).catch(console.error);
          }
        });
      }
    }

    this.broadcastToAllWebsockets(JSON.stringify({
      "topic": topic,
      "payload": payload,
    }));
  };

  handleWebsocketConnect = (ws: WebSocket) => {
    // TODO: Cleanup dead connections
    this.websocketConnections.push(ws);
    ws.on("message", this.handleWebsocketMessage);
  };

  handleWebsocketMessage = (message: string) => {
    logger.debug(`${message}`);
    try {
      const mqttMessage = JSON.parse(message);
      const topic = mqttMessage["topic"];
      const payload = mqttMessage["payload"];
      this.mqtt.publish(topic, JSON.stringify(payload));
    } catch (e) {
      logger.warn(e);
    }
  }

}

export default MessageBinder;
