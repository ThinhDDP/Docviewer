import axios from "axios";
import firebase from "firebase";
import React from "react";
import "./Open.css";
import marked from 'marked'
import Loading from "../Components/Loading";
import { AiOutlineClockCircle } from "react-icons/ai"
// function resizeIframe(obj) {
//     obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
// }


export default class Open extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: 'idle',
            minutes: 0,
            seconds: 0,
            code: props.code ? props.code : '',
            isLoading: true,
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.contentRef = React.createRef()
        this.email = null
        this.startTime = null
        this.uid = null
        this.docx = React.createRef()
    }
    getURLParams() {
        let url = new URL(window.location)
        let idParams = new URLSearchParams(url.search)
        let code = idParams.get('code')
        if (code != null) {
            this.setState({
                code: idParams.get('code')
            }, () => { this.sendCode(this.state.code) })
        }
        return
    }
    countUp(currentTime) {
        let offset = Math.floor((Date.now() - currentTime) / 1000)


        this.setState({
            minutes: (offset / 60) | 0,
            seconds: (offset % 60) | 0

        })
    }
    componentDidMount() {


        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.email = user.email
                this.uid = user.uid
            }
            this.setState({
                isLoading: false
            })
            this.getURLParams()
            if (this.state.code) {
                this.sendCode(this.state.code)
            }
        })

    }
    sendCode() {
        this.setState({
            isLoading: true
        })
        let data = {
            uid: this.uid
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

    assignDoc(data) {
        if (data[1] == "office") {
            this.contentRef.current.innerHTML = data[0]
        }
        else if (data[1] == "google") {
            this.contentRef.current.innerHTML = data[0].data
        }
    }
    handleInputChange(e) {
        this.setState({
            code: e.target.value.length > 4 ? e.target.value.slice(0, 4) : e.target.value
        })

    }
    startTimer() {
        this.startTime = Date.now()
        setInterval(() => {
            this.countUp(this.startTime)
        }, 1000);
    }
    docComplete() {
        let seconds = Math.floor((Date.now() - this.startTime) / 1000)
        let data = {
            "seconds": seconds,
            "uid": this.uid,
            "code": this.state.code
        }
        axios.post('http://localhost:3333/docviewerapi/asia-east2/api/update', data).then(result => {
            switch (result.data) {
                case 'No account':
                    alert("You must have an account to do this")
                    break
                case 'This user has already completed this document':
                    alert("You have already completed this document")
                    break
                case 'Done':
                    alert("Your response has been recieved")
                    break

            }
            window.location.reload()
        })
    }
    render() {
        if (this.state.isLoading) {
            return (
                <Loading />
            )
        }
        else if (!this.state.isLoading && this.state.state === "idle") {
            return (
                <div className="wrapper">
                    <div className="bg">
                        <div className="content codeInput">
                            <input value={this.state.code} onChange={this.handleInputChange} placeholder="Document code"></input><br />
                            <button onClick={() => this.sendCode()}>VIEW</button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (!this.state.isLoading && this.state.state === 'open') {
            return (
                <div className='doc-wrapper'>
                    
                    <div className="timer-box">
                        <AiOutlineClockCircle />
                        <span>You have been reading for {this.state.minutes}:{this.state.seconds}</span>
                    </div>

                    <div className="doc">

                        <div ref={this.contentRef} >

                        </div>
                        <button onClick={() => this.docComplete()}>Complete</button>
                    </div>
                </div>
            )
        }
    }
}