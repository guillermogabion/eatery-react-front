import { icon_doc_small, icon_pdf_small, icon_zip_small, icon_mix_doc } from "../assets/images"

const WEEKDAYS: any = {
  Monday: "colorMonday",
  Tuesday: "colorTuesday",
  Wednesday: "colorWednesday",
  Thursday: "colorThursday",
  Friday: "colorFriday",
  Saturday: "colorSaturday",
  Sunday: "colorSunday",
}

const WEEKDAYS_SORT: any = {
  Monday: "M",
  Tuesday: "T",
  Wednesday: "W",
  Thursday: "TH",
  Friday: "F",
  Saturday: "S",
  Sunday: "SU",
}

const DOCUMENT_TYPE: any = {
  doc: icon_doc_small,
  pdf: icon_pdf_small,
  zip: icon_zip_small,
  docx: icon_doc_small,
  png: icon_mix_doc,
  jpeg: icon_mix_doc,
  jpg: icon_mix_doc,
  xlsx: icon_mix_doc,
}

const STATUS_COLOR: any = {
  Draft: "#AAE1F5",
  Pending: "#AAE1F5",
  "Returned to Maker": "#AAE1F5",
  Endorsed: "#F5BEA9",
  Approved: "#A2F96F",
  Declined: "#F5BEA9",
  Cancelled: "#F5BEA9",
  "For Deactivation": "#F5BEA9",
  "For Approval": "#6EF5C8",
  Active: "#A2F96F",
  "Re-Activate": "#6EF5C8",
  Decline: "#F5BEA9",
  Verified: "#A2F96F",
  "For Cancellation": "#cbcec9",
  Scheduled: "#edc68c",
  Inactive: "#cbcec9"
}

const TRANSACTION_TYPE_ACCESS: any = {
  "Cash Delivery to CSU /Cash Hub": "Cash delivery to Hub",
  "Cash delivery to BSP": "Cash delivery to BSP",
  "Cash delivery to depository bank": "Cash delivery to Dep Bank",
  "Cash request from CSU/Cash Hub": "Cash request from Hub",
  "Cash request from depository bank": "Cash request from Dep Bank",
  "Cash request from BSP": "Cash request from BSP",
  "ATM Loading": "ATM Loading",
  "ATM Retrieval": "ATM Retrieval",
  "Change Fund": "Change Fund",
  "Cash Accept Machine": "Cash Accept Machine",
  "Cash Delivery to 3rd Party Service Provider": "Cash Delivery to Third Party",
  "Cash Request from 3rd Party Service Provider": "Cash Request from Third Party",
  Others: "Others",
  "DPU Client": "DPU Client",
}

const REQUEST_STATUS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
}

export { WEEKDAYS, WEEKDAYS_SORT, DOCUMENT_TYPE, STATUS_COLOR, TRANSACTION_TYPE_ACCESS, REQUEST_STATUS }
