import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card, Button } from "react-bootstrap";
import { email_icon, approver_icon, join_icon, phone_icon, photo, squad_icon, update_employee_icon } from "../assets/images";
import moment from "moment";



const EmployeeBasicProfile = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [ hireDate, setHireDate ] = useState(moment().format("YYYY-MMMM-DD"))
    const dateString = userData.data.profile.dateEmployed;

    const currentDate = moment();
    const diffDuration = moment.duration(currentDate.diff(moment(dateString)));
    const yearEmployed = diffDuration.years();
    const monthEmployed = diffDuration.months();
    const daysEmployed = diffDuration.days();
    
    const [year, month, day] = dateString.split("-");

    const date = new Date(year, month - 1, day);
    const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
    ];
    
    const formattedDate = `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
    console.log(formattedDate);

    const today = new Date();
    const timeDifference = today - date;
    
    // Calculate years, months, and days from the time difference
    const years = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor((timeDifference % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor((timeDifference % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    


    return (
        <div className="time-card-width">
            <div className="card-header">
                <span className="">Employee Basic Profile</span>
            </div>
            <div className="card-profile">
                
            </div>
            <div className="profile">
                <img src={photo} className="rounded-circle" width={250} height={250} ></img>
            </div>
            <div className="card-body basic-profile-widget">
                <div className="employee-space">
                    <div style={{ paddingBottom: "10%"}}>
                        <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName}</span>
                        <br />
                        <span className="" style={{fontWeight: 'bold', paddingBottom: '5%'}}>{userData.data.profile.jobTitle}</span>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px', paddingBottom: '10px'}} className="text-primary font-bold">
                        <img src={squad_icon} alt="" style={{marginRight: '10px'}} /> {userData.data.profile.squad}
                    </span>   
                    {
                        userData.data.profile.role == 'ADMIN' ? " " :
                        <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px', paddingBottom: '10px', flexWrap: 'wrap'}} className="text-primary font-bold">
                            <img src={join_icon} alt="" style={{marginRight: '10px'}} /> 
                            <p style={{marginRight: "5px", fontSize: '80%'}}>
                                Joined {formattedDate}
                            </p> 
                            <p style={{fontSize: '80%'}}>(</p> 
                            <p style={{marginLeft: "", fontSize: '80%'}}>{yearEmployed == 0 ? "" : yearEmployed + " " + "years"}</p>
                            <p style={{marginLeft: "5px", fontSize: '80%'}}> {monthEmployed == 0 ? "" : monthEmployed + " " + "months" }</p>
                            <p style={{marginLeft: "5px", fontSize: '80%'}}>{daysEmployed} days</p>
                            <p style={{fontSize: '80%'}}>)</p>
                        </span>
                    }
                    
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px', paddingBottom: '10px'}} className="text-primary font-bold">
                        <img src={approver_icon} alt="" style={{marginRight: '10px'}} /> {userData.data.profile.approver}
                    </span>   
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px', paddingBottom: '10px'}} className="text-primary font-bold">
                        <img src={phone_icon} alt="" style={{marginRight: '10px'}} /> {userData.data.profile.mobileNo}
                    </span>   
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px'}} className="text-primary font-bold">
                        <img src={email_icon} alt="" style={{marginRight: '10px'}} /> {userData.data.profile.email}
                    </span> 
                </div>
                
                  
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-12 employee-button px-4">
                    <Button id=""
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        // onClick={() => makeAttendance('time out')}
                        >
                            <img src={update_employee_icon} width={20} alt="" style={{ marginRight: '8px' }}/>
                            Update Employee Details
                        </Button>
                </div>
            </div>
            
        </div>
    )
}

export default EmployeeBasicProfile