import React, { Component } from 'react';
import { AiOutlineUser, AiOutlineKey } from 'react-icons/ai'

export default class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {username: '', password: ''};

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target.name;
        const value = event.target.value;
        console.log(value);

        this.setState({
            [target]: value
        });
    }
    
    
    handleSubmit(event){
        //TODO: fetch url should be in .env
        //TODO: handle response
        console.log(this.state)
        fetch("http://localhost:5000/login",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state),
        });
        event.preventDefault();
    }
    
    render(){
        return(
            <form className="loginForm" onSubmit={this.handleSubmit}>
                <fieldset className="loginFieldset">
                    <h2 id="loginHeader">Velkommen</h2>
                    <div className="loginInputContainer">
                        <AiOutlineUser className="icon"/>

                        <input className="loginInput" type="text" placeholder="Brugernavn" name="username" onChange={this.handleInputChange}/>
                    </div>
                    <div className="loginInputContainer">
                        <AiOutlineKey className="icon"/>
                        <input className="loginInput" type="password" placeholder="Adgangskode" name="password" onChange={this.handleInputChange}/>
                    </div>
                    <input className="loginButton" type="submit" value="Log ind"/><br></br>
                </fieldset>
            </form>
            
        );
    }
}