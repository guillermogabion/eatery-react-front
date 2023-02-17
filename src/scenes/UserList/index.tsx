import React, { useEffect, useState, useRef, useCallback } from "react"
import { Button, Tooltip, Overlay } from "react-bootstrap"
import { edit, icon_plus_add, icon_delete, dlt, pagination_right, pagination_left } from "../../assets/images"
import UserTopMenu from "../../components/UserTopMenu"
import UserPopup from "../../components/Popup/UserPopup"
import { RequestAPI, Api } from "../../api"
import { Utility } from "../../utils"
import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { history } from "./../../helpers"
import SingleSelect from "../../components/Forms/SingleSelect"
import { STATUS_COLOR } from "../../constants"
import ReactLoader from "../../components/Loader/ReactLoader"
const ErrorSwal = withReactContent(Swal)

const OverlayTriggerEdit = React.memo((props: any) => {
  const [show, setShow] = useState(false)
  const target = useRef(null)
  return (
    <>
      <Button
        ref={target}
        disabled={props.isDeclined}
        onMouseEnter={() => (props.isDeclined ? {} : setShow(true))}
        onMouseLeave={() => (props.isDeclined ? {} : setShow(false))}
        variant="link"
        onClick={() => (props.isDeclined ? {} : history.push({ pathname: "/user/edit", state: { id: props.id } }))}>
        <img src={edit} alt="Edit" />
      </Button>
      <Overlay target={target.current} show={show} placement="top">
        {(props: any) => (
          <Tooltip className="custom-tooltip" id={`tooltip-${"edit"}`} {...props}>
            Edit
          </Tooltip>
        )}
      </Overlay>
    </>
  )
})

const OverlayTriggerDel = React.memo((props: any) => {
  const [show, setShow] = useState(false)
  const target = useRef(null)

  return (
    <>
      <Button
        ref={target}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        variant="link"
        onClick={() => props.deleteUser(props.id)}>
        <img src={dlt} alt="Remove" />
      </Button>
      <Overlay target={target.current} show={show} placement="top">
        {(props: any) => (
          <Tooltip className="custom-tooltip" id={`tooltip-${"Delete"}`} {...props}>
            Delete
          </Tooltip>
        )}
      </Overlay>
    </>
  )
})

