import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Form, Modal } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { Formik } from "formik";
import * as Yup from "yup";


export const Overtime = (props: any) => {
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [leaveDayTypes, setLeaveDayTypes] = useState<any>([]);
  const [dateFrom, setDateFrom] = useState<any>(moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState<any>(moment().format("YYYY-MM-DD"));
  const [leaveBreakdown, setLeaveBreakdown] = useState<any>([]);
  const [allLeaves, setAllLeaves] = useState<any>([]);
  const [dayTypes, setDayTypes] = useState<any>([]);
  const [leaveId, setLeaveId] = useState<any>("");
  const [initialValues, setInitialValues] = useState<any>({
    "shiftDate": "",
    "classification": "",
    "otStart": "",
    "otEnd": ""
  })
  const formRef: any = useRef()

  const tableHeaders = [
    'Type',
    'Date Filed',
    'Date From - To',
    'No. of Days',
    'Reason',
    'Remarks',
    'Action',
  ]

  const approveLeave = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this leave.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.approveLeave, "", { "id": id }, {}, async (res: any) => {
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

  const declineLeave = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this leave.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.declineLeave, "", { "id": id }, {}, async (res: any) => {
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

  const leaveTable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Type</th>
              <th style={{ width: 'auto' }}>Date From</th>
              <th style={{ width: 'auto' }}>Date To</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              allLeaves &&
              allLeaves.content &&
              allLeaves.content.length &&
              allLeaves.content.map((item: any, index: any) => {
                return (
                  <tr>
                    <td> {item.type} </td>
                    <td> {item.dateFrom} </td>
                    <td> {item.dateTo} </td>
                    <td> {item.reason} </td>
                    <td> {item.status} </td>
                    <td>
                      {
                        item.status != "APPROVED" && item.status != "DECLINED" ?
                          <>
                            <label
                              onClick={() => {
                                approveLeave(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Approve
                            </label> <br />
                            <label
                              onClick={() => {
                                declineLeave(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Decline
                            </label>
                            <br />
                          </>
                          :
                          null
                      }
                      
                      <label
                        onClick={() => {
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
    )
  }, [allLeaves])

  const setFormField = (e: any, setFieldValue: any) => {
      if (setFieldValue) {
          const { name , value } = e.target
          setFieldValue(name, value)
          setFieldValue("formoutside", true)
      }
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
                <h3>OTs & UTs</h3>
                <div className="row p-0 m-0 pt-2">
                  <div className="col-md-3">
                    <h5>Monthly Total OTs:</h5>
                    <h5>Monthly Total UTs:</h5>
                  </div>
                  <div className="col-md-3">
                    <h5>200 mins</h5>
                    <h5>150 mins</h5>
                  </div>
                  
                </div>
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
                      {leaveTable()}
                    </Tab>
                    <Tab eventKey="pending" title="Pending">
                      {leaveTable()}
                    </Tab>
                    <Tab eventKey="approved" title="Approved" >
                      {leaveTable()}
                    </Tab>
                    <Tab eventKey="declined" title="Rejected/Cancelled">
                      {leaveTable()}
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
                    }}>Request Overtime/Undertime</Button>
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
              Request Overtime/Undertime
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 px-5">
            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={null}
              onSubmit={(values, actions) => {
                const valuesObj: any = { ...values }
                if ( leaveId ){
                  
                  RequestAPI.putRequest(Api.requestLeaveUpdate, "", valuesObj, {}, async (res: any) => {
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
                          'Success!',
                          (body.data) || "",
                          'success'
                        )
                        setLeaveBreakdown([])
                        setModalShow(false)
                        formRef.current?.resetForm()
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
                  RequestAPI.postRequest(Api.requestLeaveCreate, "", valuesObj, {}, async (res: any) => {
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
                          'Success!',
                          (body.data) || "",
                          'success'
                        )
                        setLeaveBreakdown([])
                        setModalShow(false)
                        formRef.current?.resetForm()
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
                  <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                    <div className="row w-100 px-5">
                      <div className="form-group col-md-6 mb-3 " >
                        <label>OT Classification</label>
                        <select
                          className="form-select"
                          name="classification"
                          id="classification"
                          value={values.classification}
                          onChange={(e) => setFormField(e, setFieldValue)}>
                          {leaveTypes &&
                            leaveTypes.length &&
                            leaveTypes.map((item: any, index: string) => (
                              <option key={`${index}_${item.id}`} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>Shift Date</label>
                        <input type="date"
                          name="shiftDate"
                          id="shiftDate"
                          className="form-control"
                          value={values.shiftDate}
                          onChange={(e) => {
                            setFormField(e, setFieldValue)
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>Start</label>
                        <input type="time"
                          name="otStart"
                          id="otStart"
                          className="form-control"
                          value={values.otStart}
                          onChange={(e) => {
                            setFormField(e, setFieldValue)
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>End</label>
                        <input type="time"
                          name="otEnd"
                          id="otEnd"
                          className="form-control"
                          value={values.otEnd}
                          onChange={(e) => {
                            setFormField(e, setFieldValue)
                          }}
                        />
                      </div>
                      <div className="form-group col-md-12 mb-3" >
                        <label>Indicate Ticket Number (If Applicable) and Reason</label>
                        <textarea 
                          name="reason"
                          id="reason"
                          className="form-control p-2"
                          style={{minHeight: 100}}
                          value={values.reason}
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
                          Save
                        </button>
                      </div>
                    </Modal.Footer>
                  </Form>
                )
              }}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* End Create User Modal Form */}
      </div>
    </div>
  )
}
