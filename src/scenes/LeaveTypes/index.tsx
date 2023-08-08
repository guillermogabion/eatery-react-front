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
import SingleSelect from "../../components/Forms/SingleSelect"
import ContainerWrapper from "../../components/ContainerWrapper"

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
    const [creditModal, setCreditModal] = React.useState(false);
    const [key, setKey] = React.useState('all');
    const [leaveTypes, setLeaveTypes] = useState<any>([]);
    const [allLeaveTypes, setAllLeaveTypes] = useState<any>([]);
    const [leaveTypeId, setLeaveTypeId] = useState<any>("");
    const [editCredit, setEditCredit] = useState<any>(true);

    const [otClassification, setOtClassification] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [employeeList, setEmployeeList] = useState<any>([]);
    const [initialValues, setInitialValues] = useState<any>({
        "name": "",
        "description": ""
    })
    const [creditInitialValues, setCreditInitialValues] = useState<any>({
        "userId": "",
        "leaveTypeId": "",
        "credits": ""
    })
    const formRef: any = useRef()
    const creditformRef: any = useRef()

    useEffect(() => {
        getLeaveTypes()
        getAllEmployee()
    }, [])

    const getAllEmployee = () => {
        RequestAPI.getRequest(
            `${Api.employeeList}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.forEach((d: any, i: any) => {
                            tempArray.push({
                                value: d.userAccountId,
                                label: d.firstname + " " + d.lastname
                            })
                        });
                        setEmployeeList(tempArray)
                    }
                }
            }
        )
    }

    const getUserCredits = (userId: any, typeId: any, setFieldValue: any) => {
        RequestAPI.getRequest(
            `${Api.getUserCredits}?userId=${userId}&typeId=${typeId}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setFieldValue('credits', body.data.credits)
                    }
                }
            }
        )
    }

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
            `${Api.leaveTypesList}?size=100${queryString}&page=${page}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    setAllLeaveTypes(body.data)
                }
            }
        )
    }

    const deleteLeaveType = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to delete this leave type.",
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();
        
                if(confirmButton)
                  confirmButton.id = "leavetypes_deleteconfirm_alertbtn"
        
                if(cancelButton)
                  cancelButton.id = "leavetypes_deletecancel_alertbtn"
              },
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
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
                <div>
                    <h3>Leave Types</h3>
                    <div className="w-100 pt-2">
                        <div>
                            <Table responsive>
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
                                                    <td id="leavetypes_name_allleavetypesdata"> {item.name} </td>
                                                    <td id="leavetypes_description_allleavetypesdata"> {item.description} </td>
                                                    <td className="d-flex">
                                                        <label
                                                            id="leavetypes_edit_allleavetypeslabel"
                                                            onClick={() => {
                                                                setLeaveTypeId(item.id)
                                                                setInitialValues(item)
                                                                setModalShow(true)
                                                            }}
                                                            className="text-muted cursor-pointer">

                                                            <img id="leavetypes_actionedit_allleavetypesimg" src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                                        </label>
                                                        <br />
                                                        <label
                                                            id="leavetypes_delete_allleavetypeslabel"
                                                            onClick={() => {
                                                                deleteLeaveType(item.id)
                                                            }}
                                                            className="text-muted cursor-pointer">

                                                            <img id="leavetypes_actiondecline_allleavetypesimg" src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Delete" />
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
                            activeLinkClassName="active-page-link"
                            disabledLinkClassName="prev-next-disabled"
                            pageLinkClassName="page-link"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    {authorizations.includes("Request:Create") ? (
                        <>
                            <div className="d-flex justify-content-end mt-3" >
                                <div>
                                    <Button
                                        id="leavetypes_editcreditstoemployee_allleavetypesbtn"
                                        className="mx-2"
                                        onClick={() => {
                                            setCreditModal(true)
                                        }}>Edit Credits to Employee</Button>
                                </div>
                            </div>
                        </>
                    ) : null}

                    {authorizations.includes("Request:Create") ? (
                        <>
                            <div className="d-flex justify-content-end mt-3" >
                                <div>
                                    <Button
                                        id="leavetypes_createleavetype_allleavetypesbtn"
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
                                                <p id="leavetypes_errorname_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
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
                                                <p id="leavetypes_errordescription_modalp" style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-end px-5">
                                            <button
                                                id="leavetypes_save_modalbtn"
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
                show={creditModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setCreditModal(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">

                        Edit Credits to Employee

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={creditformRef}
                        initialValues={creditInitialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                userId: Yup.string().required("Employee is required !"),
                                leaveTypeId: Yup.string().required("Leave type is required !"),
                                credits: Yup.string().required("Credits is required !"),
                            })
                        }
                        onSubmit={(values, actions) => {
                            const valuesObj: any = { ...values }

                            RequestAPI.putRequest(Api.updateCredits, "", valuesObj, {}, async (res: any) => {
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
                                        setCreditModal(false)
                                        setEditCredit(true)
                                        creditformRef.current?.resetForm()
                                    }
                                } else {
                                    ErrorSwal.fire(
                                        'Error!',
                                        (body.error && body.error.message) || "Something error!",
                                        'error'
                                    )
                                }
                            })

                        }}>
                        {({ values, setFieldValue, handleSubmit, handleChange, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5 flex-column">
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Employee</label>
                                            <SingleSelect
                                                id="leavetypes_employee_editmodalselect"
                                                type="string"
                                                options={employeeList || []}
                                                placeholder={"Employee"}
                                                onChangeOption={(e: any) => {
                                                    setFieldValue('userId', e.value)
                                                    if (e.value && values.leaveTypeId) {
                                                        getUserCredits(e.value, values.leaveTypeId, setFieldValue)
                                                    }
                                                }}
                                                name="userId"
                                                value={values.userId}
                                            />
                                            {errors && errors.userId && (
                                                <p id="leavetypes_erroremployee_editmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.userId}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Leave Type</label>
                                            <select
                                                className={`form-select`}
                                                name="leaveTypeId"
                                                id="type"
                                                value={values.leaveTypeId}
                                                onChange={(e) => {
                                                    if (e.target.value && values.userId) {
                                                        getUserCredits(values.userId, e.target.value, setFieldValue)
                                                    }
                                                    setFieldValue('leaveTypeId', e.target.value,)

                                                }}>
                                                <option key={`departmentItem}`} value={""}>
                                                    Select
                                                </option>
                                                {allLeaveTypes &&
                                                    allLeaveTypes.length &&
                                                    allLeaveTypes.map((item: any, index: string) => (
                                                        <option key={`${index}_${item.id}`} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors && errors.leaveTypeId && (
                                                <p id="leavetypes_errorleavetypeid_editmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.leaveTypeId}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Credits</label>
                                            <input type="text"
                                                name="credits"
                                                id="credits"
                                                className="form-control"
                                                disabled={editCredit}
                                                value={values.credits}
                                                onChange={handleChange}
                                            />
                                            {errors && errors.credits && (
                                                <p id="leavetypes_errorcredits_editmodalp" style={{ color: "red", fontSize: "12px" }}>{errors.credits}</p>
                                            )}
                                        </div>
                                    </div>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-end px-5">
                                            <button
                                                id="leavetypes_edit_editmodalbtn"
                                                type="button"
                                                onClick={() => {
                                                    if (editCredit) {
                                                        setEditCredit(false)
                                                    } else {
                                                        getUserCredits(values.userId, values.leaveTypeId, setFieldValue)
                                                        setEditCredit(true)
                                                    }
                                                }}

                                                className="btn btn-primary mx-1">
                                                {!editCredit ? "Cancel" : "Update"}
                                            </button>

                                            <button
                                                id="leavetypes_save_editmodalbtn"
                                                type="submit"
                                                disabled={editCredit}
                                                className="btn btn-primary">
                                                SAVE
                                            </button>
                                        </div>
                                    </Modal.Footer>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>} />
    )
}
