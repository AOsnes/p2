import React, { Component } from 'react';

export default class Skemabrik extends Component {

    calculateHeight(){
        return '100px'
    }
    /* Beregn hvor stor højde der skal være på elemented ud fra end time - start time,
    brug derefter denne beregning til at give elemented sin height via style="height: {udregnet højde}" */
    render(){
        const subject = this.props.skemabrik.subject;
        const endTime = this.props.skemabrik.endTime;
        const startTime = this.props.skemabrik.startTime;
        const style = {
            height: this.calculateHeight(startTime, endTime),
        }
        return([
            <div className="gridItem ">TIME</div>,
            <div style={style} className={`skemabrik ${subject}`}>
                <p className="skemabrikText">
                    <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo `}/>
                    {subject}
                </p>
            </div>
            ]
        )
    }
}