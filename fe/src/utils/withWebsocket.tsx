import React, { ComponentType, PureComponent } from 'react';
import {
  IMessageProviderConsumerComponent,
  MessageProviderContextConsumer,
} from './mesasge-context';

export const withWebsocket =
  (WrappedComponent: ComponentType<IMessageProviderConsumerComponent>) => {
    return class WithExpander extends
      PureComponent <
        IMessageProviderConsumerComponent,
        {handler: () => void}> {
      public render(): JSX.Element {
        return (
          <MessageProviderContextConsumer>
            {(value) => (
              value && (
                  <WrappedComponent
                    onMessageReceived={
                      /* tslint:disable-next-line:jsx-no-lambda */
                      fn =>
                        value.websocket.addEventListener(
                          'message', msg => fn(msg),
                        )
                    }
                    websocketInterface={{ websocket: value.websocket }}
                    {...this.props}
                  />
              )
            )}
          </MessageProviderContextConsumer>
        );
      }
    };
  };
