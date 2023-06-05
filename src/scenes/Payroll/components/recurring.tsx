import React, { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import { Api, RequestAPI } from "../../../api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)

export default function Recurring(props: any) {
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

    const [initialValues, setInitialValues] = useState<any>({

        recurring: [
            {
                "userId": "",
                "recurringTypeId": "",
                "adjustmentAmount": "",
                "endDate": "",
                "active": "",
            }
        ],
        "userId": "",
        "recurringTypeId": "",
        "adjustmentAmount": "",
        "endDate": "",
        "active": "",
    })
    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'Recurring Name',
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
        if (modalShow) {
            setRecurring([{}]);
        }
    }, [modalShow]);

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
            `${Api.getAllRecurringList}?size=10&page${pageNo}${queryString}&sort=id&sortDir=desc`,
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

    const getRecurring = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.recurringInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res;
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                        // Handle error
                    } else {
                        const valueObj: any = body.data;
                        setInitialValues(valueObj);
                        setModalShow(true);
                    }
                }
            }
        );
    }


    const deleteRecurring = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to cancel this transaction.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingSwal = Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                RequestAPI.putRequest(`${Api.deleteRecurring}?id=${id}`, "", { "id": id }, {}, async (res) => {
                    const { status, body = { data: {}, error: {} } } = res;
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            Swal.close();
                            ErrorSwal.fire(
                                'Error!',
                                body.error.message,
                                'error'
                            );
                        } else {
                            Swal.close();
                            getAllRecurringList(0);
                            ErrorSwal.fire(
                                'Success!',
                                body.data || "",
                                'success'
                            );
                        }
                    } else {
                        Swal.close();
                        ErrorSwal.fire(
                            'Error!',
                            'Something went wrong.',
                            'error'
                        );
                    }
                })
            }
        })

    }

    return (
        <>
            <div className="w-100">
                <div>
                    <div className="w-100 pt-2">
                        <div className="fieldtext d-flex col-md-6">
                            <div className="mx-1">
                                <label>Employee Name</label>
                                <input
                                    name="employeeName"
                                    placeholder="Employee Name"
                                    type="text"
                                    autoComplete="off"
                                    className="formControl"
                                    style={{width: 100}}
                                    maxLength={40}
                                    onChange={(e) => makeFilterData(e)}
                                // onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
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
                                <label>Add or Deduct</label>
                                <input
                                    name="isDeduction"
                                    placeholder="Add or Deduct"
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
                                            <td> {item.adjustmentAmount} </td>
                                            <td> {item.recurringName} </td>
                                            <td>
                                                <label
                                                    onClick={() => {
                                                        getRecurring(item.id)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                    Update
                                                </label>
                                                <br />
                                                <label
                                                    onClick={() => {
                                                        deleteRecurring(item.id)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                    Delete
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
        </>
    )
}

