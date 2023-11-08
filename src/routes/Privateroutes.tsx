import React, { useEffect, useState } from "react"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import RootLayout from "../shared/components/Layouts/RootLayout"
import Home from "../pages/Home"
import About from "../pages/About"
import Stores from "../pages/stores"
import SideBar from "../shared/components/Partials/SideBar"
import Header from "../shared/components/Partials/Header"
import {
  Login,
  // ChangePassword,
  Dashboard,
  // Employee,
  // Leaves,
  // Overtime,
  // Undertime,
  // ScheduleAdjustment,
  // AttendanceCorrection,
  // AttendanceSummary,
  // MyAttendanceSummary,
  // Report,
  // Squad,
  // Holiday,
  // SquadLeaves,
  // SquadAttendanceCorrection,
  // SquadOvertime,
  // SquadUndertime,
  // LeaveTypes,
  // SquadScheduleAdjustment,
  // MissingLogs,
  // PayrollAdjustment,
  // Recurring,
  // PayrollSetting,
  // AllRequest,
  // Payroll,
  // LastPay,
  // Payslip,
  // ApproverLogin,
  // Access,
  // Page404,
  // Reimbursement,
  // AllReimbursement
} from "../scenes"

import jwt_decode from "jwt-decode"
import { Utility } from "../utils"
const CryptoJS = require("crypto-js")

const Privateroutes: React.FunctionComponent = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mainContentClass, setMainContentClass] = useState('col-8');

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
  const originalUser = CryptoJS.AES.decrypt(localStorage.getItem("_as175errepc") || "", process.env.REACT_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
  const decoded: any = originalUser ? jwt_decode(originalUser) : {}
  
  
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
        setMainContentClass('col-12');
      } else {
        setSidebarOpen(true);
        setMainContentClass('col-8');
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // const originalRole = CryptoJS.AES.decrypt(sessionStorage.getItem('_ug583k'), 'process.env.REACT_APP_ENCRYPTION_KEY').toString(CryptoJS.enc.Utf8);
        if (decoded.sub && decoded.exp && !isLogin) {
          Utility.startResetTokenTimer()
          Utility.refreshTokenProcess()
          dispatch({ type: "IS_LOGIN", payload: true })
        }
      } catch (e) { }
    }
    bootstrapAsync()
  }, [dispatch, isLogin, decoded.sub, decoded.exp])
  
  const routes: any = [
  
    { path: "/dashboard", component: Dashboard },
    { path: "/timekeeping", component: Dashboard },
   
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

  
  
  // if (isLogin) {
  //   const loginedPath = routes.map((item: any) => item.path);
  //   pathList = loginedPath
  // } else {
  //   const loginPath = ['/login/:id/:action/:type']
  //   pathList = loginPath
  // }

  const isCurrentPathInList = pathList.some((path: any) => {
    const pathRegex = new RegExp(`^${path.replace(/:[^\s/]+/g, '[^/]+')}$`);
    return pathRegex.test(currentPath);
  });
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return isLogin ? (
    <>
    <div className="fluid">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="row">
        {sidebarOpen && (
          <div className="col-2">
            <SideBar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
          </div>
        )}
        <div className={`${mainContentClass} ${sidebarOpen ? 'main-content-open col-8' : 'col-12'}`}>
          <Switch>
            {/* <Route path="/" component={Home}/> */}
            <Route exact path={"/"} component={Home} />
            <Route path="/store" component={Stores} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </div>
    </div>
     
    </>
  ) : (
    <>
      <Route exact path="/"  render={() => <Login />}/>
      <Route path="*" render={() => <Login />} />
    </>
  );
}

export default React.memo(Privateroutes)
