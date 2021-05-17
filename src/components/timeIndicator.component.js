import React, { Component } from 'react';
import calculatePosition from '../utils/calculatePosition';

export default class TimeIndicator extends Component {
    constructor(props){
        super(props)
        this.state = {time: Date.now(), show: 1}
        this.controlIndicaterDisplay = this.controlIndicaterDisplay.bind(this);
    }

    componentDidMount(){
        /* Before rendering we want find out if we should show the indicator or nah. */
        this.controlIndicaterDisplay();
        /* Update time state every 5 minutes, */
        this.interval = setInterval(() =>{
            this.controlIndicaterDisplay();
        }, 1000*60*5)
    }

    /* Helper function used in interval */
    controlIndicaterDisplay(){
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
        }
    }

    componentWillUnmount(){
        /* Make sure to stop the timer to avoid memory leakage */
        clearInterval(this.interval)
    }

    render(){
        const style = {
            position: 'absolute',
            top: calculatePosition(new Date(this.state.time), 0),
            opacity: this.state.show
        }

        return(
            <div data-testid="timeIndicator" className="timeIndicator" style={style}></div>
        )
    }
}