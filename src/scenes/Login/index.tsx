import React, { useState, useEffect, useCallback } from "react"

import { Button, Card, Row, Col, Image, Container, ListGroup, Modal, Form, Alert } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { RequestAPI, Api } from "../../api"
import { FaCheckCircle } from "react-icons/fa";
import {
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
import { Formik } from "formik";
import * as Yup from "yup";


function ChangePassword(props: any) {
  return (<div className="row p-0 m-0 w-100">
    <div className="col-xl-5 col-lg-4 d-flex flex-column justify-content-center align-items-center passwordGuide ">
      <div className="px-5" style={{
        marginLeft: 80
      }}>
        <span className="text-white mb-3" style={{
          fontSize: 20
        }}>Password Creation Guidelines :</span> <br />
        <div className="text-white p-0 pt-3" style={{
          letterSpacing: .5
        }}>
          <div>
            <FaCheckCircle style={{
              color: 'white'
            }} />
            <span className="check-circle">At least 8 characters long but less than 16 </span>
          </div><br />
          <div>
            <FaCheckCircle style={{
              color: 'white'
            }} />
            <span className="check-circle">A combination of uppercase letters, lower case letters, numbers and special characters(!@#$%^&*)</span>
          </div> <br />
          <div>
            <FaCheckCircle style={{
              color: 'white'
            }} />
            <span className="check-circle">Significantly different from your previous passwords.</span>
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-6  col-lg-6 col-md-12 changePasswordCont ">
      <div className="m-0  bg-white changePasswordFormContainer ">
        <div className="company-logo pb-3">
          <img src={actimai_logo} alt="Actimai logo" />
        </div>
        <div className="align-items-center">
          <h5 className="container-text color-primary" style={{
            fontSize: 23
          }}>Please change your password</h5>
        </div>

        <Formik initialValues={{
          oldPassword: "",
          newPassword: "",
          conPassword: ""
        }} enableReinitialize={true} validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required('Old password is required'),
          newPassword: Yup.string().required('New password is required')
            .min(8, "Must Contain 8 Characters")
            .matches(/^(?=.*[a-z])/, "Must Contain One LowerCase")
            .matches(/^(?=.*[A-Z])/, "Must Contain One Uppercase")
            .matches(/^(?=.*[0-9])/, "Must Contain One Number ")
            .matches(/^(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Must Contain Special Case Character"),
          conPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('newPassword'), null], "Password not match")
        })} onSubmit={(values: any, actions: any) => {
          RequestAPI.putRequest(Api.changePassword, props.tempToken, values, {}, async (res: any) => {
            const {
              status,
              body
            } = res;

            if (status === 200) {
              if (body.error && body.error.message) {
                ErrorSwal.fire({
                  title: 'Error!',
                  text: (body.error.message) || "",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
          
                    if(confirmButton)
                      confirmButton.id = "loginchangepass_errorconfirm_alertbtn"
                  },
                  icon: 'error',
              })
              } else {
                ErrorSwal.fire({
                  title: 'Success!',
                  text: (body.data) || "",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
          
                    if(confirmButton)
                      confirmButton.id = "loginchangepass_successconfirm_alertbtn"
                  },
                  icon: 'success',
              }).then(result => {
                  if (result.isConfirmed) {
                    props.setIsNewAccount(false);
                  }
                });
              }
            } else {
              if (body.error && body.error.message) {
                ErrorSwal.fire({
                  title: 'Error!',
                  text: (body.error.message) || "",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
          
                    if(confirmButton)
                      confirmButton.id = "loginchangepass_errorconfirm2_alertbtn"
                  },
                  icon: 'error',
              })
              }
            }
          });
        }}>
          {({
            values,
            setFieldValue,
            handleSubmit,
            handleChange,
            errors,
            touched
          }) => {
            return <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
              <div className="passwordField mt-3">
                <input id="_oldpassword" onCopy={props.copyHandler} onCut={props.cutHandler} autoComplete="new-password" name="oldPassword" value={values.oldPassword} type={props.visibile1 ? "text" : "password"} className="form-control w-100 text-field-color input-login " placeholder="Current Password" onChange={e => setFieldValue('oldPassword', e.target.value)} />
                <Button id="login_oldpassword_btn" variant="link" onClick={() => props.setVisibile1(!props.visibile1)} className="passwordicon pt-3" type="button">
                  <span className="showpass">
                    <img id="login_oldpasswordshow_img" src={show_password_dark} alt="Show" />
                  </span>
                  <span className="hidepass">
                    <img id="login_oldpasswordhide_img" src={hide_password_dark} alt="Hide" />
                  </span>
                </Button>
                {errors && errors.oldPassword && <p style={{
                  color: "red",
                  fontSize: "12px"
                }}>{errors.oldPassword}</p>}
              </div>
              <div className="passwordField mt-5">
                <input id="_newpassword" onCopy={props.copyHandler} onCut={props.cutHandler} autoComplete="new-password" name="newPassword" value={values.newPassword} type={props.visibile2 ? "text" : "password"} className="form-control w-100 text-field-color input-login " maxLength={16} placeholder="New Password" onChange={e => setFieldValue('newPassword', e.target.value)} />
                <Button id="login_newassword_btn" variant="link" onClick={() => props.setVisibile2(!props.visibile2)} className="passwordicon pt-3" type="button">
                  <span className="showpass">
                    <img id="login_newpasswordshow_img" src={show_password_dark} alt="Show" />
                  </span>
                  <span className="hidepass">
                    <img id="login_newpasswordhide_img" src={hide_password_dark} alt="Hide" />
                  </span>
                </Button>
                {errors && errors.newPassword && <p style={{
                  color: "red",
                  fontSize: "12px"
                }}>{errors.newPassword}</p>}
              </div>
              <div className="passwordField mt-5">
                <input id="_confirmpassword" onCopy={props.copyHandler} onCut={props.cutHandler} autoComplete="new-password" name="conPassword" value={values.conPassword} type={props.visibile3 ? "text" : "password"} className="form-control w-100 text-field-color input-login " maxLength={16} placeholder="Confirm New Password" onChange={e => setFieldValue('conPassword', e.target.value)} />
                <Button id="login_confirmpassword_btn" variant="link" onClick={() => props.setVisibile3(!props.visibile3)} className="passwordicon pt-3" type="button">
                  <span className="showpass">
                    <img id="login_confirmpasswordshow_img" src={show_password_dark} alt="Show" />
                  </span>
                  <span className="hidepass">
                    <img id="login_confirmpasswordhide_img" src={hide_password_dark} alt="Hide" />
                  </span>
                </Button>
                {errors && errors.conPassword && <p style={{
                  color: "red",
                  fontSize: "12px"
                }}>{errors.conPassword}</p>}
              </div>
              <br /> <br />
              <div className="d-flex">
                <Button id="login_password_btn" type="submit" className="w-100 btn btn-primary">
                  Submit
                </Button>
                <br /><br />
                <br /><br /><br />
                <br />
              </div>
            </Form>;
          }}
        </Formik>
        <div className="d-flex justify-content-center pb-4"> <label>&copy; 2023 Actimai Philippines Incorporated</label></div>
        <div className=" mobile">
          <Col className="changePasswordLoginTime">
            <TimeDate textColor={'white'} />
          </Col>
        </div>
      </div>
    </div>
  </div>);
}


