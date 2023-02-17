const Api: any = {
  Login: process.env.REACT_APP_API_URL + "user/auth/token",
  USERS: process.env.REACT_APP_API_URL + "users",
  USERSTATUS: process.env.REACT_APP_API_URL + "userStatus",
  USERDESIGNATIONS: process.env.REACT_APP_API_URL + "userDesignations",
  UNITS: process.env.REACT_APP_API_URL + "units",
  ROLES: process.env.REACT_APP_API_URL + "roles",
  USER_RESET_PASSWORD: process.env.REACT_APP_API_URL + "user/changePassword",
  ACCESS: process.env.REACT_APP_API_URL + "access",
  USERS_DELETE: process.env.REACT_APP_API_URL + "users/delete",
  MASTERLIST: process.env.REACT_APP_API_URL + "lists/client",
  GET_TRANSACTION_MASTER_LIST: process.env.REACT_APP_API_URL + "lists/transaction",
  REQUESTS: process.env.REACT_APP_API_URL + "requests",
  BULK_STATUS_REQUESTS: process.env.REACT_APP_API_URL + "request/status",
  REFRESH_TOKEN: process.env.REACT_APP_API_URL + "auth/refreshToken",
  NOTIFICATIONS: process.env.REACT_APP_API_URL + "users/notifications",
  NOTIFICATIONS_DELETE: process.env.REACT_APP_API_URL + "users/notifications/delete",
  NOTIFICATIONS_DELETE_ALL: process.env.REACT_APP_API_URL + "users/notifications/deleteAll",
  NOTIFICATIONS_MARK_READ: process.env.REACT_APP_API_URL + "users/notifications", // actual url would be users/notifications/{id}/markasread
  GET_USER_MASTER_LIST: process.env.REACT_APP_API_URL + "lists/user",
  USER: process.env.REACT_APP_API_URL + "user",
  GET_PASSWORD_EXPIRY_NOTIFICATION: process.env.REACT_APP_API_URL + "users/notifications/passwordExpiry",
  GET_USER_DETAILS: process.env.REACT_APP_API_URL + "users/self",
}

export default Api
