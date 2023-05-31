import { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../api";
import SingleSelect from "../Forms/SingleSelect";

const EmployeeDropdown = (props: any) => {
    const { value = "", singleChangeOption, name, placeholder = "", styles, squad, withEmployeeID = false } = props
    const [employeeList, setEmployeeList] = useState<any>([]);

    useEffect(() => {
        if (squad) {
            RequestAPI.getRequest(
                `${Api.squadEmployeeList}`,
                "",
                {},
                {},
                async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 && body) {
                        if (body.error && body.error.message) {
                        } else {
                            let tempArray: any = []
                            body.data.forEach((d: any, i: any) => {
                                if (withEmployeeID){
                                    tempArray.push({
                                        value: d.userAccountId,
                                        label: d.firstname + " " + d.lastname + ` - ${d.employeeId ? d.employeeId: ""}`
                                    })
                                }else{
                                    tempArray.push({
                                        value: d.userAccountId,
                                        label: d.firstname + " " + d.lastname
                                    })
                                }
                            });
                            setEmployeeList(tempArray)
                        }
                    }
                }
            )
        } else {
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
                            let tempArray: any = []
                            body.data.forEach((d: any, i: any) => {
                                if (withEmployeeID){
                                    tempArray.push({
                                        value: d.userAccountId,
                                        label: d.firstname + " " + d.lastname + ` - ${d.employeeId ? d.employeeId: ""}`
                                    })
                                }else{
                                    tempArray.push({
                                        value: d.userAccountId,
                                        label: d.firstname + " " + d.lastname
                                    })
                                }
                            });
                            setEmployeeList(tempArray)
                        }
                    }
                }
            )
        }

    }, [])

    return <SingleSelect
        type="string"
        options={employeeList || []}
        placeholder={placeholder}
        onChangeOption={singleChangeOption}
        name={name}
        value={value}
        styles={styles}
        isClearable={true}
    />
}

export default EmployeeDropdown
