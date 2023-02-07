import React from "react"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"

export const NotFound = () => {
  return (
    <div className="body">
      <div className="wraper">
        <MainLeftMenu />
        <div className="contentRightSection">
          <div className="contentRightFrame">
            <div className="topHeader">
              <UserTopMenu search={false} />
            </div>
            <div className="contentContainer" style={{ paddingTop: "15px" }}>
              <h3 style={{ textAlign: "center" }}>Page Not found</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
