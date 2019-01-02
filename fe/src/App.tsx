import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import NavBar from "./components/NavBar";

class App extends Component {
    render(): JSX.Element {
        return (
            <BrowserRouter>
                <div className="App">
                    <NavBar/>
                    <Switch>
                        <Route path={"/login"} component={LoginPage as any}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
