import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Image, Modal } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector, useDispatch } from "react-redux"



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
                if(res){
                    setIsSubmit(false)
                }
                
            }
        )
        // console.log(download)
    }

    return (
        <div className="body">
            <div className="wraper">
                <div className="w-100">
                    <div className="topHeader">
                        <UserTopMenu />
                    </div>
                    <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh' }}>
                        <DashboardMenu />
                        <div className="col-md-12 col-lg-10 px-5 py-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="bold-text">Good Day, {userData.data.profile.firstName}</h2>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                <h3>Report</h3>

                                <div className="w-100 pt-4">
                                    <TableComponent
                                        tableHeaders={tableHeaders}
                                    />
                                    <div className="d-flex justify-content-end mt-3" >
                                        <div>
                                            <Button
                                                className="mx-2"
                                                onClick={() => {
                                                    setDownloadModalShow(true)
                                                }}>Download Excel</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Create User Modal Form */}
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
                        onClick={() => downloadExcel(fromDate, toDate)}
                        disabled={isSubmit}>
                            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: "" } Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create User Modal Form */}
        </div>

    )
}
