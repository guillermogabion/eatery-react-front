import React, { useState, useEffect } from 'react';
import Header from '../Partials/Header';
import Footer from '../Partials/Footer';
import SideBar from '../Partials/SideBar';
import { Route, Switch } from 'react-router-dom'; // Import Route and Switch
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const Dashboard = () => {
  return <h2>Dashboard</h2>; // Replace with the actual Dashboard component
};

const Profile = () => {
  return <h2>Profile</h2>; // Replace with the actual Profile component
};

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mainContentClass, setMainContentClass] = useState('col-8');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
        setMainContentClass('col-12');
      } else {
        setSidebarOpen(true);
        setMainContentClass('col-8');
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      </Row>
      <Row>
        <div className={`${sidebarOpen ? 'open' : ''}`}>
          <SideBar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
        </div>
        <div className={`${sidebarOpen ? 'main-content-open' : 'col-12'}`}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/profile" component={Profile} />
            {/* Define other routes using the same pattern */}
          </Switch>
        </div>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
};

export default RootLayout;
