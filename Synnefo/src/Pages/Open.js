import firebase from "firebase";
import React from "react";
import "./Open.css";

var startTime;
var endTime;

var url = null;
// function resizeIframe(obj) {
//     obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
// }


export default class Open extends React.Component {
    constructor() {
        super()
        this.state = {
            state: 'idle',
            minutes: 0,
            seconds: 0
        }

    }

    countUp(currentTime){
        let offset = Math.floor((Date.now() - currentTime) / 1000)


        this.setState({
            minutes : (offset / 60) | 0,
            seconds : (offset % 60) | 0
    
        })
    }
    componentDidMount(){

    }

    render() {
        if (this.state.state == 'idle'){
            return(
                <div className="wrapper">
                <div className="bg">
                    <div className="content">
                        <div className="codeInput">
                            <p>Input the code to open the document</p>
                            <input type="text" onChange={this.handleCodeChange}>
                            </input><br />
                            <p style={{ color: "red", display: "none" }} id="error">Your code is invalid</p>
                            <button ref={this.btnRef} onClick={this.showDoc}>View</button>

                        </div>
                    </div>
                    </div>
                </div>
            )
        }
    }
}