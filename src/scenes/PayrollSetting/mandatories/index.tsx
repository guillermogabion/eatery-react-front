import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import HDMF from './hdmf';
import PH from './philhealth';

const MyBreadcrumbs = () => {
  const [activePage, setActivePage] = useState('/hfmd');
  const history = useHistory();

  const handleClick = (path) => {
    setActivePage(path);
    history.push('/payroll/settings' + path);
  };

  return (
    <Breadcrumb>
     
      <Breadcrumb.Item
        as={NavLink}
        to="/sss"
        onClick={() => handleClick('/sss')}
        isActive={() => activePage === '/sss'}
      >
        SSS
      </Breadcrumb.Item>
      <Breadcrumb.Item
        as={NavLink}
        to="/hfmd/sss/tax"
        onClick={() => handleClick('/sss/tax')}
        isActive={() => activePage === '/sss/tax'}
      >
        Tax
      </Breadcrumb.Item>
      <Breadcrumb.Item
        as={NavLink}
        to="/sss/tax/hdmf"
        onClick={() => handleClick('/sss/tax/hdmf')}
        isActive={() => activePage === '/sss/tax/hdmf'}
      >
        HDMF
      </Breadcrumb.Item>
      <Breadcrumb.Item
        as={NavLink}
        to="/sss/tax/hdmf/philhealth"
        onClick={() => handleClick('/sss/tax/hdmf/philhealth')}
        isActive={() => activePage === '/sss/tax/hdmf/philhealth'}
      >
         PhilHealth
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

const HFMDPage = () => {
  return (
    <div>
      <h1>HDMF Page</h1>
      {/* Rest of the content */}
      <HDMF />
    </div>
  );
};

const SSSPage = () => {
  return (
    <div>
      <h1>SSS Page</h1>
      {/* Rest of the content */}
    </div>
  );
};

const TaxPage = () => {
  return (
    <div>
      <h1>Tax Page</h1>
      {/* Rest of the content */}
    </div>
  );
};
const PhilHealthPage = () => {
  return (
    <div>
      <h1>PhilHealth Page</h1>
      {/* Rest of the content */}
      <PH/>
    </div>
  );
};

const Mandatory = () => {
  return (
    <Router>
      <div>
        <MyBreadcrumbs />
        <Switch>
          <Route exact path="/payroll/settings" component={SSSPage} />
          <Route exact path="/payroll/settings/sss" component={SSSPage} />
          <Route exact path="/payroll/settings/sss/tax" component={TaxPage} />
          <Route exact path="/payroll/settings/sss/tax/hdmf" component={HFMDPage} />
          <Route exact path="/payroll/settings/sss/tax/hdmf/philhealth" component={PhilHealthPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default Mandatory;
