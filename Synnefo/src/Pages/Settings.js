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
        }
        this.info = []
        // this.displayName = React.createRef(); Changing text by innerHTML, really?
        // this.email = React.createRef(); 
        // this.avatar = React.createRef();
        this.value = 0
        this.inputFile = React.createRef()
        this.progress = React.createRef()
        this.uploadFile = this.uploadFile.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.info = [user.email, user.displayName, user.photoURL, user.uid] //User will have a default avatar now, so photoURL will works
                this.setState({
                    isLoading: false //Set isLoading to false here, adn React will update accordingly
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
                        <img src={this.info[2]}></img>
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
                            <div className="account-info">Account info</div>
                        </TabPanel>
                        <TabPanel>
                            <div className="password">Password</div>
                        </TabPanel>
                    </Tabs>
                    </div>
                    </div>
                </div>
            )
        }
    }
}





