import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';
import TimeIndicator from './timeIndicator.component';
import Dagsvisning from './dagsvisning.component';
import ChangeWeekButton from './changeWeekButton.component';
import currentDay from '../utils/currentDay';
import getWeekday from '../utils/getWeekday';
import addDays from '../utils/addDays';
import getWeek from '../utils/getWeek';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props, context){
        super(props)
        this.state = {id: context.id, date: '', view: context.role === 'student' ? 1 : 5, viewText: "",  skema:{}, isLoaded: false};
        this.getSchedule = this.getSchedule.bind(this);
        this.changeWeekClick = this.changeWeekClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.scheduleBorders = this.scheduleBorders.bind(this);
        this.dayHighlight = this.dayHighlight.bind(this);
        this.timeGrid = this.timeGrid.bind(this);
    }

    componentDidMount(){
        let weekday = currentDay();

        this.setState({
            date: new Date(),
            viewText: weekday
        }, () =>{
            let requestString = `${this.props.type}/${this.state.id}/${this.state.date.toISOString()}`
            this.props.type === 'assignments' ? requestString += '': requestString += '/5';
            this.getSchedule(requestString)
        })
    }

    getSchedule(requestString){
        fetch(`http://localhost:5000/${requestString}`,{
            method:'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({skema: response},()=>{this.setState({isLoaded:true})});
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
            let requestString = `${this.props.type}/${this.state.id}/${this.state.date.toISOString()}`
            this.props.type === 'assignments' ? requestString += '': requestString += '/5';
            this.getSchedule(requestString)
        });
    }

    handleClick(){
        this.setState({
            date: this.state.view === 5 ? new Date() : this.state.date,
            view: this.state.view === 5 ? 1 : 5,
        }, () =>{
            let requestString = `${this.props.type}/${this.state.id}/${this.state.date.toISOString()}`
            this.props.type === 'assignments' ? requestString += '': requestString += '/5';
            this.getSchedule(requestString)
        });
    }

    scheduleBorders(weekday, isFiveDayView){
        return(
            <div className={`weekdayStyling ${isFiveDayView ? this.dayHighlight(weekday) : ""}`} id={weekday}>
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

    dayHighlight(weekday) {
        let today = new Date().getDate();
        let currentDate = this.state.date.getDate();
        let role = this.context.role;
        let currentWeekday = currentDay();
        if(currentDate === today){
            if(currentWeekday === weekday && role === "teacher"){
                return "currentDayHighlightTeacher";
            } 
            else if(currentWeekday === weekday){
                return "currentDayHighlightPupil";
            }
        }
        else {
            return "";
        }
    }

    timeGrid(){
        return(
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
        )
    }

    render(){
        if(!this.state.isLoaded){
            return(
                <div className="textCenter">
                    <p>Der opstod en fejl ved indlæsning af dit skema</p>
                </div>
            );
        }
        else if(this.state.view === 5 || this.props.type === 'assignments'){
            return(
                <div className={`${this.props.type === 'schedule' ? 'scheduleContainer' : 'assignmentsContainer'}`}>
                    {this.props.type === 'schedule' ? 
                        <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacherColour" : "scheduleContainerHeaderPupilColour"}`}>
                            <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                            <ChangeWeekButton changeWeekClick={this.changeWeekClick}/>
                            <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
                        </div> : 
                        <div className={`assignmentsContainerHeader ${(this.context.role === "teacher") ? "assignmentsContainerHeaderTeacherColour" : "assignmentsContainerHeaderPupilColour"}`}>
                        <h1 className="textCenter assignmentsContainerHeaderText">Afleveringer</h1>
                        <ChangeWeekButton changeWeekClick={this.changeWeekClick}/>
                        </div>
                    }
                    <div className="weekContainerFiveDay">
                        <h1 className="weekNumberText">Uge {getWeek(this.state.date)}</h1>
                        <h1 className={`textCenter weekText ${this.dayHighlight("Mandag")}`}>Mandag</h1>
                        <h1 className={`textCenter weekText ${this.dayHighlight("Tirsdag")}`}>Tirsdag</h1>
                        <h1 className={`textCenter weekText ${this.dayHighlight("Onsdag")}`}>Onsdag</h1>
                        <h1 className={`textCenter weekText ${this.dayHighlight("Torsdag")}`}>Torsdag</h1>
                        <h1 className={`textCenter weekText ${this.dayHighlight("Fredag")}`}>Fredag</h1>
                    </div>
                    <div className="gridContainerFiveDay">
                        <TimeIndicator/>
                        {this.timeGrid()}
                        {this.scheduleBorders("Mandag", 1)}
                        {this.scheduleBorders("Tirsdag", 1)}
                        {this.scheduleBorders("Onsdag", 1)}
                        {this.scheduleBorders("Torsdag", 1)}
                        {this.scheduleBorders("Fredag", 1)}
                        {this.state.skema.map((skemabrik) => { 
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} weekday={getWeekday(new Date(this.props.type === 'schedule' ? skemabrik.startTime : skemabrik.dueDate).getDay())} type={this.props.type}/>
                        })}
                    </div>
                </div>
            )
        }
        else if(this.state.view === 1 && this.props.type === "schedule"){
            return(
                <div className="scheduleContainer">
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacherColour" : "scheduleContainerHeaderPupilColour"}`}>
                        <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                        <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
                    </div>
                    <div className="weekContainerOneDay">
                        <div className="weekNumberText"> </div>
                        <h1 className="textCenter oneDayText"><p className="oneDayTextPosition">{this.state.viewText}</p></h1>
                    </div>
                    <div className="gridContainerOneDay">
                        <TimeIndicator/>
                        {this.timeGrid()}
                        {this.scheduleBorders(currentDay())}
                        {this.state.skema.map((skemabrik) => {
                            let lessonDay = new Date(skemabrik.startTime).getDay();
                            if(lessonDay === new Date().getDay())
                                return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} dayView={this.state.view} weekday={getWeekday(lessonDay)} type={this.props.type}/>
                            else
                                return null;
                        })}
                    </div>
                </div>
            )
        }
    }
}