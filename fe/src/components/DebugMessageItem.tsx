import React, { Component } from "react";

interface IProps {
  topic: string
  payload: object
}

class DebugMessageItem extends Component<IProps> {
  public render(): JSX.Element {
    const { topic, payload } = this.props;
    return (
      <div className={"DebugMessageItem"}>
        <p>{topic}</p>
        <p>{JSON.stringify(payload)}</p>
        Debug Message Item
      </div>
    );
  }
}

export default DebugMessageItem;
