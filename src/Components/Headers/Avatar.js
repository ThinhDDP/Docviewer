import firebase from '../../firebase'
import React from 'react'
import {MenuItem, SubMenu} from 'react-pro-sidebar';
import {Link} from 'react-router-dom'
import 'react-pro-sidebar/dist/css/styles.css';
//Import Icons
import {FaUserCircle} from 'react-icons/fa'
import './Avatar.css'

function logOut(){
    firebase.auth().signOut()
    window.location.reload()
}

const User = ({User}) => {
    return (
    <SubMenu className="transparent" title={User.displayName} icon={<FaUserCircle />}>
        <MenuItem><Link to="/settings">Settings</Link></MenuItem>
        <MenuItem><button onClick={() => logOut()}>Logout</button></MenuItem>
    </SubMenu>
    )
}

export default class Avatar extends React.Component{
    constructor(){
        super();
        this.state = {
            user: null
        }
    }

    getUser(){
        firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.state.user = user
            }
            else {
                this.state.user = "notLoggedIn"
            }
            this.setState({
                isLoading : false
            })
        })

    }
    componentDidMount(){
        this.getUser()
    }
    getUserInfo(user){
        return [user.displayName, user.email]
    }
    render(){
        const { user } = this.state;
        switch (this.state.user){
            case null:
                return (<MenuItem>Loading user info ...</MenuItem>)
                break;
            case "notLoggedIn":
                return (<SubMenu title="User" icon={<FaUserCircle />}>
                            <MenuItem   MenuItem><Link to="/login">Login</Link></MenuItem>
                            <MenuItem   MenuItem><Link to="/register">Register</Link></MenuItem>
                        </SubMenu>
                )
                break;
            default:
                return(<User User={this.state.user}/>)
                break;
        }
    }
}