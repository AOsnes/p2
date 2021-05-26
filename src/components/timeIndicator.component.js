import React, { Component } from 'react';
import calculatePosition from '../utils/calculatePosition';

export default class TimeIndicator extends Component {
    constructor(props){
        super(props)
        this.state = {time: Date.now(), show: 1}
        this.controlIndicaterDisplay = this.controlIndicaterDisplay.bind(this);
    }

    /* Before rendering we want find out if we should show the indicator or not */
    componentDidMount(){
        this.controlIndicaterDisplay();
        /* Update the state every minute */
        this.interval = setInterval(() =>{
            this.controlIndicaterDisplay();
        }, 1000*60);
    }

    /* Helper function used in interval, this function checks if the time is 
    within the 08:00-15:59 */
    controlIndicaterDisplay(){
        let currentTime = new Date();
        //Won't show before 08:00
        if(currentTime.getHours() < 8){
            this.setState({
                show: 0,
            });
        }
        else if (currentTime.getHours() > 15){
            clearInterval(this.interval);
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
    
    /* Make sure to stop the timer to avoid memory leakage */
    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render(){
        const style = {
            top: calculatePosition(new Date(this.state.time), 0),
        }
        if(this.state.show){
            return(
                <div data-testid="timeIndicator" className="timeIndicator" style={style}></div>
            )
        }
        else {
            return null;
        }
    }
}