import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import UserPopup from "../components/Popup/UserPopup"
import { Utility } from "../utils"
const ErrorSwal = withReactContent(Swal)

let logotState = false

const isEmpty = (obj: any) => Object.keys(obj).length === 0 && obj.constructor === Object

const handleResponse = (response: any, jsonResponse: any, blob = false) => {
  const jsonRes = isEmpty(jsonResponse) ? {} : jsonResponse
  const { status, statusText } = response
  const { errors = {} } = Object.assign({}, jsonRes)
  if (blob) return { status, body: jsonResponse, errors, statusText, response }
  else return { status, body: jsonResponse, errors, statusText }
}

const RequestAPI = {
  getHeaders(accessToken: any, lang: any, blob = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken ? accessToken : Utility.getUserToken() || ""}`,
      credentials: true,
      responseType: blob ? "arraybuffer" : "json",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "frame-ancestors 'none'"
    }
  },

  async makeRequest(url: any, key: any, reqData: any, options = { lang: "en" }, callBack: any, blob = false) {
    const headers = this.getHeaders(key, options.lang, blob)
    const init = Object.assign({}, reqData, { headers })
    try {
      await axios({ url, ...init, timeout: 90000 })
        .then((response) => {
          if (url.indexOf("auth/token") > -1) {
            logotState = false
          }
          callBack(handleResponse(response, response.data, blob))
        })
        .catch((er) => {

          if (er.response !== undefined) {
            const { data } = er.response
            const { message, code } = data.error
            if (code === 353 || code === 352 || code === 351) {
              Utility.stopResetTokenTimer()
              if (logotState) return
              logotState = true
              ErrorSwal.fire({
                html: <UserPopup handleClose={ErrorSwal.close} popupType="oops" title="Oops..." text={message || ""} />,
                showConfirmButton: false,
                allowOutsideClick: () => false,
              }).then(() => {
                Utility.deleteUserData()
              })
              localStorage.clear()
              return
            }
            if (code === 403 && message === "Forbidden") {
              Utility.deleteUserData()
              return
            }
          }

          callBack(handleResponse(er && er.response, er && er.response && er.response.data, blob))
        })
    } catch (unnoneError) { }
  },

  getParams(queryParams = {}) {
    return queryParams
  },
  /**
   * GET REQUEST
   */
  getRequest(
    path: any,
    key: any,
    queryParams: any,
    options: any = {},
    callBack: (res: any) => Promise<void | any | undefined>
  ) {
    const getData = {
      method: "GET",
      params: this.getParams(queryParams),
      redirect: "follow",
    }

    this.makeRequest(path, key, getData, options, callBack)
  },
  /**
   * POST REQUEST
   */
  postRequest(
    path: string,
    key: any,
    body: any,
    options: any = { formData: false },
    callBack: (res: any) => Promise<void | any | undefined>
  ) {
    const postData: any = {
      method: "POST",
      redirect: "follow",
    }
    if (Object.keys(body).length) {
      postData.data = JSON.stringify(body)
    } else if (Array.isArray(body)) {
      postData.data = "[]"
    }
    this.makeRequest(path, key, postData, options, callBack)
  },
  /**
   * PUT API
   */
  putRequest(
    path: string,
    key: any,
    body: any,
    options: any = {},
    callBack: (res: any) => Promise<void | any | undefined>
  ) {
    const putData = {
      method: "PUT",
      data: body ? body : "",
      redirect: "follow",
    }
    this.makeRequest(path, key, putData, options, callBack)
  },
  /**
   *  DELETE
   */

  deleteRequest(path: string, key: any, options: any = {}, callBack: (res: any) => Promise<void | any | undefined>) {
    const postData: any = { method: "DELETE", redirect: "follow" }
    if (Object.keys(options).length) {
      postData["data"] = JSON.stringify(options)
    }
    this.makeRequest(path, key, postData, options, callBack)
  },
  /**
   * DOWNLOAD FILE
   */
  getFile(path: any, key: any, filename: any) {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${key ? key : Utility.getUserToken() || ""}`)

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
      strictSSL: false,
    }

    fetch(path, requestOptions)
      .then((response) => response.blob())
      .then((result) => {
        const fileDownload = require("js-file-download")
        fileDownload(result, filename)
      })
  },
  getFileAsync(path: any, key: any, filename: any, callBack: (res: any) => Promise<void | any | undefined>) {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${key ? key : Utility.getUserToken() || ""}`)

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
      strictSSL: false,
    }

    fetch(path, requestOptions)
      .then((response) => response.blob())
      .then((result) => {
        const fileDownload = require("js-file-download")
        fileDownload(result, filename)
        callBack("Done")
      })
  },
  postFileAsync(path: any, key: any, body: any, filename: any, callBack: (res: any) => Promise<void | any | undefined>) {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${key ? key : Utility.getUserToken() || ""}`)
    myHeaders.append("Content-Type", `application/json`)
    myHeaders.append("Accept", "application/json")

    let body_string = body
    if (Object.keys(body).length) {
      body_string = JSON.stringify(body)
    } else if (Array.isArray(body)) {
      body_string = "[]"
    }

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: body_string,
      redirect: "follow",
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
      strictSSL: false,
    }

    fetch(path, requestOptions)
      .then((response) => response.blob())
      .then((result) => {
        const fileDownload = require("js-file-download")
        fileDownload(result, filename)
        callBack("Done")
      })
  },
  getDownloadRequest(
    path: string,
    key: any,
    body: any,
    options: any = { formData: false },
    filename: any
  ) {

    var myHeaders: any = new Headers()
    myHeaders.append("Authorization", `Bearer ${key ? key : Utility.getUserToken() || ""}`);
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");


    var requestOptions: any = {
      method: 'GET',
      headers: myHeaders,
      // body: JSON.stringify(body),
      redirect: 'follow'
    };

    fetch(path, requestOptions)
      .then((response) => response.blob())
      .then((result) => {
        const fileDownload = require("js-file-download")
        fileDownload(result, filename)
      })

  },
  putBillRequest(
    path: string,
    key: any,
    body: any,
    options: any = { formData: false },
    callBack: (res: any) => Promise<void | any | undefined>
  ) {
    const postData: any = {
      method: "PUT",
      redirect: "follow",
    }
    if (Object.keys(body).length) {
      postData.data = JSON.stringify(body)
    } else if (Array.isArray(body)) {
      postData.data = "[]"
    }
    this.makeRequest(path, key, postData, options, callBack)
  },
  putDownloadRequest(
    path: string,
    key: any,
    body: any,
    filename: any
  ) {

    var myHeaders: any = new Headers()
    myHeaders.append("Authorization", `Bearer ${key ? key : Utility.getUserToken() || ""}`);
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");


    var requestOptions: any = {
      method: 'PUT',
      headers: myHeaders,
      body: Object.keys(body).length ? JSON.stringify(body) : JSON.stringify({}),
      redirect: 'follow'
    };



    fetch(path, requestOptions)
      .then((response) => response.blob())
      .then((result) => {
        const fileDownload = require("js-file-download")
        fileDownload(result, filename)
      })

  }
}

export default RequestAPI
