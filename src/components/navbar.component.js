import React, { Component } from 'react';

export default class Navbar extends Component {

    render(){
        return (
            <ul className="Navbar">
                <div className="NavContainer">
                    <li className="navItem">
                        <button className="navButton" href="#">Home</button>
                    </li>
                    <li className="navItem">
                        <button className="navButton" href="#">Calendar</button>
                    </li>
                </div>
            </ul>
        );
    }
}