import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import TurnedInAssignment from './turnedInAssignment.component';

export default class TurnedInAssignmentsTable extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props);
        this.state = {didLoad: false, turnedInAssignments: {}, reactions: []}

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleState = this.handleState.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.submitFeedback = this.submitFeedback.bind(this);
    } 

    componentDidMount(){
        fetch(`http://localhost:5000/assignments/${this.context.id}/${this.props.assignment.id}/turnedIn`,{
            method: 'GET'
        })
        .then(response => response.json())
        .then(response => {
            let reactions = [];
            this.setState({
                turnedInAssignments: response,
                didLoad: true,
            })
            response.forEach(assignment => {
                reactions.push({
                    assignmentId: assignment._id});
            });
            this.setState({
                reactions: reactions
            })
        });
    }

    handleState(childIndex, childValue, target){
        if(target === "file"){
            this.setState(previousState => ({
                reactions: [
                    ...previousState.reactions.slice(0, childIndex),
                    {
                        ...previousState.reactions[childIndex],
                        file:childValue,
                        index: childIndex
                    },
                    ...previousState.reactions.slice(childIndex + 1)
                ]
            }));
        }
        else {
            this.setState(previousState => ({
                reactions: [
                    ...previousState.reactions.slice(0, childIndex),
                    {
                        ...previousState.reactions[childIndex],
                        reaction:childValue,
                        index: childIndex
                    },
                    ...previousState.reactions.slice(childIndex + 1)
                ]
            }));
        }
    }

    handleSubmit(event){
        let fileCount = null;
        let formData = new FormData();
        this.state.reactions.forEach(reaction => {
            if(reaction.file){
                fileCount++;
                formData.append(`${reaction.index}`, reaction.file);
            }
        });
        formData.append("fileCount", fileCount);
        if(fileCount){
            this.uploadFiles(formData).then(response => {
                /* Copy the reactions so avoid mutating the state directly. 
                Then iterate over the response array and put the fileId
                into the requestBody object index that correspond to the 
                fileFor integer */
                let requestBody = this.state.reactions;
                let index;
                for(let i = 0; i < response.length; i++){
                    index = parseInt(response[i].fileFor)
                    requestBody[index].feedbackFileId  = response[i].fileId;
                }
                this.submitFeedback(JSON.stringify(requestBody, (key, val) =>{
                    switch (key) {
                        case "file": case "index": return undefined;
                        default: return val;
                    }
                } ))
            })
        } else {
            let requestBody = JSON.stringify(this.state.reactions, (key, val) =>{
                if(key === "index"){
                    return undefined
                } else {
                    return val
                }
            })
            this.submitFeedback(requestBody)
        }
    }

    async uploadFiles(requestBody){
        return new Promise((resolve, reject) =>{
            fetch("http://localhost:5000/upload",{
                method: 'POST',
                body: requestBody,
            }).then(response =>{
                response.json().then(response => {
                    resolve(response)
                });
            })
        }) 
    }

    submitFeedback(requestBody){
        fetch("http://localhost:5000/feedback",{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: requestBody
        })
        .then(response => console.log(response))
    }

    render(){
        return( 
            <table className="turnedInassignmentsTable" data-testid="turnedInassignmentsTable">
                <thead className="textLeft tableHead">
                    <tr>
                        <th className="textLight"><b>Fag: </b>{this.props.assignment.subject}</th>
                    </tr>
                    <tr>
                        <th className="textLight"><b>Beskrivelse: </b>{this.props.assignment.description}</th>
                    </tr>
                </thead>
                <tbody className="tableBody" data-testid="tableBody">
                    {this.state.didLoad > 0 ? this.state.turnedInAssignments.map((assignment, index) => {
                        return <TurnedInAssignment key={assignment._id} assignment={assignment} index={index} sendState={this.handleState}/>
                    }): null}
                    <tr>
                        <th>
                            <button onClick={this.handleSubmit}>Send svar</button>
                        </th>
                    </tr>
                </tbody>
            </table>
        );
    }
}