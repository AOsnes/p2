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
        return( ReactDOM.createPortal(
                <div className="detailsModal">
                    <div onClick={this.handleClick} className="close">&#10006;</div>
                    <div className="skemabrikModalText textLeft">{details}</div>
                    <UserContext.Consumer>
                        {user => {
                            if(user.role === 'teacher')
                                return(
                                    <p className="skemabrikModalText textRight"> Klasse: {classes}</p>
                                )
                        }}
                    </UserContext.Consumer>
                </div>,
                document.getElementById('root')
            )
        )
    }
}