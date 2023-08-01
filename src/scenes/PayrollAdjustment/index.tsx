import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"
import moment from "moment"
import { Button, Modal, Form } from "react-bootstrap"
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
import * as Yup from "yup"
import Upload from './upload'
import { Utility } from "../../utils"
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../assets/images"

const ErrorSwal = withReactContent(Swal)

export const PayrollAdjustment = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [adjustmentList, setAdjustmentList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [uploadModalShow, setUploadModalShow] = React.useState(false);
    const [downloadModalShow, setDownloadModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [adjustment, setAdjustment] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [adjustmentTypes, setAdjustmentTypes] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});
    const [userId, setUserId] = React.useState("");
    const [selectedMonth, setSelectedMonth] = useState('');
    const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [showButtonAdjustment, setShowButtonAdjustment] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [showButtonMonth, setShowButtonMonth] = useState(false);
    const [showButtonYear, setShowButtonYear] = useState(false);
    const [isDeduction, setIsDeduction] = useState("");
    const [adjustmentTypeName, setAdjustmentTypeName] = useState<any>([]);
    const [month, setMonth] = useState<any>([]);
    const [year, setYear] = useState<any>([]);
    const [pageSize, setPageSize] = useState(10);
    const [adjustmentTotal, setAdjustmentTotal] = useState<any>({});

    const [values, setValues] = useState({
        userId: '',
        adjustmentTypeId: '',
        amount: '',
        payrollMonth: '',
        payrollYear: '',
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    }
    const isButtonDisabled = !(values.userId && values.adjustmentTypeId && values.amount && values.payrollMonth && values.payrollYear);






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
        'ID',
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
    const handleRemoveField = (index: number) => {
        if (adjustment.length === 1) {
            return; // Do not remove the only field row
        }
        const updatedFields = [...adjustment];
        updatedFields.splice(index, 1);
        setAdjustment(updatedFields);
    }

    const getAllAdjustmentList = (pageNo: any, pageSize: any) => {
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
            `${Api.getAllPayrollList}?size=${pageSize ? pageSize : '10'}&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
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
        getAllAdjustmentList(0, pageSize)
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
                                adjustmentDeduction: d.deduction
                            })
                        });
                        setAdjustmentTypes(tempArray)
                        // setRecurringTypes([])
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
                                label: d.firstname + " " + d.lastname,
                                empId: d.employeeId
                            })
                        });
                        setEmployee(tempArray)
                    }
                }
            }
        )

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
                                name: d.name,
                                label: d.name
                            })
                        });
                        setAdjustmentTypeName(tempArray)
                    }
                }
            }
        )

        getTotals()
    }, [])


    const getTotals = () => {
        RequestAPI.getRequest(
            `${Api.adjustmentTotalAmounts}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setAdjustmentTotal(body.data)
                    }
                }
            }
        )
    };

    const handlePageClick = (event: any) => {
        const selectedPage = event.selected;
        getAllAdjustmentList(selectedPage, pageSize)
    };
    const handlePageSizeChange = (event) => {
        const selectedPageSize = parseInt(event.target.value, 10);
        setPageSize(selectedPageSize);
        getAllAdjustmentList(0, selectedPageSize);
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
    const createOption = (option: any, name: any, index: any) => {
        const valueObj: any = [...adjustment];
        valueObj[index][name] = option && option.value !== "Select" ? option.value : "";
        setAdjustment([...valueObj]);
    };

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

        // Return statement


    }


    const deleteRecurring = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this transaction?",
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

    const handleModalHide = useCallback(() => {
        setModalShow(false);
        formRef.current?.resetForm();
        setAdjustment([]);
        setInitialValues({
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

            

        });
    }, []);
    const handleChange = (e) => {
        const selectedValue = e.target.value;
        console.log('Selected value:', selectedValue);
        setSelectedMonth(selectedValue);
    };

    const executeSubmit = (values, actions) => {


        const adjustmentTransactions = adjustment.map((item) => ({
            userId: item.userId,
            adjustmentTypeId: item.adjustmentTypeId,
            adjustmentAmount: item.adjustmentAmount,
            // endDate: item.endDate,
            periodMonth: item.periodMonth,
            periodYear: item.periodYear,
            active: item.active
        }));
        const payload = {
            adjustments: adjustmentTransactions
        };



        let hasError = false
        if (!values.userId) {
            payload.adjustments.forEach((element: any, index: any) => {
                if (element.userId == undefined) {
                    hasError = true
                }
                if (element.adjustmentTypeId == undefined) {
                    hasError = true
                }
                if (element.adjustmentAmount == undefined) {
                    hasError = true
                }
                if (element.periodMonth == undefined) {
                    hasError = true
                }
                if (element.periodYear == undefined) {
                    hasError = true
                }
            });

            if (hasError) {
                ErrorSwal.fire(
                    'Warning!',
                    'Please fill all the required fields',
                    'warning'
                )
            } else {
                const loadingSwal = Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                console.log(payload)
                RequestAPI.postRequest(Api.payrollAdjustmentCreate, "", payload, {}, async (res: any) => {
                    Swal.close();
                    const { status, body = { data: {}, error: {} } }: any = res

                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                            // setRecurring([]);

                        } else {
                            handleModalHide()
                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            })

                        }
                    } else {
                        ErrorSwal.fire(
                            'Error!',
                            'Something Error.',
                            'error'
                        )
                    }
                })
            }

        } else {
            const valuesObj: any = { ...values }
            valuesObj.periodMonth = valuesObj.payrollMonth
            valuesObj.periodYear = valuesObj.payrollYear
            valuesObj.adjustmentAmount = valuesObj.amount
            delete valuesObj.payrollMonth;
            delete valuesObj.payrollYear;
            delete valuesObj.amount;


            if (valuesObj.adjustmentAmount == undefined || valuesObj.adjustmentAmount == "") {
                hasError = true
            }

            if (hasError) {
                ErrorSwal.fire(
                    'Warning!',
                    'Please Enter a valid Amount',
                    'warning'
                )
            } else {
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
                                // handleCloseModal();
                            } else {
                                setModalShow(false)
                                ErrorSwal.fire(
                                    "Updated Successfully!",
                                    body.data || "",
                                    "success"
                                ).then((result) => {
                                    if (result.isConfirmed) {
                                        location.reload();
                                    }
                                });
                                // handleCloseModal();
                            }
                        } else {
                            ErrorSwal.fire("Error!", "Something Error.", "error");
                        }
                    }
                );
            }
        }
    }

    const handleCloseModal = () => {
        setUploadModalShow(false)
    }
    const resetAdjustment = () => {

        // setAdjustmentTypeName("");
        const selectElement = document.getElementById("typeName");
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setShowButtonAdjustment(false);
        setFilterData(prevFilterData => {
            const filterObj = { ...prevFilterData };
            delete filterObj.adjustmentTypeName;
            return filterObj;
        });

    }
    const reset = () => {

        setIsDeduction("");
        const selectElement = document.getElementById("type");
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setShowButton(false);
        setFilterData(prevFilterData => {
            const filterObj = { ...prevFilterData };
            delete filterObj.isDeduction;
            return filterObj;
        });

    }
    const resetMonth = () => {

        setMonth("");
        const selectElement = document.getElementById("month");
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setShowButtonMonth(false);
        setFilterData(prevFilterData => {
            const filterObj = { ...prevFilterData };
            delete filterObj.periodMonth;
            return filterObj;
        });

    }
    const resetYear = () => {

        setYear("");
        const selectElement = document.getElementById("year");
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setShowButtonYear(false);
        setFilterData(prevFilterData => {
            const filterObj = { ...prevFilterData };
            delete filterObj.periodYear;
            return filterObj;
        });

    }
    const downloadTemplate = () => {
        RequestAPI.getFileAsync(
            `${Api.downloadTemplateAdjustment}`,
            "",
            "adjustmentexceltemplate.xlsx",
            async (res: any) => {
                if (res) {
                }
            }
        )
    };
    const downloadExcel = (fromDate: any, toDate: any) => {

        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.exportAdjustment}?fromDate=${fromDate}&toDate=${toDate}`,
            "",
            "recurringtransaction.xlsx",
            async (res: any) => {
                if (res) {
                    setIsSubmit(false)


                } else {

                }

            }
        )
    }


    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 pt-5 pb-1">
                <div>
                    <div className="w-100 pt-2">
                        <div className="fieldtext d-flex col-md-6">
                            <div className="input-container col-md-4">
                                <label>Employee</label>
                                <EmployeeDropdown
                                    id="payrolladjustment_employee_dropdown"
                                    placeholder={"Employee"}
                                    singleChangeOption={singleChangeOption}
                                    name="userId"
                                    value={filterData && filterData['userId']}
                                    withEmployeeID={true}
                                />
                            </div>
                            <div className="input-container col-md-3 clearable-select">
                                <label>Adjustment Name</label>
                                <select
                                    className="formControl"
                                    name="adjustmentTypeName"
                                    id="typeName"
                                    onChange={(e) => {
                                        makeFilterData(e)
                                        setShowButtonAdjustment(e.target.value !== 'default')
                                    }}
                                >
                                    <option value="" disabled selected>
                                        Adjustment Name
                                    </option>
                                    {adjustmentTypeName &&
                                        adjustmentTypeName.length &&
                                        adjustmentTypeName.map((item: any, index: string) => (
                                            <option key={`${index}_${item.name}`} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                                {showButtonAdjustment && (
                                    <span className="clear-icon-adjustment" onClick={resetAdjustment}>
                                        X
                                    </span>
                                )}
                        </div>
                        
                        <div className="input-container col-md-2">
                            <label>Amount</label>
                            <input type="text" 
                            id="payrolladjustment_amount_input"
                            className="formControl"
                            name="amount"
                            placeholder="Amount"
                            onChange={(e)=> makeFilterData(e)}
                            />
                        </div>
                        <div className="input-container clearable-select col-md-2">
                            <label>Type</label>
                            <select
                                className="form-control"
                                name="isDeduction"
                                id="type"
                                onChange={(e) => {
                                    makeFilterData(e);
                                    setShowButton(e.target.value !== 'default')
                                }}
                            >
                                <option value="default" disabled selected>
                                Type
                                </option>
                                <option value={false}>Add
                                </option>
                                <option value={true}>Deduct
                                </option>
                            
                            </select>
                            {showButton && (
                                <span id="payrolladjustment_closetype_span" className="clear-icon-adjustment" onClick={reset}>
                                X
                                </span>
                            )}
                            </div>
                            <div className="input-container clearable-select col-md-2">
                                <label>Select Month</label>
                                <select
                                    placeholder="Month"
                                    className="form-control"
                                    name="periodMonth"
                                    id="month"
                                    onChange={(e) => {
                                        makeFilterData(e)
                                        setShowButtonMonth(e.target.value !== 'default')
                                    }}
                                >
                                    <option value="" disabled selected>
                                        Select Month
                                    </option>
                                    {Object.entries(monthMap).map(([month, value]) => (
                                        <option key={value} value={value}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                {showButtonMonth && (
                                    <span id="payrolladjustment_closemonth_span" className="clear-icon-adjustment" onClick={resetMonth}>
                                        X
                                    </span>
                                )}
                            </div>
                            <div className="input-container clearable-select col-md-2">
                                <label>Select Year</label>
                                <select
                                    className="form-control"
                                    name="periodYear"
                                    id="year"
                                    onChange={(e) => {
                                        makeFilterData(e)
                                        setShowButtonYear(e.target.value !== 'default')
                                    }}
                                >
                                    <option value="" disabled selected>
                                        Year
                                    </option>
                                    {generateYearOptions().map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                {showButtonYear && (
                                    <span id="payrolladjustment_closeyear_span" className="clear-icon" onClick={resetYear}>
                                        X
                                    </span>
                                )}
                            </div>
                            <div className="input-container col-md-2 pt-4">
                                <Button
                                    id="payrolladjustment_search_button"
                                    style={{ width: 100 }}
                                    onClick={() => getAllAdjustmentList(0)}
                                    className="btn btn-primary mx-2">
                                    Search
                                </Button>
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
                        <tbody className="custom-row">
                            {
                                adjustmentList &&
                                adjustmentList.content &&
                                adjustmentList.content.length > 0 &&
                                adjustmentList.content.map((item: any, index: any) => {

                                    return (
                                        <tr>
                                            <td id="payrolladjustment_id_adjustmentlistdata"> {item.id} </td>
                                            <td id="payrolladjustment_employeeid_adjustmentlistdata"> {item.employeeId} </td>
                                            <td id="payrolladjustment_employeename_adjustmentlistdata"> {item.employeeName} </td>
                                            <td id="payrolladjustment_amount_adjustmentlistdata"> {Utility.formatToCurrency(item.amount)} </td>
                                            <td id="payrolladjustment_adjustmentname_adjustmentlistdata"> {item.adjustmentName} </td>
                                            <td id="payrolladjustment_monthyear_adjustmentlistdata"> {getMonthName(item.payrollMonth)} {item.payrollYear} </td>
                                            <td>
                                                <label
                                                    id="payrolladjustment_edit_adjustmentlistlabel"
                                                    onClick={() => {
                                                        getAdjustment(item.id)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                        <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                </label>
                                                <label
                                                    onClick={() => {
                                                        deleteRecurring(item.id)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                        <img src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Delete" />
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
                       
                
        <div className="text-muted mb-4">
            <h2>Total Amount: <span>{adjustmentTotal ? Utility.formatToCurrency(adjustmentTotal.notDeductionAmount) : 0}</span></h2>
            <h2>Total deduction: <span>{adjustmentTotal ? Utility.formatToCurrency(adjustmentTotal.deductionAmount) : 0}</span></h2>
        </div>
            
        </div>
        

        <div className="row">
            <div className="col-md-6">
                <div className="justify-content-start px-5">
                    <span className="font-bold mr-8 text-muted">Total Entries : {adjustmentList.totalElements}</span>
                    <br />
                    <div className="flex items-center">
                        <span className="text-muted mr-3">Select Page Size:</span>
                        <select id="pageSizeSelect" value={pageSize} className="form-select rounded-md py-2" style={{ fontSize: "16px", width: "150px" }} onChange={handlePageSizeChange}>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="d-flex justify-content-end pr-10">
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

            </div>
        </div>
        
        <div className="d-flex justify-content-end mt-3 pr-5" >
            <div>
                <Button className="mx-2"
                    id="payrolladjustment_addadjustment_modalbtn"
                    onClick={() => {
                        // setModalUploadShow(true)
                        setModalShow(true)
                    }}
                >Add Adjustment</Button>
                <Button
                    id="payrolladjustment_importadjustment_modalbtn"
                    className="mx-2"
                    onClick={() => {
                        setUploadModalShow(true)
                    }}>Import Adjustment</Button>
                <Button
                    id="payrolladjustment_exportadjustment_modalbtn"
                    className="mx-2"
                    onClick={() => {
                        setDownloadModalShow(true)
                    }
                    }
                >Export Adjustment</Button>
                <Button
                    id="payrolladjustment_downloadadjustmenttemplate_modalbtn"
                    className="mx-2"
                    onClick={
                        downloadTemplate
                    }
                >Download Adjustment Template</Button>
            </div>
        </div>


        <Modal
            show={modalShow}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-90w"
            onHide={
                handleModalHide
            }
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-v-center">
                Create Adjustment
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row w-100 px-5">
            <Formik
            innerRef={formRef}
            enableReinitialize={true}
            validationSchema={null}
            initialValues={initialValues}
            onSubmit={executeSubmit}
            >
                {({ values, setFieldValue, handleSubmit, errors, touched})=> {
                    return (
                        <Form
                        noValidate
                        onSubmit={handleSubmit}
                        id="_formid"
                        autoComplete="off"
                        >
                                <div className="d-flex justify-content-end px-5">
                                {values.userId ? null:  (
                                    <button
                                    type="button"
                                    className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                    onClick={handleAddField}
                                    >
                                    Add
                                    </button>
                                ) }
                            </div>

                            { values.userId ? (
                                <div>
                                    <div className="form-group row">
                                        <div className="col-md-4 mb-3">
                                        <label>Employee Name *</label>
                                        <select
                                            id="payrolladjustment_employeename_createadjustmentinput"
                                            disabled
                                            placeholder="Employee Name"
                                            className="formControl"
                                            value={values.userId}
                                            onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            setFieldValue('userId', e.target.value);
                                            const selectedEmployee = employee.find(
                                                (item) => item.userId === selectedValue
                                            );
                                            const employeeIdField = document.getElementsByName('userId')[0];
                                            if (selectedEmployee) {
                                                employeeIdField.value = selectedEmployee.userId;
                                            } else {
                                                employeeIdField.value = '';
                                            }
                                            }}
                                        >
                                            <option value="" disabled selected>
                                            Select Employee
                                            </option>
                                            {employee &&
                                            employee.length &&
                                            employee.map((item: any, index: string) => (
                                                <option key={`${index}_${item.userId}`} value={item.userId}>
                                                {item.label} - { item.empId }
                                                </option>
                                            ))}
                                        </select>
                                        <div className="col-md-4 mb-3">
                                            {touched.errors && errors.userId && (
                                                <p id="payrolladjustment_erroruserid_createadjustmentp" style={{ color: "red", fontSize: "10px" }}>{errors.userId}</p>
                                            )}
                                        </div>
                                        </div>
                                        <div className="col-md-2 mb-3 mt-4">
                                            <select
                                                disabled
                                                placeholder="Adjustment Name"
                                                className="form-select"
                                                name="adjustmentTypeId"
                                                id="type"
                                                value={values.adjustmentTypeId}
                                                onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    setFieldValue('adjustmentTypeId', e.target.value);
                                                    const selectedType = adjustmentTypes.find(
                                                            item => item.id === selectedValue);
                                                        const isDeductionField = document.getElementsByName('isDeduction')[0];
                                                        if (selectedType) {
                                                            isDeductionField.value = selectedType.deduction;
                                                        } else {
                                                            isDeductionField.value = '';
                                                        }
                                                    }}
                                                >
                                                    <option value="" disabled selected>
                                                        Select Adjustment Name
                                                    </option>
                                                    {adjustmentTypes &&
                                                        adjustmentTypes &&
                                                        adjustmentTypes.length &&
                                                        adjustmentTypes.map((item: any, index: string) => (
                                                            <option key={`${index}_${item.adjustmentTypeId}`} value={item.adjustmentTypeId}>
                                                                {item.adjustmentName}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label>Amount</label>
                                                <input
                                                    id="payrolladjustment_amount_createadjustmentinput"
                                                    type="number"
                                                    className={`form-control ${touched.amount && errors.amount ? 'is-invalid' : ''}`}
                                                    name="amount"
                                                    value={values.amount}
                                                    onChange={(e) => {
                                                        setFieldValue('amount', e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3 mt-4">

                                                <select
                                                    placeholder="Month"
                                                    className="form-select"
                                                    name="payrollMonth"
                                                    id="type"
                                                    value={values.payrollMonth}
                                                    onChange={(e) => {
                                                        setFieldValue('payrollMonth', e.target.value);
                                                        // Update the corresponding value in Formik's state
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select Month
                                                    </option>
                                                    {Object.entries(monthMap).map(([month, value]) => (
                                                        <option key={value} value={value}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </select>

                                            </div>
                                            <div className="col-md-2 mb-3 mt-4">
                                                <select
                                                    placeholder="Year"
                                                    className="form-select"
                                                    name="payrollYear"
                                                    id="type"
                                                    value={values.payrollYear}
                                                    onChange={(e) => {
                                                        setFieldValue('payrollYear', e.target.value);
                                                        // Update the corresponding value in Formik's state
                                                    }}
                                                >
                                                    <option value="" disabled selected >
                                                        Select Year
                                                    </option>
                                                    {generateYearOptions().map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                ) :

                                    <div>
                                        {adjustment.map((values: any, index: any) => {
                                            return (
                                                <div key={`adjustment-${index}`}>
                                                    <div className="form-group row">
                                            
                                            <div className="col-md-3 mb-3">
                                                <label>Employee *</label>
                                                <EmployeeDropdown
                                                    placeholder={"Employee"}
                                                    singleChangeOption={(e: any) => {
                                                        createOption(e, 'userId', index)
                                                    }}
                                                    name="userId"
                                                    value={adjustment && adjustment[index] && adjustment[index]['userId'] ? adjustment[index]['userId'] : ""}
                                                    withEmployeeID={true}
                                                />
                                            </div>

                                            <div className="col-md-3 mb-3">
                                                <label>Adjustment Name *</label>
                                                <select
                                                    className={`form-select ${values.adjustmentTypeId == "" ? 'is-invalid' : ''}`}
                                                    name="adjustmentTypeId"
                                                    id="type"
                                                    value={values.adjustmentTypeId}
                                                    onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    const updatedFields = [...adjustment];
                                                    updatedFields[index].adjustmentTypeId = selectedValue;
                                                    setAdjustment(updatedFields);
                                                    setFormField(e, setFieldValue);
                                                    const selectedType = adjustmentTypes.find(
                                                        (item) => item.adjustmentTypeId === selectedValue
                                                    );
                                                    const isDeductionField = document.getElementsByName('adjustmentTypeId')[0];
                                                    if (selectedType) {
                                                        isDeductionField.value = selectedType.deduction;
                                                    } else {
                                                        isDeductionField.value = '';
                                                    }
                                                    }}
                                                >
                                                    <option value="" disabled={!index} selected={!index}>
                                                    Select Adjustment Name
                                                    </option>
                                                    {adjustmentTypes &&
                                                    adjustmentTypes.length &&
                                                    adjustmentTypes.map((item, index) => (
                                                        <option key={`${index}_${item.adjustmentTypeId}`} value={item.adjustmentTypeId}>
                                                        {item.adjustmentName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {touched.errors && errors.adjustmentTypeId && (
                                                    <p id="payrolladjustment_errorselectadjustmentname_adjustmentp" style={{ color: "red", fontSize: "10px" }}>{errors.adjustmentTypeId}</p>
                                                )}
                                            </div>
                                               
                                            <div className="col-md-2 mb-3">
                                                <label>Amount</label>
                                                <input
                                                    id="payrolladjustment_amount_adjustmentminput"
                                                    type="number"
                                                    className={`form-control ${touched.amount && values.amount == "" ? 'is-invalid' : ''}`}
                                                    name="adjustmentAmount"
                                                    value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                                    onChange={(e) => {
                                                        setFieldValue('adjustmentAmount', e.target.value);
                                                        const updatedFields = [...adjustment];
                                                        updatedFields[index].adjustmentAmount = e.target.value;
                                                        setAdjustment(updatedFields);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3 mt-4">
                                                <select
                                                    placeholder="Month"
                                                    className={`form-select ${values.periodMonth == "" ? 'is-invalid' : ''}`}
                                                    name="periodMonth"
                                                    id="type"
                                                    value={values.periodMonth}
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;
                                                        const updatedFields = [...adjustment];
                                                        updatedFields[index].periodMonth = selectedValue; // Update the recurringTypeId for the specific item
                                                        setAdjustment(updatedFields);
                                                        setFieldValue(`adjustment[${index}].periodMonth`, selectedValue); // Update the corresponding value in Formik's state
                                                    }}
                                                >
                                                    <option value="" disabled={!index} selected={!index}>
                                                        Select Month
                                                    </option>
                                                    {Object.entries(monthMap).map(([month, value]) => (
                                                        <option key={value} value={value}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                            <div className="col-md-2 mb-3 mt-4">
                                                <select
                                                    placeholder="Year"
                                                    className={`form-select ${values.periodYear == "" ? 'is-invalid' : ''}`}
                                                    name="periodYear"
                                                    id="type"
                                                    value={values.periodYear}
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;
                                                        const updatedFields = [...adjustment];
                                                        updatedFields[index].periodYear = selectedValue; // Update the periodYear for the specific item
                                                        setAdjustment(updatedFields);
                                                        setFieldValue(`adjustment[${index}].periodYear`, selectedValue); // Update the corresponding value in Formik's state
                                                    }}
                                                >
                                                    <option value="" disabled={!index} selected={!index}>
                                                        Select Year
                                                    </option>
                                                    {generateYearOptions().map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                            {values.employeeId}

                                            {adjustment.length > 1 && (
                                                <div className="col-md-3 mb-3">
                                                    <label>&nbsp;</label>
                                                    <button
                                                        id="payrolladjustment_remove_adjustmentbtn"
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleRemoveField(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }


                            )
                            }
                        </div>
                    }

                        <Modal.Footer>
                            <button
                                id="payrolladjustment_save_adjustmentbtn"
                                type="submit"
                                className="btn btn-primary">
                                Save
                            </button>
                        </Modal.Footer>

                        </Form>
                    )
                }}
            </Formik>

        </Modal.Body>


    </Modal>
    <Modal
        show={uploadModalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setUploadModalShow(false)}
        dialogClassName="modal-90w"
    >
        <Modal.Header closeButton>
            <Modal.Title>
                Upload Excel File
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center">
            <div>
                <Upload onCloseModal={handleCloseModal} />
            </div>

        </Modal.Body>

    </Modal>
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
                id="payrolladjustment_downloadexcel_exportbtn"
                onClick={() => downloadExcel(fromDate, toDate)}
                disabled={isSubmit}>
                {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
            </Button>
        </Modal.Footer>
    </Modal>

    </>} />

    )
}
