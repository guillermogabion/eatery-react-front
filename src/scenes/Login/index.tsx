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
    setLoading(true);
    if (login && password) {
      setTimeout(() => {
        RequestAPI.postRequest(Api.Login, "", { login, password }, {}, (res) => {
          const { status, body } = res;
          if (status === 200) {
            const { accessToken, refreshToken, roleId } = body;
            const sessionDateTime = moment().format("DD/MM/YYYY H:mm:ss a");
            window.localStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(accessToken, process.env.REACT_APP_ENCRYPTION_KEY));
            window.localStorage.setItem("_setSessionLoginTimer", sessionDateTime);
            Utility.clearOnLoginTimer();
            const userObj = { ...body };
            if (userObj && userObj.accessToken) {
              delete userObj.accessToken;
            }
            dispatch({ type: "USER_DATA", payload: userObj });
            dispatch({ type: "IS_LOGIN", payload: true });
          } else {
            if (status === 401) {
              setErrorMessage(body.message);
              console.log("i am 401"); // Log message
              setPassword("");
            }
          }
          setLoading(false);
        });
      }, 3000);
    }
  };

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
            {errorMessage !== "" && (
              <Alert variant="danger" className="w-100 p-0 pt-2" style={{ textAlign: "left" }}>
                <span className="text-danger"><b>{errorMessage}</b></span>
              </Alert>
            )}
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
            <div className="login-button-section">
              <Button className="login-button" onClick={loginRequest}>Login</Button>
            </div>
            {/* <Loader show={loading} /> */}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
