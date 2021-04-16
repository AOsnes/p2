import './App.css';
import React from 'react';
import {UserContext} from './UserContext';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Header from "./components/header.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";

class App extends React.Component{
    static contextType = UserContext;
    render(){
        let signedInUser = this.context;
        return (
            <UserContext.Provider value={signedInUser}>
                <Router>
                    <Header/>
                    
                    <Switch>
                        <Route path="/skema">
                            <Skema/>
                        </Route>
                        <Route path="/afleveringer">
                            <Afleveringer/>
                        </Route>
                        <Route path="/">
                            <Login/>
                        </Route>
                    </Switch>
                </Router>
            </UserContext.Provider>

        );
    }
}

/* Betragt disee som components der render hele siden ved hver rute
fx Login() bliver rendered når vi rammer "/" ruten */
function Login(){
    return <LoginForm/>
}

function Skema(){
    return(
        <Sidebar/>
    )
}

function Afleveringer(){
    return(
        <Sidebar/>
    )
}


export default App;
