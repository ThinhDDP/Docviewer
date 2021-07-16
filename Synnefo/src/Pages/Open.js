import firebase from "firebase";
import React from "react";
import "./Open.css";

export default class Open extends React.Component {
    constructor() {
        super()
        this.state ={
            code : null,
        }
        this.btnRef = React.createRef();
        this.handleCodeChange = this.handleCodeChange.bind(this)
        this.docContent = React.createRef()
        this.showDoc = this.showDoc.bind(this)
    }

    handleCodeChange(event){
        this.setState({
            code : event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }
    showDoc(){
        let code = this.state.code;
        let docContentRef = this.docContent.current;
        let docContentId = document.getElementById("docContent")
        console.log(code)

        //...

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
                            <button ref={this.btnRef} onClick={this.showDoc}>View</button>

                        </div>
                        <iframe id="docContent" ref={this.docContent} style={{ display: "none" }}></iframe>
                    </div>
                </div>
            </div>
        )
    }
}