import React, { useEffect, useState } from "react";
import { RequestAPI, Api } from "../api";
import { useDispatch, useSelector } from "react-redux"
import { Tabs, Tab, Table, Button } from "react-bootstrap"
import user from "../assets/images/dist/User1.png"
import icon_search_white from "../assets/images/icon_search_white.png"
import EmployeeDropdown from "../components/EmployeeDropdown";
import moment from "moment"

const SquadTracker = () => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});


   
   
    return (
        <div className="time-card-width">
                <div className="card-header">
                    <span className="">Squad Tracker ({userData.data.profile.squad})</span>
                </div>
            <div className="tracker-card-body">
                <Tabs defaultActiveKey="tab1" id="my-tabs" style={{fontSize: '10px'}} className="custom-tab justify-content-center">
                    <Tab id="dashboardsquadtracker_tab1"  className="custom-tabs"  eventKey="tab1" title="All">
                        <All />
                    </Tab>
                    <Tab id="dashboardsquadtracker_tab2" className="custom-tabs" eventKey="tab2" title="On-Leave">
                        <OnLeave />
                    </Tab>
                    <Tab id="dashboardsquadtracker_tab3" className="custom-tabs" eventKey="tab3" title="Absent">
                        <Absent />
                    </Tab>
                </Tabs>
            </div>
        </div>
       
    )
}

