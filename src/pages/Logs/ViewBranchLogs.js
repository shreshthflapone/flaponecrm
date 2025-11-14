import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
import { FaFilter } from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup";
import constant from "../../constant/constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";


const ViewBranchLogs = () => {
  const { LocationId } = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  
  const limit = 50;
  const [selectedTab, setSelectedTab] = useState("branch_log");
  const [locationName, setLocationName] = useState("");
  const dateRangePickerRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [date, setDate] = useState("");
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [showDateInput, setShowDateInput] = useState(false);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [listFilter, setListFilter] = useState({});
  const [filterCount, setFilterCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState(0);
  const [totalFlyingCount, setTotalFlyingCount] = useState("00:00");
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [selectInstructorName, setSelectInstructorName] = useState({
    value: "",
    label: "Select Trainers",
  });
  const [filterApplyStatus, setFilterApplyStatus] = useState(false);
  const [dateListOptions, setDateListOptions] = useState([]);
  const [branchListOptions, setBranchListOptions] = useState([]);
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [instructorTypeListOptions, setInstructorTypeListOptions] = useState([]);
  const [instructorNameListOptions, setInstructorNameListOptions] = useState([]);
  const [exerciseListOptions, setExerciseListOptions] = useState([]);
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [recordList, setRecordList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [dateTimeType, setDateTimeType] = useState("");
  const [selectInstructorType, setSelectInstructorType] = useState({
    value: "",
    label: "Select Instructor",
  });
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
  var oldFilter = {};
  const initial_obj = {
    page_type:selectedTab,
    log_id: LocationId != "all" ? LocationId : "",
    date: "",
    selectedBranch:[],
    selectedCourses:[],
    selectedExercise:"",
    selectInstructorType:({
      value: "",
      label: "Select Instructor",
    }),
    selectInstructorName:({
      value: "",
      label: "Select Trainers",
    }),
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
      log_id: LocationId != "all" ? LocationId : "",
      date:date,
      dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      dateRangeValuefilter: dateRangeValue,
      selectedBranch:selectedBranch,
      selectedCourses:selectedCourses,
      selectInstructorType:selectInstructorType,
      selectInstructorName:selectInstructorName,
      selectedExercise:selectedExercise,
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
  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };
  const clearFilter = () => {
    setFilterCount(0);
    setPageNum(1);
    FilterAllStateClear();
    let updatefilter = {
      ...listFilter,
      log_id: LocationId,
      date:"",
      dateRangeValue:"",
      dateRangeValuefilter: "",
      selectedBranch:[],
      selectedCourses:[],
      selectInstructorType:"",
      selectInstructorName:"",
      selectedExercise:"",
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
    setListFilter({ ...updatefilter });
    getAllFilter();
    updateSetListingFilter();
    closeFilter();
    setFilterApplyStatus(false);
  };
  const FilterAllStateClear=()=>{
    setFilterStatus(0);
    setDate("");
    setDateLabel("Select Date");
    setSelectedBranch([]);
    setSelectedExercise("");
    setSelectedCourses([]); 
    setSelectInstructorType({
      value: "",
      label: "Select Instructor",
    });
    setSelectInstructorName({
      value: "",
      label: "Select Trainers",
    });
    setShowDateInput(false);
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
      page_type: selectedTab
    };
  
    setListFilter({ ...updatefilter });
  };
  const handleDateChange = (option) => {
    setDate(option.value);
    setDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
      setShowDateInput(true);
    } else {
      setShowDateRangePicker(false);
      setShowDateInput(false);
    }
  }
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
  const toggleDateRangeCalendar = () => {
    setShowDateRangeCalendar(!showDateRangeCalendar);
  };
  const handleDateRangeChange = (item) => {
    setDateRangeValue([item.selection]);
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
  
  const handleInstructorNameChange = (value) => {
    setSelectInstructorName(value);
  }
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

  
  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };
  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };

  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: {  },
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        const filterList = response.data.data.data;
        setAllApiFilter(filterList);
        setInstructorTypeListOptions(filterList.instructorTypeListOptions || []);
        setDateListOptions(filterList.branchLogDateListOptions || []);
        setCourseListOptions(filterList.courseData || []);
        setBranchListOptions(filterList.locationData || []);
        setInstructorNameListOptions(filterList.instructorList || []);
        setExerciseListOptions(filterList.exerciseListOptions || []);
        setFilterApiStatus(true);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  useEffect(()=>{
    getAllFilter();
  },[]);
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const getBranchLogListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getBranchLogListRecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: pageNum, limit: limit, filter: listFilter },
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
        setLocationName(response.data.data.location_name);
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
          if (pageNum <= totalPageNum) {
          }
        }
      }, 200); // Adjust the debounce delay as needed
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum]);
  
  useEffect(() => {
    if(filterApiStatus && listFilter.page_type===selectedTab){
      getBranchLogListRecord();
    }
  }, [selectedTab,filterApiStatus,listFilter]);

  const setLocalStorage = async () =>  {
    var getoldfilter = localStorage.getItem("allfilterinventory");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab] ? oldFilter[selectedTab]:"";
      if (currenttabfilter) {
        setFilterApplyStatus(true);
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["date"]) {
          let filterdateobj = dateListOptions.find(
            (item) => item.value === currenttabfilter["date"]
          );
          if (filterdateobj) {
            handleDateChange(filterdateobj);
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
        if (currenttabfilter && currenttabfilter["selectedCourses"]) {
          setSelectedCourses(currenttabfilter["selectedCourses"]);
        }
        if (currenttabfilter && currenttabfilter["selectedExercise"]) {
          setSelectedExercise(currenttabfilter["selectedExercise"]);
        }
      } else {
        updateSetListingFilter();
      }
    } else {
      updateSetListingFilter();
    }
  }
  const handleSelectExercise = (value) => {
    setSelectedExercise(value);
  };
  useEffect(()=>{
    FilterAllStateClear();
    setLocalStorage();
  },[selectedTab]);

  const filterLabels = {
    date: "Date Type",
    dateRangeValue: "Date Range",
    selectedCourses: "Courses",
    dateRangeValuefilter: "Date Range Filter",
    selectedBranch:"Branch",
    selectInstructorType: "Instructor Type",
    selectInstructorName: "Trainer",
    log_id: "Branch ID",
    selectedExercise: "Exercise Name",
  };

  {/*useEffect(() => {
    if (LocationId !== "all") {
      const fetchBranchData = async () => {
        axios({
          method: "post",
          url: `${constant.base_url}/admin/inventory_list.php?fun=branchInfo`,
          headers: { "Auth-Id": user.auth_id },
          data: { 'location_id': LocationId},
        }).then(function (response) {
          if (response.data.data.status === "1" && response.data.data.data) {
            const data = response.data.data.data;
            setLocationName(data.name);
          } else {
            setLocationName("");
          }
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
      };
  
      fetchBranchData();
    } else {
      setLocationName("");
    }
  }, [LocationId]); */}
   const handleLeadPageRedirect = (student_id) => {
    window.open(`/my-leads/${student_id}`, "_blank");
  }
  return (
    <>
      <InnerHeader
        heading={`Branch Logs - ${locationName}`}
        txtSubHeading={`Browse all drone operations and related activities conducted at the ${locationName} location. Useful for location-wise analysis and reporting.`}
        showButton={true}
        iconText="View Location"
        onClick={() => navigate("/location-list")}
      />
      <Card className="bg5 mt16 p12">
        <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww">
          <div className="left-side-filter v-center fww">
            <div className="mr8 plan-status mb8">
              <Dropdown
                label={dateLabel}
                options={dateListOptions}
                selectedValue={date}
                onValueChange={handleDateChange}
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
            {/* <div className="status-filter mb8">
              <MultiDropdown
                label="Branch"
                options={branchListOptions}
                selectedValues={selectedBranch}
                onSelect={handleSelectBranch}
                chips={1}
              />
            </div> */}
            <div className="status-filter mb8">
              <MultiDropdown
                label="Courses"
                options={courseListOptions}
                selectedValues={selectedCourses}
                onSelect={handleSelectCourses}
                chips={1}
              />
            </div>
            <div className="pr mr8">
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
            <button className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8" onClick={applyFilter}>
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
        {filterApplyStatus && (
          <FilteredDataDisplay
            filterData={listFilter}
            labels={filterLabels}
            onClearAll={clearFilter}
            onFilterCountChange={handleFilterCountChange}
            listOptions={{ 
              courseListOptions,
            }}
          />
        )}
        {showFilterPopup && (
          <SidePopup show={showFilterPopup} onClose={closeFilter}>
            <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Filters</p>
              <button className="lead-close-button" onClick={closeFilter}>
                X
              </button>
            </div>
            <div className="filter-lists pl16 pt16 pr16">
              {/* <div className="status-filter mb8">
                <p className="fc15 fw6 fs14 ls1 mb8">Courses</p>
                <MultiDropdown
                  label="Courses"
                  options={courseListOptions}
                  selectedValues={selectedCourses}
                  onSelect={handleSelectCourses}
                  chips={1}
                />
              </div> */}
              <div className="status-filter mb12">
                <p className="fc15 fw6 fs14 ls1 mb8">Ex. Instructor Type</p>
                <Dropdown
                  label="Ex. Instructor Type"
                  options={instructorTypeListOptions}
                  selectedValue={selectInstructorType}
                  onValueChange={handleInstructorTypeChange}
                />
              </div>
              <div className="status-filter mb12">
                <p className="fc15 fw6 fs14 ls1 mb8">Trainers</p>
                <Dropdown
                  label="Select Trainer's"
                  options={instructorNameListOptions}
                  selectedValue={selectInstructorName}
                  onValueChange={handleInstructorNameChange}
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
        <div>
          <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12">
            Total Records: {totalCount} | Total Flying Hours: {totalFlyingCount}
          </div>
          
          <div
            className="booked table-container df w100 fdc mt16"
            style={{ overflow: "auto" }}
          >
            <table className="mylead-table cp wsnw">
              <thead className="w100">
                <tr>
                  <th>Id</th>
                  <th>Date</th>
                  <th>Trainer</th>
                  <th>Trainee</th>
                  <th>Course Name</th>
                  <th>
                    <DynamicTooltip direction="left" text="Flight Training Exercise">
                      Exercise
                    </DynamicTooltip>
                  </th>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>
                    <DynamicTooltip direction="left" text="Cumulative Duration (HH:MM) as per filter">
                      Cum. <br /> Duration
                    </DynamicTooltip>
                  </th>
                  <th>
                    <DynamicTooltip direction="left" text="Total Cumulative Duration (HH:MM) as per branch">
                      Total Cum. <br /> Duration
                    </DynamicTooltip>
                  </th>
                  <th>
                    <DynamicTooltip direction="left" text="Signature of Instructor">
                      Instructor Sign
                    </DynamicTooltip>
                  </th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {recordList.length > 0 ? (
                  recordList.map((record, index) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.createDate}</td>
                      <td>{record.trainer}</td>
                      <td
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLeadPageRedirect(record.student_id);
                        }}
                        style={{
                          cursor: 'pointer',
                        }}
                      >{record.student}</td>
                      <td>{record.course_name}</td>
                      <td>{record.exercise_name}</td>
                      <td>{record.startTime}</td>
                      <td>{record.duration}</td>
                      <td>{record.cum_duration}</td>
                      <td>{record.total_cum_duration}</td>
                      <td>{record.instructor_sign}</td>
                      <td>{record.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No Branch logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </>
  )
}

export default ViewBranchLogs
