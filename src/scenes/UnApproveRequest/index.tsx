import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { Formik } from "formik"
import moment from "moment"
import { Button, Form, Modal } from "react-bootstrap"
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import * as Yup from "yup"
import { Api, RequestAPI } from "../../api"
import { eye, action_approve, action_cancel, action_decline, action_edit } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import TimeDate from "../../components/TimeDate"
const ErrorSwal = withReactContent(Swal)

export const UnApproveRequest = (props: any) => {
    const { history } = props
    let initialPayload = {
        "dateFrom": "",
        "dateTo": "",
        "status": "PENDING",
        "reason": "",
        "breakdown": []
    }
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [key, setKey] = React.useState('leaves');
    const [allAdjustments, setAllAdjustments] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const userData = useSelector((state: any) => state.rootReducer.userData)

    const formRef: any = useRef()


    function Leaves(props: any) {
        const [allLeaves, setAllLeaves] = useState<any>([]);

        useEffect(() => {
            getAllLeaves(0, "Pending")
        }, [])

        const handlePageClick = (event: any) => {
            getAllLeaves(event.selected, "Pending")
        };

        const getAllLeaves = (page: any = 0, status: any = "Pending") => {
            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (status != "") {
                queryString = "&status=" + status
            } else {
                if (filterDataTemp) {
                    Object.keys(filterDataTemp).forEach((d: any) => {
                        if (filterDataTemp[d]) {

                            queryString += `&${d}=${filterDataTemp[d]}`
                        } else {
                            queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                        }
                    })
                }
            }

            if (data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.allRequestLeave}?size=10${queryString}&page=${page}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setAllLeaves(body.data)
                            }
                        }
                    }
                )
            } else {
                RequestAPI.getRequest(
                    `${Api.allMyRequestLeave}?size=10${queryString}&page=${page}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setAllLeaves(body.data)
                            }
                        }
                    }
                )
            }
        }

        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            {
                                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Type</th>
                            <th style={{ width: 'auto' }}>Date From</th>
                            <th style={{ width: 'auto' }}>Date To</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allLeaves &&
                                allLeaves.content &&
                                allLeaves.content.length > 0 ?
                                <>
                                    {
                                        allLeaves.content.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    {
                                                        data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                            <>
                                                                <td> {item.lastName}, {item.firstName} </td>
                                                            </> : null
                                                    }

                                                    <td> {item.type} </td>
                                                    <td> {item.dateFrom} </td>
                                                    <td> {item.dateTo} </td>
                                                    <td> {item.reason} </td>
                                                    <td> {item.status} </td>
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
                    allLeaves &&
                        allLeaves.content &&
                        allLeaves.content.length == 0 ?
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
                            pageCount={(allLeaves && allLeaves.totalPages) || 0}
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
            </div>);
    }

    function AttendanceReversal(props: any) {
        const [allCOA, setAllCOA] = useState<any>([]);

        useEffect(() => {
            getAllCOARequest(0, "Pending")
        }, [])

        const handlePageClick = (event: any) => {
            getAllCOARequest(event.selected, "Pending")
        };

        const getAllCOARequest = (page: any = 0, status: any = "Pending") => {
            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (status != "") {
                queryString = "&status=" + status
            } else {
                if (filterDataTemp) {
                    Object.keys(filterDataTemp).forEach((d: any) => {
                        if (filterDataTemp[d]) {

                            queryString += `&${d}=${filterDataTemp[d]}`
                        } else {
                            queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                        }
                    })
                }
            }

            if (data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.getAllCOA}?size=10${queryString}&page=${page}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setAllCOA(body.data)
                            }
                        }
                    }
                )
            } else {
                RequestAPI.getRequest(
                    `${Api.allMyCOA}?size=10${queryString}&page=${page}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setAllCOA(body.data)
                            }
                        }
                    }
                )
            }
        }

        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            {
                                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Type</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allCOA &&
                            allCOA.content &&
                            allCOA.content.length > 0 &&
                            allCOA.content.map((item: any, index: any) => {
                                return (
                                    <tr>
                                        {
                                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                <>
                                                    <td> {item.lastName}, {item.firstName} </td>
                                                </> : null
                                        }
                                        <td>{item.type}</td>
                                        <td> {item.reason} </td>
                                        <td> {item.status} </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                {
                    allCOA &&
                        allCOA.content &&
                        allCOA.content.length == 0 ?
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
                            pageCount={(allCOA && allCOA.totalPages) || 0}
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
            </div>);
    }

    function Overtime(props: any) {
        const [myot, setMyOT] = useState<any>([]);

        useEffect(() => {
            getMyOT(0, "Pending")
        }, [])

        const handlePageClick = (event: any) => {
            getMyOT(event.selected, "Pending")
        };

        const getMyOT = (page: any = 0, status: any = "Pending") => {

            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (status != "") {
                queryString = "&status=" + status
            } else {
                if (filterDataTemp) {
                    Object.keys(filterDataTemp).forEach((d: any) => {
                        if (filterDataTemp[d]) {

                            queryString += `&${d}=${filterDataTemp[d]}`
                        } else {
                            queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                        }
                    })
                }
            }
            if (data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.allOvertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setMyOT(body.data)
                            }
                        }
                    }
                )
            } else {
                RequestAPI.getRequest(
                    `${Api.myOT}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setMyOT(body.data)
                            }
                        }
                    }
                )
            }

        }

        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            {data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <th style={{ width: 'auto' }}>Employee Name</th> :
                                null
                            }
                            <th style={{ width: 'auto' }}>Shift Date</th>
                            <th style={{ width: 'auto' }}>Classification</th>
                            <th style={{ width: 'auto' }}>OT Start</th>
                            <th style={{ width: 'auto' }}>OT End</th>
                            <th style={{ width: 'auto' }}>File Date</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myot &&
                            myot.content &&
                            myot.content.length > 0 &&
                            myot.content.map((item: any, index: any) => {
                                return (
                                    <tr>
                                        {/* <td> {item.lastName}, {item.firstName}</td> */}
                                        {data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                            <td>{item.lastName}, {item.firstName}</td> :
                                            null
                                        }
                                        <td> {item.shiftDate} </td>
                                        <td> {item.classification} </td>
                                        <td> {item.otStart.replace('T', ' ')} </td>
                                        <td> {item.otEnd.replace('T', ' ')} </td>
                                        <td> {item.fileDate} </td>
                                        <td> {item.reason} </td>
                                        <td> {item.status} </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                {
                    myot &&
                        myot.content &&
                        myot.content.length == 0 ?
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
                            pageCount={(myot && myot.totalPages) || 0}
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
            </div>);
    }

    function Undertime(props: any) {
        const [myut, setMyUT] = useState<any>([]);

        useEffect(() => {
            getMyUT(0, "Pending")
        }, [])

        const handlePageClick = (event: any) => {
            getMyUT(event.selected, "Pending")
        };

        const getMyUT = (page: any = 0, status: any = "Pending") => {

            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (status != "") {
                queryString = "&status=" + status
            } else {
                if (filterDataTemp) {
                    Object.keys(filterDataTemp).forEach((d: any) => {
                        if (filterDataTemp[d]) {

                            queryString += `&${d}=${filterDataTemp[d]}`
                        } else {
                            queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                        }
                    })
                }
            }
            if (data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.allUndertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setMyUT(body.data)
                            }
                        }
                    }
                )
            } else {
                RequestAPI.getRequest(
                    `${Api.myUT}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setMyUT(body.data)
                            }
                        }
                    }
                )
            }
        }

        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            {
                                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Shift Date</th>
                            <th style={{ width: 'auto' }}>UT Start</th>
                            <th style={{ width: 'auto' }}>UT End</th>
                            <th style={{ width: 'auto' }}>Date Filed</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myut &&
                            myut.content &&
                            myut.content.length > 0 &&
                            myut.content.map((item: any, index: any) => {
                                return (
                                    <tr>
                                        {
                                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                <>
                                                    <td> {item.lastName}, {item.firstName} </td>
                                                </> : null
                                        }
                                        <td> {item.shiftDate} </td>
                                        <td> {item.utStart.replace('T', ' ')} </td>
                                        <td> {item.utEnd.replace('T', ' ')} </td>
                                        <td> {item.fileDate} </td>
                                        <td> {item.reason} </td>
                                        <td> {item.status} </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                {
                    myut &&
                        myut.content &&
                        myut.content.length == 0 ?
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
                            pageCount={(myut && myut.totalPages) || 0}
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
            </div>);
    }

    function ScheduleAdjustment(props: any) {
        const [allAdjustments, setAllAdjustments] = useState<any>([]);

        useEffect(() => {
            getAllAdjustments(0, "Pending")
        }, [])

        const handlePageClick = (event: any) => {
            getAllAdjustments(event.selected, "Pending")
        };

        const getAllAdjustments = (page: any = 0, status: any = "All") => {
            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (status != "") {
                queryString = "&status=" + status
            } else {
                if (filterDataTemp) {
                    Object.keys(filterDataTemp).forEach((d: any) => {
                        if (filterDataTemp[d]) {

                            queryString += `&${d}=${filterDataTemp[d]}`
                        } else {
                            queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                        }
                    })
                }
            }

            if (data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.allScheduleAdjustment}?size=10${queryString}&page=${page}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setAllAdjustments(body.data)
                            }
                        }
                    }
                )
            } else {
                RequestAPI.getRequest(
                    `${Api.myScheduleAdjustment}?size=10${queryString}&page=${page}`,
                    "",
                    {},
                    {},
                    async (res: any) => {
                        const { status, body = { data: {}, error: {} } }: any = res
                        if (status === 200 && body) {
                            if (body.error && body.error.message) {
                            } else {
                                setAllAdjustments(body.data)
                            }
                        }
                    }
                )
            }
        }

        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            {
                                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Date From</th>
                            <th style={{ width: 'auto' }}>Date To</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allAdjustments &&
                                allAdjustments.content &&
                                allAdjustments.content.length > 0 ?
                                <>
                                    {
                                        allAdjustments.content.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    {
                                                        data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                            <>
                                                                <td> {item.lastName}, {item.firstName} </td>
                                                            </> : null
                                                    }
                                                    <td> {item.dateFrom} </td>
                                                    <td> {item.dateTo} </td>
                                                    <td> {item.reason} </td>
                                                    <td> {item.status} </td>
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
                    allAdjustments &&
                        allAdjustments.content &&
                        allAdjustments.content.length == 0 ?
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
                            pageCount={(allAdjustments && allAdjustments.totalPages) || 0}
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
            </div>);
    }

    const adjustmentTable = useCallback(() => {
        return (
            <label htmlFor="">test</label>
        )
    }, [allAdjustments])


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
                                    <h2>Good Day, {userData.data.profile.firstName}!</h2>

                                    <br />
                                    <br />
                                    <h2><b>Unapproved Requests</b></h2>
                                    <br />
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                <div className="w-100 pt-2">
                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={key}
                                        onSelect={(k: any) => {
                                            setKey(k)
                                        }}
                                        className="mb-3"
                                    >
                                        <Tab eventKey="leaves" title="Leaves">
                                            <Leaves />
                                        </Tab>
                                        <Tab eventKey="attendance reversal" title="Attendance Reversal">
                                            <AttendanceReversal />
                                        </Tab>
                                        <Tab eventKey="overtime" title="Overtime" >
                                            <Overtime />
                                        </Tab>
                                        <Tab eventKey="undertime" title="Undertime">
                                            <Undertime />
                                        </Tab>
                                        <Tab eventKey="schedule adjustment" title="Schedule Adjustment">
                                            <ScheduleAdjustment />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
