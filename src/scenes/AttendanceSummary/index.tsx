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


export const AttendanceSummary = (props: any) => {
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const [key, setKey] =React.useState('all');
  const tableHeaders = [
    'Type',
    'Date Filed',
    'Date From - To',
    'No. of Days',
    'Reason',
    'Remarks',
    'Action',
  ]
  
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
                  <h2>Good day, Employee 001!</h2>
                </div>
                <div className="col-md-6" style={{ textAlign: 'right' }}>
                  <TimeDate />
                </div>
              </div>
              <div>
                <h3>Summary Of Attendance</h3>
                {/* <div className="row p-0 m-0 pt-2">
                  <div className="col-md-2">
                    <h5>Sickness:</h5>
                    <h5>Vacation:</h5>
                    <h5>Without pay:</h5>
                  </div>
                  <div className="col-md-3">
                    <h5>12</h5>
                    <h5>15</h5>
                    <h5>0</h5>
                  </div>
                  
                </div> */}
                <div className="w-100 pt-4">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k: any) => {
                    setKey(k)
                  }}
                  className="mb-3"
                >
                  <Tab eventKey="all" title="All">
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                  <Tab eventKey="pending" title="Pending">
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                  <Tab eventKey="approved" title="Approved" >
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                  <Tab eventKey="reject/cancelled" title="Rejected/Cancelled">
                    <TableComponent
                      tableHeaders={tableHeaders}
                    />
                  </Tab>
                </Tabs>
                  
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
