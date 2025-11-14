import React, { useState, useEffect } from "react";
import "./NestTab.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import SmallLoader from "../SmallLoader";
import { format } from "date-fns";
import formatDateRange from "../../helpers/formatDateRange";
import newFormatDateRange from "../../helpers/newFormatDateRange";
import DynamicTooltip from "../../components/Dynamic_Tooltip";

const NestTab = ({ dateRangeValue, leadVerified, isSecondDateVisible, allTabRecord, listFilter, setListFilter, activeTab, setActiveTab, activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory, applyFilter, activeTabVal, activeCategoryVal, activeSubCategoryVal, setActiveTabVal, setActiveCategoryVal, setActiveSubCategoryVal,teamsData,categoryCheckedItems,setCategoryCheckedItems}) => {
  
  const [breakdownData, setBreakdownData] = useState({});
  const [dates, setDates] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTabData, setExpandedTabData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [LeadTaData, setLeadTaData] = useState({});
  const [currentTabData, setCurrentTabData] = useState({});
  const [redirectFilter, setRedirectFilter] = useState(null);
  const [dataState, setDataState] = useState([]);

  const [oldFilter, setOldFilter] = useState({});

  function smartFormat(value) {
    const isPercentage = typeof value === 'string' && value.includes('%');
  
    if (isPercentage) {
      const numberPart = parseFloat(value.replace('%', ''));
      return `${numberPart.toFixed(0)}%`;
    } else {
      const formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return formatter.format(value);
    }
  }
  

  
  useEffect(() => {
    if (Object.keys(allTabRecord).length > 0) {
      setLeadTaData({ ...allTabRecord });
      if (!activeTab) {
       
        setActiveTab(allTabRecord['source'].tabName);
        setActiveTabVal(allTabRecord['source'].value);
        setCurrentTabData({ ...allTabRecord['source'] });
      }
    }
  }, [allTabRecord, activeTab]);

  useEffect(() => {
    if (Object.keys(LeadTaData).length && activeTab) {
     
      setIsLoading(true);

      const selectedTab = LeadTaData[activeTabVal];
      
      setCurrentTabData({...selectedTab});
      const defaultCategory = selectedTab['categories'][activeCategoryVal];
     
      if (defaultCategory?.breakdown) {
        setBreakdownData(defaultCategory.breakdown);
        const allDates = Object.values(defaultCategory.breakdown).flatMap((category) =>
          Object.keys(category.date)
        );
        const uniqueSortedDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
        setDates(uniqueSortedDates);
      }

      setIsLoading(false);
    }
  }, [activeTab, LeadTaData,activeCategoryVal]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.tabName);
    setActiveTabVal(tab.value);
    setActiveCategory("All");
    setActiveCategoryVal("all");
    setActiveSubCategory("All");
    setActiveSubCategoryVal("all");
    setSelectedIndex(null);
    setExpandedTabData({});
  };

  const handleCategoryClick = (category) => {
    setIsLoading(true);
    setActiveCategory(category.name);
    setActiveCategoryVal(category.value);
    setSelectedIndex(null);
    setExpandedTabData({});
    setRedirectFilter(category.redirect_key);
    const selectedCategory = currentTabData['categories'][category.value];
    if (selectedCategory?.breakdown) {
      setBreakdownData(selectedCategory.breakdown);
      

      const allDates = Object.values(selectedCategory.breakdown).flatMap((category) =>
        Object.keys(category.date)
      );
      const uniqueSortedDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
      setDates(uniqueSortedDates);
    
    } else {
      setBreakdownData([]);
      setDates([]);
    }

    setIsLoading(false);
  };

  const handleSubCategoryItemClick = (categoryExp, index) => {
    setIsLoading(true);
    setSelectedIndex(index);
    setActiveSubCategoryVal(categoryExp.value);
    setActiveSubCategory(categoryExp.name);
    const selectedCategory = currentTabData['categories'][categoryExp.value];

    if (selectedCategory?.expandBreakdown) {
      const filterData = selectedCategory['expandBreakdown'][categoryExp.value]
      setBreakdownData(filterData?.breakdown || []);
      const allDates = Object.values(selectedCategory.breakdown).flatMap((category) =>
        Object.keys(category.date)
      );
      const uniqueSortedDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
      setDates(uniqueSortedDates);
      
    } else {
      setBreakdownData([]);
      setDates([]);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    if (activeTab === 'Category' || activeTab === 'Team'){
      const sourceData = activeTab === 'Team' ? teamsData : categoryCheckedItems;
      const updatedData = sourceData.map(item => {
        if (item.label === activeCategory){
          let newItem = { ...item};
          if (activeSubCategory === 'All'){
            newItem.checked = true;
            if (newItem.children) {
              newItem.children = newItem.children.map(child => ({
                ...child,
                checked: true
              }));
            }
          } else {
            newItem.checked = false;
            if (newItem.children) {
              newItem.children = newItem.children.map(child => ({
                ...child,
                checked: child.label === activeSubCategory
              }));
            }
          }
  
          return newItem;
        }
  
        return item;
      });
  
      setDataState(updatedData);
    }
  }, [activeCategory, activeSubCategory]);
  
  
  const toggleExpand = (index) => {
    setExpandedRows((prevState) => ({ [index]: !prevState[index] }));
  };
  const getStatusChecked = (filter_name)=>{
    if(filter_name=='Follow-up'){
      return [{label: "Interested",value: "followup",checked: true},{label: "Ask To Call Later",value: "call_latter",checked: true},{label: "No Response",value: "noresponse",checked: true,children: [{ label: "Ringing", value: "ringing", checked: true },{ label: "Not Reachable", value: "not_reachable", checked: true },{ label: "Switch Off", value: "switch_off", checked: true },{ label: "Incoming barred", value: "incoming_barred", checked: true },{ label: "Out of Service", value: "out_of_service", checked: true },{ label: "Busy", value: "busy", checked: true },{ label: "Voice mail", value: "voice_mail", checked: true }]}];
    }
    else if(filter_name=='No Response'){
      return [{label: "No Response",value: "noresponse",checked: true,children: [{ label: "Ringing", value: "ringing", checked: true },{ label: "Not Reachable", value: "not_reachable", checked: true },{ label: "Switch Off", value: "switch_off", checked: true },{ label: "Incoming barred", value: "incoming_barred", checked: true },{ label: "Out of Service", value: "out_of_service", checked: true },{ label: "Busy", value: "busy", checked: true },{ label: "Voice mail", value: "voice_mail", checked: true }]}]
    }
    else if(filter_name=='Interested'){
      return [{label: "Interested",value: "followup",checked: true}];
    }
    else if(filter_name=='Ask To Call Later'){
      return [{label: "Ask To Call Later",value: "call_latter",checked: true}];
    }else if(filter_name=='Not Interested'){
      return [{label:"Not Interested",value:"notinterested",checked:true,children:[{label:"Fund Issue",value:"fundissue",checked:true},{label:"Location Out of Scope",value:"location_out_of_scope",checked:true},{label:"Joined Other Institute",value:"joined_other_institute",checked:true},{label:"Not Eligible",value:"not_eligible",checked:true},{label:"Not Aware",value:"not_aware",checked:true},{label:"Job Seeker",value:"job_seeker",checked:true},{label:"Drone Buyer",value:"drone_buyer",checked:true},{label:"Only Exploring",value:"only_exploring",checked:true},{label:"Reason Not Shared",value:"reason_not_shared",checked:true}]}];
    }else if(filter_name=='Location Out of Scope'){
      return  [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:true},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
      ;
    }
    else if(filter_name=='Joined Other Institute'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:true},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Reason Not Shared'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:true}]}];
    }
    else if(filter_name=='Drone Buyer'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:true},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Not Eligible'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:true},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Fund Issue'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:true},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Not Aware'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:true},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Only Exploring'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:false},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:true},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Job Seeker'){
      return [{label:"Not Interested",value:"notinterested",checked:false,children:[{label:"Fund Issue",value:"fundissue",checked:false},{label:"Location Out of Scope",value:"location_out_of_scope",checked:false},{label:"Joined Other Institute",value:"joined_other_institute",checked:false},{label:"Not Eligible",value:"not_eligible",checked:false},{label:"Not Aware",value:"not_aware",checked:false},{label:"Job Seeker",value:"job_seeker",checked:true},{label:"Drone Buyer",value:"drone_buyer",checked:false},{label:"Only Exploring",value:"only_exploring",checked:false},{label:"Reason Not Shared",value:"reason_not_shared",checked:false}]}];
    }
    else if(filter_name=='Ringing'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:true},{label:"Not Reachable",value:"not_reachable",checked:false},{label:"Switch Off",value:"switch_off",checked:false},{label:"Incoming barred",value:"incoming_barred",checked:false},{label:"Out of Service",value:"out_of_service",checked:false},{label:"Busy",value:"busy",checked:false},{label:"Voice mail",value:"voice_mail",checked:false}]}];

    }
    else if(filter_name=='Out of Service'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:false},{label:"Not Reachable",value:"not_reachable",checked:false},{label:"Switch Off",value:"switch_off",checked:false},{label:"Incoming barred",value:"incoming_barred",checked:false},{label:"Out of Service",value:"out_of_service",checked:true},{label:"Busy",value:"busy",checked:false},{label:"Voice mail",value:"voice_mail",checked:false}]}];
    }
    else if(filter_name=='Voice mail'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:false},{label:"Not Reachable",value:"not_reachable",checked:false},{label:"Switch Off",value:"switch_off",checked:false},{label:"Incoming barred",value:"incoming_barred",checked:false},{label:"Out of Service",value:"out_of_service",checked:false},{label:"Busy",value:"busy",checked:false},{label:"Voice mail",value:"voice_mail",checked:true}]}];
    }
    else if(filter_name=='Incoming barred'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:false},{label:"Not Reachable",value:"not_reachable",checked:false},{label:"Switch Off",value:"switch_off",checked:false},{label:"Incoming barred",value:"incoming_barred",checked:true},{label:"Out of Service",value:"out_of_service",checked:false},{label:"Busy",value:"busy",checked:false},{label:"Voice mail",value:"voice_mail",checked:false}]}];
    }
    else if(filter_name=='Not Reachable'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:false},{label:"Not Reachable",value:"not_reachable",checked:true},{label:"Switch Off",value:"switch_off",checked:false},{label:"Incoming barred",value:"incoming_barred",checked:false},{label:"Out of Service",value:"out_of_service",checked:false},{label:"Busy",value:"busy",checked:false},{label:"Voice mail",value:"voice_mail",checked:false}]}];
    }
    else if(filter_name=='Switch Off'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:false},{label:"Not Reachable",value:"not_reachable",checked:false},{label:"Switch Off",value:"switch_off",checked:true},{label:"Incoming barred",value:"incoming_barred",checked:false},{label:"Out of Service",value:"out_of_service",checked:false},{label:"Busy",value:"busy",checked:false},{label:"Voice mail",value:"voice_mail",checked:false}]}];
    }
    else if(filter_name=='Busy'){
      return [{label:"No Response",value:"noresponse",checked:false,children:[{label:"Ringing",value:"ringing",checked:false},{label:"Not Reachable",value:"not_reachable",checked:false},{label:"Switch Off",value:"switch_off",checked:false},{label:"Incoming barred",value:"incoming_barred",checked:false},{label:"Out of Service",value:"out_of_service",checked:false},{label:"Busy",value:"busy",checked:true},{label:"Voice mail",value:"voice_mail",checked:false}]}];
    }
    else if(filter_name=='Junk'){
      return [{label:"Junk",value:"junk",checked:true,children:[{label:"Wrong Number",value:"wrong_number",checked:true},{label:"Wrong Email",value:"wrong_email",checked:true},{label:"Test Lead",value:"test_lead",checked:true},{label:"Spam",value:"spam",checked:true}]}];
    }
    else if(filter_name=='Wrong Number'){
      return [{label:"Junk",value:"junk",checked:false,children:[{label:"Wrong Number",value:"wrong_number",checked:true},{label:"Wrong Email",value:"wrong_email",checked:false},{label:"Test Lead",value:"test_lead",checked:false},{label:"Spam",value:"spam",checked:false}]}];
    }
    else if(filter_name=='Test Lead'){
      return [{label:"Junk",value:"junk",checked:false,children:[{label:"Wrong Number",value:"wrong_number",checked:false},{label:"Wrong Email",value:"wrong_email",checked:false},{label:"Test Lead",value:"test_lead",checked:true},{label:"Spam",value:"spam",checked:false}]}];
    }
    else if(filter_name=='Spam'){
      return [{label:"Junk",value:"junk",checked:false,children:[{label:"Wrong Number",value:"wrong_number",checked:false},{label:"Wrong Email",value:"wrong_email",checked:false},{label:"Test Lead",value:"test_lead",checked:false},{label:"Spam",value:"spam",checked:true}]}];
    }
    return [];
  }
  const updatedDate = dateRangeValue
    .slice(0, 1)
    .map(item => ({
      ...item,
      key: "selection" 
    }));
  const handleRedirectSetFilter = (pageTab, dateOption, dateRangeValue,record) => {
    const updateFilter = {
      page_type: pageTab,
      datetypefilter: dateOption,
      dateOption: dateOption,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      checkedTeamItems: (activeTab=='Team' && dataState)?dataState:listFilter.checkedTeamItems,
      planStatus: { label: "Select Stage", value: "" },
      leadStatus: "",
      leadSource: (redirectFilter!=undefined && activeTab=='Source')?redirectFilter:listFilter.sourceData,
      selectedState: [],
      assignee: { label: "Assigned Status", value: "" },
      categoryCheckedItems: (activeTab=='Category' && dataState)?dataState:listFilter.categoryCheckedItems,
      selectedCourses: listFilter.selectedCourses,
      companyType: (redirectFilter!=undefined && activeTab=='User Type')?redirectFilter:listFilter.userType,
      selectedVerified: (redirectFilter!=undefined && activeTab=='Verified')?redirectFilter:listFilter.leadVerified,
      dateRangeValuefilter: dateRangeValue,
      statusCheckedItems: [],
      dateMonthOptions: { label: "Day", value: "day" },
      dateRangeTimeType: "Custom",
      statusCheckedItems : getStatusChecked(record.name),  
      workOrderStatus: ["pending", "success"]    
      
    };

    setOldFilter((prevState) => {
      const newFilter = { ...prevState, [pageTab]: updateFilter };
      localStorage.setItem("allfilteroption", JSON.stringify(newFilter));
      return newFilter;
    });
  };


  const newFormatDateRangeSales = (dateRange) => {
    const [startDateStr, endDateStr] = dateRange;
  
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr
        .split("-")
        .map((part) => parseInt(part, 10));
      return new Date(year, month - 1, day);
    };
  
    const start = parseDate(startDateStr);
    const end = parseDate(endDateStr);
  
    const startDate = new Date(start.setHours(18, 30, 0, 0)).toISOString();
    const endDate = new Date(end.setHours(18, 29, 59, 999)).toISOString();
  
    return [
      {
        startDate,
        endDate,
        key: "selection",
      },
    ];
  };

  const handleSegmentClick = (item, date,record) => {

    if (item && item.url) {
          const newdate = formatDateRange(date);
          let DateArr=[];
          let newDateFormat='';
          if(item.column_type ==='date_range'){
             DateArr = newdate.split('|').map(date => date.trim());
            const newStartDate = format(dateRangeValue[0].startDate, "dd-MM-yyyy");
            DateArr[0] = newStartDate;
            newDateFormat = DateArr;
          }
      
            const dateToUse = date === "totalCount"
              ? dateRangeValue
              : item.column_type ==='date_range' ?newFormatDateRangeSales(newDateFormat):newFormatDateRange(newdate);
      

      window.open(`/${item.url}/${item.tab}`, "_blank");
      handleRedirectSetFilter(item.tab, item.date_type, dateToUse,record);
    }


  };
  const getDynamicTotalMsg = (name, type,a,b) => {
    let msg = 'Total untouched leads';
    if(name === null || name === undefined){
	    name="";
    }
    if (type === 'total') {
      if (name === 'Generated') {
        msg = `Total lead ${name} from ${a} - ${b}`;
      }else if ( name === 'Worked') {
        msg = `Total lead ${name} by team from ${a} - ${b}`;
      } else if (name === 'New/Untouched') {
        msg = `Total ${name}  leads from ${a} - ${b}`;
      }else if (name === 'Pending') {
        msg = `Total Follow-up pending cases as funnel & follow-up from ${b} - ${a}`;
      } else if (name === 'Follow-up(Due)') {
        msg = `Total follow-up due cases from ${a} - ${b}`;
      } else if (name === 'Funnel') {
        msg = `Total funnel due cases from ${a} - ${b}`;
      } else if (name === 'Hot') {
        msg =   `Total hot marked leads from ${a} - ${b}`;
      }else if (name === 'Conversion') {
        msg =   `Total leads Conversion (total booked/total worked)`;
      }else if (name === 'Booked Amount') {
        msg =   `Total Sales amount from ${a} - ${b}`;
      }else if (name === 'Booked Cases') {
        msg =   `Total booked cases from ${a} - ${b}`;
      } else if (
        ['Follow-up', 'Not Interested', 'No Response', 'Junk'].some(keyword =>
          name.includes(keyword)
        )
      ) {
        msg = `Total ${name} marked leads from ${a} - ${b}`;
      }else{
        msg = `Total ${name} marked leads from ${a} - ${b}`;
      }
    }else if(type=='date'){
      if (name === 'Generated') {
        msg = `Total lead generated on ${a}`;
      } else if (name === 'Worked') {
        msg =  `Total leads Worked by team on ${a}`;
      }else if (name === 'New/Untouched') {
        msg = `${name} leads from ${a} - ${b}`;
      }else if (name === 'Pending') {
        msg = `Follow-up pending cases as funnel & follow-up from ${a} - ${b}`;
      } else if (name === 'Follow-up(due)') {
        msg = `Follow-up due cases from ${a} - ${b}`;
      } else if (name === 'Funnel') {
        msg = `funnel due cases from ${a} - ${b}`;
      } else if (name === 'Hot') {
        msg =  `Hot marked leads on ${a}`;
      }else if (name === 'Conversion') {
        msg =   `Leads Conversion (total booked/total worked) ${a}`;
      }else if (name === 'Booked Amount') {
        msg =   `Total Sales amount on ${a}`;
      }else if (name === 'Booked Cases') {
        msg =   `Total booked cases on ${a}`;
      } else {
        msg = `${name} marked leads on ${a}`;
      }

    }
  
    return msg;
  };
  return (
    <>
      {isSecondDateVisible && (
        <div className="fs14 ls1 fc5">Compare Dates is not applicable on Tables</div>
      )}

      {Object.keys(LeadTaData).length > 0 && (
        <div className="container">
          {/* Tabs */}
          <div className="tabs">
            {Object.entries(LeadTaData).map(([tabName, tab], index) => (
              <div
                key={tab.tabName}
                className={`tab ${activeTab === tab.tabName ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.tabName}
              </div>
            ))}
          </div>

          {/* Category Buttons */}
          <div className="buttons">
           
          {currentTabData?.categories && Object.values(currentTabData.categories).length > 0 && (
  Object.values(currentTabData.categories)
    .sort((a, b) => {
      if (a.name === "All") return -1;
      if (b.name === "All") return 1;
      return (b.percentage ?? 0) - (a.percentage ?? 0);
    })
    .map((category, index) => (
      <p
        key={category.name}
        className={`btn ${activeCategory === category.name ? "active" : ""}`}
        onClick={() => {
          handleCategoryClick(category);
          if (category?.expandBreakdown) {
            setExpandedTabData(category.expandBreakdown);
          }
        }}
      >
        {category.name}
        {category.percentage !== undefined && category.percentage !== null && ` (${category.percentage}%)`}
      </p>
    ))
)}



          </div>

          {/* Subcategory Buttons */}
          {Object.keys(expandedTabData)?.length > 0 && (
  <div className="buttons">
    {Object.values(expandedTabData)
  .sort((a, b) => {
    if (a.name === "All") return -1;
    if (b.name === "All") return 1;
    return (b.percentage ?? 0) - (a.percentage ?? 0);
  })
  .map((expData, index) => (
    <p
      key={expData.name}
      className={`btn ${activeSubCategory === expData.name ? "active" : ""}`}
      onClick={() => handleSubCategoryItemClick(expData, index)}
    >
      {expData.name}
      {expData.percentage !== undefined && expData.percentage !== null && ` (${expData.percentage}%)`}
    </p>
  ))}
  </div>
)}


          {/* Table Content */}
          {isLoading ? (
            <div className="content ld-dash box-center loader">
              <SmallLoader />
            </div>
          ) : Object.keys(breakdownData).length === 0 ? (
            <div className="content ld-dash box-center no-data ls1">
              <div className="box-center mb12">
                <SmallLoader className={"mb12"} />
             </div>
            </div>
          ) : (
            <div className="content ld-dash">
              <div className="table-wrapper lead-tb">
                <table>
                  <thead>
                    <tr>
                      <th>{activeTab === "Team" ? "Name" : "Heading"}</th>
                      {!(activeTab === "Team" && activeCategory=="All") && <th>Total</th>}
                        {dates.map((date, index) => {
                          const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                          }); // This will return something like "11 Apr"

                          return (
                            <th key={index}>
                              {activeTab !== "Team" ? formattedDate : date}
                            </th>
                          );
                        })}
                    </tr>
                    {/* <tr>
                      <th>{activeTab === "Team" ? "Name" : "Heading"}</th>
                      {!(activeTab == "Team" && (activeCategoryVal =='all' || activeSubCategoryVal =='all')) && <th>Total</th>}
                      {dates.map((date, index) => (
                        <th key={index}>{date}</th>
                      ))}
                    </tr> */}
                  </thead>
                  <tbody>
                   
                    { Object.values(breakdownData)?.map((item, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td
                            className={`tal v-center ls1 ${item.expandBreakdown && "cp fw6"}`}
                            onClick={() =>{ if(item.expandBreakdown) {toggleExpand(index)}}}
                          >
                            {item.name}
                            {item.expandBreakdown && (
                              <button className="expand-btn">
                                {expandedRows[index] ? <FaMinus /> : <FaPlus />}
                              </button>
                            )}
                          </td>
                          {!(activeTab === "Team" && activeCategory=="All") && (
                            <td
                              onClick={() => handleSegmentClick(item.redirectData, "totalCount",item)}
                              className="leads-tool-fix cp"
                            >
                              <DynamicTooltip direction="right" text={getDynamicTotalMsg(item.name,"total",format(dateRangeValue[0].startDate, "dd MMM yyyy"),format(dateRangeValue[1].startDate, "dd MMM yyyy"))}>
                              {item.name!='Conversion' && <span className="lc2 text-row">{item.totalCount?smartFormat(item.totalCount):"-"}</span>}
                              {item.name==='Conversion' && <span className="lc2 text-row">{item.totalCount?item.totalCount:"-"}</span>}
                              </DynamicTooltip>
                            </td>
                          )}
                          {dates && dates.map((date, subIndex) => (
                            <td
                              key={subIndex}
                              onClick={() => handleSegmentClick(item.redirectData, date,item)}
                              className="cp"
                            >
                              <DynamicTooltip direction="left" text={getDynamicTotalMsg(item.name,"date",date,format(dateRangeValue[0].startDate, "dd MMM yyyy"))}>

                              {item.name!='Conversion' && <span className="lc2 text-row">{item.date[date]? smartFormat(item.date[date]): "-"}</span>}
                              {item.name==='Conversion' && <span className="lc2 text-row">{item.date[date]? item.date[date]: "-"}</span>}

                              </DynamicTooltip>
                            </td>
                          ))}
                        </tr>
                        {expandedRows[index] && Object.values(item.expandBreakdown)?.map((subItem, subIndex) => (
                          <tr key={`${index}-${subIndex}`} className="expanded-row ml16">
                            <td className="tal">{subItem.name}</td>
                            <td
                              onClick={() => handleSegmentClick(subItem.redirectData, "totalCount",subItem)}
                              className="cp"
                            >
                                <DynamicTooltip direction="right" text={getDynamicTotalMsg(subItem.name,"total",format(dateRangeValue[0].startDate, "dd MMM yyyy"),format(dateRangeValue[1].startDate, "dd MMM yyyy"))}>
                              {subItem.totalCount?smartFormat(subItem.totalCount):subItem.totalCount}
                              </DynamicTooltip>
                            </td>
                            {dates.map((date, dateIndex) => (
                              <td
                                key={dateIndex}
                                onClick={() => handleSegmentClick(subItem.redirectData, date,subItem)}
                                className="cp"
                              >
                                <DynamicTooltip direction="left" text={getDynamicTotalMsg(subItem.name,"date",date,format(dateRangeValue[0].startDate, "dd MMM yyyy"))}>
                                  <span className="lc2 text-row">{subItem.date[date]?smartFormat(subItem.date[date]):"-"}</span>
                                </DynamicTooltip>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NestTab;
