import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { UserContext } from '../UserContext';
import SkemabrikModal from './skemabrikModal.component';
import DescriptionAlert from './descriptionAlert.component';
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
            redirect: false,
        };
        this.onSkemaClick = this.onSkemaClick.bind(this);
        this.disableModal = this.disableModal.bind(this);
    }

    componentDidMount(){
        if(document.getElementsByClassName('gridContainerFiveDay') || document.getElementsByClassName('gridContainerOneDay')){
            this.setState({
                isLoaded: true,
            })
        }
    }


    /* Called from the child component */
    disableModal(){
        this.setState({
            showSkemabrikModal: false,
            read: true,
        }, () => {
            document.getElementsByClassName(this.props.type === "schedule" ? 'scheduleContainer' : 'assignmentsContainer')[0].classList.remove('blur-filter')
        })
    }

    /* Whenever the skemabrik is pressed, reverse the state */
    onSkemaClick(e){
        if(this.props.type === "assignments" && this.context.role === "teacher"){
            this.setState({
                redirect: '/afleveret',
            })
        }
        this.setState(prevState => ({
            showSkemabrikModal: !prevState.showSkemabrikModal,
        }), () => {
            this.state.showSkemabrikModal ? document.getElementsByClassName(this.props.type === "schedule" ? 'scheduleContainer' : 'assignmentsContainer')[0].classList.add('blur-filter') : document.getElementsByClassName('scheduleContainer')[0].classList.remove('blur-filter')
        });
    }

    render(){
        const id = this.props.skemabrik._id;
        const subject = this.props.skemabrik.subject;
        const description = this.props.skemabrik.description;
        const endTime = new Date(this.props.skemabrik.endTime);
        if(this.state.redirect){
            let assignment = {
                id: id,
                description: description,
                subject: subject,
            }
            return <Redirect push to={{
                pathname: this.state.redirect,
                state: {assignment: assignment}
            }}/>
        }

        let startTime;
        let offset = this.props.type === "assignments" ? 1 : 0
        if(this.props.type === "schedule"){
            startTime = new Date(this.props.skemabrik.startTime)
        } else if(this.props.type === "assignments"){
            startTime =  new Date(this.props.skemabrik.dueDate);
        }

        const style = {
            height: this.props.type === "schedule" ? calculateHeight(startTime, endTime) : "81.25px",
            position: 'absolute',
            top: calculatePosition(startTime, offset),
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
                        {description && !this.state.read ? <DescriptionAlert/> : null}
                </div>,
                document.getElementById(`${this.props.weekday}`))]
            )
        }
        else {
            return null;
        }
    }
}