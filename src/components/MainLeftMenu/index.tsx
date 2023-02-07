import React from "react"
import packageJson from "./../../../package.json"
import { RBank_Digital_Logo, menu_logout_dark } from "../../assets/images"
import { NavLink } from "react-router-dom"
import { Utility } from "../../utils"
import { useDispatch, useSelector } from "react-redux"
import { history } from "../../helpers"
import UserList from "../Icons/UserList"
import UserRole from "../Icons/UserRole"
import HomeIcon from "../Icons/HomeIcon"
import ReportsIcon from "../Icons/ReportsIcon"
import ClientsIcon from "../Icons/ClientsIcon"
import Holiday_Icon from "../Icons/Holiday_Icon"
import ITSettings from "../Icons/ITSettings_Icon"
import FrontendmaintenanceIcon from "../Icons/FrontendmaintenanceIcon"
import { RequestAPI, Api } from "../../api"
import C_Pwd from "../Icons/C_Pwd"


const MainLeftMenu = () => {
  const dispatch = useDispatch()
  const { location } = history
  const humbergerMenu = useSelector((state: any) => state.rootReducer.humbergerMenu)
  const { menu = [] } = useSelector((state: any) => state.rootReducer.userData) // Login User Data
  const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })

  return (
    <aside className={`sidebarMain ${humbergerMenu ? "toggle_menu" : ""}`} id="mobileMenu">
      <div className="sidebar">
        <a className="logo" href="/">
          <img src={RBank_Digital_Logo} alt="RBank" />
        </a>
        <div className="sidebarItems">
          <div
            className="menu_close"
            onClick={() =>
              dispatch({
                type: "UPDATE_HUMBERGER_MENU",
                payload: !humbergerMenu,
              })
            }></div>
          <ul>
            {
              // Acess base menu with on login
              menu.map((d: any) => {
                const { icon = "", label = "", route = "", type = "" } = d
                
                let loadIcon: any = "";
                switch (icon) {
                  case "user":
                    loadIcon = (
                      <UserList
                        color={
                          ["/user/list", "/user/view", "/user/add", "/user/edit"].includes(location.pathname)
                            ? "#fff"
                            : "#003139"
                        }
                      />
                    )
                    break
                  case "role":
                    loadIcon = (
                      <UserRole
                        color={
                          ["/role/list", "/role/edit", "/role/add"].includes(location.pathname) ? "#fff" : "#003139"
                        }
                      />
                    )
                    break
                  case "changepassword":
                    loadIcon = (
                      <C_Pwd color={["/useriniatedchangepw"].includes(location.pathname) ? "#fff" : "#003139"} />
                    )
                    break
                  default:
                    break
                }

                return (
                  <li key={label}>
                    <NavLink
                      activeClassName="active"
                      isActive={(_, location) => {
                        setCurrentRoutePath(location.pathname)
                        let new_type = type
                        if (location.pathname == "/useriniatedchangepw" && new_type == "user") {
                          return false
                        }

                        if ((location.pathname.indexOf('frontendmaintenance/user-designation/add')  > -1 && new_type == "user") ||
                            (location.pathname.indexOf('frontendmaintenance/user-designation/view')  > -1 && new_type == "user") ||
                            (location.pathname.indexOf('frontendmaintenance/user-designation/edit')  > -1 && new_type == "user")) {
                          return false
                        }
                        
                        if (new_type == "itsetting"){
                          new_type = "setting"
                        }

                        return location.pathname.indexOf(new_type) > -1
                      }}
                      to={{ pathname: route }}>
                      <span>
                        {loadIcon}
                        <span>{label}</span>
                      </span>
                    </NavLink>
                  </li>
                )
              })
            }
            <li key={"logout"}>
              <NavLink
                activeClassName="active"
                to={{}}
                onClick={() => {
                  RequestAPI.deleteRequest(
                    Api.REFRESH_TOKEN,
                    "",
                    { token: Utility.getRefreshToken() },
                    async (res: any) => {
                      const { status, body = { data: {}, error: {} } }: any = res
                      if (status === 200) {
                        dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: "" })
                        setTimeout(() => {
                          dispatch({ type: "IS_LOGIN", payload: false })
                          Utility.deleteUserData()
                        }, 100)
                      }
                    }
                  )
                }}>
                <span>
                  <img src={menu_logout_dark} alt="Logout" />
                  <span>Logout</span>
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <p
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          width: "120px",
          color: "#003139",
        }}>
        v{packageJson.version}
      </p>
    </aside>
  )
}
export default React.memo(MainLeftMenu)
