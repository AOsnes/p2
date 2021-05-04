import React, { Component } from "react";
import { UserContext } from '../UserContext';

export default class SkemabrikForm extends Component{
    static contextType = UserContext;
    constructor(props){
        super(props);
        this.state = {
            id: '',
            date: '',
            startTime: '',
            endTime: '',
            subject: '',
            advanced: false,
            klasser:[],
            class:'',
            description:'',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        .then(response => response.json())
        .then(response =>{
            console.log(response);
        })
    }

    handleChange(event){
        const target = event.target.name;
        const value = event.target.value;
        console.log(target)
        if(target === "advanced"){
            this.setState(prevState =>({
                advanced: !prevState.advanced
            }));
        } else {
            this.setState({
                [target]: value
            });
        }
    }

    componentDidMount(){
        let user = this.context;
        this.setState({
            id: user.id,
        })
        /* 
        fetch("http://localhost:5000/class", {
            method: 'GET',
        })
        .then(response => response.json())
        .then(response =>{
            TODO: Opdater state med den response vi får.
            Der er ikke oprettet et endpoint endnu, så afventer.
            this.setState({klasser: response.classes})
        })
        */
    } 

    render(){
        const fag = ["Dansk", "Matematik", "Engelsk", "Religion", "Historie", "N/T", "Billedkunst", "Idræt", "Pause"]
        const tempClasses = ["sw2b2-20", "sw2b2-21", "sw2b2-22"];
        return(
            <form className="formContainer" onSubmit={this.handleSubmit}>
                <fieldset className="opretSkemabrik">
                    <label className="inputText" htmlFor="date">Vælg dag</label>
                    <input type="date" name="date" value={this.state.date} onChange={this.handleChange}></input>
                    <label className="inputText" htmlFor="startTime">Start tidspunkt</label>
                    <input type="time" name="startTime" value={this.state.startTime} onChange={this.handleChange}></input>                
                    <label className="inputText" htmlFor="endTime">Slut tidspunkt</label>
                    <input type="time" name="endTime" value={this.state.endTime} onChange={this.handleChange}></input>
                    <div className="advancedGrid">
                        <label className="inputText" htmlFor="subject">Fag</label>
                        <label className="inputText advancedText" htmlFor="advanced">Avanceret</label>
                        <input className="checkbox" type="checkbox" name="advanced" onChange={this.handleChange}></input>
                    </div>
                    <select name="subject" onChange={this.handleChange}>
                        <option selected disabled>Vælg et fag</option>
                        {fag.map(fag => {
                            return <option key={fag} value={fag}>{fag}</option>
                        })}
                    </select>
                    <label className="inputText" htmlFor="class">Klasse</label>
                    <select name="class" onChange={this.handleChange}>
                        <option selected disabled>Vælg en klasse</option>
                        {tempClasses.map(klasse =>{
                            return <option key={klasse} value={klasse}>{klasse}</option>
                        })}
                    </select>

                    <label className="inputText twoColumnWide" htmlFor="advanced">Beskrivelse:</label>
                    <textarea className="twoColumnWide" name="description" maxLength="512" onChange={this.handleChange}></textarea> 
                    <input className="twoColumnWide" type="submit" name="submit" value="Opret"></input>

                </fieldset>
            </form>
        )
    }
}