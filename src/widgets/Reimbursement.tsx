import React, { useState, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button, Table, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { hmo_icon } from "../assets/images";
import ReactPaginate from 'react-paginate'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../assets/images";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaTimesCircle } from "react-icons/fa";

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
    const [reimbursementValues, setReimbursementValues] = React.useState([]);
    const [reimbursementParentValues, setReimbursementParentValues] = React.useState();
    const [reimbursementView, setReimbursementView] = React.useState();
    const [isEditReimbursement, setIsEditReimbursement] = useState<any>(false);
    const [reimbursementType, setReimbursementType] = React.useState([])


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
            `${Api.reimbursementPending}?size=10${queryString}&page=${pageNo}&sort=id&sortDir=desc`,
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
    const updateParentData = (key: any, value: any) => {
        const valuesObj: any = { ...reimbursementParentValues }
        valuesObj[key] = value
        setReimbursementParentValues({ ...valuesObj })
    }

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
                                        <label
                                            id={"reimbursementlist_setreimbursement_btn_" + item.id}
                                            onClick={() => {
                                                if (item.breakdown.length > 0) {
                                                    let tempValues: any = []
                                                    item.breakdown.forEach((data: any, index: any) => {
                                                        tempValues.push({
                                                            "amount": data.amount,
                                                            "companyName": data.companyName,
                                                            "transactionDate": data.transactionDate,
                                                            "tin": data.tin,
                                                            "invoice": data.invoice,
                                                            "receipt": data.receipt,
                                                            "filePath": data.attachmentPath,
                                                            "fileName": data.attachmentName,
                                                            "fileContentType": data.attachmentType,
                                                        })
                                                    });
                                                    setReimbursementValues([...tempValues])
                                                }
                                                setReimbursementParentValues(
                                                    {
                                                        "parentId": item.id,
                                                        "approvedBudget": item.approvedBudget,
                                                        "total": item.total,
                                                        "purpose": item.purpose,
                                                        "remark": item.remark,
                                                        "typeId": item.typeId,
                                                        "transactionDate": item.fileDate,
                                                        'status': item.status,
                                                        "employeeName": `${item.firstName} ${item.lastName}`
                                                    }
                                                )
                                                setReimbursementView(item)
                                                setViewReimbursementModal(true)
                                            }}>
                                            <img id="" src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />
                                        </label>
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
                <div className="col-8">
                    <div className="d-flex justify-content-start">
                        <div className="">
                            <ReactPaginate
                            className="d-flex justify-content-center align-items-center widget-pagination"
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={1}
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
                <div className="col-4">
                    <div className="d-flex justify-content-end">
                        <span className="text-primary font-bold items-count" > Showing {reimbursementList.numberOfElements} of {reimbursementList.totalElements} </span>
                    </div>
                </div>
            </div>
           
        </div>
                
    </div>
    <Modal
        show={viewReimbursementModal}
        size={"lg"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setViewReimbursementModal(false)}
        dialogClassName="modal-90w"
        id="accessrights_authlist_modal"
    >
        <Modal.Header className="text-center flex justify-center " >
            <Modal.Title id="contained-modal-title-vcenter" className="font-bold text-md" >
                View Reimbursement Request
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row w-100 px-3 m-0">
            <div className="col-md-3 bg-[#F6F6F6] py-2 px-2">
                <label className="text-lg font-bold">Reimbursement Progress</label>
                <div className="mt-3 flex">
                    <BsFillCheckCircleFill color={"#2B7E88"} size={30} />
                    <div className="ml-3 ">
                        <label className="font-bold">Submitted for Approval
                        </label>
                    </div>
                </div>
                {
                    reimbursementView && reimbursementView.reviewerFirstName ?
                        <>
                            <div className="mt-3 flex">
                                <BsFillCheckCircleFill color={"#2B7E88"} size={30} />
                                <div className="ml-3 ">
                                    <label className="font-bold" id="reimbursementwidget_reviewer_label">{`${reimbursementView.reviewerFirstName} ${reimbursementView.reviewerLastName}`} <br />
                                    </label>
                                </div>
                            </div>
                        </>
                        :
                        null
                }
                {
                    reimbursementView && reimbursementView.endorserFirstName ?
                        <>
                            <div className="mt-3 flex">
                                <BsFillCheckCircleFill color={"#2B7E88"} size={30} />
                                <div className="ml-3 ">
                                    <label className="font-bold" id="reimbursementwidget_endorser_label">{`${reimbursementView.endorserFirstName} ${reimbursementView.endorserLastName}`} <br />
                                    </label>
                                </div>
                            </div>
                        </>
                        :
                        null
                }
                {
                    reimbursementView && reimbursementView.approverFirstName ?
                        <>
                            <div className="mt-3 flex">
                                <BsFillCheckCircleFill color={"#2B7E88"} size={30} />
                                <div className="ml-3 ">
                                    <label className="font-bold" id="reimbursementwidget_approver_label">{`${reimbursementView.approverFirstName} ${reimbursementView.approverFirstName}`} <br />
                                    </label>
                                </div>
                            </div>
                        </>
                        :
                        null
                }

                {
                    reimbursementView && reimbursementView.declinerFirstName ?
                        <>
                            <div className="mt-3 flex">
                                <FaTimesCircle color={reimbursementView.status == 'DECLINED' ? "#FF3838" : "#B8B8B8"} size={30} />
                                {/* <img id="" src={action_decline} width={30} className="hover-icon-pointer" title="Decline" /> */}
                                <div className="ml-3 ">
                                    <label className="font-bold" id="reimbursementwidget_decliner_label">{`${reimbursementView.declinerFirstName} ${reimbursementView.declinerLastName}`} <br />
                                    </label>
                                </div>
                            </div>
                        </>
                        :
                        null
                }
            </div>
            <div className="col-md-9">
                <div className="row m-0 p-0">
                    <div className="form-group col-md-4 mb-3" >
                        <label>Employee Name:</label>
                        <input type="text"
                            name="companyName"
                            id="reimbursementwidget_companyName_input"
                            className="form-control"
                            disabled={true}
                            value={reimbursementParentValues && reimbursementParentValues.employeeName}
                            onChange={(e) => {
                            }}
                        />
                    </div>
                    <div className="form-group col-md-4 mb-3" >

                    </div>
                    <div className="form-group col-md-4 mb-3" >
                        <label>Status:</label> <br />
                        <label className={`bg-[${Utility.reimbursementStatus(reimbursementParentValues && reimbursementParentValues.status)}] rounded-md px-5 py-2 text-white`}>{reimbursementParentValues && reimbursementParentValues.status}</label>

                    </div>
                    <div className="form-group col-md-6 mb-3" >
                        <label>Type of Reimbursement:</label>
                        <select
                            className={`form-select`}
                            name="typeId"
                            id="reimbursementwidget_typeId_input"
                            disabled={!isEditReimbursement}
                            value={reimbursementParentValues && reimbursementParentValues.typeId}
                            onChange={(e) => {
                                updateParentData('typeId', e.target.value)
                            }}>
                            <option value="" disabled selected>
                                Select reimbursement type
                            </option>
                            {
                                reimbursementType &&
                                reimbursementType.length > 0 &&
                                reimbursementType.map((item: any, index: string) => {
                                    return (<option key={`${index}_${item}`} value={item.id}>
                                        {item.name}
                                    </option>)
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                        <label>Total Amount:</label>
                        <input type="number"
                            name="total"
                            id="reimbursementwidget_total_input"
                            className="form-control"
                            disabled={!isEditReimbursement}
                            value={reimbursementParentValues && reimbursementParentValues.total}
                            onChange={(e) => {
                                updateParentData('total', e.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                        <label>Purpose:</label>
                        <textarea
                            name="purpose"
                            id="reimbursementwidget_purpose_btn"
                            className="form-control p-2"
                            disabled={!isEditReimbursement}
                            value={reimbursementParentValues && reimbursementParentValues.purpose}
                            style={{ minHeight: 100 }}
                            onChange={(e) => {
                                updateParentData('purpose', e.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group col-md-12 mb-3">
                        <Table responsive style={{ maxHeight: '100vh' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '100px' }}>With Receipt</th>
                                    <th style={{ width: '100px' }}>Invoice/OR Number</th>
                                    <th>Company Name</th>
                                    <th>TIN</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reimbursementValues &&
                                    reimbursementValues.length > 0 &&
                                    reimbursementValues.map((data: any, index: any) => {
                                        return (
                                            <tr key={`reimBreakdown-${index}`}>
                                                <td id={"reimbursementwidget_receipt_invoicetd_" + data.invoice}>{data.receipt ? "Yes" : "No"}</td>
                                                <td id={"reimbursementwidget_invoice_invoicetd_" + data.invoice}>{data.invoice}</td>
                                                <td id={"reimbursementwidget_companyname_invoicetd_" + data.invoice}>{data.companyName}</td>
                                                <td id={"reimbursementwidget_tin_invoicetd_" + data.invoice}>{data.tin}</td>
                                                <td id={"reimbursementwidget_transactiondate_invoicetd_" + data.invoice}>{data.transactionDate}</td>
                                                <td id={"reimbursementwidget_amount_invoicetd_" + data.invoice}>{Utility.formatToCurrency(data.amount)}</td>
                                                <td id={"reimbursementwidget_filename_invoicetd_" + data.invoice}>{data.fileName}</td>
                                            </tr>
                                        )

                                    })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-5">
                <Button
                    variant="secondary"
                    id={"reimbursementwidget_close_btn"}
                    onClick={() => {
                        setViewReimbursementModal(false)
                        setIsEditReimbursement(false)
                    }}
                    className="w-[150px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                    Close
                </Button>
                {
                    !isEditReimbursement && reimbursementView && reimbursementView.status != "DECLINED" && reimbursementView.status != "CANCELLED" ?
                        <>
                            <button
                                id={"reimbursementwidget_retract_btn"}
                                onClick={() => cancelReimbursement(reimbursementView.id)}
                                className="w-[150px] mr-2 rounded-md text-white bg-[#838383]" style={{ borderColor: '#189FB5' }}>
                                Retract/Cancel
                            </button></>
                        :
                        null
                }

            </div>
        </Modal.Body>
    </Modal>
</div>
       
    )
}

export default Reimbursement   