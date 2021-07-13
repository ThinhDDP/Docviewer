import firebase from '../firebase' //Firebase only needs to init once
import React from 'react';
import "./Settings.css";


export default class settings extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
        }
        this.info = []
        this.displayName = React.createRef();
        this.email = React.createRef();
        this.avatar = React.createRef();


    }


    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.info = [user.email, user.displayName, user.photoURL] //User will have a default avatar now, so photoURL will works
                this.setState({
                    isLoading: false //Set isLoading to false here, adn React will update accordingly
                })


            }
            else {
                //Shouldn't happen, but we will redirect to home here
                window.location.href = "/"
            }
        })
    }



    changePic(event) {


        console.log("ok")
    }
    changeInfo() {
        const user = firebase.auth().currentUser;



        let email = document.getElementById("email");
        let displayName = document.getElementById("displayName");
        user.updateProfile({
            displayName: email.value
        }).then(() => {
            window.location = window.location;


        }).catch((error) => {
            document.getElementById("error").innerText = error;

        })


        user.updateEmail(email.value).then(() => {
            window.location = window.location
        }).catch((error) => {
            document.getElementById("error").innerText += error
        })

        console.log("ok")

    }
    render() {
        if (this.state.isLoading) {
            return (<div className="wrapper">
                <div className="bg">
                    <div className="content">

                        <p id="loader">Loading user info</p>
                    </div>
                </div>
            </div>
            )
        }
        else {
            return (<div className="wrapper">
                <div className="bg">
                    <div className="content">

                        <div id="loaded">
                            <img src={this.info[2]} width="50vw" height="50h" />
                            <p id="email">Email : {this.info[0]}</p>
                            <p id="displayName">Display name: {this.info[1]}</p>


                            <h3>Changing your profile</h3>

                            <p>Your avatar</p>
                            <div><input type="file" ref={this.avatar} onChange={this.changePic} accept="image/*"  ></input></div>
                            <p>Your info</p>
                            <div><input type="text" placeholder="Diplay name" defaultValue={this.info[1]} ref={this.displayName} id="displayName" ></input></div>
                            <div><input type="text" placholder="Email" defaultValue={this.info[0]} ref={this.email} id="displayName"></input></div>
                            <button onClick={this.changeInfo} className="button">Change Info</button>

                            <p id="error" style={{color: "red"}}></p>

                        </div>

                    </div>
                </div>

            </div>
            )
        }
    }
}




        // firebase.auth().onAuthStateChanged((user) => { STOP PASTING CODE YOU DON'T UNDERSTAND
        //     if (user) {
        //       // User is signed in, see docs for a list of available properties
        //       // https://firebase.google.com/docs/reference/js/firebase.User
        //       var uid = user.uid;

        //       document.getElementById("loader").style.display = "none";
        //       document.getElementById("loaded").style.display = "block";
        //       document.getElementById("email").innerText += `Your email ${user.email}`
        //       document.getElementById("displayName").innerText += `Your display name ${user.displayName}`
        //       // ...



        //     } else {
        //       // User is signed out
        //       // ...
        //     }
        // });