export const Login = () => {

  const dispatch = useDispatch()
  const [username, setUsername] = useState<any>("")
  const [password, setPassword] = useState<any>("")
  const [oldPassword, setOldPassword] = useState<any>("")
  const [newPassword, setNewPassword] = useState<any>("")
  const [confirmPassword, setConfirmPassword] = useState<any>("")
  const [visibile, setVisibile] = useState<any>(false)
  const [visibile1, setVisibile1] = useState<any>(false)
  const [visibile2, setVisibile2] = useState<any>(false)
  const [visibile3, setVisibile3] = useState<any>(false)
  const [isForgot, setIsForgot] = useState<any>(false)
  const [isReset, setIsReset] = useState<any>(false)
  const [tempToken, setTempToken] = useState<any>("")
  const [isAcknowledgement, setIsAcknowledgement] = useState<any>(false)
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = React.useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotIsSubmit, setForgotIsSubmit] = useState(false);

  const keydownFun = (event: any) => {
    if (event.key === "Enter" && username && password) {
      loginRequest()
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
          if (body.error && body.error.message) {
            setErrorMessage(body.error.message);
            setPassword("")
          } else {
            Utility.clearOnLoginTimer()
            const { accessToken, roleId, refreshToken } = body.data
            const { newAccount = false } = body.data.profile
            if (newAccount) {
              setTempToken(accessToken)
              setIsNewAccount(true)
            } else {
              window.sessionStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(accessToken, process.env.REACT_APP_ENCRYPTION_KEY))
              window.sessionStorage.setItem("_tyg883oh", CryptoJS.AES.encrypt(`${refreshToken}`, process.env.REACT_APP_ENCRYPTION_KEY))
              window.sessionStorage.setItem("_setSessionLoginTimer", moment().format("DD/MM/YYYY H:mm:ss a"))

              const userObj = { ...body }
              if (userObj && userObj.accessToken) {
                delete userObj.accessToken
              }
              dispatch({ type: "SET_MASTERLIST", payload: userObj.data.masterList })
              dispatch({ type: "USER_DATA", payload: userObj })
              dispatch({ type: "IS_LOGIN", payload: true })
            }
          }
        } else {
          if (body.error && body.error.message) {
            setErrorMessage(body.error.message);
            setPassword("")
          }
        }
      });
    }
  }, [username, password])

  const forgotUserPassword = React.useCallback(() => {
    if (forgotEmail) {
      RequestAPI.putRequest(Api.forgotPassword, "", { "email": forgotEmail }, {}, async (res: any) => {
        const { status, body } = res
        if (status === 200 || status === 201) {
          if (body.error && body.error.message) {
            ErrorSwal.fire({
              title: 'Error!',
              text: (body.error && body.error.message) || "",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "loginchangepass_errorconfirm3_alertbtn"
              },
              icon: 'error',
          })
            setForgotIsSubmit(false)
          } else {
            ErrorSwal.fire({
              title: 'Success!',
              text: (body.data) || "",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "loginchangepass_successconfirm2_alertbtn"
              },
              icon: 'success',
          })
            setShowModal(false)
            setForgotIsSubmit(false)
          }
        } else {
          ErrorSwal.fire({
            title: 'Error!',
            text: "Something Error.",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
    
              if(confirmButton)
                confirmButton.id = "loginchangepass_errorconfirm4_alertbtn"
            },
            icon: 'error',
        })
        }
      });
    }

  }, [forgotEmail])

  // onCopy
  const copyHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  // onCut
  const cutHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  const [showModal, setShowModal] = useState(false);
  const handleModal = () => setShowModal(!showModal);

  return (
    <>
      <div className="row w-full h-full p-0 m-0 min-h-[100vh]" >
        <div className="flex justify-center items-center px-4 loginBackground ">
          {!isNewAccount ?
            <div className="bg-white relative flex flex-column justify-center items-center rounded-md pb-[180px] pt-[80px] w-full xl:w-[500px] md:w-[450px]">
              <div className="company-logo p-0 m-0">
                <img id="login_actimailogo_img" src={actimai_logo} alt="Actimai logo" className="w-full lg:w-[80%]" />
              </div>
              <div className="align-items-center mt-3">
                <h5 className="text-[1.7em] color-primary">Employee Portal Login</h5>
              </div>
              <form id="_form" className="w-full px-[15%]" action="#">
                <input
                  id="_name"
                  autoComplete="new-password"
                  name="name"
                  type="text"
                  value={username}
                  className="form-control w-100 input-login"
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
                    className="form-control w-100 text-field-color input-login "
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    id="login_passwordportal_btn"
                    variant="link"
                    onClick={() => setVisibile(!visibile)}
                    className="passwordicon pt-3"
                    disabled={!password}>
                    <span className="showpass">
                      <img id="login_passwordportalshow_img" src={show_password_dark} alt="Show" />
                    </span>
                    <span className="hidepass">
                      <img id="login_passwordportalhide_btn" src={hide_password_dark} alt="Hide" />
                    </span>
                  </Button>
                </div>
                <a id="login_forgotpassword_a" href="#!" onClick={handleModal} className="forgotPassword mb-3">
                  Forgot Password?
                </a>
                <div className="d-flex">
                  <Button
                    id="login_loginportal_btn"
                    style={{ width: '100%' }}
                    onClick={() => loginRequest()}
                    className="btn btn-primary"
                    disabled={loginAttempts >= 3}>
                    Login
                  </Button>
                </div>
                <div className="d-flex justify-content-center p-0 ">
                  {errorMessage != "" && (
                    <Alert variant="" className="w-100 p-0 pt-2" style={{ textAlign: "left" }}>
                      <span id="login_passwordportalerrormsg_span" className="text-danger"><b>{errorMessage}</b> </span>
                    </Alert>
                  )}
                </div>
              </form>
              <div className="absolute bottom-0" > <label>&copy; 2023 Actimai Philippines Incorporated</label></div>

              <div className=" mobile">

                <Col className="loginTime" >
                  <TimeDate
                    textColor={'white'}
                  />
                </Col>
              </div>
            </div>

            :
            <ChangePassword visibile1={visibile1}
              setVisibile1={setVisibile1}
              visibile2={visibile2}
              setVisibile2={setVisibile2}
              visibile3={visibile3}
              setVisibile3={setVisibile3}
              tempToken={tempToken}
              setIsNewAccount={setIsNewAccount}
              setErrorMessage={setErrorMessage}
              copyHandler={copyHandler}
              cutHandler={cutHandler} />
          }
        </div>
      </div>
      <Modal show={showModal} onHide={handleModal} centered >
        <Modal.Header className="reset-header" closeButton>
          <Modal.Title className="header-text">Forgot Password</Modal.Title>
        </Modal.Header>

        <div className="modal-input">
          <Form.Control type="text" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value) }} placeholder="Employee Email Address" />
        </div>
        <div className="modal-btns w-100">
          <Button variant="primary"
            id="login_forgotsubmit_btn"
            className="modal-btn"
            disabled={forgotIsSubmit}
            onClick={() => {
              setForgotIsSubmit(true)
              forgotUserPassword()
            }}>
            {forgotIsSubmit ?
              <div className="d-flex">
                <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                Submitting
              </div>
              : "Submit"
            }
          </Button>
        </div>
      </Modal>
    </>
  )
}
