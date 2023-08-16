import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, RequestAPI } from "../../../api";
import SingleSelect from "../../../components/Forms/SingleSelect";
import { Table, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Utility } from "../../../utils";
import EmployeeDropdown from "../../../components/EmployeeDropdown";

export default function Leaves(props: any) {
    const { payrollData } = props
    const [allLeaves, setAllLeaves] = useState<any>([]);

    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [key, setKey] = React.useState('leaves');
    const [allAdjustments, setAllAdjustments] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [employeeList, setEmployeeList] = useState<any>([])
    const [pageSize, setPageSize] = useState(10);

    const [statusList, setStatusList] = useState<any>([
        'all',
        'pending',
        'approved',
        'declined'
    ])

    useEffect(() => {
        if (payrollData){
            let data = { ...payrollData }
            let from = data.from
            let to = data.to
            const filterObj: any = { ...filterData }        
            filterObj["dateFrom"] = from
            filterObj["dateTo"] = to
            setFilterData(filterObj)
        }
        
    }, [])

    useEffect(() => {
        if (filterData){
            getAllLeaves(0)
        }
        
    }, [filterData])
    

    const handlePageClick = (event: any) => {
        const selectedPage = event.selected;
        getAllLeaves(selectedPage, pageSize)
    };
    const handlePageSizeChange = (event) => {
        const selectedPageSize = parseInt(event.target.value, 10);
        setPageSize(selectedPageSize);
        getAllLeaves(0, selectedPageSize);
    };

    const getAllLeaves = (page: any = 0, pageSize: any) => {
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

        if (data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE') {
            RequestAPI.getRequest(
                `${Api.allRequestLeave}?size=${pageSize ? pageSize : '10'}${queryString}&page=${page}&status=approved&sort=id&sortDir=desc`,
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
                                    <EmployeeDropdown
                                        id="payrollgenerate_employee_dropdown"
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
                            id="payrollgenerate_datefrom_input"
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
                                id="payrollgenerate_dateto_input"
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
                    {/* <div>
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
                    </div> */}
                    <div className="input-container col-md-3 pt-4">
                        <Button
                        id="payrollgenerate_search_btn"
                        style={{ width: 210 }}
                        onClick={() => getAllLeaves(0)}
                        className="btn btn-primary mx-2">
                        Search
                        </Button>
                    </div>
                </div>
              
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        {
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                <>
                                    <th>ID</th>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                </> : null
                        }
                        <th>Type</th>
                        <th>With Pay</th>
                        <th>Date From</th>
                        <th>Date To</th>
                    </tr>
                </thead>
                <tbody className="custom-row">
                    {
                        allLeaves &&
                            allLeaves.content &&
                            allLeaves.content.length > 0 ?
                            <>
                                {
                                    allLeaves.content.map((item: any, index: any) => {
                                        return (
                                            <tr>
                                                <td id={"payrollgenerate_id_allleavesdata_" + item.id}>{item.id}</td>
                                                <td id={"payrollgenerate_userid_allleavesdata_" + item.id}>{item.employeeId}</td>
                                                {
                                                    data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                        <>
                                                            <td id={"payrollgenerate_name_allleavesdata_" + item.id}> {item.lastName}, {item.firstName} </td>
                                                        </> : null
                                                }
                                                <td id={"payrollgenerate_type_allleavesdata_" + item.id}> {item.type} </td>
                                                <td id={"payrollgenerate_withpay_allleavesdata_" + item.id}> {item.withPay == true ? "YES" : "NO"} </td>
                                                <td id={"payrollgenerate_datefrom_allleavesdata_" + item.id}> {Utility.formatDate(item.dateFrom, 'MM-DD-YYYY')} </td>
                                                <td id={"payrollgenerate_dateto_allleavesdata_" + item.id}> {Utility.formatDate(item.dateTo, 'MM-DD-YYYY')} </td>
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

            <div className="row">
                <div className="col-md-6">
                    <div className="justify-content-start">
                        <div className="flex items-center">
                        <span className="text-muted mr-3">Select Page Size:</span>
                            <select id="pageSizeSelect" value={pageSize} className="form-select" style={{ fontSize: "16px", width: "150px" }} onChange={handlePageSizeChange}>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-end ">
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
                </div>
            </div>
           
            <div className="d-flex justify-content-end">
                
            </div>
        </div>);
}