import React, { useState, useEffect, useRef, useMemo } from "react";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import { useLocation } from "react-router-dom";
import LeadStatus from "./LeadStatus";
import LeadConversion from "./LeadConversion";
import Funnel from "./Funnel";
import AllLeads from "./AllLeads";
import { useParams } from "react-router-dom";
import Followups from "./Followups";
import Hot from "./Hot";
import InnerHeader from "../../components/InnerHeader";
import statelist from "../../constant/stateList.js";
import "../MyReports/MyReports.css";
import Dropdown from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";

import MultiSelectDropdown from "../../components/SearchMultiSelectDropdown";
import MultiLevelDropdown from "../../components/MultiLevelDropdown";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import {
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  subDays,
  subMonths,
  addMonths,
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import Won from "./Won";
import axios from "axios";
import SmallLoader from "../../components/SmallLoader.js";
import { useNavigate } from "react-router-dom";
import constant from "../../constant/constant.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import SidePopup from "../../components/Popup/SidePopup.js";
import Tooltip from "../../components/Tooltip.js";
import { FaFilter } from "react-icons/fa";
import CallLatter from "./CallLatter.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const MyReports = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);

  const [actionAccess,setActionAccess] = useState(((user.dept_id === '7' || user.dept_id === '4') || user.role === '1')?false:true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const limit = 50;
  const [filterCount, setFilterCount] = useState(0);
  const [filterApplyStatus, setFilterApplyStatus] = useState(false);
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

  //funnel const
  const [FunnalDataTab, setFunnalDataTab] = useState([]);
  const [loginData, setLoginData] = useState();
  const [selectedFunnalAgentId, setSelectedFunnalAgentId] = useState(null);
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [detailFunnel, setDetailFunnel] = useState([]);
  const [scrollToCommentHistory, setScrollToCommentHistory] = useState(false);
  const [FunnalTotalRecord, setFunnalTotalRecord] = useState();

  const tabs = [
    { label: "New", value: "new" },
    { label: "Hot", value: "hot" },
    { label: "Interested", value: "followup" },
    { label: "Call Later", value: "call_latter" },
    { label: "Funnel", value: "funnel" },
    { label: "Booked", value: "booked" },
    { label: "Conversion Report", value: "conversionreport" },
    { label: "Lead Report", value: "leadstatus" },
    { label: "All", value: "all" },
  ];

  const conversionColumnsMapping = {
    Date: "date",
    "Total Leads": "totalLeads",
    "Genrated Leads": "genLeads",
    "Total Booked": "totalBooked",
    "Sales Amount": "totalAmount",
    "Received Amount": "totalAmountReceived",
    "Conversion (%)": "conversion",
    "Conversion Gen Leads (%)": "conversion_gen",
    "Avg Ticket Size": "filesize",
  };
  const [conversionData, setConversionData] = useState([]);
  const leadStatusColumnsMapping = {
    Date: "date",
    "Total Leads": "total_sts",
    New: "new",
    Booked: "booked",
    Hot: "hot",
    Interested: "followup",
    "Call Later": "call_latter",
    "No Response": "no_response",
    "Not Interested": "not_interested",
    Junk: "junk",
    Untouched: "untouched",
  };

  const [teamsData, setTeamsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(id ? id : "new");
  const [selectedState, setSelectedState] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [leadVia, setLeadVia] = useState([]);
  const [destination, setDestinaion] = useState("");
  const [planStatus, setPlanStatus] = useState("");
  const [workOrderStatus, setWorkOrderStatus] = useState("");
  const [serviceStatus, setServiceStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [date, setDate] = useState("");
  const [clearSignal, setClearSignal] = useState(false);
  const [checkedTeamItems, setCheckedTeamItems] = useState([]);
  const [leadSourceOptions, setLeadSourceOptions] = useState([]);
  const [leadSource, setLeadSource] = useState("");
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [verifiedListOptions, setVerifiedListOptions] = useState([]);
  const [selectedVerified, setSelectedVerified] = useState([]);

  const [showDateInput, setShowDateInput] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [dayMonth, setDayMonth] = useState({ label: "Day", value: "day" });
  const [filterStatus, setFilterStatus] = useState(0);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [dateTimeType, setDateTimeType] = useState("");
  const filterLabels = {
    page_type: "Page Type",
    datetypefilter: "Date Type",
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
  };

  var oldFilter = {};
  var getOldFilter = localStorage.getItem("allfilteroption");
  var oldFilterVal = getOldFilter ? JSON.parse(getOldFilter) : {};
  var currentTabFilterVal = oldFilterVal[selectedTab]
    ? oldFilterVal[selectedTab]
    : "";
  const [listFilter, setListFilter] = useState(
    currentTabFilterVal != ""
      ? currentTabFilterVal
      : {
          page_type: id ? id : "new",
          datetypefilter: "",
          dateRangeValue: "",
          checkedTeamItems: "",
          planStatus: [],
          leadStatus: [],
          leadSource: [],
          selectedState: [],
          assignee: "",
          categoryCheckedItems: "",
          selectedCourses: [],
          companyType: "",
          selectedVerified: [],
          dateRangeValuefilter: "",
          statusCheckedItems: [],
          dateMonthOptions: { label: "Day", value: "day" },
        }
  );

  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const dateRangePickerRef = useRef(null);

  const [dateOptions, setDateOptions] = useState([]);
  const [dateMonthOptions, setDateMonthOptions] = useState([]);
  const [planStatusOptions, setPlanStatusOptions] = useState([]);
  const [assigneOptions, setAssigneOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [leadStatusOptions, setLeadStatusOptions] = useState([]);
  const [statusCheckedItems, setStatusCheckedItems] = useState([]);
  const [allTabListCount, setAllTabListCount] = useState([]);

  const handleRedirect = (text) => {
    setSelectedTab(text);
  };

  const handleAsigneeChange = (value) => {
    setAssignee(value);
  };
  const handleCompanyTypeChange = (value) => {
    setCompanyType(value);
  };
  const handlePlanStatusChange = (value) => {
    setPlanStatus(value);
  };
  const handleLeadStatusChange = (value) => {
    setLeadStatus(value);
  };
  const handleLeadSourceChange = (value) => {
    setLeadSource(value);
  };
  const handleDayMonthChange = (value) => {
    setDayMonth(value);
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
    if (option.value === "followupdate") {
      setDateRangeValue([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 30),
          key: "selection",
        },
      ]);
    } else if (option.value === "enquirydate" && selectedTab === "all") {
      setDateRangeValue([
        {
          startDate: subDays(new Date(), 30),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      setShowDateRangePicker(false);
      setShowDateRangeCalendar(false);
    } else if (option.value === "paymentdate" && selectedTab === "booked") {
      setDateRangeValue([
        {
          startDate: subDays(new Date(), 30),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      setShowDateRangePicker(false);
      setShowDateRangeCalendar(false);
    } else {
      setDateRangeValue([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 30),
          key: "selection",
        },
      ]);
    }
  };

  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };

  const applyFilter = async () => {
    setFilterApplyStatus(true);
    setAllApiData([]);
    setSelectedAgentName("");
    setSelectedFunnalAgentId(null);
    let updatefilter = {
      ...listFilter,
      page_type: selectedTab,
      datetypefilter: date,
      checkedTeamItems: checkedTeamItems,
      planStatus: planStatus,
      leadStatus: leadStatus,
      statusCheckedItems: statusCheckedItems,
      leadSource: leadSource,
      selectedState: selectedState,
      assignee: assignee,
      categoryCheckedItems: categoryCheckedItems,
      selectedCourses: selectedCourses,
      dateRangeValuefilter: dateRangeValue,
      dateRangeTimeType: dateTimeType,
      selectedVerified: selectedVerified,
      companyType: companyType,
      dateMonthOptions: dayMonth,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
    };
    var getoldfilter = localStorage.getItem("allfilteroption");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));
    setListFilter(updatefilter);
    setPageNum(1);
    closeFilter();
  };

  const clearFilter = (tabvalue = "") => {
    //handleDateChange({ label: "Day", value: "day" });
    if (selectedTab === "leadstatus" || selectedTab === "conversionreport") {
      setDateRangeValue([
        {
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
          key: "selection",
        },
      ]);
    } else if (selectedTab === "funnel") {
      setDateRangeValue([
        {
          startDate: subMonths(new Date(), 6),
          endDate: addMonths(new Date(), 6),
          key: "selection",
        },
      ]);
    } else if (selectedTab === "all" || selectedTab === "booked") {
      handleDateChange({ label: "Selecte Date", value: "" });
    }

    if (tabvalue == "") {
      let getOldFilterclear = localStorage.getItem("allfilteroption");
      let oldFilterValclear = getOldFilterclear
        ? JSON.parse(getOldFilterclear)
        : {};
      let currentTabFilterValclear = oldFilterValclear[selectedTab]
        ? { ...oldFilterValclear }
        : null;

      if (currentTabFilterValclear) {
        delete currentTabFilterValclear[selectedTab];
        localStorage.setItem(
          "allfilteroption",
          JSON.stringify(currentTabFilterValclear)
        );
      }
    }
    setFilterApplyStatus(false);
    setFilterCount(0);
    setDestinaion("");
    setBucket([]);
    setPlanStatus({ label: "Select Stage", value: "" });
    setLeadVia([]);
    setDateTimeType("");
    setLeadStatus("");
    setTotalPageNum(0);
    setPageNum(1);
    setAllApiData([]);
    setSelectedVerified([]);
    setSelectedState([]);
    setCheckedTeamItems([...teamsData]);
    setCategoryCheckedItems([...categoryData]);
    if (tabvalue != "") {
      setStatusCheckedItems([]);
    } else {
      setStatusCheckedItems([...leadStatusOptions]);
    }
    setSelectedCourses([]);
    setLeadSource({ label: "Select Source", value: "" });
    setAssignee({ label: "Assigned Status", value: "" });
    setDayMonth({ label: "Day", value: "day" });
    setClearSignal(true);
    setDate("");
    setSelectedAgentName("");
    setSelectedFunnalAgentId(null);
    setCompanyType({ label: "User Type", value: "" });
    setDateLabel("Select Date");
    setShowDateInput(false);
    setTimeout(() => setClearSignal(false), 0);
    let updatefilter = {
      ...listFilter,
      page_type: tabvalue || selectedTab,
      datetypefilter:
        tabvalue !== undefined && tabvalue === "all"
          ? "enquirydate"
          : tabvalue !== undefined && tabvalue === "booked"
            ? "paymentdate"
            : "",
      dateRangeValue:
        (tabvalue !== undefined && tabvalue === "funnel") ||
        selectedTab === "funnel"
          ? `${format(subMonths(new Date(), 6), "dd-MM-yyyy")} | ${format(addMonths(new Date(), 6), "dd-MM-yyyy")}`
          : (tabvalue !== undefined && tabvalue === "all") ||
              selectedTab === "all"
            ? `${format(subDays(new Date(), 30), "dd-MM-yyyy")} | ${format(new Date(), "dd-MM-yyyy")}`
            : (tabvalue !== undefined && tabvalue === "booked") ||
                selectedTab === "booked"
              ? `${format(subDays(new Date(), 30), "dd-MM-yyyy")} | ${format(new Date(), "dd-MM-yyyy")}`
              : `${format(startOfMonth(new Date()), "dd-MM-yyyy")} | ${format(endOfMonth(new Date()), "dd-MM-yyyy")}`, // Default to current month
      checkedTeamItems: "",
      planStatus: [],
      leadStatus: [],
      leadSource: [],
      selectedState: [],
      assignee: "",
      categoryCheckedItems: "",
      selectedVerified: [],
      selectedCourses: [],
      companyType: "",
      dateRangeValuefilter: "",
      statusCheckedItems: [],
      dateMonthOptions: { label: "Day", value: "day" },
    };
    if (tabvalue) {
      var getOldFilter = localStorage.getItem("allfilteroption");
      var oldFilterVal = getOldFilter ? JSON.parse(getOldFilter) : {};
      var currentTabFilterVal = oldFilterVal[tabvalue]
        ? oldFilterVal[tabvalue]
        : "";
      if (currentTabFilterVal) {
        setListFilter(currentTabFilterVal);
      } else {
        setListFilter(updatefilter);
      }
    } else {
      setListFilter(updatefilter);
    }
    if (tabvalue != "") {
      if (tabvalue == "all") {
        setFilterStatus(1);
      }
      setLocalStorage();
    }
    closeFilter();
  };
  const handleFunnelRowClick = (agent_id, name, filter) => {
    setSelectedFunnalAgentId(agent_id);
    setSelectedAgentName(name);
    getAgentHistory(agent_id, filter);
  };
  const handleCloseDetailFunnel = () => {
    setSelectedFunnalAgentId(null);
  };
  const getAgentHistory = async (id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/funnal_details.php?fun=getAgentHistory`,
      headers: { "Auth-Id": user.auth_id },
      data: { id: id, filter: listFilter },
    })
      .then(function (response) {
        let responseData = response.data.data.list;
        if (responseData.status != "0") {
          setDetailFunnel(responseData);
          setScrollToCommentHistory(true);
        }
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login: ", error);
      });
  };

  const handleFunnalStatusUpdate = (id, user_id, agent_id, lead_id) => {
    updateFunnalStatus(id, user_id, agent_id, lead_id);
  };

  const updateFunnalStatus = async (id, user_id, agent_id, lead_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/funnal_details.php?fun=updateFunnalStatus`,
      headers: { "Auth-Id": user.auth_id },
      data: { id: id, user_id: user_id, lead_id: lead_id, agent_id: agent_id },
    })
      .then(function (response) {
        let responseData = response.data.data;
        setDetailFunnel((prevDetailFunnel) =>
          prevDetailFunnel.filter((item) => item.id !== id)
        );
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };
  useEffect(() => {
    setLocalStorage();
  }, [selectedTab, filterApiStatus]);

  function setLocalStorage() {
    var getoldfilter = localStorage.getItem("allfilteroption");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab];
      if (currenttabfilter) {
        setFilterApplyStatus(true);
        if (currenttabfilter && currenttabfilter["assignee"]) {
          handleAsigneeChange(currenttabfilter["assignee"]);
        }
        if (currenttabfilter && currenttabfilter["categoryCheckedItems"]) {
          setCategoryCheckedItems(currenttabfilter["categoryCheckedItems"]);
        }
        if (currenttabfilter && currenttabfilter["checkedTeamItems"]) {
          setCheckedTeamItems(currenttabfilter["checkedTeamItems"]);
        }
        if (currenttabfilter && currenttabfilter["companyType"]) {
          handleCompanyTypeChange(currenttabfilter["companyType"]);
        }
        if (currenttabfilter && currenttabfilter["datetypefilter"]) {
          let filterdateobj = dateOptions.find(
            (item) => item.value === currenttabfilter["datetypefilter"]
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
        if (currenttabfilter && currenttabfilter["dateRangeTimeType"]) {
          setDateTimeType(currenttabfilter["dateRangeTimeType"]);
        }
        if (currenttabfilter && currenttabfilter["leadSource"]) {
          handleLeadSourceChange(currenttabfilter["leadSource"]);
        }
        if (currenttabfilter && currenttabfilter["leadStatus"]) {
          handleLeadStatusChange(currenttabfilter["leadStatus"]);
        }
        if (currenttabfilter && currenttabfilter["statusCheckedItems"]) {
          setStatusCheckedItems(currenttabfilter["statusCheckedItems"]);
        }
        if (currenttabfilter && currenttabfilter["selectedVerified"]) {
          setSelectedVerified(currenttabfilter["selectedVerified"]);
        }

        if (currenttabfilter && currenttabfilter["planStatus"]) {
          handlePlanStatusChange(currenttabfilter["planStatus"]);
        }
        if (
          currenttabfilter &&
          currenttabfilter["selectedState"] &&
          currenttabfilter["selectedState"].length > 0
        ) {
          setSelectedState(currenttabfilter["selectedState"]);
        }
        if (currenttabfilter && currenttabfilter["selectedCourses"]) {
          setSelectedCourses([...currenttabfilter["selectedCourses"]]);
        }
        if (currenttabfilter && currenttabfilter["dateMonthOptions"]) {
          setDayMonth(currenttabfilter["dateMonthOptions"]);
        }
      } else {
        setFilterStatus(0);
        if (selectedTab === "funnel") {
          setDateRangeValue([
            {
              startDate: subMonths(new Date(), 6),
              endDate: addMonths(new Date(), 6),
              key: "selection",
            },
          ]);
        } else if (selectedTab === "all") {
          handleDateChange({ label: "Enquiry Date", value: "enquirydate" });
        } else if (selectedTab === "booked") {
          handleDateChange({ label: "Payment Date", value: "paymentdate" });
        } else if (date === "followupdate") {
          setDateRangeValue([
            {
              startDate: new Date(),
              endDate: addDays(new Date(), 30),
              key: "selection",
            },
          ]);
        } else {
          setDateRangeValue([
            {
              startDate: startOfMonth(new Date()),
              endDate: endOfMonth(new Date()),
              key: "selection",
            },
          ]);
        }
      }
    } else if (selectedTab === "all") {
      handleDateChange({ label: "Enquiry Date", value: "enquirydate" });
    } else if (selectedTab === "booked") {
      handleDateChange({ label: "Payment Date", value: "paymentdate" });
    }
  }
  const handleTabChange = (value) => {
    setSelectedTab(value);
    //setDataStatus(false);
    setPageNum(1);
    //clearFilter(value);
    if (value === "followup" || value === "call_latter" || value === "hot") {
      handleSortByChange("last_followup_long");
      setSortDirection("asc");
    } else if (value === "booked") {
      handleSortByChange("last_amount_rec_long");
      setSortDirection("desc");
    } else {
      handleSortByChange("userid");
      setSortDirection("desc");
    }
  };
  useEffect(() => {
    clearFilter(selectedTab);
  }, [selectedTab]);
  const stateOptions = statelist.states;

  const handleStateChange = (selectedOptions) => {
    setSelectedState(selectedOptions);
  };
  const handleDateRangeChange = (item) => {
    setDateTimeType("");
    setDateRangeValue([item.selection]);
  };
  const toggleDateRangePicker = () => {
    setShowDateRangePicker(!showDateRangePicker);
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
  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  const handleFilterClick = () => {
    setShowFilterPopup(true);
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

  const handleSelectVeified = (value) => {
    setSelectedVerified(value);
  };

  useEffect(() => {
    if (id !== undefined) {
      if (listFilter.dateRangeValue != "") {
        getListRecord();
      }
    } else {
      getListRecord();
    }
  }, [listFilter]);

  useEffect(() => {
    getCourseList();
  }, [categoryCheckedItems]);
  useEffect(() => {
    getAllLeadTypeCount();
  }, []);

  useEffect(() => {
    getAllFilter();
  }, [listFilter]);

  useEffect(() => {
    //getFunnalList();
  }, [teamsData]);

  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeSortColumn, setActiveSortColumn] = useState("");

  const handleSortByChange = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setActiveSortColumn(field);
  };

  const sortList = useMemo(() => {
    let sortedList = [...recordList];
    sortedList.sort((a, b) => {
      // Handle null or undefined values for sortBy field
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";
      // Use localeCompare for string comparison, numeric for id
      if (
        sortBy === "id" ||
        sortBy === "total_amount_long" ||
        sortBy === "last_amount_rec_long" ||
        sortBy === "last_followup_long" ||
        sortBy === "signup_long" ||
        sortBy === "last_enquiry_posted_long" ||
        sortBy === "last_status_update_date_long" ||
        sortBy === "mbl_eml_long"
      ) {
        return sortDirection === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      } else if (sortBy === "position") {
        return sortDirection === "asc"
          ? a.position - b.position
          : b.position - a.position;
      } else if (sortBy === "selected_agent") {
        if (aValue.label === null) {
          aValue.label = "";
        }
        if (bValue.label === null) {
          bValue.label = "";
        }
        const comparison = aValue.label.localeCompare(bValue.label, undefined, {
          numeric: true,
        });
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        const comparison = aValue
          .toString()
          .localeCompare(bValue.toString(), undefined, { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });

    return sortedList;
  }, [recordList, sortBy, sortDirection]);

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
      }, 200); // Adjust the debounce delay as needed
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum]);

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const setAssignedToUser = async (leadids, toassign) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_list.php?fun=assignedLeadToUser`,
      headers: { "Auth-Id": user.auth_id },
      data: { enquiry_id: leadids, agent_id: toassign },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getAllLeadTypeCount = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_list.php?fun=getleadtypecount`,
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
  const getCourseList = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_list.php?fun=getcourselist`,
      headers: { "Auth-Id": user.auth_id },
      data: { coursecategory: categoryCheckedItems },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setCourseListOptions([...response.data.data.data]);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setAllApiFilter(response.data.data.filterlist);
          setDateOptions([
            ...JSON.parse(response.data.data.filterlist.dateOptions),
          ]);
          setPlanStatusOptions([
            ...JSON.parse(response.data.data.filterlist.planStatusOptions),
          ]);
          setLeadStatusOptions([
            ...JSON.parse(response.data.data.filterlist.leadStatusOptions),
          ]);
          setDateMonthOptions([
            ...JSON.parse(response.data.data.filterlist.dateMonthOptions),
          ]);
          if (statusCheckedItems.length <= 0) {
            setStatusCheckedItems([
              ...JSON.parse(response.data.data.filterlist.leadStatusOptions),
            ]);
          }
          setLeadSourceOptions([
            ...JSON.parse(response.data.data.filterlist.leadSourceOptions),
          ]);
          setAssigneOptions([
            ...JSON.parse(response.data.data.filterlist.assigneOptions),
          ]);
          setCompanyOptions([
            ...JSON.parse(response.data.data.filterlist.companyOptions),
          ]);
          setCourseListOptions([
            ...JSON.parse(response.data.data.filterlist.courseListOptions),
          ]);
          if (categoryCheckedItems.length <= 0) {
            setCategoryCheckedItems([
              ...JSON.parse(response.data.data.filterlist.categories_list),
            ]);
          }
          setCategoryData([
            ...JSON.parse(response.data.data.filterlist.categories_list),
          ]);

          setTeamsData([
            ...JSON.parse(response.data.data.filterlist.teamsData),
          ]);
          if (checkedTeamItems.length <= 0) {
            setCheckedTeamItems([
              ...JSON.parse(response.data.data.filterlist.teamsData),
            ]);
          }
          if (response.data.data.filterlist.leadVerifiedOption) {
            setVerifiedListOptions([
              ...JSON.parse(response.data.data.filterlist.leadVerifiedOption),
            ]);
          }

          setFilterApiStatus(true);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getFunnalList = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/funnal_details.php?fun=getFunnalList`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        page_num: pageNum,
        limit: limit,
        filter: listFilter,
      },
    })
      .then(function (response) {
        let responseData = response.data.data;
        let responseLogin = response.data.login.data;
        if (response.data.data != null) {
          if (
            (response.data.data.list != "", response.data.data.list != null)
          ) {
            setFunnalDataTab(responseData.list);
            setFunnalTotalRecord(responseData.totalrecords);
            setLoginData(responseLogin);
          } else {
            setFunnalDataTab([]);
            setLoginData([]);
            setFunnalTotalRecord();
          }
          setSelectedFunnalAgentId(null);
          setDetailFunnel([]);
        } else {
          setFunnalDataTab([]);
          setLoginData([]);
          setFunnalTotalRecord();
          setSelectedFunnalAgentId(null);
          setDetailFunnel([]);
        }
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };
  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_list.php?fun=getlistrecord`,
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
          if (response.data.data.head !== undefined) {
            setConversionData(response.data.data.head);
          }
          setPageNum((prevPageNum) => prevPageNum + 1);
          setDataStatus(true);
          setFilterStatus(response.data.data.filter_status);
        } else {
          setRecordList([]);
          setConversionData(response.data.data.head);
          setDisplayMsg(response.data.data.msg);
        }
        var getoldfilter = localStorage.getItem("allfilteroption");
        var getoldfilter = localStorage.getItem("allfilteroption");
        if (getoldfilter) {
          oldFilter = JSON.parse(getoldfilter);
          var currenttabfilter = oldFilter[selectedTab];
          if (currenttabfilter) {
            setFilterStatus(response.data.data.filter_status);
          } else {
            if (selectedTab != "all") {
              setFilterStatus(0);
            }
          }
        }
        setAutoLoader(false);
        setIsFetching(false);
        setDataStatus(true);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  /*useEffect(() => {
    if (date === "followupdate") {
      setDateRangeValue([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 30),
          key: "selection",
        },
      ]);
    } else {
      setDateRangeValue([
        {
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
          key: "selection",
        },
      ]);
    }
  }, [date]);*/

  const staticRanges = [
    {
      label: "Today",
      range: () => ({
        startDate: startOfToday(),
        endDate: new Date(),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[0].range();
        if (dateTimeType == "Today") {
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
        if (dateTimeType == "Yesterday") {
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
        if (dateTimeType == "This Week") {
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
        if (dateTimeType == "Last Week") {
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
        if (dateTimeType == "This Month") {
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
        if (dateTimeType == "Last Month") {
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
        if (dateTimeType == "All Time") {
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

  return (
    <>
      {dataStatus && filterApiStatus && (
        <>
          {" "}
          <InnerHeader
            heading="My Leads"
            txtSubHeading="Effortlessly access and manage your leads, unlocking sales and growth opportunities with ease."
            showButton={false}
            iconText="Add New Lead"
          />
          <Card className="bg5 mt16 pb16">
            <Tabs
              tabs={tabs}
              showCheckboxes={false}
              showFilter={false}
              onTabChange={handleTabChange}
              count={allTabListCount}
              selectedTab={selectedTab}
            />
            <div className="mylead-filters myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww ">
              <div className="left-side-filter v-center fww">
                {selectedTab === "all" ||
                selectedTab === "new" ||
                selectedTab === "call_latter" ||
                selectedTab === "followup" ||
                selectedTab === "hot" ||
                selectedTab === "booked" ? (
                  <>
                    <div className="date-label mb8 ">
                      <Dropdown
                        label={dateLabel}
                        options={dateOptions}
                        selectedValue={date}
                        onValueChange={handleDateChange}
                      />
                    </div>
                    <div
                      className={`report-date ${showDateInput && "ml8"} mr8 mb8 ${date === "followupdate" ? "hide-range-followup" : ""}`}
                    >
                      {showDateInput && dateRangeValue && (
                        <div
                          className="date-range-input"
                          onClick={toggleDateRangePicker}
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

                      {showDateRangePicker && (
                        <div ref={dateRangePickerRef}>
                          <DateRangePicker
                            onChange={handleDateRangeChange}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={dateRangeValue}
                            direction="horizontal"
                            staticRanges={staticRanges}
                            renderStaticRangeLabel={(range) => (
                              <span>{range.label}</span>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    <div className="team-filter mr8 searching-drop mb8 hide-mobile">
                      <MultiLevelDropdown
                        placeholder="Select Team"
                        data={teamsData}
                        checkedItems={checkedTeamItems}
                        setCheckedItems={setCheckedTeamItems}
                      />
                    </div>
                  </>
                ) : null}
                {selectedTab === "funnel" && (
                  <>
                    <div className="report-date mb8 mr8">
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
                            renderStaticRangeLabel={(range) => (
                              <span>{range.label}</span>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    <div className="lead-source mr8 searching-drop mb8">
                      <Dropdown
                        label="Select Source"
                        options={leadSourceOptions}
                        selectedValue={leadSource}
                        onValueChange={handleLeadSourceChange}
                      />
                    </div>
                  </>
                )}

                {(selectedTab === "leadstatus" ||
                  selectedTab === "conversionreport") && (
                  <>
                    <div className="date-label mb8 mr8">
                      <Dropdown
                        label={"Day/Month"}
                        options={dateMonthOptions}
                        selectedValue={dayMonth}
                        onValueChange={handleDayMonthChange}
                      />
                    </div>
                    {dayMonth.value === "day" && (
                      <div className="report-date mb8 mr8">
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
                              renderStaticRangeLabel={(range) => (
                                <span>{range.label}</span>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <Tooltip title={"More Filter"}>
                  <FaFilter
                    className="cp fs16 mb8 ml12 fc5"
                    onClick={handleFilterClick}
                  />
                  {filterCount > 0 && (
                    <span className="notification-count pa br50 fc1 fw6">
                      {filterCount}
                    </span>
                  )}
                </Tooltip>
                <button
                  className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mb8"
                  onClick={() => applyFilter()}
                >
                  Apply
                </button>
                {filterStatus > 0 && (
                  <button
                    className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb8"
                    onClick={() => clearFilter()}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {filterApplyStatus && (
              <FilteredDataDisplay
                filterData={listFilter}
                labels={filterLabels}
                onClearAll={clearFilter}
                onFilterCountChange={handleFilterCountChange}
                courseListOptions={courseListOptions}
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
                <div className="filter-lists pl16 pt16 pr16 mb48">
                  <div>
                    {(selectedTab === "all" ||
                      selectedTab === "call_latter") && (
                      <div className="st-filter mr8 searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">Lead Status</p>
                        <MultiLevelDropdown
                          placeholder="Select Lead Status"
                          data={leadStatusOptions}
                          checkedItems={statusCheckedItems}
                          setCheckedItems={setStatusCheckedItems}
                        />
                      </div>
                    )}
                    {selectedTab === "booked" && (
                      <>
                        <div className="mb16 assign">
                          <p className="fc15 fw6 fs14 ls1 mb8">
                            Payment Status
                          </p>
                          <Dropdown
                            label="Payment Status"
                            options={leadStatusOptions}
                            selectedValue={leadStatus}
                            onValueChange={handleLeadStatusChange}
                          />
                        </div>
                      </>
                    )}
                    {selectedTab === "all" ||
                    selectedTab === "followup" ||
                    selectedTab === "new" ||
                    selectedTab === "hot" ||
                    selectedTab === "booked" ||
                    selectedTab === "conversionreport" ||
                    selectedTab === "leadstatus" ||
                    selectedTab === "funnel" ||
                    selectedTab === "call_latter" ? (
                      <>
                        {selectedTab !== "conversionreport" &&
                          selectedTab !== "leadstatus" &&
                          selectedTab !== "funnel" && (
                            <>
                              <div className="team-filter searching-drop mb8 hide-desktop">
                              <p className="fc15 fw6 fs14 ls1 mb8">Select Team</p>
                                <MultiLevelDropdown
                                  placeholder="Select Team"
                                  data={teamsData}
                                  checkedItems={checkedTeamItems}
                                  setCheckedItems={setCheckedTeamItems}
                                />
                              </div>
                              <div className="lead-source searching-drop mb16">
                                <p className="fc15 fw6 fs14 ls1 mb8">Source</p>
                                <Dropdown
                                  label="Select Source"
                                  options={leadSourceOptions}
                                  selectedValue={leadSource}
                                  onValueChange={handleLeadSourceChange}
                                />
                              </div>
                              <div className="state-filter searching-drop mb16">
                                <p className="fc15 fw6 fs14 ls1 mb8">State</p>
                                <MultiSelectDropdown
                                  options={stateOptions}
                                  placeholder={"Search State"}
                                  onSelectionChange={handleStateChange}
                                  clearSignal={clearSignal}
                                  selectedOption={selectedState}
                                />
                              </div>
                            </>
                          )}
                        <div className="ct-f category-filter searching-drop mb16">
                          <p className="fc15 fw6 fs14 ls1 mb8">Category</p>

                          <MultiLevelDropdown
                            placeholder="Select Category"
                            data={categoryData}
                            checkedItems={categoryCheckedItems}
                            setCheckedItems={setCategoryCheckedItems}
                          />
                        </div>
                        <div className="status-filter mb16">
                          <p className="fc15 fw6 fs14 ls1 mb8">Course</p>
                          <MultiDropdown
                            label="Course"
                            options={courseListOptions}
                            selectedValues={selectedCourses}
                            onSelect={handleSelectCourse}
                          />
                        </div>

                        {selectedTab !== "conversionreport" &&
                          selectedTab !== "leadstatus" &&
                          selectedTab !== "funnel" && (
                            <>
                              <div className=" plan-status mb16">
                                <p className="fc15 fw6 fs14 ls1 mb8">Stage</p>
                                <Dropdown
                                  label="Select Stage"
                                  options={planStatusOptions}
                                  selectedValue={planStatus}
                                  onValueChange={handlePlanStatusChange}
                                />
                              </div>
                              {/*
			 <div className="status-filter mr8 mb16">
                            <p className="fc15 fw6 fs14 ls1 mb8">
                              Select Verified
                            </p>
                            <MultiDropdown
                              label="Verified"
                              options={verifiedListOptions}
                              selectedValues={selectedVerified}
                              onSelect={handleSelectVeified}
                            />
                          </div>*/}
                              <div className=" mb16 assign">
                                <p className="fc15 fw6 fs14 ls1 mb8">
                                  Select Verified
                                </p>
                                <Dropdown
                                  label="Select Verified"
                                  options={verifiedListOptions}
                                  selectedValue={selectedVerified}
                                  onValueChange={handleSelectVeified}
                                />
                              </div>

                              <div className=" mb16 assign">
                                <p className="fc15 fw6 fs14 ls1 mb8">
                                  Assigned Status
                                </p>
                                <Dropdown
                                  label="Assigned Status"
                                  options={assigneOptions}
                                  selectedValue={assignee}
                                  onValueChange={handleAsigneeChange}
                                />
                              </div>
                            </>
                          )}
                      </>
                    ) : null}
                    {selectedTab === "booked" && (
                      <>
                        <div className=" mb16 company-type">
                          <p className="fc15 fw6 fs14 ls1 mb8">Select Type</p>
                          <Dropdown
                            label="Type"
                            options={companyOptions}
                            selectedValue={companyType}
                            onValueChange={handleCompanyTypeChange}
                          />
                        </div>
                      </>
                    )}

                    {(selectedTab === "leadstatus" ||
                      selectedTab === "conversionreport") && (
                      <>
                        <div className="ct-f team-filter searching-drop mb16">
                          <p className="fc15 fw6 fs14 ls1 mb8">Select Team</p>
                          <MultiLevelDropdown
                            placeholder="Select Team"
                            data={teamsData}
                            checkedItems={checkedTeamItems}
                            setCheckedItems={setCheckedTeamItems}
                          />
                        </div>
                        <div className="lead-source searching-drop mb16">
                          <p className="fc15 fw6 fs14 ls1 mb8">Select Source</p>
                          <Dropdown
                            label="Select Source"
                            options={leadSourceOptions}
                            selectedValue={leadSource}
                            onValueChange={handleLeadSourceChange}
                          />
                        </div>
                        <div className="state-filter searching-drop mb16">
                          <p className="fc15 fw6 fs14 ls1 mb8">Search State</p>
                          <MultiSelectDropdown
                            options={stateOptions}
                            placeholder={"Search State"}
                            onSelectionChange={handleStateChange}
                            clearSignal={clearSignal}
                            selectedOption={selectedState}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="course-price filter-button-container mt16 pt16 box-center myteam-filters ">
                  <button
                    type="button"
                    className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                    onClick={closeFilter}
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
              </SidePopup>
            )}
            {selectedTab === "new" && (
              <AllLeads
                recordList={sortList}
                setRecordList={setRecordList}
                displayMsg={displayMsg}
                allApiFilter={allApiFilter}
                handleSortByChange={handleSortByChange}
                setAssignedToUser={setAssignedToUser}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
                user={user}
                actionAccess={actionAccess}
              />
            )}
            {selectedTab === "all" && (
              <AllLeads
                recordList={sortList}
                setRecordList={setRecordList}
                displayMsg={displayMsg}
                allApiFilter={allApiFilter}
                handleSortByChange={handleSortByChange}
                setAssignedToUser={setAssignedToUser}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
                user={user}
                actionAccess={actionAccess}
              />
            )}
            {selectedTab === "call_latter" && (
              <CallLatter
                recordList={sortList}
                setRecordList={setRecordList}
                displayMsg={displayMsg}
                allApiFilter={allApiFilter}
                handleSortByChange={handleSortByChange}
                setAssignedToUser={setAssignedToUser}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
                user={user}
                actionAccess={actionAccess}
              />
            )}
            {selectedTab === "followup" && (
              <Followups
                recordList={sortList}
                setRecordList={setRecordList}
                displayMsg={displayMsg}
                allApiFilter={allApiFilter}
                handleSortByChange={handleSortByChange}
                setAssignedToUser={setAssignedToUser}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
                user={user}
                actionAccess={actionAccess}
              />
            )}

            {selectedTab === "hot" && (
              <Hot
                recordList={sortList}
                setRecordList={setRecordList}
                displayMsg={displayMsg}
                allApiFilter={allApiFilter}
                handleSortByChange={handleSortByChange}
                setAssignedToUser={setAssignedToUser}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
                user={user}
                actionAccess={actionAccess}
              />
            )}
            {selectedTab === "booked" && (
              <Won
                recordList={sortList}
                setRecordList={setRecordList}
                displayMsg={displayMsg}
                allApiFilter={allApiFilter}
                handleSortByChange={handleSortByChange}
                setAssignedToUser={setAssignedToUser}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
                user={user}
              />
            )}
            {selectedTab === "funnel" && (
              <Funnel
                FunnalDataTab={recordList}
                loginData={loginData}
                onFunnelRowClick={handleFunnelRowClick}
                onCloseDetailFunnel={handleCloseDetailFunnel}
                selectedLeadId={selectedFunnalAgentId}
                getAgentName={selectedAgentName}
                scrollToCommentHistory={scrollToCommentHistory}
                detailFunnel={detailFunnel}
                onFunnalStatusUpdate={handleFunnalStatusUpdate}
                allApidata={allApidata}
                activeSortColumn={activeSortColumn}
              />
            )}

            {selectedTab === "conversionreport" && (
              <LeadConversion
                columnMapping={conversionColumnsMapping}
                data={recordList}
                displayMsg={displayMsg}
                conversionData={conversionData}
                activeSortColumn={activeSortColumn}
                onRedirect={handleRedirect}
              />
            )}
            {selectedTab === "leadstatus" && (
              <LeadStatus
                columnMapping={leadStatusColumnsMapping}
                data={recordList}
                displayMsg={displayMsg}
                conversionData={conversionData}
                activeSortColumn={activeSortColumn}
                onRedirect={handleRedirect}
              />
            )}
          </Card>
          {autoLoader && (
            <div className="box-center mb12">
              <SmallLoader className={"mb12"} />
            </div>
          )}
        </>
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default MyReports;
