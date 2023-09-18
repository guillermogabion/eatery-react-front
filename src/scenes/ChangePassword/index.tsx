import { Formik } from "formik"
import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import * as Yup from "yup"
import { Api, RequestAPI } from "../../api"
import { hide_password_dark, show_password_dark } from "../../assets/images"
import ContainerWrapper from "../../components/ContainerWrapper"

import TimeDate from "../../components/TimeDate"
import UserTopMenu from "../../components/UserTopMenu"
import { Utility } from "./../../utils"

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
                  <span id="changepassword_notpass_span" className="notpass" />
                  {d}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
      <input
        id="changepassword_pass_input"
        value={inputValue}
        onFocus={(e) => {
          setOnFocusInput(true)
          validatePassword(`${e.target.value}`.trim())
        }}
        onBlur={() => setOnFocusInput(false)}
        name={name}
        placeholder={placeholder}
        type={visibile ? "text" : type}
        className="form-control w-100"
        style={{width: 299}}
        required
        onChange={(e) => validatePassword(`${e.target.value}`.trim())}
      />
      <span className="bg-danger">
        <img
          id="changepassword_pass_img"
          src={visibile ? hide_password_dark : show_password_dark }
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
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const { data } = useSelector((state: any) => state.rootReducer.userData)

  return (
    <ContainerWrapper contents={<>
      <div className="w-100 px-3 py-5 ">
        <div className="p-0 m-0 flex justify-center">
          <div className="w-100 px-0 pt-2 ">
            <div className="px-5 py-5">
              <div className="ForgotPassword mt-5 ">
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
                        
                        RequestAPI.putRequest(`${Api.changePassword}`, "", values, {}, async (res: any) => {
                          const { status, body = { data: {}, error: {} } }: any = res
                          if (status === 200 || status === 201) {
                            if (body.error && body.error.message){
                              ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "changepassword_errorconfirm_alertbtn"
                                },
                                icon: 'error',
                            })
                            }else{
                              setIsSuccess(true)
                            }
                            
                          } else {
                            ErrorSwal.fire({
                              title: 'Error!',
                              text: (body.error && body.error.message) || "",
                              didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();
                      
                                if(confirmButton)
                                  confirmButton.id = "changepassword_errorconfirm2_alertbtn"
                              },
                              icon: 'error',
                          })
                          }
                        })
                      }}>
                      {({ values, setFieldValue, handleSubmit, errors }) => {
                        return (
                          <Form noValidate className="loginForm" onSubmit={handleSubmit}>
                            <label>Enter Current Password</label>
                            <ReSetPasswordInput
                              id="changepassword_oldpass_field"
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
                              id="changepassword_newpass_field"
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
                              id="changepassword_confirmpass_field"
                              type="password"
                              placeholder="******"
                              name="conPassword"
                              key="conPassword"
                              errors={errorConPass}
                              setErrorsForm={setErrorConPass}
                              setFieldValue={setFieldValue}
                              error={errors.conPassword || ""}
                            />
                            <div className="d-flex justify-content-center">
                              <Button
                                id="changepassword_submit_btn"
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                  (errorOldPass.length > 0 || errorNewPass.length > 0 || errorConPass.length > 0 ? true : false) ||
                                  (values.oldPassword == "" || values.newPassword == "" || values.conPassword =="") || 
                                  (errors.conPassword)
                                }>
                                SUBMIT
                            </Button>
                            </div>
                            
                          </Form>
                        )
                      }}
                    </Formik>
                  </div>
                ) : (
                  <div className="ForgotPasswordSucess">
                    <h3>Success!</h3>
                    <p>Your password has been changed. You may now re-login with your new password. Thank you.</p>
                    <p>
                      <button
                        id="changepassword_login_btn"
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
      </>} />
  )
}
