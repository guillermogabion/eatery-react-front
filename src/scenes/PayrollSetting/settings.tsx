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
    const [isEdit, setIsEdit] = React.useState(false);

    const [initialValues, setInitialValues] = useState<any>({
        "workingDaysPerYear": 0,
        "workingDaysPerMonth": 0,
        "workingDaysPerWeek": 0,
        "workingHoursPerDay": 0,
        "thirteenthMonthReleased": true
    })

    useEffect(() => {
        getWorkingCalender()
    }, [])

    const getWorkingCalender = () => {
        RequestAPI.getRequest(
            `${Api.workingCalendarInfo}`,
            "",
            {},
            {},
            async (res: any) => {

                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        setInitialValues(body.data)
                    }
                }
            }
        )
    }

    const formRef: any = useRef()
    return (
        <div>
            <div className="w-100 pt-5 mt-3">
                <Formik
                    innerRef={formRef}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={
                        Yup.object().shape({
                            workingDaysPerYear: Yup.string().required("Working days per year is required !"),
                            workingDaysPerMonth: Yup.string().required("Working days per month is required !"),
                            workingDaysPerWeek: Yup.string().required("Working days per week is required !"),
                            workingHoursPerDay: Yup.string().required("Working hours per day is required !"),
                            thirteenthMonthReleased: Yup.string().required("Thirteen month release is required !"),
                        })
                    }
                    onSubmit={(values, actions) => {
                        if (isEdit) {
                            RequestAPI.postRequest(Api.updateWorkingCalendar, "", values, {}, async (res: any) => {
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
                                    }
                                } else {
                                    ErrorSwal.fire(
                                        'Error!',
                                        'Something Error.',
                                        'error'
                                    )
                                }
                            })
                        }

                        setIsEdit(!isEdit)
                    }}>
                    {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                        return (
                            <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                <div className="fieldtext w-full row flex items-center justify-center m-0 p-0">
                                    <div className="row m-0 p-0 col-md-4">
                                        <div className="col-md-12">
                                            <label>Days of Year</label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    className="formControl py-3 mr-5"
                                                    name="workingDaysPerYear"
                                                    id="workingDaysPerYear"
                                                    disabled={!isEdit}
                                                    value={values.workingDaysPerYear}
                                                    onChange={(e) => setFieldValue('workingDaysPerYear', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label>Days of Month</label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    className="formControl py-3 mr-5"
                                                    name="workingDaysPerMonth"
                                                    id="workingDaysPerMonth"
                                                    disabled={!isEdit}
                                                    value={values.workingDaysPerMonth}
                                                    onChange={(e) => setFieldValue('workingDaysPerMonth', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label>Days of Week</label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    className="formControl py-3 mr-5"
                                                    name="workingDaysPerWeek"
                                                    id="workingDaysPerWeek"
                                                    disabled={!isEdit}
                                                    value={values.workingDaysPerWeek}
                                                    onChange={(e) => setFieldValue('workingDaysPerWeek', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label>Hours Per Day</label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    className="formControl py-3 mr-5"
                                                    name="workingHoursPerDay"
                                                    id="workingHoursPerDay"
                                                    disabled={!isEdit}
                                                    value={values.workingHoursPerDay}
                                                    onChange={(e) => setFieldValue('workingHoursPerDay', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <div className="flex items-center">
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="custom-switch"
                                                    disabled={!isEdit}
                                                    checked={values.thirteenthMonthReleased}
                                                    onChange={(e) => {
                                                        setFieldValue('thirteenthMonthReleased', e.target.checked)
                                                    }}
                                                    style={{ fontSize: 18 }}
                                                />

                                                <label className="mb-1" style={{ fontSize: 15 }} htmlFor="custom-switch">13th Month Release</label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center w-100 m-0 p-0 mt-4">
                                            <Button
                                                type="submit"
                                                className="btn btn-primary w-[150px]">
                                                {!isEdit ? "Edit" : "Submit"}
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>


            </div>
        </div>
    );


}

export default Settings;
