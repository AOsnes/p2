import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';

export default class Header extends Component {
    constructor(props){
        super(props);
        this.standby = this.standby.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.toggleFocus = this.toggleFocus.bind(this);
        this.unFocus = this.unFocus.bind(this);
    }
    standby() {
        document.getElementById("headerProfilePicture").src="placeholderProfilePicture.png";
    }
    
    logoutHandler(){
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
          deleteCookie(cookies[i].split("=")[0]);
        }
        window.location.reload(false);
    }

    toggleFocus(){
        document.getElementById("dropdownMenuId").classList.toggle("showMenu");
        document.getElementById("dropdownArrowId").classList.toggle("showArrow");
    }

    unFocus() {
        if (document.getElementById("dropdownArrowId").classList.contains('showArrow')) {
            document.getElementById("dropdownArrowId").classList.remove('showArrow');
        }
        if (document.getElementById("dropdownMenuId").classList.contains('showMenu')) {
            document.getElementById("dropdownMenuId").classList.remove('showMenu');
        }
    }

    render(){
        return (
            <ul className="header" data-testid="header">
                <div className="headerContainer">
                    <li className="headerItem">
                        <Link className="headerButton" data-testid="headerButton" to={this.props.linkTo}>
                            <svg className="headerImage" width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M53.4312 56.8975H2.56881C1.02752 56.8975 0 55.8723 0 54.8471V2.56295C0 1.02518 1.02752 0 2.56881 0H53.4312C54.9725 0 56 1.02518 56 2.56295V54.8471C56 55.8723 54.9725 56.8975 53.4312 56.8975Z" fill="url(#paint0_linear)"/><path d="M23.6331 20.5036H10.2753C8.73398 20.5036 8.22021 19.4784 8.22021 18.4532V10.2518C8.22021 9.2266 8.73398 8.20142 10.2753 8.20142H23.6331C24.6606 8.20142 25.6881 9.2266 25.6881 10.2518V18.4532C25.6881 19.4784 24.6606 20.5036 23.6331 20.5036ZM23.6331 48.696H10.2753C8.73398 48.696 8.22021 47.6708 8.22021 46.6457V10.2518C8.22021 9.2266 8.73398 8.20142 10.2753 8.20142H23.6331C24.6606 8.20142 25.6881 9.2266 25.6881 10.2518V46.6457C25.6881 47.6708 24.6606 48.696 23.6331 48.696ZM46.2386 30.7554H32.367C31.3395 30.7554 30.312 29.7302 30.312 28.705V10.2518C30.312 9.2266 31.3395 8.20142 32.367 8.20142H46.2386C47.2661 8.20142 47.7798 9.2266 47.7798 10.2518V28.705C47.7798 29.7302 47.2661 30.7554 46.2386 30.7554ZM46.2386 41.5H32.367C30.8257 41.5 30.312 40.0252 30.312 39V28.705C30.312 27.6798 30.8257 30.7554 32.367 30.7554H46.2386C47.2661 30.7554 47.7798 27.6798 47.7798 28.705V39C47.7798 40.0252 47.2661 41.5 46.2386 41.5Z" fill="#F4F4F4"/><defs><linearGradient id="paint0_linear" x1="0" y1="28.5" x2="56" y2="28.5" gradientUnits="userSpaceOnUse"><stop stopColor="#0075FF" stopOpacity="0.8"/><stop offset="1" stopColor="#00ADFF"/></linearGradient></defs></svg>
                            <p id="headerLogoName">Skema.dk</p>
                        </Link>
                    </li>
                    <UserContext.Consumer>
                        {user => {
                            if(user.name){
                                return(
                                    <div className="headerProfileContainer">
                                        <li className="headerItem">
                                            <p id="headerProfileName">{user.name}</p>
                                        </li>
                                        <li className="headerItem">
                                            <Link className="dropdownButton" onClick={this.toggleFocus} onBlur={this.unFocus} to="#">
                                                <img id="headerProfilePicture" src="profilePicture.jpg" onError={this.standby} alt="profilBillede" width="75" height="75"></img>
                                                <div className="dropdownArrow" id="dropdownArrowId"></div>
                                                <div className="dropdownMenu" id="dropdownMenuId">
                                                    <ul>
                                                        <li onClick={this.logoutHandler} className={`logoutButton ${user.role}`}>Log ud</li>
                                                    </ul>
                                                </div>
                                            </Link>
                                        </li>
                                    </div>
                                );
                            } 
                        }}
                    </UserContext.Consumer>
                </div>
            </ul>
        );
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

