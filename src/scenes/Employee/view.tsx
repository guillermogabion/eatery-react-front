
  
  interface Props {
    employee: Employee;
  }
  
  const ViewEmployee = ({ employee }: Props) => {
    return (
        
      <div className="container">
        <div className="row">
            <div className="col">
                <p>Last Name: {employee.lastName}</p>
                <p>First Name: {employee.firstName}</p>
                <p>Middle Name: {employee.middleName}</p>
                <p>Birth Date: {employee.birthDay}</p> 
                <p>Gender: {employee.gender}</p>
                <p>Civil Status: {employee.civilStatus}</p>
                <p>Contact Number: {employee.contactNumber}</p>
                <p>Email Address: {employee.emailAddress}</p>
                <p>PRC License Number: {employee.prclicenseNo}</p>
                <p>Passport Number: {employee.passportNo}</p>
                <p>User Role: {employee.userLevel}</p>
                <p>Squad: {employee.squad}</p>
            </div>
            <div className="col">
                <p><b>Emergency Contact Information</b></p>
                <p>Contact Name:  {employee.emergencyContactName}</p>
                <p>Contact Number:  {employee.emergencyContactNo}</p>
                <p>Contact Address:  {employee.emergencyContactAddress}</p>
                <p>Contact Relationship:  {employee.emergencyContactRelationship}</p>
                <p> <b> Employment Information </b></p>
                <p>Employee ID :  {employee.employeeId}</p>
                <p>Biometrics ID :  {employee.biometricsId}</p>
                <p>Company Email :  {employee.companyEmail}</p>
                <p>Employee Type :  {employee.employeeType}</p>
                <p>Job Title :  {employee.jobTitle}</p>
            </div>
           
        </div>
      </div>
    );
  };
  
  export default ViewEmployee;
  