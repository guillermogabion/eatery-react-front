import React, { useEffect } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  Login,
  ForgotPassword,
  ChangePassword,
  Dashboard,
  Employee,
  Leaves,
  Overtime,
  Undertime,
  ScheduleAdjustment,
  AttendanceCorrection,
  AttendanceSummary,
  Report,
  Squad,
  Holiday,
  SquadLeaves,
  SquadAttendanceCorrection,
  SquadOvertime,
  SquadUndertime,
  LeaveTypes
} from "../scenes"

import jwt_decode from "jwt-decode"
import { Utility } from "../utils"
const CryptoJS = require("crypto-js")

const Privateroutes: React.FunctionComponent = (props) => {
  const dispatch = useDispatch()
  const { data } = useSelector((state: any) => state.rootReducer.userData) 
  let menu: any = []
  if (data) {
    menu = data.profile.menus
  }

  const currentRoutePath = useSelector((state: any) => state.rootReducer.currentRoutePath)
  const isLogin = useSelector((state: any) => state.rootReducer.isLogin)
  const originalUser = CryptoJS.AES.decrypt(sessionStorage.getItem("_as175errepc") || "", process.env.REACT_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
  const decoded: any = originalUser ? jwt_decode(originalUser) : {}

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // const originalRole = CryptoJS.AES.decrypt(sessionStorage.getItem('_ug583k'), 'process.env.REACT_APP_ENCRYPTION_KEY').toString(CryptoJS.enc.Utf8);
        if (decoded.sub && decoded.exp && !isLogin) {
          Utility.startResetTokenTimer()
          dispatch({ type: "IS_LOGIN", payload: true })
        }
      } catch (e) { }
    }
    bootstrapAsync()
  }, [dispatch, isLogin, decoded.sub, decoded.exp])

  const routes: any = []
  routes.push({ path: "/request/leave", component: Leaves })
  routes.push({ path: "/request/ot", component: Overtime })
  routes.push({ path: "/request/ut", component: Undertime })
  routes.push({ path: "/request/schedule-adjustment", component: ScheduleAdjustment })
  routes.push({ path: "/request/coa", component: AttendanceCorrection })
  routes.push({ path: "/timekeeping/attendancesummary", component: AttendanceSummary })
  routes.push({ path: "/timekeeping/myattendancesummary", component: AttendanceSummary })
  routes.push({ path: "/user", component: ChangePassword })
  routes.push({ path: "/report", component: Report })
  routes.push({ path: "/dashboard", component: Dashboard })
  routes.push({ path: "/timekeeping", component: Dashboard })
  routes.push({ path: "/employee", component: Employee })
  routes.push({ path: "/holiday", component: Holiday })
  routes.push({ path: "/request", component: Squad })
  routes.push({ path: "/request/leave/squadmembers", component: SquadLeaves})
  routes.push({ path: "/request/coa/squadmembers", component: SquadAttendanceCorrection})
  routes.push({ path: "/request/ot/squadmembers", component: SquadOvertime})
  routes.push({ path: "/request/Ut/squadmembers", component: SquadUndertime})
  routes.push({ path: "/request/type", component: LeaveTypes })

  return isLogin ? (
    <>
      <Switch>
        {routes.map((d: any) => (
          <Route key={d.path} exact path={d.path} component={d.component} />
        ))}
        {currentRoutePath || (menu && menu.length > 1) ? (
          <Route path="*" render={() => <Redirect to={currentRoutePath || "/timekeeping"} />} />
        ) : (
          <Route path="*" render={() => <Redirect to="/" />} />
        )}
      </Switch>
    </>
  ) : (
    <>
      <Route exact path="/" component={Login} />
      <Route exact path="/forgot" component={ForgotPassword} />
      <Route exact path="*" render={() => <Redirect to="/" />} />
    </>
  )
}

export default React.memo(Privateroutes)
