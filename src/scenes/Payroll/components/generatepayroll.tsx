import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, RequestAPI } from "../../../api";
import SingleSelect from "../../../components/Forms/SingleSelect";
import { Button, Form, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Utility } from "../../../utils";
import EmployeeDropdown from "../../../components/EmployeeDropdown";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)

export default function GeneratePayroll(props: any) {
    const { payrollData } = props
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [employeeList, setEmployeeList] = useState<any>([])
    const [isSubmit, setIsSubmit] = useState<any>(false)
    const payroll = { ...payrollData }

    useEffect(() => {
        RequestAPI.getRequest(
            `${Api.employeeList}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray = [...body.data]
                        tempArray.forEach((d: any, i: any) => {
                            d.isCheck = false
                        });
                        setEmployeeList(tempArray)
                    }
                }
            }
        )
    }, [])

    const selectAllEmployees = (boolCheck: any) => {
        const valuesObj: any = [...employeeList]
        valuesObj.forEach((data: any, index: any) => {
            data.isCheck = boolCheck
        });
        setEmployeeList([...valuesObj])
    }

    const onChangeCheckbox = (index: any, boolCheck: any) => {
        const valuesObj: any = [...employeeList]
        valuesObj[index].isCheck = boolCheck
        setEmployeeList([...valuesObj])
    }

    const generatePayroll = () => {
        const valuesObj: any = { ...props.payrollData }
        let userIds: any = []
        const tempArray: any = [...employeeList]
        tempArray.forEach((data: any, index: any) => {
            if (data.isCheck) {
                userIds.push(data.userAccountId)
            }
        });
        valuesObj.userIds = userIds
        RequestAPI.postRequest(
            Api.generatePayroll,
            "",
            valuesObj,
            {},
            async (res) => {
                const { status, body = { data: {}, error: {} } } = res;
                if (status === 200 || status === 201) {
                    if (body.error && body.error.message) {
                        ErrorSwal.fire(
                            "Error!",
                            body.error.message || "",
                            "error"
                        );
                    } else {
                        ErrorSwal.fire(
                            "Success",
                            body.data || "",
                            "success"
                        ).then((result) => {
                            if (result.isConfirmed) {
                                location.reload()
                            }
                        });
                    }
                } else {
                    ErrorSwal.fire("Error!", "Something Error.", "error");
                }
            }
        );
    }

    const downloadPayrollRegister = () => {
        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.downloadPayrollRegister}?Id=${payroll.id}`,
            "",
            "PayrollRegister.xlsx",
            async (res: any) => {
                if (res) {
                    setIsSubmit(false)
                }
            }
        )
    }

    const downloadBankTransmittal = () => {
        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.downloadBankUpload}?Id=${payroll.id}`,
            "",
            "BankUpload.txt",
            async (res: any) => {
                if (res) {
                    setIsSubmit(false)
                }
            }
        )
    }


    return (
        <div className="p-0 m-0">
            <div className="px-3 h-[60vh] overflow-auto">
                <Table>
                    <thead>
                        <tr>
                            <th style={{ width: 10 }}>
                                <Form.Check
                                    type="checkbox"
                                    id="Select All"
                                    label="Select All"
                                    onChange={(e) => {
                                        selectAllEmployees(e.target.checked)
                                    }}
                                />
                            </th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employeeList &&
                                employeeList.length > 0 ?
                                <>
                                    {
                                        employeeList.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            label=""
                                                            checked={item.isCheck}
                                                            onChange={(e) => {
                                                                onChangeCheckbox(index, e.target.checked)
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{item.employeeId}</td>
                                                    <td>{item.firstname} {item.lastname}</td>
                                                </tr>
                                            )
                                        })
                                    }

                                </>
                                :
                                null
                        }
                    </tbody>

                </Table>
                {
                    employeeList &&
                        employeeList.length == 0 ?
                        <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                }
            </div>
            <div className="px-3 mt-5 flex">
                {
                    payroll.id ?
                        <Button
                            onClick={() => {

                            }}
                            className="btn btn-primary mr-3"
                            disabled={true}>
                            Regenerate Payroll
                        </Button> :
                        <Button
                            onClick={() => {
                                generatePayroll()
                            }}
                            className="btn btn-primary mr-3"
                            disabled={isSubmit}>
                            {isSubmit ?
                                <div className="d-flex justify-content-center">
                                    <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                    Generating Payroll
                                </div>
                                : "Generate Payroll"
                            }
                        </Button>
                }

                {
                    payroll.id ?
                        <>
                            <Button
                                onClick={() => {
                                    downloadPayrollRegister()
                                }}
                                className="btn btn-primary mr-3">
                                Download Payroll Register
                            </Button>

                            <Button
                                onClick={() => {
                                    downloadBankTransmittal()
                                }}
                                className="btn btn-primary mr-3">
                                Download for Bank Transmittal
                            </Button>
                        </> :
                        null
                }

            </div>
        </div>);
}