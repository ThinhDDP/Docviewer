import React from 'react'
import firebase from '../firebase'
import './Create.css'
import axios from 'axios'
import logo from '../Images/Spinning.gif'

let user = firebase.auth().currentUser //This is a lazy way because .currentUser is async call, but it will prob load before the user finish typing

class Create extends React.Component{
    constructor(){
        super();
        this.state = {
            state : 'idle',
            link : '',
            'title': '',
            isLoading: false,
            code: null
        }
        this.handleInputChangesLink = this.handleInputChangesLink.bind(this)
        this.handleInputChangesTitle = this.handleInputChangesTitle.bind(this)
        this.checkboxRef = React.createRef() 
        this.serverURL = 'http://localhost:4444/docviewerapi/asia-east2/api/create'

    }
    async createDoc(){
        this.setState({
            isLoading: true
        })
        if (this.checkboxRef.current.checked){
            if (user == null){
                if (!alert("You must be signed in to use this feauture")){ //TODO: Turns this into a p tag
                    window.location.href = '/'
                }
            }
        }
        else{
            let data = {
                title: this.state.title,
                link: this.state.link
            }
            let response = await axios.post(this.serverURL, data)
            if (response != undefined){
                this.setState({
                    isLoading: false
                })
            }
            this.setState({
                code: response.data
            })
        }
    }
    handleInputChangesLink(event){
        this.setState({
            link: event.target.value
        })
    }


    handleInputChangesTitle(event){
        this.setState({
            title: event.target.value
        })
    }
    render(){
        if ((this.state.state == 'idle' || this.state.link == '' || this.state.link == null) && !this.state.isLoading){
            return(
                <div className="wrapper">
                <div className="bg">
                    <div className='content'>
                    <div className="title-wrapper">
                        <input value={this.state.title} placeholder="Document's title" onChange={this.handleInputChangesTitle}></input>
                    </div>
                    <div className="input-wrapper">
                        <input value={this.state.link} placeholder="Google Document preview link" onChange={this.handleInputChangesLink}></input>
                    </div>
                    <p>Don't know what that is? <a href='https://www.youtube.com/watch?v=AAeloLXO8T0' target="_blank">See this</a></p>
                    <input ref={this.checkboxRef} type="checkbox"></input><label>Only me can check this file info</label>
                    <br/>
                    <button className="btn" onClick={() => this.createDoc()}>CREATE</button>
                    <h2>{this.state.code ? `THIS IS THE CODE: ${this.state.code}` : ''}</h2>
                    </div>
                </div>
                </div>
            )
        }
        else if (this.state.isLoading){
            return(
            <div className="wrapper">
                <div className="bg">
                    <div className='content'>
                        <h1>Creating your document</h1>
                        <svg class="load"version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 100 100" enable-background="new 0 0 100 100">
                            <path fill="#fff" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
                            c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
                            <animateTransform 
                                attributeName="transform" 
                                attributeType="XML" 
                                type="rotate"
                                dur="2s" 
                                from="0 50 50"
                                to="360 50 50" 
                                repeatCount="indefinite" />
                            </path>
                            ]<path fill="#fff" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
                            c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
                            <animateTransform 
                            attributeName="transform" 
                            ttributeType="XML" 
                            type="rotate"
                            dur="1s" 
                            from="0 50 50"
                            to="-360 50 50" 
                            repeatCount="indefinite" />
                     </path>
                    <path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
                            L82,35.7z">
                            <animateTransform 
                            attributeName="transform" 
                            attributeType="XML" 
                            type="rotate"
                            dur="2s" 
                            from="0 50 50"
                            to="360 50 50" 
                            repeatCount="indefinite" />
                        </path>
                    </svg>
                    </div>
                </div>
                </div>
            )
        }
    }
}

export default Create;