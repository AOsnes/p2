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
        return ([
            <div className="toggleVisning">
                <button className="button"
                    onClick={this.handleClick}>
                    {this.state.dayView ? '1 dags visning' : '5 dags visning'}
                </button>
            </div>,
            <Skema dayView={this.state.dayView}/>
        ]);
    }
}