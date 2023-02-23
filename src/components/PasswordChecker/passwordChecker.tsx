import React, { useState, useEffect} from 'react';
import { Button } from "react-bootstrap"
import {
  show_password_dark,
  hide_password_dark,
} from "../../assets/images"
import './login.css'

function CheckPassword() {
  const [meter, setMeter] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [visibile, setVisibile] = useState<any>(false)
  const [visibile2, setVisibile2] = useState<any>(false)
  const [visibile3, setVisibile3] = useState<any>(false)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/g;
  const atLeastOneUppercase = /[A-Z]/g; // capital letters from A to Z
  const atLeastOneLowercase = /[a-z]/g; // small letters from a to z
  const atLeastOneNumeric = /[0-9]/g; // numbers from 0 to 9
  const atLeastOneSpecialChar = /[#?!@$%^&*-]/g; // any of the special characters within the square brackets
  const twelveCharsOrMore = /.{12,}/g; // eight characters or more

  const passwordTracker = {
    uppercase: password.match(atLeastOneUppercase),
    lowercase: password.match(atLeastOneLowercase),
    number: password.match(atLeastOneNumeric),
    specialChar: password.match(atLeastOneSpecialChar),
    twelveCharsOrGreater: password.match(twelveCharsOrMore),
  };

  const passwordStrength = Object.values(passwordTracker).filter(
    (value) => value
  ).length;
  const copyHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }
  const cutHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  return (
    <div>
      <form>
      <div className="passwordField">
            <input
            id="_current_password"
            onCopy={copyHandler}
            onCut={cutHandler}
            autoComplete="current-password"
            style={{ marginBottom: "20px" }}
            placeholder="Enter Current password"
            name="current_password"
            // value={confirm_password}
            type={visibile ? "text" : "password"}
            className="form-control text-field-color input-login"
            required
          />
          <Button
            variant="link"
            onClick={() => setVisibile(!visibile)}
            className="passwordicon"
            >
            <span className="showpass">
              <img src={show_password_dark} alt="Show" />
            </span>
            <span className="hidepass">
              <img src={hide_password_dark} alt="Hide" />
            </span>
          </Button>
        </div>
        <div className="passwordField">
          <input
            onFocus={() => setMeter(true)}
            // onChange={(e) => setPassword(e.target.value)}
            onCopy={copyHandler}
            onCut={cutHandler}
            type={visibile2 ? "text" : "password"}
            placeholder="Enter New password"
            value={newPassword} onChange={(e) => {
              setPassword(e.target.value),
              setNewPassword(e.target.value);
              if (e.target.value !== confirmPassword) {
                setErrorMessage("Passwords do not match");
              }
              else {
                setErrorMessage("");
              }
  
            }}
            name="new_password"
            className="form-control text-field-color input-login"
            autoComplete="current-password"
            style={{ marginBottom: "20px" }}
          />
          <Button
              variant="link"
              onClick={() => setVisibile2(!visibile2)}
              className="passwordicon"
              >
              <span className="showpass">
                <img src={show_password_dark} alt="Show" />
              </span>
              <span className="hidepass">
                <img src={hide_password_dark} alt="Hide" />
              </span>
            </Button>
        </div>
        {meter && (
          <div>
            <div className="password-strength-meter meter-width"></div>
            <div className='meter-width'>
              {passwordStrength < 5 && 'Must contain '}
              {!passwordTracker.uppercase && 'uppercase, '}
              {!passwordTracker.lowercase && 'lowercase, '}
              {!passwordTracker.specialChar && 'special character, '}
              {!passwordTracker.number && 'number, '}
              {!passwordTracker.twelveCharsOrGreater &&
                'twelve characters or more'}
            </div>
          </div>
        )}
        <div className="passwordField">
            <input
            id="_confirm_password"
            onCopy={copyHandler}
            onCut={cutHandler}
            autoComplete="current-password"
            style={{ marginBottom: "20px" }}
            name="confirm_password"
            placeholder="Confirm new password"
            
            // value={confirm_password}
            type={visibile3 ? "text" : "password"}
            className="form-control text-field-color input-login"
            required
          />
          <Button
            variant="link"
            onClick={() => setVisibile3(!visibile3)}
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
        <div className="d-flex">
          <Button
            style={{ width: '100%' }}
            // onClick={() => dualRequest()}
            className="btn btn-primary btn-styles"
            // disabled={!(username && password)}
            >
            Change Password
          </Button>
        </div>
      </form>
      <style tsx>
        {`
       
          .password-strength-meter {
            height: 0.3rem;
            background-color: lightgrey;
            border-radius: 3px;
            margin: .5rem 0
          }

          .password-strength-meter::before {
            content: "";
            background-color: ${
              ['red', 'orange', '#03a2cc', '#03a2cc', '#0ce052'][
                passwordStrength - 1
              ] || ''
            };
            height: 100%;
            width: ${(passwordStrength / 5) * 100}%;
            display: block;
            border-radius: 3px;
            transition: width 0.4s;
          }
        `}
      </style>
    </div>
  );
}

export default CheckPassword;