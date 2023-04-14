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
import { useSelector } from "react-redux"


export const ScheduleAdjustment = (props: any) => {
  const { history } = props
  const [modalShow, setModalShow] = React.useState(false);
  const userData = useSelector((state: any) => state.rootReducer.userData)
  const [key, setKey] = React.useState('all');
  const tableHeaders = [
    'Date Filed',
    'Effectivity Date',
    'Shift Start',
    'Shift Type',
    'Reason',
    'Status',
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
                  <h2>Good Day, {userData.data.profile.firstName}!</h2>
                </div>
                <div className="col-md-6" style={{ textAlign: 'right' }}>
                  <TimeDate />
                </div>
              </div>
              <div>
                <h3>Adjustment of Schedule</h3>
                <div className="row p-0 m-0 pt-2">
                  <div className="col-md-4">
                    <h5>Current Work Schedule:</h5>
                  </div>
                  <div className="col-md-8">
                    <h5>06:00 AM - 03:00 PM</h5>
                  </div>

                </div>
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
              <div className="d-flex justify-content-end mt-3" >
                <div>
                  <Button
                    className="mx-2"
                    onClick={() => {
                      setModalShow(true)
                    }}>Request for Schedule Adjustment</Button>
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
