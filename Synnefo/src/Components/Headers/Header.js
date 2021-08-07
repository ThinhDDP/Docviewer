import React from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarContent, SidebarHeader } from 'react-pro-sidebar';
import {Link} from 'react-router-dom'
import 'react-pro-sidebar/dist/css/styles.css';
import './Header.css'
//Import Icons
import {FaHome} from 'react-icons/fa'
import {GiBackwardTime} from 'react-icons/gi'
import {HiDocumentText} from 'react-icons/hi'
import {FiArrowLeftCircle, FiArrowRightCircle} from 'react-icons/fi'
import Avatar from './Avatar';


class Header extends React.Component{
  
  constructor(){
    super();
    this.state = {
      menuCollapse : false
    }
    this.menuIconClick = this.menuIconClick.bind(this)
  }

  componentDidMount(){
    if (window.innerHeight < 600 || window.innerWidth < 600){
      this.setState({
        menuCollapse : true
      })
      this.menuIconClick= () => {return 0}
    }
  }
  setMenuCollapse(bool){
    this.setState({menuCollapse : bool})
  }

  menuIconClick = () => {
    this.state.menuCollapse ? this.setMenuCollapse(false) : this.setMenuCollapse(true);
  }
  render(){
    return (
      <div id="header">
      <ProSidebar collapsed={this.state.menuCollapse}>
      
      <SidebarHeader>
          <div className="logotext">
              {/* small and big change using menucollapse state */}
              <p>{this.state.menuCollapse ? "Logo" : "Big Logo"}</p>
              <div className="closemenu" onClick={this.menuIconClick}>
              {this.state.menuCollapse ? (
                <FiArrowLeftCircle/>
              ) : (
                <FiArrowRightCircle/>
              )}
            </div>
          </div>

          </SidebarHeader>
          <SidebarContent>
        <Menu iconShape="square">
          <Avatar/>
          <MenuItem MenuItem icon={<FaHome />}>
            <Link to="/">Home</Link>
          </MenuItem>
          <MenuItem NemuItem icon={<GiBackwardTime/>}><Link to="/recent">Recent</Link></MenuItem>
          <SubMenu title="Document" icon={<HiDocumentText/>}>
              <MenuItem><Link to="/create">Create</Link></MenuItem>
              <MenuItem><Link to="/open">Open</Link></MenuItem>
              <MenuItem><Link to="/track">Track</Link></MenuItem>
          </SubMenu>
           
        </Menu>
        </SidebarContent>
      </ProSidebar>
      </div>
    )
  }
}

export default Header;