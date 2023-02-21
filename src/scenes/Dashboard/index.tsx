import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "./DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Image } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"

export const Dashboard = (props: any) => {
  const { history } = props
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
      setCurrentDate(moment().format("MMMM-DD-YYYY"));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const makeAttandance = useCallback((status: any) => {
    if (status == 'time in'){
      let payload = {
        "timeIn" :  moment().format("hh:mm"),
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
                ErrorSwal.fire("Success!", (body.data) || "", "success")
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
      
      // RequestAPI.getRequest(
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
      ErrorSwal.fire("Error!", ("test1") || "", "success")
    }
    
  }, [])

  return (
    <div className="body">
      <div className="wraper">
        <div className="w-100">
            <div className="topHeader">
              <UserTopMenu />
            </div>
            <div className="contentContainer row p-0 m-0" style={{ minHeight:'100vh' }}>
              <div className="col-md-12 col-lg-2 bg-dark p-0">
                <DashboardMenu />
              </div>
              <div className="col-md-12 col-lg-10 px-5 py-5">
                <div className="row">
                    <div className="col-md-6">
                      <h2>Good day, Employee 001!</h2>
                    </div>
                    <div className="col-md-6" style={{textAlign:'right'}}>
                      <h5>Today is</h5>
                      <h5>{currentDate}</h5>
                      <h3 className="font-weight-bold">{currentTime}</h3>
                    </div>
                </div>
                <div>
                    <h3>Time Card</h3>
                    <div className="d-flex">
                      <div className="" style={{width: 200, textAlign: right}}>
                          <h5 className="font-weight-bold pt-2">Shift Schedule:</h5>
                          <h5 className="font-weight-bold pt-2">Last Login:</h5>
                          <h5 className="font-weight-bold pt-2">Attendance Status:</h5>
                      </div>
                      <div className="" style={{marginLeft:15, textAlign: left}}>
                          <h5 className="font-weight-bold pt-2">09:00 AM - 06:00 PM</h5>
                          <h5 className="font-weight-bold pt-2">30 January, 2023 08:54:22 AM</h5>
                          <h5 className="font-weight-bold p-2" style={{background:'gray', width: 158, borderRadius:5}}>Awaiting time in</h5>
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
                        style={{width: 120, background:'red'}}
                        onClick={() => makeAttandance('time in')}
                        >Log me in</Button>
                      <Button className="mx-2" 
                        style={{width: 120, background:'red'}}
                        onClick={() => makeAttandance('time out')}>Log me out</Button>
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
