import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";
import toHHMM from '../utils/toHHMM';
import isValidDate from '../utils/isValidDate';

export default class SkemabrikModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {fileSelected: false, file: null}

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

     handleClick(event){
        event.preventDefault();
        this.props.disableModal()
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
    


    render(){
        const user = this.context;
        const details = this.props.skemabrikContext.description;
        const classes = this.props.skemabrikContext.class;
        const subject = this.props.skemabrikContext.subject;
        const startTime = new Date(this.props.skemabrikContext.startTime);
        const endTime = new Date(this.props.skemabrikContext.endTime);
        const dueDate = new Date(this.props.skemabrikContext.dueDate);
        return( ReactDOM.createPortal(
                <div className={`detailsModal ${subject}`}>
                    <div onClick={this.handleClick} data-testid="Xelement" className="close">&#10006;</div>
                    <div className="skemabrikModalText textCenter">{isValidDate(dueDate) ? toHHMM(dueDate) : toHHMM(startTime) - toHHMM(endTime)}</div>
                    <div className="skemabrikModalText detailsText textLeft">{details}</div>
                    <form onSubmit={this.handleSubmit}>
                        <input name="assignmentUpload" onChange={this.handleChange} type="file"/>
                        <input name="submitButton" type="submit"/>
                    </form>
                    {user.role === "teacher" ? <p className="skemabrikModalText textLeft"> Klasse: {classes}</p>: null}
                    
                </div>,
                document.getElementById('root')
            )
        )
    }
}