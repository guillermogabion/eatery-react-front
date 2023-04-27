import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Form, Image, Modal, Table } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector, useDispatch } from "react-redux"
import FileUploadService from "../../services/FileUploadService"
import { action_approve, action_cancel, action_decline, action_edit } from "../../assets/images"
import ReactPaginate from "react-paginate"
import SingleSelect from "../../components/Forms/SingleSelect"
import { Formik } from "formik"
import * as Yup from "yup"

export const MyAttendanceSummary = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const masterList = useSelector((state: any) => state.rootReducer.masterList)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const { authorizations } = data?.profile
    const formRef: any = useRef()
    const deleteformRef: any = useRef()

    const { history } = props
    const [importModalShow, setImportModalShow] = React.useState(false);
    const [downloadModalShow, setDownloadModalShow] = React.useState(false);
    const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [addBioModal, setAddBioModal] = React.useState(false);
    const [deleteBioModal, setDeleteBioModal] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [filterData, setFilterData] = React.useState([]);
    const [key, setKey] = React.useState('all');
    const [allAttendance, setAllAttendance] = useState<any>([]);
    const [employeeList, setEmployeeList] = useState<any>([]);
    const [userId, setUserId] = useState<any>("");
    const [updateData, setUpdateData] = useState<any>(null);
    const [initialValues, setInitialValues] = useState<any>({
        "userid": 0,
        "shiftDate": "",
        "tkDate": "",
        "tkTime": "",
        "status": null,
        "type": ""
    });

    const [deleteInitialValues, setDeleteInitialValues] = useState<any>({
        "userid": 0,
        "shiftDate": "string",
        "type": "string"
    });

    const downloadExcel = (fromDate: any, toDate: any) => {
        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.downloadTimeKeeping}?fromDate=${fromDate}&toDate=${toDate}`,
            "",
            "timekeeping.xlsx",
            async (res: any) => {
                if (res) {
                    setIsSubmit(false)
                }

            }
        )
    }
    const downloadTemplate = () => {
        RequestAPI.getFileAsync(
            `${Api.downloadExcelTimekeepingTemplate}`,
            "",
            "timekeepingexceltemplate.xlsx",
            async (res: any) => {
                if (res) {
                }
            }
        )
    };

    const uploadExcel = () => {
        if (selectedFile != null && selectedFile != "") {
            FileUploadService.uploadTimeKeeping(selectedFile, (event: any) => {
                if (event.total == event.loaded) {
                    // for loading
                }
            })
                .then((response: any) => {
                    const { data } = response
                    if (data.error) {
                        ErrorSwal.fire("Failed!", (data.error.message || "Something error."), "error")
                    } else {
                        ErrorSwal.fire("Success!", "Successfully uploaded.", "success")
                        setImportModalShow(false)
                    }
                })
                .catch(() => {
                    ErrorSwal.fire("Failed!", "Failed to upload.", "error")
                })
        } else {
            ErrorSwal.fire("Warning!", "File is required.", "warning")
        }
    }

    useEffect(() => {
        getAllAttendance(0)
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

    const getAllAttendance = (page: any = 0) => {
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
            `${Api.myAttendanceSummary}?size=10${queryString}&page=${page}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        setAllAttendance(body.data)
                    }
                }
            }
        )

    }

    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }

    const handlePageClick = (event: any) => {
        getAllAttendance(event.selected)
    };

    const updateLog = (logType: any) => {
        const valuesObj = { ...updateData }
        if (logType == 'Time In') {
            setInitialValues({
                "userid": valuesObj.userid,
                "shiftDate": valuesObj.date,
                "tkDate": valuesObj.firstLogin ? moment(valuesObj.firstLogin, 'YYYY-MM-DD').format('YYYY-MM-DD') : "",
                "tkTime": valuesObj.firstLogin ? moment(valuesObj.firstLogin, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') : "",
                "status": valuesObj.status,
                "type": logType,
            })
        } else {
            setInitialValues({
                "userid": valuesObj.userid,
                "shiftDate": valuesObj.date,
                "tkDate": valuesObj.lastLogin ? moment(valuesObj.lastLogin, 'YYYY-MM-DD').format('YYYY-MM-DD') : "",
                "tkTime": valuesObj.lastLogin ? moment(valuesObj.lastLogin, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') : "",
                "status": valuesObj.status,
                "type": logType,
            })
        }
    }

    const attendanceTable = useCallback(() => {
        return (
            <div>
                <Table responsive="lg">
                    <thead>
                        <tr>
                            <th style={{ width: 'auto' }}>Fullname</th>
                            <th style={{ width: 'auto' }}>Date</th>
                            <th style={{ width: 'auto' }}>Shift Schedule</th>
                            <th style={{ width: 'auto' }}>Datetime In</th>
                            <th style={{ width: 'auto' }}>Datetime Out</th>
                            <th style={{ width: 'auto' }}>Day Type</th>
                            <th style={{ width: 'auto' }}>Status</th>
                            {
                                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                    <th style={{ width: 'auto' }}>Action</th>
                                    :
                                    null
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {
                            allAttendance &&
                                allAttendance.content &&
                                allAttendance.content.length > 0 ?
                                <>
                                    {
                                        allAttendance.content.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td> {item.lastName}, {item.firstName} </td>
                                                    <td> {item.date} </td>
                                                    <td> {item.schedule} </td>
                                                    <td> {item.firstLogin ? moment(item.firstLogin).format('YYYY-MM-DD hh:mm A') : "No Time In"} </td>
                                                    <td> {item.lastLogin ? moment(item.lastLogin).format('YYYY-MM-DD hh:mm A') : "No Time Out"} </td>
                                                    <td> {item.dayType} </td>
                                                    <td> {item.status} </td>
                                                    {
                                                        data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                            <td> <label
                                                                onClick={() => {
                                                                    setUpdateData(item)
                                                                    setInitialValues({
                                                                        "userid": filterData && filterData['userid'],
                                                                        "shiftDate": item.date,
                                                                        "tkDate": item.firstLogin ? moment(item.firstLogin, 'YYYY-MM-DD').format('YYYY-MM-DD') : "",
                                                                        "tkTime": item.firstLogin ? moment(item.firstLogin, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') : "",
                                                                        "status": item.status,
                                                                        "type": 'Time In',
                                                                    })
                                                                    setAddBioModal(true)
                                                                }}
                                                                className="text-muted cursor-pointer">
                                                                Update
                                                            </label>
                                                                <br />
                                                                <label
                                                                    onClick={() => {
                                                                        setDeleteInitialValues({
                                                                            "userid": filterData && filterData['userid'],
                                                                            "shiftDate": item.date,
                                                                            "type": 'Time In',
                                                                        })
                                                                        setDeleteBioModal(true)
                                                                    }}
                                                                    className="text-muted cursor-pointer">
                                                                    Delete
                                                                </label>
                                                                <br />
                                                            </td>
                                                            :
                                                            null
                                                    }

                                                </tr>
                                            )
                                        })
                                    }

                                </>
                                :
                                null
                        }
                    </tbody>

                </Table>

                {
                    allAttendance &&
                        allAttendance.content &&
                        allAttendance.content.length == 0 ?
                        <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                }


                <div className="d-flex justify-content-end">
                    <div className="">
                        <ReactPaginate
                            className="d-flex justify-content-center align-items-center"
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={(allAttendance && allAttendance.totalPages) || 0}
                            previousLabel="<"
                            previousLinkClassName="prev-next-pagination"
                            nextLinkClassName="prev-next-pagination"
                            activeClassName="active-page-link"
                            pageLinkClassName="page-link"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
            </div>

        )
    }, [allAttendance])

    const singleChangeOption = (option: any, name: any) => {

        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
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
                                <h3>Attendance Summary</h3>

                                <div className="w-100 pt-4">
                                    <div className="fieldtext d-flex col-md-12">
                                        <div>
                                            <label>Date From</label>
                                            <input
                                                name="fromDate"
                                                type="date"
                                                autoComplete="off"
                                                className="formControl"
                                                maxLength={40}
                                                value={filterData["fromDate"]}
                                                onChange={(e) => makeFilterData(e)}
                                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                            />
                                        </div>

                                        <div>
                                            <label>Date To</label>
                                            <div className="input-container">
                                                <input
                                                    name="toDate"
                                                    type="date"
                                                    autoComplete="off"
                                                    className="formControl"
                                                    maxLength={40}
                                                    value={filterData["toDate"]}
                                                    onChange={(e) => makeFilterData(e)}
                                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            style={{ width: 120 }}
                                            onClick={() => getAllAttendance(0)}
                                            className="btn btn-primary mx-2 mt-4">
                                            Search
                                        </Button>
                                        {
                                            data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                                                <Button
                                                    style={{ width: 130 }}
                                                    onClick={() => setAddBioModal(true)}
                                                    disabled={!filterData['userid'] || (filterData['userid'] && filterData['userid'] == "")}
                                                    className="btn btn-primary mx-2 mt-4">
                                                    Add Bio Log
                                                </Button>
                                                :
                                                null
                                        }

                                    </div>

                                    {attendanceTable()}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Create User Modal Form */}
            <Modal
                show={downloadModalShow}
                size={'md'}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setDownloadModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Export
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <div className="form-group col-md-6 mb-3" >
                        <label>Date From</label>
                        <input type="date"
                            name="fromDate"
                            id="fromDate"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value)
                            }}
                        />
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                        <label>Date To</label>
                        <input type="date"
                            name="toDate"
                            id="toDate"
                            className="form-control"
                            value={toDate}
                            min={fromDate}
                            onChange={(e) => {
                                setToDate(e.target.value)
                            }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button
                        onClick={() => downloadExcel(fromDate, toDate)}
                        disabled={isSubmit}>
                        {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create User Modal Form */}


            {/* Create User Modal Form */}
            <Modal
                show={importModalShow}
                size={'md'}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setImportModalShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Import
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <div className="form-group col-md-12 mb-3" >
                        <label>File</label>
                        <input
                            type="file"
                            accept=".xlsx"
                            className="file-input-style w-100"
                            onChange={(event: any) => {
                                if (event.target.files && event.target.files[0]) {
                                    setSelectedFile(event.target.files[0]);
                                }
                            }} />
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button
                        onClick={() => uploadExcel()}
                        disabled={isSubmit}>
                        {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create User Modal Form */}

            <Modal
                show={deleteBioModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setDeleteBioModal(false)
                    deleteformRef.current?.resetForm()
                }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title id="contained-modal-title-vcenter">
              Request For Leave/Time-off
            </Modal.Title> */}
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete Biometric Logs
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={deleteformRef}
                        initialValues={deleteInitialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                shiftDate: Yup.string().required("Shift date is required !"),
                                type: Yup.string().required("Type is required !"),
                            })
                        }
                        onSubmit={(values, actions) => {
                            const valuesObj: any = { ...values }
                            valuesObj.userid = filterData['userid']

                            RequestAPI.deleteRequest(`${Api.deleteBioLogs}`, "", valuesObj, async (res: any) => {
                                const { status, body = { data: {}, error: {} } }: any = res
                                if (status === 200) {
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
                                        getAllAttendance(0)
                                        setDeleteBioModal(false)
                                        deleteformRef.current?.resetForm()
                                    }
                                } else {
                                    //error
                                    ErrorSwal.fire(
                                        'Failed!',
                                        (body.error && body.error.message) || "",
                                        'error'
                                    )
                                }
                            })

                        }}>
                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 m-0 px-5">
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Shift Date</label>
                                            <input type="date"
                                                name="shiftDate"
                                                id="shiftDate"
                                                className="form-control"
                                                value={values.shiftDate}
                                                disabled={true}
                                                onChange={handleChange}
                                            />
                                            {errors && errors.shiftDate && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Type</label>
                                            <select
                                                className={`form-select`}
                                                name="type"
                                                id="type"
                                                value={values.type}
                                                onChange={(e) => {
                                                    setFieldValue('type', e.target.value);
                                                }}>
                                                <option key={`index`} value={""} disabled selected>
                                                    Select
                                                </option>
                                                {masterList &&
                                                    masterList.timekeepingType &&
                                                    masterList.timekeepingType.length &&
                                                    masterList.timekeepingType.map((item: any, index: string) => (
                                                        <option key={`${index}_${item}1`} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors && errors.type && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <Modal.Footer className="d-flex justify-content-center">
                                        <div className="d-flex justify-content-center px-5">
                                            <button
                                                type="submit"
                                                className="btn btn-primary">
                                                Proceed
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
                show={addBioModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setAddBioModal(false)
                    setUpdateData(null)
                    formRef.current?.resetForm()
                }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title id="contained-modal-title-vcenter">
              Request For Leave/Time-off
            </Modal.Title> */}
                    <Modal.Title id="contained-modal-title-vcenter">
                        {updateData ? "Update Biometric Logs" : "Add Biometric Logs"}
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
                                tkDate: Yup.string().required("Date logged is required !"),
                                tkTime: Yup.string().required("Time logged is required !"),
                                type: Yup.string().required("Type is required !"),
                            })
                        }
                        onSubmit={(values, actions) => {
                            const valuesObj: any = { ...values }
                            valuesObj.userid = filterData['userid']

                            if (updateData) {
                                RequestAPI.putRequest(Api.updateBioLogs, "", valuesObj, {}, async (res: any) => {
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
                                            getAllAttendance(0)
                                            setAddBioModal(false)
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
                                RequestAPI.postRequest(Api.addBioLogs, "", valuesObj, {}, async (res: any) => {
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
                                            getAllAttendance(0)
                                            setAddBioModal(false)
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
                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 m-0 px-5">
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Shift Date</label>
                                            <input type="date"
                                                name="shiftDate"
                                                id="shiftDate"
                                                className="form-control"
                                                value={values.shiftDate}
                                                disabled={updateData ? true : false}
                                                onChange={handleChange}
                                            />
                                            {errors && errors.shiftDate && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Date Logged</label>
                                            <input type="date"
                                                name="tkDate"
                                                id="tkDate"
                                                className="form-control"
                                                value={values.tkDate}
                                                onChange={handleChange}
                                            />
                                            {errors && errors.tkDate && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.tkDate}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Time Logged</label>
                                            <input type="time"
                                                name="tkTime"
                                                id="tkTime"
                                                step={"1"}
                                                className="form-control"
                                                value={values.tkTime}
                                                onChange={handleChange}
                                            />
                                            {errors && errors.tkTime && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.tkTime}</p>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3" >
                                            <label>Type</label>
                                            <select
                                                className={`form-select`}
                                                name="type"
                                                id="type"
                                                value={values.type}
                                                onChange={(e) => {
                                                    setFieldValue('type', e.target.value);
                                                    updateLog(e.target.value)
                                                }}>
                                                <option key={`index`} value={""} disabled selected>
                                                    Select
                                                </option>
                                                {masterList &&
                                                    masterList.timekeepingType &&
                                                    masterList.timekeepingType.length &&
                                                    masterList.timekeepingType.map((item: any, index: string) => (
                                                        <option key={`${index}_${item}`} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors && errors.type && (
                                                <p style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                                            )}
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
        </div>

    )
}