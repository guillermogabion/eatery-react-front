import React, { FC, useEffect, useState } from "react"
import { Form, FormSelectProps } from "react-bootstrap"
import { ErrorMessage } from "formik"
import { RequestAPI, Api } from "../../api"

interface RSelectInterface extends FormSelectProps {
  id?: string
  name: string
  label?: string
  className?: string
  required?: boolean
  options?: any
  value?: any
  style?: any,
  strikes?:any
}

export const RSelect: FC<RSelectInterface> = (props) => {
  const { label, placeholder, name, id, className, onSelect, options, value, strikes } = props
  const [option, setOption] = useState(options || [])

  useEffect(() => {
    if (name === "userStatusId" || name === "userDesignationId" || name === "unitId" || name === "userRoleId") {
      RequestAPI.getRequest(
        name === "userDesignationId"
          ? Api.USERDESIGNATIONS
          : name === "unitId"
          ? Api.UNITS
          : name === "userRoleId"
          ? Api.GET_USER_MASTER_LIST
          : Api.USERSTATUS,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res
          if (status === 200) {
            setOption(
              name === "userRoleId"
                ? (body && body.data && body.data.roles) || []
                : (body && body.data && body.data.content) || body || []
            )
          }
        }
      )
    }
  }, [name])

  return (
    <Form.Group className="col-md-6">
      <Form.Label>{label}  {strikes ? <span className="strikes-input">*</span>: null} </Form.Label>
      <div className="fieldsecect">
       
        <Form.Select style={props.style} name={name} id={id} className={className} onChange={onSelect} value={value}>
          <option value="">{placeholder || "Select"}</option>
          {option.map((d: any) => {
            const { id, name } = d
            return (
              <option key={name} value={Number(id)}>
                {name}
              </option>
            )
          })}
        </Form.Select>
        <ErrorMessage name={name}>{(msg) => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
      </div>
    </Form.Group>
  )
}
