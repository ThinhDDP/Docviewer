import React from "react";
import Open from './Open.js'
import "./Recent.css"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios'
import Loading from "../Components/Loading.js";
import firebase from "firebase";
import { AiOutlineHeart } from "react-icons/ai" //unset
import { AiFillHeart } from "react-icons/ai" //set
import axiosInstance from "../axios.js";


export default class Recent extends React.Component {
    constructor() {
        super()
        this.state = {
            code: null,
            viewedDocs: {},
            completedDocs: {},
            favoriteDocs: {}, //yo get ur doc here
            isLoading: true

        }
        this.handleViewDocClick = this.handleViewDocClick.bind(this)
        // this.renderCards = this.renderCards.bind(this)
        this.uid = null
        this.toggleFavorite = this.toggleFavorite.bind(this)
        this.unFavorite = this.unFavorite.bind(this)

    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.getViewedAndCompleted(user.uid)
                this.uid = user.uid
            }
            else {
                this.setState({
                    isLoading: "notLoggedIn"
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
    getViewedAndCompleted(uid) {
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/viewed/${uid}`).then(result => {
            this.setState({
                viewedDocs: result.data[0],
                completedDocs: result.data[1],
                favoriteDocs: result.data[2],
                isLoading: false
            })
        })
    }
    refreshStuff() {
        this.setState({ isLoading: true })

        //request to update stuff

        this.setState({ isLoading: false })
    }
    toggleFavorite(event) {
        let code = event.target.id
        this.setState({ isLoading: true })
        axiosInstance.post(`http://localhost:3333/docviewerapi/asia-east2/api/fav/${this.uid}`, {
            code: code,
            type: "fav"
        }).then(() => {
            this.setState({ isLoading: false })
            window.location.reload()
        })
        // your code, do do do do it
    }
    unFavorite(event) {
        let code = event.currentTarget.id
        this.setState({ isLoading: true })
        axiosInstance.post(`http://localhost:3333/docviewerapi/asia-east2/api/fav/${this.uid}`, {
            code: code,
            type: "delete"
        }).then(() => {
            this.setState({ isLoading: false })
            window.location.reload()
        })
    }
    render() {
        if (this.state.isLoading == true) {
            return (
                <Loading />
            )
        }
        else if (this.state.isLoading == "notLoggedIn") {
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
        else if (!this.state.isLoading && !this.state.code) {
            let completedDocs = this.state.completedDocs;
            let viewedDocs = this.state.viewedDocs;
            let favoriteDocs = this.state.favoriteDocs;
            let arrayDocs_viewed = [];
            let arrayDocs_completed = [];
            let arrayDocs_favorite = []
            for (const document_id in completedDocs) {
                let arrow = <AiOutlineHeart id={document_id} onClick={this.toggleFavorite} />
                arrayDocs_completed.push(
                    <div className="cardDoc">
                        <div>
                            {arrow}
                        </div>
                        <div className="non-arrow" onClick={this.handleViewDocClick} id={document_id}>
                            <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={document_id}></img>
                            <div className="container">
                                <p id={document_id}>{completedDocs[document_id]}</p>
                            </div>
                        </div>
                    </div>
                )
            }

            for (const document_id in viewedDocs) {
                let arrow = <AiOutlineHeart id={document_id} onClick={this.toggleFavorite} />
                arrayDocs_viewed.push(
                    <div className="cardDoc">
                        <div>
                            {arrow}
                        </div>
                        <div className="non-arrow" onClick={this.handleViewDocClick} id={document_id}>
                            <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={document_id}></img>
                            <div className="container">
                                <p id={document_id}>{viewedDocs[document_id]}</p>
                            </div>
                        </div>
                    </div>
                )
            }

            for (const document_id in favoriteDocs) {
                let arrow = <AiFillHeart id={document_id} onClick={this.unFavorite} />

                arrayDocs_favorite.push(
                    <div className="cardDoc" >
                        <div>
                            {arrow}
                        </div>
                        <div className="non-image" onClick={this.handleViewDocClick} id={favoriteDocs[document_id]}>
                            <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={favoriteDocs[document_id]}></img>
                            <div className="container">
                                <p id={favoriteDocs[document_id]}>{favoriteDocs[document_id]}</p>
                            </div>
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
                                    <Tab>Favorited Documents</Tab>
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
                                <TabPanel>
                                    <div id="favorited">
                                        <h3>Favorited documents</h3>
                                        <div className="sectionRecent" id="favoriteSection">
                                            {arrayDocs_favorite}
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>

            )
        }
        else if (this.state.code) {
            return (
                <>
                    <Open code={this.state.code} />
                </>
            )
        }
    }

}
