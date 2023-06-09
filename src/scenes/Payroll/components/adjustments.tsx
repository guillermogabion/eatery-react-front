import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import { Api, RequestAPI } from "../../../api"
import EmployeeDropdown from "../../../components/EmployeeDropdown"
import moment from "moment"
import { Formik } from "formik"
import { Utility } from "../../../utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)

export const Adjustment = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [adjustmentList, setAdjustmentList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [adjustment, setAdjustment] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const [usedOption, setUseOption] = React.useState([
        {"name": "All","value": ""},
        {"name": "True","value": "True"},
        {"name": "False","value": "False"},
    ]);
    const [initialValues, setInitialValues] = useState<any>({
        "id": 0,
        "userId": 0,
        "adjustmentTypeId": 0,
        "adjustmentAmount": 0,
        "periodMonth": 0,
        "periodYear": 0,
        "employeeId": "",
        "employeeName": "",
        "adjustmentName": "",
        "type": ""
    })

    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'Adjustment Name',
        'Payroll Period',
        'Action',
    ];

    useEffect(() => {
        if (filterData) {
            getAllAdjustmentList(0)
        }
    }, [filterData])

    const getAllAdjustmentList = (pageNo: any) => {
        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
                if (filterDataTemp[d]) {

                    queryString += `&${d}=${filterDataTemp[d]}`
                } else {
                    queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                }
            })
        }
        RequestAPI.getRequest(
            `${Api.getAllPayrollList}?size=10&page${pageNo}${queryString}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.data.content) {
                        setAdjustmentList(body.data)
                    }
                } else {

                }
            }

        )
    }
    useEffect(() => {
        getAllAdjustmentList(0)
    }, [])

    const handlePageClick = (event: any) => {
        getAllAdjustmentList(event.selected)
    };

    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    const singleChangeOption = (option: any, name: any) => {
        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }

    return (
        <>
            <div className="w-100">
                <div>
                    <div className="w-100 pt-2">
                        <div className="fieldtext d-flex col-md-6">
                            <div className="mx-1" style={{ width: 200, marginRight: 10 }}>
                                <label>Employee Name</label>
                                <EmployeeDropdown
                                    name="userId"
                                    placeholder={"Employee"}
                                    value={filterData && filterData['userId']}
                                    singleChangeOption={singleChangeOption}
                                />
                            </div>
                            <div className="mx-1" style={{ width: 200, marginRight: 10 }}>
                                <label>Deduct</label>
                                <select
                                    className={`form-select`}
                                    name="used"
                                    id="used"
                                    value={filterData["used"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {usedOption &&
                                        usedOption.length &&
                                        usedOption.map((item: any, index: string) => (
                                            <option key={`${index}_${item.value}`} value={item.value}>
                                                {Utility.capitalizeFirstLetter(item.name)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
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
                            {
                                adjustmentList &&
                                adjustmentList.content &&
                                adjustmentList.content.length > 0 &&
                                adjustmentList.content.map((item: any, index: any) => {

                                    return (
                                        <tr>
                                            <td> {item.employeeId} </td>
                                            <td> {item.employeeName} </td>
                                            <td> {Utility.formatToCurrency(item.amount)} </td>
                                            <td> {item.adjustmentName} </td>
                                            <td> {moment().month(item.payrollMonth -1).format('MMM.')} {item.payrollYear} </td>
                                            <td>
                                                <label
                                                    onClick={() => {
                                                        setInitialValues({
                                                            "id": item.id,
                                                            "userId": item.userId,
                                                            "adjustmentTypeId": item.adjustmentTypeId,
                                                            "adjustmentAmount": item.amount,
                                                            "periodMonth": item.payrollMonth,
                                                            "periodYear": item.payrollYear,
                                                            "employeeId": item.employeeId,
                                                            "employeeName": item.employeeName,
                                                            "adjustmentName": item.adjustmentName,
                                                            "type": item.type
                                                        })
                                                        setModalShow(true)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                    Update
                                                </label>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
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
            <Modal
                show={modalShow}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-v-center">
                        Update Adjustment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 m-0 px-5">
                    <Formik
                        innerRef={formRef}
                        enableReinitialize={true}
                        validationSchema={null}
                        initialValues={initialValues}
                        onSubmit={(values, actions) => {
                            const valuesObj: any = { ...values }
                            RequestAPI.putRequest(
                                Api.editPayrollAdjustment,
                                "",
                                valuesObj,
                                {},
                                async (res) => {
                                    const { status, body = { data: {}, error: {} } } = res;
                                    if (status === 200 || status === 201) {
                                        if (body.error && body.error.message) {
                                            ErrorSwal.fire(
                                                "Error!",
                                                body.error.message || "",
                                                "error"

                                            );
                                        } else {
                                            setModalShow(false)
                                            ErrorSwal.fire(
                                                "Success",
                                                body.data || "",
                                                "success"
                                            ).then((result) => {
                                                if (result.isConfirmed) {
                                                    getAllAdjustmentList(0)
                                                }
                                            });

                                        }
                                    } else {
                                        ErrorSwal.fire("Error!", "Something Error.", "error");
                                    }
                                }
                            );
                        }}
                    >
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="m-0 p-0">
                                        <div className="w-full mb-3">
                                            <label>Employee ID</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.employeeId}
                                                onChange={(e) => {
                                                    setFieldValue('userId', e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="w-full mb-3">
                                            <label>Employee Name</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.employeeName}
                                            />
                                        </div>
                                        <div className="w-full mb-3">
                                            <label>Adjustment Name</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.adjustmentName}
                                            />
                                        </div>
                                        <div className="w-full mb-3">
                                            <label>Adjustment Type</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                name="type"
                                                value={values.type}
                                            />
                                        </div>
                                        <div className="w-fll mb-3">
                                            <label>Amount</label>
                                            <input
                                                className="form-control"
                                                name="adjustmentAmount"
                                                type="number"
                                                value={values.adjustmentAmount}
                                                onChange={(e) => {
                                                    setFieldValue('adjustmentAmount', e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Modal.Footer className="w-full mt-[35px] flex justify-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-5"
                                            disabled={values.adjustmentAmount == ""}>
                                            Save
                                        </button>
                                    </Modal.Footer>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    )
}

