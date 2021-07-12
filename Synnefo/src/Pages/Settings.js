import firebase from "firebase"
import React from 'react';
import "firebase/auth";
import "./Settings.css";


export default class settings extends React.Component {
    constructor() {
        super();
        

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              var uid = user.uid;

              document.getElementById("loader").style.display = "none";
              document.getElementById("loaded").style.display = "block";
              document.getElementById("email").innerText += `Your email ${user.email}`
              document.getElementById("displayName").innerText += `Your display name ${user.displayName}`
              // ...


  
            } else {
              // User is signed out
              // ...
            }
        });





    }


    
    render() {
        return (<div className="wrapper">
            <div className="bg">
                <div className="content">

                    <p id="loader">Loading user info</p>
                    <div id="loaded">
                        <img src="https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png" width="50px" height="50px"></img>
                        <p id="email"></p>
                        <p id="displayName"></p>
                    </div>
                </div>
            </div>

        </div>)
    }
}