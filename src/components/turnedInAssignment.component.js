import React, { Component } from 'react';
import toHHMM from '../utils/toHHMM';
export default class TurnedInAssignment extends Component {
    render(){
        let assignment = this.props.assignment;
        let handedInDate = new Date(assignment.timeStamp) 
        return(
            <tr>
                <th>{assignment.name}</th>
                <th>{toHHMM(handedInDate)}</th>
                <th>Download</th>
                <th className="reactions">
                    <p className="happy"  >Happy</p>
                    <p className="neutral">Neutral</p>
                    <p className="sad"    >Sad</p>
                </th>
            </tr>
        )
    }
}