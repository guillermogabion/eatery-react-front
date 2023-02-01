import React, { useEffect, useState, useRef, useCallback, memo } from "react"
import { Button, Tooltip, Overlay } from "react-bootstrap"
import { edit, dlt, pagination_right, pagination_left } from "../../assets/images"
import MainLeftMenu from "../../components/MainLeftMenu"
import UserTopMenu from "../../components/UserTopMenu"
import { RequestAPI, Api } from "../../api"
import { Utility } from "../../utils"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Select, { components } from "react-select"
import { history } from "../../helpers"
import UserPopup from "../../components/Popup/UserPopup"
const ErrorSwal = withReactContent(Swal)

const OverlayTriggerEdit = (props: any) => {
  const [show, setShow] = useState(false)
  const target = useRef(null)
  return (
    <>
      <Button
        ref={target}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        variant="link"
        onClick={() => history.push({ pathname: "/role/edit", state: { id: props.id } })}>
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
}

const OverlayTriggerDel: React.FC<any> = memo((props: any) => {
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

const GenerateRow = (props: any) => {
  const { features, name, id, deleteRecord } = props
  const [activeFeature, setActiveFeature] = useState(0)
  const { functions = [] } = (features && features[activeFeature]) || []
  const { accessRights = [] } = useSelector((state: any) => state.rootReducer.userData) // Login User Data

  functions.forEach((d: any) => {
    d.value = d.name
    d.label = `${d.name}`.replace("_", " ")
  })

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
    <tr className="item">
      <td>
        <label className="nameValue">{name}</label>
      </td>
      <td>
        <ul className="featureList">
          {features &&
            features.map((f: any, i: any) => {
              return (
                <li
                  onClick={() => setActiveFeature(i)}
                  key={`${name}-${f.name}`}
                  className={activeFeature == i ? "active" : ""}>
                  {f.name}
                </li>
              )
            })}
        </ul>
      </td>
      <td>
        <div id="DropDownSelect" className="MainDropDown">
          <Select
            closeMenuOnSelect={false}
            value={functions}
            isMulti
            styles={customStyles}
            hideSelectedOptions={false}
            isClearable={false}
            options={functions}
            components={{
              IndicatorSeparator: () => null,
              Option: ({ children, ...props }) => {
                return (
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
                      {children}
                    </div>
                  </components.Option>
                )
              },
              MultiValue: (props) => {
                const { children, index, innerProps }: any = props
                const value =
                  index === functions.length - 1 ? children : index < 3 ? ` ${children}, ` : `${children}...`
                return index < 4 ? (
                  <components.MultiValueContainer {...innerProps}>{value}</components.MultiValueContainer>
                ) : null
              },
            }}
          />
        </div>
      </td>
      <td>
        <span className="listaction">
          {accessRights.includes("Can_Add_Edit_Role") ? <OverlayTriggerEdit id={id} /> : null}
          {accessRights.includes("Can_Delete_Role") ? <OverlayTriggerDel deleteUser={deleteRecord} id={id} /> : null}
        </span>
      </td>
    </tr>
  )
}

export const Role = (props: any) => {
  const { history } = props
  const [rolesData, setRolesData] = useState<any>({})
  const { accessRights = [] } = useSelector((state: any) => state.rootReducer.userData) // Login User Data

  const setPagination = (paggingNo: number) => getRoleData(paggingNo)

  const getRoleData = useCallback((pagging = 0) => {
    RequestAPI.getRequest(
      `${Api.ROLES}?size=10&page=${pagging}&sort=name&sortDir=ASC`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200) {
          if (body && body.data && body.data.content.length > 0) {
            setRolesData(body && body.data)
          } else {
            setRolesData({})
          }
        } else {
          Utility.showError((body.error && body.error.message) || "")
        }
      }
    )
  }, [])

  useEffect(() => {
    getRoleData()
  }, [])

  const onDeleteFun = (id: number) => {
    RequestAPI.deleteRequest(`${Api.ROLES}/${id}`, "", {}, async (res: any) => {
      const { status, body = { data: {}, error: {} } }: any = res
      if (status === 200) {
        getRoleData()
        ErrorSwal.fire("Deleted!", (body && body.data) || "Record deleted.", "success")
      } else {
        ErrorSwal.fire({
          icon: "error",
          title: (body.error && body.error.message) || "",
        })
      }
    })
  }

  const deleteRecord = useCallback((id: any) => {
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
  }, [])

  const selectedPage = rolesData && rolesData.totalPages == 0 ? 0 : rolesData.number + 1 || 0
  return (
    <div className="body">
      <div className="wraper">
        <MainLeftMenu />
        <div className="contentRightSection">
          <div className="contentRightFrame">
            <div className="contentRightTopHeader">
              <UserTopMenu title="User Management" search={false} />
            </div>
            <div className="contentRightcontent">
              <div className="contentbuttonSet">
                {accessRights.includes("Can_Add_Edit_Role") ? (
                  <Button type="button" onClick={() => history.push("/role/add")} className="addUser">
                    <span>+</span>ADD NEW ROLE
                  </Button>
                ) : null}
              </div>
              <div className="contentDataSetUserManagement">
                <table id="myTable" className="UserManagement">
                  <tbody>
                    <tr>
                      <th style={{ cursor: "pointer", width: "20%" }}>ROLE NAME</th>
                      <th style={{ cursor: "pointer", width: "35%" }}>FEATURES</th>
                      <th style={{ cursor: "pointer", width: "35%" }}>ACCESS RIGHTS</th>
                      {accessRights.includes("Can_Add_Edit_Role") || accessRights.includes("Can_Delete_Role") ? (
                        <th style={{ cursor: "pointer", width: "10%" }}>ACTIONS</th>
                      ) : null}
                    </tr>
                    {rolesData &&
                      rolesData.content &&
                      rolesData.content.length &&
                      rolesData.content.map((d: any) => {
                        const { features, name, id } = d
                        return (
                          <GenerateRow key={name} features={features} name={name} id={id} deleteRecord={deleteRecord} />
                        )
                      })}
                  </tbody>
                </table>
              </div>
              <div className="Pagination">
                <ul>
                  <li>{selectedPage}</li>
                  <li>of</li>
                  <li>
                    <a href="#"> {(rolesData && rolesData.totalPages) || 0} </a>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      disabled={selectedPage === 1}
                      className="prev"
                      onClick={() => (rolesData.number > 0 ? setPagination(rolesData.number - 1) : {})}>
                      {" "}
                      <img src={pagination_left} alt="left" />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      disabled={selectedPage === rolesData.totalPages}
                      className="next"
                      onClick={() =>
                        rolesData.number + 1 < rolesData.totalPages ? setPagination(rolesData.number + 1) : {}
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
      </div>
    </div>
  )
}
