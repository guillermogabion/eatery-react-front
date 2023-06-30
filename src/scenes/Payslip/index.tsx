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
import EmployeeDropdown from "../../components/EmployeeDropdown"

const ErrorSwal = withReactContent(Swal)

export const Payslip = (props: any) => {
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [payroll, setPayroll] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [ payrollList, setPayrollList ] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const [initialValues, setInitialValues] = useState<any>({});
    

    const { emailData } = props
    const email = { ...emailData }

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
       
        const getAllPayroll = (pageNo : any ) => {
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
                `${Api.payrollPayListAll}?size=10&page=${pageNo}${queryString}`,
                "",
                {},
                {},
                async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 && body && body.data.content) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.content.forEach((d: any, i: any) => {
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
        }
    useEffect(() => {
       
        getAllPayroll(0)
        //   RequestAPI.getRequest(
        //     `${Api.generatedList}`,
        //     "",
        //     {},
        //     {},
        //     async (res: any) => {
        //         const { status, body = { data: {}, error: {} } }: any = res
        //         if (status === 200 && body && body.data) {
        //             if (body.error && body.error.message) {
        //             } else {
        //                 let tempArray = [...body.data]
        //                 body.data.forEach((d: any, i: any) => {
        //                     d.isCheck = false
        //                 });
        //                 setEmployee(tempArray)
        //             }
        //       }
        //     }
        //   )

          RequestAPI.getRequest(
            `${Api.payrollPayList}`,
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
                                label1: d.periodMonth,
                                label2: d.periodYear,
                                label3: d.dateFrom,
                                label4: d.dateTo,
                            })
                        });
                        setPayroll(tempArray)
                    }
              } 
            }
          )
       
    }, [])
    const getPayrollList = ( id = 0) => {
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
            `${Api.generatedList}?${queryString}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray = [...body.data]
                        body.data.forEach((d: any, i: any) => {
                            d.isCheck = false
                        });
                        setEmployee(tempArray)
                    }
                }
            }
        )
    }
    // const sendEmailIndividual = () => {
    //     const valuesObj: any = { ...props.emailData }
    //     let userIds: any = []
    //     const tempArray: any = [ ...employee]
    //     tempArray.forEach((data: any, index: any) => {
    //         if (data.isCheck) {
    //             userIds.push(data.userAccountId)

    //             console.log(userIds)
    //         }
    //     });

    //     valuesObj.id = userIds
    //     RequestAPI.getRequest(
    //         `${Api.sendIndividual}?id=${valuesObj.id}`,
    //         "",
    //         valuesObj,
    //         {},
    //         async (res: any) => {
    //             const { status, body = { data: {}, error: {} } }: any = res
    //             if (status === 200 && body) {
    //                 if (body.error && body.error.message) {
    //                 } else {
                     
    //                 }
    //             }
    //         }
    //     )


    // }

    const sendEmailIndividual = async () => {
        const valuesObj: any = { ...props.emailData };
        let payslipIds: any = [];
       
        const tempArray: any = [...employee]
        tempArray.forEach((data: any, index: any) => {
            if (data.isCheck) {
                payslipIds.push(data.id)
            }
        });
        valuesObj.ids = payslipIds;

        console.log(valuesObj.ids)

        const payload = {
            "ids" : valuesObj.ids
        }
        
        const loadingSwal = Swal.fire({
            title: '',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        RequestAPI.postRequest(
            `${Api.sendIndividual}`,
            "",
            payload,
            {},
            async(res) => {
              const { status, body = { data: {}, error: {} } }: any = res;
              console.log(valuesObj.ids)
              if (status === 200 && body) {
                if (body.error && body.error.message) {
                    Swal.fire('Error', 
                        body.error.message, 
                        'error'
                        );
                } else {
                    Swal.fire(
                        'Success', 
                        'Email sent successfully!', 
                        'success'
                        );
                    handleModalHide()
                   
                }
              }
            }
          );    
      };
      
 

    const handleModalHide = useCallback(() => {
        setModalShow(false);  
        const updatedEmployee = employee.map((item) => ({ ...item, isCheck: false }));
        setEmployee(updatedEmployee);
      }, []);
    const [values, setValues] = useState({
    userId: [] // Initialize with an empty array
    });
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const onChangeCheckbox = (index: any, boolCheck: any) => {
        const valuesObj: any = [...employee]
        valuesObj[index].isCheck = boolCheck
        setEmployee([...valuesObj])
    }
    const selectAllEmployees = (boolCheck: any) => {
        const valuesObj: any = [...employee]
        valuesObj.forEach((data: any, index: any) => {
            data.isCheck = boolCheck
        });
        setEmployee([...valuesObj])
    }
    const makeFilterData = (event: any) => {
        const { name, value } = event.target
            const filterObj: any = { ...filterData }
            filterObj[name] = name && value !== "Select" ? value : ""
            setFilterData(filterObj)
    }
    const handlePageClick = (event: any) => {
        getAllEmployee(event.selected)
      };
    

    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
              <div>
                <div className="w-100 pt-2">
                    <div className="fieldtext d-flex col-md-6">
                        <div className="input-container">
                        <label> Month </label>
                        <select 
                            name="payrollMonth" 
                            id="type"
                            onChange={(e) => makeFilterData(e)}
                            className="formControl"
                            >
                                <option value="" disabled selected>
                                    Month
                                </option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                            </div>
                        <div className="input-container">
                            <label>Year</label>
                            <input
                                name="payrollYear"
                                // placeholder="Amount"
                                type="number"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                onChange={(e) => makeFilterData(e)}
                            />
                        </div>
                        <div className="input-container">
                        <label> Status </label>
                        <select 
                            name="status" 
                            id="type"
                            onChange={(e) => makeFilterData(e)}
                            className="formControl"
                            >
                                <option value="" disabled selected>
                                    Status
                                </option>
                                <option value="completed">Completed</option>
                                <option value="incomplete">Incomplete</option>
                            </select>
                        </div>
                        <Button
                        style={{ width: 210 }}
                        onClick={() => getAllPayroll(0)}
                        className="btn btn-primary mx-2 mt-4">
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
        <div className="d-flex justify-content-end">
          <div className="">
            <ReactPaginate
              className="d-flex justify-content-center align-items-center"
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={(payrollList && payrollList.totalPages) || 0}
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
            <div className="px-3 h-[60vh] overflow-auto">
            <div className="w-100 pt-2 row">
                <div className="col-md-6">
                    <label> Payroll List</label>
                    <select 
                        className="form-select"
                        name="id"
                        id="type"
                        autoComplete="off"
                        onChange={(e) => makeFilterData(e)}
                    >
                        <option value="" disabled selected>
                            Select Payroll
                        </option>
                        {payroll && payroll.length &&
                        payroll.map((item: any, index: string) => (
                            <option value={item.id} key={`${index}_${item.id}`}>
                            {getMonthName(item.label1)}, {item.label2} From: {item.label3} - To: { item.label4 }
                            </option>
                        ))}

                    </select>
                </div>
                <div className="col-md-2 pt-4">
                <Button
                        style={{ width: 210 }}
                        onClick={() => getPayrollList()}
                        className="btn btn-primary mx-2">
                        Search
                        </Button>
                </div>
               
            </div>
                <Table>
                    <thead>
                        <tr>
                            <th style={{ width: 10 }}>
                                <Form.Check
                                    type="checkbox"
                                    id="Select All"
                                    label="Select All"
                                    onChange={(e) => {
                                        selectAllEmployees(e.target.checked)
                                    }}
                                />
                            </th>
                            <th>Employee Payroll ID</th>
                            <th>Employee Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employee &&
                                employee.length > 0 ?
                                <>
                                    {
                                        employee.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            label=""
                                                            checked={item.isCheck}
                                                            onChange={(e) => {
                                                                onChangeCheckbox(index, e.target.checked)
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{item.id}</td>
                                                    <td>{item.employeeName}</td>
                                                </tr>
                                            )
                                        })
                                    }

                                </>
                                :
                                null
                        }
                    </tbody>

                </Table>
                {
                    employee &&
                        employee.length == 0 ?
                        <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                }

              
            </div>
            <div className="d-flex justify-content-end">
                <Button
                style={{ width: 210 }}
                onClick={() => {
                    sendEmailIndividual()
                }}
                className="btn btn-primary mx-2">
                Send
                </Button>
            </div>
            
            </Modal.Body>
            </Modal>

        </>} />

    )
}

