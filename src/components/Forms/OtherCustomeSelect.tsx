import React, { FC, useState } from "react"
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
    isOther?: any,
    setFieldValue?: any,
    setIsDisableOther?:any
}


const OtherCustomeSelect: FC<RSelectInterface> = (props) => {
    const { placeholder, type, options = [], onChangeOption, name, value = null, setFieldValue, setIsDisableOther,textLength } = props;
    const [optionFilter, setOptionFilter] = useState([])

    const optionArr = [...options];

    const onChanged = (e: any) => {

        const { name, value } = e.target;
        setFieldValue('accountName',value);

        setFieldValue("cifNumber", "")
        setFieldValue("storeCode", "")
        setFieldValue("accountNumber", null)
        setFieldValue("pickupLocation", null)
        setFieldValue("additionalFees", "")

        if(value){
            const filtered: any = optionArr.filter(d => d.accountName.includes(value));
            if (filtered.length) {
                setOptionFilter(filtered)
            } else {
                setOptionFilter([])
            }
        }
        else {
            setOptionFilter([])
        }
      

    }
    return <div style={{ position: 'relative' }}>
        {
            textLength ?
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    onChanged(e)
                    setIsDisableOther(false)
                }}
                name={name}
                maxLength={textLength}
                type="text"
                className="formControl"
            />
            :
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    onChanged(e)
                    setIsDisableOther(false)
                }}
                name={name}
                type="text"
                className="formControl"
            />

        }
        

       {optionFilter.length ? <ul className="otherList">
            {optionFilter.map((d:any) => {
                const { accountName, accountNumber, cifNumber, id, pickupLocation, requirementRate, storeCode } = d
                return <li onClick={() => {
                    onChangeOption(d)
                    setIsDisableOther(true)
                    setFieldValue('accountName', accountName)
                    setOptionFilter([])
                }}>{`${accountName} - ${pickupLocation}`}</li>
            })}
        </ul> : null}
    </div>
}

export default React.memo(OtherCustomeSelect)
