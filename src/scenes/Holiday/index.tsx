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
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"

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

  const deleteHoliday = (id: any = 0) => {
    ErrorSwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this holiday.",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if(confirmButton)
          confirmButton.id = "holiday_deleteconfirm_alertbtn"

        if(cancelButton)
          cancelButton.id = "holiday_deletecancel_alertbtn"
      },
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
            getHolidays(0, "")
            ErrorSwal.fire({
              title: 'Deleted!',
              text: (body && body.data) || "",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "holiday_successdeleteconfirm_alertbtn"
              },
              icon: 'success',
          })
          } else {
            //error
            ErrorSwal.fire({
              title: 'Failed!',
              text: (body.error && body.error.message) || "",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "holiday_errorconfirm_alertbtn"
              },
              icon: 'error',
          })
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
      <div className="w-100 px-3 py-5">
        <div>
          <h3>Holiday Tagging</h3>
          <div className="w-100 pt-2">
            <div>
              <div className="fieldtext">
                <div className="row d-flex">
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                    <label>Holiday Name</label>
                    <input
                      id="holiday_holidayname_input"
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
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2">
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
                            { Utility.removeUnderscore(item)}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2">
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
                           { Utility.removeUnderscore(item)}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-1">
                    <Button
                      id="holiday_search_btn"
                      style={{ width: '100%' }}
                      onClick={() => getHolidays(0, "")}
                      className="btn btn-primary mx-2 mt-4">
                    Search
                    </Button>
                  </div>
                </div>
                <div className="col-">
                  
                </div>
                <div className="" style={{ width: 200, marginRight: 10 }}>
                  
                </div>
                <div className="" style={{ width: 200, marginRight: 10 }}>
                  
                </div>
                
              </div>
              <Table responsive className="tableFixHead">
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
                          <td id={"holiday_holidayname_data_" + item.id}> {item.holidayName} </td>
                          <td id={"holiday_holidaytype_data_" + item.id}> {Utility.removeUnderscore(item.holidayType)} </td>
                          <td id={"holiday_premiumtype_data_" + item.id}> {Utility.removeUnderscore(item.premiumType)} </td>
                          <td id={"holiday_holidaydate_data_" + item.id}> {Utility.formatDate(item.holidayDate, 'MM-DD-YYYY')} </td>
                          <td className="d-flex" id={"holiday_labels_data_" + item.id}>
                            <label
                              id={"holiday_update_label_" + item.id}
                              onClick={() => {
                                setHolidayId(item.id)
                                setInitialValues(item)
                                setModalShow(true)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"holiday_actionedit_img_" + item.id} src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                            </label>
                            <br />
                            <label
                              id={"holiday_delete_btn_" + item.id}
                              onClick={() => {
                                deleteHoliday(item.id)
                              }}
                              className="text-muted cursor-pointer">
                              <img id={"holiday_actiondecline_img_" + item.id} src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Delete" />
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
                  id="holiday_create_btn"
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
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "holiday_errorconfirm2_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      getHolidays(0, "")
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "holiday_successconfirm2_alertbtn"
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
                          confirmButton.id = "holiday_errorconfirm3_alertbtn"
                      },
                      icon: 'error',
                  })
                  }
                  setIsSubmit(false)
                })
              } else {
                RequestAPI.postRequest(Api.saveHoliday, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "holiday_errorconfirm4_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      getHolidays(0, "")
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "holiday_successconfirm3_alertbtn"
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
                          confirmButton.id = "holiday_errorconfirm5_alertbtn"
                      },
                      icon: 'error',
                  })
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
                            <option key={`${index}_${item.item}`} value={item}>
                              { Utility.removeUnderscore(item)}
                            </option>
                          ))}
                      </select>
                      {errors && errors.holidayType && (
                        <p id="holiday_errorholidaytype_p" style={{ color: "red", fontSize: "12px" }}>{errors.holidayType}</p>
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
                               { Utility.removeUnderscore(item)}
                            </option>
                          ))}
                      </select>
                      {errors && errors.premiumType && (
                        <p id="holiday_errorpremiumtype_p" style={{ color: "red", fontSize: "12px" }}>{errors.premiumType}</p>
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
                        <p id="holiday_errorholidayname_p" style={{ color: "red", fontSize: "12px" }}>{errors.holidayName}</p>
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
                        <p id="holiday_errorholidaydate_p" style={{ color: "red", fontSize: "12px" }}>{errors.holidayDate}</p>
                      )}
                    </div>
                  </div>
                  <br />
                  <Modal.Footer>
                    <div className="d-flex justify-content-end px-5">
                      <button
                        id="holiday_save_modalbtn"
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
    </>} />
  )
}
