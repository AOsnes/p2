import React, { Component } from 'react';

export default class TimeIndicator extends Component {
    constructor(props){
        super(props)
        this.state = {time: Date.now()}
    }
     
    calculatePosition(date){
        const startHour = 8; /* Schedule starts at 8 in the morning */
        const totalMinutes = 8*60; /* There is 8 hours on the schedule */
        const hours = date.getHours() - startHour;
        const minutes = date.getMinutes();
        const minutesSinceStartHour = hours*60 + minutes;
        const position = (minutesSinceStartHour / totalMinutes) * 100;

        return `${position}%`;
    }

    componentDidMount(){
        this.interval = setInterval(() =>
            this.setState({
                time: Date.now()
            },() =>{
                
        }), 1000*60*5); /* Update every 5 minutes */
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render(){
        const style = {
            position: 'absolute',
            top: this.calculatePosition(new Date(this.state.time)),
        }

        return(
            <div className="timeIndicator" style={style}></div>
        )
    }
}