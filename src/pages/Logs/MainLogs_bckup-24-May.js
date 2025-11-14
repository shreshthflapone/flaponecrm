import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import InnerHeader from "../../components/InnerHeader";
import "../MyReports/MyReports.css";
import DroneLogs from "./DroneList";
import ExerciseLogs from "./ExerciseList";
import BatteryLogs from "./BatteryList";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import MultiDropdown from "../../components/MultiDropdown";
import Dropdown from "../../components/Dropdown";
import { Tooltip } from "recharts";
import { FaFilter } from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup";
import { useParams } from "react-router-dom";
import SearchInput from "../../components/SearchInput.js";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const MainLogs = () => {
  const { id } = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  const dateRangePickerRef = useRef(null);

  const tabs = [
    { label: "Drone", value: "drone" },
    { label: "Exercise", value: "exercise" },
    { label: "Battery", value: "battery" },
  ];

  const [selectedTab, setSelectedTab] = useState(id ? id : "drone");
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  var oldFilter = {};
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedModelType, setSelectedModelType] = useState([]);
  const [selectedModelName, setSelectedModelName] = useState([]);
  const [droneStatus, setDroneStatus] = useState([]);
  const [exerciseStatus, setExerciseStatus] = useState([]);
  const [batteryStatus, setBatteryStatus] = useState([]);
  const [searchBy, setSearchBy] = useState("");
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [searchDrone, setSearchDrone] = useState("");
  const [batterySearchBy, setBatterySearchBy] = useState("");
  const [batterySearchLabel, setBatterySearchLabel] = useState("Search By");
  const [searchBattery, setSearchBattery] = useState("");
  const [exerciseSearchBy, setExerciseSearchBy] = useState("");
  const [exerciseSearchLabel, setExerciseSearchLabel] = useState("Search By");
  const [searchExercise, setSearchExercise] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);
  const [selectDuration, setSelectDuration] = useState({
    value: "",
    label: "Select Duration",
  });
  const [selectStudentType, setSelectStudentType] = useState({
    value: "",
    label: "Select Ex. Type - Student",
  });
  const [selectInstructorType, setSelectInstructorType] = useState({
    value: "",
    label: "Select Ex. Type - Instructor",
  });
  const [selectTime, setSelectTime] = useState({
    value: "",
    label: "Select Period",
  });

  const searchOptionsMap = {
    drone: [
      { value: "", label: "Select Search By" },
      { value: "drone_id", label: "Drone ID (UIN)" },
    ],
    exercise: [
      { value: "", label: "Select Search By" },
      { value: "name", label: "Ex. Name" },
    ],
    battery: [
      { value: "", label: "Select Search By" },
      { value: "battery_no", label: "Battery No" },
    ],
  };
  
  const [droneDate, setDroneDate] = useState("");
  const [droneDateLabel, setDroneDateLabel] = useState("Select Date");
  const [exerciseDate, setExerciseDate] = useState("");
  const [exerciseDateLabel, setExerciseDateLabel] = useState("Select Date");
  const [batteryDate, setBatteryDate] = useState("");
  const [batteryDateLabel, setBatteryDateLabel] = useState("Select Date");
  const [showDateInput, setShowDateInput] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filterApplyStatus, setFilterApplyStatus] = useState(false);
  const limit = 50;
  const [recordList, setRecordList] = useState([]);
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [allApidata, setAllApiData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(0);
  const [dateTimeType, setDateTimeType] = useState("");
  const [listFilter, setListFilter] = useState({});

  const handleTabChange = (value) => {
    navigate(`/inventory/`+value);
    setSelectedTab(value);
    setShowSearchInput(false);
  };

  const toggleDateRangeCalendar = () => {
    setShowDateRangeCalendar(!showDateRangeCalendar);
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
  const handleSelectModelName = (value) => {
    const index = selectedModelName.indexOf(value);
    if (index === -1) {
      setSelectedModelName([...selectedModelName, value]);
    } else {
      const updatedValues = [...selectedModelName];
      updatedValues.splice(index, 1);
      setSelectedModelName(updatedValues);
    }
  };
  const handleSelectModelType = (value) => {
    const index = selectedModelType.indexOf(value);
    if (index === -1) {
      setSelectedModelType([...selectedModelType, value]);
    } else {
      const updatedValues = [...selectedModelType];
      updatedValues.splice(index, 1);
      setSelectedModelType(updatedValues);
    }
  };
  const handleDateRangeChange = (item) => {
    setDateRangeValue([item.selection]);
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

  const [batteryDateListOptions, setBatteryDateListOptions] = useState([]);
  const [searchByOptions, setSearchByOptions] = useState([]);
  const [searchByExerciseOptions, setSearchByExerciseOptions] = useState([]);
  const [searchByBatteryOptions, setSearchByBatteryOptions] = useState([]);
  const [droneDateListOptions, setDroneDateListOptions] = useState([]);
  const [branchListOptions, setBranchListOptions] = useState([]);
  const [droneListOptions, setDroneListOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [droneStatusOptions, setDroneStatusOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [modelTypeOptions, setModelTypeOptions] = useState([]);
  const [modelNameOptions, setModelNameOptions] = useState([]);
  const [durationListOptions, setDurationListOptions] = useState([]);
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [studentTypeListOptions, setStudentTypeListOptions] = useState([]);
  const [exerciseStatusOptions, setExerciseStatusOptions] = useState([]);
  const [batteryStatusOptions, setBatteryStatusOptions] = useState([]);
  const [instructorTypeListOptions, setInstructorTypeListOptions] = useState([]);
  const [timeListOptions, setTimeListOptions] = useState([]);
  const [exerciseDateListOptions, setExerciseDateListOptions] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeSortColumn, setActiveSortColumn] = useState("id");
  
  const handleStatusChange = (value) => {
    const index = droneStatus.indexOf(value);
    if (index === -1) {
      setDroneStatus([...droneStatus, value]);
    } else {
      const updatedValues = [...droneStatus];
      updatedValues.splice(index, 1);
      setDroneStatus(updatedValues);
    }
  };

  const handleExerciseStatusChange = (value) => {
    const index = exerciseStatus.indexOf(value);
    if (index === -1) {
      setExerciseStatus([...exerciseStatus, value]);
    } else {
      const updatedValues = [...exerciseStatus];
      updatedValues.splice(index, 1);
      setExerciseStatus(updatedValues);
    }
  };

  const handleBatteryStatusChange = (value) => {
    
    const index = batteryStatus.indexOf(value);
    if (index === -1) {
      setBatteryStatus([...batteryStatus, value]);
    } else {
      const updatedValues = [...batteryStatus];
      updatedValues.splice(index, 1);
      setBatteryStatus(updatedValues);
    }
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
    setSearchDrone(value);
  };

  const handleBatterySearchByChange = (option) => {
    setBatterySearchBy(option.value);
    setBatterySearchLabel(option.label);
    if (option.value) {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
  };
  const handleBatterySearchChange = (value) => {
    setSearchBattery(value);
  };

  const handleExerciseSearchByChange = (option) => {
    setExerciseSearchBy(option.value);
    setExerciseSearchLabel(option.label);
    if (option.value) {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
  };
  const handleExerciseSearchChange = (value) => {
    setSearchExercise(value);
  };

  const handleDurationChange = (value) => {
    setSelectDuration(value);
  }
  const handleStudentTypeChange = (value) => {
    setSelectStudentType(value);
  }
  const handleInstructorTypeChange = (value) => {
    setSelectInstructorType(value);
  }
  const handleTimeChange = (value) => {
    setSelectTime(value);
  }
  
  const handleBatteryDateChange = (option) => {
    setBatteryDate(option.value);
    setBatteryDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
      setShowDateInput(true);
    } else {
      setShowDateRangePicker(false);
      setShowDateInput(false);
    }
  };
  const handleDroneDateChange = (option) => {
    setDroneDate(option.value);
    setDroneDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
      setShowDateInput(true);
    } else {
      setShowDateRangePicker(false);
      setShowDateInput(false);
    }
  }
  const handleExerciseDateChange = (option) => {
    setExerciseDate(option.value);
    setExerciseDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
      setShowDateInput(true);
    } else {
      setShowDateRangePicker(false);
      setShowDateInput(false);
    }
  };
  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };
  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  const initial_obj = {
    page_type: id ? id : selectedTab,
    dateOptionsselect:"",
    selectStatus:"",
    selectedBranch:[],
    selectedCategory:[],
    selectedClass:[],
    selectedModeltype:[],
    selectedModelName:[],
    selectedDroneId:[],
    setSelectedCourses:[],
    exerciseStatus:[],
    batteryStatus:[],
    selectedDrone:[],
    selectStudentType:({
      value: "",
      label: "Select Ex. Type - Student",
    }),
    selectInstructorType:({
      value: "",
      label: "Select Ex. Type - Instructor",
    }),
    selectTime:({
      value: "",
      label: "Select Period",
    }),
    searchBy:"",
    searchByValue:"",
    dateRangeValue:{
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
    dateRangeValuefilter: "",
  }
  const applyFilter = async () => {
      setFilterApplyStatus(true);
      setAllApiData([]);
      let updatefilter = {
        ...listFilter,
        page_type: selectedTab,
        dronedateOptionsselect:droneDate,
        batterydateOptionsselect:batteryDate,
        exercisedateOptionsselect:exerciseDate,
        searchBy:searchBy,
        batterySearchBy:batterySearchBy,
        exerciseSearchBy:exerciseSearchBy,
        searchByDroneValue:searchDrone,//
        searchByBatteryValue:searchBattery,
        searchByExerciseValue:searchExercise,
        dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
        dateRangeValuefilter: dateRangeValue,
        selectStatus:droneStatus,
        selectExerciseStatus: exerciseStatus,
        selectedBranch:selectedBranch,
        selectedCategory:selectedCategory,
        selectedClass:selectedClass,
        selectedModeltype:selectedModelType,
        selectedModelName:selectedModelName,
        selectedCourses:selectedCourses,
        selectStudentType:selectStudentType,
        selectInstructorType:selectInstructorType,
        selectTime:selectTime,
        batteryStatus:batteryStatus,
        selectedDrone:selectedDrone,
      };
      var getoldfilter = localStorage.getItem("allfilterinventory");
      if (getoldfilter) {
        oldFilter = JSON.parse(getoldfilter);
      }
      oldFilter[selectedTab] = updatefilter;
      localStorage.setItem("allfilterinventory", JSON.stringify(oldFilter));
      
      setListFilter(updatefilter);
      setPageNum(1);
      closeFilter();
    }
  const clearFilter = () => {
    FilterAllStateClear();
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

  const FilterAllStateClear=()=>{
    setFilterCount(0);
    setFilterStatus(0);
    setDroneDate("");
    setDroneDateLabel("Select Date");
    setBatteryDate("");
    setBatteryDateLabel("Select Date");
    setExerciseDate("");
    setExerciseDateLabel("Select Date");
    setSearchDrone("");
    setSearchBattery("");
    setSearchExercise("");
    setBatterySearchBy("");
    setExerciseSearchBy("");
    setSearchLabel("Search By");
    setBatterySearchLabel("Search By");
    setExerciseSearchLabel("Search By");
    setClearSignal(true);
    setShowDateInput(false);;
    setPageNum(1);
    setTotalPageNum(0);
    setAllApiData([]);
    setDroneStatus([]);
    setSelectedBranch([]);
    setExerciseStatus([]);
    setBatteryStatus([]);
    setSelectedCategory([]);
    setSelectedClass([]);
    setSelectedModelType([]);
    setSelectedModelName([]);
    setSelectedCourses([]);
    setSelectedDrone([]);
    setShowSearchInput(false);
    setSelectStudentType({
      value: "",
      label: "Select Ex. Type - Student",
    });
    setSelectInstructorType({
      value: "",
      label: "Select Ex. Type - Instructor",
    });
    setSelectTime({
      value: "",
      label: "Select Period",
    });
    
    setDateRangeValue([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 0),
        key: "selection",
      },
    ]);
  }
  const updateSetListingFilter = async () => {
    let updatefilter = {
      ...initial_obj,
      page_type: id ? id : selectedTab
    };
  
    setListFilter({ ...updatefilter });
  };
  useEffect(()=>{
    if(listFilter.page_type==selectedTab){
      getAllFilter();
    }
  },[selectedTab,listFilter]);


  const setLocalStorage = async () =>  {
    var getoldfilter = localStorage.getItem("allfilterinventory");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab] ? oldFilter[selectedTab]:"";
      if (currenttabfilter) {
        setListFilter(currenttabfilter);
        setFilterApplyStatus(true);
        let dateOptionKey = "";
      let dateOptionList = [];
      let dateChangeHandler = () => {};

      switch (selectedTab) {
        case "drone":
          dateOptionKey = "dronedateOptionsselect";
          dateOptionList = droneDateListOptions;
          dateChangeHandler = handleDroneDateChange;
          break;
        case "battery":
          dateOptionKey = "batterydateOptionsselect";
          dateOptionList = batteryDateListOptions;
          dateChangeHandler = handleBatteryDateChange;
          break;
        case "exercise":
          dateOptionKey = "exercisedateOptionsselect";
          dateOptionList = exerciseDateListOptions;
          dateChangeHandler = handleExerciseDateChange;
          break;
        default:
          dateOptionKey = "dronedateOptionsselect";
          dateOptionList = droneDateListOptions;
          dateChangeHandler = handleDroneDateChange;
      }

      if (currenttabfilter[dateOptionKey]) {
        const filterdateobj = dateOptionList.find(
          (item) => item.value === currenttabfilter[dateOptionKey]
        );
        if (filterdateobj) {
          dateChangeHandler(filterdateobj);
          setShowDateRangePicker(false);
          setShowDateRangeCalendar(false);
        }
      }
        if (currenttabfilter && currenttabfilter["selectStatus"]) {
          setDroneStatus(currenttabfilter["selectStatus"]);
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
        if (currenttabfilter && currenttabfilter["selectedModelType"]) {
          setSelectedModelType(currenttabfilter["selectedModelType"]);
        }
        if (currenttabfilter && currenttabfilter["selectedModelName"]) {
          setSelectedModelName(currenttabfilter["selectedModelName"]);
        }
        if (currenttabfilter && currenttabfilter["selectExerciseStatus"]) {
          setExerciseStatus(currenttabfilter["selectExerciseStatus"]);
        }
        if (currenttabfilter && currenttabfilter["batteryStatus"]) {
          setBatteryStatus(currenttabfilter["batteryStatus"]);
        }
        if (currenttabfilter && currenttabfilter["selectedBranch"]) {
          setSelectedBranch(currenttabfilter["selectedBranch"]);
        }
        if (currenttabfilter && currenttabfilter["selectedDrone"]) {
          setSelectedDrone(currenttabfilter["selectedDrone"]);
        }

      } else {
        updateSetListingFilter();
      }
    } else {
      updateSetListingFilter();
    }
  }

  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          const filterList = response.data.data.data;
          setAllApiFilter(filterList);
          setBatteryDateListOptions(filterList.batteryDateListOptions || []);
          setSearchByOptions(filterList.searchByOptions || []);
          setDroneDateListOptions(filterList.droneDateListOptions || []);
          setBranchListOptions(filterList.locationData || []);
          setDroneListOptions(filterList.droneListOptions || []);
          setCategoryOptions(filterList.categoryOptions || []);
          setDroneStatusOptions(filterList.StatusOptions || []);
          setClassOptions(filterList.uasClassOptions || []);
          setModelTypeOptions(filterList.modelTypeOptions || []);
          setModelNameOptions(filterList.modelNameOptions || []);
          setDurationListOptions(filterList.durationListOptions || []);
          setCourseListOptions(filterList.courseData || []);
          setStudentTypeListOptions(filterList.studentTypeListOptions || []);
          setInstructorTypeListOptions(filterList.instructorTypeListOptions || []);
          setTimeListOptions(filterList.timeListOptions || []);
          setExerciseStatusOptions(filterList.exerciseStatusOptions || []);
          setExerciseDateListOptions(filterList.exerciseDateListOptions || []);
          setSearchByExerciseOptions(filterList.searchByExerciseOptions || []);
          setSearchByBatteryOptions(filterList.searchByBatteryOptions || []);
          setBatteryStatusOptions(filterList.batteryStatusOptions || []);
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
  useEffect(()=>{
    FilterAllStateClear();
    setLocalStorage();
  },[selectedTab]);

  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getListRecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: pageNum, limit: limit, filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          if (pageNum === 1) {
            setAllApiData(response.data.data);
            setTotalPageNum(response.data.data.total_page);
            setRecordList([...response.data.data.list]);
          } else {
            setRecordList([...recordList, ...response.data.data.list]);
          }
          setPageNum((prevPageNum) => prevPageNum + 1);
          setDataStatus(true);
        } else {
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
    if(filterApiStatus && listFilter.page_type==selectedTab){
      getListRecord();
    }
  }, [selectedTab,filterApiStatus,listFilter]);
  useEffect(() => {
    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const { scrollHeight, scrollTop, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 70 && !isFetching) {
          setIsFetching(true);
          if (pageNum <= totalPageNum) {
            getListRecord();
          }
        }
      }, 200); // Adjust the debounce delay as needed
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum]);

  const filterLabels = {
    page_type: "Page Type",
    dateOptionsselect: "Select Date Type",
    dateRangeValue: "Date Range",
    selectedCourses: "Courses",
    dateRangeValuefilter: "Date Range Filter",
    selectStatus:"Status",
    selectExerciseStatus:"Status",
    selectedBranch:"Branch",
    selectedCategory:"UAS Category",
    selectedClass:"UAS Class",
    selectedModeltype:"Model Type",
    selectedModelName:"Model Name",

  };
  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };
  const sortList = useMemo(() => {
      let sortedList = [...recordList];
      sortedList.sort((a, b) => {
          // Handle null or undefined values for sortBy field
          const aValue = a[sortBy] ? a[sortBy]: ""; // Use nullish coalescing to handle null/undefined
          const bValue = b[sortBy] ? b[sortBy]:  ""; // Use nullish coalescing to handle null/undefined
  
          // Use localeCompare for string comparison, numeric for id
          if (
              sortBy === "id"
          ) {
              return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]; 
          } else {
              const comparison = aValue
                  .toString()
                  .localeCompare(bValue.toString(), undefined, { numeric: true });
              return sortDirection === "asc" ? comparison : -comparison;
          }
      });
  
      return sortedList;
  }, [recordList, sortBy, sortDirection]);
  useEffect(()=>{
      FilterAllStateClear();
      setLocalStorage();
      if(selectedTab==='drone'){
        handleSortByChange('id');
      }else if(selectedTab==='exercise'){
        handleSortByChange('id');
      }else if(selectedTab==='battery'){
        handleSortByChange('id');
      }else{
        handleSortByChange('id');
      }
  },[selectedTab]);
  const handleSortByChange = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setActiveSortColumn(field);
  };
  return (
    <>
      {(filterApiStatus) && (
      <>
        <InnerHeader
          heading="Inventory & Activity Records"
          txtSubHeading="A centralized log of drones, batteries, and training exercises. Keeping these records up-to-date is critical for efficient resource management and training effectiveness."
          showButton={false}
          iconText="Add New Lead"
        />
        <Card className="bg5 mt16 pb16">
          <Tabs
            tabs={tabs}
            showCheckboxes={false}
            showFilter={false}
            onTabChange={handleTabChange}
            // count={allTabListCount}
            selectedTab={selectedTab}
          />
          <div className="myteam-filters mylead-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww ">
            <div className="left-side-filter v-center fww">
              {(selectedTab === "drone") && (
                <>
                  <div className="mr8 plan-status mb8">
                    <Dropdown
                      label={droneDateLabel}
                      options={droneDateListOptions}
                      selectedValue={droneDate}
                      onValueChange={handleDroneDateChange}
                    />
                  </div>
                  <div className="report-date mb8 mr8">
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
                        {`${format(
                          dateRangeValue[0].startDate,
                          "dd/MM/yyyy"
                        )} - ${format(dateRangeValue[0].endDate, "dd/MM/yyyy")}`}
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
                        />
                      </div>
                    )}
                  </div>
                  <div className="mr8 plan-status mb8">
                    <MultiDropdown
                      label="Status"
                      options={droneStatusOptions}
                      selectedValues={droneStatus}
                      onSelect={handleStatusChange}
                      chips={1}
                    />
                  </div>
                </>
              )}
              {selectedTab === "battery" && (
                <>
                  <div className="mr8 plan-status mb8">
                    <Dropdown
                      label={batteryDateLabel}
                      options={batteryDateListOptions}
                      selectedValue={batteryDate}
                      onValueChange={handleBatteryDateChange}
                    />
                  </div>
                  <div className="report-date mb8 mr8">
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
                        {`${format(
                          dateRangeValue[0].startDate,
                          "dd/MM/yyyy"
                        )} - ${format(dateRangeValue[0].endDate, "dd/MM/yyyy")}`}
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
                        />
                      </div>
                    )}
                  </div>
                  <div className="mr8 plan-status mb8">
                    <MultiDropdown
                      label="Status"
                      options={batteryStatusOptions}
                      selectedValues={batteryStatus}
                      onSelect={handleBatteryStatusChange}
                      chips={1}
                    />
                  </div>
                </>
              )}

              {(selectedTab === "exercise") && (
                <>
                  <div className="mr8 plan-status mb8">
                    <Dropdown
                      label={exerciseDateLabel}
                      options={exerciseDateListOptions}
                      selectedValue={exerciseDate}
                      onValueChange={handleExerciseDateChange}
                    />
                  </div>
                  <div className="report-date mb8 mr8">
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
                        {`${format(
                          dateRangeValue[0].startDate,
                          "dd/MM/yyyy"
                        )} - ${format(dateRangeValue[0].endDate, "dd/MM/yyyy")}`}
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
                        />
                      </div>
                    )}
                  </div>
                  <div className="mr8 plan-status mb8">
                    <MultiDropdown
                      label="Ex. Status"
                      options={exerciseStatusOptions}
                      selectedValues={exerciseStatus}
                      onSelect={handleExerciseStatusChange}
                      chips={1}
                    />
                  </div>
                </>
              )}
              <FaFilter
                className="cp fs16 mb8 ml12 fc5"
                onClick={handleFilterClick}
              />
              <button className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mb8" onClick={applyFilter}>
                Apply
              </button>
              {filterStatus > 0 && <button
                className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb8"
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
              {selectedTab === "drone" && (
                <>
                  <div className="filter-lists pl16 pt16 pr16">
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Branch</p>
                      <MultiDropdown
                        label="Branch"
                        options={branchListOptions}
                        selectedValues={selectedBranch}
                        onSelect={handleSelectBranch}
                        chips={1}
                      />
                    </div>

                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Category</p>
                      <MultiDropdown
                        label="Category"
                        options={categoryOptions}
                        selectedValues={selectedCategory}
                        onSelect={handleSelectCategory}
                        chips={1}
                      />
                    </div>

                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Class</p>
                      <MultiDropdown
                        label="Class"
                        options={classOptions}
                        selectedValues={selectedClass}
                        onSelect={handleSelectedClass}
                        chips={1}
                      />
                    </div>

                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Model Type</p>
                      <MultiDropdown
                        label="Model Type"
                        options={modelTypeOptions}
                        selectedValues={selectedModelType}
                        onSelect={handleSelectModelType}
                        chips={1}
                      />
                    </div>

                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Model Name</p>
                      <MultiDropdown
                        label="Model Name"
                        options={modelNameOptions}
                        selectedValues={selectedModelName}
                        onSelect={handleSelectModelName}
                        chips={1}
                      />
                    </div>
                    <div className="filter-lists">
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
                            clearSignal={false}
                            placeholder={searchLabel}
                            prefiledvalue={searchDrone}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "battery" && (
                <>
                  <div className="filter-lists pl16 pt16 pr16">
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Branch</p>
                      <MultiDropdown
                        label="Branch"
                        options={branchListOptions}
                        selectedValues={selectedBranch}
                        onSelect={handleSelectBranch}
                        chips={1}
                      />
                    </div>
                    <div className="form-group-settings cm-fr searching-drop mb0">
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
                    
                    <div className="filter-lists pt16">
                      <div className="search-filter mb8">
                        <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                        <Dropdown
                          label={batterySearchLabel}
                          options={searchByBatteryOptions}
                          selectedValue={batterySearchBy}
                          onValueChange={handleBatterySearchByChange}
                        />
                      </div>
                      <div className="search-filter mb8 v-center search-filter-finance">
                        {showSearchInput && (
                          <SearchInput
                            onSearchChange={handleBatterySearchChange}
                            clearSignal={false}
                            placeholder={batterySearchLabel}
                            prefiledvalue={searchBattery}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "exercise" && (
                <>
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
                      <p className="fc15 fw6 fs14 ls1 mb8">Exercise Type - Student</p>
                      <Dropdown
                        label="Select Exercise Type - Student"
                        options={studentTypeListOptions}
                        selectedValue={selectStudentType}
                        onValueChange={handleStudentTypeChange}
                      />
                    </div>
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Exercise Type - Instructor</p>
                      <Dropdown
                        label="Select Exercise Type - Instructor"
                        options={instructorTypeListOptions}
                        selectedValue={selectInstructorType}
                        onValueChange={handleInstructorTypeChange}
                      />
                    </div>
                    <div className="status-filter mb12">
                      <p className="fc15 fw6 fs14 ls1 mb8">Period</p>
                      <Dropdown
                        label="Period"
                        options={timeListOptions}
                        selectedValue={selectTime}
                        onValueChange={handleTimeChange}
                      />
                    </div>
                    <div className="filter-lists">
                      <div className="search-filter mb8">
                        <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                        <Dropdown
                          label={exerciseSearchLabel}
                          options={searchByExerciseOptions}
                          selectedValue={exerciseSearchBy}
                          onValueChange={handleExerciseSearchByChange}
                        />
                      </div>
                      <div className="search-filter mb8 v-center search-filter-finance">
                        {showSearchInput && (
                          <SearchInput
                            onSearchChange={handleExerciseSearchChange}
                            clearSignal={false}
                            placeholder={exerciseSearchLabel}
                            prefiledvalue={searchExercise}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                <button
                  type="button"
                  className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 cp"
                  onClick={clearFilter}
                >
                  Clear
                </button>
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
                courseListOptions
              }}
            />
          )}
          {dataStatus && selectedTab === "drone" && 
            <DroneLogs 
              recordList={sortList}
              allApidata={allApidata}
              handleSortByChange={handleSortByChange}
              activeSortColumn={activeSortColumn}
            />
          }
          {dataStatus && selectedTab === "exercise" && 
            <ExerciseLogs 
              recordList={sortList}
              allApidata={allApidata}
              handleSortByChange={handleSortByChange}
              activeSortColumn={activeSortColumn}
            />
          }
          {dataStatus && selectedTab === "battery" && 
            <BatteryLogs 
              recordList={sortList}
              allApidata={allApidata}
              handleSortByChange={handleSortByChange}
              activeSortColumn={activeSortColumn}
            />
          }
        </Card>
      </>
    )}
    </>
  );
};

export default MainLogs;
