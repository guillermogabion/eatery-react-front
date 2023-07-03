import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import { Button, Modal, Form } from "react-bootstrap"
import HDMF from './hdmf';
import PH from './philhealth';
import SSS from './sss';
import SSSBtn from './sssbutton';
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
    <div>
        <SSS/>
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
      <Tabs defaultActiveKey="sss" id="sss"
        onSelect={(k: any) => {
          setKey(k)
        }}>
        <Tab eventKey="sss" title="SSS">
          <SSSPage />
        </Tab>
        <div>
          i am button
        </div>
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
