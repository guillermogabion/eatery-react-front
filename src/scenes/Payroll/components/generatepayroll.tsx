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
    const [isDownloadingPayrollRegister, setIsDownloadingPayrollRegister] = useState<any>(false)
    const [isDownloadBankTrans, setIsDownloadBankTrans] = useState<any>(false)
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

    const generatePayroll = (isRegenerate: any = false) => {
        setIsSubmit(true)
        const valuesObj: any = { ...props.payrollData }
        let userIds: any = []
        const tempArray: any = [...employeeList]
        tempArray.forEach((data: any, index: any) => {
            if (data.isCheck) {
                userIds.push(data.userAccountId)
            }
        });
        valuesObj.payrollId = payrollData.id
        valuesObj.userIds = userIds
        let endpoint = Api.generatePayroll
        if (isRegenerate) {
            endpoint = Api.reGeneratePayroll
        }
        RequestAPI.postRequest(
            endpoint,
            "",
            valuesObj,
            {},
            async (res) => {
                const { status, body = { data: {}, error: {} } } = res;
                setIsSubmit(false)
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
        setIsDownloadingPayrollRegister(true)
        RequestAPI.getFileAsync(
            `${Api.downloadPayrollRegister}?Id=${payroll.id}`,
            "",
            "PayrollRegister.xlsx",
            async (res: any) => {
                if (res) {
                    setIsDownloadingPayrollRegister(false)
                }
            }
        )
    }

    const downloadBankTransmittal = () => {
        setIsDownloadBankTrans(true)
        RequestAPI.getFileAsync(
            `${Api.downloadBankUpload}?Id=${payroll.id}`,
            "",
            "BankUpload.txt",
            async (res: any) => {
                if (res) {
                    setIsDownloadBankTrans(false)
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
                    payroll.isUpdate ?
                        <Button
                            onClick={() => {
                                generatePayroll(true)
                            }}
                            className="btn btn-primary mr-3">
                            {isSubmit ?
                                <div className="d-flex justify-content-center">
                                    <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                    Regenerating Payroll
                                </div>
                                : "Regenerate Payroll"
                            }

                        </Button> :
                        <Button
                            onClick={() => {
                                generatePayroll(false)
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
                    payroll.isUpdate ?
                        <>
                            <Button
                                onClick={() => {
                                    downloadPayrollRegister()
                                }}
                                disabled={isDownloadingPayrollRegister}
                                className="btn btn-primary mr-3">
                                {isDownloadingPayrollRegister ?
                                    <div className="d-flex justify-content-center">
                                        <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                        Downloading Payroll Register
                                    </div>
                                    : "Download Payroll Register"
                                }

                            </Button>

                            <Button
                                onClick={() => {
                                    downloadBankTransmittal()
                                }}
                                disabled={isDownloadBankTrans}
                                className="btn btn-primary mr-3">
                                {isDownloadBankTrans ?
                                    <div className="d-flex justify-content-center">
                                        <span className="spinner-border spinner-border-sm mx-1 mt-1" role="status" aria-hidden="true"> </span>
                                        Downloading for Bank Transmittal
                                    </div>
                                    : "Download for Bank Transmittal"
                                }

                            </Button>
                        </> :
                        null
                }

            </div>
        </div>);
}