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

export const Holiday = (props: any) => {
  const { history } = props
  let initialPayload = {
    "holidayName": "",
    "holidayType": "OPTIONAL",
    "holidayDate": moment().format("YYYY-MM-DD"),
    "premiumType": "LEGAL_HOLIDAY"
  }


  const userData = useSelector((state: any) => state.rootReducer.userData)
  const masterList = useSelector((state: any) => state.rootReducer.masterList)
  const [isSubmit, setIsSubmit] = useState<any>(false);
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] = React.useState('all');
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [allHoliday, setAllHoliday] = useState<any>([]);
  const [holidayId, setHolidayId] = useState<any>("");
  const [otClassification, setOtClassification] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);
  const [initialValues, setInitialValues] = useState<any>({
    "holidayName": "",
    "holidayType": "OPTIONAL",
    "holidayDate": moment().format("YYYY-MM-DD"),
    "premiumType": "LEGAL_HOLIDAY"
  })
  const formRef: any = useRef()

  useEffect(() => {
    getHolidays(0, "")
  }, [])

  const handlePageClick = (event: any) => {
    getHolidays(event.selected, "")
  };

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }

  const getHolidays = (page: any = 0, status: any = "All") => {

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
      `${Api.allHoliday}?size=10${queryString}&page=${page}&sort=id&sortDir=desc`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setAllHoliday(body.data)
        }
      }
    )
  }


  // const getOT = (id: any = 0) => {
  //   RequestAPI.getRequest(
  //     `${Api.otInformation}?id=${id}`,
  //     "",
  //     {},
  //     {},
  //     async (res: any) => {
  //       const { status, body = { data: {}, error: {} } }: any = res
  //       if (status === 200 && body && body.data) {
  //         if (body.error && body.error.message) {
  //         } else {
  //           const valueObj: any = body.data
  //           valueObj.otStart = moment(valueObj.otStart).format("HH:mm")
  //           valueObj.otEnd = moment(valueObj.otEnd).format("HH:mm")
  //           setInitialValues(valueObj)
  //           // the value of valueObj.id is null - API issue for temp fixing I set ID directly
  //           setHolidayId(id)
  //           setModalShow(true)
  //         }
  //       }
  //     }
  //   )
  // }

  // const overTimeTable = useCallback(() => {
  //   return (
  //     <div>
  //       <Table responsive="lg">
  //         <thead>
  //           <tr>
  //             {data.profile.role != 'EMPLOYEE' ?
  //               <th style={{ width: 'auto' }}>Employee Name</th> :
  //               null
  //             }
  //             <th style={{ width: 'auto' }}>Shift Date</th>
  //             <th style={{ width: 'auto' }}>Classification</th>
  //             <th style={{ width: 'auto' }}>OT Start</th>
  //             <th style={{ width: 'auto' }}>OT End</th>
  //             <th style={{ width: 'auto' }}>File Date</th>
  //             <th style={{ width: 'auto' }}>Reason</th>
  //             <th style={{ width: 'auto' }}>Status</th>
  //             <th style={{ width: 'auto' }}>Action</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {
  //             allHoliday &&
  //             allHoliday.content &&
  //             allHoliday.content.length > 0 &&
  //             allHoliday.content.map((item: any, index: any) => {
  //               return (
  //                 <tr>
  //                   <td> {item.holidayName} </td>
  //                   <td> {item.classification} </td>
  //                   <td> {item.otStart.replace('T', ' ')} </td>
  //                   <td> {item.otEnd.replace('T', ' ')} </td>
  //                   <td> {item.fileDate} </td>
  //                   <td> {item.reason} </td>
  //                   <td> {item.status} </td>
  //                   <td>
  //                     {
  //                       item.status != "APPROVED" && item.status != "DECLINED_CANCELLED" ?
  //                         <>
  //                           {authorizations.includes("Request:Update") ? (
  //                             <>
  //                               <label
  //                                 onClick={() => {
  //                                   getOT(item.id)
  //                                 }}
  //                                 className="text-muted cursor-pointer">
  //                                 Update
  //                               </label>
  //                               <br />
  //                             </>
  //                           ) : null}
  //                           {authorizations.includes("Request:Approve") ? (
  //                             <>
  //                               <label
  //                                 onClick={() => {
  //                                   approveOT(item.id)
  //                                 }}
  //                                 className="text-muted cursor-pointer">
  //                                 Approve
  //                               </label> <br />
  //                             </>
  //                           ) : null}
  //                           {authorizations.includes("Request:Reject") ? (
  //                             <>
  //                               <label
  //                                 onClick={() => {
  //                                   declineOT(item.id)
  //                                 }}
  //                                 className="text-muted cursor-pointer">
  //                                 Decline
  //                               </label>
  //                               <br />
  //                             </>
  //                           ) : null}

  //                         </>
  //                         :
  //                         null
  //                     }
  //                   </td>
  //                 </tr>
  //               )
  //             })
  //           }
  //         </tbody>
  //       </Table>
  //       {
  //         allHoliday &&
  //           allHoliday.content &&
  //           allHoliday.content.length == 0 ?
  //           <div className="w-100 text-center">
  //             <label htmlFor="">No Records Found</label>
  //           </div>
  //           :
  //           null
  //       }
  //     </div>
  //   )
  // }, [allHoliday])

  const deleteHoliday = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this holiday.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        RequestAPI.deleteRequest(`${Api.deleteHoliday}`, "", { "id": id }, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200) {
            getHolidays(0,"")
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
                <h3>Holiday Tagging</h3>
                <div className="w-100 pt-2">
                  <div>
                    <div className="fieldtext d-flex col-md-12">
                      <div className="" style={{ width: 200, marginRight: 10 }}>
                        <label>Holiday Name</label>
                        <input
                          name="holidayName"
                          placeholder="Holiday Name"
                          type="text"
                          autoComplete="off"
                          className="formControl"
                          maxLength={40}
                          onChange={(e) => makeFilterData(e)}
                          onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                        />
                      </div>
                      <div className="" style={{ width: 200, marginRight: 10 }}>
                        <label>Holiday Type</label>
                        <select
                          className={`form-select`}
                          name="holidayType"
                          id="holidayType"
                          value={filterData && filterData['holidayType']}
                          onChange={(e) => makeFilterData(e)}>
                          <option key={`holidayTypeItem}`} value={""}>
                            Select
                          </option>
                          {masterList.holidayType &&
                            masterList.holidayType.length > 0 &&
                            masterList.holidayType.map((item: any, index: string) => (
                              <option key={`${index}_${item.item}`} value={item.item}>
                                {item}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="" style={{ width: 200, marginRight: 10 }}>
                        <label>Premium Type</label>
                        <select
                          className={`form-select`}
                          name="premiumType"
                          id="premiumType"
                          value={filterData && filterData['premiumType']}
                          onChange={(e) => makeFilterData(e)}>
                          <option key={`holidayTypeItem}`} value={""}>
                            Select
                          </option>
                          {masterList.premiumType &&
                            masterList.premiumType.length > 0 &&
                            masterList.premiumType.map((item: any, index: string) => (
                              <option key={`${index}_${item.item}`} value={item.item}>
                                {item}
                              </option>
                            ))}
                        </select>
                      </div>
                      <Button
                        style={{ width: 120 }}
                        onClick={() => getHolidays(0, "")}
                        className="btn btn-primary mx-2 mt-4">
                        Search
                      </Button>
                    </div>
                    <Table responsive="lg">
                      <thead>
                        <tr>
                          <th style={{ width: 'auto' }}>Name</th>
                          <th style={{ width: 'auto' }}>Holiday Type</th>
                          <th style={{ width: 'auto' }}>Premium Type</th>
                          <th style={{ width: 'auto' }}>Date</th>
                          <th style={{ width: 'auto' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          allHoliday &&
                          allHoliday.content &&
                          allHoliday.content.length > 0 &&
                          allHoliday.content.map((item: any, index: any) => {
                            return (
                              <tr>
                                <td> {item.holidayName} </td>
                                <td> {item.holidayType} </td>
                                <td> {item.premiumType} </td>
                                <td> {item.holidayDate} </td>
                                <td className="d-flex">
                                  <label
                                    onClick={() => {
                                      setHolidayId(item.id)
                                      setInitialValues(item)
                                      setModalShow(true)
                                    }}
                                    className="text-muted cursor-pointer">
                                    <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                  </label>
                                  <br />
                                  <label
                                    onClick={() => {
                                      deleteHoliday(item.id)
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
                      allHoliday &&
                        allHoliday.content &&
                        allHoliday.content.length == 0 ?
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
                    pageCount={(allHoliday && allHoliday.totalPages) || 0}
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
                          setHolidayId("")
                          setInitialValues(initialPayload)
                          setModalShow(true)
                        }}>Create Holiday</Button>
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

              {holidayId ? 'Update Holiday' : 'Create Holiday'}

            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 px-5">
            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={
                Yup.object().shape({
                  holidayName: Yup.string().required("Holiday Name is required !"),
                  holidayType: Yup.string().required("Holiday Type is required !"),
                  holidayDate: Yup.string().required("Holiday Date is required !"),
                  premiumType: Yup.string().required("Premium Type is required !"),
                })
              }
              onSubmit={(values, actions) => {
                setIsSubmit(true)
                const valuesObj: any = { ...values }
                if (holidayId) {
                  valuesObj.id = holidayId
                  RequestAPI.putRequest(Api.updateHoliday, "", valuesObj, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                      if (body.error && body.error.message) {
                        ErrorSwal.fire(
                          'Error!',
                          (body.error && body.error.message) || "",
                          'error'
                        )
                      } else {
                        getHolidays(0, "")
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
                    setIsSubmit(false)
                  })
                } else {
                  RequestAPI.postRequest(Api.saveHoliday, "", valuesObj, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                      if (body.error && body.error.message) {
                        ErrorSwal.fire(
                          'Error!',
                          (body.error && body.error.message) || "",
                          'error'
                        )
                      } else {
                        getHolidays(0, "")
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
                    setIsSubmit(false)
                  })
                }

              }}>
              {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                return (
                  <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                    <div className="row w-100 px-5">
                      <div className="form-group col-md-6 mb-3 " >
                        <label>Holiday Type</label>
                        <select
                          className="form-select"
                          name="holidayType"
                          id="holidayType"
                          value={values.holidayType}
                          onChange={(e) => setFormField(e, setFieldValue)}>
                          {masterList.holidayType &&
                            masterList.holidayType.length > 0 &&
                            masterList.holidayType.map((item: any, index: string) => (
                              <option key={`${index}_${item.item}`} value={item.item}>
                                {item}
                              </option>
                            ))}
                        </select>
                        {errors && errors.holidayType && (
                          <p style={{ color: "red", fontSize: "12px" }}>{errors.holidayType}</p>
                        )}
                      </div>
                      <div className="form-group col-md-6 mb-3 " >
                        <label>Premium Type</label>
                        <select
                          className="form-select"
                          name="premiumType"
                          id="premiumType"
                          value={values.premiumType}
                          onChange={(e) => setFormField(e, setFieldValue)}>
                          {masterList.premiumType &&
                            masterList.premiumType.length > 0 &&
                            masterList.premiumType.map((item: any, index: string) => (
                              <option key={`${index}_${item.item}`} value={item.item}>
                                {item}
                              </option>
                            ))}
                        </select>
                        {errors && errors.premiumType && (
                          <p style={{ color: "red", fontSize: "12px" }}>{errors.premiumType}</p>
                        )}
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>Holiday Name</label>
                        <input type="text"
                          name="holidayName"
                          id="holidayName"
                          className="form-control"
                          value={values.holidayName}
                          onChange={(e) => {
                            setFormField(e, setFieldValue)
                          }}
                        />
                        {errors && errors.holidayName && (
                          <p style={{ color: "red", fontSize: "12px" }}>{errors.holidayName}</p>
                        )}
                      </div>
                      <div className="form-group col-md-6 mb-3" >
                        <label>Holiday Date</label>
                        <input type="date"
                          name="holidayDate"
                          id="holidayDate"
                          className="form-control"
                          value={values.holidayDate}
                          onChange={(e) => {
                            setFormField(e, setFieldValue)
                          }}
                        />
                        {errors && errors.holidayDate && (
                          <p style={{ color: "red", fontSize: "12px" }}>{errors.holidayDate}</p>
                        )}
                      </div>
                    </div>
                    <br />
                    <Modal.Footer>
                      <div className="d-flex justify-content-end px-5">
                        <button
                          type="submit"
                          disabled={isSubmit}
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
