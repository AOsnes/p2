import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import DownloadFile from './downloadFile.component';

export default class FeedbackTable extends Component {
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {turnedInAssignments: {}, didLoad: false}
    }

    componentDidMount(){
        fetch(`http://localhost:5000/assignments/${this.context.id}/0/turnedIn`,{
            method: 'GET'
        }).then(response => response.json()).then(response =>{
            this.setState({
                turnedInAssignments: response,
                didLoad: true
            })
        })
    }
    
    mapReaction(reaction){
        switch (reaction) {
            case 1: return "reaction happy"
            case 2: return "reaction neutral"
            case 3: return "reaction sad"
            default:  return null
        }
    }

    render(){
        return(
            <table data-testid="turnedInTable" className="turnedInassignmentsTable">
                <thead>
                    <tr className="tableTitle"><th className="tableTitle"><h1 className="tableTitle">Afleverede afleveringer</h1></th></tr>
                </thead>
                <tbody>
                    <tr className="tableHead">
                        <th className="tableItem rowTitle">Aflevering</th>
                        <th className="tableItem rowTitle">Feedback</th>
                        <th className="tableItem rowTitle">Fil</th>
                    </tr>   
                    {this.state.didLoad && this.state.turnedInAssignments.length > 0 ? this.state.turnedInAssignments.map((assignment) => {
                        return(
                            <tr key={assignment._id}>
                                <th className="tableItem">{assignment.subject}:{assignment.description}</th>
                                <th className="tableItem"><div className={this.mapReaction(assignment.reaction)}></div></th>
                                <th className="tableItem">{assignment.feedbackFileId ? 
                                    <DownloadFile className="downloadFeedbackFile" fileId={assignment.feedbackFileId}/>
                                    : <p>Ingen fil</p>}
                                </th>
                            </tr>
                        )
                    })
                    : <tr><th>Loading</th></tr>}
                </tbody>
            </table>
        )
    }
}
