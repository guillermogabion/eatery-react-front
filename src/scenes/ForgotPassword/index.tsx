import React from "react"
import { Logo, logo_s, logo_mob, lhs_image, ts_image } from "../../assets/images"

export const ForgotPassword = () => {
  return (
    <div className="body">
      <div className="wraper loginPage">
        <div className="header">
          <h1>
            <a className="logo" href="#!">
              <img src={Logo} alt="RBank" />
            </a>
          </h1>
        </div>
        <div className="loginbody">
          <div className="fullWidth">
            <div className="contentLeft">
              <img className="bannerDekstop" src={lhs_image} alt="banner" />
              <img className="bannerMobile" src={ts_image} alt="banner" />
              <div className="mobileLogo">
                <img src={logo_mob} alt="RBank" />
              </div>
            </div>
            <div className="contentRight">
              <div className="contentForm ">
                <div className="loginLogo">
                  <img src={logo_s} alt="RBank" />
                </div>
                <h3>Forgot Password</h3>
                <p>
                  For added verification, we sent you an OTP code to your registered mobile number ending with{" "}
                  <a href="#!">XX89</a>
                </p>
                <form action="#" className="loginForm">
                  <div className="ForgotPassword">
                    <input name="password" placeholder="*****" type="password" className="form-control" required />
                    <small>00:20</small>
                  </div>
                  <span className="resendOTP">
                    Didn’t receive the OTP? <a href="#!">RESEND CODE</a>
                  </span>
                  <button type="submit" className="btn btn-primary" disabled>
                    VERIFY
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
