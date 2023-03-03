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
import { useSelector, useDispatch } from "react-redux"


export const Employee = (props: any) => {
  const { history } = props
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);
  const formikRef: any = useRef();
  const [tabIndex, setTabIndex] = React.useState(1);
  const masterList = useSelector((state: any) => state.rootReducer.masterList)
  const [initialValues, setInitialValues] = useState<any>({
    roleId: 0,
    status: "ACTIVE",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    civilStatus: "",
    birthDay: "",
    contactNumber: "",
    emailAddress: "",
    emergencyContactNo: "",
    emergencyContactName: "",
    emergencyContactAddress: "",
    emergencyContactRelationship: "",
    prclicenseNo: "",
    passportNo: ""
  })

  const setFormField = (e: any, setFieldValue: any) => {
    const { name, value } = e.target
    if (setFieldValue) {
      setFieldValue(name, value)
      // console.log(initialValues)
      // if(isOther && name == 'cifNumber' && inRequest){
      //   const clientIndex = masterDataTransaction.clientsForOthers.findIndex((d: any) => d.cifNumber == value)
      //   if (clientIndex > -1) {
      //       setCifError("Invalid Account Name for provided CIF Number")
      //   }else{
      //     setCifError("")
      //   }
      // }
      // if (name == 'servicingUnitId') {
      //   getUnitAreaData(value)
      //   setFieldValue('unitAreaId', null)
      //   setFieldValue('rovingTellerId', null)
      // }
      // setFieldValue("formoutside", true)
      // if (formRef && formRef.current) {
      //   if (timeout) clearTimeout(timeout)
      //   timeout = setTimeout(() => autoSave(setFieldValue), 300)
      // }
    }
  }

  const tableHeaders = [
    'Employee Name',
    'Role',
    'Email Address',
    'Employment Type',
    'Employment Status',
    'Date Added',
    'Action',
  ]

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
            <div className="row w-100 px-5">
              <div className="form-group col-md-6 mb-3 " >
                <label>First name</label>
                <input type="text"
                  name="firstName"
                  id="firstName"
                  className="form-control"
                  value={values.firstName}
                  onChange={(e) => setFieldValue('firstName', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Last name</label>
                <input type="text"
                  name="lastName"
                  id="lastName"
                  value={values.lastName}
                  className="form-control"
                  onChange={(e) => setFieldValue('lastName', e.target.value)}
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
                  onChange={(e) => setFieldValue('middleName', e.target.value)}
                />
              </div>
              <div className="form-group col-md-3 mb-3" >
                <label>Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  id="gender"
                  value={values.gender}
                  onChange={(e) => setFieldValue('gender', e.target.value)}>
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
                  onChange={(e) => setFieldValue('civilStatus', e.target.value)}>
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
                  onChange={(e) => setFieldValue('birthDay', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Number</label>
                <input type="text"
                  name="contactNumber"
                  id="contactNumber"
                  className="form-control"
                  value={values.contactNumber}
                  onChange={(e) => setFieldValue('contactNumber', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Email Address</label>
                <input type="text"
                  name="emailAddress"
                  id="emailAddress"
                  className="form-control"
                  value={values.emailAddress}
                  onChange={(e) => setFieldValue('emailAddress', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>PRC License No</label>
                <input type="text"
                  name="prclicenseNo"
                  id="prclicenseNo"
                  className="form-control"
                  value={values.prclicenseNo}
                  onChange={(e) => setFieldValue('prclicenseNo', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Passport No</label>
                <input type="text"
                  name="passportNo"
                  id="passportNo"
                  className="form-control"
                  value={values.passportNo}
                  onChange={(e) => setFieldValue('passportNo', e.target.value)}
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
        
        RequestAPI.postRequest(Api.createEmployee, "", valuesObj, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          
            if (status === 200 || status === 201) {
              if (body.error && body.error.message){
                ErrorSwal.fire(
                  'Error!',
                  (body.error && body.error.message) || "",
                  'error'
                )
              }else{
                ErrorSwal.fire(
                  'Success!',
                  (body.data) || "",
                  'success'
                )
              }
            }else{
              ErrorSwal.fire(
                'Error!',
                'Something Error.',
                'error'
              )
            }
          })
      }}>
      {({ values, setFieldValue, handleSubmit, errors, touched }) => {
        return (
          <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
            <div className="row w-100 px-5">
              <div className="form-group col-md-6 mb-3 " >
                <label>Contact No.</label>
                <input type="text"
                  name="emergencyContactNo"
                  id="emergencyContactNo"
                  className="form-control"
                  value={values.emergencyContactNo}
                  onChange={(e) => setFieldValue('emergencyContactNo', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Name</label>
                <input type="text"
                  name="emergencyContactName"
                  id="emergencyContactName"
                  className="form-control"
                  value={values.emergencyContactName}
                  onChange={(e) => setFieldValue('emergencyContactName', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Address</label>
                <input type="text"
                  name="emergencyContactAddress"
                  id="emergencyContactAddress"
                  className="form-control"
                  value={values.emergencyContactAddress}
                  onChange={(e) => setFieldValue('emergencyContactAddress', e.target.value)}
                />
              </div>
              <div className="form-group col-md-6 mb-3" >
                <label>Contact Relationship</label>
                <select
                  className="form-select"
                  name="emergencyContactRelationship"
                  onChange={(e) => setFieldValue('emergencyContactRelationship', e.target.value)}
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
                  <TableComponent
                    tableHeaders={tableHeaders}
                  />
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
          <Modal.Body className="row w-100 px-5">
            <div className="col-md-12 row p-0 m-0">
              <div className="form-group col-md-6 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Information</h5>
              </div>
              <div className="form-group col-md-6 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Emergency Contact</h5>
              </div>
              {/* <div className="form-group col-md-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Employment</h5>
              </div>
              <div className="form-group col-md-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Compensation</h5>
              </div> */}
            </div>
            {tabIndex == 1
              ? information
              : tabIndex == 2
                ? emergencyContacts
                :
                null
            }

          </Modal.Body>

        </Modal>
        {/* End Create User Modal Form */}
      </div>

    </div>

  )
}
