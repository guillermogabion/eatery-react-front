import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import EmployeeDropdown from "../../components/EmployeeDropdown"
import { Formik } from "formik"
import ContainerWrapper from "../../components/ContainerWrapper"







const ErrorSwal = withReactContent(Swal)

export const Recurring = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [ recurringList, setRecurringList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [recurring, setRecurring] = useState<any>([]);
    const [ recurringTypes, setRecurringTypes ] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});
    const [userId, setUserId] = React.useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [isDeduction, setIsDeduction] = useState("");
    const [selectedValue, setSelectedValue] = useState('');
    const selectRef = useRef(null);
    const [showButton, setShowButton] = useState(false);





    const [initialValues, setInitialValues] = useState<any>({
       
        recurring : [
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
        'Employee ID',
        'Employee Name',
        'Amount',
        'Recurring Name',
       
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
        const selectElement = selectRef.current;
        if (selectElement) {
        setShowButton(selectElement.selectedIndex !== 0);
        }
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
                            recurringDeduction : d.deduction
                        })
                    });
                    setRecurringTypes(tempArray)
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
                console.log("Response:", res);
                const { status, body = { data: {}, error: {} } }: any = res;
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                        // Handle error
                    } else {
                        setUserId(body.data.userId)
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

    const handleModalHide = useCallback(() => {
        setModalShow(false);
        formRef.current?.resetForm();
        setUserId(null)
        setInitialValues({
            recurring : [
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

      
      const executeSubmit = ( values , actions) => {

        const loadingSwal = Swal.fire({
            title: '',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

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

        if(!values.userId) {
           payload.recurring.forEach((element: any, index : any) => {
                if(element.userId == undefined) {
                    hasError = true
                }
                if(element.recurringTypeId == undefined) {
                    hasError = true
                }
                if(element.adjustmentAmount == undefined) {
                    hasError = true
                }
                if(element.endDate == undefined) {
                    hasError = true
                }
                if(element.active === undefined) {
                    element.active = true
                }
               
           });
           
           if (hasError) {
            ErrorSwal.fire(
                'Warning!',
                'Please fill all the required fields',
                'warning'
            )
           }else{
           
                RequestAPI.postRequest(Api.createRecurringTransaction, "", payload, {}, async (res:any) => {
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
        }else {
            const valuesObj : any = {...values}
            if (valuesObj.adjustmentAmount == undefined || valuesObj.adjustmentAmount == "" ) {
                hasError = true
            }

            if(hasError) {
                ErrorSwal.fire(
                    'Warning!',
                    'Please Enter a valid Amount',
                    'warning'
                )
            }else{
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



    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
              <div>
                <div className="w-100 pt-2">
                    <div className="fieldtext d-flex">
                        <div className="input-container col-md-2">
                        <EmployeeDropdown
                            placeholder={"Employee"}
                            singleChangeOption={singleChangeOption}
                            name="userId"
                            value={filterData && filterData['userId']}
                            withEmployeeID={true}
                            />
                        </div>
                        <div className="input-container col-md-3 clearable-select">
                            <select
                                placeholder="Recurring Name"
                                className="form-select"
                                name="isDeduction"
                                id="type"
                                onChange={(e) => {
                                    makeFilterData(e);
                                    setShowButton(e.target.value !== 'default')
                                  }}
                                ref={selectRef}
                            >
                                <option value="default" disabled selected>
                                Recurring Type
                                </option>
                                <option value={false}>Add
                                </option>
                                <option value={true}>Deduct
                                </option>
                            
                            </select>
                            {showButton && (
                                <span className="clear-icon" onClick={reset}>
                                X
                                </span>
                            )}
                      
                        


                        </div>
                        
                        <div className="input-container col-md-3">
                            <Button
                            style={{ width: 210 }}
                            onClick={() => getAllRecurringList(0)}
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
                        {/* <br />
                        <label
                            onClick={() => {
                                deleteRecurring(item.id)
                            }}
                            className="text-muted cursor-pointer">
                            Delete
                        </label> */}
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
        <div className="d-flex justify-content-end mt-3" >
            <div>
                <Button className="mx-2"
                    onClick={() => {
                    // setModalUploadShow(true)
                    setModalShow(true)
                    }}
                >Add Recurring</Button>
                <Button
                    className="mx-2"
                    onClick={() => {
                    // setModalShow(true)
                    }}>Import Recurring</Button>
                <Button
                    className="mx-2"
                    onClick={() => {
                        // downloadTemplate
                        }
                    }
                >Export Recurring</Button>
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
                                <div className="form-group row">
                                    <div className="col-md-3 mb-3">
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

                                    <div className="col-md-3 mb-3">
                                        <label>Recurring Action *</label>
                                        <select
                                            disabled
                                            placeholder="Recurring Name"
                                            className="form-select"
                                            name="recurringTypeId"
                                            id="type"
                                            value={values.recurringTypeId}
                                            onChange={(e) => {
                                                setFieldValue('recurringTypeId', e.target.value);
                                            }}
                                        >
                                            <option value="" disabled selected>
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
                                    <div className="col-md-4 mb-3">
                                        <label>Amount</label>
                                        <input
                                        type="number"
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
                                    <div className="col-md-4 mb-3">
                                        <label>End Date</label>
                                        <input
                                        type="date"
                                        className="formControl"
                                        name="endDate"
                                        value={values.endDate}
                                        onChange={(e) => {
                                            setFieldValue('endDate', e.target.value);
                                        }}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label>Status</label>
                                        <select
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
                                    {recurring.map((values: any, index: any)=> {
                                    return (
                                        <div key={`recurring-${index}`}>
                                            <div className="form-group row">
                                            <div className="col-md-3 mb-3">
                                            <label>Employee ID</label>
                                                <input
                                                readOnly
                                                className={`form-control ${touched.userId && errors.userId ? 'is-invalid' : ''}`}
                                                name="userId"
                                                value={values.userId ? values.userId : ''}
                                                onChange={(e) => {
                                                    const updatedFields = [...recurring];
                                                    updatedFields[index].userId = e.target.value;
                                                    setRecurring(updatedFields);
                                                    setFormField(e, setFieldValue)
                                                }}
                                                />
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                <label>Employee Name *</label>
                                                <select
                                                    placeholder="Employee Name"
                                                    className={`form-select ${touched.userId && errors.userId ? 'is-invalid' : ''}`}
                                                    value={values.userId}
                                                    onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    const updatedFields = [...recurring];
                                                    updatedFields[index].userId = selectedValue;
                                                    setRecurring(updatedFields);
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
                                                {errors && errors.userId && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.userId}</p>
                                                )}
                                                </div>


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
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.recurringTypeId}</p>
                                                    )}
                                                    </div>

                                                    {/* start of test  */}
                                                    <div className="col-md-3 mb-3">
                                                    <label>Recurring Action *</label>
                                                    <select
                                                        disabled
                                                        placeholder="Recurring Name"
                                                        className="form-select"
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
                                                <div className="col-md-4 mb-3">
                                                    <label>Amount</label>
                                                    <input
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
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.adjustmentAmount}</p>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>End Date</label>
                                                    <input
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
                                                        <p style={{ color: "red", fontSize: "12px" }}>{errors.endDate}</p>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                <label>Status</label>
                                                <select
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
                                                
                                                </div>

                                                {values.employeeId}
                                            
                                                {recurring.length > 1 && (
                                                    <div className="col-md-3 mb-3">
                                                        <label>&nbsp;</label>
                                                        <button
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

