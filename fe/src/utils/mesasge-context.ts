import React from 'react';

export interface IMessageProviderContextInterface {
  websocket: WebSocket,
}

export interface IMessageProviderConsumerComponent {
  onMessageReceived: (onmessage: ((msg: MessageEvent) => any)) => void,
  websocketInterface: IMessageProviderContextInterface,
}

const ctxt = React.createContext<IMessageProviderContextInterface | null>(null);

export const MessageProviderContextProvider = ctxt.Provider;

export const MessageProviderContextConsumer = ctxt.Consumer;
