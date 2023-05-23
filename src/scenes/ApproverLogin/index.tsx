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
    const [visibile1, setVisibile1] = useState<any>(false)
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

    const makeActionRequest = () => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: `You want to ${action} this request.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                let payload: any = {
                    "id": id
                }
                if (action == "decline" || action == "resend") {
                    payload.reason = reason
                }
                let apiURL = getAPI(type, action)
                RequestAPI.postRequest(apiURL, tempToken, payload, {}, async (res: any) => {
                    const { status, body } = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                        } else {
                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "Successful",
                                'success'
                            )
                        }
                    } else {
                        ErrorSwal.fire(
                            'Error!',
                            'Something Error.',
                            'error'
                        )
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
                        const { accessToken } = body.data
                        setTempToken(accessToken)
                        if (action == "decline" || action == "resend") {
                            setShowReason(true)
                        } else {
                            makeActionRequest()
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
            <div className="row bg-dark w-100 h-100 p-0 m-0" style={{ minHeight: '100vh', height: '100vh' }}>
                <Container className="d-flex justify-content-center align-items-center p-0 m-0 loginBackground ">
                    {
                        showReason ?
                            <div className="m-0 bg-white formContainer" >
                                <div className="company-logo pb-3">
                                    <img src={actimai_logo} alt="Actimai logo" />
                                </div>
                                <div className="align-items-center mt-2">
                                    <label className="color-primary" style={{ fontSize: 20 }}>You are about to {action} this request</label>
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
                                    <div className="d-flex mt-3">
                                        <Button
                                            style={{ width: '100%' }}
                                            onClick={() => makeActionRequest()}
                                            className="btn btn-primary"
                                            disabled={!reason || reason.length < 10}>
                                            Proceed
                                        </Button>
                                    </div>
                                    <br /><br />
                                    <br /> <br />
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
                            :
                            <div className="m-0  bg-white formContainer" >
                                <div className="company-logo pb-3">
                                    <img src={actimai_logo} alt="Actimai logo" />
                                </div>
                                <div className="align-items-center">
                                    <h5 className="container-text color-primary">Approver Login</h5>
                                </div>
                                <form id="_form" className="loginForm" action="#">
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
                                    <div className="d-flex">
                                        <Button
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
                                                <span className="text-danger"><b>{errorMessage}</b> </span>
                                            </Alert>
                                        )}
                                    </div>
                                    <br /><br />
                                    <br /><br />
                                    <br /> <br />
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
                    }

                </Container>
            </div>
        </>
    )
}
