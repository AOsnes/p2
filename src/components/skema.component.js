import React, { Component } from 'react';

export default class Skema extends Component{
    constructor(props){
        super(props)
        this.state = {id: '', date: '', view: 1};

        this.getSchedule = this.getSchedule.bind(this);
    }

    /* Skal ikke kaldes når der bliver trykket på en knap som der sker lige nu, 
    dette er bare for at teste at om bliver lavet korrekt fetch, måske skal det bare
    indkapsuleres i componentDidMount funcktionen */
    getSchedule(){
        let requestString
        console.log(requestString)
        fetch(`http://localhost:5000/getSchedule/${requestString}`,{
            method:'GET',
        })
    }


    render(){
        return(
            <div className="skemaContainer">
                {/* <UserContext.Consumer>
                {user =>{
                console.log("yep")
                if(user.id){
                    this.setState = user.id;
                    this.state.date = new Date().toLocaleDateString();
                    requestString = `/${user.id}/${date}/${this.state.view}`;
                    console.log(requestString)
                }
            }}
                </UserContext.Consumer> */}
                <h1 className="dayText center">TODAY</h1>
                {/* <button onClick={this.getSchedule}></button> */}
            </div>
        )
    }
}