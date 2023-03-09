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


export const Leaves = (props: any) => {
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [dateFrom, setDateFrom] = useState<any>(moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState<any>(moment().format("YYYY-MM-DD"));
  const [leaveBreakdown, setLeaveBreakdown] = useState<any>([]);
  const [allLeaves, setAllLeaves] = useState<any>([]);
  const [dayTypes, setDayTypes] = useState<any>([]);
  const [status, setStatus] = useState<any>("All");
  const [initialValues, setInitialValues] = useState<any>({
    "dateFrom": moment().format("YYYY-MM-DD"),
    "dateTo": moment().format("YYYY-MM-DD"),
    "type": "SICK",
    "status": "PENDING",
    "reason": "",
    "breakdown": [
      {
        "date": "",
        "credit": 0,
        "dayType": null
      }
    ]
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

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.leaveTypes}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body) {
          setLeaveTypes(body)
        } else {

        }
      }
    )

  }, [])

  useEffect(() => {
    getAllLeaves(0, "")
  }, [dayTypes])

  const getAllLeaves = (page: any = 0, status: any = "All") => {
    RequestAPI.getRequest(
      `${Api.allRequestLeave}?status=${status}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body) {
          if (body.error && body.error.message) {

          } else {
            setAllLeaves(body.data)
          }
        }
      }
    )
  }
  const getLeave = (id: any = 0) => {
    RequestAPI.getRequest(
      `${Api.getLeave}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body) {
          if (body.error && body.error.message) {

          } else {
            console.log(body)
          }
        }
      }
    )
  }

  useEffect(() => {
    dateBreakdown()
  }, [dateFrom, dateTo])

  const dateBreakdown = () => {
    const date1 = moment(dateFrom);
    const date2 = moment(dateTo);
    let leavesBreakdown = []
    let diffInDays = date2.diff(date1, 'days') + 1;
    let dateCounter = 0
    if (dateFrom && dateTo && diffInDays >= 1) {
      for (let index = 1; index <= diffInDays; index++) {
        var added_date = moment(dateFrom).add(dateCounter, 'days');
        let new_date = new Date(added_date.format('YYYY-MM-DD'))
        if (new_date.getDay() == 0 || new_date.getDay() == 6) {
          dateCounter += 1
        } else if (new_date.getDay() == 6) {
          dateCounter += 2
        } else {
          leavesBreakdown.push({
            "date": moment(dateFrom).add(dateCounter, 'days').format('YYYY-MM-DD'),
            "credit": 0,
            "dayType": null
          })
          setDayTypes([
            ...dayTypes,
            false
          ]);
          dateCounter += 1
        }
      }
      // const valuesObj: any = { ...initialValues }
      // valuesObj.breakdown = leavesBreakdown
      // setInitialValues(valuesObj)
      setLeaveBreakdown(leavesBreakdown)
      
    } else {
      ErrorSwal.fire(
        'Error!',
        "Invalid date range.",
        'error'
      )
    }
  }

  const setDateOption = (index: any, value: any, dayType: any = null) => {
    const valuesObj: any = { ...leaveBreakdown }
    let breakDownObj: any = {}
    if(valuesObj.breakdown){
      breakDownObj= { ...valuesObj.breakdown }
      console.log(breakDownObj)
      breakDownObj[index].credit = value
      breakDownObj[index].dayType = dayType
    }
    const valuesObjDayType: any = { ...dayTypes }
    
    if (value == .5) {
      valuesObjDayType[index] = true
    }
    else {
      valuesObjDayType[index] = false
    }
    setDayTypes(valuesObjDayType)
  }

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
              getAllLeaves(0, "")
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
              getAllLeaves(0, "")
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
                          getLeave(item.id)
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
                <h3>Leave Credits</h3>
                <div className="row p-0 m-0 pt-2">
                  <div className="col-md-2">
                    <h5>Sickness:</h5>
                    <h5>Vacation:</h5>
                    <h5>Without pay:</h5>
                  </div>
                  <div className="col-md-3">
                    <h5>0</h5>
                    <h5>0</h5>
                    <h5>0</h5>
                  </div>
                </div>
                <div className="w-100 pt-4">
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k: any) => {
                      getAllLeaves(0, k)
                      setKey(k)
                      // setStatus(key)
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
                    }}>Request for Leave/Time-off</Button>
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
              Request For Leave/Time-off
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
                valuesObj.breakdown = leaveBreakdown
                
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
                      console.log(JSON.stringify(valuesObj))
                      getAllLeaves(0, "")
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
              }}>
              {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                return (
                  <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                    <div className="row w-100 px-5">
                      <div className="form-group col-md-12 mb-3 " >
                        <label>Leave Type</label>
                        <select
                          className="form-select"
                          name="type"
                          id="type"
                          value={values.type}
                          onChange={(e) => setFormField(e, setFieldValue)}>
                          {leaveTypes &&
                            leaveTypes.types &&
                            leaveTypes.types.length &&
                            leaveTypes.types.map((item: any, index: string) => (
                              <option key={`${index}_${item}`} value={item}>
                                {item}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>Date From</label>
                        <input type="date"
                          name="dateFrom"
                          id="dateFrom"
                          className="form-control"
                          value={values.dateFrom}
                          min={moment().format("YYYY-MM-DD")}
                          onChange={(e) => {
                            setFormField(e, setFieldValue)
                            setDateFrom(e.target.value)
                            dateBreakdown()
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>Date To</label>
                        <input type="date"
                          name="dateTo"
                          id="dateTo"
                          className="form-control"
                          value={values.dateTo}
                          min={values.dateFrom}
                          onChange={(e) => {
                            setDateTo(e.target.value)
                            setFormField(e, setFieldValue)
                            dateBreakdown()
                          }}
                        />
                      </div>
                      <div className="form-group col-md-12 mb-3" >
                        <label>Reason</label>
                        <input type="text"
                          name="reason"
                          id="reason"
                          className="form-control"
                          value={values.reason}
                          onChange={(e) => setFormField(e, setFieldValue)}
                        />
                      </div>
                      <div className="form-group col-md-12 mb-3" >
                        <Table responsive="lg" style={{ maxHeight: '100vh' }}>
                          <thead>
                            <tr>
                              <th style={{ width: 'auto' }}>Date Breakdown</th>
                              <th style={{ width: 'auto' }}>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              leaveBreakdown &&
                              leaveBreakdown.length &&
                              leaveBreakdown.map((item: any, index: any) => {
                                const { date } = item
                                return (
                                  <tr>
                                    <td key={index + 'date'} >{date}</td>
                                    <td key={index} >
                                      <input
                                        type="radio"
                                        name={"leaveCredit" + index.toString()}
                                        id={"leaveCreditWhole" + index.toString()}
                                        defaultChecked
                                        onChange={() => {
                                          setDateOption(index,1, null)
                                        }}
                                      />
                                      <label htmlFor={"leaveCreditWhole" + index.toString()}
                                        style={{ marginRight: 10 }}>Whole Day</label>
                                      <input
                                        type="radio"
                                        name={"leaveCredit" + index.toString()}
                                        id={"leaveCreditDay" + index.toString()}
                                        onChange={() => {
                                          setDateOption(index, .5, "FIRST_HALF")
                                        }}
                                      /> <label htmlFor={"leaveCreditDay" + index.toString()}
                                        style={{ paddingTop: -10, marginRight: 10 }}>Half Day</label>
                                      {
                                        dayTypes[index] ?
                                          <>
                                            <br />
                                            <input
                                              type="radio"
                                              name={"dayTypes" + index.toString()}
                                              id={"leaveCreditWhole1" + index.toString()}
                                              defaultChecked
                                              onChange={() => setDateOption(index, .5, "FIRST_HALF")}
                                            />
                                            <label htmlFor={"leaveCreditWhole1" + index.toString()}
                                              style={{ marginRight: 10 }}>First Half</label>
                                            <input
                                              type="radio"
                                              name={"dayTypes" + index.toString()}
                                              id={"leaveCreditDay1" + index.toString()}
                                              onChange={() => setDateOption(index, .5, "SECOND_HALF")}
                                            />
                                            <label htmlFor={"leaveCreditDay1" + index.toString()}
                                              style={{ paddingTop: -10 }}>Second Half</label>
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
