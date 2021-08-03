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
            viewedDocs: {},
            completedDocs: {},

        }
        this.handleViewDocClick = this.handleViewDocClick.bind(this)
        // this.renderCards = this.renderCards.bind(this)



    }
    componentDidMount() {

        let completedDocs = {
            "abcdefg": "dwdewdw",
            "abcdefg1": "whatareyouupto",
            "abcdefg2": "welcomeToMyChannel",
            "abcdef3g": "Never gonna give up you up",
            "abcdefg3": "hello friends",
            "abcdefg4": "what the heck",
            "abcdef23g": "ching cheng hanj",
        }
        let viewedDocs = {
            "viewedviewedveiwed12": "viewedDOcumentConfirm",
            "wdwhat": "test1",
            "test2": "test3",
            "test4": "tes5",
            "test6": "test7",
            "test8": "test9"
        }
        this.setState({
            completedDocs: completedDocs,
            viewedDocs: viewedDocs
        });
    }
    handleViewDocClick(event) {
        this.setState({ code: event.target.id })
        document.getElementById("niceLists").style.display = "none"
        document.getElementById("viewDoc").style.display = "block"


    }
    render() {
        let completedDocs = this.state.completedDocs;
        let viewedDocs = this.state.viewedDocs;

        let arrayDocs_viewed = [];
        let arrayDocs_completed = [];

        for (const document_id in completedDocs) {
            arrayDocs_completed.push(
                <div className="cardDoc">
                    <p>{completedDocs[document_id]}</p>
                    <button onClick={this.handleViewDocClick} id={document_id}>View document</button>
                </div>
            )
        }
        for (const document_id in viewedDocs) {
            arrayDocs_viewed.push(
                <div className="cardDoc">
                    <p>{viewedDocs[document_id]}</p>
                    <button onClick={this.handleViewDocClick} id={document_id}>View document</button>
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
                <div id="viewDoc" style={{ display: "none" }}>
                    <Open code={this.state.code} />
                </div>
            </div>

        )
    }
}
