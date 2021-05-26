import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { UserContext } from '../UserContext';

export default class NoMatchError extends Component {
    static contextType = UserContext;
    render(){
        if(this.context.role === "student")
            return <Redirect push to={"/skema"}/>

        return(
            <div className={`pageNotFoundContainer textCenter`} data-testid="pageNotFoundContainer">
                <p className= "pageNotFound" data-testid="pageNotFound">404: Siden blev ikke fundet, kunne ikke finde side: <code>{this.props.location}</code></p>
            </div>
        )
    }
}