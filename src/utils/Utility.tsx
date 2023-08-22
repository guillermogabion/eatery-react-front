import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { RequestAPI, Api } from "../api"
import { history } from "../helpers"
import moment from "moment";
const CryptoJS = require("crypto-js")
const ErrorSwal = withReactContent(Swal)

let activetimerHandler: any = null
let isFetch = true
let userActiveTime: any = 900;
let sessionLoginDate: any = null;

export const Utility = {
  smallalpha: "abcdefghijklmnopqrstuvwxyz",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&",
  isUserActive: false,
  isLoggedIn() {
    return !!sessionStorage.getItem("roles")
  },
  isArrayWithLength(arr: any) {
    return Array.isArray(arr) && arr.length
  },
  getAllowedRoutes(routes: any) {
    const roles = JSON.parse(sessionStorage.getItem("roles") || "")
    return routes.filter(({ permission }: any) => {
      if (!permission) return true
      else if (!Utility.isArrayWithLength(permission)) return true
      else return permission.concat(roles).length
    })
  },
  getUserToken() {
    return (
      CryptoJS.AES.decrypt(sessionStorage.getItem("_as175errepc") || "", process.env.REACT_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8) || ""
    )
  },
  getRefreshToken() {
    return CryptoJS.AES.decrypt(sessionStorage.getItem("_tyg883oh") || "", process.env.REACT_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8) || ""
  },
  deleteUserData() {
    const { location } = history
    sessionStorage.clear()
    if (location.pathname != "/") {
      window.location.href = "/"
    }
  },
  showError(message: any) {
    ErrorSwal.fire({
      icon: "error",
      title: "Oops...",
      text: message || "",
      confirmButtonColor: "#73BF45",
      focusConfirm: true,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();

        if(confirmButton)
          confirmButton.id = "util_errorconfirm_alertbtn"
      },
    })
  },
  generatePassword(characterAmount: any) {
    let password = ""
    for (let i = 0; i < characterAmount; i++) {
      if (i < 1) {
        password += Utility.smallalpha.charAt(Math.floor(Math.random() * Utility.smallalpha.length))
      } else if (i < 3) {
        password += Utility.alpha.charAt(Math.floor(Math.random() * Utility.alpha.length))
      } else if (i < 6 && i > 2) {
        password += Utility.numbers.charAt(Math.floor(Math.random() * Utility.numbers.length))
      } else if (i < 10 && i > 5) {
        password += Utility.symbols.charAt(Math.floor(Math.random() * Utility.symbols.length))
      }
    }
    return password
  },
  getObjectLength(obj = {}) {
    return typeof obj === "object" ? Object.keys(obj).length : 0
  },
  bytesToSize(bytes: any) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return ""
    const i: any = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i]
  },
  getFileTypeIcon(mimeType: any) {
    switch (mimeType) {
      case "application/pdf":
        return "pdf"

      case "application/x-bzip":
      case "application/x-bzip2":
      case "application/gzip":
      case "application/vnd.rar":
      case "application/x-tar":
      case "application/zip":
      case "application/x-7z-compressed":
        return "zip"

      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.oasis.opendocument.text":
      case "application/rtf":
      case "text/plain":
        return "doc"

      case "image/bmp":
      case "image/gif":
      case "image/jpeg":
      case "image/png":
      case "image/webp":
        return "image"

      case "video/x-msvideo":
      case "video/mp4":
      case "video/mpeg":
      case "video/ogg":
      case "video/webm":
      case "video/3gpp":
      case "video/3gpp2":
        return "video"

      case "audio/aac":
      case "audio/mpeg":
      case "audio/ogg":
      case "audio/wav":
      case "audio/webm":
      case "audio/3gpp":
      case "audio/3gpp2":
        return "audio"

      default:
        return "doc"
    }
  },
  getFileExt(fileName: any) {
    return fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1)
  },
  clearOnLoginTimer() {
    clearInterval(activetimerHandler)
  },
  userActiveTimerFun() {
    sessionLoginDate = window.sessionStorage.getItem("_setSessionLoginTimer");
    activetimerHandler = setInterval(() => {
      if (userActiveTime - moment().diff(moment(sessionLoginDate, "DD/MM/YYYY H:mm:ss a"), 'seconds') <= 0) {
        // Logout the user if this script executed
        clearInterval(activetimerHandler)
        window.sessionStorage.removeItem("_setSessionLoginTimer")
        Utility.stopResetTokenTimer();
        const { location } = history
        sessionStorage.clear()
        if (location.pathname != "/") {
          window.location.href = "/"
        }
        return
      }
    }, 1000)
  },
  startTokenProcess() {
    const sessionLogin = moment(sessionLoginDate, "DD/MM/YYYY H:mm:ss a");
    const timeDiffSecond = moment().diff(sessionLogin, 'seconds')

    if (timeDiffSecond > 0 && (userActiveTime - timeDiffSecond < 400) && isFetch) {
      isFetch = false
      RequestAPI.postRequest(Api.refreshToken, "", { "refreshToken": Utility.getRefreshToken() }, {}, async (res: any) => {
        const { status, body } = res;
        isFetch = true
        if (status === 200) {
          if (body.error && body.error.message) {
          } else {
            const { data } = body
            const sessionDateTime = moment().format("DD/MM/YYYY H:mm:ss a");
            window.sessionStorage.setItem("_setSessionLoginTimer", sessionDateTime)
            sessionLoginDate = sessionDateTime;
            window.sessionStorage.setItem("_as175errepc", CryptoJS.AES.encrypt(data.accessToken, process.env.REACT_APP_ENCRYPTION_KEY))
            window.sessionStorage.setItem("_tyg883oh", CryptoJS.AES.encrypt(`${data.refreshToken}`, process.env.REACT_APP_ENCRYPTION_KEY))
          }
        }
      })
    }
  },

  stopResetTokenTimer() {
    document.removeEventListener("mousemove", Utility.startTokenProcess, false)
    document.removeEventListener("mousedown", Utility.startTokenProcess, false)
    document.removeEventListener("keypress", Utility.startTokenProcess, false)
    document.removeEventListener("touchmove", Utility.startTokenProcess, false)
    document.removeEventListener("scroll", Utility.startTokenProcess, true)
    clearInterval(activetimerHandler)
  },
  startResetTokenTimer() {
    document.addEventListener("mousemove", Utility.startTokenProcess, false)
    document.addEventListener("mousedown", Utility.startTokenProcess, false)
    document.addEventListener("keypress", Utility.startTokenProcess, false)
    document.addEventListener("touchmove", Utility.startTokenProcess, false)
    document.addEventListener("scroll", Utility.startTokenProcess, true)
    Utility.userActiveTimerFun()
  },
  formatToCurrency(amount: any, hasSign = true) {
    let sign = ""
    if (hasSign) {
      sign = "₱"
    }
    return amount
      ? sign + Number(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,").toString()
      : sign + "0.00"
  },
  isFirstZero(num: any) {
    if (num.length == 1) {
      if (num[0] == 0) {
        return false
      }
    }
    return true
  },
  removeUnderscore(str: any) {
    return str.replaceAll('_', ' ')
  },
  formatDate(strDate: any, format: any = "MM-DD-YYYY", isTime: any = false) {
    try {
      if (isTime) {
        return moment(strDate, 'YYYY-MM-DD hh:mm A').format(format)
      }
      return moment(strDate, 'YYYY-MM-DD').format(format)
    } catch (error) {
      return strDate
    }

  },
  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  getMonths() {
    return [
      { "name": "January", "value": 1 },
      { "name": "February", "value": 2 },
      { "name": "March", "value": 3 },
      { "name": "April", "value": 4 },
      { "name": "May", "value": 5 },
      { "name": "June", "value": 6 },
      { "name": "July", "value": 7 },
      { "name": "August", "value": 8 },
      { "name": "September", "value": 9 },
      { "name": "October", "value": 10 },
      { "name": "November", "value": 11 },
      { "name": "December", "value": 12 }
    ]
  },
  getYears() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const yearRange = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      yearRange.push({ year: i });
    }

    return yearRange;
  },

  reimbursementStatus(stats: any) {
    switch (stats) {
      case "PENDING":
        return "#189FB5";
      case "APPROVED":
        return "#3BB273";
      case "DECLINED":
        return "#FF3838";
      case "CANCELLED":
        return "#838383";
      default:
        return "#189FB5"; // Default color if no match is found
    }
  },
  uploadReceiptStatus(stats: any) {
    switch (stats) {
      case "Failed":
        return "#E15554";
      case "Success":
        return "#3BB273";
      case "Uploaded":
        return "#189FB5";
      default:
        return "#189FB5"; // Default color if no match is found
    }
  },
}
