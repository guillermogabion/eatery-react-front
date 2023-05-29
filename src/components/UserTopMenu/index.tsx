import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { arrow_down, user } from "../../assets/images"
import { history } from "../../helpers"
import { Utility } from "../../utils"
import { BsFillBellFill, BsGrid3X3GapFill } from "react-icons/bs";


const UserTopMenu = (props: any) => {
  const { search = true, onToggle } = props
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
    <div className="w-full flex justify-content-between m-0 p-0">
      <div className="flex ">
        <div className="flex items-center mr-2 pointer dashboardMenuToggle" onClick={onToggle}>
          <BsGrid3X3GapFill size={25} color={"#292A2D"} />
        </div>
        <div className="ml-5 headerMessage">
            <div className="text-lg font-bold text-primary">
              Good Day, Francis!
            </div>
            <div className="text-md text-muted">
                Stay up-to-date with the latest HR policies and procedures.
            </div>
        </div>
      </div>

      <div className="flex items-center">
      
        <div className="mr-5 flex">
            <div className="flex items-center bg-[#009FB5] rounded-full  p-[10px] mr-5">
              <BsFillBellFill size={20} color={"#ffffff"} />
            </div>
            <div className="flex items-center mr-5 font-bold">
              <h3> {userData.data.profile.firstName} {userData.data.profile.lastName}</h3>
            </div>
            <div>
              <img src={user} alt="user" />
            </div>
        </div>
        <div className="menu-dropdown mt-[-8px]" onClick={closePopup}>
          <div className="">
            <div className="DropdownIcon">
              <img src={arrow_down} alt="Arrow Down" width={15} />
            </div>
          </div>
          {userAction ?
            <div className="MenuActionsLink">
              <small>
                <NavLink to={"/timekeeping"}
                  onClick={() => {
                    setCurrentRoutePath("/timekeeping")
                  }}>
                  <span>Dashboard</span>
                </NavLink>
              </small>
              <br />
              <small>
                <NavLink to={"/user"}
                  onClick={() => {
                    setCurrentRoutePath("/user")
                  }}>
                  <span>Change Password</span>
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
