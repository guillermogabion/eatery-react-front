import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"
import moment from "moment"
import { Button, Modal, Form, Tabs, Tab } from "react-bootstrap"
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
import ContainerWrapper from "../../components/ContainerWrapper"
import Leaves from "./components/leaves"
import Recurring from "./components/recurring"
import { Adjustment } from "./components/adjustments"

const ErrorSwal = withReactContent(Swal)

export const Payroll = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [adjustmentList, setAdjustmentList] = React.useState([]);
    const formRef: any = useRef()
    const [payrollPeriodModal, setPayrollPeriodModal] = React.useState(false);
    const [isCreatePayroll, setIsCreatePayroll] = useState<any>(false);
    const [key, setKey] = React.useState('timekeeping');
    const [adjustment, setAdjustment] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [adjustmentTypes, setAdjustmentTypes] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const tableHeaders = [
        'Year',
        'MOnth',
        'Period',
        'Description',
        'Transaction Date',
        'Status',
        'Action',
    ];

    const handlePageClick = (event: any) => {
    };

    return (
        <ContainerWrapper contents={<>
            {
                !isCreatePayroll ?
                    <>
                        <div className="w-100 px-5 py-5">
                            <div>
                                <div className="w-100 flex mb-[10px]">
                                    <Button
                                        onClick={() => setPayrollPeriodModal(true)}
                                        className="btn btn-primary mx-2">
                                        Create Payroll
                                    </Button>
                                    <Button
                                        onClick={() => alert('Ongoing')}
                                        className="btn btn-primary mx-2">
                                        Export Payroll
                                    </Button>
                                </div>
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

                                    </tbody>
                                </Table>
                                {
                                    adjustmentList &&
                                        adjustmentList.content &&
                                        adjustmentList.content.length == 0 ?
                                        <div className="w-100 text-center">
                                            <label htmlFor="">No Records Found</label>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="">
                                <ReactPaginate
                                    className="d-flex justify-content-center align-items-center"
                                    breakLabel="..."
                                    nextLabel=">"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}
                                    pageCount={(adjustmentList && adjustmentList.totalPages) || 0}
                                    previousLabel="<"
                                    previousLinkClassName="prev-next-pagination"
                                    nextLinkClassName="prev-next-pagination"
                                    activeLinkClassName="active-page-link"
                                    disabledLinkClassName="prev-next-disabled"
                                    pageLinkClassName="page-link"
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        </div>
                    </>
                    :
                    <div className="w-100 px-5 py-5 pt-5">
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k: any) => {
                                setKey(k)
                            }}
                            className="mb-3"
                        >
                            <Tab eventKey="timekeeping" title="Timekeeping">
                                {
                                    key == 'timekeeping' ?
                                        <Leaves />
                                        :
                                        null
                                }
                            </Tab>
                            <Tab eventKey="employee request" title="Employee Request">
                                {
                                    key == 'employee request' ?
                                        <Leaves />
                                        :
                                        null
                                }
                            </Tab>
                            <Tab eventKey="recurring" title="Recurring" >
                                {
                                    key == 'recurring' ?
                                        <Recurring />
                                        :
                                        null
                                }
                            </Tab>
                            <Tab eventKey="adjustment" title="Adjustment">
                                {
                                    key == 'adjustment' ?
                                        <Adjustment />
                                        :
                                        null
                                }
                            </Tab>
                            <Tab eventKey="payroll" title="Payroll">
                                {
                                    key == 'payroll' ?
                                        <Leaves />
                                        :
                                        null
                                }
                            </Tab>
                        </Tabs>
                    </div>
            }


            <Modal
                show={payrollPeriodModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setPayrollPeriodModal(false)
                }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Payroll Period
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 m-0 px-">
                    <Formik
                        innerRef={formRef}
                        initialValues={{}}
                        enableReinitialize={true}
                        validationSchema={null}
                        onSubmit={(values, actions) => {
                            setIsCreatePayroll(true)
                            setPayrollPeriodModal(false)
                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} className="m-0 p-0" autoComplete="off">
                                    <div className="row w-100 m-0 mb-[20px]">
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Year</label>
                                            <input type="text"
                                                name="reason"
                                                id="reason"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                            />
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Transaction Date</label>
                                            <input type="date"
                                                name="dateFrom"
                                                id="dateFrom"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                                placeholder="dd/mm/yyyy"
                                            />
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Month</label>
                                            <input type="text"
                                                name="reason"
                                                id="reason"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                            />
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>From</label>
                                            <input type="date"
                                                name="dateFrom"
                                                id="dateFrom"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                                placeholder="dd/mm/yyyy"
                                            />
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Period</label>
                                            <input type="text"
                                                name="reason"
                                                id="reason"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                            />
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>To</label>
                                            <input type="date"
                                                name="dateFrom"
                                                id="dateFrom"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                                placeholder="dd/mm/yyyy"
                                            />
                                        </div>
                                        <div className="form-group col-md-12 mb-3">
                                            <label>Description</label>
                                            <textarea
                                                name="reason"
                                                id="reason"
                                                value={""}
                                                className={`form-control py-1`}
                                                style={{ height: "100px" }}
                                                onChange={(e) => { }}
                                            />
                                        </div>
                                        <div className="w-full d-flex justify-content-end ">
                                            <button
                                                type="submit"
                                                className="btn btn-primary">
                                                Save
                                            </button>
                                        </div>
                                    </div>

                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>} />

    )
}

