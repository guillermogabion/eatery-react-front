import { FC } from "react"
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
  onChangeOption?: any
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
        backgroundColor: "rgba(216, 216, 216, 0.2)",
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
    border: state.hasValue ? "1px solid #d8d8d8" : "1px solid #d8d8d8",
    borderRadius: "5px",
    font: "normal normal normal 16px/20px Source Sans Pro, sans-serif",
    height: 44,
    zIndex: 1000,
    "&:hover": {
      border: "1px solid #d8d8d8",
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
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = "opacity 300ms"

    return { ...provided, opacity, transition }
  },
  placeholder: (provided: any) => ({
    ...provided,
    whiteSpace: "nowrap",
  }),
}

const CustomSelect: FC<RSelectInterface> = (props) => {
  const { placeholder, type, options = [], onChangeOption, name, value = null } = props
  const optionCopy: any = []
  const optionArr = [...options]
  if (type === "string") {
    optionArr.forEach((d: any) => {
      const optionObj = { value: "", label: "" }
      if (typeof d === "object") {
        const { id } = d
        optionObj.value = name === "status" || name === "transactionType" ? d.name : id
        optionObj.label = d.name
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

  return (
    <Select
      isClearable={true}
      // menuIsOpen={true}
      closeMenuOnSelect={true}
      className="basic-single-select"
      classNamePrefix="Select Status"
      styles={customStyles}
      isSearchable={true}
      placeholder={placeholder || "placeholder"}
      options={optionCopy}
      onChange={(option) => onChangeOption(option, name)}
      components={{
        IndicatorSeparator: () => null,
      }}
      value={value}
    />
  )
}

export default CustomSelect
