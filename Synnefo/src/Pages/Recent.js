import React from "react";
import Open from './Open.js'

export default class Recent extends React.Component {
    constructor(){
        super()
        this.state = {
            code: 9021
        }
    }
    render(){
        return(
        <Open code={this.state.code}/>
        )
    }
}