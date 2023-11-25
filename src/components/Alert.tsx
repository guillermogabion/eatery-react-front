import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Alerts = ({ variant, message }) => {
    const [show, setShow] = useState(true);
    const [key, setKey] = useState(0);

  return (
    <div variant={variant} className={`w-100 p-0 pt-2 alert fade ${show ? 'show' : ''}`}  style={{ textAlign: "left" }} >
      <span className={`text-${variant}`}><b>{message}</b></span>
    </div>
  );
};

export default Alerts;