import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';
import TimeIndicator from './timeIndicator.component';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {id: '', date: '', view: 1, viewText: "",  skema:{}, isLoaded: false};
        this.getSchedule = this.getSchedule.bind(this);
        this.getWeekday = this.getWeekday.bind(this);
        this.scheduleBorders = this.scheduleBorders.bind(this);
    }

    componentDidMount(){
        /* Maybe a little bit of a cursed oneliner */
        let weekday = this.getWeekday(new Date().getDay());
        let user = this.context;

        this.setState({
            id: user.id,
            date: new Date().toISOString(),
            view: 5,
            viewText: weekday
        }, () =>{
            let requestString = `${this.state.id}/${this.state.date}/${this.state.view}`;
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

    getSchedule(requestString){
        fetch(`http://localhost:5000/schedule/${requestString}`,{
            method:'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({skema: response},()=>{this.setState({isLoaded:true})});
        });
    };

    scheduleBorders(weekday){
        return(
            <div className={weekday} id={weekday}>
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
                    <p>There was an error loading your schedule</p>
                </div>
            );
        }
        else if(this.props.dayView === false){
            return(
                <div className="scheduleContainer">
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacher" : "scheduleContainerHeaderPupil"}`}>
                        <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
                    </div>
                    <div className="weekContainerFiveDay">
                        <h1 className="weekContainerBorderFix"> </h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Mandag") ? "todayText" : ""}`}>Mandag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Tirsdag") ? "todayText" : ""}`}>Tirsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Onsdag") ? "todayText" : ""}`}>Onsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Torsdag") ? "todayText" : ""}`}>Torsdag</h1>
                        <h1 className={`textCenter weekText ${(this.state.viewText === "Fredag") ? "todayText" : ""}`}>Fredag</h1>
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
                        {this.scheduleBorders("Mandag")}
                        {this.scheduleBorders("Tirsdag")}
                        {this.scheduleBorders("Onsdag")}
                        {this.scheduleBorders("Torsdag")}
                        {this.scheduleBorders("Fredag")}
                        
                        {this.state.skema.map((skemabrik) => { 
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} weekday={this.getWeekday(new Date(skemabrik.startTime).getDay())} dayView={this.props.dayView}/>
                        })}
                    </div>
                </div>
            )
        }
        else if(this.props.dayView === true){
            return(
                <div className="scheduleContainer">
                    <div className={`scheduleContainerHeader ${(this.context.role === "teacher") ? "scheduleContainerHeaderTeacher" : "scheduleContainerHeaderPupil"}`}>
                    <h1 className="textCenter scheduleContainerHeaderText">Skema</h1>
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
                        {this.scheduleBorders(this.getWeekday(new Date().getDay()))}
                        {this.state.skema.map((skemabrik) => {
                            let lessonDate = new Date(skemabrik.startTime).getDay();
                            if(lessonDate === new Date().getDay())
                                return <Skemabrik key={skemabrik._id} skemabrik={skemabrik} dayView={this.props.dayView} weekday={this.getWeekday(lessonDate)}/>
                            else
                                return null;
                        })}
                    </div>
                </div>
            )
        }
    }
}
