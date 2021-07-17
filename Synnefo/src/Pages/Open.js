import firebase from "firebase";
import React from "react";
import "./Open.css";
var startTime;
var endTime;
var url = null;
export default class Open extends React.Component {
    constructor() {
        super()
        this.state = {
            code: null,
        }
        this.btnRef = React.createRef();
        this.handleCodeChange = this.handleCodeChange.bind(this)

        this.showDoc = this.showDoc.bind(this)
        this.stopViewing = this.stopViewing.bind(this)
    }
    handleCodeChange(event) {
        this.setState({
            code: event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }
    stopViewing() {
        url = null;
        let date = new Date();
        endTime = date.getSeconds();
        let time = endTime - startTime;
        //   time is the var u need;
        window.location = "/"
    }
    showDoc() {
        let code = this.state.code;
        let docContentId = document.getElementById("docContent")
        //change url variable, do some stuff and insert url here
        //....
       
        
        if (url !== null) {
            docContentId.style.display = "block"
            document.getElementById("doc").src = url
            let date = new Date();
            startTime = date.getSeconds()
            //for looping
            let second = 0;
            setInterval(() => {
                document.getElementById("timer").innerText = second.toString();
                second++
            }, 1000);
        } else {
            document.getElementById("error").style.display = "block"

        }

    }

    render() {
        return (
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
                        <div id="docContent" style={{ display: "none" }}>
                            <p >You have been viewing this document for: <span id="timer"> 0 </span> seconds</p>
                            <iframe id="doc"></iframe>
                            <button onClick={this.stopViewing}>Stop viewing</button>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}