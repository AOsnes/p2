import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';
import TimeIndicator from './timeIndicator.component';
import Dagsvisning from './dagsvisning.component';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props, context){
        super(props)
        this.state = {id: context.id, date: '', view: context.role === 'student' ? 1 : 5, viewText: "",  skema:{}, isLoaded: false};
        this.currentDay = this.currentDay.bind(this)
        this.getSchedule = this.getSchedule.bind(this);
        this.getWeekday = this.getWeekday.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.scheduleBorders = this.scheduleBorders.bind(this);
    }

    componentDidMount(){
        let weekday = this.currentDay();

        this.setState({
            date: new Date().toISOString(),
            viewText: weekday
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date}/5`;
            this.getSchedule(requestString)
        })
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
                        <Dagsvisning dayView = {this.state.view} handleClick = {this.handleClick}/>
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
                        
                        {this.state.skema.map((skemabrik) => { 
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} weekday={this.getWeekday(new Date(skemabrik.startTime).getDay())} dayView={this.state.view}/>
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
                        {this.scheduleBorders(this.currentDay())}
                        {this.state.skema.map((skemabrik) => {
                            let lessonDate = new Date(skemabrik.startTime).getDay();
                            if(lessonDate === new Date().getDay())
                                return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} dayView={this.state.view} weekday={this.getWeekday(lessonDate)}/>
                            else
                                return null;
                        })}
                    </div>
                </div>
            )
        }
    }
}