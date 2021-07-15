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
            photoURL: null
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
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //User will have a default avatar now, so photoURL will works
                this.setState({
                    isLoading: false, //Set isLoading to false here, adn React will update accordingly
                    email: user.email,
                    username: user.displayName,
                    photoURL: user.photoURL
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


    openFile(){
        this.progress.current.style.display = "block"
        this.inputFile.current.click()

    }
    uploadFile(event){
        event.stopPropagation()
        event.preventDefault()
        let file = event.target.files[0]
        let task = imageRef.put(file)
        task.on('state_change',
            (snapshot) => {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                this.progress.current.value = percent
                if (percent >= 100){
                    this.progress.current.style.display = "none"
                    this.assignImage()
                }
            }
        )
    }

    async assignImage(){
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

    handleEmailChanges(event){
        this.setState({
            email: event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }

    handleUsernameChanges(event){
        this.setState({
            username: event.target.value
        })
        this.btnRef.current.style.backgroundColor = "#5865F2"
    }

    updateInfo(){
        if (window.confirm("Do you really want to change your account info (This action cannot be undone)")){
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
                        <input type='file' id='file' ref={this.inputFile} style={{display: 'none'}} onChange={this.uploadFile} accept="image/*"/>
                        <button onClick={() => this.openFile()}>Change avatar</button>
                        <progress  ref={this.progress} id="file" min="0" value={this.value} max="100">{this.value}</progress>
                    </div>
                    <br/>
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
                            <input value={this.state.username} onChange={this.handleUsernameChanges}></input><br/>
                            <button ref={this.btnRef} onClick={this.updateInfo}>Update info</button>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="password" >Password</div>
                        </TabPanel>
                    </Tabs>
                    </div>
                    </div>
                </div>
            )
        }
    }
}





