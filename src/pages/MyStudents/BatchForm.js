import React, { useState ,useEffect} from "react";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MultiDropdown from "../../components/MultiDropdown.js";
import TimePicker from "../../components_two/TimePicker";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import "../MyStudents/BatchForm.css";
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

const BatchForm = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  useTitle("My Team - Flapone Aviation");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessRoleLimit = ["1", "2", "3","5"];
  const accessDeptLimit = ["1", "2", "3"];
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageAccess = accessRoleLimit.includes(userRole);
  const pageAccessDept = accessDeptLimit.includes(userDept);

  const [errorMsgData, setErrorMsgData] = useState([]);
  var errorMsg = {}
  const [bid,setBid] = useState(null);
  const [batchFormData, setBatchFormData] = useState({
    id:"",
    batch_name: "",
    course_id: "",
    batch_id: "",
    start_date: null,
    end_date: null,
    startDateDay: "",
    max_allow_stu: "",
    min_stu_req: "",
    mode: "",
    on_days: [],
    batch_on_days:[],
    online_link: "",
    location: "",
    status: "",
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
        id: Date.now()+"_new",
        dayRecord: "",
        batchType: "",
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
        startDate:"",
        endDate:"",
        status: "1",
      },
    ],
  });


  const handleBatchTimeChange = (timeData, period) => {
    setBatchFormData((prevData) => ({
      ...prevData,
      [period === "from" ? "start_time" : "end_time"]: timeData,
    }));

    validateBatchFields(period === "from" ? "start_time" : "end_time",timeData);
  };

  const customDateFormat = "dd/MM/yyyy";

  const [courseListOptions,setCourseListOptions ] = useState([]);
  const [instructorOptions,setInstructorOptions] = useState([]);
  const [coInstructorOptions,setCoInstructorOptions] = useState([]);
  const [subjectOptions,setSubjectOptions] = useState([]);
  const [locationOptions,setLocationOptions] = useState([]);
  const [courseDuration,setCourseDuration] = useState(0);
  const [courseCategorySname,setCourseCategorySname] = useState("");
  const [genBatchId,setGenBatchId] = useState("");
  
  
 
  const typeListOptions = [
    { value: "lecture", label: "Lecture" },
    { value: "flying", label: "Flying" },
    { value: "exam", label: "Exam" },
    { value: "test", label: "Test" },
    { value: "quiz", label: "Quiz" },
    { value: "assignment", label: "Assignment" },
    { value: "presentation", label: "Presentation" },
    { value: "seminar", label: "Seminar" },
    { value: "project", label: "Project" },
    { value: "workshop", label: "Workshop" },
    { value: "lab_session", label: "Lab Session" },
    { value: "field_trip", label: "Field Trip" },
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    validateBatchFields(name,value);

  };

 
  function validateBatchFields(id,value,daywiseData,daywise){
    errorMsg = errorMsgData;

    if (daywise === "dayWiseRecords") {
      if (id ==='location' || id ==='mode' || id ==='subject' || id ==='instructorName' || id ==='batchType' || (id ==='dayRecord' && daywiseData.repeat ==='weekly')) {
          const value = daywiseData[id].value; 
          const errorKey = id + daywiseData.id; 

          if (value.length === 0) {
              errorMsg[errorKey] = `${formatBatchName(id)} field is empty!`;
          } else {
              errorMsg[errorKey] = '';
          }
      }else{
        if(id ==="link") {
          const value = daywiseData[id]; 
          const errorKey = id + daywiseData.id; 
          if (value.length === 0) {
              errorMsg[errorKey] = `${formatBatchName(id)} field is empty!`;
          } else {
              errorMsg[errorKey] = '';
          }
      }
    }
  }else if(id ==='location' || id ==='mode' || id ==='course_id') {
      value = value.value;
      if(value.length === 0) {
        errorMsg[id] = formatBatchName(id)+' field is empty!';
      }else{
        errorMsg[id] = '';
      }
    }
    else if(id ==='on_days') {
      if(value.length === 0) {
        errorMsg[id] = 'On days field is empty!';
      }else{
        errorMsg[id] = '';
      }
    }else if(id ==="start_date"){
      if (!value) {
          errorMsg[id] = "Start date field can't be empty!";
       }else{
         if(value && batchFormData['end_date']){
         const start_date = new Date(value.split('/').reverse().join('-'));
         const end_date = new Date(batchFormData['end_date'].split('/').reverse().join('-'));
         if (start_date && end_date) {
          if (new Date(start_date) > new Date(end_date)) {
              errorMsg.end_date = "End Date always greater than start date!";
              errorMsg[id] = "Start Date always less than end date!";
          }else{
              errorMsg.end_date = "";
              errorMsg[id] = "";
          }
         }
        }
      }
    }else if(id ==="end_date"){
      if (!value) {
          errorMsg[id] = "End date field can't be empty!";
       }else{
         if(value && batchFormData['start_date']){
         const start_date = new Date(batchFormData['start_date'].split('/').reverse().join('-'));
         const end_date = new Date(value.split('/').reverse().join('-'));
         if (start_date && end_date) {
          if (new Date(start_date) > new Date(end_date)) {
               errorMsg[id]= "End Date always greater than start date!";
               errorMsg.start_date = "Start Date always less than end date!";
          }else{
              errorMsg.start_date = "";
              errorMsg[id] = "";
          }
         }
        }
      }
    }else if(id ==="start_time"){
      if (!value) {
          errorMsg[id] = "Start Time field can't be empty!";
       }else{   
          if (value && batchFormData['end_time']) {
          const getstime = getConvertedTime(value);
          const stime = formatTo24Hour(getstime);
        
          const getetime = getConvertedTime(batchFormData['end_time']);
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
    }else if(id ==="end_time"){
      if (!value) {
          errorMsg[id] = "End Time field can't be empty!";
       }else{   
          if(value && batchFormData['start_time']) {
          const getstime = getConvertedTime(batchFormData['start_time']);
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
    }else{
      if(id) {
      value = value.trim()
      if (value.length === 0) {
        errorMsg[id] = formatBatchName(id)+' field is empty!';
      }else{
        errorMsg[id] = '';
      }
    }
  }
   
   if (Object.keys(errorMsg).length > 0) {
      setErrorMsgData(errorMsg);
      return false
    }
  }


  const getConvertedTime = (time) => {
    const hours = time.hour.toString().padStart(2, '0');
    const minute = time.minute.toString().padStart(2, '0');
    return `${hours}:${minute} ${time.ampm}`;
  };

  const formatTo24Hour = (timeString) => {
    const [time, ampm] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };


  const formatBatchName = (Name) => {
    // Replace underscores with spaces and capitalize each word
    return Name
        .replace(/_/g, ' ') // Replace underscores with spaces
        .split(' ') // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join back into a single string
};

  const handleCourseNameSelect = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      course_id: option,
    }));
    validateBatchFields("course_id",option)
    handleCourse(option.value);
  };
  const handleLocationChange = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      location: option,
    }));
    validateBatchFields("location",option)
  };

  const handelModeSelect = (option) => {
    setBatchFormData((prevValues) => ({
      ...prevValues,
      mode: option,
    }));

    validateBatchFields("mode",option);
  };

  const handlebatchIdGen = (cat,courseId,date) => {
    const newBatchId = cat;
    const newCourseId = formatNumber(courseId);
    const startDateString = date?date:batchFormData.start_date;
    const [day, month, year] = startDateString.split('/').map(Number); 
    const startDate = new Date(year, month - 1, day); 
    if (isNaN(startDate)) {
      console.error("Invalid start date:", batchFormData.start_date);
      return; 
    }
    const newStartDate = formatDate(startDate);
    setGenBatchId(newBatchId + newCourseId +"/"+newStartDate);
    setBatchFormData((prevValues) => ({
      ...prevValues,
      batch_id: newBatchId + newCourseId +"/"+newStartDate,
    }));
   };


  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad if necessary
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = monthNames[date.getMonth()]; // Get month name
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  
    return `${day}${month}${year}`; // Return formatted date
  };

  const formatNumber = (num) => {
    return String(num).padStart(2, '0');
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

       // Update batch_on_days
      const updatedBatchOnDays = isInOnDays
      ? batchFormData.batch_on_days.filter(day => day.label !== dayOfWeek) // Remove from batch_on_days if it was in on_days
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

    if(courseDuration){
      const formattedEndDate = date ? moment(date).add(courseDuration, 'days').format("DD/MM/YYYY") : null; 
      setBatchFormData((prevValues) => ({
        ...prevValues,
        end_date: formattedEndDate, 
      }));
    }

      handlebatchIdGen(courseCategorySname,batchFormData.course_id.value,formattedDate);
      validateBatchFields("start_date",formattedDate);
    } else if (fieldName === "end_date") {
      const formattedEndDate = date ? moment(date).format("DD/MM/YYYY") : null; // Format end date if applicable
      setBatchFormData((prevValues) => ({
        ...prevValues,
        end_date: formattedEndDate, // Store formatted end date
      }));
      validateBatchFields("end_date",formattedEndDate);
    } else if (fieldName === "repeatDate" && index !== null) {
      const formattedRepeatDate = date ? moment(date).format("DD/MM/YYYY") : null; // Format repeat date if applicable
      setBatchFormData((prevValues) => ({
        ...prevValues,
        dayWiseRecords: prevValues.dayWiseRecords.map((record, idx) =>
          idx === index ? { ...record, repeatDate: formattedRepeatDate } : record
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
        ? batchFormData.batch_on_days.filter(day => day.label !== selectedValue) // Remove from batch_on_days if it was in on_days
        : [...batchFormData.batch_on_days, dayRecord]; // Add to batch_on_days if it was not in on_days

    // Set the updated state
    setBatchFormData({
        ...batchFormData,
        on_days: updatedOnDays,
        batch_on_days: updatedBatchOnDays,
    });

    validateBatchFields("on_days",updatedOnDays);
};

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setBatchFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };

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

    validateBatchFields(field,value,updatedDayWiseRecords[index],"dayWiseRecords");
  };


  const handleRepeatChange = (index, value) => {
     let  dayRecordval;
     if(value === 'daily'){
       dayRecordval= "";
     }

    setBatchFormData((prevValues) => {
      const updatedDayWiseRecords = [...prevValues.dayWiseRecords];
      updatedDayWiseRecords[index] = {
        ...updatedDayWiseRecords[index],
        repeat: value,
        dayRecord:dayRecordval,
      };
      return {
        ...prevValues,
        dayWiseRecords: updatedDayWiseRecords,
      };
    });
    
  };
  const handleDayWiseTimeChange = (index, timeData, period) => {
    const updatedRecords = [...batchFormData.dayWiseRecords];
    updatedRecords[index][period === "from" ? "start_time" : "end_time"] = timeData;

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
          id: Date.now()+"_new",
          batchType: "",
          start_time: { hour: "09", minute: "00", ampm: "AM" },
          end_time: { hour: "12", minute: "00", ampm: "PM" },
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
          startDate:"",
          endDate:"",
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
    navigate("/my-students?tab=batches");
  };


  const checkUserLogin = response => {
    if (response.data.login.status === 0) {
      dispatch(logout())
      navigate('/login')
    }
  }

  useEffect(() => {
    getBatchData();
  }, [])


   const getBatchData = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch.php?fun=getBatchData`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        //bid:id?id:bid,
        bid:id?id:"",
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        const respData = response.data.data;
        if(respData.batchdetail){
          if(Object.values(respData.batchdetail).length > 0){
           setBatchFormData(respData.batchdetail);
         }
        }

        if(respData.instructors){
          if(Object.values(respData.instructors).length > 0){
            setInstructorOptions(respData.instructors);
            setCoInstructorOptions(respData.instructors);
         }
        }

        if(respData.instructors){
          if(Object.values(respData.instructors).length > 0){
            setInstructorOptions(respData.instructors);
            setCoInstructorOptions(respData.instructors);
         }
        }

       
       if(respData.course_list){
            if(Object.values(respData.course_list).length > 0){
          setCourseListOptions(respData.course_list);
       }
      }


      if(respData.subject_list){
        if(Object.values(respData.subject_list).length > 0){
        setSubjectOptions(respData.subject_list);
       }
      }

      
      if(respData.locations){
        if(Object.values(respData.locations).length > 0){
        setLocationOptions(respData.locations);
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
      method: 'post',
      url: `${constant.base_url}/admin/batch.php?fun=addbatch`,
      headers: { 'Auth-Id': user.auth_id },
      data: {
        batchFormData:batchFormData,
        bid:id?id:bid,
      }
    })
      .then(function (response) {
        checkUserLogin(response)
         if (response.data.data.status === 1) {
          // if (response.data.data.insert_id) {
          //   setBid(response.data.data.insert_id);
          // } 
          navigate("/my-students?tab=batches");  
          toast.success(response.data.data.msg);

         }else{
          if(response.data.data.errorlist){
            setErrorMsgData(response.data.data.errorlist);
          }
        }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      })
  };


  function handleCourse(course_id){
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/batch.php?fun=getCourseDetail`,
      headers: { 'Auth-Id': user.auth_id },
      data: {
        course_id:course_id
      }
    })
      .then(function (response) {
        checkUserLogin(response)
        if(response.data.data.status ===1){
            setCourseDuration(response.data.data.course_duration);
            if(response.data.data.category_short_name){
            setCourseCategorySname(response.data.data.category_short_name);
             handlebatchIdGen(response.data.data.category_short_name,course_id);
            }
            
        }
      })
      .catch(function (error) {
        //console.error('Error during login:', error);
      })
      .finally(() => {
        //setLoading(false);
      })
  };


   // Function to convert "DD/MM/YYYY" format to a Date object
   const parseDateString = (dateString,type) => {
    if(dateString !== null){
     const [day, month, year] = dateString.split("/").map(Number);
     return new Date(year, month - 1, day); // month - 1 for 0-indexing
    }
    else if(type ==='start'){
      return new Date();
    }else if(type ==='end'){
     return null;
    }
   };




  const [startDate, setStartDate] = useState(batchFormData.start_date?batchFormData.start_date:new Date());
  const [endDate, setEndDate] = useState(batchFormData.end_date?batchFormData.end_date:null);
 
  const onChangeDateClass = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const minDateSelect = parseDateString(batchFormData.start_date?batchFormData.start_date:null,"start");
  const maxDateSelect = parseDateString(batchFormData.end_date?batchFormData.end_date:null,"end");

  const onChangeDateClassBlur = (index, record,type) => {
    const updatedDayWiseRecords = [...batchFormData.dayWiseRecords];
    updatedDayWiseRecords[index] = {
      ...updatedDayWiseRecords[index],
      startDate: (startDate ? moment(startDate).format("DD-MM-YYYY") : null),
      endDate:  (endDate ? moment(endDate).format("DD-MM-YYYY") : null),
    };
    setBatchFormData({
      ...batchFormData,
      dayWiseRecords: updatedDayWiseRecords,
    });
  };

 

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
        const existingMultiDates = updatedDayWiseRecords[index]?.multiDate || [];

        let updatedMultiDates;
        
        if (isSelected) {
          // If the date was selected, remove it from multiDates
          updatedMultiDates = existingMultiDates.filter((d) => d !== dateString);
        } else {
          // If the date was unselected, add it to multiDates
          updatedMultiDates = Array.from(new Set([...existingMultiDates, dateString]));
        }

        updatedDayWiseRecords[index] = {
          ...updatedDayWiseRecords[index],
          multiDate: updatedMultiDates,
        };

        return {
          ...prevFormData,
          dayWiseRecords: updatedDayWiseRecords,
        };
      });

      return newDates; // Return the updated dates
    });
  }
};


 
 let displayIndex=1;
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
        <div className="batch-main-grp-inputs mb16 v-center jcsb fww bg8 pl20 pr20 pt20 pb20">
          <div className="form-group-settings batch-name flx31">
            <p className="fc15 fw6 fs14 ls1">
              Batch Name<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="batch_name"
              placeholder="Enter batch name"
              autoComplete="off"
              value={batchFormData.batch_name}
              onChange={handleInputChange}
            />
            {(
            <p className='error-text'>{errorMsgData.batch_name}</p>
          )}
          </div>
          <div className="form-group-settings course-name flx31">
            <SingleDropdown
              label="Course Name"
              options={courseListOptions}
              selectedOption={batchFormData.course_id}
              onSelect={handleCourseNameSelect}
              search
              compulsory={<span className="fc4">*</span>}
            />
            {(
            <p className='error-text'>{errorMsgData.course_id}</p>
          )}
          </div>
          <div className="form-group-settings batch-name flx31">
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
              disabled={id?true:false}
            />
            { (
            <p className='error-text'>{errorMsgData.batch_id}</p>
          )}
          </div>
          <div className="form-group-settings batch-name flx31 calendar-input ">
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
            selected={batchFormData.start_date ? moment(batchFormData.start_date, "DD/MM/YYYY").toDate() : null} 
            onChange={(date) => handleDateChange(date, "start_date")}
            placeholderText="Select start date"
            showIcon={false}
            isClearable={false}
          />
          {(
            <p className='error-text'>{errorMsgData.start_date}</p>
          )}
          </div>

          <div className="form-group-settings batch-name flx31 calendar-input ">
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
              selected={batchFormData.end_date ? moment(batchFormData.end_date, "DD/MM/YYYY").toDate() : null}
              onChange={(date) => handleDateChange(date, "end_date")}
              placeholderText="Select end date"
              showIcon={false}
              isClearable={false}
            />
             { (
            <p className='error-text'>{errorMsgData.end_date}</p>
          )}
          </div>
          <div className="form-group-settings batch-name flx31">
            <TimePicker
              fromTime={batchFormData.start_time}
              toTime={batchFormData.end_time}
              onTimeChange={handleBatchTimeChange}
              compulsory={<span className="fc4">*</span>}
            />
             { (
            <p className='error-text'>{errorMsgData.start_time}</p>
          )}
          { (
            <p className='error-text'>{errorMsgData.end_time}</p>
          )}
          </div>
          <div className="form-group-settings searching-drop flx31">
            <p className="fc15 fw6 fs14 ls1 mb8">On Days<span className="fc4">*</span></p>
            <MultiDropdown
              label="On Days"
              options={dayOptions}
              selectedValues={batchFormData.on_days}
              onSelect={handleDaySelection}
             
            />
            { (
            <p className='error-text'>{errorMsgData.on_days}</p>
          )}
          </div>
          <div className="form-group-settings batch-name flx31">
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
            />
            {(<p className='error-text'>{errorMsgData.max_allow_stu}</p>)}
          </div>
          <div className="form-group-settings batch-name flx31">
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
            />
             { (
            <p className='error-text'>{errorMsgData.min_stu_req}</p>
          )}
          </div>

          <div className="form-group-settings course-name flx31">
            <SingleDropdown
              label="Mode"
              options={modeOptions}
              selectedOption={batchFormData.mode}
              onSelect={handelModeSelect}
              compulsory={<span className="fc4">*</span>}
            />
            {(
            <p className='error-text'>{errorMsgData.mode}</p>
          )}
          </div>

          {batchFormData.mode && batchFormData.mode.value === "Online" && (
            <>
              <div className="form-group-settings batch-name flx31">
                <p className="fc15 fw6 fs14 ls1">
                  Online Link<span className="fc4">*</span>
                </p>
                <input
                  type="text"
                  name="online_link"
                  placeholder="Enter online link"
                  autoComplete="off"
                  value={batchFormData.online_link}
                  onChange={handleInputChange}
                />
                 { (
            <p className='error-text'>{errorMsgData.online_link}</p>
          )}
              </div>
              <div className="form-group-settings batch-name flx31"></div>
            </>
          )}

          {batchFormData.mode && batchFormData.mode.value === "Offline" && (
            <>
              <div className="form-group-settings batch-name flx31">
                <SingleDropdown
                  label="Location"
                  options={locationOptions}
                  selectedOption={batchFormData.location}
                  onSelect={handleLocationChange}
                  search
                  compulsory={<span className="fc4">*</span>}
                />
                { (
            <p className='error-text'>{errorMsgData.location}</p>
          )}
              </div>
              <div className="form-group-settings batch-name flx31"></div>
            </>
          )}

          {batchFormData.mode && batchFormData.mode.value === "Hybrid" && (
            <>
              <div className="form-group-settings batch-name flx31">
                <SingleDropdown
                  label="Location"
                  options={locationOptions}
                  selectedOption={batchFormData.location}
                  onSelect={handleLocationChange}
                  search
                  compulsory={<span className="fc4">*</span>}
                />
                 {(<p className='error-text'>{errorMsgData.location}</p>)}
              </div>
              <div className="form-group-settings batch-name flx31">
                <p className="fc15 fw6 fs14 ls1">
                  Online Link<span className="fc4">*</span>
                </p>
                <input
                  type="text"
                  name="online_link"
                  placeholder="Enter online link"
                  autoComplete="off"
                  value={batchFormData.online_link}
                  onChange={handleInputChange}
                />
              {(<p className='error-text'>{errorMsgData.online_link}</p>)}
              </div>
              <div className="form-group-settings batch-name flx31"></div>
            </>
          )}
        </div>

        <div className="day-wise-records-grp pb10 mb16 v-center jcsb fww  meta-grp box-sd1 bg8 pl20 pr20 pt20 pb20">
          <div className="fc15 fw6 fs14 ls1 lh18 mb16">
            Day or time Wise Records
          </div>
          <>
      {batchFormData.dayWiseRecords && batchFormData.dayWiseRecords.map((record, index) => {
        if (record.status === "1") {
          let currentDisplayIndex = displayIndex; 
          displayIndex++;

          return (
            <div key={`record-${record.id}-${index}`}>
              {batchFormData.dayWiseRecords.filter(
                (r) => r.status === "1"
              ).length > 1 && (
                <p className="pr20 pt20 fs18 ls1 lh22 fw6">Class {currentDisplayIndex}</p>
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
            
             <div className="w100">
                  <div className="radio-grp-repeat df aic fww">
                    <p className="fc15 fw6 fs14 ls1 mr24">Repeat</p>
                    <label
                      htmlFor={`daily-${index}`}
                      className="cp v-center mr16 fc13"
                    >
                      <input
                        type="radio"
                        className="mr8 cp"
                        id={`daily-${index}`}
                        name={`repeat-${index}`}
                        value="daily"
                        checked={record.repeat === "daily"}
                        onChange={() => handleRepeatChange(index, "daily",record)}
                      />
                      Daily
                    </label>

                   {(courseDuration > 7 || record.repeat === "weekly") && (
                    <label
                      htmlFor={`weekly-${index}`}
                      className="cp v-center mr16 fc6 ml16"
                    >
                      <input
                        type="radio"
                        className="mr8 cp"
                        id={`weekly-${index}`}
                        name={`repeat-${index}`}
                        value="weekly"
                        checked={record.repeat === "weekly"}
                        onChange={() => handleRepeatChange(index, "weekly",record)}
                      />
                      Weekly
                    </label>

                    )}

                    <label
                      htmlFor={`repeatDate-${index}`}
                      className="cp v-center mr16 fc8 ml16"
                    >
                      <input
                        type="radio"
                        className="mr8 cp"
                        id={`repeatDate-${index}`}
                        name={`repeatDate-${index}`}
                        value="repeatDate"
                        checked={record.repeat === "repeatDate"}
                        onChange={() => handleRepeatChange(index, "repeatDate")}
                      />
                      Date
                    </label>
                  </div>

                  {record.repeat === "daily" && (
                    <div
                        onBlur={() => onChangeDateClassBlur(index, record,"weekly")}
                      >
                      <DatePicker
                        onChange={onChangeDateClass}
                        startDate = {record.startDate ? moment(record.startDate, "DD-MM-YYYY").toDate() : startDate}
                        endDate = {record.endDate ? moment(record.endDate, "DD-MM-YYYY").toDate() : endDate}
                        
                        selectsRange
                        inline
                        minDate={minDateSelect} 
                        maxDate={maxDateSelect} 
                      />
                      
                    </div>
                  )}

                  {record.repeat === "weekly" && (
                    <div
                        onBlur={() => onChangeDateClassBlur(index, record,"weekly")}
                      >
                      <DatePicker
                        onChange={onChangeDateClass}
                        startDate = {record.startDate ? moment(record.startDate, "DD-MM-YYYY").toDate() : startDate}
                        endDate = {record.endDate ? moment(record.endDate, "DD-MM-YYYY").toDate() : endDate}
                        
                        selectsRange
                        inline
                        minDate={minDateSelect} 
                        maxDate={maxDateSelect} 
                      />
                      
                    </div>
                  )}
                  {record.repeat === "repeatDate" && (
                    <div className="form-group-settings batch-name flx31 calendar-input w100 mt12"
                       
                      >
                           <DatePicker
                            selected={null}
                            onChange={(date) => handleMDateChange(date,record,index)}
                            placeholderText="Select dates"
                            highlightDates={record.multiDate.map((date) => {
                            const [day, month, year] = date.split('-');
                            return new Date(year, month - 1, day); // month is 0-indexed
                             })}
                          isClearable={true}
                          inline
                          minDate={minDateSelect} 
                          maxDate={maxDateSelect} 
                        />          
                    </div>
                  )}
                </div>
                <div className="form-group-settings course-name flx31">
                  {record.repeat === "weekly" && (
                    <SingleDropdown
                      label="Day"
                      options={batchFormData.batch_on_days ? batchFormData.batch_on_days : dayOptions}
                      selectedOption={record.dayRecord || batchFormData.startDateDay}
                      onSelect={(value) => handleDayWiseChange(index, "dayRecord", value)}
                      search
                      compulsory={<span className="fc4">*</span>}
                    />
                  )}
                  <p className='error-text'>{errorMsgData[`dayRecord${record.id}`]}</p>
                </div>
                <div className="form-group-settings course-name flx31">
                  <SingleDropdown
                    label="Type"
                    options={typeListOptions}
                    selectedOption={record.batchType}
                    onSelect={(value) => handleDayWiseChange(index, "batchType", value)}
                    search
                    compulsory={<span className="fc4">*</span>}
                  />
                  <p className='error-text'>{errorMsgData[`batchType${record.id}`]}</p>
                </div>
                <div className="form-group-settings course-name flx31">
                  <TimePicker
                    fromTime={record.start_time}
                    toTime={record.end_time}
                    onTimeChange={(time, period) => handleDayWiseTimeChange(index, time, period)}
                    compulsory={<span className="fc4">*</span>}
                  />
                  {/* <p className='error-text'>{errorMsgData[`schedule${record.id}`]}</p> */}
                  <p className='error-text'>{errorMsgData[`start_time${record.id}`]}</p>
                  <p className='error-text'>{errorMsgData[`end_time${record.id}`]}</p>
                </div>
                <div className="form-group-settings course-name flx31">
                  <SingleDropdown
                    label="Mode"
                    options={modeOptions}
                    selectedOption={record.mode}
                    onSelect={(value) => handleDayWiseChange(index, "mode", value)}
                    compulsory={<span className="fc4">*</span>}
                  />
                  <p className='error-text'>{errorMsgData[`mode${record.id}`]}</p>
                </div>
                {record.mode.value === "Online" && (
                  <div className="form-group-settings batch-name flx31">
                    <p className="fc15 fw6 fs14 ls1">
                      Online Link<span className="fc4">*</span>
                    </p>
                    <input
                      type="text"
                      name="link"
                      placeholder="Enter online link"
                      value={record.link}
                      onChange={(e) => handleDayWiseChange(index, "link", e.target.value)}
                    />
                    <p className='error-text'>{errorMsgData[`link${record.id}`]}</p>
                  </div>
                )}
                {record.mode.value === "Offline" && (
                  <div className="form-group-settings batch-name flx31">
                    <SingleDropdown
                      label="Location"
                      options={locationOptions}
                      selectedOption={record.location}
                      onSelect={(value) => handleDayWiseChange(index, "location", value)}
                      search
                      compulsory={<span className="fc4">*</span>}
                    />
                    <p className='error-text'>{errorMsgData[`location${record.id}`]}</p>
                  </div>
                )}
                {record.mode.value === "Hybrid" && (
                  <>
                    <div className="form-group-settings batch-name flx31">
                      <SingleDropdown
                        label="Location"
                        options={locationOptions}
                        selectedOption={record.location}
                        onSelect={(value) => handleDayWiseChange(index, "location", value)}
                        search
                        compulsory={<span className="fc4">*</span>}
                      />
                      <p className='error-text'>{errorMsgData[`location${record.id}`]}</p>
                    </div>
                    <div className="form-group-settings batch-name flx31">
                      <p className="fc15 fw6 fs14 ls1">
                        Online Link<span className="fc4">*</span>
                      </p>
                      <input
                        type="text"
                        name="link"
                        placeholder="Enter online link"
                        value={record.link}
                        onChange={(e) => handleDayWiseChange(index, "link", e.target.value)}
                      />
                      <p className='error-text'>{errorMsgData[`link${record.id}`]}</p>
                    </div>
                  </>
                )}
                <div className="form-group-settings course-name flx31">
                  <SingleDropdown
                    label="Subject"
                    options={subjectOptions}
                    selectedOption={record.subject}
                    onSelect={(value) => handleDayWiseChange(index, "subject", value)}
                    search
                    allowCustom
                    compulsory={<span className="fc4">*</span>}
                  />
                  <p className='error-text'>{errorMsgData[`subject${record.id}`]}</p>
                </div>
                <div className="form-group-settings course-name flx31">
                  <SingleDropdown
                    label="Instructor Name"
                    options={instructorOptions}
                    selectedOption={record.instructorName}
                    onSelect={(value) => handleDayWiseChange(index, "instructorName", value)}
                    search
                    compulsory={<span className="fc4">*</span>}
                  />
                  <p className='error-text'>{errorMsgData[`instructorName${record.id}`]}</p>
                </div>
                <div className="form-group-settings course-name flx31">
                  <SingleDropdown
                    label="Co-Instructor/Assistant/Support Staff"
                    options={coInstructorOptions}
                    selectedOption={record.coInstructor}
                    onSelect={(value) => handleDayWiseChange(index, "coInstructor", value)}
                    search
                    
                  />
                  <p className='error-text'>{/*errorMsgData[`coInstructor${record.id}`]*/}</p>
                </div>
                <div className="flx31"></div>
                <div className="form-group-settings name flx100">
                  <p className="fc15 fw6 fs14 ls1">Additional Notes</p>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    placeholder="Enter any additional notes"
                    value={record.additionalNotes}
                    onChange={(e) => handleDayWiseChange(index, "additionalNotes", e.target.value)}
                  />
                  <p className='error-text'>{/*errorMsgData[`additionalNotes${record.id}`]*/}</p>
                </div>
               

                {batchFormData.dayWiseRecords.filter(
                  (r) => r.status === "1"
                ).length > 1 && (
                  <div className="df jce mb12 w100">
                    <button
                      className="df jce aic p8 brd1 br4 fc9 cp"
                      onClick={() => handleDeleteDayWiseRecord(record.id)}
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
        return null; // Ensure to return null if the record's status is not "1"
      })}


          </>
          <div className="df jce w100 mt24">
            <button
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
              onClick={addNewRecord}
            >
              Add New Record
            </button>
          </div>
        </div>
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

        {Object.values(errorMsgData).length > 0 ? (
            <div className='error-text tac'>
                Please check required fields ({Object.values(errorMsgData).length} Error(s) found)
            </div>
        ) : (
            <div className='error-text tac'>
                
            </div>
        )}




        <div className="add-more box-center mt24">
          <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </Card>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default BatchForm;
