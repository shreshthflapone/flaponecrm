import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Card from "../../components/Card.js";
import Tabs from "../../components/Tabs.js";
import InnerHeader from "../../components/InnerHeader.js";
import "../MyOutstanding/MyOutstanding.css";
import Dropdown from "../../components/Dropdown.js";
import "react-datepicker/dist/react-datepicker.css";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";
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
import subDays from "date-fns/subDays";
import All from "./All.js";
import SearchInput from "../../components/SearchInput.js";
import constant from "../../constant/constant.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import MultiDropdown from "../../components/MultiDropdown.js";
import SmallLoader from "../../components/SmallLoader.js";
import Tooltip from "../../components/Tooltip.js";
import { FaFilter } from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup.js";

const MyOutstanding = () => {
  var { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const limit = 20;
  const pageDeptAccess = user.dept_id;

  const tabs = [
    { label: "All", value: "all" },
  ];

  const [dateTimeType, setDateTimeType] = useState("All Time");
  const [categoryData, setCategoryData] = useState([]);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(id ? id : "all");
  const [recordList, setRecordList] = useState([]);
  const [serviceStatusItems, setServiceStatusItems] = useState([]);
  const [outStandingStatusOption, setOutStnadingOption] = useState([]);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showFunnalDateRangeCalendar, setShowFunnalDateRangeCalendar] =
    useState(false);
  const [searchBy, setSearchBy] = useState("");
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [workOrderDisableViaPaymentId, setWorkOrderDisableViaPaymentId] =
    useState(true);
  const [serviceStatus, setServiceStatus] = useState("");
  const [outStandingStatus, setoutStandingStatus] = useState({"label":"Select Course Status",value:""});
  const [scholarStatus, setScholarStatus] = useState([]);
  const [userType, setUserType] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [paymentMode, setPaymentMode] = useState([]);
  
  const [amountType, setAmountType] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [leadSource, setLeadSource] = useState("");
  const [outStandingDataCount, setOutStandingDataCount] = useState("");
  const [outStandingHeadData, setOutStandingTabData] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false); 
  const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [expandRowByFilter, setExpandRowByFilter] = useState(false);
  const [discountTypeOptions,setDiscountTypeOptions] = useState([]);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [dateLabel, setDateLabel] = useState();
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateOptions, setDateOptions] = useState([]);
  const [date, setDate] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const navClickTriggered = useRef(false);
  const [studentsearchtype,setStudentsearchtype] = useState([]);
  const [allTabListCount, setAllTabListCount] = useState({
    all: 0,
  });
  const currentDate = new Date();
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(2021, 0, 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const dateRangePickerRef = useRef(null);

  const [searchByOptions,setSearchByOptions] = useState([]);
  const handleServiceStatusChange = (value) => {
    setServiceStatus(value);
  };
  const filterLabels = {
    page_type: "Page Type",
    datetypefilter: "Date Type",
    dateOption: "Date Type",
    statusCheckedItems: "Lead Status",
    dateRangeValue: "Date Range",
    planStatus: "Stage",
    leadSource: "Lead Source",
    selectedState: "State",
    assignee: "Assignee",
    selectedCourses: "Courses",
    companyType: "Type",
    selectedVerified: "Verified",
    dateRangeValuefilter: "Date Range Filter",
    dateMonthOptions: "Date/Month",
    checkedTeamItems: "Team",
    categoryCheckedItems: "Category",
    leadStatus: "Lead Status",
    serviceStatus: "Course Status",
    scholarStatus: "Scholarship Status",
    searchByOptions: "Search By",
    searchtext: "Search Text",
    paymentStatus: "Payment Status",
    paymentType: "Payment Type",
    amountType: "Amount Type",
    paymentMode: "Payment Mode",
    workOrderStatus: "Work Order Status",
    outStandingStatus: "Out Standing Status",
    userType:"User Type"
  };

  const handleoutStandingStatusChange = (value) => {
    setoutStandingStatus(value);
  };
  const handleDiscountTypeChange = (value) => {
     setScholarStatus(value);
  }
  const handleUserTypeChange = (value) => {
    setUserType(value);
 }
  
  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };
  const handleTabChange = (value) => {
    setSelectedTab(value);
  };
  const handleDateRangeChange = (item) => {
    setDateTimeType("");
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
      setShowFunnalDateRangeCalendar(false);
    }
  };

  useEffect(() => {
    if (
      showDateRangePicker ||
      showDateRangeCalendar ||
      showFunnalDateRangeCalendar
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateRangePicker, showDateRangeCalendar, showFunnalDateRangeCalendar]);

 

  //kamlesh
  var oldFilter = {};
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false)
  const [checkedItems, setCheckedItems] = useState([]);
  const [clearSignal, setClearSignal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [searchLead, setSearchLead] = useState("");
  const initial_obj = {
    selectedTab: selectedTab,
    page_type: selectedTab,
    searchtext: "",
    searchByOptions: "",
    listStatusOptions: "",
    serviceStatus: [],
    leadSource: "",
    dateRangeValue:"",
    dateRangeValuefilter: dateRangeValue, 
    paymentType: "",
    paymentMode: "",
    paymentStatus: "",
    teamSearch: "",
    scholarStatus: [],
    outStandingStatus: { label: "Select Course Status", value: "" },
    dateOption: "",
    categoryCheckedItems: [],
    selectedCourses: [],
    amountType: "",
    dateTimeType:"",
    setExpandView:false,
    userType:[]
    
  };
  const [listFilter, setListFilter] = useState({});

  const handleSearchChange = (value) => {
    setSearchLead(value);
  };
 
  const updateSetListingFilter = async () => {
    let updatefilter = {
      ...listFilter,
      ...initial_obj,
      selectedTab:   selectedTab,
      page_type:  selectedTab,
    };
    console.log("updatefilter-updatefilter",updatefilter,initial_obj)
    setListFilter({...updatefilter});
  }
  const applyFilter = async () => {
    let updatefilter = {
      ...listFilter,
      searchtext: searchLead,
      searchByOptions: searchBy,
      dateRangeValue: date?`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`:"",
      listStatusOptions: selectedStatus,
      serviceStatus: serviceStatus,
      selectedTab: selectedTab,
      paymentType: paymentType,
      paymentMode: paymentMode,
      paymentStatus: paymentStatus,
      teamSearch: checkedItems,
      leadSource: leadSource,
      scholarStatus: scholarStatus,
      outStandingStatus: outStandingStatus,
      dateOption: date,
      page_type: selectedTab,
      dateRangeValuefilter: dateRangeValue,
      categoryCheckedItems: categoryCheckedItems,
      selectedCourses: selectedCourses,
      amountType: amountType,
      dateTimeType:dateTimeType,
      userType:userType

    };
    var getoldfilter = localStorage.getItem("allfilteros");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilteros", JSON.stringify(oldFilter));
    setFilterApiStatus(true);
    setIsFetching(false);
    setListFilter(updatefilter);

    setPageNum(1);
    closeMoreFilter();
  };

  useEffect(()=>{
    FilterAllStateClear();
    setLocalStorage();
},[selectedTab]);

const clearFilter = () => {
  FilterAllStateClear();
  let getOldFilterclear = localStorage.getItem("allfilteros");
  let oldFilterValclear = getOldFilterclear
    ? JSON.parse(getOldFilterclear)
    : {};
  let currentTabFilterValclear = oldFilterValclear[selectedTab]
    ? { ...oldFilterValclear }
    : null;

  if(currentTabFilterValclear){
    delete currentTabFilterValclear[selectedTab];
    localStorage.setItem(
      "allfilteros",
      JSON.stringify(currentTabFilterValclear)
    );
  }
  updateSetListingFilter();
  closeMoreFilter();
};

useEffect(() => {
  if(filterApiStatus && listFilter.page_type==selectedTab && !isFetching){
    setIsFetching(true);
    getListRecord();
  }
}, [selectedTab,filterApiStatus,listFilter]);


useEffect(()=>{
  if(listFilter.page_type==selectedTab){
    getAllFilter();
  }
},[selectedTab,listFilter]);

const FilterAllStateClear = () => {
  handleDateChange({ label: "Select Date", value: "" });
  setShowDateInput(false);
  setoutStandingStatus({ label: "Select Course Status", value: "" });
  setLeadSource({ label: "Source Type", value: "" });
  setSearchBy("");
  setShowSearchInput(false);
  setSearchLabel("Search By");
  setSearchLead("");
  setDate("");
  setClearSignal(true);
  setTimeout(() => setClearSignal(false), 0);
  setDateTimeType("All Time");
  setPageNum(1);
  setCheckedItems([...teamData]);
  setCategoryCheckedItems([]);
  setScholarStatus([]);
  setExpandRowByFilter(false);
  setOutStandingDataCount("");
  setTotalPageNum(0);
  setSelectedCourses([]);
  setFilterCount(0);
  setIsFetching(false);
  setUserType([]);

  setDateRangeValue([
    {
      startDate: new Date(2021, 0, 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);
};


  const setLocalStorage = async () => {
    var getoldfilter = localStorage.getItem("allfilteros");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab]
        ? oldFilter[selectedTab]
        : "";
      if (currenttabfilter) {
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["outStandingStatus"]) {
          setoutStandingStatus(currenttabfilter["outStandingStatus"]);
        }
        if (currenttabfilter && currenttabfilter["scholarStatus"]) {
          setScholarStatus(currenttabfilter["scholarStatus"]);
        }
        if (currenttabfilter && currenttabfilter["dateTimeType"]) {
          setDateTimeType(currenttabfilter["dateTimeType"]);
      }
        if (currenttabfilter && currenttabfilter["teamSearch"]) {
          setCheckedItems(currenttabfilter["teamSearch"]);
        }
        if (currenttabfilter && currenttabfilter["serviceStatus"]) {
          setServiceStatus(currenttabfilter["serviceStatus"]);
        }
        if (currenttabfilter && currenttabfilter["dateOption"]) {
          setDate(currenttabfilter["dateOption"]);
          setShowDateInput(true);
        }
        if (currenttabfilter && currenttabfilter["dateOption"]) {
          let filterdateobj = dateOptions.find(
            (item) => item.value === currenttabfilter["dateOption"]
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
        if (currenttabfilter && currenttabfilter["paymentMode"]) {
          setPaymentMode(currenttabfilter["paymentMode"]);
        }
        if (currenttabfilter && currenttabfilter["userType"]) {
          setUserType(currenttabfilter["userType"]);
        }
        if (currenttabfilter && currenttabfilter["paymentType"]) {
          setPaymentType(currenttabfilter["paymentType"]);
        }
        if (currenttabfilter && currenttabfilter["amountType"]) {
          setAmountType(currenttabfilter["amountType"]);
        }
        if (currenttabfilter && currenttabfilter["paymentStatus"]) {
          setPaymentStatus(currenttabfilter["paymentStatus"]);
        }
        if (currenttabfilter && currenttabfilter["searchByOptions"]) {
          setSearchBy(currenttabfilter["searchByOptions"]);
          setSearchLabel(currenttabfilter["searchByOptions"]);
          setShowSearchInput(true);
          setSearchLead(currenttabfilter["searchtext"]);
        }
        if (currenttabfilter && currenttabfilter["searchByOptions"]) {
          let filterdateobj = searchByOptions.find(
            (item) => item.value === currenttabfilter["searchByOptions"]
          );
          if (filterdateobj) {
            handleSearchByChange(filterdateobj);
            setShowSearchInput(true);
            setSearchLead(currenttabfilter["searchtext"]);
          }
        }
        if (currenttabfilter && currenttabfilter["selectedCourses"]) {
          setSelectedCourses(currenttabfilter["selectedCourses"]);
        }
        if (currenttabfilter && currenttabfilter["categoryCheckedItems"]) {
          setCategoryCheckedItems(currenttabfilter["categoryCheckedItems"]);
        }
        if (currenttabfilter && currenttabfilter["setExpandView"]) {
            setExpandRowByFilter(true);
        }

      } else {
        updateSetListingFilter();
      }
    } else {
      updateSetListingFilter();
    }
  };
 


  // Function to check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      paymentStatus.length > 0 ||
      serviceStatus.value ||
      scholarStatus.length > 0 ||
      outStandingStatus.value ||
      paymentMode.length > 0 ||
      paymentType.value ||
      amountType.value ||
      searchLead.trim() !== "" ||
      leadSource.value ||
      selectedStatus.length > 0 ||
      date.value !== "last_payment_date"
    );
  }, [
    paymentStatus,
    serviceStatus,
    scholarStatus,
    outStandingStatus,
    paymentMode,
    paymentType,
    amountType,
    searchLead,
    leadSource,
    selectedStatus,
    date,
  ]);

  
  const handleSelectCourse = (value) => {
    const index = selectedCourses.indexOf(value);
    if (index === -1) {
      setSelectedCourses([...selectedCourses, value]);
    } else {
      const updatedValues = [...selectedCourses];
      updatedValues.splice(index, 1);
      setSelectedCourses(updatedValues);
    }
  };


  const handleDateChange = (option) => {
    setDate(option.value);
    
    setDateLabel(option.label);
    if (option.value !== "") {
      setShowDateInput(true);
      setShowDateRangePicker(true);
    } else {
      setShowDateInput(false);
      setShowDateRangePicker(false);
    }
  };


  
  const handleSearchByChange = (option) => {
    setSearchBy(option.value);
    setSearchLabel(option.label);
    if (option.value) {
      if (option.value === "txnid") {
        setWorkOrderDisableViaPaymentId(false);
      }
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
      setWorkOrderDisableViaPaymentId(true);
    }
  };


  const checkUserLogin = (response) =>{
    if(response.data.login.status===0){
      dispatch(logout());
      navigate("/login");
    }
  }
  const checkAnyCheckedTrue = (data) => {
    return data.some(item => {
        if (item.checked === true) {
            return true;
        }
        if (item.children && item.children.length > 0) {
            return item.children.some(child => child.checked === true);
        }
        return false;
    });
};

  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/outstanding.php?fun=getallfilter`,
      headers: {"Auth-Id": user.auth_id },
      data: { filter: listFilter },
    }).then(function (response) {
    if (response.data.login.status === 0) {
      checkUserLogin(response);
	    return false;
     }
      if(response.data.data.status === "1") {
        setTeamData([...JSON.parse(response.data.data.alfilter.teamsData)]);
        if(checkedItems.length<=0){
          setCheckedItems([...JSON.parse(response.data.data.alfilter.teamsData)]);
       }
        setServiceStatusItems([...JSON.parse(response.data.data.alfilter.serviceDataStatus)]);
        setOutStnadingOption([...JSON.parse(response.data.data.alfilter.outstandingStatus)]);
        setDiscountTypeOptions([...JSON.parse(response.data.data.alfilter.discountTypeOption)]);
        setDateOptions([...JSON.parse(response.data.data.alfilter.dateOptions)]);
        setCategoryData([...JSON.parse(response.data.data.alfilter.categories_list)]);
        if (!checkAnyCheckedTrue(categoryCheckedItems)) {
          setCategoryCheckedItems([...JSON.parse(response.data.data.alfilter.categories_list)]);
        }
        setCourseListOptions([...JSON.parse(response.data.data.alfilter.courseListOptions)]);
        setSearchByOptions([...JSON.parse(response.data.data.alfilter.searchByOptions)]);
        setStudentsearchtype([...JSON.parse(response.data.data.alfilter.studentsearchtype)]);
        setFilterApiStatus(true);
      } 
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
  }

  useEffect(() => {
    getAllTabTypeCount();
  }, []);
  const getAllTabTypeCount = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/outstanding.php?fun=gettabcount`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setAllTabListCount(response.data.data.data);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/outstanding.php?fun=getlistrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: {"page_num": pageNum,"limit": limit,"filter": listFilter,"id":id}
    })
      .then(function (response) {
        checkUserLogin(response);
        let responseData = response.data.data;
        if (response.data.data.status === "1") {
          if (pageNum === 1) {
            setOutStandingDataCount(responseData.total_count);
            setTotalPageNum(responseData.total_page);
            setRecordList([...responseData.list]);
            setOutStandingTabData(responseData.head_tab);
          } else {
            setRecordList([...recordList, ...responseData.list]);
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
  
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortList = (list) => {
    let sortedList = [...list];
    sortedList.sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";
      if (
        sortBy === "id" ||
        sortBy === "position" ||
        sortBy === "payment_date_long" ||
        sortBy === "payment_amount_long"
      ) {
        return sortDirection === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      } else {
        const comparison = aValue
          .toString()
          .localeCompare(bValue.toString(), undefined, { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });
    return sortedList;
  };

  useEffect(() => {
    const scrollHandler = () => {
      // Debouncing logic starts here
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
      }, 200); 
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum, selectedTab]);
  
  const closeMoreFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };

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
        return false;
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
        
        break; 
        
      }
    }
  };
  selectRange();
  

  



