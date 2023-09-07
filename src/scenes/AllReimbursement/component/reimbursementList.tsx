import React, { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../../api";
import { Button, Form, FormLabel, Modal, Table } from "react-bootstrap";
import { Utility } from "../../../utils";
import ReactPaginate from "react-paginate";
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../../assets/images";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaTimes, FaTimesCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import EmployeeDropdown from "../../../components/EmployeeDropdown";
const ErrorSwal = withReactContent(Swal)

export const ReimbursementList = (props: any) => {
    const [allLeaves, setAllLeaves] = useState<any>([]);
    const [viewReimbursementModal, setViewReimbursementModal] = useState<any>(false);
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [isEditReimbursement, setIsEditReimbursement] = useState<any>(false);
    const [reimbursementType, setReimbursementType] = React.useState([])
    const [filterData, setFilterData] = React.useState([]);
    const [isBulkAction, setIsBulkAction] = useState<any>(false);
    const [isBulkPayload, setIsBulkPayload] = useState<any>(false);

    const [isDeclining, setIsDeclining] = useState<any>(false)
    const [isApproving, setIsApproving] = useState<any>(false)
    const [isCancelling, setIsCancelling] = useState<any>(false);
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const tableHeaders = [
        'Employee Name',
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

    useEffect(() => {
        if (reimbursementList) {
            const valuesObj: any = { ...reimbursementList }
            if (valuesObj.content) {
                let tempArray = [...valuesObj.content]
                let hasCheck: any = false
                let count: any = 0
                let ids: any = []
                tempArray.forEach((d: any, i: any) => {
                    if (d.isCheck) {
                        hasCheck = true
                        ids.push(d.id)
                        count = count + 1
                    }
                });
                setIsBulkAction(hasCheck)
                setIsBulkPayload({
                    "ids": ids,
                    "count": count
                })
            }
        }
    }, [reimbursementList])


    const onChangeCheckbox = (index: any, boolCheck: any) => {
        const valuesObj: any = { ...reimbursementList }
        if (valuesObj.content) {
            let tempArray = [...valuesObj.content]
            tempArray[index].isCheck = boolCheck
            setReimbursementList({ ...valuesObj })
        }

    }

    const unSelectAll = () => {
        let reimTemp: any = { ...reimbursementList }
        if (reimTemp.content) {
            let tempArray = [...reimTemp.content]
            tempArray.forEach((d: any, i: any) => {
                d.isCheck = false
            });
            setReimbursementList(reimTemp)
        }
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

                if (confirmButton)
                    confirmButton.id = "reimbursement_approvereimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "accessrights_approvereimbcancel_alertbtn"
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

    const bulkApproveReimbursement = () => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to bulk approve this reimbursement.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "reimbursement_bulakapprovereimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "reimbursement_bulkapprovereimbcancel_alertbtn"
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
                let payload: any = {
                    "ids": isBulkPayload && isBulkPayload.ids
                }

                RequestAPI.postRequest(Api.reimbursementBulkApprove, "", payload, {}, async (res: any) => {
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
                                        confirmButton.id = "reimbursement_errorconfirm3_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || (body.data.message),
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_successconfirm2_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: 'Something Error.',
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "reimbursement_errorconfirm4_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const bulkDeclineReimbursement = () => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to bulk decline this reimbursement.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "reimbursement_bulkdeclinereimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "accessrights_bulkdeclinereimbcancel_alertbtn"
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
                let payload: any = {
                    "ids": isBulkPayload && isBulkPayload.ids
                }

                RequestAPI.postRequest(Api.reimbursementBulkDecline, "", payload, {}, async (res: any) => {
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
                                        confirmButton.id = "reimbursement_errorconfirm5_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || (body.data.message),
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_successconfirm3_alertbtn"
                                },
                                icon: 'success',
                            })
                            getReimbursements(0)
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: 'Something Error!',
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "reimbursement_errorconfirm6_alertbtn"
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

                if (confirmButton)
                    confirmButton.id = "reimbursement_declinereimbconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "accessrights_declinereimbcancel_alertbtn"
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
                    cancelButton.id = "accessrights_cancelreimbcancel_alertbtn"
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

    const updateReimbursement = () => {
        if (reimbursementView) {
            const valuesObj: any = { ...reimbursementParentValues }
            if (valuesObj.total > 0 && valuesObj.total != "") {
                let payload: any = {
                    "approvedBudget": valuesObj.approvedBudget,
                    "total": valuesObj.total,
                    "purpose": valuesObj.purpose,
                    "remark": valuesObj.remark,
                    "typeId": valuesObj.typeId,
                    "parentId": valuesObj.parentId,
                }
                Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.putRequest(
                    Api.updateReimbursement,
                    "",
                    payload,
                    {},
                    async (res) => {
                        const { status, body = { data: {}, error: {} } } = res;
                        if (status === 200 || status === 201) {
                            if (body.error && body.error.message) {
                                Swal.close()
                                ErrorSwal.fire({
                                    title: 'Error!',
                                    text: (body.error && body.error.message) || "",
                                    didOpen: () => {
                                        const confirmButton = Swal.getConfirmButton();

                                        if (confirmButton)
                                            confirmButton.id = "reimbursement_errorconfirm11_alertbtn"
                                    },
                                    icon: 'error',
                                })
                            } else {
                                Swal.close()
                                ErrorSwal.fire({
                                    title: 'Success!',
                                    text: (body.data) || "",
                                    didOpen: () => {
                                        const confirmButton = Swal.getConfirmButton();

                                        if (confirmButton)
                                            confirmButton.id = "reimbursement_successconfirm6_alertbtn"
                                    },
                                    icon: 'success',
                                })
                                getReimbursements(0)
                                setIsEditReimbursement(false)
                                setViewReimbursementModal(false)
                            }
                        } else {
                            Swal.close()
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: 'Something Error.',
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "reimbursement_errorconfirm12_alertbtn"
                                },
                                icon: 'error',
                            })
                        }
                    }
                );
            } else {
                ErrorSwal.fire({
                    title: 'Error!',
                    text: 'Total amount should not be 0 or blank.',
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();

                        if (confirmButton)
                            confirmButton.id = "reimbursement_errorconfirm13_alertbtn"
                    },
                    icon: 'error',
                })
            }

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



    const [isSelectAll, setIsSelectAll] = useState<any>(false)
    return (
        <div>
            <div className="w-100 px-2 py-3">
                <div className="w-100">
                    <div className="pl-3 text-[#009FB5] text-lg ">
                        Search By:
                    </div>
                    <div className="row m-0 p-0 d-flex col-md-12">
                        <div className="col-md-3 col-lg-3">
                            <label>Employee</label>
                            <EmployeeDropdown
                                id="reimbursement_employee_maindropdown"
                                placeholder={"Employee"}
                                singleChangeOption={singleChangeOption}
                                name="userId"
                                value={filterData && filterData['userId']}
                            />
                        </div>
                        <div className="col-md-3 col-lg-2">
                            <label className="">Date From</label>
                            <input
                                id="reimbursement_datefrom_inputfield"
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

                        <div className="col-md-3 col-lg-2">
                            <label className="">Date To</label>
                            <div >
                                <input
                                    id="reimbursement_dateto_inputfield"
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
                        <div className="col-md-3 col-lg-2">
                            <label className="">Status</label>
                            <div >
                                <select
                                    className={`form-select `}
                                    name="status"
                                    id="reimbursement_status_inputfield"
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
                {
                    isBulkAction ?
                        <div className="w-100 py-1 mt-3 mb-2 px-2 rounded-md flex items-center justify-between bg-[#F5F5F5]">
                            <div className="font-bold text-[#009FB5]">
                                {isBulkPayload && isBulkPayload.count} Item/s Selected
                            </div>
                            <div className="flex">
                                <button
                                    id="reimbursement_bulkapprove_inputbtn"
                                    onClick={() => {
                                        bulkApproveReimbursement()
                                    }}
                                    className="px-3 py-2 mr-2 rounded-md text-white bg-[#3BB273] flex items-center" style={{ borderColor: '#189FB5' }}>
                                    <BsFillCheckCircleFill id="reimbursement_approveall_inputcbox" size={15} color="#fff" className="mr-1" /> Approve All Selected({isBulkPayload && isBulkPayload.count})
                                </button>
                                <button
                                    id="reimbursement_bulkdecline_inputbtn"
                                    onClick={() => {
                                        bulkDeclineReimbursement()
                                    }}
                                    className="px-3 py-2 rounded-md text-white bg-[#E15554] flex items-center" style={{ borderColor: '#189FB5' }}>
                                    <FaTimesCircle id="reimbursement_declineall_inputcbox" size={15} color="#fff" className="mr-1" /> Decline All Selected({isBulkPayload && isBulkPayload.count})
                                </button>
                                <button
                                    id="reimbursement_unselectall_inputbtn"
                                    onClick={() => {
                                        unSelectAll()
                                    }}
                                    className="px-3 py-2 rounded-md">
                                    <FaTimes id="reimbursement_unselectall_inputcbox" size={30} color="#323232" />
                                </button>
                            </div>
                        </div>
                        :
                        null
                }
                <div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th style={{ width: 10 }}>
                                    Select
                                    {/* <Form.Check
                                        type="checkbox"
                                        id="Select All"
                                        label="Select All"
                                        checked={isSelectAll}
                                        onChange={(e) => {
                                            setIsSelectAll(e.target.checked)
                                            selectAllEmployees(e.target.checked)
                                        }}
                                    /> */}
                                </th>
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
                                                <td>
                                                    <Form.Check
                                                        id={"payrollgenerate_ischeck_employeelistdata_" + item.id}
                                                        type="checkbox"
                                                        label=""
                                                        checked={item.isCheck}
                                                        onChange={(e) => {
                                                            onChangeCheckbox(index, e.target.checked)
                                                        }}
                                                    />
                                                </td>
                                                <td id={"reimbursement_name_tdtable_" + item.id}> {`${item.firstName} ${item.lastName}`} </td>
                                                <td id={"reimbursement_typename_tdtable_" + item.id}> {item.typeName} </td>
                                                {/* <td> {item.approvedBudget} </td> */}
                                                <td id={"reimbursement_total_tdtable_" + item.id}> {Utility.formatToCurrency(item.total)} </td>
                                                <td id={"reimbursement_filedate_tdtable_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                                <td id={"reimbursement_status_tdtable_" + item.id}> <label className={`bg-[${Utility.reimbursementStatus(item.status)}] rounded-md px-3 py-1 text-white`}>{item.status}</label>  </td>
                                                <td>
                                                    <label
                                                        id={"reimbursement_setreimburse_btn_" + item.id}
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
                                                        <img id={"reimbursement_setreimburse_img_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />
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
                        <label className="text-lg font-bold" id={"reimbursement_reimbursementprogress_modallabel"}>Reimbursement Progress</label>
                        <div className="mt-3 flex">
                            <BsFillCheckCircleFill color={"#2B7E88"} size={30} />
                            <div className="ml-3 ">
                                <label className="font-bold" id={"reimbursement_submittedforapproval_modallabel"}>Submitted for Approval
                                </label>
                            </div>
                        </div>
                        {
                            reimbursementView && reimbursementView.reviewerFirstName ?
                                <>
                                    <div className="mt-3 flex">
                                        <BsFillCheckCircleFill color={"#2B7E88"} size={30} />
                                        <div className="ml-3 ">
                                            <label className="font-bold" id={"reimbursement_name_modallabel"}>{`${reimbursementView.reviewerFirstName} ${reimbursementView.reviewerLastName}`} <br />
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
                                            <label className="font-bold" id={"reimbursement_name2_modallabel"}>{`${reimbursementView.endorserFirstName} ${reimbursementView.endorserLastName}`} <br />
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
                                            <label className="font-bold" id={"reimbursement_name3_modallabel"}>{`${reimbursementView.approverFirstName} ${reimbursementView.approverFirstName}`} <br />
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
                                            <label className="font-bold" id={"reimbursement_name4_modallabel"}>{`${reimbursementView.declinerFirstName} ${reimbursementView.declinerLastName}`} <br />
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
                                    id={"reimbursement_companyname_modalinput"}
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
                                <label>Status:</label><br />
                                <label id={"reimbursement_status_modalinput"} className={`bg-[${Utility.reimbursementStatus(reimbursementParentValues && reimbursementParentValues.status)}] rounded-md px-5 py-2 text-white`}>{reimbursementParentValues && reimbursementParentValues.status}</label>

                            </div>
                            <div className="form-group col-md-6 mb-3" >
                                <label>Type of Reimbursement:</label>
                                <select
                                    className={`form-select`}
                                    name="typeId"
                                    id={"reimbursement_typeid_modalinput"}
                                    disabled={true}
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
                                    id={"reimbursement_total_modalinput"}
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
                                    id={"reimbursement_purpose_modalinput"}
                                    className="form-control p-2"
                                    disabled={true}
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
                                                        <td id={"reimbursement_receipt_modaltable"}>{data.receipt ? "Yes" : "No"}</td>
                                                        <td id={"reimbursement_invoice_modaltable"}>{data.invoice}</td>
                                                        <td id={"reimbursement_companyname_modaltable"}>{data.companyName}</td>
                                                        <td id={"reimbursement_tin_modaltable"}>{data.tin}</td>
                                                        <td id={"reimbursement_transactionDate_modaltable"}>{data.transactionDate}</td>
                                                        <td id={"reimbursement_amount_modaltable"}>{Utility.formatToCurrency(data.amount)}</td>
                                                        <td id={"reimbursement_filename_modaltable"}>{data.fileName}</td>
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
                            id={"reimbursement_close_modalbtn"}
                            className="w-[150px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                            Close
                        </Button>
                        {
                            reimbursementView && reimbursementView.status != "APPROVED" && reimbursementView.status != "DECLINED" && reimbursementView.status != "CANCELLED" && (
                                <button
                                    onClick={() => {
                                        if (isEditReimbursement) {
                                            updateReimbursement()
                                        } else {
                                            setIsEditReimbursement(true)
                                        }
                                    }}
                                    id={"reimbursement_savechanges_modalbtn"}
                                    className="w-[150px] mr-2 rounded-md text-white bg-[#125667]" style={{ borderColor: '#189FB5' }}>
                                    {isEditReimbursement ? "Save Changes" : "Modify"}
                                </button>
                            )

                        }


                        {
                            !isEditReimbursement && reimbursementView && reimbursementView.status != "APPROVED" && reimbursementView.status != "DECLINED" && reimbursementView.status != "CANCELLED" ?
                                <>
                                    <button
                                        onClick={() => {
                                            setIsApproving(true)
                                            approveReimbursement(reimbursementView.id)
                                        }}
                                        disabled={isApproving}
                                        id={"reimbursement_approvendorse_modalbtn"}
                                        className="w-[150px] mr-2 rounded-md text-white bg-[#2EBF91]" style={{ borderColor: '#189FB5' }}>
                                        {isApproving ?
                                            <div className="d-flex justify-content-center">
                                                <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                                Approve/Endorse
                                            </div>
                                            : "Approve/Endorse"
                                        }
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDeclining(true)
                                            declineReimbursement(reimbursementView.id)
                                        }}
                                        disabled={isDeclining}
                                        id={"reimbursement_decline_modalbtn"}
                                        className="w-[150px] mr-2 rounded-md text-white bg-[#FF3838]" style={{ borderColor: '#189FB5' }}>
                                        {isDeclining ?
                                            <div className="d-flex justify-content-center">
                                                <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                                Declining
                                            </div>
                                            : "Decline"
                                        }
                                    </button>
                                </>
                                :
                                null
                        }

                        {
                            !isEditReimbursement && reimbursementView && reimbursementView.status != "DECLINED" && reimbursementView.status != "CANCELLED" ?
                                <>
                                    <button
                                        onClick={() => {
                                            setIsCancelling(true)
                                            cancelReimbursement(reimbursementView.id)
                                        }}
                                        disabled={isCancelling}
                                        id={"reimbursement_retractcancel_modalbtn"}
                                        className="w-[150px] mr-2 rounded-md text-white bg-[#838383]" style={{ borderColor: '#189FB5' }}>
                                        {isCancelling ?
                                            <div className="d-flex justify-content-center">
                                                <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                                Retract/Cancel
                                            </div>
                                            : "Retract/Cancel"
                                        }
                                    </button>
                                </>
                                :
                                null
                        }

                    </div>
                </Modal.Body>
            </Modal>
        </div>);
}