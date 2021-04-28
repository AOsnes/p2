import React from 'react';
import {UserContext} from './UserContext';
import {BrowserRouter as Router, Switch, Route, useLocation} from "react-router-dom";

import './css/body.css';
import './css/header.css';
import './css/loginform.css';
import './css/sidebar.css';
import './css/skema.css';
import './css/skemabrik.css';

import Header from "./components/header.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";
import NoMatchError from "./components/noMatchError.component";
import Skema from "./components/skema.component"

class App extends React.Component{
    static contextType = UserContext;
    render(){
        let signedInUser = this.context;
        return (
            <UserContext.Provider value={signedInUser}>
                <Router>
                    <Switch>
                        <Route path="/skema">
                            <Skemapage/>
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
            {/* TODO: Skal ikke render header, men en velkommen besked i stedet for */}
            <LoginForm/>
        </div>
    )
}

function Skemapage(){
    return(
        <div>
            <Header linkTo="/skema"/>
            <Sidebar/>
            <Skema/>
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
    return(
        <div>
            <Header linkTo="/"/>
            <NoMatchError location={location.pathname}/>
        </div>
    )
}


export default App;