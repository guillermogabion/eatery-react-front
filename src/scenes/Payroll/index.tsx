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
import * as Yup from "yup"
import ContainerWrapper from "../../components/ContainerWrapper"
import Leaves from "./components/leaves"
import Recurring from "./components/recurring"
import { Adjustment } from "./components/adjustments"
import TimeSheet from "./components/timesheet"
import GeneratePayroll from "./components/generatepayroll"
import { Utility } from "../../utils"
import Audit from "./components/audit"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import { Overtime } from "./components/overtime"
import { TimeKeeping } from "./components/timekeeping"

const ErrorSwal = withReactContent(Swal)

export const Payroll = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [adjustmentList, setAdjustmentList] = React.useState([]);
    const formRef: any = useRef()
    const [payrollPeriodModal, setPayrollPeriodModal] = React.useState(false);
    const [isCreatePayroll, setIsCreatePayroll] = useState<any>(false);
    const [isAudit, setIsAudit] = useState<any>(false);
    const [key, setKey] = React.useState('payroll');
    const [payrolls, setPayrolls] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [adjustmentTypes, setAdjustmentTypes] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const [payrollData, setPayrollData] = React.useState({});
    const [pageSize, setPageSize] = useState(10);

    const tableHeaders = [
        'ID',
        'Year',
        'Month',
        'FROM',
        'TO',
        // 'Transaction Date',
        'Description',
        'Status',
        'Action',
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


    const getPayroll = (pageNo: any, pageSize: any) => {
        RequestAPI.getRequest(
            `${Api.payrollAll}?size=${pageSize ? pageSize : '10'}&page=${pageNo}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setPayrolls(body.data)
                    }
                }
            }
        )
    }
    const handlePageClick = (event: any) => {
        const selectedPage = event.selected;

        getPayroll(selectedPage, pageSize)

    };
    const handlePageSizeChange = (event) => {
        const selectedPageSize = parseInt(event.target.value, 10);
        setPageSize(selectedPageSize);
        getPayroll(0, selectedPageSize);
    };


    useEffect(() => {
        getPayroll(0, pageSize)
    }, [])


    return (
        <ContainerWrapper contents={<>
            {
                !isCreatePayroll ?
                    <>
                        <div className="w-100 px-3 py-5">
                            <div>
                                <div className="w-100 flex mb-[10px]">
                                    <Button
                                        id="payroll_createpayroll_btn"
                                        onClick={() => setPayrollPeriodModal(true)}
                                        className="btn btn-primary mx-2">
                                        Create Payroll
                                    </Button>
                                    <Button
                                        id="payroll_exportpayroll_btn"
                                        onClick={() => alert('Ongoing')}
                                        disabled={true}
                                        className="btn btn-primary mx-2">
                                        Export Payroll
                                    </Button>
                                </div>
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
                                    <tbody className="custom-row">
                                        {
                                            payrolls &&
                                            payrolls.content &&
                                            payrolls.content.length > 0 && (
                                                payrolls.content.map((item: any, index: any) => {
                                                    return (
                                                        <tr>
                                                            <td id={"payroll_id_payrollsdata_" + item.data}> {item.id} </td>
                                                            <td id={"payroll_periodyear_payrollsdata_" + item.id}> {item.periodYear} </td>
                                                            <td id={"payroll_periodmonth_payrollsdata_" + item.id}> {moment().month(item.periodMonth - 1).format('MMMM')} </td>
                                                            <td id={"payroll_datefrom_payrollsdata_" + item.id}>{Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')}</td>
                                                            <td id={"payroll_dateto_payrollsdata_" + item.id}>{Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                                                            {/* <td>{item.transactionDate.split("T")[0]} </td> */}
                                                            <td id={"payroll_description_payrollsdata_" + item.id}>{item.description} </td>
                                                            <td id={"payroll_isgenerated_payrollsdata_" + item.id}>{item.isGenerated == true ? "Processed" : "Locked"} </td>
                                                            <td>
                                                                <label
                                                                    id={"payroll_update_payrollslabel_" + item.id}
                                                                    onClick={() => {
                                                                        setKey("payroll")
                                                                        setIsCreatePayroll(true)
                                                                        setPayrollData({
                                                                            "payrollMonth": item.periodMonth,
                                                                            "payrollYear": item.periodYear,
                                                                            "from": item.dateFrom,
                                                                            "to": item.dateTo,
                                                                            "userIds": [],
                                                                            "id": item.id,
                                                                            "locked": item.locked,
                                                                            "isGenerated": item.isGenerated,
                                                                            "isUpdate": true,
                                                                        })
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    View
                                                                </label>
                                                                <br />
                                                                <label
                                                                    id={"payroll_audit_payrollslabel_" + item.id}
                                                                    onClick={() => {
                                                                        setIsCreatePayroll(true)
                                                                        setPayrollData({
                                                                            "payrollMonth": item.periodMonth,
                                                                            "payrollYear": item.periodYear,
                                                                            "from": item.dateFrom,
                                                                            "to": item.dateTo,
                                                                            "userIds": [],
                                                                            "id": item.id,
                                                                            "isUpdate": false,
                                                                        })
                                                                        setIsAudit(true)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    Audit
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        }
                                    </tbody>
                                </Table>
                                {
                                    payrolls &&
                                        payrolls.content &&
                                        payrolls.content.length == 0 ?
                                        <div className="w-100 text-center">
                                            <label htmlFor="">No Records Found</label>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="justify-content-start px-5">
                                    <span className="font-bold mr-8 text-muted">Total Entries : {payrolls.totalElements}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-muted pl-12 pr-3  ">Select Page Size:</span>
                                    <select id="pageSizeSelect" value={pageSize} className="form-select rounded-md py-2" style={{ fontSize: "16px", width: "150px" }} onChange={handlePageSizeChange}>
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex justify-content-end pr-10 ">
                                    <div className="">
                                        <ReactPaginate
                                            className="d-flex justify-content-center align-items-center"
                                            breakLabel="..."
                                            nextLabel=">"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={(payrolls && payrolls.totalPages) || 0}
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
                            </div>
                        </div>
                    </>
                    :
                    <>
                        {
                            isAudit ? <>
                                <Audit payrollData={payrollData} goBack={() => {
                                    setIsCreatePayroll(false)
                                    setIsAudit(false)
                                }} />
                            </>
                                :
                                <div className="px-5 py-5 pt-5 w-full ">
                                    <div className="w-100 flex mb-[10px]">
                                        <div className="flex items-center cursor-pointer" style={{ color: '#009FB5' }} onClick={() => {
                                            setIsCreatePayroll(false)
                                        }}>
                                            <BsFillArrowLeftCircleFill className="mr-2" size={20} />
                                            <label className="text-lg cursor-pointer">Back</label>
                                        </div>
                                    </div>
                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={key}
                                        onSelect={(k: any) => {
                                            setKey(k)
                                        }}
                                        className="mb-3 w-100 lg:w-[80vw]"
                                    >
                                        <Tab id="payroll_timesheet_audittabs" eventKey="timesheet" title="Timesheet" className="w-full lg:w-[75vw] overflow-auto">
                                            {
                                                key == 'timesheet' && Object.keys(payrollData).length != 0 ?
                                                    <TimeSheet payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                        <Tab id="payroll_employeerequest_audittabs" eventKey="employee request" title="Employee Leaves">
                                            {
                                                key == 'employee request' && Object.keys(payrollData).length != 0 ?
                                                    <Leaves payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                        <Tab id="payroll_employeeovertime_audittabs" eventKey="employee overtime" title="Employee Overtime">
                                            {
                                                key == 'employee overtime' && Object.keys(payrollData).length != 0 ?
                                                    <Overtime payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                        <Tab id="payroll_timekeeping_audittabs" eventKey="timekeeping" title="Timekeeping" className="w-full lg:w-[75vw] overflow-auto">
                                            {
                                                key == 'timekeeping' && Object.keys(payrollData).length != 0 ?
                                                    <TimeKeeping payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                        <Tab id="payroll_recurring_audittabs" eventKey="recurring" title="Deduction & Loan" >
                                            {
                                                key == 'recurring' ?
                                                    <Recurring payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                        <Tab id="payroll_adjustment_audittabs" eventKey="adjustment" title="Earning & Allowance">
                                            {
                                                key == 'adjustment' ?
                                                    <Adjustment payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                        <Tab id="payroll_payroll_audittabs" eventKey="payroll" title="Payroll">
                                            {
                                                key == 'payroll' && Object.keys(payrollData).length != 0 ?
                                                    <GeneratePayroll back={() => {
                                                        setIsCreatePayroll(false)
                                                        getPayroll(0, pageSize)
                                                    }} payrollData={payrollData} />
                                                    :
                                                    null
                                            }
                                        </Tab>
                                    </Tabs>
                                </div>
                        }
                    </>

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
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                payrollMonth: Yup.string().required("Payroll month is required!"),
                                payrollYear: Yup.string().required("Payroll year to is required!"),
                                from: Yup.string().required("Date from is required!"),
                                to: Yup.string().required("Date to is required!"),
                                description: Yup.string().required("Description is required!"),
                            })
                        }
                        onSubmit={(values, actions) => {
                            RequestAPI.postRequest(Api.createPayroll, "", values, {}, async (res: any) => {
                                const { status, body } = res
                                if (status === 200 || status === 201) {
                                    if (body.error && body.error.message) {
                                        ErrorSwal.fire({
                                            title: 'Error!',
                                            text: (body.error && body.error.message) || "",
                                            didOpen: () => {
                                              const confirmButton = Swal.getConfirmButton();
                                    
                                              if(confirmButton)
                                                confirmButton.id = "payroll_errorconfirm_alertbtn"
                                            },
                                            icon: 'error',
                                        })
                                    } else {
                                        ErrorSwal.fire({
                                            title: 'Success',
                                            text: (body.message) || "",
                                            icon: 'success',
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            allowOutsideClick: false,
                                            confirmButtonText: 'Proceed',
                                            didOpen: () => {
                                                const confirmButton = Swal.getConfirmButton();
                                                const cancelButton = Swal.getCancelButton();
                                      
                                                if(confirmButton)
                                                  confirmButton.id = "payroll_successactionconfirm_alertbtn"
                                      
                                                if(cancelButton)
                                                  cancelButton.id = "payroll_successactioncancel_alertbtn"
                                              },
                                        }).then((result: any) => {
                                            if (result.isConfirmed) {
                                                setIsCreatePayroll(true)
                                                setPayrollPeriodModal(false)
                                                let valuesObj: any = { ...values }
                                                valuesObj.id = body.id
                                                valuesObj.isUpdate = false
                                                valuesObj.locked = false
                                                valuesObj.isGenerated = false
                                                setPayrollData(valuesObj)
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
                                            confirmButton.id = "payroll_errorconfirm2_alertbtn"
                                        },
                                        icon: 'error',
                                    })
                                }
                            });
                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} className="m-0 p-0" autoComplete="off">
                                    <div className="row w-100 m-0 mb-[20px]">
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Year</label>
                                            <select
                                                className={`form-select`}
                                                name="payrollYear"
                                                id="payrollYear"
                                                value={values.payrollYear}
                                                onChange={(e) => setFieldValue('payrollYear', e.target.value)}>
                                                <option key={`defaultYear`} value={""} selected={true}>
                                                    Select Year
                                                </option>
                                                {
                                                    Utility.getYears().map((item: any, index: string) => {
                                                        return (
                                                            <option key={`${index}_${item.year}`} value={item.year}>
                                                                {item.year}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {errors && errors.payrollYear && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.payrollYear}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Month</label>
                                            <select
                                                className={`form-select`}
                                                name="payrollMonth"
                                                id="payrollMonth"
                                                value={values.payrollMonth}
                                                onChange={(e) => setFieldValue('payrollMonth', e.target.value)}>
                                                <option key={`defaultMonth`} value={""} selected={true}>
                                                    Select Month
                                                </option>
                                                {
                                                    Utility.getMonths().map((item: any, index: string) => {
                                                        return (
                                                            <option key={`${index}_${item.value}`} value={item.value}>
                                                                {item.name}
                                                            </option>
                                                        )
                                                    })}
                                            </select>
                                            {errors && errors.payrollMonth && (
                                                <p id="payroll_payrollmonth_payrollmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.payrollMonth}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>From</label>
                                            <input type="date"
                                                name="from"
                                                id="from"
                                                className="form-control"
                                                value={values.from}
                                                onChange={(e) => { setFieldValue('from', e.target.value) }}
                                                placeholder="dd/mm/yyyy"
                                            />
                                            {errors && errors.from && (
                                                <p id="payroll_from_payrollmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.from}</p>
                                            )}
                                        </div>
                                        {/* <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>Period</label>
                                            <input type="text"
                                                name="reason"
                                                id="reason"
                                                className="form-control"
                                                value={""}
                                                onChange={(e) => { }}
                                            />
                                        </div> */}
                                        <div className="form-group col-lg-6 col-md-12 mb-2" >
                                            <label>To</label>
                                            <input type="date"
                                                name="to"
                                                id="to"
                                                className="form-control"
                                                value={values.to}
                                                min={values.from}
                                                onChange={(e) => { setFieldValue('to', e.target.value) }}
                                                placeholder="dd/mm/yyyy"
                                            />
                                            {errors && errors.to && (
                                                <p id="payroll_to_payrollmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.to}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3">
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                id="description"
                                                value={values.description}
                                                className={`form-control py-1`}
                                                style={{ height: "100px" }}
                                                maxLength={1024}
                                                onChange={(e) => { setFieldValue('description', e.target.value) }}
                                            />
                                            {errors && errors.description && (
                                                <p id="payroll_description_payrollmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                                            )}
                                        </div>
                                        <div className="w-full mt-5 d-flex justify-content-center ">
                                            <button
                                                id="payroll_save_payrollmodalbtn"
                                                type="submit"
                                                className="btn btn-primary px-5">
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

