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
import { regenerate, eye, show_password_dark, gallery_img, cloud_upload, add_reimbursement, inactive_review, active_review } from "../../assets/images"
import { Utility } from "../../utils"
import ContentWrapper from "../../components/ContentWrapper"
import { ReimbursementList } from "./component/reimbursementList"
import { UploadReceipt } from "./component/uploadReceipt"
import { FileUploader } from "react-drag-drop-files";
import { auto } from "@popperjs/core"
import { BsFillCheckCircleFill, BsFillCloudUploadFill, BsFillXCircleFill, BsPlus } from "react-icons/bs";
import FileUploadService from "../../services/FileUploadService";
import { update, values } from "lodash";
import { FaRegTrashAlt, FaTimesCircle } from "react-icons/fa";

const ErrorSwal = withReactContent(Swal)

export const Reimbursement = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const formRef: any = useRef()
    const [receiptList, setReceiptList] = useState<any>([]);
    const [key, setKey] = React.useState('reimbursement');
    const [uploadModal, setUploadModal] = React.useState(false);
    const [createReimbursementModal, setCreateReimbursementModal] = React.useState(false);

    const [isSubmitCreateReim, setIsSubmitCreateReim] = React.useState(false);


    const [createStep, setCreateStep] = React.useState(1);
    const [reimbursementType, setReimbursementType] = React.useState([])
    const [reimbursementValues, setReimbursementValues] = React.useState([{
        "receiptId": "",
        "amount": "",
        "companyName": "",
        "transactionDate": "",
        "tin": "",
        "invoice": "",
        "receipt": true,
        "filePath": "",
        "fileName": "",
        "fileContentType": "",
        "isDisplayData": false
    }]);
    const [reimbursementParentValues, setReimbursementParentValues] = React.useState({
        "approvedBudget": "",
        "total": "",
        "purpose": "",
        "remark": "",
        "typeId": "",
        "transactionDate": ""
    });
    const [file, setFile] = useState(null);
    const [onSubmit, setOnSubmit] = useState(false);

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
        const allowedFormats = ['image/bmp', 'image/tiff', 'image/jpeg', 'image/gif', 'image/png', 'application/pdf'];
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
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();
                      
                                if(confirmButton)
                                  confirmButton.id = "reimbursementindex_fileskippedconfirm_alertbtn"
                              },
                        })
                        delete files[i]
                    } else if (!allowedFormats.includes(element.type)) {
                        ErrorSwal.fire({
                            icon: "error",
                            title: "File Skipped!",
                            text: `"${element.name}" is not a valid file format.`,
                            confirmButtonColor: "#73BF45",
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();
                      
                                if(confirmButton)
                                  confirmButton.id = "reimbursementindex_fileskippedconfirm2_alertbtn"
                              },
                        });
                    } else {
                        storedFilesTemp.push(element);
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
                ErrorSwal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Files Successfully uploaded.",
                    confirmButtonColor: "#73BF45",
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "reimbursementindex_fileuploadsuccessconfirm_alertbtn"
                      },
                }).then((e) => {
                    if (e.isConfirmed) {
                        location.reload()
                    }
                })

            })

        // setMessage([])
    }

    useEffect(() => {
        getUploadedReceipts(0)
        getReimbursementType()
    }, [])

    const getUploadedReceipts = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.createReimbursementReceiptList}/${data.profile.userId}?sort=id&sortDir=DESC`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setReceiptList(body.data)
                    }
                }
            }
        )
    }

    const getReimbursementType = () => {
        RequestAPI.getRequest(
            `${Api.reimbursementType}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        console.log(body)
                        setReimbursementType(body.data)
                    }
                }
            }
        )
    }

    const newItem = () => {
        const valuesObj: any = [...reimbursementValues]
        if (valuesObj.length < 5) {
            valuesObj.push({
                "receiptId": "",
                "amount": "",
                "companyName": "",
                "transactionDate": "",
                "tin": "",
                "invoice": "",
                "receipt": true,
                "filePath": "",
                "fileName": "",
                "fileContentType": "",
                "isDisplayData": false
            })
            setReimbursementValues([...valuesObj])
        }
    }

    const updateData = (index: any, key: any, value: any) => {
        const valuesObj: any = [...reimbursementValues]
        valuesObj[index][key] = value
        if (key == 'receipt' && value == false) {
            valuesObj[index]['receiptId'] = ""
            valuesObj[index]['tin'] = ""
            valuesObj[index]['invoice'] = ""
            valuesObj[index]['companyName'] = ""
            valuesObj[index]['transactionDate'] = ""
            valuesObj[index]['amount'] = ""
            valuesObj[index]['isDisplayData'] = false
        }
        setReimbursementValues([...valuesObj])
    }

    const selectReceipt = (index: any, key: any, value: any) => {
        const valuesObj: any = receiptList

        if (valuesObj) {
            valuesObj.forEach((element: any, i: any) => {
                if (element.id == value) {
                    const valuesObj: any = [...reimbursementValues]
                    valuesObj[index]['receiptId'] = (element.id || "")
                    valuesObj[index]['tin'] = (element.tin || "")
                    valuesObj[index]['invoice'] = (element.invoice || "")
                    valuesObj[index]['companyName'] = (element.companyName || "")
                    valuesObj[index]['transactionDate'] = (element.transactionDate || "")
                    valuesObj[index]['filePath'] = (element.fileNamePath || "")
                    valuesObj[index]['fileName'] = (element.fileName || "")
                    valuesObj[index]['fileContentType'] = (element.fileContentType || "")
                    valuesObj[index]['amount'] = (element.amount || "")
                    valuesObj[index]['isDisplayData'] = true
                    setReimbursementValues([...valuesObj])
                    return;
                }
            });
        }
    }

    const updateParentData = (key: any, value: any) => {
        const valuesObj: any = { ...reimbursementParentValues }
        valuesObj[key] = value
        setReimbursementParentValues({ ...valuesObj })
    }

    const createReimbursement = () => {
        const parentPayload: any = { ...reimbursementParentValues }
        const valuesObj: any = [...reimbursementValues]
        valuesObj.forEach((data: any, index: any) => {
            data.parentId = 12
        });

        RequestAPI.postRequest(Api.createReimbursement, "", parentPayload, {}, async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 || status === 201) {
                if (body.error && body.error.message) {
                    ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "reimbursementindex_errorconfirm_alertbtn"
                        },
                        icon: 'error',
                    })
                    setIsSubmitCreateReim(false)
                } else {
                    let message: any = body.message
                    const valuesObj: any = [...reimbursementValues]
                    let payload = {
                        "parentId": body.parentId,
                        "breakdownList": valuesObj
                    }

                    RequestAPI.postRequest(Api.createBulkReimbursement, "", payload, {}, async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 || status === 201) {
                            if (body.error && body.error.message) {
                                ErrorSwal.fire({
                                    title: 'Error!',
                                    text: (body.error && body.error.message) || "",
                                    didOpen: () => {
                                      const confirmButton = Swal.getConfirmButton();
                            
                                      if(confirmButton)
                                        confirmButton.id = "reimbursementindex_errorconfirm2_alertbtn"
                                    },
                                    icon: 'error',
                                })
                                setIsSubmitCreateReim(false)
                            } else {
                                ErrorSwal.fire({
                                    title: 'Success!',
                                    text: message || "",
                                    didOpen: () => {
                                      const confirmButton = Swal.getConfirmButton();
                            
                                      if(confirmButton)
                                        confirmButton.id = "reimbursementindex_successconfirm_alertbtn"
                                    },
                                    icon: 'success',
                                }).then((e) => {
                                    setIsSubmitCreateReim(false)
                                    if (e.isConfirmed) {
                                        location.reload()
                                    }
                                })
                            }
                        } else {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: "Something Error.",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "reimbursementindex_errorconfirm3_alertbtn"
                                },
                                icon: 'error',
                            })
                            setIsSubmitCreateReim(false)
                        }
                    })
                }
            } else {
                ErrorSwal.fire({
                    title: 'Error!',
                    text: "Something Error.",
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
            
                      if(confirmButton)
                        confirmButton.id = "reimbursementindex_errorconfirm4_alertbtn"
                    },
                    icon: 'error',
                })
                setIsSubmitCreateReim(false)
            }
        })
    }

    const deleteItem = (index: any) => {
        const valuesObj: any = [...reimbursementValues]
        if (valuesObj.length > 1) {
            valuesObj.splice(index, 1)
            setReimbursementValues([...valuesObj])
        }
    }

    const validateBreakdown = () => {
        const valuesObj: any = [...reimbursementValues]
        console.log(valuesObj)
        let hasBlank: any = false
        let totalAmount: any = 0
        valuesObj.forEach((data: any, index: any) => {
            totalAmount = totalAmount + parseFloat(data.amount)
            if (data.receipt) {
                if (data.invoice == "" || data.invoice == null) {
                    hasBlank = true
                }
                if (data.companyName == "" || data.companyName == null) {
                    hasBlank = true
                }
                if (data.tin == "" || data.tin == null) {
                    hasBlank = true
                }
                if (data.transactionDate == "" || data.transactionDate == null) {
                    hasBlank = true
                }
                if (data.amount == "" || data.amount == null) {
                    hasBlank = true
                }
            } else {
                if (data.transactionDate == "" || data.transactionDate == null) {
                    hasBlank = true
                }
                if (data.companyName == "" || data.companyName == null) {
                    hasBlank = true
                }
                if (data.amount == "" || data.amount == null) {
                    hasBlank = true
                }
            }
        });
        if (hasBlank) {
            ErrorSwal.fire({
                title: 'Warning!',
                text: "Please fill all fields.",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "reimbursementindex_warningconfirm_alertbtn"
                },
                icon: 'warning',
            })
        } else {
            const valuesObj: any = { ...reimbursementParentValues }
            valuesObj.total = totalAmount
            console.log(valuesObj)
            setReimbursementParentValues({ ...valuesObj })
            setCreateStep(2)
        }
    }

    const validateParent = () => {
        const valuesObj: any = { ...reimbursementParentValues }
        let hasBlank: any = false
        let invalidAmount: any = false
        if (valuesObj.typeId == "" || valuesObj.typeId == null) {
            hasBlank = true
        }
        if (valuesObj.total == "" || valuesObj.total == null) {
            hasBlank = true
        }
        if (valuesObj.purpose == "" || valuesObj.purpose == null) {
            hasBlank = true
        }

        if (valuesObj.total <= 0) {
            invalidAmount = true
        }

        if (hasBlank) {
            ErrorSwal.fire({
                title: 'Warning!',
                text: "Please fill all fields.",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "reimbursementindex_warningconfirm2_alertbtn"
                },
                icon: 'warning',
            })
        } else if (invalidAmount) {
            ErrorSwal.fire({
                title: 'Warning!',
                text: "Total amount should be 0 or less.",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "reimbursementindex_warningconfirm3_alertbtn"
                },
                icon: 'warning',
            })
        } else {
            setIsSubmitCreateReim(true)
            createReimbursement()
        }
    }

    return (
        <ContainerWrapper contents={<>
            <div className="px-5 mt-5" style={{ height: 'calc(90vh - 100px)', overflowY: 'scroll' }}>
                <div className="mb-3 flex">
                    <Button
                        className="mr-3 flex items-center"
                        id={"reimbursementindex_uploadreceipt_btn"}
                        onClick={() => {
                            setUploadModal(true)
                        }}>
                        <BsFillCloudUploadFill size={15} className="mr-1" />
                        Upload Receipt
                    </Button>
                    <Button
                        id={"reimbursementindex_createreimbursement_btn"}
                        className="flex items-center"
                        onClick={() => {
                            getUploadedReceipts(0)
                            setCreateReimbursementModal(true)
                            setReimbursementValues([{
                                "receiptId": "",
                                "amount": "",
                                "companyName": "",
                                "transactionDate": "",
                                "tin": "",
                                "invoice": "",
                                "receipt": true,
                                "filePath": "",
                                "fileName": "",
                                "fileContentType": "",
                                "isDisplayData": false
                            }])
                            setReimbursementParentValues({
                                "approvedBudget": "",
                                "total": "",
                                "purpose": "",
                                "remark": "",
                                "typeId": "",
                                "transactionDate": ""
                            })
                        }}>
                        <BsPlus size={27} color={"#fff"} />
                        Create Reimbursement
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
                        <Tab id={"reimbursementindex_reimbursementlist_tab"} eventKey="reimbursement" title="Reimbursements">
                            {
                                key == 'reimbursement' ?
                                    <ReimbursementList />
                                    :
                                    null
                            }
                        </Tab>
                        <Tab id={"reimbursementindex_uploadreceipt_tab"} eventKey="uploadReceipt" title="Uploaded Receipt">
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
                <br />

                <Modal
                    show={uploadModal}
                    size={"lg"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}
                    onHide={() => setUploadModal(false)}
                    dialogClassName="modal-90w"
                    id="reimbursementindex_index_modal"
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
                                    <img id={"reimbursementindex_cloudupload_img"} src={cloud_upload} alt="Show" width={75} height="auto" />
                                </div>
                                <div className="text-center cursor-pointer">
                                    <h3 className="mt-3 text-sm font-bold text-[#189FB5]">Drag & Drop or choose file to upload</h3>
                                    <label className="mt-2 text-xs text-dark">Supported file types: BMP, TIFF, JPEG, GIF, PNG and PDF</label> <br />
                                    <label className="text-xs mt-[-10px] text-dark">Maximum file size per attachment: 3 mb.</label>
                                </div>
                                <input
                                    id={"reimbursementindex_fileinput_modalinput"}
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
                                                <img id={"reimbursementindex_galleryimg_modalimg"} src={gallery_img} width={60} />
                                            </div>
                                            <div className="col-md-10">
                                                <div className="flex justify-between">
                                                    <label id={"reimbursementindex_filename_modallabel"} htmlFor="" className="flex"> {progressInfo.percentage == 100 ? <BsFillCheckCircleFill color={"#3BB273"} size={15} className="mr-1" /> : ""} {progressInfo.fileName}</label>
                                                    <label id={"reimbursementindex_filesize_modallabel"} htmlFor="">{progressInfo.fileSize}</label>
                                                </div>
                                                <div>
                                                    <label id={"reimbursementindex_fileperc_modallabel"} htmlFor="" className="text-md text-[#189FB5] font-bold">{!onSubmit ? "Ready" : progressInfo.percentage == 100 ? "Uploaded" : "Uploading"}</label>
                                                    <ProgressBar now={progressInfo.percentage} className="bg-[#C2C2C2] h-[13px] mt-1" />
                                                </div>
                                            </div>
                                            {!onSubmit ? <>
                                                <div className="col-md-1 flex justify-center items-center" onClick={() => {
                                                    const prog: any = { ...progressInfos }
                                                    const storageTemp: any = [...storedFiles]
                                                    delete storageTemp[index]
                                                    storageTemp.splice(index, 1);
                                                    delete prog.val[index]
                                                    setStoredFiles([...storageTemp])
                                                    setProgressInfos({ ...prog })
                                                }}>
                                                    <BsFillXCircleFill size={20} color="#E15554" />
                                                </div>
                                            </>
                                                : null}

                                        </div>
                                    )
                                })}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                id={"reimbursementindex_cancel_modalbtn"}
                                onClick={() => setUploadModal(false)}
                                className="w-[180px] mr-2">
                                Cancel
                            </Button>
                            <Button
                                id={"reimbursementindex_submit_modalbtn"}
                                onClick={() => {
                                    setOnSubmit(true)
                                    uploadFiles()
                                }}
                                disabled={(storedFiles && storedFiles.length > 0 ? false : true) || onSubmit}
                                className="w-[180px] mr-2">
                                {onSubmit ?
                                    <div className="d-flex justify-content-center">
                                        <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                        Submitting
                                    </div>
                                    : "Submit"
                                }
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={createReimbursementModal}
                    size={"lg"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}
                    onHide={() => setCreateReimbursementModal(false)}
                    dialogClassName="modal-90w"
                    id="accessrights_authlist_modal"
                >
                    <Modal.Header className="text-center flex justify-center">
                        <Modal.Title id="contained-modal-title-vcenter" className="font-bold text-md">
                            Create Reimbursement
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="row w-100 px-3 m-0">
                        <div className="w-100 m-0 p-0  row py-3  flex justify-center mb-5 cursor-pointer bg-[#FDFDFD] rounded-md" style={{ border: 1, borderStyle: 'solid', borderColor: "#DADADA" }}>
                            <div className="rounded-md col-md-4 flex flex-column justify-end items-center " >
                                <img src={add_reimbursement} width={30} />
                                <label className="font-bold mt-3 text-[#189FB5]">Reimbursement Breakdown</label>
                            </div>
                            <div className="col-md-2  flex items-center">
                                <div className="w-100 h-[2px] bg-[#D9D9D9]">

                                </div>
                            </div>
                            <div className="rounded-md   col-md-4 flex flex-column justify-start items-center" >
                                <img src={createStep == 1 ? inactive_review : active_review} width={30} />
                                <label className="font-bold mt-3  text-[#189FB5]">Review & Submit</label>
                            </div>
                        </div>
                        {
                            createStep == 1 ?
                                <>
                                    <div className="w-full flex justify-end">
                                        <button
                                            id={"reimbursementindex_additem_modalformbtn"}
                                            onClick={() => {
                                                newItem()
                                            }}
                                            className="mb-2 btn-primary flex items-center" style={{ height: 35 }}>
                                            <BsPlus size={27} color={"#fff"} /> Add Item
                                        </button>
                                    </div>
                                    {
                                        reimbursementValues &&
                                        reimbursementValues.length > 0 &&
                                        reimbursementValues.map((data: any, index: any) => {
                                            return (<>
                                                <div className="rounded-md relative bg-[#F2F2F2] p-3">
                                                    <FaTimesCircle size={15} color="#FF3838" onClick={() => {
                                                        deleteItem(index)
                                                    }} className="absolute top-[25px] right-[25px] cursor-pointer" />
                                                    <div className="bg-white row p-3 m-0 ">
                                                        <div className="form-group col-md-3 mb-3" >
                                                            <label>With Receipt?</label>
                                                            <div className="flex mt-3">
                                                                <div className="flex items-center mr-3">
                                                                    <input
                                                                        name={"receipt" + index}
                                                                        id={"receipt1" + index}
                                                                        type="radio"
                                                                        checked={data.receipt == true}
                                                                        onChange={() => {
                                                                            updateData(index, 'receipt', true)
                                                                        }}
                                                                    />
                                                                    <label htmlFor={"receipt1" + index} className="font-bold ml-2">Yes</label>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <input
                                                                        name={"receipt" + index}
                                                                        id={"receipt2" + index}
                                                                        type="radio"
                                                                        checked={data.receipt == false}
                                                                        onChange={() => {
                                                                            updateData(index, 'receipt', false)
                                                                        }}
                                                                    />
                                                                    <label htmlFor={"receipt2" + index} className="font-bold ml-2">No</label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {
                                                            data.receipt ?
                                                                <>
                                                                    <div className="form-group col-md-5 mb-3" >
                                                                        <label>Choose Receipt:</label>
                                                                        <select
                                                                            className={`form-select ${data.receiptId == "" ? "border-1 border-red-500" : ""}`}
                                                                            name="receiptId"
                                                                            id={"reimbursementindex_receiptid_modalforminput2"}
                                                                            value={data.receiptId}
                                                                            onChange={(e) => {
                                                                                selectReceipt(index, 'receiptId', e.target.value)
                                                                            }}>
                                                                            <option value="" disabled selected>
                                                                                Select Receipt
                                                                            </option>
                                                                            {receiptList &&
                                                                                receiptList.length > 0 &&
                                                                                receiptList.map((item: any, index: string) => (
                                                                                    <option key={`${index}_${item}`} value={item.id}>
                                                                                        {item.fileName}
                                                                                    </option>
                                                                                ))}
                                                                        </select>
                                                                    </div>
                                                                    {
                                                                        data.receiptId != "" && (
                                                                            <div className="col-md-4 flex items-center mt-2">
                                                                                <div className="flex items-center ">
                                                                                    <Form.Check // prettier-ignore
                                                                                        type="switch"
                                                                                        id={"custom-switch" + index}
                                                                                        checked={data.isDisplayData}
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'isDisplayData', e.target.checked)
                                                                                        }}
                                                                                        style={{ fontSize: 18 }}
                                                                                    />
                                                                                    <label className="mb-1" style={{ fontSize: 12 }} htmlFor={"custom-switch" + index}>Display Extracted Data</label>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {
                                                                        data.isDisplayData ?
                                                                            <>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>OR/Invoice Number:</label>
                                                                                    <input type="text"
                                                                                        name="invoice"
                                                                                        id={"reimbursementindex_invoice_modalforminput3"}
                                                                                        value={data.invoice}
                                                                                        className={`${data.invoice == "" || data.invoice == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'invoice', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>Company Name:</label>
                                                                                    <input type="text"
                                                                                        name="companyName"
                                                                                        id={"reimbursementindex_companyname_modalforminput3"}
                                                                                        value={data.companyName}
                                                                                        className={`${data.companyName === "" || data.companyName == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"
                                                                                            }`}
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'companyName', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>TIN:</label>
                                                                                    <input type="text"
                                                                                        name="tin"
                                                                                        id={"reimbursementindex_tin_modalforminput3"}
                                                                                        value={data.tin}
                                                                                        className={`${data.tin == "" || data.tin == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'tin', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>Transaction Date:</label>
                                                                                    <input type="date"
                                                                                        name="transactionDate"
                                                                                        id={"reimbursementindex_transactiondate_modalforminput3"}
                                                                                        value={data.transactionDate}
                                                                                        className={`${data.transactionDate == "" || data.transactionDate == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'transactionDate', e.target.value)
                                                                                        }}
                                                                                        max={moment().format('YYYY-MM-DD')}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>Amount: </label>
                                                                                    <input type="number"
                                                                                        name="amount"
                                                                                        id={"reimbursementindex_amount_modalforminput3"}
                                                                                        value={data.amount}
                                                                                        className={`${data.amount == "" || data.amount == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'amount', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            null
                                                                    }
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="form-group col-md-3 mb-3" >
                                                                        <label>Transaction Date:</label>
                                                                        <input type="date"
                                                                            name="transactionDate"
                                                                            id={"reimbursementindex_transactiondate_modalforminput3"}
                                                                            className={`${data.transactionDate == "" || data.transactionDate == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                            value={data.transactionDate}
                                                                            onChange={(e) => {
                                                                                updateData(index, 'transactionDate', e.target.value)
                                                                            }}
                                                                            max={moment().format('YYYY-MM-DD')}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-md-3 mb-3" >
                                                                        <label>Payee Name:</label>
                                                                        <input type="text"
                                                                            name="companyName"
                                                                            id={"reimbursementindex_payeename_modalforminput3"}
                                                                            className={`${data.companyName == "" || data.companyName == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                            value={data.companyName}
                                                                            onChange={(e) => {
                                                                                updateData(index, 'companyName', e.target.value)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-md-3 mb-3" >
                                                                        <label>Amount:</label>
                                                                        <input type="number"
                                                                            name="amount"
                                                                            id={"reimbursementindex_amout_modalforminput4"}
                                                                            value={data.amount}
                                                                            className={`${data.amount == "" || data.amount == null ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                                                            onChange={(e) => {
                                                                                updateData(index, 'amount', e.target.value)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </>)
                                        })
                                    }

                                    <div className="flex justify-center mt-5">
                                        <Button
                                            id={"reimbursementindex_cancel_modalformbtn2"}
                                            variant="secondary"
                                            onClick={() => setCreateReimbursementModal(false)}
                                            className="w-[150px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            id={"reimbursementindex_continue_modalformbtn2"}
                                            onClick={() => {
                                                validateBreakdown()
                                            }}
                                            className="w-[180px] mr-2">
                                            Continue
                                        </Button>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="form-group col-md-6 mb-3" >
                                        <label>Type of Reimbursement:</label>
                                        <select
                                            className={`form-select ${reimbursementParentValues && (reimbursementParentValues.typeId == "" || reimbursementParentValues.typeId == null) ? "border-1 border-red-500" : ""}`}
                                            name="typeId"
                                            id={"reimbursementindex_typeid_modalforminput2"}
                                            value={reimbursementParentValues && reimbursementParentValues.typeId}
                                            onChange={(e) => {
                                                updateParentData('typeId', e.target.value)
                                            }}>
                                            <option value="" disabled selected>
                                                Select reimbursement type
                                            </option>
                                            {
                                                reimbursementType &&
                                                reimbursementType.length > 0 &&
                                                reimbursementType.map((item: any, index: string) => {
                                                    return (<option key={`${index}_${item}`} value={item.id}>
                                                        {item.name}
                                                    </option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-4 d-none mb-3" >
                                        <label>Approve Budget:</label>
                                        <input type="text"
                                            name="approvedBudget"
                                            id={"reimbursementindex_approvebudget_modalforminput2"}
                                            className={`${reimbursementParentValues  && (reimbursementParentValues.approvedBudget  == null || reimbursementParentValues.total  == "") ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                            value={reimbursementParentValues && reimbursementParentValues.approvedBudget}
                                            onChange={(e) => {
                                                updateParentData('approvedBudget', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 mb-3" >
                                        <label>Total Amount:</label>
                                        <input type="number"
                                            name="total"
                                            id={"reimbursementindex_amount_modalforminput2"}
                                            value={reimbursementParentValues && reimbursementParentValues.total}
                                            className={`${reimbursementParentValues  && (reimbursementParentValues.total  == null || reimbursementParentValues.total  == "") ? "form-control form-control-reimbursement-has-error" : "form-control form-control-reimbursement"}`}
                                            onChange={(e) => {
                                                updateParentData('total', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 mb-3" >
                                        <label>Purpose:</label>
                                        <textarea
                                            name="purpose"
                                            id={"reimbursementindex_purpose_modalforminput2"}
                                            value={reimbursementParentValues && reimbursementParentValues.purpose}
                                            className={`${reimbursementParentValues  && (reimbursementParentValues.purpose  == null || reimbursementParentValues.purpose  == "") ? "form-control p-2 form-control-reimbursement-has-error" : "form-control form-control-reimbursement p-2"}`}
                                            style={{ minHeight: 100 }}
                                            onChange={(e) => {
                                                updateParentData('purpose', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <Table responsive style={{ maxHeight: '100vh' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '100px' }}>With Receipt</th>
                                                <th style={{ width: '100px' }}>Invoice/OR Number</th>
                                                <th>Company Name</th>
                                                <th>TIN</th>
                                                <th>Transact Date</th>
                                                <th>Amount</th>
                                                <th>Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reimbursementValues &&
                                                reimbursementValues.length > 0 &&
                                                reimbursementValues.map((data: any, index: any) => {
                                                    return (
                                                        <tr key={`reimBreakdown-${index}`}>
                                                            <td id={"reimbursementindex_receipt_modaltable_" + data.invoice}>{data.receipt ? "Yes" : "No"}</td>
                                                            <td id={"reimbursementindex_invoice_modaltable_" + data.invoice}>{data.invoice}</td>
                                                            <td id={"reimbursementindex_companyname_modaltable_" + data.invoice}>{data.companyName}</td>
                                                            <td id={"reimbursementindex_tin_modaltable_" + data.invoice}>{data.tin}</td>
                                                            <td id={"reimbursementindex_transactiondate_modaltable_" + data.invoice}>{data.transactionDate}</td>
                                                            <td id={"reimbursementindex_amount_modaltable_" + data.invoice}>{data.amount}</td>
                                                            <td id={"reimbursementindex_filename_modaltable_" + data.invoice}>{data.fileName}</td>
                                                        </tr>
                                                    )

                                                })}
                                        </tbody>
                                    </Table>

                                    <div className="flex justify-center mt-5">
                                        <Button
                                            id={"reimbursementindex_returntoprevious_modalformmodal5"}
                                            variant="secondary"
                                            onClick={() => setCreateStep(1)}
                                            className="w-[180px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                                            Return to Previous
                                        </Button>
                                        <Button
                                            id={"reimbursementindex_validateparent_modalformmodal5"}
                                            onClick={() => {
                                                validateParent()
                                            }}
                                            disabled={isSubmitCreateReim}
                                            className="w-[180px] mr-2">
                                            {isSubmitCreateReim ?
                                                <div className="d-flex justify-content-center">
                                                    <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                                    Submitting
                                                </div>
                                                : "Submit"
                                            }

                                        </Button>
                                    </div>
                                </>
                        }

                    </Modal.Body>
                </Modal>
            </div>
        </>} />

    )
}

