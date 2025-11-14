import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import { useLocation } from "react-router-dom";
import LeadConversion from "../MyReports/LeadConversion";
import InnerHeader from "../../components/InnerHeader";
import "../MyFinance/MyFinance.css";
import Dropdown from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import Payments from "./Payments";
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
  subMonths,
  addMonths,
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import subDays from "date-fns/subDays";
import WorkOrder from "./WorkOrder";
import SearchInput from "../../components/SearchInput";
import constant from "../../constant/constant";
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
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const MyFinance = () => {
  var { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const limit = 20;
  const pageDeptAccess = user.dept_id;

  useEffect(() => {
    if (pageDeptAccess === null) {
      return;
    }

    if (pageDeptAccess != 5) {
      handleDateChange({ label: "WO Create Date", value: "wo_create_date" });
      setShowDateInput(true);
      setDate({ label: "WO Create Date", value: "wo_create_date" });
      setDateLabel("WO Create Date");
      setShowDateRangePicker(true);
      setWorkOrderStatus([]);
    } else {
      setWorkOrderStatus(["pending"]);
    }
  }, [pageDeptAccess]);

  const tabs = [
    { label: "Sales", value: "workorder" },
    { label: "Collections", value: "payments" },
  ];

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
  };
  const [dateTimeType, setDateTimeType] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [dataStatus, setDataStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);
  const [afterFilterSearch, setAfterFilterSearch] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(id ? id : "workorder");
  const [PaymentDataTab, setPaymentDataTab] = useState([]);
  const [WorkOrderDataTab, setWorkOrderDataTab] = useState([]);
  const [FunnalDataTab, setFunnalDataTab] = useState([]);
  const [FunnalTotalRecord, setFunnalTotalRecord] = useState();
  const [serviceStatusItems, setServiceStatusItems] = useState([]);
  const [paymentStatusItems, setPaymentStatusItems] = useState([]);
  const [workOrderStatusOption, setWorkOrderStatusOption] = useState([]);
  const [paymentTypeItems, setPaymentTypeItems] = useState([]);
  const [amountTypeItems, setAmountTypeItems] = useState([]);
  const [paymentModeItems, setPaymentModeItems] = useState([]);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showFunnalDateRangeCalendar, setShowFunnalDateRangeCalendar] =
    useState(false);
  const [searchBy, setSearchBy] = useState("");
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [workOrderID, setWorkOrderID] = useState("Search By");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [workOrderDisableViaPaymentId, setWorkOrderDisableViaPaymentId] =
    useState(true);
  const [serviceStatus, setServiceStatus] = useState("");
  const [workOrderStatus, setWorkOrderStatus] = useState([]);
  const [scholarStatus, setScholarStatus] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [paymentMode, setPaymentMode] = useState([]);
  const [workOrderData, setWorkOrderData] = useState([]);
  const [amountType, setAmountType] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  /*const [leadSourceOptions, setLeadSourceOptions] = useState([]);
  const [leadSource, setLeadSource] = useState("");*/
  const [paymentDataCount, setPaymentDataCount] = useState("");
  const [workOrderDataCount, setWorkOrderDataCount] = useState("");
  const [paymentHeadTabData, setPaymentHeadTabData] = useState([]);
  const [workOrderHeadTabData, setWorkOrderHeadTabData] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [expandRowByFilter, setExpandRowByFilter] = useState(false);

  const [discountTypeOptions, setDiscountTypeOptions] = useState([]);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [dateLabel, setDateLabel] = useState();
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateOptions, setDateOptions] = useState([]);
  const [date, setDate] = useState({ label: "Select Date", value: "" });

  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [detailFunnel, setDetailFunnel] = useState([]);
  const [scrollToCommentHistory, setScrollToCommentHistory] = useState(false);

  const [leadSourceOptions, setLeadSourceOptions] = useState([]);
  const [leadSource, setLeadSource] = useState({
    label: " Select Source Type",
    value: "",
  });

  const handleSourceData = (value) => {
    setLeadSource(value);
  };

  const [leadVerifiedOptions, setLeadVerifiedOptions] = useState([]);
  const [leadVerified, setLeadVerified] = useState({
        label: "Select Verified",
        value: "",
      });

  const handleLeadVerifiedChange = (value) => {
    setLeadVerified(value);
  };

  const [userTypeOptions, setUserTypeOptions] = useState([]);
      const [userType, setUserType] = useState({
        label: "Select User Type",
        value: "",
      });

    const handleUserType = (value) => {
      setUserType(value);
    };

  const [centerOptions, setCenterOptions] = useState([]);
  const [center, setCenter] = useState([]);

  const handleCenterChange = (value) => {
    const index = center.indexOf(value);
    if (index === -1) {
      setCenter([...center, value]);
    } else {
      const updatedValues = [...center];
      updatedValues.splice(index, 1);
      setCenter(updatedValues);
    }
  };

  

  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      key: "selection",
    },
  ]);

  const dateRangePickerRef = useRef(null);
  const location = useLocation();

  // if (id) {
  //   setSelectedTab("payments");
  // } else {
  //   setSelectedTab("workorder");
  // }
  const serviceStatusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];
  const searchByOptions = [
    { label: "Search By", value: "" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "User Id", value: "user_id" },
    { label: "Mobile No.", value: "mobile_number" },
    { label: "Work Order Id", value: "wid" },
    { label: "Payment Id", value: "txnid" },
    { label: "Invoice Id", value: "invoice_id" },
  ];
  const handleServiceStatusChange = (value) => {
    setServiceStatus(value);
  };
  // const handleWorkOrderStatusChange = (value, action) => {
  //   if(value.length < 0){
  //     setWorkOrderStatus([]);
  //   } else if(action != '' && action == 'single' && value.length > 0){
  //     setWorkOrderStatus([value]);
  //   } else {
  //     const index = workOrderStatus.indexOf(value);
  //     if (index === -1) {
  //       setWorkOrderStatus([...workOrderStatus, value]);
  //     } else {
  //       const updatedValues = [...workOrderStatus];
  //       updatedValues.splice(index, 1);
  //       setWorkOrderStatus(updatedValues);
  //     }
  //   }
  // };

  const handleWorkOrderStatusChange = (value, action) => {
    const values = Array.isArray(value) ? value : [value];
    if (values.length === 0) {
      setWorkOrderStatus([]);
    } else if (action === "single" && values.length > 0) {
      setWorkOrderStatus(values);
    } else {
      let updatedValues = [...workOrderStatus];
      values.forEach((val) => {
        const index = updatedValues.indexOf(val);
        if (index === -1) {
          updatedValues.push(val);
        } else {
          updatedValues.splice(index, 1);
        }
      });
      setWorkOrderStatus(updatedValues);
    }
  };

  // const handlePaymentStatusChange = (value) => {
  //   const index = paymentStatus.indexOf(value);
  //   if (index === -1) {
  //     setPaymentStatus([...paymentStatus, value]);
  //   } else {
  //     const updatedValues = [...paymentStatus];
  //     updatedValues.splice(index, 1);
  //     setPaymentStatus(updatedValues);
  //   }
  // };

  const handlePaymentStatusChange = (value, action) => {
    const values = Array.isArray(value) ? value : [value];
    if (values.length === 0) {
      setPaymentStatus([]);
    } else if (action === "single" && values.length > 0) {
      setPaymentStatus(values);
    } else {
      let updatedValues = [...paymentStatus];
      values.forEach((val) => {
        const index = updatedValues.indexOf(val);
        if (index === -1) {
          updatedValues.push(val);
        } else {
          updatedValues.splice(index, 1);
        }
      });
      setPaymentStatus(updatedValues);
    }
  };
  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
  };

  const handleAmountTypeChange = (value) => {
    setAmountType(value);
  };
  const handleDiscountTypeChange = (value) => {
    setScholarStatus(value);
  };

  const handlePaymentModeChange = (value) => {
    const index = paymentMode.indexOf(value);
    if (index === -1) {
      setPaymentMode([...paymentMode, value]);
    } else {
      const updatedValues = [...paymentMode];
      updatedValues.splice(index, 1);
      setPaymentMode(updatedValues);
    }
  };

  const handleTabChange = (value) => {
    setPageNum(1);
    setSelectedTab(value);
    id = selectedTab;
  };
  const handleDateRangeChange = (item) => {
    setDateRangeValue([item.selection]);
  };
  const toggleDateRangeCalendar = () => {
    setShowDateRangeCalendar(!showDateRangeCalendar);
  };
  const toggleFunnalDataRangeCalendar = () => {
    setShowFunnalDateRangeCalendar(!showFunnalDateRangeCalendar);
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
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam == "payments" && id) {
        setSelectedTab(tabParam);
        setShowSearchInput(true);
        setSearchBy("txnid");
        setSearchLabel("Payment Id");

        setSearchLead(id);
        let updatefilter = {
          selectedTab: "payments",
          page_type: "payments",
          searchtext: id,
          searchByOptions: "txnid",
          listStatusOptions: [],
          serviceStatus: "",
          leadSource: { label: "Source Type", value: "" },
          dateRangeValue: "",
          paymentType: "",
          paymentMode: [],
          paymentStatus: [],
          teamSearch: [],
          scholarStatus: [],
          workOrderStatus: [],
          dateOption: "wo_create_date",
          dateRangeValuefilter: "",
          categoryCheckedItems: [],
          selectedCourses: [],
          amountType: [],
          leadVerified:[],
          userType:[],
          center:[],
          leadSource:[],

        };
        var getoldfilter = localStorage.getItem("allfilteroption");
        if (getoldfilter) {
          oldFilter = JSON.parse(getoldfilter);
        }
        oldFilter[tabParam] = updatefilter;
        localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));

        setListFilter(updatefilter);
        setPageNum(1);
        setApply(true);
      } else if (tabParam == "workorder" && id) {
        setSelectedTab(tabParam);
        setShowSearchInput(true);
        setSearchBy("wid");
        setSearchLabel("Work Order Id");
        setSearchLead(id);
        let updatefilter = {
          selectedTab: "workorder",
          page_type: "workorder",
          searchtext: id,
          searchByOptions: "wid",
          listStatusOptions: [],
          serviceStatus: "",
          leadSource: { label: "Source Type", value: "" },
          dateRangeValue: "",
          paymentType: "",
          paymentMode: [],
          paymentStatus: [],
          teamSearch: [],
          scholarStatus: [],
          workOrderStatus: [],
          dateOption: "wo_create_date",
          dateRangeValuefilter: "",
          categoryCheckedItems: [],
          selectedCourses: [],
          amountType: [],
          leadVerified:[],
          userType:[],
          center:[],
          leadSource:[],

        };
        var getoldfilter = localStorage.getItem("allfilteroption");
        if (getoldfilter) {
          oldFilter = JSON.parse(getoldfilter);
        }
        oldFilter[tabParam] = updatefilter;
        localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));

        setListFilter(updatefilter);
        setPageNum(1);
      }
    }
  }, [location.search, id]);
  /*
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const [tab, id] = tabParam.split("/");

      if (tab === "payments" && id) {
        setSelectedTab(tab);
        setShowSearchInput(true);
        setSearchBy("wid");
        setSearchLabel("Work Order Id");
        setWorkOrderID(id);
        setSearchLead("mmazak");
        let updatefilter = {
          ...listFilter,
          searchtext: id,
          searchByOptions: "wid",
          selectedTab: tab,
        };
        setListFilter(updatefilter);
        setPageNum(1);
      }
    }

    if (tabParam && tabs.some((tab) => tab.value === tabParam)) {
      setSelectedTab(tabParam);
    }
    // eslint-disable-next-line
  }, [location.search]);*/

  // useEffect(() => {
  //   // Update courses when selected category changes
  //   // setSelectedCourses(extractCourses(categoryItems));
  // }, [categoryItems]);

  //kamlesh
  var oldFilter = {};
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [listStatusOptions, setListStatusOptions] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchBlog, setSearchBlog] = useState("");
  const [clearSignal, setClearSignal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [searchLead, setSearchLead] = useState("");
  const [apply, setApply] = useState(false);
  const initial_obj = {
    selectedTab: selectedTab,
    page_type: selectedTab,
    searchtext: "",
    searchByOptions: "",
    listStatusOptions: "",
    serviceStatus: [],
    leadSource: "",
    dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
    paymentType: "",
    paymentMode: "",
    paymentStatus: "",
    teamSearch: "",
    scholarStatus: scholarStatus,
    workOrderStatus: workOrderStatus,
    dateOption: pageDeptAccess != 5 ? "wo_create_date" : "",
    dateRangeValuefilter: "",
    categoryCheckedItems: [],
    selectedCourses: [],
    amountType: "",
    leadVerified:[],
    userType:[],
    center:[],
    leadSource:[],
    setExpandView:false,
  };
  const [listFilter, setListFilter] = useState({});

  const handleSearchChange = (value) => {
    setSearchLead(value);
  };
  const updateSetListingFilter = async () => {
    let updatefilter = {
      ...listFilter,
      ...initial_obj,
      selectedTab: selectedTab,
      page_type: selectedTab,
    };
    setListFilter(updatefilter);
  };
  const applyFilter = async (selectedTab) => {
    setFilterApplyStatus(true);

    setPaymentDataCount(0);
    setTotalPageNum(0);
    setPaymentDataTab([]);
    id = "";
    let updatefilter = {
      ...listFilter,
      searchtext: searchLead,
      searchByOptions: searchBy,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      listStatusOptions: selectedStatus,
      serviceStatus: serviceStatus,
      selectedTab: selectedTab,
      paymentType: paymentType,
      paymentMode: paymentMode,
      paymentStatus: paymentStatus,
      teamSearch: checkedItems,
      leadSource: leadSource,
      scholarStatus: scholarStatus,
      workOrderStatus: workOrderStatus,
      dateOption: date,
      page_type: selectedTab,
      dateRangeValuefilter: dateRangeValue,
      categoryCheckedItems: categoryCheckedItems,
      selectedCourses: selectedCourses,
      amountType: amountType,
      leadVerified:leadVerified,
      userType:userType,
      center:center,
      leadSource:leadSource,

    };
    var getoldfilter = localStorage.getItem("allfilteroption");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));

    setListFilter(updatefilter);
    setApply(true);
    setPageNum(1);
    closeMoreFilter();
  };
  const closeFilter = () => {
    document.body.style.overflow = "auto";
    setSearchLead("");
    setSearchBy("");
    setSearchLabel("Search By");
    setCheckedItems([...teamData]);
    setShowSearchInput(false);
    setWorkOrderDisableViaPaymentId(true);
    setPaymentMode([]);
    setPaymentStatus([]);
    setSelectedCourses([]);
    setPaymentType({ label: "Select Payment Type", value: "" });
    setAmountType({ label: "Select Amount Type", value: "" });
    setScholarStatus([]);
    setWorkOrderStatus([]);
    setServiceStatus({ label: "Course Status", value: "" });
    setDate({ label: "Select Date", value: "" });
    setLeadSource({
      label: "Source Type",
      value: "",
    });
    setLeadVerified({
      label: "Select Verified",
      value: "",
    });
    setUserType({
      label: "Select User Type",
      value: "",
    });
    setCenter([]);

  };

  const setLocalStorage = async () => {
    var getoldfilter = localStorage.getItem("allfilteroption");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab]
        ? oldFilter[selectedTab]
        : "";
      if (currenttabfilter) {
        setFilterApplyStatus(true);
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["workOrderStatus"]) {
          setWorkOrderStatus(currenttabfilter["workOrderStatus"]);
        }
        if (currenttabfilter && currenttabfilter["scholarStatus"]) {
          setScholarStatus(currenttabfilter["scholarStatus"]);
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
        if (currenttabfilter && currenttabfilter["paymentType"]) {
          setPaymentType(currenttabfilter["paymentType"]);
        }
        if (currenttabfilter && currenttabfilter["amountType"]) {
          setAmountType(currenttabfilter["amountType"]);
        }
        if (currenttabfilter && currenttabfilter["leadVerified"]) {
          setLeadVerified(currenttabfilter["leadVerified"]);
        }
        if (currenttabfilter && currenttabfilter["userType"]) {
          setUserType(currenttabfilter["userType"]);
        }
        if (currenttabfilter && currenttabfilter["center"]) {
          setCenter(currenttabfilter["center"]);
        }
        if (currenttabfilter && currenttabfilter["leadSource"]) {
          setLeadSource(currenttabfilter["leadSource"]);
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
  // useEffect(() => {
  //   const savedFilter = localStorage.getItem(selectedTab);
  //   if (savedFilter) {
  //     let localValuesFilter = JSON.parse(savedFilter);
  //     setCheckedItems(localValuesFilter.teamSearch);
  //     setDate("wo_create_date");
  //     setShowDateInput(true);
  //     setDateLabel("WO Created Date");
  //   }
  // }, [selectedTab]);

  const [showClearButton, setShowClearButton] = useState(false);

  // Function to check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      paymentStatus.length > 0 ||
      serviceStatus.value ||
      scholarStatus.length > 0 ||
      workOrderStatus.value ||
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
    workOrderStatus,
    paymentMode,
    paymentType,
    amountType,
    searchLead,
    leadSource,
    selectedStatus,
    date,
  ]);

  // Set the showClearButton state whenever filters change
  useEffect(() => {
    setShowClearButton(hasActiveFilters);
  }, [hasActiveFilters]);
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

  const clearFilter = () => {
    setFilterCount(0);
    setLeadSource({ label: "Source Type", value: "" });
    setCheckedItems([]);
    setClearSignal(true);
    handleDateChange({ label: "Select Date", value: "" });
    setShowDateInput(false);
	  setCategoryCheckedItems(categoryData);
    //setCategoryCheckedItems([]);
    setTimeout(() => setClearSignal(false), 0);
    setDate({ label: "Select Date", value: "" });
    setScholarStatus([]);
    setWorkOrderStatus([]);

    let updatefilter = {
      ...listFilter,
      searchtext: "",
      searchByOptions: "",
      dateRangeValue: "",
      listStatusOptions: "",
      serviceStatus: "",
      selectedTab: selectedTab,
      teamSearch: "",
      leadSource: "",
      paymentType: "",
      paymentMode: "",
      paymentStatus: "",
      page_type: selectedTab,
      categoryCheckedItems: "",
      amountType: "",
      scholarStatus: scholarStatus,
      workOrderStatus: workOrderStatus,
      dateOption: "",
      setExpandView: false,
      leadVerified:[],
      userType:[],
      center:[],
      leadSource:[],

    };
    setExpandRowByFilter(false);
    setListFilter(updatefilter);
    setWorkOrderDataCount("");
    setPaymentDataCount("");
    setPageNum(1);
    // if (selectedTab == "workorder") {
    //   getWorkOrderList();
    // } else {
    //   getPaymentList();
    // }
    setDateRangeValue([
      {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ),
        key: "selection",
      },
    ]);
    closeFilter();
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
    setShowClearButton(false);
    setFilterApplyStatus(false);
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
  useEffect(() => {
    if (listFilter.page_type == "workorder") {
      getWorkOrderList(listFilter);
    } else if (listFilter.page_type == "payments") {
      getPaymentList();
    }
  }, [listFilter]);

  useEffect(() => {
    getallfilter();
  }, []);
  useEffect(() => {
    if (listFilter.page_type !== undefined) {
      getallfilter();
    }
  }, [selectedTab]);

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const getallfilter = async () => {
    let payloadData = {};
    const allTabsFilter = JSON.parse(localStorage.getItem("allfilteroption") || "{}");
    if (allTabsFilter[selectedTab]) {
      payloadData = allTabsFilter[selectedTab];
    }

    axios({
      method: "post",
      url: `${constant.base_url}/admin/myfinance_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: payloadData,
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          checkUserLogin(response);
          return false;
        }
        if (response.data.data.status === "1") {
          setTeamData([...JSON.parse(response.data.data.alfilter.teamsData)]);
          if (checkedItems.length <= 0) {
            setCheckedItems([
              ...JSON.parse(response.data.data.alfilter.teamsData),
            ]);
          }
          setPaymentStatusItems([
            ...JSON.parse(response.data.data.alfilter.paymentDataStatus),
          ]);
          setServiceStatusItems([
            ...JSON.parse(response.data.data.alfilter.serviceDataStatus),
          ]);
          setPaymentTypeItems([
            ...JSON.parse(response.data.data.alfilter.paymentTypeOption),
          ]);
          setPaymentModeItems([
            ...JSON.parse(response.data.data.alfilter.paymentModeOption),
          ]);
          setLeadSourceOptions([
            ...JSON.parse(response.data.data.alfilter.leadSourceOptions),
          ]);
          setWorkOrderStatusOption([
            ...JSON.parse(response.data.data.alfilter.workOrderDataStatus),
          ]);
          setDiscountTypeOptions([
            ...JSON.parse(response.data.data.alfilter.discountTypeOption),
          ]);
          setDateOptions([
            ...JSON.parse(response.data.data.alfilter.dateOptions),
          ]);
         setCategoryCheckedItems([
            ...JSON.parse(response.data.data.alfilter.categories_list),
          ]);
          setCourseListOptions([
            ...JSON.parse(response.data.data.alfilter.courseListOptions),
          ]);
          setAmountTypeItems([
            ...JSON.parse(response.data.data.alfilter.amountTypeData),
          ]);
        
	setCenterOptions([
          ...JSON.parse(response.data.data.alfilter.LocationData),
        ]);

        setLeadVerifiedOptions([
          ...JSON.parse(response.data.data.alfilter.verified_status),
        ]);

        setUserTypeOptions([
          ...JSON.parse(response.data.data.alfilter.user_type),
        ]);
         setCategoryData([
	...JSON.parse(response.data.data.alfilter.categories_list),
]);

	setCategoryCheckedItems([
        	...JSON.parse(response.data.data.alfilter.categories_list),
        ]);
        setFilterStatus(true);
      } else {
        setPaymentDataTab([]);
      }
    })
    .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };
  const getPaymentList = async () => {
    setAutoLoader(true);
    setAfterFilterSearch(false);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/payment_details.php?fun=getPaymentList`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: pageNum, limit: limit, filter: listFilter, id: id },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          checkUserLogin(response);
          return false;
        }
        let responseData = response.data.data;
        if (response.data.data.list != "" && response.data.data.list != null) {
          if (pageNum === 1) {
            setPaymentDataCount(responseData.total_count);
            setTotalPageNum(responseData.total_page);
            setPaymentDataTab([...responseData.list]);
          } else {
            setPaymentDataTab([...PaymentDataTab, ...responseData.list]);
          }

          setAfterFilterSearch(true);
        } else {
          setPaymentDataTab([]);
          setPaymentDataCount("");
        }
        if (response.data.data.head_tab != "") {
          setPaymentHeadTabData(responseData.head_tab);
        } else {
          setPaymentHeadTabData([]);
        }
        setPageNum((prevPageNum) => prevPageNum + 1);
        setIsFetching(false);
        setDataStatus(true);
        setAutoLoader(false);
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };

  const getWorkOrderList = async () => {
    setAfterFilterSearch(false);
    setAutoLoader(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/workorder_details.php?fun=getWorkOrderList`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        page_num: pageNum,
        limit: limit,
        filter: listFilter,
        id: id,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          checkUserLogin(response);
          return false;
        }
        let responseData = response.data.data;
        if (response.data.data != null) {
          if (
            response.data.data.list != "" &&
            response.data.data.list != null
          ) {
            if (pageNum === 1) {
              setWorkOrderDataCount(responseData.total_count);
              setTotalPageNum(responseData.total_page);
              setWorkOrderDataTab([...responseData.list]);
              setWorkOrderHeadTabData(responseData.head_tab);
            } else {
              setWorkOrderDataTab([...WorkOrderDataTab, ...responseData.list]);
            }
            setAfterFilterSearch(true);
          } else {
            setWorkOrderDataTab([]);
            setWorkOrderDataCount("");
            setWorkOrderHeadTabData([]);
          }
        } else {
          setWorkOrderDataTab([]);
          setWorkOrderHeadTabData([]);
        }

        setPageNum((prevPageNum) => prevPageNum + 1);
        setIsFetching(false);
        setDataStatus(true);
        setAutoLoader(false);
      })
      .catch(function (error) {
        // Handle errors
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
            if (selectedTab === "workorder") {
              getWorkOrderList();
            } else {
              getPaymentList();
            }
          }
        }
      }, 200); // Adjust the debounce delay as needed
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
        // Once a match is found, exit the loop
        break; // Exit the loop after the first successful match
      }
    }
  };
  selectRange();
  const FilterAllStateClear = () => {
    setDate("");
    if (pageDeptAccess != 5) {
      handleDateChange({ label: "WO Create Date", value: "wo_create_date" });
    } else {
      handleDateChange({ label: "Select Date", value: "" });
      setShowDateInput(false);
    }
    setLeadSource({ label: "Source Type", value: "" });
    setSearchBy("");
    setSearchLabel("Search By");
    setSearchLead("");
    setClearSignal(true);
    setTimeout(() => setClearSignal(false), 0);
    setPageNum(1);
    setTotalPageNum(0);
    setCheckedItems([...teamData]);
  };

  useEffect(() => {
    if (filterStatus) {
      FilterAllStateClear();
      setLocalStorage();
    }
  }, [selectedTab, filterStatus]);
  useEffect(() => {
    if (filterStatus) {
      FilterAllStateClear();
      setLocalStorage();
    }
  }, [selectedTab, filterStatus]);

  // const handleNavLinkClick = (value) => () => {
  //   setListFilter((prevFilter) => ({
  //     ...prevFilter,
  //     workOrderStatus: prevFilter.workOrderStatus
  //       ? [...prevFilter.workOrderStatus, value]
  //       : [value],
  //   }));
  //   var getoldfilter = localStorage.getItem("allfilteroption");
  //   if (getoldfilter) {
  //     oldFilter = JSON.parse(getoldfilter);
  //   }
  //   oldFilter[selectedTab] = listFilter;
  //   localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));

  //   setApply(true);
  //   setPageNum(1);
  //   handleWorkOrderStatusChange(value);
  // };

  const handleCommonNavClick = (type, values) => () => {
    if (values) {
      setListFilter((prevFilter) => ({
        ...prevFilter,
        scholarStatus: values,
      }));
      setApply(true);
      setPageNum(1);
      setScholarStatus(values);
    } else {
      setScholarStatus([]);
    }
  };

  const handleNavLinkClick = (values) => () => {
    if (values.length > 0) {
      setListFilter((prevFilter) => ({
        ...prevFilter,
        workOrderStatus: values,
      }));
      setApply(true);
      setPageNum(1);
      handleWorkOrderStatusChange(values, "single");
    } else {
      setWorkOrderStatus([]);
      handleWorkOrderStatusChange([], "single");
    }
  };
  const handleNavLinkPaymentClick = (values) => () => {
    if (values.length > 0) {
      setListFilter((prevFilter) => ({
        ...prevFilter,
        paymentStatus: values,
      }));
      setApply(true);
      setPageNum(1);
      handlePaymentStatusChange(values, "single");
    } else {
      setPaymentStatus([]);
      handlePaymentStatusChange([], "single");
    }
  };

  const handleNavLinkPaymentClickDiscount = (values) => () => {
    if (values !== "") {
      setListFilter((prevFilter) => ({
        ...prevFilter,
        amountType: values,
      }));
      setApply(true);
      setPageNum(1);
      handleAmountTypeChange(values);
    } else {
      handleAmountTypeChange("");
    }
  };
  const [filterCount, setFilterCount] = useState(0);

  const [filterApplyStatus, setFilterApplyStatus] = useState(false);

  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };

  return (
    <>
      {dataStatus && filterStatus && (
        <>
          {" "}
          <InnerHeader
            heading="My Revenue"
            txtSubHeading="Track collections and sales statuses accurately to ensure smooth financial operations."
            showButton={false}
            iconText="Add New Lead"
          />
          <Card className="bg5 mt16 pb16">
            <Tabs
              tabs={tabs}
              showCheckboxes={false}
              showFilter={false}
              onTabChange={handleTabChange}
              count={FunnalTotalRecord}
              selectedTab={selectedTab}
            />
            <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww ">
              <div className="left-side-filter v-center fww">
                {selectedTab === "workorder" && (
                  <>
                    <div className="date-label mb8 ">
                      <Dropdown
                        label={dateLabel}
                        options={dateOptions}
                        selectedValue={date}
                        onValueChange={handleDateChange}
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
                                renderStaticRangeLabel={(range) => (
                                  <span>{range.label}</span>
                                )}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="mr8 wo-status mb8 hide-mobile">
                      <MultiDropdown
                        label="WO Status"
                        options={workOrderStatusOption}
                        selectedValues={workOrderStatus}
                        onSelect={handleWorkOrderStatusChange}
                        chips={2}
                      />
                    </div>
                    <div className="mr8 service-status-filter searching-drop mb8 hide-mobile">
                      <Dropdown
                        label="Select Discounnt Type"
                        options={discountTypeOptions}
                        selectedValue={scholarStatus}
                        onValueChange={handleDiscountTypeChange}
                      />
                    </div>
                  </>
                )}
                {selectedTab === "payments" && (
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
                    <div className="service-status-filter mr8 searching-drop mb8">
                      {/* <Dropdown
                    label="Payment Status"
                    options={paymentStatusItems}
                    selectedValue={paymentStatus}
                    onValueChange={handlePaymentStatusChange}
                  /> */}
                      <MultiDropdown
                        label="Payment Status"
                        options={paymentStatusItems}
                        selectedValues={paymentStatus}
                        onSelect={handlePaymentStatusChange}
                        chips={2}
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
                <button
                  className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml12"
                  onClick={() => applyFilter(selectedTab)}
                >
                  Go
                </button>
                {showClearButton && (
                  <button
                    className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                    onClick={clearFilter}
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
                listOptions={{
                  courseListOptions,
                  workOrderStatusOption,
                  paymentStatusItems,
                  paymentModeItems,
                }}
              />
            )}
            {user && selectedTab === "payments" && (
              <Payments
                PaymentDataTab={PaymentDataTab}
                loginData={user}
                paymentDataCount={paymentDataCount}
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortList={sortList}
                PaymentHeadTabData={paymentHeadTabData}
                handleNavLinkPaymentClick={handleNavLinkPaymentClick}
                handleNavLinkPaymentClickDiscount={
                  handleNavLinkPaymentClickDiscount
                }
              />
            )}
            {user && selectedTab === "workorder" && (
              <WorkOrder
                expandRowByFilter={expandRowByFilter}
                WorkOrderDataTab={WorkOrderDataTab}
                loginData={user}
                workOrderDataCount={workOrderDataCount}
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortList={sortList}
                WorkOrderHeadTabData={workOrderHeadTabData}
                WorkOrderDisableViaPaymentId={workOrderDisableViaPaymentId}
                handleNavLinkClick={handleNavLinkClick}
                handleCommonNavClick={handleCommonNavClick}
              />
            )}
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
                  {selectedTab === "payments" && (
                    <>
                      <div className="service-status-filter searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                          Select Payment Type
                        </p>
                        <Dropdown
                          label="Select Payment Type"
                          options={paymentTypeItems}
                          selectedValue={paymentType}
                          onValueChange={handlePaymentTypeChange}
                        />
                      </div>
                      <div className="service-status-filter searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                          Select Payment Mode
                        </p>
                        <MultiDropdown
                          label="Payment Mode"
                          options={paymentModeItems}
                          selectedValues={paymentMode}
                          onSelect={handlePaymentModeChange}
                          chips={2}
                        />
                      </div>
                      <div className="service-status-filter searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                          Select Amount Type
                        </p>
                        <Dropdown
                          label="Select Amount Type"
                          options={amountTypeItems}
                          selectedValue={amountType}
                          onValueChange={handleAmountTypeChange}
                        />
                      </div>
                    </>
                  )}
                  {selectedTab === "workorder" && (
                    <>
                    <div className="wo-status mb16 hide-desktop">
                    <p className="fc15 fw6 fs14 ls1 mb8">
                        Select WO Status
                      </p>
                    <MultiDropdown
                      label="WO Status"
                      options={workOrderStatusOption}
                      selectedValues={workOrderStatus}
                      onSelect={handleWorkOrderStatusChange}
                      chips={2}
                    />
                  </div>
                  <div className="service-status-filter searching-drop mb16 hide-desktop">
                  <p className="fc15 fw6 fs14 ls1 mb8">
                        Select Discounnt Type
                      </p>
                    <Dropdown
                      label="Select Discounnt Type"
                      options={discountTypeOptions}
                      selectedValue={scholarStatus}
                      onValueChange={handleDiscountTypeChange}
                    />
                  </div>
                    <div className="wo-status mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">
                        Select Course Status
                      </p>

                      <Dropdown
                        label="Course Status"
                        options={serviceStatusItems}
                        selectedValue={serviceStatus}
                        onValueChange={handleServiceStatusChange}
                      />
                    </div>
                    </>
                  )}
                  {(selectedTab === "payments" ||
                    selectedTab === "workorder") && (
                    <>
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
                      <div className="team-filter searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">Select Teams</p>
                        <MultiLevelDropdown
                          placeholder="Select Teams"
                          data={teamData}
                          checkedItems={checkedItems}
                          setCheckedItems={setCheckedItems}
                        />
                      </div>
			    {/*  <div className="search-filter mb8">
                        <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                        <Dropdown
                          label={searchLabel}
                          options={searchByOptions}
                          selectedValue={searchBy}
                          onValueChange={handleSearchByChange}
                        />
                      </div>*/}
		     
                    <div className="service-status-filter searching-drop mb8 mt16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Source Type</p>
                      <Dropdown
                        label="Source Type"
                        options={leadSourceOptions}
                        selectedValue={leadSource}
                        onValueChange={handleSourceData}
                      />
                    </div>

                     <div className="service-status-filter mr8 searching-drop mb16">
                        <p className="fc15 fw6 fs14 ls1 mb8">Select Location</p>
                        <MultiDropdown
                          label="Location"
                          options={centerOptions}
                          selectedValues={center}
                          onSelect={handleCenterChange}
                          chips={3}
                        />
                      </div>
                      <div className="service-status-filter mr8 searching-drop mb8 mt16">
                        <p className="fc15 fw6 fs14 ls1 mb8">Select Verified</p>
                        <Dropdown
                          label="Select Verified"
                          options={leadVerifiedOptions}
                          selectedValue={leadVerified}
                          onValueChange={handleLeadVerifiedChange}
                        />
                      </div>

                      <div className="service-status-filter mr8 searching-drop mb8 mt16">
                        <p className="fc15 fw6 fs14 ls1 mb8">User Type</p>
                        <Dropdown
                          label="User Type"
                          options={userTypeOptions}
                          selectedValue={userType}
                          onValueChange={handleUserType}
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
                    onClick={() => applyFilter(selectedTab)}
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

export default MyFinance;
