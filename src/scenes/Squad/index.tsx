import React, { useEffect, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import moment from "moment"
import { Button, Modal } from "react-bootstrap"
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import EmployeeDropdown from "../../components/EmployeeDropdown"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
import { Utility } from "../../utils"
const ErrorSwal = withReactContent(Swal)



export const Squad = (props: any) => {
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const { data } = useSelector((state: any) => state.rootReducer.userData)

  const { history } = props
  const [downloadModalShow, setDownloadModalShow] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [squad, setSquad] = useState<any>([]);
  const [filterData, setFilterData] = React.useState([]);


  const tableHeaders = [
    'Date Filed',
    'Effectivity Date',
    'Shift Start',
    'Shift Type',
    'Reason',
    'Status',
    'Action',
  ]

  useEffect(() => {
    getMember(0);
  }, []);

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }


  const getMember = (page: any = 0, employeeId?: any) => {

    let queryString = ""
    let filterDataTemp = { ...filterData }
    if (employeeId) {
      queryString = "&employeeId" + employeeId
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
      `${Api.getSquadMember}?size=10&page=${page}${queryString}&sort=id&sortDir=desc`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res;
        if (status === 200 && body) {
          if (body.error && body.error.message) {
            // handle error
          } else {
            setSquad(body.data);
          }
        }
      }
    );
  };
  const handlePageClick = (event: any) => {
    getMember(event.selected)
  };

  const downloadExcel = (fromDate: any, toDate: any) => {
    setIsSubmit(true)
    RequestAPI.getFileAsync(
      `${Api.downloadTimeKeepingSquad}?fromDate=${fromDate}&toDate=${toDate}`,
      "",
      "timekeeping.xlsx",
      async (res: any) => {
        if (res) {
          setIsSubmit(false)
        }

      }
    )
    // console.log(download)
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
          
          {
              data.profile.role == 'EMPLOYEE' ?
                <h3>Colleagues</h3> 
                :
                <h3>Subordinates</h3>
            }
          <div className="w-100 pt-4">
            <div className="fieldtext d-flex col-md-3 w-100">
              <div className="" style={{ width: 200, marginRight: 10 }}>
                <label>Employee</label>
                <EmployeeDropdown
                  id="squad_employee_maindropdown"
                  squad={true}
                  placeholder={"Employee"}
                  singleChangeOption={singleChangeOption}
                  name="userId"
                  value={filterData && filterData['userId']}
                />
              </div>
              <div>
                <Button
                  id="squad_search_mainbtn"
                  style={{ width: 120 }}
                  onClick={() => {
                    setSquad([])
                    getMember(0, "")
                  }}
                  className="btn btn-primary mx-2 mt-4">
                  Search
                </Button>
              </div>
            </div>

            <table className="w-100">
              <thead>
                <tr>
                  <th style={{ width: 'auto' }}>Name</th>
                  <th style={{ width: 'auto' }}>Employee Type</th>
                  <th style={{ width: 'auto' }}>Status</th>
                  <th style={{ width: 'auto' }}>Log-In/Log-Out</th>
                </tr>
              </thead>
              <tbody>
                {squad &&
                  squad.content &&
                  squad.content.length > 0 &&
                  squad.content.map((item: any, index: any) => (
                    <tr key={item.id}>
                      <td id={"squad_fullname_squadata_" + item.id}>{item.fullname}</td>
                      <td id={"squad_emptype_squadata_" + item.id}>{Utility.removeUnderscore(item.empType) }</td>
                      <td id={"squad_empstatus_squadata_" + item.id}>{item.empStatus}</td>
                      <td id={"squad_status_squadata_" + item.id}>
                        {
                          item.status && item.status != "" ?
                            <>{item.status}</>
                            :
                            <>
                              {item.todaysTimeIn ? <>{item.todaysTimeIn} - IN <br /> </> : null}
                              {item.todaysTimeOut ? <>{item.todaysTimeOut} - OUT </> : null}
                            </>
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end">
              <div className="">
                <ReactPaginate
                  className="d-flex justify-content-center align-items-center"
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={(squad && squad.totalPages) || 0}
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

            {
              squad &&
                squad.content &&
                squad.content.length == 0 ?
                <div className="w-100 text-center">
                  <label htmlFor="">No Records Found</label>
                </div>
                :
                null
            }
            {
              data.profile.role != 'EMPLOYEE' && data.profile.role != 'EXECUTIVE' ?
                <div className="d-flex justify-content-end mt-3" >
                  <div>
                    <Button
                      id="squad_downloadexcel_squadbtn"
                      className="mx-2"
                      onClick={() => {
                        setDownloadModalShow(true)
                      }}>Download Excel</Button>
                  </div>
                </div>
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
            id="squad_proceed_squadbtn"
            onClick={() => downloadExcel(fromDate, toDate)}
            disabled={isSubmit}>
            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
          </Button>
        </Modal.Footer>

      </Modal>
    </>} />
  )
}
