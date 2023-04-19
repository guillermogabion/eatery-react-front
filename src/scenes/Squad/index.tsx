import React, { useEffect, useState, useRef, useCallback } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "../../components/DashboardMenu"
const ErrorSwal = withReactContent(Swal)
import moment from "moment";
import { left, right } from "@popperjs/core"
import { Button, Card, Image, Modal } from "react-bootstrap"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import TimeDate from "../../components/TimeDate"
import TableComponent from "../../components/TableComponent"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector, useDispatch } from "react-redux"
import ReactPaginate from 'react-paginate';



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
    

    const getMember = (page : any = 0, employeeId?: any) => {

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
          `${Api.getSquadMember}?size=10&page=${page}${queryString}`,
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
            `${Api.downloadTimeKeeping}?fromDate=${fromDate}&toDate=${toDate}`,
            "",
            "timekeeping.xlsx",
            async (res: any) => {
                if(res){
                    setIsSubmit(false)
                }
                
            }
        )
        // console.log(download)
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
                                    <h2 className="bold-text">Good Day, {userData.data.profile.firstName}</h2>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                <h3>Subordinates</h3>


                                <div className="w-100 pt-4">
                                    <div className="fieldtext d-flex col-md-6">
                                    <div className="input-container">
                                        <input
                                            name="firstname"
                                            placeholder="First name"
                                            type="text"
                                            autoComplete="off"
                                            className="formControl"
                                            maxLength={40}
                                            onChange={(e) => makeFilterData(e)}
                                            onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                            />
                                    </div>

                                    <div className="input-container">
                                            <input
                                            name="lastname"
                                            placeholder="Last name"
                                            type="text"
                                            autoComplete="off"
                                            className="formControl"
                                            maxLength={40}
                                            onChange={(e) => makeFilterData(e)}
                                            onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                            />
                                    </div>
                                    <div className="input-container">
                                            <Button
                                            style={{ width: 210 }}
                                            onClick={() => getMember(0, "")}
                                            className="btn btn-primary mx-2">
                                            Search
                                            </Button>
                                        </div> 
                                    </div>
                                <table>
                                  <thead>
                                    <tr>
                                      <th style={{ width: 'auto' }}>Name</th>
                                      <th style={{ width: 'auto' }}>Employee Type</th>
                                      <th style={{ width: 'auto' }}>Status</th>
                                    
                                    </tr>
                                  </thead>
                                  <tbody>
                                    { squad &&
                                            squad.content &&
                                            squad.content.length > 0 &&
                                            squad.content.map((item:any, index: any) => (
                                      <tr key={item.id}>
                                        <td>{item.fullname}</td>
                                        <td>{item.empType}</td>
                                        <td>{item.empStatus}</td>

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
                                        activeClassName="active-page-link"
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
                                    <div className="d-flex justify-content-end mt-3" >
                                        <div>
                                            <Button
                                                className="mx-2"
                                                onClick={() => {
                                                    setDownloadModalShow(true)
                                                }}>Download Excel</Button>
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
                            {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: "" } Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create User Modal Form */}
        </div>

    )
}