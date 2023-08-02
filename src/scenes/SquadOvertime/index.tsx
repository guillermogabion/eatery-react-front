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
import { action_approve, action_cancel, action_decline, action_edit, eye } from "../../assets/images"
import DashboardMenu from "../../components/DashboardMenu"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import TimeDate from "../../components/TimeDate"
import UserTopMenu from "../../components/UserTopMenu"
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)

export const SquadOvertime = (props: any) => {
  const { history } = props
  let initialPayload = {
    "shiftDate": moment().format("YYYY-MM-DD"),
    "classification": "NORMAL_OT",
    "otStart": "",
    "otEnd": ""
  }

  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [onSubmit, setOnSubmit] = useState<any>(false);

  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [viewModalShow, setViewModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [myot, setMyOT] = useState<any>([]);
  const [otId, setOtId] = useState<any>("");
  const [otClassification, setOtClassification] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);
  const [initialValues, setInitialValues] = useState<any>({
    "shiftDate": moment().format("YYYY-MM-DD"),
    "classification": "NORMAL_OT",
    "otStart": "",
    "otEnd": ""
  })
  const formRef: any = useRef()


  const tableHeaders = [
    'Type',
    'Date Filed',
    'Date From - To',
    'No. of Days',
    'Reason',
    'Remarks',
    'Action',
  ]

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.OTClassification}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setOtClassification(body.data)
        } else {
        }
      }
    )
  }, [])

  useEffect(() => {
    getMyOT(0, key)
  }, [])

  const handlePageClick = (event: any) => {
    getMyOT(event.selected, key)
  };

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }
  const getMyOT = (page: any = 0, status: any = "All") => {
    setKey(status)
    let queryString = ""
    let filterDataTemp = { ...filterData }
    if (status != "") {
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
    if (data.profile.role == 'HR ADMIN' || data.profile.role == 'APPROVER') {
      RequestAPI.getRequest(
        `${Api.allSquadOvertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setMyOT(body.data)
            }
          }
        }
      )
    }

  }

  const approveOT = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this overtime.",
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
        RequestAPI.postRequest(Api.approveOT, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || "",
                'error'
              )
            } else {
              Swal.close()
              getMyOT(0, key)
              ErrorSwal.fire(
                'Success!',
                (body.data) || "",
                'success'
              )
            }
          } else {
            Swal.close()
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
  const cancelOvertime = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this overtime.",
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
        RequestAPI.postRequest(Api.cancelOvertime, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || "",
                'error'
              )
            } else {
              Swal.close()
              ErrorSwal.fire(
                'Success!',
                (body.data) || "",
                'success'
              )
              getMyOT(0, key)
            }
          } else {
            Swal.close()
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

  const declineOT = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this overtime.",
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
        RequestAPI.postRequest(Api.declineOT, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire(
                'Error!',
                (body.error && body.error.message) || "",
                'error'
              )
            } else {
              Swal.close()
              getMyOT(0, key)
              ErrorSwal.fire(
                'Success!',
                (body.data) || "",
                'success'
              )
            }
          } else {
            Swal.close()
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

  const getOT = (id: any = 0) => {
    RequestAPI.getRequest(
      `${Api.otInformation}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            valueObj.otStart = moment(valueObj.otStart).format("HH:mm")
            valueObj.otEnd = moment(valueObj.otEnd).format("HH:mm")
            setInitialValues(valueObj)
            // the value of valueObj.id is null - API issue for temp fixing I set ID directly
            setOtId(id)
            setModalShow(true)
          }
        }
      }
    )
  }

  const viewOT = (id: any = 0) => {
    RequestAPI.getRequest(
      `${Api.otInformation}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            valueObj.otStart = moment(valueObj.otStart).format("HH:mm")
            valueObj.otEnd = moment(valueObj.otEnd).format("HH:mm")
            setInitialValues(valueObj)
            // the value of valueObj.id is null - API issue for temp fixing I set ID directly
            setOtId(id)
            setViewModalShow(true)
          }
        }
      }
    )
  }

  const overTimeTable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              {data.profile.role != 'EMPLOYEE' ?
                <th style={{ width: 'auto' }}>Employee Name</th> :
                null
              }
              <th style={{ width: 'auto' }}>Shift Date</th>
              <th style={{ width: 'auto' }}>Classification</th>
              <th style={{ width: 'auto' }}>OT Start</th>
              <th style={{ width: 'auto' }}>OT End</th>
              <th style={{ width: 'auto' }}>Duration</th>
              <th style={{ width: 'auto' }}>File Date</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Action Taken By</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              myot &&
              myot.content &&
              myot.content.length > 0 &&
              myot.content.map((item: any, index: any) => {
                return (
                  <tr>
                    {/* <td> {item.lastName}, {item.firstName}</td> */}
                    {data.profile.role != 'EMPLOYEE' ?
                      <td id={"squadot_name_myotdata_" + item.id}>{item.lastName}, {item.firstName}</td> :
                      null
                    }
                    <td id={"squadot_shiftdate_myotdata_" + item.id}> {Utility.formatDate(item.shiftDate, 'MM-DD-YYYY')} </td>
                    <td id={"squadot_classification_myotdata_" + item.id}> {Utility.removeUnderscore(item.classification)} </td>
                    <td id={"squadot_otstart_myotdata_" + item.id}> {Utility.formatDate(item.otStart.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                    <td id={"squadot_otend_myotdata_" + item.id}> {Utility.formatDate(item.otEnd.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                    <td id={"squadot_totalduration_myotdata_" + item.id}> {item.totalDuration} </td>
                    <td id={"squadot_filedate_myotdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                    <td id={"squadot_reason_myotdata_" + item.id}> {item.reason} </td>
                    <td id={"squadot_statuschangedby_myotdata_" + item.id}> {item.statusChangedBy} </td>
                    <td id={"squadot_status_myotdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                    <td>
                      <label
                        id={"squadot_view_myotlabel_" + item.id}
                        onClick={() => {
                          viewOT(item.id)
                        }}
                      >
                        <img id={"squadot_eye_myotimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                      </label>
                      <>
                        {authorizations.includes("Request:Update") && item.status == "PENDING" ? (
                          <>
                            <label
                              id={"squadot_actionedit_myotlabel_" + item.id}
                              onClick={() => {
                                getOT(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadot_actionedit_myotimg_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                            </label>
                          </>
                        ) : null}
                        {authorizations.includes("Request:Approve") && item.status == "PENDING" ? (
                          <>
                            <label
                              id={"squadot_actionapprove_myotlabel_" + item.id}
                              onClick={() => {
                                approveOT(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadot_actionapprove_myotimg_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                            </label>
                          </>
                        ) : null}
                        {authorizations.includes("Request:Reject") && item.status == "PENDING" ? (
                          <>
                            <label
                              id={"squadot_actiondecline_myotlabel_" + item.id}
                              onClick={() => {
                                declineOT(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadot_actiondecline_myotimg_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />

                            </label>
                          </>
                        ) : null}

                      </>
                      <>
                        {authorizations.includes("Request:Update") && (item.status == "APPROVED" || item.status == "PENDING") ? (
                          <>
                            <label
                              id={"squadot_actioncancel_myotlabel_" + item.id}
                              onClick={() => {
                                cancelOvertime(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadot_actioncancel_myotimg_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                            </label>
                          </>
                        ) : null}
                      </>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
        {
          myot &&
            myot.content &&
            myot.content.length == 0 ?
            <div className="w-100 text-center">
              <label htmlFor="">No Records Found</label>
            </div>
            :
            null
        }
      </div>
    )
  }, [myot])

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
      <div className="w-100 px-5 py-5">
        <div>
          <div className="w-100 pt-2">
            <div className="fieldtext d-flex col-md-3 w-100 ">
              <div className="" style={{ width: 200, marginRight: 10 }}>
                <label>Employee</label>
                <EmployeeDropdown
                  id="squadot_employee_maindropdown"
                  squad={true}
                  placeholder={"Employee"}
                  singleChangeOption={singleChangeOption}
                  name="userId"
                  value={filterData && filterData['userId']}
                />
              </div>
              <div>
                <label>Date From</label>
                <div>
                  <input
                    id="squadot_datefrom_maininput"
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
                    id="squadot_dateto_maininput"
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
                    id="squadot_datefiled_maininput"
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
                  id="squadot_search_maininput"
                  style={{ width: 120 }}
                  onClick={() => getMyOT(0, key)}
                  className="btn btn-primary mx-2 mt-4">
                  Search
                </Button>
              </div>
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setMyOT([])
                getMyOT(0, k)
              }}
              className="mb-3"
            >
              <Tab id="squadot_all_maintab" eventKey="all" title="All">
                {overTimeTable()}
              </Tab>
              <Tab id="squadot_pending_maintab" eventKey="pending" title="Pending">
                {overTimeTable()}
              </Tab>
              <Tab id="squadot_approved_maintab" eventKey="approved" title="Approved" >
                {overTimeTable()}
              </Tab>
              <Tab id="squadot_declined_maintab" eventKey="declined" title="Rejected/Cancelled">
                {overTimeTable()}
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
              pageCount={(myot && myot.totalPages) || 0}
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
            Request Overtime
            {/* {otId ? 'Update Overtime Request' : 'Create Overtime Request'} */}

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
                classification: Yup.string().required("Classification is required !"),
                otStart: Yup.string().required("OT Start is required !"),
                otEnd: Yup.string().required("OT End is required !"),
              })
            }
            onSubmit={(values, actions) => {
              setOnSubmit(true)
              const valuesObj: any = { ...values }
              if (otId) {
                valuesObj.id = otId
                RequestAPI.putRequest(Api.updateOT, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "",
                        'error'
                      )
                    } else {
                      getMyOT(0, key)
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
                RequestAPI.postRequest(Api.OTCreate, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "",
                        'error'
                      )
                    } else {
                      getMyOT(0, key)
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
                    <div className="form-group col-md-6 mb-3 " >
                      <label>OT Classification</label>
                      <select
                        className="form-select"
                        name="classification"
                        id="classification"
                        value={values.classification}
                        onChange={(e) => setFormField(e, setFieldValue)}>
                        {otClassification &&
                          otClassification.length &&
                          otClassification.map((item: any, index: string) => (
                            <option key={`${index}_${item.item}`} value={item.item}>
                              {item}
                            </option>
                          ))}
                      </select>
                      {errors && errors.classification && (
                        <p id="squadot_errorclassification_reqotp" style={{ color: "red", fontSize: "12px" }}>{errors.classification}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Shift Date</label>
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
                        <p id="squadot_errorshiftdate_reqotp" style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Start</label>
                      <input type="time"
                        name="otStart"
                        id="otStart"
                        className="form-control"
                        value={values.otStart}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.otStart && (
                        <p id="squadot_errorotstart_reqotp" style={{ color: "red", fontSize: "12px" }}>{errors.otStart}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>End</label>
                      <input type="time"
                        name="otEnd"
                        id="otEnd"
                        className="form-control"
                        value={values.otEnd}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.otEnd && (
                        <p id="squadot_errorotend_reqotp" style={{ color: "red", fontSize: "12px" }}>{errors.otEnd}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Indicate Ticket Number (If Applicable) and Reason</label>
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
                        id="squadot_save_reqotbtn"
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
            View Overtime
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
                classification: Yup.string().required("Classification is required !"),
                otStart: Yup.string().required("OT Start is required !"),
                otEnd: Yup.string().required("OT End is required !"),
              })
            }
            onSubmit={(values, actions) => {
            }}>
            {({ values, setFieldValue, handleSubmit, errors, touched }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                  <div className="row w-100 px-5">
                    <div className="form-group col-md-6 mb-3 " >
                      <label>OT Classification</label>
                      <select
                        className="form-select"
                        name="classification"
                        id="classification"
                        value={values.classification}
                        disabled={true}
                        onChange={(e) => setFormField(e, setFieldValue)}>
                        {otClassification &&
                          otClassification.length &&
                          otClassification.map((item: any, index: string) => (
                            <option key={`${index}_${item.item}`} value={item.item}>
                              {item}
                            </option>
                          ))}
                      </select>
                      {errors && errors.classification && (
                        <p id="squadot_errorclassification_formp" style={{ color: "red", fontSize: "12px" }}>{errors.classification}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Shift Date</label>
                      <input type="date"
                        name="shiftDate"
                        id="shiftDate"
                        className="form-control"
                        value={values.shiftDate}
                        disabled={true}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.shiftDate && (
                        <p id="squadot_errorshiftdate_formp" style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Start</label>
                      <input type="time"
                        name="otStart"
                        id="otStart"
                        className="form-control"
                        value={values.otStart}
                        disabled={true}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.otStart && (
                        <p id="squadot_errorotstart_formp" style={{ color: "red", fontSize: "12px" }}>{errors.otStart}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>End</label>
                      <input type="time"
                        name="otEnd"
                        id="otEnd"
                        className="form-control"
                        value={values.otEnd}
                        disabled={true}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.otEnd && (
                        <p id="squadot_errorotend_formp" style={{ color: "red", fontSize: "12px" }}>{errors.otEnd}</p>
                      )}
                    </div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Indicate Ticket Number (If Applicable) and Reason</label>
                      <textarea
                        name="reason"
                        id="reason"
                        className="form-control p-2"
                        style={{ minHeight: 100 }}
                        disabled={true}
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                      />
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
