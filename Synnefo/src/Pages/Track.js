
import React from "react";

import { Bar } from "react-chartjs-2";
import Dropdown from "react-dropdown"








export default class Track extends React.Component {
    constructor() {
        super()
        this.state = {
            dataChart: {
                labels: [],
                datasets: []
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                maintainAspectRatio: false,
            },
            dropdownOptions: [],
            data: null,


            specificDocumentChart: {},
            data: {}




        }
        this.dropdownChange = this.dropdownChange.bind(this)
        this.renderData = this.renderData.bind(this)

    }
    componentDidMount() {
        //the time will be counted in seconds


        let data = [
            {
                "document-code": "Global",
                "total-views": 34,

                "total-time": 10
            },
            {
                "document-code": "23e24",
                "total-views": 939,
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


        //Load chart
        this.setState({ data: data })



        let labels = []
        let dataTime = []
        let dataViews = []

        let dropdowns = []
        for (let i = 0; i < data.length; i++) {

            dataTime.push(data[i]["total-time"])
            dataViews.push(data[i]["total-views"])
            labels.push(data[i]["document-code"])
            dropdowns.push(data[i]["document-code"])

        }
        this.setState({
            dataChart: {
                labels: labels,
                datasets: [
                    {
                        label: "Views",
                        data: dataViews,
                        backgroundColor: 'rgb(255, 99, 132)'
                    },
                    {
                        label: "Time",
                        data: dataTime,
                        backgroundColor: 'rgb(54, 162, 235)'
                    }
                ]
            },
            dropdownOptions: dropdowns,
            data: data,
        })
    }

    dropdownChange(option) {
        let optionValue = option.label
        let dataToRender = this.state.data[this.state.dropdownOptions.indexOf(optionValue)]
        this.renderData(JSON.stringify(dataToRender))
    }

    renderData(dataRender) {
        let renderData = JSON.parse(dataRender)
        document.getElementById("tableStats").innerHTML = `<tr><th>User UID</th><th>Seconds</th></tr>`


        if (renderData["document-code"] == "Global") {
            document.getElementById("others").innerText = "User stats is not avalible for global"
            let data = this.state.data
            let labels = []
            let dataTime = []
            let dataViews = []
            for (let i = 0; i < data.length; i++) {
                dataTime.push(data[i]["total-time"])
                dataViews.push(data[i]["total-views"])
                labels.push(data[i]["document-code"])
            }
            this.setState({
                dataChart: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Views",
                            data: dataViews,
                            backgroundColor: 'rgb(255, 99, 132)'
                        },
                        {
                            label: "Time",
                            data: dataTime,
                            backgroundColor: 'rgb(54, 162, 235)'
                        }
                    ]
                },
            })
        } else {
            // let count = Object.keys(renderData["complete-time"].length);
            document.getElementById("others").innerText = `Your document has ${renderData["total-views"]} views`

            let chartRenderData_users = []
            let chartRenderData_time = []
            for (const property in renderData["complete-time"]) {
                chartRenderData_users.push(property)
                chartRenderData_time.push(renderData["complete-time"][property])


                document.getElementById("tableStats").innerHTML +=
                    `<tr>
                    <td>${property}</td>
                    <td>${renderData["complete-time"][property]}</td>
                </tr>`

            }

            chartRenderData_users.push("Total'")
            chartRenderData_time.push(renderData["total-time"])


            let chartRender = {
                labels: chartRenderData_users,
                datasets: [
                    {
                        label: "Time",
                        data: chartRenderData_time,
                        backgroundColor: 'rgb(255, 99, 132)'
                    }
                ]

            }

            this.setState({
                dataChart: {
                    labels: chartRenderData_users,
                    datasets: [
                        {
                            label: "Time",
                            data: chartRenderData_time,
                            backgroundColor: 'rgb(255, 99, 132)'
                        }
                    ]
                }
            })
        }

    }
    render() {
        return (
            <div>
                <div className="dropdown" style={{ margin: "auto", width: "10%", textAlign: "center" }}>
                    <span>Display chart for</span>
                    <Dropdown
                        options={this.state.dropdownOptions}
                        value={this.state.dropdownOptions[0]}
                        onChange={this.dropdownChange}
                    />
                </div>
                <div className="info">
                    <div id="chart" style={{ width: "50vw", height: "50vh", margin: "auto" }} >
                        <Bar data={this.state.dataChart} options={this.state.options} id="realChart"></Bar>
                    </div>
                    <div id="stats" style={{ width: "50%", margin: "auto" }}>
                        <p id="others">User stats is not avalible for global</p>

                        <table id="tableStats">
                            <tr>
                                <th>User UID</th>
                                <th>Seconds</th>
                            </tr>

                        </table>
                    </div>
                </div>
            </div>

        )
    }
}
