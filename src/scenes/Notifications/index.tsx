import React, { useEffect, useState, useRef } from "react"
import { Button, Tooltip, Overlay } from "react-bootstrap"
import {
  notification_pending,
  notification_read,
  notification_close,
  notication_success,
  icon_watch,
  pagination_right,
  pagination_left,
} from "../../assets/images"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { RequestAPI, Api } from "../../api"
import { Utility } from "../../utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import moment from "moment"
import UserPopup from "../../components/Popup/UserPopup"
import { useSelector, useDispatch } from "react-redux"
const ErrorSwal = withReactContent(Swal)
import { history } from "../../helpers"

const IconImage = (props: any) => {
  const { name = "" } = props
  let iconName = ""
  let iconAltText = ""
  switch (name) {
    case "notification_pending":
      iconName = notification_pending
      iconAltText = "notification pending"
      break
    case "notification_read":
      iconName = notification_read
      iconAltText = "notification read"
      break
    case "notification_close":
      iconName = notification_close
      iconAltText = "notification delete"
      break
    case "notication_success":
      iconName = notication_success
      iconAltText = "notication success"
      break
    case "icon_watch":
      iconName = icon_watch
      iconAltText = "icon watch"
      break
  }
  return <img src={iconName} alt={iconAltText} />
}

const OverlayTriggerDel = React.memo((props: any) => {
  const [show, setShow] = useState(false)
  const target = useRef(null)
  return (
    <>
      <Button
        ref={target}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        variant="link"
        onClick={() => props.deleteNotification(props.id)}>
        <IconImage name="notification_close" />
      </Button>
      <Overlay target={target.current} show={show} placement="top">
        {(props: any) => (
          <Tooltip className="custom-tooltip" id={`tooltip-${"Delete"}`} {...props}>
            Delete
          </Tooltip>
        )}
      </Overlay>
    </>
  )
})

const EmptyNotification = (props: any) => {
  return props.show ? (
    <div className="emptyNotification">
      <div className="emptyNotificationImage">
        <IconImage name="notication_success" />
      </div>
      <div className="emptyNotificationTitle">
        <h3>
          YOU HAVE <a href="#">0</a> NOTIFICATIONS PENDING!
        </h3>
      </div>
    </div>
  ) : null
}


const Notification = (props: any) => {
  const { notification, deleteNotification, handleMarkRead } = props || {}
  const {
    id = "",
    message = "",
    isRead = true,
    creationTimestamp = "",
    from = "",
    actionType = "",
    withMessage = "",
    referenceNumOrAccountnameOrUsername = "",
    link = "",
    enderMessage = "",
  } = notification || {}

  return (
    <li key={id} className={`notificationItem` + (isRead ? " readed" : " unread")}>
      <span key={`notification-icon-${id}`} className="notificationItemIcon">
        {<IconImage name={isRead ? "notification_read" : "notification_pending"} />}
      </span>
      <span key={`notification-content-${id}`} className="notificationItemContent">
        <span key={`notification-message-${id}`} onClick={() => (!isRead ? handleMarkRead(notification) : {})}>
          {`${from} ${actionType} ${withMessage} ${referenceNumOrAccountnameOrUsername}.`}<button
            className="click-here"
            onClick={() =>
              history.push({
                pathname: link, state: { id: link.substring(link.lastIndexOf("/") + 1) }
              })
            }>Click here</button>{`${enderMessage}.`}
        </span>
        <span key={`notification-watch-icon-${id}`} className="tagIcon">
          <IconImage name="icon_watch" /> {creationTimestamp}
        </span>
      </span>
      <span key={`notification-delete-${id}`} className="notificationdeleteIcon">
        <OverlayTriggerDel deleteNotification={deleteNotification} id={id} />
      </span>
    </li>
  )
}

