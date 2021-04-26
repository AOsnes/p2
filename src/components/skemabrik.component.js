import React, { Component } from 'react';
import SkemabrikDetails from './skemabrikDetails.component';

export default class Skemabrik extends Component {
    constructor(props){
        super(props)
        this.state = {
            showSkemabrikDetailsComponent: false,
        };
        this.onSkemaClick = this.onSkemaClick.bind(this);
    }

    /* Beregn hvor stor højde der skal være på elemented ud fra end time - start time,*/
    calculateHeight(startTime, endTime){
        /* This is how long every class is in milliseconds */
        let deltaTime = endTime - startTime;
        
        /* One hour is 100 px, change this to change the size of the classes */
        let scale = 100;
        /* We calculate how many hours the deltaTime translates to and we multiply it with the scale */
        let height = deltaTime / 1000000 / 3.6 * scale;
        return `${height}px`;
    }

    /* Takes a date object and returns a string formatted by HH:MM where H = hours and M = minutes */
    toHHMM(date){
        let hhmm;

        /* 0 will be added before if time is under 10 for both hours and minutes */
        let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let mm = date.getMinutes()  < 10 ? '0' + date.getMinutes() : date.getMinutes()
        hhmm = hh + ':' + mm;
        return hhmm
    }

    onSkemaClick(e){
        this.setState({
            showSkemabrikDetailsComponent: true,
        });
    }

    render(){
        const subject = this.props.skemabrik.subject;
        const endTime = new Date(this.props.skemabrik.endTime);
        const startTime = new Date(this.props.skemabrik.startTime);
        const description = this.props.skemabrik.description;
        const style = {
            height: this.calculateHeight(startTime, endTime),
        }
        return([
            <div key="time" className="gridItem">{this.toHHMM(startTime)}</div>,
            <div key="brik" style={style} className={`skemabrik ${subject}`} onClick={this.onSkemaClick}>
                <p className="skemabrikTitleText">
                    <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo `}/>
                    {subject}
                </p>
                {this.state.showSkemabrikDetailsComponent ? <SkemabrikDetails details={description}/> : null}
            </div>
            ]
        )
    }
}