import * as WebSocket from "ws";
import MqttWrapper from "../mqtt";
import { OnMessageCallback } from "mqtt";
import logger from "./logger";
import { Server } from "ws";

class WebsocketClient {
  websocket: WebSocket;
  idToken: string;
  constructor(ws: WebSocket, idToken: string) {
    this.websocket = ws;
    this.idToken = idToken;
  }
}

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
