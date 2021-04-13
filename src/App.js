import './App.css';
import React from 'react';
import {UserContext} from './UserContext';

import Header from "./components/header.component";
import ClassForm from "./components/classform.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";

class App extends React.Component{
    static contextType = UserContext;
    render(){
        let signedInUser = this.context.role;
        return (
            <div className="App">
                <Header/>
                <UserContext.Provider value={signedInUser}>
                    <Sidebar/>
                </UserContext.Provider>
                <LoginForm/>
                <ClassForm/>
            </div>
        );
    }
}

export default App;
