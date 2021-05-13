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
            startTime: '',
            endTime: '',
            subject: '',
            advanced: false,
            klasser: [],
            class: '',
            description: '',
            didSubmit: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateAll = this.validateAll.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        fetch("http://localhost:5000/classes",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state, (key, val) => {
                switch (key) {
                    case "advanced": case "klasser": return undefined;
                    default: return val;
                }
            }),
        })
        .then(response =>{
            this.setState({didSubmit: true})
        })
    }

    handleChange(event){
        const target = event.target.name;
        const value = event.target.value;
        if(target === "advanced"){
            this.setState(prevState =>({
                advanced: !prevState.advanced
            }));
        } else {
            this.setState({
                [target]: value
            });
        }
        /* console.log(target + ": " + value) */
    }

    validateAll(){
        return !(this.state.id &&
                this.state.date &&
                this.state.startTime &&
                this.state.endTime &&
                this.state.subject &&
                this.state.class &&
                this.state.description);
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
            <form className="formContainer" onSubmit={this.handleSubmit}>
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
                    <select defaultValue={fag[0]} name="subject" data-testid="subject" onChange={this.handleChange}>
                        {fag.map(fag => {
                            return <option key={fag} data-testid="subjectOption" value={fag}>{fag}</option>
                        })}
                    </select>
                    <label className="inputText" htmlFor="class">Klasse</label>
                    <select defaultValue={this.state.klasser[0]} name="class" data-testid="class" onChange={this.handleChange}>
                        {this.state.klasser.map(klasse =>{
                            return <option key={klasse} data-testid="classOption" value={klasse}>{klasse}</option>
                        })}
                    </select>

                    <label className="inputText twoColumnWide" htmlFor="description">Beskrivelse:</label>
                    <textarea className="twoColumnWide" name="description" maxLength="512" data-testid="description" onChange={this.handleChange}></textarea> 
                    <input disabled={this.validateAll() ? 'disabled' : null} className="twoColumnWide submitButton" type="submit" name="submit" data-testid="submit" value="Opret"></input>
                </fieldset>
                {this.state.didSubmit ? <DidSubmitModal/> : null}
            </form>
        )
    }
}