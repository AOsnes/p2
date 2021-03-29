import React, { Component } from 'react';
import { AiOutlineUser, AiOutlineKey } from 'react-icons/ai'

export default class LoginForm extends Component {
    render(){
        return(
            <form className="loginForm">
                <fieldset className="loginFieldset">
                    <h2 id="loginHeader">Velkommen</h2>
                    <div className="loginInputContainer">
                        <AiOutlineUser className="icon"/>

                        <input className="loginInput" type="text" placeholder="Brugernavn"/>
                    </div>
                    <div className="loginInputContainer">
                        <AiOutlineKey className="icon"/>
                        <input className="loginInput" type="password" placeholder="Adgangskode"/>
                    </div>
                    <input className="loginButton" type="submit" value="Log ind"/><br></br>
                </fieldset>
            </form>
            
        );
    }
}