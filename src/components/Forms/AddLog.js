import React, { useEffect, useState } from "react";
import "./UpdateStatusForm.css";
import SingleDropdown from "../SingleDropdown";
import SingleDropdownMultiSearch from "../SingleDropdownMultiSearch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MultiDropdown from "../MultiDropdown.js";

const AddLogForm = ({
  multistudent = false,
  onClose,
  userDetail,
  editMode,
  onSuccess = () => {}
}) => {
  const customDateFormat = "dd/MM/yyyy";
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentMulti, setSelectedStudentMulti] = useState([]);
  const [studentListC, setStudentList] = useState([]);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  const [addLogData, setAddLogData] = useState({
    edit_id:"",
    date: new Date(),
    course_name: {},
    course_status: '',
    course_status_color: '',
    drone_id: {},
    battery: {},
    exercise: {},
    instructor:{},
    start_time: {
        hour: {"label":"09","value":"09"},
        minute: {"label":"00","value":"00"},
        ampm: {"label":"AM","value":"AM"},
    },
    student_id: null,
  });

 
  const exerciseInfoMap = {
    "1": {
      label: "D-15 min | Dual | Night",
      value: "Duration - 15 min | Student Type - Dual | Period - Night",
      duration: 15,
    },
    "2": {
      label: "D-20 min | Dual | Night",
      value: "Duration - 20 min | Student Type - RPIC | Period - Day",
      duration: 20,
    },
    "3": {
      label: "D-45 min | Dual | Night",
      value: "Duration - 45 min | Student Type - RPIC | Period - Day",
      duration: 45,
    },
  };

  const [droneListOptions, setDroneListOptions] = useState([]);
  const [minuteList, setMinuteList] = useState([]);
  const [studentEditRecord, setStudentEditRecord] = useState({});
  const [timeList, setTimeList] = useState([]);
 
  const [courseListOptions, setCourseListOptions] = useState([]);
  
  const [batteryListOptions, setBatteryListOptions] = useState([]);
  
  const [exerciseListOptions, setExerciseListOptions] = useState([]);

  const [instructorListOptions, setInstructorListOptions] = useState([]);
  

   
  // Utility: convert 12h to 24h hour number
const convertTo24Hour = (hour, ampm) => {
  const h = parseInt(hour, 10);
  if (ampm === "AM") return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
};

const handleExerciseChange = (selectedOption) => {
  
  setAddLogData((prev) => {
    const period = selectedOption?.exercise_period; 
    //let { hour, minute, ampm } = prev.start_time;
    let hour = prev.start_time.hour;
    let minute = prev.start_time.minute;
    let ampm = prev.start_time.ampm;
    const hour24 = convertTo24Hour(hour, ampm);
    const totalMinutes = hour24 * 60 + parseInt(minute, 10);

    const clampTime = (period) => {
      if (period === "night") {
        return { hour: {label:"05",value:"05"}, minute: {label:"00",value:"00"}, ampm:{label:"PM",value:"PM"} };
      }
      if (period === "day") {
        return { hour: {label:"03",value:"03"}, minute: {label:"00",value:"00"}, ampm: {label:"AM",value:"AM"} };
      }
      return { hour, minute, ampm };
    };
    
    const newStartTime = clampTime(period);
    if(editMode?.id!==undefined){
    return {
      ...prev,
      exercise: selectedOption,
      timeError:""
    };
    }else{
      return {
      ...prev,
      exercise: selectedOption,
      start_time: newStartTime,
      timeError:""
    };
    }
  });
};


  const handleSelectedInstructor = (selectedOption) => {
    setAddLogData((prev) => ({
      ...prev,
      instructor: selectedOption,
    }));
  };

