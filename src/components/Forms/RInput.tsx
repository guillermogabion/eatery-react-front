import React, { FC, useCallback, useState } from "react"
import { Form, FormControlProps, Button } from "react-bootstrap"
import { ErrorMessage } from "formik"
import { Utility } from "../../utils"
import { show_password_dark, hide_password_dark } from "../../assets/images"

interface RInputInterface extends FormControlProps {
  label?: string
  placeholder?: string
  name: string
  type: string
  className?: string
  required?: boolean
  ongenerat?: any
  error?: any
  showIcon?: any
  login?: any
  generatetext?: any
  style?: any,
  strikes?: any,
  generate?:any
}

export const RInput: FC<RInputInterface> = (props) => {
  const { label, name, ongenerat, login, generatetext, strikes, generate } = props
  const inputProps = { ...props }

  const [visibile, setVisibile] = useState<any>(false)

  const generatPassword = useCallback(() => {
    ongenerat(`${name}`, Utility.generatePassword(10))
  }, [name, ongenerat])

  if (ongenerat) {
    delete inputProps.ongenerat
  }

  return (
    <Form.Group className={login ? "" : "col-md-6"}>
      <Form.Label>{label} {strikes ? <span className="strikes-input">*</span> : null}</Form.Label>
      <div className="fieldtext">
        <Form.Control {...inputProps}  type={generate ? visibile ? "text" : "password" : ''}/>

        {generate ? <Button
          variant="link"
          onClick={() => setVisibile(!visibile)}
          className="generatBtnpasswordicon"
        >
         {visibile ? <span className="showpass">
            <img src={show_password_dark} alt="Show" />
          </span>
          :
          <span className="hidepass">
            <img src={hide_password_dark} alt="Hide" />
          </span>}
        </Button> : null}

        {ongenerat ? (
          <Button
            className="generatBtn"
            style={{ height: "30px" }}
            onClick={() => {
              generatPassword()
            }}>
            {generatetext || "Generate"}
          </Button>
        ) : null}
       
        <ErrorMessage name={name}>{(msg) => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
      </div>
    </Form.Group>
  )
}
