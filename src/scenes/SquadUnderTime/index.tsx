import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Form, Modal } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux"
import ReactPaginate from 'react-paginate';
import { action_approve, action_edit, action_cancel, action_decline } from "../../assets/images"


export const SquadUndertime = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { history } = props
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const { authorizations } = data?.profile
    const [modalShow, setModalShow] = React.useState(false);
    const [key, setKey] = React.useState('all');
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
        getMyUT(0, "")
    }, [])

    const handlePageClick = (event: any) => {
        getMyUT(event.selected, "")
    };
    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
      }

    const getMyUT = (page: any = 0, status: any = "All") => {

        let queryString = ""
        let filterDataTemp = { ...filterData }
        if(status != ""){
          queryString = "&status="+ status
        }else{
          if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
              if (filterDataTemp[d]) {
                
                queryString += `&${d}=${filterDataTemp[d]}`
              } else {
                queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
              }
            })
          }
        }
        if (data.profile.role == 'ADMIN' || data.profile.role == 'APPROVER'){
            RequestAPI.getRequest(
                `${Api.allSquadUndertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
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
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.postRequest(Api.approveUT, "", { "id": id }, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                        } else {
                            getMyUT(0, "")
                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                            )
                        }
                    } else {
                        ErrorSwal.fire(
                            'Error!',
                            'Something Error.',
                            'error'
                        )
                    }
                })
            }
        })
    }
    const cancelUndertime = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to cancel this undertime.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.postRequest(Api.cancelUndertime, "", { "id": id }, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                        } else {
                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                            )
                            getMyUT(0, "")
                        }
                    } else {
                        ErrorSwal.fire(
                            'Error!',
                            'Something Error.',
                            'error'
                        )
                    }
                })
            }
        })
    }

    const declineUT = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to decline this undertime.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.postRequest(Api.declineUT, "", { "id": id }, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire(
                                'Error!',
                                (body.error && body.error.message) || "",
                                'error'
                            )
                        } else {
                            getMyUT(0, '')
                            ErrorSwal.fire(
                                'Success!',
                                (body.data) || "",
                                'success'
                            )
                        }
                    } else {
                        ErrorSwal.fire(
                            'Error!',
                            'Something Error.',
                            'error'
                        )
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

    const underTimeTable = useCallback(() => {
        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            <th style={{ width: 'auto' }}>Employee Name</th>
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
                                        <td> {item.lastName}, {item.firstName}</td>
                                        <td> {item.shiftDate} </td>
                                        <td> {item.utStart.replace('T', ' ')} </td>
                                        <td> {item.utEnd.replace('T', ' ')} </td>
                                        <td> {item.fileDate} </td>
                                        <td> {item.reason} </td>
                                        <td> {item.statusChangedBy} </td>
                                        <td> {item.status} </td>
                                        <td>
                                            {
                                                item.status != "APPROVED" && item.status != "DECLINED_CANCELLED" ?
                                                    <>
                                                    {authorizations.includes("Request:Update") ? (
                                                        <>
                                                        <label
                                                            onClick={() => {
                                                                getUT(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />

                                                        </label>
                                                        </>
                                                    ) : null}
                                                    {authorizations.includes("Request:Approve") ? (
                                                        <>
                                                        <label
                                                            onClick={() => {
                                                                approveUT(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />

                                                        </label>
                                                        </>
                                                    ) : null}
                                                    {authorizations.includes("Request:Reject") ? (
                                                        <>
                                                        <label
                                                            onClick={() => {
                                                                declineUT(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            <img src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />

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
                                                                    onClick={() => {
                                                                        cancelUndertime(item.id)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    <img src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
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

    return (
        <div className="body">
            <div className="wraper">
                <div className="w-100">
                    <div className="topHeader">
                        <UserTopMenu />
                    </div>
                    <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh' }}>
                        <DashboardMenu />
                        <div className="col-md-12 col-lg-10 px-5 py-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="bold-text">Good Day, {userData.data.profile.firstName}!</h2>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                {/* <h3>OTs & UTs</h3>
                    <div className="row p-0 m-0 pt-2">
                    <div className="col-md-3">
                        <h5>Monthly Total OTs:</h5>
                        <h5>Monthly Total UTs:</h5>
                    </div>
                    <div className="col-md-3">
                        <h5>200 mins</h5>
                        <h5>150 mins</h5>
                    </div>
                    
                    </div> */}
                   
                                <div className="w-100 pt-2">
                                    <div className="fieldtext d-flex col-md-3">
                                        <div>
                                            <label>Date From</label>
                                            <div>
                                                <input
                                                name="dateFrom"
                                                type="date"
                                                autoComplete="off"
                                                className="formControl"
                                                onChange={(e) => makeFilterData(e)}
                                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label>Date To</label>
                                            <div className="input-container">
                                                <input
                                                name="dateTo"
                                                type="date"
                                                autoComplete="off"
                                                className="formControl"
                                                onChange={(e) => makeFilterData(e)}
                                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label>Date Filed</label>
                                            <div className="input-container">
                                                <input
                                                name="dateFiled"
                                                type="date"
                                                autoComplete="off"
                                                className="formControl"
                                                onChange={(e) => makeFilterData(e)}
                                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                            style={{ width: 120}}
                                            onClick={() => getMyUT(0,"")}
                                            className="btn btn-primary mx-2 mt-4">
                                            Search
                                            </Button>
                                        </div>
                                    </div>
                                   
                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={key}
                                        onSelect={(k: any) => {
                                            getMyUT(0, k)
                                            setKey(k)
                                        }}
                                        className="mb-3"
                                    >
                                        <Tab eventKey="all" title="All">
                                            {underTimeTable()}
                                        </Tab>
                                        <Tab eventKey="pending" title="Pending">
                                            {underTimeTable()}
                                        </Tab>
                                        <Tab eventKey="approved" title="Approved" >
                                            {underTimeTable()}
                                        </Tab>
                                        <Tab eventKey="declined" title="Rejected/Cancelled">
                                            {underTimeTable()}
                                        </Tab>
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
                                    activeClassName="active-page-link"
                                    pageLinkClassName="page-link"
                                    renderOnZeroPageCount={null}
                                />
                                </div>
                            </div>
                            {authorizations.includes("Request:Create") ? (
                                <>
                                <div className="d-flex justify-content-end mt-3" >
                                <div>
                                   
                                </div>
                            </div>
                                </>
                            ) : null}
                            
                        </div>
                    </div>
                </div>
                {/* Create User Modal Form */}
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
                                const valuesObj: any = { ...values }
                                setOnSubmit(true)
                                if (utId) {
                                    valuesObj.id = utId
                                    RequestAPI.putRequest(Api.updateUT, "", valuesObj, {}, async (res: any) => {
                                        const { status, body = { data: {}, error: {} } }: any = res
                                        if (status === 200 || status === 201) {
                                            if (body.error && body.error.message) {
                                                ErrorSwal.fire(
                                                    'Error!',
                                                    (body.error && body.error.message) || "",
                                                    'error'
                                                )
                                            } else {
                                                getMyUT(0, "")
                                                ErrorSwal.fire(
                                                    'Success!',
                                                    (body.data) || "",
                                                    'success'
                                                )
                                                setModalShow(false)
                                                formRef.current?.resetForm()
                                            }
                                        } else {
                                            ErrorSwal.fire(
                                                'Error!',
                                                (body.error && body.error.message) || "Something error!",
                                                'error'
                                            )
                                        }
                                    })
                                } else {
                                    RequestAPI.postRequest(Api.UTCreate, "", valuesObj, {}, async (res: any) => {
                                        const { status, body = { data: {}, error: {} } }: any = res
                                        if (status === 200 || status === 201) {
                                            if (body.error && body.error.message) {
                                                ErrorSwal.fire(
                                                    'Error!',
                                                    (body.error && body.error.message) || "",
                                                    'error'
                                                )
                                            } else {
                                                getMyUT(0, "")
                                                ErrorSwal.fire(
                                                    'Success!',
                                                    (body.data) || "",
                                                    'success'
                                                )
                                                setModalShow(false)
                                                formRef.current?.resetForm()
                                            }
                                        } else {
                                            ErrorSwal.fire(
                                                'Error!',
                                                (body.error && body.error.message) || "Something error!",
                                                'error'
                                            )
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
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
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
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.utStart}</p>
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
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.utEnd}</p>
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
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                                                )}
                                            </div>
                                        </div>
                                        <br />
                                        <Modal.Footer>
                                            <div className="d-flex justify-content-end px-5">
                                                <button
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
                {/* End Create User Modal Form */}
            </div>
        </div>
    )
}
