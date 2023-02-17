import React, { useEffect, useState, useRef } from "react"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { RInput, RSelect } from "../../components/Forms"
import { Form, Button } from "react-bootstrap"
import { RequestAPI, Api } from "../../api"
import { Formik } from "formik"
import * as Yup from "yup"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { um_icon } from "../../assets/images"
import moment from "moment"
import UserPopup from "../../components/Popup/UserPopup"
import ReactLoader from "../../components/Loader/ReactLoader"
import CustomDatePicker from "../../components/CustomDatePicker"
const ErrorSwal = withReactContent(Swal)

function createValidation(id: number) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])/
  const reg2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!&@$%^#\*\?])/
  const errMsg = "Must contain both upper and lower-case characters (e.g., a-z, A-Z)"
  const errMsg1 = "Must have a combination of the alphabet, numeric and special characters "

  return Yup.object().shape({
    userDesignationId: Yup.string().required("User Type is required !"),
    unitId: Yup.string().required("Unit is required !"),
    userRoleId: Yup.string().required("Role is required !"),
    userStatusId: Yup.string().required("Status is required !"),
    firstName: Yup.string().trim().max(70, "Too Long!").required("First Name is required !"),
    middleName: Yup.string().trim().max(70, "Too Long!").required("Middle Name is required !"),
    lastName: Yup.string().trim().max(70, "Too Long!").required("Last Name is required !"),
    userName: Yup.string()
      .trim()
      .max(70, "Too Long!")
      .required("User ID is required !")
      .test("len", "Field should be accept minimum 8 alpha-numerical value !", (val: any) => val && val.length >= 8),
    email: Yup.string()
      .trim()
      .email("Invalid Email ID")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid Email ID"
      )
      .required("Official Email ID is required !"),
    userIdExpiry: Yup.string().nullable().required("User Expirey is required !"),
    password: !id
      ? Yup.string()
        .trim()
        .min(8, "Password must be at least 8 character !")
        .required("Password is required !")
        .matches(reg, errMsg)
        .matches(reg2, errMsg1)
      : Yup.string()
        .trim()
        .min(8, "Password must be at least 8 character !")
        .matches(reg, errMsg)
        .matches(reg2, errMsg1),
  })
}

