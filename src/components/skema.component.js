import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skemabrik from './skemabrik.component';

export default class Skema extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state = {id: '', date: '', view: 1, skema:{}};
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
        let user = this.context;
        this.setState({
            id: user.id,
            date: new Date().toISOString(),
            view: 1,
        }, () =>{
            console.log(this.state.date)
            let requestString = `${this.state.id}/${this.state.date}/${this.state.view}`;
            this.getSchedule(requestString)
        })
    }

    render(){
        if(!this.state.skema.length){
            return(
            <div className="skemaError center">
                <p>There was an error loading your schedule</p>
            </div>
            );
        }
        return(
            <div className="skemaContainer">
                <h1 className="dayText center">TODAY</h1>
                {this.state.skema.map((skemabrik) => {
                    return <Skemabrik key={skemabrik._id} skemabrik={skemabrik}/>
                })}
            </div>
        )
    }
}