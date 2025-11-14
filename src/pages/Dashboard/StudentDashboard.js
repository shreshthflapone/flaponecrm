import React, { useState, useRef, useEffect } from "react";
import InnerHeader from "../../components/InnerHeader";
import "./Dashboard.css";
import Card from "../../components/Card";
import ProgressBar from "../../components/StudentProgressBar";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
} from "recharts";
import axios from "axios";
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
import StudentData from "../../data/Dashboard/StudentData";
import data from "../../data/Dashboard/CardData";
import colors from "../../data/Dashboard/Colors";
import ReusablePieChart from "../../components/Dashboard/StudentReusablePieChart";
import FacultyAttendanceData from "../../data/Dashboard/FacultyAttendanceData";
import BatchesData from "../../data/Dashboard/BatchesData";
import { getColorByIndex } from "../../helpers/getColorByIndex";
import SidePopup from "../../components/Popup/SidePopup";
import MultiSelectDropdown from "../../components/SearchMultiSelectDropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown";
import MultiDropdown from "../../components/MultiDropdown";
import Dropdown from "../../components/Dropdown.js";
import { CiSquareChevDown } from "react-icons/ci";
import BatchesCompletedData from "../../data/Dashboard/BatchCompletedData";
import BatchesUpcomingData from "../../data/Dashboard/BatchUpcomingData";
import BatchesRunningData from "../../data/Dashboard/BatchRunningData";
import StudentNestTab from "../../components/Dashboard/StudentNestTab";
import constant from "../../constant/constant.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
const StudentDashboard = () => {

  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const checkUserLogin = (response) => {
        if (response.data.login.status === 0) {
          dispatch(logout());
          navigate("/login");
        }
      };
  const { id } = useParams();
  const [filterAppliedShow, setFilterAppliedShow] = useState(true);
  const [showAppliedFilter, setShowAppliedFilter] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [isSecondDateVisible, setSecondDateVisible] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState([
     {
      //  startDate: subDays(new Date(), 30),
       startDate: new Date(2023, 0, 1),
       endDate: new Date(), 
       key: "selection1",
     },
     {
       startDate: subMonths(new Date(), 1),
       endDate: subMonths(new Date(), 2),
       key: "selection2",
     },
   ]);
  const [dateTimeType, setDateTimeType] = useState("");
  const dateRangePickerRef = useRef(null);
  const cardData = [
    { title: "Certificate Pending", key: "certificatePending" },
    { title: "Coordinator Pending", key: "coordinatorPending" },
    { title: "Incomplete Profile", key: "inCompleteProfile" },
    { title: "Document Pending", key: "documentPending" },
    { title: "Batch Not Allotted",key: "batchAllotPending" },
    { title: "Fee Pending", key: "feePending" },
    { title: "Rating", key: "rating" },
    { title: "Feedback", key: "feedback" },
    {title: "Upcoming Batches", key: "batchUpcoming"}
  ];

  const allKeys = [
    "New",
    "Batch Alloted",
    "Batch Running",
    "Batch Completed",
    "Course Completed",
  ];
  const [visibleKeys, setVisibleKeys] = useState([
    "New",
    "Batch Alloted",
    "Batch Running",
  ]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [listFilter, setListFilter] = useState({});
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [courseListOptions, setCourseListOption] = useState([]);
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [allTabRecord, setAllTabRecord] = useState({});
  const [allTabRecordApiStatus, setAllTabRecordApiStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [activeTabVal, setActiveTabVal] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [activeCategoryVal, setActiveCategoryVal] = useState("all");
  const [activeSubCategoryVal, setActiveSubCategoryVal] = useState("all");
  const [allApidata, setAllApiData] = useState([]);
      const [userType, setUserType] = useState({
        label: "Select User Type",
        value: "",
      });

  const [categoryDataOptions, setCategoryDataOptions] = useState([]);
  const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
  const [centerOptions, setCenterOptions] = useState([]);
  const [center, setCenter] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [location, setLocation] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [checkedTeamItems, setCheckedTeamItems] = useState([]);
  const [sourceDataOptions, setSourceDataOptions] = useState([]);
  const [sourceData, setSourceData] = useState({
        label: " Select Source Type",
        value: "",
      });
  
  const[studentCategoryData,setStudentCategoryData] = useState([]);
  const [dataLine,setDataLine] = useState([]);
  const[studentAttendence,setStudentAttendence] = useState([]);

  const[progressReportData,setProgressReportData] = useState({});
  const[clearSignal, setClearSignal] = useState(false);
      const handleSourceData = (value) => {
        setSourceData(value);
      };
     
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
  const [course, setCourse] = useState([]);
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

  const handleLocationChange = (selectedOptions) => {
    setLocation(selectedOptions);
  };

 

  const handleUserType = (value) => {
    setUserType(value);
  };

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
        startDate: new Date(2023, 0, 1),
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
  // const customToggleOption = {
  //   label: "Compare",
  //   range: () => ({
  //     startDate: new Date(),
  //     endDate: new Date(),
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
  var oldFilter = {};
  const handleRedirectSetFilter = (
    pageTab,
    dateOption,
    status_type,
    dateRangeValue
  ) => {
    let updatefilter = {
      page_type: pageTab,
      searchtext: "",
      searchByOptions: "",
      listStatusOptions: [],
      serviceStatus: "",
      leadSource: "",
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      dateRangeValuefilter: dateRangeValue,
      paymentType: "",
      paymentMode: [],
      teamSearch: [],
      workOrderStatus: status_type,
      paymentStatus: status_type,
      dateOption: dateOption,
      selectedTab: pageTab,
      categoryCheckedItems: [],
    };

    oldFilter[pageTab] = updatefilter;
    localStorage.setItem("allfilterstudent", JSON.stringify(oldFilter));
  };

  const handleSegmentClick = (item) => {
    //console.log(item);
    window.open(`/my-finance/${item.tab}`, "_blank");
    handleRedirectSetFilter(
      item.tab,
      item.date_type,
      item.status_type,
      dateRangeValue
    );
  };


  const initial_obj = {
      page_type: "student",
      tabName:id ? id : activeTabVal,
      activeCategory:activeCategoryVal,
      activeSubCategory:activeSubCategoryVal,
      categoryCheckedItems: "",
      selectedCourses:"",
      center:center,
      location:location,
      sourceData:"",
      userType:"",
      checkedTeamItems:"",
      compareValue:"",
      dateRangeCompareValue:{
        startDate: new Date(),
        endDate: addDays(new Date(), 0),
        key: "selection",
      },
      dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy") || `${format(dateRangeValue[1].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[1].endDate, "dd-MM-yyyy")}`}`,
      dateRangeValuefilter: dateRangeValue,
      dateTimeType:"",
    }


  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };
  const closeMoreFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  const toggleFilter = () => {
    setFilterAppliedShow(!filterAppliedShow);
  };
  
  

  const updateFilterCount = () => {
    const count =
      (course.length > 0 ? 1 : 0) +
      (center.length > 0 ? 1 : 0) +
      (location.length > 0 ? 1 : 0) +
      (checkAnyCheckedTrue(checkedTeamItems) ? 1 : 0) +
      (checkAnyCheckedTrue(categoryCheckedItems) ? 1 : 0)+
      (sourceData.value.trim() !== "" ? 1 : 0)+
      (userType.value.trim() !== "" ? 1 : 0);
   
    setFilterCount(count);
    if (count === 0) {
      setShowAppliedFilter(false);
    }
  };

  // useEffect(() => {
  //   updateFilterCount();
  // }, [center, course, categoryCheckedItems]);

   useEffect(() => {
        updateFilterCount();
    }, [userType, sourceData, center, course, checkedTeamItems]);

  const toggleKey = (key) => {
    console.log(key);
    setVisibleKeys(
      (prev) =>
        prev.includes(key)
          ? prev.filter((k) => k !== key) // Remove key if it's already visible
          : [...prev, key] // Add key if it's not visible
    );
  };
  // MutationObserver to monitor changes in the DOM
  useEffect(() => {
    // Function to start observing the input elements
    const startObserver = () => {
      const observer = new MutationObserver(() => {
        // Check if input exists inside the specified class
        const inputs = document.querySelectorAll(
          ".rdrDateInput.rdrDateDisplayItem input"
        );
        if (inputs.length > 0) {
          // Attach click event listener to each input
          inputs.forEach((input) => {
            input.addEventListener("click", handleInputClick);
          });
          observer.disconnect(); // Stop observing once inputs are found
        }
      });

      // Observe changes in the DOM
      observer.observe(document.body, { childList: true, subtree: true });

      // Initial check to see if inputs are already in the DOM
      const initialInputs = document.querySelectorAll(
        ".rdrDateInput.rdrDateDisplayItem input"
      );
      if (initialInputs.length > 0) {
        initialInputs.forEach((input) => {
          input.addEventListener("click", handleInputClick);
        });
        observer.disconnect(); // Disconnect observer once initial inputs are found
      }

      // Cleanup on component unmount
      return () => {
        observer.disconnect(); // Cleanup observer
        initialInputs.forEach((input) => {
          input.removeEventListener("click", handleInputClick);
        });
      };
    };

    // Start observing
    const cleanupObserver = startObserver();

    // Cleanup observer on component unmount
    return () => {
      cleanupObserver();
    };
  }, []); // This useEffect will run only once after the initial render

  const handleInputClick = (event) => {
    console.log("Clicked date:", event.target.value);
  };
  const isMobile = window.innerWidth <= 480;

 // const applyFilter = () => {
    //   setShowFilterPopup(false);
    //   document.body.style.overflow = "auto";
    //   updateFilterCount();
    //   setShowAppliedFilter(true);
    // };
  
  var oldFilter = {};
  const applyFilter = async () => {
      //setAllApiData([]);
      let updatefilter = {
        ...listFilter,
        page_type: "student",
        activeTab:activeTabVal,
        activeCategory:activeCategoryVal,
        activeSubCategory:activeSubCategoryVal,
        dateOptionsselect:"",
        categoryCheckedItems: categoryCheckedItems,
        selectedCourses:course,
        center:center,
        sourceData:sourceData,
        userType:userType,
        checkedTeamItems:checkedTeamItems,
        dateTimeType:dateTimeType,
        location:location,
        dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
       dateRangeCompareValue: dateRangeValue && dateRangeValue[1]
        ? `${format(dateRangeValue[1].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[1].endDate, "dd-MM-yyyy")}`
        : "No Date Selected",
        dateRangeValuefilter: dateRangeValue,
      };
      
      var getoldfilter = localStorage.getItem("studentdashboard");
      if (getoldfilter) {
        oldFilter = JSON.parse(getoldfilter);
      }
      oldFilter[activeTabVal] = updatefilter;
      localStorage.setItem("studentdashboard", JSON.stringify(oldFilter));
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
          page_type: "student",
          activeTab:activeTabVal,
          activeCategory:activeCategoryVal,
          activeSubCategory:activeSubCategoryVal,
          };
     
      setListFilter({...updatefilter});
    }

   

      const clearFilter = () => {
        document.body.style.overflow = "auto";
        FilterAllStateClear();
        let getOldFilterclear = localStorage.getItem("studentdashboard");
    let oldFilterValclear = getOldFilterclear
      ? JSON.parse(getOldFilterclear)
      : {};
    let currentTabFilterValclear = oldFilterValclear[activeTabVal]
      ? { ...oldFilterValclear }
      : null;

    if(currentTabFilterValclear){
      delete currentTabFilterValclear[activeTabVal];
      localStorage.setItem(
        "studentdashboard",
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
        setCourse([]);
        setCenter([]);
        setLocation([]);
        setSourceData([]);
        setCheckedTeamItems([...teamsData]);
        setUserType({
          label: "Select User Type",
          value: "",
        });
        setSourceData({
          label: "Source Type",
          value: "",
        });
        
        
        setAllApiData([]);
        setFilterCount(0);
       setFilterApiStatus(false);
      }

   

    const setLocalStorage = async () =>  {
      var getoldfilter = localStorage.getItem("studentdashboard");
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
      if(filterApiStatus){
        if(listFilter.activeTab!=''){
        getSubCategoryRecordDataRecord();
        }
      }
    }, [filterApiStatus]);

    useEffect(()=>{
      if(listFilter.activeTab==activeTabVal){
        getAllfilter();
        getCategoryChartData();
      }
    },[listFilter]);
  
    useEffect(()=>{
        // FilterAllStateClear();
        setLocalStorage();
        applyFilter();
    },[activeTab,activeCategory,activeSubCategory]);


    useEffect(()=>{
          getDataRecord();
    },[listFilter]);


  //====================Start Calling Student Dashboad Api======================== 
  const getAllfilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_dashboard.php?fun=getallfilter`,
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

          // if (categoryCheckedItems.length == 0) {
          //   setCategoryCheckedItems([
          //     ...JSON.parse(filterList.categoryDataOptions),
          //   ]);
          // }

          if (!checkAnyCheckedTrue(categoryCheckedItems)) {
            setCategoryCheckedItems([
            ...JSON.parse(filterList.categoryDataOptions),
            ]);
          }
          

          setCourseOptions([
            ...JSON.parse(filterList.courseListOptions)
          ]);
         
          setCenterOptions([
            ...JSON.parse(response.data.data.filterlist.LocationData),
          ]);

          setLocationOptions([
            ...JSON.parse(response.data.data.filterlist.CenterData),
          ]);

          setUserTypeOptions([
            ...JSON.parse(response.data.data.filterlist.user_type),
          ]);

          setSourceDataOptions([
            ...JSON.parse(response.data.data.filterlist.leadSourceOptions),
          ]);
          
          setTeamsData([...JSON.parse(filterList.teamsData)]);
           if(!checkAnyCheckedTrue(checkedTeamItems)) {
            setCheckedTeamItems([
              ...JSON.parse(filterList.teamsData),
            ]);
          }

          // setTeamsData([...JSON.parse(filterList.teamsData)]);
          // if (checkedTeamItems.length <= 0) {
          //   setCheckedTeamItems([
          //     ...JSON.parse(filterList.teamsData),
          //   ]);
          // }

          setTabs([...JSON.parse(filterList.leaddashboardtab)]);
          setFilterApiStatus(true);

        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const getDataRecord = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_dashboard.php?fun=gettabrecord`,
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
      url: `${constant.base_url}/admin/student_dashboard.php?fun=getsubCategoryRecord`,
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
    url: `${constant.base_url}/admin/student_dashboard.php?fun=gettabrecordfilter`,
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
    url: `${constant.base_url}/admin/student_dashboard.php?fun=getCategoryData`,
    headers: { "Auth-Id": user.auth_id },
    data: { listFilter: listFilter },
  })
  .then(function (response) {
    checkUserLogin(response);
    if (response.data.data.status === 1) {
        //console.log(response.data.data.data.new);
       setStudentCategoryData(response.data.data.data);
       getLineChartData();
    }
  })
  .catch(function (error) {
    console.error("Error during login:", error);
  });
};


