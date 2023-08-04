import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, RequestAPI } from "../../../api";
import SingleSelect from "../../../components/Forms/SingleSelect";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Utility } from "../../../utils";
import EmployeeDropdown from "../../../components/EmployeeDropdown";
import moment from "moment";
import { BsFillArrowLeftCircleFill, BsFillCaretLeftFill } from "react-icons/bs";

export default function Audit(props: any) {
    const { payrollData } = props
    const [auditLogs, setAllAuditLogs] = useState<any>([]);
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [filterData, setFilterData] = React.useState([]);
    const [daysInMonth, setDaysInMonth] = React.useState([]);

    const tableHeaders = [
        'DateTime',
        'Username',
        'Description',
    ];

    useEffect(() => {
        if (payrollData) {
            getAllAuditLogs(0)
        }
    }, [])

    const handlePageClick = (event: any) => {
        getAllAuditLogs(event.selected)
    };

    const getAllAuditLogs = (page: any = 0) => {
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
        if (data) {
            queryString += `&payrollId=${data.id}`
        }
        RequestAPI.getRequest(
            `${Api.auditPayroll}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        setAllAuditLogs(body.data)
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
        <div className="w-100 px-5 py-5">
            <div className="w-100 flex mb-[10px]">
                <div className="flex items-center cursor-pointer" style={{ color: '#009FB5' }} onClick={()=>{
                    props.goBack()
                }}>
                    <BsFillArrowLeftCircleFill className="mr-2" size={20} />
                    <label className="text-lg cursor-pointer">Back</label>
                </div>
            </div>
            <Table responsive>
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
                <tbody className="custom-row">
                    {
                        auditLogs &&
                        auditLogs.content &&
                        auditLogs.content.length > 0 && (
                            auditLogs.content.map((item: any, index: any) => {
                                return (
                                    <tr>
                                        <td id="payrollaudit_datetime_auditlogsdata"> {Utility.formatDate(item.dateTime.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id="payrollaudit_username_auditlogsdata"> {item.username} </td>
                                        <td id="payrollaudit_description_auditlogsdata"> {item.description} </td>
                                    </tr>
                                )
                            })
                        )
                    }
                </tbody>
            </Table>
            {
                auditLogs &&
                    auditLogs.content &&
                    auditLogs.content.length == 0 ?
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
                        pageCount={(auditLogs && auditLogs.totalPages) || 0}
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