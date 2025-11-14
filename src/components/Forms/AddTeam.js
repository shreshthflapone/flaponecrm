import React, { useState, useRef, useEffect } from "react";
import SingleDropdown from "../SingleDropdown";
import { MuiChipsInput } from "mui-chips-input";
import MultiselectDropdown from "../MultiSelectDropdown";
import SearchMultiDropdown from "../../components/SearchMultiSelectDropdown";
import { FaLeaf } from "react-icons/fa";

const AddTeam = ({ onClose, editedMember ,roleOptions ,departmentOptions ,managerOptions ,locationOptions ,onSubmit}) => {
  const [email, setEmail] = useState([]);
  const [department, SetDepartment] = useState("");
  const [role, setRole] = useState("");
  const [manager, setManager] = useState("");
  const [designation, setDesignation] = useState("");
  const [instructorAsUser, setInstructorAsUser] = useState("");
  const [location, setLocation] = useState([]);
 
  const [errorStatus, setErrorStatus] = useState(false);
  const [formErrors, setFormErrors] = useState(false);
  const [errorMsgEmail, setErrorMsgEmail] = useState("");
  const [errorMsgRole, setErrorMsgRole] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isEmailInputDisabled = !!editedMember;
  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  useEffect(() => {
    if (editedMember) {

      if(editedMember.location){
      const foundLocation = editedMember.location.map(location => locationOptions.find(option => option.value === location));
      setLocation(foundLocation ||"");
      }

     if(editedMember.role_name){
      setRole(
        roleOptions.find(option => option.label === editedMember.role_name)
        );
      }else{
        setRole(editedMember.role || "");
      }

    if(editedMember.manager){
      setManager(
      managerOptions.find(option => option.value === editedMember.fk_parent_id)
      );
      }else{
        setManager(editedMember.manager || "");
      }

      if(editedMember.department){
      SetDepartment(
        departmentOptions.find(option => option.label === editedMember.department)
        );
      }else{
        SetDepartment(editedMember.department || "");
      }
  
      setDesignation(editedMember.designation || "");
      setInstructorAsUser(editedMember.instructorAsUser || "");
      setEmail(
        editedMember.email
          ? editedMember.email.split(",").map((email) => email.trim())
          : []
      );
    } else {
      setRole("");
      setManager("");
      SetDepartment("");
      setEmail([]);
      setLocation([]);
    }
  }, [editedMember]);


  const validate = (values) => {
    const errors = {};
    errors.email = [];
    errors.role = [];
    errors.department = [];
    errors.manager = [];

    if (!editedMember) {
      if (values.email.length === 0) {
        errors.email.push("Enter email and (press enter ↵  OR  Comma (,) )");
        setErrorStatus(true);
      } else {
	const emailRegex = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,3}$/i;
        //const emailRegex = /^[A-Z0-9._%+-]+@hellotravel.com$/i;
        values.email.forEach((em) => {
          if (!emailRegex.test(em)) {
            setErrorStatus(true);
            errors.email.push("Invalid email: " + em);
          }
        });
      }
    }
    
   
   
    if (values.roles.length !== 0){
      if (values.roles.length === 0 || values.roles === "") {
          errors.role.push("User Role field should not be blank");
          setErrorStatus(true);
        }
      //  if(values.roles.length > 0 && values.roles === "1"){
      //     errors.role.push("Admin Account already exist. Please select another role.");
      //     setErrorStatus(true);
      //   }
      }else{
        errors.role.push("User Role field should not be blank");
        setErrorStatus(true);
     }


     if (values.manager.length !== 0){
      if (values.manager.length === 0 || values.manager === "") {
          errors.manager.push("Manager field should not be blank");
          setErrorStatus(true);
        }
      }else{
        errors.manager.push("Manager field should not be blank");
        setErrorStatus(true);
     }



     if (values.department.length !== 0){
      if (values.department.length === 0 || values.department === "") {
          errors.role.push("Department field should not be blank");
          setErrorStatus(true);
        }
      }else{
        errors.department.push("Department field should not be blank");
        setErrorStatus(true);
     }




    const s = {};
    if (errors.role.length === 0 && errors.email.length === 0  && errors.manager.length === 0 && errors.department.length === 0) {
      s.status = false;
      setErrorStatus(false);
    } else {
      s.status = true;
    }
    s.errors = errors;

    return s;
  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    const emailValues = email.map(obj => obj.value);
    const vrole = role?role.value:"";
    const vDept = department?department.value:"";
    const vMngr = manager?manager.value:"";
    const errors = validate({ email: emailValues, roles: vrole,department: vDept, manager: vMngr });
    setErrorStatus(errors.status);

    if (errors.status == false) {
    const locations = location.map(obj => obj.value);
    const locations_name = location.map(obj => obj.label);
    const selectRole = role?role.value:"";
    const selectDept = department?department.value:"";
    const selectMngr = manager?manager.value:"";
    const selectRolename = role?role.label:"";
    const selectDeptname = department?department.label:"";
    const selectMngrname = manager?manager.label:"";
  
   const newMember = {
     email:emailValues,
     selectRole,
     role,
     selectDept,
     selectMngr,
     selectRolename,
     selectDeptname,
     selectMngrname,
     designation:designation,
     locations:locations,
     locations_name:locations_name,
     instructorAsUser:instructorAsUser
   };
   
 
   if (editedMember) {
    // For editing an existing member
    const updatedMember = {
      ...editedMember,
      ...newMember,
    };
    onSubmit(updatedMember);

  } else {
    onSubmit(newMember);
  }
  onClose();
    }else {
      setFormErrors(errors.errors);
    }
  };

 



  return (
    <>
      <div className="add-team-details">
        <div className="mt16 df fdc h40 ">
          <label className="fc15 fw6 fs14 ls1 mb8">Email Address(es)<span className="fc4">*</span></label>
          {editedMember ? (
            <input
              type="email"
              autoComplete="off"
              value={email}
              className={`${editedMember ? "disabled-input bg6" : ""} brd1 pl12 pt8 pb8 h40 br4`}
              disabled={isEmailInputDisabled}
            />
          ) : (
            <MultiselectDropdown
            options={[]}
            selectedOptions={email}
            onSelectedOptionsChange={handleEmailChange}
            showDropdown={false}
          />
          )}
        </div>
        {formSubmitted && (
                <div className="form-error-messages error mt10 fc4">
                  {Object.keys(formErrors).map((key) => (
                    <div key={key}>
                      {key === "email" &&
                        formErrors[key].map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  ))}
                </div>
              )}

        <div className="mt16">
          <SingleDropdown
            compulsory={<span className="fc4">*</span>}
            label={"Define a Role"}
            options={roleOptions}
            selectedOption={role}
            onSelect={setRole}
          />
        </div>
        {formSubmitted && (
                  <div className="form-error-messages error mt10 fc4">
                    {Object.keys(formErrors).map((key) => (
                      <div key={key}>
                        {key === "role" &&
                          formErrors[key].map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    ))}
                  </div>
                )}

        <div className="mt16 df fdc h40 designation">
          <label className="fc15 fw6 fs14 ls1 mb8">Designation</label>
          <input
            type="text"
            autoComplete="off"
            value={designation}
            onChange={(e)=>setDesignation(e.target.value)}
            className={`brd1 pl12 pt8 pb8 h40 br4 fs14`}
            placeholder="Designation"
          />
        </div>
        <div className="mt16">
          <SingleDropdown
            compulsory={<span className="fc4">*</span>}
            label="Department"
            options={departmentOptions}
            selectedOption={department}
            onSelect={SetDepartment}
          />
        </div>
        {formSubmitted && (
                  <div className="form-error-messages error mt10 fc4">
                    {Object.keys(formErrors).map((key) => (
                      <div key={key}>
                        {key === "department" &&
                          formErrors[key].map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    ))}
                  </div>
                )}

        <div className="mt16">
          <SingleDropdown
            compulsory={<span className="fc4">*</span>}
            label="Manager"
            options={managerOptions}
            selectedOption={manager}
            onSelect={setManager}
          />
        </div>
        {formSubmitted && (
                  <div className="form-error-messages error mt10 fc4">
                    {Object.keys(formErrors).map((key) => (
                      <div key={key}>
                        {key === "manager" &&
                          formErrors[key].map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    ))}
                  </div>
                )}

       <div className="mt16 df fdc h40 fs14">
          <label className="fc15 fw6 fs14 ls1 mb8">Select Work Location</label>
         
             <SearchMultiDropdown
                options={locationOptions}
                selectedOption={location}
                placeholder={"Search Location"}
                onSelectionChange={handleLocationChange}
              /> 
        </div>
        <div className="mt16 df fdc h40 designation">
          <label className="fc15 fw6 fs14 ls1 mb8">Enter User ID</label>
          <input
            type="text"
            autoComplete="off"
             value={instructorAsUser}
            onChange={(e)=>setInstructorAsUser(e.target.value)}
            className={`brd1 pl12 pt8 pb8 h40 br4 fs14`}
            placeholder="Enter user id"
          />
        </div>

      </div>


      <div className="button-container mt32 myteam-filters">
        <button type="button" className="btn-cancel clear" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="update-button btn-blue common-btn"
          onClick={handleSubmit}
        >
          {editedMember ? "Update" : "Invite Team"}
        </button>
      </div>
    </>
  );
};

export default AddTeam;
