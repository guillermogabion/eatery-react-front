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
import { Formik } from "formik"
import { async } from "validate.js"
import { useDispatch, useSelector } from "react-redux"
import ReactPaginate from 'react-paginate';
import * as Yup from "yup";
import { eye, action_approve, action_edit, action_cancel, action_decline } from "../../assets/images"
import EmployeeDropdown from "../../components/EmployeeDropdown"

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
        "shiftDate" : "",
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

    if (data.profile.role == 'EXECUTIVE') {
      RequestAPI.getRequest(
        `${Api.getAllCOA}?size=10${queryString}&page=${page}`,
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
        `${Api.allMyCOA}?size=10${queryString}&page=${page}`,
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.approveCoa, "", { "id": id }, {}, async (res: any) => {
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
              getAllCOARequest(0, key)
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

  const cancelAttendanceReversal = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this attendance reversal.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.cancelCOA, "", { "id": id }, {}, async (res: any) => {
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
              getAllCOARequest(0, key)
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.postRequest(Api.declineCoa, "", { "id": id }, {}, async (res: any) => {
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
              getAllCOARequest(0, key)
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
        <Table responsive="lg">
          <thead>
            <tr>
              {
                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                  <>
                    <th style={{ width: 'auto' }}>Employee Name</th>
                  </> : null
              }
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
                    {
                      data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                        <>
                          <td> {item.lastName}, {item.firstName} </td>
                        </> : null
                    }
                    <td>{item.type}</td>
                    <td> {item.reason} </td>
                    <td> {item.statusChangedBy} </td>
                    <td> {item.status} </td>
                    <td className="d-flex">
                      <label
                        onClick={() => {
                          getViewCoa(item.id)
                        }}
                      >
                        <img src={eye} width={20} className="hover-icon-pointer mx-1" title="View" />

                      </label>
                      {
                        item.status != "APPROVED" && item.status != "DECLINED_CANCELLED" ?
                          <>
                            {authorizations.includes("Request:Update") ? (
                              <>
                                <label
                                  onClick={() => {
                                    getCoa(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                </label>
                                <br />
                              </>
                            ) : null}

                            {authorizations.includes("Request:Approve") && data.profile.role == 'EXECUTIVE' ? (
                              <>
                                <label
                                  onClick={() => {
                                    approveCoa(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img src={action_approve} width={20} className="hover-icon-pointer mx-1" title="Approve" />
                                </label> <br />
                              </>
                            ) : null}

                            {authorizations.includes("Request:Reject") && data.profile.role == 'EXECUTIVE' ? (
                              <>
                                <label
                                  onClick={() => {
                                    declineCoa(item.id)
                                  }}
                                  className="text-muted cursor-pointer">

                                  <img src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Decline" />
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
                                  onClick={() => {
                                    cancelAttendanceReversal(item.id)
                                  }}
                                  className="text-muted cursor-pointer">
                                  <img src={action_cancel} width={20} className="hover-icon-pointer mx-1" title="Cancel" />
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
                <div className="w-100 pt-2">
                <div className="fieldtext d-flex col-md-3 w-100">
                    {
                      data.profile.role == 'EXECUTIVE' ?
                        <div className="" style={{ width: 200, marginRight: 10 }}>
                          <label>Employee</label>
                          <EmployeeDropdown
                            placeholder={"Employee"}
                            singleChangeOption={singleChangeOption}
                            name="userId"
                            value={filterData && filterData['userId']}
                          />
                        </div>
                        :
                        null
                    }
                    
                    <div>
                      <Button
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
                    <Tab eventKey="all" title="All">
                      {COATable()}
                    </Tab>
                    <Tab eventKey="pending" title="Pending">
                      {COATable()}
                    </Tab>
                    <Tab eventKey="APPROVED" title="Approved" >
                      {COATable()}
                    </Tab>
                    <Tab eventKey="declined" title="Rejected/Cancelled">
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
                  <Button
                    className="mx-2"
                    onClick={() => {
                      setModalShow(true),
                        handleRemoveAllItems()
                    }}>Request for Attendance Reversal</Button>
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
                  ErrorSwal.fire(
                    'Warning!',
                    'Please fill all the required fields.',
                    'warning'
                  )
                } else {
                  valuesObj.coaBd = coaBreakdown
                }

                if (coaId) {
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
                        id="type"
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
                              {item.replaceAll('_', ' ')}
                            </option>
                          ))}
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
                        <p style={{ color: "red", fontSize: "10px" }}>{errors.reason}</p>
                      )}

                      {/* {showReason && (
                          <div className="form-group col-md-12 mb-3">
                            <label>Reason</label>
                            <textarea
                              name="reason"
                              id="reason"
                              value={values.reason}
                              className="form-control"
                              style={{ height: "200px" }}
                              onChange={(e) => {
                                setFieldValue("reason", e.target.value);
                              }}
                            />
                          </div>
                        )} */}
                    </div>

                    {coaBreakdown.map((values: any, index: any) => (
                      <div key={`coaBreakdown-${index}`}>
                        <div className="form-group row">
                          <div className="col-md-3 mb-3">
                            <label>Shift Date *</label>
                              <input
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

                          <div className="col-md-3 mb-3 mt-4">
                            <select
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
                              <p style={{ color: "red", fontSize: "10px" }}>{errors.shiftDate}</p>
                            )}
                          </div>
                          <div className="col-md-4 mb-3">
                            {touched.errors && errors.date && (
                              <p style={{ color: "red", fontSize: "10px" }}>{errors.date}</p>
                            )}
                          </div>
                          <div className="col-md-4 mb-3">
                            {touched.errors && errors.coaBdType && (
                              <p style={{ color: "red", fontSize: "10px" }}>{errors.coaBdType}</p>
                            )}
                          </div>
                          <div className="col-md-4 mb-3">
                            {touched.errors && errors.time && (
                              <p style={{ color: "red", fontSize: "10px" }}>{errors.time}</p>
                            )}
                          </div>

                        </div>

                        <button
                          className="btn btn btn-outline-primary me-2 mb-2"
                          onClick={() => handleRemoveItem(index)}>Remove</button>
                      </div>
                    ))}

                    <div className="d-flex justify-content-end px-5">
                      <button
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
        {/* End Create User Modal Form */}

        {/* start of view dialog */}

        <Modal
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
              <p>Name : <span>{initialValues.lastName + ' ' + initialValues.firstName}</span> <span>{ }</span></p>
              <p>Reason : {initialValues.reason}</p>
              <p>Type : {initialValues.type}</p>
              <p>Status : {initialValues.status}</p>

              <Table responsive="lg" style={{ maxHeight: '100vh' }}>
                <thead>
                  <tr>
                    <th style={{ width: '100px'}}>Shift Date</th>
                    <th style={{ width: '100px'}}>Type</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {coaBreakdown.map((initialValues, index) => (
                    <tr key={`coaBreakdown-${index}`}>
                      <td>{initialValues.shiftDate}</td>
                      <td>{initialValues.coaBdType}</td>
                      <td>{initialValues.date}</td>
                      <td>{initialValues.time}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Modal.Body>

        </Modal>
      </div>

    </div>

  )
}
