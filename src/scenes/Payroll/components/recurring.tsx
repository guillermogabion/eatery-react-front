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
    const [pageSize, setPageSize] = useState(10);

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
        'ID',
        'Employee ID',
        'Employee Name',
        'Amount',
        'Deduction & Loan Name',
        'Type',
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

    const getAllRecurringList = (pageNo: any, pageSize: any) => {
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
            `${Api.getAllRecurringList}?size=${pageSize ? pageSize : '10'}&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
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
        getAllRecurringList(0, pageSize)
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
        const selectedPage = event.selected;
        getAllRecurringList(selectedPage, pageSize)
    };
    const handlePageSizeChange = (event) => {
        const selectedPageSize = parseInt(event.target.value, 10);
        setPageSize(selectedPageSize);
        getAllRecurringList(0, selectedPageSize);
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
                                    id="payrollrecurring_employeename_dropdown"
                                    name="userId"
                                    placeholder={"Employee"}
                                    value={filterData && filterData['userId']}
                                    singleChangeOption={singleChangeOption}
                                />
                            </div>
                            <div className="mx-1">
                                <label>Amount</label>
                                <input
                                    id="payrollrecurring_amount_input"
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
                        </div>
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
                                recurringList &&
                                recurringList.content &&
                                recurringList.content.length > 0 &&
                                recurringList.content.map((item: any, index: any) => {

                                    return (
                                        <tr>
                                            <td id={"payrollrecurring_id_recurringlistdata_" + item.id}> {item.id} </td>
                                            <td id={"payrollrecurring_employeeid_recurringlistdata_" + item.employeeId}> {item.employeeId} </td>
                                            <td id={"payrollrecurring_employeename_recurringlistdata_" + item.employeeId}> {item.employeeName} </td>
                                            <td id={"payrollrecurring_adjustmentamount_recurringlistdata_" + item.employeeId}> {Utility.formatToCurrency(item.adjustmentAmount)} </td>
                                            <td id={"payrollrecurring_recurringname_recurringlistdata_" + item.employeeId}> {item.recurringName} </td>
                                            <td id={"payrollrecurring_typeaction_recurringlistdata_" + item.employeeId}>{Utility.removeUnderscore(item.typeAction)}</td>
                                            <td>
                                                <label
                                                    id={"payrollrecurring_update_recurringlistlabel_" + item.employeeId}
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
            
           
            <div className="row">
                <div className="col-md-6">
                    <div className="justify-content-start px-1">
                        <span className="font-bold mr-8 text-muted">Total Entries : { recurringList.totalElements }</span>
                        <br />
                        <div className="flex items-center">
                            <span className="text-muted mr-3">Select Page Size:</span>
                            <select id="pageSizeSelect" value={pageSize} className="form-control" style={{ fontSize: "16px", width: "150px" }} onChange={handlePageSizeChange}>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
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
                                            
                                            ErrorSwal.fire({
                                                title: 'Error!',
                                                text: (body.error.message) || "",
                                                didOpen: () => {
                                                  const confirmButton = Swal.getConfirmButton();
                                        
                                                  if(confirmButton)
                                                    confirmButton.id = "payrollrecurring_errorconfirm_alertbtn"
                                                },
                                                icon: 'error',
                                            })
                                        } else {
                                            setModalShow(false)
                                            ErrorSwal.fire({
                                                title: 'Success!',
                                                text: (body.data) || "",
                                                didOpen: () => {
                                                  const confirmButton = Swal.getConfirmButton();
                                        
                                                  if(confirmButton)
                                                    confirmButton.id = "payrollrecurring_successconfirm_alertbtn"
                                                },
                                                icon: 'success',
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    getAllRecurringList(0)
                                                }
                                            });

                                        }
                                    } else {
                                        ErrorSwal.fire({
                                            title: 'Error!',
                                            text: "Something Error.",
                                            didOpen: () => {
                                              const confirmButton = Swal.getConfirmButton();
                                    
                                              if(confirmButton)
                                                confirmButton.id = "payrollrecurring_errorconfirm2_alertbtn"
                                            },
                                            icon: 'error',
                                        })
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
                                                id="payrollrecurring_employeeid_forminput"
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
                                                id="payrollrecurring_employeename_forminput"
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.employeeName}
                                            />
                                        </div>
                                        <div className="w-full mb-3">
                                            <label>Deduction & Loan Name</label>
                                            <input
                                                id="payrollrecurring_recurringname_forminput"
                                                disabled
                                                className="formControl"
                                                name="userId"
                                                value={values.recurringName}
                                            />
                                        </div>
                                        <div className="w-full mb-3">
                                            <label>Recurring Type</label>
                                            <input
                                                id="payrollrecurring_recurringtype_forminput"
                                                disabled
                                                className="formControl"
                                                value={Utility.removeUnderscore(values.typeAction)}
                                            />
                                        </div>
                                        <div className="w-fll mb-3">
                                            <label>Amount</label>
                                            <input
                                                id="payrollrecurring_amount_forminput"
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
                                            id="payrollrecurring_save_formbtn"
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

