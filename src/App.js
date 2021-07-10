import {Router, Switch, Route, BrowserRouter} from 'react-router-dom'
import './App.css';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import firebase from "firebase/app";
import "firebase/auth";
import 'react-pro-sidebar/dist/css/styles.css';
import Header from './Components/Headers/Header'

import Create from './Pages/Create'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Settings from './Pages/Settings'



function App() {
  return (
    <div>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/create" component={Create}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/settings" component={Settings}></Route>
          </Switch>
        </BrowserRouter>

    </div>
  );
}

export default App;