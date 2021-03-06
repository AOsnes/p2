import React, { Component } from 'react';

export default class Dagsvisning extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.handleClick();
    }

    render(){
        return(
            <div className="toggleVisning">
                <label className="switch">
                    <input type="checkbox" defaultChecked={this.props.dayView === 1 ? true : false} onClick={this.handleClick} />
                    <span className="slider">
                        <div className={this.props.dayView === 1 ? "toggleText toggleTextLeft": "toggleText toggleTextRight"}>{this.props.dayView === 1 ? "1-Dag" : "5-Dage"}</div>
                    </span>
                </label>
            </div>
        );
    }
}