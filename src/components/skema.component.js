import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';
import TimeIndicator from './timeIndicator.component';
import Dagsvisning from './dagsvisning.component';
import currentDay from '../utils/currentDay';
import getWeekday from '../utils/getWeekday';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props, context){
        super(props)
        this.state = {id: context.id, date: '', view: context.role === 'student' ? 1 : 5, viewText: "",  skema:{}, isLoaded: false};
        this.getSchedule = this.getSchedule.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.scheduleBorders = this.scheduleBorders.bind(this);
    }

    componentDidMount(){
        let weekday = currentDay();

        this.setState({
            date: new Date().toISOString(),
            viewText: weekday
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date}/5`;
            this.getSchedule(requestString)
        })
    }   

    getSchedule(requestString){
        fetch(`http://localhost:5000/schedule/${requestString}`,{
            method:'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({skema: response},()=>{this.setState({isLoaded:true})});
        });
    }

    handleClick(){
        this.setState(state => ({
            view: state.view === 5 ? 1 : 5
        }));
    }

    scheduleBorders(weekday, currentDay, isFiveDayView){
        return(
            <div className={`weekdayStyling ${((currentDay === weekday) && isFiveDayView) ? (this.context.role === "teacher") ? "currentDayHighlightTeacher" : "currentDayHighlightPupil" : ""}`} id={weekday}>
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
                    <p>Der opstod en fejl ved indlæsning af dit skema</p>
                </div>
            );
        }
        else if(this.state.view === 5){
            return(
                <div className="scheduleContainer">
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacherColour" : "scheduleContainerHeaderPupilColour"}`}>
                        <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                        <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
                    </div>
                    <div className="weekContainerFiveDay">
                        <h1 className="weekContainerBorderFix"> </h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Mandag") ? (this.context.role === "teacher") ? "currentDayHighlightTeacher" : "currentDayHighlightPupil" : ""}`}>Mandag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Tirsdag") ? (this.context.role === "teacher") ? "currentDayHighlightTeacher" : "currentDayHighlightPupil" : ""}`}>Tirsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Onsdag") ? (this.context.role === "teacher") ? "currentDayHighlightTeacher" : "currentDayHighlightPupil" : ""}`}>Onsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Torsdag") ? (this.context.role === "teacher") ? "currentDayHighlightTeacher" : "currentDayHighlightPupil" : ""}`}>Torsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Fredag") ? (this.context.role === "teacher") ? "currentDayHighlightTeacher" : "currentDayHighlightPupil" : ""}`}>Fredag</h1>
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
                        
                        {this.state.skema.map((skemabrik) => { 
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} weekday={getWeekday(new Date(skemabrik.startTime).getDay())} dayView={this.state.view}/>
                        })}
                    </div>
                </div>
            )
        }
        else if(this.state.view === 1){
            return(
                <div className="scheduleContainer">
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacherColour" : "scheduleContainerHeaderPupilColour"}`}>
                        <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                        <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
                    </div>
                    <div className="weekContainerOneDay">
                        <h1 className="weekContainerBorderFix"> </h1>
                        <h1 className="textCenter oneDayText"><p className="oneDayTextPosition">{this.state.viewText}</p></h1>
                    </div>
                    <div className="gridContainerOneDay">
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
                        {this.scheduleBorders(currentDay())}
                        {this.state.skema.map((skemabrik) => {
                            let lessonDate = new Date(skemabrik.startTime).getDay();
                            if(lessonDate === new Date().getDay())
                                return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} dayView={this.state.view} weekday={getWeekday(lessonDate)}/>
                            else
                                return null;
                        })}
                    </div>
                </div>
            )
        }
    }
}