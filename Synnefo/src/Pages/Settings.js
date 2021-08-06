import firebase from '../firebase' //Firebase only needs to init once
import React from 'react';
import "./Settings.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loading from '../Components/Loading';

var imageRef;
let userCopy;

export default class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            email: null,
            username: null,
            photoURL: null,
            uid: null,
            oldPassword: null,
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




        this.changePSWbtn = React.createRef();
        this.changePSW = this.changePSW.bind(this)
        this.handlePasswordChanges = this.handlePasswordChanges.bind(this)
        this.handleOldPasswordChanges = this.handleOldPasswordChanges.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //User will have a avatar now, so photoURL will works
                this.setState({
                    isLoading: false, //Set isLoading to false here, adn React will update accordingly
                    email: user.email,
                    username: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid
                })
                userCopy = firebase.auth().currentUser
                console.log(firebase.auth().currentUser.providerData[0]["providerId"])




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
        let file_extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
        switch (file_extension) {
            case 'jpg':
                imageRef = firebase.storage().ref(`users/${this.state.uid}/profile.jpg`)
                break;
            case 'png':
                imageRef = firebase.storage().ref(`users/${this.state.uid}/profile.png`)
                break;
            case 'gif':
                imageRef = firebase.storage().ref(`users/${this.state.uid}/profile.gif`)
                break;
            default:
                alert("Your file is invalid")
                this.progress.current.style.display = "none"
                return;
        }

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
        userCopy.updateProfile({
            photoURL: photo
        }).then(() => {
            this.info[2] = this.state.photoURL
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

    handleOldPasswordChanges(event) {
        this.setState({
            oldPassword: event.target.value
        })
        this.changePSWbtn.current.style.backgroundColor = "#5865F2"
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
            
            if (firebase.auth().currentUser.providerData[0]["providerId"] === "password") {
                let credential = firebase.auth.EmailAuthProvider.credential(this.state.email, this.state.oldPassword)

                userCopy.reauthenticateWithCredential(credential).then(() => {
                    userCopy.updatePassword(this.state.password).then(() => {
                        window.location.reload()
                    }).catch((e) => {
                        document.getElementById("error").innerText = e;
                        document.getElementById("error").style.color = "red"
                    })
                }).catch((e) => {
                    document.getElementById("error").innerText = e;
                    document.getElementById("error").style.color = "red"

                })

            }else{
                alert("This option is not avalible to Google authenicated users")
            }

        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                        <Loading/>
            )
        }
        else {
            return (
                <div className="wrapper">
                    <div className="avatar">
                        <img src={this.state.photoURL} alt="Your avatar"></img>
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
                                        <p>UID : {this.state.uid}</p>
                                        <p>Email</p>
                                        <input value={this.state.email} onChange={this.handleEmailChanges}></input>
                                        <p>Username</p>
                                        <input value={this.state.username} onChange={this.handleUsernameChanges}></input><br />
                                        <button ref={this.btnRef} onClick={this.updateInfo}>Update info</button>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="security">

                                        <div id="mainSecurity">

                                            <input type="password" onChange={this.handleOldPasswordChanges} placeholder="Old password"></input><br />
                                            <input type="password" onChange={this.handlePasswordChanges} placeholder="New password" style={{ margin: "5%" }}></input><br />
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
