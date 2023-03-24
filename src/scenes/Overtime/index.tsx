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

export const Overtime = (props: any) => {
  const { history } = props
  let initialPayload = {
    "shiftDate": moment().format("YYYY-MM-DD"),
    "classification": "NORMAL_OT",
    "otStart": "",
    "otEnd": ""
  }
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [myot, setMyOT] = useState<any>([]);
  const [otId, setOtId] = useState<any>("");
  const [otClassification, setOtClassification] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);
  const [initialValues, setInitialValues] = useState<any>({
    "shiftDate": moment().format("YYYY-MM-DD"),
    "classification": "NORMAL_OT",
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

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.OTClassification}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setOtClassification(body.data)
        } else {
        }
      }
    )
  }, [])

  useEffect(() => {
    getMyOT(0, "")
  }, [])

  const handlePageClick = (event: any) => {
    getMyOT(event.selected, "")
  };

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }
  const getMyOT = (page: any = 0, status: any = "All") => {

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
        `${Api.allOvertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setMyOT(body.data)
            }
          }
        }
      )
    }else{
      RequestAPI.getRequest(
        `${Api.myOT}?size=10&page=${page}&sort=id&sortDir=desc&status=${status}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setMyOT(body.data)
            }
          }
        }
      )
    }
    
  }

  const approveOT = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this overtime.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.approveOT, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || "",
                'error'
              )
            } else {
              getMyOT(0, "")
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

  const declineOT = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this overtime.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.declineOT, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || "",
                'error'
              )
            } else {
              getMyOT(0, '')
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

  const getOT = (id: any = 0) => {
    RequestAPI.getRequest(
      `${Api.otInformation}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            valueObj.otStart = moment(valueObj.otStart).format("HH:mm")
            valueObj.otEnd = moment(valueObj.otEnd).format("HH:mm")
            setInitialValues(valueObj)
            // the value of valueObj.id is null - API issue for temp fixing I set ID directly
            setOtId(id)
            setModalShow(true)
          }
        }
      }
    )
  }

  const overTimeTable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Shift Date</th>
              <th style={{ width: 'auto' }}>Classification</th>
              <th style={{ width: 'auto' }}>OT Start</th>
              <th style={{ width: 'auto' }}>OT End</th>
              <th style={{ width: 'auto' }}>File Date</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              myot &&
              myot.content &&
              myot.content.length > 0 &&
              myot.content.map((item: any, index: any) => {
                return (
                  <tr>
                    <td> {item.shiftDate} </td>
                    <td> {item.classification} </td>
                    <td> {item.otStart} </td>
                    <td> {item.otEnd} </td>
                    <td> {item.fileDate} </td>
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
                                  getOT(item.id)
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
                                approveOT(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Approve
                            </label> <br />
                            </>
                          ) : null}
                          {authorizations.includes("Request:Decline") ? (
                            <>
                              <label
                              onClick={() => {
                                declineOT(item.id)
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
        {
              myot &&
              myot.content &&
              myot.content.length == 0 ?
              <div className="w-100 text-center">
                <label htmlFor="">No Records Found</label>
              </div>
              : 
              null
        }
      </div>
    )
  }, [myot])

  const setFormField = (e: any, setFieldValue: any) => {
    if (setFieldValue) {
      const { name, value } = e.target
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
                <div className="w-100 pt-2">
                <div className="fieldtext d-flex col-md-3">
                  <div>
                      <label>Date From</label>
                      <div>
                          <input
                          name="dateFrom"
                          type="date"
                          autoComplete="off"
                          className="formControl"
                          onChange={(e) => makeFilterData(e)}
                          onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                          />
                      </div>
                  </div>
                  <div>
                      <label>Date To</label>
                      <div className="input-container">
                          <input
                          name="dateTo"
                          type="date"
                          autoComplete="off"
                          className="formControl"
                          onChange={(e) => makeFilterData(e)}
                          onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                          />
                      </div>
                  </div>
                  <div>
                      <label>Date Filed</label>
                      <div className="input-container">
                          <input
                          name="dateFiled"
                          type="date"
                          autoComplete="off"
                          className="formControl"
                          onChange={(e) => makeFilterData(e)}
                          onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                          />
                      </div>
                  </div>
                  <div>
                      <Button
                      style={{ width: 120}}
                      onClick={() => getMyOT(0,"")}
                      className="btn btn-primary mx-2 mt-4">
                      Search
                      </Button>
                  </div>
              </div>
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k: any) => {
                      getMyOT(0, k)
                      setKey(k)
                    }}
                    className="mb-3"
                  >
                    <Tab eventKey="all" title="All">
                      {overTimeTable()}
                    </Tab>
                    <Tab eventKey="pending" title="Pending">
                      {overTimeTable()}
                    </Tab>
                    <Tab eventKey="approved" title="Approved" >
                      {overTimeTable()}
                    </Tab>
                    <Tab eventKey="declined" title="Rejected/Cancelled">
                      {overTimeTable()}
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
                    pageCount={(myot && myot.totalPages) || 0}
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
                <>
                <div className="d-flex justify-content-end mt-3" >
                  <div>
                    <Button
                      className="mx-2"
                      onClick={() => {
                        setOtId("")
                        setInitialValues(initialPayload)
                        setModalShow(true)
                      }}>Request Overtime</Button>
                  </div>
              </div>
                </>
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
          onHide={() => setModalShow(false)}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Request Overtime
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 px-5">
            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={
                Yup.object().shape({
                  shiftDate: Yup.string().required("Shift date is required !"),
                  classification: Yup.string().required("Classification is required !"),
                  otStart: Yup.string().required("OT Start is required !"),
                  otEnd: Yup.string().required("OT End is required !"),
                })
              }
              onSubmit={(values, actions) => {
                setOnSubmit(true)
                const valuesObj: any = { ...values }
                if (otId) {
                  valuesObj.id = otId
                  RequestAPI.putRequest(Api.updateOT, "", valuesObj, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                      if (body.error && body.error.message) {
                        ErrorSwal.fire(
                          'Error!',
                          (body.error && body.error.message) || "",
                          'error'
                        )
                      } else {
                        getMyOT(0, "")
                        ErrorSwal.fire(
                          'Success!',
                          (body.data) || "",
                          'success'
                        )
                        setModalShow(false)
                        formRef.current?.resetForm()
                      }
                    } else {
                      ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "Something error!",
                        'error'
                      )
                    }
                  })
                } else {
                  RequestAPI.postRequest(Api.OTCreate, "", valuesObj, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                      if (body.error && body.error.message) {
                        ErrorSwal.fire(
                          'Error!',
                          (body.error && body.error.message) || "",
                          'error'
                        )
                      } else {
                        getMyOT(0, "")
                        ErrorSwal.fire(
                          'Success!',
                          (body.data) || "",
                          'success'
                        )
                        setModalShow(false)
                        formRef.current?.resetForm()
                      }
                    } else {
                      ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "Something error!",
                        'error'
                      )
                    }
                  })
                }
                setOnSubmit(false)
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
                          {otClassification &&
                            otClassification.length &&
                            otClassification.map((item: any, index: string) => (
                              <option key={`${index}_${item.item}`} value={item.item}>
                                {item}
                              </option>
                            ))}
                        </select>
                        {errors && errors.classification && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.classification}</p>
                          )}
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
                        {errors && errors.shiftDate && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                          )}
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
                        {errors && errors.otStart && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.otStart}</p>
                          )}
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
                        {errors && errors.otEnd && (
                              <p style={{ color: "red", fontSize: "12px" }}>{errors.otEnd}</p>
                          )}
                      </div>
                      <div className="form-group col-md-12 mb-3" >
                        <label>Indicate Ticket Number (If Applicable) and Reason</label>
                        <textarea
                          name="reason"
                          id="reason"
                          className="form-control p-2"
                          style={{ minHeight: 100 }}
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
                          disabled={onSubmit}
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
