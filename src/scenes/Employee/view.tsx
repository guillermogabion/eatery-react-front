interface Employee {
    id: number;
    name: string;
    employeeId: string; // add the employeeId property to the interface
    lastName: string;
    firstName: string;
    middleName: string;

    // other properties
  }
  
  interface Props {
    employee: Employee;
  }
  
  const ViewEmployee = ({ employee }: Props) => {
    return (
        
      <div className="container">
        <div className="row">
            <div className="col">
                <p>Employee ID: {employee.employeeId}</p> {/* display the employeeId */}
                <p>Last Name: {employee.lastName}</p>
                <p>First Name: {employee.firstName}</p>
                <p>Middle Name: {employee.middleName}</p>
            </div>
            <div className="col">
                <p>Employee ID: {employee.employeeId}</p> {/* display the employeeId */}
                <p>Name: {employee.lastName}</p>
                <p>Name: {employee.firstName}</p>
            </div>
           
        </div>
      </div>
    );
  };
  
  export default ViewEmployee;
  