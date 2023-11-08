import React, { useCallback, useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { sidebarlogo } from '../../assets/images';
import { RequestAPI, Api } from '../../api';
import axios from 'axios';
import { Utility } from "../../utils"
import { useDispatch } from "react-redux"


// import { useDispatch } from "react-redux"
import moment from "moment";




const Login = () => {
  const dispatch = useDispatch()
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  
  
  // useEffect(() => {
  //   console.log(process.env)

  //   RequestAPI.getRequest(
  //     `${Api.Test}`,
  //     "",
  //     {},
  //     {},
  //     async (res: any) => {
  //       const { status, body = { data: {}, error: {} } }: any = res;
  
  //       if (status === 200) {
  //         const data = body.data;
  
  //       }
  //     }
  //   );
  // }, []);
  const handleSubmit = React.useCallback(() => {
    if (login && password) {
      RequestAPI.postRequest(Api.Login, "", { login, password }, {}, async (res: any) => {
        const { status, body } = res
        if (status === 200) {
          if (body.error && body.error.message) {
            setErrorMessage(body.error.message);
            setPassword("")
          } else {
          
              window.localStorage.setItem("accessToken", body.access_token)
            
              const userObj = { ...body }
              if (userObj && userObj.accessToken) {
                delete userObj.accessToken
              }
              console.log(process.env)
              dispatch({ type: "USER_DATA", payload: userObj })
              dispatch({ type: "IS_LOGIN", payload: true })
          }
        } else {
          if (body.error && body.error.message) {
            setErrorMessage(body.error.message);
            setPassword("")
          }
        }
      });
    }
  }, [login, password])

  return (
    <div className='centered-card'>
      <Card className='login-card'>
        <div className="centered-container">
          <Card.Img variant='top' className='login-logo' src={sidebarlogo} alt="Logo" />
        </div>
        <Card.Body>
          <div className='login-form'>
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              id="text"
              className='login-input'
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              className='login-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-button-section">
            <Button className='login-button' onClick={handleSubmit}>Login</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
