import "./Track.css"
import React from "react";
import Dropdown from "react-dropdown";
import { Bar } from "react-chartjs-2"




export default class Track extends React.Component {
    constructor() {
        super()

        this.state = {
            data: [],
            chartdata: [],
            selectedDocumentId: "",
            selectedDisplay: "Chart",
            dropdownOptions: [],
            views : ""


        }
        this.renderChart = this.renderChart.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.changeDocument = this.changeDocument.bind(this)
        this.changeDisplayData = this.changeDisplayData.bind(this)
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
            },

        ] //data for testing

        // data = [] // your data here
        let dropdowns = []
        for (let i = 0; i < data.length; i++) {
            dropdowns.push(data[i]["document-code"])
        }

        this.setState({ data: data, dropdownOptions: dropdowns, selectedDocumentId: data[0]["document-code"], isLoading:false })
        console.log(data)
        this.renderChart(data[0]) //default is the first one
        this.setState({views: "" + data[0]["total-views"]})
        
    }
    renderChart(data) {

        let users = [];
        let time = [];
        for (let element in data["complete-time"]) {
            users.push(element)
            time.push(data["complete-time"][element])
        }
        users.push("Total")
        time.push(data["total-time"])
        this.setState({
            chartdata: {
                labels: users,
                datasets: [
                    {
                        label: "Time(in seconds)",
                        data: time,
                        backgroundColor: 'rgb(255, 99, 132)'
                    },

                ]

            }
        })

    }
    renderTable(data) {
        document.getElementById("tableInfo").innerHTML = `
            <tr>
                <th>Users UID</th>
                <th>Time read(seconds)</th>
            </tr>
        `
        for (let element in data["complete-time"]) {
            document.getElementById("tableInfo").innerHTML += `
            <tr>
                <td>${element}</td>
                <td>${data["complete-time"][element]}</td>
            </tr>
            `
        }
    }

    changeDocument(option) {
        let docsIDs = this.state.dropdownOptions
        let no = docsIDs.indexOf(option.label)

        console.log(this.state.selectedDisplay)
        console.log(this.state.selectedDocumentId)
        switch (this.state.selectedDisplay) {
            case "Chart": {
                this.renderChart(this.state.data[no]);
                this.renderChart(this.state.data[no]);
                document.getElementById("chart").style.display = "block"
                document.getElementById("table").style.display = "none"
                break;

            }

            case "Table": {
                this.renderChart(this.state.data[no]); 
                this.renderChart(this.state.data[no]); 
                document.getElementById("chart").style.display = "none"
                document.getElementById("table").style.display = "block"
                
                break;
            }

            case "Both": {
                this.renderChart(this.state.data[no])
                this.renderTable(this.state.data[no])

                document.getElementById("chart").style.display = "block"
                document.getElementById("table").style.display = "block"
                break;
            }
            default: {
                break;
            }
        }

        let views = "" + this.state.data[no]["total-views"]
        this.setState({
            selectedDocumentId: option.label,
            views: views
        })
    }
    changeDisplayData(option) {
        let docsIds = this.state.dropdownOptions;
        let currentDocumentNo = docsIds.indexOf(this.state.selectedDocumentId)

        switch (option.label) {
            case "Chart": {

                document.getElementById("chart").style.display = "block"
                document.getElementById("table").style.display = "none"
                this.renderChart(this.state.data[currentDocumentNo])
                this.renderTable(this.state.data[currentDocumentNo])
                break;
            }
            case "Table": {
                document.getElementById("chart").style.display = "none"
                document.getElementById("table").style.display = "block"
                this.renderTable(this.state.data[currentDocumentNo])
                this.renderChart(this.state.data[currentDocumentNo])
                break;
            }
            case "Both": {
                document.getElementById("chart").style.display = "block"
                document.getElementById("table").style.display = "block"
                this.renderTable(this.state.data[currentDocumentNo])
                this.renderChart(this.state.data[currentDocumentNo])
                break;
            }
            default: {
                console.log("error occured")
            }
        }
    }
    render() {

        return (
            <div className="content">
                <div id="documents-list" style={{ width: "1%", margin: "auto", textAlign:"center" }}>
                    <Dropdown
                        options={this.state.dropdownOptions}
                        value={this.state.dropdownOptions[0]}
                        onChange={this.changeDocument}
                    />
                </div>
                <div id="chooseTypeofData" style={{ width: "1%", margin: "auto" }}>
                    <Dropdown
                        options={["Chart", "Table", "Both"]}
                        value={"Chart"}
                        onChange={this.changeDisplayData}
                    />
                </div>
                <div className="stats">
                    <p style={{ textAlign: "center" }}>This document has {this.state.views} views</p>
                    <div id="chart" style={{ width: "50vw", height: "50vh", margin: "auto" }}>
                        <Bar data={this.state.chartdata} options={{ scales: { yAxes: [{ ticks: { beginAtZero: true, }, },], }, maintainAspectRatio: false }}></Bar>

                    </div>
                    <div id="table" style={{ display: "none", width: "50vw", margin: "auto" }}>
                        <table id="tableInfo">

                        </table>
                    </div>
                </div>

            </div>

        )
    }
}
