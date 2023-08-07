import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"
import moment from "moment"
import { Button, Modal, Form, Tabs, Tab, Row, Col } from "react-bootstrap"
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import TimeDate from "../../components/TimeDate"
import { async } from "validate.js"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import { Formik } from "formik"
import * as Yup from "yup"
import ContainerWrapper from "../../components/ContainerWrapper"
import { regenerate, eye, show_password_dark, gallery_img, cloud_upload } from "../../assets/images"
import { Utility } from "../../utils"
import ContentWrapper from "../../components/ContentWrapper"
import { ReimbursementList } from "./component/reimbursementList"
import { UploadReceipt } from "./component/uploadReceipt"
import { FileUploader } from "react-drag-drop-files";
import { auto } from "@popperjs/core"
import { BsFillXCircleFill } from "react-icons/bs";
import FileUploadService from "../../services/FileUploadService";

const ErrorSwal = withReactContent(Swal)

export const Reimbursement = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const formRef: any = useRef()
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const [key, setKey] = React.useState('reimbursement');
    const [uploadModal, setUploadModal] = React.useState(false);
    const [file, setFile] = useState(null);

    const fileTypes = ["JPG", "PNG", "GIF"];
    const tableHeaders = [
        'File Name',
        'Type',
        'Status',
        'Actions',
    ];

    const [initialValues, setInitialValues] = useState<any>({
        "payrollMonth": "",
        "payrollYear": "",
        "from": "",
        "to": "",
        "userIds": []
    })

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const handleChange = (file: any) => {
        setFile(file);
    };

    const [files, setFiles] = useState([])
    const [storedFiles, setStoredFiles] = useState<any>([])
    const handleDrop = (event: any) => {
        event.preventDefault();
        const { files } = event.dataTransfer;
        if (files.length > 0) {
            selectFiles(files, true)
            // setStoredFiles([...files])
        }
    }
    const progressInfosRef: any = useRef(null)
    const [progressInfos, setProgressInfos] = useState<any>({ val: [] })

    const selectFiles = (e: any, onDrop: any = false) => {
        const storedFilesTemp = [...storedFiles]
        let files: any = []
        if (onDrop) {
            files = Array.from(e)
        } else {
            files = Array.from(e.target.files)
        }

        if (files.length > 0) {
            files.forEach((element: any, i: number) => {
                if (i < 5) {
                    if (element.size > 3072000) {
                        ErrorSwal.fire({
                            icon: "error",
                            title: "File Skipped!",
                            text: `"${element.name}" file size is greater than 3MB.`,
                            confirmButtonColor: "#73BF45",
                        })
                        delete files[i]
                    } else {
                        storedFilesTemp.push(element)
                    }
                } else {

                }
            })
            setStoredFiles(storedFilesTemp)
            let _previousProgressInfos = []
            if (progressInfosRef && progressInfosRef.current) {
                _previousProgressInfos = progressInfosRef.current.val.map((file: any) => ({
                    percentage: file.percentage,
                    fileName: file.fileName,
                    fileSizeBytes: file.fileSizeBytes,
                    fileSize: file.fileSize,
                    fileType: file.fileType,
                }))
            }

            const _progressInfos = storedFilesTemp.map((file: any) => ({
                percentage: 0,
                fileName: file.name,
                fileSizeBytes: file.size,
                fileSize: Utility.bytesToSize(file.size),
                fileType: Utility.getFileTypeIcon(file.type),
            }))
            setProgressInfos({ val: _progressInfos.concat(_previousProgressInfos) })
        }

    }

    const upload = (idx: any, file: any) => {
        const _progressInfos = [...progressInfosRef.current.val]
        return FileUploadService.uploadReimbursementReceipt(file, (event: any) => {
            _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total)

            if (_progressInfos.length < 5) {
                setProgressInfos({ val: _progressInfos })
            }
        })
            .then(() => {
                // set "Uploaded the file successfully: " + file.name,
            })
            .catch(() => {
                _progressInfos[idx].percentage = 0
                if (progressInfos.length < 5) {
                    setProgressInfos({ val: _progressInfos })
                }
            })
    }

    const uploadFiles = () => {
        const _progressInfos = storedFiles.map((file: any) => ({
            percentage: 0,
            fileName: file.name,
            fileSizeBytes: file.size,
            fileSize: Utility.bytesToSize(file.size),
            fileType: Utility.getFileTypeIcon(file.type),
        }))

        let _previousProgressInfos = []
        if (progressInfosRef && progressInfosRef.current) {
            _previousProgressInfos = progressInfosRef.current.val.map((file: any) => ({
                percentage: file.percentage,
                fileName: file.fileName,
                fileSizeBytes: file.fileSizeBytes,
                fileSize: file.fileSize,
                fileType: file.fileType,
            }))
        }

        progressInfosRef.current = {
            val: _progressInfos.concat(_previousProgressInfos),
        }

        const uploadPromises = storedFiles.map((file: any, i: number) => upload(i, file))

        Promise.all(uploadPromises)
            // .then(() => loadClientAgain())
            .then(() => {
                // ErrorSwal.fire({
                //     icon: "success",
                //     title: "Success!",
                //     text: "Documents Successfully uploaded.",
                //     confirmButtonColor: "#73BF45",
                // })
                // setShowMaxFile("")
                // setUploadShow(false)
            })

        // setMessage([])
    }

    return (
        <ContainerWrapper contents={<>
            <div className="px-5 mt-5">
                <div className="mb-3">
                    <Button
                        className="mr-3"
                        onClick={() => {
                            alert("G")
                        }}>
                        Create Reimbursement
                    </Button>
                    <Button
                        className=""
                        onClick={() => {
                            setUploadModal(true)
                        }}>
                        Upload Receipt
                    </Button>
                </div>
                <ContentWrapper name="Reimbursement Dashboard" hasMenu={false} content={<>

                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k: any) => {
                            setKey(k)
                        }}
                        className="mb-3"
                    >
                        <Tab eventKey="reimbursement" title="Reimbursement Dashboard">
                            {
                                key == 'reimbursement' ?
                                    <ReimbursementList />
                                    :
                                    null
                            }
                        </Tab>
                        <Tab eventKey="uploadReceipt" title="Uploaded Receipt">
                            {
                                key == 'uploadReceipt' ?
                                    <UploadReceipt />
                                    :
                                    null
                            }
                        </Tab>
                    </Tabs>

                </>
                } />

                <Modal
                    show={uploadModal}
                    size={"lg"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}
                    onHide={() => setUploadModal(false)}
                    dialogClassName="modal-90w"
                    id="accessrights_authlist_modal"
                >
                    <Modal.Header className="text-center flex justify-center">
                        <Modal.Title id="contained-modal-title-vcenter" className="font-bold text-md">
                            Upload Receipt
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="row w-100 px-3 m-0">
                        <div className="w-100 px-3 py-3 flex flex-column justify-center mb-5 bg-[#F2F2F2] cursor-pointer" >
                            <div className="bg-white rounded-md p-3 py-4 border border-dashed border-green-50 w-100 relative" onDrop={handleDrop}>
                                <div className="flex justify-center">
                                    <img src={cloud_upload} alt="Show" width={75} height="auto" />
                                </div>
                                <div className="text-center cursor-pointer">
                                    <h3 className="mt-3 text-sm font-bold text-[#189FB5]">Drag & Drop or choose file to upload</h3>
                                    <label className="mt-2 text-xs text-dark">Supported file types: BMP, TIFF, JPEG, GIF, PNG and PDF</label> <br />
                                    <label className="text-xs mt-[-10px] text-dark">Maximum file size per attachment: 3 mb.</label>
                                </div>
                                <input
                                    id="fileInput"
                                    className="fileInput bg-dark"
                                    type="file"
                                    multiple
                                    onChange={(e: any) => {
                                        selectFiles(e, false)
                                    }}
                                />
                            </div>
                            {progressInfos &&
                                progressInfos.val.length > 0 &&
                                progressInfos.val.map((progressInfo: any, index: any) => {
                                    const srcIconType = Utility.getFileTypeIcon(progressInfo.fileType)
                                    return (
                                        <div className="row m-0 p-0 rounded-md border border-dashed border-green-50 p-3 flex mt-3 w-full">
                                            <div className="col-md-1 mt-[2px]">
                                                <img src={gallery_img} width={60} />
                                            </div>
                                            <div className="col-md-10">
                                                <div className="flex justify-between">
                                                    <label htmlFor="">{progressInfo.fileName}</label>
                                                    <label htmlFor="">{progressInfo.fileSize}</label>
                                                </div>
                                                <div>
                                                    <label htmlFor="" className="text-md text-[#189FB5] font-bold">{progressInfo.percentage == 100 ? "Uploaded" : "Uploading"}</label>
                                                    <ProgressBar now={progressInfo.percentage} className="bg-[#C2C2C2] h-[13px] mt-1" />
                                                </div>
                                            </div>
                                            <div className="col-md-1 flex justify-center items-center">
                                                <BsFillXCircleFill size={20} color="#E15554" />
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                        <div className="w-100 px-3 py-2 flex flex-column justify-center mb-5 bg-[#F2F2F2] cursor-pointer">
                            <div className="row m-0 p-0  bg-white rounded-md border border-dashed border-green-50 p-3 flex w-full overflow-auto">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            {
                                                tableHeaders &&
                                                tableHeaders.length &&
                                                tableHeaders.map((item: any, index: any) => {
                                                    return (
                                                        <th style={{ width: 'auto' }}>{item}</th>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {
                                            reimbursementList &&
                                            reimbursementList.content &&
                                            reimbursementList.content.length > 0 && (
                                                reimbursementList.content.map((item: any, index: any) => {
                                                    return (
                                                        <tr>
                                                            <td> {item.typeName} </td>
                                                            <td> {item.approvedBudget} </td>
                                                            <td> {item.amount} </td>
                                                            <td> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                            <td> {item.status} </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        } */}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                onClick={() => setUploadModal(false)}
                                className="w-[180px] mr-2">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => uploadFiles()}
                                className="w-[180px] mr-2">
                                Upload
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>} />

    )
}

