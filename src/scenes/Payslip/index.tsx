import React, { useCallback, useState, useEffect, useRef } from "react";

import { Tabs, Tab, Button, Modal,Table, Form } from "react-bootstrap"
import Sent from './sent'
import Unsent from './unsent'
import ContainerWrapper from "../../components/ContainerWrapper"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import { Api, RequestAPI } from "../../api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { async } from "validate.js";
import { Utility } from '../../utils'



export const Payslip = (props: any) => {
    const [payroll, setPayroll] = useState<any>([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [ payrollList, setPayrollList ] = useState<any>([]);
    const selectRef = useRef(null);
    const [showButtonMonth, setShowButtonMonth] = useState(false);
    const [showButtonYear, setShowButtonYear] = useState(false);
    const [showButtonStatus, setShowButtonStatus] = useState(false);
    const [payrollMonth, setPayrollMonth] = useState("");
    const [payrollYear, setPayrollYear] = useState("");
    const [status, setStatus] = useState("");
    const [ exportModal, setExportModal] = useState(false)
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [payrollId, setPayrollId] = useState("");
    const [userId, setUserId] = useState("");
    const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);




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

    const handleModalHide = useCallback(() => {
        setModalShow(false);  
        const updatedEmployee = employee.map((item) => ({ ...item, isCheck: false }));
        setEmployee(updatedEmployee);
      }, []);
    
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
    const onChangeCheckbox = (index: any, boolCheck: any) => {
        const valuesObj: any = [...employee]
        valuesObj[index].isCheck = boolCheck
        setEmployee([...valuesObj])
        setIsAnyCheckboxChecked(valuesObj.some((item) => item.isCheck));
    }

    const selectAllEmployees = (boolCheck: any) => {
        const valuesObj: any = [...employee]
        valuesObj.forEach((data: any, index: any) => {
            data.isCheck = boolCheck
        });
        setEmployee([...valuesObj])
    }

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
            `${Api.payrollPayListAll}?size=10&page=${pageNo}${queryString}&sortDir=desc`,
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
    const getAllPayrollLists = () => {
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

    }
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

    const exportPayslip = (payrollId: any, userId: any, accessToken: any) => {
        console.log("payrollId:", payrollId);
        console.log("userId:", userId);

        setIsSubmit(true);

        const url = `${Api.exportPayslip}?payrollId=${payrollId}&userId=${userId}`;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken ? accessToken : Utility.getUserToken() || ""}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exportedPayslip.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setIsSubmit(false);
        })
        .catch((error) => {
            setIsSubmit(false);
        });
    };

    useEffect(() => {
        getAllPayroll(0)
        getAllPayrollLists()
    }, [])
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

    }
    const resetYear = () => {
    setPayrollYear("");
    const selectElement = document.getElementById("year");
        if (selectElement) {
        selectElement.selectedIndex = 0;
        }
        setShowButtonYear(false);

    }
    const resetStatus = () => {
    setStatus("");
    const selectElement = document.getElementById("status");
        if (selectElement) {
        selectElement.selectedIndex = 0;
        }
        setShowButtonStatus(false);

    }
    const setFieldValue = (fieldName, fieldValue) => {
      
        switch (fieldName) {
          case "userId":
            setUserId(fieldValue);
            break;
          default:
            break;
        }
      };
 

    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
                <div className="w-100 pt-2">
                    <Tabs defaultActiveKey="tab1" id="my-tabs">
                        <Tab id="payslip_sent_tab" eventKey="tab1" title="Sent">
                            <Sent />
                        </Tab>
                        <Tab id="payslip_unsent_tab" eventKey="tab2" title="Unsent">
                            <Unsent/>
                        </Tab>
                    </Tabs>
                    
                </div>
                <div className="d-flex justify-content-end mt-3" >
                    <div>
                        <Button className="mx-2"
                            id="payslip_exportpayslip_btn"
                            onClick={() => {
                            setExportModal(true)
                            }}
                        >Export Payslip</Button>
                        <Button
                            id="payslip_emailpayslip_btn"
                            className="mx-2"
                            onClick={() => {
                            setModalShow(true)
                            }}>Email Payslip</Button>
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
                    <div className="col-md-3">
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
                    <div className="input-container col-md-3">
                        <label>Employee Name</label>
                            <EmployeeDropdown
                                id="payslip_employeename_modaldropdown"
                                placeholder={"Employee"}
                                singleChangeOption={singleChangeOption}
                                name="userId"
                                value={filterData && filterData['userId']}
                                withEmployeeID={true}
                                />
                    </div>
                    <div className="col-md-2 pt-4">
                        <Button
                            id="payslip_search_modalbtn"
                            style={{ width: 100 }}
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
                                                                id="payslip_check_formdata"
                                                                type="checkbox"
                                                                label=""
                                                                checked={item.isCheck}
                                                                onChange={(e) => {
                                                                    onChangeCheckbox(index, e.target.checked)
                                                                }}
                                                            />
                                                        </td>
                                                        <td id="payslip_id_formdata">{item.id}</td>
                                                        <td id="payslip_employeename_formdata">{item.employeeName}</td>
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
                    id="payslip_send_formbtn"
                    style={{ width: 210 }}
                    onClick={() => {
                        sendEmailIndividual()
                    }}
                    className="btn btn-primary mx-2"
                    disabled={!isAnyCheckboxChecked}
                    >
                    Send
                    </Button>
                </div>
                
                </Modal.Body>
            </Modal>
            <Modal
                show={exportModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setExportModal(false)}
                dialogClassName="modal-90w"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Export Paylist
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <div className="px-3 h-400 overflow-auto">
                        <div className="w-100 pt-2 pl-5 row">
                            <div className="col-md-6">
                                <label> Payroll List</label>
                                    <select 
                                        className="form-select"
                                        name="payrollId"
                                        id="type"
                                        autoComplete="off"
                                        onChange={(e) => setPayrollId(e.target.value)}
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
                            <div className="col-md-6">
                                    <label>Employee Name *</label>
                                    <select
                                        className="form-select"
                                        value={userId}
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
                                    </select>
                                    </div> 
                            <div className="pt-4 col-md-12 d-flex justify-content-center">
                                <Button
                                    style={{ width: 300 }}
                                    onClick={() => exportPayslip(payrollId, userId)}
                                    className="btn btn-primary mx-2">
                                    Export
                                </Button>
                            </div>
                           
                        </div>
                    </div>
                </Modal.Body>


              </Modal>

        

        </>} />        
    )
}