import React, { useState } from 'react';
import { RequestAPI, Api } from "../../api"
import http from "../../helpers/axios"
import { Utility } from "../../utils"

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const upload = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
      
        const response = await http.post(`${Api.uploadExcelFile}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Utility.getUserToken() || ""}`,
            credentials: true,
          },
        });

        if (response.status === 200) {
          console.log("File uploaded successfully!");
        } else {
          console.error(`File upload failed with status ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={upload}>Upload</button>
    </div>
  );
};

export default FileUpload;
