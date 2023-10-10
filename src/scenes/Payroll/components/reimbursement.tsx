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
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
const ErrorSwal = withReactContent(Swal)

export default function Reimbursement(props: any) {
    const { payrollData } = props
    const [reimbursementList, setReimbursementList] = useState<any>([])
    const [isSelectAll, setIsSelectAll] = useState<any>(false)
    const [reimbursementIds, setReimbursementIds] = React.useState(props.reimbursementIds || []);
    const payroll = { ...payrollData }

    useEffect(() => {
        RequestAPI.getRequest(
            `${Api.getAllReimbursement}?size=2000&page=0&sort=id&sortDir=desc&status=Approved`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray = [...body.data.content]
                        tempArray.forEach((d: any, i: any) => {
                            d.isCheck = false
                        });
                        setReimbursementList(tempArray)
                    }
                }
            }
        )
    }, [])

    const selectAllReimbursement = (boolCheck: any) => {
        const valuesObj: any = [...reimbursementList]
        let idList: any = []
        valuesObj.forEach((data: any, index: any) => {
            if (boolCheck) {
                idList.push(data.id)
            }
            data.isCheck = boolCheck
        });
        setReimbursementList([...valuesObj])
        setReimbursementIds([...idList])
        props.setReimbursementIds([...idList])
    }

    const onChangeCheckbox = (index: any, boolCheck: any) => {
        const valuesObj: any = [...reimbursementList]
        valuesObj[index].isCheck = boolCheck
        setReimbursementList([...valuesObj])

        let array: any = [...reimbursementIds];
        let searchValue: any = valuesObj[index].id;
        let idIndex: any = array.indexOf(searchValue);

        if (idIndex !== -1) {
            array.splice(idIndex, 1);
        } else {
            array.push(searchValue);
        }

        setReimbursementIds([...array])
        props.setReimbursementIds([...array])
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
                                    checked={isSelectAll}
                                    onChange={(e) => {
                                        setIsSelectAll(e.target.checked)
                                        selectAllReimbursement(e.target.checked)
                                    }}
                                />
                            </th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody className="custom-row">
                        {
                            reimbursementList &&
                                reimbursementList.length > 0 ?
                                <>
                                    {
                                        reimbursementList.map((item: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <Form.Check
                                                            id="payrollgenerate_ischeck_employeelistdata3"
                                                            type="checkbox"
                                                            label=""
                                                            checked={props.reimbursementIds.includes(item.id)}
                                                            onChange={(e) => {
                                                                onChangeCheckbox(index, e.target.checked)
                                                            }}
                                                        />
                                                    </td>
                                                    <td id="payrollgenerate_employeeid_employeelistdata">{item.employeeId}</td>
                                                    <td id="payrollgenerate_name_employeelistdata">{item.firstName} {item.lastName}</td>
                                                    <td id="payrollamount_employeelistdata">{Utility.formatToCurrency(item.total)}</td>
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
                    reimbursementList &&
                        reimbursementList.length == 0 ?
                        <div className="w-100 text-center">
                            <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                }
            </div>
        </div>);
}