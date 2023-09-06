import moment from "moment"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../../assets/images"
import { Utility } from "../../../utils"
import EmployeeDropdown from "../../../components/EmployeeDropdown"
const ErrorSwal = withReactContent(Swal)


export const Overtime = (props: any) => {
    const { payrollData } = props
    const [allOTList, setAllOTList] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);

    useEffect(() => {
        if (payrollData) {
            let data = { ...payrollData }
            let from = data.from
            let to = data.to
            const filterObj: any = { ...filterData }
            filterObj["dateFrom"] = from
            filterObj["dateTo"] = to
            setFilterData(filterObj)
            RequestAPI.getRequest(
                `${Api.allOvertime}?size=10&dateFrom=${from}&dateTo=${to}&page=0&status=approved&sort=id&sortDir=desc`,
                "",
                {},
                {},
                async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 && body) {
                        if (body.error && body.error.message) {
                        } else {
                            setAllOTList(body.data)
                        }
                    }
                }
            )
        } else {
            getMyOT(0)
        }

    }, [])

    const handlePageClick = (event: any) => {
        getMyOT(event.selected)
    };

    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    const getMyOT = (page: any = 0) => {
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
            `${Api.allOvertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=approved`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        setAllOTList(body.data)
                    }
                }
            }
        )

    }

    const singleChangeOption = (option: any, name: any) => {

        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }

    return (
        <>
            <div className="w-100">
                <div>
                    <div className="w-100 pt-2">
                        <div className="row d-flex">
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-3">
                                <label>Employee</label>
                                <EmployeeDropdown
                                    id="overtime_employee_allOTListformdropdown"
                                    placeholder={"Employee"}
                                    singleChangeOption={singleChangeOption}
                                    name="userId"
                                    value={filterData && filterData['userId']}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date From</label>
                                <input
                                    id="overtime_datefrom_allOTListforminput"
                                    name="dateFrom"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    value={filterData["dateFrom"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date To</label>
                                <input
                                    id="overtime_dateto_allOTListforminput"
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    value={filterData["dateTo"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 d-flex flex-wrap">
                                <Button
                                    id="overtime_search_allOTListformbtn"
                                    onClick={() => getMyOT(0)}
                                    className="btn btn-primary px-4  mt-4">
                                    Search
                                </Button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                        <th style={{ width: 'auto' }}>Shift Date</th>
                                        <th style={{ width: 'auto' }}>Classification</th>
                                        <th style={{ width: 'auto' }}>OT Start</th>
                                        <th style={{ width: 'auto' }}>OT End</th>
                                        <th style={{ width: 'auto' }}>Duration</th>
                                        <th style={{ width: 'auto' }}>Date Filed</th>
                                        <th style={{ width: 'auto' }}>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allOTList &&
                                        allOTList.content &&
                                        allOTList.content.length > 0 &&
                                        allOTList.content.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td id={"overtime_name_allOTListdata_" + item.id}>{item.lastName}, {item.firstName}</td>
                                                    <td id={"overtime_shiftdate_allOTListdata_" + item.id}> {Utility.formatDate(item.shiftDate, 'MM-DD-YYYY')} </td>
                                                    <td id={"overtime_classification_allOTListdata_" + item.id}> {Utility.removeUnderscore(item.classification)} </td>
                                                    <td id={"overtime_otstart_allOTListdata_" + item.id}> {Utility.formatDate(item.otStart.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                                    <td id={"overtime_otend_allOTListdata_" + item.id}> {Utility.formatDate(item.otEnd.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                                    <td id={"overtime_totalduration_allOTListdata_" + item.id}> {item.totalDuration} </td>
                                                    <td id={"overtime_filedate_allOTListdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                    <td id={"overtime_reason_allOTListdata_" + item.id}> {item.reason} </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            {
                                allOTList &&
                                    allOTList.content &&
                                    allOTList.content.length == 0 ?
                                    <div className="w-100 text-center">
                                        <label htmlFor="">No Records Found</label>
                                    </div>
                                    :
                                    null
                            }
                        </div>
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
                            pageCount={(allOTList && allOTList.totalPages) || 0}
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
        </>
    )
}
