import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";
import toHHMM from '../utils/toHHMM';

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

    render(){
        const user = this.context;
        const details = this.props.skemabrikContext.description;
        const classes = this.props.skemabrikContext.class;
        const subject = this.props.skemabrikContext.subject;
        const startTime = new Date(this.props.skemabrikContext.startTime);
        const endTime = new Date(this.props.skemabrikContext.endTime);
        return( ReactDOM.createPortal(
                <div className={`detailsModal ${subject}`}>
                    <div onClick={this.handleClick} data-testid="Xelement" className="close">&#10006;</div>
                    <div className="skemabrikModalText textCenter">{toHHMM(startTime)} - {toHHMM(endTime)}</div>
                    <div className="skemabrikModalText detailsText textLeft">{details}</div>
                    {user.role === "teacher" ? <p className="skemabrikModalText textLeft"> Klasse: {classes}</p>: null}
                </div>,
                document.getElementById('root')
            )
        )
    }
}