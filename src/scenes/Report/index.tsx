import React from "react"
import UserTopMenu from "../../components/UserTopMenu"

import moment from "moment"
import { Button, Modal } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import TableComponent from "../../components/TableComponent"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
const ErrorSwal = withReactContent(Swal)



export const Report = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)

    const { history } = props
    const [downloadModalShow, setDownloadModalShow] = React.useState(false);
    const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [isSubmit, setIsSubmit] = React.useState(false);


    const tableHeaders = [
        'Date Filed',
        'Effectivity Date',
        'Shift Start',
        'Shift Type',
        'Reason',
        'Status',
        'Action',
    ]

    const downloadExcel = (fromDate: any, toDate: any) => {
        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.downloadTimeKeeping}?fromDate=${fromDate}&toDate=${toDate}`,
            "",
            "timekeeping.xlsx",
            async (res: any) => {
                if (res) {
                    setIsSubmit(false)
                }

            }
        )
        // console.log(download)
    }

    return (
        <ContainerWrapper contents={<>
            <div className="col-md-12 col-lg-10 px-5 py-5">
                <div>
                    <h3>Report</h3>

                    <div className="w-100 pt-4">
                        <TableComponent
                            tableHeaders={tableHeaders}
                        />
                        <div className="d-flex justify-content-end mt-3" >
                            <div>
                                <Button
                                    id="report_downloadexcel_btn"
                                    className="mx-2"
                                    onClick={() => {
                                        setDownloadModalShow(true)
                                    }}>Download Excel</Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Modal
                show={downloadModalShow}
                size={'md'}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setDownloadModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Export
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <div className="form-group col-md-6 mb-3" >
                        <label>Date From</label>
                        <input type="date"
                            name="fromDate"
                            id="fromDate"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                        <label>Date To</label>
                        <input type="date"
                            name="toDate"
                            id="toDate"
                            className="form-control"
                            value={toDate}
                            min={fromDate}
                            onChange={(e) => {
                                setToDate(e.target.value)
                            }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button
                        id="report_downloadexcel_modalbtn"
                        onClick={() => downloadExcel(fromDate, toDate)}
                        disabled={isSubmit}>
                        {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
        </>} />
    )
}
