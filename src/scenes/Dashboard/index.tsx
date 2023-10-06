// import { useCallback, useEffect, useState } from "react"
// import UserTopMenu from "../../components/UserTopMenu"

// import { left, right } from "@popperjs/core"
// import moment from "moment"
// import { Button, Row, Col } from "react-bootstrap"
// import { useSelector } from "react-redux"
// import Swal from "sweetalert2"
// import withReactContent from "sweetalert2-react-content"
// import { Api, RequestAPI } from "../../api"
// import { bundy_clock } from "../../assets/images"
// import DashboardMenu from "../../components/DashboardMenu"
// import TimeDate from "../../components/TimeDate"
// import TimeCard from "../../widgets/timeCard"
// import AvailableLeaveCredits from "../../widgets/availableLeaveCredits"
// import EmployeeBasicProfile from "../../widgets/employeeBasicProfile"
// import MyBenefits from "../../widgets/myBenefits"
// import SquadDirectory from "../../widgets/employeeDirectory"
// import TeamCalendar from "../../widgets/teamCalendar"
// import AnnouncementBoard from "../../widgets/announcementBoard"
// import SquadTracker from "../../widgets/squadTracker"
// import ContainerWrapper from "../../components/ContainerWrapper"
// import Shortcut from "../../widgets/shortcut"
// import Reimbursement from "../../widgets/Reimbursement"
// import EmployeeDirectory from "../../widgets/employeeDirectory"
// import NewHire from "../../widgets/newHire"
// import Statistics from "../../widgets/statistics"
// import CompensationDepartment from "../../widgets/compensationDepartment"
// import PayRange from "../../widgets/payRange"
// import OtHours from "../../widgets/otHours"

// const ErrorSwal = withReactContent(Swal)

// export const Dashboard = (props: any) => {
//   const [ viewAnnouncement, setViewAnnouncement] = useState<any>([])
//   const { data } = useSelector((state: any) => state.rootReducer.userData)
  

  

//   useEffect(() => {
//     RequestAPI.getRequest(
//       `${Api.viewAnnouncement}`,
//       "",
//       {},
//       {},
//       async(res: any) => {
//         const { status, body = { data: {}, error: {} } }: any = res
//         if (status === 200 && body && body.data) {
//         setViewAnnouncement(body.data)
//         console.log(body.data);
//         } else {
//         }
//     }
//     )
//   },[])

//   const textArray = viewAnnouncement && viewAnnouncement.length > 0
//   ? viewAnnouncement.map((item, index) => (
//       <span key={index}>
//         {item.type} {item.subject}
//       </span>
//     ))
//   : null;

  
  

//   return (
//     <ContainerWrapper contents={
//     <div style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
//       <div>
//       <div className="marquee-container">
//         <div className="marquee-text">
//           {/* {textArray} */}
//         </div>
//       </div>
//         <div className="row" style={{ margin: '20px -2px' }}>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <EmployeeBasicProfile />
//             </div>
//           </div>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <TimeCard />
//             </div>
//           </div>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <AvailableLeaveCredits />
//             </div>
//           </div>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <MyBenefits />
//             </div>
//           </div>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <TeamCalendar />
//             </div>
//           </div>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <AnnouncementBoard />
//             </div>
//           </div>
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <SquadTracker />
//             </div>
//           </div>
//           { data.profile.role != 'EMPLOYEE' ? (
//             <>
//              <div className="col-sm-12 col-md-6 col-lg-4">
//               <div className="card">
//                 <Reimbursement />
//               </div>
//             </div>
            
//             </> 
//           ) : null}
//           { data.profile.role != 'EMPLOYEE' ? (
//             <>
//              <div className="col-sm-12 col-md-6 col-lg-4">
//               <div className="card">
//                 <EmployeeDirectory />
//               </div>
//             </div>
            
//             </> 
//           ) : null}
//           { data.profile.role != 'EMPLOYEE' ? (
//             <>
//              <div className="col-sm-12 col-md-6 col-lg-4">
//               <div className="card">
//                 <NewHire />
//               </div>
//             </div>
            
//             </> 
//           ) : null}
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <Statistics />
//             </div>
//           </div>
//           { data.profile.role == 'Finance' && 
//           (
//             <div>
//                <div className="col-sm-12 col-md-6 col-lg-4">
//                 <div className="card">
//                   <CompensationDepartment />
//                 </div>
//               </div>
//                <div className="col-sm-12 col-md-6 col-lg-4">
//                 <div className="card">
//                   <PayRange />
//                 </div>
//               </div>
//                <div className="col-sm-12 col-md-6 col-lg-4">
//                 <div className="card">
//                   <OtHours />
//                 </div>
//               </div>
//             </div>
//           )

//           }
//           <div className="col-sm-12 col-md-6 col-lg-4">
//             <div className="card">
//               <Shortcut />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>}
//   />
//   )
// }


