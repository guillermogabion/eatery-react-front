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
import { useDispatch, useSelector } from "react-redux"
import ReactPaginate from 'react-paginate';
import { action_approve, action_edit, action_cancel, action_decline } from "../../assets/images"


export const SquadLeaves = (props: any) => {
  const { history } = props
  let initialPayload = {
    "dateFrom": moment().format("YYYY-MM-DD"),
    "dateTo": moment().format("YYYY-MM-DD"),
    "type": 1,
    "status": "PENDING",
    "reason": "",
    "breakdown": []
  }
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [leaveDayTypes, setLeaveDayTypes] = useState<any>([]);
  const [leaveBreakdown, setLeaveBreakdown] = useState<any>([]);
  const [allLeaves, setAllLeaves] = useState<any>([]);
  const [dayTypes, setDayTypes] = useState<any>([]);
  const [leaveId, setLeaveId] = useState<any>("");
  const [filterData, setFilterData] = React.useState([]);
  const [initialValues, setInitialValues] = useState<any>(initialPayload)
  const [getMyLeaves, setGetMyLeaves] = useState<any>([])
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [holidays, setHolidays] = useState<any>([])

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
        if (status === 200 && body && body.data) {
          setLeaveTypes(body.data)
        } else {
        }
      }
    )

    RequestAPI.getRequest(
      `${Api.leaveDayTypes}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setLeaveDayTypes(body.data)
        } else {
        }
      }
    )

    RequestAPI.getRequest(
      `${Api.allHoliday}?size=10&sort=id&sortDir=desc&dateBefore=${moment().year() + "-01-01"}&dateAfter=${moment().year() + "-12-31"}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          let tempArray: any = []
          body.data.content.forEach((element: any, index: any) => {
            if (!tempArray.includes(element.holidayDate)){
              tempArray.push(element.holidayDate)
            }
          });
          setHolidays(tempArray)
        }
      }
    )
  }, [])

  useEffect (() => {
    RequestAPI.getRequest(
      `${Api.getMyLeave}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setGetMyLeaves(body.data)
          console.log(body.data); 
        } else {
        }
      }
    )
  }, [])

  useEffect(() => {
    getAllLeaves(0, "")
  }, [dayTypes])

  const getAllLeaves = (page: any = 0, status: any = "All") => {
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
        `${Api.getAllSquadLeaves}?size=10${queryString}&page=${page}`,
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
  }

  const getLeave = (id: any = 0) => {
    RequestAPI.getRequest(
      `${Api.getLeave}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            leaveTypes.forEach((element: any, index: any) => {
              if (element.name == valueObj.type) {
                valueObj.type = element.id
              }
            });
            setInitialValues(valueObj)
            setLeaveBreakdown(valueObj.breakdown)
            setLeaveId(valueObj.id)
            setModalShow(true)
          }
        }
      }
    )
  }

  useEffect(() => {
    dateBreakdown(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
  }, [])

  const dateBreakdown = (dFrom: any, dTo: any) => {
    const date1 = moment(dFrom);
    const date2 = moment(dTo);
    let leavesBreakdown = []
    let dayTypesArray = []
    let diffInDays = date2.diff(date1, 'days') + 1;
    let dateCounter = 0

    if (diffInDays >= 1) {
      for (let index = 1; index <= diffInDays; index++) {
        var added_date = moment(dFrom).add(dateCounter, 'days');
        let new_date = new Date(added_date.format('YYYY-MM-DD'))
        
        
        if (new_date.getDay() == 0 || new_date.getDay() == 6) {
          dateCounter += 1
        } else if (new_date.getDay() == 6) {
          dateCounter += 2
        } else {
          let new_date_with_counter = moment(dFrom).add(dateCounter, 'days').format('YYYY-MM-DD')
          if (!holidays.includes(new_date_with_counter)){
            leavesBreakdown.push({
              "date": new_date_with_counter,
              "credit": 1,
              "dayType": 'WHOLEDAY'
            })
          }
          dayTypesArray.push(false)
          dateCounter += 1
        }
      }
      setDayTypes(dayTypesArray)
      setLeaveBreakdown(leavesBreakdown)

    } else {
      setDayTypes([])
      setLeaveBreakdown([])
    }
  }

  const setDateOption = (index: any, value: any, dayType: any = null) => {

    if (leaveBreakdown) {
      const valuesObj: any = { ...leaveBreakdown }

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


  const cancelLeave = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this leave.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.cancelLeave, "", { "id": id }, {}, async (res: any) => {
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
              <th style={{ width: 'auto' }}>Employee Name</th>
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
              allLeaves.content.length > 0 ?
              <>
              {
                allLeaves.content.map((item: any, index: any) => {
                  return (
                    <tr>
                      <td> {item.lastName}, {item.firstName} </td>
                      <td> {item.type} </td>
                      <td> {item.dateFrom} </td>
                      <td> {item.dateTo} </td>
                      <td> {item.reason} </td>
                      <td> {item.status} </td>
                      <td>
                        {
                          item.status != "APPROVED" && item.status != "DECLINED_CANCELLED" ?
                            <>
                            {authorizations.includes("Request:Update") ? (
                              <>
                                  <label
                                  onClick={() => {
                                    getLeave(item.id)
                                  }}
                                  className="text-muted cursor-pointer">
                                  <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update"/>

                                </label>
                              </>
                            ) : null}
  
                            {authorizations.includes("Request:Approve") ? (
                              <>
                                <label
                                onClick={() => {
                                  approveLeave(item.id)
                                }}
                                className="text-muted cursor-pointer">
                                <img src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve"/>

                              </label>
                              </>
                            ) : null}
  
                              {authorizations.includes("Request:Reject") ? (
                              <>
                              <label
                                onClick={() => {
                                  declineLeave(item.id)
                                }}
                                className="text-muted cursor-pointer">
                                <img src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline"/>
                              </label>
                              
                              </>
                            ) : null}
                            </>
                            :
                            null
                        }
                        {
                          item.status == "APPROVED" || item.status == "PENDING" ?
                          <>
                          {authorizations.includes("Request:Update") ? (
                            <>
                            <label
                              onClick={() => {
                                cancelLeave(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel"/>
                            </label>
                          
                            </>
                          ) : null}
                          </>
                          :null
                        }
                      </td>
                    </tr>
                  )
                })
              }
              
              </>
              :
              null
            }
          </tbody>
          
        </Table>
        {
              allLeaves &&
              allLeaves.content &&
              allLeaves.content.length == 0 ?
              <div className="w-100 text-center">
                <label htmlFor="">No Records Found</label>
              </div>
              : 
              null
        }
        
      </div>
    )
  }, [allLeaves])

  const setFormField = (e: any, setFieldValue: any) => {
    if (setFieldValue) {
      const { name, value } = e.target
      setFieldValue(name, value)
      setFieldValue("formoutside", true)
    }
  }

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }
  const handlePageClick = (event: any) => {
    getAllLeaves(event.selected, "")
  };
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
                  <h2>Good Day, {userData.data.profile.firstName}!</h2>
                  <br/>
                  {data.profile.role !== 'ADMIN' ? (
  // This code block will be rendered only if the user is an ADMIN
                      <div>
                        <h4 className="bold-text">Leave Credits </h4>
                        {getMyLeaves.map((leave: any) => (
                          <div key={leave.id}>
                            <p><b>{leave.leaveName} : {leave.creditsLeft}</b></p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // This code block will be rendered for all other users
                      null
                    )}

                  {/* {getMyLeaves.map((leave: any) => (
                  <div key={leave.id}>
                    <p><b>{leave.leaveName} : {leave.creditsLeft}</b></p>
                  </div>
                ))} */}
                </div>
                <div className="col-md-6" style={{ textAlign: 'right' }}>
                  <TimeDate />
                </div>
              </div>
              <div>
                <div className="w-100 pt-2">
                  <div className="fieldtext d-flex col-md-6">
                      <div>
                        <label>Date From</label>
                        <input
                          name="dateFrom"
                          type="date"
                          autoComplete="off"
                          className="formControl"
                          maxLength={40}
                          onChange={(e) => makeFilterData(e)}
                          onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                        />
                      </div>
                      <div>
                        <label>Date To</label>
                        <div className="input-container">
                          <input
                            name="dateTo"
                            type="date"
                            autoComplete="off"
                            className="formControl"
                            maxLength={40}
                            onChange={(e) => makeFilterData(e)}
                            onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                          />
                        </div>
                      </div>
                    
                    <Button
                        style={{ width: 120}}
                        onClick={() => getAllLeaves(0,"")}
                        className="btn btn-primary mx-2 mt-4">
                        Search
                      </Button>
                  </div>
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k: any) => {
                      getAllLeaves(0, k)
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
              <div className="d-flex justify-content-end">
                <div className="">
                  <ReactPaginate
                    className="d-flex justify-content-center align-items-center"
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={(allLeaves && allLeaves.totalPages) || 0}
                    previousLabel="<"
                    previousLinkClassName="prev-next-pagination"
                    nextLinkClassName="prev-next-pagination"
                    activeClassName="active-page-link"
                    pageLinkClassName="page-link"
                    renderOnZeroPageCount={null}
                  />
                </div>
            </div>
                  {authorizations.includes("Request:Create") ? (
                  <div className="d-flex justify-content-end mt-3" >
                      <div>
                        
                      </div>
                  </div>
                ) : null}
              
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
          onHide={() => {
            setLeaveId(null);
            setModalShow(false)
          }}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            {/* <Modal.Title id="contained-modal-title-vcenter">
              Request For Leave/Time-off
            </Modal.Title> */}
            <Modal.Title id="contained-modal-title-vcenter">
              {leaveId ? 'Edit Leave/Time-off Request' : 'Request For Leave/Time-off'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 px-5">
            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={
                Yup.object().shape({
                  dateFrom: Yup.string().required("Date from is required !"),
                  dateTo: Yup.string().required("Date to is required !"),
                  reason: Yup.string().required("Reason is required !"),
                  status: Yup.string().required("Status is required !"),
                  type: Yup.string().required("Status is required !"),
                })
              }
              onSubmit={(values, actions) => {
                const valuesObj: any = { ...values }
                valuesObj.breakdown = leaveBreakdown
                if (leaveId) {
                  delete valuesObj.userId

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
                        getAllLeaves(0, "")
                        setModalShow(false)
                        formRef.current?.resetForm()
                      }
                    } else {
                      ErrorSwal.fire(
                        'Error!',
                        body.error && body.error.message,
                        // (body.error && body.error.message),
                        'error'
                      )
                    }
                  })
                } else {
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
                        getAllLeaves(0, "")
                        setModalShow(false)
                        formRef.current?.resetForm()
                      }
                    } else {
                      ErrorSwal.fire(
                        'Error!',
                        // 'Something Error.',
                        body.error && body.error.message,
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
                      <div className="form-group col-md-12 mb-3 " >
                        <label>Leave Type</label>
                        <select
                          className="form-select"
                          name="type"
                          id="type"
                          value={values.type}
                          onChange={(e) => setFormField(e, setFieldValue)}>
                          {leaveTypes &&
                            leaveTypes.length &&
                            leaveTypes.map((item: any, index: string) => (
                              <option key={`${index}_${item.id}`} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        {errors && errors.type && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                          )}
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
                            // setDateFrom(e.target.value)
                            dateBreakdown(e.target.value, values.dateTo)
                          }}
                        />
                        {errors && errors.dateFrom && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
                          )}
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
                            // setDateTo(e.target.value)
                            setFormField(e, setFieldValue)
                            dateBreakdown(values.dateFrom, e.target.value)
                          }}
                        />
                        {errors && errors.dateTo && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
                          )}
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
                        {errors && errors.reason && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                          )}
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
                                        checked={item.credit == 1}
                                        onChange={() => {
                                          setDateOption(index, 1, 'WHOLEDAY')
                                        }}
                                      />
                                      <label htmlFor={"leaveCreditWhole" + index.toString()}
                                        style={{ marginRight: 10 }}>Whole Day</label>
                                      <input
                                        type="radio"
                                        name={"leaveCredit" + index.toString()}
                                        id={"leaveCreditDay" + index.toString()}
                                        checked={item.credit == 0.5}
                                        onChange={() => {
                                          setDateOption(index, .5, "FIRST_HALF")
                                        }}
                                      /> <label htmlFor={"leaveCreditDay" + index.toString()}
                                        style={{ paddingTop: -10, marginRight: 10 }}>Half Day</label>
                                      {
                                        item.dayType != 'WHOLEDAY' ?
                                          <>
                                            <br />
                                            <input
                                              type="radio"
                                              name={"dayTypes" + index.toString()}
                                              id={"leaveCreditWhole1" + index.toString()}
                                              checked={item.dayType == 'FIRST_HALF'}
                                              onChange={() => setDateOption(index, .5, "FIRST_HALF")}
                                            />
                                            <label htmlFor={"leaveCreditWhole1" + index.toString()}
                                              style={{ marginRight: 10 }}>First Half</label>
                                            <input
                                              type="radio"
                                              name={"dayTypes" + index.toString()}
                                              checked={item.dayType == 'SECOND_HALF'}
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