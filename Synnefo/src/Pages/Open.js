import axios from "axios";
import firebase from "firebase";
import React from "react";
import "./Open.css";
import marked from 'marked'



// function resizeIframe(obj) {
//     obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
// }


export default class Open extends React.Component {
    constructor() {
        super()
        this.state = {
            state: 'idle',
            minutes: 0,
            seconds: 0,
            code: '',
            isLoading: true
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.contentRef = React.createRef()
        this.email = null
    }

    countUp(currentTime){
        let offset = Math.floor((Date.now() - currentTime) / 1000)


        this.setState({
            minutes : (offset / 60) | 0,
            seconds : (offset % 60) | 0
    
        })
    }
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.email = user.email
            }
            this.setState({
                isLoading: false
            })
        })
        
    }
    sendCode(){
        this.setState({
            isLoading: true
        })
        let data = {
            email: this.email
        }
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/match/${this.state.code}`, data).then(result => {
            this.setState({
                isLoading: false,
                state: 'open'
            })
            this.assignDoc(result.data)
            this.startTimer()
        })
    }
    assignDoc(data){
        this.contentRef.current.innerHTML = marked(data)
    }
    handleInputChange(e){                                
        this.setState({
            code: e.target.value.length > 4 ? e.target.value.slice(0, 4) : e.target.value
        })
        
    }
    startTimer(){
        let startTime = Date.now()
        setInterval(() => {
            this.countUp(startTime)
        }, 1000);
    }
    render() {
        if(this.state.isLoading){
            return(
                <div className="wrapper">
                    <div className="bg">
                        <div className="content codeInput">
                            <h4>Fetching data</h4>
                        </div>
                    </div>
                </div>
            )
        }
        else if(!this.state.isLoading && this.state.state === "idle"){
            return(
                <div className="wrapper">
                    <div className="bg">
                        <div className="content codeInput">
                            <input value={this.state.code} onChange={this.handleInputChange} placeholder="Document code"></input><br/>
                            <button onClick={() => this.sendCode()}>VIEW</button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (!this.state.isLoading && this.state.state === 'open'){
            return(
                <div className='doc-wrapper'>
                <span>You have been reading for {this.state.minutes}:{this.state.seconds}</span>
                    <div className="doc">
                        
                        <div ref={this.contentRef} >
                            Test
                        </div>
                    </div>
                    </div>
            )
        }
    }
}