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
            classDescription: '',
            originalStartTime: new Date(this.props.skemabrikContext.startTime),
            originalEndTime: new Date(this.props.skemabrikContext.endTime),
            startTime: new Date(this.props.skemabrikContext.startTime),
            endTime: new Date(this.props.skemabrikContext.endTime),
            originalDate: '',
            date: '',
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
        if(target === "startTime"){
            let hours = value.split(":")
            change = new Date(this.state.startTime.setHours(hours[0], hours[1]))
        } else if(target === "endTime"){
            let hours = value.split(":")
            change = new Date(this.state.endTime.setHours(hours[0], hours[1]))
        } else if(target === "date"){
            let date = value.split("-");
            startTime = new Date(date[0], date[1] - 1, date[2], this.state.startTime.getHours(), this.state.startTime.getMinutes())
            endTime = new Date(date[0], date[1] - 1, date[2], this.state.endTime.getHours(), this.state.endTime.getMinutes())
        } else {
            change = value
        }
        if(target !== "date"){
            this.setState({
                [target]: change
            });
        } else {
            this.setState({
                startTime: startTime,
                endTime: endTime,
            });
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let submitter = event.nativeEvent.submitter.name; 
        if(submitter === "delete"){
            fetch(`http://localhost:5000/classes/${this.props.skemabrikContext._id}`,{
                method: 'DELETE',
            }).then(response =>{
                this.setState({
                    didDelete: true,
                },() =>{
                    window.location.reload(false);
                })
        })
        } else {
            let originalStartTime = new Date(this.state.originalStartTime).toString();
            let originalEndTime = new Date(this.state.originalEndTime).toString();
            let requestBody = JSON.stringify(this.state, (key, val) =>{
                switch (key) {
                    case "classDescription": if(val) return val; break;
                    case "startTime": if(new Date(val).toString() !== originalStartTime) return val; break;
                    case "endTime": if(new Date(val).toString() !== originalEndTime) return val; break;
                    case "originalStartTime": case "originalEndTime": case "didDelete": case "originalDate": case "date": return undefined;
                    default: return val;
                }
            })
            fetch(`http://localhost:5000/classes/${this.props.skemabrikContext._id}`,{
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: requestBody
            }).then(response =>{
                window.location.reload(false);
            })
        }
    }

    validateAny(){
        return(this.state.classDescription ||
            new Date(this.state.startTime).toString() !== new Date(this.state.originalStartTime).toString() ||
            new Date(this.state.endTime).toString() !== new Date(this.state.originalEndTime).toString())
    }

    componentDidMount(){
        this.setState({
            originalDate: formatDate(this.state.originalStartTime.getFullYear(), this.state.originalStartTime.getMonth() + 1, this.state.originalStartTime.getDate()),
            date: formatDate(this.state.originalStartTime.getFullYear(), this.state.originalStartTime.getMonth() + 1, this.state.originalStartTime.getDate()),
        })
    }

    render(){
        const details = this.props.skemabrikContext.description;
        const subject = this.props.skemabrikContext.subject;
        const startTime = this.state.originalStartTime;
        const endTime = this.state.originalEndTime;
        const date = formatDate(startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate());
        return(
            ReactDOM.createPortal(
                <div className={`editLessonModal ${subject}`}>
                    <div onClick={this.handleClick} className="close">&#10006;</div>
                    <form className="formContainer" onSubmit={this.handleSubmit}>
                        <fieldset className="skemabrikForm">
                            <p className="inputText">Dato</p>
                            <input type="date" className="inputText" name="date" defaultValue={date} onChange={this.handleChange}></input>
                            <p className="inputText">Start</p>
                            <input type="time" className="inputText" name="startTime" defaultValue={toHHMM(startTime)} onChange={this.handleChange}></input>
                            <p className="inputText">Slut</p>
                            <input type="time" className="inputText" name="endTime" defaultValue={toHHMM(endTime)} onChange={this.handleChange}></input>
                            <textarea className="twoColumnWide" name="classDescription" defaultValue={details} maxLength="512" placeholder="Beskrivelse af time" onChange={this.handleChange}></textarea>
                            <input disabled={this.validateAny() ? null : 'disabled'} className="twoColumnWide submitButton" type="submit" name="change" data-testid="submit" value="Gem"></input>
                            <input className="twoColumnWide deleteButton" type="submit" name="delete" value="SLET"></input>
                        </fieldset>
                    </form>
                    <div className="skemabrikModalText textLeft">Rediger Skemabrik</div>
                </div>,
                document.getElementById('root')
            )
        )
    }
}