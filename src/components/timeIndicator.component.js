import React, { Component } from 'react';
import calculatePosition from '../utils/calculatePosition';

export default class TimeIndicator extends Component {
    //Initialises states
    constructor(props){
        super(props)
        this.state = {time: Date.now(), show: 1}
        this.controlIndicaterDisplay = this.controlIndicaterDisplay.bind(this);
    }

    //Before rendering we want find out if we should show the indicator or not
    componentDidMount(){
        //Calls helper function
        this.controlIndicaterDisplay();
        //Update time state every minute
        this.interval = setInterval(() =>{
            this.controlIndicaterDisplay();
        }, 1000*60);
    }

    //Helper function used in interval
    controlIndicaterDisplay(){
        let currentTime = new Date();
        //Won't show before 08:00
        if(currentTime.getHours() < 8){
            this.setState({
                show: 0,
            });
        }
        //Won't show after 15:00
        else if (currentTime.getHours() > 15){
            clearInterval(this.interval);
            this.setState({
                show: 0,
            });
        }
        //Will show if between 08:00 and 15:00
        else {
            this.setState({
                time: currentTime,
                show: 1,
            });
        }
    }
    
    // Make sure to stop the timer to avoid memory leakage
    componentWillUnmount(){
        clearInterval(this.interval)
    }

    //Renders the component
    render(){
        //Styles component
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