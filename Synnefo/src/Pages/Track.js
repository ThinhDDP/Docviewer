import "./Track.css"
import React from "react";
import Dropdown from "react-dropdown";
import { Bar } from 'react-chartjs-2';


// const Data = (props) => {
//     let tableData = props.tableData;
//     let jsxTable = []
//     console.log(props)
//     for (const uid in tableData) {
//         jsxTable.push(
//             <tr>
//                 <td>{uid}</td>
//                 <td>{tableData[uid]}</td>
//             </tr>
//         )
//     }
//     return (
//         <div>
//             <p onClick={console.log("need to go back")}> ← Back</p>
//             <p>Your document has a total of {props.views} views</p>
//             <div className="chart">
//                 <Bar data={props.Data} options={{ scales: { yAxes: [{ ticks: { beginAtZero: true, }, },], }, maintainAspectRatio: false }}></Bar>
//             </div>
//             <div className="table">
//                 <table>
//                     <tr>
//                         <th>User UID</th>
//                         <th>Time (in seconds)</th>
//                     </tr>
//                     {jsxTable}
//                 </table>
//             </div>
//         </div>
//     )


// }
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


        }
        // this.renderChart = this.renderChart.bind(this)
        // this.renderTable = this.renderTable.bind(this)
        // this.changeDocument = this.changeDocument.bind(this)
        // this.changeDisplayData = this.changeDisplayData.bind(this)
        this.viewStats = this.viewStats.bind(this)
        this.renderStats = this.renderStats.bind(this)
    }
    componentDidMount() {
        //the time will be counted in seconds


        let data = [
            {
                "document-code": "233e24",
                "total-views": 99,
                "complete-time": {
                    "uid": 12,
                    "uid2": 34
                },
                "total-time": 23
            },
            {
                "document-code": "23e24e2e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            }, {
                "document-code": "23e24e672e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            }, {
                "document-code": "23e214e2e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            }, {
                "document-code": "23e245e2e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            }, {
                "document-code": "23e214e2e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            }, {
                "document-code": "23e24ee2e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            }, {
                "document-code": "23e2w4e2e",
                "total-views": 93,
                "complete-time": {
                    "uid": 11,
                    "uid2": 35
                },
                "total-time": 23
            },

        ] //data for testing

        // data = [] // your data here
        let dropdowns = []
        for (let i = 0; i < data.length; i++) {
            dropdowns.push(data[i]["document-code"])
        }

        this.setState({
            data: data,
            document_ids: dropdowns,

        })
        // console.log(data)
        // this.renderChart(data[0]) //default is the first one
        // this.setState({ views: "" + data[0]["total-views"] })

    }
    viewStats(event) {
        let id = event.target.id
        this.setState({
            document: id
        })

        this.renderStats(id)
        document.getElementById("superDocs").style.display = "none"
        document.getElementById("docStats").style.display = "block"



    }
    renderStats(document) {
        let data = this.state.data
        let documents = this.state.document_ids
        let currentDocument = document

        let uidsAndTime = data[documents.indexOf(currentDocument)]["complete-time"]
        let tableRows = []
        let users = []
        let time = []
        let views = "" + data[documents.indexOf(currentDocument)]["total-views"]
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
        console.log(data)
        console.log(documents)
        console.log(currentDocument)
        console.log(chartdata)
        console.log(tableRows)
    }
    goBack() {
        document.getElementById("superDocs").style.display = "block"
        document.getElementById("docStats").style.display = "none"
    }
    render() {
        let data = this.state.data

        // rendering doc cards
        let documents = this.state.document_ids
        let jsxDocumentsLists = documents.map(id => {
            return (
                <div className="cardDoc" onClick={this.viewStats} id={id}>
                    <img src="https://freeiconshop.com/wp-content/uploads/edd/documents-outline.png" id={id}></img>
                    <div className="container">
                        <p id={id}>{id}</p>
                    </div>
                </div>
            )
        })
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
