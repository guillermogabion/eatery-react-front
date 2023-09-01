import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"
import moment from "moment"
import { Button, Modal, Form, Tabs, Tab, Row, Col } from "react-bootstrap"
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
import * as Yup from "yup"
import ContainerWrapper from "../../components/ContainerWrapper"
import { regenerate, eye } from "../../assets/images"
import { Utility } from "../../utils"

const ErrorSwal = withReactContent(Swal)

export const LastPay = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const formRef: any = useRef()
    const [lastPayList, setLastPayList] = useState<any>([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [detailsMenu, setDetalsMenu] = React.useState('Salary Details');
    const [lastPayInfo, setLastPayInfo] = React.useState({});
    const [isDownloadBankTrans, setIsDownloadBankTrans] = useState<any>(false)
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = useState<any>("")

    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Separation Date',
        'Last Pay Generated',
        'Action',
    ];
    const [initialValues, setInitialValues] = useState<any>({
        "payrollMonth": "",
        "payrollYear": "",
        "from": "",
        "to": "",
        "userIds": []
    })

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const getLastPay = (pageNo: any) => {
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
            `${Api.lastPayList}?size=10&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setLastPayList(body.data)
                    }
                }
            }
        )
    }

    const getLastPayInfo = (id: any) => {
        setUserId(id)
        RequestAPI.getRequest(
            `${Api.lastPayInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        setLastPayInfo(body)
                    }
                }
            }
        )
    }

    const handlePageClick = (event: any) => {
        getLastPay(event.selected)

    };


    useEffect(() => {
        getLastPay(0)
    }, [])

    useEffect(() => {
        if (filterData) {
            getLastPay(0)
        }
    }, [filterData])

    const regenerateLastPay = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to generate last pay.",
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();
        
                if(confirmButton)
                  confirmButton.id = "lastpay_regeneratelastpayconfirm_alertbtn"
        
                if(cancelButton)
                  cancelButton.id = "lastpay_regeneratelastpaycancel_alertbtn"
              },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {

                RequestAPI.postRequest(`${Api.generateLastPay}?id=${id}`, "", {}, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {

                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "lastpay_errorconfirm_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "lastpay_successconfirm_alertbtn"
                                },
                                icon: 'success',
                            })
                            getLastPay(0)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "lastpay_errorconfirm2_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const downloadBankTransmittal = () => {
        setIsDownloadBankTrans(true)
        RequestAPI.getFileAsync(
            `${Api.lastPayBankUpload}?id=${userId}`,
            "",
            "BankUpload.txt",
            async (res: any) => {
                if (res) {
                    setIsDownloadBankTrans(false)
                }
            }
        )
    }

    const singleChangeOption = (option: any, name: any) => {

        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }

    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    return (
        <ContainerWrapper contents={<>
            <>
                <div className="w-100 px-5 py-5">
                        <div className="row d-flex mb-2">
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
                                <label>Employee</label>
                                <EmployeeDropdown
                                    id="lastpay_employee_dropdown"
                                    placeholder={"Employee"}
                                    singleChangeOption={singleChangeOption}
                                    name="userId"
                                    value={filterData && filterData['userId']}
                                    withEmployeeID={true}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
                                <label>Separation Date</label>
                                <input
                                    id="lastpay_datefrom_leavecreditsinput"
                                    name="seperationDate"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
                                <label>Last Pay Generated</label>
                                <select
                                    id="employee_gender_maindropdown"
                                    className="form-select"
                                    name="lastPayGenerated"
                                    value={filterData && filterData['lastPayGenerated']}
                                    onChange={(e) => {
                                        makeFilterData(e)
                                    }}
                                >
                                    <option value="" selected>
                                        All
                                    </option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>
                    <div>
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
                            <tbody>
                                {
                                    lastPayList &&
                                    lastPayList.content &&
                                    lastPayList.content.length > 0 && (
                                        lastPayList.content.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td id={"lastpay_employeeid_data_" + item.userId}> {item.employeeId} </td>
                                                    <td id={"lastpay_employeename_data_" + item.userId}> {item.employeeName} </td>
                                                    <td id={"lastpay_separationdate_data_" + item.userId}>  {Utility.formatDate(item.seperationDate, 'MM-DD-YYYY')} </td>
                                                    <td id={"lastpay_lastpayexist_data_" + item.userId}> {item.lastPayExist ? "Yes" : "No"} </td>
                                                    <td>
                                                        <label
                                                            id={"lastpay_view_label_" + item.userId}
                                                            onClick={() => {
                                                                setModalShow(true)
                                                                getLastPayInfo(item.userId)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img id={"lastpay_eye_img_" + item.userId} src={eye} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                        </label>
                                                        <label
                                                            id={"lastpay_regenerate_label_" + item.userId}
                                                            onClick={() => {
                                                                regenerateLastPay(item.userId)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img id={"lastpay_regenerate_img_" + item.userId} src={regenerate} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                        </label>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )
                                }
                            </tbody>
                        </Table>
                        {
                            lastPayList &&
                                lastPayList.content &&
                                lastPayList.content.length == 0 ?
                                <div className="w-100 text-center">
                                    <label htmlFor="">No Records Found</label>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-end px-4">
                    <div className="">
                        <ReactPaginate
                            className="d-flex justify-content-center align-items-center"
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={(lastPayList && lastPayList.totalPages) || 0}
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

                <Modal
                    show={modalShow}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}
                    dialogClassName="modal-90w"
                >
                    <Modal.Header className="flex text-center justify-center">
                        <Modal.Title id="contained-modal-title-vcenter" className="text-md">
                            Last Pay Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="row w-100 m-0 px-2">
                        <Row className="p-0 m-0">
                            <Col md={3} className="border-1 p-1 flex flex-column justify-start">
                                {
                                    detailsMenu == 'Salary Details' ?
                                        <Button id="lastpay_salarydetails1_btn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF]  text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Salary Details")
                                        }}>Salary Details</Button> :
                                        <Button id="lastpay_salarydetail2_btn" variant="" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Salary Details")
                                        }}>Salary Details</Button>
                                }

                                {
                                    detailsMenu == 'Employee Details' ?
                                        <Button id="lastpay_employeedetails1_btn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Employee Details")
                                        }}>Employee Details</Button> :
                                        <Button id="lastpay_employeedetails2_btn" variant="" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Employee Details")
                                        }}>Employee Details</Button>
                                }

                                {
                                    detailsMenu == 'Earnings & Deductions' ?
                                        <Button id="lastpay_earningsanddecution1_btn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Earnings & Deductions")
                                        }}>Earnings & Deductions</Button> :
                                        <Button id="lastpay_earningsanddecution2_btn" variant="" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Earnings & Deductions")
                                        }}>Earnings & Deductions</Button>
                                }

                                {
                                    detailsMenu == 'Tax Computation' ?
                                        <Button id="lastpay_taxcomputation1_btn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] text-[#189FB5] border-[#189FB5] focus:bg-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Tax Computation")
                                        }}>Tax Computation</Button> :
                                        <Button id="lastpay_taxcomputation2_btn" variant="" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF] focus:bg-[#189FB5]  text-[#189FB5] border-[#189FB5]" onClick={() => {
                                            setDetalsMenu("Tax Computation")
                                        }}>Tax Computation</Button>
                                }
                            </Col>
                            <Col md={9} className="p-1">
                                {detailsMenu == 'Salary Details' && lastPayInfo && lastPayInfo.salaryDetails ?
                                    <Table bordered className="bg-light " >
                                        <tbody className="bg-light">
                                            <tr className="bg-white">
                                                <td className="text-[#125667] font-bold text-lg px-2 py-3">Basic Salary</td>
                                                <td id="lastpay_basicsalary_sddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.salaryDetails.basicSalary, false)}</td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="text-[#125667] font-bold text-lg px-2 py-3">De Minimis</td>
                                                <td id="lastpay_deminimis_sddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.salaryDetails.deMinimis, false)}</td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="text-[#125667] font-bold text-lg px-2 py-3">Taxable Income</td>
                                                <td id="lastpay_taxableallowance_sddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.salaryDetails.taxableAllowance, false)}</td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="text-[#125667] font-bold text-lg px-2 py-3">Non-Taxable Income</td>
                                                <td id="lastpay_nontaxableallowance_sddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.salaryDetails.nonTaxableAllowance, false)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    : null}

                                {
                                    detailsMenu == 'Employee Details' && lastPayInfo && lastPayInfo.employeeDetails ?
                                        <Table bordered className="bg-light" >
                                            <tbody className="bg-light">
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Employee Name</td>
                                                    <td id="lastpay_employeename_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{lastPayInfo.employeeDetails.employeeName}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Date Covered</td>
                                                    <td id="lastpay_datecovered_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{lastPayInfo.employeeDetails.dateCovered}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Department</td>
                                                    <td id="lastpay_department_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.removeUnderscore(lastPayInfo.employeeDetails.department)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Position</td>
                                                    <td id="lastpay_position_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{lastPayInfo.employeeDetails.position}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Separation Date</td>
                                                    <td id="lastpay_separationdate_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatDate(lastPayInfo.employeeDetails.seperationDate, 'MM-DD-YYYY')}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Days Present</td>
                                                    <td id="lastpay_dayspresent_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{lastPayInfo.employeeDetails.daysPresent}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Days Per Month</td>
                                                    <td id="lastpay_dayspermonth_eddata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{lastPayInfo.employeeDetails.daysPerMonth}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        :
                                        null
                                }

                                {
                                    detailsMenu == 'Earnings & Deductions' && lastPayInfo && lastPayInfo.earningAndDeductions ?
                                        <Table bordered className="bg-light " >
                                            <tbody className="bg-light">
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">SSS</td>
                                                    <td id="lastpay_sss_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.sss, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">PHILHEALTH</td>
                                                    <td id="lastpay_philhealth_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.philHealth, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">PHILHEALTH Adjustment</td>
                                                    <td id="lastpay_philhealthadjustment_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.philHealthAdj, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">HDMF</td>
                                                    <td id="lastpay_hdmf_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.hdmf, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Unclaimed Salary</td>
                                                    <td id="lastpay_unclaimedsalary_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.unclaimedSalary, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">De Minimis</td>
                                                    <td id="lastpay_deminimis_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.deMinimis, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Taxable Allowance</td>
                                                    <td id="lastpay_taxableincome_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.taxableIncome, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Non-Taxable Allowance</td>
                                                    <td id="lastpay_nontaxableincome_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.nonTaxableIncome, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Overtime</td>
                                                    <td id="lastpay_overtime_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.overtime, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Undertime</td>
                                                    <td id="lastpay_undertime_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end"></td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Tardiness</td>
                                                    <td id="lastpay_tardiness_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.tardiness, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Absences</td>
                                                    <td id="lastpay_absences_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.absences, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">13th Month Pay</td>
                                                    <td id="lastpay_13thmonthpay_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.thirteenthMonthPay, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Tax Refund <br /> (Payable)</td>
                                                    <td id="lastpay_taxrefund_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.taxRefund, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">SSS Loan</td>
                                                    <td id="lastpay_sssloan_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.sssLoan, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#189FB5] font-bold text-lg px-2 py-3">FINAL PAY</td>
                                                    <td id="lastpay_finalpay_eanddcata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.earningAndDeductions.finalPay, false)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        :
                                        null
                                }

                                {
                                    detailsMenu == 'Tax Computation' && lastPayInfo && lastPayInfo.taxComputations ?
                                        <Table bordered className="bg-light " >
                                            <tbody className="bg-light">
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Gross Pay</td>
                                                    <td id="lastpay_grosspay_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.grossPay, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Less:</td>
                                                    <td id="lastpay_less_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end"></td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Government Remittances</td>
                                                    <td id="lastpay_governmentremittance_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.governmentRemittances, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">13th Month & Bonus not exceeding 90,000.00</td>
                                                    <td id="lastpay_13thmonthpay_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.thirteenthMonthAndBonus, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">De Minimis</td>
                                                    <td id="lastpay_deminimis_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.deMinimis, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Non-Taxable Allowance</td>
                                                    <td id="lastpay_nontaxableallowance_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.nonTaxableAllowance, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Total Non-Taxable</td>
                                                    <td id="lastpay_totalnontaxable_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.taxableAllowance, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Total Taxable Income</td>
                                                    <td id="lastpay_totaltaxable_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.taxableIncome, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Refer to Tax Table</td>
                                                    <td id="lastpay_refertotaxtbale_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.referToTaxTable, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Excess Taxable Income</td>
                                                    <td id="lastpay_excesstaxableincome_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.excessTaxableIncom, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Tax Rates</td>
                                                    <td id="lastpay_taxrates_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{lastPayInfo.taxComputations.taxRates + '%'}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Pre-Tax Due</td>
                                                    <td id="lastpay_pretaxdue_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.preTaxDue, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Fixed Tax</td>
                                                    <td id="lastpay_fixedtax_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.fixedTax, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Tax Due</td>
                                                    <td id="lastpay_taxdue_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.taxDue, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Tax Withheld</td>
                                                    <td id="lastpay_taxwithheld_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.taxWithheld, false)}</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="text-[#125667] font-bold text-lg px-2 py-3">Tax Payable (Refund)</td>
                                                    <td id="lastpay_taxpayablerefund_tcdata" className="text-[#189FB5] font-bold text-lg px-2 py-3 text-end">{Utility.formatToCurrency(lastPayInfo.taxComputations.taxPayable, false)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        :
                                        null
                                }

                            </Col>
                        </Row>
                        <Modal.Footer className="mt-5">
                            <div className="w-full flex justify-center">
                                <Button id="lastpay_close_mbtn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF]  text-[#189FB5] border-[#189FB5]" onClick={() => {
                                    setModalShow(false)
                                    setLastPayInfo({})
                                }}>Close</Button>
                                <Button id="lastpay_downloadlastpay_mbtn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF]  text-[#189FB5] border-[#189FB5]" disabled={true}>Download Last Pay</Button>
                                <Button id="lastpay_downloadbanktransmittal_mbtn" className="text-start pl-5 m-1 hover:bg-[#189FB5] hover:text-[#FFFFFF]  text-[#189FB5] border-[#189FB5]" onClick={() => {
                                    downloadBankTransmittal()
                                }}

                                    disabled={isDownloadBankTrans}>{isDownloadBankTrans ?
                                        <div className="d-flex justify-content-center">
                                            <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                            Downloading for Bank Transmittal
                                        </div>
                                        : "Download for Bank Transmittal"
                                    }</Button>
                            </div>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
            </>
        </>} />

    )
}

