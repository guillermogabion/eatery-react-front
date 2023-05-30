import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import moment from "moment"
import { Button, Modal } from "react-bootstrap"
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


const ErrorSwal = withReactContent(Swal)



export const Payroll = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [filterData, setFilterData] = React.useState([]);
    const { history } = props
    const [ payrollList, setPayrollList] = React.useState([]);
    const [ adjustmentTypes, setAdjustmentTypes ] = React.useState<any>([]);

    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'Adjustment Name',
        'Payroll Period',
        'Action',
    ];

    const getAllPayrollList = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.getAllPayrollList}?size=10&page${pageNo}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                if (body.data.content) {
                    setPayrollList(body.data)
                }
                } else {

                }
            }
       
        )
    }
    useEffect(() => {
        getAllPayrollList(0)

        RequestAPI.getRequest(
            `${Api.getAdjustmentType}`,
            "",
            {},
            {},
            async (res:any) => {
                const { status , body = { data: {}, error: {}}} : any = res
                if (status === 200 && body && body.data) {
                    setAdjustmentTypes(body.data)
                }else {
                }
            }
        )
    }, [])

    const handlePageClick = (event: any) => {
        getAllPayrollList(event.selected)
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
    const [values, setValues] = useState({
        type: ''
      });
      const setFieldValue = (e) => {
        setValues({ ...values, type: e.target.value });
      };
      const setFormField = (e: any, setFieldValue: any) => {
        if (setFieldValue) {
          const { name, value } = e.target
          setFieldValue(name, value)
          setFieldValue("formoutside", true)
        }
      }

  
    return (
        <div className="body">
            <div className="wraper">
                <div className="w-100">
                    <div className="topHeader">
                        <UserTopMenu />
                    </div>
                    <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh' }}>
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
                                <h3>Adjustments</h3>

                                <div className="w-100 pt-4">
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
                                        <div className="input-container" >
                                            <select
                                            placeholder="Adjustment Name"
                                            className="form-select"
                                            name="type"
                                            id="type"
                                            value={values.type}
                                            // onChange={(e) => setFormField(e, setFieldValue)}>
                                            onChange={(e) => {
                                                setFormField(e, setFieldValue);
                                            
                                            }}
                                            >
                                             {adjustmentTypes.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                                ))}
                                            </select>
                                        </div>
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
                                        onClick={() => getAllPayrollList(0)}
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
                                            payrollList.content &&
                                            payrollList.content.length > 0 &&
                                            payrollList.content.map((item: any, index: any) => {

                                            return (
                                                <tr>
                                                <td> {item.userId} </td>
                                                <td> {item.employeeName} </td>
                                                <td> {item.adjustmentAmount} </td>
                                                <td> {item.adjustmentName} </td>
                                                <td>
                                                <label
                                                    onClick={() => {
                                                        // getEmployee(item.id)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                    Update
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
                                    payrollList.content &&
                                    payrollList.content.length == 0 ?
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
                                    pageCount={(payrollList && [payrollList].totalPages) || 0}
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
                        </div>
                    </div>
                </div>
            </div>
            </div>
            
            {/* Create User Modal Form */}
            {/* <Modal
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
                        onClick={() => downloadExcel(fromDate, toDate)}
                        disabled={isSubmit}>
                            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: "" } Proceed
                    </Button>
                </Modal.Footer>
            </Modal> */}
            {/* End Create User Modal Form */}
        </div>

    )
}