const getLineChartData = async () => {
  axios({
    method: "post",
    url: `${constant.base_url}/admin/student_dashboard.php?fun=getLineChartData`,
    headers: { "Auth-Id": user.auth_id },
    data: { listFilter: listFilter },
  })
  .then(function (response) {
    checkUserLogin(response);
    if (response.data.data.status === 1) {
      setDataLine(response.data.data.data);
      getAttendenceData();
    }
  })
  .catch(function (error) {
    console.error("Error during login:", error);
  });
};


   

const getAttendenceData = async () => {
  axios({
    method: "post",
    url: `${constant.base_url}/admin/student_dashboard.php?fun=getstudentattendencedata`,
    headers: { "Auth-Id": user.auth_id },
    data: { listFilter: listFilter },
  })
  .then(function (response) {
    checkUserLogin(response);
    //console.log(response.data);
    if (response.data.data.status === 1) {
      setStudentAttendence(response.data.data.data);
       getReportData();
    }
  })
  .catch(function (error) {
    console.error("Error during login:", error);
  });
};


const getReportData = async () => {
  axios({
    method: "post",
    url: `${constant.base_url}/admin/student_dashboard.php?fun=getstudentreportdata`,
    headers: { "Auth-Id": user.auth_id },
    data: {  
      listFilter:listFilter,
    },
  })
    .then(function (response) {
      // console.log(response.data.data);
       setProgressReportData([...response.data.data]);
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
};




  // function sortByDate(data, order = 'asc') {
  //   const sortedData = [...data].sort((a, b) => {
  //     const dateA = new Date(a.date);
  //     const dateB = new Date(b.date);
  //     return order === 'asc' ? dateA - dateB : dateB - dateA;
  //   });
  
  //   return sortedData.map(item => {
  //     const dateObj = new Date(item.date);
  //     const day = String(dateObj.getDate()).padStart(2, '0'); // Add leading 0 if needed
  //     const month = dateObj.toLocaleString('default', { month: 'short' }); // e.g., "Apr"
  //     return {
  //       ...item,
  //       date: `${day} ${month}`
  //     };
  //   });
  // }
  
function sortByDate(data, order = 'asc') {
  const parseDate = (dateStr) => {
    // Try full date format first
    const fullDate = new Date(dateStr);
    if (!isNaN(fullDate)) return fullDate;

    // If it's just month + year like "Oct 2024", assume day 1
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const [monthStr, yearStr] = parts;
      return new Date(`${monthStr} 01, ${yearStr}`);
    }

    // Fallback to epoch
    return new Date(0);
  };

  const sortedData = [...data].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return sortedData.map(item => {
    const isFullDate = /^\d{1,2} \w{3} \d{4}$/.test(item.date); // e.g., "28 Apr 2025"
    const dateObj = parseDate(item.date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    return {
      ...item,
      date: isFullDate ? `${day} ${month}` : `${month} ${year}`
    };
  });
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
  return (
    <div>
      <InnerHeader
        heading=""
        txtSubHeading="Monitor student progress, batch details, and enrollment metrics"
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
              {center.length > 0 && (
                <div className="v-center mt8">
                  <p className="fs14 ls1 mr4">Branch:</p>
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
                 {checkedTeamItems.some(
                (item) =>
                  item.checked || item.children?.some((child) => child.checked)
              ) && <p className="team-heading mr4">Team:</p>}

              {checkedTeamItems
                .reduce((acc, item) => {
                  if (item.checked) acc.push(item);
                  if (item.children) {
                    acc.push(...item.children.filter((child) => child.checked));
                  }
                  return acc;
                }, [])
                .map((item) => (
                  <div key={item.value} className="dash-chip mr4">
                    {item.label}
                  </div>
                ))}

              {categoryCheckedItems.some(
                (item) =>
                  item.checked || item.children?.some((child) => child.checked)
              ) && <p className="team-heading mr4">Category:</p>}

              {categoryCheckedItems
                .reduce((acc, item) => {
                  if (item.checked) acc.push(item);
                  if (item.children) {
                    acc.push(...item.children.filter((child) => child.checked));
                  }
                  return acc;
                }, [])
                .map((item) => (
                  <div key={item.value} className="dash-chip mr4">
                    {item.label}
                  </div>
                ))}
              {course.length > 0 && (
                <div className="v-center">
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
            </div>
          )}
        </div>
      )}
      <div className="dashboard-container">
        <StudentNestTab
        dateRangeValue={dateRangeValue}
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
        setActiveSubCategoryVal={setActiveSubCategoryVal}
        />



        <div className="row st-das-box df jcsb fww">
          <div className={`card df jcsb batch-chart st-dash-card`}>
            <div className="fs16 mb8 ls1 dfc1 df fdc flx1">
              New
              <p className="ls2 df fdc">
                <p className="fs24 dfc1 fw6 mt8">{studentCategoryData.new_total}</p>
                {/* <p className="fs14 fc2">
                  +25% <span className="fc4">(5%)</span>
                </p> */}
              </p>
            </div>
            <ReusablePieChart
              data={studentCategoryData.new}
              title=""
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={120}
              outerRadius={40}
              legend={false}
              showBread
            />
          </div>

          <div className={`card df jcsb batch-chart st-dash-card`}>
            <div className="fs16 mb8 ls1 dfc1 df fdc flx1">
              Batch Alloted
              <p className="ls2 df fdc">
                <p className="fs24 dfc1 fw6 mt8">{studentCategoryData.batch_alloted_total}</p>
                {/* <p className="fs14 fc2">
                  +25% <span className="fc4">(5%)</span>
                </p> */}
              </p>
            </div>
            <ReusablePieChart
              data={studentCategoryData.batch_alloted}
              title=""
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={120}
              outerRadius={40}
              legend={false}
              showBread
            />
            {/* <ProgressBar
              breakdown={Object.values(salesData[index])[0]?.breakdown || []}
              dateRangeValue={dateRangeValue}
            /> */}
          </div>

          <div className={`card df jcsb batch-chart st-dash-card`}>
            <div className="fs16 mb8 ls1 dfc1 df fdc flx1">
              Batch Running
              <p className="ls2 df fdc">
                <p className="fs24 dfc1 fw6 mt8">{studentCategoryData.batch_running_total}</p>
                {/* <p className="fs14 fc2">
                  +25% <span className="fc4">(5%)</span>
                </p> */}
              </p>
            </div>
            <ReusablePieChart
              data={studentCategoryData.batch_running}
              title=""
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={120}
              outerRadius={40}
              legend={false}
              showBread
            />
          </div>
          <div className={`card df jcsb batch-chart st-dash-card`}>
            <div className="fs16 mb8 ls1 dfc1 df fdc flx1">
              Batch Completed
              <p className="ls2 df fdc">
                <p className="fs24 dfc1 fw6 mt8">{studentCategoryData.batch_completed_total}</p>
                {/* <p className="fs14 fc2">
                  +25% <span className="fc4">(5%)</span>
                </p> */}
              </p>
            </div>
            <ReusablePieChart
              data={studentCategoryData.batch_completed}
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={120}
              outerRadius={40}
              legend={false}
              showBread
            />
          </div>
          <div className={`card df jcsb batch-chart st-dash-card`}>
            <div className="fs16 mb8 ls1 dfc1 df fdc flx1">
              Course Completed
              <p className="ls2 df fdc">
                <p className="fs24 dfc1 fw6 mt8">{studentCategoryData.course_completed_total}</p>
                {/* <p className="fs14 fc2">
                  +25% <span className="fc4">(5%)</span>
                </p> */}
              </p>
            </div>
            <ReusablePieChart
              data={studentCategoryData.course_completed}
              title=""
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={120}
              outerRadius={40}
              legend={false}
              showBread
            />
          </div>
        </div>



        <div className="row charts sales-sum">
          <div className="chart">
            <h3 className="dash-head ls1 fw6 mb16">Student Summary </h3>
            <div
              className="chart-placeholder "
              style={{ width: "100%", height: isMobile ? "60%" : "100%" }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={sortByDate(dataLine,"desc")}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    {allKeys.map((key, index) => {
                      const color = getColorByIndex(index);
                      return (
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
                            stopColor={color}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={color}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: isMobile ? 11 : 12 }}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 11 : 12 }} />
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="0 0" />
                  <Tooltip contentStyle={{ fontSize: "14px" }} />
                  <Legend
                    onClick={(e) => toggleKey(e.value)}
                    payload={allKeys.map((key, index) => ({
                      id: key,
                      value: key,
                      type: "square",
                      color: getColorByIndex(index),
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
              </ResponsiveContainer>
            </div>
          </div>
        </div>



    <div className="df fww st-crd cards mt16 student-progress-bar">
      {Object.keys(progressReportData).length > 0 &&
        cardData.map((item, index) => {
          //if (item.title === "Incomplete Profile") return null;

          const progressData = Object.values(progressReportData[index])[0];

          return (
            <div className={`card dbg${index + 1}`} key={index}>
              <p className="fs16 mb8 mt8 ls1 dfc1 tp v-center">
                <DynamicTooltip
                  direction="right"
                  text={progressData?.short_name || 0}
                >
                  {item.title}
                </DynamicTooltip>
              </p>
              <p className="fw6 mb8 ls1 v-center dfc1">
                <p className="fs18">
                  {progressData?.amount || 0}
                </p>
                <p className="fs14 fc2 ml8">
                  {/* Optional growth info */}
                </p>
              </p>
              <ProgressBar
                breakdown={progressData?.breakdown || []}
                dateRangeValue={dateRangeValue}
                listFilter={listFilter}
              />
            </div>
          );
        })}
    </div>




       <div className="row charts mt16 ver pie-chart-wrap">
        {studentAttendence && typeof studentAttendence === 'object' && Object.keys(studentAttendence).length > 0 && (
          <ReusablePieChart
            data={studentAttendence}
            title="Student Attendance"
            dataKey="value"
            nameKey="name"
            colors={colors}
            legendPosition="right"
            height={280}
          />
        )}
          {/* <ReusablePieChart
            data={FacultyAttendanceData}
            title="Faculty Attendance"
            dataKey="value"
            nameKey="name"
            colors={colors}
            legendPosition="right"
            height={280}
          /> */}
        </div>
        {/* <div className="df charts batch-chart df mt16">
          <div className="batch-comp w100 br1 ver pie-chart-wrap">
            <ReusablePieChart
              data={BatchesCompletedData}
              title="Batches"
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={280}
              subHeading={"Completed"}
              Count={BatchesCompletedData[0].value}
              showInitialBreakdown
            legendPosition="right"
            outerRadius={75}

            />
          </div>
          <div className="batch-comp w100 br1 mt32 ver pie-chart-wrap">
            <ReusablePieChart
              data={BatchesUpcomingData}
              title=""
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={280}
              subHeading={"Upcoming"}
              Count={BatchesUpcomingData[0].value}
              showBread
              showInitialBreakdown
            legendPosition="right"
            outerRadius={75}

            />
          </div>
          <div className="batch-comp w100 mt32 ver pie-chart-wrap">
            <ReusablePieChart
              data={BatchesRunningData}
              title=""
              dataKey="value"
              nameKey="name"
              colors={colors}
              height={280}
              subHeading={"Running"}
              Count={BatchesRunningData[0].value}
              showBread
              showInitialBreakdown
            legendPosition="right"
            outerRadius={75}

            />
          </div>
        </div> */}

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
              <div className="ct-f service-status-filter searching-drop mb16">
                <p className="fc15 fw6 fs14 ls1 mb8">Select Team-Coordinator</p>
                <MultiLevelDropdown
                  placeholder="Select Team"
                  data={teamsData}
                  checkedItems={checkedTeamItems}
                  setCheckedItems={setCheckedTeamItems}
                  updateFilterCount={updateFilterCount}
                />
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
                <div className="service-status-filter mr8 searching-drop mb8">
                  <p className="fc15 fw6 fs14 ls1 mb8">Select State</p>
                  {/* <MultiDropdown
                    label="State"
                    options={locationOptions}
                    selectedValues={location}
                    onSelect={handleLocationChange}
                    chips={3}
                  /> */}
                   <MultiSelectDropdown
                    options={locationOptions}
                    placeholder={"Search State"}
                    onSelectionChange={handleLocationChange}
                    clearSignal={clearSignal}
                    selectedOption={location}
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

              <div className="service-status-filter searching-drop mb8 mt16">
                <p className="fc15 fw6 fs14 ls1 mb8">Source Type</p>
                <Dropdown
                  label="Source Type"
                  options={sourceDataOptions}
                  selectedValue={sourceData}
                  onValueChange={handleSourceData}
                />
              </div>

              <div className="service-status-filter mr8 searching-drop mb8">
                  <p className="fc15 fw6 fs14 ls1 mb8">Select Branch</p>
                  <MultiDropdown
                    label="Branch"
                    options={centerOptions}
                    selectedValues={center}
                    onSelect={handleCenterChange}
                    chips={3}
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
                <button className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6">
                  Clear
                </button>
              </div>
            </div>
          </SidePopup>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
