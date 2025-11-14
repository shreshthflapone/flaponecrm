import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaPencilAlt } from "react-icons/fa";
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
import constant from "../../constant/constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";
import Dropdown from "../../components/Dropdown";
import Popup from "../../components/Popup/Popup";
import SingleDropdown from "../../components/SingleDropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SmallLoader from "../../components/SmallLoader";

const ViewDroneLogs = () => {
  const { droneId } = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  const RoleButtonShow = user.role;

  const limit = 50;

  const [dateTimeType, setDateTimeType] = useState("");
  const [selectedTab, setSelectedTab] = useState("drone_log");
  const [droneListOptions, setDroneListOptions] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState([]);
  const [date, setDate] = useState("");
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [showDateInput, setShowDateInput] = useState(false);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const dateRangePickerRef = useRef(null);

  const [pageNum, setPageNum] = useState(1);
  const [listFilter, setListFilter] = useState({});
  const [filterCount, setFilterCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState(0);
  const [filterApplyStatus, setFilterApplyStatus] = useState(false)
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [recordList, setRecordList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [dateListOptions, setDateListOptions] = useState([]);

  const [showDroneLogMontlyData, setShowDroneLogMontlyData] = useState(false);
  const [showCalendarData, setShowCalendarData] = useState([]);
  const [droneSelectedMonth, setDroneSelectedMonth] = useState({});
  const [showLocationData, setShowLocationData] = useState([]);
  const [droneSelectedLocation, setDroneSelectedLocation] = useState({});
  const [updateBtnStatus, setUpdateBtnStatus] = useState(false);

  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
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
  var oldFilter = {};
  const initial_obj = {
    page_type:selectedTab,
    log_id: droneId != "all" ? droneId : "",
    date: "",
    selectedDrone:[],
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
      log_id: droneId != "all" ? droneId : "",
      date:date,
      dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      dateRangeValuefilter: dateRangeValue,
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
  }
  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };
  const clearFilter = () => {
    setFilterCount(0);
    FilterAllStateClear();
    let updatefilter = {
      ...listFilter,
      log_id: droneId,
      date:"",
      dateRangeValue:"",
      dateRangeValuefilter: "",
      setSelectedDrone:[],
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
    setFilterApplyStatus(false);
  };
  const FilterAllStateClear=()=>{
    setFilterStatus(0);
    setDate("");
    setDateLabel("Select Date");
    setSelectedDrone([]);
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
        setDateListOptions(filterList.branchLogDateListOptions || []);
        setDroneListOptions(filterList.droneListOptions || []);
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
  const getDroneLogListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=getDroneLogListRecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: pageNum, limit: limit, filter: listFilter },
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        if (pageNum === 1) {
          setTotalPageNum(response.data.data.total_page);
          setTotalCount(response.data.data.total_count);
          setRecordList([...response.data.data.list]);
        } else {
          setRecordList([...recordList,...response.data.data.list]);
        }
        setPageNum((prevPageNum) => prevPageNum + 1);
      } else {
        setTotalCount(0);
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
            getDroneLogListRecord();
          }
        }
      }, 200);
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum]);
  
  useEffect(() => {
    if(filterApiStatus && listFilter.page_type===selectedTab){
      getDroneLogListRecord();
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
  useEffect(()=>{
    FilterAllStateClear();
    setLocalStorage();
  },[selectedTab]);

  const filterLabels = {
    date: "Date Type",
    dateRangeValue: "Date Range",
    selectedDrone: "Drone UIN",
    dateRangeValuefilter: "Date Range Filter",
    log_id: "Drone UIN ID",
  };

  const handleViewAllLogs = () => {
    setPageNum(1);
    let updatefilter = {
      ...initial_obj,
      log_id: "all"
    };
  
    setListFilter({ ...updatefilter });
    navigate("/drone-inventory/all");
  }
  const handleLeadPageRedirect = (student_id) => {
    window.open(`/my-leads/${student_id}`, "_blank");
  }
  const handleDroneLogsPDF = (drone_id) => {
    if(drone_id == 'all'){
      handleShowMonthAccordingData();
    } else {
      handleShowMonthAccordingData(drone_id);
    }
  }
  const cancelDroneSelectPopup = () => {
    setShowCalendarData([]);
    setDroneSelectedMonth({});
    setShowLocationData([]);
    setDroneSelectedLocation({});
    setShowDroneLogMontlyData(false);
  }
  const handleShowMonthAccordingData = (drone_id = null) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=showDroneLogMonthAccordingData`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        type: "drone_log",
        filter: listFilter,
        ...(drone_id && { drone_id })
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if(response.data.data.status === "1" ){
          if (response.data.data.dropdown_status === "1" && response.data.data.location_status === "1" ) {
            setShowDroneLogMontlyData(true);
            setDroneSelectedMonth({});
            setDroneSelectedLocation({});
            setShowCalendarData(response.data.data.calendar_data);
            setShowLocationData(response.data.data.location_data);
          } else if (response.data.data.dropdown_status === "1") {
            setShowDroneLogMontlyData(true);
            setDroneSelectedMonth({});
            setShowCalendarData(response.data.data.calendar_data);
          } if (response.data.data.location_status === "1") {
            setShowDroneLogMontlyData(true);
            setDroneSelectedLocation({});
            setShowLocationData(response.data.data.location_data);
          } else if(response.data.data.dropdown_status === "0" && response.data.data.location_status === "0") {
            handleDownloadDronePDF();
          }
        }
      })
      .catch(function (error) {
        console.error("Error fetching drone log month data:", error);
      });
  };
  const handleSelectedMonth = (option) => {
    setDroneSelectedMonth(option);
  };
  const handleSelectedLocation = (option) => {
    setDroneSelectedLocation(option);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=showDroneLogMonthDataAccordingData`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        "option": option,
        "droneId": droneId
      },
    }).then(function (response) {
      checkUserLogin(response);
      setDroneSelectedMonth({});
      setShowCalendarData(response.data.data.calendar_data);
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const handleDownloadClick = () => {
    if (
      showLocationData?.length > 0 &&
      (
        !droneSelectedLocation ||
        Object.keys(droneSelectedLocation).length === 0 || 
        !droneSelectedLocation.value ||
        droneSelectedLocation.value.trim() === ""
      )
    ) {
      toast.warning("Please select a location before downloading the PDF.");
      return;
    }
    if (
      showCalendarData?.length > 0 &&
      (
        !droneSelectedMonth ||
        Object.keys(droneSelectedMonth).length === 0 || 
        !droneSelectedMonth.value ||
        droneSelectedMonth.value.trim() === ""
      )
    ) {
      toast.warning("Please select a month before downloading the PDF.");
      return;
    }
    handleDownloadDronePDF(droneSelectedMonth, droneSelectedLocation);
  };
  const handleDownloadDronePDF = (selectedmonth = null, droneSelectedLocation=null) => {
    setAutoLoader(true);
    setUpdateBtnStatus(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=downloadDronePDF`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        filter: listFilter,
        ...(selectedmonth && { selectedmonth }),
        ...(droneSelectedLocation && { droneSelectedLocation }),
      },
    }).then(async function (response) {
      checkUserLogin(response);
      const resData = response.data.data;
      if (resData.status === "1" && resData.pdf_link) {
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
      } else {
        toast.error("Internal Server Error, Please Download PDF After Some Time.");
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  
  const handleUnlinkPdfFile = (type, filename) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/inventory_list.php?fun=deletePdfFile`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        type: type,
        filename: filename,
      },
    }).then(async function (response) {
      checkUserLogin(response);
    })
    .catch(function (error) {
      console.error("Download error:", error);
    });
  }
  return (
    <>
      <InnerHeader
        heading={droneId === "all" ? "Drone Flying Logs: All" : `Drone Flying Logs: ID - ${droneId}`}
        txtSubHeading={droneId === "all" ? "View and manage all recorded drone flying activities across sessions. Use filters to quickly locate specific entries, dates, or drone logs." : `Complete flight record for Drone ID ${droneId}, including flying time, location details, assigned pilot, and instructor — useful for compliance, review, and analysis.`}
        showButton={true}
        iconText="Drone List"
        onClick={() => navigate("/inventory/drone")}
      />
      <Card className="bg5 mt16 p12">
        <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww">
          <div className="left-side-filter v-center fww">
            <div className="mr8 plan-status mb12">
              <Dropdown
                label={dateLabel}
                options={dateListOptions}
                selectedValue={date}
                onValueChange={handleDateChange}
              />
            </div>
            <div className="report-date mb12 mr8">
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
            {droneId === "all" ? (
              <div className="log-select form-group-settings cm-fr searching-drop mb4">
                <MultiDropdown
                  label="Drone UIN"
                  options={droneListOptions}
                  selectedValues={selectedDrone}
                  onSelect={handleSelectDrone}
                  searchable
                  chips={1}
                />
              </div>
            ) : ""}
            <button 
              className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mb8"
              onClick={applyFilter}>
              Apply
            </button>
            {filterStatus > 0 && <button
              className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb8"
              onClick={clearFilter}
            >
              Clear
            </button>}
          </div>
          <div className="right-side-filter v-center">
            <div className="v-center">
              {RoleButtonShow === "1" && droneId !== "all" && (
                <button
                  onClick={handleViewAllLogs}
                  className="btn-blue bg1 br24 mr12 fs14 cp pl16 pr16 pt10 pb10 ls1"
                >
                  View All Logs
                </button>
              )}
              {recordList.length > 0 ? (
                droneId !== "all" && (
                  <button
                    onClick={() => {
                      if (!updateBtnStatus) {
                        handleDroneLogsPDF(droneId);
                      }
                    }}
                    className={`bg1 br24 mr12 fs14 cp pl16 pr16 pt10 pb10 ls1 ${
                      updateBtnStatus ? "disabled-input bg10 fc5" : "btn-blue"
                    }`}
                    disabled={updateBtnStatus}
                  >
                    Download PDF
                  </button>
                )
              ) : ("")}
            </div>
          </div>
        </div>
        {filterApplyStatus && (
          <FilteredDataDisplay
            filterData={listFilter}
            labels={filterLabels}
            onClearAll={clearFilter}
            onFilterCountChange={handleFilterCountChange}
            listOptions={{ 
              droneListOptions,
            }}
          />
        )}
        <Card className="card bg5 mt16 pb16">
          <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww fs12">
            Total Drones: {totalCount}
          </div>
          <div className="booked table-container df w100 fdc mt16" style={{ overflow: "auto" }}>
            <table className="mylead-table cp wsnw">
              <thead className="w100">
                <tr>
                  <th>Id</th>
                  <th>Drone ID <br /> (UIN)</th>
                  <th>Date</th>
                  <th>Trainer</th>
                  <th>Trainee</th>
                  <th>Name of Remote Pilot</th>
                  <th>Place of <br /> Operation</th>
                  <th>Take-off <br /> Time (GMT)</th>
                  <th>Landing <br /> Time (GMT)</th>
                  <th>Duration <br /> (HH:MM)</th>
                  <th>
                    <DynamicTooltip direction="left" text="Cumulative Duration (HH:MM)">
                      Cum. <br /> Duration
                    </DynamicTooltip>
                  </th>
                  <th>Remarks <br /> (If any)</th>
                </tr>
              </thead>
              <tbody>
                {recordList.length > 0 ? (
                  recordList.map((log, index) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.drone_id}</td>
                      <td>{log.date}</td>
                      <td>{log.trainer}</td>
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
                      <td>{log.remote_pilot}</td>
                      <td>{log.rpto}</td>
                      <td>{log.startTime}</td>
                      <td>{log.endTime}</td>
                      <td>{log.duration}</td>
                      <td>{log.total_cum_duration}</td>
                      <td>{log.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="tac">No logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {showDroneLogMontlyData && (
              <div className="log-popup">
                <Popup title="" onClose={cancelDroneSelectPopup}>
                  <p className="ls1 lh22 fs16 mb24 tac">
                    {showCalendarData?.length > 0 && showLocationData?.length > 0
                      ? "Please select both Month and Location"
                      : showCalendarData?.length > 0
                      ? "Please select a Month"
                      : showLocationData?.length > 0
                      ? "Please select a Location"
                      : "No selection options available"}
                  </p>
                  {showLocationData?.length > 0 && (
                    <div className="batch-options">
                      <SingleDropdown
                        label="Select Location"
                        options={showLocationData}
                        selectedOption={droneSelectedLocation}
                        onSelect={handleSelectedLocation}
                        compulsory={<span className="fc4">*</span>}
                      />
                    </div>
                  )}
                  {showCalendarData?.length > 0 && (
                    <div className="batch-options">
                      <SingleDropdown
                        label="Select Month"
                        options={showCalendarData}
                        selectedOption={droneSelectedMonth}
                        onSelect={handleSelectedMonth}
                        compulsory={<span className="fc4">*</span>}
                      />
                    </div>
                  )}
                  <div className="popup-buttons mb24 df jcc">
                    <button 
                      onClick={() => {
                        if (!updateBtnStatus) {
                          handleDownloadClick();
                        }
                      }}
                      className={`update-button  box-center mr24 ${
                        updateBtnStatus ? "disabled-input bg10 fc5" : "btn-blue"
                      }`}
                      disabled={updateBtnStatus}
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
          </div>
        </Card>
      </Card>
      <ToastContainer position="bottom-right" />
      {autoLoader && (
        <div className="box-center mb12">
          <SmallLoader className={"mb12"} />
        </div>
      )}
    </>
  );
};

export default ViewDroneLogs;
