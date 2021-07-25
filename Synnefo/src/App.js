import {Switch, Route, BrowserRouter} from 'react-router-dom'
import './App.css';
import "firebase/auth";
import 'react-pro-sidebar/dist/css/styles.css';
import Header from './Components/Headers/Header'

import Create from './Pages/Create'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Settings from './Pages/Settings'
import Open from './Pages/Open'
import Track from './Pages/Track'
import Recent from "./Pages/Recent"



function App() {
  return (
    <div>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/create" component={Create}></Route>
            <Route path="/open" component={Open}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/settings" component={Settings}></Route>
            <Route path="/track" component={Track}></Route>
            <Route path="/recent" component={Recent}></Route>
          </Switch>
        </BrowserRouter>

    </div>
  );
}

export default App;