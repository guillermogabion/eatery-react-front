import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Image, Modal, Table } from "react-bootstrap"
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

export const AttendanceSummary = (props: any) => {
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile

  const { history } = props
  const [importModalShow, setImportModalShow] = React.useState(false);
  const [downloadModalShow, setDownloadModalShow] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [filterData, setFilterData] = React.useState([]);
  const [key, setKey] = React.useState('all');
  const [allAttendance, setAllAttendance] = useState<any>([]);

  const tableHeaders = [
    'Date Filed',
    'Effectivity Date',
    'Shift Start',
    'Shift Type',
    'Reason',
    'Status',
    'Action',
  ]

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
    getAllAttendance(0, "")
    filterData["fromDate"]= moment().format("MMMM-DD-YYYY")
    filterData["toDate"]= moment().format("MMMM-DD-YYYY")
  }, [])
  
  const getAllAttendance = (page: any = 0, status: any = "All") => {
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
      `${Api.adminAttendanceSummary}?size=10${queryString}&page=${page}&userId=62`,
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
    getAllAttendance(event.selected, "")
  };

  const attendanceTable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Employee ID</th>
              <th style={{ width: 'auto' }}>Employee Name</th>
              <th style={{ width: 'auto' }}>Present</th>
              <th style={{ width: 'auto' }}>Absent</th>
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
                          <td> {item.empId} </td>
                          <td> {item.lastName}, {item.firstName} </td>
                          <td> {item.present} </td>
                          <td> {item.absent} </td>
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

      </div>
    )
  }, [allAttendance])

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
                  <div className="fieldtext d-flex col-md-6">
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
                      onClick={() => getAllAttendance(0, "")}
                      className="btn btn-primary mx-2 mt-4">
                      Search
                    </Button>
                  </div>

                  {attendanceTable()}
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
                  <div className="d-flex justify-content-end mt-3" >
                    <div>
                      <Button
                        className="mx-2"
                        onClick={() => {
                          setImportModalShow(true)
                        }}>Import</Button>
                      <Button
                        className="mx-2"
                        onClick={() => {
                          setDownloadModalShow(true)
                        }}>Export</Button>
                      <Button
                        className="mx-2"
                        onClick={
                          downloadTemplate
                        }>Download Template</Button>
                    </div>
                  </div>
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
    </div>

  )
}
