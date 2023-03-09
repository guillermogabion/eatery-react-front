import React, { useState, useEffect, useCallback } from "react"

import { Button, Card, Row, Col, Image, Container, ListGroup, Modal, Form, Alert } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { RequestAPI, Api } from "../../api"
import { FaCheckCircle } from "react-icons/fa";
import CheckPassword from "../../components/PasswordChecker/passwordChecker"
import {
  Logo,
  show_password_dark,
  hide_password_dark,
  actimai_logo,
} from "../../assets/images"
import moment from "moment";
import { Utility } from "../../utils"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2";
import '../../assets/css/login.css'
import './login.css'
import TimeDate from "../../components/TimeDate"
const ErrorSwal = withReactContent(Swal);
const CryptoJS = require("crypto-js")

export const Login = () => {

  const dispatch = useDispatch()
  const [username, setUsername] = useState<any>("")
  const [password, setPassword] = useState<any>("")
  const [visibile, setVisibile] = useState<any>(false)
  const [visibile2, setVisibile2] = useState<any>(false)
  const [visibile3, setVisibile3] = useState<any>(false)
  // const [errorMessage, setErrorMessage] = useState<any>("")
  const [isForgot, setIsForgot] = useState<any>(false)
  const [isReset, setIsReset] = useState<any>(false)

  const [tempToken, setTempToken] = useState<any>("")

  const [isAcknowledgement, setIsAcknowledgement] = useState<any>(false)
  const [showDiv1, setShowDiv1] = useState(true);

  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));

  const [loginAttempts, setLoginAttempts] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = React.useState(false);





  function toggleDiv() {
    setShowDiv1(!showDiv1);
  }


  const keydownFun = (event: any) => {
    if (event.key === "Enter" && username && password) {
      setIsAcknowledgement(true)
    }
  }


  useEffect(() => {
    if (username && password) {
      document.removeEventListener("keydown", keydownFun)
      document.addEventListener("keydown", keydownFun)
    }
    return () => document.removeEventListener("keydown", keydownFun)

  }, [username, password])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
      setCurrentDate(moment().format("MMMM-DD-YYYY"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const loginRequest = React.useCallback(() => {
    if (username && password) {
      RequestAPI.postRequest(Api.Login, "", { username, password }, {}, async (res: any) => {
        const { status, body } = res
        if (status === 200) {
          // Login successful, reset login attempts counter
          if (body.error && body.error.message) {
            // setErrorMessage(body.error.message)
            // setLoginAttempts(loginAttempts + 1);
            setErrorMessage(body.error.message);
          } else {
            Utility.clearOnLoginTimer()
            const { accessToken, changePassword = false, roleId, refreshToken } = body.data
            if (changePassword) {
              setIsReset(true)
              setTempToken(accessToken)
            } else {
              window.sessionStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(accessToken, process.env.REACT_APP_ENCRYPTION_KEY))
              window.sessionStorage.setItem("_tyg883oh", CryptoJS.AES.encrypt(`${refreshToken}`, process.env.REACT_APP_ENCRYPTION_KEY))
              window.sessionStorage.setItem("_setSessionLoginTimer", moment().format("DD/MM/YYYY H:mm:ss a"))

              const userObj = { ...body }
              if (userObj && userObj.accessToken) {
                delete userObj.accessToken
              }

              userObj.menu = [{
                "links": [],
                "label": "Home",
                "icon": "home",
                "type": "transaction",
                "route": "/dashboard"
              },
              {
                "links": [],
                "label": "Home",
                "icon": "home",
                "type": "transaction",
                "route": "/useriniatedchangepw"
              },
              {
                "links": [],
                "label": "Clients",
                "icon": "client",
                "type": "client",
                "route": "/user/list"
              },
              {
                "links": [],
                "label": "Clients",
                "icon": "client",
                "type": "client",
                "route": "/employee"
              },
              ],
                userObj.accessRights = [
                  "Can_Read_User",
                  "Can_Add_Edit_User",
                  "Can_Read_Role",
                  "Can_Add_Edit_Role",
                ]
              dispatch({ type: "SET_MASTERLIST", payload: userObj.data.masterList })
              dispatch({ type: "USER_DATA", payload: userObj })
              dispatch({ type: "IS_LOGIN", payload: true })
            }
          }
        }else{
          if (body.error && body.error.message) {
            setErrorMessage(body.error.message);
          }
        }
      });
    }
  }, [username, password])




  // onCopy
  const copyHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  // onCut
  const cutHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  function dualRequest() {
    // toggleDiv();
    loginRequest();
  }

  const [showModal, setShowModal] = useState(false);

  const handleModal = () => setShowModal(!showModal);

  return (
    <>
      {showDiv1 ? 
        <div className="row bg-dark w-100 h-100 p-0 m-0" style={{minHeight:'100vh', height:'100vh'}}>
          <Container className="d-flex justify-content-center align-items-center p-0 m-0 loginBackground ">
                    <div className="m-0  bg-white formContainer" >
                      <div className="company-logo pb-3">
                        <img src={actimai_logo} alt="Actimai logo"/>
                      </div>
                      <div className="align-items-center">
                        <h4 className="container-text color-primary">Employee Portal Login</h4>
                      </div>
                      <form id="_form" className="loginForm" action="#">
                        <input
                          id="_name"
                          autoComplete="new-password"
                          name="name"
                          type="text"
                          value={username}
                          className="form-control input-login"
                          style={{ marginBottom: "20px" }}
                          placeholder="Username or Employee ID"
                          required
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="passwordField mt-4">
                          <input
                            id="_password"
                            onCopy={copyHandler}
                            onCut={cutHandler}
                            autoComplete="new-password"
                            style={{ marginBottom: "20px" }}
                            name="password"
                            value={password}
                            type={visibile ? "text" : "password"}
                            className="form-control text-field-color input-login "
                            required
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Button
                            variant="link"
                            onClick={() => setVisibile(!visibile)}
                            className="passwordicon pt-3"
                            disabled={!password}>
                            <span className="showpass">
                              <img src={show_password_dark} alt="Show" />
                            </span>
                            <span className="hidepass">
                              <img src={hide_password_dark} alt="Hide" />
                            </span>
                          </Button>
                        </div>
                        <a href="#!" onClick={handleModal} className="forgotPassword mb-3">
                          Forgot Password?
                        </a>
                        <div className="d-flex">
                          <Button
                            style={{ width: '100%' }}
                            onClick={() => loginRequest()}
                            className="btn btn-primary btn-styles"
                            disabled={loginAttempts >= 3}>
                            Login
                          </Button>
                        </div>
                        <br /><br /><br />
                        {errorMessage != "" && (
                          <Alert variant="" className="text-center">
                            <span className="text-danger">{errorMessage}</span>
                          </Alert>
                        )}
                        <br /><br /><br />
                      </form>
                      <div className="d-flex justify-content-center pb-4"> <label>&copy; 2023 Actimai Philippines Incorporated</label></div>
                      <div className=" mobile">

                    <Col className="loginTime" >
                      <TimeDate 
                        textColor={'white'}
                      />
                    </Col>
          </div>
                    </div>

                    
                </Container>
          
        </div>
        :
        <div className="row containee">
          <div className="change-password-column-left mobile adjustments-left">
            <span className="left-title">Password Creation Guidelines :</span>
            <ul>
              <li><FaCheckCircle /><span className="check-circle">At least 12 characters long but 14 or more is better </span></li>
              <li><FaCheckCircle /><span className="check-circle">A combination of uppercase letters, lower case letters, numbers and symbols</span></li>
              <li><FaCheckCircle /><span className="check-circle">Not a word that can be found in a dictionary or the name of a person, character, product or organization</span></li>
              <li><FaCheckCircle /><span className="check-circle">Significantly different from your previous passwords</span></li>
            </ul>
          </div>
          <div className="change-password-column-center containeer">
            <Card className="card-card">
              <div className="row" style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.8)' }}>
                <Container className="d-flex justify-content-center align-items-center">
                  <Row className="d-flex justify-content-center align-items-center">
                    <Col>
                      <div className="company-logo">
                        <img src="https://via.placeholder.com/150" alt="" width={300} height={100} />
                      </div>
                      <div className="align-items-center">
                        <h4 className="container-text">Please Change your Password</h4>
                      </div>
                      <form id="_form" className="loginForm" action="#">
                        <CheckPassword></CheckPassword>
                      </form>
                      <div className="d-flex justify-content-center"> <p>&copy; 2023 Actimai Philippines Incorporated</p></div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Card>
          </div>
          <div className="change-password-column-right mobile">

            <Col className="content-right paddin-top" >
              <TimeDate />
            </Col>
          </div>
        </div>
      }

      <Modal show={showModal} onHide={handleModal} centered>
        <Modal.Header className="reset-header">
          <Modal.Title className="header-text">Forgot Password - Reset</Modal.Title>
        </Modal.Header>
        <div className="body-centered header-text">
          <span>Please enter your Employee Number</span>
        </div>
        <div className="modal-input">
          <Form.Control type="text" className=" " placeholder="Employee Number" />
        </div>
        <div className="modal-btns">
          <Button variant="primary" className="modal-btn">Submit</Button>
          <a href="#!" className="close-modal" onClick={handleModal}>
            Cancel
          </a>
        </div>
      </Modal>
    </>
  )
}
