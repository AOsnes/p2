import './App.css';
import React from 'react';
import {UserContext} from './UserContext';

import Navbar from "./components/navbar.component";
import ClassForm from "./components/classform.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";

class App extends React.Component{
    render(){
        const signedInUser = 'Teacher';
        return (
            <div className="App">
                <Navbar/>
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
