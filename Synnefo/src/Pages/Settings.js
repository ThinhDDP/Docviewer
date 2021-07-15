import firebase from '../firebase' //Firebase only needs to init once
import React from 'react';
import "./Settings.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

var imageRef;
let userCopy;

export default class settings extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            email: null,
            username: null,
            photoURL: null,

            reAuth_psw: null,
            password: null,
        }
        this.info = []
        // this.displayName = React.createRef(); Changing text by innerHTML, really?
        // this.email = React.createRef(); 
        // this.avatar = React.createRef();
        this.value = 0
        this.inputFile = React.createRef()
        this.progress = React.createRef()
        this.btnRef = React.createRef()
        this.uploadFile = this.uploadFile.bind(this)
        this.handleEmailChanges = this.handleEmailChanges.bind(this)
        this.handleUsernameChanges = this.handleUsernameChanges.bind(this)
        this.updateInfo = this.updateInfo.bind(this)


        this.reAuth_psw = React.createRef()
        this.reAuth_btn = React.createRef()

        this.handlePasswordReAuthChanges = this.handlePasswordReAuthChanges.bind(this)
        this.reAuth = this.reAuth.bind(this)

        this.changePSWbtn = React.createRef();
        this.changePSW = this.changePSW.bind(this)
        this.handlePasswordChanges = this.handlePasswordChanges.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //User will have a default avatar now, so photoURL will works
                this.setState({
                    isLoading: false, //Set isLoading to false here, adn React will update accordingly
                    email: user.email,
                    username: user.displayName,
                    photoURL: user.photoURL,




                })
                userCopy = firebase.auth().currentUser
                imageRef = firebase.storage().ref().child(`users/${user.uid}/profile.jpg`);
        
                
            }
            else {
                //Shouldn't happen, but we will redirect to home here
                window.location.href = "/"
            }
        })
    }


    openFile() {
        this.progress.current.style.display = "block"
        this.inputFile.current.click()

    }
    uploadFile(event) {
        event.stopPropagation()
        event.preventDefault()
        let file = event.target.files[0]
        let task = imageRef.put(file)
        task.on('state_change',
            (snapshot) => {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                this.progress.current.value = percent
                if (percent >= 100) {
                    this.progress.current.style.display = "none"
                    this.assignImage()
                }
            }
        )
    }

    async assignImage() {
        let photo = await imageRef.getDownloadURL()
        console.log(photo)
        userCopy.updateProfile({
            photoURL: photo
        }).then(() => {
            this.info[2] = userCopy.photoURL
            window.location.reload()
        }).catch((e) => {
            console.log(e)
        })


    }

    handlePasswordChanges(event) {
        this.setState({
            password: event.target.value

        })
        this.changePSWbtn.current.style.backgroundColor = "#5865F2"
    }
    handlePasswordReAuthChanges(event) {
        this.setState({
            reAuth_psw: event.target.value
        })
        this.reAuth_btn.current.style.backgroundColor = "#5865F2"
    }

    handleEmailChanges(event) {
        this.setState({
            email: event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }

    handleUsernameChanges(event) {
        this.setState({
            username: event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }

    updateInfo() {
        if (window.confirm("Do you really want to change your account info (This action cannot be undone)")) {
            userCopy.updateProfile({
                email: this.state.email,
                displayName: this.state.username
            }).then(() => {
                window.location.reload()
            }).catch((e) => {
                console.log(e)
            })
        }
    }
    changePSW() {
        if (window.confirm("Do you really want to change your password? (This action cannot be undone)")) {
            userCopy.updatePassword(this.state.password).then(() => {
                window.location = window.location;
            }).catch((e) => {
                document.getElementById("error").innerText = e;
                document.getElementById("error").style.color = "red"
            })
        }
    }
    reAuth() {
        let email = this.state.email;
        let password = this.state.reAuth_psw;




        let credential = firebase.auth.EmailAuthProvider.credential(email, password)
        console.log(email, password)

        if (email == "" || password == "") {
            document.getElementById("error").innerText = "Password or email must be not empty"
            document.getElementById("error").style.color = "red"
        } else {
            userCopy.reauthenticateWithCredential(credential).then(() => {
                document.getElementById("mainSecurity").style.display = "block"
                document.getElementById("reAuth-section").style.display = "none"
                document.getElementById("error").innerText = ""
            }).catch((e) => {
                document.getElementById("error").innerText = e
                document.getElementById("error").style.color = "red"
            })
        }


    }
    render() {
        if (this.state.isLoading) {
            return (<div className="wrapper">
                <div className="bg">
                    <div className="content">
                        <p id="loader">Loading user info</p>
                    </div>
                </div>
            </div>
            )
        }
        else {
            return (
                <div className="wrapper">
                    <div className="avatar">
                        <img src={this.state.photoURL}></img>
                        <input type='file' id='file' ref={this.inputFile} style={{ display: 'none' }} onChange={this.uploadFile} accept="image/*" />
                        <button onClick={() => this.openFile()}>Change avatar</button>
                        <progress ref={this.progress} id="file" min="0" value={this.value} max="100">{this.value}</progress>
                    </div>
                    <br />
                    <div className="bg">
                        <div className="content">
                            <Tabs>
                                <TabList>
                                    <Tab>Account info</Tab>
                                    <Tab>Security</Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="account-info" >
                                        <h2>Account info</h2>
                                        <p>Email</p>
                                        <input value={this.state.email} onChange={this.handleEmailChanges}></input>
                                        <p>Username</p>
                                        <input value={this.state.username} onChange={this.handleUsernameChanges}></input><br />
                                        <button ref={this.btnRef} onClick={this.updateInfo}>Update info</button>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="security">
                                        <div id="reAuth-section">
                                            <h2>Please reauthenicate to proceed</h2>

                                            <p>Password</p>
                                            <input type="password" onChange={this.handlePasswordReAuthChanges} ></input><br />
                                            <button onClick={this.reAuth} ref={this.reAuth_btn}>Reauthenicate</button>

                                        </div>
                                        <div id="mainSecurity" style={{ display: "none" }}>
                                            <p>Change password</p>
                                            <input type="password" onChange={this.handlePasswordChanges}></input><br />
                                            <button onClick={this.changePSW} ref={this.changePSWbtn}>Confirm change</button>

                                        </div>
                                        <p id="error"></p>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            )
        }
    }
}