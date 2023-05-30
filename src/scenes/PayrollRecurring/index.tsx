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
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");





    const [initialValues, setInitialValues] = useState<any>({
       
        recurring : [
            {
                "userId": "",
                "recurringTypeId": "",
                "adjustmentAmount": "",
                "endDate": "",
                "active": "",
            }
           
        ]
               
           
   
        
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
    const handleRemoveField = (index: number) => {
        if (recurring.length === 1) {
            return; // Do not remove the only field row
        }
        const updatedFields = [...recurring];
        updatedFields.splice(index, 1);
        setRecurring(updatedFields);
    }

    const getAllRecurringList = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.getAllRecurringList}?size=10&page${pageNo}`,
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
                  setRecurringTypes(body.data)
              } else {
                setRecurringTypes([]);
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
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                if (body.error && body.error.message) {
                } else {
                    const valueObj: any = body.data
                    setInitialValues(valueObj)
                    setModalShow(true)
                }
                }
            }
        )
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
   


    return (
        <div className="body">
            <div className="wrapper">
                <div className="w-100">
                    <div className="topHeader">
                        <UserTopMenu />
                    </div>
                    <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh'}}>
                        <DashboardMenu />
                        <div className="col-md-12 col-lg-10 px-5 py-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="bold-text">Good Day, {userData.data.profile.firstName}</h2>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                <h3>
                                    Recurring Transactions
                                </h3>
                                <div className="w-100">
                                    <div>
                                        <div className="w-100">
                                            <div className="fieldtext d-flex col-md-6">
                                                <div className="input-container">
                                                    <EmployeeDropdown
                                                        placeholder={"Employee"}
                                                        singleChangeOption={singleChangeOption}
                                                        name="userId"
                                                        value={filterData && filterData['userId']}
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
                                                {/* <div className="input-container" >
                                                    <select
                                                    placeholder="Recurring Name"
                                                    className="form-select"
                                                    name="type"
                                                    id="type"
                                                    value={values.name}
                                                    // onChange={(e) => setFormField(e, setFieldValue)}>
                                                    onChange={(e) => {
                                                        setFormField(e, setFieldValue);
                                                    
                                                    }}
                                                    >
                                                    {recurringTypes &&
                                                        recurringTypes.length &&
                                                        recurringTypes.map((item: any, index: string) => (
                                                        <option key={`${index}_${item.id}`} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                        ))}
                                                    </select>
                                                </div> */}
                                                {/* <input
                                                    name="deduct"
                                                    placeholder="Add/Deduct"
                                                    type="text"
                                                    autoComplete="off"
                                                    className="formControl"
                                                    maxLength={40}
                                                    onChange={(e) => makeFilterData(e)}
                                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                                /> */}
                                                <Button
                                                style={{ width: 210 }}
                                                onClick={() => getAllRecurringList(0)}
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
                                            recurringList &&
                                            recurringList.content &&
                                            recurringList.content.length > 0 &&
                                            recurringList.content.map((item: any, index: any) => {

                                            return (
                                                <tr>
                                                <td> {item.employeeId} </td>
                                                <td> {item.employeeName} </td>
                                                <td> {item.amount} </td>
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

                            </div>
                        </div>
                    </div>
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
                onHide={() => {
                    setModalShow(false)
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-v-center">
                        Create Recurring
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


                        if(userId){
                            RequestAPI.putRequest(
                                Api.updateRecurringTransaction,
                                "",
                                payload,
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
                        }else {
                            RequestAPI.postRequest(Api.createRecurringTransaction, "", payload, {}, async (res:any) => {
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
                                    {recurring.map((values: any, index: any)=> (
                                    <div key={`recurring-${index}`}>
                                        <div className="form-group row">
                                        <div className="col-md-2 mb-3">
                                        <label>Employee ID</label>
                                            <input
                                            readOnly
                                            className="formControl"
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
                                                className="form-select"
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
                                            </div>


                                            <div className="col-md-3 mb-3 mt-4">
                                                <select
                                                    placeholder="Recurring Name"
                                                    className="form-select"
                                                    name="recurringTypeId"
                                                    id="type"
                                                    value={values.description}
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;
                                                        const updatedFields = [...recurring];
                                                        updatedFields[index].recurringTypeId = selectedValue; // Update the recurringTypeId for the specific item
                                                        setRecurring(updatedFields);
                                                        setFieldValue(`recurring[${index}].recurringTypeId`, selectedValue); // Update the corresponding value in Formik's state
                                                        const selectedType = recurringTypes.content.find(item => item.id === selectedValue);
                                                        const isDeductionField = document.getElementsByName('isDeduction')[0];
                                                        if (selectedType) {
                                                            isDeductionField.value = selectedType.value;
                                                        } else {
                                                            isDeductionField.value = '';
                                                        }
                                                    }}
                                                >
                                                   <option value="" disabled={!index} selected={!index}>
                                                    Select Recurring Name
                                                    </option>
                                                    {recurringTypes &&
                                                    recurringTypes.content &&
                                                    recurringTypes.content.length &&
                                                    recurringTypes.content.map((item: any, index: string) => (
                                                        <option key={`${index}_${item.id}`} value={item.id}>
                                                        {item.name}
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
                                                value={values.deduction ? 'Deduction' : 'Add'}
                                                onChange={(e) => {
                                                    const updatedFields = [...recurring];
                                                    updatedFields[index].deduction = e.target.value;
                                                    setRecurring(updatedFields);
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
                                                    const updatedFields = [...recurring];
                                                    updatedFields[index].adjustmentAmount = e.target.value;
                                                    setRecurring(updatedFields);
                                                }}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label>End Date</label>
                                                <input
                                                type="date"
                                                className="formControl"
                                                name="endDate"
                                                value={values.endDate}
                                                onChange={(e) => {
                                                    setFieldValue('endDate', e.target.value);
                                                    const updatedFields = [...recurring];
                                                    updatedFields[index].endDate = e.target.value;
                                                    setRecurring(updatedFields);
                                                }}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                            <label>Status</label>
                                            <select
                                                name="active"
                                                className="formControl"
                                                value={values.active}
                                                onChange={(e) => {
                                                const selectedValue = e.target.value === 'true';
                                                setFieldValue('active', selectedValue);
                                                const updatedFields = [...recurring];
                                                updatedFields[index].active = e.target.value;
                                                setRecurring(updatedFields);
                                                }}
                                            ><option value="" disabled={!index} selected={!index}>
                                            Status
                                            </option>
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
                                                        className="btn btn-danger"
                                                        onClick={() => handleRemoveField(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    ))} 
                                    <div className="d-flex justify-content-end px-5">
                                    {!userId ? (
                                        <button
                                        type="button"
                                        className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                        onClick={handleAddField}
                                        >
                                        Add Field
                                        </button>
                                    ) : null}
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

        </div>
    )
}

