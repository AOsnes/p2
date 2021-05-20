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
            file: null
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
        if(this.props.skemabrik.fileId !== null){
           /*  console.log(this.props.skemabrik.subject);
            console.log(this.props.skemabrik.fileId); */
            this.getFile(this.props.skemabrik.fileId);
        }
    }

    getFile(fileId){
        fetch(`http://localhost:5000/download/${fileId}`,{
            method:'GET',
        })
        .then(response => {
            this.setState({file: response});
            console.log(response);
        });
    }

    /* Called from the child component */
    disableModal(){
        this.setState({
            showSkemabrikModal: false
        }, () => {
            document.getElementsByClassName(this.props.type === "schedule" ? 'scheduleContainer' : 'assignmentsContainer')[0].classList.remove('blur-filter')
        })
    }

    /* Whenever the skemabrik is pressed, reverse the state */
    onSkemaClick(e){
        this.setState(prevState => ({
            showSkemabrikModal: !prevState.showSkemabrikModal,
        }), () => {
            this.state.showSkemabrikModal ? document.getElementsByClassName(this.props.type === "schedule" ? 'scheduleContainer' : 'assignmentsContainer')[0].classList.add('blur-filter') : document.getElementsByClassName('scheduleContainer')[0].classList.remove('blur-filter')
        });
    }

    render(){
        const subject = this.props.skemabrik.subject;
        const endTime = new Date(this.props.skemabrik.endTime);
        const description = this.props.skemabrik.description;
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
                    {this.state.showSkemabrikModal ? <SkemabrikModal type={this.props.type} disableModal={this.disableModal} skemabrikContext={this.props.skemabrik} file={this.state.file}/> : null}
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