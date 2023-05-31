import React, { useCallback, useEffect, useRef, useState } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import moment from "moment"
import { Button, Table } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import SingleSelect from "../../components/Forms/SingleSelect"
import TimeDate from "../../components/TimeDate"
import ContainerWrapper from "../../components/ContainerWrapper"
const ErrorSwal = withReactContent(Swal)

export const MissingLogs = (props: any) => {
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const masterList = useSelector((state: any) => state.rootReducer.masterList)
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const formRef: any = useRef()

  const { history } = props
  const [importModalShow, setImportModalShow] = React.useState(false);
  const [downloadModalShow, setDownloadModalShow] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [addBioModal, setAddBioModal] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [filterData, setFilterData] = React.useState([]);
  const [key, setKey] = React.useState('all');
  const [allMissingLogs, setAllMissingLogs] = useState<any>([]);
  const [employeeList, setEmployeeList] = useState<any>([]);
  const [userId, setUserId] = useState<any>("");


  useEffect(() => {
    getAllMissingLogs(0, "")
    getAllEmployee()
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

  const getAllMissingLogs = (page: any = 0, status: any = "All") => {
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
      `${Api.getMissingLogs}?size=1000${queryString}&page=${page}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body) {
          if (body.error && body.error.message) {
          } else {
            setAllMissingLogs(body.data)
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
    getAllMissingLogs(event.selected, "")
  };

  const singleChangeOption = (option: any, name: any) => {

    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }


  const attendanceTable = useCallback(() => {
    return (
      <div>
        <Table responsive="lg">
          <thead>
            <tr>
              <th style={{ width: 'auto' }}>Fullname</th>
              <th style={{ width: 'auto' }}>Date</th>
              <th style={{ width: 'auto' }}>Shift Schedule</th>
              <th style={{ width: 'auto' }}>Datetime In</th>
              <th style={{ width: 'auto' }}>Datetime Out</th>

            </tr>
          </thead>
          <tbody>
            {
              allMissingLogs &&
                allMissingLogs.content &&
                allMissingLogs.content.length > 0 ?
                <>
                  {
                    allMissingLogs.content.map((item: any, index: any) => {
                      return (
                        <tr>
                          <td> {item.lastName}, {item.firstName} </td>
                          <td> {item.date} </td>
                          <td> {item.schedule} </td>
                          <td> {item.firstLogin ? moment(item.firstLogin).format('YYYY-MM-DD hh:mm A') : "No Time In"} </td>
                          <td> {item.lastLogin ? moment(item.lastLogin).format('YYYY-MM-DD hh:mm A') : "No Time Out"} </td>
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
          allMissingLogs &&
            allMissingLogs.content &&
            allMissingLogs.content.length == 0 ?
            <div className="w-100 text-center">
              <label htmlFor="">No Records Found</label>
            </div>
            :
            null
        }

      </div>
    )
  }, [allMissingLogs])

  return (
    <ContainerWrapper contents={<>
      <div className="col-md-12 col-lg-10 px-5 py-5">
        <div>
          <h3>Missing Logs</h3>

          <div className="w-100 pt-4">
            <div className="fieldtext d-flex col-md-12">
              {
                data.profile.role == 'ADMIN' || data.profile.role == 'EXECUTIVE' ?
                  <>
                    <div className="" style={{ width: 200, marginRight: 10 }}>
                      <label>Employee</label>
                      <SingleSelect
                        type="string"
                        options={employeeList || []}
                        placeholder={"Employee"}
                        onChangeOption={singleChangeOption}
                        name="userid"
                        value={filterData && filterData['userid']}
                      />
                    </div>
                    <div className="" style={{ width: 200, marginRight: 10 }}>
                      <label>Department</label>
                      <select
                        className={`form-select`}
                        name="department"
                        id="type"
                        value={filterData && filterData['department']}
                        onChange={(e) => makeFilterData(e)}>
                        <option key={`departmentItem}`} value={""}>
                          Select
                        </option>
                        {masterList &&
                          masterList.department &&
                          masterList.department.length &&
                          masterList.department.map((item: any, index: string) => (
                            <option key={`${index}_${item}`} value={item}>
                              {item}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                  :
                  null
              }
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
                onClick={() => getAllMissingLogs(0, "")}
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
                  pageCount={(allMissingLogs && allMissingLogs.totalPages) || 0}
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
        </div>

      </div>
    </>} />
  )
}
