import React from "react";

import LoginForm from "../components/LoginForm";

import "./LoginPage.css";

class LoginPage extends React.Component {

  public render(): JSX.Element {
    return (
      <div className={"LoginPage"}>
        <h1>The Rusted Project</h1>
        <hr style={{ width: "50%" }} />
        <p>Please sign in</p>
        <LoginForm />
      </div>
    );
  }
}

export default LoginPage;
