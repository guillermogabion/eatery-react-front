import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { Formik } from "formik"
import moment from "moment"
import { Button, Form, Modal, Table } from "react-bootstrap"
import Tab from 'react-bootstrap/Tab'
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

export const AttendanceCorrection = (props: any) => {
  const [coaBreakdownCount, setCoaBreakdownCount] = useState(0);
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const masterList = useSelector((state: any) => state.rootReducer.masterList)
  const { authorizations } = data?.profile
  const [coaBreakdown, setCoaBreakdown] = useState<any>([]);
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [modalViewShow, setModalViewShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [actionable, setIsActionable] = React.useState(false);
  const [allCOA, setAllCOA] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);
  const [coaId, setCoaId] = useState<any>("");
  const [fields, setFields] = useState<any>([]);
  const [hasError, setHasError] = useState<any>(false);
  const formRef: any = useRef()

  // const handleAddField = () => {
  //   setCoaBreakdown([
  //     ...coaBreakdown,
  //     {
  //       date: "",
  //       time: "",
  //       coaBdType: "",
  //     },
  //   ]);
  // };

  const handleAddField = () => {
    if (coaBreakdownCount < 2) {
      setCoaBreakdown([...coaBreakdown, { shiftDate: "", date: "", coaBdType: "", time: "" }]);
      setCoaBreakdownCount(coaBreakdownCount + 1);
    }
  };


  const handleRemoveItem = (index: any) => {
    const updatedFields = [...coaBreakdown];
    updatedFields.splice(index, 1);
    setCoaBreakdown(updatedFields);
    setCoaBreakdownCount(coaBreakdownCount - 1); // update the count
  }
  const handleRemoveAllItems = () => {
    setCoaBreakdown([]);

  };


  const tableHeaders = [
    'Date Filed',
    'Type',
    'Time In',
    'Time Out',
    'Reason',
    'status',
    'Action',
  ]
  const [initialValues, setInitialValues] = useState<any>({
    "type": "Forgot_To_Login_Logout",
    "reason": "",
    "coaBd": [
      {
        "shiftDate": "",
        "date": "",
        "coaBdType": "",
        "time": ""
      }
    ]
  })
  const [showReason, setShowReason] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    getAllCOARequest(0, key)
  }, [])

  const getAllCOARequest = (page: any = 0, status: any = "all", isActionable: any = false) => {
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
        `${Api.getAllCOA}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setAllCOA(body.data)
            }
          }
        }
      )
    } else {
      RequestAPI.getRequest(
        `${Api.allMyCOA}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body) {
            if (body.error && body.error.message) {
            } else {
              setAllCOA(body.data)
            }
          }
        }
      )
    }
  }
  const getCoa = (id: any = 0) => {

    RequestAPI.getRequest(
      `${Api.getCoaInfo}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        console.log("Response:", res);
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            setInitialValues(valueObj)
            setCoaBreakdown(valueObj.breakdown)
            setCoaId(valueObj.id)
            setModalShow(true)
          }
        }
      }
    )
  }

  const approveCoa = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this Attendance.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "attendancecorrections_approveconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "attendancecorrections_approvecancel_alertbtn"
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
        RequestAPI.postRequest(Api.approveCoa, "", { "id": id }, {}, async (res: any) => {
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
                    confirmButton.id = "attendancecorrection_errorconfirm_alertbtn"
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
                    confirmButton.id = "attendancecorrection_successconfirm_alertbtn"
                },
                icon: 'success',
              })
              getAllCOARequest(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton)
                  confirmButton.id = "attendancecorrection_errorconfirm2_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }

  const cancelAttendanceReversal = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this attendance reversal.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "attendancecorrections_cancelarconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "attendancecorrections_cancelarcancel_alertbtn"
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
        RequestAPI.postRequest(Api.cancelCOA, "", { "id": id }, {}, async (res: any) => {
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
                    confirmButton.id = "attendancecorrection_errorconfirm3_alertbtn"
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
                    confirmButton.id = "attendancecorrection_successconfirm2_alertbtn"
                },
                icon: 'success',
              })
              getAllCOARequest(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton)
                  confirmButton.id = "attendancecorrection_errorconfirm4_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }
  const getViewCoa = (id: any = 0) => {

    RequestAPI.getRequest(
      `${Api.getCoaInfo}?id=${id}`,
      "",
      {},
      {},
      async (res: any) => {
        console.log("Response:", res);
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {

          if (body.error && body.error.message) {
          } else {
            const valueObj: any = body.data
            setInitialValues(valueObj)
            setCoaBreakdown(valueObj.breakdown)
            setCoaId(valueObj.id)
            setModalViewShow(true)
          }
        }
      }
    )
  }


  const declineCoa = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this Attendance.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton)
          confirmButton.id = "attendancecorrections_declinecoaconfirm_alertbtn"

        if (cancelButton)
          cancelButton.id = "attendancecorrections_declinecoacancel_alertbtn"
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
        RequestAPI.postRequest(Api.declineCoa, "", { "id": id }, {}, async (res: any) => {
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
                    confirmButton.id = "attendancecorrection_errorconfirm5_alertbtn"
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
                    confirmButton.id = "attendancecorrection_successconfirm3_alertbtn"
                },
                icon: 'success',
              })
              getAllCOARequest(0, key)
            }
          } else {
            Swal.close()
            ErrorSwal.fire({
              title: 'Error!',
              text: "Something Error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton)
                  confirmButton.id = "attendancecorrection_errorconfirm6_alertbtn"
              },
              icon: 'error',
            })
          }
        })
      }
    })
  }
  const dateBreakdown = (date: any) => {
    let coasBreakdown = []
    coasBreakdown.push({
      "date": moment(date).add
    })
  }

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  };
  const options = [
    { label: "Select Log Type", value: "" },
    { label: "Time In", value: "TIME_IN" },
    { label: "Time Out", value: "TIME_OUT" }
  ];
  const handlePageClick = (event: any) => {
    getAllCOARequest(event.selected, key)
  };
  const validationSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    time: Yup.date().required('Time is required'),
  });

  const handleModalHide = useCallback(() => {
    setInitialValues({
      "type": "Forgot_To_Login_Logout",
      "reason": "",
      "coaBd": [
        {
          "shiftDate": "",
          "date": "",
          "coaBdType": "",
          "time": ""
        }
      ]
    })
  }, [])

  function limitText(text, limit) {
    if (text.length <= limit) {
      return text;
    } else {
      return text.substring(0, limit) + '...';
    }
  }

  const COATable = useCallback(() => {
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
              <th style={{ width: 'auto' }}>Type</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Shift Date</th>
              <th style={{ width: 'auto' }}>Date Filed</th>
              <th style={{ width: 'auto' }}>Action Taken By</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              allCOA &&
              allCOA.content &&
              allCOA.content.length > 0 &&
              allCOA.content.map((item: any, index: any) => {
                let shift_dates: any = []
                item.breakdown.forEach((breakdown: any, breakdownIndex: any) => {
                  shift_dates.push(Utility.formatDate(breakdown.shiftDate, 'MM-DD-YYYY'))
                })

                return (
                  <tr>
                    {
                      data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                        <>
                          <td id={"attendancecorrection_name_data_" + item.id}> {item.lastName}, {item.firstName} </td>
                        </> : null
                    }
                    <td id={"attendancecorrection_type_data_" + item.id}>{Utility.removeUnderscore(item.type)}</td>
                    <td id={"attendancecorrection_reason_data_" + item.id}> {limitText(item.reason, 20)} </td>
                    <td id={"attendancecorrection_reason_data_" + item.id}> {shift_dates.toString().replaceAll(',', ', ')} </td>
                    <td id={"attendancecorrection_filedate_data_" + item.id}> {Utility.formatDate(item.fileDate, 'MM-DD-YYYY')}</td>
                    <td id={"attendancecorrection_statuschangedby_data_" + item.id}> {item.statusChangedBy} </td>
                    <td id={"attendancecorrection_status_data_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                    <td className="d-flex" id={"attendancecorrection_labels_data_" + item.id}>
                      <label id={"attendancecorrection_id_label_" + item.id}
                        onClick={() => {
                          getViewCoa(item.id)
                        }}
                      >
                        <img id={"attendancecorrection_eye_img_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                      </label>
                      {
                        item.status != "APPROVED" && item.status != "DECLINED" && item.status != "CANCELLED" ?
                          <>
                            {authorizations.includes("Request:Update") ? (
                              <>
                                <label id={"attendancecorrection_getcoaid_label_" + item.id}
                                  onClick={() => {
                                    getCoa(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img id={"attendancecorrection_actionedit_img_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                </label>
                                <br />
                              </>
                            ) : null}

                            {authorizations.includes("Request:Approve") && data.profile.role == 'EXECUTIVE' ? (
                              <>
                                <label id={"attendancecorrection_approvecoaid_label_" + item.id}
                                  onClick={() => {
                                    approveCoa(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img id={"attendancecorrection_actionapprove_img_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                </label> <br />
                              </>
                            ) : null}

                            {authorizations.includes("Request:Reject") && data.profile.role == 'EXECUTIVE' ? (
                              <>
                                <label id={"attendancecorrection_declinecoaid_label_" + item.id}
                                  onClick={() => {
                                    declineCoa(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img id={"attendancecorrection_actiondecline_img_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
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
                                <label id={"attendancecorrection_cancelarid_label_" + item.id}
                                  onClick={() => {
                                    cancelAttendanceReversal(item.id)
                                  }}
                                  className="text-muted cursor-pointer">
                                  <img id={"attendancecorrection_actioncancelar_img_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
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
          allCOA &&
            allCOA.content &&
            allCOA.content.length == 0 ?
            <div className="w-100 text-center">
              <label htmlFor="">No Records Found</label>
            </div>
            :
            null
        }
      </div>
    )
  }, [allCOA])

  const singleChangeOption = (option: any, name: any) => {

    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }

  return (
    <ContainerWrapper contents={<>
      <div className="w-100 px-5 py-5" style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
        <div>
          <div className="w-100 pt-2">
            <div className="d-flex col-md-3 w-100 mb-1">
              {
                data.profile.role == 'EXECUTIVE' ?
                  <div className="" style={{ width: 200, marginRight: 10 }}>
                    <div>
                      <label>Employee</label>
                      <EmployeeDropdown
                        id="attendancecorrection_employee_dropdown"
                        placeholder={"Employee"}
                        singleChangeOption={singleChangeOption}
                        name="userId"
                        value={filterData && filterData['userId']}
                      />
                    </div>
                  </div>
                  :
                  null
              }

              <div>
                {
                  data.profile.role == 'EXECUTIVE' ?
                    <Button
                      id="attendancecorrection_getallcoarequestsearch_btn"
                      style={{ width: 120 }}
                      onClick={() => getAllCOARequest(0, key, actionable)}
                      className="btn btn-primary mx-2 mt-4">
                      Search
                    </Button>
                    :
                    null
                }

              </div>
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setAllCOA([])
                if (k == 'actionable') {
                  getAllCOARequest(0, k, true)
                } else {
                  getAllCOARequest(0, k)
                }
              }}
              className="mb-3"
            >
              <Tab id="attendancecorrection_allcoa_tab" eventKey="all" title="All">
                {COATable()}
              </Tab>
              <Tab id="attendancecorrection_pendingcoa_tab" eventKey="pending" title="Pending">
                {COATable()}
              </Tab>
              <Tab id="attendancecorrection_approvedcoa_tab" eventKey="APPROVED" title="Approved" >
                {COATable()}
              </Tab>
              <Tab id="attendancecorrection_declinedcoa_tab" eventKey="declined" title="Rejected/Cancelled">
                {COATable()}
              </Tab>
              {
                data.profile.role == 'EXECUTIVE' &&
                (
                  <Tab id="attendancecorrection_actionablecoa_tab" eventKey="actionable" title="Actionable">
                    {COATable()}
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
              pageCount={(allCOA && allCOA.totalPages) || 0}
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
        <div className="d-flex justify-content-end mt-3" >
          <div>
            <Button
              id="attendancecorrection_requestar_btn"
              className="mx-2"
              onClick={() => {
                setModalShow(true),
                  handleRemoveAllItems()
              }}>Request Attendance Reversal</Button>
          </div>
        </div>
      </div>

      <Modal
        show={modalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setCoaId(null);
          setModalShow(false)
          setShowReason(false);
          handleModalHide()
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="text-center mx-auto">
            Request Attendance Reversal
            {/* {coaId ? 'Update Attendance Reversal' : 'Create Attendance Reversal'} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row px-3">
          <Formik
            innerRef={formRef}
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={null}
            onSubmit={(values, actions) => {

              actions.resetForm();
              actions.setErrors({});
              const valuesObj: any = { ...values }
              let hasError = false
              coaBreakdown.forEach((element: any, index: any) => {
                if (element.shiftDate == "") {
                  hasError = true
                }
                if (element.coaBdType == "") {
                  hasError = true
                }
                if (element.date == "") {
                  hasError = true
                }
                if (element.time == "") {
                  hasError = true
                }
              });
              if (hasError) {
                ErrorSwal.fire({
                  title: 'Warning!',
                  text: "Please fill all the required fields.",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();

                    if (confirmButton)
                      confirmButton.id = "attendancecorrection_warningconfirm_alertbtn"
                  },
                  icon: 'warning',
                })
              } else {
                const loadingSwal = Swal.fire({
                  title: '',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });

                valuesObj.coaBd = coaBreakdown
                if (coaId) {
                  delete valuesObj.userId
                  RequestAPI.putRequest(Api.UpdateCOA, "", valuesObj, {}, async (res: any) => {
                    Swal.close()
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                      if (body.error && body.error.message) {
                        ErrorSwal.fire({
                          title: 'Error!',
                          text: (body.error && body.error.message) || "",
                          didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();

                            if (confirmButton)
                              confirmButton.id = "attendancecorrection_errorconfirm7_alertbtn"
                          },
                          icon: 'error',
                        })
                      } else {
                        ErrorSwal.fire({
                          title: 'Success!',
                          text: (body.data) || "",
                          didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();

                            if (confirmButton)
                              confirmButton.id = "attendancecorrection_successconfirm3_alertbtn"
                          },
                          icon: 'success',
                        })
                        setCoaBreakdown([])
                        getAllCOARequest(0, key)
                        setModalShow(false)
                        formRef.current?.resetForm()
                      }
                    } else {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: "Something Error.",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();

                          if (confirmButton)
                            confirmButton.id = "attendancecorrection_errorconfirm8_alertbtn"
                        },
                        icon: 'error',
                      })
                    }
                    setCoaBreakdownCount(0);
                  })
                } else {
                  RequestAPI.postRequest(Api.CreateCOA, "", valuesObj, {}, async (res: any) => {
                    Swal.close()
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                      console.log("Response body:", res);
                      if (body.error && body.error.message) {
                        ErrorSwal.fire({
                          title: 'Error!',
                          text: (body.error && body.error.message) || "",
                          didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();

                            if (confirmButton)
                              confirmButton.id = "attendancecorrection_errorconfirm9_alertbtn"
                          },
                          icon: 'error',
                        })
                        setCoaBreakdown([])
                        getAllCOARequest(0, key)
                        setModalShow(false)
                        formRef.current?.resetForm()
                      } else {
                        ErrorSwal.fire({
                          title: 'Success!',
                          text: (body.data) || "",
                          didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();

                            if (confirmButton)
                              confirmButton.id = "attendancecorrection_errorconfirm4_alertbtn"
                          },
                          icon: 'success',
                        })
                        setCoaBreakdown([]);
                        getAllCOARequest(0, key);
                        setModalShow(false);
                        formRef.current?.resetForm()
                      }
                      setCoaBreakdownCount(0);
                    }
                  })
                }
              }
            }}
          >
            {({ values, setFieldValue, handleSubmit, errors, touched }) => {
              return (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  id="_formid"
                  autoComplete="off"
                >
                  <div>
                    <label>Type</label>

                    <select
                      className="form-select"
                      name="type"
                      id="attendancecorrection_type"
                      onChange={(e) => {
                        setFieldValue('type', e.target.value);
                        setShowReason(e.target.value === 'Others');
                      }}
                      value={values.type}
                    >
                      {masterList &&
                        masterList.coaTypes &&
                        masterList.coaTypes.length > 0 &&
                        masterList.coaTypes.map((item: any, index: string) => (
                          <option key={`${index}_${item}`} value={item}>
                            {Utility.removeUnderscore(item)}
                          </option>
                        ))}
                    </select>
                    <div className="form-group col-md-12 mb-3">
                      <label>Reason</label>
                      <textarea
                        name="reason"
                        id="reason"
                        value={values.reason}
                        className={`form-control p-2 ${touched.reason && errors.reason ? 'is-invalid' : ''}`}
                        style={{ height: "100px" }}
                        onChange={(e) => {
                          setFieldValue("reason", e.target.value);
                        }}
                      />
                    </div>
                    {touched.errors && errors.reason && (
                      <p id="attendancecorrection_errorreason_p" style={{ color: "red", fontSize: "10px" }}>{errors.reason}</p>
                    )}


                  </div>

                  {coaBreakdown.map((values: any, index: any) => (
                    <div key={`coaBreakdown-${index}`}>
                      <div className="form-group row">
                        <div className="col-md-3 mb-3">
                          <label>Shift Date *</label>
                          <input
                            id="attendancecorrection_shiftdate_coabreakdowninput"
                            type="date"
                            name="shiftDate"
                            value={values.shiftDate}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].shiftDate = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${values.shiftDate == "" ? 'is-invalid' : ''}`}

                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label>Date *</label>
                          <input
                            id="attendancecorrection_date_coabreakdowninput"
                            type="date"
                            name="date"
                            value={values.date}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].date = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${values.date == "" ? 'is-invalid' : ''}`}
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label>Log Type *</label>
                          <select
                            id="attendancecorrection_coabdtype_coabreakdownselect"
                            name="coaBdType"
                            value={values.coaBdType}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].coaBdType = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${values.coaBdType == "" ? 'is-invalid' : ''}`}
                          >
                            {options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3 mb-3">
                          <label>Time *</label>
                          <input
                            id="attendancecorrection_time_coabreakdowninput"
                            type="time"
                            name="time"
                            value={values.time}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].time = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${values.time == "" ? 'is-invalid' : ''}`}

                          />


                        </div>

                      </div>
                      <div className="form-group row">
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.shiftDate && (
                            <p id="attendancecorrection_errorreason_coabreakdownp" style={{ color: "red", fontSize: "10px" }}>{errors.shiftDate}</p>
                          )}
                        </div>
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.date && (
                            <p id="attendancecorrection_errordate_coabreakdownp" style={{ color: "red", fontSize: "10px" }}>{errors.date}</p>
                          )}
                        </div>
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.coaBdType && (
                            <p id="attendancecorrection_errorcoabdtype_coabreakdownp" style={{ color: "red", fontSize: "10px" }}>{errors.coaBdType}</p>
                          )}
                        </div>
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.time && (
                            <p id="attendancecorrection_errortime_coabreakdownp" style={{ color: "red", fontSize: "10px" }}>{errors.time}</p>
                          )}
                        </div>

                      </div>

                      <button
                        id="attendancecorrection_remove_coabreakdownbtn"
                        className="btn btn btn-outline-primary me-2 mb-2"
                        onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                  ))}

                  <div className="d-flex justify-content-end px-5">
                    <button
                      id="attendancecorrection_addfield_coabreakdownbtn"
                      type="button"
                      className="btn btn btn-outline-primary me-2 mb-2 mt-2 "
                      onClick={handleAddField}

                    >
                      Add Field
                    </button>
                  </div>
                  <Modal.Footer>
                    <div className="d-flex justify-content-end px-5">
                      <button
                        id="attendancecorrection_save_coabreakdownbtn"
                        type="submit"
                        className="btn btn-primary"
                        disabled={!coaBreakdown.length}
                      >
                        Save
                      </button>
                    </div>
                  </Modal.Footer>



                </Form>
              )

            }
            }





          </Formik>

        </Modal.Body>

      </Modal>

      <Modal
        size="lg"
        show={modalViewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setCoaId(null);
          setModalViewShow(false)
        }}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Request Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center">
          <div className="container">
            {/* <h4>reason</h4> {{values.reason}} */}
            <p id="attendancecorrection_name_reqestinfop">Name : <span>{initialValues.lastName + ' ' + initialValues.firstName}</span> <span>{ }</span></p>
            <p id="attendancecorrection_reason_reqestinfop">Reason : {initialValues.reason}</p>
            <p id="attendancecorrection_type_reqestinfop">Type : {initialValues.type}</p>
            <p id="attendancecorrection_status_reqestinfop">Status : {initialValues.status}</p>

            <Table responsive style={{ maxHeight: '100vh' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Shift Date</th>
                  <th style={{ width: '100px' }}>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {coaBreakdown.map((initialValues, index) => (
                  <tr key={`coaBreakdown-${index}`}>
                    <td id="attendancecorrection_shiftdate_reqestinfodata">{Utility.formatDate(initialValues.shiftDate, 'MM-DD-YYYY')}</td>
                    <td id="attendancecorrection_coabdtype_reqestinfodata">{initialValues.coaBdType}</td>
                    <td id="attendancecorrection_date_reqestinfodata">{Utility.formatDate(initialValues.date, 'MM-DD-YYYY')}</td>
                    <td id="attendancecorrection_time_reqestinfodata">{initialValues.time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>

      </Modal>
    </>} />
  )
}
