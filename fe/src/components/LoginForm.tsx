import React from 'react';

import {
  Button,
  Icon,
  InputGroup,
  Intent,
  Spinner,
  Tooltip,
} from '@blueprintjs/core';

import './LoginForm.css';

export interface IInputGroupExampleState {
  disabled: boolean;
  filterValue: string;
  large: boolean;
  small: boolean;
  showPassword: boolean;
  tagValue: string;
}

class LoginForm extends React.Component {
  public state: IInputGroupExampleState = {
    disabled: false,
    filterValue: '',
    large: false,
    showPassword: false,
    small: false,
    tagValue: '',
  };

  private handleLockClick = () => this.setState({ showPassword: !this.state.showPassword });

  public render(): JSX.Element {

    const { disabled, filterValue, showPassword } = this.state;

    const maybeSpinner = filterValue ? <Spinner size={Icon.SIZE_STANDARD} /> : undefined;

    const lockButton = (
      <Tooltip content={`${showPassword ? 'Hide' : 'Show'} Password`} disabled={disabled}>
        <Button
          disabled={disabled}
          icon={showPassword ? 'unlock' : 'lock'}
          intent={Intent.WARNING}
          minimal={true}
          onClick={this.handleLockClick}
          tabIndex={-1}
        />
      </Tooltip>
    );

    return (
      <div className={'LoginForm'}>
        <InputGroup
          large={true}
          leftIcon="user"
          placeholder="you@example.com"
          rightElement={maybeSpinner}
          // value={filterValue}
        />
        <InputGroup
          large={true}
          leftIcon={'key'}
          placeholder="**********"
          rightElement={lockButton}
          type={showPassword ? 'text' : 'password'}
        />
        <Button large={true} rightIcon="arrow-right" intent="success" text="Login" />
      </div>
    );
  }
}

export default LoginForm;
