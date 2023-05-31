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

const ErrorSwal = withReactContent(Swal)

export const Payroll = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [ adjustmentList, setAdjustmentList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [adjustment, setAdjustment] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [ adjustmentTypes, setAdjustmentTypes ] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");






    const [initialValues, setInitialValues] = useState<any>({
       
        adjustments : [
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
            `${Api.getAllPayrollList}?size=10&page${pageNo}${queryString}`,
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
        
        // Return statement
       
       
    }
    

    const deleteRecurring = (id : any = 0) => {
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

    const handleModalHide = useCallback(() => {
        setModalShow(false);
        formRef.current?.resetForm();
        setInitialValues({
            adjustments : [
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

   


    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
              <div>
                <div className="w-100 pt-2">
                    <div className="fieldtext d-flex col-md-6">
                        <div className="input-container">
                        <input
                                name="name"
                                placeholder="employeeName"
                                type="text"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                onChange={(e) => makeFilterData(e)}
                                // onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>
                        <div className="input-container">
                            <input
                                name="amount"
                                placeholder="Amount"
                                type="text"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>
                        <div className="input-container">
                            <input
                                name="deduct"
                                placeholder="Add/Deduct"
                                type="text"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>
                        <Button
                        style={{ width: 210 }}
                        onClick={() => getAllAdjustmentList(0)}
                        className="btn btn-primary mx-2">
                        Search
                        </Button>
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
        <div className="d-flex justify-content-end mt-3" >
        <div>
        <Button className="mx-2"
            onClick={() => {
            // setModalUploadShow(true)
            setModalShow(true)
            }}
        >Add Adjustment</Button>
        <Button
            className="mx-2"
            onClick={() => {
            // setModalShow(true)
            }}>Import Adjustment</Button>
        <Button
            className="mx-2"
            onClick={() => {
                // downloadTemplate
                }
            }
        >Export Adjustment</Button>
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
                onSubmit={(values, actions) => {

                    
                    const loadingSwal = Swal.fire({
                        title: '',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    

                    
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


                    if(values.userId){
                        const valuesObj : any = {...values}
                        console.log(valuesObj)
                        // RequestAPI.putRequest(
                        //     Api.updateRecurringTransaction,
                        //     "",
                        //     valuesObj,
                        //     {},
                        //     async (res) => {
                        //         const { status, body = { data: {}, error: {} } } = res;
                        
                        //         if (status === 200 || status === 201) {
                        //             if (body.error && body.error.message) {
                        //             ErrorSwal.fire(
                        //                 "Error!",
                        //                 body.error.message || "",
                        //                 "error"
                        
                        //             );
                        //             // handleCloseModal();
                        //             } else {
                        //             setModalShow(false)
                        //             ErrorSwal.fire(
                        //                 "Updated Successfully!",
                        //                 body.data || "",
                        //                 "success"
                        //             ).then((result) => {
                        //                 if (result.isConfirmed) {
                        //                 location.reload();
                        //                 }
                        //             });
                        //             // handleCloseModal();
                        //             }
                        //         } else {
                        //             ErrorSwal.fire("Error!", "Something Error.", "error");
                        //         }
                        //         }
                        // );
                    }else {
                        RequestAPI.postRequest(Api.payrollAdjustmentCreate, "", payload, {}, async (res:any) => {
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
                                setModalShow(false)
                                ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                                )
                                
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
                }}
                >

                    

                    {({ values, setFieldValue, handleSubmit, errors, touched})=> {
                        return (
                            <Form
                            noValidate
                            onSubmit={handleSubmit}
                            id="_formid"
                            autoComplete="off"
                            >

                                { values.userId ? (
                                    <div>
                                    {/* with userId  */}

                                    {/* <div className="col-md-2 mb-3">
                                        <label>Amount</label>
                                        <input
                                        className="form-control"
                                        name="adjustmentAmount"
                                        value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                        onChange={(e) => {
                                            setFieldValue('adjustmentAmount', e.target.value);
                                        }}
                                        />
                                    </div> */}
                                <div className="form-group row">
                                    <div className="col-md-2 mb-3">
                                        <label>Employee ID</label>
                                            <input
                                            readOnly
                                            className="formControl"
                                            name="userId"
                                            value={values.userId ? values.userId : ''}
                                            onChange={(e) => {
                                                setFieldValue('userId', e.target.value);
                                            }}
                                            />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                    <label>Employee Name *</label>
                                    <select
                                        disabled
                                        placeholder="Employee Name"
                                        className="form-select"
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
                                            {item.label}
                                            </option>
                                        ))}
                                    </select>
                                    </div>
                                    <div className="col-md-3 mb-3 mt-4">
                                        <select
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
                                    <div className="col-md-1 mb-3">
                                        <label>Deduct/Add</label>
                                        <input
                                        readOnly
                                        name="isDeduction"
                                        className="formControl"
                                        value={values.deduction === true ? 'Deduction' : 'Add'}
                                        onChange={(e) => {
                                            setFieldValue('deduction', e.target.value);
                                        }}
                                        />
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label>Amount</label>
                                        <input
                                        className="form-control"
                                        name="adjustmentAmount"
                                        value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                        onChange={(e) => {
                                            setFieldValue('adjustmentAmount', e.target.value);
                                        }}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3 mt-4">
                                            <select
                                                placeholder="Month"
                                                className="form-select"
                                                name="periodMonth"
                                                id="type"
                                                value={values.periodMonth}
                                                onChange={(e) => {
                                                    setFieldValue('periodMonth', e.target.value); // Update the corresponding value in Formik's state
                                                }}
                                            >
                                                <option value="" disabled selected >
                                                    Select Month
                                                </option>
                                                {Object.entries(monthMap).map(([month, value]) => (
                                                    <option key={value} value={value}>
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        
                                        <div className="col-md-3 mb-3 mt-4">
                                            <select
                                                placeholder="Year"
                                                className="form-select"
                                                name="periodYear"
                                                id="type"
                                                value={values.periodYear}
                                                onChange={(e) => {
                                                    setFieldValue('periodYear', e.target.value);
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
                                    {adjustment.map((values: any, index: any)=> {
                                    return (
                                        <div key={`adjsutment-${index}`}>
                                            <div className="form-group row">
                                            <div className="col-md-2 mb-3">
                                            <label>Employee ID</label>
                                                <input
                                                readOnly
                                                className="formControl"
                                                name="userId"
                                                value={values.userId ? values.userId : ''}
                                                onChange={(e) => {
                                                    const updatedFields = [...adjustment];
                                                    updatedFields[index].userId = e.target.value;
                                                    setAdjustment(updatedFields);
                                                    setFormField(e, setFieldValue)
                                                }}
                                                />
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                <label>Employee Name *</label>
                                                <select
                                                    placeholder="Employee Name"
                                                    className="form-select"
                                                    value={values.userId}
                                                    onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    const updatedFields = [...adjustment];
                                                    updatedFields[index].userId = selectedValue;
                                                    setAdjustment(updatedFields);
                                                    setFormField(e, setFieldValue)

                                                    // Update the employee ID field with the selected employee's userId
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
                                                        {item.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                </div>


                                                <div className="col-md-3 mb-3 mt-4">
                                                    <select
                                                        placeholder="Adjustment Name"
                                                        className="form-select"
                                                        name="adjustmentTypeId"
                                                        id="type"
                                                        value={values.deduction}
                                                        onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            const updatedFields = [...adjustment];
                                                            updatedFields[index].adjustmentTypeId = selectedValue; // Update the recurringTypeId for the specific item
                                                            setAdjustment(updatedFields);
                                                            setFieldValue(`adjustment[${index}].adjustmentTypeId`, selectedValue); // Update the corresponding value in Formik's state
                                                            const selectedType = adjustmentTypes.find(item => item.id === selectedValue);
                                                            const isDeductionField = document.getElementsByName('isDeduction')[0];
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
                                                        adjustmentTypes.map((item: any, index: string) => (
                                                            <option key={`${index}_${item.adjustmentTypeId}`} value={item.adjustmentTypeId}>
                                                            {item.adjustmentName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-1 mb-3">
                                                    <label>Deduct/Add</label>
                                                    <input
                                                    readOnly
                                                    name="isDeduction"
                                                    className="formControl"
                                                    value={values.deduction == true ? "Deduction" : "Add"}
                                                    onChange={(e) => {
                                                        const updatedFields = [...adjustment];
                                                        updatedFields[index].deduction = e.target.value;
                                                        setAdjustment(updatedFields);
                                                        setFormField(e, setFieldValue)
                                                    }}
                                                    />
                                                </div>
                                                <div className="col-md-2 mb-3">
                                                    <label>Amount</label>
                                                    <input
                                                    className="form-control"
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
                                                <div className="col-md-3 mb-3 mt-4">
                                                    <select
                                                        placeholder="Month"
                                                        className="form-select"
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

                                                
                                                <div className="col-md-3 mb-3 mt-4">
                                                    <select
                                                        placeholder="Year"
                                                        className="form-select"
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
                                                            type="button"
                                                            className="btn btn-danger"
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
                                
                                
                                <div className="d-flex justify-content-end px-5">
                                {values.userId ? null:  (
                                    <button
                                    type="button"
                                    className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                    onClick={handleAddField}
                                    >
                                    Add Field
                                    </button>
                                ) }
                                </div>
                                <Modal.Footer>
                                    <button
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

        </>} />

    )
}

