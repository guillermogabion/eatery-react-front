import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Form, Image, Modal } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import { Formik } from "formik";
import * as Yup from "yup";
import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from "react-redux"


export const Employee = (props: any) => {
  const { history } = props
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);
  const formikRef: any = useRef();
  const [tabIndex, setTabIndex] = React.useState(1);
  const masterList = useSelector((state: any) => state.rootReducer.masterList)
  const [squadList, setSquadList] = React.useState([]);
  const [employeeList, setEmployeeList] = React.useState([]);
  const [userId, setUserId] = React.useState("");
  const [initialValues, setInitialValues] = useState<any>({
    "roleId": 2,
    "status": "ACTIVE",
    "firstName": "Test",
    "middleName": "test",
    "lastName": "test",
    "gender": "MALE",
    "civilStatus": "SINGLE",
    "birthDay": moment().format("YYYY-MM-DD"),
    "contactNumber": 4124,
    "emailAddress": "testjay@gmail.com",
    "emergencyContactNo": 124125125,
    "emergencyContactName": "test",
    "emergencyContactAddress": "test",
    "emergencyContactRelationship": "SPOUSE",
    "employeeId": "100002994",
    "biometricsId": 0,
    "companyEmail": "testcomjay@gmail.com",
    "employeeType": "RANK_AND_FILE",
    "jobTitle": "4124124",
    "userLevel": "EMPLOYEE",
    "immediateSuperiorId": "124124",
    "employeeStatus": "Regular",
    "employmentStatusEffectivityDate": moment().format("YYYY-MM-DD"),
    "hireDate": moment().format("YYYY-MM-DD"),
    "bankAcctType": "SAVINGS",
    "bankAccountNumber": "124124",
    "tinNumber": "124124124",
    "position": "Engineer",
    "regularizationDate": moment().format("YYYY-MM-DD"),
    "statusDate": moment().format("YYYY-MM-DD"),
    "department": "Delivery_Operations",
    "costCenter": "test",
    "seperationDate": moment().format("YYYY-MM-DD"),
    "sssNumber": "5125125",
    "philHealthId": "125125",
    "hdmfNumber": "124124",
    "squadid": 1,
    "otComputationTable": "125125125",
    "minimumWageEarner": true,
    "totalWorkHrsPerDay": 0,
    "workDaysPerYear": 0,
    "consultantPercentTax": "Two",
    "clientName": "125125",
    "jobCode": "125125125",
    "jobGrade": "One",
    "billability": true,
    "payrollRole": "SuperAdmin",
    "payGroup": "Monthly_Paid_Employees",
    "payrollRunType": "Daily",
    "basicMonthlySalary": 1000,
    "salaryEffectivityDate": moment().format("YYYY-MM-DD"),
    "monthlyDeMinimisBenefits": 1231,
    "ecola": 1230,
    "clothingAllowance": 1231230,
    "communicationAllowance": 1230,
    "discretionaryAllowance": 1231230,
    "mealAllowance": 1230,
    "medicalAllowance": 1230,
    "productivityAllowance": 3330,
    "conveyanceAllowance": 330,
    "otherAllowance": 230,
    "rdo": "123123",
    "prclicenseNo": 4412,
    "passportNo": 124124
  })

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.getAllSquad}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setSquadList(body.data)
        }
      }
    )
  }, [])

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.allEmployee}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.data.content) {
            setEmployeeList(body.data.content)
          }
          // setLeaveTypes(body)
        } else {

        }
      }
    )

  }, [])


  const setFormField = (e: any, setFieldValue: any) => {
    const { name, value } = e.target
    if (setFieldValue) {
      setFieldValue(name, value)
    }
  }

  const tableHeaders = [
    'Username',
    'Role',
    'Failed Login Attempts',
    'Action',
  ]

  const getEmployee = (userid: any) => {
    RequestAPI.getRequest(
      `${Api.employeeInformation}?body=${userid}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.data) {
            setUserId(body.data.userId)
            setInitialValues(body.data)
            setModalShow(true)
            setTabIndex(1)
          }
        } 
      }
    )
  }

  const information = (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={null}
      onSubmit={(values, actions) => {
        const valuesObj: any = { ...values }
        setInitialValues(valuesObj)
        setTabIndex(2)
      }}>
      {({ values, setFieldValue, handleSubmit, errors, touched }) => {
        return (
          <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
            <div className="col-md-12 row p-0 m-0" >
                <div className="form-group col-md-12 pt-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                  <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                  <h5>Employee Information</h5>
                </div>
              </div>
            <div className="row w-100 px-5">
              <div className="form-group col-md-6 mb-3 " >
                <label>First name</label>
                <input type="text"
                  name="firstName"
                  id="firstName"
                  className="form-control"
                  value={values.firstName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Last name</label>
                <input type="text"
                  name="lastName"
                  id="lastName"
                  value={values.lastName}
                  className="form-control"
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Middle name</label>
                <input
                  type="text"
                  name="middleName"
                  id="middleName"
                  className="form-control"
                  value={values.middleName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-3 mb-3" >
                <label>Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  id="gender"
                  value={values.gender}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.genders &&
                    masterList.genders.length &&
                    masterList.genders.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-3 mb-3" >
                <label>Civil Status</label>
                <select
                  className="form-select"
                  name="civilStatus"
                  id="civilStatus"
                  value={values.civilStatus}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.civilStatus &&
                    masterList.civilStatus.length &&
                    masterList.civilStatus.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Date of Birth</label>
                <input type="date"
                  name="birthDay"
                  id="birthDay"
                  className="form-control"
                  value={values.birthDay}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Number</label>
                <input type="text"
                  name="contactNumber"
                  id="contactNumber"
                  className="form-control"
                  value={values.contactNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Email Address</label>
                <input type="text"
                  name="emailAddress"
                  id="emailAddress"
                  className="form-control"
                  value={values.emailAddress}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>PRC License No</label>
                <input type="text"
                  name="prclicenseNo"
                  id="prclicenseNo"
                  className="form-control"
                  value={values.prclicenseNo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Passport No</label>
                <input type="text"
                  name="passportNo"
                  id="passportNo"
                  className="form-control"
                  value={values.passportNo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
            </div>
            <br />
            <Modal.Footer>
              <div className="d-flex justify-content-end px-5">
                <button
                  type="submit"
                  className="btn btn-primary">
                  Next
                </button>
              </div>
            </Modal.Footer>

          </Form>
        )
      }}
    </Formik>
  )

  const emergencyContacts = (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={null}
      onSubmit={(values, actions) => {
        const valuesObj: any = { ...values }
        setInitialValues(valuesObj)
        setTabIndex(3)
      }}>
      {({ values, setFieldValue, handleSubmit, errors, touched }) => {
        return (
          <Form noValidate onSubmit={handleSubmit} id="_formid1" autoComplete="off">
            <div className="col-md-12 row p-0 m-0" >
                <div className="form-group col-md-12 pt-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                  <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                  <h5>Emergency Contact</h5>
                </div>
              </div>
            <div className="row w-100 px-5">
              <div className="form-group col-md-6 mb-3 " >
                <label>Contact No.</label>
                <input type="text"
                  name="emergencyContactNo"
                  id="emergencyContactNo"
                  className="form-control"
                  value={values.emergencyContactNo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Name</label>
                <input type="text"
                  name="emergencyContactName"
                  id="emergencyContactName"
                  className="form-control"
                  value={values.emergencyContactName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Address</label>
                <input type="text"
                  name="emergencyContactAddress"
                  id="emergencyContactAddress"
                  className="form-control"
                  value={values.emergencyContactAddress}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Relationship</label>
                <select
                  className="form-select"
                  name="emergencyContactRelationship"
                  onChange={(e) => setFormField(e, setFieldValue)}
                  value={values.emergencyContactRelationship}
                  id="emergencyContactRelationship">
                  {masterList &&
                    masterList.emergencyRelationship &&
                    masterList.emergencyRelationship.length &&
                    masterList.emergencyRelationship.map((item: any, index: string) => (
                      <option key={`${index}_${item}1`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <br />
            <Modal.Footer>
              <div className="d-flex justify-content-end px-5">
                <button
                  type="button"
                  onClick={() => {
                    setTabIndex(1)
                  }}
                  className="btn btn-primary mx-2">
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary">
                  Next
                </button>
              </div>
            </Modal.Footer>
          </Form>
        )
      }}
    </Formik>
  )


  const otherInformation = (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={null}
      onSubmit={(values, actions) => {
        const valuesObj: any = { ...values }
        setInitialValues(valuesObj)
        setTabIndex(4)
      }}>
      {({ values, setFieldValue, handleSubmit, errors, touched }) => {
        return (
          <Form noValidate onSubmit={handleSubmit} id="_formid2" autoComplete="off">
            <div className="col-md-12 row p-0 m-0" >
                <div className="form-group col-md-12 pt-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                  <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                  <h5>Employment Information</h5>
                </div>
              </div>
            <div className="row w-100 px-5">
              <div className="form-group col-md-6 mb-3 " >
                <label>Employee ID</label>
                <input type="text"
                  name="employeeId"
                  id="employeeId"
                  className="form-control"
                  value={values.employeeId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Biometrics ID</label>
                <input type="text"
                  name="biometricsId"
                  id="biometricsId"
                  className="form-control"
                  value={values.biometricsId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Company Email</label>
                <input type="text"
                  name="companyEmail"
                  id="companyEmail"
                  className="form-control"
                  value={values.companyEmail}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Employee Type</label>
                <select
                  className="form-select"
                  name="employeeType"
                  id="employeeType"
                  value={values.employeeType}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.employeeType &&
                    masterList.employeeType.length &&
                    masterList.employeeType.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Job Title</label>
                <input type="text"
                  name="jobTitle"
                  id="jobTitle"
                  className="form-control"
                  value={values.jobTitle}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>User Level</label>
                <select
                  className="form-select"
                  name="userLevel"
                  id="userLevel"
                  value={values.userLevel}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.userLevel &&
                    masterList.userLevel.length &&
                    masterList.userLevel.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Immediate Superior ID</label>
                <input type="text"
                  name="immediateSuperiorId"
                  id="immediateSuperiorId"
                  className="form-control"
                  value={values.immediateSuperiorId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Employee Status</label>
                <select
                  className="form-select"
                  name="employeeStatus"
                  id="employeeStatus"
                  value={values.employeeStatus}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.employmentStatus &&
                    masterList.employmentStatus.length &&
                    masterList.employmentStatus.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Effectivity Date</label>
                <input type="date"
                  name="employmentStatusEffectivityDate"
                  id="employmentStatusEffectivityDate"
                  className="form-control"
                  value={values.employmentStatusEffectivityDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Hire Date</label>
                <input type="date"
                  name="hireDate"
                  id="hireDate"
                  className="form-control"
                  value={values.hireDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Bank Account Type</label>
                <select
                  className="form-select"
                  name="bankAcctType"
                  id="bankAcctType"
                  value={values.bankAcctType}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.bankType &&
                    masterList.bankType.length &&
                    masterList.bankType.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Bank Account Number</label>
                <input type="text"
                  name="bankAccountNumber"
                  id="bankAccountNumber"
                  className="form-control"
                  value={values.bankAccountNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Tin Number</label>
                <input type="text"
                  name="tinNumber"
                  id="tinNumber"
                  className="form-control"
                  value={values.tinNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Position</label>
                <input type="text"
                  name="position"
                  id="position"
                  className="form-control"
                  value={values.position}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Regularization Date</label>
                <input type="date"
                  name="regularizationDate"
                  id="regularizationDate"
                  className="form-control"
                  value={values.regularizationDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Status Date</label>
                <input type="date"
                  name="statusDate"
                  id="statusDate"
                  className="form-control"
                  value={values.statusDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Department</label>
                <select
                  className="form-select"
                  name="department"
                  id="department"
                  value={values.department}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.department &&
                    masterList.department.length &&
                    masterList.department.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Cost Center</label>
                <input type="text"
                  name="costCenter"
                  id="costCenter"
                  className="form-control"
                  value={values.costCenter}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Separation Date</label>
                <input type="date"
                  name="seperationDate"
                  id="seperationDate"
                  className="form-control"
                  value={values.seperationDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>SSS Number</label>
                <input type="text"
                  name="sssNumber"
                  id="sssNumber"
                  className="form-control"
                  value={values.sssNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Philhealth ID</label>
                <input type="text"
                  name="philHealthId"
                  id="philHealthId"
                  className="form-control"
                  value={values.philHealthId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Hdmf Number</label>
                <input type="text"
                  name="hdmfNumber"
                  id="hdmfNumber"
                  className="form-control"
                  value={values.hdmfNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Squad</label>
                <select
                  className="form-select"
                  name="squadid"
                  id="squadid"
                  value={values.squadid}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {squadList &&
                    squadList.length &&
                    squadList.map((item: any, index: string) => (
                      <option key={`${index}_${item.name}`} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>OT Computation Table</label>
                <input type="text"
                  name="otComputationTable"
                  id="otComputationTable"
                  className="form-control"
                  value={values.otComputationTable}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Minimum Wage Earner</label>
                <input type="text"
                  name="minimumWageEarner"
                  id="minimumWageEarner"
                  className="form-control"
                  value={values.minimumWageEarner}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Total Work Hours per Day</label>
                <input type="text"
                  name="totalWorkHrsPerDay"
                  id="totalWorkHrsPerDay"
                  className="form-control"
                  value={values.totalWorkHrsPerDay}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Work Days Per Year</label>
                <input type="text"
                  name="workDaysPerYear"
                  id="workDaysPerYear"
                  className="form-control"
                  value={values.workDaysPerYear}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Cosultant Percent tax</label>
                <select
                  className="form-select"
                  name="consultantPercentTax"
                  id="consultantPercentTax"
                  value={values.consultantPercentTax}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.consultantPerTax &&
                    masterList.consultantPerTax.length &&
                    masterList.consultantPerTax.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Client Name</label>
                <input type="text"
                  name="clientName"
                  id="clientName"
                  className="form-control"
                  value={values.clientName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>

              <div className="form-group col-md-6 mb-3" >
                <label>Job Code</label>
                <input type="text"
                  name="jobCode"
                  id="jobCode"
                  className="form-control"
                  value={values.jobCode}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Job Grade</label>
                <select
                  className="form-select"
                  name="jobGrade"
                  id="jobGrade"
                  value={values.jobGrade}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.jobGrade &&
                    masterList.jobGrade.length &&
                    masterList.jobGrade.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div><div className="form-group col-md-6 mb-3" >
                <label>Billability</label>
                <input type="text"
                  name="billability"
                  id="billability"
                  className="form-control"
                  value={values.billability}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Payroll Role</label>
                <select
                  className="form-select"
                  name="payrollRole"
                  id="payrollRole"
                  value={values.payrollRole}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {masterList &&
                    masterList.payrollRole &&
                    masterList.payrollRole.length &&
                    masterList.payrollRole.map((item: any, index: string) => (
                      <option key={`${index}_${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Pay Group</label>
                <input type="text"
                  name="payGroup"
                  id="payGroup"
                  className="form-control"
                  value={values.payGroup}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Payroll Run Type</label>
                <input type="text"
                  name="payrollRunType"
                  id="payrollRunType"
                  className="form-control"
                  value={values.payrollRunType}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Basic Monthly Salary</label>
                <input type="text"
                  name="basicMonthlySalary"
                  id="basicMonthlySalary"
                  className="form-control"
                  value={values.basicMonthlySalary}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Salary Effectivity Date</label>
                <input type="date"
                  name="salaryEffectivityDate"
                  id="salaryEffectivityDate"
                  className="form-control"
                  value={values.salaryEffectivityDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Monthly De Mininmis Benefits</label>
                <input type="text"
                  name="monthlyDeMinimisBenefits"
                  id="monthlyDeMinimisBenefits"
                  className="form-control"
                  value={values.monthlyDeMinimisBenefits}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Ecola</label>
                <input type="text"
                  name="ecola"
                  id="ecola"
                  className="form-control"
                  value={values.ecola}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
            </div>
            <br />
            <Modal.Footer>
              <div className="d-flex justify-content-end px-5">
                <button
                  type="button"
                  onClick={() => {
                    setTabIndex(2)
                  }}
                  className="btn btn-primary mx-2">
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary">
                  Next
                </button>
              </div>
            </Modal.Footer>


          </Form>
        )
      }}
    </Formik>
  )


  const payrollInformation = (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={null}
      onSubmit={(values, actions) => {
        const valuesObj: any = { ...values }
        if (userId){
          RequestAPI.putRequest(Api.updateEmployee, "", valuesObj, {}, async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            
            if (status === 200 || status === 201) {
              if (body.error && body.error.message) {
                ErrorSwal.fire(
                  'Error!',
                  (body.error && body.error.message) || "",
                  'error'
                )
              } else {  
                ErrorSwal.fire(
                  'Updated Successfully!',
                  (body.data || ""),
                  'success'
                ).then((result) => {
                  if (result.isConfirmed) {
                    location.reload()
                  } 
                })
                
              }
            } else {
              ErrorSwal.fire(
                'Error!',
                'Something Error.',
                'error'
              )
            }
          })
        }else{
          RequestAPI.postRequest(Api.createEmployee, "", valuesObj, {}, async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            
            if (status === 200 || status === 201) {
              if (body.error && body.error.message) {
                ErrorSwal.fire(
                  'Error!',
                  (body.error && body.error.message) || "",
                  'error'
                )
              } else {
                let messageBody = ""
                if (body.data && body.data.username && body.data.password) {
                  messageBody = "Username: " + body.data.username + "<br>" + "Password: " + body.data.password
                }
                ErrorSwal.fire(
                  'Created Successfully!',
                  messageBody,
                  'success'
                ).then((result) => {
                  if (result.isConfirmed) {
                    location.reload()
                  } 
                })
                
              }
            } else {
              ErrorSwal.fire(
                'Error!',
                'Something Error.',
                'error'
              )
            }
          })
        }
        
      }}>
      {({ values, setFieldValue, handleSubmit, errors, touched }) => {
        return (
          <Form noValidate onSubmit={handleSubmit} id="_formid2" autoComplete="off">
            <div className="col-md-12 row p-0 m-0" >
                <div className="form-group col-md-12 pt-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                  <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                  <h5>Payroll Information</h5>
                </div>
              </div>
            <div className="row w-100 px-5">
              <div className="form-group col-md-6 mb-3 " >
                <label>Clothing Allowance</label>
                <input type="text"
                  name="clothingAllowance"
                  id="clothingAllowance"
                  className="form-control"
                  value={values.clothingAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Communication Allowance</label>
                <input type="text"
                  name="communicationAllowance"
                  id="communicationAllowance"
                  className="form-control"
                  value={values.communicationAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Discretionary Allowance</label>
                <input type="text"
                  name="discretionaryAllowance"
                  id="discretionaryAllowance"
                  className="form-control"
                  value={values.discretionaryAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Meal Allowance</label>
                <input type="text"
                  name="mealAllowance"
                  id="mealAllowance"
                  className="form-control"
                  value={values.mealAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Medical Allowance</label>
                <input type="text"
                  name="medicalAllowance"
                  id="medicalAllowance"
                  className="form-control"
                  value={values.medicalAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Productivity Allowance</label>
                <input type="text"
                  name="productivityAllowance"
                  id="productivityAllowance"
                  className="form-control"
                  value={values.productivityAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Conveyance Allowance</label>
                <input type="text"
                  name="conveyanceAllowance"
                  id="conveyanceAllowance"
                  className="form-control"
                  value={values.conveyanceAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>Other Allowance</label>
                <input type="text"
                  name="otherAllowance"
                  id="otherAllowance"
                  className="form-control"
                  value={values.otherAllowance}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
              <div className="form-group col-md-6 mb-3 " >
                <label>RDO</label>
                <input type="text"
                  name="rdo"
                  id="rdo"
                  className="form-control"
                  value={values.rdo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
              </div>
            </div>
            <br />
            <Modal.Footer>
              <div className="d-flex justify-content-end px-5">
                <button
                  type="button"
                  onClick={() => {
                    setTabIndex(3)
                  }}
                  className="btn btn-primary mx-2">
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary">
                  Save
                </button>
              </div>
            </Modal.Footer>


          </Form>
        )
      }}
    </Formik>
  )


  return (
    <div className="body">
      <div className="wraper">
        <div className="w-100">
          <div className="topHeader">
            <UserTopMenu />
          </div>
          <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh' }}>
            <DashboardMenu />
            <div className="col-md-12 col-lg-10 px-5 py-5">
              <div className="row">
                <div className="col-md-6">
                  <h2>Good day, HR Admin!</h2>
                </div>
                <div className="col-md-6" style={{ textAlign: 'right' }}>
                  <TimeDate />
                </div>
              </div>
              <div>
                <h3>Employee Management</h3>
                <div className="w-100">
                  <Table responsive="lg">
                    <thead>
                      <tr>
                        {
                          tableHeaders &&
                          tableHeaders.length &&
                          tableHeaders.map((item: any, index: any) => {
                            return (
                              <th style={{ width: 'auto' }}>{item}</th>
                            )
                          })
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        employeeList &&
                        employeeList.length &&
                        employeeList.map((item: any, index: any) => {
                          if (item.role == 'ADMIN'){
                            return null
                          }

                          return (
                            <tr>
                              <td> {item.username} </td>
                              <td> {item.role} </td>
                              <td> {item.failedLoginAttemps} </td>
                              <td>

                                <label
                                  onClick={() => {
                                    getEmployee(item.userId)
                                  }}
                                  className="text-muted cursor-pointer">
                                  Update
                                </label>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>

                </div>

              </div>

              <div className="d-flex justify-content-end mt-5" >
                <div>
                  <Button className="mx-2">Import</Button>
                  <Button
                    className="mx-2"
                    onClick={() => {
                      setModalShow(true)
                    }}>Add New</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create User Modal Form */}
        <Modal
          show={modalShow}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          keyboard={false}
          onHide={() => setModalShow(false)}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create New Employee
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 p-0 m-0" >
            <div className="emp-modal-body">
              
              {tabIndex == 1 ? information : null}
              {tabIndex == 2 ? emergencyContacts : null}
              {tabIndex == 3 ? otherInformation : null}
              {tabIndex == 4 ? payrollInformation : null}

            </div>
          </Modal.Body>

        </Modal>
        {/* End Create User Modal Form */}
      </div>

    </div>

  )
}
