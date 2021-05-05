import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {id: '', date: '', view: 1, viewText: "",  skema:{}, isSorted: false};
        this.getSchedule = this.getSchedule.bind(this);
        this.getWeekday = this.getWeekday.bind(this);
    }

    componentDidMount(){
        /* Maybe a little bit of a cursed oneliner */
        let weekday = this.getWeekday(new Date().getDay());
        let user = this.context;
        if(this.context.role === "student"){
            this.setState({
                id: user.id,
                date: new Date().toISOString(),
                view: 1,
                viewText: weekday
            }, () =>{
                let requestString = `${this.state.id}/${this.state.date}/${this.state.view}`;
                this.getSchedule(requestString)
            })
        }
        else if(this.context.role === "teacher"){
            this.setState({
                id: user.id,
                date: new Date().toISOString(),
                view: 1,
                viewText: weekday
            }, () =>{
                let requestString = `${this.state.id}/${this.state.date}/${this.state.view}`;
                this.getSchedule(requestString)
            })
        }
    }
    /* returns the name of the day depending, day parameter should come from Date.getDay method. */
    getWeekday(day){
        let weekday = '';
        switch(this.state.view){
            case 1: /* One day view */ 
                switch(day){
                    case 0: weekday = "Søndag"; break;
                    case 1: weekday = "Mandag"; break;
                    case 2: weekday = "Tirsdag"; break;
                    case 3: weekday = "Onsdag"; break;
                    case 4: weekday = "Torsdag"; break;
                    case 5: weekday = "Fredag"; break;
                    case 6: weekday = "Lørdag"; break;
                    default: /* TODO: Something is straight up buggin yuh */ break;
                } break;
            case 5: /* TODO: Five day view */ 
                break;
            default: /* TODO: something is straight up buggin yuh */ break;
        }
        return weekday;
    }

    getSchedule(requestString){
        fetch(`http://localhost:5000/schedule/${requestString}`,{
            method:'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({skema: response});
        });
    };

    fiveDaySchedule(weekday){
        return(
            <div className={weekday}>
                {this.state.skema.map((skemabrik) => {
                        return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                    })}
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
                <div className="scheduleBordersHalfHour"></div>
            </div>
        )
    }

    render(){
        if(!this.state.skema.length){
            return(
                <div className="textCenter">
                    <p>There was an error loading your schedule</p>
                </div>
            );
        }
        if(this.context.role === "teacher"){
            return(
                <div className="skemaContainer">
                    <h1 className="textCenter">{this.state.viewText}</h1>
                    <div className="gridContainerFiveDay">
                        <div className="gridItemContainer">
                            <div className="gridItemFiveDayHour timeOne">8:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">9:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">10:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">11:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">12:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">13:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">14:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                            <div className="gridItemFiveDayHour">15:00</div>
                            <div className="gridItemFiveDayHalfHour"></div>
                        </div>
                        {this.fiveDaySchedule("Mandag")}
                        {this.fiveDaySchedule("Tirsdag")}
                        {this.fiveDaySchedule("Onsdag")}
                        {this.fiveDaySchedule("Torsdag")}
                        {this.fiveDaySchedule("Fredag")}
                    </div>
                </div>
            )
        }
        else if(this.context.role === "student"){
            return(
                <div className="skemaContainer">
                    <h1 className="textCenter">{this.state.viewText}</h1>
                    <div className="gridContainerOneDay">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                </div>
            )
        }
    }
}
