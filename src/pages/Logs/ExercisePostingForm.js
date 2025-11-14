import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import { useNavigate } from "react-router-dom";
import MultiDropdown from "../../components/MultiDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "../MyStudents/CommonForm.css";
import InstructorRoaster from "../ClassManagement/InstructorRoaster";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";

const ExercisePostingForm = () => {
  const { id }    = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();

  const [submitLoader,setSubmitLoader] = useState(false);
  const [status, setStatus] = useState("2");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const customDateFormat = "dd/MM/yyyy";
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [durationListOptions, setDurationListOptions] = useState([]);
  const [studentTypeListOptions, setStudentTypeListOptions] = useState([]);
  const [instructorTypeListOptions, setInstructorTypeListOptions] = useState([]);
  const [timeListOptions, setTimeListOptions] = useState([]);
  const [operationalConditionOptions, setOperationalConditionOptions] = useState([]);
  const [studentTraineeAS, setStudentTraineeAS] = useState([]);
  
  const [exerciseFormData, setexerciseFormData] = useState({
    id: id ? id : "",
    exercise_name: "",
    duration: {},
    student: {},
    instructor: {},
    courses: [],
    time: {},
    status: "2",
    exercise_type: {},
    operational_condition: "",
    exercise_mode:"0",
    solo_flying: "0",
    remarks: "",
  });

  // const durationListOptions = [
  //   { value: "5", label: "5" },
  //   { value: "10", label: "10" },
  //   { value: "15", label: "15" },
  //   { value: "20", label: "20" },
  //   { value: "25", label: "25" },
  //   { value: "30", label: "30" },
  //   { value: "35", label: "35" },
  //   { value: "40", label: "40" },
  //   { value: "45", label: "45" },
  //   { value: "50", label: "50" },
  //   { value: "55", label: "55" },
  //   { value: "60", label: "60" },
  // ];
  // const studentTypeListOptions = [
  //   { value: "dual", label: "Dual" },
  //   { value: "rpic", label: "RPIC" }
  // ];
  // const instructorTypeListOptions = [
  //   { value: "dual", label: "Dual" },
  //   { value: "rpic", label: "RPIC" }
  // ];
  // const timeListOptions = [
  //   { value: "day", label: "Day" },
  //   { value: "night", label: "Night" }
  // ];

  // const operationalConditionOptions = [
  //   { value: "basic", label: "Basic" },
  //   { value: "special", label: "Special" },
  //   { value: "advanced", label: "Advanced" },
  // ];
  const handleSelectStatus = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      status: option,
    }));
  };
  const handleStudentType = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      student: option,
    }));
  };
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };
  const handleInstructorTypeSelect = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      instructor: option,
    }));
  };
  useEffect(() => {
    setexerciseFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  }, [status]);
  const handleSelectCategory = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      time: option,
    }));
  };
  const handleSelectOperationalCondition = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      operational_condition: option,
    }));
  };
  const handleSelectStudentTraineeAS = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      exercise_type: option,
    }));
  }
  const handleDuration = (option) => {
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      duration: option,
    }));
  };
  const validateForm = () => {
    if (!exerciseFormData.exercise_name || exerciseFormData.exercise_name.trim() === "") {
      toast.warning("Exercise name is required.");
      return false;
    }
    if (!exerciseFormData.duration?.value) {
      toast.warning("Duration is required.");
      return false;
    }
    if (!exerciseFormData.student?.value) {
      toast.warning("Exercise Type For Student is required.");
      return false;
    }
    if (exerciseFormData.student?.value !== "rpic" && !exerciseFormData.instructor?.value) {
      toast.warning("Exercise Type For Instructor is required.");
      return false;
    }
    if (!exerciseFormData.courses || exerciseFormData.courses.length === 0) {
      toast.warning("At least one course must be selected.");
      return false;
    }
    if (!exerciseFormData.time?.value) {
      toast.warning("Period is required.");
      return false;
    }
    if (!exerciseFormData.operational_condition?.value) {
      toast.warning("Operational condition is required.");
      return false;
    }
    return true;
  }
 
  const openExerciseList = () => {
    navigate("/inventory/exercise");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitLoader(true);
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=addExerciseInventory`,
      headers: { "Auth-Id": user.auth_id },
      data: exerciseFormData
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        toast.success(response.data.data.msg);
	setTimeout(() => {
         openExerciseList();
        }, 1000);
      } else {
        const errors = response.data.data.errorList;
        if (Array.isArray(errors) && errors.length > 0) {
          errors.forEach((err) => {
            toast.warning(err);
          });
        } else {
          toast.warning(response.data.data.msg || "Something went wrong");
        }
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };

  const handleSelectBatteries = (value) => {
    setSelectedCourses((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        updatedValues.push(value);
      } else {
        updatedValues.splice(index, 1);
      }
      setexerciseFormData((prevData) => ({
        ...prevData,
        batteries: updatedValues,
      }));

      return updatedValues;
    });
  };
  const handleSelectCourse = (value) => {
    setCourses((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        updatedValues.push(value);
      } else {
        updatedValues.splice(index, 1);
      }
      setexerciseFormData((prevData) => ({
        ...prevData,
        courses: updatedValues,
      }));

      return updatedValues;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setexerciseFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const openExerciseListPage = () => {
    navigate("/inventory/exercise");
  };
  useEffect(() => {
    setexerciseFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  }, [status]);

  useEffect(() => {
    exercisePostingFilter();
  }, []);
  useEffect(() => {
    if (id) {
      editExerciseFormData(id);
    }
  }, [id]);
  const exercisePostingFilter = async () => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=postingFormFilter`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        setCourseListOptions(response.data.data.courseData);
        setDurationListOptions(response.data.data.durationListOptions);
        setStudentTypeListOptions(response.data.data.studentTypeListOptions);
        setInstructorTypeListOptions(response.data.data.instructorTypeListOptions);
        setTimeListOptions(response.data.data.timeListOptions);
        setOperationalConditionOptions(response.data.data.operationalConditionOptions);
        setStudentTraineeAS(response.data.data.studentTraineeAS);
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  }
  const editExerciseFormData = async (id) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=editExerciseFormData`,
      headers: { "Auth-Id": user.auth_id },
      data: {"id":id}
    }).then(function (response) {
      checkUserLogin(response);
      let responseData = response.data.data;
        if(responseData.status === "1"){
          setexerciseFormData((prevValues) => ({
            ...prevValues,
            ...responseData.data,
          }));
        }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  }; 
  return (
    <>
      <InnerHeader
        heading={id ? "Exercise Edit Form" : "Exercise Add Form"}
        txtSubHeading="Fill in the exercise/training session information including objectives, location, and resources used. This helps us monitor student progress and maintain training logs effectively."
        showButton={true}
        onClick={openExerciseListPage}
        iconText="View List"
      />
      <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
        <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20">
          <div className="form-group-settings cm-fr flx48">
            <p className="fc15 fw6 fs14 ls1">
              Exercise Name<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="exercise_name"
              placeholder="Exercise Name"
              autoComplete="off"
              value={exerciseFormData.exercise_name}
              onChange={handleInputChange}
              readOnly={id !== undefined}
              style={{
                backgroundColor: id !== undefined ? "#f9f9f9" : "",
                cursor: id !== undefined ? "not-allowed" : "",
              }}
            />
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <SingleDropdown
              label="Duration(min)"
              options={durationListOptions}
              selectedOption={exerciseFormData.duration}
              onSelect={handleDuration}
              compulsory={<span className='fc4'>*</span>}
              search
            />
          </div>
          <div className="form-group-settings course-name flx48">
            <SingleDropdown
              label="Exercise Type For Student"
              options={studentTypeListOptions}
              selectedOption={exerciseFormData.student}
              onSelect={handleStudentType}
              compulsory={<span className='fc4'>*</span>}
              placeholder={"Select Exercise Type For Student"}
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="Exercise Type For Instructor"
              options={instructorTypeListOptions}
              selectedOption={exerciseFormData.instructor}
              onSelect={handleInstructorTypeSelect}
              compulsory={
                exerciseFormData.student?.value !== "rpic" ? <span className="fc4">*</span> : null
              }
              placeholder="Select Exercise Type For Instructor"
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <p className="fc15 fw6 fs14 ls1 mb8">Courses<span className='fc4'>*</span></p>
            <MultiDropdown
              label={`Courses`}
              options={courseListOptions}
              selectedValues={exerciseFormData.courses}
              onSelect={handleSelectCourse}
              searchable
              chips="3"
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="Period"
              options={timeListOptions}
              selectedOption={exerciseFormData.time}
              onSelect={handleSelectCategory}
              compulsory={<span className='fc4'>*</span>}
              placeholder={"Select Period"}
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="Operational Condition"
              options={operationalConditionOptions}
              selectedOption={exerciseFormData.operational_condition}
              onSelect={handleSelectOperationalCondition}
              compulsory={<span className='fc4'>*</span>}
              placeholder={"Select Operational Condition"}
              isReadOnly={id !== undefined}
            />
          </div>
          
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="Display Student Name As"
              options={studentTraineeAS}
              selectedOption={exerciseFormData.exercise_type}
              onSelect={handleSelectStudentTraineeAS}
              placeholder={"Select Option"}
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <div className="add-more-sec df aic">
              <label htmlFor="exercise_single" className="v-center mr8 fs14">
                <input
                  type="radio"
                  className="mr8 cp food-checkbox"
                  id="exercise_single"
                  name="exerciseUser"
                  value="0"
                  checked={exerciseFormData.exercise_mode === "0"}
                  onChange={(e) =>
                    setexerciseFormData((prev) => ({
                      ...prev,
                      exercise_mode: e.target.value,
                    }))
                  }
                />
                Single Student
              </label>
              <label htmlFor="exercise_multi" className="v-center fs14">
                <input
                  type="radio"
                  className="mr8 cp food-checkbox"
                  id="exercise_multi"
                  name="exerciseUser"
                  value="1"
                  checked={exerciseFormData.exercise_mode === "1"}
                  onChange={(e) =>
                    setexerciseFormData((prev) => ({
                      ...prev,
                      exercise_mode: e.target.value,
                    }))
                  }
                />
                Multiple Students
              </label>
            </div>
          </div>
          
          <div className="form-group-settings cm-fr flx48">
            <div className="add-more-sec df aic">
              <label htmlFor="solo_flying" className="v-center fs14">
                <input
                  type="checkbox"
                  className="mr8 cp food-checkbox"
                  id="solo_flying"
                  name="solo_flying"
                  checked={exerciseFormData.solo_flying === "1"}
                  onChange={(e) =>
                    setexerciseFormData((prev) => ({
                      ...prev,
                      solo_flying: e.target.checked ? "1" : "0",
                    }))
                  }
                />
                Display Exercise Name as Solo Flying
              </label>
            </div>
          </div>
          <div className="form-group-settings name flx100 meta-grp ">
            <p className="fc15 fw6 fs14 ls1">Description/Remarks</p>
            <textarea
              id="remarks"
              name="remarks"
              placeholder="Enter description or remarks"
              value={exerciseFormData.remarks}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="radio-grp-status box-center fww mt12 mb12">
          <label htmlFor="active" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="active"
              value="1"
              checked={exerciseFormData.status === "1"}
              onChange={handleStatusChange}
            />
            Active
          </label>
          <label htmlFor="draft" className="cp v-center mr16 fc6 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="draft"
              value="2"
              checked={exerciseFormData.status === "2"}
              onChange={handleStatusChange}
            />
            Draft
          </label>
          <label htmlFor="inactive" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="inactive"
              value="0"
              checked={exerciseFormData.status === "0"}
              onChange={handleStatusChange}
            />
            Inactive
          </label>
        </div>

        <div className="add-more box-center mt24 mb24">
          <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
            onClick={handleSubmit}
          >
            {id ? "Update" : "Submit"}
          </button>
        </div>
      </Card>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default ExercisePostingForm;
