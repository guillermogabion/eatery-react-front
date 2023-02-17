import { useCallback, useState } from "react"
import { icon_search_grey, user, RBank_Digital_Logo, power } from "../../assets/images"
import { user_guide } from "../../assets/others"
import { NavLink } from "react-router-dom"
import { Utility } from "../../utils"
import moment from "moment"
import { useSelector, useDispatch } from "react-redux"
import { history } from "../../helpers"
import UserNotifications from "../UserNotifications"
import { RequestAPI, Api } from "../../api"

const UserTopMenu = (props: any) => {
  const { search = true } = props
  const dispatch = useDispatch()

  const userData = useSelector((state: any) => state.rootReducer.userData)
  const topSearch = useSelector((state: any) => state.rootReducer.topSearch)
  // const units = useSelector((state: any) => state.rootReducer.units);
  const humbergerMenu = useSelector((state: any) => state.rootReducer.humbergerMenu)
  const currentRoutePath = useSelector((state: any) => state.rootReducer.currentRoutePath)
  const [errorTopSearch, setErrorTopSearch] = useState("")
  const [userAction, setUserAction] = useState(false)
  const [searchText, setSearchText] = useState("")
  const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })

  const searchTop = useCallback(() => {
    if (!topSearch && !searchText) {
      // setErrorTopSearch("Please enter some keywords")
      setErrorTopSearch("")
      return
    }

    if (currentRoutePath.indexOf("user") > -1) {
      history.push("/user/list")
    } else if (currentRoutePath.indexOf("client") > -1) {
      history.push("/client/list")
    } else if (currentRoutePath.indexOf("approver") > -1) {
      history.push("/approver/list")
    }
  }, [currentRoutePath, topSearch])
  const closePopup = () => {
    if (userAction) {
      setUserAction(false)
    } else {
      setUserAction(true)
    }

  }

  return (
    <div className="contentRightMain">
      <div className="MobileHeader">
        <div
          className="humbergerMenu "
          onClick={() => dispatch({ type: "UPDATE_HUMBERGER_MENU", payload: !humbergerMenu })}></div>
        <a className="logo" href="/">
          <img src={RBank_Digital_Logo} alt="RBank" />
        </a>
        <div className="mobileHeaderRight">
          {/* <UserNotifications /> */}
          <div className="MobileUserdetail">
            <div className="UserIcon">
              <img src={user} alt="user" />
            </div>
            <div className="MobileUserdetailDropDown">
              <ul>
                <li>{moment().format("MMMM DD, YYYY")}</li>
                <li>
                  <strong>Sol Id</strong> {userData.solId}
                  <br />
                  {userData.unit}
                </li>
                <li className="mobilelogout">
                  <NavLink
                    activeClassName="active"
                    to={"/logout"}
                    onClick={() => {
                      Utility.deleteUserData()
                      dispatch({ type: "IS_LOGIN", payload: false })
                    }}>
                    <span>
                      <img src={power} alt="Logout" />
                      <span>Logout</span>
                    </span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <h1>
      <a className="logo" href="/">
          <img src={"https://via.placeholder.com/55/09f.png/ffffff"} alt="RBank" />
        </a>
      </h1>
      <div className="TopHeaderRight">
        {search ? (
          <div className="mainSearch">
            <input
              value={`${searchText}`.trimStart()}
              name="name"
              placeholder="Search"
              type="text"
              className="formControl"
              required
              onChange={(e) => {
                setSearchText(e.target.value)
              }}
            />
            <button onClick={() => {
              dispatch({
                type: "SET_TOP_SEARCH",
                payload: `${searchText}`.trimStart(),
              })
              searchTop()
            }}>
              <img src={icon_search_grey} alt="user" />
            </button>
            {errorTopSearch ? (
              <p
                style={{
                  color: "red",
                  position: "absolute",
                  width: "100%",
                  bottom: "-41px",
                  left: 0,
                }}>
                {errorTopSearch}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="UserAction" onClick={closePopup}>
          <div className="UserdetailWrap">
            <div className="UserIcon">
              <img src={user} alt="user" />
            </div>
            <div className="Userdetail">
              <h3>Employee  {userData.username}</h3>
              {/* <small>{`00${soleId}`}<br />{userData.unit}</small> */}
              <small>
                Squad Ingenaire
              </small>
            </div>
          </div>
        </div>
        <div className="UserAction" onClick={closePopup}>
          <div className="UserdetailWrap">
            <div className="UserIcon">
              <img src={user} alt="user" />
            </div>
          </div>
          {userAction ?
            <div className="UserActionsLink">
              <small>
                <NavLink to={"/dashboard"} 
                  onClick={() => {
                    setCurrentRoutePath("/dashboard")
                  }}>
                  Dashboard
                </NavLink>
              </small>
              <br />
              <small>
                <NavLink to={"/user/list"}
                onClick={() => {
                  setCurrentRoutePath("/user/list")
                }}>
                  User Management
                </NavLink>
              </small>
              <br />
              <small>
                <NavLink to={"/role/list"}
                onClick={() => {
                  setCurrentRoutePath("/role/list")
                }}>
                  Role Management
                </NavLink>
              </small>
              <br />
              <small>
                <NavLink to={"/useriniatedchangepw"}
                  onClick={() => {
                    setCurrentRoutePath("/useriniatedchangepw")
                  }}>
                  Profile
                </NavLink>
              </small>
              <br />
              <NavLink
                activeClassName="active"
                to={"/logout"}
                onClick={() => {
                  Utility.deleteUserData()
                  dispatch({ type: "IS_LOGIN", payload: false })
                }}>
                <span>
                  <span>Logout</span>
                </span>
              </NavLink>
            </div>
            : null
          }
        </div>
      </div>
    </div>
  )
}
export default UserTopMenu
