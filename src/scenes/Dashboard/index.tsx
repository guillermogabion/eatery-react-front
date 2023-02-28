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



export const Dashboard = (props: any) => {
  const { history } = props
  const [userId, setUserId] = useState<any>("1")
  const [timeInData, setTimeInData] = useState<any>("")

  useEffect(() => {
    getFetchData(0)
  }, [userId])
  

  const getFetchData = (pagging = 0) => {
    let today = moment().format("YYYY-MM-DD")

    RequestAPI.getRequest(
        `${Api.timeKeeping}?size=10&page=${pagging}&userid=${userId}&dateBefore=${today}&dateAfter=${today}&sortDir=desc`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body && body.data) {
            if(body.data.content.length > 0){
                if(body.data.content[0].timeOut == null){
                  setTimeInData(body.data.content[0])
                }else{
                  setTimeInData("")
                }
            }
          }
        }
      )
  }

  const makeAttendance = useCallback((status: any) => {
    if (status == 'time in'){
      let payload = {
        "timeIn" :  moment().format("HH:mm"),
        "status" : "On-Time"
      }
      
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
          RequestAPI.postRequest(Api.timeIn, "", payload, {}, async (res: any) => {
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
                'Something Error.',
                'error'
              )
            }
          })
          
        }
      })
      

      //  RequestAPI.getRequest(
      //   `${Api.getAllLeaves}?size=10&page=0&sort=id&sortDir=desc`,
      //   "",
      //   {},
      //   {},
      //   async (res: any) => {
      //     const { status, body = { data: {}, error: {} } }: any = res
      //     if (status === 200 && body && body.data) {
      //       // setNotificationsData(body.data)
      //       console.log(body.data)
      //     }
      //   }
      // )
      
    }else if(status == 'time out'){
      let timeOutPayload = {}
      let isProceed = true
      
      if (timeInData && timeInData.id){
          timeOutPayload  = {
            "id" : timeInData.id,
            "timeOut" :  moment().format("HH:mm"),
            "status" : "Out"
          }
      }
      else{
        isProceed = false
        ErrorSwal.fire(
          'Error!',
          'Something Error.',
          'error'
        )
      }
      
      if (isProceed){
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
              RequestAPI.putRequest(Api.timeOut, "", timeOutPayload, {}, async (res: any) => {
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
                    'Something Error.',
                    'error'
                  )
                }
              })
              
            }
          })
        }
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
                      <h2>Good day, Employee 001!</h2>
                    </div>
                    <div className="col-md-6">
                      <TimeDate />
                    </div>
                </div>
                <div>
                    <h3>Time Card</h3>
                    <div className="d-flex">
                      <div className="" style={{width: 200, textAlign: right}}>
                          <h6 className="font-weight-bold pt-2">Shift Schedule:</h6>
                          <h6 className="font-weight-bold pt-2">Last Login:</h6>
                          <h6 className="font-weight-bold pt-2">Attendance Status:</h6>
                      </div>
                      <div className="" style={{marginLeft:15, textAlign: left}}>
                          <h6 className="font-weight-bold pt-2">09:00 AM - 06:00 PM</h6>
                          <h6 className="font-weight-bold pt-2">30 January, 2023 08:54:22 AM</h6>
                          <label className="font-weight-bold p-2 px-3 text-dark" style={{background:'#E9E9E9', width: 'auto', borderRadius:5}}>{ (timeInData && timeInData.status) || "Awaiting time in"}</label>
                      </div>
                    </div>
                    
                </div>
                <div className="d-flex" style={{justifyContent:right, marginTop: 300}}>
                  <div>
                    <div className="d-flex justify-content-center">
                      <Image src="https://via.placeholder.com/300/09f.png/ffffff" className="avatar"></Image>
                    </div>
                    <div className="row mt-3">
                      <Button className="mx-2" 
                        disabled={timeInData != ""}
                        style={{width: 120, background:'red'}}
                        onClick={() => makeAttendance('time in')}
                        >Log me in</Button>
                      <Button className="mx-2" 
                        disabled={timeInData == ""}
                        style={{width: 120, background:'red'}}
                        onClick={() => makeAttendance('time out')}>Log me out</Button>
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
