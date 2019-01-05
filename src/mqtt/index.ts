import * as mqtt from "mqtt";
import { MqttClient, OnMessageCallback } from "mqtt";
import logger from "../util/logger";
import { ClientSubscribeCallback } from "mqtt";

/**
 * Config MQTT Client
 */

class MqttWrapper {
  private client: MqttClient;

  constructor(brokerURL: string) {
    this.client = mqtt.connect(brokerURL);
    this.client.on("connect", this.brokerConnected);
    this.client.on("disconnect", this.brokerDisconnected);
  }

  private brokerConnected = (wss: WebSocket) => {

  };

  private brokerDisconnected = () => {

  };

  public publish = (topic: string, message: string) => {
    if (this.client.connected) {
      logger.info(`PUB ${topic}\n>${message}`);
      this.client.publish(topic, message);
    } else {
      logger.warn("Attempted to publish without broker connection");
    }
  };

  public subscribe = (topic: string, callback: ClientSubscribeCallback) => {
    this.client.subscribe(topic, callback);
  };

  public onMessage = (callback: OnMessageCallback) => {
    this.client.on("message", callback);
  };

  public shutdown = () => {
      this.client.end();
  };
}

export default MqttWrapper;
