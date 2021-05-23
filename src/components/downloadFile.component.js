import React, { Component } from "react";

export default class DownloadFile extends Component {
    render(){
        return(
            <a className={this.props.className} href={"http://localhost:5000/download/"+this.props.fileId} download>Hent fil</a> 
        );
    } 
}