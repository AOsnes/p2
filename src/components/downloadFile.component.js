import React, { Component } from "react";

export default class DownloadFile extends Component {
    constructor(props){
        super(props)
        this.state = {fileName: undefined, fileType: undefined}
        this.getFileInfo = this.getFileInfo.bind(this);
    }

    componentDidMount(){
        this.getFileInfo(this.props.fileId);
    }

    getFileInfo(fileId){
        fetch(`http://localhost:5000/download/${fileId}`,{
            method:'GET',
        })
        .then(response => {
            let fileName = response.headers.get('content-disposition').split('filename=')[1];
            let fileType = response.headers.get('content-type').split(';')[0];
            this.setState({fileName: fileName, fileType: fileType});
        });
    }

    render(){
        return(
            <a href={"http://localhost:5000/download/"+this.props.fileId} type={this.state.fileType} download>{this.state.fileName}</a> 
        );
    } 
}