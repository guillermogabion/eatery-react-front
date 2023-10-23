import React, { useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { hmo_icon } from "../assets/images";


const MyBenefits = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    return (
        <div className="time-card-width">
            <div className="card-header">
                <span className="">My Benefits</span>
            </div>
            <div className="time-card-body">
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12 pb-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="text-bold text-primary" style={{ fontSize: "15px", fontWeight: "bold", display: 'flex', alignItems: 'center' }}>
                    <img src={hmo_icon} alt="" style={{ margin: "0px 10px 0px 0px", display: "inline", maxWidth: "100%" }} />
                    Health Maintenance Organization
                    </span>
                </div>
                <div className="row d-flex">
                    <div className="col-8" style={{ textAlign: 'left' }}>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmoprovider_label" className="bold-text pt-2 pl-1 text-primary">HMO Provider:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmoacctnumber_label" className="bold-text pt-2 pl-1 text-primary">Account Number:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmocardnumber_label" className="bold-text pt-2 pl-1 text-primary">Card Number:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmoexpirationdate_label" className="bold-text pt-2 pl-1 text-primary">Valid Until:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmodependent_label" className="bold-text pt-2 pl-1 text-primary">Dependent Name:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmodependentrel_label" className="bold-text pt-2 pl-1 text-primary">Relationship:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmodependent2_label" className="bold-text pt-2 pl-1 text-primary">Dependent Name:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmodependentrel2_label" className="bold-text pt-2 pl-1 text-primary">Relationship:</h6>
                        </div>
                        <div className="">
                            <h6 id="dashboard_mybenefit_hmodentalcoverage_label" className="bold-text pt-2 pl-1 text-primary">With Dental Coverage:</h6>
                        </div>
                    </div>
                    <div className="col-4 " style={{ textAlign: 'right' }}>
                        <h6 id="dashboard_mybenefit_hmoprovider_value" className="font-weight-bold pt-2">{userData.data.profile.hmoProvider}</h6>
                        <h6 id="dashboard_mybenefit_hmoacctnumber_value" className="font-weight-bold pt-2">{userData.data.profile.hmoAccountNumber}</h6>
                        <h6 id="dashboard_mybenefit_hmocardnumber_value" className="font-weight-bold pt-2">{userData.data.profile.hmoCardNumber}</h6>
                        <h6 id="dashboard_mybenefit_hmoexpirationdate_value" className="font-weight-bold pt-2">{userData.data.profile.hmoExpirationDate}</h6>
                        <h6 id="dashboard_mybenefit_hmodependent_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentName1}</h6>
                        <h6 id="dashboard_mybenefit_hmodependentrel_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentRelationship2}</h6>
                        <h6 id="dashboard_mybenefit_hmodependent2_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentName2}</h6>
                        <h6 id="dashboard_mybenefit_hmodependentrel2_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDependentRelationship2}</h6>
                        <h6 id="dashboard_mybenefit_hmodentalcoverage_value" className="font-weight-bold pt-2">{userData.data.profile.hmoDentalCoverage}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyBenefits