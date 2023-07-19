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

export const Reimbursement = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const formRef: any = useRef()
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [detailsMenu, setDetalsMenu] = React.useState('Salary Details');
    const [lastPayInfo, setLastPayInfo] = React.useState({});

    const tableHeaders = [
        'Reimbursement',
        'Approved Budget',
        'Total Amount',
        'Date Filed',
        'Status',
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

    const getReimbursements = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.getAllReimbursement}?size=10&page=${pageNo}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        console.log(body)
                        setReimbursementList(body.data)
                    }
                }
            }
        )
    }

    const getLastPayInfo = (id: any) => {
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
        getReimbursements(0)
    }, [])


    const regenerateLastPay = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to generate last pay.",
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

                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                        } else {

                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                            )
                            getLastPay(0)
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
        })
    }

    return (
        <ContainerWrapper contents={<>
            <>
                <div className="w-100 px-5 py-5">
                    <div>
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
                                    reimbursementList &&
                                    reimbursementList.content &&
                                    reimbursementList.content.length > 0 && (
                                        reimbursementList.content.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td> {item.typeName} </td>
                                                    <td> {item.approvedBudget} </td>
                                                    <td> {item.amount} </td>
                                                    <td> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                    <td> {item.status} </td>
                                                    <td>
                                                        <label
                                                            onClick={() => {
                                                                setModalShow(true)
                                                                getLastPayInfo(item.userId)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img src={eye} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                        </label>
                                                        <label
                                                            onClick={() => {
                                                                regenerateLastPay(item.userId)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img src={regenerate} width={20} className="hover-icon-pointer mx-1" title="Update" />
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
                            reimbursementList &&
                                reimbursementList.content &&
                                reimbursementList.content.length == 0 ?
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
                            pageCount={(reimbursementList && reimbursementList.totalPages) || 0}
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
            </>
        </>} />

    )
}

