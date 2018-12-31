import React, { Component } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import LoginForm from './components/LoginForm';

class App extends Component {
  render(): JSX.Element {
    return (
      <div className="App">
        <LoginPage />
      </div>
    );
  }
}

export default App;
