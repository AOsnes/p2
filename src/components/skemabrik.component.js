import React, { Component } from 'react';
import SkemabrikModal from './skemabrikModal.component';
import DescriptionAlert from './descriptionAlert.component';
import { UserContext } from '../UserContext';
import ReactDOM from 'react-dom';
import calculatePosition from '../utils/calculatePosition';
import calculateHeight from '../utils/calculateHeight';

export default class Skemabrik extends Component {
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {
            showSkemabrikModal: false,
            isLoaded: false,
            read: false,
        };
        this.onSkemaClick = this.onSkemaClick.bind(this);
        this.disableModal = this.disableModal.bind(this);
    }

    /* Called from the child component */
    disableModal(){
        this.setState({
            showSkemabrikModal: false
        }, () => {
            document.getElementsByClassName('scheduleContainer')[0].classList.remove('blur-filter')
        })
    }

    /* Whenever the skemabrik is pressed, reverse the state */
    onSkemaClick(e){
        this.setState(prevState => ({
            showSkemabrikModal: !prevState.showSkemabrikModal,
        }), () => {
            this.state.showSkemabrikModal ? document.getElementsByClassName('scheduleContainer')[0].classList.add('blur-filter') : document.getElementsByClassName('scheduleContainer')[0].classList.remove('blur-filter')
        });
        
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
        const description = this.props.skemabrik.description;
        let startTime;
        if(this.props.skemabrik.startTime){
            startTime = new Date(this.props.skemabrik.startTime)
        } else {
            startTime =  new Date(this.props.skemabrik.dueDate);
        }
        const style = {
            height: calculateHeight(startTime, endTime),
            position: 'absolute',
            top: calculatePosition(startTime, 0),
        }
        if(this.state.isLoaded){
            return([
                <div key="modal">
                    {this.state.showSkemabrikModal ? <SkemabrikModal type={this.props.type} disableModal={this.disableModal} skemabrikContext={this.props.skemabrik}/> : null}
                </div>,
                ReactDOM.createPortal(
                    <div key={"brik"} style={style} className={`skemabrik ${subject}`} onClick={this.onSkemaClick}>
                        <p className="skemabrikTitleText">
                            <img src={`schedulePictograms/${subject}.png`} className="skemabrikIcon" alt={`${subject} Logo `}/>
                            {subject}
                        </p>
                        {description ? <DescriptionAlert/> : null}
                </div>,
                document.getElementById(`${this.props.weekday}`))]
            )
        }
        else {
            return null;
        }
    }
}