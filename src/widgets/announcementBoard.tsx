import React, { useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card } from "react-bootstrap";



const AnnouncementBoard = () => {
    return (
        <div className="time-card-width">
        <div className="card-header">
           <span className="">Announcement Board</span>
       </div>
       <div className="time-card-body row">
           {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
               
       </div>
   </div>
       
    )
}

export default AnnouncementBoard