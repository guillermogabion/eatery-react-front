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
import http from "../../helpers/axios"

const ErrorSwal = withReactContent(Swal)

export const Leaves = (props: any) => {
  const { history } = props
  let initialPayload = {
    "dateFrom": "",
    "dateTo": "",
    "type": 1,
    "status": "PENDING",
    "reason": "",
    "breakdown": [],
    "file": null
  }
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [viewModalShow, setViewModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [actionable, setIsActionable] = React.useState(false);
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

  const [selectedDate, setSelectedDate] = useState(null);



  const formRef: any = useRef()

  const [values, setValues] = useState({
    dateFrom: '',
    dateTo: '',
  });


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



  const getAllLeaves = (page: any = 0, status: any = "all", isActionable: any = false) => {
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
        `${Api.allRequestLeave}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
    } else {
      RequestAPI.getRequest(
        `${Api.allMyRequestLeave}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
    let leavesBreakdown = [];
    let dayTypesArray = [];
    let diffInDays = date2.diff(date1, 'days') + 1;
    let dateCounter = 0;

    for (let index = 1; index <= diffInDays; index++) {
      var added_date = moment(dFrom).add(dateCounter, 'days');
      let new_date = new Date(added_date.format('YYYY-MM-DD'));

      if (new_date.getDay() == 0 || new_date.getDay() == 6) {
        dateCounter += 1;
      } else if (new_date.getDay() == 6) {
        dateCounter += 2;
      } else {
        let new_date_with_counter = moment(dFrom).add(dateCounter, 'days').format('YYYY-MM-DD');
        if (!holidays.includes(new_date_with_counter)) {
          leavesBreakdown.push({
            "date": new_date_with_counter,
            "credit": 1,
            "dayType": 'WHOLEDAY'
          });
        }
        dayTypesArray.push(false);
        dateCounter += 1;
      }
    }

    setDayTypes(dayTypesArray);
    setLeaveBreakdown(leavesBreakdown);

    if (leavesBreakdown.length <= 30) {
      console.log(leavesBreakdown.length);
    } else {

      if (!leaveId) {
        initialValues.breakdown = [];
        setLeaveBreakdown([]);
        setDayTypes([]);
        formRef.current?.resetForm();
      } else {
        leavesBreakdown.pop();
        setModalShow(false)
      }

      Swal.fire({
        title: 'Error',
        text: 'Total number of leave should not exceed 30 days',
        icon: 'error',
        confirmButtonText: 'OK',
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();

          if (confirmButton)
            confirmButton.id = "leaves_errorconfirm_alertbtn"
        }
      });
    }
  };





  // const dateBreakdown = (dFrom: any, dTo: any) => {
  //   const date1 = moment(dFrom);
  //   const date2 = moment(dTo);
  //   let leavesBreakdown = []
  //   let dayTypesArray = []
  //   let diffInDays = date2.diff(date1, 'days') + 1;
  //   let dateCounter = 0

  //   if (diffInDays >= 1 && leavesBreakdown.length <= 30) {
  //     for (let index = 1; index <= diffInDays; index++) {
  //       var added_date = moment(dFrom).add(dateCounter, 'days');
  //       let new_date = new Date(added_date.format('YYYY-MM-DD'))


  //       if (new_date.getDay() == 0 || new_date.getDay() == 6) {
  //         dateCounter += 1
  //       } else if (new_date.getDay() == 6) {
  //         dateCounter += 2
  //       } else {
  //         let new_date_with_counter = moment(dFrom).add(dateCounter, 'days').format('YYYY-MM-DD')
  //         if (!holidays.includes(new_date_with_counter)) {
  //           leavesBreakdown.push({
  //             "date": new_date_with_counter,
  //             "credit": 1,
  //             "dayType": 'WHOLEDAY'
  //           })
  //         }
  //         dayTypesArray.push(false)
  //         dateCounter += 1
  //       }
  //     }
  //     setDayTypes(dayTypesArray)
  //     setLeaveBreakdown(leavesBreakdown)


  //     console.log(leavesBreakdown.length)

  //   }
  //   else if (leavesBreakdown.length > 30) {
  //     initialValues.breakdown = [];
  //     setLeaveBreakdown([]);
  //     setDayTypes([]);
  //     setLeaveBreakdown([]);
  //     formRef.current?.resetForm();
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'Date counter should not exceed 30 days',
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });



  //   }

  //   else {
  //     setDayTypes([])
  //     setLeaveBreakdown([])
  //   }
  // }


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
      confirmButtonText: 'Yes, proceed!',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "leaves_approveleaveconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "leaves_approveleavecancel_alertbtn"
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: '',
        //   allowOutsideClick: false,
        //   didOpen: () => {
        //     Swal.showLoading();
        //   }
        // });
        getAllLeaves(0, key)
        // RequestAPI.postRequest(Api.approveLeave, "", { "id": id }, {}, async (res: any) => {
        //   const { status, body = { data: {}, error: {} } }: any = res
        //   if (status === 200 || status === 201) {
        //     if (body.error && body.error.message) {
        //       Swal.close()
        //       ErrorSwal.fire({
        //         title: 'Error!',
        //         text: (body.error && body.error.message) || "",
        //         didOpen: () => {
        //           const confirmButton = Swal.getConfirmButton();

        //           if (confirmButton)
        //             confirmButton.id = "login_errorconfirm2_alertbtn"
        //         },
        //         icon: 'error',
        //       })
        //     } else {
        //       Swal.close()
        //       ErrorSwal.fire({
        //         title: 'Success!',
        //         text: (body.data) || "",
        //         didOpen: () => {
        //           const confirmButton = Swal.getConfirmButton();

        //           if (confirmButton)
        //             confirmButton.id = "login_successconfirm_alertbtn"
        //         },
        //         icon: 'success',
        //       })
        //       getAllLeaves(0, key)
        //     }
        //   } else {
        //     Swal.close()
        //     ErrorSwal.fire({
        //       title: 'Error!',
        //       text: "Something Error.",
        //       didOpen: () => {
        //         const confirmButton = Swal.getConfirmButton();

        //         if (confirmButton)
        //           confirmButton.id = "login_errorconfirm3_alertbtn"
        //       },
        //       icon: 'error',
        //     })
        //   }
        // })
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
      confirmButtonText: 'Yes, proceed!',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "leaves_declineleaveconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "leaves_declineleavecancel_alertbtn"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
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

                  if (confirmButton)
                    confirmButton.id = "login_errorconfirm4_alertbtn"
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
                    confirmButton.id = "login_successconfirm2_alertbtn"
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

                if (confirmButton)
                  confirmButton.id = "login_errorconfirm5_alertbtn"
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "leaves_cancelleaveconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "leaves_cancelleavecancel_alertbtn"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
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

                  if (confirmButton)
                    confirmButton.id = "login_errorconfirm6_alertbtn"
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
                    confirmButton.id = "login_successconfirm3_alertbtn"
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

                if (confirmButton)
                  confirmButton.id = "login_errorconfirm7_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }

  const getNextWeekday = (date, count) => {
    let nextWeekday = new Date(date.getTime());

    for (let i = 0; i < count; i++) {
      nextWeekday.setDate(nextWeekday.getDate() + 1);
      while (nextWeekday.getDay() === 0 || nextWeekday.getDay() === 6) {
        nextWeekday.setDate(nextWeekday.getDate() + 1);
      }
    }

    return nextWeekday;
  };

  const handleDateFromChange = (e) => {
    const { value } = e.target;
    setValues((prevState) => ({ ...prevState, dateFrom: value }));
  }

  const handleDateToChange = (e) => {
    const { value } = e.target;
    setValues((prevState) => ({ ...prevState, dateTo: value }));
  }

  const maxDate = getNextWeekday(new Date()).toISOString().split("T")[0];

  function calculateWorkingDays(startDate, endDate) {
    let currentDate = new Date(startDate);
    let totalDays = 0;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
        totalDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDays;
  }
  function limitText(text, limit) {
    if (text.length <= limit) {
      return text;
    } else {
      return text.substring(0, limit) + '...';
    }
  }
  const leaveTable = useCallback(() => {
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
              <th style={{ width: 'auto' }}>Type</th>
              <th style={{ width: 'auto' }}>Date From</th>
              <th style={{ width: 'auto' }}>Date To</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Date Filed</th>
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
                          {
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                              <>
                                <td id="leaves_name_allleavedata"> {item.lastName}, {item.firstName} </td>
                              </> : null
                          }

                          <td id="leaves_type_allleavedata"> {item.type} </td>
                          {/* <td> {item.dateFrom} </td>
                          <td> {item.dateTo} </td> */}
                          <td id="leaves_datefrom_allleavedata"> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                          <td id="leaves_dateto_allleavedata"> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                          <td id="leaves_reason_allleavedata"> {limitText(item.reason, 20)} </td>
                          <td id="leaves_filedate_allleavedata"> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                          <td id="leaves_statuschangedby_allleavedata"> {item.statusChangedBy} </td>
                          {/* <td> {item.status} </td> */}
                          <td id="leaves_status_allleavedata"> {Utility.removeUnderscore(item.status)} </td>
                          <td className="d-flex">
                            <label
                              id="leaves_view_allleavelabel"
                              onClick={() => {
                                viewLeave(item.id)
                              }}
                            >
                              <img id="leaves_eye_allleaveimg" src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                            </label>
                            {
                              item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED" ?
                                <>
                                  {authorizations.includes("Request:Update") ? (
                                    <>
                                      <label
                                        id="leaves_name_allleavelabel"
                                        onClick={() => {
                                          getLeave(item.id)
                                        }}
                                        className=" cursor-pointer">
                                        <img id="leaves_actionedit_allleaveimg" src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                      </label>
                                      <br />
                                    </>
                                  ) : null}

                                  {authorizations.includes("Request:Approve") && data.profile.role == 'EXECUTIVE' ? (
                                    <>
                                      <label
                                        id="leaves_approveleave_allleavelabel"
                                        onClick={() => {
                                          approveLeave(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        <img id="leaves_actionapprove_allleaveimg" src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                      </label> <br />
                                    </>
                                  ) : null}

                                  {authorizations.includes("Request:Reject") && data.profile.role == 'EXECUTIVE' ? (
                                    <>
                                      <label
                                        id="leaves_declineleave_allleavelabel"
                                        onClick={() => {
                                          declineLeave(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        <img id="leaves_actiondecline_allleaveimg" src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
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
                                        id="leaves_cancelleave_allleavelabel"
                                        onClick={() => {
                                          cancelLeave(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        <img id="leaves_actioncancel_allleaveimg" src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
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

  const singleChangeOption = (option: any, name: any) => {

    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }
  return (

    <ContainerWrapper contents={<>
      <div className="w-100 px-5 py-5" style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
        <div>
          <div className="w-100 pt-2">
            {data.profile.role !== 'EXECUTIVE' ? (
              <div>
                <h4 className="bold-text">Leave Credits </h4>
                {getMyLeaves.map((leave: any) => (
                  <div key={leave.id}>
                    <p id="leaves_name_leavecreditsp"><b>{leave.leaveName} : {leave.creditsLeft}</b></p>
                  </div>
                ))}
              </div>
            ) : (
              null
            )}
            <div className="row d-flex pb-1">
              {
                data.profile.role == 'EXECUTIVE' ?
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2" style={{paddingRight: '0'}}>
                    <label>Employee</label>
                    <EmployeeDropdown
                      id="leaves_employee_leavecreditsdropdown"
                      placeholder={"Employee"}
                      singleChangeOption={singleChangeOption}
                      name="userId"
                      value={filterData && filterData['userId']}
                    />
                  </div>
                  :
                  null
              }

              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-3 col-lg-2" : "col-xs-12 col-sm-12 col-md-4 col-lg-2"} style={{ margin: '0', paddingRight: '0' }}>
                <label>Date From</label>
                <input
                  id="leaves_datefrom_leavecreditsinput"
                  name="dateFrom"
                  type="date"
                  autoComplete="off"
                  className="formControl"
                  maxLength={40}
                  onChange={(e) => makeFilterData(e)}
                  onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                />
              </div>
              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-3 col-lg-2" : "col-xs-12 col-sm-12 col-md-4 col-lg-2"} style={{ margin: '0', paddingRight: '0' }}>
                <label>Date To</label>
                <input
                  id="leaves_dateto_leavecreditsinput"
                  name="dateTo"
                  type="date"
                  autoComplete="off"
                  className="formControl"
                  maxLength={40}
                  onChange={(e) => makeFilterData(e)}
                  onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                />
              </div>
              <div className={data.profile.role === 'EXECUTIVE' ? "col-xs-12 col-sm-12 col-md-3 col-lg-1 mt-4" : "col-xs-12 col-sm-12 col-md-4 col-lg-1 mt-4"} style={{ margin: '0', paddingLeft: '8px' }}>
                <Button
                  id="leaves_search_leavecreditsbtn"
                  style={{ width: '100%'}}
                  onClick={() => getAllLeaves(0, key, actionable)}
                  className="btn btn-primary mx-1 customed-button">
                  Search
                </Button>
              </div>


            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setAllLeaves([])
                if (k == 'actionable') {
                  getAllLeaves(0, k, true)
                } else {
                  getAllLeaves(0, k)
                }

              }}
              className="mb-3"
            >
              <Tab id="leaves_all_leavecreditstab" eventKey="all" title="All">
                {leaveTable()}
              </Tab>
              <Tab id="leaves_pending_leavecreditstab" eventKey="pending" title="Pending">
                {leaveTable()}
              </Tab>
              <Tab id="leaves_approved_leavecreditstab" eventKey="approved" title="Approved" >
                {leaveTable()}
              </Tab>
              <Tab id="leaves_declined_leavecreditstab" eventKey="declined" title="Rejected/Cancelled">
                {leaveTable()}
              </Tab>

              {
                data.profile.role == 'EXECUTIVE' &&
                (
                  <Tab id="leaves_actionable_leavecreditstab" eventKey="actionable" title="Actionable">
                    {leaveTable()}
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
              <Button
                id="leaves_requestforleave_leavecreditsbtn"
                className="mx-2"
                onClick={() => {
                  setInitialValues(initialPayload)
                  setLeaveBreakdown([])
                  setLeaveId("")
                  setModalShow(true)
                }}>Request Leave/Time-off</Button>
            </div>
          </div>
        ) : null}

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
          <Modal.Title id="contained-modal-title-vcenter" className="text-center mx-auto">
            {leaveId ? 'Edit Leave/Time-off Request' : 'Request Leave/Time-off'}
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
                status: Yup.string().required("Status is required !"),
                type: Yup.string().required("Status is required !"),
              })
            }
            onSubmit={(values, actions) => {

              const dateFromChecker = new Date(values.dateFrom);
              const currentDateChecker = new Date();
              const timeDifferenceInMilliseconds = dateFromChecker.getTime() - currentDateChecker.getTime();
              const timeDifferenceInDays = calculateWorkingDays(currentDateChecker, dateFromChecker);
              const breakdownLength = leaveBreakdown.length;
              console.log("breakdownLength:", breakdownLength);

              if (breakdownLength >= 8 && values.type === 1) {
                ErrorSwal.fire({
                  title: 'Error!',
                  text: `Leave type SICK LEAVE must not exceed 7 working days. The user requested a total of ${breakdownLength} days`,
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
                    if (confirmButton)
                      confirmButton.id = "login_errorconfirm13_alertbtn";
                  },
                  icon: 'error',
                });
              } else if (timeDifferenceInDays >= 7 && values.type === 1) {
                ErrorSwal.fire({
                  title: 'Error!',
                  text: "Selected 'Date From' must be within 7 working days from the date of selection.",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
                    if (confirmButton)
                      confirmButton.id = "login_errorconfirm14_alertbtn";
                  },
                  icon: 'error',
                });
              } else {
                const loadingSwal = Swal.fire({
                  title: '',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                const formData = new FormData();
                formData.append('dateFrom', values.dateFrom);
                formData.append('dateTo', values.dateTo);
                formData.append('type', values.type);
                formData.append('status', values.status);
                formData.append('reason', values.reason);

                leaveBreakdown.forEach((item: any, index: any) => {
                  formData.append(`breakdown[${index}].date`, item.date);
                  formData.append(`breakdown[${index}].credit`, item.credit);
                  formData.append(`breakdown[${index}].dayType`, item.dayType);
                })

                if (values.file) {
                  formData.append("file", values.file);
                }

                return http
                  .post(`${Api.requestLeaveCreate}`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${Utility.getUserToken() || ""}`,
                      credentials: true,
                    },
                  })
                  .then((response) => {
                    if (response.data.error) {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: response.data.error.message || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                          if (confirmButton)
                            confirmButton.id = "leave_errorconfirm4_alertbtn";
                        },
                        icon: 'error',
                      });
                      return

                    } else {
                      Swal.fire({
                        title: 'Success!',
                        text: response.data.data || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                          if (confirmButton)
                            confirmButton.id = "leave_successconfirm4_alertbtn";
                        },
                        icon: 'success',
                      });
                      setLeaveId(null);
                      setModalShow(false)
                    }

                    return response;
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: error.data.data || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton)
                          confirmButton.id = "login_errorconfirm8_alertbtn";
                      },
                      icon: 'error',
                    });
                  });
              };

            }}>
            {({ values, setFieldValue, handleSubmit, errors, touched }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                  <div className="row px-2">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3 " >
                      <label>Leave Type</label>
                      <select
                        className="form-select"
                        name="type"
                        id="leaves_leavetype"
                        value={values.type}
                        // onChange={(e) => setFormField(e, setFieldValue)}>
                        onChange={(e) => {
                          setFormField(e, setFieldValue);
                        }}
                      >
                        {leaveTypes &&
                          leaveTypes.length &&
                          leaveTypes.map((item: any, index: string) => (
                            <option key={`${index}_${item.id}`} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      {errors && errors.type && (
                        <p id="leaves_errortype_leavecreditsp" style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                      )}
                    </div>
                    <div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6 pt-4 mb-2">
                      <input type="file" accept=".jpg, .png, .pdf, .doc" name="fileInput" style={{ width: '100%' }} className="file-input-style" onChange={(e) => {
                        // Set the 'file' property in form values to the selected file
                        setFieldValue("file", e.currentTarget.files[0]);
                      }} />
                      <small className="text-muted" style={{ lineHeight: "0" }}>(3MB maximum file size. Allowed file types; jpg, png, pdf, doc)</small>
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Date From </label>
                      <input type="date"
                        name="dateFrom"
                        id="dateFrom"
                        className="form-control"
                        value={values.dateFrom}
                        // max={(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                          dateBreakdown(e.target.value, values.dateTo)
                        }}
                        placeholder="dd/mm/yyyy"
                      />
                      {errors && errors.dateFrom && (
                        <p id="leaves_errordatefrom_leavecreditsp" style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
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
                          if (leaveBreakdown.length > 30) {
                            const lastDate = leaveBreakdown[29].date;
                            setFieldValue('dateTo', values.dateTo);
                          }
                        }}
                      />


                      {errors && errors.dateTo && (
                        <p id="leaves_errordateto_leavecreditsp" style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Reason</label>
                      <textarea
                        name="reason"
                        id="reason"
                        className={`form-control p-2${touched.reason && errors.reason ? 'is-invalid' : ''}`}
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                        style={{height: '150px'}}
                      />
                      {errors && errors.reason && (
                        <p id="leaves_reason_leavecreditsp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
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
                            leaveBreakdown.length > 0 &&
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
                                    <label id="leaves_wholeday_leavebreakdownlabel" htmlFor={"leaveCreditWhole" + index.toString()}
                                      style={{ marginRight: 10 }}>Whole Day</label>
                                    <input
                                      type="radio"
                                      name={"leaveCredit" + index.toString()}
                                      id={"leaveCreditDay" + index.toString()}
                                      checked={item.credit == 0.5}
                                      onChange={() => {
                                        setDateOption(index, .5, "FIRST_HALF")
                                      }}
                                    /> <label id="leaves_halfday_leavebreakdownlabel" htmlFor={"leaveCreditDay" + index.toString()}
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
                                          <label id="leaves_leavecreditfirsthalf_leavebreakdownlabel" htmlFor={"leaveCreditWhole1" + index.toString()}
                                            style={{ marginRight: 10 }}>First Half</label>
                                          <input
                                            type="radio"
                                            name={"dayTypes" + index.toString()}
                                            checked={item.dayType == 'SECOND_HALF'}
                                            id={"leaveCreditDay1" + index.toString()}
                                            onChange={() => setDateOption(index, .5, "SECOND_HALF")}
                                          />
                                          <label id="leaves_leavecreditsecondhalf_leavebreakdownlabel" htmlFor={"leaveCreditDay1" + index.toString()}
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
                      {
                        leaveBreakdown &&
                          leaveBreakdown.length == 0 ?
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
                    <button
                            id="leaves_save1_leavebreakdownbtn"
                            disabled={!leaveBreakdown.length}
                            type="submit"
                            className="btn btn-primary">
                            Save
                          </button>
                      {/* {
                        leaveBreakdown && leaveBreakdown.length == 0 && leaveBreakdown.length > 30 ?

                          <button
                            id="leaves_save1_leavebreakdownbtn"
                            disabled
                            type="submit"
                            className="btn btn-primary">
                            Save
                          </button> :
                          <button
                            id="leaves_save2_leavebreakdownbtn"
                            type="submit"
                            className="btn btn-primary"
                          >
                            Save
                          </button>
                      } */}
                    </div>
                  </Modal.Footer>
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* End Create User Modal Form */}

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
                status: Yup.string().required("Status is required !"),
                type: Yup.string().required("Status is required !"),
              })
            }
            onSubmit={(values, actions) => {

            }}>
            {({ values, setFieldValue, handleSubmit, errors, touched }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                  <div className="row px-2">
                    <div className="form-group col-md-12 mb-3 " >
                      <label>Leave Type</label>
                      <select
                        className="form-select"
                        name="type"
                        id="leaves_formleavetype"
                        value={values.type}
                        // onChange={(e) => setFormField(e, setFieldValue)}>
                        disabled={true}
                        onChange={(e) => {
                          setFormField(e, setFieldValue);
                        }}


                      >
                        {leaveTypes &&
                          leaveTypes.length &&
                          leaveTypes.map((item: any, index: string) => (
                            <option key={`${index}_${item.id}`} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      {errors && errors.type && (
                        <p id="leaves_errortype_leavereqp" style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Date From</label>
                      <input type="date"
                        onKeyDown={(e) => e.preventDefault()}
                        name="dateFrom"
                        id="leaves_inputdate_dateFrom"
                        className="form-control"
                        disabled={true}
                        value={values.dateFrom}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                          // setDateFrom(e.target.value)
                          dateBreakdown(e.target.value, values.dateTo)
                        }}
                        // min={values.type == 1 ? new Date(Date.now()).toISOString().split("T")[0] : undefined} 
                        // max={values.type == 1 ? new Date(Date.now()).toISOString().split("T")[0] : undefined} 
                        // max={values.type == 1 ? getNextWeekday(Date.now()).toISOString().split("T")[0] : undefined} 
                        max={values.type == 1 ? getNextWeekday(new Date(!values.dateFrom ? new Date(Date.now()).toISOString().split("T")[0] : values.dateFrom), 6).toISOString().split('T')[0] : values.dateTo}

                        placeholder="dd/mm/yyyy"
                        maxLength={10}
                      />
                      {errors && errors.dateFrom && (
                        <p id="leaves_errordatefrom_leavereqp" style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Date To</label>
                      <input type="date"
                        disabled={true}
                        onKeyDown={(e) => e.preventDefault()}
                        name="dateTo"
                        id="leaves_inputdate_dateTo"
                        className="form-control"
                        value={values.dateTo}
                        min={values.dateFrom}
                        max={values.type == 1 ? getNextWeekday(new Date(!values.dateFrom ? new Date(Date.now()).toISOString().split("T")[0] : values.dateFrom), 6).toISOString().split('T')[0] : undefined}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)

                          dateBreakdown(values.dateFrom, e.target.value)
                        }}
                      />


                      {errors && errors.dateTo && (
                        <p id="leaves_errordateto_leavereqp" style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Reason</label>
                      <input type="text"
                        disabled={true}
                        name="reason"
                        id="leaves_inputtype_reason"
                        className="form-control"
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                      />
                      {errors && errors.reason && (
                        <p id="leaves_errorreason_leavereqp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
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
                            leaveBreakdown.length > 0 &&
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
                                      disabled={true}
                                      onChange={() => {
                                        setDateOption(index, 1, 'WHOLEDAY')
                                      }}
                                    />
                                    <label id="leaves_wholeday_leavereqlabel" htmlFor={"leaveCreditWhole" + index.toString()}
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
                                    /> <label id="leaves_halfday_leavereqlabel" htmlFor={"leaveCreditDay" + index.toString()}
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
                                          <label id="leaves_firsthalf_leavereqlabel" htmlFor={"leaveCreditWhole1" + index.toString()}
                                            style={{ marginRight: 10 }}>First Half</label>
                                          <input
                                            type="radio"
                                            name={"dayTypes" + index.toString()}
                                            checked={item.dayType == 'SECOND_HALF'}
                                            id={"leaveCreditDay1" + index.toString()}
                                            disabled={true}
                                            onChange={() => setDateOption(index, .5, "SECOND_HALF")}
                                          />
                                          <label id="leaves_secondhalf_leavereqlabel" htmlFor={"leaveCreditDay1" + index.toString()}
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
                      {
                        leaveBreakdown &&
                          leaveBreakdown.length == 0 ?
                          <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                          </div>
                          :
                          null
                      }
                    </div>
                  </div>
                  <br />
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>} />
  )
}
