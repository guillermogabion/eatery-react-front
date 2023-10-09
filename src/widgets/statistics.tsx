import React, { useState, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button, Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { empStat } from "../assets/images";


const Statistics = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    return (
        <div className="time-card-width">
             <div className="card-header">
                <span className="">Statistics</span>
            </div>
            <div className="time-card-body row custom-tab-container">
                {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
                <Tabs defaultActiveKey="tab1" id="my-tabs" className="overflow-auto flex-column flex-sm-row custom-tab justify-content-center p-0 m-0 mb-0">
                    <Tab id="dashboardstatistic_tab1" className="custom-tabs mb-0 pb-0 fs-sm-4"  eventKey="tab1" title="Employee Status">
                        {/* <All /> */}
                        <EmployeeStatus />

                    </Tab>
                    <Tab id="dashboardstatistic_tab2" className="custom-tabs fs-sm-4" eventKey="tab2" title="Gender">
                        {/* <OnLeave /> */}
                    </Tab>
                    <Tab id="dashboardstatistic_tab3" className="custom-tabs fs-sm-4" eventKey="tab3" title="Employment Level">
                        {/* <Absent /> */}
                    </Tab>
                </Tabs>
            </div>
        </div>
       
    )
}

const EmployeeStatus = () => {
    const [headCount, setHeadCount ] = useState("")

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.headCount}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {}}} : any = res
                if ( status === 200 && body && body.data) {
                    setHeadCount(body.data)
                }
            }
        )
    }, [])



    return (
        <div className="row d-flex p-0 m-0" style={{marginTop: '100px'}}>
            <div className="col-8">
                <img src={empStat} alt="" width={200}/>
            </div>
            <div className="col-4">
                <div className="text-bold fs-1 text-primary text-center d-flex align-items-center flex-column">
                    {headCount.length}
                    <div className="fs-5">
                    Total <br />
                    Head Count
                </div>
                </div>
                

               
            </div>
        </div>
    )

}

export default Statistics