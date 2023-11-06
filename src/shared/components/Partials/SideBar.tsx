import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Utility } from '../../../utils';
import { sidebarlogo } from '../../../assets/images';

const SideBar = ({ sidebarOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    // Redirect to the Login component using history
    history.push('/');
    Utility.deleteUserData();
    dispatch({ type: "IS_LOGIN", payload: false });
  };

  return (
    <>
      <div className={`collapsible-sidebar ${sidebarOpen ? 'open' : 'close'}`}>
        <div className='d-flex justify-content-center'>
          <img src={sidebarlogo} width={150} alt="" />
        </div>
        <Nav defaultActiveKey="/home" className="flex-column sidebar-nav">
          <Nav.Link as={NavLink} to="/home" className='sidebar-nav-link' onClick={closeSidebar} >
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/store" className='sidebar-nav-link' onClick={closeSidebar}>
            Stores
          </Nav.Link>
          <Nav.Link as={NavLink} to="/about" className='sidebar-nav-link' onClick={closeSidebar}>
            About
          </Nav.Link>
          {/* Add more Nav.Link items for other routes */}
        </Nav>
        <div className="mt-auto">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
