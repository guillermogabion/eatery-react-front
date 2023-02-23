import React, { useEffect } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  Login,
  UserForm,
  ForgotPassword,
  UserList,
  Role,
  RoleAdd,
  UserView,
  Notifications,
  ChangePassword,
  UserDetails,
  Dashboard,
  Employee
} from "../scenes"

import jwt_decode from "jwt-decode"
import { Utility } from "../utils"
const CryptoJS = require("crypto-js")

const Privateroutes: React.FunctionComponent = (props) => {
  const dispatch = useDispatch()
  const { accessRights = [], menu = [] } = useSelector((state: any) => state.rootReducer.userData) // Login User Data
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
  routes.push({ path: "/employee", component: Employee })
  accessRights.forEach((d: any) => {
    routes.push({ path: "/notifications", component: Notifications })
    routes.push({ path: "/userdetails", component: UserDetails })
    routes.push({ path: "/dashboard", component: Dashboard })
    routes.push({ path: "/useriniatedchangepw", component: ChangePassword })
    routes.push({ path: "/attendance", component: Dashboard })
    

    switch (d) {
      // User Access
      case "Can_Read_User":
        routes.push({ path: "/user/list", component: UserList })
        routes.push({ path: "/user/view", component: UserView })
        break
      case "Can_Add_Edit_User":
        routes.push({ path: "/user/add", component: UserForm })
        routes.push({ path: "/user/edit", component: UserForm })
        break
      case "Can_Read_Role":
        routes.push({ path: "/role/list", component: Role })
        break
      case "Can_Add_Edit_Role":
        routes.push({ path: "/role/add", component: RoleAdd })
        routes.push({ path: "/role/edit", component: RoleAdd })
        break

      default:
        break
    }
  })
  return isLogin ? (
    <>
      <Switch>
        {routes.map((d: any) => (
          <Route key={d.path} exact path={d.path} component={d.component} />
        ))}
        {currentRoutePath || (menu && menu.length > 1 && menu[0]) ? (
          <Route path="*" render={() => <Redirect to={currentRoutePath || menu[0].route} />} />
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
