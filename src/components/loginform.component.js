import React, { Component } from 'react';
import { AiOutlineUser, AiOutlineKey } from 'react-icons/ai'
import { Redirect } from 'react-router';
import { updateIdValue, updateNameValue, updateRoleValue } from '../UserContext';

export default class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {username: '', password: '', redirect: "/skema"};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target.name;
        const value = event.target.value;

        this.setState({
            [target]: value
        });
    }
    
    handleSubmit(event){
        event.preventDefault();
        fetch("http://localhost:5000/login",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state, (key, val) =>{
                if(key === 'redirect'){
                    return undefined
                } else {
                    return val
                }
            }),
        })
        .then(response => response.json())
        .then(response => {
            //CHECK IF WE GOT ID OR ERROR
            if(response.id){
                document.cookie = `id=${response.id};Secure=true`;
                document.cookie = `role=${response.role};Secure=true`;
                document.cookie = `name=${response.name};Secure=true`;
                this.setState({
                    redirect: "/skema"
                })
                window.location.reload(false);
            } else {
                alert("Forkert brugernavn eller adgangskode");
                document.getElementsByClassName("loginInput")[0].classList.add("loginInputWrong");
                document.getElementsByClassName("loginInput")[1].classList.add("loginInputWrong");
            }
        });
    }

    render(){
        if(document.cookie){
            if(updateIdValue(document.cookie) !== undefined && updateNameValue(document.cookie) !== undefined && updateRoleValue(document.cookie) !== undefined){
                return <Redirect push to={this.state.redirect}/>
            }
        }
        return(
            <form className="loginForm" data-testid="loginForm" onSubmit={this.handleSubmit}>
                <fieldset className="loginFieldset">
                    <div className="loginHeader">
                        <svg className="loginLogo" width="46" height="47" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M53.4312 56.8975H2.56881C1.02752 56.8975 0 55.8723 0 54.8471V2.56295C0 1.02518 1.02752 0 2.56881 0H53.4312C54.9725 0 56 1.02518 56 2.56295V54.8471C56 55.8723 54.9725 56.8975 53.4312 56.8975Z" fill="url(#paint0_linear)"/><path d="M23.6331 20.5036H10.2753C8.73398 20.5036 8.22021 19.4784 8.22021 18.4532V10.2518C8.22021 9.2266 8.73398 8.20142 10.2753 8.20142H23.6331C24.6606 8.20142 25.6881 9.2266 25.6881 10.2518V18.4532C25.6881 19.4784 24.6606 20.5036 23.6331 20.5036ZM23.6331 48.696H10.2753C8.73398 48.696 8.22021 47.6708 8.22021 46.6457V10.2518C8.22021 9.2266 8.73398 8.20142 10.2753 8.20142H23.6331C24.6606 8.20142 25.6881 9.2266 25.6881 10.2518V46.6457C25.6881 47.6708 24.6606 48.696 23.6331 48.696ZM46.2386 30.7554H32.367C31.3395 30.7554 30.312 29.7302 30.312 28.705V10.2518C30.312 9.2266 31.3395 8.20142 32.367 8.20142H46.2386C47.2661 8.20142 47.7798 9.2266 47.7798 10.2518V28.705C47.7798 29.7302 47.2661 30.7554 46.2386 30.7554ZM46.2386 41.5H32.367C30.8257 41.5 30.312 40.0252 30.312 39V28.705C30.312 27.6798 30.8257 30.7554 32.367 30.7554H46.2386C47.2661 30.7554 47.7798 27.6798 47.7798 28.705V39C47.7798 40.0252 47.2661 41.5 46.2386 41.5Z" fill="#F4F4F4"/><defs><linearGradient id="paint0_linear" x1="0" y1="28.5" x2="56" y2="28.5" gradientUnits="userSpaceOnUse"><stop stopColor="#0075FF" stopOpacity="0.8"/><stop offset="1" stopColor="#00ADFF"/></linearGradient></defs></svg>
                        <h2 className="loginName">Skema.dk</h2>
                    </div>
                    <div className="loginInputContainer">
                        <AiOutlineUser className="loginIcon"/>
                        <input className="loginInput" type="text" placeholder="Brugernavn" name="username" onChange={this.handleInputChange}/>
                    </div>
                    <div className="loginInputContainer">
                        <AiOutlineKey className="loginIcon"/>
                        <input className="loginInput" type="password" placeholder="Adgangskode" name="password" onChange={this.handleInputChange}/>
                    </div>
                    <input disabled={!(this.state.username && this.state.password)} className="loginButton" type="submit" value="Log ind"/><br></br>
                </fieldset>
            </form>
            
        );
    }
}