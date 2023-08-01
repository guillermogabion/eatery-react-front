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
import { regenerate, eye } from "../../assets/images"
import { Utility } from "../../utils"
import ContentWrapper from "../../components/ContentWrapper"
import { ReimbursementList } from "./component/reimbursementList"
import { UploadReceipt } from "./component/uploadReceipt"
import { FileUploader } from "react-drag-drop-files";

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
                    <Modal.Body className="row w-100 px-5">
                        <div className="w-100 flex justify-center mb-5">
                            <FileUploader 
                            handleChange={handleChange} 
                            classes="px-5 py-5" 
                            dropMessageStyle={{backgroundColor: 'red'}} 
                            name="file" 
                            label="Drag & Drop or choose file to upload" 
                            types={fileTypes} />
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

