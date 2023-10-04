import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import makeAnimated from "react-select/animated";
import MySelect from "./MySelect";
import { components } from "react-select";

const Option = (props: any) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label className="text-[17px] ml-3">{props.label}</label>
            </components.Option>
        </div>
    );
};

const MultiValue = (props: any) => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const animatedComponents = makeAnimated();
const MultiSelectOption = (props: any) => {
    const { id = "multiselect_maindropdown", options = []} = props
    const [optionSelected, setOptionSelected] = useState<any>([]);

    const handleChange = (selected: any) => {
        let tempArray:any = []
        selected.forEach((data:any, index:any) => {
            tempArray.push(data.value)
        });
        props.selectedOptions([...tempArray])
        setOptionSelected(selected)
    };

    return (
        <MySelect
            id={id}
            options={options}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option, MultiValue, animatedComponents }}
            onChange={handleChange}
            allowSelectAll={true}
            value={optionSelected}
        />
    );
}

export default MultiSelectOption

