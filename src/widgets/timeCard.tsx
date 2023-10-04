import React, { useCallback, useState, useEffect } from "react";
import { left, right } from "@popperjs/core"
import withReactContent from "sweetalert2-react-content"
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button } from "react-bootstrap";
import TimeDate from "../components/TimeDate";
import moment from "moment"
import { Bundy_icon, Bundy_icon_svg, TimeCard_Asset001 } from "../assets/images";
import Swal from "sweetalert2"


const ErrorSwal = withReactContent(Swal)


const TimeCard = () => {
    const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState(moment().format("dddd"));
    const [timeInData, setTimeInData] = useState<any>("")
    const [hasLogout, setHasLogout] = useState<any>(false)
    const [hasTimeIn, setHasTimeIN] = useState<any>(false)
    const [hasTimeOut, setHasTimeOut] = useState<any>(false)
    const [userSchedule, setUserSchedule] = useState<any>("");
    
    
    useEffect(() => {
        getFetchData(0)
        getMySchedule()
        const now = moment();
        const intervalId = setInterval(() => {
        setCurrentTime(moment().format("hh:mm:ss A"));
        setCurrentDate(moment().format("DD MMMM YYYY"));
        setCurrentDayOfWeek(now.format("dddd"));
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, []);

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
    const getFetchData = (pagging = 0) => {
        let today = moment().format("YYYY-MM-DD")
        RequestAPI.getRequest(
            `${Api.myTimeKeeping}?size=10&page=${pagging}&sortDir=desc&date=${today}`,
            "",
            {},
            {},
            async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 && body && body.data) {
                if (body.data.content.length > 0) {
                setTimeInData(body.data.content[0])
                if (body.data.content[0]) {
                    if (body.data.content[0].firstLogin) {
                    setHasTimeIN(true)
                    }
                    if (body.data.content[0].lastLogin) {
                    setHasTimeOut(true)
                    }
                }
                }
            }
            }
        )
    }
    const makeAttendance = useCallback((status: any) => {
        if (status == 'time in') {
          ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to log in.",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              const cancelButton = Swal.getCancelButton();
    
              if(confirmButton)
                confirmButton.id = "dashboardwidg_loginconfirm_alertbtn"
    
              if(cancelButton)
                cancelButton.id = "dashboardwidg_logincancel_alertbtn"
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me in!'
          }).then((result) => {
            if (result.isConfirmed) {
              RequestAPI.postRequest(Api.timeIn, "", {}, {}, async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                  if (body.error && body.error.message) {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: (body.error && body.error.message) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton)
                          confirmButton.id = "dashboardwidg_loginconfirmerr_alertbtn";
                      },
                      icon: 'error',
                    });
                  } else {
                    ErrorSwal.fire({
                      title: 'Success!',
                      text: (body.data) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton)
                          confirmButton.id = "dashboardwidg_loginconfirmsuccess_alertbtn";
                      },
                      icon: 'success',
                    });
                    getFetchData(0)
                  }
                } else {
                  ErrorSwal.fire({
                    title: 'Error!',
                    text: (body.error && body.error.message) || 'Something Error.',
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
                      if (confirmButton)
                        confirmButton.id = "dashboardwidg_loginconfirmerr2_alertbtn";
                    },
                    icon: 'error',
                  });
                }
              })
    
            }
          })
    
        } else if (status == 'time out') {
    
          ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to log out.",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              const cancelButton = Swal.getCancelButton();
    
              if(confirmButton)
                confirmButton.id = "dashboardwidg_logoutconfirm_alertbtn"
    
              if(cancelButton)
                cancelButton.id = "dashboardwidg_logoutcancel_alertbtn"
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me out!'
          }).then((result) => {
            if (result.isConfirmed) {
              RequestAPI.postRequest(Api.timeOut, "", {}, {}, async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                  if (body.error && body.error.message) {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: (body.error && body.error.message) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton)
                          confirmButton.id = "dashboardwidg_logoutconfirmerr_alertbtn";
                      },
                      icon: 'error',
                    });
                  } else {
                    getFetchData(0)
                    ErrorSwal.fire({
                      title: 'Success!',
                      text: (body.data) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton)
                          confirmButton.id = "dashboardwidg_logoutconfirmsuccess_alertbtn";
                      },
                      icon: 'success',
                    });
                  }
                } else {
                  ErrorSwal.fire({
                    title: 'Error!',
                    text: (body.error && body.error.message) || 'Something Error.',
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
                      if (confirmButton)
                        confirmButton.id = "dashboardwidg_logoutconfirmerr2_alertbtn";
                    },
                    icon: 'error',
                  });
                }
              })
    
            }
          })
        }
    
    
      }, [timeInData])



    return (
        <div className="time-card-width">
            <div className="card-header">
                <span className="">Time Card</span>
            </div>
            <div className="card-time-card">
                <div className="row">
                    <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                        <div className=" text-primary time-card-date" style={{textAlign: left}}>
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 date-header">
                            <h6>Today is</h6>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 date-header">
                            <h4>{currentDayOfWeek}, {currentDate}</h4>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex date-header">
                            <span className="time-size">{currentTime}</span>
                          </div>
                        </div>
                    </div>
                    <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 time-card-image-section">
                        <div className="time-card-image">
                            <img src={TimeCard_Asset001} width={500} className="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="time-card-body row time-space">
                {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
                    <div className="col-6" style={{ textAlign: 'left' }}>
                        <div className="">
                            <h6 id="dashboardwidg_shiftschedule_label" className="bold-text pt-2 pl-7 text-primary">Shift Schedule:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboardwidg_firstlogin_label" className="bold-text pt-3 pl-7 text-primary">First login:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboardwidg_lastlogout_label" className="bold-text pt-3 pl-7 text-primary">Last logout:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboardwidg_attendancestatus_label" className="bold-text pt-3 pl-7 text-primary">Attendance Status:</h6>
                        </div>
                    </div>
                    <div className="col-6 " style={{ textAlign: 'right' }}>
                        <h6 id="dashboardwidg_shiftschedule_value" className="font-weight-bold pt-2">{moment(userSchedule.startShift, "HH:mm:ss").format("hh:mm A")} - {moment(userSchedule.endShift, "HH:mm:ss").format("hh:mm A")}</h6>
                        <h6 id="dashboardwidg_firstlogin_value" className="font-weight-bold pt-3">{timeInData && timeInData.firstLogin ? moment(timeInData.firstLogin).format("MM-DD-YYYY h:mm A") : 'Not Timed In'}</h6>
                        <h6 id="dashboardwidg_lastlogout_value" className="font-weight-bold pt-3">{timeInData && timeInData.lastLogin ? moment(timeInData.lastLogin).format("MM-DD-YYYY h:mm A") : 'Not Logged Out'}</h6>
                        <label
                            id="dashboardwidg_attendancestatus_value"
                            className={`bold-text p-2 px-3 pt-2 mt-2  ${(!hasTimeIn && !hasTimeOut) ? 'status_blue' : (hasTimeIn && !hasTimeOut) ? 'status_red' : (hasTimeIn && hasTimeOut) ? 'status_green' : ''}`}
                            style={{
                                background: '#E9E9E9',
                                borderRadius: 5,
                                width: 'auto',
                                textAlign: 'right'
                            
                            }}>
                            {((!hasTimeIn && !hasTimeOut) ? "Awaiting Log In" : (hasTimeIn && !hasTimeOut) ? "Awaiting Log Out" : (hasTimeIn && hasTimeOut) ? "Logged Out" : "")}
                        </label>
                    </div>
                    
                    
            </div>
              <div className="row d-flex justify-content-center mx-2">
                <div className="col-6">
                  <Button id="dashboardwidg_timein_btn" className={hasTimeIn ? " has-timeout-timeint-btn" : ""}
                      style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => makeAttendance('time in')}
                  >Time in</Button>
                </div>
                <div className="col-6">
                  <Button id="dashboardwidg_timeout_btn" className={hasTimeOut ? " has-timeout-timeint-btn" : ""}
                      style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => makeAttendance('time out')}>Time out</Button>
                </div>
                
                
              </div>

           
            
        </div>
       
    )
}

export default TimeCard