import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, RequestAPI } from "../../../api";
import SingleSelect from "../../../components/Forms/SingleSelect";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Utility } from "../../../utils";
import EmployeeDropdown from "../../../components/EmployeeDropdown";
import moment from "moment";

export default function TimeSheet(props: any) {
    const { payrollData } = props
    const [timekeeping, setAllTimekeeping] = useState<any>([]);
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [filterData, setFilterData] = React.useState([]);
    const [daysInMonth, setDaysInMonth] = React.useState([]);

    useEffect(() => {
        if (payrollData) {
            getAllTimekeeping(0)
            mapDateRange()
        }
    }, [])

    const mapDateRange = () => {
        let data = { ...payrollData }
        let from = data.from
        let to = data.to
        const startDate: any = new Date(from);
        const endDate: any = new Date(to);

        const dateRange: any = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
            dateRange.push(moment(new Date(currentDate)).format('MMMM DD'));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setDaysInMonth(dateRange)
    };

    const handlePageClick = (event: any) => {
        getAllTimekeeping(event.selected)
    };

    useEffect(() => {
        if (filterData) {
            getAllTimekeeping(0)
        }
    }, [filterData])

    const getAllTimekeeping = (page: any = 0) => {
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
        let data = { ...payrollData }
        let from = data.from
        let to = data.to
        queryString += `&fromDate=${from}&toDate=${to}`
        RequestAPI.getRequest(
            `${Api.payrollTimekeeping}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        setAllTimekeeping(body.data)
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
        <div className="w-100">
            <div className="w-100 pt-2">
                <div className="fieldtext d-flex ">
                    <div className="mx-1 mb-3" style={{ width: 200, marginRight: 10 }}>
                        <label>Employee Name</label>
                        <EmployeeDropdown
                            name="userId"
                            placeholder={"Employee"}
                            value={filterData && filterData['userId']}
                            singleChangeOption={singleChangeOption}
                        />
                    </div>
                </div>
            </div>
            <div className="timekeepingTable">
                <Table className="w-full tableOverflow mt-[-20px]">
                    <thead className="custom-row">
                        {
                            timekeeping &&
                                timekeeping.length > 0 ?
                                <>
                                    <tr>
                                        <td id="payrolltimekeeping_employeeid_timekeepingdata" className="daysInMonth">Employee ID</td>
                                        <td id="payrolltimekeeping_employeename_timekeepingdata" className="daysInMonth">Employee Name</td>
                                        {
                                            daysInMonth.map((data: any, i: any) => {
                                                return (
                                                    <>
                                                        <td id="payrolltimekeeping_daysinmonth_timekeepingdata" className="daysInMonth">{data}</td>
                                                    </>
                                                )
                                            })
                                        }
                                    </tr>
                                    {
                                        timekeeping &&
                                        timekeeping.map((data: any, i: any) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td id="payrolltimekeeping_employeeid_timekeeping2data" className="timeKeepingDates">{data.empId}</td>
                                                        <td id="payrolltimekeeping_employeename_timekeeping2data" className="timeKeepingDates">{data.empName}</td>
                                                        {
                                                            data.dateList && data.dateList.length > 0 &&
                                                            data.dateList.map((d: any, i: any) => {
                                                                if (i == daysInMonth.length) {
                                                                    return null
                                                                }
                                                                return (
                                                                    <>
                                                                        <td id="payrolltimekeeping_totalhours_timekeeping2data" className="">{d.totalHours}</td>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </>
                                :
                                null
                        }
                    </thead>
                    <tbody className="custom-row">
                        {/* {
                        timekeeping &&
                            timekeeping.length > 0 ?
                            <>
                                {
                                    timekeeping.map((item: any, index: any) => {
                                        return (
                                            <tr>
                                                {
                                                    data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                        <>
                                                            <td> {item.lastName}, {item.firstName} </td>
                                                        </> : null
                                                }
                                                <td> {item.type} </td>
                                                <td> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                                                <td> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
                                                <td> {item.reason} </td>
                                                <td> {Utility.removeUnderscore(item.status)} </td>
                                            </tr>
                                        )
                                    })
                                }

                            </>
                            :
                            null
                    } */}
                    </tbody>

                </Table>
                {
                    timekeeping &&
                        timekeeping.content &&
                        timekeeping.content.length == 0 ?
                        <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                }
            </div>

            <br />
            <div className="d-flex justify-content-end">
                <div className="">
                    <ReactPaginate
                        className="d-flex justify-content-center align-items-center"
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={(timekeeping && timekeeping.totalPages) || 0}
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