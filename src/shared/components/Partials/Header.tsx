import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux"

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.rootReducer.userData.user) || {};
  const [ optionContainer , setOptionContainer ] = useState(false)
  
  // const firstname = user && user.firstname;

  return (
    <div className="header-container">
      <div className={`toggle-sidebar-icon ${sidebarOpen ? 'pushed' : ''}`}>
        <div className="" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes className="toggle-button" /> : <FaBars className="toggle-button pl-3 ml-3" />} {/* Toggle between icons */}
        </div>
        
      </div>
      <div className="d-flex justify-content-end pr-10">
        <div style={{cursor: 'pointer'}} onClick={() => setOptionContainer(!optionContainer)}>{user.firstname}</div>
        {
          optionContainer && (
            <div style={{ position:'absolute', top: 50, zIndex: 2, width: '100px', height: '100px', backgroundColor: 'lightgray', opacity: 0.8 }} className='d-flex flex-column'>
              <span className='option'>1</span>
              <span className='option'>2</span>
              <span className='option'>3</span>
            </div>
          )
        }
      </div>
    


      {/* Other header content */}
    </div>
  );
};

export default Header;
