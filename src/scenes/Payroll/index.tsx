import React, { useEffect } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import moment from "moment"
import { Button, Modal } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import Table from 'react-bootstrap/Table'

import TimeDate from "../../components/TimeDate"
import { async } from "validate.js"
const ErrorSwal = withReactContent(Swal)



export const Payroll = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)

    const { history } = props
    const [ payrollList, setPayrollList] = React.useState([]);


    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'End Date',
        'Recurring Name',
        'Status',
        'Action',
    ];

    const getAllPayrollList = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.getAllPayrollList}?size=10&page${pageNo}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                if (body.data.content) {
                    setPayrollList(body.data)
                }
                } else {

                }
            }
       
        )
    }
    useEffect(() => {
        getAllPayrollList(0)
    }, [])

  
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
                            <div>
                                <h3>Payroll</h3>

                                <div className="w-100 pt-4">
                                <Table responsive="lg">
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
                                    {
                                        payrollList &&
                                        payrollList.content &&
                                        payrollList.content.length > 0 &&
                                        payrollList.content.map((item: any, index: any) => {

                                        return (
                                            <tr>
                                            <td> {item.employeeName} </td>
                                            <td> {item.payrollTypeName} </td>
                                            <td> {item.adjustmentName} </td>
                                            <td> {item.adjustmentAmount} </td>
                                            <td> {item.remarks} </td>
                                            <td> {item.adjustmentAction} </td>
                                            {/* <td>
                                                <label
                                                onClick={() => {
                                                    getEmployee(item.id)
                                                }}
                                                className="text-muted cursor-pointer">
                                                Update
                                                </label>
                                                {
                                                item.acctStatus == 'LOCKED' ?
                                                    <div>
                                                    <label onClick={() => unlockEmployee(item.id)}>Unlock</label>
                                                    </div>

                                                    :
                                                    null
                                                }
                                                <br />
                                                <label
                                                onClick={() => {
                                                    getEmployeeDetails(item.id)
                                                }}
                                                className="text-muted cursor-pointer">
                                                View
                                                </label>
                                                <br />
                                                <label
                                                onClick={() => {
                                                    changePassword(item.id)
                                                }}
                                                className="text-muted cursor-pointer">
                                                Change Password
                                                </label>

                                            </td> */}

                                            </tr>
                                        )
                                        })
                                    }
                                    </tbody>
                                </Table>
                                {
                                    payrollList &&
                                    payrollList.content &&
                                    payrollList.content.length == 0 ?
                                    <div className="w-100 text-center">
                                        <label htmlFor="">No Records Found</label>
                                    </div>
                                    :
                                    null
                                }
                                    {/* <div className="d-flex justify-content-end mt-3" >
                                        <div>
                                            <Button
                                                className="mx-2"
                                                onClick={() => {
                                                    setDownloadModalShow(true)
                                                }}>Download Excel</Button>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Create User Modal Form */}
            {/* <Modal
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
            </Modal> */}
            {/* End Create User Modal Form */}
        </div>

    )
}
