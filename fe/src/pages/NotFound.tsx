import { Card } from "@blueprintjs/core";
import React, { Component } from "react";

class NotFound extends Component {
  public render(): React.ReactNode {
    return (
      <Card className={"NotFound"} style={{ color: "#293742" }}>
        <code style={{ fontSize: "32px" }}>404</code>
        <h4>Not Found</h4>
        <p>:(</p>
      </Card>
    );
  }
}

export default NotFound;
