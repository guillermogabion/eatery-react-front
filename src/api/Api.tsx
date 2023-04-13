const Api: any = {
  Login: process.env.REACT_APP_API_URL + "user/auth/token",
  timeIn: process.env.REACT_APP_API_URL + "timekeeping/timeIn",
  timeOut: process.env.REACT_APP_API_URL + "timekeeping/timeOut",
  myTimeKeeping: process.env.REACT_APP_API_URL + "mytimekeeping/perday/all",
  timeKeeping: process.env.REACT_APP_API_URL + "timekeeping/all",
  getTimeKeeping: process.env.REACT_APP_API_URL + "timekeeping/get",
  getAllLeaves: process.env.REACT_APP_API_URL + "request/leave/all",
  createEmployee: process.env.REACT_APP_API_URL + "employee/create",
  updateEmployee: process.env.REACT_APP_API_URL + "employee/update",
  changePassword: process.env.REACT_APP_API_URL + "user/password",
  refreshToken: process.env.REACT_APP_API_URL + "user/auth/refresh",
  leaveTypes: process.env.REACT_APP_API_URL + "request/getTypes",
  leaveDayTypes: process.env.REACT_APP_API_URL + "request/leave/daytypes",
  uploadExcelFile : process.env.REACT_APP_API_URL + "employee/uploadExcel",
  getMyLeave : process.env.REACT_APP_API_URL + "employee/myleavecreds",
  
  
  requestLeaveCreate: process.env.REACT_APP_API_URL + "request/leave/create",
  requestLeaveUpdate: process.env.REACT_APP_API_URL + "request/leave/update",
  allMyRequestLeave: process.env.REACT_APP_API_URL + "request/leave/myleaves",
  allRequestLeave: process.env.REACT_APP_API_URL + "request/leave/all",
  getLeave: process.env.REACT_APP_API_URL + "request/leave",
  approveLeave: process.env.REACT_APP_API_URL + "request/leave/approve",
  declineLeave: process.env.REACT_APP_API_URL + "request/leave/decline",
  cancelLeave: process.env.REACT_APP_API_URL + "request/leave/cancel",
  getAllSquad: process.env.REACT_APP_API_URL + "squad/all",
  employeeInformation: process.env.REACT_APP_API_URL + "employee/info",
  allEmployee: process.env.REACT_APP_API_URL + "employee/all",
  OTClassification: process.env.REACT_APP_API_URL + "request/ot/classifications",
  OTCreate: process.env.REACT_APP_API_URL + "request/ot/create",
  myOT: process.env.REACT_APP_API_URL + "request/ot/myot",
  allOvertime: process.env.REACT_APP_API_URL + "request/ot/all",
  approveOT: process.env.REACT_APP_API_URL + "request/ot/approve",
  declineOT: process.env.REACT_APP_API_URL + "request/ot/decline",
  otInformation: process.env.REACT_APP_API_URL + "request/ot/info",
  updateOT: process.env.REACT_APP_API_URL + "request/ot/update",

  myUT: process.env.REACT_APP_API_URL + "request/ut/myut",
  allUndertime: process.env.REACT_APP_API_URL + "request/ut/all",
  UTCreate: process.env.REACT_APP_API_URL + "request/ut/create",
  approveUT: process.env.REACT_APP_API_URL + "request/ut/approve",
  declineUT: process.env.REACT_APP_API_URL + "request/ut/decline",
  utInformation: process.env.REACT_APP_API_URL + "request/ut/info",
  updateUT: process.env.REACT_APP_API_URL + "request/ut/update",
  downloadTimeKeeping: process.env.REACT_APP_API_URL + "timekeeping/perday/downloadExcel",
  uploadTimeKeeping: process.env.REACT_APP_API_URL + "timekeeping/perday/uploadExcel",

  // HOLIDAY
  updateHoliday: process.env.REACT_APP_API_URL + "holiday/update",
  saveHoliday: process.env.REACT_APP_API_URL + "holiday/save",
  allHoliday: process.env.REACT_APP_API_URL + "holiday/all",
  deleteHoliday: process.env.REACT_APP_API_URL + "holiday/delete",
  
  
  // /request/ot/classifications

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

  // locked 

  UNLOCK_EMPLOYEE: process.env.REACT_APP_API_URL + "user/unlock",


  // coa 

  CreateCOA: process.env.REACT_APP_API_URL + "request/coa/create",
  UpdateCOA: process.env.REACT_APP_API_URL + "request/coa/update",
  getAllCOA: process.env.REACT_APP_API_URL + "request/coa/all",
  allMyCOA :  process.env.REACT_APP_API_URL + "request/coa/mycoa",
  getCoaInfo : process.env.REACT_APP_API_URL + "request/coa/info",
  approveCoa :  process.env.REACT_APP_API_URL + "request/coa/approve",
  declineCoa :  process.env.REACT_APP_API_URL + "request/coa/decline",
  deleteCoa :  process.env.REACT_APP_API_URL + "request/coa/delete",


  // employee 

  employeeChangePassword : process.env.REACT_APP_API_URL + "employee/changepassword",



  downloadExcelTemplate : process.env.REACT_APP_API_URL + "employee/downloadTemplate"
}

export default Api
