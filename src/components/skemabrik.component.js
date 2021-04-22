import React, { Component } from 'react';

export default class Skemabrik extends Component {
    /* Beregn hvor stor højde der skal være på elemented ud fra end time - start time,
    brug derefter denne beregning til at give elemented sin height via style="height: {udregnet højde}" */
    render(){
        let subject = this.props.skemabrik.subject;
        return([
            <div className="gridItem ">TIME</div>,
            <div className={`skemabrik ${subject}`}>
                <p className="skemabrikText">
                    <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo`}/>
                    {subject}
                </p>
            </div>
            ]
        )
    }
}