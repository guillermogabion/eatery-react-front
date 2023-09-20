import { useCallback, useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { arrow_down, user } from "../../assets/images"
import { history } from "../../helpers"
import { Utility } from "../../utils"
import { BsFillBellFill, BsGrid3X3GapFill } from "react-icons/bs";
import { bell, mail } from "../../assets/images"
import { Button, Modal, Table } from "react-bootstrap"
import { Api, RequestAPI } from "../../api"
import { tr } from "date-fns/locale"
import ReactPaginate from 'react-paginate'
import moment from 'moment';



const UserTopMenu = (props: any, ) => {
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
  const [ notifAction, setNotifAction ] = useState(false)
  const [ allActivity, setAllActivity ] = useState([])
  const [showModal, setShowModal] = useState(false)
  const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile

  // Format the time passed
  // const formattedTimePassed = moment.utc(timePassed.asMilliseconds()).format('HH:mm:ss');
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
  const notif = () => {
    if(notifAction) {
      setNotifAction(false)
    }else{
      setNotifAction(true)
    }
  }

  const getAllActivity = ( page:any = 0) => {
    RequestAPI.getRequest(
      `${Api.allActivity}?size=10&page=${page}&sort=id&sortDir=desc`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body) {
          if (body.error && body.error.message) {
          } else {
            setAllActivity(body.data)
          }
        }
      }
    )
  }

  useEffect(() => {
    getAllActivity()
   
  }, [])
  const handlePageClick = (event: any) => {
    getAllActivity(event.selected)
  };
  return (
    <div className="w-full flex justify-content-between m-0 p-0">
      <div className="flex ">
        <div className="flex items-center mr-2 pointer dashboardMenuToggle" onClick={onToggle}>
          <BsGrid3X3GapFill size={25} color={"#292A2D"} />
        </div>
        <div className="ml-5 headerMessage">
            <div className="text-lg font-bold text-primary">
              Good Day, {userData.data.profile.firstName}!
            </div>
            <div className="text-md text-muted">
                Stay up-to-date with the latest HR policies and procedures.
            </div>
        </div>
      </div>

      <div className="flex items-center">
      
        <div className="mr-5 flex">
          {
            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
            <>
              <div className="flex menu-dropdown">
                <img src={bell} alt="" width={50} className="pr-3" onClick={() => setShowModal(true)} />
              </div>
            </> : null
          }
             <div className="flex menu-dropdown">
                <img src={mail} alt="" width={50} className="pr-3"  />
              </div>
            <div className="flex items-center mr-5 font-bold user-name">
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
      <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onHide={() => {
        setShowModal(false)
      }}
      dialogClassName="modal-90w"

      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Activity Logs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row w-100 px-5">
          <div>
            {/* <input type="date" className="form-control" /> */}
          </div>
          <div>
            <Table responsive>
              <tbody>
                { allActivity &&
                  allActivity.content &&
                  allActivity.content.length > 0 ?
                  <>
                    {
                      allActivity.content.map((item: any, index: any) => {
                        // const timePassed = calculateTimePassed(item.dateTime);
                        return (
                          <tr>
                            <td>{item.username}</td>
                            <td>{item.description}</td>
                            <td>{moment(item.dateTime).fromNow()}</td>
                          </tr>

                        )
                      })
                    }
                  </> : null
                  }
              </tbody>
            </Table>
            {
                allActivity &&
                allActivity.content &&
                allActivity.content.length == 0 ?
                <div className="w-100 text-center">
                  <label htmlFor="">No Activity log Found</label>
                </div>
                :
                null
            }
          </div>
          <div className="d-flex justify-content-end">
            <div className="">
              <ReactPaginate
                className="d-flex justify-content-center align-items-center"
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={(allActivity && allActivity.totalPages) || 0}
                previousLabel="<"
                previousLinkClassName="prev-next-pagination"
                nextLinkClassName="prev-next-pagination"
                activeLinkClassName="active-page-link"
                disabledLinkClassName="prev-next-disabled"
                pageLinkClassName="page-link"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>

        </Modal.Body>

      </Modal>
    </div>
  )
}
export default UserTopMenu
