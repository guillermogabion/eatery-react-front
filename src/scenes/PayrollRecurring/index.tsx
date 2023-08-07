import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import EmployeeDropdown from "../../components/EmployeeDropdown"
import Upload from "./upload"
import { Formik } from "formik"
import ContainerWrapper from "../../components/ContainerWrapper"
import moment from "moment"
import { Utility } from "../../utils"
import { action_decline, action_edit } from "../../assets/images"

const ErrorSwal = withReactContent(Swal)

export const Recurring = (props: any) => {

    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [recurringList, setRecurringList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [uploadModalShow, setUploadModalShow] = React.useState(false);
    const [downloadModalShow, setDownloadModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [recurringName, setRecurringName] = useState<any>([]);
    // const [recurring, setRecurring] = useState<{ [key: string]: string }>({});
    const [recurring, setRecurring] = useState<any>([]);
    const [recurringTypes, setRecurringTypes] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});
    const [userId, setUserId] = React.useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [isDeduction, setIsDeduction] = useState("");
    const [status, setStatus] = useState("");
    const [selectedValue, setSelectedValue] = useState('');
    const selectRef = useRef(null);
    const [showButton, setShowButton] = useState(false);
    const [showButtonStatus, setShowButtonStatus] = useState(false);
    const [showButtonRecurring, setShowButtonRecurring] = useState(false);
    const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [value, setValue] = useState({ userId: "" });
    const [valueCreation, setValueCreation] = useState<{ [key: string]: string }>({});
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [recurringTotal, setRecurringTotal] = useState<any>({});
    const [initialValues, setInitialValues] = useState<any>({

        recurring: [
            {
                "userId": "",
                "recurringTypeId": "",
                "adjustmentAmount": "",
                "endDate": "",
                "active": true,
            }

        ],
        "userId": "",
        "recurringTypeId": "",
        "adjustmentAmount": "",
        "endDate": "",
        "active": true,
    })
    const tableHeaders = [
        'ID',
        'Employee ID',
        'Employee Name',
        'Amount',
        'End Date',
        'Recurring Name',
        'Status',
        'Action',
    ];

    const options = [
        { value: false, label: 'Add' },
        { value: true, label: 'Deduct' },
    ];
    const handleOptionChange = (selected) => {
        setSelectedOption(selected);
        makeFilterData(selected);
    };

    const handleClearSelection = () => {
        setSelectedOption(null);
    };

    const handleAddField = () => {
        setRecurring([...recurring, {}])
    }
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
            setFieldValue(name, value)
        }
    }

    const handleSelectedOption = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    useEffect(() => {
        if (modalShow) {
            setRecurring([{}]);
        }
    }, [modalShow]);
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
        const selectElement = selectRef.current;
        if (selectElement) {
            setShowButton(selectElement.selectedIndex !== 0);
        }
        getAllRecurringList(0, pageSize);

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
                                name: d.name,
                                label: d.name
                            })
                        });
                        setRecurringName(tempArray)
                    }
                }
            }
        )
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
                                recurringName: d.name
                            })
                        });
                        setRecurringTypes(tempArray)
                    }
                }
            }
        )
        getTotals()
    }, [])

    const getTotals = () => {
        RequestAPI.getRequest(
            `${Api.recurringTotalAmounts}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        console.log(body)
                        setRecurringTotal(body.data)
                    }
                }
            }
        )
    };

    const handlePageClick = (event: any) => {
        const selectedPage = event.selected;
        getAllRecurringList(selectedPage, pageSize);
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
        // alert(option.value)
    }
    const createOption = (option: any, name: any, index: any) => {
        const valueObj: any = [...recurring];
        valueObj[index][name] = option && option.value !== "Select" ? option.value : "";
        setRecurring([...valueObj]);
    };

    const getRecurring = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.recurringInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                console.log("Response:", res);
                const { status, body = { data: {}, error: {} } }: any = res;
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setUserId(body.data.userId)
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
                            getAllRecurringList(0, pageSize);
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
        setRecurring([]);
        setUserId(null)
        setInitialValues({
            recurring: [
                {
                    "userId": "",
                    "recurringTypeId": "",
                    "adjustmentAmount": "",
                    "endDate": "",
                    "active": "true",
                }

            ],
            "userId": "",
            "recurringTypeId": "",
            "adjustmentAmount": "",
            "endDate": "",
            "active": "",

        });
    }, []);


    const executeSubmit = (values, actions) => {


        const recurringTransactions = recurring.map((item) => ({
            userId: item.userId,
            recurringTypeId: item.recurringTypeId,
            adjustmentAmount: item.adjustmentAmount,
            endDate: item.endDate,
            active: item.active
        }));

        const payload = {
            recurring: recurringTransactions
        };


        let hasError = false

        if (!values.userId) {
            payload.recurring.forEach((element: any, index: any) => {

                if (element.userId == undefined) {
                    hasError = true;
                }
                if (element.recurringTypeId == undefined) {
                    hasError = true
                }
                if (element.adjustmentAmount == undefined) {
                    hasError = true
                }
                if (element.endDate == undefined) {
                    hasError = true
                }
                if (element.active == undefined) {
                    element.active = true
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

                RequestAPI.postRequest(Api.createRecurringTransaction, "", payload, {}, async (res: any) => {
                    Swal.close();
                    const { status, body = { data: {}, error: {} } }: any = res
                    console.log(payload)

                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                            // setRecurring([]);

                        } else {
                            setModalShow(false)
                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            });

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
    const resetStatus = () => {

        setStatus("");
        const selectElement = document.getElementById("status1");
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setShowButtonStatus(false);
        setFilterData(prevFilterData => {
            const filterObj = { ...prevFilterData };
            delete filterObj.status;
            return filterObj;
        });

    }
    const resetRecurring = () => {

        setRecurring("");
        const selectElement = document.getElementById("typeName");
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        setShowButtonRecurring(false);
        setFilterData(prevFilterData => {
            const filterObj = { ...prevFilterData };
            delete filterObj.recurringTypeName;
            return filterObj;
        });

    }
    const handleCloseModal = () => {
        setUploadModalShow(false)
    }
    const downloadExcel = (fromDate: any, toDate: any) => {

        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.exportRecurring}?fromDate=${fromDate}&toDate=${toDate}`,
            "",
            "Recurringtransactions.xlsx",
            async (res: any) => {
                if (res) {

                    setIsSubmit(false)


                } else {

                }

            }
        )
    }
    const downloadTemplate = () => {
        RequestAPI.getFileAsync(
            `${Api.templateRecurring}`,
            "",
            "recurringexceltemplate.xlsx",
            async (res: any) => {
                if (res) {
                }
            }
        )
    };

    // test watch search - start

    // const handleOnChange = (e) => {
    //     if (e && e.target) {
    //       // If it's called from an event (handleChange)
    //       const { name, value } = e.target;
    //       setFilterData((prevFilterData) => ({
    //         ...prevFilterData,
    //         [name]: value,
    //       }));
    //     }
    
    //         getAllRecurringList(0, pageSize);

    //         clearTimeout(typingTimer);

    //         // Set a new timer to trigger the API call after a certain delay
    //         const typingTimer = setTimeout(() => {
    //           getAllRecurringList(0, pageSize); // Call the API after the delay
    //         }, 1000);
    //   };


    // useEffect(() => {

    //     // handleOnChange(filterData);
        
    //     const timer = setTimeout(() => {
    //         handleOnChange(filterData);
    //       }, 3000);
      
    //       return () => clearTimeout(timer);
    // }, [filterData]);
    // useEffect(() => {
    //     return () => clearTimeout(typingTimer);
    // }, []);
    
    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
                <div>
                    <div className="w-100">
                        <div className="fieldtext row">
                            <div className="col-lg-2 col-md-4 col-sm-6 col-xs-12">
                                <div className="input-container">
                                    <label>Employee</label>
                                    <EmployeeDropdown
                                    id="payrollrecurring_employee_dropdown"
                                    placeholder={"Employee"}
                                    singleChangeOption={singleChangeOption}
                                    name="userId"
                                    value={filterData && filterData['userId']}
                                    withEmployeeID={true}
                                    
                                    />
                                </div>
                            </div>
                            <div className="col-lg-1 col-md-4 col-sm-6 col-xs-12">
                                <div className="input-container">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        id="payrollrecurring_amount_input"
                                        className="form-control"
                                        name="adjustmentAmount"
                                        placeholder="Amount"
                                        onChange={(e) => makeFilterData(e)}
                                        // onChange={(e) => {
                                        //     // Call handleChange to update filterData
                                        //     makeFilterData(e);
                                        //     // Call handleOnChange as you've updated filterData
                                        //     // (handleOnChange is now also triggered when Amount field changes)
                                        //     handleOnChange();
                                        //   }}
                                        // onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-1 col-md-4 col-sm-6 col-xs-12 clearable-select">
                                <div className="">
                                    <label>Type</label>
                                    <select
                                    className="form-control"
                                    name="isDeduction"
                                    id="type"
                                    onChange={(e) => {
                                        makeFilterData(e);
                                        // handleOnChange(e);
                                        setShowButton(e.target.value !== 'default');
                                    }}
                                    ref={selectRef}
                                    >
                                    <option value="default" disabled selected >
                                        Type
                                    </option>
                                    <option value={false}>Add</option>
                                    <option value={true}>Deduct</option>
                                    </select>
                                    {showButton && (
                                    <span
                                        id="payrollrecurring_closetype_span"
                                        className="clear-icon-recurring"
                                        onClick={reset}
                                    >
                                        X
                                    </span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6 col-xs-12 clearable-select">
                                <div className="">
                                    <label>Recurring Name</label>
                                    <select
                                    className="formControl"
                                    name="recurringTypeName"
                                    id="typeName"
                                    onChange={(e) => {
                                        makeFilterData(e);
                                        setShowButtonRecurring(e.target.value !== 'default');
                                    }}
                                    >
                                    <option value="" disabled selected>
                                        Select Recurring Name
                                    </option>
                                    {recurringName &&
                                        recurringName.length &&
                                        recurringName.map((item: any, index: string) => (
                                        <option key={`${index}_${item.name}`} value={item.name}>
                                            {item.name}
                                        </option>
                                        ))}
                                    </select>
                                    {showButtonRecurring && (
                                    <span
                                        id="payrollrecurring_closerecurringname_span"
                                        className="clear-icon-recurring"
                                        onClick={resetRecurring}
                                    >
                                        X
                                    </span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6 col-xs-12">
                                <div className="input-container">
                                    <label>End Date</label>
                                    <input
                                    type="date"
                                    id="payrollrecurring_enddate_input"
                                    className="form-control"
                                    name="endDate"
                                    placeholder="End Date"
                                    onChange={(e) => makeFilterData(e)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6 col-xs-12 clearable-select">
                                <div className="input-container">
                                    <label>Status</label>
                                    <select
                                    className="form-control"
                                    name="status"
                                    id="status1"
                                    onChange={(e) => {
                                        makeFilterData(e);
                                        setShowButtonStatus(e.target.value !== 'default');
                                    }}
                                    ref={selectRef}
                                    >
                                    <option value="default" disabled selected>
                                        Status
                                    </option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    </select>
                                    {showButtonStatus && (
                                    <span
                                        id="payrollrecurring_closestatus_span"
                                        className="clear-icon-recurring"
                                        onClick={resetStatus}
                                    >
                                        X
                                    </span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 text-center">
                                <div className="input-container pt-4">
                                    <Button
                                    id="payrollrecurring_search_btn"
                                    style={{ width: '100%' }}
                                    onClick={() => getAllRecurringList(0)}
                                    className="btn btn-primary"
                                    >
                                    Search
                                    </Button>
                                </div>
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
                                            <td id="payrollrecurring_id_recurringlistdata"> {item.id} </td>
                                            <td id="payrollrecurring_employeeid_recurringlistdata"> {item.employeeId} </td>
                                            <td id="payrollrecurring_employeename_recurringlistdata"> {item.employeeName} </td>
                                            <td id="payrollrecurring_adjustmentamount_recurringlistdata">{Utility.formatToCurrency(item.adjustmentAmount)}</td>
                                            <td id="payrollrecurring_enddate_recurringlistdata"> {item.endDate} </td>
                                            <td id="payrollrecurring_recurringname_recurringlistdata"> {item.recurringName} </td>
                                            <td id="payrollrecurring_active_recurringlistdata"> {item.active == true ? "ACTIVE" : "INACTIVE"} </td>

                                            <td>
                                                <label
                                                    id="payrollrecurring_update_recurringlistlabel"
                                                    onClick={() => {
                                                        getRecurring(item.id)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                    <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                </label>
                                                <label
                                                    id="payrollrecurring_delete_recurringlistlabel"
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
                <div className="text-muted">
                    <h2>Total Amount: <span>{recurringTotal ? Utility.formatToCurrency(recurringTotal.notDeductionAmount) : 0}</span></h2>
                    <h2>Total deduction: <span>{recurringTotal ? Utility.formatToCurrency(recurringTotal.deductionAmount) : 0}</span></h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="justify-content-start px-5">
                        <span className="font-bold mr-8 text-muted">Total Entries : {recurringList.totalElements}</span>
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
                    <div className="d-flex justify-content-end pr-10 ">
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



            <div className="d-flex justify-content-end mt-3 pr-5 mb-5" >
                <div>
                    <Button className="mx-2"
                        id="payrollrecurring_addrecurring_recurringlistbtn"
                        onClick={() => {
                            // setModalUploadShow(true)
                            setModalShow(true)
                        }}
                    >Add Recurring</Button>
                    <Button
                        id="payrollrecurring_importrecurring_recurringlistbtn"
                        className="mx-2"
                        onClick={() => {
                            setUploadModalShow(true)
                        }}>Import Recurring</Button>
                    <Button
                        id="payrollrecurring_exportrecurring_recurringlistbtn"
                        className="mx-2"
                        onClick={() => {
                            setDownloadModalShow(true)
                        }
                        }
                    >Export Recurring</Button>
                    <Button
                        id="payrollrecurring_downloadrecurringtemplate_recurringlistbtn"
                        className="mx-2"
                        onClick={
                            downloadTemplate
                        }
                    >Download Recurring Template</Button>
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
                        {userId ? 'Update Recurring' : 'Create Recurring'}
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



                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    id="_formid"
                                    autoComplete="off"
                                >
                                    <div className="d-flex justify-content-end px-5">
                                        {values.userId ? null : (
                                            <button
                                                type="button"
                                                className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                                onClick={handleAddField}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>

                                    {values.id ? (
                                        <div>
                                            <div className="form-group row">
                                                <div className="col-md-3 mb-3">
                                                    <label>Employee Name *</label>
                                                    <select
                                                        id="payrollrecurring_employeename_formselect"
                                                        disabled
                                                        className="formControl"
                                                        value={values.userId}
                                                        onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            setFieldValue('userId', e.target.value);
                                                            const selectedEmployee = employee.find(
                                                                (item) => item.userId === selectedValue
                                                            );
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Employee
                                                        </option>
                                                        {employee &&
                                                            employee.length &&
                                                            employee.map((item: any, index: string) => (
                                                                <option key={`${index}_${item.userId}`} value={item.userId}>
                                                                    {item.label} - {item.empId}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label>Recurring Name *</label>
                                                    <select
                                                        disabled
                                                        placeholder="Recurring Name"
                                                        className="form-select"
                                                        name="recurringTypeId"
                                                        id="type"
                                                        value={values.recurringTypeId}
                                                        onChange={(e) => {
                                                            setFormField(e, setFieldValue);
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Recurring Name
                                                        </option>
                                                        {recurringTypes &&
                                                            recurringTypes.length &&
                                                            recurringTypes.map((item: any, index: string) => (
                                                                <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                    {item.recurringName}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-2 mb-3">
                                                    <label>Amount</label>
                                                    <input
                                                        type="number"
                                                        id="payrollrecurring_amount_forminput"
                                                        className={`form-control ${touched.adjustmentAmount && errors.adjustmentAmount ? 'is-invalid' : ''}`}
                                                        name="adjustmentAmount"
                                                        value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                                        onChange={(e) => {
                                                            setFieldValue('adjustmentAmount', e.target.value);
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === '-' || e.key === '+') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                </div>
                                                <div className="col-md-2 mb-3">
                                                    <label>End Date</label>
                                                    <input
                                                        id="payrollrecurring_enddate_forminput"
                                                        type="date"
                                                        className="formControl"
                                                        name="endDate"
                                                        value={values.endDate}
                                                        onChange={(e) => {
                                                            setFieldValue('endDate', e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-2 mb-3">
                                                    <label>Status</label>
                                                    <select
                                                        id="payrollrecurring_status_formstatus"
                                                        name="active"
                                                        className="formControl"
                                                        value={values.active}
                                                        onChange={(e) => {
                                                            setFieldValue('active', e.target.value);
                                                        }}
                                                    >
                                                        <option value={true}>Active</option>
                                                        <option value={false}>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>

                                    ) :

                                        <div>
                                            {recurring.map((values: any, index: any) => {
                                                return (
                                                    <div key={`recurring-${index}`}>
                                                        <div className="form-group row">
                                                            <div className="col-md-3 mb-3">
                                                                <label>Employee *</label>
                                                                <EmployeeDropdown
                                                                    id="payrollrecurring_recurringtypeemployee_recurringdropdown"
                                                                    placeholder={"Employee"}
                                                                    singleChangeOption={(e: any) => {
                                                                        createOption(e, 'userId', index)
                                                                    }}
                                                                    name="userId"
                                                                    value={recurring && recurring[index] && recurring[index]['userId'] ? recurring[index]['userId'] : ""}
                                                                    withEmployeeID={true}
                                                                />
                                                            </div>
                                                            {/* <p>Selected Employee: {value ? value.userId : "None"}</p> */}
                                                            <div className="col-md-3 mb-3">
                                                                <label>Recurring Name *</label>
                                                                <select
                                                                    placeholder="Recurring Name"
                                                                    className={`form-select ${touched.recurringTypeId && errors.recurringTypeId ? 'is-invalid' : ''}`}
                                                                    name="recurringTypeId"
                                                                    id="type"
                                                                    value={values.recurringTypeId}
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value;
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].recurringTypeId = selectedValue;
                                                                        setRecurring(updatedFields);
                                                                        setFormField(e, setFieldValue);
                                                                        const selectedType = recurringTypes.find(
                                                                            (item) => item.recurringTypeId === selectedValue
                                                                        );
                                                                        const isDeductionField = document.getElementsByName('recurringTypeId')[0];
                                                                        if (selectedType) {
                                                                            isDeductionField.value = selectedType.deduction;
                                                                        } else {
                                                                            isDeductionField.value = '';
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="" disabled={!index} selected={!index}>
                                                                        Select Recurring Name
                                                                    </option>
                                                                    {recurringTypes &&
                                                                        recurringTypes.length &&
                                                                        recurringTypes.map((item, index) => (
                                                                            <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                                {item.recurringName}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                                {errors && errors.recurringTypeId && (
                                                                    <p id="payrollrecurring_recurringtypeid_recurringinputp" style={{ color: "red", fontSize: "12px" }}>{errors.recurringTypeId}</p>
                                                                )}
                                                            </div>

                                                            {/* start of test  */}
                                                            <div className="col-md-2 mb-3">
                                                                <label>Recurring Action *</label>
                                                                <select
                                                                    disabled
                                                                    placeholder="Recurring Name"
                                                                    className="form-control"
                                                                    name="recurringTypeId"
                                                                    id="type"
                                                                    value={values.recurringTypeId}
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value;
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].recurringTypeId = selectedValue;
                                                                        setRecurring(updatedFields);
                                                                        setFormField(e, setFieldValue);
                                                                        const selectedType = recurringTypes.find(
                                                                            (item) => item.recurringDeduction === selectedValue
                                                                        );
                                                                        const isDeductionField = document.getElementsByName('recurringDeduction')[0];
                                                                        if (selectedType) {
                                                                            isDeductionField.value = selectedType.recurringDeduction;
                                                                        } else {
                                                                            isDeductionField.value = '';
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="" disabled={!index} selected={!index}>
                                                                        Recurring Action
                                                                    </option>
                                                                    {recurringTypes &&
                                                                        recurringTypes.length &&
                                                                        recurringTypes.map((item, index) => (
                                                                            <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                                {item.recurringDeduction === true ? "Deduct" : "Add"}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                            {/* end of test  */}
                                                            <div className="col-md-2 mb-3">
                                                                <label>Amount</label>
                                                                <input
                                                                    id="payrollrecurring_amount_recurringinput"
                                                                    type="number"
                                                                    name="adjustmentAmount"
                                                                    className={`form-control ${touched.adjustmentAmount && errors.adjustmentAmount ? 'is-invalid' : ''}`}
                                                                    value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                                                    onChange={(e) => {
                                                                        setFieldValue('adjustmentAmount', e.target.value);
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].adjustmentAmount = e.target.value;
                                                                        setRecurring(updatedFields);
                                                                    }}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === '-' || e.key === '+') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                />
                                                                {errors && errors.adjustmentAmount && (
                                                                    <p id="payrollrecurring_erroradjustmentamount_recurringinputp" style={{ color: "red", fontSize: "12px" }}>{errors.adjustmentAmount}</p>
                                                                )}
                                                            </div>
                                                            <div className="col-md-2 mb-3">
                                                                <label>End Date</label>
                                                                <input
                                                                    id="payrollrecurring_enddate_recurringinput"
                                                                    type="date"
                                                                    className={`form-control ${touched.endDate && errors.endDate ? 'is-invalid' : ''}`}
                                                                    name="endDate"
                                                                    value={values.endDate}
                                                                    onChange={(e) => {
                                                                        setFieldValue('endDate', e.target.value);
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].endDate = e.target.value;
                                                                        setRecurring(updatedFields);
                                                                    }}
                                                                />
                                                                {errors && errors.endDate && (
                                                                    <p id="payrollrecurring_errorenddate_recurringinputp" style={{ color: "red", fontSize: "12px" }}>{errors.endDate}</p>
                                                                )}
                                                            </div>
                                                            {/* <div className="col-md-4 mb-3">
                                            <label>Status</label>
                                            <select
                                                id="payrollrecurring_status_recurringselect"
                                                name="active"
                                                className="form-select"
                                                value={values.active === undefined ? true : false}
                                                onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                setFieldValue('active', selectedValue);
                                                const updatedFields = [...recurring];
                                                updatedFields[index].active = e.target.value;
                                                setRecurring(updatedFields);
                                                }}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                            
                                            </div> */}

                                                            {values.employeeId}

                                                            {recurring.length > 1 && (
                                                                <div className="col-md-3 mb-3">
                                                                    <label>&nbsp;</label>
                                                                    <button
                                                                        id="payrollrecurring_remove_recurringinputbtn"
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


                                    {/* <div className="d-flex justify-content-end px-5">
                            {values.userId ? null:  (
                                <button
                                id="payrollrecurring_addfield_recurringbtn"
                                type="button"
                                className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                onClick={handleAddField}
                                >
                                Add Field
                                </button>
                            ) }
                            </div> */}
                                    <Modal.Footer>
                                        <button
                                            id="payrollrecurring_save_recurringbtn"
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
                        id="payrollrecurring_downloadexcel_recurringbtn"
                        onClick={() => downloadExcel(fromDate, toDate)}
                        disabled={isSubmit}>
                        {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
        </>} />
    )
}

