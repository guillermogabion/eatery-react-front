import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { icon_close_circle, menu_notifications_normal } from "../../assets/images"
import { RequestAPI, Api } from "../../api"
import { useDispatch, useSelector } from "react-redux"
import UserPopup from "../../components/Popup/UserPopup"
const ErrorSwal = withReactContent(Swal)

const UserNotification = (props: any) => {
  const { notification, deleteNotification, handleMarkRead } = props || {}
  const {
    id = "",
    referenceNumOrAccountnameOrUsername = "",
    isRead = true,
    feautureId
  } = notification || {}

  return (
    <li className={`notification-` + (isRead ? "read" : "unread")}>
      <div className="notification">
        <span className="icon-bullet"></span>
        <span
          className={`message-content ` + (isRead ? "read" : "unread")}
          onClick={() => (!isRead ? handleMarkRead(notification) : {})}>
          {feautureId == 3 ? `Reference # : ${referenceNumOrAccountnameOrUsername}` : feautureId == 2 ? `Account Name : ${referenceNumOrAccountnameOrUsername}` : `User Name : ${referenceNumOrAccountnameOrUsername}`}
        </span>
        <img
          src={icon_close_circle}
          alt="delete"
          onClick={() => {
            deleteNotification(id)
          }}
        />
      </div>
    </li>
  )
}

const UserNotifications = (props: any) => {
  const [showWidget, setShowWidget] = useState(false)
  const [notificationsData, setNotificationsData] = useState<any>({})
  const dispatch = useDispatch()

  const notification_update_date = useSelector((state: any) => state.rootReducer.notificationUpdateDate)

  useEffect(() => {
    getFetchData(0)
  }, [notification_update_date])

  const onDeleteNotification = (id: number) => {
    RequestAPI.deleteRequest(`${Api.NOTIFICATIONS_DELETE}/${id}`, "", {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        //   getFetchData(0);
        dispatch({
          type: "SET_UPDATE_NOTIFICATION_DATE",
          payload: new Date().toString(),
        })
        //notificationUpdateDate SET_UPDATE_NOTIFICATION_DATE
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

  const getFetchData = (pagging = 0) => {
    RequestAPI.getRequest(
      `${Api.NOTIFICATIONS}?size=5&page=${pagging}&sort=id&sortDir=DESC`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setNotificationsData(body.data)
        }
      }
    )
  }
  return (
    <div className="userNotification">
      <div className="userNotificationIcon">
        <NavLink to={"/notifications"}>
          <img src={menu_notifications_normal} alt="notifications" style={{ paddingTop: "3px" }} />
          {notificationsData.content && notificationsData.content.length > 0 ? (
            <span className="availableNotification"></span>
          ) : null}
        </NavLink>
      </div>
      {notificationsData.content && notificationsData.content.length ? (
        <div className="notificationDropdown">
          <ul>
            {(notificationsData.content || []).map((notification: any) => {
              return (
                <UserNotification
                  key={notification.id}
                  notification={notification}
                  deleteNotification={deleteNotification}
                  handleMarkRead={handleMarkRead}
                />
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default UserNotifications
