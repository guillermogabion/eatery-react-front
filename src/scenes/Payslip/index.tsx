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
import { Formik } from "formik"
import ContainerWrapper from "../../components/ContainerWrapper"
const ErrorSwal = withReactContent(Swal)

export const Payslip = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [ adjustmentList, setAdjustmentList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [adjustment, setAdjustment] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    // const [ adjustmentTypes, setAdjustmentTypes ] = useState<any>([]);
    const [ payrollList, setPayrollList ] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");

    const [initialValues, setInitialValues] = useState<any>({});

    const tableHeaders = [
        'Payroll Period',
        'Status',
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
    const handleInputChange = (e) => {
        const monthName = e.target.value;
        const monthNumber = monthMap[monthName];
        setPeriodMonths(monthNumber);
        };
    useEffect(() => {
        RequestAPI.getRequest(
            `${Api.payrollPayslipList}`,
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
                            id: d.id,
                            periodMonth: d.periodMonth,
                            periodYear : d.periodYear,
                            isGenerated : d.isGenerated
                        })
                    });
                    setPayrollList(tempArray)
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
      }, []);
    const [values, setValues] = useState({
    userId: [] // Initialize with an empty array
    });
    const [selectedEmployees, setSelectedEmployees] = useState([]);
   


    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
              <div>
                <div className="w-100 pt-2">
                    <div className="fieldtext d-flex col-md-6">
                        <div className="input-container">
                        <input
                                name="name"
                                // placeholder="employeeName"
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
                                // placeholder="Amount"
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
                                // placeholder="Add/Deduct"
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
                    payrollList &&
                    payrollList.length > 0 &&
                    payrollList.map((item: any, index: any) => {

                    return (
                        <tr>
                        
                        {/* <td> {item.isGenerated} </td> */}
                        <td> {getMonthName(item.periodMonth)} {item.periodYear} </td>
                        <td> {item.isGenerated == true ? 'Completed' : 'Incomplete' } </td>
                        <td>
                        <label
                        onClick={() => {
                            // getAdjustment(item.id)
                        }}
                        className="text-muted cursor-pointer">
                        View Logs
                        </label>
                       
                        </td>
                    
                        </tr>
                    )
                    })
                }
                </tbody>
            </Table>
        {
            payrollList &&
            payrollList.length == 0 ?
            <div className="w-100 text-center">
                <label htmlFor="">No Records Found</label>
            </div>
            :
            null
        }
            </div>

        
        </div>
        <div className="d-flex justify-content-end mt-3" >
        <div>
            <Button className="mx-2"
                onClick={() => {
                // setModalUploadShow(true)
                setModalShow(true)
                }}
            >Export Payslip</Button>
            <Button
                className="mx-2"
                onClick={() => {
                setModalShow(true)
                }}>Email Payslip</Button>
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
            onHide={handleModalHide}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-v-center">
                Email Payslip
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

                                            <div className="form-group row">
                                                <div className="col-md-3 mb-3">
                                                <label>Employee Name *</label>
                                                {/* <select
                                                    className="form-select"
                                                    value={values.userId}
                                                    onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    setFieldValue('userId', e.target.value);
                                                
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
                                                </select> */}

                                                    {/* {employee &&
                                                    employee.length &&
                                                    employee.map((item, index) => (
                                                        <div key={`${index}_${item.userId}`}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="userId"
                                                            id={`employee_${index}`}
                                                            value={item.userId}
                                                            checked={item.userId === values.userId}
                                                            onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            // Add your logic here based on the checkbox value change
                                                            }}
                                                        />
                                                        <label htmlFor={`employee_${index}`} className="form-check-label">
                                                            {item.label}
                                                        </label>
                                                        </div>
                                                    ))} */}
                                                  {employee &&
                                                    employee.length &&
                                                    employee.map((item, index) => (
                                                        <div key={`${index}_${item.userId}`} className="form-check">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`employee_${index}`}
                                                            name="userId"
                                                            label={item.label}
                                                            value={item.userId}
                                                            checked={Array.isArray(values.userId) && values.userId.includes(item.userId)}
                                                            onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            }}
                                                        />
                                                        </div>
                                                    ))}


                                                </div>
                                                <div className="col-md-3 mb-3">
                                            
                                            </div>
                                            
                                            </div>
                                            
                                            

                                                
                                            
                                            
                                            <div className="d-flex justify-content-end px-5">
                                                <button
                                                type="button"
                                                className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                                // onClick={handleAddField}
                                                >
                                                Add Field
                                                </button>
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

