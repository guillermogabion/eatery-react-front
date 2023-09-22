import React, { useState, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { hmo_icon } from "../assets/images";
import ReactPaginate from 'react-paginate'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../assets/images";

const ErrorSwal = withReactContent(Swal)




const Reimbursement = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [filterData, setFilterData] = React.useState([]);
    const [isApproving, setIsApproving] = useState<any>(false)
    const [viewReimbursementModal, setViewReimbursementModal] = useState<any>(false);
    const [isDeclining, setIsDeclining] = useState<any>(false)
    const [isCancelling, setIsCancelling] = useState<any>(false);



    const getReimbursements = (pageNo: any) => {
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
        if (data.profile.role == 'APPROVER') {
            queryString += `&enableSquad=true`
        } else {
            queryString += `&enableSquad=false`
        }
        RequestAPI.getRequest(
            `${Api.getAllReimbursement}?size=10${queryString}&page=${pageNo}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let reimTemp: any = { ...body.data }
                        if (reimTemp.content) {
                            let tempArray = [...reimTemp.content]
                            tempArray.forEach((d: any, i: any) => {
                                d.isCheck = false
                            });
                            setReimbursementList(reimTemp)
                        }

                    }
                }
            }
        )
    }
    const approveReimbursement = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to approve this reimbursement.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "reimbursementl_approvereimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "reimbursement_approvereimbcancel_alertbtn"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.postRequest(Api.approveReimbursement, "", { "parentId": id }, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_errorconfirm_alertbtn"
                                },
                                icon: 'error',
                            })
                            setIsApproving(false)
                        } else {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_successconfirm_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                            setViewReimbursementModal(false)
                            setIsApproving(false)
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: 'Something error',
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "reimbursement_errorconfirm2_alertbtn"
                            },
                            icon: 'error',
                        })
                        setIsApproving(false)
                    }
                })
            } else {
                setIsApproving(false)
            }
        })
    }
    const declineReimbursement = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to decline this reimbursement.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "reimbursement_declinereimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "reimbursement_declinereimbcancel_alertbtn"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.postRequest(Api.declineReimbursement, "", { "parentId": id }, {}, async (res: any) => {

                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_errorconfirm7_alertbtn"
                                },
                                icon: 'error',
                            })
                            setIsDeclining(false)
                        } else {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || (body.data.message),
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_successconfirm4_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                            setViewReimbursementModal(false)
                            setIsDeclining(false)
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: 'Something Error.',
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "reimbursement_errorconfirm8_alertbtn"
                            },
                            icon: 'error',
                        })
                        setIsDeclining(false)
                    }
                })
            } else {
                setIsDeclining(false)
            }
        })
    }
    const cancelReimbursement = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to cancel this reimbursement.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "reimbursement_cancelreimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "reimbursement_cancelreimbcancel_alertbtn"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.postRequest(Api.cancelReimbursement, "", { "parentId": id }, {}, async (res: any) => {

                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_errorconfirm9_alertbtn"
                                },
                                icon: 'error',
                            })
                            setIsCancelling(false)
                        } else {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || (body.data.message),
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_successconfirm5_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                            setViewReimbursementModal(false)
                            setIsCancelling(false)
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: 'Something Error.',
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "reimbursement_errorconfirm10_alertbtn"
                            },
                            icon: 'error',
                        })
                        setIsCancelling(false)
                    }
                })
            } else {
                setIsCancelling(false)
            }
        })
    }
    useEffect(() => {
        getReimbursements(0)
    }, [filterData])
    const handlePageClick = (event: any) => {
        getReimbursements(event.selected)
      };

    return (
        <div className="time-card-width">
             <div className="card-header">
                <span className="">Reimbursement (Pending for Approval)</span>
            </div>
            <div className="time-card-body row">
            <div>
            <div style={{ paddingLeft: '15px'}}>
                <Table responsive>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
                        <tr>
                            
                                <th>Employee</th>
                                <th>Amount</th>
                                <th>Action</th>
                        </tr>
                    </thead>
                </Table>
                <Table responsive>
                    <tbody style={{ display: 'block', maxHeight: 'calc(300px - 40px)', overflowY: 'auto', width: '100%'}}>
                        {reimbursementList &&
                            reimbursementList.content &&
                            reimbursementList.content.length > 0 &&
                            reimbursementList.content.map((item: any, index: any) => {
                                return (
                                    <tr key={item.id}>
                                        <td style={{width: 'auto'}} id={"reimbursement_name_tdtable_" + item.id}>
                                            {`${item.firstName} ${item.lastName}`}
                                        </td>
                                        <td style={{width: 'auto', paddingLeft: '20px'}} id={"reimbursement_total_tdtable_" + item.id}>
                                            {Utility.formatToCurrency(item.total)}
                                        </td>
                                        <td style={{width: 'auto'}}>
                                        {
                                            item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED" && (
                                                <>
                                                    <label
                                                        id={"reimbursement_approvereimburse_labelbtn_" + item.id}
                                                        onClick={() => {
                                                            approveReimbursement(item.id)
                                                        }}>
                                                        <img id={"reimbursement_approvereimburse_img_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                                    </label>
                                                    <label
                                                        id={"reimbursement_declinereimburse_labelbtn_" + item.id}
                                                        onClick={() => {
                                                            declineReimbursement(item.id)
                                                        }}>
                                                        <img id={"reimbursement_declinereimburse_img_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                                                    </label>
                                                </>
                                            )
                                        }
                                        {
                                            item.status != "DECLINED" && item.status != "CANCELLED" && (
                                                <>
                                                    <label
                                                        id={"reimbursement_cancelreimburse_labelbtn_" + item.id}
                                                        onClick={() => {
                                                            cancelReimbursement(item.id)
                                                        }}>
                                                        <img id={"reimbursement_cancelreimburse_img_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                                                    </label>
                                                </>
                                            )
                                        }
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div>

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
            <div className="row">
                <div className="col-6">
                    <div className="d-flex justify-content-start">
                        <div className="">
                            <ReactPaginate
                            className="d-flex justify-content-center align-items-center widget-pagination"
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={1}
                            pageCount={(reimbursementList && reimbursementList.totalPages) || 0}
                            previousLabel="<"
                            previousLinkClassName="prev-next-pagination arrow-page"
                            nextLinkClassName="prev-next-pagination arrow-page"
                            activeLinkClassName="active-page-link  widget-pagination-link-active"
                            disabledLinkClassName="prev-next-disabled"
                            pageLinkClassName="page-link widget-pagination-link"
                            renderOnZeroPageCount={null}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="d-flex justify-content-end">
                        <span className="text-primary font-bold"> Showing {reimbursementList.numberOfElements} of {reimbursementList.totalElements} </span>
                    </div>
                </div>
            </div>
           
        </div>
                
    </div>
</div>
       
    )
}

export default Reimbursement   