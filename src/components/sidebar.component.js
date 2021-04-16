import React, { Component } from 'react';
import {Link} from 'react-router-dom';
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
                        <Link className="sideButton" to="/skema"> <AiOutlineCalendar className="sideIcon"/>Skema</Link>
                    </li>
                    <li className="sideItem">
                        <Link className="sideButton" to="/afleveringer"> <FiBook className="sideIcon"/>Afleveringer</Link>
                    </li>
                    <UserContext.Consumer>
                        {user => {
                            if(user.role === 'teacher'){
                                return(
                                        <li className="sideItem" data-testid="redigerSkema">
                                            <Link className="sideButton" to="/skema/create"> <BiEdit className="sideIcon"/>Rediger Skema</Link>
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