import { useState } from "react"
import DayPickerInput from 'react-day-picker/DayPickerInput';
import "react-day-picker/lib/style.css"
import DatePickerIcon from "../components/Icons/DatePickerIcon"
import { DateUtils } from "react-day-picker"
import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"

function parseDate(str: any, format: any, locale: any) {
  const parsed = dateFnsParse(str, format, new Date(), { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

function formatDate(date: any, format: any, locale: any) {
  return dateFnsFormat(date, format, { locale })
}

const CustomDatePicker = (props: any) => {
  const {
    handleDayChange,
    placeholder = "",
    maxDate = "",
    minDate = "",
    disabled = false,
    value = null,
    maxYear = 0,
    minYear = 0,
    error = false,
    format,
  } = props

  const currentYear = new Date().getFullYear()
  const fromMonth = new Date(currentYear - minYear, 0)
  const toMonth = new Date(currentYear + maxYear, 11)

  const YearMonthForm = ({ date, localeUtils, onChange }: any) => {
    const months = localeUtils.getMonths()

    const years = []
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
      years.push(i)
    }

    const handleChange = (e: any) => {
      const { year, month } = e.target.form
      onChange(new Date(year.value, month.value))
    }

    return (
      <form className="DayPicker-Caption">
        <select name="month" onChange={handleChange} value={date.getMonth()}>
          {months.map((month: any, i: any) => (
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </select>
        <select name="year" onChange={handleChange} value={date.getFullYear()}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </form>
    )
  }
  const [month, setMonth] = useState(new Date())

  const handleYearMonthChange = (month: any) => setMonth(month)

  const dayPickerPropsObj: any = {
    className: props.inputClassNames,
    disabledDays: {},
    fixedWeeks: true,
    month: month,
    onMonthChange: handleYearMonthChange,
    captionElement: ({ date, localeUtils }: any) =>
      YearMonthForm({ date, localeUtils, onChange: handleYearMonthChange }),
  }

  if (maxDate) {
    dayPickerPropsObj.disabledDays.after = maxDate
  }

  if (minDate) {
    dayPickerPropsObj.disabledDays.before = minDate
  }

  return (
    <DayPickerInput
      onDayChange={handleDayChange}
      placeholder={placeholder}
      format={format || "dd/MM/yyyy"}
      formatDate={formatDate}
      value={value}
      component={(props: any) => {
        return (
          <div style={{ position: "relative", zIndex: 10 }}>
            <input
              {...props}
              className={`dateInput_calander ${error ? "dateInput_calander_error" : ""}`}
              disabled={disabled}
            />
            <div style={{ position: "absolute", right: "14px", top: "9px", zIndex: -2 }}>
              <DatePickerIcon />
            </div>
          </div>
        )
      }}
      parseDate={parseDate}
      dayPickerProps={dayPickerPropsObj}
    />
  )
}

export default CustomDatePicker
