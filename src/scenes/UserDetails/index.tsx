import React, { useEffect, useState, useRef } from "react"
import { userdetail, user } from "../../assets/images"
import { STATUS_COLOR } from "../../constants"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { RequestAPI, Api } from "../../api"

export const UserDetails = (props: any) => {
    const [userDetails, setUserDetails] = useState<any>({})
    const [userDetailsStatus, setUserDetailsStatus] = useState("Active")

    useEffect(() => {
        getFetchUserData()
    })

    const getFetchUserData = () => {
        RequestAPI.getRequest(
            `${Api.GET_USER_DETAILS}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    setUserDetails(body.data)
                    setUserDetailsStatus(body.data.status)
                }
            }
        )
    }
    return (
        <div className="body">
            <div className="wraper">
                <MainLeftMenu />
                <div className="contentRightSection">
                    <div className="contentRightFrame">
                        <div className="topHeader">
                            <UserTopMenu title="User Account Details" />
                        </div>
                        <div className="contentContainer">
                            <div className="bredcrum">
                                <ul>
                                    <li>
                                        <a href="/">Home</a>
                                    </li>
                                    <li>User Account Details</li>
                                </ul>
                            </div>
                            <div className="contentscrollDiv">
                                <div className="UserDetailscontentContainer">
                                    <div className="UserDetailsHeader">
                                        <div className="UserIcon">
                                            <img src={userdetail} width="45" alt="user" />
                                        </div>
                                        <div>
                                            <h3 className="UserDetailsName">{userDetails.fullName}</h3>
                                        </div>
                                    </div>
                                    <div className="UserDetailsContentsCont">
                                        <div className="UserDetailsContents">
                                            <label style={{ fontSize: 13 }}>Branch/Unit Assigned To</label><br />
                                            <label className="UserDetailsText">{userDetails.branchOfUserName}</label>
                                        </div>
                                    </div>
                                    <div className="UserDetailsContentsCont">
                                        <div className="UserDetailsContents">
                                            <label style={{ fontSize: 13 }}>Date Created</label><br />
                                            <label className="UserDetailsText">{userDetails.dateCreated}</label>
                                        </div>
                                    </div>
                                    <div className="UserDetailsContentsCont">
                                        <div className="UserDetailsContents">
                                            <label style={{ fontSize: 13 }}>Last Login Date & Time</label><br />
                                            <label className="UserDetailsText">{userDetails.lastLoginDateTime}</label>
                                        </div>
                                    </div>
                                    <div className="UserDetailsContentsCont">
                                        <div className="UserDetailsContents">
                                            <label style={{ fontSize: 13 }}>Status</label><br />
                                            <label style={{
                                                background: STATUS_COLOR[userDetailsStatus] || "#F5BEA9",
                                                marginTop: 10,
                                                marginLeft: 15,
                                                fontSize: 18,
                                                fontWeight: 'bolder',
                                                padding: 5,
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                borderRadius: 5
                                            }}>{userDetailsStatus}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
