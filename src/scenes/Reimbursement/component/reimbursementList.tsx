import { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../../api";
import { Table } from "react-bootstrap";
import { Utility } from "../../../utils";
import ReactPaginate from "react-paginate";

export const ReimbursementList = (props: any) => {
    const [allLeaves, setAllLeaves] = useState<any>([]);
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const tableHeaders = [
        'Reimbursement',
        'Approved Budget',
        'Total Amount',
        'Date Filed',
        'Status',
        'Action',
    ];

    useEffect(() => {
        getReimbursements(0)
    }, [])

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
                        setReimbursementList(body.data)
                    }
                }
            }
        )
    }

    const handlePageClick = (event: any) => {
        getReimbursements(event.selected)
    };

    return (
        <div>
            <div className="w-100 px-2 py-3">
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

        </div>);
}