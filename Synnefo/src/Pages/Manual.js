import React from 'react'
import "./Manual.css"
import LoggedPic from "../Images/LoggedPic.png"
import notLoggedPic from "../Images/notLoggedPic.png"
import step1 from "../Images/step1.png"
import step2 from "../Images/step2.png"
import step3 from "../Images/step3.png"
import step4 from "../Images/step4.png"
export default class Manual extends React.Component {
    constructor() {
        super()

    }

    render() {
        return (
        <div className="manualDiv">
        <div className="wrapper">
            <div className="manual">
                <h1 id="docviewer-manual">Docviewer manual</h1>
                <p>This is gonna tell you how to use this website</p>
                <h2 id="sidebar-contents">Sidebar contents</h2>
                <div className="imgFlex">
                    <img src={LoggedPic}></img>
                    <img src={notLoggedPic}></img>
                </div>
                <p style={{textAlign:"center"}}>Images of sidebar when the user is logged in and not logged in respectively</p>
                <ol>
                    <li>User<br />
                        If the user is not signed in, it will show Register and Login.<br />
                        Register let the user to make a new account or Sign Up using Google, Login let them use Google or Email.<br />
                        If the user is signed in, it will show Settings and Logout, which Settings let them change their information while logout will do as it named.</li>
                    <li>Home<br />
                        This page will show what is the website about, contains or the contact, summarized information.</li>
                    <li>Recent<br />
                        This page will only show when the user is logged in, contains all the document that they have read or completed.</li>
                    <li>Document<br />
                        This contains 3 pages:<ol>
                            <li>Create<br />
                                Create will only work when the user is signed in, they will sign in with their google account and then the wizard of creating the code attached to the document has 3 steps:<ol>
                                    <li>Choose Document<br />
                                        There will be a list of their Google Doc documents for them to choose.</li>
                                    <li>Make the document title and choose person who can see the file stats<br />
                                        They will input the document title, and choose everyone with code to view the file stats, or specific person( in email) or them to view file stats.</li>
                                    <li>Choose the person to send the code<br />
                                        They will be prompted to choose who to send code via emails.<br />
                                        After all the steps, they will get the code.</li>
                                </ol>
                            </li>
                            <li>Open<br />
                                They will type in the code they receivied from the owner of the document, any user can log in or not to use this feature, but after viewing the document, the user who is not logged in cannot save the time by clicking the complete button in the bottom of the document after viewing.</li>
                            <li>Track<br />
                                This feature is only available to logged in users. They can choose to see the stats of the document that they can track it with code, or their own documents.
                            </li>
                        </ol>

                    </li>
                </ol>
                <h2 id="how-to-use-the-site-in-the-best-way">How to use the site in the best way</h2>
                <p>Following these steps is the way that we desired you to use this site.</p>
                <div className="steps">
                    <img src={step1}></img>
                    <p>Step 1. Navigate to register or login page</p>
                    <img src={step2}></img>
                    <p>Step 2. Link your google account and continue to use the wizard</p>
                    <img src={step3}></img>
                    <p>Step 3. Open a document or your just created document</p>
                    <img src={step4}></img>
                    <p>Step 4. Track a public document or yours</p>
                </div>
                
                <ol>

                    <li>Make an account or sign in with google<br />
                        Make an option if they want to sign in with google or with email, or make a new account with email or google. It will then popup to get you redirect to homepage or this manual</li>
                    <li>Create a document<br />
                        Most people often create an account to get recent documents or make a document. To make a document, you can do as what the wizard said in the Create section, as said in the Sidebar Content.</li>
                    <li>Open a document<br />
                        Use a code to open an existing document, you can also use the code you just got to test this feature.</li>
                    <li>Track the document<br />
                        Tracking a public document or your document is your choice. Following sidebar content section can help.</li>
                </ol>

            </div>
        </div>
        </div>
        )
    }
}