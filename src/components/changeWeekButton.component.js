import React, { Component } from 'react';

export default class ChangeWeekButton extends Component{
    constructor(props){
        super(props);
        this.changeWeekClick = this.changeWeekClick.bind(this);
    }

    changeWeekClick(e){
        this.props.changeWeekClick(e);
    }

    render(){
        return(
            <div className="changeWeekButton">
                    <input type="button" className="button previousWeek" onClick={this.changeWeekClick} name="Backwards" value="&#60;"/>
                    <input type="button" className="button currentWeek" onClick={this.changeWeekClick} name="Today" value="I dag"/>
                    <input type="button" className="button nextWeek" onClick={this.changeWeekClick} name="Forward" value="&#62;"/>
            </div>
        );
    }
}