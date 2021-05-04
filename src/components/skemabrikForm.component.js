import React, { Component } from "react";


export default class SkemabrikForm extends Component{
    constructor(props){
        super(props);

        this.state = {date: '', startTime: '', slutTime: '',}

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
    }

    handleChange(event){

    }

    render(){
        const fag = ["Dansk", "Matematik", "Engelsk", "Religion", "Historie", "N/T", "Billedkunst", "Idræt", "Pause"]
        return(
            <form onSubmit={this.handleSubmit}>
                <fieldset className="opretSkemabrik">
                    <legend className="legend">Opret time</legend>
                    <label className="inputText" htmlFor="date">Vælg dag</label>
                    <input type="date" name="date" value="yep" onChange={this.handleChange}></input>
                    <label className="inputText" htmlFor="startTime">Start tidspunkt</label>
                    <input type="time" name="startTime" value="19:30" onChange={this.handleChange}></input>                
                    <label className="inputText" htmlFor="endTime">Slut tidspunkt</label>
                    <input type="time" name="endTime" value="20:00" onChange={this.handleChange}></input>
                    <label className="inputText" htmlFor="fag">Fag</label>
                    <select type="" name="fag" value="Vælg fag" onChange={this.handleChange}>
                        {fag.map(fag => {
                            return <option key={fag} value={fag}>{fag}</option>
                        })}    
                    </select>                
                    <label className="inputText" htmlFor="advanced">Avanceret</label>
                    <input type="checkbox" name="advanced" value="false" onChange={this.handleChange}></input>    
                    <input className="wideOption" type="submit" name="submit" value="Opret"></input>           
                </fieldset>
            </form>
        )
    }
}