const handleCommonNavClick = (type,values) => () => {
  if (values) {
    setListFilter((prevFilter) => ({
      ...prevFilter,
      scholarStatus: values,
    }));
    setScholarStatus(values);
    applyFilter();
  } else {
    setScholarStatus([]);
  }

};

const handleNavLinkClick = (values) => () => {
  navClickTriggered.current = true;
  
  if (values.value) {
    handleoutStandingStatusChange(values);
  } else {
    setoutStandingStatus({ label: "Select Course Status", value: "" });
  }
};

useEffect(() => {
  if (navClickTriggered.current) {
    applyFilter();
    navClickTriggered.current = false; 
  }
}, [outStandingStatus]);





return (
    <>
      {dataStatus && filterApiStatus && ( <> <InnerHeader
        heading="My Outstanding"
        txtSubHeading="Track Outstanding accurately to ensure smooth financial operations."
        showButton={false}
        iconText="Add New Lead"
      />
      <Card className="bg5 mt16 pb16">
        <Tabs
          tabs={tabs}
          showCheckboxes={false}
          showFilter={false}
          onTabChange={handleTabChange}
	        selectedTab={selectedTab}
          count={allTabListCount}
        />
        <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww ">
          <div className="left-side-filter v-center fww">
            {selectedTab === "all" && (
              <>
                <div className="date-label mb8 ">
                  <Dropdown
                    label={dateLabel}
                    options={dateOptions}
                    selectedValue={date}
                    onValueChange={handleDateChange}
                    clearSignal={clearSignal}
                  />
                </div>
                <div className="report-date mb8 ml8 mr8">
                  {showDateInput && (
                    <>
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

                      {showDateRangeCalendar && (
                        <div ref={dateRangePickerRef}>
                          <DateRangePicker
                            onChange={handleDateRangeChange}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={dateRangeValue}
                            direction="horizontal"
                            staticRanges={staticRanges}
                            renderStaticRangeLabel={(range) => <span>{range.label}</span>}
                          />
                        </div>
                      )}
                    </>
                  )} 
                </div>
                <div className="mr8 wo-status mb8">
                    <Dropdown
                        label="Course Status"
                        options={outStandingStatusOption}
                        selectedValue={outStandingStatus}
                        onValueChange={handleoutStandingStatusChange}
                        clearSignal={clearSignal}
                      />
                </div>
                

              </>
            )}
          
                <Tooltip title={"More Filter"}>
                  <FaFilter
                    className="cp fs16 ml12 fc5"
                    onClick={handleFilterClick}
                  />
                  {filterCount > 0 && (
                    <span className="notification-count pa br50 fc1 fw6">
                      {filterCount}
                    </span>
                  )}
                </Tooltip>
            <button className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml12" onClick={()=>applyFilter()}>
              Go
            </button>
            {filterStatus > 0 && <button
              className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
              onClick={clearFilter}
            >
              Clear
            </button>}
          </div>
        </div>
        {filterStatus>0 && (
              <FilteredDataDisplay
                filterData={listFilter}
                labels={filterLabels}
                onClearAll={clearFilter}
                onFilterCountChange={handleFilterCountChange}
                listOptions={{
                  courseListOptions,
                  outStandingStatusOption,
                }}
              />
            )}
       
        {user && selectedTab === "all" &&
          <All
            expandRowByFilter={expandRowByFilter}
            recordList={recordList}
            loginData={user}
            outStandingDataCount={outStandingDataCount}
            sortBy={sortBy}
            sortDirection={sortDirection}
            sortList={sortList}
            outStandingHeadData={outStandingHeadData}
            WorkOrderDisableViaPaymentId={workOrderDisableViaPaymentId}
            handleNavLinkClick={handleNavLinkClick}
            handleCommonNavClick={handleCommonNavClick}
          />
        }
      </Card>
      {autoLoader && (
        <div className="box-center mb12">
          <SmallLoader className={"mb12"} />
        </div>
      )}
      {showFilterPopup && (
            <SidePopup show={showFilterPopup} onClose={closeMoreFilter}>
              <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                <p className="fs18 fc1 ">Filters</p>
                <button className="lead-close-button" onClick={closeMoreFilter}>
                  X
                </button>
              </div>
              <div className="filter-lists pl16 pt16 pr16">
                <div class="filter">
                 
                  {/* {selectedTab === "all" && (
                    <div className="wo-status mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Select Course Status</p>

                      <Dropdown
                        label="Course Status"
                        options={serviceStatusItems}
                        selectedValue={serviceStatus}
                        onValueChange={handleServiceStatusChange}
                      />
                    </div>
                  )} */}
                  <div className="mr8 service-status-filter searching-drop mb8">
                  <p className="fc15 fw6 fs14 ls1 mb8">Select Discount Type</p>
                    <Dropdown
                        label="Select Discount Type"
                        options={discountTypeOptions}
                        selectedValue={scholarStatus}
                        onValueChange={handleDiscountTypeChange}
                        clearSignal={clearSignal}
                      />
                </div>
                <div className="mr8 service-status-filter searching-drop mb8">
                  <p className="fc15 fw6 fs14 ls1 mb8">Select User Type</p>
                    <Dropdown
                        label="Select User Type"
                        options={studentsearchtype}
                        selectedValue={userType}
                        onValueChange={handleUserTypeChange}
                        clearSignal={clearSignal}
                      />
                </div>
                  {(selectedTab === "all") && (
                    <>
                      <div className="ct-f category-filter mr8 searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                          Category
                        </p>

                        <MultiLevelDropdown
                          placeholder="Select Category"
                          data={categoryData}
                          checkedItems={categoryCheckedItems}
                          setCheckedItems={setCategoryCheckedItems}
                        />
                      </div>
                      
                      <div className="status-filter mr8 mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">Course</p>
                        <MultiDropdown
                          label="Course"
                          options={courseListOptions}
                          selectedValues={selectedCourses}
                          onSelect={handleSelectCourse}
                        />
                      </div>
                      <div className="team-filter searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">Select Teams</p>
                        <MultiLevelDropdown
                          placeholder="Select Teams"
                          data={teamData}
                          checkedItems={checkedItems}
                          setCheckedItems={setCheckedItems}
                        />
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
                            workOrderID={searchLead}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="filter-button-container mt16 pt16 box-center myteam-filters ">
                  <button
                    type="button"
                    className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                    onClick={closeMoreFilter}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                    onClick={() => applyFilter()}
                  >
                    Apply
                  </button>
                  {filterStatus > 0 && (
                    <button
                      className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                      onClick={() => clearFilter()}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </SidePopup>
          )}
    </>
    )}
    </>
  );
};

export default MyOutstanding;
