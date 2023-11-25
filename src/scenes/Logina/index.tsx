import React, { useState, useEffect } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { RequestAPI, Api } from "../../api";
import moment from "moment";
import { Utility } from "../../utils";
import Swal from "sweetalert2";
const CryptoJS = require("crypto-js");
import { sidebarlogo } from "../../assets/images";
import Loader from "../../components/Loader/ReactLoader";
import Alerts from "../../components/Alert";


const Spinner = () => (
  <div className="d-flex justify-content-center align-items-center">
    <div className="spinner">
      <div></div>   
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
    </div>
  </div>
);

export const Login = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);

  const keydownFun = (event: any) => {
    if (event.key === "Enter" && login && password) {
      loginRequest();
    }
  };

  useEffect(() => {
    if (login && password) {
      document.removeEventListener("keydown", keydownFun);
      document.addEventListener("keydown", keydownFun);
    }
    return () => document.removeEventListener("keydown", keydownFun);
  }, [login, password]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
      setCurrentDate(moment().format("MMMM-DD-YYYY"));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const loginRequest = () => {
    if (!login || !password) {
      setErrorMessage('Username/Email and Password are required.');
      setLoading(false);

      return;
    }
    setLoading(true);
    setShowLoadingAnimation(true);
    if (login && password) {

      RequestAPI.postRequest(Api.Login, "", { login, password }, {}, (res) => {
        const { status, body } = res;
         if (status === 200) {
          if (body.error && body.error.message) {
            setErrorMessage(body.error.message);
            setPassword("")
          } else {
            const { accessToken, refreshToken, roleId } = body;
            const sessionDateTime = moment().format("DD/MM/YYYY H:mm:ss a");
            // window.localStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(accessToken, process.env.REACT_APP_ENCRYPTION_KEY));
            window.localStorage.setItem("_as175errepc", body.accessToken)
            window.localStorage.setItem("_setSessionLoginTimer", sessionDateTime);
            Utility.clearOnLoginTimer();
            const userObj = { ...body };
            if (userObj && userObj.accessToken) {
              delete userObj.accessToken;
            }
            dispatch({ type: "USER_DATA", payload: userObj });
            dispatch({ type: "IS_LOGIN", payload: true });

          }
        } 
        setLoading(false);
        setShowLoadingAnimation(false);
      });
    }
  };

  // const loginRequest = async () => {
  //   try {
  //     if (!login || !password) {
  //       setErrorMessage('Username/Email and Password are required.');
  //       setLoading(false);
  //       return;
  //     }
  
  //     setLoading(true);
  
  //     const response = await RequestAPI.postRequest(Api.Login, "", { login, password }, {});
  
  //     if (!response) {
  //       console.log('Empty response received.');
  //       setErrorMessage('Unexpected error. Please try again later.');
  //       return;
  //     }
  
  //     const { status, body } = response;
  
  //     if (status === 200) {
  //       window.alert('hi');
  
  //       const { accessToken, refreshToken, roleId } = body;
  //       const sessionDateTime = moment().format("DD/MM/YYYY H:mm:ss a");
  //       window.localStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(accessToken, process.env.REACT_APP_ENCRYPTION_KEY));
  //       window.localStorage.setItem("_setSessionLoginTimer", sessionDateTime);
  //       Utility.clearOnLoginTimer();
  //       const userObj = { ...body };
        
  //       if (userObj && userObj.accessToken) {
  //         delete userObj.accessToken;
  //       }
  
  //       dispatch({ type: "USER_DATA", payload: userObj });
  //       dispatch({ type: "IS_LOGIN", payload: true });
  //     } else if (status === 400) {
  //       console.log('Login failed. Response:', response);
  
  //       if (response.message === 'Username not found') {
  //         setErrorMessage('Username not found. Please check your username and try again.');
  //       } else {
  //         setErrorMessage('Invalid credentials. Please try again.');
  //       }
  //     } else {
  //       console.log('Unhandled status code. Response:', response);
  //       setErrorMessage('Unexpected error. Please try again later.');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //     setErrorMessage('An unexpected error occurred. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  
  
  
  // onCopy
  const copyHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  // onCut
  const cutHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const handleModal = () => setShowModal(!showModal);

  return (
    <>
    <div className="centered-card">
      <Card className="login-card">
        <div className="centered-container">
          <Card.Img variant="top" className="login-logo" src={sidebarlogo} alt="Logo" />
        </div>
        <Card.Body>
          <div className="login-form">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              id="text"
              className="login-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-2 d-flex justify-content-center">
            {errorMessage !== "" && (
              <Alerts variant="danger" message={errorMessage} />
            )}
          </div>
          <div className="login-button-section">
            <Button className="login-button" onClick={loginRequest}>
              {showLoadingAnimation ? <Spinner /> : "Login"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
    </>
  );
};
