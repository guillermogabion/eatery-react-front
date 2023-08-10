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

const ErrorSwal = withReactContent(Swal)

export const AllReimbursement = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const formRef: any = useRef()
    const [receiptList, setReceiptList] = useState<any>([]);
    const [key, setKey] = React.useState('reimbursement');
    const [uploadModal, setUploadModal] = React.useState(false);
    const [createReimbursementModal, setCreateReimbursementModal] = React.useState(false);

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
                        })
                        delete files[i]
                    } else if (!allowedFormats.includes(element.type)) {
                        ErrorSwal.fire({
                            icon: "error",
                            title: "File Skipped!",
                            text: `"${element.name}" is not a valid file format.`,
                            confirmButtonColor: "#73BF45",
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
            `${Api.getAllReceiptReimbursement}?size=1000&sort=id&sortDir=DESC`,
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
        if (valuesObj && valuesObj.content) {
            valuesObj.content.forEach((element: any, i: any) => {
                if (element.id == value) {
                    console.log("datas: ", element)
                    const valuesObj: any = [...reimbursementValues]
                    valuesObj[index]['receiptId'] = element.id
                    valuesObj[index]['tin'] = element.tin
                    valuesObj[index]['invoice'] = element.invoice
                    valuesObj[index]['companyName'] = element.companyName
                    valuesObj[index]['transactionDate'] = element.transactionDate
                    valuesObj[index]['filePath'] = element.fileNamePath
                    valuesObj[index]['fileName'] = element.fileName
                    valuesObj[index]['fileContentType'] = element.fileContentType
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
                    ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "",
                        'error'
                    )
                } else {

                    const valuesObj: any = [...reimbursementValues]
                    let payload = {
                        "parentId": body.parentId,
                        "breakdownList": valuesObj
                    }

                    RequestAPI.postRequest(Api.createBulkReimbursement, "", payload, {}, async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 || status === 201) {
                            if (body.error && body.error.message) {
                                ErrorSwal.fire(
                                    'Error!',
                                    (body.error && body.error.message) || "",
                                    'error'
                                )
                            } else {
                                ErrorSwal.fire(
                                    'Success!',
                                    (body.data) || (body.data.message),
                                    'success'
                                ).then((e) => {
                                    if (e.isConfirmed) {
                                        location.reload()
                                    }
                                })
                            }
                        } else {
                            ErrorSwal.fire(
                                'Error!',
                                'Something Error.',
                                'error'
                            )
                        }
                    })
                }
            } else {
                ErrorSwal.fire(
                    'Error!',
                    'Something Error.',
                    'error'
                )
            }
        })
    }



    return (
        <ContainerWrapper contents={<>
            <div className="px-5 mt-5">
                {/* <div className="mb-3 flex">
                    <Button
                        className="mr-3 flex items-center"
                        onClick={() => {
                            setUploadModal(true)
                        }}>
                        <BsFillCloudUploadFill size={15} className="mr-1" />
                        Upload Receipt
                    </Button>
                    <Button
                        className="flex items-center"
                        onClick={() => {
                            setCreateReimbursementModal(true)
                        }}>
                            <BsPlus size={27} color={"#fff"} />
                        Create Reimbursement
                    </Button>
                </div> */}
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
                                                    <label htmlFor="" className="flex"> {progressInfo.percentage == 100 ? <BsFillCheckCircleFill color={"#3BB273"} size={15} className="mr-1" /> : ""} {progressInfo.fileName}</label>
                                                    <label htmlFor="">{progressInfo.fileSize}</label>
                                                </div>
                                                <div>
                                                    <label htmlFor="" className="text-md text-[#189FB5] font-bold">{!onSubmit ? "Ready" : progressInfo.percentage == 100 ? "Uploaded" : "Uploading"}</label>
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
                                onClick={() => setUploadModal(false)}
                                className="w-[180px] mr-2">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setOnSubmit(true)
                                    uploadFiles()
                                }}
                                className="w-[180px] mr-2">
                                Submit
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
                        <div className="w-100 m-0 p-0  py-3  flex justify-center mb-5 cursor-pointer rounded-md" style={{ border: 1, borderStyle: 'solid', borderColor: "#DADADA" }}>
                            <div className="rounded-md  flex flex-column justify-center items-center mr-[100px]" >
                                <img src={add_reimbursement} width={30} />
                                <label className="font-bold mt-3 text-[#189FB5]">Reimbursement Breakdown</label>
                            </div>
                            <div className="rounded-md  flex flex-column justify-center items-center" >
                                <img src={createStep == 1 ? inactive_review : active_review} width={30} />
                                <label className="font-bold mt-3  text-[#189FB5]">Review & Submit</label>
                            </div>
                        </div>
                        {
                            createStep == 1 ?
                                <>
                                    <div className="w-full flex justify-end">
                                        <button
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
                                            console.log(data)
                                            return (<>
                                                <div className="rounded-md  bg-[#F2F2F2] p-3">
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
                                                                            className={`form-select`}
                                                                            name="receiptId"
                                                                            id="receiptId"
                                                                            value={data.receiptId}
                                                                            onChange={(e) => {
                                                                                selectReceipt(index, 'receiptId', e.target.value)
                                                                            }}>
                                                                            <option value="" disabled selected>
                                                                                Select Receipt
                                                                            </option>
                                                                            {receiptList &&
                                                                                receiptList.content &&
                                                                                receiptList.content.length > 0 &&
                                                                                receiptList.content.map((item: any, index: string) => (
                                                                                    <option key={`${index}_${item}`} value={item.id}>
                                                                                        {item.fileName}
                                                                                    </option>
                                                                                ))}
                                                                        </select>
                                                                    </div>
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
                                                                    {
                                                                        data.isDisplayData ?
                                                                            <>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>OR/Invoice Number:</label>
                                                                                    <input type="text"
                                                                                        name="invoice"
                                                                                        id="invoice"
                                                                                        value={data.invoice}
                                                                                        className="form-control"
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'invoice', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>Company Name:</label>
                                                                                    <input type="text"
                                                                                        name="companyName"
                                                                                        id="companyName"
                                                                                        value={data.companyName}
                                                                                        className="form-control"
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'companyName', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>TIN:</label>
                                                                                    <input type="text"
                                                                                        name="tin"
                                                                                        id="tin"
                                                                                        value={data.tin}
                                                                                        className="form-control"
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'tin', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>Transaction Date:</label>
                                                                                    <input type="date"
                                                                                        name="transactionDate"
                                                                                        id="transactionDate"
                                                                                        value={data.transactionDate}
                                                                                        className="form-control"
                                                                                        onChange={(e) => {
                                                                                            updateData(index, 'transactionDate', e.target.value)
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-4 mb-3" >
                                                                                    <label>Amount:</label>
                                                                                    <input type="number"
                                                                                        name="amount"
                                                                                        id="amount"
                                                                                        value={data.amount}
                                                                                        className="form-control"
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
                                                                            id="transactionDate"
                                                                            className="form-control"
                                                                            value={data.transactionDate}
                                                                            onChange={(e) => {
                                                                                updateData(index, 'transactionDate', e.target.value)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-md-3 mb-3" >
                                                                        <label>Payee Name:</label>
                                                                        <input type="text"
                                                                            name="companyName"
                                                                            id="companyName"
                                                                            className="form-control"
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
                                                                            id="amount"
                                                                            value={data.amount}
                                                                            className="form-control"
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
                                            variant="secondary"
                                            onClick={() => setCreateReimbursementModal(false)}
                                            className="w-[150px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setCreateStep(2)
                                            }}
                                            className="w-[180px] mr-2">
                                            Continue
                                        </Button>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Type of Reimbursement:</label>
                                        <select
                                            className={`form-select`}
                                            name="typeId"
                                            id="typeId"
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
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Approve Budget:</label>
                                        <input type="text"
                                            name="approvedBudget"
                                            id="approvedBudget"
                                            value={reimbursementParentValues && reimbursementParentValues.approvedBudget}
                                            className="form-control"
                                            onChange={(e) => {
                                                updateParentData('approvedBudget', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Total Amount:</label>
                                        <input type="text"
                                            name="total"
                                            id="total"
                                            value={reimbursementParentValues && reimbursementParentValues.total}
                                            className="form-control"
                                            onChange={(e) => {
                                                updateParentData('total', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-12 mb-3" >
                                        <label>Purpose:</label>
                                        <textarea
                                            name="purpose"
                                            id="purpose"
                                            value={reimbursementParentValues && reimbursementParentValues.purpose}
                                            className="form-control p-2"
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
                                                            <td>{data.receipt ? "Yes" : "No"}</td>
                                                            <td>{data.invoice}</td>
                                                            <td>{data.companyName}</td>
                                                            <td>{data.tin}</td>
                                                            <td>{data.transactionDate}</td>
                                                            <td>{data.amount}</td>
                                                            <td>{data.fileName}</td>
                                                        </tr>
                                                    )

                                                })}
                                        </tbody>
                                    </Table>

                                    <div className="flex justify-center mt-5">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setCreateStep(1)}
                                            className="w-[180px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                                            Return to Previous
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                createReimbursement()
                                            }}
                                            className="w-[180px] mr-2">
                                            Submit
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
