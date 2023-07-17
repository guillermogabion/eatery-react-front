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
const ErrorSwal = withReactContent(Swal)


const sent = (props : any ) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [payroll, setPayroll] = useState<any>([]);
    const [periodMonths, setPeriodMonths] = useState<any>([]);
    const [ payrollList, setPayrollList ] = useState<any>([]);
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
                        }
                      }
                    }
                  )
            }

            useEffect(() => {
                getAllPayroll(0)
            }, [])

           
            const handleModalHide = useCallback(() => {
                setModalShow(false);  
                const updatedEmployee = employee.map((item) => ({ ...item, isCheck: false }));
                setEmployee(updatedEmployee);
              }, []);
            const [values, setValues] = useState({
            userId: []
            });
          
            const makeFilterData = (event: any) => {
                const { name, value } = event.target
                    const filterObj: any = { ...filterData }
                    filterObj[name] = name && value !== "Select" ? value : ""
                    setFilterData(filterObj)
            }
            const handlePageClick = (event: any) => {
                getAllPayroll(event.selected)
            };
            const resetMonth = () => {
            setPayrollMonth("");
            const selectElement = document.getElementById("month");
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
            const selectElement = document.getElementById("year");
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
            const selectElement = document.getElementById("status");
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
                                <div className="input-container clearable-select col-md-2">
                                <label> Month </label>
                                <select 
                                    name="payrollMonth" 
                                    id="month"
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
                                        id="year"
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
                                <div className="input-container clearable-select col-md-2">
                                <label> Status </label>
                                <select 
                                    name="status" 
                                    id="status"
                                    onChange={(e) => { makeFilterData(e)
                                        setShowButtonStatus(e.target.value !== 'default')
                                    }}
                                    className="formControl"
                                    >
                                        <option value="default" disabled selected>
                                            Status
                                        </option>
                                        <option value="completed">Completed</option>
                                        <option value="incomplete">Incomplete</option>
                                    </select>
                                    {showButtonStatus && (
                                        <span className="clear-icon" style={{paddingTop: '10%', paddingRight: '5%'}} onClick={resetStatus}>
                                        X
                                        </span>
                                    )}
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
                </div>
                </div>
        
            )
}
export default sent;