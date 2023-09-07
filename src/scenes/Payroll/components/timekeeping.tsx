import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import EmployeeDropdown from "../../../components/EmployeeDropdown"
const ErrorSwal = withReactContent(Swal)


export const TimeKeeping = (props: any) => {
    const { payrollData } = props
    const [allTimeKeeping, setAllTimeKeeping] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);

    useEffect(() => {
        if (payrollData) {
            let data = { ...payrollData }
            let from = data.from
            let to = data.to
            const filterObj: any = { ...filterData }
            filterObj["fromDate"] = from
            filterObj["toDate"] = to
            setFilterData(filterObj)
            RequestAPI.getRequest(
                `${Api.timekeepingReport}?size=10&fromDate=${from}&toDate=${to}&page=0&status=approved&sort=id&sortDir=desc`,
                "",
                {},
                {},
                async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 && body) {
                        if (body.error && body.error.message) {
                        } else {
                            setAllTimeKeeping(body.data)
                        }
                    }
                }
            )
        } else {
            getAllTimeKeeping(0)
        }

    }, [])

    const handlePageClick = (event: any) => {
        getAllTimeKeeping(event.selected)
    };

    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    const getAllTimeKeeping = (page: any = 0) => {
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
            `${Api.timekeepingReport}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=approved`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        setAllTimeKeeping(body.data)
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
            <div className="w-100 ">
                <div>
                    <div className="w-100 pt-2 overflow-hidden">
                        <div className="row d-flex">
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-3">
                                <label>Employee</label>
                                <EmployeeDropdown
                                    id="overtime_employee_allTimeKeepingformdropdown"
                                    placeholder={"Employee"}
                                    singleChangeOption={singleChangeOption}
                                    name="userId"
                                    value={filterData && filterData['userId']}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date From</label>
                                <input
                                    id="overtime_datefrom_allTimeKeepingforminput"
                                    name="fromDate"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    value={filterData["fromDate"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date To</label>
                                <input
                                    id="overtime_dateto_allTimeKeepingforminput"
                                    name="toDate"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    value={filterData["toDate"]}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 d-flex flex-wrap">
                                <Button
                                    id="overtime_search_allTimeKeepingformbtn"
                                    onClick={() => getAllTimeKeeping(0)}
                                    className="btn btn-primary px-4  mt-4">
                                    Search
                                </Button>
                            </div>
                        </div>
                        <div className="timekeepingTable p-0 pt-0 mt-3">
                            <Table responsive bordered className="w-full tableOverflow">
                                <thead>
                                    <tr>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Employee ID</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Employee Name</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Total Work Hours Required</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Total Hours</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Absent (Day)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Tardiness (Mins)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Undertime (Mins)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Night Shift Differential (Hrs)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Overtime (Hrs)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">NDOT (Hrs)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Leave with Pay(Hrs)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Leave without Pay (Hrs)</th>
                                        <th style={{ width: 'auto', height: 'auto', verticalAlign: 'middle' }} rowSpan={2} className="text-center">Rest Day</th>
                                        <th style={{ width: 'auto', height: 'auto' }} colSpan={2} className="text-center px-0">Holiday (Hrs)</th>
                                    </tr>
                                    <tr>
                                        <th style={{ height: 'auto', verticalAlign: 'middle' }} className="text-center">Special Holiday</th>
                                        <th style={{ height: 'auto', verticalAlign: 'middle' }} className="text-center">Legal Holiday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allTimeKeeping &&
                                        allTimeKeeping.length > 0 &&
                                        allTimeKeeping.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.empId}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{`${item.firstName} ${item.lastName}`}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.requiredWorkHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.totalHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.absent}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.totalLate + item.totalUndertime}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.totalUndertime}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.nightShiftDiffHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.totalOtHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.totalNdotHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.leaveWithPayHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.leaveWithoutPayHours}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.restDay}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.specialHolidayHrs}</td>
                                                    <td style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }} className="text-center">{item.legalHolidayHrs}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>


                            {
                                allTimeKeeping &&
                                    allTimeKeeping.content &&
                                    allTimeKeeping.content.length == 0 ?
                                    <div className="w-100 text-center">
                                        <label htmlFor="">No Records Found</label>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