const All = () => {
    const [ allMember , setAllMember ] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});


    const makeFilterData = (event: any) => {
        const { name, value } = event.target
        const filterObj: any = { ...filterData }
        filterObj[name] = name && value !== "Select" ? value : ""
        setFilterData(filterObj)
    }
    const getAll = () => {
        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
                if (filterDataTemp[d]) {
                    queryString += `&${d}=${filterDataTemp[d]}`
                } else {
                    queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                }
            })
        }
        RequestAPI.getRequest(
            `${Api.getAllSquadMember}?${queryString}`,
            "",
            {},
            {},
            async(res:any) => {
                const {status, body = { data : {}, error: {} }}: any = res
                if (status === 200 && body && body.data) {
                    setAllMember(body.data)
                }
            }
        )
    }

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.getAllSquadMember}`,
            "",
            {},
            {},
            async(res:any) => {
                const {status, body = { data : {}, error: {} }}: any = res
                if (status === 200 && body && body.data) {
                    setAllMember(body.data)
                }
            }
        )
    }, [])
    const singleChangeOption = (option: any, name: any) => {
        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }
    return (
        <div>
            <div className="row tracker-input">
                <div className="col-9 ml-3">
                    <div className="" style={{ width: '100%', marginRight: 10 }}>
                        <EmployeeDropdown
                            id="dashboardsquadtracker_search_input"
                            squad={true}
                            placeholder={"Employee"}
                            singleChangeOption={singleChangeOption}
                            name="userId"
                            value={filterData && filterData['userId']}
                        />
                    </div>
                </div>
                <div className="col-2">
                    <Button
                    onClick={() => getAll()}
                    style={{ width: '100%',
                     padding: '0',
                     height: '40px',
                     display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    }} 
                    >
                        <img src={icon_search_white} alt="" width={20} />
                    </Button>

                </div>
            </div>
            <div >
                
                <Table responsive>
                    <div className="squad-tracker-table">
                        <tbody>
                            {allMember && allMember.length > 0 ? (
                            allMember.map((item: any, index: any) => (
                                <tr key={index}>
                                
                                <td id={"dashboard_squadtracker_membername_all_" + item.id} className="text-primary font-bold d-flex custom-td-width" style={{ alignItems: 'center' }}>
                                        <img src={user} width={40} style={{ borderRadius: '50%', color: 'black', margin: '10px' }} alt="User" />
                                        <div className="pt-2">
                                            {item.fullname}
                                            <br />
                                            <span className="jobtitle-size">{item.jobTitle}</span>
                                        </div>
                                    </td>
                                <td id={"dashboard_squadtracker_status_all_" + item.id} style={{ textAlign: 'end' , fontWeight: 600}}  className="text-primary">
                                    {item.status == null && item.todaysTimeIn != null ? (
                                        <>
                                            <div className="col-12">IN - {moment(item.todaysTimeIn, "HH:mm:ss").format("hh:mm A")}</div>
                                        </>
                                    ) : ""}
                                    {/* {item.status == null && item.todaysTimeIn == null ? "Absent" : item.status == null && item.todaysTimeIn != null ?  moment(item.todaysTimeIn, "HH:mm:ss").format("hh:mm A"): item.status} */}
                                    {item.status == null && item.todaysTimeIn == null ? "Absent" : ""}
                                    {item.status == null && item.todaysTimeIn != null && item.todaysTimeOut != null ? (
                                        <>
                                            <div className="col-12">OUT - {moment(item.todaysTimeOut, "HH:mm:ss").format("hh:mm A")}</div>

                                        </>
                                    ) : item.status == null && item.todaysTimeOut != null && item.todaysTimeIn == null ? "" :  item.status}
                                    {/* {item.status == null && item.todaysTimeIn == null && item.todaysTimeOut == null ? "" : item.status == null && item.todaysTimeIn == null && item.todaysTimeOut != null ? "" : item.status == null && item.todaysTimeIn != null && item.todaysTimeOut != null ?  moment(item.todaysTimeOut, "HH:mm:ss").format("hh:mm A"): item.status} */}
                                </td>
                                </tr>
                            ))
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
                                    No Record Found
                                </div>
                            )}
                        
                        </tbody>
                    </div>
                </Table>
            </div>
        </div>
    )
}
const OnLeave = () => {
    const [ allMember , setAllMember ] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});

    useEffect (() => {
         RequestAPI.getRequest(
            `${Api.getAllSquadMember}?status=on_leave`,
            "",
            {},
            {},
            async(res:any) => {
                const {status, body = { data : {}, error: {} }}: any = res
                if (status === 200 && body && body.data) {
                    setAllMember(body.data)
                }
            }
        )
    }, [])
    const singleChangeOption = (option: any, name: any) => {
        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }
    const getAll = () => {
        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
                if (filterDataTemp[d]) {

                    queryString += `&${d}=${filterDataTemp[d]}`
                } else {
                    queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                }
            })
        }
        RequestAPI.getRequest(
            `${Api.getAllSquadMember}?status=on_leave${queryString}`,
            "",
            {},
            {},
            async(res:any) => {
                const {status, body = { data : {}, error: {} }}: any = res
                if (status === 200 && body && body.data) {
                    setAllMember(body.data)
                }
            }
        )

    }

    return (
        <div>
            <div className="row tracker-input">
                <div className="col-9 ml-3">
                    <div className="" style={{ width: '100%', marginRight: 10 }}>
                        <EmployeeDropdown
                            id="dashboardsquadtracker_search_input2"
                            squad={true}
                            placeholder={"Employee"}
                            singleChangeOption={singleChangeOption}
                            name="userId"
                            value={filterData && filterData['userId']}
                        />
                    </div>
                </div>
                <div className="col-2">
                    <Button
                    onClick={() => getAll()}
                    style={{ width: '100%',
                     padding: '0',
                     height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    }} 
                    >
                        <img src={icon_search_white} alt="" width={20} />
                    </Button>

                </div>
            </div>
            { allMember && allMember.length == 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
                    No Record Found
                </div>
            ) : ""}
            
            <Table responsive>
                <div className="squad-tracker-table">
                    <tbody>
                        {allMember && allMember.length > 0 ? (
                        allMember.map((item: any, index: any) => (
                            <tr key={index}>
                            <td id={"dashboard_squadtracker_membername_leave_" + item.id} className="text-primary font-bold d-flex custom-td-width" style={{ alignItems: 'center' }}>
                                <img src={user} width={40} style={{ borderRadius: '50%', color: 'black', margin: '10px' }} alt="User" />
                                <div className="pt-2">
                                    {item.fullname}
                                    <br />
                                    <span className="jobtitle-size">{item.jobTitle}</span>
                                </div>
                            </td>
                            <td id={"dashboard_squadtracker_status_leave_" + item.id} style={{ textAlign: 'center' , fontWeight: 600}}  className="text-primary">
                                {item.status == null && item.todaysTimeIn != null ? (
                                    <>
                                        <p>IN</p>
                                    </>
                                ) : ""}
                                {item.status == null && item.todaysTimeIn == null ? "Absent" : item.status == null && item.todaysTimeIn != null ? item.todaysTimeIn : item.status}</td>
                            </tr>
                        ))
                        ) : ""}
                    </tbody>
                </div>
            </Table>
         
        </div>
    )

}
const Absent = () => {
    const [ allMember , setAllMember ] = useState<any>([]);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});


    useEffect (() => {
         // all 
         RequestAPI.getRequest(
            `${Api.getAllSquadMember}?status=absent`,
            "",
            {},
            {},
            async(res:any) => {
                const {status, body = { data : {}, error: {} }}: any = res
                if (status === 200 && body && body.data) {
                    setAllMember(body.data)
                }
            }
        )
    }, [])
    const getAll = () => {
        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
                if (filterDataTemp[d]) {

                    queryString += `&${d}=${filterDataTemp[d]}`
                } else {
                    queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                }
            })
        }
        RequestAPI.getRequest(
            `${Api.getAllSquadMember}?status=absent${queryString}`,
            "",
            {},
            {},
            async(res:any) => {
                const {status, body = { data : {}, error: {} }}: any = res
                if (status === 200 && body && body.data) {
                    setAllMember(body.data)
                }
            }
        )

    }
    const singleChangeOption = (option: any, name: any) => {

        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }

    return (
        <div>
            <div className="row tracker-input">
                <div className="col-9 ml-3">
                    <div className="" style={{ width: '100%', marginRight: 10}}>
                        <EmployeeDropdown
                            id="dashboardsquadtracker_search_input3"
                            squad={true}
                            placeholder={"Employee"}
                            singleChangeOption={singleChangeOption}
                            name="userId"
                            value={filterData && filterData['userId']}
                        />
                    </div>
                </div>
                <div className="col-2">
                    <Button 
                    id="dashboardsquadtracker_getall2_btn"
                    onClick={() => getAll()}
                    style={{ width: '100%', padding: '0',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    }} 
                    >
                        <img src={icon_search_white} alt="" width={20} />
                    </Button>

                </div>
            </div>
            <Table responsive>
                <div className="squad-tracker-table">
                    <tbody>
                        {allMember && allMember.length > 0 && (
                        allMember.map((item: any, index: any) => (
                            <tr key={index}>
                            <td id={"dashboard_squadtracker_membername_absent_" + item.id} className="text-primary font-bold d-flex custom-td-width" style={{ alignItems: 'center' }}>
                                <img src={user} width={40} style={{ borderRadius: '50%', color: 'black', margin: '10px' }} alt="User" />
                                <div className="pt-2">
                                    {item.fullname}
                                    <br />
                                    <span className="jobtitle-size">{item.jobTitle}</span>
                                </div>
                            </td>
                            <td id={"dashboard_squadtracker_status_absent_" + item.id} style={{ textAlign: 'center' , fontWeight: 600}}  className="text-primary">
                                {item.status == null && item.todaysTimeIn != null ? (
                                    <>
                                        <p>IN</p>
                                    </>
                                ) : ""}
                                {item.status == null && item.todaysTimeIn == null ? "Absent" : item.status == null && item.todaysTimeIn != null ? item.todaysTimeIn : item.status}</td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </div>
            </Table>
            <div>
            { allMember && allMember.length == 0 && (
                <div className="d-flex justify-content-center align-items-center">
                    No Record Found
                </div>
            )}

            </div>

        </div>
    )

}

export default SquadTracker