import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"
import moment from "moment"
import { Button, Modal, Form, Tabs, Tab, Row, Col } from "react-bootstrap"
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
import { regenerate, eye, show_password_dark } from "../../assets/images"
import { Utility } from "../../utils"
import ContentWrapper from "../../components/ContentWrapper"
import { ReimbursementList } from "./component/reimbursementList"
import { UploadReceipt } from "./component/uploadReceipt"
import { FileUploader } from "react-drag-drop-files";
import { auto } from "@popperjs/core"

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
    const handleDrop = (event:any) => {
        event.preventDefault();
        const { files } = event.dataTransfer;
        if (files.length > 0) {
            console.log(files)
            // setFiles([...files]);
        }
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
                    <Modal.Body className="row w-100 px-2 m-0">
                        <div className="w-100 p-2 flex justify-center mb-5 bg-[#F2F2F2] cursor-pointer" onDrop={handleDrop}>
                            <div className="bg-white rounded-md p-3 py-4 border border-dashed border-green-50 w-100">
                                <div className="flex justify-center">
                                    <img src={show_password_dark} alt="Show" width={80} height="auto" />

                                </div>
                                <div className="text-center cursor-pointer">
                                    <h3 className="mt-3 font-bold text-[#189FB5]">Drag & Drop or choose file to upload</h3>
                                    <label className="mt-2 text-sm text-dark">Supported file types: BMP, TIFF, JPEG, GIF, PNG and PDF</label> <br />
                                    <label className="text-sm mt-[-10px] text-dark">Maximum file size per attachment: 3 mb.</label>
                                </div>
                            </div>
                            <input
                                id="fileInput"
                                className="fileInput"
                                type="file"
                                multiple
                                onChange={(e: any) => {
                                    console.log(e.target.files)
                                }}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={() => setUploadModal(false)}
                                className="w-[180px] mr-2">Cancel</Button>
                            <Button
                                onClick={() => setUploadModal(false)}
                                className="w-[180px]">Submit</Button>
                        </div>

                    </Modal.Body>

                </Modal>
            </div>
        </>} />

    )
}

