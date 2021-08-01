import React from "react";
import Open from './Open.js'
import "./Recent.css"
import Pagination from "react-js-pagination";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// require("bootstrap/less/boostrap.less")

export default class Recent extends React.Component {
    constructor() {
        super()
        this.state = {
            code: 9021,


        }
        this.handleViewDocClick = this.handleViewDocClick.bind(this)
    }
    componentDidMount() {
        let requestResponse = {

        }



    }
    renderCards(data) {

    }
    handleViewDocClick(value) {
        console.log(value)

    }

    render() {

        return (
            <div className="wrapper">
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

                                    <div className="cardDoc">
                                        <p>Document-id</p>
                                        <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                    </div>
                                    <div className="cardDoc">
                                        <p>Document-id</p>
                                        <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                    </div>
                                    <div className="cardDoc">
                                        <p>Document-id</p>
                                        <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                    </div>
                                    <div className="cardDoc">
                                        <p>Document-id</p>
                                        <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                    </div>
                                    <div className="cardDoc">
                                        <p>Document-id</p>
                                        <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                    </div>
                                    <div className="cardDoc">
                                        <p>Document-id</p>
                                        <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                    </div>
                                </div>


                            </div>
                        </TabPanel>
                        <TabPanel>
                            <h3>Completed Documents</h3>
                            <div className="sectionRecent" id="completedSection">

                                <div className="cardDoc">
                                    <p>Document-id</p>
                                    <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                </div>
                                <div className="cardDoc">
                                    <p>Document-id</p>
                                    <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                </div>
                                <div className="cardDoc">
                                    <p>Document-id</p>
                                    <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                </div>
                                <div className="cardDoc">
                                    <p>Document-id</p>
                                    <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                </div>
                                <div className="cardDoc">
                                    <p>Document-id</p>
                                    <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                </div>
                                <div className="cardDoc">
                                    <p>Document-id</p>
                                    <button onClick={this.handleViewDocClick("document-id")}>View document</button>
                                </div>
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