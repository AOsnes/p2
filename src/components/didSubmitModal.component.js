import React, { Component } from "react";
import ReactDOM from 'react-dom';

export default class DidSubmitModal extends Component{
    render(){
        return( ReactDOM.createPortal(
                <div className="didSubmitModal">
                    Time tilføjet
                </div>,
                document.getElementById('root')
            )
        )
    }
}