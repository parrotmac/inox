import React from 'react';

import LoginForm from '../components/LoginForm';

import './LoginPage.css'

export interface ILoginPageState {}

class LoginPage extends React.Component {
    public state: ILoginPageState = {};

    render(): JSX.Element {
        return (
            <div className={'LoginPage'}>
                <h2>The Rusted Project</h2>
                <hr style={{ width: "50%" }} />
                <br />
                <LoginForm />
            </div>
        )
    }
}

export default LoginPage;