export const UserForm = (props: any) => {
  const { history } = props
  const [loader, setLoader] = useState(false)
  const [initialValues, setInitialValues] = useState<any>({
    id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phone: "",
    changePassword: true,
    userDesignationId: "",
    unitId: "",
    userRoleId: "",
    userStatusId: "1",
    userIdExpiry: null,
  })

  const formRef: any = useRef()

  const userId = props.location && props.location.state && props.location.state.id

  const submitButtonTitle = userId && userId > -1 ? "UPDATE & SUBMIT USER" : "CREATE USER"
  const generateText = userId && userId > -1 ? "Re-Generate" : "Generate"

  const keydownFun = (event: any) => {
    if (event.key === "Enter" && Object.keys(formRef.current.values).length) {
      formRef && formRef.current && formRef.current.submitForm()
    }
  }

  useEffect(() => {
    document.removeEventListener("keydown", keydownFun)
    document.addEventListener("keydown", keydownFun)
    return () => document.removeEventListener("keydown", keydownFun)
  }, [])

  useEffect(() => {
    if (userId) {
      setLoader(true)
      RequestAPI.getRequest(`${Api.USERS}/${userId}`, "", {}, {}, async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200) {
          setInitialValues((body && body.data) || {})
        }
        setTimeout(() => setLoader(false), 500)
      })
    }
  }, [])

  const onFormSubmit = (values: any) => {
    if (userId) {
      const valuObj: any = { ...values, ...{ changePassword: true } }
      if (valuObj.creationTimestamp) {
        delete valuObj.creationTimestamp
        delete valuObj.id
      }

      if (!valuObj.password) {
        valuObj.changePassword = false
      }
      RequestAPI.putRequest(`${Api.USERS}/${userId}`, "", valuObj, {}, async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 || status === 201) {
          ErrorSwal.fire({
            html: (
              <UserPopup
                handleClose={ErrorSwal.close}
                popupType="success"
                title={(body && body.data) || "Record Successfully updated."}
              />
            ),
            showConfirmButton: false,
          })

          history.push("/user/list")
        } else {
          ErrorSwal.fire({
            icon: "error",
            title: "Error!",
            text: (body.error && body.error.message) || "",
            confirmButtonColor: "#73BF45",
          })
        }
      })
    } else {
      RequestAPI.postRequest(Api.USERS, "", values, {}, async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 || status === 201) {
          ErrorSwal.fire({
            html: <UserPopup handleClose={ErrorSwal.close} title="SUCCESS" popupType="success" />,
            showConfirmButton: false,
          })
          history.push("/user/list")
        } else {
          ErrorSwal.fire({
            icon: "error",
            title: "Error!",
            text: (body.error && body.error.message) || "",
            confirmButtonColor: "#73BF45",
          })
        }
      })
    }
  }

  const fourceUserLogout = (id: any) => {
    RequestAPI.deleteRequest(`${Api.USER}/${id}/forceLogout`, "", {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        ErrorSwal.fire("Success", "This User is Successfully logout", "success")
      } else {
        ErrorSwal.fire({
          icon: "error",
          title: (body.error && body.error.message) || "",
        })
      }
    })
  }
  return (
    <div className="body">
      <div className="wraper">
        <div className="w-100">
            <div className="topHeader">
              <UserTopMenu title={userId ? "Edit User" : "Add User"} />
            </div>
            <div className="contentContainer" style={{ paddingTop: "15px" }}>
              {userId ? (
                <div>
                  <div className="bredcrum">
                    <ul>
                      <li onClick={() => history.push("/user/list")}>
                        <a href="#!">User List</a>
                      </li>
                      <li>Edit User</li>
                    </ul>
                  </div>
                  <div className="LoginDetail" style={{ width: "95%" }}>
                    <ul>
                      <li className="umIcon">
                        <img src={um_icon} alt="user" />
                      </li>
                      <li className="LoginDate">
                        <strong>Date of user id creation:</strong>{" "}
                        {(initialValues &&
                          initialValues.creationTimestamp &&
                          moment(initialValues.creationTimestamp).format("DD/MM/yyyy")) ||
                          ""}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bredcrum">
                  <ul>
                    <li onClick={() => history.push("/user/list")}>
                      <a href="#!">User List</a>
                    </li>
                    <li>Add User</li>
                  </ul>
                </div>
              )}
              <ReactLoader isLoading={loader} />
              <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={createValidation(userId)}
                innerRef={formRef}
                onSubmit={(values, actions) => onFormSubmit(values)}>
                {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
                  return (
                    <Form noValidate className="contentAddUser" onSubmit={handleSubmit}>
                      <div className="row">
                        <RSelect
                          name="unitId"
                          strikes={true}
                          value={values.unitId}
                          id="unit"
                          label="Select Unit"
                          className="formControlSelect"
                          onSelect={handleChange}
                          style={
                            errors.hasOwnProperty("unitId") && touched["unitId"] && errors["unitId"]
                              ? { border: "1px solid #ff0000" }
                              : {}
                          }
                        />
                        <RSelect
                          name="userRoleId"
                          value={values.userRoleId}
                          strikes={true}
                          id="role"
                          label="Select Role"
                          className="formControlSelect"
                          onSelect={handleChange}
                          style={
                            errors.hasOwnProperty("userRoleId") && touched["userRoleId"] && errors["userRoleId"]
                              ? { border: "1px solid #ff0000" }
                              : {}
                          }
                        />
                      </div>
                      <div className="row">
                        <RSelect
                          name="userDesignationId"
                          value={values.userDesignationId}
                          strikes={true}
                          id="usertype"
                          label="Select User Type"
                          className="formControlSelect"
                          onSelect={handleChange}
                          style={
                            errors.hasOwnProperty("userDesignationId") &&
                              touched["userDesignationId"] &&
                              errors["userDesignationId"]
                              ? { border: "1px solid #ff0000" }
                              : {}
                          }
                        />
                        <RSelect
                          name="userStatusId"
                          value={values.userStatusId}
                          strikes={true}
                          id="status"
                          label="Status"
                          className="formControlSelect"
                          onSelect={handleChange}
                          style={
                            errors.hasOwnProperty("userStatusId") && touched["userStatusId"] && errors["userStatusId"]
                              ? { border: "1px solid #ff0000" }
                              : {}
                          }
                        />
                      </div>
                      <div className="personalDetail">
                        <div className="row">
                          <RInput
                            label={"Last Name"}
                            name="lastName"
                            type="text"
                            value={`${values.lastName}`.trimStart()}
                            strikes={true}
                            className="formControl"
                            onChange={handleChange}
                            onKeyDown={(evt) => !/^[a-zA-Z0-9]+$/gi.test(evt.key) && evt.preventDefault()}
                            style={
                              errors.hasOwnProperty("lastName") && touched["lastName"] && errors["lastName"]
                                ? { border: "1px solid #ff0000" }
                                : {}
                            }
                          />
                          <RInput
                            value={`${values.userName}`.trimStart()}
                            label={"User ID"}
                            strikes={true}
                            name="userName"
                            type="text"
                            onChange={handleChange}
                            className="formControl"
                            style={
                              errors.hasOwnProperty("userName") && touched["userName"] && errors["userName"]
                                ? { border: "1px solid #ff0000" }
                                : {}
                            }
                            required
                          />
                        </div>
                        <div className="row">
                          <RInput
                            label={"First Name"}
                            value={`${values.firstName}`.trimStart()}
                            strikes={true}
                            name="firstName"
                            type="text"
                            className="formControl"
                            onKeyDown={(evt) => !/^[a-zA-Z0-9]+$/gi.test(evt.key) && evt.preventDefault()}
                            style={
                              errors.hasOwnProperty("firstName") && touched["firstName"] && errors["firstName"]
                                ? { border: "1px solid #ff0000" }
                                : {}
                            }
                            onChange={handleChange}
                          />
                          <RInput
                            label={"Official Email ID"}
                            value={`${values.email}`.trimStart()}
                            name="email"
                            placeholder="Enter your official email id"
                            strikes={true}
                            style={
                              errors.hasOwnProperty("email") && touched["email"] && errors["email"]
                                ? { border: "1px solid #ff0000" }
                                : {}
                            }
                            type="text"
                            className="formControl"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="row">
                          <RInput
                            label={"Middle Name"}
                            value={`${values.middleName}`.trimStart()}
                            strikes={true}
                            name="middleName"
                            type="text"
                            className="formControl"
                            onChange={handleChange}
                            onKeyDown={(evt) => !/^[a-zA-Z0-9]+$/gi.test(evt.key) && evt.preventDefault()}
                            style={
                              errors.hasOwnProperty("middleName") && touched["middleName"] && errors["middleName"]
                                ? { border: "1px solid #ff0000" }
                                : {}
                            }
                          />
                          <RInput
                            label={"Password"}
                            strikes={!userId ? true : false}
                            generatetext={generateText}
                            value={`${values.password}`.trimStart()}
                            name="password"
                            placeholder="Temporary password"
                            type="text"
                            generate={true}
                            className="formControl"
                            style={
                              errors.hasOwnProperty("password") && touched["password"] && errors["password"]
                                ? { border: "1px solid #ff0000" }
                                : {}
                            }
                            onChange={handleChange}
                            ongenerat={setFieldValue}
                          />
                        </div>
                        <div className="row">
                          <Form.Group className={"col-md-6"}>
                            <Form.Label>{"Set User Expiry"}</Form.Label>
                            <div className="fieldtext">
                              <CustomDatePicker
                                inputClassNames="custom_calendar_style"
                                placeholder="User Expiry Date"
                                strikes={true}
                                handleDayChange={(e: any) =>
                                  setFieldValue("userIdExpiry", moment(e).format("DD MMM YYYY"))
                                }
                                value={values.userIdExpiry ? moment(values.userIdExpiry, "DD MMM YYYY").toDate() : null}
                                minDate={new Date()}
                                maxYear={10}
                                error={
                                  errors &&
                                  errors.hasOwnProperty("userIdExpiry") &&
                                  touched["userIdExpiry"] &&
                                  errors["userIdExpiry"]
                                }
                                format={"dd MMM yyyy"}
                              />
                              {errors &&
                                errors.hasOwnProperty("userIdExpiry") &&
                                touched["userIdExpiry"] &&
                                errors["userIdExpiry"] && <p style={{ color: "red" }}>{errors["userIdExpiry"]}</p>}
                            </div>
                          </Form.Group>
                          {/* <div className={"col-md-6"}>
                            <div className="redioField">
                              <label>Office Designation</label>
                              <div className="redioFieldwrap" style={{paddingTop: '12px'}}>
                                <input
                                  type="radio"
                                  name="officeDesignation"
                                  onClick={() => setFieldValue("officeDesignation", 1)}
                                  checked={values.officeDesignation == 1}
                                />
                                <label htmlFor="Back-Officer-Access">Back Officer Access</label>
                                <input
                                  type="radio"
                                  name="officeDesignation"
                                  onClick={() => setFieldValue("officeDesignation", 2)}
                                  checked={values.officeDesignation == 2}
                                />
                                <label htmlFor="Front-Office-Access">Front Office Access</label>
                                <input
                                  type="radio"
                                  name="officeDesignation"
                                  onClick={() => setFieldValue("officeDesignation", 3)}
                                  checked={values.officeDesignation == 3}
                                />
                                <label htmlFor="Back-and-Front-Office-Access">Back and Front Office Access</label>
                              </div>
                            </div>
                          </div> */}
                        </div>
                        <Button type="submit" className="btn btn-primary float-right createUser">
                          {submitButtonTitle}
                        </Button>
                        {userId ? (
                          <button
                            type="button"
                            className="btn  float-right sendBack"
                            style={{ marginRight: 10 }}
                            onClick={() => fourceUserLogout(userId)}>
                            FORCE LOG OFF
                          </button>
                        ) : null}
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
      </div>
    </div>
  )
}
