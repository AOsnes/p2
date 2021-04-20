import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {id: '', date: '', view: 1, viewText: "",  skema:{}};
        this.getSchedule = this.getSchedule.bind(this);
    }

    getSchedule(requestString){
        fetch(`http://localhost:5000/getSchedule/${requestString}`,{
            method:'GET',
        })
        .then(response => response.json())
        .then(response => {
            this.setState({skema: response});
        });
    };

    componentDidMount(){
        let d = new Date();
        let day = d.getDay();
        let weekday = "";
        /* Maybe move all of the switch into componentDidUpdate in the future, or just put it in function  */
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
                    default: /* Something is straight up buggin yuh */ break;
                } break;
            case 5: /* Week view */ break;
            default: /* something is straight up buggin yuh */ break;
        }
        let user = this.context;
        this.setState({
            id: user.id,
            date: new Date().toISOString(),
            view: 1,
            viewText: weekday
        }, () =>{
            console.log(this.state.date)
            let requestString = `${this.state.id}/${this.state.date}/${this.state.view}`;
            this.getSchedule(requestString)
        })
    }

    render(){
        if(!this.state.skema.length){
            return(
                <div className="skemaError">
                    <p>There was an error loading your schedule</p>
                </div>
            );
        }
        return(
            <div className="skemaContainer">
                <h1 className="dayText">{this.state.viewText}</h1>

                <div className="gridContainer">
                    <div className="gridItem">08.00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                    <div className="gridItem">09.00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                    <div className="gridItem">10:00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div> 
                    <div className="gridItem">11.00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                    <div className="gridItem">12.00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                    <div className="gridItem">13:00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                    <div className="gridItem">14.00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div>
                    <div className="gridItem">15:00</div>
                    <div className="gridItem gridLessonItem">
                        {this.state.skema.map((skemabrik) => {
                            return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                        })}
                    </div> 
                </div>
            </div>
        )
    }
}
