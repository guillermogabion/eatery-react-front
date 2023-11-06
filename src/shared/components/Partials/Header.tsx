import React from 'react';
import { Button } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <div className="header-container">
      <div className={`toggle-sidebar-icon ${sidebarOpen ? 'pushed' : ''}`}>
        <div className="" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes className="toggle-button" /> : <FaBars className="toggle-button pl-3 ml-3" />} {/* Toggle between icons */}
        </div>
      </div>
      {/* Other header content */}
    </div>
  );
};

export default Header;
