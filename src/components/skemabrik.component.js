import React, { Component } from 'react';

export default class Skemabrik extends Component {
    render(){
        let subject = this.props.skemabrik.subject;
        return(
            <div className={`skemabrik ${subject}`}>
                <p className="skemabrikText">
                    <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo`}/>
                    {subject}
                </p>
            </div>
        )
    }
}