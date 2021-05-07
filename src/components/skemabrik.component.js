import React, { Component } from 'react';
import SkemabrikModal from './skemabrikModal.component';
import { UserContext } from '../UserContext';
import ReactDOM from 'react-dom';

export default class Skemabrik extends Component {
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {
            showSkemabrikModal: false,
            isLoaded: false,
        };
        this.onSkemaClick = this.onSkemaClick.bind(this);
        this.disableModal = this.disableModal.bind(this);
        this.toHHMM = this.toHHMM.bind(this);
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

    /* Called from the child component */
    disableModal(){
        this.setState({
            showSkemabrikModal: false
        })
        document.getElementsByClassName('skemaContainer')[0].classList.remove('blur-filter')
    }

    /* Whenever the skemabrik is pressed, reverse the state */
    onSkemaClick(e){
        this.setState(prevState => ({
            showSkemabrikModal: !prevState.showSkemabrikModal
        }));
        this.state.showSkemabrikModal ?  document.getElementsByClassName('skemaContainer')[0].classList.remove('blur-filter') : document.getElementsByClassName('skemaContainer')[0].classList.add('blur-filter')
    }

    calculatePosition(date){
        let deltaHours = date.getHours() - 8;
        let minutesPercentage = (100 - (((8*60 - ((deltaHours*60 + date.getMinutes())))/(8*60))*100));
        return `${minutesPercentage}%`;
    }

    componentDidMount(){
        if(document.getElementsByClassName('gridContainerFiveDay') || document.getElementsByClassName('gridContainerOneDay')){
            this.setState({
                isLoaded: true,
            })
        }
    }

    render(){
        const subject = this.props.skemabrik.subject;
        const endTime = new Date(this.props.skemabrik.endTime);
        const startTime = new Date(this.props.skemabrik.startTime);
        const style = {
            height: this.calculateHeight(startTime, endTime),
            position: 'absolute',
            top: this.calculatePosition(startTime),
        }
        if(this.props.isToggleOn === true && this.state.isLoaded){
            return([
                <div>
                    {this.state.showSkemabrikModal ? <SkemabrikModal disableModal={this.disableModal} toHHMM={this.toHHMM} skemabrikContext={this.props.skemabrik}/> : null} 
                </div>,
                ReactDOM.createPortal(
                <div key="brik" style={style} className={`skemabrik ${subject}`} onClick={this.onSkemaClick}>
                    <p className="skemabrikTitleText">
                        <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo `}/>
                        {subject}
                    </p>
                </div>,
                document.getElementById(`${this.props.weekday}`))]
            )
        }
        else if (this.context.role === "teacher" && this.state.isLoaded){
                return( ReactDOM.createPortal(
                    <div key="brik" style={style} className={`skemabrik ${subject}`} onClick={this.onSkemaClick} >
                        <p className="skemabrikTitleText">
                            <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo `}/>
                            {subject}
                        </p>
                        {this.state.showSkemabrikModal ? <SkemabrikModal disableModal={this.disableModal} skemabrikContext={this.props.skemabrik}/> : null}
                    </div>,
                    document.getElementById(`${this.props.weekday}`)
                )
            )
        }
        else {
            return null;
        }
    }
}