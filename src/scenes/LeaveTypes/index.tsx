import { Formik } from "formik"
import moment from "moment"
import React, { useCallback, useEffect, useRef, useState } from "react"
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
import DashboardMenu from "../../components/DashboardMenu"
import TimeDate from "../../components/TimeDate"
import UserTopMenu from "../../components/UserTopMenu"
const ErrorSwal = withReactContent(Swal)
import { action_approve, action_edit, action_cancel, action_decline } from "../../assets/images"

export const LeaveTypes = (props: any) => {
    const { history } = props
    let initialPayload = {
        "name": "",
        "description": ""
    }


    const userData = useSelector((state: any) => state.rootReducer.userData)
    const masterList = useSelector((state: any) => state.rootReducer.masterList)
    const [onSubmit, setOnSubmit] = useState<any>(false);

    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const { authorizations } = data?.profile
    const [modalShow, setModalShow] = React.useState(false);
    const [key, setKey] = React.useState('all');
    const [leaveTypes, setLeaveTypes] = useState<any>([]);
    const [allLeaveTypes, setAllLeaveTypes] = useState<any>([]);
    const [leaveTypeId, setLeaveTypeId] = useState<any>("");
    const [otClassification, setOtClassification] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [initialValues, setInitialValues] = useState<any>({
        "name": "",
        "description": ""
    })
    const formRef: any = useRef()

    useEffect(() => {
        getLeaveTypes()
    }, [])

    const handlePageClick = (event: any) => {
        getLeaveTypes(event.selected, "")
    };

    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    const getLeaveTypes = (page: any = 0, status: any = "All") => {

        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (status != "") {
            queryString = "&status=" + status
        } else {
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
        RequestAPI.getRequest(
            `${Api.leaveTypesList}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    console.log(body.data)
                    setAllLeaveTypes(body.data)
                }
            }
        )
    }

    const deleteLeaveType = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to delete this leave type.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.deleteRequest(`${Api.deleteLeaveType}`, "", { "id": id }, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200) {
                        getLeaveTypes()
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
                                    <h2>Good day, {userData.data.profile.firstName}!</h2>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                <h3>Leave Types</h3>
                                <div className="w-100 pt-2">
                                    <div>
                                        <Table responsive="lg">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 'auto' }}>Name</th>
                                                    <th style={{ width: 'auto' }}>Description</th>
                                                    <th style={{ width: 'auto' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allLeaveTypes &&
                                                    allLeaveTypes &&
                                                    allLeaveTypes.length > 0 &&
                                                    allLeaveTypes.map((item: any, index: any) => {
                                                        return (
                                                            <tr>
                                                                <td> {item.name} </td>
                                                                <td> {item.description} </td>
                                                                <td className="d-flex">
                                                                    <label
                                                                        onClick={() => {
                                                                            setLeaveTypeId(item.id)
                                                                            setInitialValues(item)
                                                                            setModalShow(true)
                                                                        }}
                                                                        className="text-muted cursor-pointer">
                                                                        
                                                                        <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                                    </label>
                                                                    <br />
                                                                    <label
                                                                        onClick={() => {
                                                                            deleteLeaveType(item.id)
                                                                        }}
                                                                        className="text-muted cursor-pointer">
                                                                        
                                                                        <img src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Delete" />
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        {
                                            allLeaveTypes &&
                                                allLeaveTypes.content &&
                                                allLeaveTypes.content.length == 0 ?
                                                <div className="w-100 text-center">
                                                    <label htmlFor="">No Records Found</label>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
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
                                        pageCount={(allLeaveTypes && allLeaveTypes.totalPages) || 0}
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
                                            <Button
                                                className="mx-2"
                                                onClick={() => {
                                                    setLeaveTypeId("")
                                                    setInitialValues(initialPayload)
                                                    setModalShow(true)
                                                }}>Create Leave Type</Button>
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
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}
                    onHide={() => setModalShow(false)}
                    dialogClassName="modal-90w"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">

                            {leaveTypeId ? 'Update Leave Type' : 'Create Leave Type'}

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="row w-100 px-5">
                        <Formik
                            innerRef={formRef}
                            initialValues={initialValues}
                            enableReinitialize={true}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string().required("Name is required !"),
                                    description: Yup.string().required("Description is required !"),
                                })
                            }
                            onSubmit={(values, actions) => {
                                setOnSubmit(true)
                                const valuesObj: any = { ...values }
                                if (leaveTypeId) {
                                    valuesObj.id = leaveTypeId
                                    RequestAPI.putRequest(Api.updateLeaveType, "", valuesObj, {}, async (res: any) => {
                                        const { status, body = { data: {}, error: {} } }: any = res
                                        if (status === 200 || status === 201) {
                                            if (body.error && body.error.message) {
                                                ErrorSwal.fire(
                                                    'Error!',
                                                    (body.error && body.error.message) || "",
                                                    'error'
                                                )
                                            } else {
                                                getLeaveTypes(0, "")
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
                                    RequestAPI.postRequest(Api.createLeaveType, "", valuesObj, {}, async (res: any) => {
                                        const { status, body = { data: {}, error: {} } }: any = res
                                        if (status === 200 || status === 201) {
                                            if (body.error && body.error.message) {
                                                ErrorSwal.fire(
                                                    'Error!',
                                                    (body.error && body.error.message) || "",
                                                    'error'
                                                )
                                            } else {
                                                getLeaveTypes(0, "")
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
                                        <div className="row w-100 px-5 flex-column">
                                            <div className="form-group col-md-12 mb-3" >
                                                <label>Name</label>
                                                <input type="text"
                                                    name="name"
                                                    id="name"
                                                    className="form-control"
                                                    value={values.name}
                                                    onChange={(e) => {
                                                        setFormField(e, setFieldValue)
                                                    }}
                                                />
                                                {errors && errors.name && (
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                                                )}
                                            </div>
                                            <div className="form-group col-md-12 mb-3" >
                                                <label>Description</label>
                                                <textarea
                                                    name="description"
                                                    id="description"
                                                    value={values.description}
                                                    className="form-control p-2"
                                                    style={{ minHeight: 100 }}
                                                    onChange={(e) => {
                                                        setFormField(e, setFieldValue)
                                                    }}
                                                />
                                                {errors && errors.description && (
                                                    <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
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
