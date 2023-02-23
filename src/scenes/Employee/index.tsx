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


export const Employee = (props: any) => {
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const tableHeaders = [
    'Employee Name',
    'Role',
    'Email Address',
    'Employment Type',
    'Employment Status',
    'Date Added',
    'Action',
  ]
  const information = (
    <div className="row w-100 px-5">
      <div className="form-group col-md-6 mb-3 " >
              <label>First name</label>
              <input type="text" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Date of Birth</label>
              <input type="date" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Last name</label>
              <input type="text" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Username</label>
              <input type="text" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Middle name</label>
              <input type="text" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Password</label>
              <input type="text" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-3 mb-3" >
              <label>Gender</label>
              <select className="form-select" id="inputGroupSelect02">
                <option selected>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group col-md-3 mb-3" >
              <label>Civil Status</label>
              <select className="form-select" id="inputGroupSelect02">
                <option selected>Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Separated/Divorce">Separated/Divorce</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
    </div>
  )

  const address = (
    <div className="row w-100 px-5">
      <div className="form-group col-md-6 mb-3 " >
              <label>Street Address</label>
              <input type="text" name="test" id="test" className="form-control" />
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Province/Region</label>
              <select className="form-select" id="inputGroupSelect02">
                <option selected>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Barangay</label>
              <select className="form-select" id="inputGroupSelect02">
                <option selected>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>Country</label>
              <select className="form-select" id="inputGroupSelect02">
                <option selected>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group col-md-6 mb-3" >
              <label>City/Municipality</label>
              <select className="form-select" id="inputGroupSelect02">
                <option selected>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
    </div>
  )
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
                  <h2>Good day, HR Admin!</h2>
                </div>
                <div className="col-md-6" style={{ textAlign: 'right' }}>
                  <TimeDate />
                </div>
              </div>
              <div>
                <h3>Employee Management</h3>
                <div className="w-100">
                  <TableComponent
                    tableHeaders={tableHeaders}
                  />
                </div>

              </div>
              <div className="d-flex justify-content-end mt-5" >
                <div>
                  <Button className="mx-2">Import</Button>
                  <Button
                    className="mx-2"
                    onClick={() => {
                      setModalShow(true)
                    }}>Add New</Button>
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
          onHide={() => setModalShow(false)}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create New Employee
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row w-100 px-5">
            <div className="col-md-12 row p-0 m-0">
              <div className="form-group col-md-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Information</h5>
              </div>
              <div className="form-group col-md-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Address</h5>
              </div>
              <div className="form-group col-md-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Employment</h5>
              </div>
              <div className="form-group col-md-3 mb-3 d-flex justify-content-center align-items-center flex-column" >
                <img src="https://via.placeholder.com/300/09f.png/ffffff" className="rounded-circle mb-1" width={50} height={50} ></img>
                <h5>Compensation</h5>
              </div>
            </div>
            {address}

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        {/* End Create User Modal Form */}
      </div>

    </div>

  )
}
