import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";

export default class EditLessonModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {schedule: {}};
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        event.preventDefault();
        this.props.disableEditLessonModal();
    }

    render(){
        const subject = this.props.skemabrikContext.subject;
        return(
            ReactDOM.createPortal(
                <div className={`editLessonModal ${subject}`}>
                    <div onClick={this.handleClick} className="close">&#10006;</div>                   
                </div>,
                document.getElementById('root')
            )
        )
    }
}