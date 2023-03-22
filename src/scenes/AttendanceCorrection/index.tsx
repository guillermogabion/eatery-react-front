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
import { useDispatch, useSelector } from "react-redux"



export const AttendanceCorrection = (props: any) => {
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [attendanceBreakdown, setAttendanceBreakdown] = useState<any>([]);
  const [dayTypes, setDayTypes] = useState<any>([]);
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] =React.useState('all');
  const [allCOA, setAllCOA] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);


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
  const [initialValues, setInitialValues] = useState<any>({
    "type": "Biometric_Device_Malfunction",
    "reason": "",
    "coaBd": [
      {
        "date": "2023-03-21",
        "coaBdType": "TIME_IN",
        "time": ""
      }
    ]
  })
  const [showReason, setShowReason] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    getAllCOARequest(0, "")
  }, [])

  const getAllCOARequest = (page: any = 0, status: any = "All") => {
    let queryString = ""
    let filterDataTemp = { ...filterData }
    if(status != ""){
      queryString = "&status="+ status
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
    
    if (data.profile.role == 'ADMIN' || data.profile.role == 'APPROVER'){
      RequestAPI.getRequest(
        `${Api.getAllCOA}?size=10${queryString}&page=${page}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setAllCOA(body.data)
            }
          }
        }
      )
    }else{
      RequestAPI.getRequest(
        `${Api.allMyCOA}?size=10${queryString}&page=${page}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setAllCOA(body.data)
            }
          }
        }
      )
    }
  }

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  };

  


  const COATable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Type</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              allCOA &&
              allCOA.content &&
              allCOA.content.length &&
              allCOA.content.map((item: any, index: any) => {
                return (
                  <tr>
                    <td>{item.type}</td>
                    <td> {item.reason} </td>
                    <td> {item.status} </td>
                    <td>
                      {
                        item.status != "APPROVED" && item.status != "DECLINED" ?
                          <>
                          {authorizations.includes("Request:Update") ? (
                            <>
                                <label
                                onClick={() => {
                                  // getLeave(item.id)
                                }}
                                className="text-muted cursor-pointer">
                                Update
                              </label>
                              <br />
                            </>
                          ) : null}

                          {authorizations.includes("Request:Approve") ? (
                            <>
                              <label
                              onClick={() => {
                                // approveLeave(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Approve
                            </label> <br />
                            </>
                          ) : null}

                            {authorizations.includes("Request:Reject") ? (
                            <>
                            <label
                              onClick={() => {
                                // declineLeave(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Decline
                            </label>
                            <br />
                            </>
                          ) : null}
                          </>
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
      </div>
    )
  }, [allCOA])

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
                    getAllCOARequest(0, k)
                    setKey(k)
                  }}
                  className="mb-3"
                >
                  <Tab eventKey="all" title="All">
                    {COATable()}
                  </Tab>
                  <Tab eventKey="pending" title="Pending">
                    {COATable()}
                  </Tab>
                  <Tab eventKey="approved" title="Approved" >
                    {COATable()}
                  </Tab>
                  <Tab eventKey="reject/cancelled" title="Rejected/Cancelled">
                    {COATable()}
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
              const valuesObj: any = { ...values }

              valuesObj.coaBd = [
                {
                  date: values.date,
                  time: values.time,
                  coaBdType: values.coaBdType,
                },
              ]
              
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
                          <option value="others">Others</option>
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
                        <option disabled selected>Select Log Type</option>
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
