import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";

export default class SkemabrikModal extends Component{
    constructor(props){
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e){
        e.preventDefault();
        this.props.disableModal()
    }

    render(){
        const details = this.props.skemabrikContext.description;
        const classes = this.props.skemabrikContext.class;
        const subject = this.props.skemabrikContext.subject;
        const startTime = new Date(this.props.skemabrikContext.startTime);
        const endTime = new Date(this.props.skemabrikContext.endTime);
        return( ReactDOM.createPortal([
                <div className="modal-backdrop" onClick={this.handleClick}></div>,
                <div className={`detailsModal ${subject}`}>
                    <div onClick={this.handleClick} className="close">&#10006;</div>
                    <div className="skemabrikModalText textCenter">{this.props.toHHMM(startTime)} - {this.props.toHHMM(endTime)}</div>
                    <div className="skemabrikModalText detailsText textLeft">{details}</div>
                    <UserContext.Consumer>
                        {user => {
                            if(user.role === 'teacher')
                                return(
                                    <p className="skemabrikModalText textLeft"> Klasse: {classes}</p>
                                )
                        }}
                    </UserContext.Consumer>
                </div>],
                document.getElementById('root')
            )
        )
    }
}