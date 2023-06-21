import { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../api"
import { async } from "validate.js";

interface Employee {
  value: string;
  label: string;
}

const EmployeeCheckbox = (props: any) => {
  const { value = [], onChange, name, placeholder = "", styles, squad, withEmployeeID = false } = props;
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
       RequestAPI.getRequest(
        `${Api.employeeList}`,
        "",
        {},
        {},
        async (res: any) => {
            const { status, body = { data: {}, error: {}}} : any = res
            if (status === 200 && body) {
                if(body.error && body.error.message) {
                
                }else {
                    let tempArray: any = []
                    body.data.forEach((d: any, i : any)=> {
                        if (withEmployeeID) {
                            tempArray.push({
                                value: d.userAccountId,
                                label: d.firstname = " " + d.lastname + ` - ${d.employeeId ? d.employeeId : ""}`
                            })
                        }else{
                            tempArray.push({
                                value : d.userAccountId,
                                label: d.firstname + " " + d.lastname
                            })
                        }
                    });
                    setEmployeeList(tempArray)
                }
            }
        }
       )
      } catch (error) {
        // Handle error here
      }
    };
  },[])
  return (
    <div>
      {employeeList.map((employee) => (
        <div key={employee.value} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`employeeCheckbox_${employee.value}`}
            value={employee.value}
            checked={value.includes(employee.value)}
            onChange={() => handleCheckboxChange(employee.value)}
          />
          <label className="form-check-label" htmlFor={`employeeCheckbox_${employee.value}`}>
            {employee.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default EmployeeCheckbox;
