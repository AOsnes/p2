import React, { Component } from "react";

export default class SkemabrikDetails extends Component{
    render(){
        return(
            <p className="skemabrikDescriptionText">{this.props.details}</p>
        )
    }
}