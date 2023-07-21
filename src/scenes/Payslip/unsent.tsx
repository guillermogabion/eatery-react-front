import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import { async } from "validate.js";
const ErrorSwal = withReactContent(Swal)


const unsent = (props : any ) => {
    const [employee, setEmployee] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [ failedPayslipList, setFailedPayslipList ] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});
    const selectRef = useRef(null);
    const [showButtonMonth, setShowButtonMonth] = useState(false);
    const [showButtonYear, setShowButtonYear] = useState(false);
    const [showButtonStatus, setShowButtonStatus] = useState(false);
    const [payrollMonth, setPayrollMonth] = useState("");
    const [payrollYear, setPayrollYear] = useState("");
    const [status, setStatus] = useState("");

    const { emailData } = props
    const email = { ...emailData }

    const tableHeaders = [
        'Employee ID',
        'Employee Name',
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
        const handleInputChange = (e) => {
            const monthName = e.target.value;
            const monthNumber = monthMap[monthName];
            setPeriodMonths(monthNumber);
            };
           
            const getAllPayrollFailed = (pageNo : any ) => {
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
                    `${Api.failedEmail}?size=10&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                      const { status, body = { data: {}, error: {} } }: any = res
                      if (status === 200 && body && body.data.content) {
                        if (body.error && body.error.message) {
                        } else {
                           setFailedPayslipList(body.data)
            
                            
                        }
                      }
                    }
                  )
            }

            useEffect(() => {
       
                getAllPayrollFailed(0)
               
            }, [])

            const Resend = (id : any = 0) => {

                ErrorSwal.fire({
                    title: 'Resend Email',
                    text : "Confirm Resending Email?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, proceed!'
                }).then((result) =>{
                if (result.isConfirmed) {
                const loadingSwal = Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();   
                }
                
                });
                    RequestAPI.postRequest (
                        `${Api.resendEmail}?id=${id}`,
                        "",
                        { "id": id},
                        {},
                        async (res) =>{
                            const { status, body = { data: {}} } = res;
                            if (body.error && body.error.message) {
                                Swal.close();
                                ErrorSwal.fire(
                                    'Error!',
                                    body.error.message,
                                    'error'
                                  );

                            }else{
                                getAllPayrollFailed(0);
                                Swal.close();
                                ErrorSwal.fire(
                                    'Success!',
                                    body.data || "",
                                    'success'
                                  );

                            }
                        }
                    )
                }
            });
        }

            

           
            const [values, setValues] = useState({
            userId: []
            });
            const [selectedEmployees, setSelectedEmployees] = useState([]);
           
           
            const makeFilterData = (event: any) => {
                const { name, value } = event.target
                    const filterObj: any = { ...filterData }
                    filterObj[name] = name && value !== "Select" ? value : ""
                    setFilterData(filterObj)
            }
            const handlePageClick = (event: any) => {
                getAllPayrollFailed(event.selected)
            };
            const resetMonth = () => {
            setPayrollMonth("");
            const selectElement = document.getElementById("month1");
                if (selectElement) {
                selectElement.selectedIndex = 0;
                }
                setShowButtonMonth(false);
                setFilterData(prevFilterData => {
                    const filterObj = { ...prevFilterData };
                    delete filterObj.payrollMonth;
                    return filterObj;
                  });
    
            }
            const resetYear = () => {
            setPayrollYear("");
            const selectElement = document.getElementById("year1");
                if (selectElement) {
                selectElement.selectedIndex = 0;
                }
                setShowButtonYear(false);
                setFilterData(prevFilterData => {
                    const filterObj = { ...prevFilterData };
                    delete filterObj.payrollYear;
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
            const singleChangeOption = (option: any, name: any) => {
                const filterObj: any = { ...filterData }
                filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
                setFilterData(filterObj)
            }

            return (
                
                      <div>
                        <div className="w-100 pt-2">
                            <div className="fieldtext d-flex ">
                                <div className="input-container col-md-2">
                                    <label>Employee Name</label>
                                        <EmployeeDropdown
                                            placeholder={"Employee"}
                                            singleChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                            withEmployeeID={true}
                                            />
                                </div>
                                <div className="input-container clearable-select col-md-2">
                                <label> Month </label>
                                <select 
                                    name="payrollMonth" 
                                    id="month1"
                                    onChange={(e) => { makeFilterData(e)
                                        setShowButtonMonth(e.target.value !== 'default')
                                    }}
                                    className="formControl"
                                    ref={selectRef}
                                    >
                                        <option value="default" disabled selected>
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
                                    {showButtonMonth && (
                                        <span className="clear-icon" style={{paddingTop: '10%'}} onClick={resetMonth}>
                                        X
                                        </span>
                                    )}
                                    </div>
                                <div className="input-container clearable-select col-md-2">
                                <label>Year</label>
                                    <select
                                        className={`form-select`}
                                        name="payrollYear"
                                        id="year1"
                                        onChange={(e) => {makeFilterData(e)
                                            setShowButtonYear(e.target.value !== 'default')
                                            
                                        }}
                                        ref={selectRef}
                                        >
                                        <option key={`defaultYear`} value="default" selected disabled>
                                            Select Year
                                        </option>
                                        {
                                            Utility.getYears().map((item: any, index: string) => {
                                                return (
                                                    <option key={`${index}_${item.year}`} value={item.year}>
                                                        {item.year}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {showButtonYear && (
                                        <span className="clear-icon" style={{paddingTop: '10%', paddingRight: '5%'}} onClick={resetYear}>
                                        X
                                        </span>
                                    )}
                                </div>
                                
                               
                                <Button
                                style={{ width: 100 }}
                                onClick={() => getAllPayrollFailed(0)}
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
                            failedPayslipList &&
                            failedPayslipList.content &&
                            failedPayslipList.content.length > 0 &&
                            failedPayslipList.content.map((item: any, index: any) => {
        
                            return (
                                <tr>
                                <td>{ item.employeeId }</td>
                                <td>{ item.employeeName }</td>
                                <td> {getMonthName(item.payrollPeriod.split(" ")[0])} {item.payrollPeriod.split(" ")[1]} </td>
                                {/* <td> {item.isGenerated == true ? 'Completed' : 'Incomplete' } </td> */}
                                <td>
                                <label
                                onClick={() => {
                                    Resend(item.id)
                                }}
                                className="text-muted cursor-pointer">
                                Resend
                                </label>
                               
                                </td>
                            
                                </tr>
                            )
                            })
                        }
                        </tbody>
                        </Table>
                        {/* {
                            payrollList &&
                            payrollList.length == 0 ?
                            <div className="w-100 text-center">
                                <label htmlFor="">No Records Found</label>
                            </div>
                            :
                            null
                        }
         */}
                
                        <div className="d-flex justify-content-end">
                        <div className="">
                            <ReactPaginate
                            className="d-flex justify-content-center align-items-center"
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={(failedPayslipList && failedPayslipList.totalPages) || 0}
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
        
            )
}
export default unsent;