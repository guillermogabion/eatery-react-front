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


export const Undertime = (props: any) => {
    const { history } = props
    const [modalShow, setModalShow] = React.useState(false);
    const [key, setKey] = React.useState('all');
    const [myut, setMyUT] = useState<any>([]);
    const [utId, setUtId] = useState<any>("");
    const [initialValues, setInitialValues] = useState<any>({
        "shiftDate": moment().format("YYYY-MM-DD"),
        "utStart": "",
        "utEnd": "",
        "reason": ""
    })
    const formRef: any = useRef()

    useEffect(() => {
        getMyUT(0, "")
    }, [])

    const getMyUT = (page: any = 0, status: any = "All") => {
        RequestAPI.getRequest(
            `${Api.myUT}?size=10&page=${page}&sort=id&sortDir=desc&status=${status}`,
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
                        valueObj.utStart = moment(valueObj.utStart).format("hh:mm:ss")
                        valueObj.utEnd = moment(valueObj.utEnd).format("hh:mm:ss")
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
                            <th style={{ width: 'auto' }}>Shift Date</th>
                            <th style={{ width: 'auto' }}>UT Start</th>
                            <th style={{ width: 'auto' }}>UT End</th>
                            <th style={{ width: 'auto' }}>Reason</th>
                            <th style={{ width: 'auto' }}>Status</th>
                            <th style={{ width: 'auto' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myut &&
                            myut.content &&
                            myut.content.length &&
                            myut.content.map((item: any, index: any) => {
                                return (
                                    <tr>
                                        <td> {item.shiftDate} </td>
                                        <td> {item.utStart} </td>
                                        <td> {item.utEnd} </td>
                                        <td> {item.reason} </td>
                                        <td> {item.status} </td>
                                        <td>
                                            {
                                                item.status != "APPROVED" && item.status != "DECLINED" ?
                                                    <>
                                                        <label
                                                            onClick={() => {
                                                                getUT(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            Update
                                                        </label>
                                                        <br />
                                                        <label
                                                            onClick={() => {
                                                                approveUT(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            Approve
                                                        </label> <br />
                                                        <label
                                                            onClick={() => {
                                                                declineUT(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">
                                                            Decline
                                                        </label>
                                                        <br />
                                                    </>
                                                    :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
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
                                    <h2>Good day, Employee 001!</h2>
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
                                <div className="w-100 pt-4">
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
                            <div className="d-flex justify-content-end mt-3" >
                                <div>
                                    <Button
                                        className="mx-2"
                                        onClick={() => {
                                            setModalShow(true)
                                        }}>Request Undertime</Button>
                                </div>
                            </div>
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
                            Request Undertime
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="row w-100 px-5">
                        <Formik
                            innerRef={formRef}
                            initialValues={initialValues}
                            enableReinitialize={true}
                            validationSchema={null}
                            onSubmit={(values, actions) => {
                                const valuesObj: any = { ...values }

                                if (utId) {
                                    valuesObj.id = utId
                                    valuesObj.utStart = valuesObj.shiftDate + "T" + valuesObj.utStart
                                    valuesObj.utEnd = valuesObj.shiftDate + "T" + valuesObj.utEnd
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
                                                'Something Error.',
                                                'error'
                                            )
                                        }
                                    })
                                } else {
                                    valuesObj.utStart = valuesObj.shiftDate + "T" + valuesObj.utStart
                                    valuesObj.utEnd = valuesObj.shiftDate + "T" + valuesObj.utEnd
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
                                                'Something Error.',
                                                'error'
                                            )
                                        }
                                    })
                                }

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
                                            </div>
                                            <div className="form-group col-md-6 mb-3" >
                                                <label>Start</label>
                                                <input type="time"
                                                    name="utStart"
                                                    id="utStart"
                                                    step="1"
                                                    className="form-control"
                                                    value={values.utStart}
                                                    onChange={(e) => {
                                                        setFormField(e, setFieldValue)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-6 mb-3" >
                                                <label>End</label>
                                                <input type="time"
                                                    name="utEnd"
                                                    id="utEnd"
                                                    step="1"
                                                    className="form-control"
                                                    value={values.utEnd}
                                                    onChange={(e) => {
                                                        setFormField(e, setFieldValue)
                                                    }}
                                                />
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
                                            </div>
                                        </div>
                                        <br />
                                        <Modal.Footer>
                                            <div className="d-flex justify-content-end px-5">
                                                <button
                                                    type="submit"
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