import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import ReactDOM from 'react-dom';
import calculatePosition from '../utils/calculatePosition';

export default class AssignmentBricks extends Component {
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {
            isLoaded: false,
        };
    }

    componentDidMount(){
        if(document.getElementsByClassName('gridContainerFiveDay')){
            this.setState({
                isLoaded: true,
            })
        }
    }

    render(){
        const subject = this.props.assignmentBrick.subject;
        const due = new Date(this.props.assignmentBrick.dueDate);
        const style = {
            position: 'absolute',
            top: calculatePosition(due, 1),
        }
        if (this.state.isLoaded){
            return(
                ReactDOM.createPortal(
                    <div key="brik" style={style} className={`assignmentBrick ${subject}`}>
                        <p className="assignmentBrickTitleText">
                            <img src={`schedulePictograms/${subject}.png`} className="assignmentBrickIcon" alt={`${subject} Logo `}/>
                            {subject}
                        </p>
                </div>,
                document.getElementById(`${this.props.weekday}`))
            )
        }
        else {
            return null;
        }
    }
}