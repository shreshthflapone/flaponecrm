import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { FaFilter, FaPencilAlt } from "react-icons/fa";
import Card from "../../components/Card";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import InnerHeader from "../../components/InnerHeader";
import { DateRangePicker } from "react-date-range";
import {
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  subMonths,
  addMonths,
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import MultiDropdown from "../../components/MultiDropdown";
import Dropdown from "../../components/Dropdown";
import SidePopup from "../../components/Popup/SidePopup";
import SearchInput from "../../components/SearchInput.js";
import Popup from "../../components/Popup/Popup";
import AddLogForm from "../../components/Forms/AddLog.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";
import SingleDropdown from "../../components/SingleDropdown.js";

const ViewTeamLogs = () => {
  const { InstructorId } = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  const [selectedTab, setSelectedTab] = useState("instructor_log");
  const [userDetail, setUserDetail] = useState({});
  const [studentName, setStudentName] = useState("");
  const [addLogPopup, setAddLogPopup] = useState(false);
  const [date, setDate] = useState("");
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedFlyingType, setSelectedFlyingType] = useState("");
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const dateRangePickerRef = useRef(null);
  const [searchBy, setSearchBy] = useState("");
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);
  const [filterApplyStatus, setFilterApplyStatus] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [studentPageNum, setStudentPageNum] = useState(1);
  const [listFilter, setListFilter] = useState({});
  const [filterCount, setFilterCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [studnetUserDetail, setStudnetUserDetail] = useState([]);
  const [showTabCondition, setShowTabCondition] = useState(false);
  const [studentID, setStudentID] = useState("");
  const [studentDataValue, setStudentDataValue] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [selectInstructorType, setSelectInstructorType] = useState({
    value: "",
    label: "Select Trainers",
  });
  
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [droneListOptions, setDroneListOptions] = useState([]);
  const [selectedDateOption, setSelectedDateOption] = useState([]);
  const [studentDateListOptions, setStudentDateListOptions] = useState([]);
  const [branchListOptions, setBranchListOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [exerciseListOptions, setExerciseListOptions] = useState([]);
  const [instructorTypeListOptions, setInstructorTypeListOptions] = useState([]);
  const [flyingTypeListOptions, setFlyingTypeListOptions] = useState([]);
  const [searchByOptions, setSearchByOptions] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState([]);
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [updateBtnStatus, setUpdateBtnStatus] = useState(false);
  const [start_time, setStartTime] = useState({
    from_time: "",
    to_time: ""
  });
  const limit = 50;
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [totalStudentPageNum, setTotalStudentPageNum] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalFlyingCount, setTotalFlyingCount] = useState("00:00");
  const [totalCountStudent, setTotalCountStudent] = useState(0);
  const [totalFlyingCountStudent, setTotalFlyingCountStudent] = useState("00:00");
  const [recordList, setRecordList] = useState([]);
  const [searchLog, setSearchLog] = useState("");
  const [dateTimeType, setDateTimeType] = useState("");

   const [showDroneLogMontlyData, setShowLogMontlyData] = useState(false);
   const [showCalendarData, setShowCalendarData] = useState([]);
   const [logSelectedMonth, setLogSelectedMonth] = useState({});

  const [filterStatus, setFilterStatus] = useState(0);
  const handleStudentDateChange = (option) => {
    setDate(option.value);
    setDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
      setShowDateInput(true);
    } else {
      setShowDateRangePicker(false);
      setShowDateInput(false);
    }
  };
  const handleSelectDrone = (value) => {
    const index = selectedDrone.indexOf(value);
    if (index === -1) {
      setSelectedDrone([...selectedDrone, value]);
    } else {
      const updatedValues = [...selectedDrone];
      updatedValues.splice(index, 1);
      setSelectedDrone(updatedValues);
    }
  };
  const handleSelectBranch = (value) => {
    const index = selectedBranch.indexOf(value);
    if (index === -1) {
      setSelectedBranch([...selectedBranch, value]);
    } else {
      const updatedValues = [...selectedBranch];
      updatedValues.splice(index, 1);
      setSelectedBranch(updatedValues);
    }
  };
  const handleDateRangeChange = (item) => {
    setDateRangeValue([item.selection]);
  };
  const toggleDateRangeCalendar = () => {
    setShowDateRangeCalendar(!showDateRangeCalendar);
  };
  
  const handleClickOutside = (event) => {
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target)
    ) {
      setShowDateRangePicker(false);
      setShowDateRangeCalendar(false);
    }
  };
  useEffect(() => {
    if (showDateRangePicker || showDateRangeCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateRangePicker, showDateRangeCalendar]);

  const staticRanges = [
    {
      label: "Today",
      range: () => ({
        startDate: startOfToday(),
        endDate: new Date(),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[0].range();
        if (dateTimeType === "Today") {
          return true;
        } else if (!dateTimeType) {
          if (dateRangeValue[0].startDate.getTime() === startDate.getTime()) {
            setDateTimeType("Today");
            return true;
          }
        }
        return false; // Explicitly return false if condition is not met
      },
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: startOfYesterday(),
        endDate: startOfYesterday(),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[1].range();
        if (dateTimeType === "Yesterday") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("Yesterday");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "This Week",
      range: () => ({
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[2].range();
        if (dateTimeType === "This Week") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("This Week");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "Last Week",
      range: () => ({
        startDate: startOfWeek(subWeeks(new Date(), 1)),
        endDate: endOfWeek(subWeeks(new Date(), 1)),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[3].range();
        if (dateTimeType === "Last Week") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("Last Week");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[4].range();
        if (dateTimeType === "This Month") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("This Month");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[5].range();
        if (dateTimeType === "Last Month") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("Last Month");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "All Time",
      range: () => ({
        startDate: new Date(2021, 0, 1),
        endDate: new Date(),
      }),
      hasCustomRendering: true,
      isSelected: () => {
        const { startDate, endDate } = staticRanges[6].range();
        if (dateTimeType === "All Time") {
          return true;
        } else if (!dateTimeType) {
          if (dateRangeValue[0].startDate.getTime() === startDate.getTime()) {
            setDateTimeType("All Time");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "Custom",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      hasCustomRendering: true,
      isSelected: () => {
        const { startDate, endDate } = staticRanges[7].range();
        if (dateTimeType === "Custom") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() &&
            dateRangeValue[0].endDate.getTime()
          ) {
            setDateTimeType("Custom");
            return true;
          }
        }
        return false;
      },
    },
  ];
  const selectRange = () => {
    for (let i = 0; i < staticRanges.length; i++) {
      if (staticRanges[i].isSelected()) {
        // Once a match is found, exit the loop
        break; // Exit the loop after the first successful match
      }
    }
  };

  // Call the function to start the check
  selectRange();

  const staticRangesWithToggle = [
    ...staticRanges,
  ];

  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };
  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  var oldFilter = {};
  const initial_obj = {
    page_type:selectedTab,
    log_id: InstructorId != "all" ? InstructorId : "",
    date: "",
    selectedBranch:[],
    selectedCourses:[],
    selectedCategory:[],
    selectedClass:[],
    selectedDrone:[],
    selectedExercise:"",
    selectedFlyingType:[],
    start_time:{
      from_time: "",
      to_time: ""
    },
    selectInstructorType:({
      value: "",
      label: "Select Trainers",
    }),
    searchByOptions:"",
    searchLog:"",
    dateRangeValue:{
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
    dateRangeValuefilter: "",
  }
  const applyFilter = async () => {
    setFilterApplyStatus(true);
    let updatefilter = {
      ...listFilter,
      page_type: selectedTab,
      log_id: InstructorId != "all" ? InstructorId : "",
      searchByOptions:searchBy,
      searchLog:searchLog,
      date:date,
      dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      dateRangeValuefilter: dateRangeValue,
      selectedBranch:selectedBranch,
      selectedCourses:selectedCourses,
      selectedCategory:selectedCategory,
      selectedClass:selectedClass,
      selectedDrone:selectedDrone,
      selectedExercise:selectedExercise,
      selectedFlyingType:selectedFlyingType,
      selectInstructorType:selectInstructorType,
      start_time:start_time,
    };
    var getoldfilter = localStorage.getItem("allfilterinventory");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilterinventory", JSON.stringify(oldFilter));
    
    setListFilter(updatefilter);
    setPageNum(1);
    setStudentPageNum(1);
    closeFilter();
  }
  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };
  const clearFilter = () => {
    setFilterCount(0);
    FilterAllStateClear();
    let updatefilter = {
      ...listFilter,
      searchByOptions:"",
      log_id: "all",
      searchLog:"",
      date:"",
      dateRangeValue:"",
      dateRangeValuefilter: "",
      selectedBranch:[],
      selectedCourses:[],
      selectedCategory:[],
      selectedClass:[],
      selectedDrone:[],
      selectedExercise:"",
      selectedFlyingType:"",
      selectInstructorType:"",
      start_time:"",
    };
    let getOldFilterclear = localStorage.getItem("allfilterinventory");
    let oldFilterValclear = getOldFilterclear
      ? JSON.parse(getOldFilterclear)
      : {};
    let currentTabFilterValclear = oldFilterValclear[selectedTab]
      ? { ...oldFilterValclear }
      : null;
    

    if(currentTabFilterValclear){
      delete currentTabFilterValclear[selectedTab];
      localStorage.setItem(
        "allfilterinventory",
        JSON.stringify(currentTabFilterValclear)
      );
    }
    getAllFilter();
    updateSetListingFilter();
    closeFilter();
    setFilterApplyStatus(false);
  };
  const updateSetListingFilter = async () => {
    let updatefilter = {
      ...initial_obj,
      page_type: selectedTab
    };
  
    setListFilter({ ...updatefilter });
  };
  const FilterAllStateClear=()=>{
    setFilterStatus(0);
    setDate("");
    setDateLabel("Select Date");
    setSelectedBranch([]);
    setSelectedCourses([]); 
    setSelectedCategory([]);
    setSelectedClass([]); 
    setSelectedDrone([]);
    setSelectedExercise("");
    setSelectedFlyingType("");  
    setSearchByOptions([]); 
    setSearchLog("");
    setSelectInstructorType({
      value: "",
      label: "Select Trainers",
    });
    setStartTime({
      from_time: "",
      to_time: ""
    });    
    setShowSearchInput(false);
    setShowDateInput(false);
    setDateRangeValue([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 0),
        key: "selection",
      },
    ]);
  }
  const setLocalStorage = async () =>  {
    var getoldfilter = localStorage.getItem("allfilterinventory");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab] ? oldFilter[selectedTab]:"";
      if (currenttabfilter) {
        setFilterApplyStatus(true);
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["date"]) {
          let filterdateobj = studentDateListOptions.find(
            (item) => item.value === currenttabfilter["date"]
          );
          if (filterdateobj) {
            handleStudentDateChange(filterdateobj);
            setShowDateRangePicker(false);
            setShowDateRangeCalendar(false);
          }
        }
        if (currenttabfilter && currenttabfilter["dateRangeValuefilter"]) {
          setDateRangeValue(currenttabfilter["dateRangeValuefilter"]);
        }
        if (currenttabfilter && currenttabfilter["selectedBranch"]) {
          setSelectedBranch(currenttabfilter["selectedBranch"]);
        }
        if (currenttabfilter && currenttabfilter["selectedCategory"]) {
          setSelectedCategory(currenttabfilter["selectedCategory"]);
        }
        if (currenttabfilter && currenttabfilter["selectedClass"]) {
          setSelectedClass(currenttabfilter["selectedClass"]);
        }
        if (currenttabfilter && currenttabfilter["selectedCourses"]) {
          setSelectedCourses(currenttabfilter["selectedCourses"]);
        }
        if (currenttabfilter && currenttabfilter["selectedDrone"]) {
          setSelectedDrone(currenttabfilter["selectedDrone"]);
        }
        if (currenttabfilter && currenttabfilter["selectedExercise"]) {
          setSelectedExercise(currenttabfilter["selectedExercise"]);
        }
        if (currenttabfilter && currenttabfilter["selectedFlyingType"]) {
          setSelectedFlyingType(currenttabfilter["selectedFlyingType"]);
        }
        if (currenttabfilter && currenttabfilter["start_time"]) {
          setStartTime({
            from_time: currenttabfilter["start_time"].from_time || "",
            to_time: currenttabfilter["start_time"].to_time || ""
          });
        }
        if (currenttabfilter && currenttabfilter["searchByOptions"]) {
          let filterdateobj = searchByOptions.find(
            (item) => item.value === currenttabfilter["searchByOptions"]
          );
          if (filterdateobj) {
            handleSearchByChange(filterdateobj);
            setShowSearchInput(true);
          }
        }
        if (currenttabfilter && currenttabfilter["searchLog"]) {
          setSearchLog(currenttabfilter["searchLog"]);
        }
      } else {
        updateSetListingFilter();
      }
    } else {
      updateSetListingFilter();
    }
  }
  const handleSelectedClass = (value) => {
    const index = selectedClass.indexOf(value);
    if (index === -1) {
      setSelectedClass([...selectedClass, value]);
    } else {
      const updatedValues = [...selectedClass];
      updatedValues.splice(index, 1);
      setSelectedClass(updatedValues);
    }
  };
  const handleSelectCategory = (value) => {
    const index = selectedCategory.indexOf(value);
    if (index === -1) {
      setSelectedCategory([...selectedCategory, value]);
    } else {
      const updatedValues = [...selectedCategory];
      updatedValues.splice(index, 1);
      setSelectedCategory(updatedValues);
    }
  };
  const handleSelectCourses = (value) => {
    const index = selectedCourses.indexOf(value);
    if (index === -1) {
      setSelectedCourses([...selectedCourses, value]);
    } else {
      const updatedValues = [...selectedCourses];
      updatedValues.splice(index, 1);
      setSelectedCourses(updatedValues);
    }
  };
  const handleInstructorTypeChange = (value) => {
    setSelectInstructorType(value);
  }
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const newValue = value;

    const { from_time, to_time } = start_time;

    const key = name === "From" ? "from_time" : "to_time";

    const updatedTimes = {
      ...start_time,
      [key]: newValue,
    };

    const from = parseInt(updatedTimes.from_time, 10);
    const to = parseInt(updatedTimes.to_time, 10);
    if (from >= to) {
      toast.warning("Start time must be less than end time.");
      return;
    }
    
    setStartTime(updatedTimes);
  };  
  const handleSelectExercise = (value) => {
    setSelectedExercise(value);
  };
  
  const handleFlyingTypeChange = (value) => {
    setSelectedFlyingType(value);
  }
  const handleSearchByChange = (option) => {
    setSearchBy(option.value);
    setSearchLabel(option.label);
    if (option.value) {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
  };
  const handleSearchChange = (value) => {
    setSearchLog(value);
  };
  
  const handleAddLogs = () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getAllFlyingBatchStudent`,
      headers: { "Auth-Id": user.auth_id },
      data: {  },
    }).then(function (response) {
      if (response.data.data.status === "1") {
        const studentList = response.data.data.student_list;

        const studentListOption = [
          { value: "", label: "Select Student" },
          ...studentList.map((userDetail) => ({
            value: userDetail.value,
            label: userDetail.name,
            name: userDetail.name,
            mobile: userDetail.mobile || "",
            email: userDetail.email || ""
          }))
        ];
        setStudnetUserDetail({ studentListOption });
        setAddLogPopup(true);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const handleAddLogPopupClose = () => {
    setAddLogPopup(false);
  }
  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: {  },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          const filterList = response.data.data.data;
          setAllApiFilter(filterList);
          setCourseListOptions(filterList.courseData || []);
          setExerciseListOptions(filterList.exerciseListOptions || []);
          setSearchByOptions(filterList.studentLogSearchBy || []);
          setBranchListOptions(filterList.locationData || []);
          setDroneListOptions(filterList.droneListOptions || []);
          setCategoryOptions(filterList.categoryOptions || []);
          setClassOptions(filterList.uasClassOptions || []);
          setFlyingTypeListOptions(filterList.studentTypeListOptions || []);
          setInstructorTypeListOptions(filterList.instructorList || []);
          setStudentDateListOptions(filterList.studentDateListOptions || []);
          setFilterApiStatus(true);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const getTeamLogListRecord = async (page_number) => {
    if(page_number == 1){
      setRecordList([]);
    }
    setStudentDataValue(false);
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getTeamLogListRecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: page_number?page_number:pageNum, limit: limit, filter: listFilter },
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        if (pageNum === 1) {
          setTotalPageNum(response.data.data.total_page);
          setTotalCount(response.data.data.total_count);
          setTotalFlyingCount(response.data.data.total_flying_time);
          setRecordList([...response.data.data.list]);
        } else {
          setRecordList([...recordList,...response.data.data.list]);
        }
        setPageNum((prevPageNum) => prevPageNum + 1);
      } else {
        setTotalCount(0);
        setTotalFlyingCount("00:00");
        setRecordList([]);
        setDisplayMsg(response.data.data.msg);
      }
      setFilterStatus(response.data.data.filter_status);
      setAutoLoader(false);
      setIsFetching(false);
      setDataStatus(true);
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  useEffect(() => {
    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const { scrollHeight, scrollTop, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 70 && !isFetching) {
          setIsFetching(true);
          if (studentDataValue) {
            if (studentPageNum <= totalStudentPageNum) {
              getStudentLogListRecord();
            } 
          } else {
            if (pageNum <= totalPageNum) {
              getTeamLogListRecord();
            }
          }
        }
      }, 200); // Adjust the debounce delay as needed
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum]);
  
  useEffect(()=>{
      getAllFilter();
  },[]);
  const filterLabels = {
    date: "Date Type",
    dateRangeValue: "Date Range",
    selectedCourses: "Courses",
    dateRangeValuefilter: "Date Range Filter",
    selectedBranch:"Branch",
    selectedCategory:"UAS Category",
    selectedClass:"UAS Class",
    searchByBatteryValue: "Search Value",
    searchBy: "Search By",
    selectInstructorType: "Trainer",
    selectStudentType: "Student Type",
    selectedDrone: "Drone UIN ID",
    selectedFlyingType: "Flying Type",
    selectedExercise: "Exercise Name",
    searchLog: "Search Value",
    searchByOptions: "Search By",
    log_id: "Instructor ID",
  };
  const handleEdit = (log) => {
    setEditMode(true);
    setAddLogPopup(true);
  };
  useEffect(()=>{
    FilterAllStateClear();
    setLocalStorage();
  },[selectedTab]);
  useEffect(() => {
    if(filterApiStatus && listFilter.page_type===selectedTab){
      if (studentDataValue == true) {
        getStudentLogListRecord();
      } else {
        getTeamLogListRecord();
      }
    }
  }, [selectedTab,filterApiStatus,listFilter]);
  useEffect(() => {
    if (InstructorId !== "all") {
      const fetchStudentData = async () => {
        axios({
          method: "post",
          url: `${constant.base_url}/admin/inventory_list.php?fun=instructorInfo`,
          headers: { "Auth-Id": user.auth_id },
          data: { 'instructor_id': InstructorId},
        }).then(function (response) {
          if (response.data.data.status === "1" && response.data.data.data) {
            const data = response.data.data.data;
            setStudentName(data.name);
            setUserDetail({
              user_id: data.user_id,
              user_type: data.user_type,
              name: data.name,
            });
          } else {
            setStudentName("");
            setUserDetail({});
          }
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
      };
  
      fetchStudentData();
    } else {
      setStudentName("");
      setUserDetail({});
    }
  }, [InstructorId]);
  
  const handleLeadPageRedirect = (student_id) => {
    window.open(`/my-leads/${student_id}`, "_blank");
  }
  useEffect(() => {
    if (InstructorId !== "all") {
      const fetchStudentData = async () => {
        axios({
          method: "post",
          url: `${constant.base_url}/admin/inventory_list.php?fun=checkInstructorAsStudent`,
          headers: { "Auth-Id": user.auth_id },
          data: { 'instructor_id': InstructorId},
        }).then(function (response) {
          if (response.data.data.status === "1") {
            setShowTabCondition(true);
            setStudentID(response.data.data.student_id);
          } else {
            setShowTabCondition(false);
            setStudentID("");
          }
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
      };
  
      fetchStudentData();
    } else {
      setShowTabCondition(false);
      setStudentID("");
    }
  }, [InstructorId]);
  
  {/*useEffect(() => {
    if(studentDataValue === false){
      setPageNum(prev => {
      const next = 1;
      return next;
    });
    getTeamLogListRecord(pageNum);
    }
    
  },[studentDataValue]) */}

  const handleInstructorLogListing = () => {
    setStudentDataValue(false);
    setPageNum(prev => {
      const next = 1;
      return next;
    });
    setRecordList([]);
    getTeamLogListRecord(1);

  }
  const handleStudentLogListing = () => {
    setStudentDataValue(true);
    setStudentPageNum(prev => {
      const next = 1;
      return next;
    });
    setRecordList([]);
    getStudentLogListRecord(1);
  }
  const getStudentLogListRecord = async (page_number) => {
    if(page_number == 1){
      setRecordList([]);
    }
    setStudentDataValue(true);
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getStudentLogListRecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: page_number?page_number:studentPageNum, limit: limit, filter: listFilter, student_id: studentID },
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        if (studentPageNum === 1) {
          setTotalStudentPageNum(response.data.data.total_page);
          setTotalCountStudent(response.data.data.total_count);
          setTotalFlyingCountStudent(response.data.data.total_flying_time);
          setRecordList([...response.data.data.list]);
        } else {
          setRecordList([...recordList,...response.data.data.list]);
        }
        setStudentPageNum((prevPageNum) => prevPageNum + 1);
      } else {
        setTotalCountStudent(0);
        setTotalFlyingCountStudent("00:00");
        setRecordList([]);
        setDisplayMsg(response.data.data.msg);
      }
      setFilterStatus(response.data.data.filter_status);
      setAutoLoader(false);
      setIsFetching(false);
      setDataStatus(true);
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };

  // log pdf code
    const handleInstrctorLogsPDF = (instructor_id)=>{
       if(instructor_id === 'all'){
        handleShowMonthAccordingData();
      } else {
        handleShowMonthAccordingData(instructor_id);
      }
    }
    const handleSelectedMonth = (option) => {
      setLogSelectedMonth(option);
    };
    const cancelDroneSelectPopup = () => {
      setShowLogMontlyData(false);
    }
    const handleShowMonthAccordingData = (instructor_id = null) => {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/instructor_log_pdf_gen.php?fun=showLogMonthAccordingData`,
        headers: { "Auth-Id": user.auth_id },
        data: {
          type: "instructor_log",
          filter: listFilter,
          ...(instructor_id && { instructor_id }),
          student_id: studentID
        },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1" && response.data.data.dropdown_status === "1" ) {
            setShowLogMontlyData(true);
            setShowCalendarData(response.data.data.calendar_data);
          } else if(response.data.data.status === "1" && response.data.data.dropdown_status === "0") {
            handleDownloadStudentPDF(response.data.data.calendar_data[1],0);
          }
        })
        .catch(function (error) {
          console.error("Error fetching drone log month data:", error);
        });
    };
    const handleDownloadClick = () => {
        if (
          !logSelectedMonth ||
          Object.keys(logSelectedMonth).length === 0 || 
          !logSelectedMonth.value ||
          logSelectedMonth.value.trim() === ""
        ) {
          toast.warning("Please select a month before downloading the PDF.");
          return;
        }
    
        handleDownloadStudentPDF(logSelectedMonth,1);
      };
       const handleDownloadStudentPDF = (selectedmonth = null,selectedMonthStatus) => {
         setUpdateBtnStatus(true);
          axios({
            method: "post",
            url: `${constant.base_url}/admin/instructor_log_pdf_gen.php?fun=downloadinstructorpdf`,
            headers: { "Auth-Id": user.auth_id },
            data: {
              filter: listFilter,
              ...(selectedmonth && { selectedmonth }),
              student_id: studentID,
              selectedMonthStatus:selectedMonthStatus
            },
          }).then(async function (response) {
            checkUserLogin(response);
              const resData = response.data.data;
            if (resData.status === "1") {
              //window.open(response.data.data.pdf_link, '_blank');
              const response = await fetch(resData.pdf_link);
              if (!response.ok) {
                console.error('Network response was not ok.');
                return;
              }
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const urlParts = response.url.split('/');
              const filename = urlParts[urlParts.length - 1] || 'download.pdf';

              const anchor = document.createElement('a');
              anchor.href = url;
              anchor.download = filename;
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
              window.URL.revokeObjectURL(url);  
              setUpdateBtnStatus(false);
             /* setTimeout(() => {
                handleUnlinkPdfFile('student_log', resData.pdf_name);
              }, 3000);*/
  
              }
          })
          .catch(function (error) {
            console.error("Error during login:", error);
          });
        } 
  return (
    <>
      {(filterApiStatus) && (
        <>
          <InnerHeader
            heading={
              InstructorId && studentName
                ? `${studentName}'s Flying Logs`
                : "Instructor Flying Logs"
            }
            txtSubHeading={`Review all flying activities logged under ${studentName}. Includes drone IDs, battery use, location, and flight summaries for performance tracking.`}
            showButton={true}
            iconText="View Team"
            onClick={() => navigate("/my-team")}
          />
          <Card className="bg5 mt16 p12">
            <div>
              <div className="v-center jcsb flex-wrap mb16 pt12 brd-b1 pb12">
                <div className="v-center filter-lists flex-wrap" style={{ gap: "8px" }}>
                  <div className="plan-status">
                    <Dropdown
                      label={dateLabel}
                      options={studentDateListOptions}
                      selectedValue={date}
                      onValueChange={handleStudentDateChange}
                    />
                  </div>
                  <div className="report-date">
                    {showDateInput && dateRangeValue && (
                      <div
                        onClick={toggleDateRangeCalendar}
                        className="date-range-input"
                        style={{
                          cursor: "pointer",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          color: "#7b7b7b",
                          fontSize: "14px",
                        }}
                      >
                        {`${format(dateRangeValue[0].startDate, "dd/MM/yyyy")} - ${format(
                          dateRangeValue[0].endDate,
                          "dd/MM/yyyy"
                        )}`}
                      </div>
                    )}
                    {showDateRangeCalendar && (
                      <div ref={dateRangePickerRef}>
                        <DateRangePicker
                          onChange={handleDateRangeChange}
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={dateRangeValue}
                          direction="horizontal"
                          staticRanges={staticRangesWithToggle}
                          renderStaticRangeLabel={(range) => (
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <span style={{ marginRight: "4px" }}>{range.label}</span>
                            </div>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  <div className="plan-status">
                    <MultiDropdown
                      label="Branch"
                      options={branchListOptions}
                      selectedValues={selectedBranch}
                      onSelect={handleSelectBranch}
                      chips={1}
                    />
                  </div>
                  <div className="pr mt8">
                    <FaFilter
                      className="cp pr fs16 ml12 fc5"
                      onClick={handleFilterClick}
                    />
                    {filterCount > 0 && (
                        <span className="notification-count pa br50 fc1 fw6 cp" onClick={handleFilterClick}>
                          {filterCount}
                        </span>
                      )}
                  </div>
                  <button 
                    className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1"
                    onClick={applyFilter}
                  >
                    Apply
                  </button>
                  {filterStatus > 0 && <button
                      className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                      onClick={clearFilter}
                    >
                      Clear
                    </button>}
                </div>
              </div>
              {showFilterPopup && (
                <SidePopup show={showFilterPopup} onClose={closeFilter}>
                  <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                    <p className="fs18 fc1 ">Filters</p>
                    <button className="lead-close-button" onClick={closeFilter}>
                      X
                    </button>
                  </div>
                  <div className="filter-lists pl16 pt16 pr16">
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Courses</p>
                      <MultiDropdown
                        label="Courses"
                        options={courseListOptions}
                        selectedValues={selectedCourses}
                        onSelect={handleSelectCourses}
                        chips={1}
                      />
                    </div>
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">UAS Category</p>
                      <MultiDropdown
                        label="Category"
                        options={categoryOptions}
                        selectedValues={selectedCategory}
                        onSelect={handleSelectCategory}
                        chips={1}
                      />
                    </div>
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">UAS Class</p>
                      <MultiDropdown
                        label="Class"
                        options={classOptions}
                        selectedValues={selectedClass}
                        onSelect={handleSelectedClass}
                        chips={1}
                      />
                    </div>
                    <div className="log-select form-group-settings cm-fr searching-drop">
                      <p className="fc15 fw6 fs14 ls1 mb8">Drone UIN</p>
                      <MultiDropdown
                        label="Drone UIN"
                        options={droneListOptions}
                        selectedValues={selectedDrone}
                        onSelect={handleSelectDrone}
                        searchable
                        chips={1}
                      />
                    </div>
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Trainers</p>
                      <Dropdown
                        label="Select Trainer's"
                        options={instructorTypeListOptions}
                        selectedValue={selectInstructorType}
                        onValueChange={handleInstructorTypeChange}
                      />
                    </div>
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Exercise</p>
                      <Dropdown
                        label="Select Exercise"
                        options={exerciseListOptions}
                        selectedValue={selectedExercise}
                        onValueChange={handleSelectExercise}
                      />
                    </div>
                    <div className="df jcsb mb12 two-inputs">
                      <div className="flx48 w100 rm">
                        <div className="status-filter">
                          <p className="fc15 fw6 fs14 ls1 mb8">Flying Type</p>
                          <Dropdown
                            label="Select Flying Type"
                            options={flyingTypeListOptions}
                            selectedValue={selectedFlyingType}
                            onValueChange={handleFlyingTypeChange}
                          />
                        </div>
                      </div>
                      <div className="plan-status flx48">
                        <div className="status-filter">
                          <div className="time-picker fww">
                            <div className="time-row df fdc">
                              <label className="fc15 fw6 fs14 ls1">Start Time (IST)</label>
                              <div className="time-inp mt12 log-select custom-select">
                                <select
                                  name="From"
                                  value={start_time.from_time}
                                  onChange={handleTimeChange}
                                  className="mr4 bg5"
                                >
                                  <option value="">Start Time</option>
                                  <option value="01">01</option>
                                  <option value="02">02</option>
                                  <option value="03">03</option>
                                  <option value="04">04</option>
                                  <option value="05">05</option>
                                  <option value="06">06</option>
                                  <option value="07">07</option>
                                  <option value="08">08</option>
                                  <option value="09">09</option>
                                  <option value="10">10</option>
                                  <option value="11">11</option>
                                  <option value="12">12</option>
                                  <option value="13">13</option>
                                  <option value="14">14</option>
                                  <option value="15">15</option>
                                  <option value="16">16</option>
                                  <option value="17">17</option>
                                  <option value="18">18</option>
                                  <option value="19">19</option>
                                  <option value="20">20</option>
                                  <option value="21">21</option>
                                  <option value="22">22</option>
                                  <option value="23">23</option>
                                  <option value="24">24</option>
                                </select>
                                -  
                                <select
                                  name="To"
                                  value={start_time.to_time}
                                  onChange={handleTimeChange}
                                  className="mr4 bg5 ml4"
                                >
                                  <option value="">End Time</option>
                                  <option value="01">01</option>
                                  <option value="02">02</option>
                                  <option value="03">03</option>
                                  <option value="04">04</option>
                                  <option value="05">05</option>
                                  <option value="06">06</option>
                                  <option value="07">07</option>
                                  <option value="08">08</option>
                                  <option value="09">09</option>
                                  <option value="10">10</option>
                                  <option value="11">11</option>
                                  <option value="12">12</option>
                                  <option value="13">13</option>
                                  <option value="14">14</option>
                                  <option value="15">15</option>
                                  <option value="16">16</option>
                                  <option value="17">17</option>
                                  <option value="18">18</option>
                                  <option value="19">19</option>
                                  <option value="20">20</option>
                                  <option value="21">21</option>
                                  <option value="22">22</option>
                                  <option value="23">23</option>
                                  <option value="24">24</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="search-filter mb8">
                      <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                      <Dropdown
                        label={searchLabel}
                        options={searchByOptions}
                        selectedValue={searchBy}
                        onValueChange={handleSearchByChange}
                      />
                    </div>
                    <div className="search-filter mb8 v-center search-filter-finance">
                      {showSearchInput && (
                        <SearchInput
                          onSearchChange={handleSearchChange}
                          clearSignal={clearSignal}
                          placeholder={searchLabel}
                          workOrderID={searchLog}
                        />
                      )}
                    </div>
                  </div>
                  <div className="filter-button-container mt16 pt16 box-center myteam-filters ">
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1  cp"
                      onClick={closeFilter}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1  cp"
                      onClick={applyFilter}
                    >
                      Apply
                    </button>
                    {filterStatus > 0 && <button
                      className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                      onClick={clearFilter}
                    >
                      Clear
                    </button>}
                  </div>
                </SidePopup>
              )}
              {filterApplyStatus && (
                <FilteredDataDisplay
                  filterData={listFilter}
                  labels={filterLabels}
                  onClearAll={clearFilter}
                  onFilterCountChange={handleFilterCountChange}
                  listOptions={{
                    branchListOptions, 
                    courseListOptions, 
                    categoryOptions, 
                    classOptions, 
                    droneListOptions 
                  }}
                />
              )}
              <Card className="bg5 mt16 pb16">
                <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12">
                  <p className="fs14 fw5">
                    Total Records: {studentDataValue ? totalCountStudent : totalCount} | 
                    Total Flying Hours: {studentDataValue ? totalFlyingCountStudent : totalFlyingCount}
                  </p>
                  <div className="v-center">
                     {InstructorId!=="all" && totalCount>0 && 
                    <button
                      onClick={() => {
                        if (!updateBtnStatus) {
                          handleInstrctorLogsPDF(InstructorId);
                        }
                      }}
                      className={`bg1 br24 mr12 fs14 cp pl16 pr16 pt10 pb10 ls1 ${
                        updateBtnStatus ? "disabled-input" : "btn-blue"
                      }`}
                      disabled={updateBtnStatus}
                    >
                      Download PDF
                    </button>
                    }
                  {showTabCondition && (
                    <div className="v-center" style={{ gap: "12px" }}>
                      <p
                        className={`cp fs14 ${!studentDataValue ? "fc1" : ""}`}
                        onClick={handleInstructorLogListing}
                      >
                        Instructor
                      </p>
                      <p
                        className={`cp fs14 ${studentDataValue ? "fc1" : ""}`}
                        onClick={handleStudentLogListing}
                      >
                        Student
                      </p>
                    </div>
                  )}
                  </div>
                 
                </div>
                <div
                  className="booked table-container df w100 fdc mt16"
                  style={{ overflow: "auto" }}
                >
                  <table className="mylead-table cp wsnw">
                    <thead className="w100">
                      <tr>
                        <th style={{padding: '5px'}} rowSpan={2}>Id</th>
                        <th style={{padding: '5px'}} rowSpan={2}>Date</th>
                        <th style={{padding: '5px'}} colSpan={3}>UAS Details</th>
                        <th style={{padding: '5px'}} rowSpan={2}>RPA Trainer</th>
                        <th style={{padding: '5px'}} rowSpan={2}>Name of RPIC</th>
                        <th style={{padding: '5px'}} rowSpan={2}>RPA Trainee</th>
                        <th style={{padding: '5px'}} rowSpan={2}>
                          <DynamicTooltip direction="left" text="Route Of Flight/Place of Operation">
                            Place of <br/> Operation
                          </DynamicTooltip>
                        </th>
                        <th style={{padding: '5px'}} colSpan={2}>Time of Operation</th>
                        <th style={{padding: '5px'}} rowSpan={2}>Duration <br /> (HH:MM)</th>
                        <th style={{padding: '5px'}} colSpan={2}>Rotorcraft</th>
                        <th style={{padding: '5px'}} colSpan={2}>Aeroplane</th>
                        <th style={{padding: '5px'}} colSpan={2}>
                          <DynamicTooltip direction="left" text="Hybrid/Others">
                            Hybrid
                          </DynamicTooltip>
                        </th>
                        <th style={{padding: '5px'}} colSpan={3}>
                          <DynamicTooltip direction="left" text="Operational Condition Times">
                            Exercise Level
                          </DynamicTooltip>
                        </th>
                        <th style={{padding: '5px'}} rowSpan={2}>Night</th>
                        <th style={{padding: '5px'}} rowSpan={2}>Instructional <br/> Hours</th>
                        <th style={{padding: '5px'}} rowSpan={2}>
                          <DynamicTooltip direction="left" text="Exercise/Remarks/Performance">
                            Exercise/Remarks
                          </DynamicTooltip>
                        </th>
                        {(user.role === '1' || user.dept_id === "9") && (
                          <th style={{ padding: '5px' }} rowSpan={2}>Action</th>
                        )}

                      </tr>
                      <tr>
                        <th style={{padding: '5px'}}>Drone UIN</th>
                        <th style={{padding: '5px'}}>Class</th>
                        <th style={{padding: '5px'}}>Category</th>
                        <th style={{padding: '5px'}}>Start (GMT)</th>
                        <th style={{padding: '5px'}}>End (GMT)</th>
                        <th style={{padding: '5px'}}>Dual</th>
                        <th style={{padding: '5px'}}>RPIC</th>
                        <th style={{padding: '5px'}}>Dual</th>
                        <th style={{padding: '5px'}}>RPIC</th>
                        <th style={{padding: '5px'}}>Dual</th>
                        <th style={{padding: '5px'}}>RPIC</th>
                        <th style={{padding: '5px'}}>Basic</th>
                        <th style={{padding: '5px'}}>Special</th>
                        <th style={{padding: '5px'}}>Advanced</th>
                      </tr>
                    </thead>
                    {recordList.length > 0 ? (
                      <tbody>
                        {recordList.map((log, index) => (
                          <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.createDate}</td>
                            <td>{log.drone_id}</td>
                            <td>
                              <DynamicTooltip direction="left" text={log.full_class}>{log.class}</DynamicTooltip>
                            </td>
                            <td>
                              <DynamicTooltip direction="left" text={log.full_category}>{log.category}</DynamicTooltip>
                            </td>
                            <td>
                              <DynamicTooltip direction="left" text={log.full_trainer}>
                                {log.trainer && log.trainer.length > 10 ? log.trainer.slice(0, 10) + '...' : log.trainer}
                              </DynamicTooltip>
                            </td>
                            <td
                              onClick={(e) => {
                                if (log.redirect_lead === 1) {
                                  e.stopPropagation();
                                  handleLeadPageRedirect(log.student_id);
                                }
                              }}
                              style={{
                                cursor: log.redirect_lead === 1 ? 'pointer' : 'default',
                              }}
                            >
                              {(log.full_name_of_rpic && log.full_name_of_rpic !== "--") ? (
                                <DynamicTooltip direction="left" text={log.full_name_of_rpic}>
                                  {log.name_of_rpic && log.name_of_rpic.length > 10
                                    ? log.name_of_rpic.slice(0, 10) + "..."
                                    : log.name_of_rpic}
                                </DynamicTooltip>
                              ) : (
                                log.name_of_rpic
                              )}
                            </td>
                            {(log.full_student && log.full_student !== "--") ? (
                              <td 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLeadPageRedirect(log.student_id);
                                }}
                              >
                                <DynamicTooltip direction="left" text={log.full_student}>
                                  {log.student && log.student.length > 10
                                    ? log.student.slice(0, 10) + "..."
                                    : log.student}
                                </DynamicTooltip>
                              </td>
                            ) : (
                              <td>{log.student}</td>
                            )}
                            <td>{log.rpto}</td>
                            <td>{log.startTime}</td>
                            <td>{log.endTime}</td>
                            <td>{log.duration}</td>
                            <td>{log.rotoarcraft_dual}</td>
                            <td>{log.rotoarcraft_rpic}</td>
                            <td>{log.aeroplane_dual}</td>
                            <td>{log.aeroplane_rpic}</td>
                            <td>{log.other_dual}</td>
                            <td>{log.other_rpic}</td>
                            <td>{log.basic}</td>
                            <td>{log.special}</td>
                            <td>{log.advanced}</td>
                            <td>{log.night}</td>
                            <td>{log.instructional_hours}</td>
                            <td className="feedback-inquiry scrollable-cell"><p>{log.remarks}</p></td>
                            {user.role === '1' ? (
                              <td>
                              <DynamicTooltip direction="left" text="Edit Log">
                                <FaPencilAlt
                                  title="Edit"
                                  className="icon edit-icon ml12 cp fs18 fc5"
                                  style={{ verticalAlign: "middle", cursor: "pointer" }}
                                  onClick={() => handleEdit(log)}
                                />
                              </DynamicTooltip>
                              </td>
                            ) : user.dept_id === "9" && log.editFlag === 1 ? (
                              <td>
                              <DynamicTooltip direction="left" text="The Edit option will be disabled 30 min. after the student log is posted.">
                                <FaPencilAlt
                                  title="Edit"
                                  className="icon edit-icon ml12 cp fs18 fc5"
                                  style={{ verticalAlign: "middle", cursor: "pointer" }}
                                  onClick={() => handleEdit(log)}
                                />
                              </DynamicTooltip>
                              </td>
                            ) : ""}
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan={25} className="no-students">
                            No Log Found.
                          </td>
                        </tr>
                      </tbody>
                      
                    )}
                  </table>
                </div>
              </Card>
            </div>
          </Card>
          {/* {addLogPopup && (
            <Popup 
              onClose={handleAddLogPopupClose} 
              title={
                userDetail && (userDetail.name || userDetail.company_name)
                  ? `${
                      userDetail.user_type === "company"
                        ? userDetail.company_name || userDetail.name
                        : userDetail.name
                    }'s Flying Log - Add`
                  : "Student Flying Log - Add"
              }
            >
              <AddLogForm
                onClose={handleAddLogPopupClose}
                userDetail={studnetUserDetail}
                editMode={editMode}
                onSuccess={handleStudentLogSuccess}
              />
            </Popup>
          )} */}
          {showDroneLogMontlyData && (
              <div className="log-popup">
                <Popup title="" onClose={cancelDroneSelectPopup}>
                  <p className="ls1 lh22 fs16 mb24 tac">
                    Select the Month
                  </p>
                  <div className="batch-options">
                    <SingleDropdown
                      label="Select Month"
                      options={showCalendarData}
                      selectedOption={logSelectedMonth}
                      onSelect={handleSelectedMonth}
                      compulsory={<span className="fc4">*</span>}
                    />
                  </div>
                  <div className="popup-buttons mb24 df jcc">
                    <button onClick={()=>{if (!updateBtnStatus) {handleDownloadClick()}}}
                    className={`update-button box-center mr24  ${updateBtnStatus ? 'disabled-input' : 'btn-blue'}`}
                    >
                      Download PDF
                    </button>
                    <button onClick={cancelDroneSelectPopup} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                </Popup>
              </div>
            )}
          <ToastContainer position="bottom-right" />
        </>
      )}
    </>
  );
};

export default ViewTeamLogs;