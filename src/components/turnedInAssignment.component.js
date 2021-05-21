import React, { Component } from 'react';
import toHHMM from '../utils/toHHMM';
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
        if(target === "download"){
            /* Download the file */
        } else {
            this.setState({
                reaction: value
            })
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
                <th name="download" onClick={this.handleClick}>Download</th>
                <th className="reactions">
                    <p className={reaction === "1" ? "happy selected" : "happy"}     name="happy"   value="1" onClick={this.handleClick}>Happy</p>
                    <p className={reaction === "2" ? "neutral selected" : "neutral"} name="neutral" value="2" onClick={this.handleClick}>Neutral</p>
                    <p className={reaction === "3" ? "sad selected" : "sad"}         name="sad"     value="3" onClick={this.handleClick}>Sad</p>
                </th>
            </tr>
        )
    }
}