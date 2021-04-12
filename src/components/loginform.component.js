import React, { Component } from 'react';
import { AiOutlineUser, AiOutlineKey } from 'react-icons/ai'

export default class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {username: '', password: ''};

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
        //TODO: fetch url should be in .env
        //TODO: handle response
        fetch("http://localhost:5000/login",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state),
        })
        .then(response => response.json())
        .then(response => {
            //CHECK IF WE GOT ID OR ERROR
            if(response.id){
                console.log("we in bois");
                document.cookie = `id=${response.id};Secure=true`;
                console.log(document.cookie);
            }
            else console.log("Sadge");
        });
        event.preventDefault();
    }

    render(){
        return(
            <form className="loginForm" data-testid="loginForm" onSubmit={this.handleSubmit}>
                <fieldset className="loginFieldset">
                    <h2 id="loginHeader">Velkommen</h2>
                    <div className="loginInputContainer">
                        <AiOutlineUser className="loginIcon"/>
                        <input className="loginInput" type="text" placeholder="Brugernavn" name="username" onChange={this.handleInputChange}/>
                    </div>
                    <div className="loginInputContainer">
                        <AiOutlineKey className="loginIcon"/>
                        <input className="loginInput" type="password" placeholder="Adgangskode" name="password" onChange={this.handleInputChange}/>
                    </div>
                    <input className="loginButton" type="submit" value="Log ind"/><br></br>
                </fieldset>
            </form>
            
        );
    }
}