import React, { Component } from 'react';
import { UserContext } from '../UserContext';

export default class Dagsvisning extends Component{
    static contextType= UserContext;
    constructor(props,context){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.handleClick();
    }

    render(){
        return([
            <div className="toggleVisning">
                <label className="switch">
                    <input type="checkbox" defaultChecked={this.props.dayView === 1 ? true : false} onClick={this.handleClick} />
                    <span className="slider">
                       {this.props.dayView === 1 ? <div className="toggleText toggleTextLeft"> 1-Dag </div>: <div className="toggleText toggleTextRight">5-Dage</div>}
                    </span>
                </label>
            </div>,
        ]);
    }
}