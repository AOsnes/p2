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
    }

    componentDidMount(){
        let weekday = currentDay();

        this.setState({
            date: new Date(),
            viewText: weekday
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date.toISOString()}/5`;
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
            let requestString = `${this.state.id}/${this.state.date.toISOString()}/5`;
            this.getSchedule(requestString)
        });
    }

    handleClick(){
        this.setState({
            date: this.state.view === 5 ? new Date() : this.state.date,
            view: this.state.view === 5 ? 1 : 5,
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date.toISOString()}/5`;
            this.getSchedule(requestString)
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
                    <p>Der opstod en fejl ved indlæsning af dit skema</p>
                </div>
            );
        }
        else if(this.state.view === 5){
            return(
                <div className="scheduleContainer">
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacher" : "scheduleContainerHeaderPupil"}`}>
                        <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                        <ChangeWeekButton changeWeekClick={this.changeWeekClick}/>
                        <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
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
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacher" : "scheduleContainerHeaderPupil"}`}>
                        <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                        <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
                    </div>
                    <div className="weekContainerOneDay">
                        <div className="weekNumberText">Uge {getWeek(this.state.date)}</div>
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
                        {/* This is done to make sure that there is a schedule before trying to map it,
                            without this the platform will crash if there are no lessons for that day*/}
                        {this.scheduleBorders(currentDay())}
                        {(this.state.skema !== null) ? 
                            this.state.skema.map((skemabrik) => {
                                let lessonDate = new Date(skemabrik.startTime).getDay();
                                if(lessonDate === new Date().getDay())
                                    return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} dayView={this.state.view} weekday={getWeekday(lessonDate)}/>
                                else
                                    return null;
                            }) 
                            : {}
                        }
                    </div>
                </div>
            )
        }
    }
}