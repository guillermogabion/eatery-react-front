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
  uploadExcelFile: process.env.REACT_APP_API_URL + "employee/uploadExcel",
  getMyLeave: process.env.REACT_APP_API_URL + "employee/myleavecreds",

  leaveTypesList: process.env.REACT_APP_API_URL + "request/getTypeList",
  createLeaveType: process.env.REACT_APP_API_URL + "request/type/create",
  updateLeaveType: process.env.REACT_APP_API_URL + "request/type/update",
  deleteLeaveType: process.env.REACT_APP_API_URL + "request/type/delete",
  updateCredits: process.env.REACT_APP_API_URL + "request/credits/add",
  getUserCredits: process.env.REACT_APP_API_URL + "request/type/creds",


  adminAttendanceSummary: process.env.REACT_APP_API_URL + "timekeeping/attendancesummary",
  adminMissingLogs: process.env.REACT_APP_API_URL + "timekeeping/missinglogs",


  requestLeaveCreate: process.env.REACT_APP_API_URL + "request/leave/create",
  requestLeaveUpdate: process.env.REACT_APP_API_URL + "request/leave/update",
  allMyRequestLeave: process.env.REACT_APP_API_URL + "request/leave/myleaves",
  allRequestLeave: process.env.REACT_APP_API_URL + "request/leave/all",
  getLeave: process.env.REACT_APP_API_URL + "request/leave",
  approveLeave: process.env.REACT_APP_API_URL + "request/leave/approve",
  declineLeave: process.env.REACT_APP_API_URL + "request/leave/decline",
  resendLeave: process.env.REACT_APP_API_URL + "request/leave/resend",
  cancelLeave: process.env.REACT_APP_API_URL + "request/leave/cancel",
  cancelCOA: process.env.REACT_APP_API_URL + "request/coa/cancel",
  cancelOvertime: process.env.REACT_APP_API_URL + "request/ot/cancel",
  cancelUndertime: process.env.REACT_APP_API_URL + "request/ut/cancel",


  employeeList: process.env.REACT_APP_API_URL + "employee/list/all",
  squadEmployeeList: process.env.REACT_APP_API_URL + "employee/list/squadmemberlist",

  getAllSquad: process.env.REACT_APP_API_URL + "squad/all",
  employeeInformation: process.env.REACT_APP_API_URL + "employee/info",
  allEmployee: process.env.REACT_APP_API_URL + "employee/all",
  OTClassification: process.env.REACT_APP_API_URL + "request/ot/classifications",
  OTCreate: process.env.REACT_APP_API_URL + "request/ot/create",
  myOT: process.env.REACT_APP_API_URL + "request/ot/myot",
  allOvertime: process.env.REACT_APP_API_URL + "request/ot/all",
  approveOT: process.env.REACT_APP_API_URL + "request/ot/approve",
  declineOT: process.env.REACT_APP_API_URL + "request/ot/decline",
  resendOT: process.env.REACT_APP_API_URL + "request/ot/resend",
  otInformation: process.env.REACT_APP_API_URL + "request/ot/info",
  updateOT: process.env.REACT_APP_API_URL + "request/ot/update",

  myUT: process.env.REACT_APP_API_URL + "request/ut/myut",
  allUndertime: process.env.REACT_APP_API_URL + "request/ut/all",
  UTCreate: process.env.REACT_APP_API_URL + "request/ut/create",
  approveUT: process.env.REACT_APP_API_URL + "request/ut/approve",
  declineUT: process.env.REACT_APP_API_URL + "request/ut/decline",
  resendUT: process.env.REACT_APP_API_URL + "request/ut/resend",
  utInformation: process.env.REACT_APP_API_URL + "request/ut/info",
  updateUT: process.env.REACT_APP_API_URL + "request/ut/update",
  downloadTimeKeeping: process.env.REACT_APP_API_URL + "timekeeping/perday/downloadExcel",
  downloadTimeKeepingSquad: process.env.REACT_APP_API_URL + "timekeeping/perday/downloadExcel/squad",
  uploadTimeKeeping: process.env.REACT_APP_API_URL + "timekeeping/perday/uploadExcel",

  // HOLIDAY
  updateHoliday: process.env.REACT_APP_API_URL + "holiday/update",
  saveHoliday: process.env.REACT_APP_API_URL + "holiday/save",
  allHoliday: process.env.REACT_APP_API_URL + "holiday/all",
  deleteHoliday: process.env.REACT_APP_API_URL + "holiday/delete",

  // Schedule Adjustment
  myScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/myrequests",
  allScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/all",
  getScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment",
  createScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/create",
  updateScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/update",
  declineScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/decline",
  resendScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/resend",
  approveScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/approve",
  cancelScheduleAdjustment: process.env.REACT_APP_API_URL + "request/schedule-adjustment/cancel",

  forgotPassword: process.env.REACT_APP_API_URL + "user/forgotpassword",

  addBioLogs: process.env.REACT_APP_API_URL + "timekeeping/addLog",
  updateBioLogs: process.env.REACT_APP_API_URL + "timekeeping/updateLog",
  deleteBioLogs: process.env.REACT_APP_API_URL + "timekeeping/deleteLog",

  mySchedule: process.env.REACT_APP_API_URL + "timekeeping/mySchedule",
  myAttendanceSummary: process.env.REACT_APP_API_URL + "timekeeping/myattendancesummary",
  getMissingLogs: process.env.REACT_APP_API_URL + "timekeeping/missinglogs",


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
  allMyCOA: process.env.REACT_APP_API_URL + "request/coa/mycoa",
  getCoaInfo: process.env.REACT_APP_API_URL + "request/coa/info",
  approveCoa: process.env.REACT_APP_API_URL + "request/coa/approve",
  declineCoa: process.env.REACT_APP_API_URL + "request/coa/decline",
  resendCoa: process.env.REACT_APP_API_URL + "request/coa/resend",
  deleteCoa: process.env.REACT_APP_API_URL + "request/coa/delete",


  // employee 

  employeeChangePassword: process.env.REACT_APP_API_URL + "employee/changepassword",



  downloadExcelTemplate: process.env.REACT_APP_API_URL + "employee/downloadTemplate",
  downloadExcelTimekeepingTemplate: process.env.REACT_APP_API_URL + "timekeeping/perday/downloadTemplate",

  // squad 

  getSquadMember: process.env.REACT_APP_API_URL + "employee/squadmembers",
  getAllSquadLeaves: process.env.REACT_APP_API_URL + "request/leave/squadmembers",
  getAllSquadCoa: process.env.REACT_APP_API_URL + "request/coa/squadmembers",
  allSquadOvertime: process.env.REACT_APP_API_URL + "request/ot/squadmembers",
  allSquadUndertime: process.env.REACT_APP_API_URL + "request/ut/squadmembers",
  allSquadSchedule: process.env.REACT_APP_API_URL + "request/schedule-adjustment/squadmembers",

  // recurring 
  getAllRecurringList: process.env.REACT_APP_API_URL + "payroll/recurring/all",
  getAllRecurringType: process.env.REACT_APP_API_URL + "payroll/recurring/type/list",
  importRecurring :  process.env.REACT_APP_API_URL + "payroll/recurring/uploadExcel",
  exportRecurring :  process.env.REACT_APP_API_URL + "payroll/recurring/exportExcel",
  templateRecurring :  process.env.REACT_APP_API_URL + "payroll/recurring/downloadTemplate",


  // adjustment 
  importAdjustment :  process.env.REACT_APP_API_URL + "payroll/adjustment/uploadExcel",
  exportAdjustment :  process.env.REACT_APP_API_URL + "payroll/adjustment/exportExcel",
  downloadTemplateAdjustment :  process.env.REACT_APP_API_URL + "payroll/adjustment/downloadTemplate",


  // getAllRecurringType : process.env.REACT_APP_API_URL + "payroll/recurring/type/all",
  createRecurringTransaction: process.env.REACT_APP_API_URL + "payroll/recurring/create",
  updateRecurringTransaction: process.env.REACT_APP_API_URL + "payroll/recurring/update",
  recurringInfo: process.env.REACT_APP_API_URL + "payroll/recurring/info",
  deleteRecurring: process.env.REACT_APP_API_URL + "payroll/recurring/delete",

  // payroll 

  getAllPayrollList: process.env.REACT_APP_API_URL + "payroll/adjustment/all",
  getAdjustmentType: process.env.REACT_APP_API_URL + "payroll/adjustment/type/list",
  payrollAdjustmentCreate: process.env.REACT_APP_API_URL + "payroll/adjustment/create",
  getPayrollAdjustmentInfo: process.env.REACT_APP_API_URL + "payroll/adjustment/info",
  editPayrollAdjustment: process.env.REACT_APP_API_URL + "payroll/adjustment/update",
  payrollAll: process.env.REACT_APP_API_URL + "payroll/all",
  payrollTimekeeping: process.env.REACT_APP_API_URL + "timekeeping/perday/all/totalhours",
  generatePayroll: process.env.REACT_APP_API_URL + "payroll/generate",
  reGeneratePayroll: process.env.REACT_APP_API_URL + "payroll/regenerate",
  createPayroll: process.env.REACT_APP_API_URL + "payroll/create",
  auditPayroll: process.env.REACT_APP_API_URL + "payroll/audit",
  downloadPayrollRegister: process.env.REACT_APP_API_URL + "payroll/payollregister",
  downloadBankUpload: process.env.REACT_APP_API_URL + "payroll/bankupload",


  // payroll setting 
  getAllRecurringTypeSetting: process.env.REACT_APP_API_URL + "payroll/recurring/type/all",
  createRecurringTypeSetting: process.env.REACT_APP_API_URL + "payroll/recurring/type/create",
  updateRecurringTypeSetting: process.env.REACT_APP_API_URL + "payroll/recurring/type/update",
  getRecurringTypeInfo: process.env.REACT_APP_API_URL + "payroll/recurring/type/info",
  deleteRecurringType: process.env.REACT_APP_API_URL + "payroll/recurring/type/delete",

  getAllAdjustmentSetting: process.env.REACT_APP_API_URL + "payroll/adjustment/type/all",
  getAdjustmentTypeInfo: process.env.REACT_APP_API_URL + "payroll/adjustment/type/info",
  addAdjustmentType: process.env.REACT_APP_API_URL + "payroll/adjustment/type/create",
  editAdjustmentType: process.env.REACT_APP_API_URL + "payroll/adjustment/type/update",
  deleteAdjustmentType: process.env.REACT_APP_API_URL + "payroll/adjustment/type/delete",


  // hdmf

  getHdmf: process.env.REACT_APP_API_URL + "payroll/hdmf/info",
  updateHDMF: process.env.REACT_APP_API_URL + "payroll/hdmf/update",
  getPH: process.env.REACT_APP_API_URL + "payroll/ph/info",
  updatePH: process.env.REACT_APP_API_URL + "payroll/ph/update",


  // SSS 

  getSSS: process.env.REACT_APP_API_URL + "payroll/sss/info",
  downloadTemplateSSS: process.env.REACT_APP_API_URL + "payroll/sss/downloadTemplate",
  uploadSSSTable: process.env.REACT_APP_API_URL + "payroll/sss/uploadExcel",

  // tax 

  getMonthTax: process.env.REACT_APP_API_URL + "payroll/tax/view/monthly",
  getYearTax: process.env.REACT_APP_API_URL + "payroll/tax/view/yearly",

  uploadTaxMonthly: process.env.REACT_APP_API_URL + "payroll/tax/uploadExcel/monthly",
  uploadTaxYearly: process.env.REACT_APP_API_URL + "payroll/tax/uploadExcel/annual",

  downloadTaxMonthly: process.env.REACT_APP_API_URL + "payroll/tax/downloadTemplate/monthly",
  downloadTaxYearly: process.env.REACT_APP_API_URL + "payroll/tax/downloadTemplate/annual",

  //  overtime setting 
  getOvertimeSetting: process.env.REACT_APP_API_URL + "payroll/ot/info",
  updateOvertimeSetting: process.env.REACT_APP_API_URL + "payroll/ot/update",


  // timekeeping ++ 

  recalculate: process.env.REACT_APP_API_URL + "timekeeping/perday/recalculate",


  // email sending 
  payrollPayList: process.env.REACT_APP_API_URL + "payroll/list",
  payrollPayListAll: process.env.REACT_APP_API_URL + "payroll/all",
  generatedList: process.env.REACT_APP_API_URL + "payroll/generated/list",
  sendIndividual: process.env.REACT_APP_API_URL + "payroll/sendpayslip",
  sendAll: process.env.REACT_APP_API_URL + "payroll/sendpayslip/all",
  failedEmail : process.env.REACT_APP_API_URL + "payroll/failedemail",
  resendEmail : process.env.REACT_APP_API_URL + "payroll/resendpayslip",

  // Last Pay
  lastPayList: process.env.REACT_APP_API_URL + "lastpay/employee/list",
  generateLastPay: process.env.REACT_APP_API_URL + "lastpay/generate",
  lastPayInfo: process.env.REACT_APP_API_URL + "lastpay/info",

  getDaysPerYear : process.env.REACT_APP_API_URL + "payroll/daysperyear/info",
  updateDaysPerYear : process.env.REACT_APP_API_URL + "payroll/daysperyear/update",
  
  getDaysPerMonth : process.env.REACT_APP_API_URL + "payroll/dayspermonth/info",
  updateDaysPerMonth : process.env.REACT_APP_API_URL + "payroll/dayspermonth/update",
  
  getDaysPerWeek : process.env.REACT_APP_API_URL + "payroll/daysperweek/info",
  updateDaysPerWeek : process.env.REACT_APP_API_URL + "payroll/daysperweek/update",
  
  getHourPerDay : process.env.REACT_APP_API_URL + "payroll/hoursperday/info",
  updateHourPerDay : process.env.REACT_APP_API_URL + "payroll/hoursperday/update",


  // AccessRights 

  getRoles : process.env.REACT_APP_API_URL + "role/authority/all-roles",
  getRolesAuth : process.env.REACT_APP_API_URL + "role/authority/authority-by-role",
  deleteRoleAuth : process.env.REACT_APP_API_URL + "role/authority/delete",
  addRoleAuth : process.env.REACT_APP_API_URL + "role/authority/add",
}

export default Api
