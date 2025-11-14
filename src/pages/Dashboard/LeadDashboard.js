import React, { useState, useRef, useEffect } from "react";
import "./Dashboard.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import LeadSummaryData from "../../data/Dashboard/LeadSummaryData";
import CardSlider from "../../components/Dashboard/CardSlider";
import Tabs from "../../components/Tabs";
import ReusablePieChart from "../../components/Dashboard/ReusablePieChartlead.js";

import LeadStatusData from "../../data/Dashboard/LeadStatusData";

import LeadSourceData from "../../data/Dashboard/LeadSourceData";
import CategoryData from "../../data/Dashboard/CategoryData";
import LocationData from "../../data/Dashboard/LocationData";
import colors from "../../data/Dashboard/Colors";
import SidePopup from "../../components/Popup/SidePopup";
import MultiLevelDropdown from "../../components/MultiLevelDropdown";
import MultiDropdown from "../../components/MultiDropdown";
import Dropdown from "../../components/Dropdown";
import SingleDropdown from "../../components/SingleDropdown";
import NestTab from "../../components/Dashboard/NestTab";
import BarChartComponent from "../../components/Dashboard/BarChartComponent";
import UserTypeData from "../../data/Dashboard/UserTypeData";
import InnerHeader from "../../components/InnerHeader";
import { CiSquareChevDown } from "react-icons/ci";
import newFormatDateRange from "../../helpers/newFormatDateRange";
import formatDateRange from "../../helpers/formatDateRange";
import axios from "axios";
import constant from "../../constant/constant.js";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { logout } from "../../store/authSlice.js";

const LeadDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("source");
  const { id } = useParams();
  const [filterAppliedShow, setFilterAppliedShow] = useState(true);
  const [showAppliedFilter, setShowAppliedFilter] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [isSecondDateVisible, setSecondDateVisible] = useState(false);
  const [listFilter, setListFilter] = useState({});
  const [dataStatus, setDataStatus] = useState(false);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(0);
  const [allTabRecord, setAllTabRecord] = useState({});
  const [allTabRecordApiStatus, setAllTabRecordApiStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [activeTabVal, setActiveTabVal] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [activeCategoryVal, setActiveCategoryVal] = useState("all");
  const [activeSubCategoryVal, setActiveSubCategoryVal] = useState("all");
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const [tabs, setTabs] = useState([]);
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: subMonths(new Date(),1),
      endDate: addDays(new Date(), 0),
      key: "selection1",
    },
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection2",
    },
  ]);
  const [dateTimeType, setDateTimeType] = useState("");
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [categoryDataOptions, setCategoryDataOptions] = useState([]);
  const [categoryCheckedItems, setCategoryCheckedItems] =useState([]);
  const [sourceDataOptions, setSourceDataOptions] = useState([]);
  const [sourceData, setSourceData] = useState({"label":"Source Type","value":""});
  const [centerOptions, setCenterOptions] = useState([]);
  const [center, setCenter] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [course, setCourse] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [checkedTeamItems, setCheckedTeamItems] = useState([]);
  const [leadVerifiedOptions, setLeadVerifiedOptions] = useState([]);
  const [leadVerified, setLeadVerified] = useState({
    label: "Select Verified",
    value: "",
  });
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [userType, setUserType] = useState({
    label: "Select User Type",
    value: "",
  });
  const [leadSummaryFilter, setLeadSummaryFilter] = useState({
    value: "all",
    label: "All",
  });
  const [filterCount, setFilterCount] = useState(0);

  const leadSummaryFilterOptions = [
    { value: "all", label: "All" },
    { value: "worked", label: "Worked" },
    { value: "new", label: "Generated" },
  ];
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedCardData, setSelectedCardData] = useState('Worked Leads');
  const [cardData, setCardData] = useState({}); 
  const [leadSourceData, setLeadSourceData] = useState({});
  const [whatsAppData, setWhatsAppData] = useState({});
  const [followupData, setFollowupData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [userTypeData, setUserTypeData] = useState({});
  const [leadSummaryData, setLeadSummaryData] = useState([]);

  



  const initial_obj = {
    pageType: "lead",
    tabName:id ? id : activeTabVal,
    activeCategory:activeCategoryVal,
    activeSubCategory:activeSubCategoryVal,
    checkedTeamItems:"",
    sourceData:"",
    categoryCheckedItems: "",
    selectedCourses:"",
    center:"",
    leadVerified:"",
    userType:"",
    dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy") || `${format(dateRangeValue[1].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[1].endDate, "dd-MM-yyyy")}`}`,
    dateRangeValuefilter: dateRangeValue,
    isSecondDateVisible:isSecondDateVisible

  }

  var oldFilter = {};
  const applyFilter = async () => {
    let updatefilter = {
      ...listFilter,
      page_type: "lead",
      activeTab:activeTabVal,
      activeCategory:activeCategoryVal,
      activeSubCategory:activeSubCategoryVal,
      checkedTeamItems:checkedTeamItems,
      sourceData:sourceData,
      categoryCheckedItems: categoryCheckedItems,
      selectedCourses:course,
      center:center,
      leadVerified:leadVerified,
      userType:userType,
      dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy") || `${format(dateRangeValue[1].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[1].endDate, "dd-MM-yyyy")}`}`,
      dateRangeValuefilter: dateRangeValue,
      isSecondDateVisible:isSecondDateVisible 
    };
   
    var getoldfilter = localStorage.getItem("leaddashboard");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter = updatefilter;
    localStorage.setItem("leaddashboard", JSON.stringify(oldFilter));
    setFilterApiStatus(false);
    setListFilter(updatefilter);
    updateFilterCount();
    setShowAppliedFilter(true);
    closeFilter();
  }
const clearFilter = () => {
  FilterAllStateClear();
  localStorage.removeItem("leaddashboard");
  getAllFilter();
  updateSetListingFilter();
  closeFilter();
};

  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  const updateSetListingFilter = async () => {
   
    let updatefilter = {
      ...listFilter,
      ...initial_obj,
      page_type: "lead",
      activeTab:activeTabVal,
      activeCategory:activeCategoryVal,
      activeSubCategory:activeSubCategoryVal,
    };
    
    setListFilter({...updatefilter});
  }
  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  const FilterAllStateClear=()=>{
    closeFilter();
    setShowAppliedFilter(false);
    setCenter([]);
    setCourse([]);
    setCheckedTeamItems([]);
    setCategoryCheckedItems([]);
    setLeadVerified({
      label: "Select Verified",
      value: "",
    });
    setUserType({
      label: "Select User Type",
      value: "",
    });
    setSourceData({
      label: "Source Type",
      value: "",
    });
    setFilterCount(0);
    setFilterApiStatus(false);
  }
  
  useEffect(() => {
    
    if(filterApiStatus){
      if(listFilter.activeTab!=''){
      getSubCategoryRecordDataRecord();
      }
      //getDataRecord();
    }
  }, [filterApiStatus]);

  useEffect(()=>{
    if(listFilter.activeTab==activeTabVal){
      getAllFilter();
    }
  },[listFilter]);

  useEffect(()=>{
      // FilterAllStateClear();
      setLocalStorage();
      applyFilter();
  },[activeTab,activeCategory,activeSubCategory]);

  useEffect(()=>{
    getDataRecord();
  },[])
 
 

  const setLocalStorage = async () =>  {
	  localStorage.removeItem("salesdashboard");
    var getoldfilter = localStorage.getItem("leaddashboardtemp");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter ? oldFilter:"";
      if (currenttabfilter) {
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["checkedTeamItems"]) {
          setCheckedTeamItems(currenttabfilter["checkedTeamItems"]);
        }
        if (currenttabfilter && currenttabfilter["sourceData"]) {
          setSourceData(currenttabfilter["sourceData"]);
        }
        if(currenttabfilter && currenttabfilter["categoryCheckedItems"]){
          setCategoryCheckedItems(currenttabfilter["categoryCheckedItems"]);
        }
        if(currenttabfilter && currenttabfilter["selectedCourses"]){
          setCourse(currenttabfilter["selectedCourses"]);
        }
        if(currenttabfilter && currenttabfilter["center"]){
          setCenter(currenttabfilter["center"]);
        }
        if(currenttabfilter && currenttabfilter["leadVerified"]){
          setLeadVerified(currenttabfilter["leadVerified"]);
        }
        if(currenttabfilter && currenttabfilter["userType"]){
          setUserType(currenttabfilter["userType"]);
        }
      }else{
        updateSetListingFilter();
      }
    }else{
      updateSetListingFilter();
    }
  }
 
  const slideLeft = () => {
    sliderRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const updateScrollState = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateScrollState();
    const slider = sliderRef.current;
    slider.addEventListener("scroll", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
    };
  }, []);
  const handleCardClick = (index) => {
    if (selectedCard === index) {
      setSelectedCard(0);
      setSelectedCardData('Worked Leads');
    } else {
      
      setSelectedCard(index);
      setSelectedCardData(cardData[index]['title']);
    }
  };
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
  const updateFilterCount = () => {
    const count =
      (course.length > 0 ? 1 : 0) +
      (center.length > 0 ? 1 : 0) +
      (checkAnyCheckedTrue(checkedTeamItems) ? 1 : 0) +
      (checkAnyCheckedTrue(categoryCheckedItems) ? 1 : 0) +
      (sourceData.value.trim() !== "" ? 1 : 0) +
      (leadVerified.value.trim() !== "" ? 1 : 0) +
      (userType.value.trim() !== "" ? 1 : 0);
    
    setFilterCount(count);
    if (count === 0) {
      setShowAppliedFilter(false);
    }
  };
  const handleLeadSummaryFilterSelect = (option) => {
    setLeadSummaryFilter(option);
  };


  const handleLeadVerifiedChange = (value) => {
    setLeadVerified(value);
  };
  const handleUserType = (value) => {
    setUserType(value);
  };
  const handleSourceData = (value) => {
    setSourceData(value);
  };

  const dateRangePickerRef = useRef(null);
  const toggleDateRangePicker = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const handleClickOutside = (event) => {
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target)
    ) {
      setShowDateRangePicker(false);
    }
  };

  useEffect(() => {
    if (showDateRangePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateRangePicker]);
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
      // range: () => ({
      //   startDate: startOfMonth(new Date()),
      //   endDate: endOfMonth(new Date()),
      // }),
    range: () => {
        const today = new Date();
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        const endDate = end > today ? today : end;
        
        return {
          startDate: start,
          endDate: endDate,
        };
      },
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

  const handleToggleDate = () => {
    setSecondDateVisible((prevState) => !prevState);
    setShowDateRangePicker(true);
  };
  const customToggleOption = {
    label: "Compare",
    range: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
    isSelected: (range) => false,
  };

  const staticRangesWithToggle = [
    ...staticRanges,
    // {
    //   ...customToggleOption,
    //   label: (
    //     <div onClick={handleToggleDate} className="compare-toggle-container">
    //       <span className="compare-toggle-text">Compare</span>
    //       <div
    //         className={`compare-toggle ${isSecondDateVisible ? "compare-toggle-on" : ""}`}
    //       >
    //         <div
    //           className={`compare-toggle-circle ${isSecondDateVisible ? "compare-toggle-circle-on" : ""}`}
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
  ];
  var oldFilter = {};

  

  const colorsLead = [
    "#b5cff7",
    "#e39e97",
    "#91ffc1",
    "#6c9ced",
    "#98d8e6",
    "#f8d777",
    "#9ff877",
    "#77f8e3",
    "#77aef8",
    "#fdf26f",
    "#cccccc",
  ];

 

  const allKeys = [
    "Worked",
    "Generated",
    "Booked",
    "Hot",
    "Interested",
    "Ask To Call Later",
    "No Response",
    "Not Interested",
    "Junk",
  ];
  const [visibleKeys, setVisibleKeys] = useState(["Worked", "New", "Booked"]);
  const toggleKey = (key) => {
   
    setVisibleKeys(
      (prev) =>
        prev.includes(key)
          ? prev.filter((k) => k !== key) // Remove key if it's already visible
          : [...prev, key] // Add key if it's not visible
    );
  };
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };
  const closeMoreFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };


  useEffect(() => {
    updateFilterCount();
  }, [leadVerified, userType, sourceData, center, course, checkedTeamItems]);
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
  const handleCourseChange = (value) => {
    
    const index = course.indexOf(value);
    if (index === -1) {
      setCourse([...course, value]);
    } else {
      const updatedValues = [...course];
      updatedValues.splice(index, 1);
      setCourse(updatedValues);
    }
  };
  
  const toggleFilter = () => {
    setFilterAppliedShow(!filterAppliedShow);
  };
  
  const [dataverify,setDataverify] = useState({});
  const bars = [
    {
      dataKey: "WhatsApp",
      stackId: "a",
      fill: "#9bf8ab",
      redirectData: {
        label: "Responded via WhatsApp",
        value: "whatapps_verified",
      },
    },
    {
      dataKey: "Email",
      stackId: "a",
      fill: "#f69784",
      redirectData: { label: "Email Verified", value: "email_verified" },
    },
    {
      dataKey: "Mobile",
      stackId: "a",
      fill: "#84aaf6",
      redirectData: { label: "Mobile Verified", value: "mobile_verified" },
    },
  ];
  const handleRedirectSetFilter = (
    pageTab,
    dateOption,
    dateRangeValue,
    redirectData
  ) => {
    let updatefilter = {
      page_type: pageTab,
      datetypefilter: dateOption,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      checkedTeamItems: [],
      planStatus: {
        label: "Select Stage",
        value: "",
      },
      leadStatus: "",
      leadSource: {
        label: "Select Source",
        value: "",
      },
      selectedState: [],
      assignee: {
        label: "Assigned Status",
        value: "",
      },
      categoryCheckedItems: [],
      selectedCourses: [],
      companyType: {
        label: "User Type",
        value: "",
      },
      selectedVerified: redirectData,
      dateRangeValuefilter: dateRangeValue,
      statusCheckedItems: [],
      dateMonthOptions: {
        label: "Day",
        value: "day",
      },
      dateRangeTimeType: "Custom",
    };

    oldFilter[pageTab] = updatefilter;
    localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));
  };
  const handleBarClick = (dataKey, redirectData) => {
  
    //window.open(`/my-reports/all`, "_blank");
    //handleRedirectSetFilter("all", "updated", dateRangeValue, redirectData);
  };
  const isMobile = window.innerWidth <= 480;

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const getAllFilter = async () => {
    
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          const filterList = response.data.data.filterlist;
          setAllApiFilter(filterList);
          setCategoryDataOptions([
            ...JSON.parse(filterList.categoryDataOptions),
          ]);
          
          if (!checkAnyCheckedTrue(categoryCheckedItems)) {
            
            setCategoryCheckedItems([
            ...JSON.parse(filterList.categoryDataOptions),
            ]);
          }
          setTeamsData([...JSON.parse(filterList.teamsData)]);
         
           if(!checkAnyCheckedTrue(checkedTeamItems)) {
            setCheckedTeamItems([
              ...JSON.parse(filterList.teamsData),
            ]);
          }
          setSourceDataOptions([...JSON.parse(filterList.leadSourceOptions)]);
          setCenterOptions([...JSON.parse(filterList.LocationData)]);
          setLeadVerifiedOptions([...JSON.parse(filterList.verified_status)]);
          setUserTypeOptions([...JSON.parse(filterList.user_type)]);
          setCourseOptions([
            ...JSON.parse(response.data.data.filterlist.courseListOptions),
          ]);
          setTabs([...JSON.parse(filterList.leaddashboardtab)]);
          setFilterApiStatus(true);
         
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  useEffect(() => {
    if (checkAnyCheckedTrue(categoryCheckedItems)){
      //alert("1");
      //getCourseList();
      //setCourse([]);
    }
  }, [categoryCheckedItems]);
 

  const getCourseList = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getcourselist`,
      headers: { "Auth-Id": user.auth_id },
      data: { coursecategory: categoryCheckedItems },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setCourseOptions([...response.data.data.data]);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const getDataRecord = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=gettabrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        setAllTabRecord({...response.data.data.data});
        setAllTabRecordApiStatus(true);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  const getSubCategoryRecordDataRecord = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getsubCategoryRecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
        allTabRecord[response.data.data.activeTab]['categories'] = response.data.data.data;
        setAllTabRecord({...allTabRecord});
        getDataRecord2();
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  const getDataRecord2 = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=gettabrecordfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
        allTabRecord[response.data.data.activeTab]['categories'][response.data.data.activeCategory]['breakdown'] = response.data.data.data;
        setAllTabRecord({...allTabRecord});
        
          setLeadSummaryData(response.data.data.lead_summary)
        
        getDataRecordleadStatus();
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  const getDataRecordleadStatus = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getleadstatusdata`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
        setCardData(response.data.data.data);
        // allTabRecord[response.data.data.activeTab]['categories'][response.data.data.activeCategory]['breakdown'] = response.data.data.data;
        // setAllTabRecord({...allTabRecord});
        getDataRecordleadStatusFilterGraph();
        getDataRecordwhatsfollowupGraph();
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };
  useEffect(()=>{
    getDataRecordleadStatusFilterGraph();

  },[selectedCardData,selectedTab])
  useEffect(()=>{
    getDataRecordwhatsfollowupGraph();
  },[]);
  useEffect(()=>{
    //getLeadSummeryData();
  },[leadSummaryFilter,listFilter]);
  function sortByDateV(data, order = 'asc') {
    const parseDate = (dateStr) => {
      // Convert from "05 Apr 2025" to a Date object
      const [day, monthStr, year] = dateStr.split(' ');
      const monthMap = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      return new Date(year, monthMap[monthStr], day);
    };
  
    const sortedData = [...data].sort((a, b) => {
      const dateA = parseDate(a.name);
      const dateB = parseDate(b.name);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
    return sortedData.map(item => {
      const dateObj = parseDate(item.name);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = dateObj.toLocaleString('default', { month: 'short' });
  
      return {
        ...item,
        date: `${day} ${month}`
      };
    });
  }
  
  function sortByDate(data, order = 'asc') {
    if (!Array.isArray(data)) {
      console.error('sortByDate error: "data" must be an array.');
      return [];
    }
  
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
    return sortedData.map(item => {
      const dateObj = new Date(item.date);
      const day = String(dateObj.getDate()).padStart(2, '0'); 
      const month = dateObj.toLocaleString('default', { month: 'short' }); 
      
      return {
        ...item,
        date: `${day} ${month}`
      };
    });
  }
  
  
  
  
 
  const getDataRecordleadStatusFilterGraph = async () =>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getleadstatusdatafilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter, selectedCardData:selectedCardData,selectedTab:selectedTab},
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
        if(selectedTab=='source'){
          setLeadSourceData(response.data.data.data);
        }else if(selectedTab=='category'){
          setCategoryData(response.data.data.data);
        }else if(selectedTab=='location'){
          setLocationData(response.data.data.data);
        }else if(selectedTab=='verified'){
          setDataverify(response.data.data.data);
        }else if(selectedTab=='usertype'){
          setUserTypeData(response.data.data.data);
        }
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const getDataRecordwhatsfollowupGraph = async () =>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getwhatsappfollowup`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter},
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
        setWhatsAppData(response.data.data.data);
        setFollowupData(response.data.data.followup);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const applyBreakdown = (data, keys, responseData) => {
    if (!keys || keys.length === 0) return data;
   
    const updatedData = data.map(item => {
      if (item.name === keys[0] || item.source === keys[0]) {
        
        if (keys.length === 1) {
          return {
            ...item,
            breakdown: responseData || []
          };
        } else {
          return {
            ...item,
            breakdown: applyBreakdown(item.breakdown || [], keys.slice(1), responseData)
          };
        }
      }
      return item;
    });
  
    return updatedData;
  };
  
  const getTraverserNextlevele = async (object_data,record) =>{
    
    axios({
      method: "post",
      url: `${constant.base_url}/admin/lead_dashboard.php?fun=getnextlevelrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter,object_data:object_data,selectedCardData:selectedCardData,selectedTab:selectedTab,record:record},
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
          if(selectedTab=='source'){
            var updatedData = applyBreakdown(leadSourceData,record,response.data.data.data);
            setLeadSourceData(updatedData);
          }else if(selectedTab=='category'){
            var updatedData = applyBreakdown(categoryData,record,response.data.data.data);
            setCategoryData(updatedData);
          }else if(selectedTab=='location'){
            var updatedData = applyBreakdown(locationData,record,response.data.data.data);
            setLocationData(updatedData);
          }else if(selectedTab=='usertype'){
            var updatedData = applyBreakdown(userTypeData,record,response.data.data.data);
            setUserTypeData(updatedData);
          }
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    <div>
      <InnerHeader
        heading=""
        txtSubHeading="Analyze and manage leads to optimize follow-ups and conversions"
        showButton={false}
        iconText="Add New Lead"
        className
      />
      <div className="v-center jce fww mb8 mr8">
      <div className="dash-date df mr8 my-dash">

        <div
          className={`report-date mb8 v-center ${isSecondDateVisible ? "show-second-date" : "hide-second-date"}`}
        >
          <div
            className="date-range-input"
            onClick={toggleDateRangePicker}
            style={{
              cursor: "pointer",
              padding: "10px 18px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              color: "#7b7b7b",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaCalendarAlt size={16} color="#7b7b7b" />
            {`${format(dateRangeValue[0].startDate, "dd/MM/yyyy")} - ${format(
              dateRangeValue[0].endDate,
              "dd/MM/yyyy"
            )}`}
          </div>

          {showDateRangePicker && (
            <div ref={dateRangePickerRef}>
              <DateRangePicker
                onChange={(ranges) => {
                  const updatedRanges = dateRangeValue.map((range) => ({
                    ...range,
                    startDate:
                      range.key === "selection2" && !isSecondDateVisible
                        ? range.startDate
                        : ranges[range.key]?.startDate || range.startDate,
                    endDate:
                      range.key === "selection2" && !isSecondDateVisible
                        ? range.endDate
                        : ranges[range.key]?.endDate || range.endDate,
                  }));
                  setDateRangeValue(updatedRanges);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                maxDate={new Date()}
                ranges={
                  isSecondDateVisible ? dateRangeValue : [dateRangeValue[0]]
                }
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
        <div className="filter-icon-container pr mt12" onClick={handleFilterClick}>
                  <FaFilter className="cp fs18 ml8 fc5 df aic mr8" />
                  {showAppliedFilter && filterCount > 0 && (
                    <span className="notification-count pa br50 fc1 fw6">
                      {filterCount}
                    </span>
                  )}
        </div>        
      </div>
      <button type="button"
                className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 ml8 mb8 br24"
                onClick={applyFilter}
                > 
          Apply
        </button>
        </div>
      
      {showAppliedFilter && filterCount > 0 && (
        <div className="p12 bg5 brd1 mb12">
          <div className="fs14 ls1 mr4 df jcsb">
            <span className="fw6 v-center cp" onClick={toggleFilter}>
              <CiSquareChevDown className="mr4" />
              Filters Applied ({filterCount})
            </span>
            <span className="fc9 cp" onClick={clearFilter}>
              x Clear
            </span>
          </div>
          {!filterAppliedShow && (
            <div className="dash-chip-container mt8">
              {course.length > 0 && (
                <div className="v-center mt8">
                  <p className="fs14 ls1 mr4">Course:</p>
                  {course.map((courseValue) => {
                    const courseOption = courseOptions.find(
                      (option) => option.value === courseValue
                    );
                    return (
                      courseOption && (
                        <div className="dash-chip mr4" key={courseValue}>
                          {courseOption.label}
                         
                        </div>
                      )
                    );
                  })}
                </div>
              )}
              {center.length > 0 && (
                <div className="v-center mt8">
                  <p className="fs14 ls1 mr4">Location:</p>
                  {center.map((centerValue) => {
                    const centerOption = centerOptions.find(
                      (option) => option.value === centerValue
                    );
                    return (
                      centerOption && (
                        <div className="dash-chip mr4" key={centerValue}>
                          {centerOption.label}
                         
                        </div>
                      )
                    );
                  })}
                </div>
              )}
              {sourceData.value && (
                <div className="v-center mt8">
                  <p className="fs14 ls1 mr4 ">Source Type:</p>
                  <div className="dash-chip mr4">
                    {sourceData.label}
                   
                  </div>
                </div>
              )}
              {leadVerified.value && (
                <div className="v-center mt8">
                  <p className="fs14 ls1 mr4 ">Lead Verfied:</p>
                  <div className="dash-chip mr4">
                    {leadVerified.label}
                   
                  </div>
                </div>
              )}
              {userType.value && (
                <div className="v-center mt8">
                  <p className="fs14 ls1 mr4 ">User Type:</p>
                  <div className="dash-chip mr4">
                    {userType.label}
                   
                  </div>
                </div>
              )}
              {checkedTeamItems.some(
                (item) =>
                  item.checked || item.children?.some((child) => child.checked)
              ) && <p className="team-heading mr4 mt8">Team:</p>}

              {checkedTeamItems
                .reduce((acc, item) => {
                  if (item.checked) acc.push(item);
                  if (item.children) {
                    acc.push(...item.children.filter((child) => child.checked));
                  }
                  return acc;
                }, [])
                .map((item) => (
                  <div key={item.value} className="dash-chip mr4 mt8">
                    {item.label}
                    
                  </div>
                ))}
              {categoryCheckedItems.some(
                (item) =>
                  item.checked || item.children?.some((child) => child.checked)
              ) && <p className="team-heading mr4 mt8">Category:</p>}

              {categoryCheckedItems
                .reduce((acc, item) => {
                  if (item.checked) acc.push(item);
                  if (item.children) {
                    acc.push(...item.children.filter((child) => child.checked));
                  }
                  return acc;
                }, [])
                .map((item) => (
                  <div key={item.value} className="dash-chip mr4 mt8">
                    {item.label}
                   
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      <div className="dashboard-container">
        {/* <NestedTabs /> */}
        {allTabRecordApiStatus && <NestTab dateRangeValue={dateRangeValue} leadVerified={leadVerified} isSecondDateVisible={isSecondDateVisible} allTabRecord={allTabRecord} listFilter={listFilter} setListFilter={setListFilter} activeTab={activeTab} setActiveTab={setActiveTab} activeCategory={activeCategory} setActiveCategory={setActiveCategory} activeSubCategory={activeSubCategory} setActiveSubCategory={setActiveSubCategory} applyFilter={applyFilter} activeTabVal={activeTabVal} activeCategoryVal={activeCategoryVal}  activeSubCategoryVal={activeSubCategoryVal}  setActiveTabVal={setActiveTabVal} setActiveCategoryVal={setActiveCategoryVal} setActiveSubCategoryVal={setActiveSubCategoryVal} teamsData={teamsData} setTeamsData={setTeamsData} categoryCheckedItems={categoryCheckedItems} setCategoryCheckedItems={setCategoryCheckedItems}/>}

        <div className="row charts sales-sum">
          <div className="chart ld-sum">
            <div className="v-center jcsb">
              <h3 className="dash-head ls1 fw6 sales-sum-head">Lead Summary </h3>
              {/* <div className="lead-summary-data mr12">
                <SingleDropdown
                  options={leadSummaryFilterOptions}
                  selectedOption={leadSummaryFilter}
                  onSelect={handleLeadSummaryFilterSelect}
                  placeholder="Select"
                  noLabel
                />
              </div> */}
            </div>

            <div
              className="chart-placeholder "
              style={{ width: "100%", height: isMobile ? "60%" : "100%" }}
            >
             
             {activeTab!='Team' && <ResponsiveContainer width="100%" height={400}>
              
                <AreaChart
                  data={sortByDate(leadSummaryData,'desc')}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    {allKeys.map((key, index) => (
                      <linearGradientf
                        key={key}
                        id={`color${key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={colorsLead[index % colorsLead.length]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={colorsLead[index % colorsLead.length]}
                          stopOpacity={0}
                        />
                      </linearGradientf>
                    ))}
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: isMobile ? 11 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 11 : 12 }} />
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="0 0" />
                  <Tooltip contentStyle={{ fontSize: "14px" }} />
                  <Legend
                    onClick={(e) => toggleKey(e.value)}
                    payload={allKeys.map((key, index) => ({
                      id: key,
                      value: key,
                      type: "square",
                      color: colorsLead[index % colorsLead.length],
                      inactive: !visibleKeys.includes(key),
                    }))}
                    wrapperStyle={{ bottom: -3, fontSize: 13 }}
                  />
                  {allKeys.map(
                    (key, index) =>
                      visibleKeys.includes(key) && (
                        <Area
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={colorsLead[index % colorsLead.length]}
                          fillOpacity={0.4}
                          fill={colorsLead[index % colorsLead.length]}
                        />
                      )
                  )}
                </AreaChart>
              </ResponsiveContainer>}
            </div>
          </div>
        </div>
        <div className="bg8 box-sd2 p12 mt16">
          <div className="ld-status mt16">
            <div className="v-center">
              <p className="fs16 ls1 fw6 mr8">Lead Status</p>
              <span className="fs14 ls1 fc5">as per last tagged</span>
            </div>
            <div className="ld-slider-container">
              <button
                className="ld-slide-btn ld-slide-left box-center"
                onClick={slideLeft}
                disabled={!canScrollLeft}
              >
                <FaChevronLeft className="fs14" />
              </button>
              <div className="ld-slider" ref={sliderRef}>
                
                {cardData.length &&  cardData.map((card, index) => (
                  <div
                    className={`ld-card pr ${selectedCard === index ? "bg6" : "bg5"}`}
                    key={index}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="p8">
                      <h3>{card.title}</h3>
                      <p className="ld-value box-center">
                        {card.value?formatter.format(card.value):0}
                        {card.percentage>0 && (
                          <span
                            className={`ml8 ld-percentage ld-negative v-center`}
                          >
                            {card.percentage}
                          </span>
                        )}
                      </p>
                    </div>

                    {card.breakdown.length > 0 && (
                      <div className="progress-container">
                        {card.breakdown.map((item, index) => (
                          <div
                            key={index}
                            className="progress-segment"
                            style={{
                              width: `${item.progress}%`,
                              backgroundColor: item.color,
                              letterSpacing: "0.4px",
                            }}
                            data-tooltip={`${item.name}: ${item.count}\nPercentage: ${item.progress}%`}
                            // onClick={() => handleSegmentClick(item)}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="ld-slide-btn ld-slide-right box-center"
                onClick={slideRight}
                disabled={!canScrollRight}
              >
                <FaChevronRight className="fs14" />
              </button>
            </div>
            {/*  */}
          </div>
          <div className="ld-tags">
            <Tabs
              tabs={tabs}
              showCheckboxes={false}
              showFilter={false}
              onTabChange={handleTabChange}
              selectedTab={selectedTab}
              nextActiveTab={"1"}
            />
            <div
              className={`row charts ver ld-st-gr bg5 pie-chart-wrap ${isSecondDateVisible && "compare-date"}`}
            >
              {leadSourceData.length>0 && selectedTab === "source" && (
                <ReusablePieChart
                  data={leadSourceData}
                  dateRangeValue={dateRangeValue}
                  title={"Lead Source"}
                  dataKey="value"
                  nameKey="name"
                  colors={colors}
                  height={280}
                  legendPosition="right"
                  isSecondDateVisible={isSecondDateVisible}
                  getTraverserNextlevele={getTraverserNextlevele}
                  listFilter={listFilter}
		  selectedCard={selectedCard}
                />
              )}
              {categoryData.length>0 && selectedTab === "category" && (
                <ReusablePieChart
                  data={categoryData}
                  title={"Lead Category"}
                  dataKey="value"
                  nameKey="name"
                  colors={colors}
                  height={280}
                  legendPosition="right"
                  getTraverserNextlevele={getTraverserNextlevele}
                  dateRangeValue={dateRangeValue}
                  listFilter={listFilter}
		  selectedCard={selectedCard}
                />
              )}
              {locationData.length>0 && selectedTab === "location" && (
                <ReusablePieChart
                  data={locationData}
                  title={"Lead Location"}
                  dataKey="value"
                  nameKey="name"
                  colors={colors}
                  height={280}
                  legendPosition="right"
                  dateRangeValue={dateRangeValue}
                  getTraverserNextlevele={getTraverserNextlevele}
                  listFilter={listFilter}
		  selectedCard={selectedCard}
                />
              )}
              {userTypeData.length>0 && selectedTab === "usertype" && (
                <ReusablePieChart
                  data={userTypeData}
                  title={"User Type"}
                  dataKey="value"
                  nameKey="name"
                  colors={colors}
                  height={280}
                  legendPosition="right"
                  dateRangeValue={dateRangeValue}
                  getTraverserNextlevele={getTraverserNextlevele}
                  listFilter={listFilter}
		  selectedCard={selectedCard}
                />
              )}
              {dataverify.length>0 && selectedTab === "verified" && (
                <>
                  <p className="dash-head ls1 fw6 p12">Lead Verified</p>
                  <BarChartComponent
                    data={dataverify}
                    bars={bars}
                    dimensions={{ width: 800, height: 400 }}
                    margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                    className="bg5"
                    onBarClick={handleBarClick}
                    
                  />
                </>
              )}
              {/* <span className="v-center">Vs</span> */}
              {isSecondDateVisible && (
                <ReusablePieChart
                  data={LeadStatusData}
                  dateRangeValue={dateRangeValue}
                  title=""
                  dataKey="value"
                  nameKey="name"
                  colors={colors}
                  height={280}
                  legendPosition="right"
                  isSecondDateVisible
                  listFilter={listFilter}
		  selectedCard={selectedCard}
                />
              )}
            </div>
          </div>
        </div>
        <div className="row charts mt16 ver pie-chart-wrap">
        {followupData.length>0 && <ReusablePieChart
            data={followupData}
            
            title="Follow-up"
            dataKey="value"
            nameKey="name"
            colors={colors}
            height={280}
            legendPosition="right"
            dateRangeValue={dateRangeValue}
            getTraverserNextlevele={getTraverserNextlevele}
            listFilter={listFilter}
          />}
          {whatsAppData.length>0 && <ReusablePieChart
            data={whatsAppData}
            dateRangeValue={dateRangeValue}
            title="WhatsApp Leads"
            dataKey="value"
            nameKey="name"
            colors={colors}
            height={280}
            legendPosition="right"
            getTraverserNextlevele={getTraverserNextlevele}
            listFilter={listFilter}
          />}
        </div>
      </div>
      {showFilterPopup && (
        <SidePopup show={showFilterPopup} onClose={closeMoreFilter}>
          <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
            <p className="fs18 fc1 ">Filters</p>
            <button className="lead-close-button" onClick={closeMoreFilter}>
              X
            </button>
          </div>
          <div className="filter-lists pl16 pt16 pr16">
            <div className="filter">
              <div className="ct-f service-status-filter mr8 searching-drop mb16">
                <div className="ct-f team-filter searching-drop mb16">
                  <p className="fc15 fw6 fs14 ls1 mb8">Select Team</p>
                  <MultiLevelDropdown
                    placeholder="Select Team"
                    data={teamsData}
                    checkedItems={checkedTeamItems}
                    setCheckedItems={setCheckedTeamItems}
                    updateFilterCount={updateFilterCount}
                  />
                </div>
                <div className="service-status-filter searching-drop mb8 mt16">
                  <p className="fc15 fw6 fs14 ls1 mb8">Source Type</p>
                  <Dropdown
                    label="Source Type"
                    options={sourceDataOptions}
                    selectedValue={sourceData}
                    onValueChange={handleSourceData}
                  />
                </div>
              </div>
              <div className="ct-f service-status-filter mr8 searching-drop mb16">
                <p className="fc15 fw6 fs14 ls1 mb8">Select Category</p>
                <MultiLevelDropdown
                  placeholder="Category"
                  data={categoryDataOptions}
                  checkedItems={categoryCheckedItems}
                  setCheckedItems={setCategoryCheckedItems}
                  updateFilterCount={updateFilterCount}
                />
              </div>
              <div className="service-status-filter mr8 searching-drop mb16">
                <p className="fc15 fw6 fs14 ls1 mb8">Select Course</p>
                <MultiDropdown
                  label="Course"
                  options={courseOptions}
                  selectedValues={course}
                  onSelect={handleCourseChange}
                  chips={3}
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
                <p className="fc15 fw6 fs14 ls1 mb8">Verified</p>
                <Dropdown
                  label="Verified"
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
                onClick={applyFilter}
              >
                Apply
              </button>
              <button
                className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                onClick={clearFilter}
              >
                Clear
              </button>
            </div>
          </div>
        </SidePopup>
      )}
    </div>
  );
};

export default LeadDashboard;
