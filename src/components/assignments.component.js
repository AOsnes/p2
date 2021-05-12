import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import TimeIndicator from './timeIndicator.component';
import AssignmentBricks from './assignmentBricks.component';

export default class Afleveringer extends Component {
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {id: '', date: '', viewText: "",  assignments:{}, isLoaded: false};
        this.currentDay = this.currentDay.bind(this)
        this.getAssignments = this.getAssignments.bind(this);
        this.getWeekday = this.getWeekday.bind(this);
        this.scheduleBorders = this.scheduleBorders.bind(this);
    }

    componentDidMount(){
        let weekday = this.currentDay();
        let user = this.context;

        this.setState({
            id: user.id,
            date: new Date().toISOString(),
            viewText: weekday
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date}`;
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

    /* returns the name of the day depending, day parameter should come from Date.getDay method. */
    getWeekday(day){
        let weekday = '';
        switch(day){
            case 0: weekday = "Søndag"; break;
            case 1: weekday = "Mandag"; break;
            case 2: weekday = "Tirsdag"; break;
            case 3: weekday = "Onsdag"; break;
            case 4: weekday = "Torsdag"; break;
            case 5: weekday = "Fredag"; break;
            case 6: weekday = "Lørdag"; break;
            default: /* TODO: Something is straight up buggin yuh */ break;
        }
        return weekday;
    }
    
    /* Finds and returns current day of the week */
    currentDay(){
        return this.getWeekday(new Date().getDay())
    }

    scheduleBorders(weekday, currentDay, isFiveDayView){
        return(
            <div className={`${weekday} ${((currentDay === weekday) && isFiveDayView) ? "currentDayHighlight" : ""}`} id={weekday}>
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
                    </div>
                    <div className="weekContainerFiveDay">
                        <h1 className="weekContainerBorderFix"> </h1>
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
                        {this.scheduleBorders("Mandag", this.currentDay(), 1)}
                        {this.scheduleBorders("Tirsdag", this.currentDay(), 1)}
                        {this.scheduleBorders("Onsdag", this.currentDay(), 1)}
                        {this.scheduleBorders("Torsdag", this.currentDay(), 1)}
                        {this.scheduleBorders("Fredag", this.currentDay(), 1)}
                        
                        {this.state.assignments.map((assignmentBrick) => { 
                            return <AssignmentBricks key={assignmentBrick._id} assignmentBrick={assignmentBrick} weekday={this.getWeekday(new Date(assignmentBrick.dueDate).getDay())}/>
                        })}
                    </div>
                </div>
            )
        }
    }
}

