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
// import DashboardMenu from "../../components/DashboardMenu"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
// import TimeCard from "../../widgets/timeCard"
// import AvailableLeaveCredits from "../../widgets/availableLeaveCredits"
// import EmployeeBasicProfile from "../../widgets/employeeBasicProfile"
// import MyBenefits from "../../widgets/myBenefits"
// import SquadDirectory from "../../widgets/employeeDirectory"
// import TeamCalendar from "../../widgets/teamCalendar"
// import AnnouncementBoard from "../../widgets/announcementBoard"
// import SquadTracker from "../../widgets/squadTracker"
// import Shortcut from "../../widgets/shortcut"
// import Reimbursement from "../../widgets/Reimbursement"
// import EmployeeDirectory from "../../widgets/employeeDirectory"
// import NewHire from "../../widgets/newHire"
// import Statistics from "../../widgets/statistics"
// import CompensationDepartment from "../../widgets/compensationDepartment"
// import PayRange from "../../widgets/payRange"
// import OtHours from "../../widgets/otHours"

const ErrorSwal = withReactContent(Swal)

export const Dashboard = (props: any) => {
  const [ viewAnnouncement, setViewAnnouncement] = useState<any>([])
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  

  

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
    // <ContainerWrapper contents={
    <div style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
      <div>
      <div className="marquee-container">
        <div className="marquee-text">
          {/* {textArray} */}
        </div>
      </div>
        I am dashboard
      </div>
    </div>
  //   }
  // />
  )
}
