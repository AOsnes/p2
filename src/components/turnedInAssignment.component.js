import React, { Component } from 'react';
import toHHMM from '../utils/toHHMM';
import DownloadFile from './downloadFile.component';
export default class TurnedInAssignment extends Component {
    constructor(props){
        super(props)

        this.state = {reaction: null};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        event.preventDefault();
        const target = event.target.getAttribute('name');
        const value = event.target.getAttribute('value');
        if(target === "file"){
            this.setState({
                file: event.target.files[0],
            }, () => this.props.sendState(this.props.index, this.state.file, target))
        }
        else {
            this.setState({
                reaction: value
            },() => this.props.sendState(this.props.index, this.state.reaction, target))
        }
    }

    render(){
        let assignment = this.props.assignment;
        let handedInDate = new Date(assignment.timeStamp)
        let reaction = this.state.reaction;
         return(
            <tr>
                <th>{assignment.name}</th>
                <th>{toHHMM(handedInDate)}</th>
                <th><DownloadFile fileId={assignment.fileId}></DownloadFile></th>
                <th className="reactions">
                    <p className={reaction === "1" ? "happy selected" : "happy"}     name="happy"   value="1" onClick={this.handleClick}>Happy</p>
                    <p className={reaction === "2" ? "neutral selected" : "neutral"} name="neutral" value="2" onClick={this.handleClick}>Neutral</p>
                    <p className={reaction === "3" ? "sad selected" : "sad"}         name="sad"     value="3" onClick={this.handleClick}>Sad</p>
                </th>
                <th>
                    <input type="file" name="file" onChange={this.handleClick}></input>
                </th>
                {assignment.reaction || assignment.feedbackFileId ? 
                    <th>
                        <div className="didGiveFeedback"></div>
                    </th>
                : null}
            </tr>
        )
    }
}