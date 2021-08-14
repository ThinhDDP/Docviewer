import React from 'react'
import firebase from '../firebase'
import './Create.css'
import axios from 'axios'
import Loading from '../Components/Loading'

// let user = firebase.auth().currentUser //This is a lazy way because .currentUser is async call, but it will prob load before the user finish typing

class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            state: 'idle',
            link: '',
            title: '',
            isLoading: true,
            code: null,
            provider: null,
            isOffice: false
        }
        this.token = null
        this.fileId = null
        this.uid = null
        this.serverURL = 'http://localhost:3333/docviewerapi/asia-east2/api/create'
        this.optionRef = React.createRef()
        this.email = []
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.mail = []
        this.sendMail = this.sendMail.bind(this)
        this.progress = React.createRef()
        this.inputFile = React.createRef()
    }
    signInAccount() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/drive.readonly');
        this.setState({
            isLoading: true
        })
        firebase.auth()
            .signInWithPopup(provider)
            .then(result => {
                this.token = result.credential.accessToken
                this.listFiles()

            })
            .catch(e => {
                console.log(e)
            })
    }
    switchState() {
        this.perm = this.optionRef.current.value
        if (this.perm == "Only") {
            this.getAllEmails()
        }
        this.setState({
            state: "emails"
        })
    }
    listFiles() {
       if (!this.state.isOffice){
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
    }
    createButtons(files) {
        files = [... new Set(files)] //Remove dupes
        let length = files.length
        for (let i = 0; i < length; ++i) {
            let newBtn = document.createElement('button')
            newBtn.innerHTML = files[i].name
            newBtn.className = "fileBtn"
            newBtn.addEventListener('click', () => this.assignId(files[i].id))
            document.getElementById('container').appendChild(newBtn)
        }
    }
    assignId(id) {
        var arrayelements = Array.prototype.slice.call(document.getElementsByClassName('fileBtn'));
        for (let i = 0; i < arrayelements.length; i++) {
            arrayelements[i].remove();
        }
        this.fileId = id
        this.setState({
            state: "settings"
        })
    }
    async createDocument() {
        console.log(this.fileId)
        let data = {
            name: this.state.title,
            id: this.fileId
        }
        switch (this.perm) {
            case 'Only':
                data.perm = 'Only'
                this.getAllEmails()
                data.uid = this.email
                console.log(data)
                break
            case 'Everyone':
                data.perm = 'Everyone'
                data.uid = [this.state.email]
                console.log(data)
                break
        }
        if (this.state.isOffice){
            data.type = "office"
        }
        else{
            data.type = "google"
        }
        this.setState({
            isLoading: true
        })
        let result = await axios.post(this.serverURL, data)
        return result.data
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                this.setState({
                    provider: user.providerData[0].providerId,
                    isLoading: false
                })
                this.uid = user.uid                
                this.state.email = user.email
            }
            else {
                this.setState({
                    provider: "no",
                    isLoading: false
                })

            }
        })
    }
    getAllEmails() {
        let container = document.getElementById('add')
        let emails_input = container.getElementsByTagName('input')
        for (let i = 0; i < emails_input.length; ++i) {
            this.email.push(emails_input[i].value.trim())
        }
        this.email.push(this.state.email)
    }
    chooseAuthor() {
        if (this.optionRef.current.value == "Only") {
            document.getElementById('add').style.display = "block"
        }
        else {
            document.getElementById('add').style.display = "none"
        }
    }
    handleTitleChange(event) {
        this.setState({
            title: event.target.value
        })
    }
    linkAccount() {
        var googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly')
        firebase.auth().currentUser.linkWithPopup(googleProvider).then(result => {
            this.token = result.credential.accessToken
            this.uid = result.user.uid
            this.listFiles()
        }).catch(e => {
            console.log(e)
        })
    }

    addInput() {
        let input = document.createElement("input")
        let container = document.getElementById('add')
        let linebreak = document.createElement("br");
        input.appendChild(linebreak)
        container.insertBefore(input, container.firstChild)
    }
    async sendMail() {
        let container = document.getElementById('add')
        let emails_input = container.getElementsByTagName('input')
        for (let i = 0; i < emails_input.length; ++i) {
            this.mail.push(emails_input[i].value.trim())
        }
        console.log(this.mail)
        this.createDocument().then((code) => {
            this.setState({
                code: code
            })
            axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/mail/${code}`, {
                email: this.mail,
                author: this.state.email
            }).then((result) => {
                this.setState({
                    state: 'display',
                    isLoading: false
                })
            })
        })
    }
    changeOffice(){
        this.setState({
            isOffice: true,
            state: 'choose'
        })
    }
    openFile() {
        this.progress.current.style.display = "block"
        this.inputFile.current.click()
    }        switch (file_extension) {

    }

    uploadFile(event) {
        event.stopPropagation()
        event.preventDefault()
        let file = event.target.files[0]
        let file_extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
        if (file_extension != 'docx'){
            alert("Your file type in invalid")
            return
        }
        let path = `users/${this.uid}/${file.name}`
        let docRef = firebase.storage().ref(path)
        console.log(path)
        let task = docRef.put(file)
        task.on('state_change',
            (snapshot) => {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                this.progress.current.value = percent
                console.log(this.progress.current.value)
                if (percent >= 100) {
                    this.progress.current.style.display = "none"
                    this.fileId = path
                    this.setState({
                        state: 'settings'
                    })
                }
            }
        )
    }
    render() {
        if (this.state.provider === "no") {
            return (
                <div className="wrapper">
                    <div className="bg">
                        <div className='content'>
                            <h3>You must be signed in to create a document</h3>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.state === 'idle' && this.state.provider === "google.com" && !this.state.isLoading) {
            return (
                <div className="wrapper">
                    <div className="bg">
                        <div className='content'>
                            <button class="g-button" onClick={() => this.signInAccount()}>
                                <img class="g-logo" src="https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg" alt="Google Logo" />
                                <p class="g-text">Continue with Google Docs</p><br/>

                            </button>
                            <h3>Or</h3><br/>
                            <button onClick={() => this.changeOffice()} className="office">
                                Use your own file
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        else if (this.state.state === 'idle' && this.state.provider === "password" && !this.state.isLoading) {
            return (
                <div className="wrapper">
                    <div className="bg">
                        <div className='content'>
                            <button class="g-button" onClick={() => this.linkAccount()}>
                                <img class="g-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png" alt="Google Logo" />
                                <p class="g-text">Link with Google</p>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.isLoading) {
            return (
                <Loading/>
            )
        }
        else if (this.state.state === "choose" && !this.state.isOffice) {
            return (<div className="wrapper">
                <div id="container" className="bg">
                    <h6>Choose the file you would like to present</h6>

                </div>
            </div>)
        }
        else if (this.state.state == "choose" && this.state.isOffice){
            return (<div className="wrapper">
            <div id="container" className="bg">
                <h6>Choose the file you would like to present</h6>
                <input type='file' id='file' ref={this.inputFile} style={{ display: 'none' }} onChange={this.uploadFile} accept=".docx" />
                <button className="uploadBtn" onClick={() => this.openFile()}>Choose file</button>
                <progress ref={this.progress} style={{display: "none"}} id="file" min="0" value="0" max="100">{this.value}</progress>
                </div>
            </div>)
        }
        else if (this.state.state == "emails") {
            return (
                <div className="wrapper">
                    <div className="bg">

                        <div className="content">
                            <div className="mail">
                                <div id="add" className="add">
                                    <p>User emails</p>
                                    <input></input><br />
                                    <button onClick={() => this.addInput()} className="add">Add</button><br />
                                </div>
                            </div>
                            <button onClick={() => this.sendMail()}>Create</button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.state === "settings") {
            return (<div className="wrapper">
                <div className="bg">
                    <div className="content">
                        <input required value={this.state.title} onChange={this.handleTitleChange} placeholder="Document's title"></input>
                        <h6>Who can see this file statistic</h6>
                        <select onChange={() => this.chooseAuthor()} ref={this.optionRef} name="options">
                            <option value="Everyone">Everyone with code</option>
                            <option value="Only">Only me</option>
                        </select><br />
                        <div id="add" className="add" style={{ display: 'none' }}>
                            <input placeholder="User's email"></input><br />
                            <button onClick={() => this.addInput()} className="add">Add</button><br />
                        </div>
                        <button className="submitBtn" onClick={() => this.switchState()}>Next</button>
                    </div>
                </div>
            </div>
            )
        }
        else if (this.state.state === "display") {
            return (
                <div className="wrapper">
                    <div className="bg">
                        <div className="content">
                            <h4>Your code is {this.state.code}</h4>
                            <button className="submitBtn" onClick={() => window.location.reload()}>Create another document</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Create;