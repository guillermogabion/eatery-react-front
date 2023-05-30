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
import ContentWrapper from "../../components/ContentWrapper"
import ContainerWrapper from "../../components/ContainerWrapper"
import SingleSelect from "../../components/Forms/SingleSelect"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)

export const AllRequest = (props: any) => {
    const { history } = props
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [key, setKey] = React.useState('leaves');
    const [allAdjustments, setAllAdjustments] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [employeeList, setEmployeeList] = useState<any>([])
    const [statusList, setStatusList] = useState<any>([
        'all',
        'pending',
        'approved',
        'declined'
    ])

    const formRef: any = useRef()

    function Leaves(props: any) {
        const [allLeaves, setAllLeaves] = useState<any>([]);

        useEffect(() => {
            getAllLeaves(0, "all")
        }, [])

        const handlePageClick = (event: any) => {
            getAllLeaves(event.selected, "all")
        };

        const getAllLeaves = (page: any = 0, status: any = "all") => {
            let queryString = ""
            let filterDataTemp = { ...filterData }

            if (!filterDataTemp.status) {
                queryString = "&status=" + status
            }

            if (filterDataTemp) {
                Object.keys(filterDataTemp).forEach((d: any) => {
                    if (filterDataTemp[d]) {
                        queryString += `&${d}=${filterDataTemp[d]}`
                    } else {
                        queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                    }
                })
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

        return (
            <div>
                <div className="w-100">
                    <div className="fieldtext d-flex col-md-12">
                        {
                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            type="string"
                                            options={employeeList || []}
                                            placeholder={"Employee"}
                                            onChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                        />
                                    </div>
                                </>
                                :
                                null
                        }

                        <div>
                            <label className="ml-[5px]">Date From</label>
                            <input
                                name="dateFrom"
                                type="date"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                value={filterData["dateFrom"]}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>

                        <div>
                            <label className="ml-[10px]">Date To</label>
                            <div className="input-container">
                                <input
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    value={filterData["dateTo"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ml-[10px]">Status</label>
                            <div className="input-container">
                                <select
                                    className={`form-select`}
                                    name="status"
                                    id="status"
                                    value={filterData["status"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {statusList &&
                                        statusList.length &&
                                        statusList.map((item: any, index: string) => (
                                            <option key={`${index}_${item}`} value={item}>
                                                {Utility.capitalizeFirstLetter(item)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <Table responsive>
                    <thead>
                        <tr>
                            {
                                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th>Employee Name</th>
                                    </> : null
                            }
                            <th>Type</th>
                            <th>Date From</th>
                            <th>Date To</th>
                            <th>Reason</th>
                            <th>Status</th>
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
                                                    <td> { Utility.removeUnderscore(item.status) } </td>
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
                <br />
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
            getAllCOARequest(0, "all")
        }, [])

        const handlePageClick = (event: any) => {
            getAllCOARequest(event.selected, "all")
        };

        const getAllCOARequest = (page: any = 0, status: any = "all") => {
            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (!filterDataTemp.status) {
                queryString = "&status=" + status
            }

            if (filterDataTemp) {
                Object.keys(filterDataTemp).forEach((d: any) => {
                    if (filterDataTemp[d]) {
                        queryString += `&${d}=${filterDataTemp[d]}`
                    } else {
                        queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                    }
                })
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

        return (
            <div>
                <div className="w-100">
                    <div className="fieldtext d-flex col-md-12">
                        {
                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            type="string"
                                            options={employeeList || []}
                                            placeholder={"Employee"}
                                            onChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                        />
                                    </div>
                                </>
                                :
                                null
                        }

                        <div>
                            <label className="ml-[5px]">Date From</label>
                            <input
                                name="dateFrom"
                                type="date"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                value={filterData["dateFrom"]}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>

                        <div>
                            <label className="ml-[10px]">Date To</label>
                            <div className="input-container">
                                <input
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    value={filterData["dateTo"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ml-[10px]">Status</label>
                            <div className="input-container">
                                <select
                                    className={`form-select`}
                                    name="status"
                                    id="status"
                                    value={filterData["status"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {statusList &&
                                        statusList.length &&
                                        statusList.map((item: any, index: string) => (
                                            <option key={`${index}_${item}`} value={item}>
                                                {Utility.capitalizeFirstLetter(item)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        <td>{ Utility.removeUnderscore(item.type) }</td>
                                        <td> {item.reason} </td>
                                        <td> { Utility.removeUnderscore(item.status) } </td>
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
                <br />
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
            getMyOT(0, "all")
        }, [])

        const handlePageClick = (event: any) => {
            getMyOT(event.selected, "all")
        };

        const getMyOT = (page: any = 0, status: any = "all") => {

            let queryString = ""
            let filterDataTemp = { ...filterData }
            if (!filterDataTemp.status){
                queryString = "&status=" + status
            }

            if (filterDataTemp) {
                Object.keys(filterDataTemp).forEach((d: any) => {
                    if (filterDataTemp[d]) {
                        queryString += `&${d}=${filterDataTemp[d]}`
                    } else {
                        queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                    }
                })
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

        return (
            <div>
                <div className="w-100">
                    <div className="fieldtext d-flex col-md-12">
                        {
                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            type="string"
                                            options={employeeList || []}
                                            placeholder={"Employee"}
                                            onChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                        />
                                    </div>
                                </>
                                :
                                null
                        }

                        <div>
                            <label className="ml-[5px]">Date From</label>
                            <input
                                name="dateFrom"
                                type="date"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                value={filterData["dateFrom"]}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>

                        <div>
                            <label className="ml-[10px]">Date To</label>
                            <div className="input-container">
                                <input
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    value={filterData["dateTo"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ml-[10px]">Status</label>
                            <div className="input-container">
                                <select
                                    className={`form-select`}
                                    name="status"
                                    id="status"
                                    value={filterData["status"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {statusList &&
                                        statusList.length &&
                                        statusList.map((item: any, index: string) => (
                                            <option key={`${index}_${item}`} value={item}>
                                                {Utility.capitalizeFirstLetter(item)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        <td> { Utility.removeUnderscore(item.classification) } </td>
                                        <td> {item.otStart.replace('T', ' ')} </td>
                                        <td> {item.otEnd.replace('T', ' ')} </td>
                                        <td> {item.fileDate} </td>
                                        <td> {item.reason} </td>
                                        <td> { Utility.removeUnderscore(item.status) } </td>
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
            getMyUT(0, "all")
        }, [])

        const handlePageClick = (event: any) => {
            getMyUT(event.selected, "all")
        };

        const getMyUT = (page: any = 0, status: any = "all") => {

            let queryString = ""
            let filterDataTemp = { ...filterData }
            
            if (!filterDataTemp.status){
                queryString = "&status=" + status
            }

            if (filterDataTemp) {
                Object.keys(filterDataTemp).forEach((d: any) => {
                    if (filterDataTemp[d]) {
                        queryString += `&${d}=${filterDataTemp[d]}`
                    } else {
                        queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                    }
                })
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

        return (
            <div>
                <div className="w-100">
                    <div className="fieldtext d-flex col-md-12">
                        {
                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            type="string"
                                            options={employeeList || []}
                                            placeholder={"Employee"}
                                            onChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                        />
                                    </div>
                                </>
                                :
                                null
                        }

                        <div>
                            <label className="ml-[5px]">Date From</label>
                            <input
                                name="dateFrom"
                                type="date"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                value={filterData["dateFrom"]}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>

                        <div>
                            <label className="ml-[10px]">Date To</label>
                            <div className="input-container">
                                <input
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    value={filterData["dateTo"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ml-[10px]">Status</label>
                            <div className="input-container">
                                <select
                                    className={`form-select`}
                                    name="status"
                                    id="status"
                                    value={filterData["status"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {statusList &&
                                        statusList.length &&
                                        statusList.map((item: any, index: string) => (
                                            <option key={`${index}_${item}`} value={item}>
                                                {Utility.capitalizeFirstLetter(item)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        <td> { Utility.removeUnderscore(item.status) } </td>
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
            getAllAdjustments(0, "all")
        }, [])

        const handlePageClick = (event: any) => {
            getAllAdjustments(event.selected, "all")
        };

        const getAllAdjustments = (page: any = 0, status: any = "all") => {
            let queryString = ""
            let filterDataTemp = { ...filterData }

            if (!filterDataTemp.status){
                queryString = "&status=" + status
            }

            if (filterDataTemp) {
                Object.keys(filterDataTemp).forEach((d: any) => {
                    if (filterDataTemp[d]) {
                        queryString += `&${d}=${filterDataTemp[d]}`
                    } else {
                        queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                    }
                })
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

        return (
            <div>
                <div className="w-100">
                    <div className="fieldtext d-flex col-md-12">
                        {
                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            type="string"
                                            options={employeeList || []}
                                            placeholder={"Employee"}
                                            onChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                        />
                                    </div>
                                </>
                                :
                                null
                        }

                        <div>
                            <label className="ml-[5px]">Date From</label>
                            <input
                                name="dateFrom"
                                type="date"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                value={filterData["dateFrom"]}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>

                        <div>
                            <label className="ml-[10px]">Date To</label>
                            <div className="input-container">
                                <input
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    value={filterData["dateTo"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="ml-[10px]">Status</label>
                            <div className="input-container">
                                <select
                                    className={`form-select`}
                                    name="status"
                                    id="status"
                                    value={filterData["status"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    {statusList &&
                                        statusList.length &&
                                        statusList.map((item: any, index: string) => (
                                            <option key={`${index}_${item}`} value={item}>
                                                {Utility.capitalizeFirstLetter(item)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
                                                    <td> { Utility.removeUnderscore(item.status) } </td>
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
                <div className="d-flex justify-content-end mt-2">
                    <div className="pt-5">
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

    useEffect(() => {
        getAllEmployee()
    }, [])

    const getAllEmployee = () => {
        RequestAPI.getRequest(
            `${Api.employeeList}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.forEach((d: any, i: any) => {
                            tempArray.push({
                                value: d.userAccountId,
                                label: d.firstname + " " + d.lastname
                            })
                        });
                        setEmployeeList(tempArray)
                    }
                }
            }
        )
    }
    return (
        // ContainerWrapper component Holds the Sidebar and the Topbar each naka component na
        // ContentWrapper component same as container it holds the contents and the contents can also be a component
        <ContainerWrapper contents={<>
            <div className="row m-0 p-0">
                <div className="col-md-12 px-3 py-5">
                    <>
                        <div className="row m-0 p-0">
                            <div className="col-md-6">
                                <h2>Good Day, {userData.data.profile.firstName}!</h2>

                                <br />
                                <br />
                                <h2><b>All Requests</b></h2>
                                <br />
                            </div>
                            <div className="col-md-6" style={{ textAlign: 'right' }}>
                                <TimeDate />
                            </div>
                        </div>
                        <div>
                            <div className=" pt-2">
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k: any) => {
                                        setKey(k)
                                    }}
                                    className="mb-3"
                                >
                                    <Tab eventKey="leaves" title="Leaves">
                                        {
                                            key == 'leaves' ?
                                                <Leaves />
                                                :
                                                null
                                        }
                                    </Tab>
                                    <Tab eventKey="attendance reversal" title="Attendance Reversal">
                                        {
                                            key == 'attendance reversal' ?
                                                <AttendanceReversal />
                                                :
                                                null
                                        }
                                    </Tab>
                                    <Tab eventKey="overtime" title="Overtime" >
                                        {
                                            key == 'overtime' ?
                                                <Overtime />
                                                :
                                                null
                                        }
                                    </Tab>
                                    <Tab eventKey="undertime" title="Undertime">
                                        {
                                            key == 'undertime' ?
                                                <Undertime />
                                                :
                                                null
                                        }
                                    </Tab>
                                    <Tab eventKey="schedule adjustment" title="Schedule Adjustment">
                                        {
                                            key == 'schedule adjustment' ?
                                                <ScheduleAdjustment />
                                                :
                                                null
                                        }
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </>
                </div>
            </div>

        </>} />
    )
}