const calculateEndTime = () => {
  let hour = addLogData.start_time.hour?.value;
  let minute = addLogData.start_time.minute?.value;
  let ampm = addLogData.start_time.ampm?.value;
  const exercise = addLogData.exercise;

  if (!exercise || !hour || minute==="" || !ampm) return "";

  const duration = exercise.exercise_duration; // in minutes
  const h = convertTo24Hour(hour, ampm);
  const m = parseInt(minute, 10);

  const startDate = new Date();
  startDate.setHours(h, m, 0, 0);

  // Add duration
  const endDate = new Date(startDate.getTime() + duration * 60000);

  let endHour = endDate.getHours();
  const endMinute = endDate.getMinutes().toString().padStart(2, "0");
  const endAMPM = endHour >= 12 ? "PM" : "AM";
  endHour = endHour % 12 || 12;

  return `${endHour.toString().padStart(2, "0")}:${endMinute} ${endAMPM}`;
};

const handleSelectedCourse = (selectedOption) => {
  if(multistudent){
    getStudentListCourseWise(selectedOption);
  }
  setAddLogData({
    ...addLogData,
    course_name: selectedOption,
    course_status: selectedOption?.status || '',
    course_status_color: selectedOption?.color || '',
    
  });
    setAddLogData((prev) => ({
    ...prev,
    drone_id: {},
  }));
  setAddLogData((prev) => ({
    ...prev,
    exercise: {},
  }));
  setAddLogData((prev) => ({
    ...prev,
    battery: {},
  }));
  setDroneListOptions([]);
  setExerciseListOptions([]);
  setBatteryListOptions([]);
  setInstructorListOptions([]);
  if(selectedOption?.value){
    getDroneUINumber(selectedOption);
  }
};

const handleDroneId = (selectedOption) => {
  setAddLogData((prev) => ({
    ...prev,
    drone_id: selectedOption,
  }));
  setAddLogData((prev) => ({
    ...prev,
    battery: {},
  }));
  if(selectedOption?.value){
    getBatteryListOptions(selectedOption.value);
  }
}
const handleSelectedBattery = (selectedOption) => {
  setAddLogData((prev) => ({
    ...prev,
    battery: selectedOption,
  }));
}
  
