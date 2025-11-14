import React, { useState, useEffect, useRef } from "react";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MultiDropdown from "../../components/MultiDropdown.js";
import MultiselectDropdown from "../../components/SearchMultiSelectDropdown.js";
import TimePicker from "../../components/TimePicker.js";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import "../ClassManagement/BatchForm.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { startOfMonth, endOfMonth } from "date-fns";

import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoPermission from "../../components/NoPermission.js";
import { useTitle } from "../../hooks/useTitle.js";
import { useParams } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { FaSmileWink } from "react-icons/fa";
import Toggle from "../../components/Toggle.js";



const BatchForm = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  useTitle("Batch Detail - Flapone Aviation");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const calendarRef = useRef(null);

  const accessRoleLimit = ["1", "2", "3"];
  const accessDeptLimit = ["1", "2", "3"];
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageAccess = accessRoleLimit.includes(userRole);
  const pageAccessDept = accessDeptLimit.includes(userDept);

  const [errorMsgData, setErrorMsgData] = useState([]);
  var errorMsg = {};
  const [bid, setBid] = useState(null);
  const [batchFormData, setBatchFormData] = useState({
    id: "",
    batch_name: "",
    category_id:"",
    batch_type:"",
    batch_sub_type:"",
    course_id: [],
    instructor_id:"",
    batch_id: "",
    start_date: null,
    end_date: null,
    startDateDay: "",
    max_allow_stu: "",
    min_stu_req: "1",
    mode: "",
    on_days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    batch_on_days: [{ label: "Sunday", value: "Sunday" },
      { label: "Monday", value: "Monday" },
      { label: "Tuesday", value: "Tuesday" },
      { label: "Wednesday", value: "Wednesday" },
      { label: "Thursday", value: "Thursday" },
      { label: "Friday", value: "Friday" },
      { label: "Saturday", value: "Saturday" }],
    online_link: "",
    location: "",
    status: "2",
    start_time: {
      hour: "09",
      minute: "00",
      ampm: "AM",
    },
    end_time: {
      hour: "06",
      minute: "00",
      ampm: "PM",
    },
    dayWiseRecords: [
      {
        id: Date.now() + "_new",
        dayRecord: "",
        batchType: "",
        start_time: {
          hour: "09",
          minute: "00",
          ampm: "AM",
        },
        end_time: {
          hour: "09",
          minute: "30",
          ampm: "AM",
        },
        mode: "",
        link: "",
        room: "",
        location: "",
        instructorName: "",
        coInstructor: [],
        additionalNotes: "",
        subject: "",
        repeat: "",
        repeatDate: "",
        multiDate: [],
        startDate: "",
        endDate: "",
        status: "1",
      },
    ],
    autoBatch: false,
    autoBatchPeriod: "",
    autoBatchPattern: "",


  });

  const handleBatchTimeChange = (timeData, period) => {
    setBatchFormData((prevData) => ({
      ...prevData,
      [period === "from" ? "start_time" : "end_time"]: timeData,
    }));

    validateBatchFields(
      period === "from" ? "start_time" : "end_time",
      timeData
    );
  };

  const customDateFormat = "dd/MM/yyyy";

  const [courseListOptions, setCourseListOptions] = useState([]);
  const [courseListOtherOptions, setCourseListOtherOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [classRoomOptions, setClassRoomOptions] = useState({});
  const [coInstructorOptions, setCoInstructorOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [courseDuration, setCourseDuration] = useState(0);
  const [courseCategorySname, setCourseCategorySname] = useState("");
  const [genBatchId, setGenBatchId] = useState("");
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [dayRecordData, setDayRecordData] = useState([]);
  const [batchStartStatus, setBatchStartStatus] = useState(false);
  const [batchEndStatus, setBatchEndStatus] = useState(false);
  const [batchEndDate, setBatchEndDate] = useState("");
  const [batchStartDate, setBatchStartDate] = useState("");
  const [hasDailyFrequency, setHasDailyFrequency] = useState(true);
  

  const [roomConflictMessage,setRoomConflictMessage]=useState("");
  const [instConflictMessage,setInstConflictMessage]=useState("");
  const [autoBatchOnOff, setAutoBatchOnOff] = useState(false);

  const [allotedStudent,setAllotedStudent]=useState(0);

  

  const typeListOptions = [
    { value: "lecture", label: "Lecture" },
    { value: "flying", label: "Flying" },
    { value: "test", label: "Test" },
    { value: "simulator", label: "Simulator" },
    { value: "exam", label: "Exam" },
    { value: "presentation", label: "Presentation" },
    { value: "seminar", label: "Seminar" },
    { value: "workshop", label: "Workshop" },
    { value: "other", label: "Other" },
  ];

  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];
  const modeOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
    { value: "Hybrid", label: "Hybrid" },
  ];
  const periodOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];
  
   
    
  // const monthlyOptions = [
  //   { value: "1", label: "Same Weekday" },
  //   { value: "monthly", label: "Monthly" },
  // ];

  const [weeklyOptions, setWeeklyOptions] = useState([]);
  const [monthlyOptions, setMonthlyOptions] = useState([]);



 


  const categoryOptions = [
    { value: "3", label: "Drone pilot training" },
    { value: "4", label: "Aircraft pilot training" },
  ];

  const batchTypeOptions = [
    { value: "Theory", label: "Theory" },
    { value: "Flying", label: "Flying" },
  ];
  
  const subTypeOptions = [
    { value: "RPC", label: "RPC" },
    { value: "RPI", label: "RPI" },
    { value: "RPIR", label: "RPIR" },
    { value: "Other", label: "Other" },
  ];


  

  const [disabledDates, setDisabledDates] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    validateBatchFields(name, value);
  };

  function validateBatchFields(id, value, daywiseData, daywise,index) {

    errorMsg = errorMsgData;

    if (daywise === "dayWiseRecords") {
       
      if (
        id === "location" ||
        id === "mode" ||
        id === "subject" ||
        id === "batchType" ||
        (id === "dayRecord" && daywiseData.repeat === "weekly")
      ) {
        const value = daywiseData[id].value;
        const errorKey = id + daywiseData.id;

        if (value.length === 0) {
          errorMsg[errorKey] = `${formatBatchName(id)} field is empty!`;
        } else {
          errorMsg[errorKey] = "";
        }
      } else if (id === "instructorName" || id === "room") {
        const updatedDayWiseRecords = [...batchFormData.dayWiseRecords];
        const updateRecord = () => {
          updatedDayWiseRecords[index] = { ...updatedDayWiseRecords[index], [id]: "" };
          setBatchFormData({ ...batchFormData, dayWiseRecords: updatedDayWiseRecords });
        };

        if (batchFormData.on_days.length < 1) {
        toast.warning("Please Select Batch On Days");
        updateRecord();
        }

        if (daywiseData.repeat?.value) {
        const { value } = daywiseData.repeat;
        if (value === "daily" || value === "weekly") {
        if (!daywiseData.startDate && !daywiseData.endDate) {
          errorMsg["dates" + daywiseData.id] = "Please select Class dates";
          updateRecord();
        }
        if (value === "weekly" && !daywiseData.dayRecord?.value) {
          errorMsg["dayRecord" + daywiseData.id] = "Please select day";
          updateRecord();
        }
        } else if (value === "repeatDate" && daywiseData.multiDate.length < 1) {
        errorMsg["dates" + daywiseData.id] = "Please select Class dates";
        updateRecord();
        }
        } else {
        errorMsg["repeat" + daywiseData.id] = "Please select Class Frequency";
        updateRecord();
        }

        const value = daywiseData[id].value;
        const errorKey = id + daywiseData.id;
     if(id === "instructorName" ){
        if (value.length === 0 || value === "0") {
          errorMsg[errorKey] = `Please select ${formatBatchName(id)}`;
        } else {
          errorMsg[errorKey] = "";

          checkInstructor(daywiseData);
        }
      }else if(id === "room"){
         if (value.length === 0 || value === "0") {
          errorMsg[errorKey] = `Please select Class${formatBatchName(id)}`;
         } else {
          errorMsg[errorKey] = "";
          checkClassRoom(daywiseData);
         }
        }

      }else if (id ==="dayCalander") {
        const batchondays = batchFormData.on_days?batchFormData.on_days:[];
        if(batchondays.length < 1){
          toast.warning("Select Batch On Days");
        }

      } else {
        //   if(id ==="link") {
        //     const value = daywiseData[id];
        //     const errorKey = id + daywiseData.id;
        //     if (value.length === 0) {
        //         errorMsg[errorKey] = `${formatBatchName(id)} field is empty!`;
        //     } else {
        //         errorMsg[errorKey] = '';
        //     }
        // }
      }
    } else if (id === "location" || id === "mode" || id === "course_id") {
      value = value.value;
      if (value.length === 0) {
        errorMsg[id] = formatBatchName(id) + " field is empty!";
      } else {
        errorMsg[id] = "";
      }
    } else if (id === "on_days") {
      if (value.length === 0) {
        errorMsg[id] = "On days field is empty!";
      } else {
        errorMsg[id] = "";
      }
    } else if (id === "start_date") {
      if (!value) {
        errorMsg[id] = "Start date field can't be empty!";
      } else {
        if (value && batchFormData["end_date"]) {
        // Loop to remove startDate and endDate from each record in dayWiseRecords
       
          // Set startDate and endDate to empty strings using map
          if(batchFormData.dayWiseRecords){
          const updatedRecords = batchFormData.dayWiseRecords.map(record => ({
            ...record,
            startDate: '',
            endDate: '',
            multiDate:[]
          }));
      
          // Update the state with modified data
          setBatchFormData(prevData => ({
            ...prevData,
            dayWiseRecords: updatedRecords
          }));
        
          }
      }
        if (value && batchFormData["end_date"]) {
          const start_date = new Date(value.split("/").reverse().join("-"));
          const end_date = new Date(
            batchFormData["end_date"].split("/").reverse().join("-")
          );
          if (start_date && end_date) {
            if (new Date(start_date) > new Date(end_date)) {
              errorMsg.end_date = "End Date always greater than start date!";
              errorMsg[id] = "Start Date always less than end date!";
            } else {
              errorMsg.end_date = "";
              errorMsg[id] = "";
            }
          }
        }
      }
    } else if (id === "end_date") {
      if (!value) {
        errorMsg[id] = "End date field can't be empty!";
      } else {
        if (value && batchFormData["start_date"]) {
          const start_date = new Date(
            batchFormData["start_date"].split("/").reverse().join("-")
          );
          const end_date = new Date(value.split("/").reverse().join("-"));
          if (start_date && end_date) {
            if (new Date(start_date) > new Date(end_date)) {
              errorMsg[id] = "End Date always greater than start date!";
              errorMsg.start_date = "Start Date always less than end date!";
            } else {
              errorMsg.start_date = "";
              errorMsg[id] = "";
            }
          }
        }
      }
    } else if (id === "start_time") {
      if (!value) {
        errorMsg[id] = "Start Time field can't be empty!";
      } else {
        if (value && batchFormData["end_time"]) {
          const getstime = getConvertedTime(value);
          const stime = formatTo24Hour(getstime);
        
          const getetime = getConvertedTime(batchFormData["end_time"]);
          const etime = formatTo24Hour(getetime);
          if (stime && etime) {
           
            if (stime === etime) {
              errorMsg.start_time = "Start Time must be less than End Time!";
              errorMsg.end_time = "End Time must be greater than Start Time!";
            } else if (stime > etime) {
              errorMsg.start_time = "Start Time must be less than End Time!";
              errorMsg.end_time = "End Time must be greater than Start Time!";
            } else {
              errorMsg.start_time = "";
              errorMsg.end_time = "";
            }
          }
        }
      }
    } else if (id === "end_time") {
      if (!value) {
        errorMsg[id] = "End Time field can't be empty!";
      } else {
        if (value && batchFormData["start_time"]) {
          const getstime = getConvertedTime(batchFormData["start_time"]);
          const stime = formatTo24Hour(getstime);

          const getetime = getConvertedTime(value);
          const etime = formatTo24Hour(getetime);
          if (stime && etime) {
            if (stime === etime) {
              errorMsg.start_time = "Start Time must be less than End Time!";
              errorMsg.end_time = "End Time must be greater than Start Time!";
            } else if (stime > etime) {
              errorMsg.start_time = "Start Time must be less than End Time!";
              errorMsg.end_time = "End Time must be greater than Start Time!";
            } else {
              errorMsg.start_time = "";
              errorMsg.end_time = "";
            }
          }
        }
      }
    } else {
      if (id) {
        value = value.trim();
        if (value.length === 0) {
            errorMsg[id] = formatBatchName(id) + " field is empty!";
        } else {
          errorMsg[id] = "";
        }
      }
    }

    if (Object.keys(errorMsg).length > 0) {
      setErrorMsgData(errorMsg);
      return false;
    }
  }

  const getConvertedTime = (time) => {
    const hours = time.hour.toString().padStart(2, "0");
    const minute = time.minute.toString().padStart(2, "0");
    return `${hours}:${minute} ${time.ampm}`;
  };

  const formatTo24Hour = (timeString) => {
    const [time, ampm] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const formatBatchName = (Name) => {
    if(Name === "min_stu_req"){
      Name="Minimum students required";
    }

    if(Name === "max_allow_stu"){
      Name="Max allowed student";
    }
    

    // Replace underscores with spaces and capitalize each word
    return Name.replace(/_/g, " ") // Replace underscores with spaces
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join back into a single string
  };


  const handleCourseNameSelect = (selectedoptions) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      course_id: selectedoptions,
    }));

    const courseValues = selectedoptions.map((obj) => obj.value);
    handleCourse(courseValues);
  };

  const handleCategoryNameSelect = (option) => {
    
    setBatchFormData((prevValues) => ({
      ...prevValues,
      category_id: option,
    }));

    //validateBatchFields("category_id", option);

    if(batchFormData.category_id.value !== option.value){
      setBatchFormData((prevValues) => ({
        ...prevValues,
        course_id: [],
      }));
    }

    handleCategory(option.value);
  };

  const handleBatchTypeNameSelect = (option) => {
    if(option.value !== batchFormData.batch_type){
    setBatchFormData((prevValues) => ({
      ...prevValues,
      batch_type: option,
    }));

    if(batchFormData.dayWiseRecords){
      const updatedBatchTypeRecords = batchFormData.dayWiseRecords.map(record => ({
        ...record,
        batchType:'',
      }));
  
      // Update the state with modified data
      setBatchFormData(prevData => ({
        ...prevData,
        dayWiseRecords: updatedBatchTypeRecords
      }));
     }
    }
    //  validateBatchFields("batch_type", option);
  };

  const handleBatchSubTypeNameSelect = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      batch_sub_type: option,
    }));
    //  validateBatchFields("batch_sub_type", option);
  
  };
  

  const handleInstructorChange = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      instructor_id: option,
    }));
    // validateBatchFields("instructor_id", option);
  };

  const handleLocationChange = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      location: option,
    }));
    validateBatchFields("location", option);

    if(batchFormData.start_date){
       handlebatchIdGen(batchFormData.start_date,option.label);
    }

  };



  const handelModeSelect = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      mode: option,
    }));

    validateBatchFields("mode", option);
  };

  const handelPeriodSelect = (option) => {
    if(!batchFormData.start_date){
      toast.error("Batch start date can not be empty");
    }
    setBatchFormData((prevValues) => ({
      ...prevValues,
      autoBatchPeriod: option,
      autoBatchPattern: {},
    }));
  };

  const handelPatternSelect = (option) => {
      if(!batchFormData.start_date){
      toast.error("Batch start date can not be empty");
    }
    setBatchFormData((prevValues) => ({
      ...prevValues,
      autoBatchPattern: option,
    }));
  };



