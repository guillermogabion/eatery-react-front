import React, { useEffect, useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { Tabs, Tab, Table, Button } from "react-bootstrap"
import { tr } from "date-fns/locale";
import user from "../assets/images/dist/User1.png"
import { Search} from "../assets/images";
import icon_search_white from "../assets/images/icon_search_white.png"
import EmployeeDropdown from "../components/EmployeeDropdown";




const SquadTracker = () => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});



    useEffect(() => {
       
    }, [])
   
    return (
        <div className="time-card-width">
                <div className="card-header">
                    <span className="">Squad Tracker ({userData.data.profile.squad})</span>
                </div>
            <div className="tracker-card-body">

             
                {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
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
         // all 
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
            <Table responsive>
                <div style={{ minHeight: '300px', maxHeight: '300px', overflowY: 'auto', paddingTop: '20px', marginLeft: '5px' }}>
                    <tbody>
                        {allMember && allMember.length > 0 ? (
                        allMember.map((item: any, index: any) => (
                            <tr key={index}>
                            
                            <td className="text-primary font-bold d-flex" style={{ textAlign: 'center' }}>
                                <img src={user} width={30} style={{ borderRadius: '50%', color: 'black', margin: '10px' }} alt="User" />
                                <div className="pt-2">
                                    {item.fullname}
                                    <br />
                                    <span>{item.jobTitle}</span>
                                </div>
                            </td>
                            <td style={{ textAlign: 'center' , fontWeight: 600}}  className="text-primary">
                                {item.status == null && item.todaysTimeIn != null ? (
                                    <>
                                        <p>IN</p>
                                    </>
                                ) : ""}
                                {item.status == null && item.todaysTimeIn == null ? "Absent" : item.status == null && item.todaysTimeIn != null ? item.todaysTimeIn : item.status}</td>
                            </tr>
                        ))
                        ) : (
                            <div className="justify-content-center">
                                <p style={{textAlign: 'center'}}>No Member Found</p>
                            </div>
                        )}
                    
                    </tbody>
                </div>
                </Table>
        </div>
    )

}
const OnLeave = () => {
    const [ allMember , setAllMember ] = useState<any>([]);
     const [filterData, setFilterData] = useState<{ [key: string]: string }>({});

    useEffect (() => {
         // all 
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
            <Table responsive>
            <div style={{ minHeight: '300px', maxHeight: '300px', overflowY: 'auto', paddingTop: '20px', marginLeft: '5px' }}>
                <tbody>
                    {allMember && allMember.length > 0 ? (
                    allMember.map((item: any, index: any) => (
                        <tr key={index}>
                        <td className="text-primary font-bold d-flex" style={{ textAlign: 'center' }}>
                            <img src={user} width={30} style={{ borderRadius: '50%', color: 'black', margin: '10px' }} alt="User" />
                            <div className="pt-2">
                                {item.fullname}
                                <br />
                                <span>{item.jobTitle}</span>
                            </div>
                        </td>
                        <td style={{ textAlign: 'center' , fontWeight: 600}}  className="text-primary">
                            {item.status == null && item.todaysTimeIn != null ? (
                                <>
                                    <p>IN</p>
                                </>
                            ) : ""}
                            {item.status == null && item.todaysTimeIn == null ? "Absent" : item.status == null && item.todaysTimeIn != null ? item.todaysTimeIn : item.status}</td>
                        </tr>
                    ))
                    ) : (
                        <div className="justify-content-center d-flex">
                            <p style={{textAlign: 'center'}}>No Member Found</p>
                        </div>
                    )}
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
            <div style={{ minHeight: '300px', maxHeight: '300px', overflowY: 'auto', paddingTop: '20px', marginLeft: '5px' }}>
                <tbody>
                    {allMember && allMember.length > 0 ? (
                    allMember.map((item: any, index: any) => (
                        <tr key={index}>
                        <td className="text-primary font-bold d-flex" style={{ textAlign: 'center' }}>
                            <img src={user} width={30} style={{ borderRadius: '50%', color: 'black', margin: '10px' }} alt="User" />
                            <div className="pt-2">
                                {item.fullname}
                                <br />
                                <span>{item.jobTitle}</span>
                            </div>
                        </td>
                        <td style={{ textAlign: 'center' , fontWeight: 600}}  className="text-primary">
                            {item.status == null && item.todaysTimeIn != null ? (
                                <>
                                    <p>IN</p>
                                </>
                            ) : ""}
                            {item.status == null && item.todaysTimeIn == null ? "Absent" : item.status == null && item.todaysTimeIn != null ? item.todaysTimeIn : item.status}</td>
                        </tr>
                    ))
                    ) : (
                        <div className="justify-content-center">
                            <p style={{textAlign: 'center'}}>No Member Found</p>
                        </div>
                    )}
                </tbody>
                </div>
                </Table>
        </div>
    )

}

export default SquadTracker