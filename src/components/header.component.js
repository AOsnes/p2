import React, { Component } from 'react';

export default class Header extends Component {

    render(){
        return (
            <ul className="header" data-testid="header">
                <div className="headerContainer">
                    <li className="headerItem">
                        <button className="headerButton" id="headerLogo" href="#">Skema.dk</button>
                    </li>
                </div>
            </ul>
        );
    }
}