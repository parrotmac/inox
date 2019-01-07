import React, { Component } from 'react';

import { Route, Switch } from 'react-router';

import LocationPage from '../pages/LocationPage';
import LoginPage from '../pages/LoginPage';
import NotFound from '../pages/NotFound';
import SettingsPage from '../pages/SettingsPage';
import { MessageProviderContextProvider } from '../utils/mesasge-context';

class Routes extends Component {
  public render(): JSX.Element {
    return (
      <MessageProviderContextProvider
        value={{ websocket: new WebSocket('ws://localhost:4000') }}
      >
        <Switch>
          <Route path={'/location'} component={LocationPage as any}/>
          <Route path={'/login'} component={LoginPage as any}/>
          <Route path={'/settings'} component={SettingsPage as any}/>
          <Route component={NotFound as any}/>
        </Switch>
      </MessageProviderContextProvider>
    );
  }
}

export default Routes;
