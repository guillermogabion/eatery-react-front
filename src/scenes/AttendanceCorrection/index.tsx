import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Form, Image, Modal, Table } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Formik } from "formik"
import { async } from "validate.js"



export const AttendanceCorrection = (props: any) => {
  const [attendanceBreakdown, setAttendanceBreakdown] = useState<any>([]);
  const [dayTypes, setDayTypes] = useState<any>([]);
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] =React.useState('all');
  const formRef: any = useRef()
  const tableHeaders = [
    'Date Filed',
    'Type',
    'Time In',
    'Time Out',
    'Reason',
    'status',
    'Action',
  ]
  let initialPayload ={
    "type": "Biometric_Device_Malfunction",
    "reason": "",
    "coaBd": [
      {
        "date": "2023-03-21",
        "coaBdType": "TIME_IN",
        "time": {
          "hour": 0,
          "minute": 0,
          "second": 0,
          "nano": 0
        }
       
      }
    ]
  }
  const [initialValues, setInitialValues] = useState<any>(initialPayload)
  const [showReason, setShowReason] = useState(false);
  const [value, setValue] = useState('');




  
  const setDateOption = (index: any, value: any, dayType: any = null) => {

    if (attendanceBreakdown) {
      const valuesObj: any = { ...attendanceBreakdown }

      if (valuesObj) {
        valuesObj[index].credit = value
        valuesObj[index].dayType = dayType
      }

      const valuesObjDayType: any = { ...dayTypes }
      if (valuesObjDayType) {
        if (value == .5) {
          valuesObjDayType[index] = true
        }
        else {
          valuesObjDayType[index] = false
        }
        setDayTypes(valuesObjDayType)
      }
    }
  }
  const setFormField = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);

    if (name === "type") {
      setShowReason(value === "others"); // set showReason state based on whether "Others" is selected
    }
  };
 

  // const dateBreakdown = (date: any) => {
  //   const momentDate = moment(date);
  //   let dayTypesArray = []
  //   let attendancesBreakdown = []
  
  //   if (momentDate.isValid()) {
  //     let dateCounter = 0;
  //     let new_date = momentDate;
  
  //     while (new_date.month() === momentDate.month()) {
  //       if (new_date.day() !== 0 && new_date.day() !== 6) {
  //         attendancesBreakdown.push({
  //           "date": new_date.format('YYYY-MM-DD'),
  //           "credit": 1,
  //           "dayType": 'WHOLEDAY'
  //         });
  //         dayTypesArray.push(false);
  //       }
  //       dateCounter += 1;
  //       new_date = momentDate.clone().add(dateCounter, 'days');
  //     }
  //   }
  
  //   return { dayTypesArray, attendancesBreakdown };
  // };
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }
  
  
  
  
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
                  <h2>Good day, Employee 001!</h2>
                </div>
                <div className="col-md-6" style={{ textAlign: 'right' }}>
                  <TimeDate />
                </div>
              </div>
              <div>
                <h3>Certificate Of Attendance</h3>
                <div className="w-100 pt-4">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k: any) => {
                    setKey(k)
                  }}
                  className="mb-3"
                >
                  <Tab eventKey="all" title="All">
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                  <Tab eventKey="pending" title="Pending">
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                  <Tab eventKey="approved" title="Approved" >
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                  <Tab eventKey="reject/cancelled" title="Rejected/Cancelled">
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                </Tabs>
                  
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3" >
                <div>
                  <Button
                    className="mx-2"
                    onClick={() => {
                      setModalShow(true)
                    }}>Request for COA</Button>
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
              Create Correction of Attendance
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 px-5">
            <Formik
             innerRef={formRef}
             enableReinitialize={true}
             initialValues={initialValues}
             validationSchema={null}
             onSubmit={(values, actions) => {
             
              const timeArr = values.time.split(":").map(Number);
              const timeObj = {
                hour: timeArr[0],
                minute: timeArr[1],
                second: timeArr[2] || 0,
                nano: 0,
              };
              values.coaBd = [
                {
                  date: values.date,
                  time: timeObj,
                  coaBdType: values.coaBdType,
                },
              ];
              // setFieldValue("coaBd", values.coaBd);
              const valuesObj: any = {values}

              RequestAPI.postRequest(Api.CreateCOA, "", valuesObj, {}, async (res:any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                  if(body.error && body.error.message) {
                    ErrorSwal.fire(
                      'Error!',
                      (body.error && body.error.message) || "",
                      'error'
                    )

                  } else {
                    ErrorSwal.fire(
                      'Success!',
                      (body.data) || "",
                      'success'
                    )
                  }
                
                }
              })
            }}
            >
                 {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                  return (
                    <Form
                    noValidate
                    onSubmit={handleSubmit}
                    id="_formid"
                    autoComplete="off"
                    >
                       <div>
                        <select
                          className="form-select"
                          name="type"
                          id="type"
                          onChange={(e) => {
                            setFieldValue('type', e.target.value);
                            setShowReason(e.target.value === 'others');
                          }}
                        > 
                          <option value="Biometric_Device_Malfunction">Biometric Device Malfunction</option>
                          <option value="Power_Outage">Power Outage</option>
                          <option value="Others">Others</option>
                        </select>

                        {showReason && (
                          <div className="form-group col-md-12 mb-3">
                            <label>Reason</label>
                            <textarea
                              name="reason"
                              id="reason"
                              className="form-control"
                              style={{ height: "200px" }}
                              onChange={(e) => {
                                setFieldValue("reason", e.target.value);
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="form-group col-md-6 mb-3">
                        <div  >
                          <label>Date</label>
                            <input type="date"
                                name="date"
                                id="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("date", e.target.value)
                                }}
                            />
                        </div>
                        <div>
                          <label>Time</label>
                            <input type="time"
                                name="time"
                                id="time"
                                step="1"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("time", e.target.value);
                                }}
                               
                            />
                        </div>
                          
                      </div>
                      <div  >
                         
                      </div>
                      <select
                        className="form-select"
                        name="coaBdType"
                        id="coaBdType"
                        onChange={(e) => {
                          setFieldValue('coaBdType', e.target.value);
                        }}
                      >
                        <option value="">Select Log Type</option>
                        <option value="TIME_IN">Time In</option>
                        <option value="TIME_OUT">Time Out</option>
                      </select>
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

                 }
                 }
                
             

            </Formik>
          </Modal.Body>
         
        </Modal>
        {/* End Create User Modal Form */}
      </div>

    </div>

  )
}
