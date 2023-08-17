import React, { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../../api";
import { Button, Form, FormLabel, Modal, Table } from "react-bootstrap";
import { Utility } from "../../../utils";
import ReactPaginate from "react-paginate";
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../../assets/images";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaTimesCircle } from "react-icons/fa";
import EmployeeDropdown from "../../../components/EmployeeDropdown";
const ErrorSwal = withReactContent(Swal)

export const ReimbursementList = (props: any) => {
    const [allLeaves, setAllLeaves] = useState<any>([]);
    const [viewReimbursementModal, setViewReimbursementModal] = useState<any>(false);
    const [isEditReimbursement, setIsEditReimbursement] = useState<any>(false);
    const [reimbursementType, setReimbursementType] = React.useState([])
    const [filterData, setFilterData] = React.useState([]);
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const tableHeaders = [
        'ID',
        'Reimbursement Type',
        // 'Approved Budget',
        'Total Amount',
        'Date Filed',
        'Status',
        'Action',
    ];
    const [reimbursementValues, setReimbursementValues] = React.useState([
        // {
        //     "receiptId": "",
        //     "amount": "",
        //     "companyName": "",
        //     "transactionDate": "",
        //     "tin": "",
        //     "invoice": "",
        //     "receipt": true,
        //     "filePath": "",
        //     "fileName": "",
        //     "fileContentType": "",
        //     "isDisplayData": false
        // }
    ]);
    const [reimbursementView, setReimbursementView] = React.useState();
    const [reimbursementParentValues, setReimbursementParentValues] = React.useState(
        // {
        //     "approvedBudget": "",
        //     "total": "",
        //     "purpose": "",
        //     "remark": "",
        //     "typeId": "",
        //     "transactionDate": ""
        // }
    );

    useEffect(() => {
        getReimbursements(0)
        getReimbursementType()
    }, [])

    useEffect(() => {
        getReimbursements(0)
    }, [filterData])

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
        RequestAPI.getRequest(
            `${Api.getMyReimbursement}?size=10${queryString}&page=${pageNo}&sort=id&sortDir=desc`,
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

    const getReimbursementType = () => {
        RequestAPI.getRequest(
            `${Api.reimbursementType}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setReimbursementType(body.data)
                    }
                }
            }
        )
    }


    const handlePageClick = (event: any) => {
        getReimbursements(event.selected)
    };

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
      
                if(confirmButton)
                  confirmButton.id = "reimbursementlist_approveconfirm_alertbtn"
      
                if(cancelButton)
                  cancelButton.id = "reimbursementlist_approvecancel_alertbtn"
              },
        }).then((result) => {
            if (result.isConfirmed) {

                RequestAPI.postRequest(Api.approveReimbursement, "", { "parentId": id }, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_errorconfirm_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_successconfirm_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "remibursementlist_errorconfirm2_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
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
      
                if(confirmButton)
                  confirmButton.id = "reimbursementlist_declineconfirm_alertbtn"
      
                if(cancelButton)
                  cancelButton.id = "reimbursementlist_declinecancel_alertbtn"
              },
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.postRequest(Api.declineReimbursement, "", { "parentId": id }, {}, async (res: any) => {
                    Swal.close()
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_errorconfirm3_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_successconfirm2_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "remibursementlist_errorconfirm4_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
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
      
                if(confirmButton)
                  confirmButton.id = "reimbursementlist_cancelconfirm_alertbtn"
      
                if(cancelButton)
                  cancelButton.id = "reimbursementlist_cancelcancel_alertbtn"
              },
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.postRequest(Api.cancelReimbursement, "", { "parentId": id }, {}, async (res: any) => {
                    Swal.close()
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_errorconfirm5_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_successconfirm3_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                            setViewReimbursementModal(false)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "remibursementlist_errorconfirm6_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const updateReimbursement = () => {
        if (reimbursementView) {
            const valuesObj: any = { ...reimbursementParentValues }
            let payload: any = {
                "approvedBudget": valuesObj.approvedBudget,
                "total": valuesObj.total,
                "purpose": valuesObj.purpose,
                "remark": valuesObj.remark,
                "typeId": valuesObj.typeId,
                "parentId": valuesObj.parentId,
            }
            RequestAPI.putRequest(
                Api.updateReimbursement,
                "",
                payload,
                {},
                async (res) => {
                    const { status, body = { data: {}, error: {} } } = res;
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_errorconfirm7_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "remibursementlist_successconfirm4_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                            setIsEditReimbursement(false)
                            setViewReimbursementModal(false)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "remibursementlist_errorconfirm8_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                }
            );
        }

    }

    const updateParentData = (key: any, value: any) => {
        const valuesObj: any = { ...reimbursementParentValues }
        valuesObj[key] = value
        setReimbursementParentValues({ ...valuesObj })
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
            <div className="w-100 px-2 py-3">
                <div className="w-100">
                    <div className="pl-3 text-[#009FB5] text-lg ">
                        Search By:
                    </div>
                    <div className="row m-0 p-0 d-flex col-md-12">

                        {/* <div className="col-md-2 ">
                            <label>Type of Reimbursement:</label>
                            <select
                                className={`form-select `}
                                name="typeId"
                                id="typeId"
                                style={{ height: 42 }}
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
                        </div> */}
                        <div className="col-md-2">
                            <label className="">Date From</label>
                            <input
                                id="dateFrom"
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

                        <div className="col-md-2">
                            <label className="">Date To</label>
                            <div >
                                <input
                                    id="dateTo"
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
                        <div className="col-md-2">
                            <label className="">Status</label>
                            <div >
                                <select
                                    className={`form-select `}
                                    name="status"
                                    id="status"
                                    style={{ height: 42 }}
                                    value={filterData["status"]}
                                    onChange={(e) => makeFilterData(e)}>
                                    <option value="Select" disabled selected>
                                        Select Status
                                    </option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Declined">Declined</option>
                                    <option value="Endorsed">Endorsed</option>
                                    <option value="Reviewed">Reviewed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
                                                <td> {item.typeName} </td>
                                                {/* <td> {item.approvedBudget} </td> */}
                                                <td> {Utility.formatToCurrency(item.total)} </td>
                                                <td> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                <td> <label className={`bg-[${Utility.reimbursementStatus(item.status)}] rounded-md px-3 py-1 text-white`}>{item.status}</label>  </td>
                                                <td>
                                                    <label
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
                                                        item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED" && item.status != "REVIEWED" && (
                                                            <>
                                                                {/* <label
                                                                    onClick={() => {
                                                                        approveReimbursement(item.id)
                                                                    }}>
                                                                    <img id="" src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                                                </label>
                                                                <label
                                                                    onClick={() => {
                                                                        declineReimbursement(item.id)
                                                                    }}>
                                                                    <img id="" src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                                                                </label> */}
                                                                <label
                                                                    onClick={() => {
                                                                        cancelReimbursement(item.id)
                                                                    }}>
                                                                    <img id="undertime_eye_myutimg" src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                                                                </label>
                                                            </>
                                                        )
                                                    }
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
                                            <label className="font-bold">{`${reimbursementView.reviewerFirstName} ${reimbursementView.reviewerLastName}`} <br />
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
                                            <label className="font-bold">{`${reimbursementView.endorserFirstName} ${reimbursementView.endorserLastName}`} <br />
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
                                            <label className="font-bold">{`${reimbursementView.approverFirstName} ${reimbursementView.approverFirstName}`} <br />
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
                                            <label className="font-bold">{`${reimbursementView.declinerFirstName} ${reimbursementView.declinerLastName}`} <br />
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
                                    id="companyName"
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
                                    id="typeId"
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
                                    id="total"
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
                                    id="purpose"
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
                                                        <td>{data.receipt ? "Yes" : "No"}</td>
                                                        <td>{data.invoice}</td>
                                                        <td>{data.companyName}</td>
                                                        <td>{data.tin}</td>
                                                        <td>{data.transactionDate}</td>
                                                        <td>{Utility.formatToCurrency(data.amount)}</td>
                                                        <td>{data.fileName}</td>
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
                            onClick={() => {
                                setViewReimbursementModal(false)
                                setIsEditReimbursement(false)
                            }}
                            className="w-[150px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                            Close
                        </Button>
                        {/* {
                            reimbursementView && reimbursementView.status != "APPROVED" && reimbursementView.status != "DECLINED" && reimbursementView.status != "CANCELLED" && (
                                <button
                                    onClick={() => {
                                        if (isEditReimbursement) {
                                            updateReimbursement()
                                        } else {
                                            setIsEditReimbursement(true)
                                        }
                                    }}
                                    className="w-[150px] mr-2 rounded-md text-white bg-[#125667]" style={{ borderColor: '#189FB5' }}>
                                    {isEditReimbursement ? "Save Changes" : "Modify"}
                                </button>
                            )

                        } */}


                        {
                            !isEditReimbursement && reimbursementView && reimbursementView.status != "APPROVED" && reimbursementView.status != "DECLINED" && reimbursementView.status != "CANCELLED" ?
                                <>
                                    {/* <button
                                        onClick={() => approveReimbursement(reimbursementView.id)}
                                        className="w-[150px] mr-2 rounded-md text-white bg-[#2EBF91]" style={{ borderColor: '#189FB5' }}>
                                        Approve/Endorse
                                    </button>
                                    <button
                                        onClick={() => declineReimbursement(reimbursementView.id)}
                                        className="w-[150px] mr-2 rounded-md text-white bg-[#FF3838]" style={{ borderColor: '#189FB5' }}>
                                        Decline
                                    </button> */}
                                    <button
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
        </div>);
}