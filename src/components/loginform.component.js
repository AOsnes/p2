import React, { Component } from 'react';

export default class LoginForm extends Component {
    render(){
        return(
            <form className="loginForm">
                <fieldset className="loginFieldset">
                    <div class="loginInputContainer">
                        <i class="icon"></i>
                        <input className="loginInput" type="text" placeholder="Brugernavn"/>
                    </div>
                    <div class="loginInputContainer">
                        <i class="icon"></i>
                        <input className="loginInput" type="password" placeholder="Adgangskode"/>
                    </div>
                    <input className="loginButton" type="submit" value="Login"/><br></br>
                </fieldset>
            </form>
            
        );
    }
}