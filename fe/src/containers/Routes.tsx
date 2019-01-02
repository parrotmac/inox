import React, { Component } from 'react';

import { Route, Switch } from 'react-router';

import LoginPage from '../pages/LoginPage';
import NotFound from '../pages/NotFound';

class Routes extends Component {
  public render(): JSX.Element {
    return (
      <>
        <Switch>
          <Route path={'/login'} component={LoginPage as any}/>
          <Route component={NotFound as any}/>
        </Switch>
      </>
    );
  }
}

export default Routes;
