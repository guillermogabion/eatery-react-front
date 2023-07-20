
  
  interface Props {
    employee: Employee;
  }
  
  const ViewEmployee = ({ employee }: Props) => {
    return (
        
      <div className="container">
        <div className="row">
            <div className="col">
                <p id="employee_lastname_viewp">Last Name: {employee.lastName}</p>
                <p id="employee_firstnamename_viewp">First Name: {employee.firstName}</p>
                <p id="employee_middlename_viewp">Middle Name: {employee.middleName}</p>
                <p id="employee_birthdate_viewp">Birth Date: {employee.birthDay}</p> 
                <p id="employee_gender_viewp">Gender: {employee.gender}</p>
                <p id="employee_civilstatus_viewp">Civil Status: {employee.civilStatus}</p>
                <p id="employee_contactnumber_viewp">Contact Number: {employee.contactNumber}</p>
                <p id="employee_emailaddress_viewp">Email Address: {employee.emailAddress}</p>
                <p id="employee_prclicensenum_viewp">PRC License Number: {employee.prclicenseNo}</p>
                <p id="employee_passportnum_viewp">Passport Number: {employee.passportNo}</p>
                <p id="employee_userlevel_viewp">User Role: {employee.userLevel}</p>
                <p id="employee_squad_viewp">Squad: {employee.squad}</p>
            </div>
            <div className="col">
                <p><b>Emergency Contact Information</b></p>
                <p id="employee_emergencycontactname_viewp">Contact Name:  {employee.emergencyContactName}</p>
                <p id="employee_emergencycontactnumber_viewp">Contact Number:  {employee.emergencyContactNo}</p>
                <p id="employee_emergencycontactaddress_viewp">Contact Address:  {employee.emergencyContactAddress}</p>
                <p id="employee_emergencycontactrelationship_viewp">Contact Relationship:  {employee.emergencyContactRelationship}</p>
                <p> <b> Employment Information </b></p>
                <p id="employee_employeeid_viewp">Employee ID :  {employee.employeeId}</p>
                <p id="employee_biometricsid_viewp">Biometrics ID :  {employee.biometricsId}</p>
                <p id="employee_companyemail_viewp">Company Email :  {employee.companyEmail}</p>
                <p id="employee_employeetype_viewp">Employee Type :  {employee.employeeType}</p>
                <p id="employee_jobtitle_viewp">Job Title :  {employee.jobTitle}</p>
                <p id="employee_username_viewp">Username :  {employee.username}</p>
            </div>
           
        </div>
      </div>
    );
  };
  
  export default ViewEmployee;
  