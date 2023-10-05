import React, { useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button, Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { hmo_icon } from "../assets/images";


const Statistics = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    return (
        <div className="time-card-width">
             <div className="card-header">
                <span className="">Statistics</span>
            </div>
            <div className="time-card-body row">
                {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
                <Tabs defaultActiveKey="tab1" id="my-tabs" style={{fontSize: '10px'}} className="custom-tab justify-content-center">
                    <Tab id="dashboardstatistic_tab1"  className="custom-tabs"  eventKey="tab1" title="Employee Status">
                        {/* <All /> */}
                    </Tab>
                    <Tab id="dashboardstatistic_tab2" className="custom-tabs" eventKey="tab2" title="Gender">
                        {/* <OnLeave /> */}
                    </Tab>
                    <Tab id="dashboardstatistic_tab3" className="custom-tabs" eventKey="tab3" title="Employment Level">
                        {/* <Absent /> */}
                    </Tab>
                </Tabs>
            </div>
        </div>
       
    )
}

export default Statistics