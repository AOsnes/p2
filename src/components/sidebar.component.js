import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { UserContext } from '../UserContext';
import { Redirect } from 'react-router';
import { updateIdValue, updateNameValue, updateRoleValue } from '../UserContext';

export default class Sidebar extends Component {
    static contextType = UserContext;
    render() {
        /* Determines identity colour depending on if user is pupil or teacher */
        let identityColour = "#fff";
        if (this.context.role) {
            identityColour = this.context.role === "teacher" ? "#00CC00" : "#0075FF";
        }

        /* If you are not logged in, you will be redirected out of the website, when clicking sidebar buttons */
        if(updateIdValue(document.cookie) === undefined || updateNameValue(document.cookie) === undefined || updateRoleValue(document.cookie) === undefined){
            return <Redirect to={"/"}/>
        }
        return (
            <ul className="sidebar" data-testid="sidebar">
                <div className="sideContainer">
                    <li className="sideItem">
                        <Link className="sideButton" data-testid="sideButton" to="/skema">
                            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M50 15L12 15" stroke={identityColour} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 19L11 19" stroke={identityColour} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M51 23L12 23" stroke={identityColour} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M49.0833 10.3333H12.9167C10.0632 10.3333 7.75 12.6465 7.75 15.5V51.6666C7.75 54.5201 10.0632 56.8333 12.9167 56.8333H49.0833C51.9368 56.8333 54.25 54.5201 54.25 51.6666V15.5C54.25 12.6465 51.9368 10.3333 49.0833 10.3333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M41.3333 5.16669V15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M20.6667 5.16669V15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M7.75 25.8333H54.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 29V52" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 29L12 52" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M46 29L14 29" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M47 53H15" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /> <path d="M22 41L40 41" stroke="white" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <p id="sideButtonicon">Skema</p>
                        </Link>
                    </li>
                    <li className="sideItem">
                        <Link className="sideButton" data-testid="sideButton" to="/afleveringer">
                            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M50 44V56" stroke={identityColour} strokeWidth="5" /> <path d="M45 50L17 50" stroke={identityColour} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> <path d="M45 50L17 50" stroke={identityColour} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> <path d="M45 50L17 50" stroke={identityColour} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16.7916 5.16669H51.6666V56.8334H16.7916C15.0788 56.8334 13.4361 56.1529 12.2249 54.9418C11.0137 53.7306 10.3333 52.0879 10.3333 50.375V11.625C10.3333 9.91216 11.0137 8.26946 12.2249 7.05829C13.4361 5.84712 15.0788 5.16669 16.7916 5.16669Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M10.3333 50.375C10.3333 48.6622 11.0137 47.0195 12.2249 45.8083C13.4361 44.5971 15.0788 43.9167 16.7916 43.9167H51.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 11L16 39" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M46 10V38" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 11H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 38H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 30H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 21H46" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 42V45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M13 41V44" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M49 40V43" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 40V43" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M50 7V10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 38H47" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> </svg>
                            <p id="sideItemicon" >Afleveringer</p>
                        </Link>
                    </li>
                    <UserContext.Consumer>
                        {user => {
                            if (user.role === 'teacher') {
                                return (
                                    <li key="redigerSkema" className="sideItem" data-testid="redigerSkema">
                                        <Link className="sideButton" to="/redigerSkema"> 
                                            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M57.5085 3.63578C57.3316 3.44135 57.117 3.28482 56.8779 3.17564C56.6387 3.06646 56.3799 3.0069 56.1171 3.00057C55.8543 2.99423 55.5929 3.04124 55.3488 3.13876C55.1047 3.23629 54.8828 3.38229 54.6967 3.56797L53.1988 5.05863C53.0172 5.24029 52.9153 5.4866 52.9153 5.74341C52.9153 6.00023 53.0172 6.24654 53.1988 6.4282L54.572 7.79898C54.662 7.88942 54.769 7.96118 54.8868 8.01014C55.0046 8.05911 55.131 8.08432 55.2586 8.08432C55.3862 8.08432 55.5125 8.05911 55.6303 8.01014C55.7482 7.96118 55.8552 7.88942 55.9452 7.79898L57.4056 6.34586C58.1442 5.60839 58.2133 4.40714 57.5085 3.63578ZM50.1702 8.08597L28.3104 29.9071C28.1778 30.0391 28.0815 30.203 28.0307 30.383L27.0195 33.3946C26.9953 33.4763 26.9936 33.563 27.0146 33.6456C27.0355 33.7282 27.0784 33.8037 27.1387 33.8639C27.1989 33.9242 27.2744 33.9671 27.357 33.9881C27.4396 34.009 27.5263 34.0073 27.608 33.9831L30.6172 32.972C30.7972 32.9211 30.9611 32.8248 31.0931 32.6922L52.9142 10.83C53.1161 10.6259 53.2293 10.3505 53.2293 10.0634C53.2293 9.7764 53.1161 9.50095 52.9142 9.29691L51.7093 8.08597C51.505 7.88225 51.2283 7.76785 50.9398 7.76785C50.6513 7.76785 50.3745 7.88225 50.1702 8.08597Z" fill="#00CC00"/>
                                                <path d="M48.9709 20.8885L34.2107 35.6777C33.6403 36.2496 32.9391 36.6739 32.1679 36.9141L29.0316 37.9639C28.2872 38.1741 27.5003 38.1821 26.7519 37.9869C26.0035 37.7918 25.3207 37.4006 24.7738 36.8537C24.2269 36.3068 23.8357 35.6239 23.6405 34.8755C23.4454 34.1271 23.4533 33.3402 23.6635 32.5959L24.7134 29.4595C24.9528 28.6885 25.3763 27.9874 25.9473 27.4167L40.7365 12.6541C40.872 12.5187 40.9644 12.3462 41.0019 12.1583C41.0394 11.9703 41.0203 11.7755 40.9471 11.5985C40.8738 11.4214 40.7497 11.2701 40.5905 11.1635C40.4312 11.057 40.2439 11.0001 40.0523 11H14.7812C12.9828 11 11.2579 11.7145 9.98618 12.9862C8.71445 14.2579 8 15.9828 8 17.7812V46.8438C8 48.6422 8.71445 50.3671 9.98618 51.6388C11.2579 52.9106 12.9828 53.625 14.7812 53.625H43.8438C45.6422 53.625 47.3671 52.9106 48.6388 51.6388C49.9106 50.3671 50.625 48.6422 50.625 46.8438V21.5727C50.6249 21.3811 50.568 21.1938 50.4615 21.0345C50.3549 20.8753 50.2036 20.7512 50.0265 20.6779C49.8495 20.6047 49.6547 20.5856 49.4667 20.6231C49.2788 20.6606 49.1063 20.753 48.9709 20.8885Z" fill="white"/>
                                            </svg>
                                            <p id="sideItemicon" >Opret Time</p>
                                        </Link>
                                    </li>
                                )
                            } else {
                                return (
                                    <li key="redigerSkema" className="sideItem" data-testid="redigerSkema">
                                        <Link className="sideButton" data-testid="sideButton" to="/feedback">
                                        <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="44" height="54" rx="10" fill="white"/>
                                            <rect x="5" y="11" width="32" height="3" rx="4" fill="#0075FF"/>
                                            <rect x="5" y="26" width="32" height="3" rx="4" fill="#0075FF"/>
                                            <rect x="5" y="41" width="16" height="3" rx="4" fill="#0075FF"/>
                                        </svg>
                                            <p id="sideItemicon">Feedback</p>
                                        </Link>
                                    </li>
                                )
                            }
                        }}
                    </UserContext.Consumer>
                </div>
            </ul>
        );
    }
}