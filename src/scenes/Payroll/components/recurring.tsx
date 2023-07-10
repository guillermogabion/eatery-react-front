import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import { Api, RequestAPI } from "../../../api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)
import { Formik } from "formik"
import { Utility } from "../../../utils"
import EmployeeDropdown from "../../../components/EmployeeDropdown"

export default function Recurring(props: any) {
    const { payrollData } = props
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [recurringList, setRecurringList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [recurring, setRecurring] = useState<any>([]);
    const [recurringTypes, setRecurringTypes] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const [recurringTypeOption, setRecurringTypeOption] = React.useState([
        { "name": "All", "value": "" },
        { "name": "True", "value": "true" },
        { "name": "False", "value": "false" },
    ]);

    const [initialValues, setInitialValues] = useState<any>({
        "id": 0,
        "userId": 0,
        "recurringTypeId": 0,
        "adjustmentAmount": 0,
        "endDate": "23-06-09",
        "active": true
    })
    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'Recurring Name',
        'Type',
        'Deduct',
        'Action',
    ];

    const handleAddField = () => {
        setRecurring([...recurring, {}])
    }
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
            setFieldValue(name, value)
        }
    }

    useEffect(() => {
        if (filterData) {
            getAllRecurringList(0)
        }
    }, [filterData])

    const handleRemoveField = (index: number) => {
        if (recurring.length === 1) {
            return; // Do not remove the only field row
        }
        const updatedFields = [...recurring];
        updatedFields.splice(index, 1);
        setRecurring(updatedFields);
    }

    const getAllRecurringList = (pageNo: any) => {
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
            `${Api.getAllRecurringList}?size=10&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.data.content) {
                        setRecurringList(body.data)
                    }
                } else {

                }
            }

        )
    }

    useEffect(() => {
        getAllRecurringList(0)
        RequestAPI.getRequest(
            `${Api.getAllRecurringType}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.forEach((d: any, i: any) => {
                            tempArray.push({
                                recurringTypeId: d.id,
                                recurringName: d.name,
                                // deduction : d.deduction
                            })
                        });
                        setRecurringTypes(tempArray)
                    }
                }
            }
        )

        RequestAPI.getRequest(
            `${Api.employeeList}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.forEach((d: any, i: any) => {
                            tempArray.push({
                                userId: d.userAccountId,
                                label: d.firstname + " " + d.lastname
                            })
                        });
                        setEmployee(tempArray)
                    }
                }
            }
        )

    }, [])

    const handlePageClick = (event: any) => {
        getAllRecurringList(event.selected)
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
                        <div className="fieldtext d-flex">
                            <div className="mx-1" style={{ width: 200, marginRight: 10 }}>
                                <label>Employee Name</label>
                                <EmployeeDropdown
                                    name="userId"
                                    placeholder={"Employee"}
                                    value={filterData && filterData['userId']}
                                    singleChangeOption={singleChangeOption}
                                />
                            </div>
                            <div className="mx-1">
                                <label>Amount</label>
                                <input
                                    name="adjustmentAmount"
                                    placeholder="Amount"
                                    type="text"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="mx-1">
                                <label>Deduction</label>
                                <select
                                    className={`form-select`}
                                    name="isDeduction"
                                    id="isDeduction"
                                    value={filterData["isDeduction"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {recurringTypeOption &&
                                        recurringTypeOption.length &&
                                        recurringTypeOption.map((item: any, index: string) => (
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
                                recurringList &&
                                recurringList.content &&
                                recurringList.content.length > 0 &&
                                recurringList.content.map((item: any, index: any) => {

                                    return (
                                        <tr>
                                            <td> {item.employeeId} </td>
                                            <td> {item.employeeName} </td>
                                            <td> {Utility.formatToCurrency(item.adjustmentAmount)} </td>
                                            <td> {item.recurringName} </td>
                                            <td>{Utility.removeUnderscore(item.typeAction)}</td>
                                            <td>{item.typeIsDeduction ? "YES" : "NO" }</td>
                                            <td>
                                                <label
                                                    onClick={() => {
                                                        setInitialValues(item)
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
                        recurringList &&
                            recurringList.content &&
                            recurringList.content.length == 0 ?
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
                        pageCount={(recurringList && recurringList.totalPages) || 0}
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
                        Update Recurring
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
                            valuesObj.payrollId = payrollData.id
                            
                            RequestAPI.putRequest(
                                Api.updateRecurringTransaction,
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
                                                    getAllRecurringList(0)
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
                                    <div className="p-0 m-0">
                                        <div className="w-full mb-3">
                                            <label>Employee ID</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.userId}
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
                                            <label>Recurring Name</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.recurringName}
                                            />
                                        </div>
                                        <div className="w-full mb-3">
                                            <label>Recurring Type</label>
                                            <input
                                                disabled
                                                className="formControl"
                                                value={Utility.removeUnderscore(values.typeAction)}
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

