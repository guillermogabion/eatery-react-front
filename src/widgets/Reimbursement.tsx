import React, { useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { hmo_icon } from "../assets/images";


const Reimbursement = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    return (
        <div className="time-card-width">
             <div className="card-header">
                <span className="">Reimbursement (Pending for Approval)</span>
            </div>
            <div className="time-card-body row">
                {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
                    {/* <div className="row">
                        <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12 pb-8">
                            <span className="text-bold text-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: "15px", fontWeight: "bold" }} ><img src={hmo_icon} alt="" style={{margin: "10px"}} />Health Maintenance Organization</span>
                        </div>
                    </div>
                    <div className="col-8" style={{ textAlign: 'left' }}>
                        <div className="">
                            <h6 id="dashboard_shiftschedule_label" className="bold-text pt-2 pl-7 text-primary">HMO Provider:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_firstlogin_label" className="bold-text pt-2 pl-7 text-primary">Account Number:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_lastlogout_label" className="bold-text pt-2 pl-7 text-primary">Card Number:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2 pl-7 text-primary">Valid Until:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2 pl-7 text-primary">Dependent Name:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2 pl-7 text-primary">Relationship:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2 pl-7 text-primary">Dependent Name:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2 pl-7 text-primary">Relationship:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_attendancestatus_label" className="bold-text pt-2 pl-7 text-primary">With Dental Coverage:</h6>
                        </div>
                    </div>
                    <div className="col-4 " style={{ textAlign: 'right' }}>
                        <h6 id="dashboard_shiftschedule_value" className="font-weight-bold pt-2">{userData.data.profile.hmoProvider}</h6>
                        <h6 id="dashboard_firstlogin_value" className="font-weight-bold pt-2">{userData.data.profile.hmoAccountNumber}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoCardNumber}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoExpirationDate}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentName1}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentRelationship2}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentName2}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentRelationship2}</h6>
                        <h6 id="dashboard_lastlogout_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDentalCoverage}</h6>
                       */}
                    {/* </div> */}
            </div>
        </div>
       
    )
}

export default Reimbursement   