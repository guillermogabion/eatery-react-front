import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Image } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import { bundy_clock } from "../../assets/images"
import { useSelector, useDispatch } from "react-redux"

export const Dashboard = (props: any) => {
  const { history } = props
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [timeInData, setTimeInData] = useState<any>("")
  const [hasLogout, setHasLogout] = useState<any>(false)
  const [hasTimeIn, setHasTimeIN] = useState<any>(false)
  const [hasTimeOut, setHasTimeOut] = useState<any>(false)


  useEffect(() => {
    getFetchData(0)
  }, [])
  
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
            if(body.data.content.length > 0){
                setTimeInData(body.data.content[0])
                if(body.data.content[0]){
                  if(body.data.content[0].firstLogin){
                    setHasTimeIN(true)
                  }
                  if(body.data.content[0].lastLogin){
                    setHasTimeOut(true)
                  }
                }
            }
          }
        }
      )
  }

  const makeAttendance = useCallback((status: any) => {
    if (status == 'time in'){
      ErrorSwal.fire({
        title: 'Are you sure?',
        text: "You want to log in.",
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
              if (body.error && body.error.message){
                ErrorSwal.fire(
                  'Error!',
                  (body.error && body.error.message) || "",
                  'error'
                )
              }else{
                ErrorSwal.fire(
                  'Success!',
                  (body.data) || "",
                  'success'
                )
                getFetchData(0)
              }
            }else{
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || 'Something Error.',
                'error'
              )
            }
          })
          
        }
      })
      
    }else if(status == 'time out'){
      
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to log out.",
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
                  if (body.error && body.error.message){
                    ErrorSwal.fire(
                      'Error!',
                      (body.error && body.error.message) || "",
                      'error'
                    )
                  }else{
                    getFetchData(0)
                    ErrorSwal.fire(
                      'Success!',
                      (body.data) || "",
                      'success'
                    )
                    
                  }
                }else{
                  ErrorSwal.fire(
                    'Error!',
                    (body.error && body.error.message) || 'Something Error.',
                    'error'
                  )
                }
              })
              
            }
          })
      }
      
    
  }, [timeInData])

  return (
    <div className="body">
      <div className="wraper">
        <div className="w-100">
            <div className="topHeader">
              <UserTopMenu />
            </div>
            <div className="contentContainer row p-0 m-0" style={{ minHeight:'100vh' }}>
              <DashboardMenu />
              <div className="col-md-12 col-lg-10 px-5 py-5">
                <div className="row">
                    <div className="col-md-6">
                      <h2>Good Day, {userData.data.profile.firstName}!</h2>
                    </div>
                    <div className="col-md-6">
                      <TimeDate />
                    </div>
                </div>
                <div>
                    <h3><b></b>Time Card</h3>
                    <div className="d-flex">
                      <div className="" style={{width: 200, textAlign: left}}>
                          <h6 className="font-weight-bold pt-2">Shift Schedule:</h6>
                          <h6 className="font-weight-bold pt-2">First login:</h6>
                          <h6 className="font-weight-bold pt-2">Last logout:</h6>
                          <h6 className="font-weight-bold pt-2">Attendance Status:</h6>
                      </div>
                      <div className="" style={{marginLeft:15, textAlign: left}}>
                          <h6 className="font-weight-bold pt-2">09:00 AM - 06:00 PM</h6>
                          <h6 className="font-weight-bold pt-2">{ timeInData && timeInData.firstLogin ?  moment(timeInData.firstLogin).format("DD MMMM YYYY h:mm:ss A") : 'n/a'}</h6>
                          <h6 className="font-weight-bold pt-2">{ timeInData && timeInData.lastLogin ?  moment(timeInData.lastLogin).format("DD MMMM YYYY h:mm:ss A") : 'n/a'}</h6>
                          <label 
                            className="font-weight-bold p-2 px-3 text-dark" 
                            style={{background:'#E9E9E9', width: 'auto', borderRadius:5}}>
                            { (timeInData ) ? "Awaiting time out" : "Awaiting time in"}
                          </label>
                      </div>
                    </div>
                    
                </div>
                <div className="d-flex" style={{justifyContent:right, marginTop: 230}}>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img src={bundy_clock} className="Bundy Clock"/>
                    </div>
                    <div className="row mt-3">
                      <Button className={ hasTimeIn ? "mx-2 has-timeout-timeint-btn" : "mx-2"}
                        style={{width: 120}}
                        onClick={() => makeAttendance('time in')}
                        >Time in</Button>
                      <Button className={ hasTimeOut ? "mx-2 has-timeout-timeint-btn" : "mx-2"}
                        style={{width: 120}}
                        onClick={() => makeAttendance('time out')}>Time out</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