const Pagination = (props: any) => {
  const { totalPages = 0, number = 0, setPagination } = props

  return (
    <div className="Pagination">
      <ul>
        <li>{totalPages == 0 ? 0 : number + 1 || 0}</li>
        <li>of</li>
        <li>
          <a href="#"> {totalPages || 0} </a>
        </li>
        <li>
          <Button variant="link" className="prev" disabled={(number + 1) == 1 ? true : false} onClick={() => (number > 0 ? setPagination(number - 1) : {})}>
            {" "}
            <img src={pagination_left} alt="left" />
          </Button>
        </li>
        <li>
          <Button
            variant="link"
            className="next"
            disabled={(number + 1) == totalPages ? true: false}
            onClick={() => (number + 1 < totalPages ? setPagination(number + 1) : {})}>
            {" "}
            <img src={pagination_right} alt="right" />
          </Button>
        </li>
      </ul>
    </div>
  )
}

export const Notifications = (props: any) => {
  const [sort, setSort] = useState<any>("id")
  const [sortDir, setSortDir] = useState<any>("DESC")

  const [loader, setLoader] = useState(false)
  const [showWidget, setShowWidget] = useState(false)
  const [activeNotificationTab, setActiveNotificationTab] = useState<any>("All")
  const [notificationsData, setNotificationsData] = useState<any>({})
  const [unreadNotificationsData, setUnreadNotificationsData] = useState<any>({})
  const dispatch = useDispatch()

  const notification_update_date = useSelector((state: any) => state.rootReducer.notificationUpdateDate)

  useEffect(() => {
    getFetchData(0)
  }, [sort, sortDir, notification_update_date])

  const onDeleteNotification = (id: number) => {
    RequestAPI.deleteRequest(`${Api.NOTIFICATIONS_DELETE}/${id}`, "", {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        dispatch({
          type: "SET_UPDATE_NOTIFICATION_DATE",
          payload: new Date().toString(),
        })
        ErrorSwal.fire("Deleted!", (body && body.data) || "Record deleted.", "success")
      } else {
        //error
        ErrorSwal.fire({
          icon: "error",
          title: (body.error && body.error.message) || "",
        })
      }
    })
  }

  const onDeleteAll = () => {
    RequestAPI.deleteRequest(`${Api.NOTIFICATIONS_DELETE_ALL}`, "", {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        dispatch({
          type: "SET_UPDATE_NOTIFICATION_DATE",
          payload: new Date().toString(),
        })
        // getFetchData(0);
        ErrorSwal.fire("Deleted!", (body && body.data) || "All records deleted.", "success")
      } else {
        //error
        ErrorSwal.fire({
          icon: "error",
          title: (body.error && body.error.message) || "",
        })
      }
    })
  }

  const deleteNotification = (id: number) => {
    ErrorSwal.fire({
      html: (
        <UserPopup
          handleClose={ErrorSwal.close}
          popupType="confirm"
          title="Are you sure you want to delete this ?"
          onConfirm={() => onDeleteNotification(id)}
        />
      ),
      showConfirmButton: false,
    })
  }

  const deleteAllNotification = () => {
    ErrorSwal.fire({
      html: (
        <UserPopup
          handleClose={ErrorSwal.close}
          popupType="clear_all"
          popupClass="notificationPopup"
          title="YOU ARE ABOUT TO DELETE ALL THE NOTIFICATIONS MAKE SURE YOU HAVE READ THEM ALL!"
          midContent=""
          onConfirm={() => onDeleteAll()}
        />
      ),
      showConfirmButton: false,
    })
  }

  const setPagination = (paggingNo: number) => getFetchData(paggingNo)

  const getFetchData = (pagging = 0) => {
    setLoader(true)
    RequestAPI.getRequest(
      `${Api.NOTIFICATIONS}?size=10&page=${pagging}&sort=${sort || "id"}&sortDir=${sortDir}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200) {
          if (body && body.data) {
            let unreadData: any = {}
            const unreadDataContent = (body.data.content || []).filter((notification: any) => {
              return notification.isRead == false
            })
            unreadData = { content: unreadDataContent }
            setUnreadNotificationsData(unreadData)
            setNotificationsData(body.data)
          } else {
            setUnreadNotificationsData({})
            setNotificationsData({})
          }

          setShowWidget(true)
        } else {
          Utility.showError((body.error && body.error.message) || "")
          setShowWidget(true)
        }
        setLoader(false)
      }
    )
  }

  const handleActiveNotificationTab = (tabName: any) => {
    setActiveNotificationTab(tabName)
  }

  const getActiveTabClass = (tabName: any) => {
    let activeClass = ""
    if (activeNotificationTab == tabName) {
      activeClass = " active"
    } else if (activeNotificationTab == tabName) {
      activeClass = " active"
    }
    return activeClass
  }

  const getActiveTabContentStyle = (tabName: any) => {
    let activeTabStyle = { display: "none" }
    if (activeNotificationTab == tabName) {
      activeTabStyle = { display: "block" }
    } else if (activeNotificationTab == tabName) {
      activeTabStyle = { display: "block" }
    }
    return activeTabStyle
  }

  const handleMarkRead = (notification: any) => {
    if (notification && !notification.isRead) {
      RequestAPI.putRequest(
        `${Api.NOTIFICATIONS_MARK_READ}/${notification.id}/markasread`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200) {
            getFetchData(0)
          }
        }
      )
    }
  }

  return (
    <div className="body">
      <div className="wraper">
        <MainLeftMenu />
        <div className="contentRightSection">
          <div className="contentRightFrame">
            <div className="contentRightTopHeader">
              <UserTopMenu title="Notifications" />
            </div>
            <div className="contentRightcontent">
              <div className="bredcrum">
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>Notifications</li>
                </ul>
              </div>
              <div className="contentscrollDiv">
                <div className="notificationTab">
                  {/* Tab links */}
                  <div className="tab">
                    <button
                      className={`tablinks` + getActiveTabClass("All")}
                      onClick={() => handleActiveNotificationTab("All")}>
                      All
                    </button>
                    <button
                      className={`tablinks` + getActiveTabClass("Unread")}
                      onClick={() => handleActiveNotificationTab("Unread")}>
                      Unread
                    </button>
                    {notificationsData.content && notificationsData.content.length > 0 && (
                      <button
                        className="clearAll"
                        onClick={(e) => {
                          deleteAllNotification()
                        }}>
                        CLEAR ALL
                      </button>
                    )}
                  </div>

                  {/* Tab content */}
                  <div id="All" className="tabcontent" style={getActiveTabContentStyle("All")}>
                    {notificationsData.content && notificationsData.content.length > 0 ? (
                      <>
                        <ul>
                          {(notificationsData.content || []).map((notification: any) => {
                            return (
                              <Notification
                                key={notification.id}
                                notification={notification}
                                deleteNotification={deleteNotification}
                                handleMarkRead={handleMarkRead}
                              />
                            )
                          })}
                        </ul>
                        <Pagination
                          number={notificationsData.number || 0}
                          totalPages={notificationsData.totalPages || 0}
                          setPagination={setPagination}
                        />
                      </>
                    ) : (
                      <EmptyNotification show={!loader} />
                    )}
                  </div>
                  <div id="Unread" className="tabcontent" style={getActiveTabContentStyle("Unread")}>
                    {unreadNotificationsData.content && unreadNotificationsData.content.length > 0 ? (
                      <ul>
                        {(unreadNotificationsData.content || []).map((notification: any) => {
                          return (
                            <Notification
                              key={notification.id}
                              notification={notification}
                              deleteNotification={deleteNotification}
                              handleMarkRead={handleMarkRead}
                            />
                          )
                        })}
                      </ul>
                    ) : (
                      <EmptyNotification show={!loader} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
