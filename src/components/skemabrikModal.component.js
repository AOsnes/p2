import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";
import toHHMM from '../utils/toHHMM';
import isValidDate from '../utils/isValidDate';
import EditLessonModal from './editLesson.component';

export default class SkemabrikModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {fileSelected: false, file: null, showEditLessonModal: false}

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.disableEditLessonModal = this.disableEditLessonModal.bind(this);
        this.editLessonClick = this.editLessonClick.bind(this);
    }

    handleClick(event){
        event.preventDefault();
        this.props.disableModal();
    }

    handleChange(event){
        let file = event.target.files[0]
        
        this.setState({
            fileSelected: true,
            file: file
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", this.state.file)
        formData.append("id", this.context.id)
        formData.append("assignmentID", this.props.skemabrikContext._id)
        if(this.state.fileSelected){
            fetch("http://localhost:5000/upload",{
                method: 'POST',
                body: formData,
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
            showEditLessonModal: true,
        }));
    }

    render(){
        const user = this.context;
        const details = this.props.skemabrikContext.description;
        const classes = this.props.skemabrikContext.class;
        const subject = this.props.skemabrikContext.subject;
        const startTime = new Date(this.props.skemabrikContext.startTime);
        const endTime = new Date(this.props.skemabrikContext.endTime);
        const dueDate = new Date(this.props.skemabrikContext.dueDate);
        return([
            <div key="modal">
                {this.state.showEditLessonModal ? <EditLessonModal skemabrikContext={this.props.skemabrikContext} disableEditLessonModal={this.disableEditLessonModal}/> : null}
            </div>,
            ReactDOM.createPortal(
                <div className={`detailsModal ${subject}`}>
                    <div onClick={this.handleClick} data-testid="Xelement" className="close">&#10006;</div>
                    <div className="skemabrikModalText textCenter">{isValidDate(dueDate) ? toHHMM(dueDate) :  `${toHHMM(startTime)} - ${toHHMM(endTime)}`}</div>
                    <div className="skemabrikModalText detailsText textLeft">{details}</div>
                    {user.role === "teacher"
                        ? [<p className="skemabrikModalText textLeft">Klasse: {classes}</p>,
                          <div className="editLessonButton">
                              <input type="button" name="editLessonButton" onClick={this.editLessonClick} value="Rediger lektion"/>
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
                </div>,
                document.getElementById('root')
            )
        ])
    }
}