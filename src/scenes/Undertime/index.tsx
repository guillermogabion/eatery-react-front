import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { Formik } from "formik"
import moment from "moment"
import { Button, Form, Modal } from "react-bootstrap"
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import * as Yup from "yup"
import { Api, RequestAPI } from "../../api"
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)

export const Undertime = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { history } = props
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const { authorizations } = data?.profile
    const [modalShow, setModalShow] = React.useState(false);
    const [viewModalShow, setViewModalShow] = React.useState(false);
    const [key, setKey] = React.useState('all');
    const [actionable, setIsActionable] = React.useState(false);
    const [myut, setMyUT] = useState<any>([]);
    const [utId, setUtId] = useState<any>("");
    const [onSubmit, setOnSubmit] = useState<any>(false);
    const [filterData, setFilterData] = React.useState([]);
    let initialPayload = {
        "shiftDate": moment().format("YYYY-MM-DD"),
        "utStart": "",
        "utEnd": "",
        "reason": ""
    }
    const [initialValues, setInitialValues] = useState<any>(initialPayload)
    const formRef: any = useRef()

    useEffect(() => {
        getMyUT(0, key)
    }, [])

    const handlePageClick = (event: any) => {
        getMyUT(event.selected, key)
    };
    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    const getMyUT = (page: any = 0, status: any = "all", isActionable: any = false) => {
        setKey(status)
        setIsActionable(isActionable)

        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (status == 'actionable') {
            queryString = "&status=all"
        }
        else if (status != "") {
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

        if (status == 'actionable') {
            queryString += '&actionableOnly=true'
        }

        if (data.profile.role == 'EXECUTIVE') {
            RequestAPI.getRequest(
                `${Api.allUndertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
                "",
                {},
                {},
                async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 && body) {
                        if (body.error && body.error.message) {
                        } else {
                            setMyUT(body.data)
                        }
                    }
                }
            )
        } else {
            RequestAPI.getRequest(
                `${Api.myUT}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
                "",
                {},
                {},
                async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 && body) {
                        if (body.error && body.error.message) {
                        } else {
                            setMyUT(body.data)
                        }
                    }
                }
            )
        }
    }

    const approveUT = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to approve this undertime.",
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "undertime_approveutconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "undertime_approveutcancel_alertbtn"
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.postRequest(Api.approveUT, "", { "id": id }, {}, async (res: any) => {
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
                                        confirmButton.id = "undertime_errorconfirm_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            Swal.close()
                            getMyUT(0, key)
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "undertime_successconfirm_alertbtn"
                                },
                                icon: 'success',
                            })
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "undertime_errorconfirm2_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const cancelUndertime = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to cancel this undertime.",
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "undertime_cancelutconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "undertime_cancelutcancel_alertbtn"
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingSwal = Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.postRequest(Api.cancelUndertime, "", { "id": id }, {}, async (res: any) => {
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
                                        confirmButton.id = "undertime_errorconfirm3_alertbtn"
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
                                        confirmButton.id = "undertime_successconfirm2_alertbtn"
                                },
                                icon: 'success',
                            })
                            getMyUT(0, key)
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "undertime_errorconfirm4_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const declineUT = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to decline this undertime.",
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                if (confirmButton)
                    confirmButton.id = "undertime_declineutconfirm_alertbtn"

                if (cancelButton)
                    cancelButton.id = "undertime_declineutcancel_alertbtn"
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                RequestAPI.postRequest(Api.declineUT, "", { "id": id }, {}, async (res: any) => {
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
                                        confirmButton.id = "undertime_errorconfirm5_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            Swal.close()
                            getMyUT(0, key)
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || "",
                                didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();

                                    if (confirmButton)
                                        confirmButton.id = "undertime_successconfirm3_alertbtn"
                                },
                                icon: 'success',
                            })
                        }
                    } else {
                        Swal.close()
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                                const confirmButton = Swal.getConfirmButton();

                                if (confirmButton)
                                    confirmButton.id = "undertime_errorconfirm6_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const getUT = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.utInformation}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        valueObj.utStart = moment(valueObj.utStart).format("HH:mm")
                        valueObj.utEnd = moment(valueObj.utEnd).format("HH:mm")
                        setInitialValues(valueObj)
                        // the value of valueObj.id is null - API issue for temp fixing I set ID directly
                        setUtId(id)
                        setModalShow(true)
                    }
                }
            }
        )
    }

    const viewUT = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.utInformation}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        const valueObj: any = body.data
                        valueObj.utStart = moment(valueObj.utStart).format("HH:mm")
                        valueObj.utEnd = moment(valueObj.utEnd).format("HH:mm")
                        setInitialValues(valueObj)
                        // the value of valueObj.id is null - API issue for temp fixing I set ID directly
                        setUtId(id)
                        setViewModalShow(true)
                    }
                }
            }
        )
    }

    const underTimeTable = useCallback(() => {
        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            {
                                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <>
                                        <th style={{ width: 'auto' }}>Employee Name</th>
                                    </> : null
                            }
                            <th style={{ width: 'auto' }}>Shift Date</th>
                            <th style={{ width: 'auto' }}>UT Start</th>
                            <th style={{ width: 'auto' }}>UT End</th>
                            <th style={{ width: 'auto' }}>Date Filed</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Action Taken By</th>
                            <th style={{ width: 'auto' }}>Status</th>
                            <th style={{ width: 'auto' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myut &&
                            myut.content &&
                            myut.content.length > 0 &&
                            myut.content.map((item: any, index: any) => {
                                return (
                                    <tr>
                                        {
                                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                <>
                                                    <td id={"undertime_name_myutdata_" + item.id}> {item.lastName}, {item.firstName} </td>
                                                </> : null
                                        }
                                        <td id={"undertime_shiftdate_myutdata_" + item.id}> {Utility.formatDate(item.shiftDate, 'MM-DD-YYYY')} </td>
                                        <td id={"undertime_utstart_myutdata_" + item.id}> {Utility.formatDate(item.utStart.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id={"undertime_utend_myutdata_" + item.id}> {Utility.formatDate(item.utEnd.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                                        <td id={"undertime_filedate_myutdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                                        <td id={"undertime_reason_myutdata_" + item.id}> {item.reason} </td>
                                        <td id={"undertime_statuschangedby_myutdata_" + item.id}> {item.statusChangedBy} </td>
                                        <td id={"undertime_status_myutdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                                        <td className="d-flex">
                                            <label
                                                id={"undertime_view_myutlabel_" + item.id}
                                                onClick={() => {
                                                    viewUT(item.id)
                                                }}
                                            >
                                                <img id={"undertime_eye_myutimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                                            </label>
                                            {
                                                item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED" ?
                                                    <>
                                                        {authorizations.includes("Request:Update") ? (
                                                            <>
                                                                <label
                                                                    id={"undertime_actionedit_myutlabel_" + item.id}
                                                                    onClick={() => {
                                                                        getUT(item.id)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    <img id={"undertime_name_myutdata_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                                </label>
                                                            </>
                                                        ) : null}
                                                        {authorizations.includes("Request:Approve") && data.profile.role == 'EXECUTIVE' ? (
                                                            <>
                                                                <label
                                                                    id={"undertime_actionapprove_myutlabel_" + item.id}
                                                                    onClick={() => {
                                                                        approveUT(item.id)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    <img id={"undertime_name_myutimg_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                                                </label>
                                                            </>
                                                        ) : null}
                                                        {authorizations.includes("Request:Reject") && data.profile.role == 'EXECUTIVE' ? (
                                                            <>
                                                                <label
                                                                    id={"undertime_actiondecline_myutlabel_" + item.id}
                                                                    onClick={() => {
                                                                        declineUT(item.id)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    <img id={"undertime_actiondecline_myutimg_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                                                                </label>

                                                            </>
                                                        ) : null}
                                                    </>
                                                    :
                                                    null
                                            }
                                            {
                                                item.status == "APPROVED" || item.status == "PENDING" ?
                                                    <>
                                                        {authorizations.includes("Request:Update") ? (
                                                            <>
                                                                <label
                                                                    id={"undertime_actioncancel_myutlabel_" + item.id}
                                                                    onClick={() => {
                                                                        cancelUndertime(item.id)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    <img id={"undertime_actioncancel_myutimg_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                                                                </label>

                                                            </>
                                                        ) : null}
                                                    </>
                                                    : null
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                {
                    myut &&
                        myut.content &&
                        myut.content.length == 0 ?
                        <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                }
            </div>
        )
    }, [myut])

    const setFormField = (e: any, setFieldValue: any) => {
        if (setFieldValue) {
            const { name, value } = e.target
            setFieldValue(name, value)
            setFieldValue("formoutside", true)
        }
    }

    const singleChangeOption = (option: any, name: any) => {

        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }

    return (
        <ContainerWrapper contents={<>
            <div className="w-100 col-md-12 col-lg-10 px-3 py-5">
                <div>
                    <div className="w-100 pt-2">
                        <div className="row d-flex">
                            {
                                data.profile.role == 'EXECUTIVE' ?
                                    <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                        <label>Employee</label>
                                        <EmployeeDropdown
                                            id="undertime_employee_maindropdown"
                                            placeholder={"Employee"}
                                            singleChangeOption={singleChangeOption}
                                            name="userId"
                                            value={filterData && filterData['userId']}
                                        />
                                    </div>
                                    :
                                    null
                            }
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date From</label>
                                <input
                                    id="undertime_datefrom_maininput"
                                    name="dateFrom"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date To</label>
                                <input
                                    id="undertime_dateto_maininput"
                                    name="dateTo"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <label>Date Filed</label>
                                <input
                                    id="undertime_datefiled_maininput"
                                    name="dateFiled"
                                    type="date"
                                    autoComplete="off"
                                    className="formControl"
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <Button
                                    id="undertime_search_mainbtn"
                                    style={{ width: '100%' }}
                                    onClick={() => getMyUT(0, key, actionable)}
                                    className="btn btn-primary mx-2 mt-4">
                                    Search
                                </Button>
                            </div>
                        </div>
                        <div className="fieldtext d-flex col-md-3 w-100">

                            <div>

                            </div>
                            <div>

                            </div>
                            <div>

                            </div>
                            <div>

                            </div>
                        </div>

                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k: any) => {
                                setMyUT([])

                                if (k == 'actionable') {
                                    getMyUT(0, k, true)
                                } else {
                                    getMyUT(0, k)
                                }
                            }}
                            className="mb-3"
                        >
                            <Tab id="undertime_all_maintab" eventKey="all" title="All">
                                {underTimeTable()}
                            </Tab>
                            <Tab id="undertime_pending_maintab" eventKey="pending" title="Pending">
                                {underTimeTable()}
                            </Tab>
                            <Tab id="undertime_approved_maintab" eventKey="approved" title="Approved" >
                                {underTimeTable()}
                            </Tab>
                            <Tab id="undertime_declined_maintab" eventKey="declined" title="Rejected/Cancelled">
                                {underTimeTable()}
                            </Tab>
                            {
                                data.profile.role == 'EXECUTIVE' &&
                                (
                                    <Tab id="undertime_actionable_maintab" eventKey="actionable" title="Actionable">
                                        {underTimeTable()}
                                    </Tab>
                                )
                            }
                        </Tabs>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <div className="">
                        <ReactPaginate
                            className="d-flex justify-content-center align-items-center"
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={(myut && myut.totalPages) || 0}
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
                {authorizations.includes("Request:Create") ? (
                    <>
                        <div className="d-flex justify-content-end mt-3" >
                            <div>
                                <Button
                                    id="undertime_requestundertime_mainbtn"
                                    className="mx-2"
                                    onClick={() => {
                                        setUtId("")
                                        setInitialValues(initialPayload)
                                        setModalShow(true)
                                    }}>Request Undertime</Button>
                            </div>
                        </div>
                    </>
                ) : null}

            </div>
            <Modal
                show={modalShow}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {/* Request Undertime */}
                        {utId ? 'Update Undertime Request' : 'Create Undertime Request'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                shiftDate: Yup.string().required("Shift date is required !"),
                                utStart: Yup.string().required("Undertime start is required !"),
                                utEnd: Yup.string().required("Undertime end is required !"),
                                reason: Yup.string().required("Reason is required !"),
                            })
                        }
                        onSubmit={(values, actions) => {
                            const loadingSwal = Swal.fire({
                                title: '',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },

                            });
                            const valuesObj: any = { ...values }
                            setOnSubmit(true)
                            if (utId) {
                                valuesObj.id = utId
                                RequestAPI.putRequest(Api.updateUT, "", valuesObj, {}, async (res: any) => {
                                    const { status, body = { data: {}, error: {} } }: any = res
                                    if (status === 200 || status === 201) {
                                        if (body.error && body.error.message) {
                                            ErrorSwal.fire({
                                                title: 'Error!',
                                                text: (body.error && body.error.message) || "",
                                                didOpen: () => {
                                                    const confirmButton = Swal.getConfirmButton();

                                                    if (confirmButton)
                                                        confirmButton.id = "undertime_errorconfirm7_alertbtn"
                                                },
                                                icon: 'error',
                                            })
                                        } else {
                                            getMyUT(0, key)
                                            ErrorSwal.fire({
                                                title: 'Success!',
                                                text: (body.data) || "",
                                                didOpen: () => {
                                                    const confirmButton = Swal.getConfirmButton();

                                                    if (confirmButton)
                                                        confirmButton.id = "undertime_successconfirm4_alertbtn"
                                                },
                                                icon: 'success',
                                            })
                                            setModalShow(false)
                                            formRef.current?.resetForm()
                                        }
                                    } else {
                                        ErrorSwal.fire({
                                            title: 'Error!',
                                            text: (body.error && body.error.message) || "Something error!",
                                            didOpen: () => {
                                                const confirmButton = Swal.getConfirmButton();

                                                if (confirmButton)
                                                    confirmButton.id = "undertime_errorconfirm8_alertbtn"
                                            },
                                            icon: 'error',
                                        })
                                    }
                                })
                            } else {
                                RequestAPI.postRequest(Api.UTCreate, "", valuesObj, {}, async (res: any) => {
                                    Swal.close();
                                    const { status, body = { data: {}, error: {} } }: any = res
                                    if (status === 200 || status === 201) {
                                        if (body.error && body.error.message) {
                                            ErrorSwal.fire({
                                                title: 'Error!',
                                                text: (body.error && body.error.message) || "",
                                                didOpen: () => {
                                                    const confirmButton = Swal.getConfirmButton();

                                                    if (confirmButton)
                                                        confirmButton.id = "undertime_errorconfirm9_alertbtn"
                                                },
                                                icon: 'error',
                                            })
                                        } else {
                                            getMyUT(0, key)
                                            ErrorSwal.fire({
                                                title: 'Success!',
                                                text: (body.data) || "",
                                                didOpen: () => {
                                                    const confirmButton = Swal.getConfirmButton();

                                                    if (confirmButton)
                                                        confirmButton.id = "undertime_successconfirm5_alertbtn"
                                                },
                                                icon: 'success',
                                            })
                                            setModalShow(false)
                                            formRef.current?.resetForm()
                                        }
                                    } else {
                                        ErrorSwal.fire({
                                            title: 'Error!',
                                            text: (body.error && body.error.message) || "Something error!",
                                            didOpen: () => {
                                                const confirmButton = Swal.getConfirmButton();

                                                if (confirmButton)
                                                    confirmButton.id = "undertime_errorconfirm10_alertbtn"
                                            },
                                            icon: 'error',
                                        })
                                    }
                                })
                            }
                            setOnSubmit(false)
                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">

                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Date</label>
                                            <input type="date"
                                                name="shiftDate"
                                                id="shiftDate"
                                                className="form-control"
                                                value={values.shiftDate}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue)
                                                }}
                                            />
                                            {errors && errors.shiftDate && (
                                                <p id="undertime_errorshiftdate_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Start</label>
                                            <input type="time"
                                                name="utStart"
                                                id="utStart"
                                                className="form-control"
                                                value={values.utStart}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue)
                                                }}
                                            />
                                            {errors && errors.utStart && (
                                                <p id="undertime_errorutstart_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.utStart}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>End</label>
                                            <input type="time"
                                                name="utEnd"
                                                id="utEnd"
                                                className="form-control"
                                                value={values.utEnd}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue)
                                                }}
                                            />
                                            {errors && errors.utEnd && (
                                                <p id="undertime_errorutend_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.utEnd}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Reason</label>
                                            <textarea
                                                name="reason"
                                                id="reason"
                                                className="form-control p-2"
                                                style={{ minHeight: 100 }}
                                                value={values.reason}
                                                onChange={(e) => setFormField(e, setFieldValue)}
                                            />
                                            {errors && errors.reason && (
                                                <p id="undertime_errorreason_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-end px-5">
                                            <button
                                                id="undertime_save_modalbtn"
                                                type="submit"
                                                disabled={onSubmit}
                                                className="btn btn-primary">
                                                Save
                                            </button>
                                        </div>
                                    </Modal.Footer>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>

            <Modal
                show={viewModalShow}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setViewModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Undertime
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                shiftDate: Yup.string().required("Shift date is required !"),
                                utStart: Yup.string().required("Undertime start is required !"),
                                utEnd: Yup.string().required("Undertime end is required !"),
                                reason: Yup.string().required("Reason is required !"),
                            })
                        }
                        onSubmit={(values, actions) => {

                        }}>
                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">

                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Date</label>
                                            <input type="date"
                                                name="shiftDate"
                                                id="shiftDate"
                                                disabled={true}
                                                className="form-control"
                                                value={values.shiftDate}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue)
                                                }}
                                            />
                                            {errors && errors.shiftDate && (
                                                <p id="undertime_errorshiftdate_modalviewp" style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>Start</label>
                                            <input type="time"
                                                name="utStart"
                                                id="utStart"
                                                disabled={true}
                                                className="form-control"
                                                value={values.utStart}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue)
                                                }}
                                            />
                                            {errors && errors.utStart && (
                                                <p id="undertime_errorutstartmodalviewp" style={{ color: "red", fontSize: "12px" }}>{errors.utStart}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-6 mb-3" >
                                            <label>End</label>
                                            <input type="time"
                                                name="utEnd"
                                                id="utEnd"
                                                disabled={true}
                                                className="form-control"
                                                value={values.utEnd}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue)
                                                }}
                                            />
                                            {errors && errors.utEnd && (
                                                <p id="undertime_errorutend_modalviewp" style={{ color: "red", fontSize: "12px" }}>{errors.utEnd}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Reason</label>
                                            <textarea
                                                name="reason"
                                                id="reason"
                                                disabled={true}
                                                className="form-control p-2"
                                                style={{ minHeight: 100 }}
                                                value={values.reason}
                                                onChange={(e) => setFormField(e, setFieldValue)}
                                            />
                                            {errors && errors.reason && (
                                                <p id="undertime_errorreason_modalviewp" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>} />

    )
}
