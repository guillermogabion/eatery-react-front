import { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../../api";
import { Table } from "react-bootstrap";
import { Utility } from "../../../utils";
import ReactPaginate from "react-paginate";
import { action_decline } from "../../../assets/images";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)

export const UploadReceipt = (props: any) => {
    const [allLeaves, setAllLeaves] = useState<any>([]);
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const tableHeaders = [
        'ID',
        'File Name',
        'Type',
        'Company Name',
        'Uploaded',
        'Used',
        'Status',
        'Actions',
    ];

    useEffect(() => {
        getUploadedReceipts(0)
    }, [])

    const getUploadedReceipts = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.getAllReceiptReimbursement}`,
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
        getUploadedReceipts(event.selected)
    };

    const deleteReceipt = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to delete this receipt.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.deleteRequest(`${Api.deleteReimbursementReceipt}/${id}`, "", { "id": id }, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200) {
                        getUploadedReceipts(0)
                        ErrorSwal.fire(
                            'Deleted!',
                            (body && body.data) || "",
                            'success'
                        )
                    } else {
                        //error
                        ErrorSwal.fire(
                            'Failed!',
                            (body.error && body.error.message) || "",
                            'error'
                        )
                    }
                })
            }
        })
    }

    return (
        <div>
            <div className="w-100 px-2 py-3">
                <div>
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
                        <tbody>
                            {
                                reimbursementList &&
                                reimbursementList.content &&
                                reimbursementList.content.length > 0 && (
                                    reimbursementList.content.map((item: any, index: any) => {
                                        return (
                                            <tr>
                                                <td> {item.id} </td>
                                                <td> {item.fileName} </td>
                                                <td> {item.fileContentType} </td>
                                                <td> {item.companyName} </td>
                                                <td> {Utility.formatDate(item.uploadDate, 'MM-DD-YYYY')}</td>
                                                <td> {item.used} </td>
                                                <td> {item.status} </td>
                                                <td>
                                                    <label
                                                        id="holiday_delete_btn"
                                                        onClick={() => {
                                                            deleteReceipt(item.id)
                                                        }}
                                                        className="text-muted cursor-pointer">
                                                        <img id="holiday_actiondecline_img" src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Delete" />
                                                    </label>
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