import React, { useState, useRef, useEffect } from "react";
import InnerHeader from "../../components/InnerHeader";
import "./Dashboard.css";
import Card from "../../components/Card";
import ProgressBar from "../../components/ProgressBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
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
import { FaCalendarAlt, FaFilter, FaRupeeSign } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
//  import salesData from "../../data/Dashboard/SalesData";
// import sourcePieData from "../../data/Dashboard/CardData";
// import okkkk from "../../data/Dashboard/CategoryData";
// import dataLine from "../../data/Dashboard/DataLine";

import colors from "../../data/Dashboard/Colors";
import ReusablePieChart from "../../components/Dashboard/ReusablePieChart";
import SalesNestTab from "../../components/Dashboard/SalesNestesTab";

import constant from "../../constant/constant.js";
import SidePopup from "../../components/Popup/SidePopup.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import Dropdown from "../../components/Dropdown.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import { formatAmount } from "../../helpers/formatAmount.js";
import { CiSquareChevDown } from "react-icons/ci";
const SalesDashboard = () => {

  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [isSecondDateVisible, setSecondDateVisible] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(), 
      key: "selection1",
    },
    {
      startDate: subMonths(new Date(), 1),
      endDate: subMonths(new Date(), 2),
      key: "selection2",
    },
  ]);


  
  const [selectedTab, setSelectedTab] = useState("source");
  const { id } = useParams();
  const [tabs, setTabs] = useState([]);
  const [dateTimeType, setDateTimeType] = useState("");

  const dateRangePickerRef = useRef(null);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [listFilter, setListFilter] = useState({});

 
  const [allApiFilter, setAllApiFilter] = useState([]);
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


  const [salesData,setSalesData]=useState({});
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterAppliedShow, setFilterAppliedShow] = useState(true);
  const [showAppliedFilter, setShowAppliedFilter] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [compare,setCompare] = useState(false);
  
  const [categoryData, setCategoryData] = useState([]);
  const [sourcePieData, setSourcePieData] = useState([]);
  const [dataLine, setDataLine] = useState([]);
  
  

  const [categoryDataOptions, setCategoryDataOptions] = useState([]);
  const [categoryCheckedItems, setCategoryCheckedItems] =
      useState([]);
  const [sourceDataOptions, setSourceDataOptions] = useState([]);
  const [sourceData, setSourceData] = useState({
      label: " Select Source Type",
      value: "",
    });

    const [centerOptions, setCenterOptions] = useState([]);
    const [center, setCenter] = useState([]);
    const [courseListOptions, setCourseListOption] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState([]);
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
      value: "",
      label: "Select",
    });
  
    const leadSummaryFilterOptions = [
      { value: "", label: "All" },
      { value: "worked", label: "Worked" },
      { value: "new", label: "New" },
    ];

    const [allApidata, setAllApiData] = useState([]);
  
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
        (selectedCourse.length > 0 ? 1 : 0) +
        (center.length > 0 ? 1 : 0) +
        // (checkedTeamItems.length > 0 ? 1 : 0) +
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

     useEffect(() => {
        updateFilterCount();
    }, [leadVerified, userType, sourceData, center, selectedCourse, checkedTeamItems]);

    const handleSourceData = (value) => {
      setSourceData(value);
    };

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
      const index = selectedCourse.indexOf(value);
      if (index === -1) {
        setSelectedCourse([...selectedCourse, value]);
      } else {
        const updatedValues = [...selectedCourse];
        updatedValues.splice(index, 1);
        setSelectedCourse(updatedValues);
      }
    };

    const handleLeadVerifiedChange = (value) => {
      setLeadVerified(value);
    };
    const handleUserType = (value) => {
      setUserType(value);
    };
   
    

   const cardData = [
    { title: "Total OS", key: "totalOutstanding" },
    { title: "Overall Sales", key: "overallSales" },
    { title: "Collection", key: "totalCollection" },
    { title: "Scholarship", key: "scholarship" },
    { title: "Approval Pending", key: "approvalPending" },
    { title: "Pending Amt.", key: "pendingAmount" },
  ];

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
    setCompare((prevState) => !prevState);
    setSecondDateVisible((prevState) => !prevState);
    setShowDateRangePicker(true);
  };
  // const customToggleOption = {
  //   label: "Compare",
  //   range: () => ({
  //     startDate: startOfMonth(subMonths(new Date(), 1)),
  //     endDate: endOfMonth(subMonths(new Date(), 1)),
  //   }),
  //   isSelected: (range) => false,
  // };

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
  var oldFilterRedirect = {};
  const handleRedirectSetFilter = (
    pageTab,
    pageType,
    dateOption,
    status_type,
    dateRangeValue,
    amountType,
    filterStatus,
  ) => {
  
  const updatedDate = dateRangeValue
  .slice(0, 1)
  .map(item => ({
    ...item,
    key: "selection" 
  }));

    let updatefilter = {
      page_type: pageType,
      searchtext: "",
      listStatusOptions: [],
      serviceStatus: "",
      leadSource: filterStatus ==="no"?[]:listFilter.sourceData,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      dateRangeValuefilter: updatedDate,
      paymentType: "",
      paymentMode: [],
      teamSearch: [],
      workOrderStatus: status_type,
      paymentStatus: status_type,
      dateOption: dateOption,
      selectedTab: pageTab,
      categoryCheckedItems: filterStatus ==="no"?[]:listFilter.categoryCheckedItems,
      selectedCourses:filterStatus ==="no"?[]:listFilter.selectedCourses,
      teamSearch:filterStatus ==="no"?[]:listFilter.checkedTeamItems,
      amountType: filterStatus ==="no"?[]:amountType || [],
      leadVerified:filterStatus ==="no"?[]:listFilter.leadVerified,
      center:filterStatus ==="no"?[]:listFilter.center,
      sourceData:filterStatus ==="no"?[]:listFilter.sourceData,
      userType:filterStatus ==="no"?[]:listFilter.userType,
    };

    oldFilterRedirect[pageTab] = updatefilter;
    localStorage.setItem("allfilteroption", JSON.stringify(oldFilterRedirect));
  };

  const handleSegmentClick = (item) => {
    window.open(`/my-finance/${item.tab}`, "_blank");
    handleRedirectSetFilter(
      item.tab,
      item.page_type,
      item.date_type,
      item.status_type,
      dateRangeValue,
      item.amountType,
      item.filter
      
    );
  };

  const allKeys = [
    "Sales Amount",
    "Sales Count",
    "Collection Amount",
  ];

  const leftKeys = ["Sales Amount", "Collection Amount"];
  const rightKeys = ["Sales Count"];
  const colorsSales = ["#8884d8", "#82ca9d", "#FF6384", "#FFCE56", "#cccccc"];

  const [visibleKeys, setVisibleKeys] = useState([
    "Sales Amount",
    "Sales Count",
    "Collection Amount",
  ]);

  const toggleKey = (key) => {
    setVisibleKeys((prev) => {
      if (prev.length === 1 && prev.includes(key)) {
        return prev; // Prevent toggle if only one key is active
      }

      return prev.includes(key)
        ? prev.filter((k) => k !== key) // Remove key
        : [...prev, key]; // Add key
    });
  };

  const isMobile = window.innerWidth <= 480;


  const initial_obj = {
    page_type: "sales",
    tabName:id ? id : activeTabVal,
    activeCategory:activeCategoryVal,
    activeSubCategory:activeSubCategoryVal,
    categoryCheckedItems: "",
    selectedCourses:"",
    leadVerified:"",
    center:[],
    sourceData:"",
    userType:"",
    checkedTeamItems:"",
    compareValue:"",
 //   dateRangeValue:{
 //     startDate: new Date(),
 //     endDate: addDays(new Date(), 0),
 //     key: "selection",
 //   },
    dateRangeCompareValue:{
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
    dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy") || `${format(dateRangeValue[1].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[1].endDate, "dd-MM-yyyy")}`}`,
    dateRangeValuefilter: dateRangeValue,
    dateTimeType:"",
  }
  var oldFilter = {};
  const applyFilter = async () => {
      //setAllApiData([]);
      let updatefilter = {
        ...listFilter,
        page_type: "sales",
        activeTab:activeTabVal,
        activeCategory:activeCategoryVal,
        activeSubCategory:activeSubCategoryVal,
        dateOptionsselect:"",
        categoryCheckedItems: categoryCheckedItems,
        selectedCourses:selectedCourse,
        leadVerified:leadVerified,
        center:center,
        sourceData:sourceData,
        userType:userType,
        checkedTeamItems:checkedTeamItems,
        dateTimeType:dateTimeType,
        compareValue:compare,
        dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
       dateRangeCompareValue: dateRangeValue && dateRangeValue[1]
        ? `${format(dateRangeValue[1].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[1].endDate, "dd-MM-yyyy")}`
        : "No Date Selected",
        dateRangeValuefilter: dateRangeValue,
      };
      
      var getoldfilter = localStorage.getItem("salesdashboard");
      if (getoldfilter) {
        oldFilter = JSON.parse(getoldfilter);
      }
      oldFilter[activeTabVal] = updatefilter;
      localStorage.setItem("salesdashboard", JSON.stringify(oldFilter));
       setFilterApiStatus(false);
       setListFilter(updatefilter);
       updateFilterCount();
       setShowAppliedFilter(true);
       closeFilter(); 
      
    }


    const updateSetListingFilter = async () => {
      let updatefilter = {
        ...listFilter,
        ...initial_obj,
          page_type: "sales",
          activeTab:activeTabVal,
          activeCategory:activeCategoryVal,
          activeSubCategory:activeSubCategoryVal,
          };
     
      setListFilter({...updatefilter});
    }

      const clearFilter = () => {
        document.body.style.overflow = "auto";
        FilterAllStateClear();
        let getOldFilterclear = localStorage.getItem("salesdashboard");
    let oldFilterValclear = getOldFilterclear
      ? JSON.parse(getOldFilterclear)
      : {};
    let currentTabFilterValclear = oldFilterValclear[activeTabVal]
      ? { ...oldFilterValclear }
      : null;

    if(currentTabFilterValclear){
      delete currentTabFilterValclear[activeTabVal];
      localStorage.setItem(
        "salesdashboard",
        JSON.stringify(currentTabFilterValclear)
      );
    }
        getAllfilter();
        updateSetListingFilter();
        closeFilter();
      };

      const closeFilter = () => {
        setShowFilterPopup(false);
        document.body.style.overflow = "auto";
      };
    
      const FilterAllStateClear=()=>{
        setShowAppliedFilter(false);
        setCategoryCheckedItems(categoryDataOptions);
        setSelectedCourse([]);
        setLeadVerified({label : "Select Verified", value:""});
        setCenter([]);
        setSourceData([]);
        setCheckedTeamItems([...teamsData]);
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
        setAllApiData([]);

        // setDateRangeValue([
        //   {
        //     startDate: new Date(),
        //     endDate: addDays(new Date(), 0),
        //     key: "selection",
        //   },
        // ]);

        setFilterCount(0);
       setFilterApiStatus(false);
      }

    // useEffect(() => {
    //   if(filterApiStatus){
    //     getDataRecord2();
    //   }
    // }, [filterApiStatus,listFilter]);

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
        getAllfilter();
        getCategoryChartData();
      }
    },[listFilter]);
  
    useEffect(()=>{
        //FilterAllStateClear();
        setLocalStorage();
        applyFilter();
    },[activeTab,activeCategory,activeSubCategory]);
  
    useEffect(()=>{
      getDataRecord();
    },[listFilter]);

   
   
   
  
    const setLocalStorage = async () =>  {
      var getoldfilter = localStorage.getItem("salesdashboard");
	    localStorage.removeItem("leaddashboard");
      if (getoldfilter) {
        oldFilter = JSON.parse(getoldfilter);
        var currenttabfilter = oldFilter[activeTabVal] ? oldFilter[activeTabVal]:"";
        if (currenttabfilter) {
          setListFilter(currenttabfilter);
          if (currenttabfilter && currenttabfilter["checkedTeamItems"]) {
            setCheckedTeamItems(currenttabfilter["checkedTeamItems"]);
          }
  
        }else{
          updateSetListingFilter();
        }
      }else{
        updateSetListingFilter();
      }
    }
  

  useEffect(() => {
    getReportData();
    getAllfilter();
  }, [listFilter]);

  const getAllfilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/sales_dashboard.php?fun=getallfilter`,
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

          if (categoryCheckedItems.length == 0) {
            setCategoryCheckedItems([
              ...JSON.parse(filterList.categoryDataOptions),
            ]);
          }
          setCourseListOption([
            ...JSON.parse(filterList.courseListOptions)
          ]);
          setCenterOptions([
            ...JSON.parse(response.data.data.filterlist.LocationData),
          ]);

          setSourceDataOptions([
            ...JSON.parse(response.data.data.filterlist.leadSourceOptions),
          ]);
          
          setLeadVerifiedOptions([
            ...JSON.parse(response.data.data.filterlist.verified_status),
          ]);

          setUserTypeOptions([
            ...JSON.parse(response.data.data.filterlist.user_type),
          ]);

          setTeamsData([...JSON.parse(filterList.teamsData)]);
          if (checkedTeamItems.length <= 0) {
            setCheckedTeamItems([
              ...JSON.parse(filterList.teamsData),
            ]);
          }
          setTabs([...JSON.parse(filterList.leaddashboardtab)]);
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
    const handleFilterClick = () => {
      setShowFilterPopup(true);
    };
    const closeMoreFilter = () => {
      setShowFilterPopup(false);
      document.body.style.overflow = "auto";
    };


 

    const getReportData = async () => {
      setAutoLoader(true);
      setDisplayMsg("");
      axios({
        method: "post",
        url: `${constant.base_url}/admin/sales_dashboard.php?fun=getsalesreportdata`,
        headers: { "Auth-Id": user.auth_id },
        data: {  
          listFilter:listFilter,
        },
      })
        .then(function (response) {
          setSalesData([...response.data.data]);
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    };
    
  const getDataRecord = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/sales_dashboard.php?fun=gettabrecord`,
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
        url: `${constant.base_url}/admin/sales_dashboard.php?fun=getsubCategoryRecord`,
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
      url: `${constant.base_url}/admin/sales_dashboard.php?fun=gettabrecordfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status == "1") {
        allTabRecord[response.data.data.activeTab]['categories'][response.data.data.activeCategory]['breakdown'] = response.data.data.data;

        setAllTabRecord({...allTabRecord});
        
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };

  const getCategoryChartData = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/sales_dashboard.php?fun=getCategoryData`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      // if (response.data.data.status === 1) {
        // console.log(response.data.data.data);
       setCategoryData(response.data.data.data);
       getSourceChartData();
      // }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };

  
  const getSourceChartData = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/sales_dashboard.php?fun=getSourceChartData`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      // if (response.data.data.status === 1) {
        // console.log(response.data.data.data);
        setSourcePieData(response.data.data.data);
        getLineChartData();
      // }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };


  const getLineChartData = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/sales_dashboard.php?fun=getLineChartData`,
      headers: { "Auth-Id": user.auth_id },
      data: { listFilter: listFilter },
    })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === 1) {
        setDataLine(response.data.data.data);
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            fontSize: "13px",
            boxShadow: "0 0 6px rgba(0,0,0,0.15)",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          {payload.map((item, index) => {
            const isAmount =
              item.name.toLowerCase().includes("amount") &&
              typeof item.value === "number";
  
            return (
              <p
                key={index}
                style={{ margin: "4px 0", color: item.color, fontSize: "12px" }}
              >
                {item.name}:{" "}
                {isAmount ? (
                  <>
                    <span style={{ fontWeight: "bold" }}>₹</span>
                    {item.value.toLocaleString("en-IN")}
                  </>
                ) : (
                  item.value
                )}
              </p>
            );
          })}
        </div>
      );
    }
  
    return null;
  };

  function sortByDate(data, order = 'asc') {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
    return sortedData.map(item => {
      const dateObj = new Date(item.name);
      const day = String(dateObj.getDate()).padStart(2, '0'); // Add leading 0 if needed
      const month = dateObj.toLocaleString('default', { month: 'short' }); // e.g., "Apr"
      return {
        ...item,
        name: `${day} ${month}`
      };
    });
  }

  const toggleFilter = () => {
    setFilterAppliedShow(!filterAppliedShow);
  };

  return (
    <div>
      <InnerHeader
        heading=""
        txtSubHeading="Track revenue trends, transaction details, and sales performance"
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
                {selectedCourse.length > 0 && (
                  <div className="v-center mt8">
                    <p className="fs14 ls1 mr4">Course:</p>
                    {selectedCourse.map((courseValue) => {
                      const courseOption = courseListOptions.find(
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

      <div className="dashboard-container sales-dashboard">
        <div className="row cards mb16 sales-progress-bar">
          {Object.values(salesData).length > 0 && cardData.map((item, index) => (
            <div className={`card dbg${index + 1}`} key={index}>
              <div>
              <p className="fs16 mb8 mt8 ls1 dfc1 tp v-center">
              <DynamicTooltip 
                direction="right"
                text={Object.values(salesData[index])[0]?.short_name || 0}>
                  {item.title}
              </DynamicTooltip>
                <span
                  className="fs14 fc16 fw6 ls2 ml4 cp"
                  onClick={() =>
                    handleSegmentClick(
                      Object.values(salesData[index])[0]?.redirectData || {}
                    )
                  }
                >
                  ({Object.values(salesData[index])[0]?.count || 0})
                </span>
              </p>
              <p className=" fw6 mb8 ls1 v-center dfc1">
                <FaRupeeSign className="fs18" />
                

                <p
                  className="fs24 cp"
                  onClick={() =>
                    handleSegmentClick(
                      Object.values(salesData[index])[0]?.redirectData || {}
                    )
                  }
                >
              <DynamicTooltip 
                direction="bottom"
                text={"₹" +(Object.values(salesData[index])[0]?.amount || 0)}>
                  {Object.values(salesData[index])[0]?.display_amount || 0}
              </DynamicTooltip>
              </p>
               

                {Object.values(salesData[index])[0]?.compare_status === 1 && (
                  <div className="v-center">
                    {Object.values(salesData[index])[0]?.compare_percentage_status === 1 ? (
                      <ImArrowUp className="fs14 fc13 ml16" />
                    ) : (
                      <ImArrowDown className="fs14 fc9 ml16" />
                    )}

                    <p
                      className={`ls1 ml4 ${
                        Object.values(salesData[index])[0]?.compare_percentage_status === 1
                          ? "fs14 fc13"
                          : "fs14 fc9"
                      }`}

                      
                    >
                      ({Object.values(salesData[index])[0]?.compare_percentage || 0})
                    </p>
                  </div>
                )}


              </p>
              </div>
              <ProgressBar
                breakdown={Object.values(salesData[index])[0]?.breakdown || []}
                dateRangeValue={dateRangeValue}
                listFilter={listFilter}
              />
            </div>
          ))}
        </div>
     
        {allTabRecordApiStatus &&
        <SalesNestTab 
        dateRangeValue={dateRangeValue}
        leadVerified={leadVerified} 
        isSecondDateVisible={isSecondDateVisible}
        allTabRecord={allTabRecord} 
        listFilter={listFilter} 
        setListFilter={setListFilter}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        activeSubCategory={activeSubCategory} 
        setActiveSubCategory={setActiveSubCategory} 
        applyFilter={applyFilter}
        activeTabVal={activeTabVal}
        activeCategoryVal={activeCategoryVal} 
        activeSubCategoryVal={activeSubCategoryVal} 
        setActiveTabVal={setActiveTabVal}
        setActiveCategoryVal={setActiveCategoryVal} 
        setActiveSubCategoryVal={setActiveSubCategoryVal}/>}


        <div className="row charts ver pie-chart-wrap">
          {categoryData && typeof categoryData === 'object' && Object.keys(categoryData).length > 0 && (
            <ReusablePieChart
            data={categoryData}
            title="Category-wise Sales "
            dataKey="value"
            nameKey="name"
            colors={colors}
            height={280}
            rupees
            legendPosition="right"
            dateRangeValue={dateRangeValue}
            listFilter={listFilter} 
          />
          )}

          {sourcePieData && typeof sourcePieData === 'object' && Object.keys(sourcePieData).length > 0 && (
          <ReusablePieChart
            data={sourcePieData}
            title="Source-wise Sales "
            dataKey="value"
            nameKey="name"
            colors={colors}
            height={280}
            rupees
            legendPosition="right"
            dateRangeValue={dateRangeValue}
            listFilter={listFilter} 
          />
          )}
        </div>

        {dataLine && typeof dataLine === 'object' && Object.keys(dataLine).length > 0 && (
          <div className="row charts sales-sum">
            <div className="chart">
              <h3 className="dash-head ls1 fw6 mb16 sales-sum-head">
                Sales Summary{" "}
              </h3>
              <div
                className="chart-placeholder"
                style={{ width: "100%", height: isMobile ? "60%" : "100%" }}
              >
                <ResponsiveContainer width="100%" height={isMobile ? 240 : 400}>
                  <AreaChart
                    data={sortByDate(dataLine,"desc")}
                    margin={{
                      top: isMobile ? 2 : 5,
                      right: isMobile ? 10 : 30,
                      left: isMobile ? 10 : 20,
                      bottom: isMobile ? 2 : 5,
                    }}
                  >
                    <defs>
                      {allKeys.map((key, index) => (
                        <linearGradient
                          key={key}
                          id={`color${key}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              colorsSales[index] ||
                              colorsSales[colorsSales.length - 1]
                            }
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              colorsSales[index] ||
                              colorsSales[colorsSales.length - 1]
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="0 0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      label={{
                        value: "Amount",
                        angle: isMobile ? 360 : -90,
                        position: isMobile ? "insideTop" : "insideLeft",
                        dx: isMobile ? -2 : -10,
                        dy: 0,
                        style: {
                          textAnchor: "middle",
                          fontSize: isMobile ? 13 : 14,
                          letterSpacing: isMobile ? "0.5px" : "1px",
                        },
                      }}
                      tick={{ fontSize: isMobile ? 11 : 12 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{
                        value: "Count",
                        angle: isMobile ? 360 : 90,
                        position: isMobile ? "insideTop" : "insideLeft",
                        dx: isMobile ? -2 : -16, // Adjust horizontal position if needed
                        dy: isMobile ? -10 : -40,
                        style: {
                          textAnchor: "middle",
                          fontSize: isMobile ? 13 : 14,
                          letterSpacing: isMobile ? "0.5px" : "1px",
                        },
                      }}
                      tick={{ fontSize: isMobile ? 11 : 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: isMobile ? "12px" : "14px",
                        lineHeight: isMobile ? "16px" : "20px",
                      }}
                      content={<CustomTooltip/>}
                    />
                    <Legend
                      onClick={(e) => toggleKey(e.value)}
                      payload={allKeys.map((key, index) => ({
                        id: key,
                        value: key,
                        type: "square",
                        color:
                          colorsSales[index] ||
                          colorsSales[colorsSales.length - 1],
                        inactive: !visibleKeys.includes(key),
                      }))}
                      wrapperStyle={{ bottom: -3, fontSize: isMobile ? 11 : 13 }}
                    />
                    {allKeys.map(
                      (key, index) =>
                        visibleKeys.includes(key) && (
                          <Area
                            key={key}
                            yAxisId={leftKeys.includes(key) ? "left" : "right"}
                            type="monotone"
                            dataKey={key}
                            stroke={
                              colorsSales[index] ||
                              colorsSales[colorsSales.length - 1]
                            }
                            fillOpacity={0.2}
                            fill={
                              colorsSales[index] ||
                              colorsSales[colorsSales.length - 1]
                            }
                            wrapperStyle={{
                              bottom: -3,
                              fontSize: isMobile ? 11 : 13,
                            }}
                          />
                        )
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

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
                  options={courseListOptions}
                  selectedValues={selectedCourse}
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

export default SalesDashboard;
