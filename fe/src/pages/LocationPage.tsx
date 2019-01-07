import { Card } from '@blueprintjs/core';
import React, { Component } from 'react';
import { IMessageProviderConsumerComponent } from '../utils/mesasge-context';
import { withWebsocket } from '../utils/withWebsocket';

interface IState {
  messages: Array<any>
}

class LocationPage extends Component<IMessageProviderConsumerComponent, IState> {
  constructor(props: IMessageProviderConsumerComponent) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  public componentDidMount(): void {
    this.props.onMessageReceived(message => {
      this.setState({
        messages: [message.data, ...this.state.messages],
      });
    });
  }

  public render(): JSX.Element {
    const { websocketInterface: { websocket } } = this.props;
    return (
      <div className={'LocationPage'}>

        <Card>
          {websocket.readyState === WebSocket.OPEN ? 'Open' : 'Closed'}
          <hr />
          {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}
        </Card>
      </div>
    );
  }
}

export default withWebsocket(LocationPage);
