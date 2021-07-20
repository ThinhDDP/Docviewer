import firebase from 'firebase';
import React from 'react'
import "firebase/auth"
import './Login.css'



export default class Login extends React.Component {
    constructor(){
        super();
        this.state = {
            email : '',
            password: ''
        }
        this.handleChangesEmail = this.handleChangesEmail.bind(this)
        this.handleChangesPassword = this.handleChangesPassword.bind(this)
    }
    logIn(email, password){
        if (email === '' || password == ''){
            document.getElementById('ref').innerHTML = "Password or email must not be empty"
            document.getElementById('ref').style.color = "red"
            return
        }
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location.href = "/"

            })
            .catch((e) => {
                console.log(e.code)
                if (e.code == "auth/wrong-password"){
                    document.getElementById('ref').innerHTML = "Wrong password"
                    document.getElementById('ref').style.color = "red"
                }else if(e.code == "auth/app-deleted"){
                    document.getElementById("ref").innerHTML = "App deleted"
                    document.getElementById("ref").style.color = "red"
                }else if(e.code == "auth/app-not-authorized"){
                    document.getElementById("ref").innerHTML = "App not authorized"
                    document.getElementById("ref").style.color = "red"
                }else if(e.code == "auth/argument-error"){
                    document.getElementById("ref").innerHTML = "There is an argument error"
                    document.getElementById("ref").style.color = "red"

                }else if(e.code == "auth/user-disabled"){
                    document.getElementById("ref").innerHTML = "The user has been disabled"
                    document.getElementById("ref").style.color = "red"
                }else if(e.code == "auth/web-storage-unsupported"){
                    document.getElementById("ref").innerHTML = "You are using unsupported browser"
                    document.getElementById("ref").style.color = "red"
                }
            })
    
    }
    handleChangesEmail(event){
        this.setState({
            email: event.target.value
        })
    }
    handleChangesPassword(event){
        this.setState({
            password: event.target.value
        })
    }
    render() {
        return (
            <div className="wrapper">
                <div className="bg">
                    <div className='content'>
                    <p id="ref"></p>
                    <div className="title-wrapper">
                        <input required value={this.state.email} placeholder="Email or Username" onChange={this.handleChangesEmail}></input>
                    </div>
                    <div className="input-wrapper">
                        <input required value={this.state.password} type="password" placeholder="Password" onChange={this.handleChangesPassword}></input>
                    </div>
                    <p>Forgot your password? <a href="#">Reset it</a></p> 
                    <button className="btn" onClick={() => this.logIn(this.state.email, this.state.password)}>LOG IN</button>
                    <p>Don't have an account? <a href='/register' target="_blank" >Register</a></p>
                    </div>
                </div>
                </div>
        )
    }
}