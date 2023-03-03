const Api: any = {
  Login: process.env.REACT_APP_API_URL + "user/auth/token",
  timeIn: process.env.REACT_APP_API_URL + "timekeeping/timeIn",
  timeOut: process.env.REACT_APP_API_URL + "timekeeping/timeOut",
  myTimeKeeping: process.env.REACT_APP_API_URL + "mytimekeeping/all",
  timeKeeping: process.env.REACT_APP_API_URL + "timekeeping/all",
  getTimeKeeping: process.env.REACT_APP_API_URL + "timekeeping/get",
  getAllLeaves: process.env.REACT_APP_API_URL + "request/leave/all",
  createEmployee: process.env.REACT_APP_API_URL + "employee/create",
  changePassword: process.env.REACT_APP_API_URL + "user/password",
  refreshToken: process.env.REACT_APP_API_URL + "user/auth/refresh",
  leaveTypes: process.env.REACT_APP_API_URL + "request/leave/types",
  requestLeaveCreate: process.env.REACT_APP_API_URL + "request/leave/create",
  allRequestLeave: process.env.REACT_APP_API_URL + "request/leave/all",
  approveLeave: process.env.REACT_APP_API_URL + "request/leave/approve",
  declineLeave: process.env.REACT_APP_API_URL + "request/leave/decline",


  USERS: process.env.REACT_APP_API_URL + "users",
  USERSTATUS: process.env.REACT_APP_API_URL + "userStatus",
  USERDESIGNATIONS: process.env.REACT_APP_API_URL + "userDesignations",
  UNITS: process.env.REACT_APP_API_URL + "units",
  ROLES: process.env.REACT_APP_API_URL + "roles",
  
  ACCESS: process.env.REACT_APP_API_URL + "access",
  USERS_DELETE: process.env.REACT_APP_API_URL + "users/delete",
  MASTERLIST: process.env.REACT_APP_API_URL + "lists/client",
  GET_TRANSACTION_MASTER_LIST: process.env.REACT_APP_API_URL + "lists/transaction",
  REQUESTS: process.env.REACT_APP_API_URL + "requests",
  BULK_STATUS_REQUESTS: process.env.REACT_APP_API_URL + "request/status",

  NOTIFICATIONS: process.env.REACT_APP_API_URL + "users/notifications",
  NOTIFICATIONS_DELETE: process.env.REACT_APP_API_URL + "users/notifications/delete",
  NOTIFICATIONS_DELETE_ALL: process.env.REACT_APP_API_URL + "users/notifications/deleteAll",
  NOTIFICATIONS_MARK_READ: process.env.REACT_APP_API_URL + "users/notifications", 
  GET_USER_MASTER_LIST: process.env.REACT_APP_API_URL + "lists/user",
  USER: process.env.REACT_APP_API_URL + "user",
  GET_PASSWORD_EXPIRY_NOTIFICATION: process.env.REACT_APP_API_URL + "users/notifications/passwordExpiry",
  GET_USER_DETAILS: process.env.REACT_APP_API_URL + "users/self",
}

export default Api
