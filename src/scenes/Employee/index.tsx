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
import ReactPaginate from 'react-paginate';
import { async } from "validate.js"
import FileUpload from "./upload"

export const Employee = (props: any) => {
  const { history } = props
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);
  const [modalUploadShow, setModalUploadShow] = React.useState(false);
  const formikRef: any = useRef();
  const [tabIndex, setTabIndex] = React.useState(1);
  const masterList = useSelector((state: any) => state.rootReducer.masterList)
  const [squadList, setSquadList] = React.useState([]);
  const [employeeList, setEmployeeList] = React.useState([]);
  const [userId, setUserId] = React.useState("");
  const [filterData, setFilterData] = React.useState([]);

  const [initialValues, setInitialValues] = useState<any>({
    "roleId": 2,
    "status": "ACTIVE",
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "gender": "MALE",
    "civilStatus": "SINGLE",
    "birthDay": moment().format("YYYY-MM-DD"),
    "contactNumber": "",
    "emailAddress": "",
    "emergencyContactNo": "",
    "emergencyContactName": "",
    "emergencyContactAddress": "",
    "emergencyContactRelationship": "SPOUSE",
    "employeeId": "",
    "biometricsId": 0,
    "companyEmail": "",
    "employeeType": "RANK_AND_FILE",
    "jobTitle": "",
    "userLevel": "EMPLOYEE",
    "immediateSuperiorId": "",
    "employeeStatus": "Regular",
    "employmentStatusEffectivityDate": moment().format("YYYY-MM-DD"),
    "hireDate": moment().format("YYYY-MM-DD"),
    "bankAcctType": "SAVINGS",
    "bankAccountNumber": "",
    "tinNumber": "",
    "position": "",
    "regularizationDate": moment().format("YYYY-MM-DD"),
    "statusDate": moment().format("YYYY-MM-DD"),
    "department": "Delivery_Operations",
    "costCenter": "",
    "seperationDate": moment().format("YYYY-MM-DD"),
    "sssNumber": "",
    "philHealthId": "",
    "hdmfNumber": "",
    "squadId": 1,
    "otComputationTable": "",
    "minimumWageEarner": true,
    "totalWorkHrsPerDay": 0,
    "workDaysPerYear": 0,
    "consultantPercentTax": "Two",
    "clientName": "",
    "jobCode": "",
    "jobGrade": "One",
    "billability": true,
    "payrollRole": "SuperAdmin",
    "payGroup": "Monthly_Paid_Employees",
    "payrollRunType": "Daily",
    "basicMonthlySalary": 0,
    "salaryEffectivityDate": moment().format("YYYY-MM-DD"),
    "monthlyDeMinimisBenefits": 0,
    "ecola": 0,
    "clothingAllowance": 0,
    "communicationAllowance": 0,
    "discretionaryAllowance": 0,
    "mealAllowance": 0,
    "medicalAllowance": 0,
    "productivityAllowance": 0,
    "conveyanceAllowance": 0,
    "otherAllowance": 0,
    "rdo": "0",
    "prclicenseNo": 0,
    "passportNo": 0
  })


  const validationSchema = Yup.object().shape({

    // information 
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    middleName: Yup.string().required('Middle name is required'),
    gender: Yup.string().required('Gender is required'),
    civilStatus: Yup.string().required('Civil Status is required'),
    birthDay: Yup.date().required('Birth Date is required').typeError('Please enter a valid date'),
    contactNumber: Yup.number().required('Contact Number is required').typeError('Please enter a valid number'),
    emailAddress: Yup.string().required('Email Address is required').email('Invalid Email Address'),
    prclicenseNo: Yup.number().required('PRC License Number is required').typeError('Please enter a valid number'),
    passportNo: Yup.string().required('Passport Number is required'),

    
    // emergency 
    emergencyContactNo: Yup.number().required('Contact Number is required').typeError('Please enter a valid number'),
    emergencyContactName: Yup.string().required('Contact name is required'),
    emergencyContactAddress: Yup.string().required('Contact name is required'),

    // other information 
    employeeId: Yup.string().required('Employee ID is required'),
    biometricsId: Yup.string().required('Biometrics ID is required'),
    companyEmail: Yup.string().required('Company Email is required').email('Invalid Email Address'),
    jobTitle: Yup.string().required('Job Title is required'),
    immediateSuperiorId: Yup.string().required('Immediate Superior ID is required'),
    employmentStatusEffectivityDate: Yup.date().required('Date is required').typeError('Please enter a valid date'),
    hireDate: Yup.date().required('Date is required').typeError('Please enter a valid date'),
    bankAccountNumber: Yup.number().required('Bank Account Number is required').typeError('Please enter a valid number'),
    tinNumber: Yup.number().required('Bank Account Number is required').typeError('Please enter a valid number'),
    position: Yup.string().required('Position is required'),
    regularizationDate: Yup.date().required('Date is required').typeError('Please enter a valid date'),
    costCenter: Yup.string().required('Cost Center is required'),
    seperationDate: Yup.date().required('Date is required').typeError('Please enter a valid date'),
    sssNumber: Yup.number().required('SSS Number is required').typeError('Please enter a valid number'),
    philHealthId: Yup.number().required('PhilHealth ID is required').typeError('Please enter a valid number'),
    hdmfNumber: Yup.number().required('HDMF Number is required').typeError('Please enter a valid number'),
    otComputationTable: Yup.string().required('OT Computation Table is required'),
    minimumWageEarner: Yup.string().required('Minimum Wage Earner is required'),
    totalWorkHrsPerDay: Yup.string().required('Total Works Hours per Day is required'),
    workDaysPerYear: Yup.string().required('Work Days Per Year is required'),
    clientName: Yup.string().required('Client Name is required'),
    jobCode: Yup.string().required('Job Code is required'),
    billability: Yup.string().required('Billability is required'),
    payGroup: Yup.string().required('Pay Group is required'),
    payrollRunType: Yup.string().required('Payroll Run Type is required'),
    basicMonthlySalary: Yup.string().required('Basic Monthly Salary is required'),
    salaryEffectivityDate: Yup.string().required('Salary Effectivity Date is required'),
    monthlyDeMinimisBenefits: Yup.string().required('Monthly De Minimis Benefits is required'),
    ecola: Yup.string().required('Ecola is required'),





    
    
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
    getAllEmployee(0)
  }, [])

  const handlePageClick = (event: any) => {
    getAllEmployee(event.selected)
  };

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }
  

  const getAllEmployee = (pageNo: any, employeeId? : any) => {
    let queryString = ""
    let filterDataTemp = { ...filterData }
    if(employeeId){
      queryString = "&employeeId" + employeeId
    }else{
      if (filterDataTemp) {
        Object.keys(filterDataTemp).forEach((d: any) => {
          if (filterDataTemp[d]) {
            
            queryString += `&${d}=${filterDataTemp[d]}`
          } else {
            queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
          }
        })
      }
    }
    
    RequestAPI.getRequest(
      `${Api.allEmployee}?size=10&page=${pageNo}${queryString}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.data.content) {
            setEmployeeList(body.data)
          }
        } else {

        }
      }
    )
  }

  const uploadExcel = async(file: any) => {
    const formData = new FormData()
  }

  
  const setFormField = (e: any, setFieldValue: any) => {
    const { name, value } = e.target
    if (setFieldValue) {
      setFieldValue(name, value)
    }
  }

  const tableHeaders = [
    'Employee ID',
    'Employee Type',
    'Employee Status',
    'Full Name',
    'Hired Date',
    'Account Status',
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

  const unlockEmployee = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Notification',
      text: "Confirm Unlock?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.UNLOCK_EMPLOYEE, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || "",
                'error'
              )
            } else {
              getAllEmployee(0)
              ErrorSwal.fire(
                'Success!',
                (body.data) || "",
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
        })
      }
    })
  }

  const handleCloseModal = () => {
    setModalUploadShow(false);
  };

  const information = (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={
        Yup.object().shape({
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          gender: Yup.string().required("Required"),
          civilStatus: Yup.string().required("Required"),
          birthDay: Yup.string().required("Required"),
          contactNumber: Yup.string().required("Required"),
          emailAddress: Yup.string().required("Required"),
          prclicenseNo: Yup.string().required("Required"),
          passportNo: Yup.string().required("Required"),
        })
      }
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
                  className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                  value={values.firstName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.firstName && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Last name</label>
                <input type="text"
                  name="lastName"
                  id="lastName"
                  value={values.lastName}
                  className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.lastName && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.lastName}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Middle name</label>
                <input
                  type="text"
                  name="middleName"
                  id="middleName"
                  className={`form-control ${touched.middleName && errors.middleName ? 'is-invalid' : ''}`}
                  value={values.middleName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                 {errors.middleName && <div className="error-text">{String(errors.middleName)}</div>}

              </div>
              <div className="form-group col-md-3 mb-3" >
                <label>Gender</label>
                <select
                  className={`form-select ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
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
                {errors && errors.gender && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.gender}</p>
                )}
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
                {errors && errors.civilStatus && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.civilStatus}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Date of Birth</label>
                <input type="date"
                  name="birthDay"
                  id="birthDay"
                  className={`form-control ${touched.birthDay && errors.birthDay ? 'is-invalid' : ''}`}
                  value={values.birthDay}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.birthDay && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.birthDay}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Number</label>
                <input type="text"
                  name="contactNumber"
                  id="contactNumber"
                  className={`form-control ${touched.contactNumber && errors.contactNumber ? 'is-invalid' : ''}`}
                  value={values.contactNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.contactNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.contactNumber}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Email Address</label>
                <input type="text"
                  name="emailAddress"
                  id="emailAddress"
                  className={`form-control ${touched.emailAddress && errors.emailAddress ? 'is-invalid' : ''}`}
                  value={values.emailAddress}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.emailAddress && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.emailAddress}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>PRC License No</label>
                <input type="text"
                  name="prclicenseNo"
                  id="prclicenseNo"
                  className={`form-control ${touched.prclicenseNo && errors.prclicenseNo ? 'is-invalid' : ''}`}
                  value={values.prclicenseNo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.prclicenseNo && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.prclicenseNo}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Passport No</label>
                <input type="text"
                  name="passportNo"
                  id="passportNo"
                  className={`form-control ${touched.passportNo && errors.passportNo ? 'is-invalid' : ''}`}
                  value={values.passportNo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.passportNo && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.passportNo}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>User Role</label>
                <select
                  className="form-select"
                  name="roleId"
                  id="roleId"
                  value={values.roleId}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  <option key={1} value={1}>Admin</option>
                  <option key={2} value={2}>Employee</option>
                  <option key={3} value={3}>Approver</option>
                </select>
                {errors && errors.roleId && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.roleId}</p>
                )}
              </div>
            </div>
            <br />
            <Modal.Footer>
              <div className="d-flex justify-content-end px-5">
                <Button
                  type="submit"
                  className="btn btn-primary">
                  Next
                </Button>
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
      validationSchema={ Yup.object().shape({
        emergencyContactNo: Yup.string().required("Required"),
        emergencyContactName: Yup.string().required("Required"),
        emergencyContactAddress: Yup.string().required("Required"),
        emergencyContactRelationship: Yup.string().required("Required"),
      })}
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
                  className={`form-control ${touched.emergencyContactNo && errors.emergencyContactNo ? 'is-invalid' : ''}`}
                  value={values.emergencyContactNo}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.emergencyContactNo && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.emergencyContactNo}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Name</label>
                <input type="text"
                  name="emergencyContactName"
                  id="emergencyContactName"
                  className={`form-control ${touched.emergencyContactName && errors.emergencyContactName ? 'is-invalid' : ''}`}
                  value={values.emergencyContactName}
                  onChange={(e) => setFormField(e, setFieldValue)}

                />
                {errors && errors.emergencyContactName && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.emergencyContactName}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Address</label>
                <input type="text"
                  name="emergencyContactAddress"
                  id="emergencyContactAddress"
                  className={`form-control ${touched.emergencyContactAddress && errors.emergencyContactAddress ? 'is-invalid' : ''}`}
                  value={values.emergencyContactAddress}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.emergencyContactAddress && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.emergencyContactAddress}</p>
                )}
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
                {errors && errors.emergencyContactRelationship && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.emergencyContactRelationship}</p>
                )}
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
      validationSchema={
        Yup.object().shape({
          employeeId: Yup.string().required("Required"),
          biometricsId: Yup.string().required("Required"),
          companyEmail: Yup.string().required("Required"),
          employeeType: Yup.string().required("Required"),
          jobTitle: Yup.string().required("Required"),
          userLevel: Yup.string().required("Required"),
          immediateSuperiorId: Yup.string().required("Required"),
          employeeStatus: Yup.string().required("Required"),
          employmentStatusEffectivityDate: Yup.string().required("Required"),
          hireDate: Yup.string().required("Required"),
          bankAcctType: Yup.string().required("Required"),
          bankAccountNumber: Yup.string().required("Required"),
          tinNumber: Yup.string().required("Required"),
          position: Yup.string().required("Required"),
          regularizationDate: Yup.string().required("Required"),
          statusDate: Yup.string().required("Required"),
          department: Yup.string().required("Required"),
          costCenter: Yup.string().required("Required"),
          seperationDate: Yup.string().required("Required"),
          sssNumber: Yup.string().required("Required"),
          philHealthId: Yup.string().required("Required"),
          hdmfNumber: Yup.string().required("Required"),
          squadId: Yup.string().required("Required"),
          otComputationTable: Yup.string().required("Required"),
          minimumWageEarner: Yup.string().required("Required"),
          totalWorkHrsPerDay: Yup.string().required("Required"),
          workDaysPerYear: Yup.string().required("Required"),
          consultantPercentTax: Yup.string().required("Required"),
          clientName: Yup.string().required("Required"),
          jobCode: Yup.string().required("Required"),
          jobGrade: Yup.string().required("Required"),
          billability: Yup.string().required("Required"),
          payrollRole: Yup.string().required("Required"),
          payGroup: Yup.string().required("Required"),
          payrollRunType: Yup.string().required("Required"),
          basicMonthlySalary: Yup.string().required("Required"),
          salaryEffectivityDate: Yup.string().required("Required"),
          monthlyDeMinimisBenefits: Yup.string().required("Required"),
          ecola: Yup.string().required("Required"),
        })
      }
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
                  className={`form-control ${touched.employeeId && errors.employeeId ? 'is-invalid' : ''}`}
                  value={values.employeeId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.employeeId && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.employeeId}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Biometrics ID</label>
                <input type="text"
                  name="biometricsId"
                  id="biometricsId"
                  className={`form-control ${touched.biometricsId && errors.biometricsId ? 'is-invalid' : ''}`}
                  value={values.biometricsId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.biometricsId && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.biometricsId}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Company Email</label>
                <input type="text"
                  name="companyEmail"
                  id="companyEmail"
                  className={`form-control ${touched.companyEmail && errors.companyEmail ? 'is-invalid' : ''}`}
                  value={values.companyEmail}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.companyEmail && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.companyEmail}</p>
                )}
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
                {errors && errors.employeeType && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.employeeType}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Job Title</label>
                <input type="text"
                  name="jobTitle"
                  id="jobTitle"
                  className={`form-control ${touched.jobTitle && errors.jobTitle ? 'is-invalid' : ''}`}
                  value={values.jobTitle}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.jobTitle && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.jobTitle}</p>
                )}
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
                {errors && errors.userLevel && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.userLevel}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Immediate Superior ID</label>
                <input type="text"
                  name="immediateSuperiorId"
                  id="immediateSuperiorId"
                  className={`form-control ${touched.immediateSuperiorId && errors.immediateSuperiorId ? 'is-invalid' : ''}`}
                  value={values.immediateSuperiorId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.immediateSuperiorId && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.immediateSuperiorId}</p>
                )}
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
                {errors && errors.employeeStatus && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.employeeStatus}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Effectivity Date</label>
                <input type="date"
                  name="employmentStatusEffectivityDate"
                  id="employmentStatusEffectivityDate"
                  className={`form-control ${touched.employmentStatusEffectivityDate && errors.employmentStatusEffectivityDate ? 'is-invalid' : ''}`}
                  value={values.employmentStatusEffectivityDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.employmentStatusEffectivityDate && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.employmentStatusEffectivityDate}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Hire Date</label>
                <input type="date"
                  name="hireDate"
                  id="hireDate"
                  className={`form-control ${touched.hireDate && errors.hireDate ? 'is-invalid' : ''}`}
                  value={values.hireDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.hireDate && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.hireDate}</p>
                )}
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
                {errors && errors.bankAcctType && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.bankAcctType}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Bank Account Number</label>
                <input type="text"
                  name="bankAccountNumber"
                  id="bankAccountNumber"
                  className={`form-control ${touched.bankAccountNumber && errors.bankAccountNumber ? 'is-invalid' : ''}`}
                  value={values.bankAccountNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.bankAccountNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.bankAccountNumber}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Tin Number</label>
                <input type="text"
                  name="tinNumber"
                  id="tinNumber"
                  className={`form-control ${touched.tinNumber && errors.tinNumber ? 'is-invalid' : ''}`}
                  value={values.tinNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.tinNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.tinNumber}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Position</label>
                <input type="text"
                  name="position"
                  id="position"
                  className={`form-control ${touched.position && errors.position ? 'is-invalid' : ''}`}
                  value={values.position}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.position && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.position}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Regularization Date</label>
                <input type="date"
                  name="regularizationDate"
                  id="regularizationDate"
                  className={`form-control ${touched.regularizationDate && errors.regularizationDate ? 'is-invalid' : ''}`}
                  value={values.regularizationDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.regularizationDate && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.regularizationDate}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Status Date</label>
                <input type="date"
                  name="statusDate"
                  id="statusDate"
                  className={`form-control ${touched.statusDate && errors.statusDate ? 'is-invalid' : ''}`}
                  value={values.statusDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.statusDate && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.statusDate}</p>
                )}
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
                {errors && errors.department && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.department}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Cost Center</label>
                <input type="text"
                  name="costCenter"
                  id="costCenter"
                  className={`form-control ${touched.costCenter && errors.costCenter ? 'is-invalid' : ''}`}
                  value={values.costCenter}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.costCenter && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.costCenter}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Separation Date</label>
                <input type="date"
                  name="seperationDate"
                  id="seperationDate"
                  className={`form-control ${touched.seperationDate && errors.seperationDate ? 'is-invalid' : ''}`}
                  value={values.seperationDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.seperationDate && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.seperationDate}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>SSS Number</label>
                <input type="text"
                  name="sssNumber"
                  id="sssNumber"
                  className={`form-control ${touched.sssNumber && errors.sssNumber ? 'is-invalid' : ''}`}
                  value={values.sssNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.sssNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.sssNumber}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Philhealth ID</label>
                <input type="text"
                  name="philHealthId"
                  id="philHealthId"
                  className={`form-control ${touched.philHealthId && errors.philHealthId ? 'is-invalid' : ''}`}
                  value={values.philHealthId}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.philHealthId && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.philHealthId}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Hdmf Number</label>
                <input type="text"
                  name="hdmfNumber"
                  id="hdmfNumber"
                  className={`form-control ${touched.hdmfNumber && errors.hdmfNumber ? 'is-invalid' : ''}`}
                  value={values.hdmfNumber}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.hdmfNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.hdmfNumber}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Squad</label>
                <select
                  className="form-select"
                  name="squadId"
                  id="squadId"
                  value={values.squadId}
                  onChange={(e) => setFormField(e, setFieldValue)}>
                  {squadList &&
                    squadList.length &&
                    squadList.map((_data: any, index: string) => {
                      return (
                        <option key={_data.name} value={_data.id}>
                          {_data.name}
                        </option>
                      )
                      
                    })
                  }
                </select>
                {errors && errors.squadId && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.squadId}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>OT Computation Table</label>
                <input type="text"
                  name="otComputationTable"
                  id="otComputationTable"
                  className={`form-control ${touched.otComputationTable && errors.otComputationTable ? 'is-invalid' : ''}`}
                  value={values.otComputationTable}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.otComputationTable && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.otComputationTable}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Minimum Wage Earner</label>
                <input type="text"
                  name="minimumWageEarner"
                  id="minimumWageEarner"
                  className={`form-control ${touched.minimumWageEarner && errors.minimumWageEarner ? 'is-invalid' : ''}`}
                  value={values.minimumWageEarner}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.minimumWageEarner && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.minimumWageEarner}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Total Work Hours per Day</label>
                <input type="text"
                  name="totalWorkHrsPerDay"
                  id="totalWorkHrsPerDay"
                  className={`form-control ${touched.totalWorkHrsPerDay && errors.totalWorkHrsPerDay ? 'is-invalid' : ''}`}
                  value={values.totalWorkHrsPerDay}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.totalWorkHrsPerDay && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.totalWorkHrsPerDay}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Work Days Per Year</label>
                <input type="text"
                  name="workDaysPerYear"
                  id="workDaysPerYear"
                  className={`form-control ${touched.workDaysPerYear && errors.workDaysPerYear ? 'is-invalid' : ''}`}
                  value={values.workDaysPerYear}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.workDaysPerYear && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.workDaysPerYear}</p>
                )}
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
                {errors && errors.consultantPercentTax && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.consultantPercentTax}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Client Name</label>
                <input type="text"
                  name="clientName"
                  id="clientName"
                  className={`form-control ${touched.clientName && errors.clientName ? 'is-invalid' : ''}`}
                  value={values.clientName}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.clientName && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.clientName}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Job Code</label>
                <input type="text"
                  name="jobCode"
                  id="jobCode"
                  className={`form-control ${touched.jobCode && errors.jobCode ? 'is-invalid' : ''}`}
                  value={values.jobCode}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.jobCode && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.jobCode}</p>
                )}
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
                {errors && errors.jobGrade && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.jobGrade}</p>
                )}
              </div><div className="form-group col-md-6 mb-3" >
                <label>Billability</label>
                <input type="text"
                  name="billability"
                  id="billability"
                  className={`form-control ${touched.billability && errors.billability ? 'is-invalid' : ''}`}
                  value={values.billability}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.billability && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.billability}</p>
                )}
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
                {errors && errors.payrollRole && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.payrollRole}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Pay Group</label>
                <input type="text"
                  name="payGroup"
                  id="payGroup"
                  className={`form-control ${touched.payGroup && errors.payGroup ? 'is-invalid' : ''}`}
                  value={values.payGroup}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.payGroup && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.payGroup}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Payroll Run Type</label>
                <input type="text"
                  name="payrollRunType"
                  id="payrollRunType"
                  className={`form-control ${touched.payrollRunType && errors.payrollRunType ? 'is-invalid' : ''}`}
                  value={values.payrollRunType}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.payrollRunType && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.payrollRunType}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Basic Monthly Salary</label>
                <input type="text"
                  name="basicMonthlySalary"
                  id="basicMonthlySalary"
                  className={`form-control ${touched.basicMonthlySalary && errors.basicMonthlySalary ? 'is-invalid' : ''}`}
                  value={values.basicMonthlySalary}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.basicMonthlySalary && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.basicMonthlySalary}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Salary Effectivity Date</label>
                <input type="date"
                  name="salaryEffectivityDate"
                  id="salaryEffectivityDate"
                  className={`form-control ${touched.salaryEffectivityDate && errors.salaryEffectivityDate ? 'is-invalid' : ''}`}
                  value={values.salaryEffectivityDate}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.salaryEffectivityDate && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.salaryEffectivityDate}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Monthly De Mininmis Benefits</label>
                <input type="text"
                  name="monthlyDeMinimisBenefits"
                  id="monthlyDeMinimisBenefits"
                  className={`form-control ${touched.monthlyDeMinimisBenefits && errors.monthlyDeMinimisBenefits ? 'is-invalid' : ''}`}
                  value={values.monthlyDeMinimisBenefits}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.monthlyDeMinimisBenefits && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.monthlyDeMinimisBenefits}</p>
                )}
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Ecola</label>
                <input type="text"
                  name="ecola"
                  id="ecola"
                  className={`form-control ${touched.ecola && errors.ecola ? 'is-invalid' : ''}`}
                  value={values.ecola}
                  onChange={(e) => setFormField(e, setFieldValue)}
                />
                {errors && errors.ecola && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.ecola}</p>
                )}
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
      validationSchema={
        Yup.object().shape({
          clothingAllowance: Yup.string().required("Required"),
          communicationAllowance: Yup.string().required("Required"),
          discretionaryAllowance: Yup.string().required("Required"),
          mealAllowance: Yup.string().required("Required"),
          medicalAllowance: Yup.string().required("Required"),
          productivityAllowance: Yup.string().required("Required"),
          conveyanceAllowance: Yup.string().required("Required"),
          otherAllowance: Yup.string().required("Required"),
          rdo: Yup.string().required("Required"),
        })
      }
      onSubmit={(values, actions) => {
        const valuesObj: any = { ...values }
        if (userId) {
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
        } else {
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
                {errors && errors.clothingAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.clothingAllowance}</p>
                )}
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
                {errors && errors.communicationAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.communicationAllowance}</p>
                )}
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
                {errors && errors.discretionaryAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.discretionaryAllowance}</p>
                )}
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
                {errors && errors.mealAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.mealAllowance}</p>
                )}
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
                {errors && errors.medicalAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.medicalAllowance}</p>
                )}
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
                {errors && errors.productivityAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.productivityAllowance}</p>
                )}
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
                {errors && errors.conveyanceAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.conveyanceAllowance}</p>
                )}
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
                {errors && errors.otherAllowance && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.otherAllowance}</p>
                )}
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
                {errors && errors.rdo && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.rdo}</p>
                )}
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
                <div className="w-100">

                <div className="fieldtext d-flex col-md-6">
                <div className="input-container">
                    <input
                      name="employeeId"
                      placeholder="Employee ID"
                      type="text"
                      autoComplete="off"
                      className="formControl"
                      maxLength={40}
                      onChange={(e) => makeFilterData(e)}
                      onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                    />
                    </div>
                    <div className="input-container">

                    <input
                      name="firstname"
                      placeholder="First name"
                      type="text"
                      autoComplete="off"
                      className="formControl"
                      maxLength={40}
                      onChange={(e) => makeFilterData(e)}
                      onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                    />
                     </div>
                    <div className="input-container">

                    <input
                      name="lastname"
                      placeholder="Last name"
                      type="text"
                      autoComplete="off"
                      className="formControl"
                      maxLength={40}
                      onChange={(e) => makeFilterData(e)}
                      onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                    />
                    </div>
                    <Button
                        style={{ width: 210}}
                        onClick={() => getAllEmployee(0,"")}
                        className="btn btn-primary mx-2">
                        Search
                      </Button>
                  </div>
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
                        employeeList.content &&
                        employeeList.content.length > 0 &&
                        employeeList.content.map((item: any, index: any) => {
                          
                          return (
                            <tr>
                              <td> {item.employeeId} </td>
                              <td> {item.empType} </td>
                              <td> {item.empStatus} </td>
                              <td> {item.fullname} </td>
                              <td> {item.hireDate} </td>
                              <td> {item.acctStatus} </td>
                              <td>
                                <label
                                  onClick={() => {
                                    getEmployee(item.id)
                                  }}
                                  className="text-muted cursor-pointer">
                                  Update
                                </label>
                                {
                                  item.acctStatus == 'LOCKED' ?
                                    <div>
                                      <label onClick={() => unlockEmployee(item.id)}>Unlock</label>
                                    </div>

                                    :
                                    null
                                }

                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  {
                        employeeList &&
                        employeeList.content &&
                        employeeList.content.length == 0 ?
                        <div className="w-100 text-center">
                          <label htmlFor="">No Records Found</label>
                        </div>
                        : 
                        null
                  }
                </div>
              </div>
              <div className="d-flex justify-content-end">
                  <div className="">
                    <ReactPaginate
                      className="d-flex justify-content-center align-items-center"
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={(employeeList && employeeList.totalPages) || 0}
                      previousLabel="<"
                      previousLinkClassName="prev-next-pagination"
                      nextLinkClassName="prev-next-pagination"
                      activeClassName="active-page-link"
                      pageLinkClassName="page-link"
                      renderOnZeroPageCount={null}
                    />
                  </div>
                </div>
              <div className="d-flex justify-content-end mt-3" >
                <div>
                  <Button className="mx-2"
                  onClick={() => {
                    setModalUploadShow(true)
                  }}
                  >Import</Button>
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
              {/* Create New Employee */}
              {userId ? 'Update Employee' : 'Create New Employee'}
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
        {/* start of upload modal  */}

        <Modal
        show={modalUploadShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setModalUploadShow(false)}
        dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Upload Excel File
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-center">
            <div>
              <FileUpload onCloseModal={handleCloseModal} />
            </div>

          </Modal.Body>

        </Modal>
      </div>

    </div>

  )
}
