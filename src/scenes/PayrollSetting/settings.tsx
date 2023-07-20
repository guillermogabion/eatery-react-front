import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import TimeDate from "../../components/TimeDate"
import { Formik } from "formik"
import { User } from "../User"
import { async } from "validate.js"
import * as Yup from "yup"
import { Utility } from "../../utils"

const ErrorSwal = withReactContent(Swal)


const Settings = (props: any) => {
    const [daysPerYear, setDaysPerYear] = React.useState("");
    const [editDaysPerYear, setEditDaysPerYear] = React.useState(false);

    const [daysPerMonth, setDaysPerMonth] = React.useState("");
    const [editDaysPerMonth, setEditDaysPerMonth] = React.useState(false);

    const [daysPerWeek, setDaysPerWeek] = React.useState("");
    const [editDaysPerWeek, setEditDaysPerWeek] = React.useState(false);

    const [hourPerDay, setHourPerDay] = React.useState("");
    const [editHourPerDay, setEditHourPerDay] = React.useState(false);

    useEffect(() => {
        getDaysOfYear()
        getDaysPerMonth()
        getDaysPerWeek()
        getHourPerDay()
    }, [])

    const getDaysOfYear = () => {
        RequestAPI.getRequest(
            `${Api.getDaysPerYear}`,
            "",
            {},
            {},
            async (res: any) => {

                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setDaysPerYear(body.data.days)
                    }
                }
            }
        )
    }

    const saveDaysOfYear = (edit: any = 0) => {
        if (edit){
            
            RequestAPI.postRequest(Api.updateDaysPerYear, "", { "days": daysPerYear }, {}, async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                        ErrorSwal.fire(
                            'Error!',
                            (body.error && body.error.message) || "",
                            'error'
                        )
                    } else {
                        ErrorSwal.fire(
                            'Success!',
                            (body.data) || "",
                            'success'
                        )
                        setEditDaysPerYear(false)
                    }
                } else {
                    ErrorSwal.fire(
                        'Error!',
                        'Something Error.',
                        'error'
                    )
                }
            })
        }else{
            setEditDaysPerYear(true)
        }
    }

    const getDaysPerMonth = () => {
        RequestAPI.getRequest(
            `${Api.getDaysPerMonth}`,
            "",
            {},
            {},
            async (res: any) => {

                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setDaysPerMonth(body.data.days)
                    }
                }
            }
        )
    }

    const saveDaysOfMonth = (edit: any = 0) => {
        if (edit){
            
            RequestAPI.postRequest(Api.updateDaysPerMonth, "", { "days": daysPerMonth }, {}, async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                        ErrorSwal.fire(
                            'Error!',
                            (body.error && body.error.message) || "",
                            'error'
                        )
                    } else {
                        ErrorSwal.fire(
                            'Success!',
                            (body.data) || "",
                            'success'
                        )
                        setEditDaysPerMonth(false)
                    }
                } else {
                    ErrorSwal.fire(
                        'Error!',
                        'Something Error.',
                        'error'
                    )
                }
            })
        }else{
            setEditDaysPerMonth(true)
        }
    }

    const getDaysPerWeek = () => {
        RequestAPI.getRequest(
            `${Api.getDaysPerWeek}`,
            "",
            {},
            {},
            async (res: any) => {

                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setDaysPerWeek(body.data.days)
                    }
                }
            }
        )
    }

    const saveDaysOfWeek = (edit: any = 0) => {
        if (edit){
            
            RequestAPI.postRequest(Api.updateDaysPerWeek, "", { "days": daysPerWeek }, {}, async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                        ErrorSwal.fire(
                            'Error!',
                            (body.error && body.error.message) || "",
                            'error'
                        )
                    } else {
                        ErrorSwal.fire(
                            'Success!',
                            (body.data) || "",
                            'success'
                        )
                        setEditDaysPerWeek(false)
                    }
                } else {
                    ErrorSwal.fire(
                        'Error!',
                        'Something Error.',
                        'error'
                    )
                }
            })
        }else{
            setEditDaysPerWeek(true)
        }
    }

    const getHourPerDay = () => {
        RequestAPI.getRequest(
            `${Api.getHourPerDay}`,
            "",
            {},
            {},
            async (res: any) => {

                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setHourPerDay(body.data.hours)
                    }
                }
            }
        )
    }

    const saveHourPerDay = (edit: any = 0) => {
        if (edit){
            
            RequestAPI.postRequest(Api.updateHourPerDay, "", { "hours": hourPerDay }, {}, async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                        ErrorSwal.fire(
                            'Error!',
                            (body.error && body.error.message) || "",
                            'error'
                        )
                    } else {
                        ErrorSwal.fire(
                            'Success!',
                            (body.data) || "",
                            'success'
                        )
                        setEditHourPerDay(false)
                    }
                } else {
                    ErrorSwal.fire(
                        'Error!',
                        'Something Error.',
                        'error'
                    )
                }
            })
        }else{
            setEditHourPerDay(true)
        }
    }

    return (
        <div>
            <div className="w-100 pt-5 mt-3">
                <div className="fieldtext row flex items-center justify-center m-0 p-0">
                    <div className="row m-0 p-0 col-md-6">
                        <div className="col-md-12">
                            <label>Days of Year</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="formControl py-3 mr-5"
                                    name="name"
                                    id="type"
                                    disabled={!editDaysPerYear}
                                    value={daysPerYear}
                                    onChange={(e) => setDaysPerYear(e.target.value)}
                                />
                                <Button
                                    id="payrollsettingsettings_savedaysofyear_btn"
                                    className="w-[200px] h-auto"
                                    onClick={() => {
                                        saveDaysOfYear(editDaysPerYear)
                                    }}>
                                    {editDaysPerYear ? "Save" : "Edit"}
                                </Button>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label>Days of Month</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="formControl py-3 mr-5"
                                    name="name"
                                    id="type"
                                    disabled={!editDaysPerMonth}
                                    value={daysPerMonth}
                                    onChange={(e) => setDaysPerMonth(e.target.value)}
                                />
                                <Button
                                    id="payrollsettingsettings_savedaysofmonth_btn"
                                    className="w-[200px] h-auto"
                                    onClick={() => {
                                        saveDaysOfMonth(editDaysPerMonth)
                                    }}>
                                    {editDaysPerMonth ? "Save" : "Edit"}
                                </Button>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label>Days of Week</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="formControl py-3 mr-5"
                                    name="name"
                                    id="type"
                                    disabled={!editDaysPerWeek}
                                    value={daysPerWeek}
                                    onChange={(e) => setDaysPerWeek(e.target.value)}
                                />
                                <Button
                                    id="payrollsettingsettings_savedaysperweek_btn"
                                    className="w-[200px] h-auto"
                                    onClick={() => {
                                        saveDaysOfWeek(editDaysPerWeek)
                                    }}>
                                    {editDaysPerWeek ? "Save" : "Edit"}
                                </Button>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label>Hours Per Day</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="formControl py-3 mr-5"
                                    name="name"
                                    id="type"
                                    disabled={!editHourPerDay}
                                    value={hourPerDay}
                                    onChange={(e) => setHourPerDay(e.target.value)}
                                />
                                <Button
                                    id="payrollsettingsettings_savehourperday_btn"
                                    className="w-[200px] h-auto"
                                    onClick={() => {
                                        saveHourPerDay(editHourPerDay)
                                    }}>
                                    {editHourPerDay ? "Save" : "Edit"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default Settings;
