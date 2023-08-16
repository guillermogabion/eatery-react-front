import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import { Button, Modal, Form } from "react-bootstrap"
import HDMF from './hdmf';
import PH from './philhealth';
import SSS from './sss';
import Tax from './tax';
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
    <div>
        <Tax/>
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
      {/* <Tabs defaultActiveKey="sss" id="sss"
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
      </Tabs> */}
      <div>
        <span className="text-primary font-bold" style={{fontSize: "20px"}}>SSS</span>
        <SSSPage />
      </div>
      <div>
        <span className="text-primary font-bold" style={{fontSize: "20px"}}>Tax</span>
        <TaxPage />
      </div>
      <div>
        <span className="text-primary font-bold" style={{fontSize: "20px"}}>Philhealth</span>
        <HFMDPage />
      </div>
      <PhilHealthPage />




    </div>
  );
};

export default Mandatory;
