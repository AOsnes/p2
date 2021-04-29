import React, { Component } from 'react';

export default class NoMatchError extends Component {
    render(){
        return(
            <div className={`pageNotFoundContainer textCenter`} data-testid="pageNotFoundContainer">
                <p className= "pageNotFound" data-testid="pageNotFound">404: Siden blev ikke fundet, kunne ikke finde side: <code>{this.props.location}</code></p>
            </div>
        )
    }
}