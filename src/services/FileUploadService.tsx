import http from "../helpers/axios"
import { Api } from "../api"
import { Utility } from "../utils"

const upload = async (file: any, clientId: any, documentTypeRadio: any, onUploadProgress: any) => {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("documentType", documentTypeRadio)

  return http.post(`${Api.CLIENTS}/${clientId}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${Utility.getUserToken() || ""}`,
      credentials: true,
    },
    onUploadProgress,
  })
}

const uploadBillingDocument = async (file: any, billingId: any, documentTypeRadio: any, onUploadProgress: any) => {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("documentType", documentTypeRadio)

  return http.post(`${Api.BILLING_REPORT_STORE_LEVEL_BY_ID_DOWNLOAD}/${billingId}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${Utility.getUserToken() || ""}`,
      credentials: true,
    },
    onUploadProgress,
  })
}

const FileUploadService = {
  upload,
  uploadBillingDocument,
}

export default FileUploadService
