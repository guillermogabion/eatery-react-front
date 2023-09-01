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


export const Overtime = (props: any) => {
  const { history } = props
  let initialPayload = {
    "shiftDate": moment().format("YYYY-MM-DD"),
    "classification": "NORMAL_OT",
    "otStart": "",
    "otEnd": "",
    "location": "",
    "breaktimeDuration": ""
  }

  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [onSubmit, setOnSubmit] = useState<any>(false);

  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [viewModalShow, setViewModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [actionable, setIsActionable] = React.useState(false);
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

  const getMyOT = (page: any = 0, status: any = "all", isActionable: any = false) => {
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

    if (isActionable) {
      queryString += '&actionableOnly=true'
    }

    if (data.profile.role == 'EXECUTIVE') {
      RequestAPI.getRequest(
        `${Api.allOvertime}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
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
    } else {
      RequestAPI.getRequest(
        `${Api.myOT}?size=10${queryString}&page=${page}&sort=id&sortDir=desc&status=${status}`,
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
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "overtime_approveotconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "overtime_approveotcancel_alertbtn"
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.approveOT, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "overtime_errorconfirm_alertbtn"
                },
                icon: 'error',
            })
            } else {
              getMyOT(0, key)
              ErrorSwal.fire({
                title: 'Success!',
                text: (body.data) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "overtime_successconfirm_alertbtn"
                },
                icon: 'success',
            })
            }
          } else {
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "overtime_errorconfirm2_alertbtn"
              },
              icon: 'error',
          })
          }
        })
      }
    })
  }

  const declineOT = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this overtime.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "overtime_declineotconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "overtime_declineotcancel_alertbtn"
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.declineOT, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "overtime_errorconfirm3_alertbtn"
                },
                icon: 'error',
            })
            } else {
              getMyOT(0, key)
              ErrorSwal.fire({
                title: 'Success!',
                text: (body.data) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "overtime_successconfirm2_alertbtn"
                },
                icon: 'success',
            })
            }
          } else {
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "overtime_errorconfirm4_alertbtn"
              },
              icon: 'error',
          })
          }
        })
      }
    })
  }

  const cancelOvertime = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this overtime.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "overtime_cancelotconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "overtime_cancelotcancel_alertbtn"
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
        RequestAPI.postRequest(Api.cancelOvertime, "", { "id": id }, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 || status === 201) {
            if (body.error && body.error.message) {
              Swal.close()
              ErrorSwal.fire({
                title: 'Error!',
                text: (body.error && body.error.message) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "overtime_errorconfirm5_alertbtn"
                },
                icon: 'error',
            })
            } else {
              Swal.close()
              ErrorSwal.fire({
                title: 'Success!',
                text: (body.datt) || "",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "overtime_successconfirm3_alertbtn"
                },
                icon: 'success',
            })
              getMyOT(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "overtime_errorconfirm6_alertbtn"
              },
              icon: 'error',
          })
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
        <Table responsive>
          <thead>
            <tr>
              {data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                <th style={{ width: 'auto' }}>Employee Name</th> :
                null
              }
              <th style={{ width: 'auto' }}>Shift Date</th>
              <th style={{ width: 'auto' }}>Classification</th>
              <th style={{ width: 'auto' }}>OT Start</th>
              <th style={{ width: 'auto' }}>OT End</th>
              <th style={{ width: 'auto' }}>Duration</th>
              <th style={{ width: 'auto' }}>Date Filed</th>
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
                    {data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                      <td id={"overtime_name_myotdata_" + item.id}>{item.lastName}, {item.firstName}</td> :
                      null
                    }
                    <td id={"overtime_shiftdate_myotdata_" + item.id}> {Utility.formatDate(item.shiftDate, 'MM-DD-YYYY')} </td>
                    <td id={"overtime_classification_myotdata_" + item.id}> {Utility.removeUnderscore(item.classification)} </td>
                    <td id={"overtime_otstart_myotdata_" + item.id}> {Utility.formatDate(item.otStart.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                    <td id={"overtime_otend_myotdata_" + item.id}> {Utility.formatDate(item.otEnd.replace('T', ' '), 'MM-DD-YYYY hh:mm A', true)} </td>
                    <td id={"overtime_totalduration_myotdata_" + item.id}> {item.totalDuration} </td>
                    {/* <td> {item.totalDuration.split(':').map(value => value.padStart(2, '0')).slice(0, 2).join(':')}</td> */}
                    <td id={"overtime_filedate_myotdata_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')} </td>
                    <td id={"overtime_reason_myotdata_" + item.id}> {item.reason} </td>
                    <td id={"overtime_statuschangedby_myotdata_" + item.id}> {item.statusChangedBy} </td>
                    <td id={"overtime_status_myotdata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                    <td className="d-flex">
                      <label
                        id={"overtime_view_myotlabel_" + item.id}
                        onClick={() => {
                          viewOT(item.id)
                        }}
                      >
                        <img id={"overtime_eye_myotimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                      </label>
                      {
                        item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED"  ?
                          <>
                            {authorizations.includes("Request:Update") ? (
                              <>
                                <label
                                  id={"overtime_update_myotlabel_" + item.id}
                                  onClick={() => {
                                    getOT(item.id)
                                  }}
                                  className="text-muted cursor-pointer">
                                  <img id={"overtime_actionedit_myotimg_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                </label>

                              </>
                            ) : null}
                            {authorizations.includes("Request:Approve") && data.profile.role == 'EXECUTIVE' ? (
                              <>
                                <label
                                  id={"overtime_approveot_myotlabel_" + item.id}
                                  onClick={() => {
                                    approveOT(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img id={"overtime_actionapprove_myotimg_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                </label>
                              </>
                            ) : null}
                            {authorizations.includes("Request:Reject") && data.profile.role == 'EXECUTIVE' ? (
                              <>
                                <label
                                  id={"overtime_declineot_myotlabel_" + item.id}
                                  onClick={() => {
                                    declineOT(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img id={"overtime_actiondecline_myotimg_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                                </label>
                                <br />
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
                                  id={"overtime_cancelovertime_myotlabel_" + item.id}
                                  onClick={() => {
                                    cancelOvertime(item.id)
                                  }}
                                  className="text-muted cursor-pointer">
                                  <img id={"overtime_view_myotimg_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
                                </label>
                                <br />
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
            <div className="row d-flex">
              {
                data.profile.role == 'EXECUTIVE' ?
                <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                    <label>Employee</label>
                    <EmployeeDropdown
                      id="overtime_employee_myotformdropdown"
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
                    id="overtime_datefrom_myotforminput"
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
                  id="overtime_dateto_myotforminput"
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
                  id="overtime_datefiled_myotforminput"
                  name="dateFiled"
                  type="date"
                  autoComplete="off"
                  className="formControl"
                  onChange={(e) => makeFilterData(e)}
                  onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 d-flex flex-wrap">
                <Button
                  id="overtime_search_myotformbtn"
                  style={{ width: '100%' }}
                  onClick={() => getMyOT(0, key, actionable)}
                  className="btn btn-primary  mt-4">
                  Search
                </Button>
              </div>
            </div>
            
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setMyOT([])

                if (k == 'actionable') {
                  getMyOT(0, k, true)
                } else {
                  getMyOT(0, k)
                }
              }}
              className="mb-3"
            >
              <Tab id="overtime_all_myotformtab" eventKey="all" title="All">
                {overTimeTable()}
              </Tab>
              <Tab id="overtime_pending_myotformtab" eventKey="pending" title="Pending">
                {overTimeTable()}
              </Tab>
              <Tab id="overtime_approved_myotformtab" eventKey="approved" title="Approved" >
                {overTimeTable()}
              </Tab>
              <Tab id="overtime_declined_myotformtab" eventKey="declined" title="Rejected/Cancelled">
                {overTimeTable()}
              </Tab>
              {
                data.profile.role == 'EXECUTIVE' &&
                (
                  <Tab id="overtime_actionable_myotformtab" eventKey="actionable" title="Actionable">
                    {overTimeTable()}
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
                <Button
                  id="overtime_requestovertime_myotformbtn"
                  className="mx-2"
                  onClick={() => {
                    setOtId("")
                    setInitialValues(initialPayload)
                    setModalShow(true)
                  }}>Request Overtime</Button>
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
                location: Yup.string().required("Location is required !"),
                breaktimeDuration: Yup.string().required("Breaktime Duration is required !"),
                reason: Yup.string().required("Reason is required !"),
              })
            }
            onSubmit={(values, actions) => {
              setOnSubmit(true)
              const loadingSwal = Swal.fire({
                title: '',
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },

              });
              const valuesObj: any = { ...values }
              if (otId) {
                valuesObj.id = otId
                RequestAPI.putRequest(Api.updateOT, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "overtime_errorconfirm7_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      getMyOT(0, key)
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "overtime_successconfirm4_alertbtn"
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
              
                        if(confirmButton)
                          confirmButton.id = "overtime_errorconfirm8_alertbtn"
                      },
                      icon: 'error',
                  })
                  }
                })
              } else {
                RequestAPI.postRequest(Api.OTCreate, "", valuesObj, {}, async (res: any) => {
                  Swal.close();
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "overtime_errorconfirm9_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      getMyOT(0, key)
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "overtime_successconfirm5_alertbtn"
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
              
                        if(confirmButton)
                          confirmButton.id = "overtime_errorconfirm10_alertbtn"
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
                    <div className="form-group col-md-6 mb-3 " >
                      <label>OT Classification </label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <select
                        className="form-select"
                        name="classification"
                        id="classification"
                        value={values.classification}
                        onChange={(e) => setFormField(e, setFieldValue)}>
                        {otClassification &&
                          otClassification.length &&
                          otClassification.map((item: any, index: string) => (
                            <option key={`${index}_${item}`} value={item}>
                              {Utility.removeUnderscore(item)}
                            </option>
                          ))}
                      </select>
                      {errors && errors.classification && (
                        <p id="overtime_errorclassification_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.classification}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Shift Date</label>
                      <span className="text-danger ml-2 text-md">*</span>
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
                        <p id="overtime_errorshiftdate_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Start</label>
                      <span className="text-danger ml-2 text-md">*</span>
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
                        <p id="overtime_errorotstart_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.otStart}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>End</label>
                      <span className="text-danger ml-2 text-md">*</span>
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
                        <p id="overtime_errorotend_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.otEnd}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3">
                      <label>Work Type</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <select
                        id="overtime_worktype_reqovertimeselect"
                        className="form-select"
                        value={values.location}
                        name="location"
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      >
                        <option value="" disabled selected>
                          Select Work Type
                        </option>
                        <option value="ON_SITE">On Site</option>
                        <option value="WORK_FROM_HOME">Work From Home</option>
                      </select>
                      {errors && errors.location && (
                        <p id="overtime_errorlocation_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.location}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3">
                      <label>Breaktime Duration (minutes)</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <select
                        id="overtime_breaktimeduratino_reqovertimeselect"
                        className="form-select"
                        value={values.breaktimeDuration}
                        name="breaktimeDuration"
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      >
                        <option value="" disabled selected>
                          Select Breaktime Duration
                        </option>
                        <option value="0">0</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                        <option value="60">60</option>
                      </select>
                      {errors && errors.breaktimeDuration && (
                        <p id="overtime_errorbreaktimeduration_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.breaktimeDuration}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3"></div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Indicate Ticket Number (If Applicable) and Reason</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <textarea
                        name="reason"
                        id="reason"
                        className="form-control p-2"
                        style={{ minHeight: 100 }}
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                      />
                      {errors && errors.reason && (
                        <p id="overtime_errorreason_reqovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                      )}
                    </div>
                  </div>
                  <br />
                  <Modal.Footer>
                    <div className="d-flex justify-content-end px-5">
                      <button
                        id="overtime_save_reqovertimebtn"
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
                location: Yup.string().required("Location is required !"),
                breaktimeDuration: Yup.string().required("Breaktime Duration is required !"),
                reason: Yup.string().required("Reason is required !"),
              })
            }
            onSubmit={(values, actions) => {
              
            }}>
            {({ values, setFieldValue, handleSubmit, errors, touched }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                  <div className="row w-100 px-5">
                    <div className="form-group col-md-6 mb-3 " >
                      <label>OT Classification </label>
                      <span className="text-danger ml-2 text-md">*</span>
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
                            <option key={`${index}_${item.item}`} value={item}>
                              {Utility.removeUnderscore(item)}
                            </option>
                          ))}
                      </select>
                      {errors && errors.classification && (
                        <p id="overtime_errorclassification_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.classification}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Shift Date</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <input type="date"
                        name="shiftDate"
                        id="shiftDate"
                        className="form-control"
                        disabled={true}
                        value={values.shiftDate}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.shiftDate && (
                        <p id="overtime_errorshiftdate_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.shiftDate}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>Start</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <input type="time"
                        name="otStart"
                        id="otStart"
                        className="form-control"
                        disabled={true}
                        value={values.otStart}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.otStart && (
                        <p id="overtime_errorotstart_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.otStart}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3" >
                      <label>End</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <input type="time"
                        name="otEnd"
                        id="otEnd"
                        className="form-control"
                        disabled={true}
                        value={values.otEnd}
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      />
                      {errors && errors.otEnd && (
                        <p id="overtime_errorotend_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.otEnd}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3">
                      <label>Work Type</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <select
                        id="overtime_worktype_viewovertimeselect"
                        className="form-select"
                        value={values.location}
                        disabled={true}
                        name="location"
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      >
                        <option value="" disabled selected>
                          Select Work Type
                        </option>
                        <option value="ON_SITE">On Site</option>
                        <option value="WORK_FROM_HOME">Work From Home</option>
                      </select>
                      {errors && errors.location && (
                        <p id="overtime_errorworktype_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.location}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3">
                      <label>Breaktime Duration (minutes)</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <select
                        id="overtime_breaktimeduration_viewovertimeselect"
                        className="form-select"
                        value={values.breaktimeDuration}
                        disabled={true}
                        name="breaktimeDuration"
                        onChange={(e) => {
                          setFormField(e, setFieldValue)
                        }}
                      >
                        <option value="" disabled selected>
                          Select Breaktime Duration
                        </option>
                        <option value="0">0</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                        <option value="60">60</option>
                      </select>
                      {errors && errors.breaktimeDuration && (
                        <p id="overtime_errorbreaktimeduration_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.breaktimeDuration}</p>
                      )}
                    </div>
                    <div className="form-group col-md-6 mb-3"></div>
                    <div className="form-group col-md-12 mb-3" >
                      <label>Indicate Ticket Number (If Applicable) and Reason</label>
                      <span className="text-danger ml-2 text-md">*</span>
                      <textarea
                        name="reason"
                        id="reason"
                        className="form-control p-2"
                        disabled={true}
                        style={{ minHeight: 100 }}
                        value={values.reason}
                        onChange={(e) => setFormField(e, setFieldValue)}
                      />
                      {errors && errors.reason && (
                        <p id="overtime_errorreason_viewovertimep" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
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
