import React, { useEffect } from "react"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  Login,
  ChangePassword,
  Dashboard,
  Employee,
  Leaves,
  Overtime,
  Undertime,
  ScheduleAdjustment,
  AttendanceCorrection,
  AttendanceSummary,
  MyAttendanceSummary,
  Report,
  Squad,
  Holiday,
  SquadLeaves,
  SquadAttendanceCorrection,
  SquadOvertime,
  SquadUndertime,
  LeaveTypes,
  SquadScheduleAdjustment,
  MissingLogs,
  PayrollAdjustment,
  Recurring,
  PayrollSetting,
  AllRequest,
  Payroll,
  LastPay,
  Payslip,
  ApproverLogin,
  Access,
  Page404,
  Reimbursement
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
  let pathList: any = []
  let currentPath = "";

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
  
  const routes: any = [
    { path: "/page/404", component: Page404 },
    { path: "/request/leave", component: Leaves },
    { path: "/request/ot", component: Overtime },
    { path: "/request/ut", component: Undertime },
    { path: "/request/schedule-adjustment", component: ScheduleAdjustment },
    { path: "/allrequest", component: AllRequest },
    { path: "/request/coa", component: AttendanceCorrection },
    { path: "/timekeeping/attendancesummary", component: AttendanceSummary },
    { path: "/timekeeping/myattendancesummary", component: MyAttendanceSummary },
    { path: "/timekeeping/missinglogs", component: MissingLogs },
    { path: "/user", component: ChangePassword },
    { path: "/report", component: Report },
    { path: "/dashboard", component: Dashboard },
    { path: "/timekeeping", component: Dashboard },
    { path: "/employee", component: Employee },
    { path: "/holiday", component: Holiday },
    { path: "/request", component: Squad },
    { path: "/request/leave/squadmembers", component: SquadLeaves },
    { path: "/request/coa/squadmembers", component: SquadAttendanceCorrection },
    { path: "/request/ot/squadmembers", component: SquadOvertime },
    { path: "/request/Ut/squadmembers", component: SquadUndertime },
    { path: "/request/schedule-adjustment/squadmembers", component: SquadScheduleAdjustment },
    { path: "/request/type", component: LeaveTypes },
    { path: "/payroll", component: Payroll },
    { path: "/payroll/last-pay", component: LastPay },
    { path: "/payroll/reimbursement", component: Reimbursement },
    { path: "/payroll/adjustment", component: PayrollAdjustment },
    { path: "/payroll/recurring", component: Recurring },
    { path: "/payroll/settings", component: PayrollSetting },
    { path: "/payroll/payslip", component: Payslip },
    { path: "/manage/user-access", component: Access },
  ]

  if (location.pathname != "/"){
    currentPath = location.pathname 
  }else {
    if (currentRoutePath != ""){
      currentPath = currentRoutePath
    }else {
      currentPath = "/dashboard"
    }
  }
  
  if (isLogin) {
    const loginedPath = routes.map((item: any) => item.path);
    pathList = loginedPath
  } else {
    const loginPath = ['/login/:id/:action/:type']
    pathList = loginPath
  }

  const isCurrentPathInList = pathList.some((path: any) => {
    const pathRegex = new RegExp(`^${path.replace(/:[^\s/]+/g, '[^/]+')}$`);
    return pathRegex.test(currentPath);
  });

  return isLogin ? (
    <>
      <Switch>
        {routes.map((d: any) => (
          <Route key={d.path} exact path={d.path} component={d.component} />
        ))}
        {(currentRoutePath || (menu && menu.length > 1)) && isCurrentPathInList ? (
          <Route path="*" render={() => <Redirect to={currentPath || "/timekeeping"} />} />
        ) : (
          <Route path="*" render={() => <Redirect to="/page/404" />} />
        )}
      </Switch>
    </>
  ) : (
    <>
      <Route exact path="/" component={Login} />
      <Route exact path="/login/:id/:action/:type" component={ApproverLogin} />
      {isCurrentPathInList ? (
        <Route path="*" render={() => <Redirect to={currentPath} />} />
      ) : (
        <Route path="*" render={() => <Redirect to="/" />} />
      )}
    </>
  )
}

export default React.memo(Privateroutes)
