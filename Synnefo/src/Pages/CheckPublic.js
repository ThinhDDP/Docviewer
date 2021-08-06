import React from 'react';
import "./CheckPublic.css";

export default class CheckPublic extends React.Component{
    constructor(){
        super()
        this.state = {
            output: "",
            code: ""
        }
        
        this.checkPublic = this.checkPublic.bind(this)
        this.handleCodeChange = this.handleCodeChange.bind(this)
    }
    checkPublic(){
        let code = this.state.code
        //do some stuff
        let publicBool = false
        //set the variable to whatever is it
        if(publicBool == false){
            this.setState({
                output: "The document you just typed is neither public or exists"
            })
            document.getElementById("output").style.color = "red"
        }else{
            this.setState({
                output: "This document is public"
            })
            document.getElementById("output").style.color = "green"
        }
    }
    handleCodeChange(event){
        this.setState({
            code: event.target.value
        })
    }
    render(){
        return(
            <div>
                <div className="wrapper">
                    <div className="bg">
                        <input type="text" placeholder="DOCUMENT CODE" onChange={this.handleCodeChange}></input>
                        <button className="btn" onClick={this.checkPublic}>Check if the document is public</button>
                        <p id="output">{this.state.output}</p>
                    </div>
                </div>
            </div>
        )
    }
}