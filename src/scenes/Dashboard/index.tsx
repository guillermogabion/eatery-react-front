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

const ErrorSwal = withReactContent(Swal)

export const Dashboard = (props: any) => {
  

  return (
    <ContainerWrapper contents={
    <div style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
      <div>
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
        </div>
      </div>
    </div>}
  />
  )
}
