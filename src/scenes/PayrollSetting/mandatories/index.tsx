import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import HDMF from './hdmf';
import PH from './philhealth';
import { Tab, Tabs } from 'react-bootstrap';

const HFMDPage = () => {
  return (
    <div className='p-3'>
      <HDMF />
    </div>
  );
};

const SSSPage = () => {
  return (
    <div className='p-3'>
      <h1>Ongoing</h1>
      {/* Rest of the content */}
    </div>
  );
};

const TaxPage = () => {
  return (
    <div className='p-3'>
      <h1>Ongoing</h1>
      {/* Rest of the content */}
    </div>
  );
};
const PhilHealthPage = () => {
  return (
    <div className='p-3'>
      <PH />
    </div>
  );
};

const Mandatory = () => {
  const [key, setKey] = React.useState('sss');

  return (
    <div className='p-3'>
      <Tabs defaultActiveKey="tab1" id="my-tabs"
        onSelect={(k: any) => {
          setKey(k)
        }}>
        <Tab eventKey="sss" title="SSS">
          <SSSPage />
        </Tab>
        <Tab eventKey="tax" title="Tax">
          <TaxPage />
        </Tab>
        <Tab eventKey="hdmf" title="HDMF">
          <HFMDPage />
        </Tab>
        <Tab eventKey="philhealth" title="Philhealth">
          <PhilHealthPage />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Mandatory;
