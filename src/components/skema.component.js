import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';
import TimeIndicator from './timeIndicator.component';

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
            case 5: /* TODO: Week view */ break;
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

    render(){
        if(!this.state.skema.length){
            return(
                <div className="textCenter">
                    <p>There was an error loading your schedule</p>
                </div>
            );
        }
        return(
            <div className="skemaContainer">
                <h1 className="textCenter">{this.state.viewText}</h1>
                <div>
                    <TimeIndicator/>
                </div>
                <div className="gridContainer">
                    {this.state.skema.map((skemabrik) => {
                        return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                    })}
                </div>
            </div>
        )
    }
}
