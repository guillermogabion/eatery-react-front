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

export const AttendanceCorrection = (props: any) => {
  const [coaBreakdownCount, setCoaBreakdownCount] = useState(0);
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [coaBreakdown, setCoaBreakdown] = useState<any>([]);
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] =React.useState('all');
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
        "date": "2023-03-21",
        "coaBdType": "TIME_IN",
        "time": ""
      }
    ]
  })
  const [showReason, setShowReason] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    getAllCOARequest(0, "")
  }, [])

  const getAllCOARequest = (page: any = 0, status: any = "All") => {
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
    }else{
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
        const { status, body = {data: {}, error: {}}} : any = res
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
          }else{
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
              getAllCOARequest(0, "")
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
              getAllCOARequest(0, "")
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
      "date" : moment(date).add
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
    getAllCOARequest(event.selected, "")
  };



  const COATable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Type</th>
              <th style={{ width: 'auto' }}>Reason</th>
              <th style={{ width: 'auto' }}>Status</th>
              <th style={{ width: 'auto' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              allCOA &&
              allCOA.content &&
              allCOA.content.length &&
              allCOA.content.map((item: any, index: any) => {
                return (
                  <tr>
                    <td>{item.type}</td>
                    <td> {item.reason} </td>
                    <td> {item.status} </td>
                    <td>
                      {
                        item.status != "APPROVED" && item.status != "DECLINED" ?
                          <>
                          {authorizations.includes("Request:Update") ? (
                            <>
                                <label
                                onClick={() => {
                                  getCoa(item.id)
                                }}
                                className="text-muted cursor-pointer">
                                Update
                              </label>
                              <br />
                            </>
                          ) : null}

                          {authorizations.includes("Request:Approve") ? (
                            <>
                              <label
                              onClick={() => {
                                approveCoa(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Approve
                            </label> <br />
                            </>
                          ) : null}

                            {authorizations.includes("Request:Reject") ? (
                            <>
                            <label
                              onClick={() => {
                                declineCoa(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              Decline
                            </label>
                            <br />
                            </>
                          ) : null}
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
  }, [allCOA])

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
                <div className="w-100 pt-2">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k: any) => {
                    getAllCOARequest(0, k)
                    setKey(k)
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
                    activeClassName="active-page-link"
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
              const valuesObj: any = { ...values }
              valuesObj.coaBd = coaBreakdown
              if(coaId){
                console.log(valuesObj)
                delete valuesObj.userId
                  RequestAPI.putRequest(Api.UpdateCOA, "", valuesObj, {}, async(res : any) => {
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
                        getAllCOARequest(0, "")
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


              }else {
                RequestAPI.postRequest(Api.CreateCOA, "", valuesObj, {}, async (res:any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    console.log("Response body:", res);
                    if(body.error && body.error.message) {
                      ErrorSwal.fire(
                        'Error!',
                        (body.error && body.error.message) || "",
                        'error'
                      )
                      setCoaBreakdown([])
                        getAllCOARequest(0, "")
                        setModalShow(false)
                        formRef.current?.resetForm()
                    } else {
                      ErrorSwal.fire(
                        'Success!',
                        (body.data) || "",
                        'success'
                      )
                      setCoaBreakdown([]);
                      getAllCOARequest(0, "");
                      setModalShow(false);
                      formRef.current?.resetForm();
                    }
                  
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
                              className="form-control"
                              style={{ height: "150px" }}
                              onChange={(e) => {
                                setFieldValue("reason", e.target.value);
                              }}
                            />
                          </div>

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

                      {coaBreakdown.map((values, index) => (
                        <div key={`coaBreakdown-${index}`}>
                         <div className="form-group row">
                            <div className="col-md-4 mb-3">
                              <label>Date</label>
                              <input
                                type="date"
                                name="date"
                                value={values.date}
                                onChange={(e) => {
                                  const updatedFields = [...coaBreakdown];
                                  updatedFields[index].date = e.target.value;
                                  setCoaBreakdown(updatedFields);
                                }}
                                className="form-control"
                              />
                            </div>
                            <div className="col-md-4 mb-3 mt-4">
                              <select
                                name="coaBdType"
                                value={values.coaBdType}
                                onChange={(e) => {
                                  const updatedFields = [...coaBreakdown];
                                  updatedFields[index].coaBdType = e.target.value;
                                  setCoaBreakdown(updatedFields);
                                }}
                                className="form-select"
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
                                type="time"
                                name="time"
                                value={values.time}
                                onChange={(e) => {
                                  const updatedFields = [...coaBreakdown];
                                  updatedFields[index].time = e.target.value;
                                  setCoaBreakdown(updatedFields);
                                }}
                                className="form-control"
                              />
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
      </div>

    </div>

  )
}
