import React from 'react';
import {UserContext} from './UserContext';
import {BrowserRouter as Router, Switch, Route, useLocation} from "react-router-dom";

import './css/body.css';
import './css/header.css';
import './css/loginform.css';
import './css/sidebar.css';
import './css/skema.css';
import './css/skemabrik.css';
import './css/modals.css';
import './css/afleveringer.css';
import './css/skemabrikForm.css';
import './css/toggleknap.css';
import './css/timeIndicator.css';
import './css/changeWeek.css';
import './css/turnedInAssignments.css';
import './css/feedbackTable.css';

import Header from "./components/header.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";
import NoMatchError from "./components/noMatchError.component";
import SkemabrikForm from "./components/skemabrikForm.component";
import Skema from "./components/skema.component";
import LogoutModal from "./components/logoutModal.component";
import TurnedInAssignmentsTable from './components/turnedInAssignmentsTable.component';
import FeedbackTable from './components/feedbackTable.component';

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
                            <AfleveringerPage/>
                        </Route>
                        {signedInUser.role === 'student' ? 
                            <Route exact path="/feedback">
                                <FeedbackTablePage/>
                            </Route>
                        : null}
                        {signedInUser.role === 'teacher' ? 
                            <Route path="/redigerSkema">
                                <RedigerSkema/>
                            </Route> 
                        : null}
                        {signedInUser.role === 'teacher' ?
                            <Route path="/afleveret" render={(props) => 
                                <TurnedInAssignmentsPage {...props}/>}>
                            </Route>
                        : null}
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
fx Login() bliver rendered n??r vi rammer "/" ruten */
function Login(){
    return (
        <div data-testid="loginPage">
            <LoginForm/>
        </div>
    )
}

function Skemapage(){
    return(
        <div data-testid="skemaPage">
            <Header linkTo="/skema"/>
            <Sidebar/>
            <Skema type="schedule"/>
            <LogoutModal/>
        </div>
    )
}

function AfleveringerPage(){
    return(
        <div data-testid="afleveringerPage">
            <Header linkTo="/skema"/>
            <Sidebar/>
            <Skema type="assignments"/>
            <LogoutModal/>
        </div>
    )
}

function FeedbackTablePage(){
    return(
        <div data-testid="afleveringerPage">
            <Header linkTo="/skema"/>
            <Sidebar/>
            <FeedbackTable/>
            <LogoutModal/>
        </div>
    )
}

function RedigerSkema(){
    return(
        <div data-testid="redigerSkemaPage">
            <Header linkTo="/skema"/>
            <Sidebar/>
            <SkemabrikForm/>
            <LogoutModal/>
        </div>
    )
}

function TurnedInAssignmentsPage(props){
    return(
        <div data-testid="afleveretPage">
            <Header linkTo="/skema"/>
            <Sidebar/>
            <TurnedInAssignmentsTable assignment={props.location.state.assignment}/>
            <LogoutModal/>
        </div>
    )
}

function NoMatch(){
    let location = useLocation();
    return(
        <div data-testid="noMatchPage">
            <Header linkTo="/"/>
            <Sidebar/>
            <NoMatchError location={location.pathname}/>
            <LogoutModal/>
        </div>
    )
}


export default App;