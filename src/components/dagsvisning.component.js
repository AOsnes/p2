import { span } from 'prelude-ls';
import React, { Component } from 'react';
import { UserContext } from '../UserContext';
import Skema from './skema.component';;

export default class Dagsvisning extends Component{
    static contextType= UserContext;
    constructor(props,context){
        super(props);
        this.state= { dayView: context.role!=='teacher' ? true : false};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState(state => ({
            dayView: !state.dayView
        }));
    }

    render(){
        return([
            <div className="toggleVisning">
                <label className="switch">
                    <input type="checkbox" defaultChecked={this.state.dayView}
                        onClick={this.handleClick} />
                    <span className="slider">
                       {this.state.dayView ? <div className="oneDayText"> 1-Dag </div>: <div className="fiveDayText">5-Dage</div>}</span>
                </label>
            </div>,
            <Skema dayView={this.state.dayView} />
        ]);
    }
}