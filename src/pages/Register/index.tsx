import React, { useCallback, useState, useEffect, useRef } from 'react';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Card, Button, Form } from 'react-bootstrap';
import { sidebarlogo } from '../../assets/images';
import { RequestAPI, Api } from '../../api';
import axios from 'axios';
import { Utility } from "../../utils"
import { AES, enc } from 'crypto-js';
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom';


// import { useDispatch } from "react-redux"
import moment from "moment";
import { faInfoCircle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const FIRSTNAME_REGEX = /^[a-zA-Z]{4,24}$/;
const LASTNAME_REGEX = /^[a-zA-Z]{4,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;




// ... (imports)

const SignUp = () => {
    const firstnameRef = useRef<HTMLInputElement | null>(null);
    const lastnameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const contactRef = useRef<HTMLInputElement | null>(null);
    const addressRef = useRef<HTMLInputElement | null>(null);
    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef();
    const [firstname, setFirstName] = useState('');
    const [validFirstname, setValidFirstname] = useState(false);
    const [firstnameFocus, setFirstnameFocus] = useState(false);

    const [lastname, setLastname] = useState('');
    const [validLastname, setValidLastname] = useState(false);
    const [lastnameFocus, setLastnameFocus] = useState(false);
    
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [username, setUserName] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
  
    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
  
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [contact, setContact] = useState('');
    const [ address, setAddress ] = useState('');
    
  
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
  
    useEffect(() => {
      userRef.current?.focus();
    }, []);
  
    useEffect(() => {
        const result = USER_REGEX.test(username);
        const firstnameResult = FIRSTNAME_REGEX.test(firstname)
        const lastnameResult = LASTNAME_REGEX.test(lastname)
        const emailResult = EMAIL_REGEX.test(email)
      
        setValidName(result);
        setValidFirstname(firstnameResult)
        setValidLastname(lastnameResult)
        setValidEmail(emailResult)
    }, [username, firstname, lastname, email]);
  
    useEffect(() => {
      const result = PWD_REGEX.test(password);
      setValidPwd(result);
      const match = password === matchPwd;
      setValidMatch(match);
    }, [password, matchPwd]);
  
    useEffect(() => {
      setErrMsg('');
    }, [username, password, matchPwd]);
  
    const dispatch = useDispatch();
    const history = useHistory();
  
    const signUp = (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
          setErrMsg("Invalid Entry");
          return;
        }
        try {
            RequestAPI.postRequest(
                `${Api.createUser}`,
                "",
                {firstname, lastname, email, contact, address, username, password },
                {},
                async (res: any) => {
                    const { status, body = { data: {} , error: {}}} : any = res;

                    if (status === 200) {

                    }
                }
            )
        } catch (err) {
            console.log('unsuccessful')
        }
        console.log(username, password);
        setSuccess(true);
    };

    const keydownFun = (event: any) => {
    if (event.key === "Enter" && username && password) {
        signUp(event);
    }
    };
    useEffect(() => {
    if (username && password) {
        document.removeEventListener("keydown", keydownFun);
        document.addEventListener("keydown", keydownFun);
    }
    return () => document.removeEventListener("keydown", keydownFun);
    }, [username, password]);

    return (
      <>
        {success ? (
          history.push("/")
        ) : (
          <div className='centered-card'>
            <Card className='login-card'>
              <div className="centered-container">
                <Card.Img variant='top' className='login-logo' src={sidebarlogo} alt="Logo" />
              </div>
              <Card.Body>
                <div className='login-form'>
                    {/* firstname  */}
                    <div>  
                        <label htmlFor="firstname">First Name</label>
                        <span className={validFirstname ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={!validFirstname && firstname ? "invalid" : "hide"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <input
                            className='form-control'
                            type="text"
                            id='firstname'
                            ref={firstnameRef}
                            autoComplete='off'
                            onChange={(e) => setFirstName(e.target.value)}
                            aria-invalid={validFirstname ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setFirstnameFocus(true)}
                            onBlur={() => setFirstnameFocus(false)}
                        />
                        <p id="uidnote" className={firstnameFocus && firstname && !validFirstname ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br />
                            Must be all letters
                        </p>
                    </div>
                    {/* lastname  */}
                    <div>  
                        <label htmlFor="lastname">Last Name</label>
                        <span className={validLastname ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={!validLastname && lastname ? "invalid" : "hide"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <input
                            className='form-control'
                            type="text"
                            id='lastname'
                            ref={lastnameRef}
                            autoComplete='off'
                            onChange={(e) => setLastname(e.target.value)}
                            aria-invalid={validLastname ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setLastnameFocus(true)}
                            onBlur={() => setLastnameFocus(false)}
                        />
                        <p id="uidnote" className={lastnameFocus && lastname && !validLastname ? "instructions" : "offscreen"}>
                            4 to 24 characters. <br />
                            Must be all letters
                        </p>
                    </div>
                    {/* email  */}
                    <div>  
                        <label htmlFor="email">Email</label>
                        <span className={validEmail ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={!validEmail && email ? "invalid" : "hide"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <input
                            className='form-control'
                            type="text"
                            id='email'
                            ref={emailRef}
                            autoComplete='off'
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            Must be a valid Email
                        </p>
                    </div>
                    {/* contact  */}
                    <div>  
                        <label htmlFor="contact">Contact</label>
                        <input
                            className='form-control'
                            type="number"
                            id='contact'
                            ref={contactRef}
                            autoComplete='off'
                            onChange={(e) => setContact(e.target.value)}
                            aria-describedby='uidnote'
                          
                        />
                    </div>
                    {/* address  */}
                    <div>  
                        <label htmlFor="address">Address</label>
                        <input
                            className='form-control'
                            type="text"
                            id='address'
                            ref={addressRef}
                            autoComplete='off'
                            onChange={(e) => setAddress(e.target.value)}
                            aria-describedby='uidnote'
                          
                        />
                    </div>
                    {/* username  */}
                    <div>  
                        <label htmlFor="username">Username</label>
                        <span className={validName ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={!validName && username ? "invalid" : "hide"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <input
                            className='form-control'
                            type="text"
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUserName(e.target.value)}
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Letters, numbers, underscores, hyphens allowed
                        </p>
                    </div>
                    <div>
                        <label htmlFor="password">Password :</label>
                        <span className={validPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={!validPwd && password ? "invalid" : "hide"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <input
                            className='form-control'
                            type="password"
                            id='password'
                            autoComplete='off'
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby='pwdnote'
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters. <br />
                            Must include uppercase, lowercase, number, and special character <br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span>
                            <span aria-label='at-symbol'>@</span>
                            <span aria-label='hashtag'>#</span>
                            <span aria-label='dollar-sign'>$</span>
                            <span aria-label='percent'>%</span>
                        </p>
                    </div>
                    <div>
                        <label htmlFor="confirm_pwd">Confirm Password :</label>
                        <span className={validMatch && matchPwd !== '' ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={!validMatch && matchPwd !== '' ? "invalid" : "hide"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <input
                            className='form-control'
                            type="password"
                            id='confirm_pwd'
                            autoComplete='off'
                            onChange={(e) => setMatchPwd(e.target.value)}
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby='confirmnote'
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field
                        </p>
                    </div>
                </div>
                <div className="login-button-section">
                  <Button className='login-button' onClick={signUp} disabled={!validName || !validPwd || !validMatch}>
                    Sign Up
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </>
    );
  };
  
  export default SignUp;
  
