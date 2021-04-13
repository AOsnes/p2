import React, { Component } from 'react';
import {AiOutlineCalendar} from'react-icons/ai'
import {FiBook} from 'react-icons/fi';
import {BiEdit} from 'react-icons/bi';
import {UserContext} from '../UserContext';

export default class Sidebar extends Component {
    render(){
        return(
            <ul className="sidebar" data-testid="sidebar">
                <div className="sideContainer">
                    <li className="sideItem">
                        <button className="sideButton" href="#"> <AiOutlineCalendar className="sideIcon"/> Skema</button>
                    </li>
                    <li className="sideItem">
                        <button className="sideButton" href="#"> <FiBook className="sideIcon"/>Afleveringer</button>
                    </li>

                    <UserContext.Consumer>
                        {user => {
                            if(user === 'teacher'){
                                return(
                                        <li className="sideItem">
                                        <button className="sideButton" href="#"> <BiEdit className="sideIcon"/> Lav Skema</button>
                                        </li>
                                );
                            }
                        }}
                    </UserContext.Consumer>
                </div>
            </ul>
        );
    }
}