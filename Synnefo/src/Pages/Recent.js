import React from "react";
import Open from './Open.js'
import "./Recent.css"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


export default class Recent extends React.Component {
    constructor() {
        super()
        this.state = {
            code: 9021,
            viewedData: [],
            completedData: [],

        }
        this.handleViewDocClick = this.handleViewDocClick.bind(this)
        this.renderCards = this.renderCards.bind(this)



    }
    componentDidMount() {
        let data = {
            "viewed": ["abcdefg", "abcdefg", "abcdefg", "abcdefg", "abcdefg", "abcdefg", "abcdefg",],
            "completed": ["dewdew", "dwedwdwd", "dwdew"]
        }

        this.setState({
            viewedData: data["viewed"],
            completedData: data["completed"],
        });
        console.log(data)
        this.renderCards(data["completed"], data["viewed"]);
    }

    renderCards(completed, viewed) {
        console.log(viewed.length)
        let viewed_length = viewed.length
        if (document.getElementById("viewedSection") == null) {
            document.getElementById("completedSection").innerHTML = ""
            for (let i = 0; i < completed.length; i++) {
                document.getElementById("completedSection").innerHTML +=
                `<div className ="cardDoc">
                    <p>${completed[i]}</p>
                    <button onClick=${this.handleViewDocClick} id=${completed[i]}>View document</button>    
                </div>`
            }
        } else {
            document.getElementById("viewedSection").innerHTML = ""
            for (let i = 0; i < viewed_length; i++) {
                document.getElementById("viewedSection").innerHTML +=
                    `
                <div className="cardDoc">
                    <p>${viewed[i]}</p>
                    <button onClick=${this.handleViewDocClick} id=${viewed[i]}>View document</button>
                </div>
                `

            }
        }

    }
    handleViewDocClick(event) {
        this.setState({ code: event.target.id })
        document.getElementById("docLists").style.display = "none"
        document.getElementById("viewDoc").style.display = "block"

    }
    handleTabClick(selectedTab, unselectedTab) {
        this.renderCards(this.state.completedData, this.state.viewedData)
    }
    render() {
        return (
            <div className="wrapper">
                <div id="docLists">


                    <Tabs onSelect={(firstTab, lastTab) => this.handleTabClick(firstTab, lastTab)}>
                        <TabList>
                            <Tab>Viewed Documents</Tab>
                            <Tab>Completed Documents</Tab>
                        </TabList>
                        <TabPanel>
                            <div id="viewed">
                                <h3>Viewed Documents</h3>
                                <div className="sectionRecent" id="viewedSection"></div>



                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div id="completed">
                                <h3>Completed Documents</h3>
                                <div className="sectionRecent" id="completedSection"></div>
                                </div>

                        </TabPanel>
                    </Tabs>

                </div>

                <div id="viewDoc" style={{ display: "none" }}>
                    <Open code={this.state.code} />
                </div>
            </div>

        )
    }
}