const autoBatchHandle = () => {
  const newValue = !autoBatchOnOff;
  setAutoBatchOnOff(newValue);
  setBatchFormData((prevValues) => {
    const updated = {
      ...prevValues,
      autoBatch: newValue,
    };
    return updated;
  });
};


  const handlebatchIdGen = (date,batch_location) => {
    

    let courseresult="";let batch_type="";let batch_sub_type="";

    if(batchFormData.course_id && courseListOtherOptions && batchFormData.course_id.length > 0 && Object.values(courseListOtherOptions).length > 0){
       const courses = batchFormData.course_id;
       const ids = courses.map(item => item.value);
       courseresult = ids.map(id => courseListOtherOptions[id]).join('-');
       courseresult = courseresult + "-";
    }

    if(batchFormData.batch_type && batchFormData.batch_type.value){
       batch_type = batchFormData.batch_type.value;
       batch_type = batch_type + "-";
    }

    if(batchFormData.batch_sub_type && batchFormData.batch_sub_type.value){
       batch_sub_type = batchFormData.batch_sub_type.value;
       batch_sub_type = batch_sub_type + "-";
    }

    if(batchFormData.batch_sub_type && batchFormData.batch_sub_type.value){
       batch_sub_type = batchFormData.batch_sub_type.value;
       batch_sub_type = batch_sub_type + "-";
    }

    if(batch_location === undefined){
      if(batchFormData.location && batchFormData.location.label){
        batch_location = batchFormData.location.label + "-";
       }else{
        batch_location ="";
      }
      
    }else{
      batch_location = batch_location + "-";
    }
    
    
    const startDateString = date ? date : batchFormData.start_date;
    
      const [day, month, year] = startDateString.split("/").map(Number);
      const startDate = new Date(year, month - 1, day);
    
   
    if (isNaN(startDate)) {
      console.error("Invalid start date:", batchFormData.start_date);
      return;
    }

    const newStartDate = formatDate(startDate);

    setGenBatchId(batch_type + batch_sub_type + courseresult + batch_location + newStartDate);
    setBatchFormData((prevValues) => ({
      ...prevValues,
      batch_name: batch_type + batch_sub_type + courseresult + batch_location + newStartDate,
    }));

  };


  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad if necessary
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = monthNames[date.getMonth()]; // Get month name
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

    return `${day} ${month} ${year}`; // Return formatted date
  };

  const formatNumber = (num) => {
    return String(num).padStart(2, "0");
  };

  const handleDateChange = (date, fieldName, index = null) => {
    if (fieldName === "start_date" && date) {
      const formattedDate = moment(date).format("DD/MM/YYYY"); // Format date
      const dayOfWeek = moment(date).format("dddd");

      const isInOnDays = batchFormData.on_days.includes(dayOfWeek);
      // Update on_days
      const updatedOnDays = isInOnDays
        ? batchFormData.on_days // Dont do anything if exists
        : [...batchFormData.on_days, dayOfWeek]; // Add if not exists

      const dayRecord = {
        label: dayOfWeek,
        value: dayOfWeek,
      };

      setDayRecordData(dayRecord);

      // Update batch_on_days
      const updatedBatchOnDays = isInOnDays
        ? batchFormData.batch_on_days.filter((day) => day.label !== dayOfWeek) // Remove from batch_on_days if it was in on_days
        : [...batchFormData.batch_on_days, dayRecord]; // Add to batch_on_days if it was not in on_days

      setBatchFormData((prevValues) => ({
        ...prevValues,
        start_date: formattedDate, // Store as formatted string
        on_days: updatedOnDays,
        batch_on_days: updatedBatchOnDays,
        startDateDay: {
          value: dayOfWeek,
          label: dayOfWeek,
        },
        dayWiseRecords: prevValues.dayWiseRecords.map((record) => ({
          ...record,
          dayRecord: {
            value: dayOfWeek,
            label: dayOfWeek,
          },
        })),
      }));

      if (courseDuration) {
        const formattedEndDate = date
          ? moment(date).add(courseDuration, "days").format("DD/MM/YYYY")
          : null;
        setBatchFormData((prevValues) => ({
          ...prevValues,
          end_date: formattedEndDate,
        }));
      }

      validateBatchFields("start_date", formattedDate);
      
      handlebatchIdGen(formattedDate);

    } else if (fieldName === "end_date") {
      const formattedEndDate = date ? moment(date).format("DD/MM/YYYY") : null; // Format end date if applicable
      setBatchFormData((prevValues) => ({
        ...prevValues,
        end_date: formattedEndDate, // Store formatted end date
      }));
      validateBatchFields("end_date", formattedEndDate);
    } else if (fieldName === "repeatDate" && index !== null) {
      const formattedRepeatDate = date
        ? moment(date).format("DD/MM/YYYY")
        : null; // Format repeat date if applicable
      setBatchFormData((prevValues) => ({
        ...prevValues,
        dayWiseRecords: prevValues.dayWiseRecords.map((record, idx) =>
          idx === index
            ? { ...record, repeatDate: formattedRepeatDate }
            : record
        ),
      }));
    }
  };

  const handleDaySelection = (selectedValue) => {
    const dayRecord = {
      label: selectedValue,
      value: selectedValue,
    };

    // Determine if the selectedValue is currently in on_days
    const isInOnDays = batchFormData.on_days.includes(selectedValue);

    // Update on_days
    const updatedOnDays = isInOnDays
      ? batchFormData.on_days.filter((day) => day !== selectedValue) // Remove if exists
      : [...batchFormData.on_days, selectedValue]; // Add if not exists

    // Update batch_on_days
    const updatedBatchOnDays = isInOnDays
      ? batchFormData.batch_on_days.filter((day) => day.label !== selectedValue) // Remove from batch_on_days if it was in on_days
      : [...batchFormData.batch_on_days, dayRecord]; // Add to batch_on_days if it was not in on_days

    // Set the updated state
    setBatchFormData({
      ...batchFormData,
      on_days: updatedOnDays,
      batch_on_days: updatedBatchOnDays,
    });

    validateBatchFields("on_days", updatedOnDays);
  };


  const handleStatusChange = (e) => {
    const { value } = e.target;
      if(allotedStudent > 0 && (value == 2 || value == 0)){
         toast.warning("Batch Already Alloted to student can't reject Or Draft This Batch");
          return false;
      }
      
    setBatchFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };
