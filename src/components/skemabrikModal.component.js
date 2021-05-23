import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { UserContext } from "../UserContext";
import toHHMM from '../utils/toHHMM';
import isValidDate from '../utils/isValidDate';
import EditLessonModal from './editLessonModal.component';
import DownloadFile from './downloadFile.component';

export default class SkemabrikModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {fileSelected: false, showEditLessonModal: false, redirect: false};

        this.handleDisableClick = this.handleDisableClick.bind(this);
        this.handleFeedbackClick = this.handleFeedbackClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.disableEditLessonModal = this.disableEditLessonModal.bind(this);
        this.editLessonClick = this.editLessonClick.bind(this);
        this.showAssignmentClick = this.showAssignmentClick.bind(this);
    }

    handleDisableClick(event){
        event.preventDefault();
        this.props.disableModal();
    }

    handleFeedbackClick(event){
        event.preventDefault();
        if(this.props.type === "assignments" && this.context.role === "teacher"){
            this.setState({
                redirect: '/afleveret',
            })
        }
    }

    handleChange(event){
        let file = event.target.files[0];
        
        this.setState({
            fileSelected: true,
            file: file
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("fileCount", 1);
        formData.append("file", this.state.file);

        if(this.state.fileSelected){
            fetch("http://localhost:5000/upload",{
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(response =>{
                let requestBody = {
                    assignmentId: this.props.skemabrikContext._id,
                    studentId: this.context.id,
                    fileId: response[0].fileId,
                }
                fetch("http://localhost:5000/assignments/turnIn",{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(requestBody),
                }).then(this.props.disableModal())
            })
        }
    }

    disableEditLessonModal(){
        this.setState({
            showEditLessonModal: false
        })
    }
    
    editLessonClick(){
        this.setState(({
            showEditLessonModal: true
        }));
    }
    showAssignmentClick(){
        this.setState({
            redirect: '/afleveret',
        })
    }

    render(){
        const user = this.context;
        const id = this.props.skemabrikContext._id;
        const details = this.props.skemabrikContext.description;
        const classes = this.props.skemabrikContext.class;
        const subject = this.props.skemabrikContext.subject;
        const fileId = this.props.skemabrikContext.fileId;
        const startTime = new Date(this.props.skemabrikContext.startTime);
        const endTime = new Date(this.props.skemabrikContext.endTime);
        const dueDate = new Date(this.props.skemabrikContext.dueDate);
        if(this.state.redirect){
            let assignment = {
                id: id,
                description: details,
                subject: subject,
            }
            return <Redirect push to={{
                pathname: this.state.redirect,
                state: {assignment: assignment}
            }}/>
        }
        
        return([
            <div key="EditModal">
                {this.state.showEditLessonModal ? <EditLessonModal skemabrikContext={this.props.skemabrikContext} disableEditLessonModal={this.disableEditLessonModal} type={this.props.type}/> : null}
            </div>,
            ReactDOM.createPortal(
                <div key="showModal" className={`detailsModal ${subject}`}>
                    <div onClick={this.handleDisableClick} data-testid="Xelement" className="close">&#10006;</div>
                    <div className="skemabrikModalText textCenter">{isValidDate(dueDate) ? toHHMM(dueDate) : `${toHHMM(startTime)} - ${toHHMM(endTime)}`}</div>
                    <div className="skemabrikModalText detailsText textLeft">{details}</div>
                    {user.role === "teacher"
                        ? [<p key="klasse" className="skemabrikModalText textLeft">Klasse: {classes}</p>,
                          <div key="editLesson" className="editLessonButton">
                              {this.props.type === 'schedule' ?
                                <input type="button" name="editLessonButton" onClick={this.editLessonClick} value="Rediger lektion"/>
                              :[<input key="edit" type="button" name="editAssignmentButton" onClick={this.editLessonClick} value="Rediger aflevering"/>,
                              <input key="redirect" type="button" name="showAssignmentButton" onClick={this.showAssignmentClick} value="Giv feedback"/>]
                              }
                              
                          </div>]
                        : this.props.type === "assignments" 
                            ? <div>
                                <p className="skemabrikModalText textLeft">Aflever:</p>
                                <form onSubmit={this.handleSubmit}>
                                    <input name="assignmentUpload" onChange={this.handleChange} type="file"/>
                                    <input name="submitButton" value="Aflever" type="submit"></input>
                                </form>
                            </div>
                        : null
                    }
                    {fileId ? <DownloadFile fileId={fileId}/>: null}
                </div>,
                document.getElementById('root')
            )
        ])
    }
}