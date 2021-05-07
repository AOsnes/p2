import React, { Component } from 'react';

export default class TimeIndicator extends Component {
     
    calculatePosition(date){
        let deltaHours = date.getHours() - 8;
        let minutesPercentage = (100 - (((8*60 - ((deltaHours*60 + date.getMinutes())))/(8*60))*100));
        console.log(minutesPercentage);
        return `${minutesPercentage}%`;
    }

    render(){
        const currentTime = new Date();
        const style = {
            position: 'absolute',
            top: this.calculatePosition(currentTime),
        }

        return(
            <div className="timeIndicator" style={style}></div>
        )
    }
}