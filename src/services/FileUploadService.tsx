import http from "../helpers/axios"
import { Api } from "../api"
import { Utility } from "../utils"


const uploadTimeKeeping = async (file: any, onUploadProgress: any) => {
  const formData = new FormData()

  formData.append("file", file)

  return http.post(`${Api.uploadTimeKeeping}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${Utility.getUserToken() || ""}`,
      credentials: true,
    },
    onUploadProgress,
  })
}

const FileUploadService = {
  uploadTimeKeeping,
}

export default FileUploadService
