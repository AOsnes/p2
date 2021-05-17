import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";
import toHHMM from '../utils/toHHMM';
import isValidDate from '../utils/isValidDate';

export default class SkemabrikModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

     handleClick(e){
        e.preventDefault();
        this.props.disableModal()
    }
    
    /*
    handleSubmit(event) {
        const formData = new FormData();
        const fileField = document.querySelector('input[type="file"]');
        event.preventDefault();
        console.log("hey i just commited this file")

            fetch("http://localhost:5000/upload"),{
                method: 'POST',
                body: myInput.files[0],
            }
    } 
    */

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
                    <input name="assignmentUpload" onChange={this.handleFileUpload} type="file"></input>
                    <input name="submitButton" type="submit"></input>
                    
                    </form>
                    {user.role === "teacher" ? <p className="skemabrikModalText textLeft"> Klasse: {classes}</p>: null}
                    
                </div>,
                document.getElementById('root')
            )
        )
    }
}