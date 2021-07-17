import firebase from "firebase";
import React from "react";
import "./Open.css";
var timeInseconds;
var url = null;
function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
}

export default class Open extends React.Component {
    constructor() {
        super()
        this.state ={
            code : null,
        }
        this.btnRef = React.createRef();
        this.handleCodeChange = this.handleCodeChange.bind(this)
        
        this.showDoc = this.showDoc.bind(this)
        this.stopViewing = this.stopViewing.bind(this)
    }

    handleCodeChange(event){
        this.setState({
            code : event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }
    stopViewing(){
        url = null;
        seconds = parseInt(document.getElementById("timer").innerText);// here is your seconds


        window.location = "/";
        
        

    }
    showDoc(){
        let code = this.state.code;
        let docContentId = document.getElementById("docContent")
        
         //change url variable, do some stuff and insert url here
        url;
        //....

        if(url !== null){
            docContentId.style.display = "block"
            document.getElementById("doc").src = url;
            resizeIframe(document.getElementById("doc"))

            for(let i = 0; url !==null; i++){
                    setTimeout(function(){
                        document.getElementById("timer") = i
                    }, 1000)

                    
                    
            }


        }else{
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
                            <p style={{color: "red", display : "none"}} id="error">Your code is invalid</p>
                            <button ref={this.btnRef} onClick={this.showDoc}>View</button>

                        </div>
                        <div id="docContent" style={{display : "none"}}>
                            <p style={{textAlign : "left"}}>You have been viewing this document for: <p id="timer"></p></p>
                            <iframe id="doc"></iframe>
                            <button onClick={this.stopViewing}>Stop viewing</button>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}