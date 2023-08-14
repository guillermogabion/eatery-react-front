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


export const SquadAttendanceCorrection = (props: any) => {
  const [coaBreakdownCount, setCoaBreakdownCount] = useState(0);
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [coaBreakdown, setCoaBreakdown] = useState<any>([]);
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [modalViewShow, setModalViewShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [allCOA, setAllCOA] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);
  const [coaId, setCoaId] = useState<any>("");
  const [fields, setFields] = useState<any>([]);
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
      setCoaBreakdown([...coaBreakdown, { date: "", coaBdType: "", time: "" }]);
      setCoaBreakdownCount(coaBreakdownCount + 1);
    }
  };


  const handleRemoveItem = (index) => {
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
    "type": "Biometric_Device_Malfunction",
    "reason": "",
    "coaBd": [
      {
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

  const getAllCOARequest = (page: any = 0, status: any = "all") => {
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


    RequestAPI.getRequest(
      `${Api.getAllSquadCoa}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
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

  const approveCoa = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this Attendance.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "squadattendancecorrection_approvecoaconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "squadattendancecorrection_approvecoacancel_alertbtn"
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
        RequestAPI.postRequest(Api.approveCoa, "", { "id": id }, {}, async (res: any) => {
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
              getAllCOARequest(0, key)
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
  const declineCoa = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to decline this Attendance.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "squadattendancecorrection_declinecoaconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "squadattendancecorrection_declinecoacancel_alertbtn"
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
        RequestAPI.postRequest(Api.declineCoa, "", { "id": id }, {}, async (res: any) => {
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
              getAllCOARequest(0, key)
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
  const cancelAttendanceReversal = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this attendance reversal.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "squadattendancecorrection_cancelcoaconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "squadattendancecorrection_cancelcoacancel_alertbtn"
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
              getAllCOARequest(0, key)
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



  const COATable = useCallback(() => {
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Employee Name</th>
              <th style={{ width: 'auto' }}>Type</th>
              <th style={{ width: 'auto' }}>Reason</th>
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
                return (
                  <tr>
                    <td id={"squadattendancecorrection_name_allcoadata_" + item.id}> {item.lastName}, {item.firstName}</td>
                    <td id={"squadattendancecorrection_type_allcoadata_" + item.id}>{Utility.removeUnderscore(item.type)}</td>
                    <td id={"squadattendancecorrection_reason_allcoadata_" + item.id}> {item.reason} </td>
                    <td id={"squadattendancecorrection_statuschangedby_allcoadata_" + item.id}> {item.statusChangedBy} </td>
                    <td id={"squadattendancecorrection_status_allcoadata_" + item.id}> {Utility.removeUnderscore(item.status)} </td>
                    <td>

                      <label
                        id={"squadattendancecorrection_view_allcoalabel_" + item.id}
                        onClick={() => {
                          getViewCoa(item.id)
                        }}
                      >
                        <img id={"squadattendancecorrection_eye_allcoaimg_" + item.id} src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                      </label>
                      <>
                        {authorizations.includes("Request:Update") && item.status == "PENDING" ? (
                          <>
                            <label
                              id={"squadattendancecorrection_actionedit_allcoalabel_" + item.id}
                              onClick={() => {
                                getCoa(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadattendancecorrection_actionedit_allcoaimg_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                            </label>
                          </>
                        ) : null}

                        {authorizations.includes("Request:Approve") && item.status == "PENDING" ? (
                          <>
                            <label
                              id={"squadattendancecorrection_actionapprove_allcoalabel_" + item.id}
                              onClick={() => {
                                approveCoa(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadattendancecorrection_actionapprove_allcoaimg_" + item.id} src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                            </label>
                          </>
                        ) : null}

                        {authorizations.includes("Request:Reject") && item.status == "PENDING" ? (
                          <>
                            <label
                              id={"squadattendancecorrection_actiondecline_allcoalabel_" + item.id}
                              onClick={() => {
                                declineCoa(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadattendancecorrection_actiondecline_allcoaimg_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
                            </label>
                          </>
                        ) : null}
                      </>
                      <>
                        {authorizations.includes("Request:Update") && (item.status == "APPROVED" || item.status == "PENDING") ? (
                          <>
                            <label
                              id={"squadattendancecorrection_actioncancel_allcoalabel_" + item.id}
                              onClick={() => {
                                cancelAttendanceReversal(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"squadattendancecorrection_actioncancel_allcoaimg_" + item.id} src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
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
      <div className="w-100 px-5 py-5">
        <div>
          <div className="w-100 pt-2">
            <div className="fieldtext d-flex col-md-3 w-100">
              <div className="" style={{ width: 200, marginRight: 10 }}>
                <label>Employee</label>
                <EmployeeDropdown
                  id="squadattendancecorrection_employee_maindropdown"
                  squad={true}
                  placeholder={"Employee"}
                  singleChangeOption={singleChangeOption}
                  name="userId"
                  value={filterData && filterData['userId']}
                />
              </div>
              <div>
                <Button
                  id="squadattendancecorrection_search_mainbtn"
                  style={{ width: 120 }}
                  onClick={() => getAllCOARequest(0, key)}
                  className="btn btn-primary mx-2 mt-4">
                  Search
                </Button>
              </div>
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                setAllCOA([])
                getAllCOARequest(0, k)
              }}
              className="mb-3"
            >
              <Tab id="squadattendancecorrection_all_maintab" eventKey="all" title="All">
                {COATable()}
              </Tab>
              <Tab id="squadattendancecorrection_pending_maintab" eventKey="pending" title="Pending">
                {COATable()}
              </Tab>
              <Tab id="squadattendancecorrection_approved_maintab" eventKey="APPROVED" title="Approved" >
                {COATable()}
              </Tab>
              <Tab id="squadattendancecorrection_declined_maintab" eventKey="declined" title="Rejected/Cancelled">
                {COATable()}
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


        }}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Attendance Reversal
            {/* {coaId ? 'Update Attendance Reversal' : 'Create Attendance Reversal'} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row w-100 px-5">
          <Formik
            innerRef={formRef}
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={null}
            onSubmit={(values, actions) => {
              actions.resetForm();
              actions.setErrors({});
              const valuesObj: any = { ...values }
              valuesObj.coaBd = coaBreakdown
              if (coaId) {
                console.log(valuesObj)
                delete valuesObj.userId
                RequestAPI.putRequest(Api.UpdateCOA, "", valuesObj, {}, async (res: any) => {
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
                      setCoaBreakdown([])
                      getAllCOARequest(0, key)
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
                  setCoaBreakdownCount(0);

                })


              } else {
                RequestAPI.postRequest(Api.CreateCOA, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    console.log("Response body:", res);
                    if (body.error && body.error.message) {
                      ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "",
                        'error'
                      )
                      setCoaBreakdown([])
                      getAllCOARequest(0, key)
                      setModalShow(false)
                      formRef.current?.resetForm()
                    } else {
                      ErrorSwal.fire(
                        'Success!',
                        (body.data) || "",
                        'success'
                      )
                      setCoaBreakdown([]);
                      getAllCOARequest(0, key);
                      setModalShow(false);
                      formRef.current?.resetForm()

                    }
                    setCoaBreakdownCount(0);

                  }
                })

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
                      id="squadattendancecorrection_types"
                      onChange={(e) => {
                        setFieldValue('type', e.target.value);
                        setShowReason(e.target.value === 'Others');
                      }}
                      value={values.type}
                    >
                      <option value="Biometric_Device_Malfunction">Biometric Device Malfunction</option>
                      <option value="Power_Outage">Power Outage</option>
                      <option value="Others">Others</option>
                    </select>
                    <div className="form-group col-md-12 mb-3">
                      <label>Reason</label>
                      <textarea
                        name="reason"
                        id="reason"
                        value={values.reason}
                        className={`form-control ${touched.reason && errors.reason ? 'is-invalid' : ''}`}
                        style={{ height: "100px" }}
                        onChange={(e) => {
                          setFieldValue("reason", e.target.value);
                        }}
                      />
                    </div>
                    {touched.errors && errors.reason && (
                      <p id="squadattendancecorrection_errorreason_mainp" style={{ color: "red", fontSize: "10px" }}>{errors.reason}</p>
                    )}

                  </div>

                  {coaBreakdown.map((values, index) => (
                    <div key={`coaBreakdown-${index}`}>
                      <div className="form-group row">
                        <div className="col-md-4 mb-3">
                          <label>Date</label>
                          <input
                            id="squadattendancecorrection_date_maininput"
                            type="date"
                            name="date"
                            value={values.date}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].date = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                          />
                        </div>

                        <div className="col-md-4 mb-3 mt-4">
                          <select
                            id="squadattendancecorrection_coabdtype_mainselect"
                            name="coaBdType"
                            value={values.coaBdType}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].coaBdType = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${touched.coaBdType && errors.coaBdType ? 'is-invalid' : ''}`}
                          >
                            {options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label>Time</label>
                          <input
                            id="squadattendancecorrection_time_maininput"
                            type="time"
                            name="time"
                            value={values.time}
                            onChange={(e) => {
                              const updatedFields = [...coaBreakdown];
                              updatedFields[index].time = e.target.value;
                              setCoaBreakdown(updatedFields);
                            }}
                            className={`form-control ${touched.time && errors.time ? 'is-invalid' : ''}`}

                          />


                        </div>

                      </div>
                      <div className="form-group row">
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.date && (
                            <p id="squadattendancecorrection_errordate_mainp" style={{ color: "red", fontSize: "10px" }}>{errors.date}</p>
                          )}
                        </div>
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.coaBdType && (
                            <p id="squadattendancecorrection_errorcoabdtype_mainp" style={{ color: "red", fontSize: "10px" }}>{errors.coaBdType}</p>
                          )}
                        </div>
                        <div className="col-md-4 mb-3">
                          {touched.errors && errors.time && (
                            <p id="squadattendancecorrection_time_mainp" style={{ color: "red", fontSize: "10px" }}>{errors.time}</p>
                          )}
                        </div>

                      </div>

                      <button
                        id="squadattendancecorrection_remove_mainbtn"
                        className="btn btn btn-outline-primary me-2 mb-2"
                        onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                  ))}

                  <div className="d-flex justify-content-end px-5">
                    <button
                      id="squadattendancecorrection_addfield_mainbtn"
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
                        id="squadattendancecorrection_save_mainbtn"
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
            <p id="squadattendancecorrection_name_reqinfop">Name : <span>{initialValues.lastName + ' ' + initialValues.firstName}</span> <span>{ }</span></p>
            <p id="squadattendancecorrection_reason_reqinfop">Reason : {initialValues.reason}</p>
            <p id="squadattendancecorrection_type_reqinfop">Type : {initialValues.type}</p>
            <p id="squadattendancecorrection_status_reqinfop">Status : {initialValues.status}</p>

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
                    <td id="squadattendancecorrection_shiftdate_reqinfodata">{Utility.formatDate(initialValues.shiftDate, 'MM-DD-YYYY')}</td>
                    <td id="squadattendancecorrection_coabdtype_reqinfodata">{initialValues.coaBdType}</td>
                    <td id="squadattendancecorrection_date_reqinfodata">{Utility.formatDate(initialValues.date, 'MM-DD-YYYY')}</td>
                    <td id="squadattendancecorrection_time_reqinfop">{initialValues.time}</td>
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
