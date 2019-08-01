import React, { Component } from "react";

import { Button, Card, Divider, Elevation, H1, H5 } from "@blueprintjs/core";

import DebugMessageDisplay from "../components/DebugMessageDisplay";
import "./SettingsPage.css";

class SettingsPage extends Component {
  public render(): JSX.Element {

    const dummyData = [
      {
        topic: "evt/web/shits/giggles",
        payload: {
          status: "laugh",
        },
      },
      {
        topic: "evt/web/door/status",
        payload: {
          status: "locked",
        },
      },
      {
        topic: "evt/web/lights",
        payload: {
          bool: "true",
        },
      },
    ];

    return (
      <div className={"SettingsPage"}>
        <Card interactive={true} elevation={Elevation.TWO}>
          <H5>Device Settings</H5>
          <Button
            className={"SettingsPageButton"}
            style={{ width: "800px" }}
            text="customized button" />
        </Card>
        <Divider/>
        <Card interactive={true} elevation={Elevation.TWO}>
          <H1>Start second card.</H1>
            <DebugMessageDisplay messageList={dummyData}/>
          <H5>End second card.</H5>
          <br/>
        </Card>
      </div>
    );
  }
}

export default SettingsPage;
