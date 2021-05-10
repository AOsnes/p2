import { Component } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default class LogoutModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {display: false}
        
        this.toggleDisplay = this.toggleDisplay.bind(this);
    }
    logoutHandler(){
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
          deleteCookie(cookies[i].split("=")[0]);
        }
        window.location.reload(false);
    }
    toggleDisplay(event){
        event.preventDefault()
        this.setState(prevState => ({
            display: !prevState.display
        }))
    }
    
    render(){
        const user = this.context;
        return(
            <Link className="dropdownButton" onClick={this.toggleDisplay} onBlur={this.unFocus} to="#">
                <div className={this.state.display ? "dropdownArrow showArrow": "dropdownArrow"} id="dropdownArrowId"></div>
                <div className={this.state.display ? "dropdownMenu showMenu" : "dropdownMenu"} id="dropdownMenuId">
                    <ul>
                        <li onClick={this.logoutHandler} className={`logoutButton ${user.role}`}>Log ud</li>
                    </ul>
                </div>
            </Link>
        )
    }
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}

function setCookie(name, value, expirydays) {
    let d = new Date();
    d.setTime(d.getTime() + (expirydays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}