import { useCallback, useEffect, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { left, right } from "@popperjs/core"
import moment from "moment"
import { Button } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import { bundy_clock } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
const ErrorSwal = withReactContent(Swal)

export const Dashboard = (props: any) => {
  const { history } = props
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [timeInData, setTimeInData] = useState<any>("")
  const [hasLogout, setHasLogout] = useState<any>(false)
  const [hasTimeIn, setHasTimeIN] = useState<any>(false)
  const [hasTimeOut, setHasTimeOut] = useState<any>(false)
  const [userSchedule, setUserSchedule] = useState<any>("");


  useEffect(() => {
    getFetchData(0)
    getMySchedule()

  }, [])
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
            confirmButton.id = "dashboard_loginconfirm_alertbtn"

          if(cancelButton)
            cancelButton.id = "dashboard_logincancel_alertbtn"
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
          
                    if(confirmButton)
                      confirmButton.id = "dashboard_errorconfirm_alertbtn"
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
                      confirmButton.id = "dashboard_successconfirm_alertbtn"
                  },
                  icon: 'success',
              })
                getFetchData(0)
              }
            } else {
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "Something Error.",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "dashboard_errorconfirm2_alertbtn"
                },
                icon: 'error',
            })
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
            confirmButton.id = "dashboard_logoutconfirm_alertbtn"

          if(cancelButton)
            cancelButton.id = "dashboard_logoutcancel_alertbtn"
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
          
                    if(confirmButton)
                      confirmButton.id = "dashboard_errorconfirm3_alertbtn"
                  },
                  icon: 'error',
              })
              } else {
                getFetchData(0)
                ErrorSwal.fire({
                  title: 'Success!',
                  text: (body.data) || "",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
          
                    if(confirmButton)
                      confirmButton.id = "dashboard_successconfirm2_alertbtn"
                  },
                  icon: 'success',
              })
              }
            } else {
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "Something Error.",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "dashboard_errorconfirm4_alertbtn"
                },
                icon: 'error',
            })
            }
          })

        }
      })
    }


  }, [timeInData])

  return (
    <ContainerWrapper contents={<>
      <div className="w-100 px-3 py-5">
        <div>
          <h3 className="bold-text pl-8">Time Card</h3>
          <div className="d-flex pl-8">
            <div className="" style={{ width: 200, textAlign: left }}>
              <h6 id="dashboard_shiftschedule_label" className="bold-text pt-2">Shift Schedule:</h6>
              <h6 id="dashboard_firstlogin_label" className="bold-text pt-2">First login:</h6>
              <h6 id="dashboard_lastlogout_label" className="bold-text pt-2">Last logout:</h6>
              <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2">Attendance Status:</h6>
            </div>
            <div className="" style={{ marginLeft: 15, textAlign: left }}>
              <h6 id="dashboard_shiftschedule_value" className="font-weight-bold pt-2">{moment(userSchedule.startShift, "HH:mm:ss").format("hh:mm A")} - {moment(userSchedule.endShift, "HH:mm:ss").format("hh:mm A")}</h6>


              <h6 id="dashboard_firstlogin_value" className="font-weight-bold pt-2">{timeInData && timeInData.firstLogin ? moment(timeInData.firstLogin).format("MM-DD-YYYY h:mm A") : 'N/A'}</h6>
              <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{timeInData && timeInData.lastLogin ? moment(timeInData.lastLogin).format("MM-DD-YYYY h:mm A") : 'N/A'}</h6>
              <label
                id="dashboard_attendancestatus_value"
                className="font-weight-bold p-2 px-3 text-dark mt-1"
                style={{ background: '#E9E9E9', width: 'auto', borderRadius: 5 }}>
                {/* { (hasTimeIn == true ) ? "Awaiting time out" : "Awaiting time in"} */}
                {((!hasTimeIn && !hasTimeOut) ? "Awaiting Log In" : (hasTimeIn && !hasTimeOut) ? "Awaiting Log Out" : (hasTimeIn && hasTimeOut) ? "Logged Out" : "")}
              </label>
            </div>
          </div>

        </div>
        <div className="d-flex" style={{ justifyContent: right, marginTop: 230 }}>
          <div>
            <div className="d-flex justify-content-center">
              <img id="dashboard_bundyclock_img" src={bundy_clock} className="Bundy Clock" />
            </div>
            <div className="row mt-3">
              <Button id="dashboard_timein_btn" className={hasTimeIn ? "mx-2 has-timeout-timeint-btn" : "mx-2"}
                style={{ width: 120 }}
                onClick={() => makeAttendance('time in')}
              >Time in</Button>
              <Button id="dashboard_timeout_btn" className={hasTimeOut ? "mx-2 has-timeout-timeint-btn" : "mx-2"}
                style={{ width: 120 }}
                onClick={() => makeAttendance('time out')}>Time out</Button>
            </div>
          </div>
        </div>
      </div>
    </>} />
  )
}