export const UserList = (props: any) => {
  const { history } = props
  const dispatch = useDispatch()
  const [dataList, setDataList] = useState<any>({})

  const { accessRights = [], username = "" } = useSelector((state: any) => state.rootReducer.userData) // Login User Data
  //const userData1 = useSelector((state: any) => state.rootReducer.userData)
  const units = useSelector((state: any) => state.rootReducer.units)
  const status = useSelector((state: any) => state.rootReducer.status)
  const topSearch = useSelector((state: any) => state.rootReducer.topSearch)
  const user_master_Data = useSelector((state: any) => state.rootReducer.user_master_Data)

  const [filterData, setFilterData] = useState<any>(window.history?.state?.filterData || {})
  const [sort, setSort] = useState<any>("creationTimestamp")
  const [sortDir, setSortDir] = useState<any>("DESC")

  const [loader, setLoader] = useState(false)
  const [setErrorMessage, setSetErrorMessage] = useState("")

  //Deleted ID
  const [deleteIDs, setDeleteIDs] = useState<any>([])


  useEffect(() => {
    setFilterData(window.history?.state?.filterData);
  }, [window.history?.state?.filterData])

  const keydownFun = (event: any) => {
    if (event.key === "Enter" && dispatch && getFetchData) {
      dispatch({ type: "SET_TOP_SEARCH", payload: "" })
      getFetchData(0)
    }
  }

  useEffect(() => {
    document.removeEventListener("keydown", keydownFun, true)
    document.addEventListener("keydown", keydownFun, true)
    return () => document.removeEventListener("keydown", keydownFun, true)
  }, [filterData])

  useEffect(() => {
    getFetchData(0, topSearch, window.history?.state?.filterData)
  }, [sort, sortDir, topSearch, window.history?.state?.filterData])

  const onDeleteFun = (id: number) => {
    RequestAPI.deleteRequest(`${Api.USERS}/${id}`, "", {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        getFetchData(0, topSearch)
        ErrorSwal.fire("Deleted!", (body && body.data) || "Record deleted.", "success")
      } else {
        //error
        ErrorSwal.fire({
          icon: "error",
          title: (body.error && body.error.message) || "",
        })
      }
    })
  }

  const deleteUser = (id: number) => {
    ErrorSwal.fire({
      html: (
        <UserPopup
          handleClose={ErrorSwal.close}
          popupType="confirm"
          title="Are you sure you want to delete this ?"
          onConfirm={() => onDeleteFun(id)}
        />
      ),
      showConfirmButton: false,
    })
  }

  const makeFilterData = (event: any) => {
    const { name, value } = event.target
    const filterObj: any = { ...filterData }
    filterObj[name] = name && value !== "Select" ? value : ""
    setFilterData(filterObj)
  }

  const setSortData = (field: any) => {
    if (field == sort) {
      setSortDir(sortDir == "ASC" ? "DESC" : "ASC")
    } else {
      setSortDir("DESC")
      setSort(field)
    }
  }

  const setPagination = (paggingNo: number) => getFetchData(paggingNo)

  const getFetchData = (pagging = 0, topS?: any, windowhistory?: any) => {
    setLoader(true)
    setSetErrorMessage("")
    let queryString = ""

    let filterDataTemp = { ...filterData }
    if (windowhistory && Object.keys(windowhistory).length) {
      filterDataTemp = { ...filterDataTemp, ...windowhistory }
    }

    if (filterDataTemp && Object.keys(filterDataTemp).length > 0) {
      Object.keys(filterDataTemp).forEach((d: any) => {
        if (filterDataTemp[d]) {
          if (!(topS && d == "name")) {
            queryString += `&${d}=${filterDataTemp[d]}`
          }
        } else {
          queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
        }
      })
    }

    if (topS != null && `${topS}`.trim()) {
      queryString += `&generic=${topS}`
    }

    RequestAPI.getRequest(
      `${Api.USERS}?size=10&page=${pagging}&sort=${sort || "userCredential.username"}&sortDir=${sortDir}${queryString}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200) {
          if (body && body.data && body.data.content.length > 0) {
            setDataList(body && body.data)
          } else {
            setDataList({})
            setSetErrorMessage("Record Not Found!")
          }
        } else {
          Utility.showError((body.error && body.error.message) || "")
        }
        setLoader(false)
      }
    )
  }

  const setFillDeleteId = (id: number) => {
    const deleteIds = [...deleteIDs]
    const findIndexId = deleteIds.findIndex((d) => d == id)
    if (findIndexId > -1) {
      deleteIds.splice(findIndexId, 1)
    } else {
      deleteIds.push(id)
    }

    setDeleteIDs(deleteIds)
  }

  const OnDeleteSelectedId = useCallback(() => {
    RequestAPI.postRequest(Api.USERS_DELETE, "", deleteIDs, {}, async (res: any) => {
      const { status, body }: any = res
      if (status === 200 || status === 201) {
        ErrorSwal.fire("Deleted!", "Records deleted.", "success")
        setDeleteIDs([])
        getFetchData(0, topSearch)
      } else {
        ErrorSwal.fire({
          icon: "error",
          title: (body.error && body.error.message) || "",
        })
      }
    })
  }, [deleteIDs, topSearch])

  const deleteSelectedID = useCallback(() => {
    ErrorSwal.fire({
      html: (
        <UserPopup
          handleClose={ErrorSwal.close}
          popupType="confirm"
          title="Are you sure you want to delete this ?"
          onConfirm={OnDeleteSelectedId}
        />
      ),
      showConfirmButton: false,
    })
  }, [deleteIDs, topSearch])

  //Select ALL

  const selectAllIDForDelete = (e: any) => {
    const { checked } = e.target
    const deleteIds: any = []
    if (checked) {
      dataList &&
        dataList.content &&
        Object.keys(dataList.content).length > 0 &&
        dataList.content.forEach((d: any) => {
          deleteIds.push(d.id)
        })
      setDeleteIDs(deleteIds)
    } else {
      setDeleteIDs([])
    }
  }

  const singleChangeOption = (option: any, name: any) => {
    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }

  const selectedPage = dataList && dataList.totalPages == 0 ? 0 : dataList.number + 1 || 0
  return (
    <div className="body">
      <div className="wraper">
            <div className="topHeader" >
              <UserTopMenu title="User Management" />
            </div>
            <div className="contentContainer">
              <div className="filterContainer">
                  <label>Search By</label>
                  <form action="#!" className="searchForm">
                    <div className="fieldName">
                      <input
                        name="name"
                        placeholder="User ID"
                        type="text"
                        className="formControl"
                        onKeyDown={(evt: any) =>
                          ((evt.target.value == "" && evt.key == " ") || !/^[a-zA-Z0-9-,.@_ ]+$/gi.test(evt.key)) &&
                          evt.preventDefault()
                        }
                        onChange={(e) => {
                          makeFilterData(e)
                        }}
                        value={filterData && filterData['name']}
                      />
                    </div>
                    <div className="fieldStatus ">
                      <SingleSelect
                        type="string"
                        options={status}
                        placeholder={"Select Status"}
                        onChangeOption={singleChangeOption}
                        name="statusId"
                        value={filterData && filterData['statusId']}
                      />

                    </div>
                    <div className="fieldRole">
                      <SingleSelect
                        type="string"
                        options={[]}
                        placeholder={"Select Role"}
                        onChangeOption={singleChangeOption}
                        name="roleId"
                        value={filterData && filterData['roleId']}
                      />
                    </div>
                    <div className="fieldLocation">
                      <SingleSelect
                        type="string"
                        options={units}
                        placeholder={"Select Location"}
                        onChangeOption={singleChangeOption}
                        name="unitId"
                        value={filterData && filterData['unitId']}
                      />
                    </div>
                    <Button
                      variant="link"
                      className="searchBtn"
                      onClick={() => {
                        dispatch({ type: "SET_TOP_SEARCH", payload: "" })
                        getFetchData(0)
                      }}>
                      Search
                    </Button>
                  </form>
                </div>
              <br />
              <div className="contentbuttonSet">
                {accessRights.includes("Can_Add_Edit_User") ? (
                  <Button type="button" className="addUser" onClick={() => history.push({ pathname: "/user/add" })}>
                    {" "}
                    <img src={icon_plus_add} alt="ADD NEW ROLE" /> Add New User
                  </Button>
                ) : null}
                {accessRights.includes("Can_Add_Edit_User") ? (
                  <Button type="button" className="addUser" onClick={() => history.push({ pathname: "/user/add" })}>
                    {" "}
                    <img src={icon_plus_add} alt="ADD NEW ROLE" /> Import Users
                  </Button>
                ) : null}
                {accessRights.includes("Can_Delete_User") ? (
                  <button
                    disabled={!deleteIDs.length}
                    type="button"
                    className="deletUser"
                    onClick={() => (deleteIDs.length ? deleteSelectedID() : {})}>
                    <img src={icon_delete} alt="ADD NEW ROLE" /> Delete User
                  </button>
                ) : null}
              </div>
              <div className="contentDataSetUserManagement1">
                <table id="myTable" className="UserCredentialTable">
                  <tbody>
                    <tr>
                      <th style={{ cursor: "pointer" }}>
                        <label className="main">
                          <input
                            type="checkbox"
                            id="sort"
                            name="sort"
                            defaultValue="sort"
                            onChange={(e) => selectAllIDForDelete(e)}
                            checked={!!(dataList && dataList.content && dataList.content.length == deleteIDs.length)}
                          />
                          <span className="geenmask" style={{ border: "1px solid #9a9a9a" }}></span>
                        </label>
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => setSortData("userCredential.username")}>
                        User ID
                        {sort == "userCredential.username" ? (
                          <span className="order">
                            {sortDir == "DESC" ? (
                              <span className="dropdown">
                                <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                              </span>
                            ) : (
                              <span className="dropup">
                                <span className="caret" style={{ margin: "10px 0px" }}></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="order">
                            <span className="dropdown">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px 10px 5px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                            <span className="dropup">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                          </span>
                        )}
                      </th>
                      <th className="sort-column" style={{ cursor: "pointer" }} onClick={() => setSortData("lastname")}>
                        Full name
                        {sort == "lastname" ? (
                          <span className="order">
                            {sortDir == "DESC" ? (
                              <span className="dropdown">
                                <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                              </span>
                            ) : (
                              <span className="dropup">
                                <span className="caret" style={{ margin: "10px 0px" }}></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="order">
                            <span className="dropdown">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px 10px 5px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                            <span className="dropup">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                          </span>
                        )}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => setSortData("role.name")}>
                        Role
                        {sort == "role.name" ? (
                          <span className="order">
                            {sortDir == "DESC" ? (
                              <span className="dropdown">
                                <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                              </span>
                            ) : (
                              <span className="dropup">
                                <span className="caret" style={{ margin: "10px 0px" }}></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="order">
                            <span className="dropdown">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px 10px 5px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                            <span className="dropup">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                          </span>
                        )}
                      </th>
                      <th style={{ cursor: "pointer", width: "210px" }} onClick={() => setSortData("email")}>
                        Official Email ID
                        {sort == "email" ? (
                          <span className="order">
                            {sortDir == "DESC" ? (
                              <span className="dropdown">
                                <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                              </span>
                            ) : (
                              <span className="dropup">
                                <span className="caret" style={{ margin: "10px 0px" }}></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="order">
                            <span className="dropdown">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px 10px 5px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                            <span className="dropup">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                          </span>
                        )}
                      </th>
                      <th style={{ cursor: "pointer", width: "110px" }} onClick={() => setSortData("unit.solId")}>
                        SOL id
                        {sort == "unit.solId" ? (
                          <span className="order">
                            {sortDir == "DESC" ? (
                              <span className="dropdown">
                                <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                              </span>
                            ) : (
                              <span className="dropup">
                                <span className="caret" style={{ margin: "10px 0px" }}></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="order">
                            <span className="dropdown">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px 10px 5px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                            <span className="dropup">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                          </span>
                        )}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => setSortData("status.name")}>
                        status
                        {sort == "status.name" ? (
                          <span className="order">
                            {sortDir == "DESC" ? (
                              <span className="dropdown">
                                <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                              </span>
                            ) : (
                              <span className="dropup">
                                <span className="caret" style={{ margin: "10px 0px" }}></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="order">
                            <span className="dropdown">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px 10px 5px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                            <span className="dropup">
                              <span
                                className="caret"
                                style={{
                                  margin: "10px 0px",
                                  color: "rgb(150 148 148)",
                                }}></span>
                            </span>
                          </span>
                        )}
                      </th>
                      {accessRights.includes("Can_Add_Edit_User") || accessRights.includes("Can_Delete_User") ? (
                        <th style={{ cursor: "pointer" }}>actions</th>
                      ) : null}
                    </tr>

                    {dataList &&
                      dataList.content &&
                      Object.keys(dataList.content).length > 0 &&
                      dataList.content.map((d: any, i: number) => {
                        const {
                          id,
                          userName = "",
                          email,
                          firstName = "",
                          lastName = "",
                          middleName = "",
                          userRoleValue = "",
                          userStatusValue,
                          solId,
                        } = d
                        return (
                          <tr className="item" key={`${i}-${userName}`}>
                            <td>
                              <label className="main">
                                <input
                                  type="checkbox"
                                  id="sort"
                                  name="sort"
                                  defaultValue="sort"
                                  onChange={() => setFillDeleteId(id)}
                                  checked={deleteIDs.includes(id)}
                                />
                                <span className="geenmask"></span>
                              </label>
                            </td>
                            <td className="email txt_overflow">
                              <strong
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  history.push({
                                    pathname: "/user/view",
                                    state: { id, filterData },
                                  })
                                }>
                                {userName}
                              </strong>
                            </td>
                            <td className="fullname txt_overflow">{`${lastName ? lastName + "," : ""} ${
                              firstName ? firstName + "," : ""
                            } ${middleName}`}</td>
                            <td className="rolevalue">{userRoleValue}</td>
                            <td className="emailBlock">{`${email}`.toLowerCase()}</td>
                            <td className="rolemob">{solId}</td>
                            <td className="actionLabel">
                              <span
                                style={{
                                  background: STATUS_COLOR[userStatusValue] || "#F5BEA9",
                                }}
                                className={"lightStatus"}>
                                {userStatusValue}
                              </span>
                            </td>
                            <td>
                              <span className="listaction">
                                {accessRights.includes("Can_Add_Edit_User") ? (
                                  <OverlayTriggerEdit
                                    id={id}
                                    isDeclined={userRoleValue == "Super Admin" && userName == username}
                                  />
                                ) : null}
                                {accessRights.includes("Can_Delete_User") ? (
                                  <OverlayTriggerDel deleteUser={deleteUser} id={id} />
                                ) : null}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
                {setErrorMessage ? <div className="recordnotfound">{setErrorMessage}</div> : null}
                <ReactLoader isLoading={loader} />
              </div>

              <div className="Pagination">
                <ul>
                  <li>{selectedPage}</li>
                  <li>of</li>
                  <li>
                    <a href="#"> {(dataList && dataList.totalPages) || 0} </a>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="prev"
                      disabled={selectedPage === 1}
                      onClick={() => (dataList.number > 0 ? setPagination(dataList.number - 1) : {})}>
                      {" "}
                      <img src={pagination_left} alt="left" />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="next"
                      disabled={selectedPage === dataList.totalPages}
                      onClick={() =>
                        dataList.number + 1 < dataList.totalPages ? setPagination(dataList.number + 1) : {}
                      }>
                      {" "}
                      <img src={pagination_right} alt="right" />{" "}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
    </div>
  )
}
