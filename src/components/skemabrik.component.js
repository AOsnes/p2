import React, { Component } from 'react';

export default class Skemabrik extends Component {
    render(){
        let subject = this.props.skemabrik.subject;
        return(
            <div className={subject}>
                <p>{subject}</p>
            </div>
        )
    }
}