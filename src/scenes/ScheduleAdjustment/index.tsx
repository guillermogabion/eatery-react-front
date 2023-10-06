import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { Formik } from "formik"
import moment from "moment"
import { Button, Form, Modal } from "react-bootstrap"
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import * as Yup from "yup"
import { Api, RequestAPI } from "../../api"
import { eye, action_approve, action_cancel, action_decline, action_edit } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import TimeDate from "../../components/TimeDate"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)

export const ScheduleAdjustment = (props: any) => {
  const { history } = props
  let initialPayload = {
    "dateFrom": "",
    "dateTo": "",
    "status": "PENDING",
    "reason": "",
    "breakdown": []
  }
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [modalViewShow, setModalViewShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [actionable, setIsActionable] = React.useState(false);
  const [adjustmentBreakdown, setAdjustmentBreakdown] = useState<any>([]);
  const [allAdjustments, setAllAdjustments] = useState<any>([]);
  const [adjustmentId, setAdjustmentId] = useState<any>("");
  const [filterData, setFilterData] = React.useState([]);
  const [initialValues, setInitialValues] = useState<any>(initialPayload)
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [userSchedule, setUserSchedule] = useState<any>("");
  const [requestStatus, setRequestStatus] = useState<any>("");
  const [holidays, setHolidays] = useState<any>([])

  const formRef: any = useRef()

  useEffect(() => {
    getAllAdjustments(0, key)
    getMySchedule()
    getHolidays()
  }, [])

  const getHolidays = () => {

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
            if (!tempArray.includes(element.holidayDate)) {
              tempArray.push(element.holidayDate)
            }
          });
          setHolidays(tempArray)
        }
      }
    )
  }

  const getMySchedule = () => {

    RequestAPI.getRequest(
      `${Api.mySchedule}?date=${moment().format('YYYY-MM-DD')}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body) {
          if (body.error && body.error.message) {
          } else {
            setUserSchedule(body.data)
          }
        }
      }
    )
  }
  const getAllAdjustments = (page: any = 0, status: any = "all", isActionable: any = false) => {
    setKey(status)
    setIsActionable(isActionable)

    let queryString = ""
    let filterDataTemp = { ...filterData }

    if (status == 'actionable') {
      queryString = "&status=all"
    }
    else if (status != "") {
      queryString = "&status=" + status
    }

    if (filterDataTemp) {
      Object.keys(filterDataTemp).forEach((d: any) => {
        if (filterDataTemp[d]) {

          queryString += `&${d}=${filterDataTemp[d]}`
        } else {
          queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
        }
      })
    }

    if (status == 'actionable') {
      queryString += '&actionableOnly=true'
    }

    if (data.profile.role == 'EXECUTIVE') {
      RequestAPI.getRequest(
        `${Api.allScheduleAdjustment}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              console.log(body.data)
              setAllAdjustments(body.data)
            }
          }
        }
      )
    } else {
      RequestAPI.getRequest(
        `${Api.myScheduleAdjustment}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setAllAdjustments(body.data)
            }
          }
        }
      )
    }
  }
  const getViewSchedule = (id: any = 0) => {

    RequestAPI.getRequest(
      `${Api.getScheduleAdjustment}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {

          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            setInitialValues(valueObj)
            setModalViewShow(true)
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
    let adjustmentsBreakdown = []
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
          if (!holidays.includes(new_date_with_counter)) {
            adjustmentsBreakdown.push({
              "date": new_date_with_counter,
              "startShift": "09:00:00",
              "startBreak": "12:00:00",
              "endBreak": "13:00:00",
              "endShift": "18:00:00",
              "status": "PENDING"
            })
          }

          dateCounter += 1
        }
      }
      setAdjustmentBreakdown(adjustmentsBreakdown)

    } else {
      setAdjustmentBreakdown([])
    }
  }

  const setDateOption = (index: any, name: any, value: any) => {

    if (adjustmentBreakdown) {
      const valuesObj: any = [...adjustmentBreakdown]
      value = value + ":00"
      if (valuesObj) {
        if (name == "startShift") {
          valuesObj[index].startShift = value
        } else if (name == "startBreak") {
          valuesObj[index].startBreak = value
        } else if (name == "endBreak") {
          valuesObj[index].endBreak = value
        } else if (name == "endShift") {
          valuesObj[index].endShift = value
        }
        setAdjustmentBreakdown([...valuesObj])
      }
    }
  }

  const approveAdjustment = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this schedule adjustment.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "scheduleadjustment_approveconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "scheduleadjustment_approvecancel_alertbtn"
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        RequestAPI.postRequest(Api.approveScheduleAdjustment, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton)
                    confirmButton.id = "scheduleadjustment_errorconfirm_alertbtn"
                },
                icon: 'error',
              })
            } else {
              Swal.close()
              ErrorSwal.fire({
                title: 'Success!',
                text: (body.data) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton)
                    confirmButton.id = "scheduleadjustment_successconfirm_alertbtn"
                },
                icon: 'success',
              })
              getAllAdjustments(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton)
                  confirmButton.id = "scheduleadjustment_errorconfirm2_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }

  const declineAdjustment = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this schedule adjustment.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "scheduleadjustment_declineconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "scheduleadjustment_declinecancel_alertbtn"
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        RequestAPI.postRequest(Api.declineScheduleAdjustment, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton)
                    confirmButton.id = "scheduleadjustment_errorconfirm3_alertbtn"
                },
                icon: 'error',
              })
            } else {
              Swal.close()
              ErrorSwal.fire({
                title: 'Success!',
                text: (body.data) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton)
                    confirmButton.id = "scheduleadjustment_successconfirm2_alertbtn"
                },
                icon: 'success',
              })
              getAllAdjustments(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton)
                  confirmButton.id = "scheduleadjustment_errorconfirm4_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }


  const cancelAdjustment = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this schedule adjustment.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "scheduleadjustment_canceladjconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "scheduleadjustment_canceladjcancel_alertbtn"
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        const loadingSwal = Swal.fire({
          title: '',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        RequestAPI.postRequest(Api.cancelScheduleAdjustment, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton)
                    confirmButton.id = "scheduleadjustment_errorconfirm5_alertbtn"
                },
                icon: 'error',
              })
              getAllAdjustments(0, key)
            } else {
              Swal.close()
              ErrorSwal.fire({
                title: 'Success!',
                text: (body.data) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton)
                    confirmButton.id = "scheduleadjustment_successconfirm3_alertbtn"
                },
                icon: 'success',
              })
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton)
                  confirmButton.id = "scheduleadjustment_errorconfirm6_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }

  function limitText(text, limit) {
    if (text.length <= limit) {
      return text;
    } else {
      return text.substring(0, limit) + '...';
    }
  }



  const adjustmentTable = useCallback(() => {
    return (
      <div>

        <Table responsive>
          <thead>
            <tr>
              {
                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                  <>
                    <th style={{ width: 'auto' }}>Employee Name</th>
                  </> : null
              }
              <th style={{ width: 'auto' }}>Date Filed</th>
              <th style={{ width: 'auto' }}>Date From</th>
              <th style={{ width: 'auto' }}>Date To</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Action Taken By</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              allAdjustments &&
                allAdjustments.content &&
                allAdjustments.content.length > 0 ?
                <>
                  {
                    allAdjustments.content.map((item: any, index: any) => {
                      return (
                        <tr>
                          {
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                              <>
                                <td id={"scheduleadjustment_name_alladjdata_" + item.id}> {item.lastName}, {item.firstName} </td>
                              </> : null
                          }
                          <td id={"scheduleadjustment_filedate_alladjdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                          <td id={"scheduleadjustment_datefrom_alladjdata_" + item.id}> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                          <td id={"scheduleadjustment_dateto_alladjdata_" + item.id}> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                          <td id={"scheduleadjustment_reason_alladjdata_" + item.id}> {limitText(item.reason, 20)} </td>
                          <td id={"scheduleadjustment_statuschangedby_alladjdata_" + item.id}> {item.statusChangedBy} </td>
                          <td id={"scheduleadjustment_status_alladjdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                          <td className="d-flex">
                            <label
                              id={"scheduleadjustment_view_alladjlabel_" + item.id}
                              onClick={() => {
                                getViewSchedule(item.id)
                              }}
                            >
                              <img id={"scheduleadjustment_eye_alladjimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                            </label>

                            {
                              item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED" ?
                                <>
                                  {authorizations.includes("Request:Update") ? (
                                    <>
                                      <label
                                        id={"scheduleadjustment_edit_alladjlabel_" + item.id}
                                        onClick={() => {
                                          setInitialValues(item)
                                          setAdjustmentBreakdown(item.breakdown)
                                          setAdjustmentId(item.id)
                                          setModalShow(true)
                                        }}
                                        className="cursor-pointer">
                                        <img id={"scheduleadjustment_actionedit_alladjimg_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                      </label>
                                      <br />
                                    </>
                                  ) : null}

                                  {authorizations.includes("Request:Approve") && data.profile.role == 'EXECUTIVE' ? (
                                    <>
                                      <label
                                        id={"scheduleadjustment_actionapprove_alladjlabel_" + item.id}
                                        onClick={() => {
                                          approveAdjustment(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        <img id={"scheduleadjustment_actionapprove_alladjimg_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                      </label> <br />
                                    </>
                                  ) : null}

                                  {authorizations.includes("Request:Reject") && data.profile.role == 'EXECUTIVE' ? (
                                    <>
                                      <label
                                        id={"scheduleadjustment_actiondecline_alladjlabel_" + item.id}
                                        onClick={() => {
                                          declineAdjustment(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        <img id={"scheduleadjustment_actiondecline_alladjimg_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                                      </label>
                                      <br />
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
                                        id={"scheduleadjustment_actioncancel_alladjlabel_" + item.id}
                                        onClick={() => {
                                          cancelAdjustment(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        <img id={"scheduleadjustment_actioncancel_alladjimg_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                                      </label>
                                      <br />
                                    </>
                                  ) : null}
                                </>
                                : null
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
          allAdjustments &&
            allAdjustments.content &&
            allAdjustments.content.length == 0 ?
            <div className="w-100 text-center">
              <label htmlFor="">No Records Found</label>
            </div>
            :
            null
        }

      </div>
    )
  }, [allAdjustments])

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
    getAllAdjustments(event.selected, key)
  };

  const singleChangeOption = (option: any, name: any) => {

    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }

  return (
    <ContainerWrapper contents={<>
      <div className="w-100 px-5 py-5" style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
        <div className="row">
            <h3><b>Adjustment of Schedule</b></h3>
            <div className="row p-0 m-0 pt-4 ">
              <div className="col-md-4">
                <h5>Current Work Schedule:</h5>
              </div>
              <div className="col-md-8">
                <h5 id="scheduleadjustment_startshift_mainlabel">{moment(userSchedule.startShift, "HH:mm:ss").format("hh:mm A")} - {moment(userSchedule.endShift, "HH:mm:ss").format("hh:mm A")}</h5>
              </div>

          </div>
        </div>
        <div>
          <div className="w-100 pt-2">
            <div className="row d-flex pb-1">
              {
                data.profile.role == 'EXECUTIVE' ?
                  <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2" style={{paddingRight: '0'}}>
                    <label>Employee</label>
                    <EmployeeDropdown
                      id="scheduleadjustment_employee_maindropdown"
                      placeholder={"Employee"}
                      singleChangeOption={singleChangeOption}
                      name="userId"
                      value={filterData && filterData['userId']}
                    />
                  </div>
                  :
                  null
              }
              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-2 col-lg-2" : "col-xs-12 col-sm-12 col-md-3 col-lg-2"} style={{margin: '0', paddingRight: '0'}}>
                <label>Date From</label>
                <input
                  id="scheduleadjustment_datefrom_maininput"
                  name="dateFrom"
                  type="date"
                  autoComplete="off"
                  className="formControl"
                  onChange={(e) => makeFilterData(e)}
                  onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                />
              </div>
              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-2 col-lg-2" : "col-xs-12 col-sm-12 col-md-3 col-lg-2"} style={{margin: '0', paddingRight: '0'}}>
                <label>Date To</label>
                <input
                  id="scheduleadjustment_dateto_maininput"
                  name="dateTo"
                  type="date"
                  autoComplete="off"
                  className="formControl"
                  onChange={(e) => makeFilterData(e)}
                  onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                />
              </div>
              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-2 col-lg-2" : "col-xs-12 col-sm-12 col-md-3 col-lg-2"} style={{margin: '0', paddingRight: '0'}}>
                <label>Date Filed</label>
                <input
                  id="scheduleadjustment_datefield_maininput"
                  name="dateFiled"
                  type="date"
                  autoComplete="off"
                  className="formControl"
                  onChange={(e) => makeFilterData(e)}
                  onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                />
              </div>
              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-2 col-lg-1" : "col-xs-12 col-sm-12 col-md-3 col-lg-1"} style={{margin: '0', paddingLeft: '8px'}}>
                <Button
                  id="scheduleadjustment_search_mainbtn"
                  style={{ width: '100%' }}
                  onClick={() => getAllAdjustments(0, key, actionable)}
                  className="btn btn-primary mx-2 mt-4 customed-button">
                  Search
                </Button>
              </div>
            </div>

            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setAllAdjustments([])

                if (k == 'actionable') {
                  getAllAdjustments(0, k, true)
                } else {
                  getAllAdjustments(0, k)
                }
              }}
              className="mb-3"
            >
              <Tab id="scheduleadjustment_all_maintab" eventKey="all" title="All">
                {adjustmentTable()}
              </Tab>
              <Tab id="scheduleadjustment_pending_maintab" eventKey="pending" title="Pending">
                {adjustmentTable()}
              </Tab>
              <Tab id="scheduleadjustment_approved_maintab" eventKey="approved" title="Approved" >
                {adjustmentTable()}
              </Tab>
              <Tab id="scheduleadjustment_declined_maintab" eventKey="declined" title="Rejected/Cancelled">
                {adjustmentTable()}
              </Tab>
              {
                data.profile.role == 'EXECUTIVE' &&
                (
                  <Tab id="scheduleadjustment_actionable_maintab" eventKey="actionable" title="Actionable">
                    {adjustmentTable()}
                  </Tab>
                )
              }
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
              pageCount={(allAdjustments && allAdjustments.totalPages) || 0}
              previousLabel="<"
              previousLinkClassName="prev-next-pagination"
              nextLinkClassName="prev-next-pagination"
              activeLinkClassName="active-page-link"
              disabledLinkClassName="prev-next-disabled"
              pageLinkClassName="page-link"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
        {authorizations.includes("Request:Create") ? (
          <div className="d-flex justify-content-end mt-3" >
            <div>
              <Button
                id="scheduleadjustment_requestforscheduleadjustment_mainbtn"
                className="mx-2"
                onClick={() => {
                  setInitialValues(initialPayload)
                  setAdjustmentBreakdown([])
                  setAdjustmentId("")
                  setModalShow(true)
                }}>Request Schedule Adjustment</Button>
            </div>
          </div>
        ) : null}

      </div>

      <Modal
        show={modalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setAdjustmentId(null);
          setModalShow(false)
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
              Request For Leave/Time-off
            </Modal.Title> */}
          <Modal.Title id="contained-modal-title-vcenter" className="text-center mx-auto">
            {adjustmentId ? 'Edit Schedule Adjustment Request' : 'Request Schedule Adjustment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row px-3">
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={
              Yup.object().shape({
                dateFrom: Yup.string().required("Date from is required !"),
                dateTo: Yup.string().required("Date to is required !"),
                reason: Yup.string().required("Reason is required !"),

              })
            }
            onSubmit={(values, actions) => {
              const valuesObj: any = { ...values }
              const loadingSwal = Swal.fire({
                title: '',
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },

              });
              valuesObj.breakdown = adjustmentBreakdown

              if (adjustmentId) {
                delete valuesObj.userId
                RequestAPI.putRequest(Api.updateScheduleAdjustment, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();

                          if (confirmButton)
                            confirmButton.id = "scheduleadjustment_errorconfirm7_alertbtn"
                        },
                        icon: 'error',
                      })
                    } else {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();

                          if (confirmButton)
                            confirmButton.id = "scheduleadjustment_successconfirm4_alertbtn"
                        },
                        icon: 'success',
                      })
                      setAdjustmentBreakdown([])
                      getAllAdjustments(0, key)
                      setModalShow(false)
                      formRef.current?.resetForm()
                    }
                  } else {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: "Please enter a valid time format",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();

                        if (confirmButton)
                          confirmButton.id = "scheduleadjustment_errorconfirm8_alertbtn"
                      },
                      icon: 'error',
                    })
                  }
                })
              } else {
                RequestAPI.postRequest(Api.createScheduleAdjustment, "", valuesObj, {}, async (res: any) => {
                  Swal.close()
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();

                          if (confirmButton)
                            confirmButton.id = "scheduleadjustment_errorconfirm9_alertbtn"
                        },
                        icon: 'error',
                      })
                    }


                    else {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();

                          if (confirmButton)
                            confirmButton.id = "scheduleadjustment_successconfirm5_alertbtn"
                        },
                        icon: 'success',
                      })
                      setAdjustmentBreakdown([])
                      getAllAdjustments(0, key)
                      setModalShow(false)
                      formRef.current?.resetForm()
                    }
                  } else {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: "Please enter a valid time format",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();

                        if (confirmButton)
                          confirmButton.id = "scheduleadjustment_errorconfirm10_alertbtn"
                      },
                      icon: 'error',
                    })
                  }
                })
              }



            }}>
            {({ values, setFieldValue, handleSubmit, errors, touched }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                  <div className="row px-2">
                    <div className="form-group col-md-6 mb-3" >
                      <label>Date From</label>
                      <input type="date"
                        name="dateFrom"
                        id="dateFrom"
                        className="form-control"
                        value={values.dateFrom}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                          dateBreakdown(e.target.value, values.dateTo)
                        }}
                      />
                      {errors && errors.dateFrom && (
                        <p id="scheduleadjustment_errordatefrom_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
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
                          setFormField(e, setFieldValue)
                          dateBreakdown(values.dateFrom, e.target.value)
                        }}
                      />
                      {errors && errors.dateTo && (
                        <p id="scheduleadjustment_errordateto_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Reason</label>
                      <textarea
                        name="reason"
                        id="reason"
                        className="form-control p-2"
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                        style={{height: '150px'}}
                      />
                      {errors && errors.reason && (
                        <p id="scheduleadjustment_errorreason_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <Table responsive style={{ maxHeight: '100vh' }}>
                        <thead>
                          <tr>
                            <th style={{ width: 'auto' }}>Date</th>
                            <th style={{ width: 'auto' }}>Start Shift</th>
                            <th style={{ width: 'auto' }}>Start Break</th>
                            <th style={{ width: 'auto' }}>End Break</th>
                            <th style={{ width: 'auto' }}>End Shift</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            adjustmentBreakdown &&
                            adjustmentBreakdown.length > 0 &&
                            adjustmentBreakdown.map((item: any, index: any) => {
                              const { date } = item
                              return (
                                <tr>
                                  <td key={index + 'date'} className="d-flex align-items-center">{date}</td>
                                  <td key={index + 'startShift'} >
                                    <input
                                      type="time"
                                      name={"startShift" + index.toString()}
                                      id={"startShift" + index.toString()}
                                      key={"startShift" + index.toString()}
                                      value={item.startShift}
                                      // step={"1"}
                                      className="form-control"
                                      onChange={(e) => {
                                        setDateOption(index, 'startShift', e.target.value)
                                      }}
                                    />
                                    {errors && errors.startShift && (
                                      <p id="scheduleadjustment_errorstartshift_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.startShift}</p>
                                    )}
                                  </td>
                                  <td key={index + 'startBreak'} >
                                    <input
                                      type="time"
                                      name={"startBreak" + index.toString()}
                                      id={"startBreak" + index.toString()}
                                      key={"startBreak" + index.toString()}
                                      // step={"1"}
                                      value={item.startBreak}
                                      className="form-control"
                                      onChange={(e) => {
                                        setDateOption(index, 'startBreak', e.target.value)
                                      }}
                                    />
                                  </td>
                                  <td key={index + 'endBreak'} >
                                    <input
                                      type="time"
                                      name={"endBreak" + index.toString()}
                                      id={"endBreak" + index.toString()}
                                      key={"endBreak" + index.toString()}
                                      // step={"1"}
                                      className="form-control"
                                      value={item.endBreak}
                                      onChange={(e) => {
                                        setDateOption(index, 'endBreak', e.target.value)
                                      }}
                                    />
                                  </td>
                                  <td key={index + 'endShift'} >
                                    <input
                                      type="time"
                                      name={"endShift" + index.toString()}
                                      id={"endShift" + index.toString()}
                                      key={"endShift" + index.toString()}
                                      // step={"1"}
                                      className="form-control"
                                      value={item.endShift}
                                      onChange={(e) => {
                                        setDateOption(index, 'endShift', e.target.value)
                                      }}
                                    />
                                  </td>

                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </Table>
                      {
                        adjustmentBreakdown &&
                          adjustmentBreakdown.length == 0 ?
                          <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                          </div>
                          :
                          null
                      }
                    </div>
                  </div>
                  <br />
                  <Modal.Footer>
                    <div className="d-flex justify-content-end px-5">

                      {adjustmentBreakdown && adjustmentBreakdown.length == 0 ?
                        <button
                          id="scheduleadjustment_save_modalbtn"
                          disabled
                          type="submit"
                          className="btn btn-primary">
                          Save
                        </button> :
                        <button
                          id="scheduleadjustment_save2_modalbtn"
                          type="submit"
                          className="btn btn-primary">
                          Save
                        </button>

                      }

                    </div>
                  </Modal.Footer>
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
      </Modal>
      <Modal
        show={modalViewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {

          setModalViewShow(false)
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Request Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center">
          <div className="container">
            {/* <h4>reason</h4> {{values.reason}} */}
            <p id="scheduleadjustment_name_requestinfop">Name : <span>{initialValues.lastName + ' ' + initialValues.firstName}</span> <span>{ }</span></p>
            <p id="scheduleadjustment_reason_requestinfop">Reason : {initialValues.reason}</p>
            <p id="scheduleadjustment_datefrom_requestinfop">Date From : {Utility.formatDate(initialValues.dateFrom, 'MM-DD-YYYY')}</p>
            <p id="scheduleadjustment_dateto_requestinfop">Date To : {Utility.formatDate(initialValues.dateTo, 'MM-DD-YYYY')}</p>
            <p id="scheduleadjustment_shiftstarts_requestinfop">Shift Starts : {initialValues.startShift}</p>
            <p id="scheduleadjustment_startofbreak_requestinfop">Start of Break : {initialValues.startBreak}</p>
            <p id="scheduleadjustment_endofbreak_requestinfop">End of Break : {initialValues.endBreak}</p>
            <p id="scheduleadjustment_shiftends_requestinfop">Shift Ends : {initialValues.endShift}</p>

            <p id="scheduleadjustment_status_requestinfop">Status : {initialValues.status}</p>
          </div>
        </Modal.Body>

      </Modal>
    </>} />
  )
}
