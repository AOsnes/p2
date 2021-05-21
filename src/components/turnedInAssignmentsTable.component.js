import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import TurnedInAssignment from './turnedInAssignment.component';

export default class TurnedInAssignmentsTable extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props);
        this.state = {didLoad: false, turnedInAssignments: {}}

        this.handleClick = this.handleClick.bind(this);
    } 

    componentDidMount(){
        fetch(`http://localhost:5000/assignments/turnedIn/${this.context.id}/${this.props.assignment.id}`,{
            method: 'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                turnedInAssignments: response,
                didload: true,
            })})
    }

    handleClick(event){

    }

    render(){
        return( 
            <table className="turnedInassignmentsTable">
                <thead className="textLeft tableHead">
                    <tr>
                        <th className="textLight"><b>Fag: </b>{this.props.assignment.subject}</th>
                    </tr>
                    <tr>
                        <th className="textLight"><b>Beskrivelse: </b>{this.props.assignment.description}</th>
                    </tr>
                        
                </thead>
                <tbody className="tableBody">
                    {this.state.didload ? this.state.turnedInAssignments.map((assignment) => {
                        return <TurnedInAssignment key={assignment._id} assignment={assignment}/>
                    }): null}
                <button onClick={this.handleClick}>Send svar</button>
                </tbody>
            </table>
        );
    }
}