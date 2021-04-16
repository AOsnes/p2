import React, { Component } from 'react';

export default class NoMatchError extends Component {
    render(){
        return(
            <div className="pageNotFoundContainer" data-testid="pageNotFoundContainer">
                <p className= "pageNotFound" data-testid="pageNotFound">404: Page not found, could not find page: <code>{this.props.location}</code></p>
            </div>
        )
    }
}