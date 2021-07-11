
import React from 'react'
import './Login.css'
import firebase from '../firebase'

var storage = firebase.storage();
var storageRef = storage.ref();

export default class Register extends React.Component {
    constructor(){
        super();
        this.state = {
            email : '',
            password: '',
            name: ''
        }
        this.handleChangesEmail = this.handleChangesEmail.bind(this)
        this.handleChangesPassword = this.handleChangesPassword.bind(this)
        this.handleChangesName = this.handleChangesName.bind(this)
    }
    async logIn(email, password){
        if (email === '' || password == ''){
            document.getElementById('ref').innerHTML = "Password or email must not be empty"
            document.getElementById('ref').style.color = "red"
            return
        }
        let imageLink = await storageRef.child('users/Default/default.png').getDownloadURL()
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(result => {
                result.user.updateProfile({
                    displayName: this.state.name,
                    photoURL: imageLink
                })
                .then(() => {
                    window.location.href = "/"
                })
            })
            .catch((e) => {
                console.log(e)
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
    handleChangesName(event){
        this.setState({
            name: event.target.value
        })
    }
    render() {
        return (
            <div className="wrapper">
                <div className="bg">
                    <div className='content'>
                    <p id="ref"></p>
                    <div className="input-wrapper">
                        <input required value={this.state.name}  placeholder="Display Name" onChange={this.handleChangesName}></input>
                    </div>
                    <div className="title-wrapper">
                        <input required value={this.state.email} placeholder="Email" onChange={this.handleChangesEmail}></input>
                    </div>
                    <div className="input-wrapper">
                        <input required value={this.state.password} type="password" placeholder="Password" onChange={this.handleChangesPassword}></input>
                    </div>
                    <button className="btn" onClick={() => this.logIn(this.state.email, this.state.password)}>REGISTER</button>
                    <p>Already have an account? <a href='/login' target="_blank" >Login</a></p>
                    </div>
                </div>
                </div>
        )
    }
}