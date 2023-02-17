import React, { useEffect, useState, useRef } from "react"
import UserTopMenu from "../../components/UserTopMenu"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import DashboardMenu from "./DashboardMenu"
const ErrorSwal = withReactContent(Swal)

export const Dashboard = (props: any) => {
  const { history } = props

  return (
    <div className="body">
      <div className="wraper">
        <div className="w-100">
            <div className="topHeader">
              <UserTopMenu />
            </div>
            <div className="contentContainer row p-0 m-0" style={{ minHeight:'100vh' }}>
              <div className="col-md-12 col-lg-2 bg-dark p-0">
                <DashboardMenu />
              </div>
              <div className="col-md-12 col-lg-10 bg-danger">
                
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