const handleTimeChange = (name,selectoption) => {
  
  let value = selectoption;
  let newValue = value;
  

  setAddLogData((prev) => {
    const updatedTime = {
      ...prev.start_time,
      [name]: newValue,
    };
    
    return {
      ...prev,
      start_time: updatedTime,
      timeError:""
    };
  });
};
const checkTimeValidation = (minutes, period)=>{
   const ranges = {
      night: { start: 17 * 60, end: 7 * 60 },  // 5 PM to 6 AM (wraps)
      day: { start: 3 * 60, end: 22 * 60 },    // 3 AM to 7 PM
    };

  if (period === "night") {
    return minutes >= ranges.night.start || minutes <= ranges.night.end;
  }
  if (period === "day") {
    return minutes >= ranges.day.start && minutes <= ranges.day.end;
  }
  return true; 
    
}
  useEffect(()=>{
    if(editMode?.id!==undefined){
      getEditUserRecord(editMode?.id);
    }
  },[editMode])

  useEffect(()=>{
    if(multistudent){
      getFlyingCourseRecord();
    }
  },[multistudent])


  const getBatteryListOptions = async (drone_id)=>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=getbatterylist`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        drone_id: drone_id,
      },
    })
    .then(function (response){
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      if (response.data.data.status === "1") {
        setBatteryListOptions([...response.data.data.list]);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  
  useEffect(()=>{
    if(multistudent===false && editMode?.id===undefined){
        getLastUserRecord(addLogData.student_id);
    }  
  },[courseListOptions])

  const getDroneUINumber = async (course_id)=>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=getdroneuin`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        course_id: course_id,
      },
    })
    .then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      if (response.data.data.status === "1") {
        setDroneListOptions([...response.data.data.list.drone]);
        setExerciseListOptions([...response.data.data.list.excercise]);
        setInstructorListOptions([...response.data.data.list.instructor]);
        setMinuteList([...response.data.data.list.minute]);
        setTimeList([...response.data.data.list.time]);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const getFlyingCourseRecord = async (user_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=getflyingcourse`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        user_id: user_id,
        multistudent:multistudent
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }
        if (response.data.data.status === "1") {
          setCourseListOptions([...response.data.data.list]);
        } 
        else{
            onClose();
            toast.warn("not found course");
          }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getEditUserRecord = async (log_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=getstudentlogrecod`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        log_id: log_id,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }
        if(response.data.data.status === "1") {
            let logd  = response.data.data.logdata;
            setStudentEditRecord({...logd}); 
            getFlyingCourseRecord(logd?.student_list_record[1]?.value);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getStudentListCourseWise = (course_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=getAllFlyingBatchStudent`,
      headers: { "Auth-Id": user.auth_id },
      data: { course_id:course_id },
    }).then(function (response) {
      if (response.data.data.status === "1") {
        setStudentList([...response.data.data.student_list]);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }

   const getLastUserRecord = async (user_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=getstudentlogrecod`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        user_id: user_id,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }
        if(response.data.data.status === "1") {
            let logd  = response.data.data.logdata;
            setStudentEditRecord({...logd});
        } 
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
 
  const handleSelectedStudent = (selectedOption) => {
    setSelectedStudent(selectedOption);
    setAddLogData((prev) => ({
      ...prev,
      student_id: selectedOption?.value || null,
    }));
    if(selectedOption?.value){
      getFlyingCourseRecord(selectedOption?.value);
    }
  };
  const handleSelectStudentMulti = (value) => {
      setSelectedStudentMulti((prevSelected) => {
          const index = prevSelected.indexOf(value);
          const updatedValues = [...prevSelected];

          if (index === -1) {
          updatedValues.push(value);
          } else {
          updatedValues.splice(index, 1);
          }
          setAddLogData((prevData) => ({
          ...prevData,
          student_id: updatedValues,
          }));

          return updatedValues;
      });
  };
  const handleLogDateChange = (date) => {
    setAddLogData({ ...addLogData, date });
  };

   useEffect(()=>{
    
    if(userDetail?.studentListOption?.length===2){
      if(selectedStudent?.value){
        getFlyingCourseRecord(userDetail?.studentListOption[1]?.value);
      }
      handleSelectedStudent(userDetail?.studentListOption[1]);
      
    }
    if(studentEditRecord?.student_list_record?.length===2){
      //getFlyingCourseRecord(studentEditRecord?.student_list_record[1]?.value);
    }
  },[userDetail])

   useEffect(()=>{
    if(courseListOptions?.length===2){
      handleSelectedCourse(courseListOptions[1]);
    }
    if(studentEditRecord?.select_studet_course?.label!==undefined){
          handleSelectedCourse(studentEditRecord?.select_studet_course);
    }
  },[courseListOptions,studentEditRecord]);

   useEffect(()=>{
    if(droneListOptions?.length===2){
      handleDroneId(droneListOptions[1]);
    }
    if(studentEditRecord?.selected_drone?.label!==undefined){
      handleDroneId(studentEditRecord?.selected_drone);
    }
  },[droneListOptions,studentEditRecord])

  useEffect(()=>{
    if(batteryListOptions?.length===2){
      handleSelectedBattery(batteryListOptions[1]);
    }
    if(studentEditRecord?.selected_battery?.label!==undefined){
        handleSelectedBattery(studentEditRecord?.selected_battery);
    }
  },[batteryListOptions,studentEditRecord])

  useEffect(()=>{
    if(exerciseListOptions?.length===2){
      handleExerciseChange(exerciseListOptions[1]);
    }
    if(studentEditRecord?.selected_exercise?.label!==undefined){
        handleExerciseChange(studentEditRecord?.selected_exercise);
    }
  },[exerciseListOptions,studentEditRecord]);

   useEffect(()=>{
   
    if(studentEditRecord?.selected_start_time?.hour?.label!==undefined){
        handleTimeChange("hour",studentEditRecord?.selected_start_time?.hour);
    }
    if(studentEditRecord?.selected_start_time?.hour?.label!==undefined){
        handleTimeChange("minute",studentEditRecord?.selected_start_time?.minute);
    }
    if(studentEditRecord?.selected_start_time?.hour?.label!==undefined){
        handleTimeChange("ampm",studentEditRecord?.selected_start_time?.ampm);
    }
    if(studentEditRecord?.selected_flying_date!==undefined){
       setAddLogData((prev) => ({
      ...prev,
        date: new Date(studentEditRecord?.selected_flying_date),
      }));
    }
    if(studentEditRecord?.selected_instructor?.label!==undefined){
      setAddLogData((prev) => ({
      ...prev,
      instructor: studentEditRecord?.selected_instructor,
    }));
    }
    if(studentEditRecord?.student_list_record?.length===2){
      setSelectedStudent(studentEditRecord?.student_list_record[1]);
      setAddLogData((prev) => ({
      ...prev,
      student_id: studentEditRecord?.student_list_record[1]?.value || null,
      edit_id:  editMode?.id!==undefined? studentEditRecord?.id:"",
      }));
    }
  },[timeList,studentEditRecord]);

  

  
  const validateForm = () => {
    if (!addLogData.student_id) {
      toast.warning("Please select a student.");
      return false;
    }
    if (!addLogData.course_name?.value) {
      toast.warning("Please select a course.");
      return false;
    }
    if (!addLogData.drone_id?.value) {
      toast.warning("Please select a drone.");
      return false;
    }
    if (!addLogData.battery?.value && addLogData.exercise?.exercise_student_mode!=="1") {
      toast.warning("Please select a battery.");
      return false;
    }
    if (!addLogData.exercise?.value) {
      toast.warning("Please select an exercise.");
      return false;
    }
    if (!addLogData.date) {
      toast.warning("Please select a flying date.");
      return false;
    }
    
    const hour = parseInt(addLogData.start_time?.hour?.value || "0", 10);
    const minute = parseInt(addLogData.start_time?.minute?.value || "0", 10);
    const ampm = addLogData.start_time?.ampm?.value;

    
    const hour24 = convertTo24Hour(hour, ampm);
    const totalMinutes = hour24 * 60 + parseInt(minute, 10);

    const period = addLogData.exercise?.exercise_period?.toLowerCase(); // 'day' or 'night'

    if (!checkTimeValidation(totalMinutes, period)) {
      toast.warning(`Start time is not valid for ${period} period.`);
      return false;
    }
    if(addLogData?.exercise?.exercise_student_type?.toLowerCase() === 'dual' && !addLogData?.instructor?.value){
      toast.warning("Please select instructor.");
      return false;
    }
    return true;
  };

  const handleAddLogForm = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
     axios({
      method: "post",
      url: `${constant.base_url}/admin/student_drone_log.php?fun=insertstudentlog`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        addLogData: addLogData,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }
        if (response.data.data.status === "1") {
          toast.success(response.data.data.msg);
          onClose();
          onSuccess();
        } else{
            toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  }
    
  const handleLogout = () => {
    // Dispatch the logout action to clear user data
    dispatch(logout());
    // Redirect to the login page
    navigate("/login");
  };
  return (
    <>
      <div className="update-status-form">
        <div className="df fww">
        {multistudent ? (
          <>
            {/* Course Name first */}
            <div className="flx33 up-status1 mr12">
              <SingleDropdown
                label="Course Name"
                options={courseListOptions}
                selectedOption={addLogData.course_name}
                onSelect={handleSelectedCourse}
                placeholder="Select Course Name"
                compulsory={<span className="fc4">*</span>}
                isReadOnly={courseListOptions?.length === 2}
              />
              {addLogData.course_status && (
                <div className="fc13 fs10 mt4">
                  Status - <span style={{ color: addLogData.course_status_color }}>{addLogData.course_status}</span>
                </div>
              )}
            </div>

            {/* Exercise second */}
            <div className="flx33 up-status1 mr12">
              <SingleDropdown
                label="Exercise"
                options={exerciseListOptions}
                selectedOption={addLogData.exercise}
                onSelect={handleExerciseChange}
                placeholder="Select Exercise Name"
                compulsory={<span className="fc4">*</span>}
                isReadOnly={exerciseListOptions?.length === 2}
              />
              {addLogData.exercise?.value && (
                <div className="fc13 fs10 mt4">
                  <DynamicTooltip direction="right" text={addLogData?.exercise?.tooltip_value}>
                    {addLogData?.exercise?.tooltip_label}
                  </DynamicTooltip>
                </div>
              )}
            </div>

            
            {addLogData.exercise?.exercise_student_mode==="1" ?( 
              <div className="flx100 up-status1 mr12 inp-design mt20">
                <p className="fc15 fw6 fs14 ls1 mb8">Select Student<span className="fc4">*</span></p>
                <MultiDropdown
                    label={`Student`}
                    options={studentListC || studentEditRecord?.student_list_record || userDetail.studentListOption}
                    selectedValues={selectedStudentMulti}
                    onSelect={handleSelectStudentMulti}
                    searchable
                    chips="4"
                />
            </div>)
            :
            ( <div className="flx33 up-status1 mr12 inp-design">
              <SingleDropdownMultiSearch
                label="Student"
                options={studentListC || studentEditRecord?.student_list_record || userDetail.studentListOption}
                selectedOption={selectedStudent}
                onSelect={handleSelectedStudent}
                placeholder="Select Student"
                compulsory={<span className="fc4">*</span>}
                search={true}
                isReadOnly={studentEditRecord?.student_list_record?.length === 2 || userDetail?.studentListOption?.length === 2}
              />
            </div>)}
          </>
        ) : (
          <>
            {/* Student first (original structure) */}
            {(!userDetail || !userDetail.user_id) && (
              <div className="flx33 up-status1 mr12 inp-design">
                <SingleDropdownMultiSearch
                  label="Student"
                  options={studentEditRecord?.student_list_record || userDetail.studentListOption}
                  selectedOption={selectedStudent}
                  onSelect={handleSelectedStudent}
                  placeholder="Select Student"
                  compulsory={<span className="fc4">*</span>}
                  search={true}
                  isReadOnly={studentEditRecord?.student_list_record?.length === 2 || userDetail?.studentListOption?.length === 2}
                />
              </div>
            )}
            {/* Course next */}
            <div className="flx33 up-status1 mr12">
              <SingleDropdown
                label="Course Name"
                options={courseListOptions}
                selectedOption={addLogData.course_name}
                onSelect={handleSelectedCourse}
                placeholder="Select Course Name"
                compulsory={<span className="fc4">*</span>}
                isReadOnly={courseListOptions?.length === 2}
              />
              {addLogData.course_status && (
                <div className="fc13 fs10 mt4">
                  Status - <span style={{ color: addLogData.course_status_color }}>{addLogData.course_status}</span>
                </div>
              )}
            </div>

            {/* Exercise next */}
            <div className="flx33 up-status1 mr12">
              <SingleDropdown
                label="Exercise"
                options={exerciseListOptions}
                selectedOption={addLogData.exercise}
                onSelect={handleExerciseChange}
                placeholder="Select Exercise Name"
                compulsory={<span className="fc4">*</span>}
                isReadOnly={exerciseListOptions?.length === 2}
              />
              {addLogData.exercise?.value && (
                <div className="fc13 fs10 mt4">
                  <DynamicTooltip direction="right" text={addLogData?.exercise?.tooltip_value}>
                    {addLogData?.exercise?.tooltip_label}
                  </DynamicTooltip>
                </div>
              )}
            </div>
          </>
        )}
        {/* Remaining fields (unchanged) */}
        <div className="flx33 up-status1 mr12 mt20">
          <SingleDropdown
            label="Drone ID"
            options={droneListOptions}
            selectedOption={addLogData.drone_id}
            onSelect={handleDroneId}
            placeholder="Select Drone ID"
            compulsory={<span className="fc4">*</span>}
            isReadOnly={droneListOptions?.length === 2}
          />
          {addLogData.drone_id?.value && (
            <div className="fc13 fs10 mt4">
              <DynamicTooltip direction="left" text={addLogData?.drone_id?.tooltip_value}>
                {addLogData?.drone_id?.tooltip_label}
              </DynamicTooltip>
            </div>
          )}
        </div>

        <div className={`flx33 up-status1${(!userDetail || !userDetail.user_id) ? ' mr12 mt20' : ''}`}>
          <SingleDropdown
            label="Batteries"
            options={batteryListOptions}
            selectedOption={addLogData.battery}
            onSelect={handleSelectedBattery}
            placeholder="Select Battery Name"
            compulsory={addLogData.exercise?.exercise_student_mode!=="1"?<span className="fc4">*</span>:""}
            isReadOnly={batteryListOptions?.length === 2}
          />
        </div>

        <div className="flx33 up-status1 mt20 mr12">
          <div className="time-picker fww">
            <div className="time-row df fdc">
              <label className="fc15 fw6 fs14 ls1">Start Time (IST)<span className="fc4">*</span></label>
              <div className="time-inp mt12 custom-select df">
                <SingleDropdown
                  options={timeList}
                  selectedOption={addLogData.start_time.hour}
                  onSelect={(option) => handleTimeChange("hour", option)}
                  search={true}
                  noLabel={false}
                  placeholder="Hour"
                  addCustomClass="student-log-select mr8"
                />
                <SingleDropdown
                  options={minuteList}
                  selectedOption={addLogData.start_time.minute}
                  onSelect={(option) => handleTimeChange("minute", option)}
                  search={true}
                  noLabel={false}
                  placeholder="Minute"
                  addCustomClass="student-log-select mr8"
                />
                <SingleDropdown
                  options={[{ label: "AM", value: "AM" }, { label: "PM", value: "PM" }]}
                  selectedOption={addLogData.start_time.ampm}
                  onSelect={(option) => handleTimeChange("ampm", option)}
                  search={true}
                  noLabel={false}
                  placeholder="AM/PM"
                  addCustomClass="student-log-select mr8"
                />
              </div>
            </div>
          </div>
          {!addLogData.timeError && addLogData.exercise?.value && (
            <div className="fc13 fs10 mt4">
              End Time - {calculateEndTime()}
            </div>
          )}
          {addLogData.timeError && (
            <div className="fc4 fs12 mt4">
              {addLogData.timeError}
            </div>
          )}
        </div>

        <div className="up-status1 calendar-input mr12 mt20">
          <label className="fc15 fw6 fs14 mb12 ls1">Flying Date<span className="fc4">*</span></label>
          <DatePicker
            maxDate={new Date()}
            dateFormat={customDateFormat}
            selected={addLogData.date}
            onChange={handleLogDateChange}
            placeholderText="-- Select Date --"
            showIcon
            isClearable={true}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div className="flx33 up-status1 mr12 mt20">
          <SingleDropdown
            label="Instructor"
            options={instructorListOptions}
            selectedOption={addLogData.instructor}
            onSelect={handleSelectedInstructor}
            placeholder="Select Instructor"
            compulsory={addLogData?.exercise?.exercise_student_type?.toLowerCase() === 'dual' ? <span className="fc4">*</span> : ""}
          />
        </div>
      </div>

        <div className="df fww">
        </div>
      </div>
      <div className="button-container mt32 myteam-filters">
        <button type="button" className="btn-cancel clear" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="update-button btn-blue" onClick={handleAddLogForm}>Update</button>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AddLogForm;
