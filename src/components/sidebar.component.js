import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { UserContext } from '../UserContext';
import { Redirect } from 'react-router';
import { updateIdValue, updateNameValue, updateRoleValue } from '../UserContext';

export default class Sidebar extends Component {
    render() {
        if(updateIdValue(document.cookie) === undefined || updateNameValue(document.cookie) === undefined || updateRoleValue(document.cookie) === undefined){
            return <Redirect to={"/"}/>
        }
        return (
            <ul className="sidebar" data-testid="sidebar">
                <div className="sideContainer">
                    <li className="sideItem">
                        <Link className="sideButton" data-testid="sideButton" to="/skema">
                            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M50 15L12 15" stroke="#0075FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 19L11 19" stroke="#0075FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M51 23L12 23" stroke="#0075FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M49.0833 10.3333H12.9167C10.0632 10.3333 7.75 12.6465 7.75 15.5V51.6666C7.75 54.5201 10.0632 56.8333 12.9167 56.8333H49.0833C51.9368 56.8333 54.25 54.5201 54.25 51.6666V15.5C54.25 12.6465 51.9368 10.3333 49.0833 10.3333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M41.3333 5.16669V15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M20.6667 5.16669V15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M7.75 25.8333H54.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 29V52" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 29L12 52" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M46 29L14 29" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M47 53H15" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M22 41L40 41" stroke="white" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <p id="sideButtonicon">Skema</p>
                        </Link>
                    </li>
                    <li className="sideItem">
                        <Link className="sideButton" data-testid="sideButton" to="/afleveringer">
                            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M50 44V56" stroke="#0075FF" strokeWidth="5" /> <path d="M45 50L17 50" stroke="#0075FF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> <path d="M45 50L17 50" stroke="#0075FF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> <path d="M45 50L17 50" stroke="#0075FF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16.7916 5.16669H51.6666V56.8334H16.7916C15.0788 56.8334 13.4361 56.1529 12.2249 54.9418C11.0137 53.7306 10.3333 52.0879 10.3333 50.375V11.625C10.3333 9.91216 11.0137 8.26946 12.2249 7.05829C13.4361 5.84712 15.0788 5.16669 16.7916 5.16669Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M10.3333 50.375C10.3333 48.6622 11.0137 47.0195 12.2249 45.8083C13.4361 44.5971 15.0788 43.9167 16.7916 43.9167H51.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 11L16 39" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M46 10V38" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 11H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 38H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 30H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 21H46" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 42V45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M13 41V44" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M49 40V43" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 40V43" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 7V10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 38H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> </svg>
                            <p id="sideItemicon" >Afleveringer</p>
                        </Link>
                    </li>
                    <UserContext.Consumer>
                        {user => {
                            if (user.role === 'teacher') {
                                return (
                                    <li className="sideItem" data-testid="redigerSkema">
                                        <Link className="sideButton" to="/skema/create"> <BiEdit className="sideIcon" />Rediger Skema</Link>
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