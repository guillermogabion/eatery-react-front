import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import { Formik } from "formik"
import moment from "moment"
import { Button, Form, Modal, Table } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import * as Yup from "yup"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import SingleSelect from "../../components/Forms/SingleSelect"
import TimeDate from "../../components/TimeDate"
import FileUploadService from "../../services/FileUploadService"
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)

export const AttendanceSummary = (props: any) => {
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
  const [ userid, setUserid] =  useState<any>(null)
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

  const [recalculateModal, setRecalculateModal] = React.useState(false)
  const [employee, setEmployee] = useState<any>([]);

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

  const recalculate = (fromDate: any, toDate: any, userid : any) => {
    setIsSubmit(true)

    let queryString = ""
    let filterDataTemp = { ...filterData }
    if (filterDataTemp) {
      Object.keys(filterDataTemp).forEach((d: any) => {
        if (filterDataTemp[d]) {

          queryString += `&${d}=${filterDataTemp[d]}`
        } else {
          queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
        }
      })
    }
    RequestAPI.putRequest(
      `${Api.recalculate}?fromDate=${fromDate}&toDate=${toDate}`,
      "",
      "",
      {},
      async (res: any) => {
        if (res) {
          setIsSubmit(false)
        }

      }
    )

  console.log('DateFrom:', fromDate);
  console.log('DateTo:', toDate);
  console.log('userid:', userid);
  }

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
            ErrorSwal.fire({
              title: 'Failed!',
              text: (data.error.message) || "Something error.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "attendancesummary_failedconfirm_alertbtn"
              },
              icon: 'error',
          })
          } else {
            ErrorSwal.fire({
              title: 'Success!',
              text: "Successfully uploaded.",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "attendancesummary_successconfirm_alertbtn"
              },
              icon: 'success',
          })
            setImportModalShow(false)
          }
        })
        .catch(() => {
          ErrorSwal.fire({
            title: 'Failed!',
            text: "Failed to upload.",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
    
              if(confirmButton)
                confirmButton.id = "attendancesummary_failedcatchconfirm_alertbtn"
            },
            icon: 'error',
        })
        })
    } else {
      ErrorSwal.fire({
        title: 'Warning!',
        text: "File is required.",
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();

          if(confirmButton)
            confirmButton.id = "attendancesummary_warningconfirm_alertbtn"
        },
        icon: 'warning',
    })
    }
  }

  useEffect(() => {
    getAllAttendance(0)
    getAllEmployee()
    RequestAPI.getRequest(
      `${Api.employeeList}`,
      "",
      {},
      {},
      async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200 && body && body.data) {
              if (body.error && body.error.message) {
              } else {
                  let tempArray: any = []
                  body.data.forEach((d: any, i: any) => {
                      tempArray.push({
                          userId: d.userAccountId,
                          label: d.firstname + " " + d.lastname
                      })
                  });
                  setEmployee(tempArray)
              }
        }
      }
    )
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
      `${Api.adminAttendanceSummary}?size=1000${queryString}&page=${page}&sort=id&sortDir=desc`,
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

  useEffect(() => {
    if (filterData) {
      document.removeEventListener("keydown", keydownFun)
      document.addEventListener("keydown", keydownFun)
    }
    return () => document.removeEventListener("keydown", keydownFun)
  }, [filterData])


  const keydownFun = (event: any) => {
    if (event.key === "Enter" && filterData['userid'] && filterData['fromDate'] && filterData['toDate']) {
      getAllAttendance(0)
    }
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

  const setFormField = (e: any, setFieldValue: any) => {
    const { name, value } = e.target
    if (setFieldValue) {
      setFieldValue(name, value)
    }   
}
 

  const attendanceTable = useCallback(() => {
    return (
      <div>
        <Table responsive>
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
                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
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
                          <td id={"attendancesummary_name_allattendancedata_" + item.lastName + item.firstName}> {item.lastName}, {item.firstName} </td>
                          <td id={"attendancesummary_date_allattendancedata_" + item.lastName + item.firstName}> {Utility.formatDate(item.date, 'MM-DD-YYYY')} </td>
                          <td id={"attendancesummary_schedule_allattendancedata_" + item.lastName + item.firstName}> {item.schedule} </td>
                          <td id={"attendancesummary_firstlogin_allattendancedata_" + item.lastName + item.firstName}> {item.firstLogin ? moment(item.firstLogin).format('MM-DD-YYYY hh:mm A') : "No Time In"} </td>
                          <td id={"attendancesummary_lastlogin_allattendancedata_" + item.lastName + item.firstName}> {item.lastLogin ? moment(item.lastLogin).format('MM-DD-YYYY hh:mm A') : "No Time Out"} </td>
                          <td id={"attendancesummary_datatype_allattendancedata_" + item.lastName + item.firstName}> { Utility.removeUnderscore(item.dayType) } </td>
                          <td id={"attendancesummary_status_allattendancedata_" + item.lastName + item.firstName}> {item.status} </td> 
                          {
                            data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                              <td> <label id={"attendancesummary_update_allattendancelabel_" + item.lastName + item.firstName+ item.date}
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
                                <label id={"attendancesummary_delete_allattendancelabel_" + item.lastName + item.firstName}
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
              activeLinkClassName="active-page-link"
              disabledLinkClassName="prev-next-disabled"
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
    <ContainerWrapper contents={<>
      <div className="w-100 px-5 py-5">
        <div>
          <h3>Attendance Summary</h3>

          <div className="w-100 pt-4">
            <div className="fieldtext d-flex col-md-12">
              {
                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                  <>
                    <div className="" style={{ width: 200, marginRight: 10 }}>
                      <label>Employee</label>
                      <SingleSelect id="attendancesummary_employee_summaryselect"
                        type="string"
                        options={employeeList || []}
                        placeholder={"Employee"}
                        onChangeOption={singleChangeOption}
                        name="userid"
                        value={filterData && filterData['userid']}
                      />
                    </div>
                  </>
                  :
                  null
              }

              <div>
                <label>Date From</label>
                <input
                  id="attendancesummary_datefrom_summaryinput"
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
                    id="attendancesummary_dateto_summaryinput"
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
                id="attendancesummary_search_summarybtn"
                style={{ width: 120 }}
                onClick={() => getAllAttendance(0)}
                className="btn btn-primary mx-2 mt-4">
                Search
              </Button>
              {
                data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                  <Button
                    id="attendancesummary_addbiolog_summarybtn"
                    onClick={() => setAddBioModal(true)}
                    disabled={!filterData['userid'] || (filterData['userid'] && filterData['userid'] == "")}
                    className="btn btn-primary mx-2 mt-4 w-auto">
                    Add Biometric Log
                  </Button>
                  :
                  null
              }

            </div>

            {attendanceTable()}
            {
              data.profile.role == 'HR ADMIN' || data.profile.role == 'EXECUTIVE' ?
                <>
                  <div className="d-flex justify-content-end mt-3" >
                    <div>
                      <Button
                        id="attendancesummary_import_summarybtn"
                        className="mx-2"
                        onClick={() => {
                          setImportModalShow(true)
                        }}>Import</Button>
                      <Button
                        id="attendancesummary_export_summarybtn"
                        className="mx-2"
                        onClick={() => {
                          setDownloadModalShow(true)
                        }}>Export</Button>
                      <Button
                        id="attendancesummary_recalculate_summarybtn"
                        className="mx-2"
                        onClick={() => {
                          setRecalculateModal(true)
                        }}>Recalculate</Button>
                      <Button
                        id="attendancesummary_downloadtemplate_summarybtn"
                        className="mx-2"
                        onClick={
                          downloadTemplate
                        }>Download Template</Button>
                    </div>
                  </div>
                </>
                :
                null
            }

          </div>
        </div>

      </div>
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
            id="attendancesummary_submit_modalbtn"
            onClick={() => downloadExcel(fromDate, toDate)}
            disabled={isSubmit}>
            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
          </Button>
        </Modal.Footer>
      </Modal>
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
              id="attendancesummary_file_modalinput"
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
            id="attendancesummary_proceed_modalbtn"
            onClick={() => uploadExcel()}
            disabled={isSubmit}>
            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
          </Button>
        </Modal.Footer>
      </Modal>
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
                    ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "attendancesummary_errrconfirm_alertbtn"
                        },
                        icon: 'error',
                    })
                  } else {
                    ErrorSwal.fire({
                      title: 'Success!',
                      text: (body.data) || "",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "attendancesummary_successconfirm2_alertbtn"
                      },
                      icon: 'success',
                  })
                    getAllAttendance(0)
                    setDeleteBioModal(false)
                    deleteformRef.current?.resetForm()
                  }
                } else {
                  //error
                  ErrorSwal.fire({
                    title: 'Failed!',
                    text: (body.error && body.error.message) || "",
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
            
                      if(confirmButton)
                        confirmButton.id = "attendancesummary_errrconfirm2_alertbtn"
                    },
                    icon: 'error',
                })
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
                        id="attendancesummary_type"
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
                        id="attendancesummary_proceed2_modalbtn"
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
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "attendancesummary_errrconfirm3_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "attendancesummary_successconfirm3_alertbtn"
                        },
                        icon: 'success',
                    })
                      getAllAttendance(0)
                      setAddBioModal(false)
                      formRef.current?.resetForm()
                    }
                  } else {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: "Something Error.",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "attendancesummary_errrconfirm4_alertbtn"
                      },
                      icon: 'error',
                  })
                  }
                })
              } else {
                RequestAPI.postRequest(Api.addBioLogs, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "attendancesummary_errrconfirm5_alertbtn"
                        },
                        icon: 'error',
                    })
                    } else {
                      ErrorSwal.fire({
                        title: 'Success!',
                        text: (body.data) || "",
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "attendancesummary_successconfirm4_alertbtn"
                        },
                        icon: 'success',
                    })
                      getAllAttendance(0)
                      setAddBioModal(false)
                    }
                  } else {
                    ErrorSwal.fire({
                      title: 'Error!',
                      text: "Something Error.",
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "attendancesummary_errrconfirm6_alertbtn"
                      },
                      icon: 'error',
                  })
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
                        id="attendncesummary_type2"
                        value={values.type}
                        onChange={(e) => {
                          setFieldValue('type', e.target.value);
                          if (updateData){
                            updateLog(e.target.value)
                          }
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
                        id="attendancesummary_save_addbiobtn"
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
      <Modal
        show={recalculateModal}
        size={'md'}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setRecalculateModal(false)}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Recalculate
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
          <div className="form-group col-md-12 mb-3" >
            <label>Employee Name *</label>
            <select
                className="form-select"
                value={filterData && filterData['userid']}
                onChange={(e) => {
                  setUserid(e.target.value)
                }}
               
            >
                <option value="" disabled selected>
                Select Employee
                </option>
                {employee &&
                employee.length &&
                employee.map((item: any, index: string) => (
                    <option key={`${index}_${item.userId}`} value={item.userId}>
                    {item.label}
                    </option>
                ))}
            </select>
          </div>
          
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            id="attendancesummary_proceed_recalcbtn"
            onClick={() => recalculate(fromDate, toDate, userid)}
            disabled={isSubmit}>
            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>} />

  )
}
