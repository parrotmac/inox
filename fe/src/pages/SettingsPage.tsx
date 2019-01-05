import React, { Component } from 'react';

import { Card, H5 } from '@blueprintjs/core';

class SettingsPage extends Component {
  public render(): JSX.Element {
    return (
      <div className={'SettingsPage'}>
        <Card>
          <H5>Device Settings</H5>
        </Card>
      </div>
    );
  }
}

export default SettingsPage;
