import React, { useEffect, useState } from "react";

import moment from "moment";
import { Alert, Button, Col, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Api, RequestAPI } from "../../api";
import '../../assets/css/login.css';
import {
    actimai_logo,
    hide_password_dark,
    show_password_dark,
} from "../../assets/images";
import TimeDate from "../../components/TimeDate";
import { Utility } from "../../utils";
import './login.css';
const ErrorSwal = withReactContent(Swal);
const CryptoJS = require("crypto-js")


export const ApproverLogin = (props: any) => {
    const { history, match } = props;
    const id = (match.params.id && match.params.id) || 0;
    const action = (match.params.id && match.params.action) || "approve";
    const type = (match.params.id && match.params.type) || 'leave';

    const dispatch = useDispatch()
    const [username, setUsername] = useState<any>("")
    const [password, setPassword] = useState<any>("")
    const [reason, setReason] = useState<any>("")
    const [oldPassword, setOldPassword] = useState<any>("")
    const [newPassword, setNewPassword] = useState<any>("")
    const [confirmPassword, setConfirmPassword] = useState<any>("")
    const [visibile, setVisibile] = useState<any>(false)
    const [isSubmit, setIsSubmit] = useState<any>(false)
    const [visibile2, setVisibile2] = useState<any>(false)
    const [visibile3, setVisibile3] = useState<any>(false)
    const [isForgot, setIsForgot] = useState<any>(false)
    const [isReset, setIsReset] = useState<any>(false)
    const [tempToken, setTempToken] = useState<any>("")
    const [isAcknowledgement, setIsAcknowledgement] = useState<any>(false)
    const [showReason, setShowReason] = useState(false);
    const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
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

    const getAPI = (transaction: any, action: any) => {
        let api_list: any = {
            "ut": {
                "approve": Api.approveUT,
                "decline": Api.declineUT,
                "resend": Api.resendUT,
            },
            "schedule-adjustment": {
                "approve": Api.approveScheduleAdjustment,
                "decline": Api.declineScheduleAdjustment,
                "resend": Api.resendScheduleAdjustment,
            },
            "ot": {
                "approve": Api.approveOT,
                "decline": Api.declineOT,
                "resend": Api.resendOT,
            },
            "leave": {
                "approve": Api.approveLeave,
                "decline": Api.declineLeave,
                "resend": Api.resendLeave,
            },
            "coa": {
                "approve": Api.approveCoa,
                "decline": Api.declineCoa,
                "resend": Api.resendCoa,
            },
        }
        return api_list[transaction][action]
    }

    const makeActionRequest = (token: any) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: `You want to ${action} this request.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();
      
                if(confirmButton)
                  confirmButton.id = "approvelogin_makeactionconfirm_alertbtn"
      
                if(cancelButton)
                  cancelButton.id = "approvelogin_makeactioncancel_alertbtn"
              },
        }).then((result) => {
            if (result.isConfirmed) {
                setIsSubmit(true)
                let payload: any = {
                    "id": parseInt(id)
                }
                if (action == "decline" || action == "resend") {
                    payload.reason = reason
                }
                let apiURL = getAPI(type, action)

                RequestAPI.postRequest(apiURL, token, payload, {}, async (res: any) => {
                    const { status, body } = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "approverlogin_errorconfirm_alertbtn"
                                },
                                icon: 'error',
                            })
                            setIsSubmit(false)
                        } else {
                            ErrorSwal.fire({
                                title: 'Success',
                                text: (body.data) || "",
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                allowOutsideClick: false,
                                confirmButtonText: 'Go back to login',
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();
                                    const cancelButton = Swal.getCancelButton();
                          
                                    if(confirmButton)
                                      confirmButton.id = "approvelogin_gobackloginconfirm_alertbtn"
                          
                                    if(cancelButton)
                                      cancelButton.id = "approvelogin_gobacklogincancel_alertbtn"
                                  },
                            }).then((result: any) => {
                                if (result.isConfirmed) {
                                    window.location.href = "/"
                                }
                            })
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "approverlogin_errorconfirm2_alertbtn"
                            },
                            icon: 'error',
                        })
                        setIsSubmit(false)
                    }
                });
            }
        })
    }

    const loginRequest = React.useCallback(() => {
        if (username && password) {
            RequestAPI.postRequest(Api.Login, "", { username, password }, {}, async (res: any) => {
                const { status, body } = res
                if (status === 200) {
                    if (body.error && body.error.message) {
                        setErrorMessage(body.error.message)
                        setPassword("")
                    } else {
                        const { accessToken, profile } = body.data
                        let approverRoles = ['EXECUTIVE','ADMIN','APPROVER', 'HR ADMIN']
                        if (approverRoles.includes(profile.role)){
                            if (action == "decline" || action == "resend") {
                                setTempToken(accessToken)
                                setShowReason(true)
                            } else {
                                makeActionRequest(accessToken)
                            }
                        }else{
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: "Your account is not approver.",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "approverlogin_errorconfirm3_alertbtn"
                                },
                                icon: 'error',
                            })
                        }
                        
                    }
                } else {
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

    const [showModal, setShowModal] = useState(false);
    const handleModal = () => setShowModal(!showModal);

    return (
        <>
            <div className="row w-full h-full p-0 m-0 min-h-[100vh]" >
                <div className="flex justify-center items-center px-4 loginBackground ">
                    {
                        showReason ?
                            <div className="bg-white relative flex flex-column justify-center items-center   rounded-md w-full py-[100px] lg:py-[150px] xl:w-[500px] md:w-[450px]">
                                <div className="company-logo m-0 p-0 ">
                                    <img id="approverlogin_actimailogo_img" src={actimai_logo} alt="Actimai logo" className="w-full lg:w-[80%]" />
                                </div>
                                <div className="align-items-center ">
                                    <label id="approverlogin_action_label" className="color-primary" style={{ fontSize: 20 }}>You are about to {action} this request</label>
                                </div>
                                <form className="loginForm mt-2" action="#">
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={reason}
                                        className="form-control p-2"
                                        placeholder="Please enter your reason"
                                        style={{ minHeight: 200 }}
                                        maxLength={300}
                                        minLength={10}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <div className="d-flex mt-5">
                                        <Button
                                            id="approverlogin_proceed_btn"
                                            style={{ width: '100%' }}
                                            onClick={() => {
                                                makeActionRequest(tempToken)
                                            }}
                                            className="btn btn-primary"
                                            disabled={!reason || reason.length < 10 || isSubmit}>
                                            {isSubmit ?
                                                <div className="d-flex justify-content-center">
                                                    <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                                    Proceed
                                                </div>
                                                : "Proceed"
                                            }

                                        </Button>
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
                            <div className="bg-white relative flex flex-column justify-center items-center   rounded-md w-full py-[100px] lg:py-[150px] xl:w-[500px] md:w-[450px]">
                                <div className="company-logo m-0 p-0 ">
                                    <img id="approverlogin_actimailogo_approverimg" src={actimai_logo} alt="Actimai logo" className="w-full lg:w-[80%]" />
                                </div>
                                <div className="align-items-center ">
                                    <h5 className="text-[1.7em] color-primary">Approver Login</h5>
                                </div>
                                <form id="_form" className="loginForm mt-3" action="#">
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
                                            variant="link"
                                            id="approverlogin_link_btnk"
                                            onClick={() => setVisibile(!visibile)}
                                            className="passwordicon pt-3"
                                            disabled={!password}>
                                            <span className="showpass">
                                                <img id="approverlogin_showpassword_approverimg" src={show_password_dark} alt="Show" />
                                            </span>
                                            <span className="hidepass">
                                                <img id="approverlogin_hidepassword_approverimg" src={hide_password_dark} alt="Hide" />
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="d-flex mt-[50px]">
                                        <Button
                                            id="approverlogin_proceed_approverbtn"
                                            style={{ width: '100%' }}
                                            onClick={() => loginRequest()}
                                            className="btn btn-primary"
                                            disabled={isSubmit}>
                                            {isSubmit ?
                                                <div className="d-flex">
                                                    <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                                    Proceed
                                                </div>
                                                : "Proceed"
                                            }
                                        </Button>
                                    </div>
                                    <div className="d-flex justify-content-center p-0 ">
                                        {errorMessage != "" && (
                                            <Alert variant="" className="w-100 p-0 pt-2" style={{ textAlign: "left" }}>
                                                <span id="approverlogin_errormessage_approverspan" className="text-danger"><b>{errorMessage}</b> </span>
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
                    }

                </div>
            </div>
        </>
    )
}
