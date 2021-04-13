import React, { Component } from 'react';

export default class Navbar extends Component {

    render(){
        return (
            <ul className="Navbar" data-testid="Navbar">
                <div className="NavContainer">
                    <li className="navItem">
                        <button className="navButton" id="navLogo" href="#">Skema.dk</button>
                    </li>
                </div>
            </ul>
        );
    }
}