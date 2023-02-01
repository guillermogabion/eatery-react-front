import React, { useEffect, useState, useCallback } from "react"
import { Button } from "react-bootstrap"
import { createrole } from "../../assets/images"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { RequestAPI, Api } from "../../api"
import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Select, { components } from "react-select"
import UserPopup from "../../components/Popup/UserPopup"
const ErrorSwal = withReactContent(Swal)

const CustomSelect = (props: any) => {
  const { label, index, setSelectedRoleAction, options, editAccess } = props
  const [isChecked, setChecked] = useState(false)
  const [access, setAccess] = useState<any>(editAccess || [])

  editAccess.map((d: any) => {
    d.value = d.name
    d.label = `${d.name}`.replace("_", " ")
  })

  options.map((d: any) => {
    d.value = d.name
    d.label = `${d.name}`.replace("_", " ")
  })

  useEffect(() => {
    if (editAccess.length > 0) {
      setAccess(editAccess)
      setChecked(true)
    }
  }, [editAccess])

  useEffect(() => {
    if (isChecked && setSelectedRoleAction) {
      setSelectedRoleAction({
        id: index,
        name: label,
        description: null,
        functions: access,
      })
    }
  }, [isChecked, access, label])

  const handleMultiChange = (option: any) => {
    option.map((d: any) => {
      d.description = null
    })
    setAccess(option)
  }

  const setFeaturePremission = (e: any) => {
    setChecked(e.target.checked)
    if (!e.target.checked) {
      setAccess([])
      setSelectedRoleAction({
        id: index,
        name: label,
        description: null,
        functions: [],
      })
    }
  }

  const customStyles = {
    option: (provided: any, state: any) => {
      return {
        ...provided,
        color: "#1F7888",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 11,
        fontSize: 14,
        backgroundColor: state && state.data && state.data.id % 2 == 1 ? "#FFFFFF" : "rgba(216, 216, 216, .2)",
        // height: 20
      }
    },
    control: (provided: any, state: any) => ({
      ...provided,
      boxShadow: 0,
      borderRadius: 0,
      borderStyle: "initial",
      borderBottom: "1px solid rgba(0, 0, 0, 0.16)",
      backgroundColor: "transparent",
      "&:hover": {
        borderColor: "none",
      },
      // width: 400,
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      borderRadius: 0,
      marginTop: 3,
    }),
    menuList: (provided: any, state: any) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      width: 98,
      gridGap: 5,
    }),
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = "opacity 300ms"

      return { ...provided, opacity, transition }
    },
  }

  return (
    <>
      <td>
        <label className="main">
          <input type="checkbox" name={label} checked={isChecked} onChange={(e) => setFeaturePremission(e)} />
          <span className="geenmask" />
        </label>
      </td>
      <td>
        <strong>{label}</strong>
      </td>
      <td>
        <Select
          closeMenuOnSelect={false}
          value={access}
          styles={customStyles}
          isDisabled={!isChecked}
          isMulti
          isClearable={false}
          // menuIsOpen={true}
          hideSelectedOptions={false}
          onChange={(option) => handleMultiChange(option)}
          options={options}
          components={{
            IndicatorSeparator: () => null,
            Option: ({ children, ...props }) => {
              return (
                <div>
                  <components.Option {...props}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        width: "100%",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "20px",
                        }}>
                        <label className="main">
                          <input type="checkbox" id="sort" name="sort" checked={props.isSelected} onChange={() => {}} />
                          <span className="geenmask" />
                        </label>
                      </div>
                      &nbsp;&nbsp;{children}
                    </div>
                  </components.Option>
                </div>
              )
            },
            MultiValue: (props) => {
              const { children, index, innerProps }: any = props
              const value = index === access.length - 1 ? children : index < 3 ? `${children},  ` : `${children}...`
              return index < 4 ? (
                <components.MultiValueContainer {...innerProps}>{value}</components.MultiValueContainer>
              ) : null
            },
          }}
        />
      </td>
    </>
  )
}

