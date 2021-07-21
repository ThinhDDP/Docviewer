import React from 'react'
import firebase from '../firebase'
import './Create.css'
import axios from 'axios'
import ReactDOM from 'react-dom';

let user = firebase.auth().currentUser //This is a lazy way because .currentUser is async call, but it will prob load before the user finish typing

class Create extends React.Component{
    constructor(){
        super();
        this.state = {
            state : 'idle',
            link : '',
            title: '',
            isLoading: false,
            code: null
        }
        this.token = null
        this.checkboxRef = React.createRef() 
        this.serverURL = 'http://localhost:4444/docviewerapi/asia-east2/api/create'

    }
    linkAccount(){
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/drive.readonly');
        this.setState({
            isLoading: true
        })
        firebase.auth()
            .signInWithPopup(provider)
            .then(result => {
                this.token = result.credential.accessToken
                console.log(this.token)
                this.listFiles()
            })
            .catch(e => {
                console.log(e)
            })
    }
    listFiles(){
        axios.get('https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.document%27%20and%20trashed%3Dfalse', {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Length': 100,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            this.setState({
                isLoading: false,
                state: 'choose'
            })
            console.log(res)
            this.createButtons(res.data.files)
            
        })
        .catch(e => {
            console.log(e)
        })
    }
    createButtons(files){
        for (let i = 0; i < files.length; ++i){
            let newBtn = document.createElement('button')
            newBtn.innerHTML = files[i].name
            newBtn.className = "fileBtn"
            newBtn.addEventListener('click', () => this.sendIdToServer(files[i].id))
            document.getElementById('container').appendChild(newBtn)
        }
    }
    sendIdToServer(id){
        console.log(id)
    }
    render(){
        if (this.state.state == 'idle' && !this.state.isLoading){
            return(
                <div className="wrapper">
                <div className="bg">
                    <div className='content'>
                    <button class="g-button" onClick={() => this.linkAccount()}>
                        <img class="g-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png" alt="Google Logo"/>
                        <p class="g-text">Sign in with Google</p>
                    </button>
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
        else if(this.state.state = "choose"){
            return(<div className="wrapper">
            <div className="bg">
                <div className="content flex" id="container">
                <h6>Choose the file you would like to present</h6>
     
                </div>
            </div>
            </div>)
        }
    }
}

export default Create;