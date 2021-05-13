import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import TimeIndicator from './timeIndicator.component';
import AssignmentBricks from './assignmentBricks.component';
import currentDay from '../utils/currentDay';
import getWeekday from '../utils/getWeekday';
import ChangeWeekButton from './changeWeekButton.component';
import addDays from '../utils/addDays';
import getWeek from '../utils/getWeek';

export default class Afleveringer extends Component {
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {id: '', date: '', viewText: '',  assignments:{}, isLoaded: false};
        this.getAssignments = this.getAssignments.bind(this);
        this.changeWeekClick = this.changeWeekClick.bind(this);
        this.scheduleBorders = this.scheduleBorders.bind(this);
    }

    componentDidMount(){
        let weekday = currentDay();
        let user = this.context;

        this.setState({
            id: user.id,
            date: new Date(),
            viewText: weekday
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date.toISOString()}`;
            this.getAssignments(requestString)
        })
    }

    getAssignments(requestString){
        fetch(`http://localhost:5000/assignments/${requestString}`,{
            method:'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({assignments: response},()=>{this.setState({isLoaded:true})});
        });
    }  

    changeWeekClick(e){
        let change = 0;
        if(e.target.name === "Forward"){
            change = 7;
        } 
        else if(e.target.name === "Backwards"){
            change = -7;
        }        
        this.setState({
            date: addDays(this.state.date, change),
            isLoaded: false,
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date.toISOString()}`;
            this.getAssignments(requestString)
        });
    }

    scheduleBorders(weekday, currentDay, isFiveDayView){
        return(
            <div className={`weekdayStyling ${((currentDay === weekday) && isFiveDayView) ? "currentDayHighlight" : ""}`} id={weekday}>
                <div className="scheduleBordersHour scheduleBorderFirst"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour"></div>
                <div className="scheduleBordersHour"></div>
                <div className="scheduleBordersHalfHour lastScheduleBlock"></div>
            </div>
        )
    }

    render(){
        if(!this.state.isLoaded){
            return(
                <div className="textCenter">
                    <p>Der opstod en fejl ved indlæsning af dine afleveringer</p>
                </div>
            );
        }
        else {
            return(
                <div className="assignmentsContainer">
                    <div className={`assignmentsContainerHeader ${(this.context.role === "teacher") ? "assignmentsContainerHeaderTeacher" : "assignmentsContainerHeaderPupil"}`}>
                        <h1 className="textCenter assignmentsContainerHeaderText">Afleveringer</h1>
                        <ChangeWeekButton changeWeekClick={this.changeWeekClick}/>
                    </div>
                    <div className="weekContainerFiveDay">
                        <div className="weekNumberText">Uge {getWeek(this.state.date)}</div>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Mandag") ? "currentDayHighlight" : ""}`}>Mandag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Tirsdag") ? "currentDayHighlight" : ""}`}>Tirsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Onsdag") ? "currentDayHighlight" : ""}`}>Onsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Torsdag") ? "currentDayHighlight" : ""}`}>Torsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Fredag") ? "currentDayHighlight" : ""}`}>Fredag</h1>
                    </div>
                    <div className="gridContainerFiveDay">
                        <TimeIndicator/>
                        <div className="gridItemContainer">
                            <div className="gridItemHour timeOne">8:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">9:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">10:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">11:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">12:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">13:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">14:00</div>
                            <div className="gridItemHalfHour"></div>
                            <div className="gridItemHour">15:00</div>
                            <div className="gridItemHalfHour"></div>
                        </div>
                        {this.scheduleBorders("Mandag", currentDay(), 1)}
                        {this.scheduleBorders("Tirsdag", currentDay(), 1)}
                        {this.scheduleBorders("Onsdag", currentDay(), 1)}
                        {this.scheduleBorders("Torsdag", currentDay(), 1)}
                        {this.scheduleBorders("Fredag", currentDay(), 1)}
                        
                        {this.state.assignments.map((assignmentBrick) => { 
                            return <AssignmentBricks key={assignmentBrick._id} assignmentBrick={assignmentBrick} weekday={getWeekday(new Date(assignmentBrick.dueDate).getDay())}/>
                        })}
                    </div>
                </div>
            )
        }
    }
}

