import "./Track.css"
import React from "react";
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import Loading from '../Components/Loading'
import firebase from '../firebase'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axiosIntstance from "../axios"
import axiosInstance from "../axios";


export default class Track extends React.Component {
    constructor() {
        super()

        this.state = {
            data: [],

            document_owned: {}, //this.state here
            document_shared: {}, //this.state here
            document: "",
            tableRows: [],
            chartData: [],
            views: 0,
            currentPiceOfData: {},
            isLoading: true,
            code: "",
            output: "",
        }
        this.viewStats = this.viewStats.bind(this)
        this.renderStats = this.renderStats.bind(this)
        this.checkPublic = this.checkPublic.bind(this)
        this.uid = null
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.delete = this.delete.bind(this)
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    isLoading: false
                })
                this.uid = user.uid
                this.email = user.email
                this.getDocIds()
            }
            else {
                this.setState({
                    isLoading: "notLoggedIn"
                })
            }
        })
    }
    getDocIds() {
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/owned/${this.uid}`).then(result => {
            console.log(result)
            this.setState({
                document_ids: result.data[0],
                document_owned: result.data[0],
                document_shared: result.data[1]
            })
        })
    }
    viewStats(event) {
        let id = event.target.id
        this.setState({
            document: id,
            isLoading: true
        })
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/track/${id}`, {
            email: this.email
        }).then(result => {
            console.log(result)
            this.setState({
                isLoading: false
            })

            this.renderStats(result.data)
            document.getElementById("doctypes").style.display = "none"
            document.getElementById("docStats").style.display = "block"

        })




    }
    renderStats(document) {
        console.log("Loaded")
        let currentDocumentData = document

        let uidsAndTime = currentDocumentData[1]
        let tableRows = []
        let users = []
        let time = []
        let views = "" + currentDocumentData[0]
        for (const uid in uidsAndTime) { //render table
            tableRows.push(
                <tr>
                    <td>{uid}</td>
                    <td>{uidsAndTime[uid]}</td>
                </tr>
            )
            users.push(uid)
            time.push(uidsAndTime[uid])
        }
        let chartdata = {
            labels: users,
            datasets: [
                {
                    label: "Time (in seconds)",
                    data: time,
                    backgroundColor: 'rgb(255, 99, 132)',
                }
            ]
        }
        this.setState({
            tableRows: tableRows,
            chartData: chartdata,
            views: views
        })

    }
    goBack() {
        document.getElementById("doctypes").style.display = "block"
        document.getElementById("docStats").style.display = "none"
    }
    checkPublic() {
        let code = this.state.code;
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/track/${this.state.code}`, { uid: this.uid }).then((data) => {
            if (data.data != "This Document only allows the author to track it") {
                Ispublic = true;
            }
            else {
                Ispublic = false;
            }
            if (Ispublic == false) {
                document.getElementById("output").style.color = "red";
                this.setState({
                    output: "This document is not public"
                })
            } else {
                document.getElementById("doctypes").style.display = "none"
                document.getElementById("docStats").style.display = "block"
                document.getElementById("output").style.color = "green";
                this.setState({
                    output: "This document is public"
                })
                //that is the code
                this.renderStats(data.data)

            }
        })
        let Ispublic = false;


    }
    handleDocIdChange(event) {
        this.setState({
            code: event.target.value
        })
    }
    handleOptionChange(event) {
        console.log(event.target.value)
        let types = ["Owned", "Shared", "Public"]
        let index = types.indexOf(event.target.value)
        if (index > -1) {
            types.splice(index, 1)
        }
        console.log(types)
        types.forEach(item => {
            document.getElementById(`${item}`).style.display = "none"
        })
        document.getElementById(event.target.value).style.display = "block"
    }
    goBackCheckPublic() {
        document.getElementById("superDocs").style.display = "block"
        document.getElementById("checkPublic").style.display = "none"
    }
    renderDocPublicSection() {
        document.getElementById("superDocs").style.display = "none"
        document.getElementById("checkPublic").style.display = "block"
    }
    delete(event) {
        let code = event.target.id;
        axiosInstance.post(`http://localhost:3333/docviewerapi/asia-east2/api/delete/${code}`, {
            uid: this.uid
        }).then(() => {
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
                        <div className="content">
                            <h3>You must be logged in to use this feauture</h3>
                        </div>
                    </div>
                </div>

            )
        }
        else if (!this.state.isLoading) {
            let data = this.state.data
            let list_owned = []
            let list_shared = []
            for (const docid in this.state.document_owned) {
                list_owned.push(
                    <div onClick={this.viewStats} id={docid} className="cardDoc">
                        <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={docid}></img>
                        <div className="container">
                            <p id={docid}>{this.state.document_owned[docid]}</p>
                        </div>
                    </div>
                )
            }
            for (const docid in this.state.document_shared) {
                list_shared.push(
                    <div onClick={this.viewStats} id={docid} className="cardDoc">
                        <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={docid}></img>
                        <div className="container">
                            <p id={docid}>{this.state.document_shared[docid]}</p>
                        </div>
                    </div>
                )

            }
            let currentDocument = this.state.document
            let options = {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                maintainAspectRatio: false
            }
            return (
                <div className="wrapper">
                    <div id="doctypes">

                        <div id="Public">
                            <div className="selectcss specificforpublic">
                                <select onChange={this.handleOptionChange}>
                                    <option value="Public" selected>Public Documents</option>
                                    <option value="Shared">Shared Documents</option>
                                    <option value="Owned">Owned Documents</option>
                                </select>
                            </div>
                            <div id="checkPublic">
                                <div className="bg">
                                    <h3>Track public Document</h3>

                                    <input type="text" placeholder="Document code"></input><br></br>
                                    <button onClick={this.checkPublic}>Check</button>
                                    <p id="output">{this.state.output}</p>
                                </div>
                            </div>
                        </div>

                        <div id="Owned" style={{ display: "none", }}>
                            <div className="selectcss">
                                <select onChange={this.handleOptionChange}>
                                    <option value="Public" >Public Documents</option>
                                    <option value="Shared">Shared Documents</option>
                                    <option value="Owned" selected>Owned Documents</option>
                                </select>
                            </div>
                            <div className="needbg" id="superDocs">
                                <div id="docs">
                                    <h3>Choose a document to view its stats :D</h3>
                                    <div className="cardLists">
                                        {list_owned}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Shared" style={{ display: "none" }}>
                            <div className="selectcss">
                                <select onChange={this.handleOptionChange}>
                                    <option value="Public" >Public Documents</option>
                                    <option value="Shared" selected>Shared Documents</option>
                                    <option value="Owned">Owned Documents</option>
                                </select>
                            </div>
                            <div className="needbg" id="superDocs">
                                <div id="docs">
                                    <h3>Choose a document to view its stats</h3>
                                    <div className="cardLists">
                                        {list_shared}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="docStats" style={{ display: "none" }}>

                        <div id="docsstats">

                            <p onCLick={() => window.location = window.location}>&larr; Back</p>
                            <Tabs>
                                <TabList>
                                    <Tab>Stats</Tab>
                                    <Tab>Settings</Tab>
                                </TabList>
                                <TabPanel>
                                    <h3>Stats for {currentDocument}</h3>
                                    <p>This document has {this.state.views} views</p>
                                    <div id="chart" style={{ width: "50vw", height: "50vh", margin: "auto" }}>
                                        <Bar data={this.state.chartData} options={options} />
                                    </div>
                                    <div id="table" style={{ width: "50vw", margin: "auto", textAlign: "left" }}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>User's email</th>
                                                    <th>Time (in seconds)</th>
                                                </tr>
                                                {this.state.tableRows}
                                            </tbody>
                                        </table>

                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <p>Link : localhost.com:3000/open?code={currentDocument}</p>
                                    <button className="danger" onClick={this.delete} id={currentDocument}>Delete document</button>
                                </TabPanel>
                            </Tabs>

                        </div>

                    </div>
                </div>
            )
        }

    }
}
