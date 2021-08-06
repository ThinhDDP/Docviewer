import React from "react";
import Open from './Open.js'
import "./Recent.css"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios'
import Loading from "../Components/Loading.js";
import firebase from "firebase";


export default class Recent extends React.Component {
    constructor() {
        super()
        this.state = {
            code: null,
            viewedDocs: {},
            completedDocs: {},
            isLoading: true

        }
        this.handleViewDocClick = this.handleViewDocClick.bind(this)
        // this.renderCards = this.renderCards.bind(this)



    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.getViewedAndCompleted(user.uid)
            }
            else{
                this.setState({
                    isLoading: "notLoggedIn "
                })
            }
        })
    }
    handleViewDocClick(event) {
        this.setState({ code: event.target.id })
        document.getElementById("niceLists").style.display = "none"
        document.getElementById("viewDoc").style.display = "block"

        console.log(event.target.innerText)
    }
    handleViewDocClick(event) {
        this.setState({ code: event.target.id })
        console.log(this.state.code)

    }
    getViewedAndCompleted(uid){
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/viewed/${uid}`).then(result => {
            this.setState({
                viewedDocs: result.data[0],
                completedDocs: result.data[1],
                isLoading: false
            })
        })
    }
    render() {
        if (this.state.isLoading){
            return (
                <Loading/>
            )
        }
        else if (this.state.isLoading == "notLoggedIn"){
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
        else if (!this.state.isLoading && !this.state.code){
        let completedDocs = this.state.completedDocs;
        let viewedDocs = this.state.viewedDocs;

        let arrayDocs_viewed = [];
        let arrayDocs_completed = [];

        for (const document_id in completedDocs) {
            arrayDocs_completed.push(

                <div className="cardDoc" onClick={this.handleViewDocClick} id={document_id}>
                    <img src="https://cdn.iconscout.com/icon/free/png-256/document-970-453728.png" id={document_id}></img>
                    <div className="container">
                        <p id={document_id}>{completedDocs[document_id]}</p>
                    </div>
                </div>
            )
        }

        for (const document_id in viewedDocs) {
            arrayDocs_viewed.push(
                <div className="cardDoc" onClick={this.handleViewDocClick} id={document_id}>
                    <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={document_id}></img>
                    <div className="container">
                        <p id={document_id}>{viewedDocs[document_id]}</p>
                    </div>
                </div>
            )
        }


        return (
            <div>
                <div className="wrapper" id="niceLists">
                    <div id="docLists">
                        <Tabs>
                            <TabList>
                                <Tab>Viewed Documents</Tab>
                                <Tab>Completed Documents</Tab>
                            </TabList>
                            <TabPanel>
                                <div id="viewed">
                                    <h3>Viewed Documents</h3>
                                    <div className="sectionRecent" id="viewedSection">
                                        {arrayDocs_viewed}
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id="completed">
                                    <h3>Completed Documents</h3>
                                    <div className="sectionRecent" id="completedSection">
                                        {arrayDocs_completed}
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>

        )
        }
        else if (this.state.code){
            return (
                <>
                    <Open code={this.state.code}/>
                </>
            )
        }
    }

}
