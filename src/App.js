import './App.css';
import React from 'react';
import {UserContext} from './UserContext';
import {BrowserRouter as Router, Switch, Route, useLocation} from "react-router-dom";

import Header from "./components/header.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";
import NoMatchError from "./components/noMatchError.component";

class App extends React.Component{
    static contextType = UserContext;
    render(){
        let signedInUser = this.context;
        return (
            <UserContext.Provider value={signedInUser}>
                <Router>
                    
                    <Switch>
                        <Route path="/skema">
                            <Skema/>
                        </Route>
                        <Route path="/afleveringer">
                            <Afleveringer/>
                        </Route>
                        <Route exact path="/">
                            <Login/>
                        </Route>
                        <Route path="*">
                            <NoMatch/>
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
    return (
        <div>
            <Header linkTo="/"/>
            <LoginForm/>
        </div>
    )
}

function Skema(){
    return(
        <div>
            <Header linkTo="/skema"/>
            <Sidebar/>
        </div>
    )
}

function Afleveringer(){
    return(
        <div>
            <Header linkTo="/skema"/>
            <Sidebar/>
        </div>
    )
}

function NoMatch(){
    let location = useLocation();
    console.log(123)
    return(
        <div>
            <Header linkTo="/"/>
            <NoMatchError location={location.pathname}/>
        </div>
    )
}


export default App;