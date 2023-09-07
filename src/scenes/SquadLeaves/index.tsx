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
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)


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
  const [viewModalShow, setViewModalShow] = React.useState(false);
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
  const masterList = useSelector((state: any) => state.rootReducer.masterList)

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
            if (!tempArray.includes(element.holidayDate)) {
              tempArray.push(element.holidayDate)
            }
          });
          setHolidays(tempArray)
        }
      }
    )
  }, [])

  useEffect(() => {
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
    getAllLeaves(0, key)
  }, [dayTypes])

  const getAllLeaves = (page: any = 0, status: any = "all") => {
    setKey(status)
    let queryString = ""
    let filterDataTemp = { ...filterData }
    if (status != "") {
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

    if (data.profile.role == 'HR ADMIN' || data.profile.role == 'APPROVER') {
      RequestAPI.getRequest(
        `${Api.getAllSquadLeaves}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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

  const viewLeave = (id: any = 0) => {
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
            setViewModalShow(true)
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
          if (!holidays.includes(new_date_with_counter)) {
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
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "squadleave_approveconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "squadleave_approvecancel_alertbtn"
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      const loadingSwal = Swal.fire({
        title: '',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.approveLeave, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "squadleaves_errorconfirm_alertbtn"
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
        
                  if(confirmButton)
                    confirmButton.id = "squadleaves_successconfirm_alertbtn"
                },
                icon: 'success',
            })
              getAllLeaves(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "squadleaves_errorconfirm2_alertbtn"
              },
              icon: 'error',
          })
          }
        })
      }
    })
  }

  const declineLeave = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this leave.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "squadleave_declineconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "squadleave_declinecancel_alertbtn"
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
        RequestAPI.postRequest(Api.declineLeave, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "squadleaves_errorconfirm3_alertbtn"
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
        
                  if(confirmButton)
                    confirmButton.id = "squadleaves_successconfirm2_alertbtn"
                },
                icon: 'success',
            })
              getAllLeaves(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "squadleaves_errorconfirm4_alertbtn"
              },
              icon: 'error',
          })
          }
        })
      }
    })
  }


  const cancelLeave = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this leave.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "squadleave_declineconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "squadleave_declinecancel_alertbtn"
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
        RequestAPI.postRequest(Api.cancelLeave, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "squadleaves_errorconfirm5_alertbtn"
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
        
                  if(confirmButton)
                    confirmButton.id = "squadleaves_successconfirm3_alertbtn"
                },
                icon: 'success',
            })
              getAllLeaves(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "squadleaves_errorconfirm6_alertbtn"
              },
              icon: 'error',
          })
          }
        })
      }
    })
  }



  const leaveTable = useCallback(() => {
    return (
      <div>

        <Table responsive>
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Employee Name</th>
              <th style={{ width: 'auto' }}>Type</th>
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
              allLeaves &&
                allLeaves.content &&
                allLeaves.content.length > 0 ?
                <>
                  {
                    allLeaves.content.map((item: any, index: any) => {
                      return (
                        <tr>
                          <td id={"squadleaves_name_alleavesdata_" + item.id}> {item.lastName}, {item.firstName} </td>
                          <td id={"squadleaves_type_alleavesdata_" + item.id}> {item.type} </td>
                          <td id={"squadleaves_datefrom_alleavesdata_" + item.id}> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                          <td id={"squadleaves_dateto_alleavesdata_" + item.id}> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                          <td id={"squadleaves_reason_alleavesdata_" + item.id}> {item.reason} </td>
                          <td id={"squadleaves_statuschangedby_alleavesdata_" + item.id}> {item.statusChangedBy} </td>
                          <td id={"squadleaves_status_alleavesdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                          <td>
                            <label
                              id={"squadleaves_view_alleaveslabel_" + item.id}
                              onClick={() => {
                                viewLeave(item.id)
                              }}
                            >
                              <img id={"squadleaves_eye_alleavesimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                            </label>
                            <>
                              {authorizations.includes("Request:Update") && item.status == "PENDING" ? (
                                <>
                                  <label
                                    id={"squadleaves_actionedit_alleaveslabel_" + item.id}
                                    onClick={() => {
                                      getLeave(item.id)
                                    }}
                                    className="text-muted cursor-pointer">
                                    <img id={"squadleaves_actionedit_alleavesimg_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />

                                  </label>
                                </>
                              ) : null}

                              {authorizations.includes("Request:Approve") && item.status == "PENDING" ? (
                                <>
                                  <label
                                    id={"squadleaves_actionapprove_alleaveslabel_" + item.id}
                                    onClick={() => {
                                      approveLeave(item.id)
                                    }}
                                    className="text-muted cursor-pointer">
                                    <img id={"squadleaves_actionapprove_alleavesimg_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />

                                  </label>
                                </>
                              ) : null}

                              {authorizations.includes("Request:Reject") && item.status == "PENDING" ? (
                                <>
                                  <label
                                    id={"squadleaves_actiondecline_alleaveslabel_" + item.id}
                                    onClick={() => {
                                      declineLeave(item.id)
                                    }}
                                    className="text-muted cursor-pointer">
                                    <img id={"squadleaves_actiondecline_alleavesimg_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                                  </label>

                                </>
                              ) : null}
                            </>
                            <>
                              {authorizations.includes("Request:Update") && (item.status == "APPROVED" || item.status == "PENDING") ? (
                                <>
                                  <label
                                    id={"squadleaves_actioncancel_alleaveslabel_" + item.id}
                                    onClick={() => {
                                      cancelLeave(item.id)
                                    }}
                                    className="text-muted cursor-pointer">
                                    <img id={"squadleaves_actioncancel_alleavesimg_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                                  </label>

                                </>
                              ) : null}
                            </>
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
    getAllLeaves(event.selected, key)
  };

  const [values, setValues] = useState({
    type: ''
  });
  const setFieldValue = (e) => {
    setValues({ ...values, type: e.target.value });
  };
  const singleChangeOption = (option: any, name: any) => {

    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }
  return (
    <ContainerWrapper contents={<>
      <div className="w-100 px-3 py-5">
        <div className="row">
          <div className="col-md-12">
            {data.profile.role !== 'HR ADMIN' ? (
              // This code block will be rendered only if the user is an ADMIN
              <div>
                <h4 className="bold-text">Leave Credits </h4>
                {getMyLeaves.map((leave: any) => (
                  <div key={leave.id}>
                    <p><b id="squadleaves_leavesleft_mainlabel">{leave.leaveName} : {leave.creditsLeft}</b></p>
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
        </div>
        <div>
          <div className="w-100 pt-2">
            <div className="fieldtext d-flex col-md-6 w-100">
              <div className="" style={{ width: 200, marginRight: 10 }}>
                <label>Employee</label>
                <EmployeeDropdown
                  id="squadleaves_employee_maindropdown"
                  squad={true}
                  placeholder={"Employee"}
                  singleChangeOption={singleChangeOption}
                  name="userId"
                  value={filterData && filterData['userId']}
                />
              </div>
              <div>
                <label>Date From</label>
                <input
                  id="squadleaves_datefrom_maininput"
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
                    id="squadleaves_dateto_maininput"
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
              <div>
                <label>Leave Type</label>
                <select
                  className="form-select"
                  name="type"
                  id="squadleaves_leavetype"
                  value={values.type}
                  // onChange={(e) => makeFilterData(e)}
                  onChange={(e) => {
                    setFieldValue(e)
                    makeFilterData(e)
                  }}
                >
                  {leaveTypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                id="squadleaves_search_mainbtn"
                style={{ width: 120 }}
                onClick={() => getAllLeaves(0, key)}
                className="btn btn-primary mx-2 mt-4">
                Search
              </Button>
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setAllLeaves([])
                getAllLeaves(0, k)
              }}
              className="mb-3"
            >
              <Tab id="squadleaves_all_maintab" eventKey="all" title="All">
                {leaveTable()}
              </Tab>
              <Tab id="squadleaves_pending_maintab" eventKey="pending" title="Pending">
                {leaveTable()}
              </Tab>
              <Tab id="squadleaves_approved_maintab" eventKey="approved" title="Approved" >
                {leaveTable()}
              </Tab>
              <Tab id="squadleaves_declined_maintab" eventKey="declined" title="Rejected/Cancelled">
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
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "squadleaves_errorconfirm7_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "squadleaves_successconfirm4_alertbtn"
                        },
                        icon: 'success',
                    })
                      setLeaveBreakdown([])
                      getAllLeaves(0, key)
                      setModalShow(false)
                      formRef.current?.resetForm()
                    }
                  } else {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: (body.error && body.error.message) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "squadleaves_errorconfirm8_alertbtn"
                      },
                      icon: 'error',
                  })
                  }
                })
              } else {
                RequestAPI.postRequest(Api.requestLeaveCreate, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "squadleaves_errorconfirm9_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "squadleaves_successconfirm5_alertbtn"
                        },
                        icon: 'success',
                    })
                      setLeaveBreakdown([])
                      getAllLeaves(0, key)
                      setModalShow(false)
                      formRef.current?.resetForm()
                    }
                  } else {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: (body.error && body.error.message) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "squadleaves_errorconfirm10_alertbtn"
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
                  <div className="row w-100 px-5">
                    <div className="form-group col-md-12 mb-3 " >
                      <label>Leave Type</label>
                      <select
                        className="form-select"
                        name="type"
                        id="squadleaves_type2"
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
                        <p id="squadleaves_errortype_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
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
                        <p id="squadleaves_errordatefrom_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
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
                        <p id="squadleaves_errordateto_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
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
                        <p id="squadleaves_errorreason_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <Table responsive style={{ maxHeight: '100vh' }}>
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
                        id="squadleaves_save_modalbtn"
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

      <Modal
        show={viewModalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setLeaveId(null);
          setViewModalShow(false)
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
              Request For Leave/Time-off
            </Modal.Title> */}
          <Modal.Title id="contained-modal-title-vcenter">
            View Leave/Time-off Request
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
                        id="squadleaves_leavetype3"
                        value={values.type}
                        disabled={true}
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
                        <p id="squadleaves_errortype_modalreqp" style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Date From</label>
                      <input type="date"
                        name="dateFrom"
                        id="dateFrom"
                        className="form-control"
                        value={values.dateFrom}
                        disabled={true}
                        min={moment().format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                          // setDateFrom(e.target.value)
                          dateBreakdown(e.target.value, values.dateTo)
                        }}
                      />
                      {errors && errors.dateFrom && (
                        <p id="squadleaves_errordatefrom_modalreqp" style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
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
                        disabled={true}
                        onChange={(e) => {
                          // setDateTo(e.target.value)
                          setFormField(e, setFieldValue)
                          dateBreakdown(values.dateFrom, e.target.value)
                        }}
                      />
                      {errors && errors.dateTo && (
                        <p id="squadleaves_errordateto_modalreqp" style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Reason</label>
                      <input type="text"
                        name="reason"
                        id="reason"
                        className="form-control"
                        disabled={true}
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                      />
                      {errors && errors.reason && (
                        <p id="squadleaves_errorreason_modalreqp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <Table responsive style={{ maxHeight: '100vh' }}>
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
                                  <td id="squadleaves_date_modalreqdata" key={index + 'date'} >{date}</td>
                                  <td key={index} >
                                    <input
                                      type="radio"
                                      name={"leaveCredit" + index.toString()}
                                      id={"leaveCreditWhole" + index.toString()}
                                      checked={item.credit == 1}
                                      disabled={true}
                                      onChange={() => {
                                        setDateOption(index, 1, 'WHOLEDAY')
                                      }}
                                    />
                                    <label id="squadleaves_leavecreditwhole_modalreqlabel" htmlFor={"leaveCreditWhole" + index.toString()}
                                      style={{ marginRight: 10 }}>Whole Day</label>
                                    <input
                                      type="radio"
                                      name={"leaveCredit" + index.toString()}
                                      id={"leaveCreditDay" + index.toString()}
                                      checked={item.credit == 0.5}
                                      disabled={true}
                                      onChange={() => {
                                        setDateOption(index, .5, "FIRST_HALF")
                                      }}
                                    /> <label id="squadleaves_leavecreditday_modalreqlabel" htmlFor={"leaveCreditDay" + index.toString()}
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
                                            disabled={true}
                                            onChange={() => setDateOption(index, .5, "FIRST_HALF")}
                                          />
                                          <label htmlFor={"leaveCreditWhole1" + index.toString()}
                                            style={{ marginRight: 10 }}>First Half</label>
                                          <input
                                            type="radio"
                                            name={"dayTypes" + index.toString()}
                                            checked={item.dayType == 'SECOND_HALF'}
                                            id={"leaveCreditDay1" + index.toString()}
                                            disabled={true}
                                            onChange={() => setDateOption(index, .5, "SECOND_HALF")}
                                          />
                                          <label id="squadleaves_leavecreditday1_modalreqlabel" htmlFor={"leaveCreditDay1" + index.toString()}
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
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>} />
  )
}
