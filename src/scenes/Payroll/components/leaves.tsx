import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, RequestAPI } from "../../../api";
import SingleSelect from "../../../components/Forms/SingleSelect";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Utility } from "../../../utils";
import EmployeeDropdown from "../../../components/EmployeeDropdown";

export default function Leaves(props: any) {
    const [allLeaves, setAllLeaves] = useState<any>([]);

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

    useEffect(() => {
        getAllLeaves(0, "all")
    }, [])

    useEffect(() => {
        if (filterData){
            let status = filterData['status'] || ""
            getAllLeaves(0, status)
        }
        
    }, [filterData])
    

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
                        data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                            <>
                                <div className="" style={{ width: 200, marginRight: 10 }}>
                                    <label>Employee</label>
                                    <EmployeeDropdown
                                        name="userId"
                                        placeholder={"Employee"}
                                        value={filterData && filterData['userId']}
                                        singleChangeOption={singleChangeOption}
                                    />
                                    {/* <SingleSelect
                                        type="string"
                                        options={employeeList || []}
                                        placeholder={"Employee"}
                                        onChangeOption={singleChangeOption}
                                        name="userId"
                                        value={filterData && filterData['userId']}
                                    /> */}
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