import React, { Component } from 'react';
import DebugMessageItem from './DebugMessageItem';

interface IProps {
  messageList: Array<any>
}

class DebugMessageDisplay extends Component<IProps> {
  public render(): JSX.Element {

    const messageList = this.props.messageList;
    return (
      <div className={'DebugMessageDisplay'}>
        {messageList.map(m => <p key={1}>{JSON.stringify(m)}</p>)}
        {messageList.map(m => <DebugMessageItem key={2} topic={m.topic} payload={m.payload}/>)}
        Debug Massage Display
      </div>
    );
  }
}

export default DebugMessageDisplay;
