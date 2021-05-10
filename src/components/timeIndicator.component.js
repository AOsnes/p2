import React, { Component } from 'react';

export default class TimeIndicator extends Component {
    constructor(props){
        super(props)
        this.state = {time: Date.now(), show: 1}
    }
     
    calculatePosition(date){
        const startHour = 8; /* Schedule starts at 8 in the morning */
        const totalMinutes = 8*60; /* There is 8 hours on the schedule */
        const hours = date.getHours() - startHour;
        const minutes = date.getMinutes();
        const minutesSinceStartHour = hours*60 + minutes;
        const position = (minutesSinceStartHour / totalMinutes) * 100;
        console.log(position)
        return `${position}%`;
    }

    componentDidMount(){
        /* Before rendering we want find out if we should show the indicator or nah. */
        if(new Date().getHours() < 8){
            this.setState({
                show: 0,
            })
        }
        /* Update time state every 5 minutes, */
        this.interval = setInterval(() =>{
            let currentTime = new Date()
            if(currentTime.getHours() < 8){
                this.setState({
                    show: 0,
                });
            }
            else if (currentTime.getHours() > 15){
                clearInterval(this.interval)
                this.setState({
                    show: 0,
                });
            }
            else {
                this.setState({
                    time: currentTime,
                    show: 1,
                });
        }}, 1000*60*5)
    }

    componentWillUnmount(){
        /* Make sure to stop the timer to avoid memory leakage */
        clearInterval(this.interval)
    }

    render(){
        const style = {
            position: 'absolute',
            top: this.calculatePosition(new Date(this.state.time)),
            opacity: this.state.show
        }

        return(
            <div className="timeIndicator" style={style}></div>
        )
    }
}