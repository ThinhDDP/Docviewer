import "./Track.css"
import React from "react";
import { Bar } from 'react-chartjs-2';



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
            currentPiceOfData: {}

        }
        this.viewStats = this.viewStats.bind(this)
        this.renderStats = this.renderStats.bind(this)
    }
    componentDidMount() {


        let documents_ids = {
            "code1": "title1",
            "code2": "title2",
            "code3": "title3",
            "code4": "title4",
            "code5": "title5",
            "code6": "title6"
        }


        this.setState({
            document_ids: documents_ids,
        })


    }
    viewStats(event) {
        let id = event.target.id
        this.setState({
            document: id,

        })
        let currentDocumentData = {}
        this.renderStats(currentDocumentData)
        document.getElementById("superDocs").style.display = "none"
        document.getElementById("docStats").style.display = "block"



    }
    renderStats(document) {

        let currentDocumentData = document

        let uidsAndTime = currentDocumentData["complete-time"]
        let tableRows = []
        let users = []
        let time = []
        let views = "" + currentDocumentData["total-views"]
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
    render() {
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
                                        <th>User UID</th>
                                        <th>Time (in seconds)</th>
                                    </tr>
                                    {this.state.tableRows}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
