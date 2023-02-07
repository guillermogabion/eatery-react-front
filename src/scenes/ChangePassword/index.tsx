import React, { useState } from "react"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { show_password_dark, acm_success } from "../../assets/images"
import { Formik } from "formik"
import { Form, Button } from "react-bootstrap"
import Swal from "sweetalert2"
import { RequestAPI, Api } from "../../api"
import { Utility } from "./../../utils"
import withReactContent from "sweetalert2-react-content"
import * as Yup from "yup"
const ErrorSwal = withReactContent(Swal)

const loginSchema = Yup.object().shape({
  conPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
})

const ReSetPasswordInput = (props: any) => {
  const { name, placeholder, type, setFieldValue, error, setErrorsForm, errors } = props
  const [onFocusInput, setOnFocusInput] = useState<any>(false)
  const [inputValue, setInputValue] = useState<any>("")
  const [visibile, setVisibile] = useState<any>(false)

  const validatePassword = (p: any) => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])/
    const reg2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!&@$%^#\*\?])/
    const errors = []

    if (p.search(/[a-z]/i) < 0) {
      errors.push("At least one letter.")
    }

    if (p.length < 8) {
      errors.push("Your password must be at least 8 characters")
    }

    if (p.search(/[0-9]/) < 0) {
      errors.push("Your password must contain at least one digit.")
    }

    if (!p.match(reg)) {
      errors.push("Must contain both upper and lower-case characters (e.g., a-z, A-Z)")
    }

    if (!p.match(reg2)) {
      errors.push("Must have a combination of the alphabet, numeric and special characters ")
    }

    setErrorsForm(errors)
    setInputValue(p)
    setFieldValue(name, p)
  }

  return (
    <div className="passwordField fieldtext">
      {errors && errors.length ? (
        <div className="passwordRequres" style={onFocusInput ? { display: "block" } : { display: "none" }}>
          <ul>
            {errors.map((d: any) => {
              return (
                <li key={d}>
                  <span className="notpass" />
                  {d}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
      <input
        value={inputValue}
        onFocus={(e) => {
          setOnFocusInput(true)
          validatePassword(`${e.target.value}`.trim())
        }}
        onBlur={() => setOnFocusInput(false)}
        name={name}
        placeholder={placeholder}
        type={visibile ? "text" : type}
        className="form-control"
        required
        onChange={(e) => validatePassword(`${e.target.value}`.trim())}
      />
      <span>
        <img
          src={show_password_dark}
          alt="Hide"
          className={inputValue ? "password-right-icon" : "password-right-icon-disable"}
          onClick={() => setVisibile(!visibile)}
        />
      </span>
      <div style={{ color: "red" }}>{error}</div>
    </div>
  )
}

export const ChangePassword = (props: any) => {
  const [isSuccess, setIsSuccess] = useState<any>(false)

  const [errorOldPass, setErrorOldPass] = useState<any>([])
  const [errorNewPass, setErrorNewPass] = useState<any>([])
  const [errorConPass, setErrorConPass] = useState<any>([])

  return (
    <div className="body" >
      <div className="wraper">
        <div className="w-100">
            <div className="topHeader">
              <UserTopMenu title={`Change Password`} />
            </div>
            <div className="contentContainer">
              <div className="ForgotPassword">
                {!isSuccess ? (
                  <div className="contentForm">
                    <Formik
                      initialValues={{
                        oldPassword: "",
                        newPassword: "",
                        conPassword: "",
                      }}
                      enableReinitialize={true}
                      validationSchema={loginSchema}
                      onSubmit={(values, actions) => {
                        RequestAPI.putRequest(`${Api.USER_RESET_PASSWORD}`, "", values, {}, async (res: any) => {
                          const { status, body = { data: {}, error: {} } }: any = res
                          if (status === 200 || status === 201) {
                            setIsSuccess(true)
                          } else {
                            ErrorSwal.fire("Error!", (body.error && body.error.message) || "", "error")
                          }
                        })
                      }}>
                      {({ values, setFieldValue, handleSubmit, errors }) => {
                        return (
                          <Form noValidate className="loginForm" onSubmit={handleSubmit}>
                            <label>Enter Current Password</label>
                            <ReSetPasswordInput
                              name="oldPassword"
                              placeholder="******"
                              type="password"
                              key="oldPassword"
                              setFieldValue={setFieldValue}
                              errors={errorOldPass}
                              setErrorsForm={setErrorOldPass}
                              error={errors.oldPassword || ""}
                            />
                            <label>Enter New Password</label>
                            <ReSetPasswordInput
                              type="password"
                              placeholder="******"
                              name="newPassword"
                              key="newPassword"
                              setFieldValue={setFieldValue}
                              errors={errorNewPass}
                              setErrorsForm={setErrorNewPass}
                              error={errors.newPassword || ""}
                            />
                            <label>Confirm New Password</label>
                            <ReSetPasswordInput
                              type="password"
                              placeholder="******"
                              name="conPassword"
                              key="conPassword"
                              errors={errorConPass}
                              setErrorsForm={setErrorConPass}
                              setFieldValue={setFieldValue}
                              error={errors.conPassword || ""}
                            />
                            <Button
                              type="submit"
                              className="btn btn-primary"
                              disabled={
                                !(values.oldPassword && values.newPassword && values.conPassword) ||
                                (errorOldPass.length && errorNewPass.length && errorConPass.length)
                              }>
                              SUBMIT
                            </Button>
                          </Form>
                        )
                      }}
                    </Formik>
                  </div>
                ) : (
                  <div className="ForgotPasswordSucess">
                    <p>
                      <img src={acm_success} alt="acm success" />
                    </p>
                    <h3>Success!</h3>
                    <p>Your password has been changed. You may now re-login with your new password. Thank you.</p>
                    <p>
                      <button
                        type="button"
                        className="btn btn-primary btn btn-primary"
                        onClick={() => {
                          Utility.deleteUserData()
                          sessionStorage.clear()
                        }}>
                        LOGIN
                      </button>
                    </p>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
