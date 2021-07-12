import firebase from '../firebase' //Firebase only needs to init once
import React from 'react';
import "./Settings.css";


export default class settings extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true
        }
        this.info = []
    }


    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user){
                this.info = [user.email, user.displayName, user.photoURL] //User will have a default avatar now, so photoURL will works
                this.setState({
                    isLoading: false //Set isLoading to false here, adn React will update accordingly
                })
            }
            else{
                //Shouldn't happen, but we will redirect to home here
                window.location.href = "/"
            }
        })
    }
    render() {
        if (this.state.isLoading){
            return (<div className="wrapper">
            <div className="bg">
                <div className="content">

                    <p id="loader">Loading user info</p>
                    </div>
                </div>
            </div>
        )
        }
        else{
            return (<div className="wrapper">
            <div className="bg">
                <div className="content">

                    <div id="loaded">
                        <img src={this.info[2]} width="50vw" height="50h"/>
                        <p id="email">{this.info[0]}</p>
                        <p id="displayName">{this.info[1]}</p>
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




