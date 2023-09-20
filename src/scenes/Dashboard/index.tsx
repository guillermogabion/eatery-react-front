import { useCallback, useEffect, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { left, right } from "@popperjs/core"
import moment from "moment"
import { Button, Row, Col } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import { bundy_clock } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import TimeDate from "../../components/TimeDate"
import TimeCard from "../../widgets/timeCard"
import AvailableLeaveCredits from "../../widgets/availableLeaveCredits"
import EmployeeBasicProfile from "../../widgets/employeeBasicProfile"
import MyBenefits from "../../widgets/myBenefits"
import SquadDirectory from "../../widgets/squadDirectory"
import TeamCalendar from "../../widgets/teamCalendar"
import AnnouncementBoard from "../../widgets/announcementBoard"
import SquadTracker from "../../widgets/squadTracker"
import ContainerWrapper from "../../components/ContainerWrapper"
import Shortcut from "../../widgets/shortcut"
import Reimbursement from "../../widgets/Reimbursement"

const ErrorSwal = withReactContent(Swal)

export const Dashboard = (props: any) => {
  const [ viewAnnouncement, setViewAnnouncement] = useState<any>([])

  

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.viewAnnouncement}`,
      "",
      {},
      {},
      async(res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
        setViewAnnouncement(body.data)
        console.log(body.data);
        } else {
        }
    }
    )
  },[])

  const textArray = viewAnnouncement && viewAnnouncement.length > 0
  ? viewAnnouncement.map((item, index) => (
      <span key={index}>
        {item.type} {item.subject}
      </span>
    ))
  : null;

  
  

  return (
    <ContainerWrapper contents={
    <div style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
      <div>
      <div className="marquee-container">
        <div className="marquee-text">
          {/* {textArray} */}
        </div>
      </div>
        <div className="row" style={{ margin: '20px -2px' }}>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <EmployeeBasicProfile />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <TimeCard />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <AvailableLeaveCredits />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <MyBenefits />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <TeamCalendar />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <AnnouncementBoard />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <SquadTracker />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <Reimbursement />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <Shortcut />
            </div>
          </div>
        </div>
      </div>
    </div>}
  />
  )
}
