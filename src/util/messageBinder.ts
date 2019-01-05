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
  constructor(websocketSever: Server, mqttBrokerAddr: string) {
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

  handleMqttMessage: OnMessageCallback = (topic, body) => {
    logger.debug(`${topic}:${body}`);
  };

  handleWebsocketConnect = (ws: WebSocket) => {
    ws.on("message", this.handleWebsocketMessage);
  };

  handleWebsocketMessage = (message: string) => {
    logger.debug(`${message}`);
  }

}

export default MessageBinder;