export const RoleAdd = (props: any) => {
  const { history } = props
  const dispatch = useDispatch()
  const roles = useSelector((state: any) => state.rootReducer.roles)
  const [selectRole, setSelectRole] = useState<any>("")
  const [selectRoleData, setSelectRoleData] = useState<any>([])
  const [access, setAccess] = useState<any>([])
  const [roleError, setRoleError] = useState<any>("")

  const [showPopup, setShowPopup] = useState<any>(false)

  const userId = props.location && props.location.state && props.location.state.id

  useEffect(() => {
    if (userId) {
      RequestAPI.getRequest(`${Api.ROLES}/${userId}`, "", {}, {}, async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200) {
          setSelectRole(body.data.name)
          setSelectRoleData((body && body.data && body.data.features) || [])
        }
      })
    }
  }, [])

  const setSelectedRoleAction = React.useCallback(
    (data: any) => {
      const selectRoleDataCopy = [...selectRoleData]
      const finfIndex = selectRoleDataCopy ? selectRoleDataCopy.findIndex((d) => d.name === data.name) : -1
      if (finfIndex > -1) {
        selectRoleDataCopy[finfIndex] = data
      } else {
        selectRoleDataCopy.push(data)
      }
      setSelectRoleData(selectRoleDataCopy)
    },
    [selectRoleData]
  )

  useEffect(() => {
    RequestAPI.getRequest(Api.ACCESS, "", {}, {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        setAccess((body && body.data && body.data.features) || [])
      }
    })
  }, [])

  //GET UPDATED ROLE for all dropdown
  const getRoles = () => {
    RequestAPI.getRequest(Api.GET_USER_MASTER_LIST, "", {}, {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        dispatch({
          type: "SET_GET_USER_MASTER_LIST",
          payload: body && body.data,
        })
      }
    })
  }

  const saveRoleData = useCallback(() => {
    if (selectRole) {
      const requestData = {
        name: selectRole,
        description: "DPU Admin",
        features: selectRoleData,
      }

      if (userId) {
        RequestAPI.putRequest(`${Api.ROLES}/${userId}`, "", requestData, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          setShowPopup(false)
          if (status === 200 || status === 201) {
            ErrorSwal.fire({
              html: <UserPopup handleClose={ErrorSwal.close} popupType="success" title="Updated!" />,
              showConfirmButton: false,
            })
            getRoles()
            history.push("/role/list")
          } else {
            ErrorSwal.fire("Error!", (body.error && body.error.message) || "", "error")
          }
        })
      } else {
        RequestAPI.postRequest(Api.ROLES, "", requestData, {}, async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          setShowPopup(false)
          if (status === 200 || status === 201) {
            ErrorSwal.fire({
              html: (
                <UserPopup
                  handleClose={ErrorSwal.close}
                  popupType="success"
                  title={"Role Successfully created." || ""}
                />
              ),
              showConfirmButton: false,
            })
            getRoles()
            history.push("/role/list")
          } else {
            ErrorSwal.fire({
              icon: "error",
              title: "Error!",
              text: (body.error && body.error.message) || "",
              confirmButtonColor: "#73BF45",
            })
          }
        })
      }
    } else {
      setShowPopup(false)
      setRoleError("Enter role name")
    }
  }, [selectRole, selectRoleData])

  let isfunctionsData = false
  selectRoleData.forEach((d: any) => {
    if (d.functions && d.functions.length) {
      isfunctionsData = true
    }
  })

  return (
    <div>
      <div className="body">
        <div className="wraper">
          <MainLeftMenu />
          <div className="contentRightSection">
            <div className="contentRightFrame">
              <div className="contentRightTopHeader">
                <UserTopMenu title="User Management" search={false} />
              </div>
              <div className="contentRightcontent">
                <div className="bredcrum">
                  <ul>
                    <li onClick={() => history.push("/role/list")}>
                      <a href="#!">User Role</a>
                    </li>
                    <li>{userId ? "Update Role" : "Add New Role"}</li>
                  </ul>
                </div>
                <div className="contentDataSetCreateRole">
                  <div className="row">
                    <div className="col-md-5">
                      <label>New Role <span className="strikes-input">*</span></label>
                      <div className="fieldsecect">
                        <input
                          value={selectRole}
                          name="rolename"
                          id="status"
                          className="formControl"
                          onChange={(e) => {
                            setSelectRole(e.target.value)
                            setRoleError("")
                          }}
                        />
                        <div style={{ color: "red", fontSize: "14px" }}>{roleError}</div>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <table id="myTable" className="UserManagement2">
                        <tbody>
                          <tr>
                            <th style={{ width: "5%" }}>&nbsp;</th>
                            <th>FEATURES</th>
                            <th style={{ width: "55%" }}>ACCESS RIGHTS</th>
                          </tr>
                          {access.map((d: any, i: number) => {
                            const dataIndex = selectRoleData
                              ? selectRoleData.findIndex((e: any) => e.name == d.name)
                              : -1
                            return (
                              <tr className="item" key={d.name}>
                                <CustomSelect
                                  editAccess={dataIndex > -1 ? selectRoleData[dataIndex].functions : []}
                                  options={d.functions}
                                  index={d.id}
                                  label={d.name}
                                  setSelectedRoleAction={setSelectedRoleAction}
                                />
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <button
                    disabled={!(isfunctionsData && selectRole)}
                    type="button"
                    onClick={() => (isfunctionsData && selectRole ? setShowPopup(true) : {})}
                    className="btn btn-primary  float-right createUser">
                    {userId ? "UPDATE ROLE" : "CREATE ROLE"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <aside id="CreateRole" className="modalPopup" style={{ display: showPopup ? "flex" : "none" }}>
        <div className="modalBody">
          <div className="modalmainContent">
            <div className="modalTop">
              <div className="modalmedia">
                <img src={createrole} alt="RBank" />
              </div>
              <div className="modalTopContent">
                <p>
                  You are about to {userId ? "update" : "create"} <a href="#">{selectRole}</a> as a new role. Kindly
                  confirm the below details and proceed.
                </p>
              </div>
            </div>
            <div className="modalContent">
              <table id="myTable" className="UserManagement3">
                <thead>
                  <tr>
                    <th style={{ width: "200px" }}>FEATURES</th>
                    <th>ACCESS RIGHTS</th>
                  </tr>
                </thead>
                <tbody>
                  {selectRoleData &&
                    selectRoleData.map((d: any) => {
                      const { functions, name } = d
                      return functions.length ? (
                        <tr key={name}>
                          <td>
                            <strong>{name}</strong>
                          </td>
                          <td>
                            <ul>
                              {functions.map((e: any) => {
                                return <li key={`${name}_${e.name}`}>{`${e.name.replace("_", " ")}`}</li>
                              })}
                            </ul>
                          </td>
                        </tr>
                      ) : null
                    })}
                </tbody>
              </table>
            </div>
            <div className="modalFooter">
              <div className="buttonSet">
                <Button variant="link" onClick={() => setShowPopup(false)} className="btn btn-secondry">
                  CANCEL
                </Button>
                <Button variant="link" onClick={() => saveRoleData()} className="btn btn-primary">
                  CONFIRM &amp; {userId ? "UPDATE ROLE" : "CREATE ROLE"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
