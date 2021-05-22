import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { UserContext } from "../UserContext";
import toHHMM from '../utils/toHHMM';
import formatDate from '../utils/formatDate'

export default class EditLessonModal extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props)
        this.state ={
            classDescription: this.props.skemabrikContext.description,
            originalStartTime: new Date(this.props.skemabrikContext.startTime),
            originalEndTime: new Date(this.props.skemabrikContext.endTime),
            originalDueTime: new Date(this.props.skemabrikContext.dueDate),
            startTime: new Date(this.props.skemabrikContext.startTime),
            endTime: new Date(this.props.skemabrikContext.endTime),
            dueTime: new Date(this.props.skemabrikContext.dueDate),
            didDelete: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateAny = this.validateAny.bind(this);
    }

    handleClick(event){
        event.preventDefault();
        this.props.disableEditLessonModal();
    }

    handleChange(event){
        const target = event.target.name;
        const value = event.target.value;
        let change;
        let startTime;
        let endTime;
        let dueTime;
        let hours;
        let date;
        switch(target){
            case "startTime":
                hours = value.split(":");
                change = new Date(this.state.startTime.setHours(hours[0], hours[1]));
                break;
            case "endTime":
                hours = value.split(":");
                change = new Date(this.state.endTime.setHours(hours[0], hours[1]));
                break;
            case "dueTime":
                hours = value.split(":");
                change = new Date(this.state.dueTime.setHours(hours[0], hours[1]));
                break;
            case "date":
                date = value.split("-");
                startTime = new Date(date[0], date[1] - 1, date[2], this.state.startTime.getHours(), this.state.startTime.getMinutes());
                endTime = new Date(date[0], date[1] - 1, date[2], this.state.endTime.getHours(), this.state.startTime.getMinutes());
                break;
            case "dueDate":
                date = value.split("-");
                dueTime = new Date(date[0], date[1] - 1, date[2], this.state.dueTime.getHours(), this.state.dueTime.getMinutes());
                break;
            default:
                change = value;
                break;
        }
        if(target !== "date" && target !== "dueDate"){
            this.setState({
                [target]: change
            });
        } else if (this.props.type === 'schedule'){
            this.setState({
                startTime: startTime,
                endTime: endTime
            });
        } else if (this.props.type === 'assignments'){
            this.setState({
                dueTime: dueTime
            });
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let submitter = event.nativeEvent.submitter.name; 
        let requestString = this.props.type === 'schedule' ? "classes/" : "assignments/";
        requestString += this.props.skemabrikContext._id;
        let originalDescription = this.props.skemabrikContext.description;
        if(submitter === "delete"){
            fetch(`http://localhost:5000/${requestString}`,{
                method: 'DELETE',
            }).then(response =>{
                this.setState({
                    didDelete: true
                },() =>{
                    window.location.reload(false);
                })
        })
        } else {
            let originalStartTime = new Date(this.state.originalStartTime).toString();
            let originalEndTime = new Date(this.state.originalEndTime).toString();
            let originalDueTime = new Date(this.state.originalDueDate).toString();
            
            let requestBody = JSON.stringify(this.state, (key, val) =>{
                switch (key) {
                    case "classDescription": if(val !== originalDescription) return val; break;
                    case "startTime": if(new Date(val).toString() !== originalStartTime) return val; break;
                    case "endTime": if(new Date(val).toString() !== originalEndTime) return val; break;
                    case "dueTime": if(new Date(val).toString() !== originalDueTime) return val; break;
                    case "originalStartTime": case "originalEndTime": case "originalDueTime": case "didDelete": case "dueDate": return undefined;
                    default: return val;
                }
            })
            fetch(`http://localhost:5000/${requestString}`,{
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: requestBody
            }).then(response =>{
                window.location.reload(false);
            })
        }
    }

    validateAny(){
        return(this.state.classDescription !== this.props.skemabrikContext.description ||
            new Date(this.state.startTime).toString() !== new Date(this.state.originalStartTime).toString() ||
            new Date(this.state.endTime).toString() !== new Date(this.state.originalEndTime).toString() ||
            new Date(this.state.dueTime).toString() !== new Date(this.state.originalDueTime).toString())
    }

    render(){
        const details = this.props.skemabrikContext.description;
        const subject = this.props.skemabrikContext.subject;
        const startTime = this.state.originalStartTime;
        const endTime = this.state.originalEndTime;
        const dueTime = this.state.originalDueTime;
        const date = this.props.type === 'schedule' ? formatDate(startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate()) : formatDate(dueTime.getFullYear(), dueTime.getMonth() + 1, dueTime.getDate());
        return(
            ReactDOM.createPortal(
                <div className={`editLessonModal ${subject}`}>
                    <div onClick={this.handleClick} className="close">&#10006;</div>
                    <form className="formContainer" onSubmit={this.handleSubmit}>
                        <fieldset className='skemabrikForm'>
                            <p className="inputText">Dato</p>
                            <input type="date" className="inputText" name={this.props.type === 'schedule' ? "date" : "dueDate"} data-testid={"date"+this.props.type} defaultValue={date} onChange={this.handleChange}></input>
                            {this.props.type === 'schedule' ?
                            [
                            <p key="startText" className="inputText">Start</p>,
                            <input key="startInput" type="time" className="inputText" name="startTime" data-testid="startTime" defaultValue={toHHMM(startTime)} onChange={this.handleChange}></input>,
                            <p key="endText" className="inputText">Slut</p>,
                            <input key="EndInput" type="time" className="inputText" name="endTime" data-testid="endTime" defaultValue={toHHMM(endTime)} onChange={this.handleChange}></input>
                            ] : 
                            [
                            <p key="dueText" className="inputText">Afleveres</p>,
                            <input key="dueInput" type="time" className="inputText" name="dueTime" data-testid="dueTime" defaultValue={toHHMM(dueTime)} onChange={this.handleChange}></input> 
                            ]
                            }
                            <textarea className="twoColumnWide" name="classDescription" data-testid={"classDescription"+this.props.type} defaultValue={details} maxLength="512" placeholder="Beskrivelse af time" onChange={this.handleChange}></textarea>
                            <input disabled={this.validateAny() ? null : 'disabled'} className="twoColumnWide submitButton" type="submit" name="change" data-testid="submit" value="Gem"></input>
                            <input className="twoColumnWide deleteButton" type="submit" name="delete" value="SLET"></input>
                        </fieldset>
                    </form>
                    <div className="skemabrikModalText textLeft">Rediger {`${this.props.type === 'schedule' ? 'Skemabrik' : 'Aflevering'}`}</div>
                </div>,
                document.getElementById('root')
            )
        )
    }
}