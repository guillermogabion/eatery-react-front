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

    const [viewLeaveModalShow, setViewLeaveModalShow] = React.useState(false);
    const [viewOTModalShow, setViewOTModalShow] = React.useState(false);
    const [viewUTModalShow, setViewUTModalShow] = React.useState(false);
    const [viewSchedAdjustmentModalShow, setViewSchedAdjustmentUTModalShow] = React.useState(false);
    const [viewCOAModalShow, setViewCOAModalShow] = React.useState(false);
    const [statusList, setStatusList] = useState<any>([
        'all',
        'pending',
        'approved',
        'declined'
    ])

    const formRef: any = useRef()


    const [leaveBreakdown, setLeaveBreakdown] = useState<any>([]);
    const [leaveTypes, setLeaveTypes] = useState<any>([]);
    const [leaveInitialValues, setLeaveInitialValues] = useState<any>({
        "dateFrom": "",
        "dateTo": "",
        "type": 1,
        "status": "PENDING",
        "reason": "",
        "breakdown": []
    })
    const [OTInitialValues, setOTInitialValues] = useState<any>({})
    const [UTInitialValues, setUTInitialValues] = useState<any>({})
    const [SchedAdjustmentInitialValues, setSchedAdjustmentInitialValues] = useState<any>({})
    const [COAInitialValues, setCOAInitialValues] = useState<any>({})
    const [coaBreakdown, setCoaBreakdown] = useState<any>([]);

    useEffect(() => {
        RequestAPI.getRequest(
            `${Api.leaveTypes}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    setLeaveTypes(body.data)
                } else {
                }
            }
        )
    }, [])

    const [dayTypes, setDayTypes] = useState<any>([]);


    const viewLeave = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.getLeave}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        leaveTypes.forEach((element: any, index: any) => {
                            if (element.name == valueObj.type) {
                                valueObj.type = element.id
                            }
                        });
                        setLeaveInitialValues(valueObj)
                        setLeaveBreakdown(valueObj.breakdown)
                        setViewLeaveModalShow(true)
                    }
                }
            }
        )
    }

    const viewOT = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.otInformation}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        valueObj.otStart = moment(valueObj.otStart).format("HH:mm")
                        valueObj.otEnd = moment(valueObj.otEnd).format("HH:mm")
                        setOTInitialValues(valueObj)
                        setViewOTModalShow(true)
                    }
                }
            }
        )
    }

    const viewUT = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.utInformation}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        valueObj.utStart = moment(valueObj.utStart).format("HH:mm")
                        valueObj.utEnd = moment(valueObj.utEnd).format("HH:mm")
                        setUTInitialValues(valueObj)
                        setViewUTModalShow(true)
                    }
                }
            }
        )
    }

    const getViewSchedule = (id: any = 0) => {

        RequestAPI.getRequest(
            `${Api.getScheduleAdjustment}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {

                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        setSchedAdjustmentInitialValues(valueObj)
                        setViewSchedAdjustmentUTModalShow(true)
                    }
                }
            }
        )
    }

    const getViewCoa = (id: any = 0) => {

        RequestAPI.getRequest(
            `${Api.getCoaInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {

                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        setCOAInitialValues(valueObj)
                        setCoaBreakdown(valueObj.breakdown)
                        setViewCOAModalShow(true)
                    }
                }
            }
        )
    }

    const setDateOption = (index: any, value: any, dayType: any = null) => {

        if (leaveBreakdown) {
            const valuesObj: any = { ...leaveBreakdown }

            if (valuesObj) {
                valuesObj[index].credit = value
                valuesObj[index].dayType = dayType
            }

            const valuesObjDayType: any = { ...dayTypes }
            if (valuesObjDayType) {
                if (value == .5) {
                    valuesObjDayType[index] = true
                }
                else {
                    valuesObjDayType[index] = false
                }
                setDayTypes(valuesObjDayType)
            }
        }
    }

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

            if (data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.allRequestLeave}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
                    `${Api.allMyRequestLeave}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            id="allrequest_employee_leaveselect"
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
                                id="allrequest_datefrom_leaveinput"
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
                                    id="allrequest_dateto_leaveinput"
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
                                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th>Employee Name</th>
                                    </> : null
                            }
                            <th>Type</th>
                            <th>Date From</th>
                            <th>Date To</th>
                            <th>Reason</th>
                            <th>Date Filed</th>
                            <th>Status</th>
                            <th>Action</th>
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
                                                        data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                            <>
                                                                <td id={"allrequest_name_leavedata_" + item.id}> {item.lastName}, {item.firstName} </td>
                                                            </> : null
                                                    }
                                                    <td id={"allrequest_type_leavedata_" + item.id}> {item.type} </td>
                                                    <td id={"allrequest_datefrom_leavedata_" + item.id}> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                                                    <td id={"allrequest_dateto_leavedata_" + item.id}> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                                                    <td id={"allrequest_reason_leavedata_" + item.id}> {item.reason} </td>
                                                    <td id={"allrequest_filedate_leavedata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                    <td id={"allrequest_status_leavedata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                                                    <td id={"allrequest_labels_leavedata_" + item.id}>
                                                        <label id={"allrequest_id_leavelabel_" + item.id}
                                                            onClick={() => {
                                                                viewLeave(item.id)
                                                            }}
                                                        >
                                                            <img id={"allrequest_eye_leaveimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                                                        </label>
                                                    </td>
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

            if (data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.getAllCOA}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
                    `${Api.allMyCOA}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            id="allrequest_employee_revselect"
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
                                id="allrequest_datefrom_revinput"
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
                                    id="allrequest_dateto_revinput"
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
                                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Type</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Date Filed</th>
                            <th style={{ width: 'auto' }}>Status</th>
                            <th style={{ width: 'auto' }}>Action</th>
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
                                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                <>
                                                    <td id={"allrequest_name_revdata_" + item.id}> {item.lastName}, {item.firstName} </td>
                                                </> : null
                                        }
                                        <td id={"allrequest_type_revdata_" + item.id}>{Utility.removeUnderscore(item.type)}</td>
                                        <td id={"allrequest_reason_revdata_" + item.id}> {item.reason} </td>
                                        <td id={"allrequest_filedate_revdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                        <td id={"allrequest_status_revdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                                        <td id={"allrequest_labels_revdata_" + item.id}>
                                            <label id={"allrequest_id_revlabel_" + item.id}
                                                onClick={() => {
                                                    getViewCoa(item.id)
                                                }}
                                            >
                                                <img id={"allrequest_eye_revimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                                            </label>
                                        </td>
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
            if (data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE') {
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
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            id="allrequest_employee_otselect"
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
                                id="allrequest_datefrom_otinput"
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
                                    id="allrequest_dateto_otinput"
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
                            {data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
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
                            <th style={{ width: 'auto' }}>Action</th>
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
                                        {data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                            <td id={"allrequest_name_otdata_" + item.id}>{item.lastName}, {item.firstName}</td> :
                                            null
                                        }
                                        <td id={"allrequest_shiftdate_otdata_" + item.id}> {Utility.formatDate(item.shiftDate, 'MM-DD-YYYY')} </td>
                                        <td id={"allrequest_classification_otdata_" + item.id}> {Utility.removeUnderscore(item.classification)} </td>
                                        <td id={"allrequest_otstart_otdata_" + item.id}> {Utility.formatDate(item.otStart.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id={"allrequest_otend_otdata_" + item.id}> {Utility.formatDate(item.otEnd.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id={"allrequest_filedate_otdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                        <td id={"allrequest_reason_otdata_" + item.id}> {item.reason} </td>
                                        <td id={"allrequest_status_otdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                                        <td id={"allrequest_labels_otdata_" + item.id}>

                                            <label id={"allrequest_id_otlabel_" + item.id}
                                                onClick={() => {
                                                    viewOT(item.id)
                                                }}
                                            >
                                                <img id={"allrequest_eye_otimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                                            </label>
                                        </td>
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
            if (data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE') {
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
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            id="allrequest_employee_utstatus"
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
                                id="allrequest_datefrom_utinput"
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
                                    id="allrequest_dateto_utinput"
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
                                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
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
                            <th style={{ width: 'auto' }}>Action</th>
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
                                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                <>
                                                    <td id={"allrequest_name_utdata_" + item.id}> {item.lastName}, {item.firstName} </td>
                                                </> : null
                                        }
                                        <td id={"allrequest_shiftdate_utdata_" + item.id}> {Utility.formatDate(item.shiftDate, 'MM-DD-YYYY')} </td>
                                        <td id={"allrequest_utstart_utdata_" + item.id}> {Utility.formatDate(item.utStart.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id={"allrequest_utend_utdata_" + item.id}> {Utility.formatDate(item.utEnd.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id={"allrequest_filedate_utdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                        <td id={"allrequest_reason_utdata_" + item.id}> {item.reason} </td>
                                        <td id={"allrequest_status_utdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                                        <td id={"allrequest_labels_utdata_" + item.id}>
                                            <label id={"allrequest_id_utlabel_" + item.id}
                                                onClick={() => {
                                                    viewUT(item.id)
                                                }}
                                            >
                                                <img id={"allrequest_eye_utimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                                            </label>
                                        </td>
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

            if (data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE') {
                RequestAPI.getRequest(
                    `${Api.allScheduleAdjustment}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
                    `${Api.myScheduleAdjustment}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <div className="" style={{ width: 200, marginRight: 10 }}>
                                        <label>Employee</label>
                                        <SingleSelect
                                            id="allrequest_employee_sudselect"
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
                                id="allrequest_datefrom_sudinput"
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
                                    id="allrequest_dateto_sudinput"
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
                                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Date From</th>
                            <th style={{ width: 'auto' }}>Date To</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Date Filed</th>
                            <th style={{ width: 'auto' }}>Status</th>
                            <th style={{ width: 'auto' }}>Action</th>
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
                                                        data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                            <>
                                                                <td id={"allrequest_name_suddata_" + item.id}> {item.lastName}, {item.firstName} </td>
                                                            </> : null
                                                    }
                                                    <td id={"allrequest_datefrom_suddata_" + item.id}> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                                                    <td id={"allrequest_dateto_suddata_" + item.id}> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                                                    <td id={"allrequest_reason_suddata_" + item.id}> {item.reason} </td>
                                                    <td id={"allrequest_filedate_suddata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                    <td id={"allrequest_status_suddata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                                                    <td id={"allrequest_labels_suddata_" + item.id}>
                                                        <label id={"allrequest_id_sudlabel_" + item.id}
                                                            onClick={() => {
                                                                getViewSchedule(item.id)
                                                            }}
                                                        >
                                                            <img id={"allrequest_eye_sudimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                                                        </label>
                                                    </td>
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
                <div className="col-md-12 px-5 py-5">
                    <>
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
            <Modal
                show={viewLeaveModalShow}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setViewLeaveModalShow(false)
                }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title id="contained-modal-title-vcenter">
              Request For Leave/Time-off
            </Modal.Title> */}
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Leave/Time-off Request
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={leaveInitialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                dateFrom: Yup.string().required("Date from is required !"),
                                dateTo: Yup.string().required("Date to is required !"),
                                reason: Yup.string().required("Reason is required !"),
                                status: Yup.string().required("Status is required !"),
                                type: Yup.string().required("Status is required !"),
                            })
                        }
                        onSubmit={(values, actions) => {

                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">
                                        <div className="form-group col-md-12 mb-3 " >
                                            <label>Leave Type</label>
                                            <select
                                                id="allrequest_leavetype_allselect"
                                                className="form-select"
                                                name="type"
                                                value={values.type}
                                                // onChange={(e) => setFormField(e, setFieldValue)}>
                                                disabled={true}
                                            >
                                                {leaveTypes &&
                                                    leaveTypes.length &&
                                                    leaveTypes.map((item: any, index: string) => (
                                                        <option key={`${index}_${item.id}`} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Date From</label>
                                            <input type="date"
                                                id="allrequest_datefrom_allinput"
                                                onKeyDown={(e) => e.preventDefault()}
                                                name="dateFrom"
                                                className="form-control"
                                                disabled={true}
                                                value={values.dateFrom}
                                                placeholder="dd/mm/yyyy"
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Date To</label>
                                            <input type="date"
                                                disabled={true}
                                                onKeyDown={(e) => e.preventDefault()}
                                                name="dateTo"
                                                id="dateTo"
                                                className="form-control"
                                                value={values.dateTo}
                                            />
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Reason</label>
                                            <input type="text"
                                                disabled={true}
                                                name="reason"
                                                id="reason"
                                                className="form-control"
                                                value={values.reason}
                                            />
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <Table responsive="lg" style={{ maxHeight: '100vh' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: 'auto' }}>Date Breakdown</th>
                                                        <th style={{ width: 'auto' }}>Options</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        leaveBreakdown &&
                                                        leaveBreakdown.length > 0 &&
                                                        leaveBreakdown.map((item: any, index: any) => {
                                                            const { date } = item
                                                            return (
                                                                <tr>
                                                                    <td key={index + 'date'} >{date}</td>
                                                                    <td key={index} >
                                                                        <input
                                                                            type="radio"
                                                                            name={"leaveCredit" + index.toString()}
                                                                            id={"leaveCreditWhole" + index.toString()}
                                                                            checked={item.credit == 1}
                                                                            disabled={true}
                                                                            onChange={() => {
                                                                                setDateOption(index, 1, 'WHOLEDAY')
                                                                            }}
                                                                        />
                                                                        <label htmlFor={"leaveCreditWhole" + index.toString()}
                                                                            style={{ marginRight: 10 }}>Whole Day</label>
                                                                        <input
                                                                            type="radio"
                                                                            name={"leaveCredit" + index.toString()}
                                                                            id={"leaveCreditDay" + index.toString()}
                                                                            checked={item.credit == 0.5}
                                                                            disabled={true}
                                                                            onChange={() => {
                                                                                setDateOption(index, .5, "FIRST_HALF")
                                                                            }}
                                                                        /> <label htmlFor={"leaveCreditDay" + index.toString()}
                                                                            style={{ paddingTop: -10, marginRight: 10 }}>Half Day</label>
                                                                        {
                                                                            item.dayType != 'WHOLEDAY' ?
                                                                                <>
                                                                                    <br />
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={"dayTypes" + index.toString()}
                                                                                        id={"leaveCreditWhole1" + index.toString()}
                                                                                        checked={item.dayType == 'FIRST_HALF'}
                                                                                        disabled={true}
                                                                                        onChange={() => setDateOption(index, .5, "FIRST_HALF")}
                                                                                    />
                                                                                    <label htmlFor={"leaveCreditWhole1" + index.toString()}
                                                                                        style={{ marginRight: 10 }}>First Half</label>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={"dayTypes" + index.toString()}
                                                                                        checked={item.dayType == 'SECOND_HALF'}
                                                                                        id={"leaveCreditDay1" + index.toString()}
                                                                                        disabled={true}
                                                                                        onChange={() => setDateOption(index, .5, "SECOND_HALF")}
                                                                                    />
                                                                                    <label htmlFor={"leaveCreditDay1" + index.toString()}
                                                                                        style={{ paddingTop: -10 }}>Second Half</label>
                                                                                </>
                                                                                :
                                                                                null
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                leaveBreakdown &&
                                                    leaveBreakdown.length == 0 ?
                                                    <div className="w-100 text-center">
                                                        <label htmlFor="">No Records Found</label>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                    <br />
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>

            <Modal
                show={viewOTModalShow}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setViewOTModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Overtime
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={OTInitialValues}
                        enableReinitialize={true}
                        validationSchema={null}
                        onSubmit={(values, actions) => {

                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">
                                        <div className="form-group col-md-6 mb-3 " >
                                            <label>OT Classification </label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <input
                                                className="form-select"
                                                name="classification"
                                                id="classification"
                                                value={values.classification}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Shift Date</label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <input type="date"
                                                name="shiftDate"
                                                id="shiftDate"
                                                className="form-control"
                                                disabled={true}
                                                value={values.shiftDate}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Start</label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <input type="time"
                                                name="otStart"
                                                id="otStart"
                                                className="form-control"
                                                disabled={true}
                                                value={values.otStart}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>End</label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <input type="time"
                                                name="otEnd"
                                                id="otEnd"
                                                className="form-control"
                                                disabled={true}
                                                value={values.otEnd}
                                            />
                                            {errors && errors.otEnd && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.otEnd}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-6 mb-3">
                                            <label>Work Type</label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <select
                                                className="form-select"
                                                value={values.location}
                                                disabled={true}
                                                name="location"
                                            >
                                                <option value="" disabled selected>
                                                    Select Work Type
                                                </option>
                                                <option value="ON_SITE">On Site</option>
                                                <option value="WORK_FROM_HOME">Work From Home</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6 mb-3">
                                            <label>Breaktime Duration (minutes)</label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <input
                                                className="form-select"
                                                value={values.breaktimeDuration}
                                                disabled={true}
                                                name="breaktimeDuration"
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3"></div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Indicate Ticket Number (If Applicable) and Reason</label>
                                            <span className="text-danger ml-2 text-md">*</span>
                                            <textarea
                                                name="reason"
                                                id="reason"
                                                className="form-control p-2"
                                                disabled={true}
                                                style={{ minHeight: 100 }}
                                                value={values.reason}
                                            />
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>

            <Modal
                show={viewUTModalShow}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setViewUTModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Undertime
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={UTInitialValues}
                        enableReinitialize={true}
                        validationSchema={null}
                        onSubmit={(values, actions) => {

                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">

                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Date</label>
                                            <input type="date"
                                                name="shiftDate"
                                                id="shiftDate"
                                                disabled={true}
                                                className="form-control"
                                                value={values.shiftDate}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Start</label>
                                            <input type="time"
                                                name="utStart"
                                                id="utStart"
                                                disabled={true}
                                                className="form-control"
                                                value={values.utStart}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>End</label>
                                            <input type="time"
                                                name="utEnd"
                                                id="utEnd"
                                                disabled={true}
                                                className="form-control"
                                                value={values.utEnd}
                                            />
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Reason</label>
                                            <textarea
                                                name="reason"
                                                id="reason"
                                                disabled={true}
                                                className="form-control p-2"
                                                style={{ minHeight: 100 }}
                                                value={values.reason}
                                            />
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>

            <Modal
                show={viewSchedAdjustmentModalShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {

                    setViewSchedAdjustmentUTModalShow(false)
                }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Request Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                    <div className="container">
                        {/* <h4>reason</h4> {{values.reason}} */}
                        <p id="allrequests_name_rqinfosudp">Name : <span>{SchedAdjustmentInitialValues.lastName + ' ' + SchedAdjustmentInitialValues.firstName}</span> <span>{ }</span></p>
                        <p id="allrequests_reason_rqinfosudp">Reason : {SchedAdjustmentInitialValues.reason}</p>
                        <p id="allrequests_datefrom_rqinfosudp">Date From : {Utility.formatDate(SchedAdjustmentInitialValues.dateFrom, 'MM-DD-YYYY')}</p>
                        <p id="allrequests_dateto_rqinfosudp">Date To : {Utility.formatDate(SchedAdjustmentInitialValues.dateTo, 'MM-DD-YYYY')}</p>
                        <p id="allrequests_shiftstarts_rqinfosudp">Shift Starts : {SchedAdjustmentInitialValues.startShift}</p>
                        <p id="allrequests_startofbreak_rqinfosudp">Start of Break : {SchedAdjustmentInitialValues.startBreak}</p>
                        <p id="allrequests_endofbreak_rqinfosudp">End of Break : {SchedAdjustmentInitialValues.endBreak}</p>
                        <p id="allrequests_shiftends_rqinfosudp">Shift Ends : {SchedAdjustmentInitialValues.endShift}</p>

                        <p id="allrequests_status_rqinfosudp">Status : {SchedAdjustmentInitialValues.status}</p>
                    </div>
                </Modal.Body>

            </Modal>

            <Modal
                size="lg"
                show={viewCOAModalShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setViewCOAModalShow(false)
                }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Request Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                    <div className="container">
                        {/* <h4>reason</h4> {{values.reason}} */}
                        <p id="allrequests_name_rqinfocoap">Name : <span>{COAInitialValues.lastName + ' ' + COAInitialValues.firstName}</span> <span>{ }</span></p>
                        <p id="allrequests_reason_rqinfocoap">Reason : {COAInitialValues.reason}</p>
                        <p id="allrequests_type_rqinfocoap">Type : {COAInitialValues.type}</p>
                        <p id="allrequests_status_rqinfocoap">Status : {COAInitialValues.status}</p>

                        <Table responsive="lg" style={{ maxHeight: '100vh' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '100px' }}>Shift Date</th>
                                    <th style={{ width: '100px' }}>Type</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coaBreakdown.map((initialValues: any, index: any) => (
                                    <tr key={`coaBreakdown-${index}`}>
                                        <td id="allrequests_shiftdate_allreqdata">{Utility.formatDate(initialValues.shiftDate, 'MM-DD-YYYY')}</td>
                                        <td id="allrequests_coabdtype_allreqdata">{initialValues.coaBdType}</td>
                                        <td id="allrequests_date_allreqdata">{Utility.formatDate(initialValues.date, 'MM-DD-YYYY')}</td>
                                        <td id="allrequests_time_allreqdata">{initialValues.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>

            </Modal>
        </>} />


    )
}