/*
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setBatchFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };
*/
  const handleDayWiseChange = (index, field, value) => {
    const updatedDayWiseRecords = [...batchFormData.dayWiseRecords];
    updatedDayWiseRecords[index] = {
      ...updatedDayWiseRecords[index],
      [field]: value,
    };
    setBatchFormData({
      ...batchFormData,
      dayWiseRecords: updatedDayWiseRecords,
    });

    validateBatchFields(
      field,
      value,
      updatedDayWiseRecords[index],
      "dayWiseRecords",
      index
    );
  };
  const handleCoinstructor = (index, selectedValue) => {
    const updatedDayWiseRecords = [...batchFormData.dayWiseRecords];

    // Check if the selected value already exists in the coInstructor array
    const isInCoInstructor =
      updatedDayWiseRecords[index].coInstructor.includes(selectedValue);

    // Update the coInstructor array based on selection/deselection
    const updatedCoInstructor = isInCoInstructor
      ? updatedDayWiseRecords[index].coInstructor.filter(
          (value) => value !== selectedValue
        ) // Remove if it exists
      : [...updatedDayWiseRecords[index].coInstructor, selectedValue]; // Add if not exists

    // Update the specific record
    updatedDayWiseRecords[index] = {
      ...updatedDayWiseRecords[index],
      coInstructor: updatedCoInstructor,
    };

    // Update the state
    setBatchFormData({
      ...batchFormData,
      dayWiseRecords: updatedDayWiseRecords,
    });

    // Validate the updated field
    validateBatchFields(
      "coInstructor",
      updatedCoInstructor,
      updatedDayWiseRecords[index],
      "dayWiseRecords"
    );
  };

  const handleRepeatChange = (index, value, record) => {
    let dayRecordval = dayRecordData;
    if (value === "daily") {
      dayRecordval = "";
    }

    const updatedDayWiseRecords = [...batchFormData.dayWiseRecords];
    updatedDayWiseRecords[index] = {
      ...updatedDayWiseRecords[index],
      repeat: value,
      dayRecord: dayRecordval,
    };
    setBatchFormData({
      ...batchFormData,
      dayWiseRecords: updatedDayWiseRecords,
    });

    getBatchClassDaily(updatedDayWiseRecords);

    checkConflictionValidationFields(updatedDayWiseRecords[index]);
    
  };

  const handleDayWiseTimeChange = (index, timeData, period) => {
    const updatedRecords = [...batchFormData.dayWiseRecords];
    updatedRecords[index][period === "from" ? "start_time" : "end_time"] =
      timeData;

    setBatchFormData((prevData) => ({
      ...prevData,
      dayWiseRecords: updatedRecords,
    }));
  };

  const addNewRecord = () => {
    setBatchFormData((prevState) => ({
      ...prevState,
      dayWiseRecords: [
        ...prevState.dayWiseRecords,
        {
          id: Date.now() + "_new",
          batchType: "",
          start_time: { hour: "09", minute: "00", ampm: "AM" },
          end_time: { hour: "09", minute: "30", ampm: "AM" },
          mode: "",
          link: "",
          location: "",
          instructorName: "",
          coInstructor: "",
          additionalNotes: "",
          subject: "",
          repeat: "",
          repeatDate: "",
          multiDate: [],
          startDate: "",
          endDate: "",
          status: "1",
        },
      ],
    }));
  };

  const handleDeleteDayWiseRecord = (id) => {
    const updatedRecords = batchFormData.dayWiseRecords.map((record) =>
      record.id === id ? { ...record, status: "0" } : record
    );
    setBatchFormData({ ...batchFormData, dayWiseRecords: updatedRecords });
  };
  const openBlogListPage = () => {
    navigate("/class-management");
  };

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };

  useEffect(() => {
    getBatchData();
  }, []);

  const getBatchData = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=getBatchData`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        //bid:id?id:bid,
        bid: id ? id : "",
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        const respData = response.data.data;

        if(respData.batchdetail.autoBatch){
          setAutoBatchOnOff(respData.batchdetail.autoBatch);
        }

        if(respData.batchdetail.alloted_student){
          setAllotedStudent(respData.batchdetail.alloted_student);
        }
   
        if (respData.batchdetail) {
          if (Object.values(respData.batchdetail).length > 0) {
            setBatchFormData(respData.batchdetail);

            getMaxEndDate(respData.batchdetail.dayWiseRecords);
            getBatchStartDate(respData.batchdetail.dayWiseRecords);
            getBatchClassDaily(respData.batchdetail.dayWiseRecords);
            
          }
        }

        if(respData.batchdetail.batch_start_status){
          setBatchStartStatus(respData.batchdetail.batch_start_status);
        }

        if(respData.batchdetail.batch_end_status){
          setBatchEndStatus(respData.batchdetail.batch_end_status);
        }

        if (respData.instructors) {
          if (Object.values(respData.instructors).length > 0) {
            setInstructorOptions(respData.instructors);
            setCoInstructorOptions(respData.instructors);
          }
        }

        if (respData.instructors) {
          if (Object.values(respData.instructors).length > 0) {
            setInstructorOptions(respData.instructors);
            setCoInstructorOptions(respData.instructors);
          }
        }

        if (respData.course_list) {
          if (Object.values(respData.course_list).length > 0) {
            setCourseListOptions(respData.course_list);
          }
        }

        if (respData.subject_list) {
          if (Object.values(respData.subject_list).length > 0) {
            setSubjectOptions(respData.subject_list);
          }
        }

        

        if (respData.locations) {
          if (Object.values(respData.locations).length > 0) {
            setLocationOptions(respData.locations);
          }
        }

        if (respData.classroom) {
          if (Object.values(respData.classroom).length > 0) {
            setRoomOptions(respData.classroom);
          }
        }

        

        if (respData.disableDates) {
          const addDisableDates = (disableDates, respDisableDates) => {
            if (respDisableDates) {
              // Ensure all dates are parsed into Date objects
              const parsedDates = respDisableDates
                .map((dateString) => parseDate(dateString)) // Parse all dates
                .filter(
                  (
                    date,
                    index,
                    self // Remove duplicates based on timestamp
                  ) =>
                    index ===
                    self.findIndex((d) => d.getTime() === date.getTime())
                );

              // Return the updated list of unique disable dates
              return [...disableDates, ...parsedDates];
            }
            return disableDates;
          };

          // Assuming respData is an object with disableDates (array of date strings)
          if (respData.disableDates) {
            if (Object.values(respData.disableDates).length > 0) {
              // Initialize disableDates as an empty array
              let disableDates = [];

              // Add parsed dates from respData.disableDates
              disableDates = addDisableDates(
                disableDates,
                respData.disableDates
              );

              // Update the state or handle the dates as needed
              setDisabledDates(disableDates);
            }
          }
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=addbatch`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        batchFormData: batchFormData,
        bid: id ? id : bid,
        courseDuration:courseDuration,
        batchStartDate:batchStartDate,
        batchEndDate:batchEndDate,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === 1) {
          if (response.data.data.insert_id) {
            setBid(response.data.data.insert_id);
          }
          navigate("/class-management");
          toast.success(response.data.data.msg);
        } else {
          if (response.data.data.errorlist) {
            setErrorMsgData(response.data.data.errorlist);
          }
        }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
  };

  function handleCategory(category_id) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=getCourseList`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        category_id: category_id,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        
        if (response.data.data.status === '1') {

            if (Object.values(response.data.data.course_list).length > 0) {
              setCourseListOptions(response.data.data.course_list);
            }


            if (Object.values(response.data.data.course_list_other).length > 0) {
              setCourseListOtherOptions(response.data.data.course_list_other);
            }
        }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
  }

  function handleCourse(course_ids) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=getCourseDetail`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        course_id: course_ids,
        category_id: batchFormData.category_id.value,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        
        if (response.data.data.status === 1) {
          if(response.data.data.subject_list){
            if(batchFormData.dayWiseRecords){
              const updatedSubjectRecords = batchFormData.dayWiseRecords.map(record => ({
                ...record,
                subject:'',
              }));
          
              // Update the state with modified data
              setBatchFormData(prevData => ({
                ...prevData,
                dayWiseRecords: updatedSubjectRecords
              }));
            
            }

            if(Object.values(response.data.data.subject_list).length > 0) {
              setSubjectOptions(response.data.data.subject_list);
            }else{
              setSubjectOptions([]);
            }
          }
          
           setCourseDuration(response.data.data.course_duration);
          // if (response.data.data.category_short_name) {
          //   setCourseCategorySname(response.data.data.category_short_name);
          //   handlebatchIdGen(response.data.data.category_short_name, course_id);
          // }

        }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
  }

  // Function to convert "DD/MM/YYYY" format to a Date object
  const parseDateString = (dateString, type) => {
    if (dateString !== null) {
      const [day, month, year] = dateString.split("/").map(Number);
      return new Date(year, month - 1, day); // month - 1 for 0-indexing
    } else if (type === "start") {
      return new Date();
    } else if (type === "end") {
      return null;
    }
  };

  const [startDate, setStartDate] = useState(
    batchFormData.start_date ? batchFormData.start_date : new Date()
  );

  const [endDate, setEndDate] = useState(
    batchFormData.end_date ? batchFormData.end_date : null
  );

  const minDateSelect = parseDateString(
    batchFormData.start_date ? batchFormData.start_date : null,
    "start"
  );
  const maxDateSelect = parseDateString(
    batchFormData.end_date ? batchFormData.end_date : null,
    "end"
  );

  const [selectedDates, setSelectedDates] = useState([]);

  const handleMDateChange = (date, record, index) => {
    if (date) {
      const dateString = moment(date).format("DD-MM-YYYY");

      setSelectedDates((prevDates) => {
        // Determine if the date is being selected or unselected
        const isSelected = prevDates.includes(dateString);

        const newDates = isSelected
          ? prevDates.filter((d) => d !== dateString) // Remove the date if it was already selected
          : [...prevDates, dateString]; // Add the date if it was not selected

        setBatchFormData((prevFormData) => {
          const updatedDayWiseRecords = [...prevFormData.dayWiseRecords];
          const existingMultiDates =
            updatedDayWiseRecords[index]?.multiDate || [];

          let updatedMultiDates;

          if (isSelected) {
            // If the date was selected, remove it from multiDates
            updatedMultiDates = existingMultiDates.filter(
              (d) => d !== dateString
            );
          } else {
            // If the date was unselected, add it to multiDates
            updatedMultiDates = Array.from(
              new Set([...existingMultiDates, dateString])
            );
          }

          updatedDayWiseRecords[index] = {
            ...updatedDayWiseRecords[index],
            multiDate: updatedMultiDates,
          };

          getMaxEndDate(updatedDayWiseRecords);
          getBatchStartDate(updatedDayWiseRecords);
          return {
            ...prevFormData,
            dayWiseRecords: updatedDayWiseRecords,
          };
          
        });

        return newDates; // Return the updated dates
      });
    }

    
  };

  let displayIndex = 1;

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      // setDatePickerOpen(false);
      setOpenDatePickerIndexR(null);
    }
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target)
    ) {
      setOpenDatePickerIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, []);

  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection", // A unique key for the range (required by the component)
    },
  ]);
  const [showDateInput, setShowDateInput] = useState(true);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [openDatePickerIndex, setOpenDatePickerIndex] = useState(null);
  const [openDatePickerIndexR, setOpenDatePickerIndexR] = useState(null);

  const handleDateRangeChange = (dates, index) => {
    setStartDate(dates.selection.startDate);
    setEndDate(dates.selection.endDate);
    setDateRangeValue([dates.selection]);

    const updatedDayWiseRecords = [...batchFormData.dayWiseRecords];
    updatedDayWiseRecords[index] = {
      ...updatedDayWiseRecords[index],
      startDate: dates.selection.startDate
        ? moment(dates.selection.startDate).format("DD-MM-YYYY")
        : null,
      endDate: dates.selection.endDate
        ? moment(dates.selection.endDate).format("DD-MM-YYYY")
        : null,
    };
    setBatchFormData({
      ...batchFormData,
      dayWiseRecords: updatedDayWiseRecords,
    });
    // setOpenDatePickerIndex(null);
    getMaxEndDate(updatedDayWiseRecords);
    getBatchStartDate(updatedDayWiseRecords);

    checkConflictionValidationFields(updatedDayWiseRecords[index]);
  
  };

    
  const checkConflictionValidationFields = (daywiseData) => {
    let callFunction = []; 
    errorMsg = errorMsgData;

     if(batchFormData.on_days.length < 1) {
      toast.warning("Please Select Batch On Days");
      callFunction.push("on_days");
      }

      if (daywiseData.repeat?.value) {
      const { value } = daywiseData.repeat;
      if (value === "daily" || value === "weekly") {
      if (!(daywiseData.startDate && daywiseData.endDate)) {
        errorMsg["dates" + daywiseData.id] = "Please select Class dates";
        callFunction.push("dates");
      }
      if (value === "weekly" && !daywiseData.dayRecord?.value) {
        errorMsg["dayRecord" + daywiseData.id] = "Please select day";
        callFunction.push("dayRecord");
      }
      } else if (value === "repeatDate" && daywiseData.multiDate.length < 1) {
      errorMsg["dates" + daywiseData.id] = "Please select Class dates";
      callFunction.push("dates");
      }
      }else {
      errorMsg["repeat" + daywiseData.id] = "Please select Class Frequency";
      callFunction.push("repeat");
      }
     
      if (!daywiseData.instructorName?.value) {
        errorMsg["instructorName" + daywiseData.id] = `Please select Instructor`;
        callFunction.push("instructorName");
      } 

      if(daywiseData.mode?.value) {
        if(daywiseData.mode.value ==="Offline"){
          if (!daywiseData.room?.value) {
            errorMsg["room" + daywiseData.id] = `Please select ClassRoom`;
            callFunction.push("room");
          }
        }else if(daywiseData.mode.value ==="Hybrid"){
          if (!(daywiseData.room?.value || daywiseData.link)) {
            errorMsg["room" + daywiseData.id] = `Please select ClassRoom or Fill Online Link`;
            callFunction.push("room");
          }else{
            errorMsg["room" + daywiseData.id] = "";
            
          }
        }
      }



      if (callFunction.length > 0) {
        setErrorMsgData((prevErrors) => ({
            ...prevErrors,  
            ...errorMsg     
        }));
        return false;
    }else{
      if(daywiseData.mode?.value) {
        if(daywiseData.mode.value ==="Offline"){
          if (daywiseData.room?.value) {
            checkClassRoom(daywiseData);
          }
        }else if(daywiseData.mode.value ==="Hybrid"){
          if (daywiseData.room?.value) {
            checkClassRoom(daywiseData);
          }
        }
      }
         checkInstructor(daywiseData);
      }
  }
  


  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const daysToEnable = batchFormData.on_days ? batchFormData.on_days : [];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const isDisabledDate = (date) => {
    const enableDates = {
      Sunday: daysToEnable.includes("Sunday"),
      Monday: daysToEnable.includes("Monday"),
      Tuesday: daysToEnable.includes("Tuesday"),
      Wednesday: daysToEnable.includes("Wednesday"),
      Thursday: daysToEnable.includes("Thursday"),
      Friday: daysToEnable.includes("Friday"),
      Saturday: daysToEnable.includes("Saturday"),
    };

    const day = date.getDay();
    const dayName = dayNames[day];
    const isEnabled = enableDates[dayName];

    const isSpecificDisabled = disabledDates.some((disabledDate) =>
      isSameDay(disabledDate, date)
    );
    return !isEnabled || isSpecificDisabled;
  };

  const toggleDateRangePicker = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const dateRangePickerRef = useRef(null);

  useEffect(() => {}, [dateRangeValue, startDate, endDate]);

  //=========check instructor confliction==========
  function checkInstructor(daywiseData) {
    if(batchFormData.on_days.length < 0){
      toast.warning("Select On days");
    }
    if(!(daywiseData.repeat && daywiseData.repeat.value)){
      toast.warning("Select Class Frequency");
      }
    
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=checkInstructorConflict`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        b_id: id ? id : "",
        on_days:batchFormData.on_days,
        daywiseData: daywiseData,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === 1) {
          if(response.data.data.msg){
           toast.warning(response.data.data.msg);
          }
          if(response.data.data.msgconflict){
          setInstConflictMessage(response.data.data.msgconflict);
          }else{
          setInstConflictMessage("");
          }
          
        }else{
          setInstConflictMessage("");
        }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
  }

  //=========check instructor confliction==========
  function checkClassRoom(daywiseData) {

    if(batchFormData.on_days.length < 0){
      toast.warning("Select On days");
    }

    if(!(daywiseData.repeat && daywiseData.repeat.value)){
        toast.warning("Select Class Frequency");
    }

    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=checkRoomConflict`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        b_id: id ? id : "",
        on_days:batchFormData.on_days,
        daywiseData: daywiseData,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === 1) {
          if(response.data.data.msg){
            toast.warning(response.data.data.msg);
           }
           if(response.data.data.msgconflict){
            setRoomConflictMessage(response.data.data.msgconflict);
            }else{
            setRoomConflictMessage("");
            }
        }else{
          setRoomConflictMessage("");
          }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
  }



  function handleLocation(index, room, value) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=getRoomList`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        loc_id: value.value,
      },
    })
      .then(function (response) {
        checkUserLogin(response);

          setBatchFormData((prevValues) => {
          const updatedDayWiseRecords = [...prevValues.dayWiseRecords];
          updatedDayWiseRecords[index] = {
            ...updatedDayWiseRecords[index],
            room: "",
          };
          return {
            ...prevValues,
            dayWiseRecords: updatedDayWiseRecords,
          };
          });
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
  }


  function handleDaywiseGenerate() {
    
    if(batchFormData.on_days.length < 1){
      toast.error("Please select Batch on days first");
      return false;
    }else{

    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=getDaywiseList`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        course_id: batchFormData.course_id,
        start_date: batchFormData.start_date,
        on_days: batchFormData.on_days,
        batch_type: batchFormData.batch_type,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === '1') {
            if(response.data.data.daywisedata){
              const daywisedataList = response.data.data.daywisedata;  
            setBatchFormData(prevData => ({
                ...prevData,
                dayWiseRecords: daywisedataList
              }));

              toast.success(response.data.data.msg);
            }else{
              toast.warning(response.data.data.msg);
            }
          }else{
            toast.warning(response.data.data.msg);
          }


      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      });
    }
  }



  
  const getMaxEndDate = (updatedDayWiseRecords) => {
    const dates = [];
  if(updatedDayWiseRecords && updatedDayWiseRecords){
    updatedDayWiseRecords.forEach((record) => {
      // Add endDate if it exists
      if (record.endDate) {
        const formattedEndDate = new Date(
          record.endDate.split("-").reverse().join("-")
        );
        dates.push(formattedEndDate);
      }
  
      // Add all multiDate entries if they exist
      if (record.multiDate?.length) {
        record.multiDate.forEach((date) => {
          const formattedDate = new Date(date.split("-").reverse().join("-"));
          dates.push(formattedDate);
        });
      }
    });
  
    // Find the maximum date
    const maxDate = dates.length
      ? new Date(Math.max(...dates.map((date) => date.getTime())))
      : null;
  
    const returndate = maxDate ? maxDate : "No dates available";

    const day = String(returndate.getDate()).padStart(2, "0");
    const month = String(returndate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = returndate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    setBatchEndDate(formattedDate);
    
   }
  };


  

  const getBatchStartDate = (updatedDayWiseRecords) => {
   
    const dates = [];
    if(updatedDayWiseRecords && updatedDayWiseRecords){
      updatedDayWiseRecords.forEach((record) => {

        if (record.startDate) {
          const formattedStartDate = new Date(
            record.startDate.split("-").reverse().join("-")
          );
          dates.push(formattedStartDate);
        }
    
        if (record.multiDate?.length) {
          record.multiDate.forEach((date) => {
            const formattedDate = new Date(date.split("-").reverse().join("-"));
            dates.push(formattedDate);
          });
        }
      });
    
      const minDate = dates.length
        ? new Date(Math.max(...dates.map((date) => date.getTime())))
        : null;
    
      const returndate = minDate ? minDate : "No dates available";

      const day = String(returndate.getDate()).padStart(2, "0");
      const month = String(returndate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = returndate.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      setBatchStartDate(formattedDate);
      
      const formattedMinDate = formattedDate; 
      const mindayOfWeek = moment(minDate).format("dddd");

      setWeeklyOptions([
       { value: `${mindayOfWeek}`, label: `Same Weekday (e.g., every ${mindayOfWeek})` },
      ]);
    
      setMonthlyOptions([
        { value:`0_${formattedMinDate}`, label: `Same Date (e.g., ${formattedMinDate} of each month)` },
        { value:`1_${mindayOfWeek}`, label: `Every 1st ${mindayOfWeek} in same month` },
        { value:`2_${mindayOfWeek}`, label: `Every 2nd ${mindayOfWeek} in same month` },
        { value:`3_${mindayOfWeek}`, label: `Every 3rd ${mindayOfWeek} in same month` },
        { value:`4_${mindayOfWeek}`, label: `Every 4th ${mindayOfWeek} in same month` },
      ]);
    }
   
  };


  
   const getBatchClassDaily = (updatedDayWiseRecords) => {
  
    if(updatedDayWiseRecords && updatedDayWiseRecords){
      updatedDayWiseRecords.forEach((record) => {
            
         if (record.repeat.value === 'weekly' || record.repeat.value === 'repeatDate') {
            setHasDailyFrequency(false);
          }else{
            setHasDailyFrequency(true);
          }

      });
    }
  };

  const setShowToast = (e) => {
   setRoomConflictMessage("");
   setInstConflictMessage("");
  };
  
  
  return (
    <>
      <InnerHeader
        heading="Add Batches"
        txtSubHeading="Use this form to add a new batch. Provide the batch details and any other relevant information."
        showButton={true}
        onClick={openBlogListPage}
        iconText="View List"
      />
      <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
      <div className="batch-main-grp-inputs batch-form-grp mb16 v-center jcsb fww bg8 pl20 pr20 pt20 pb20">

          <div className="inp-design course-name flx31">
            <SingleDropdown
              label="Category Name"
              options={categoryOptions}
              selectedOption={batchFormData.category_id}
              onSelect={handleCategoryNameSelect}
              search
              compulsory={<span className="fc4">*</span>}
              isReadOnly={batchFormData.batch_start_status}
            />
            {<p className="error-text">{errorMsgData.category_id}</p>}
          </div>

          <div className="inp-design course-name flx31">
            <SingleDropdown
              label="Batch Type"
              options={batchTypeOptions}
              selectedOption={batchFormData.batch_type}
              onSelect={handleBatchTypeNameSelect}
              search
              compulsory={<span className="fc4">*</span>}
              isReadOnly={batchFormData.batch_start_status}
            />
            {<p className="error-text">{errorMsgData.batch_type}</p>}
          </div>

        {batchFormData.category_id && batchFormData.category_id.value === '3' && (
          <div className="inp-design course-name flx31">
            <SingleDropdown
              label="Batch Sub Type"
              options={subTypeOptions}
              selectedOption={batchFormData.batch_sub_type}
              onSelect={handleBatchSubTypeNameSelect}
              search
              compulsory={<span className="fc4">*</span>}
              isReadOnly={batchFormData.batch_start_status}
            />
            {<p className="error-text">{errorMsgData.batch_sub_type}</p>}
          </div>
        )}

          {/* <div className="inp-design course-name flx31">
          <label className="fc15 fw6 fs14 mb12 ls1">
              Course Name
              <span className="fc4">*</span>
            </label>
               <MultiselectDropdown
                  options={courseListOptions}
                  selectedOption={batchFormData.course_id}
                  placeholder={"Search Courses"}
                  onSelectionChange={handleCourseNameSelect}
                  noChip={true}
                  disabled={batchFormData.batch_start_status}
                />
            {<p className="error-text"></p>}
          </div> */}

          <div className="batch-course-name course-name flx31">
          <label className="fc15 fw6 fs14 mb12 ls1">
              Course Name
              <span className="fc4">*</span>
            </label>
               <MultiselectDropdown
                  options={courseListOptions}
                  selectedOption={batchFormData.course_id}
                  placeholder={"Search Courses"}
                  onSelectionChange={handleCourseNameSelect}
                  noChip={true}
                  disabled={batchFormData.batch_start_status}
                />
            {<p className="error-text"></p>}
          </div>


          <div className="inp-design batch-name flx31 calendar-input ">
            <label className="fc15 fw6 fs14 mb12 ls1">
              Start Date
              <span className="fc4">*</span>
            </label>
            <DatePicker
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date()}
              dateFormat={customDateFormat}
              selected={
                batchFormData.start_date
                  ? moment(batchFormData.start_date, "DD/MM/YYYY").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "start_date")}
              placeholderText="Select start date"
              showIcon={false}
              isClearable={false}
              disabled={batchFormData.batch_start_status}
              className={`${batchFormData.batch_start_status ? "disabled-input bg6" : ""}`}
            />
            {<p className="error-text">{errorMsgData.start_date}</p>}
          </div>

          
         

          <div className="inp-design batch-name flx31">
            <p className="fc15 fw6 fs14 ls1">
              Batch Name<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="batch_name"
              placeholder="Enter a unique name for the batch"
              autoComplete="off"
              value={batchFormData.batch_name}
              onChange={handleInputChange}
              disabled={batchFormData.batch_start_status}
              className={`${batchFormData.batch_start_status ? "disabled-input bg6" : ""}`}
            />
            {<p className="error-text">{errorMsgData.batch_name}</p>}
          </div>

          <div className="inp-design searching-drop flx31">
            <p className="fc15 fw6 fs14 ls1 mb8">
              On Days<span className="fc4">*</span>
            </p>
            <MultiDropdown
              label="On Days"
              options={dayOptions}
              selectedValues={batchFormData.on_days}
              onSelect={handleDaySelection}
              isReadOnly={batchFormData.batch_start_status}
            />
            {<p className="error-text">{errorMsgData.on_days}</p>}
          </div>

          {/* <div className="inp-design batch-name flx31 calendar-input ">
            <label className="fc15 fw6 fs14 mb12 ls1">
              End Date
              <span className="fc4">*</span>
            </label>
            <DatePicker
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date()}
              dateFormat={customDateFormat}
              selected={
                batchFormData.end_date
                  ? moment(batchFormData.end_date, "DD/MM/YYYY").toDate()
                  : null
              }
              onChange={(date) => handleDateChange(date, "end_date")}
              placeholderText="Select end date"
              showIcon={false}
              isClearable={false}
              disabled={true}
            />
            {<p className="error-text">{errorMsgData.end_date}</p>}
          </div> */}

          <div className=" batch-name flx31">
            <TimePicker
              fromTime={batchFormData.start_time}
              toTime={batchFormData.end_time}
              onTimeChange={handleBatchTimeChange}
              compulsory={<span className="fc4">*</span>}
              isDisabled={batchFormData.batch_start_status}
            />
            {<p className="error-text">{errorMsgData.start_time}</p>}
            {<p className="error-text">{errorMsgData.end_time}</p>}
          </div>

          {/* <div className="inp-design batch-name flx31">
            <p className="fc15 fw6 fs14 ls1">
              Batch ID<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="batch_id"
              placeholder="Enter batch id"
              autoComplete="off"
              value={batchFormData.batch_id}
              onChange={handleInputChange}
              disabled={id ? true : false}
              className={`${batchStartStatus ? "disabled-input bg6" : ""}`}
            />
            {<p className="error-text">{errorMsgData.batch_id}</p>}
          </div> */}

          <div className="inp-design batch-name flx31">
            <p className="fc15 fw6 fs14 ls1">
              Maximum Students Allowed<span className="fc4">*</span>
            </p>
            <input
              type="number"
              name="max_allow_stu"
              placeholder="Enter max student number"
              autoComplete="off"
              value={batchFormData.max_allow_stu}
              onChange={handleInputChange}
              min="100"
              max="999"
              onInput={(e) => {
                // Restrict input to three digits only
                if (e.target.value.length > 3) {
                  e.target.value = e.target.value.slice(0, 3);
                }
              }}
              disabled={batchFormData.batch_start_status}
              className={`${batchFormData.batch_start_status ? "disabled-input bg6" : ""}`}
            />
            {<p className="error-text">{errorMsgData.max_allow_stu}</p>}
          </div>
          <div className="inp-design batch-name flx31">
            <p className="fc15 fw6 fs14 ls1">
              Minimum Students Required<span className="fc4">*</span>
            </p>
            <input
              type="number"
              name="min_stu_req"
              placeholder="Enter min student number"
              autoComplete="off"
              value={batchFormData.min_stu_req}
              onChange={handleInputChange}
              min="100"
              max="999"
              onInput={(e) => {
                // Restrict input to three digits only
                if (e.target.value.length > 3) {
                  e.target.value = e.target.value.slice(0, 3);
                }
              }}
              disabled={batchFormData.batch_start_status}
              className={`${batchFormData.batch_start_status ? "disabled-input bg6" : ""}`}
            />
            {<p className="error-text">{errorMsgData.min_stu_req}{errorMsgData.stu_count_req}</p>}
          </div>

          <div className="inp-design course-name flx31">
            <SingleDropdown
              label="Mode"
              options={modeOptions}
              selectedOption={batchFormData.mode}
              onSelect={handelModeSelect}
              compulsory={<span className="fc4">*</span>}
              isReadOnly={batchFormData.batch_start_status}
            />
            {<p className="error-text">{errorMsgData.mode}</p>}
          </div>

          {batchFormData.mode && batchFormData.mode.value === "Online" && (
            <>
              <div className="inp-design batch-name flx31">
                <p className="fc15 fw6 fs14 ls1">
                  Online Link
                  {/* <span className="fc4">*</span> */}
                </p>
                <input
                  type="text"
                  name="online_link"
                  placeholder="Enter online link"
                  autoComplete="off"
                  value={batchFormData.online_link}
                  onChange={handleInputChange}
                  disabled={batchFormData.batch_start_status}
                />
                {(<p className='error-text'></p>)}
              </div>
              {/* <div className="inp-design batch-name flx31"></div> */}
            </>
          )}

          {batchFormData.mode && batchFormData.mode.value === "Offline" && (
            <>
              <div className="inp-design batch-name flx31">
                <SingleDropdown
                  label="Location"
                  options={locationOptions}
                  selectedOption={batchFormData.location}
                  onSelect={handleLocationChange}
                  search
                  isReadOnly={batchFormData.batch_start_status}
                  // compulsory={<span className="fc4">*</span>}
                />
                { (<p className='error-text'></p>)}
              </div>
              {/* <div className="inp-design batch-name flx31"></div> */}
            </>
          )}

          {batchFormData.mode && batchFormData.mode.value === "Hybrid" && (
            <>
              <div className="inp-design batch-name flx31">
                <SingleDropdown
                  label="Location"
                  options={locationOptions}
                  selectedOption={batchFormData.location}
                  onSelect={handleLocationChange}
                  search
                  isReadOnly={batchFormData.batch_start_status}
                  // compulsory={<span className="fc4">*</span>}
                />
                {(<p className='error-text'></p>)}
              </div>
              <div className="inp-design batch-name flx31">
                <p className="fc15 fw6 fs14 ls1">
                  Online Link
                  {/* <span className="fc4">*</span> */}
                </p>
                <input
                  type="text"
                  name="online_link"
                  placeholder="Enter online link"
                  autoComplete="off"
                  value={batchFormData.online_link}
                  onChange={handleInputChange}
                  disabled={batchFormData.batch_start_status}
                />
                {(<p className='error-text'></p>)}
              </div>
              {/* <div className="inp-design batch-name flx31"></div> */}
            </>
          )}

          <div className="inp-design course-name flx31">
            <SingleDropdown
              label="Instructor Name"
              options={instructorOptions}
              selectedOption={batchFormData.instructor_id}
              onSelect={handleInstructorChange}
              search
              isReadOnly={batchFormData.batch_start_status}
              compulsory={<span className="fc4">*</span>}
            />
            <p className="error-text">
              {errorMsgData.instructor_id}
            </p>
          </div>
          <div className="inp-design batch-name flx31"></div>
          
      </div>


{/* =============================Parent Node End========================================== */}

        <div className="day-wise-records-grp pb10 mb16 v-center jcsb fww  meta-grp box-sd1 bg8 pl20 pr20 pt20 pb20">
          <div className="fc15 fw6 fs14 ls1 lh18 mb16">
            Day or time Wise Records
          </div>
          {!id && batchFormData.start_date && batchFormData.course_id &&( 
          <div className="df jce w100">
            <button
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
              onClick={handleDaywiseGenerate}
            >
              Auto-Fill Daywise Record
            </button>
          </div>
          )}
          <>
            {batchFormData.dayWiseRecords &&
              batchFormData.dayWiseRecords.map((record, index) => {
                if (record.status === "1") {
                  let currentDisplayIndex = displayIndex;
                  displayIndex++;

                  return (
                    <div key={`record-${record.id}-${index}`}>
                      {batchFormData.dayWiseRecords.filter(
                        (r) => r.status === "1"
                      ).length > 1 && (
                        <p className="pr20 pt20 fs18 ls1 lh22 fw6">
                          Class {currentDisplayIndex}
                        </p>
                      )}

                      <div
                        className={`day-wise-records-grp v-center jcsb fww w100 ${
                          batchFormData.dayWiseRecords.filter(
                            (r) => r.status === "1"
                          ).length > 1
                            ? "brd-bottom-dotted pt24"
                            : "pt16"
                        }`}
                      >
                        <div className="w100 repeat-des df">
                          <div className="inp-design course-name flx31 mr48">
                            <SingleDropdown
                              label="Class Frequency"
                              options={[
                                { label: "Daily", value: "daily" },
                                { label: "Weekly", value: "weekly" },
                                { label: "Fixed Date", value: "repeatDate" },
                              ]}
                              selectedOption={record.repeat}
                              onSelect={(value) =>
                                handleRepeatChange(index, value, record)
                              }
                              search={false}
                              compulsory={<span className="fc4">*</span>}
                              isReadOnly={batchFormData.batch_start_status}
                            />
                            <p className="error-text">
                              {errorMsgData[`repeat${record.id}`]}
                            </p>
                          </div>
                          {record.repeat.value === "repeatDate" && (
                            <div className="inp-design flx31 mr48 pr">
                              {record.repeat.value === "repeatDate" ? (
                                <>
                                  <p className="fc15 fw6 fs14 ls1">
                                    Class Date<span className="fc4">*</span>
                                  </p>
                                  <input
                                    type="text"
                                    className="w100 cp"
                                    value={
                                      record.repeat.value === "daily" ||
                                      record.repeat.value === "weekly"
                                        ? `${record.startDate ? moment(record.startDate, "DD-MM-YYYY").format("DD/MM/YYYY") : ""} - ${
                                            record.endDate
                                              ? moment(
                                                  record.endDate,
                                                  "DD-MM-YYYY"
                                                ).format("DD/MM/YYYY")
                                              : ""
                                          }`
                                        : record.repeat.value === "repeatDate"
                                          ? record.multiDate
                                              .map((date) =>
                                                moment(
                                                  date,
                                                  "DD-MM-YYYY"
                                                ).format("DD/MM/YYYY")
                                              )
                                              .join(", ")
                                          : ""
                                    }
                                    placeholder="Select dates"
                                    
                                    onClick={() => {
                                    if(!batchFormData.batch_start_status){
                                          setOpenDatePickerIndexR(index)
                                      }
                                  }}

                                  />
                                  <p className="error-text">
                                    {errorMsgData[`dates${record.id}`]}
                                  </p>
                                </>
                              ) : null}
                            </div>
                          )}
                          {openDatePickerIndexR === index && (
                            <div
                              className="calendar-container"
                              ref={calendarRef}
                            >
                              {record.repeat.value === "repeatDate" && (
                                <div className="inp-design batch-name flx31 calendar-input w100 mt12">
                                  <DatePicker
                                    selected={null}
                                    onChange={(date) =>
                                      handleMDateChange(date, record, index)
                                    }
                                    placeholderText="Select dates"
                                    highlightDates={record.multiDate.map(
                                      (date) => {
                                        const [day, month, year] =
                                          date.split("-");
                                        return new Date(year, month - 1, day); // month is 0-indexed
                                      }
                                    )}
                                    isClearable={true}
                                    inline
                                    minDate={minDateSelect}
                                    //maxDate={maxDateSelect}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          <div className={`cls-freq flx31 mr48`}>
                            {(record.repeat.value === "daily" ||
                              record.repeat.value === "weekly") && (
                              <>
                                <p className="fc15 fw6 fs14 ls1 mb8">
                                  Classe Date<span className="fc4">*</span>
                                </p>
                                <div
                                  className="date-range-input"
                                  onClick={() => {
                                 if(!batchFormData.batch_start_status){
                                     setOpenDatePickerIndex(index);
                                  }
                                    handleDayWiseChange(index,"dayCalander","")
                                  }}
                    
                                  style={{
                                    cursor: "pointer",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    color: "#7b7b7b",
                                    fontSize: "14px",
                                    background: "#fff",
                                  }}
                                >
                                  {/* {dateRangeValue ? (
                                  `${format(dateRangeValue[0].startDate, "dd/MM/yyyy")} - ${format(
                                    dateRangeValue[0].endDate,
                                    "dd/MM/yyyy"
                                  )}`
                                ) : (
                                  "Select a date range"
                                )} */}
                                  {record.startDate && record.endDate
                                    ? `${moment(record.startDate, "DD-MM-YYYY").format("DD/MM/YYYY")} - ${moment(record.endDate, "DD-MM-YYYY").format("DD/MM/YYYY")}`
                                    : "Select a date range"}
                                </div>
                                <p className="error-text">
                                  {errorMsgData[`dates${record.id}`]}
                                </p>
                              </>
                            )}

                            {openDatePickerIndex === index && (
                              <div ref={dateRangePickerRef}>
                                <DateRangePicker
                                  onChange={(dates) =>
                                    handleDateRangeChange(dates, index)
                                  }
                                  showSelectionPreview={true}
                                  moveRangeOnFirstSelection={false}
                                  months={1}
                                  ranges={[
                                    {
                                      startDate: record.startDate
                                        ? new Date(
                                            moment(
                                              record.startDate,
                                              "DD-MM-YYYY"
                                            )
                                          )
                                        : new Date(),
                                      endDate: record.endDate
                                        ? new Date(
                                            moment(record.endDate, "DD-MM-YYYY")
                                          )
                                        : new Date(),
                                      key: "selection",
                                    },
                                  ]}
                                  direction="horizontal"
                                  minDate={minDateSelect}
                                  dayContentRenderer={(date) => (
                                    <div
                                      style={{
                                        textDecoration: isDisabledDate(date)
                                          ? "line-through"
                                          : "none",
                                        color: isDisabledDate(date)
                                          ? "#ddd"
                                          : "#000",
                                        pointerEvents: isDisabledDate(date)
                                          ? "none"
                                          : "auto",
                                      }}
                                    >
                                      {date.getDate()}
                                    </div>
                                  )}
                                  disabledDay={isDisabledDate}
                                />
                              </div>
                            )}
                          </div>

                          <div className="inp-design course-name flx31">
                            {record.repeat.value === "weekly" && (
                              <>
                                <SingleDropdown
                                  label="Day"
                                  options={
                                    batchFormData.batch_on_days
                                      ? batchFormData.batch_on_days
                                      : dayOptions
                                  }
                                  selectedOption={
                                    record.dayRecord ||
                                    batchFormData.startDateDay
                                  }
                                  onSelect={(value) =>
                                    handleDayWiseChange(
                                      index,
                                      "dayRecord",
                                      value
                                    )
                                  }
                                  search
                                  compulsory={<span className="fc4">*</span>}
                                />

                                <p className="error-text">
                                  {errorMsgData[`dayRecord${record.id}`]}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="inp-design course-name flx31">
                          <SingleDropdown
                            label="Type"
                            options={batchFormData.batch_type.value == 'Flying'?[{ value: "flying", label: "Flying" }]:typeListOptions}
                            selectedOption={record.batchType}
                            onSelect={(value) =>
                              handleDayWiseChange(index, "batchType", value)
                            }
                            search
                            compulsory={<span className="fc4">*</span>}
                          />
                          <p className="error-text">
                            {errorMsgData[`batchType${record.id}`]}
                          </p>
                        </div>
                        <div className="inp-design course-name flx31">
                          <TimePicker
                            fromTime={record.start_time}
                            toTime={record.end_time}
                            onTimeChange={(time, period) =>
                              handleDayWiseTimeChange(index, time, period)
                            }
                            compulsory={<span className="fc4">*</span>}
                          />
                          {/* <p className='error-text'>{errorMsgData[`schedule${record.id}`]}</p> */}
                          <p className="error-text">
                            {errorMsgData[`start_time${record.id}`]}
                          </p>
                          <p className="error-text">
                            {errorMsgData[`end_time${record.id}`]}
                          </p>
                        </div>
                        <div className="inp-design course-name flx31">
                          <SingleDropdown
                            label="Mode"
                            options={modeOptions}
                            selectedOption={record.mode}
                            onSelect={(value) =>
                              handleDayWiseChange(index, "mode", value)
                            }
                            compulsory={<span className="fc4">*</span>}
                          />
                          <p className="error-text">
                            {errorMsgData[`mode${record.id}`]}
                          </p>
                        </div>
                        {record.mode.value === "Online" && (
                          <div className="inp-design batch-name flx31">
                            <p className="fc15 fw6 fs14 ls1">
                              Online Link
                              {/* <span className="fc4">*</span> */}
                            </p>
                            <input
                              type="text"
                              name="link"
                              placeholder="Enter online link"
                              value={record.link}
                              onChange={(e) =>
                                handleDayWiseChange(
                                  index,
                                  "link",
                                  e.target.value
                                )
                              }
                            />
                            {/* <p className='error-text'>{errorMsgData[`link${record.id}`]}</p> */}
                            <p className='error-text'></p>
                          </div>
                        )}
                        {record.mode.value === "Offline" && (
                          <>
                            <div className="inp-design batch-name flx31">
                              <SingleDropdown
                                label="Location"
                                options={locationOptions}
                                selectedOption={record.location}
                                onSelect={(value) =>{
                                  handleLocation(index, "room", value);
                                  handleDayWiseChange(index, "location", value);
                                }
                                }
                                search
                                compulsory={<span className="fc4">*</span>}
                              />
                              <p className="error-text">
                                {errorMsgData[`location${record.id}`]}
                              </p>
                            </div>

                          
                            <div className="inp-design course-name flx31">
                              <SingleDropdown
                                label="Room Number"
                                options={roomOptions[record.location.value]?roomOptions[record.location.value]:[]}
                                // options={roomOptions[record.location.value]? [{ label: "select room", value: "" }, ...roomOptions[record.location.value]]:[]}

                                selectedOption={record.room}
                                onSelect={(value) =>
                                  handleDayWiseChange(index, "room", value)
                                }
                                search
                                compulsory={record.batchType.value === "lecture" ? (<span className="fc4">*</span>) : null}
                              />
                              <p className="error-text">
                                {errorMsgData[`room${record.id}`]}
                              </p>
                            </div>

                          </>
                        )}
                        {record.mode.value === "Hybrid" && (
                          <>
                            <div className="inp-design batch-name flx31">
                              <SingleDropdown
                                label="Location"
                                options={locationOptions}
                                selectedOption={record.location}
                                onSelect={(value) =>{
                                  handleLocation(index, "room", value);
                                  handleDayWiseChange(index, "location", value);
                                }}
                                search
                                compulsory={<span className="fc4">*</span>}
                              />
                              <p className="error-text">
                                {errorMsgData[`location${record.id}`]}
                              </p>
                            </div>

                            <div className="inp-design course-name flx31">
                              <SingleDropdown
                                label="Room Number"
                                options={roomOptions[record.location.value]?roomOptions[record.location.value]:[]}
                                selectedOption={record.room}
                                onSelect={(value) =>
                                  handleDayWiseChange(index, "room", value)
                                }
                                search
                                compulsory={record.batchType.value === "lecture" ? (<span className="fc4">*</span>) : null}
                              />
                              <p className="error-text">
                                {errorMsgData[`room${record.id}`]}
                              </p>
                            </div>
                            <div className="inp-design batch-name flx31">
                              <p className="fc15 fw6 fs14 ls1">
                                Online Link
                                {/* <span className="fc4">*</span> */}
                              </p>
                              <input
                                type="text"
                                name="link"
                                placeholder="Enter online link"
                                value={record.link}
                                onChange={(e) =>
                                  handleDayWiseChange(
                                    index,
                                    "link",
                                    e.target.value
                                  )
                                }
                              />
                              {/* <p className='error-text'>{errorMsgData[`link${record.id}`]}</p> */}
                              <p className='error-text'></p>
                            </div>
                          </>
                        )}

                       
                            <div className="inp-design course-name flx31">
                              <SingleDropdown
                                label="Subject"
                                options={subjectOptions}
                                selectedOption={record.subject}
                                onSelect={(value) =>
                                  handleDayWiseChange(index, "subject", value)
                                }
                                search
                                allowCustom
                                compulsory={record.batchType.value === "lecture" ? (<span className="fc4">*</span>) : null}
                              />
                              <p className="error-text">
                                {errorMsgData[`subject${record.id}`]}
                              </p>
                            </div>
                          

                        <div className="inp-design course-name flx31">
                          <SingleDropdown
                            label="Instructor Name"
                            options={instructorOptions}
                            selectedOption={record.instructorName}
                            onSelect={(value) =>
                              handleDayWiseChange(
                                index,
                                "instructorName",
                                value
                              )
                            }
                            search
                            compulsory={<span className="fc4">*</span>}
                          />
                          <p className="error-text">
                            {errorMsgData[`instructorName${record.id}`]}
                          </p>
                        </div>
                        <div className="inp-design searching-drop flx31">
                          <p className="fc15 fw6 fs14 ls1 mb8">
                            Co-Instructor/Assistant/Support Staff
                            {/* <span className="fc4">*</span> */}
                          </p>
                          <MultiDropdown
                            label="Co-Instructor/Assistant/Support Staff"
                            options={coInstructorOptions}
                            selectedValues={record.coInstructor}
                            onSelect={(value) =>
                              handleCoinstructor(index, value)
                            }
                          />
                          <p className="error-text"></p>
                        </div>
                        <div className="flx31"></div>
                        <div className="inp-design name flx100">
                          <p className="fc15 fw6 fs14 ls1">Additional Notes</p>
                          <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            placeholder="Enter any additional notes"
                            value={record.additionalNotes}
                            onChange={(e) =>
                              handleDayWiseChange(
                                index,
                                "additionalNotes",
                                e.target.value
                              )
                            }
                          />
                          <p className="error-text">
                            {/*errorMsgData[`additionalNotes${record.id}`]*/}
                          </p>
                        </div>

                        {batchFormData.dayWiseRecords.filter(
                          (r) => r.status === "1"
                        ).length > 1 && (
                          <div className="df jce mb12 w100">
                            <button
                              className="df jce aic p8 brd1 br4 fc9 cp"
                              onClick={() =>
                                handleDeleteDayWiseRecord(record.id)
                              }
                            >
                              <MdDelete className="fs20 cp fc9" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null; 
              })}
          </>

          {batchEndDate && (
         
          <div className="inp-design batch-name flx31">
            <p className="fc15 fw6 fs14 ls1">
            Batch End Date<span className="fc4"></span>
            </p>
            <input
              type="text"
              name="batchEndDate"
              placeholder="Enter a unique name for the batch"
              autoComplete="off"
              disabled={true}
              batchEndDate
              value={batchEndDate}
              className={"disabled-input bg6"}
            />
          </div>
          
          )}

          

          {!batchFormData.batch_end_status &&( 
          <div className="df jce w100 mt24">
            <button
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
              onClick={addNewRecord}
            >
              Add New Record
            </button>
          </div>
          )}
        </div>
          {/* /Auto-Generate Future Batches */}

           {batchStartDate &&  (batchFormData.category_id && batchFormData.category_id.value === '3')  && hasDailyFrequency &&(
            <div className="mt12 auto-batch w100 day-wise-records-grp pb10 mb16  box-sd1 bg8 pl20 pr20 pt20 pb20">
              <div className="v-center mb12">
                <div className="fc15 fw6 fs14 ls1 ">
                  Auto-Generate Future Batches
                </div>
                <div className="radio-grp-status v-center fww ml16">
                  <Toggle 
                  initialValue={batchFormData.autoBatch}
                  onChange={autoBatchHandle} 
                  // auto 
                  />
                </div>
              </div>
              {autoBatchOnOff  &&(
                
                
                <>
                  <div className="v-center mt24 mb24">
                  <div className="course-name flx31">
                    <SingleDropdown
                      label="Select Period"
                      options={periodOptions}
                      selectedOption={batchFormData.autoBatchPeriod}
                      onSelect={handelPeriodSelect}
                      compulsory={<span className="fc4">*</span>}
                    />
                    <p className='error-text'>{errorMsgData['auto_batch_period']}</p>
                  </div>
                  
                  <div className="course-name flx31 ml48">
                    <SingleDropdown
                      label="Select Pattern"
                      options={
                        batchFormData.autoBatchPeriod?.value === "weekly"
                          ? weeklyOptions
                          : batchFormData.autoBatchPeriod?.value === "monthly"
                            ? monthlyOptions
                            : []
                      }
                      selectedOption={batchFormData.autoBatchPattern}
                      onSelect={handelPatternSelect}
                      compulsory={<span className="fc4">*</span>}
                      isReadOnly={!batchFormData.autoBatchPeriod}
                    />
                    <p className='error-text'>{errorMsgData['auto_batch_pattern']}</p>
                  </div>
                  
                </div>
                 <p className='error-text box-center'>{errorMsgData['auto_batch_error']}</p>
                </>
                 
              )}
            </div>
           )}
 
        {!batchFormData.batch_end_status &&( 
        <div className="radio-grp-status box-center fww mt24 mb12">
          <label htmlFor="approve" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="approve"
              value="1"
              checked={batchFormData.status === "1"}
              onChange={handleStatusChange}
            />
            Approve
          </label>
          <label htmlFor="draft" className="cp v-center mr16 fc6 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="draft"
              value="2"
              checked={batchFormData.status === "2"}
              onChange={handleStatusChange}
            />
            Draft
          </label>

          <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="reject"
              value="0"
              checked={batchFormData.status === "0"}
              onChange={handleStatusChange}
            />
            Reject
          </label>
        </div>
        )}

        {Object.values(errorMsgData).length > 0 ? (
          <div className="error-text tac">
            Please check required fields ({Object.values(errorMsgData).length}{" "}
            Error(s) found)
          </div>
        ) : (
          <div className="error-text tac"></div>
        )}


        {<p className="error-text tac">{errorMsgData.batch_start_error}</p>}

        {!batchFormData.batch_end_status &&( 
         <div className={`add-more box-center mt24 ${instConflictMessage || roomConflictMessage && "mb48"}`}>
           <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
            onClick={handleSubmit}
           >
            Submit
          </button>
         </div>
        )}

     {(instConflictMessage || roomConflictMessage) && <div className="toast-msg v-center">
      <div className="fs14 ls1 lh20 df fdc" >
          <div dangerouslySetInnerHTML={{ __html: roomConflictMessage } } />
          <div className="mt12" dangerouslySetInnerHTML={{ __html: instConflictMessage }} />
          <button className="close-btn" onClick={() => setShowToast(false)}>
            &times;
          </button>
          </div>
        </div>}
      </Card>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default BatchForm;
