import React, { FC } from "react"
import Select from "react-select"
import { FormSelectProps } from "react-bootstrap"

interface RSelectInterface extends FormSelectProps {
  id?: string
  name?: string
  label?: string
  className?: string
  required?: boolean
  options?: any
  value?: any
  style?: any
  type?: any
  placeholder?: any
  onChangeOption?: any,
  isClearable?: any,
  menuPortal?: any
}

const customStyles = {
  option: (provided: any) => {
    return {
      ...provided,
      color: "#333333",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 11,
      fontSize: 14,
      minHeight: 40,
      font: "normal normal normal 16px/20px Source Sans Pro, sans-serif",
      "&:hover": {
        backgroundColor: "#7bc0d0",
      },
      ":active": {
        backgroundColor: "rgba(216, 216, 216, 0.2)",
      },
    }
  },
  control: (provided: any, state: any) => ({
    ...provided,
    boxShadow: 0,
    color: "#333333",
    borderStyle: "initial",
    border: !state.isDisabled ? state.hasValue ? "1px solid #d8d8d8" : "1px solid #d8d8d8" : "1px solid #d8d8d8",
    borderRadius: "5px",
    font: "normal normal normal 16px/20px Source Sans Pro, sans-serif",
    height: 42,
    zIndex: 10,
    "&:hover": {
      border: "1px solid #7bc0d0",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: 0,
    marginTop: -1,
    width: "98.5%",
    left: 1,
    zIndex: 10,
  }),
  menuList: (provided: any) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    width: 98,
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = 1
    const transition = "opacity 300ms"

    return { ...provided, opacity, transition, color: "#000000", }
  },
  placeholder: (provided: any) => ({
    ...provided,
    whiteSpace: "nowrap",
  }),
}

const SingleSelect: FC<RSelectInterface> = React.memo((props) => {
  const { placeholder, type, options = [], onChangeOption, name, value, isClearable = false, menuPortal = false, defaultValue, id } = props
  const optionCopy: any = []
  const optionArr = [...options]
  if (type === "string") {
    optionArr.forEach((d: any) => {

      const optionObj = { value: "", label: "" }
      if (typeof d === "object") {
        const { id } = d

        optionObj.value = d.value
        optionObj.label = d.label
      } else {
        optionObj.value = d
        optionObj.label = d
      }
      optionCopy.push(optionObj)
    })
  } else if (type === "Array") {
    optionArr.forEach((d: any) => {
      optionCopy.push({ value: d, label: d })
    })
  } else if (type === "string_name") {
    optionArr.forEach((d: any) => {
      const { name } = d
      optionCopy.push({ value: name, label: name })
    })
  }

  if (type === "currency") {
    optionArr.forEach((d: any) => {
      const { code } = d
      optionCopy.push({ value: code, label: code })
    })
  }

  if (type === "ServicingBusinessUnit") {
    optionArr.forEach((d: any) => {
      const { value, label } = d
      optionCopy.push({ value, label })
    })
  }

  return (
    <Select
      isClearable={isClearable}
      menuPortalTarget={menuPortal ? document.body : null}
      value={value ?
        optionCopy.filter((option: any) => {
          if (option.value.toString() === value.toString()) {
            return { value: option.value, label: option.label }
          }
        })
        :
        null
      }
      // menuIsOpen={true}
      // value={value}
      inputId={id}
      closeMenuOnSelect={true}
      defaultValue={4}
      className="basic-single-select"
      classNamePrefix="Select Status"
      styles={customStyles}
      isDisabled={props.disabled}
      isSearchable={true}
      placeholder={placeholder || "placeholder"}
      options={optionCopy}
      onChange={(option: any) => onChangeOption(option, name)}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  )
})

export default SingleSelect
