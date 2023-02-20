import React, { useState, useEffect } from "react"
import packageJson from "./../../../package.json"
import { Button, Card, Image } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { RequestAPI, Api } from "../../api"
import {
  Logo,
  show_password_dark,
  hide_password_dark,
  logo_s,
  logo_mob,
  lhs_image,
  ts_image,
  acm_pwd_reset,
  user_ack,
} from "../../assets/images"
import moment from "moment";
import { Utility } from "../../utils"
import ResetPassword from "../ResetPassword"
import withReactContent from "sweetalert2-react-content"
import UserPopup from "../../components/Popup/UserPopup"
import { history } from "../../helpers"
import Swal from "sweetalert2";
import '../../assets/css/login.css'
const ErrorSwal = withReactContent(Swal);
const CryptoJS = require("crypto-js")

export const Login = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState<any>("")
  const [password, setPassword] = useState<any>("")
  const [visibile, setVisibile] = useState<any>(false)
  const [errorMessage, setErrorMessage] = useState<any>("")
  const [isForgot, setIsForgot] = useState<any>(false)
  const [isReset, setIsReset] = useState<any>(false)

  const [tempToken, setTempToken] = useState<any>("")

  const [isAcknowledgement, setIsAcknowledgement] = useState<any>(false)

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

  const loginRequest = React.useCallback(() => {
    if (username && password) {
      RequestAPI.postRequest(Api.Login, "", { username, password }, {}, async (res: any) => {
        const { status, body } = res
        if (status === 200) {
          if (body.error && body.error.message){
            setErrorMessage(body.error.message)
          }else{
            Utility.clearOnLoginTimer()
            const { accessToken, changePassword = false, roleId, refreshToken } = body.data
            if (changePassword) {
              setIsReset(true)
              setTempToken(accessToken)
            } else {
              window.sessionStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(accessToken, process.env.REACT_APP_ENCRYPTION_KEY))
              window.sessionStorage.setItem("_tyg883oh", CryptoJS.AES.encrypt(`${refreshToken}`, process.env.REACT_APP_ENCRYPTION_KEY))
              
              window.sessionStorage.setItem("_setSessionLoginTimer", moment().format("DD/MM/YYYY H:mm:ss a"))
              console.log(moment().format("DD/MM/YYYY H:mm:ss a"))
              const userObj = { ...body }
              if (userObj && userObj.accessToken) {
                delete userObj.accessToken
              }

              userObj.menu = [
                {
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
            ],
            userObj.accessRights = [
                "Can_Read_User",
                "Can_Add_Edit_User",
                "Can_Read_Role",
                "Can_Add_Edit_Role",
            ]

              
              dispatch({ type: "USER_DATA", payload: userObj })
              dispatch({ type: "IS_LOGIN", payload: true })
            }
          }
        }
      })
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

  return (
    <div className="body body-ground d-flex align-items-center">
      <div className="loginPage">
        <div className="loginbody">
          <div className="fullWidth">          
            {!isReset ? (
              <Card className="card-container">
                <div className="contentForm"> 
                  <Card.Body className="d-flex align-items-center justify-content-center">
                    <Image src="https://via.placeholder.com/300/09f.png/ffffff" className="avatar" roundedCircle></Image><br />
                  </Card.Body>
                  <Card.Text className="d-flex align-items-center justify-content-center">
                    <h3>Please Log In</h3>
                  </Card.Text>
                  <form id="_form" className="loginForm" action="#">
                    <input
                      id="_name"
                      autoComplete="new-password"
                      name="name"
                      placeholder="Username or Email"
                      type="text"
                      value={username}
                      className="form-control"
                      style={{ marginBottom: "20px" }}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="passwordField">
                      <input
                        id="_password"
                        onCopy={copyHandler}
                        onCut={cutHandler}
                        autoComplete="new-password"
                        style={{ marginBottom: "20px" }}
                        name="password"
                        placeholder="Password"
                        value={password}
                        type={visibile ? "text" : "password"}
                        className="form-control"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        variant="link"
                        onClick={() => setVisibile(!visibile)}
                        className="passwordicon"
                        disabled={!password}>
                        <span className="showpass">
                          <img src={show_password_dark} alt="Show" />
                        </span>
                        <span className="hidepass">
                          <img src={hide_password_dark} alt="Hide" />
                        </span>
                      </Button>
                    </div>
                    <a href="#!" onClick={() => alert("Ongoing")} className="forgotPassword">
                      Forgot Password?
                    </a>
                    <p className="errorMessage">{errorMessage}</p>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() => loginRequest()}
                        className="btn btn-primary"
                        disabled={!(username && password)}>
                        Login
                      </Button>
                    </div>
                    <br />
                    <p
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      width: "auto",
                      color: "gray"
                    }}>
                    v{packageJson.version}
                  </p>
                  </form>
              
                </div>
              </Card> 
            ) : (
              null
            )}
          </div>
        </div>
        
      </div>
      
    </div>

    // <div className="back-ground">
    //   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    //   <Card className="card-main">
    //     <Card.Header>
    //         Login
    //     </Card.Header>
    //     <Card.Body>
    //       <Form>
    //         <Form.Control type="text" placeholder="Email or Username"></Form.Control>
    //         <Form.Control  type={visibile ? "text" : "password"} placeholder="Email or Username">
    //         </Form.Control>
    //         <Button
    //           variant="link"
    //           onClick={() => setVisibile(!visibile)}
    //           className="passwordicon"
    //           disabled={!password}>
    //           <span className="showpass">
    //             <img src={show_password_dark} alt="Show" />
    //           </span>
    //           <span className="hidepass">
    //             <img src={hide_password_dark} alt="Hide" />
    //           </span>
    //           </Button>
    //       </Form>
    //     </Card.Body>
    //   </Card>

    // </div>

    // </div>
  )
}
