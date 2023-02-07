import React, { useEffect, useState } from "react"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { RequestAPI, Api } from "../../api"
import moment from "moment"
import { um_icon } from "../../assets/images"

export const UserView = (props: any) => {
  const { history, location } = props
  const [initialValues, setInitialValues] = useState<any>({})
  const userId = props.location && props.location.state && props.location.state.id;

  useEffect(() => {
    return () => {
     window.history.pushState({filterData : location?.state?.filterData}, 'null', window.location.pathname); 
    };
  }, [location?.state?.filterData]);

  useEffect(() => {
    if (userId) {
      RequestAPI.getRequest(`${Api.USERS}/${userId}`, "", {}, {}, async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200) {
          setInitialValues((body && body.data) || {})
        }
      })
    }
  }, [])

  return (
    <div>
      <div className="body">
        <div className="wraper">
          <MainLeftMenu />
          <div className="contentRightSection">
            <div className="contentRightFrame">
              <div className="topHeader">
                <UserTopMenu title="View User" />
              </div>
              <div className="contentContainer">
                <div className="bredcrum">
                  <ul>
                    <li onClick={() => history.push("/user/list")}>
                      <a href="#!">Home</a>
                    </li>
                    <li>View User</li>
                  </ul>
                </div>
                <div className="LoginDetail" style={{ width: "95%" }}>
                  <ul>
                    <li className="umIcon">
                      <img src={um_icon} alt="user" />
                    </li>
                    <li className="LoginDate">
                      <strong>Date of user id creation:</strong>{" "}
                      {(initialValues &&
                        initialValues.creationTimestamp &&
                        moment(initialValues.creationTimestamp).format("DD MMM YYYY")) ||
                        ""}
                    </li>
                  </ul>
                </div>
                <div className="contentscrollDiv">
                  <div className="contentAddUser view-client">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Name</label>
                        <div className="fieldtext">
                          <div className="formControl">{`${
                            initialValues.lastName ? initialValues.lastName + "," : ""
                          } ${initialValues.firstName ? initialValues.firstName + "," : ""} ${
                            initialValues.middleName ? initialValues.middleName : ""
                          }`}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>Role</label>
                        <div className="fieldtext">
                          <div className="formControl">{initialValues.userRoleValue}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Unit</label>
                        <div className="fieldtext">
                          <div className="formControl">{initialValues.unitValue}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>User Type</label>
                        <div className="fieldtext">
                          <div className="formControl">{initialValues.userDesignationValue}</div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <label>User ID</label>
                        <div className="fieldtext">
                          <div className="formControl">{initialValues.userName}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>Official Email ID</label>
                        <div className="fieldtext">
                          <div className="formControl">{initialValues.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Status</label>
                        <div className="fieldtext">
                          <div className="formControl">{initialValues.userStatusValue}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>Set User Expiry</label>
                        <div className="fieldtext">
                          <div className="formControl">
                            {initialValues.userIdExpiry
                              ? moment(initialValues.userIdExpiry, "DD MMM YYYY").format("DD MMM YYYY")
                              : null}
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-md-6">
                        <label>Office Designation</label>
                        <div className="fieldtext">
                          <div className="formControl">
                             {initialValues.officeDesignationValue}
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
