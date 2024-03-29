import React, { Component } from "react";

import { Route, Switch } from "react-router";

import LocationPage from "../pages/LocationPage";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import SettingsPage from "../pages/SettingsPage";

class Routes extends Component {
  public render(): React.ReactNode {
    return (
      <>
        <Switch>
          <Route path={"/login"} component={LoginPage as any}/>
          <Route path={"/settings"} component={SettingsPage as any}/>
          <Route path={"/location"} component={LocationPage as any}/>
          <Route component={NotFound as any}/>
        </Switch>
      </>
    );
  }
}

export default Routes;
