import React, { useState } from 'react';
import { async } from 'validate.js';
import { RequestAPI, Api } from "../../api"
import http from "../../helpers/axios"
import { Utility } from "../../utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)

type FileUploadProps = {
  onCloseModal: () => void;
};

const Upload: React.FC<FileUploadProps> = ({ onCloseModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const showAlert = (title: string, text: string, type: "success" | "error") => {
    Swal.fire({
      title: title,
      text: text,
      icon: type,
      confirmButtonText: "OK"
    });
  };

  const close = async () => {
    onCloseModal(); 
  };

  const upload = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await http.post(`${Api.importRecurring}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Utility.getUserToken() || ""}`,
            credentials: true,
          },
        });

        if (response.status === 200) {
          console.log("File uploaded successfully!");
          showAlert("Success", "File uploaded successfully!", "success");
          onCloseModal();
        } else {
          console.error(`File upload failed with status ${response.status}`);
          showAlert("Error", `File upload failed with status ${response.status}`, "error");
        }
      }
    } catch (error) {
      console.error(`Error uploading file: ${error.message}`);
      showAlert("Error", `Error uploading file: ${error.message}`, "error");
    }
  };

  return (
    <div className="form-group">
      <input type="file" accept=".xlsx" className="file-input-style" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={upload}>Upload</button>
    </div>
  );
};

export default Upload;
