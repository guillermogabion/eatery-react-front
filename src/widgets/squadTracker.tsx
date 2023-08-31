import React, { useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"




const SquadTracker = () => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    return (
        <div className="time-card-width">
        <div className="card-header">
           <span className="">Squad Tracker ({userData.data.profile.squad})</span>
       </div>
       <div className="time-card-body row">
           {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
               
       </div>
   </div>
       
    )
}

export default SquadTracker