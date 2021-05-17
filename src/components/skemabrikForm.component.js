import React, { Component } from "react";
import { UserContext } from '../UserContext';
import DidSubmitModal from './didSubmitModal.component';

export default class SkemabrikForm extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props);
        this.state = {
            id: '',
            date: new Date(),
            dueDate: new Date(),
            dueTime: '',
            startTime: '',
            endTime: '',
            subject: '',
            klasser: [],
            class: '',
            assignmentDescription: '',
            classDescription: '',
            advanced: false,
            didSubmit: false,
            assignmentToggle: false,
            fileSelected: false, 
            file: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateAll = this.validateAll.bind(this);
        this.jsonfilter = this.jsonfilter.bind(this);
        this.uploadClass = this.uploadClass.bind(this);
    }

    /* Makes sure that only needed information is sent via fetch. 
    If we have not chosen an assignment, we will not send the those fields */
    jsonfilter(key, val){
        if(this.state.assignmentToggle){
            switch (key){
                case "advanced": case "klasser": case "didSubmit": case "file": case "fileSelected":
                     return undefined;
                default: return val;
            }
        } else {
            switch (key) {
                case "advanced": case "klasser": case "didSubmit": case "file": case "fileSelected":
                case "classDescription": case "assignmentDescription":
                    return undefined;
                default: return val;
            }
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", this.state.file)

        if(this.state.fileSelected){
            fetch("http://localhost:5000/upload",{
                method: 'POST',
                body: formData,
            }).then(response => response.json())
            .then(fileId =>{
                this.setState({
                    fileId: fileId
                }, () =>{
                    let requestBody = JSON.stringify(this.state, this.jsonfilter)
                    console.log(requestBody);
                    this.uploadClass(requestBody);
                })
            })
        }
        else{
            let requestBody = JSON.stringify(this.state, this.jsonfilter)
            this.uploadClass(requestBody)
        }
        
    }

    uploadClass(requestBody){
        fetch("http://localhost:5000/classes",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: requestBody
        }).then(response =>{
            if(response.insertedId){
                console.log("yep")
            }
        })
    }

    handleChange(event){
        const target = event.target.name;
        const value = event.target.value;
        
        if(target === "advanced" || target === "assignmentToggle"){
            this.setState(prevState =>({
                [target]: !prevState[target]
            }));
        } else if(target === "file"){
            this.setState({
                fileSelected: true,
                file: event.target.files[0],
            })
        }
        else {
            this.setState({ 
                [target]: value
            });
        }
    }

    validateAll(){
        /* Returns true if all these states are filled out */
        return (this.state.id &&
                this.state.date &&
                this.state.startTime &&
                this.state.endTime &&
                this.state.subject &&
                this.state.class &&
                this.state.classDescription &&
                /* Have not pressed the toggle OR have pressed the toggle AND required for assignment is set */
                (!this.state.assignmentToggle || 
                    (this.state.assignmentToggle && 
                    this.state.assignmentDescription &&
                    this.state.dueDate &&
                    this.state.dueTime)));
    }

    componentDidMount(){
        let user = this.context;
        this.setState({
            id: user.id,
        })
        fetch(`http://localhost:5000/classes/${user.id}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(response =>{
            this.setState({klasser: response})
        })
    } 

    render(){
        const fag = ["Dansk", "Matematik", "Engelsk", "Religion", "Historie", "N/T", "Billedkunst", "Idræt", "Pause"]
        
        return(
            <form className="formContainer" data-testid="formContainer" onSubmit={this.handleSubmit}>
                <fieldset className="opretSkemabrik">
                    <label className="inputText" htmlFor="date">Vælg dag</label>
                    <input type="date" name="date" data-testid="date" value={this.state.date} onChange={this.handleChange}></input>
                    <label className="inputText" htmlFor="startTime">Start tidspunkt</label>
                    <input type="time" name="startTime" data-testid="startTime" value={this.state.startTime} onChange={this.handleChange}></input>                
                    <label className="inputText" htmlFor="endTime">Slut tidspunkt</label>
                    <input type="time" name="endTime" data-testid="endTime" value={this.state.endTime} onChange={this.handleChange}></input>
                    <div className="advancedGrid">
                        <label className="inputText" htmlFor="subject">Fag</label>
                        <label className="inputText advancedText" htmlFor="advanced">Avanceret</label>
                        <input className="checkbox" type="checkbox" name="advanced" value={this.state.advanced} data-testid="advanced" onChange={this.handleChange}></input>
                    </div>
                    <select name="subject" data-testid="subject" onChange={this.handleChange}>
                        <option value="" selected disabled hidden>Fag</option>
                        {fag.map(fag => {
                            return <option key={fag} data-testid="subjectOption" value={fag}>{fag}</option>
                        })}
                    </select>
                    <label className="inputText" htmlFor="class">Klasse</label>
                    <select name="class" data-testid="class" onChange={this.handleChange}>
                        <option value="" selected disabled hidden>Klasse</option>
                        {this.state.klasser.map(klasse =>{
                            return <option key={klasse} data-testid="classOption" value={klasse}>{klasse}</option>
                        })}
                    </select>
                    <div className="advancedGrid">
                        <label className="inputText" htmlFor="class">Aflevering</label>
                        <input className="checkbox" type="checkbox" name="assignmentToggle" value={this.state.assignmentToggle} data-testid="assignmentToggle" onChange={this.handleChange}></input>
                    </div>
                    
                    <label className="inputText twoColumnWide" htmlFor="classDescription">Beskrivelse af time:</label>
                    <textarea className="twoColumnWide" name="classDescription" maxLength="512" data-testid="description" placeholder="Beskrivelse af time" onChange={this.handleChange}></textarea>
                    {this.state.assignmentToggle ?[
                        <label key="dateLabel" className="inputText" htmlFor="dueDate">Vælg afleverings dag</label>,
                        <input key="date"type="date" name="dueDate" data-testid="date" value={this.state.dueDate} onChange={this.handleChange}></input>,
                        <label key="startTimeLabel" className="inputText" htmlFor="dueTime">Afleverings tidspunkt</label>,
                        <input key="startTime" type="time" name="dueTime" data-testid="startTime" value={this.state.dueTime} onChange={this.handleChange}></input>,
                        <textarea key="description" className="twoColumnWide" name="assignmentDescription" maxLength="512" data-testid="description" placeholder="Beskrivelse af aflevering" onChange={this.handleChange}></textarea>
                    ]: null}
                    <input name="file" type="file" onChange={this.handleChange}></input>
                    <input disabled={this.validateAll() ? null : 'disabled'} className="twoColumnWide submitButton" type="submit" name="submit" data-testid="submit" value="Opret"></input>
                </fieldset>
                {this.state.didSubmit ? <DidSubmitModal/> : null}
            </form>
        )
    }
}
