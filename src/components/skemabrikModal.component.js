import React, { Component } from "react";
import ReactDOM from 'react-dom';

export default class SkemabrikModal extends Component{
    render(){
        return( ReactDOM.createPortal(
                <div className="detailsModal">
                    <p className="skemabrikModalText">{this.props.details}</p>
                </div>,
                document.getElementById('root')
            )
        )
    }
}