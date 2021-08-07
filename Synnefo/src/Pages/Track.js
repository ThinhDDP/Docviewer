import "./Track.css"
import React from "react";
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import Loading from '../Components/Loading'
import firebase from '../firebase'


export default class Track extends React.Component {
    constructor() {
        super()

        this.state = {
            data: [],

            document_ids: [],

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
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    isLoading: false
                })
                this.uid = user.uid
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
            })
        })
    }
    viewStats(event) {
        let id = event.target.id
        this.setState({
            document: id,
            isLoading: true
        })
        axios.post(`http://localhost:3333/docviewerapi/asia-east2/api/track/${id}`).then(result => {
            console.log(result)
            this.setState({
                isLoading: false
            })

            this.renderStats(result.data)
            document.getElementById("superDocs").style.display = "none"
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
        document.getElementById("superDocs").style.display = "block"
        document.getElementById("docStats").style.display = "none"
    }
    checkPublic() {
        let code = this.state.code;
        let Ispublic = false;
        //do some stuff
        // set the public variable
        document.getElementById("output") = ""
        if(Ispublic == false){
            document.getElementById("output").style.color = "red";
            this.setState({
                output: "This document is not public"
            })
        }else{
            document.getElementById("output").style.color = "green";
            this.setState({
                output: "This document is public"
            })
            //that is the code
            this.renderStats(code)

        }

    }
    handleDocIdChange(event){
        this.setState({
            code : event.target.value
        })
    }
    goBackCheckPublic() {
        document.getElementById("superDocs").style.display = "block"
        document.getElementById("checkPublic").style.display="none"
    }
    renderDocPublicSection(){
        document.getElementById("superDocs").style.display = "none"
        document.getElementById("checkPublic").style.display="block"
        document.getElementById("output") = ""
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

            // rendering doc cards
            let documents = this.state.document_ids

            let jsxDocumentsLists = []
            for (const docId in documents) {
                jsxDocumentsLists.push(
                    <div className="cardDoc" onClick={this.viewStats} id={docId}>
                        <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={docId}></img>
                        <div className="container">
                            <p id={docId}>{documents[docId]}</p>
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
            let chartdata = this.state.chartData
            return (
                <div>
                    <div className="wrapper needbg" id="superDocs">
                        <div id="docs">
                            <h3>Choose a document to view its stats</h3>
                            <div className="cardLists">
                                <div className="cardDoc" onClick={this.renderDocPublicSection}>
                                    <img src="https://img.icons8.com/cotton/2x/public-cloud.png"></img>
                                    <div className="cotainer">
                                        <p>Public Document</p>
                                    </div>
                                </div>
                                {jsxDocumentsLists}
                            </div>
                        </div>
                    </div>
                    <div id="docStats" style={{ display: "none" }} className="wrapper">

                        <div id="docsstats">
                            <p onClick={this.goBack}> &larr; Back</p>
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
                        </div>
                    </div>
                    <div className="wrapper" id="checkPublic" style={{ display: "none" }}>
                        <div className="bg">
                            <p onClick={this.goBackCheckPublic}> &larr; Back</p>
                            <h3>Track public Document</h3>
                            <input type="text" placeholder="Document code"></input><br></br>
                            <button onClick={this.checkPublic}>Check</button>
                            <p id="output">{this.state.output}</p>
                        </div>
                    </div>
                </div>

            )
        }
    }
}
