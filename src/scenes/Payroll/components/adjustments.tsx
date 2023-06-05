import React, { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import { Api, RequestAPI } from "../../../api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import EmployeeDropdown from "../../../components/EmployeeDropdown"

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
    const [adjustmentTypes, setAdjustmentTypes] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const [initialValues, setInitialValues] = useState<any>({
        adjustments: [
            {
                "userId": "",
                "adjustmentTypeId": "",
                "adjustmentAmount": "",
                "periodMonth": "",
                "periodYear": "",
            }
        ],
        "userId": "",
        "adjustmentTypeId": "",
        "adjustmentAmount": "",
        "periodMonth": "",
        "periodYear": "",
    })

    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'Adjustment Name',
        'Payroll Period',
        'Action',
    ];

    const monthMap = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };

    function getMonthName(monthNumber) {
        const monthMap = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        };

        return monthMap[monthNumber];
    }

    function generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3;
        const endYear = currentYear + 3;
        const yearOptions = [];
        for (let year = startYear; year <= endYear; year++) {
            yearOptions.push(year);
        }
        return yearOptions;
    }
    const handleInputChange = (e) => {
        const monthName = e.target.value;
        const monthNumber = monthMap[monthName];
        setPeriodMonths(monthNumber);
    };
    const handleAddField = () => {
        setAdjustment([...adjustment, {}])
    }
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
            setFieldValue(name, value)
        }
    }

    useEffect(() => {
        if (modalShow) {
            setAdjustment([{}]);
        }
    }, [modalShow]);

    useEffect(() => {
        if (filterData) {
            getAllAdjustmentList(0)
        }
    }, [filterData])

    const handleRemoveField = (index: number) => {
        if (adjustment.length === 1) {
            return; // Do not remove the only field row
        }
        const updatedFields = [...adjustment];
        updatedFields.splice(index, 1);
        setAdjustment(updatedFields);
    }

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
        RequestAPI.getRequest(
            `${Api.getAdjustmentType}`,
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
                                adjustmentTypeId: d.id,
                                adjustmentName: d.name,
                                // deduction : d.deduction
                            })
                        });
                        setAdjustmentTypes(tempArray)
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

    const getAdjustment = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.getPayrollAdjustmentInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                console.log("Response:", res);
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
                            getAllAdjustmentList(0);
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
                            <div className="mx-1" style={{ width: 200, marginRight: 10 }}>
                                <label>Employee Name</label>
                                
                                <EmployeeDropdown
                                        name="userId"
                                        placeholder={"Employee"}
                                        value={filterData && filterData['userId']}
                                        singleChangeOption={singleChangeOption}
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
                                adjustmentList &&
                                adjustmentList.content &&
                                adjustmentList.content.length > 0 &&
                                adjustmentList.content.map((item: any, index: any) => {

                                    return (
                                        <tr>
                                            <td> {item.employeeId} </td>
                                            <td> {item.employeeName} </td>
                                            <td> {item.amount} </td>
                                            <td> {item.adjustmentName} </td>
                                            <td> {getMonthName(item.payrollMonth)} {item.payrollYear} </td>
                                            <td>
                                                <label
                                                    onClick={() => {
                                                        getAdjustment(item.id)
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
    )
}

