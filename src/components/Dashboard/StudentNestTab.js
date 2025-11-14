import React, { useState, useEffect } from "react";
import "./NestTab.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import SmallLoader from "../SmallLoader";
import { format } from "date-fns";
import formatDateRange from "../../helpers/formatDateRange";
import newFormatDateRange from "../../helpers/newFormatDateRange";
import DynamicTooltip from "../../components/Dynamic_Tooltip";

const SalesNestTab = ({ dateRangeValue, isSecondDateVisible, allTabRecord, listFilter, setListFilter, activeTab, setActiveTab, activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory, applyFilter, activeTabVal, activeCategoryVal, activeSubCategoryVal, setActiveTabVal, setActiveCategoryVal, setActiveSubCategoryVal,dataStatus }) => {
  
  const [breakdownData, setBreakdownData] = useState({});
  const [dates, setDates] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTabData, setExpandedTabData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [LeadTaData, setLeadTaData] = useState({});
  const [currentTabData, setCurrentTabData] = useState({});

  const [oldFilter, setOldFilter] = useState({});

  
  useEffect(() => {
    if (Object.keys(allTabRecord).length > 0) {
      if(activeTab !='Team'){
        setExpandedRows({0:1});
      }else{
        setExpandedRows({});
      }

      setLeadTaData({ ...allTabRecord });
      if (!activeTab) {
        setActiveTab(allTabRecord['category'].tabName);
        setActiveTabVal(allTabRecord['category'].value);
        setCurrentTabData({ ...allTabRecord['category'] });
      }
    }
  }, [allTabRecord, activeTab ,activeCategoryVal]);

  useEffect(() => {
    
    if (Object.keys(LeadTaData).length && activeTab){
      setIsLoading(true);
      const selectedTab = LeadTaData[activeTabVal];
      setCurrentTabData({...selectedTab});
      //const defaultCategory = activeCategoryVal?activeCategoryVal:selectedTab['categories']['all'];
      const defaultCategory =selectedTab['categories'][activeCategoryVal];
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
  }, [activeTab, LeadTaData]);

  const handleTabClick = (tab) => {
    setIsLoading(true);
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

  const toggleExpand = (index) => {
    setExpandedRows((prevState) => ({ [index]: !prevState[index] }));
  };

  const handleRedirectSetFilter = (
    redirecturl,
    localStorageKey,
    pageTab,
    pageType,
    dateOption,
    statusType,
    dateRangeValue,
    tblUserType,
    tblLocationType,
    tblCourseType,
    tblCategoryType,
    tblSourceType,
    tblBranchType,
    alldata,
  ) => {

    const  updatedateRangeValue = dateRangeValue
    .slice(0, 1)
    .map(item => ({
      ...item,
      key: "selection" 
    }));

       let updateFilter = {};
       if(redirecturl === "my-students"){
          updateFilter = {
            page_type: pageType,
            dateOptionsselect:dateOption,
            categoryCheckedItems: tblCategoryType?tblCategoryType: listFilter.categoryCheckedItems,
            selectedCourses:tblCourseType?tblCourseType:listFilter.selectedCourses,
            selectedBatch:[],
            selectedState:tblLocationType?tblLocationType:listFilter.location,
            branchData:tblBranchType?tblBranchType:listFilter.center,
            checkedCoordinator:listFilter.checkedTeamItems,
            dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
            dateRangeValuefilter: updatedateRangeValue,
            assigneeCoordinator:alldata.assigneeCoordinator?alldata.assigneeCoordinator:{},
            userType:tblUserType?tblUserType:listFilter.userType,
            leadSource:tblSourceType?tblSourceType:listFilter.sourceData,
            pymntStatus:alldata.pymntStatus?alldata.pymntStatus:{},
            certificateStatus:alldata.certificateStatus?alldata.certificateStatus:{},
            docStatus:alldata.docStatus?alldata.docStatus:{},
            batchassigneOptions:alldata.batchAssignStatus?alldata.batchAssignStatus:{},
            showDateRangeCalendar:true,
            profileStatus:alldata.profileStatus?alldata.profileStatus:{},
          };
        }else if(redirecturl === "review-list"){
          updateFilter = {
                page_type: pageType,
                page_type_lable: "Review",
                dateMoreOptions:dateOption,
                dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
                dateRangeValuefilter:updatedateRangeValue,
                starrating:alldata.rating?alldata.rating:{},
                courseoption:listFilter.selectedCourses,
                filterOnOff:true,
                listStatusOptions:statusType,
            };
      }else{
        updateFilter = {
            page_type: pageType,
            dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
            dateRangeValuefilter: updatedateRangeValue,
            statusFilter: statusType,
            dateOptionsselect: dateOption,
            batchStatus: statusType,
            datetypefilterlabel:dateOption,
            showDateRangeCalendar:true,
          };
        }
          
    setOldFilter((prevState) => {
      const newFilter = { ...prevState, [pageTab?pageTab:pageType]: updateFilter };
      localStorage.setItem(localStorageKey, JSON.stringify(newFilter));
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

  const handleSegmentClick = (item, date) => {

if(item.url){
    let tblUserType = {}; let tblLocationType = []; let tblCourseType =[];
    let tblBranchType =[]; let tblCategoryType = []; let tblSourceType = {};


      if (activeTabVal === "source" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblSourceType = {
          label: activeCategory,
          value: activeCategoryVal
        };
      }
    }

     if (activeTabVal === "user_type" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblUserType = {
          label: activeCategory,
          value: activeCategoryVal
        };
      }
    }

     if (activeTabVal === "location" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblLocationType = [{
          label: activeCategory,
          value: activeCategoryVal
        }];
      }
    }

    if (activeTabVal === "course" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblCourseType = [activeCategoryVal];
      }
    }

    if (activeTabVal === "branch" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblBranchType = [activeCategoryVal];
      }
    }


      if (activeTabVal === "category" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategoryVal ===2) {
        console.log("1");
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":false,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":false}]},{"label":"Drone","value":"2","checked":true,"children":[{"label":"Drone Pilot Training","value":"3","checked":true},{"label":"Drone Services","value":"6","checked":true},{"label":"Drone Products","value":"7","checked":true}]}] ;
      }

      if(activeCategoryVal !== "all" && activeCategoryVal ===1){
        console.log("2");
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":true,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":true}]},{"label":"Drone","value":"2","checked":false,"children":[{"label":"Drone Pilot Training","value":"3","checked":false},{"label":"Drone Services","value":"6","checked":false},{"label":"Drone Products","value":"7","checked":false}]}];
        }

        if (activeCategoryVal !== "all" && activeCategoryVal === 2 && activeSubCategoryVal!='' && activeSubCategoryVal!='all') {
           console.log("3");
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":false,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":false}]},{"label":"Drone","value":"2","checked":true,"children":[{"label":"Drone Pilot Training","value":"3","checked":activeSubCategoryVal === "3"?true:false},{"label":"Drone Services","value":"6","checked":activeSubCategoryVal === "6"?true:false},{"label":"Drone Products","value":"7","checked":activeSubCategoryVal === "7"?true:false}]}] ;
      }

      if(activeCategoryVal !== "all" && activeCategoryVal === 1  && activeSubCategoryVal!=''  && activeSubCategoryVal!='all'){
         console.log("4");
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":true,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":activeSubCategoryVal === "4"?true:false}]},{"label":"Drone","value":"2","checked":false,"children":[{"label":"Drone Pilot Training","value":"3","checked":false},{"label":"Drone Services","value":"6","checked":false},{"label":"Drone Products","value":"7","checked":false}]}];
        }
      }

  
    const newdate = formatDateRange(date);
    let DateArr=[];

    let newDateFormat='';
    if (item) {
    if(item.column_type ==='date_range'){
       DateArr = newdate.split('|').map(date => date.trim());
       const newStartDate = format(dateRangeValue[0].startDate, "dd-MM-yyyy");
       DateArr[0] = newStartDate;
       newDateFormat = DateArr;
    }

      const dateToUse = date === "totalCount"
        ? dateRangeValue
        : item.column_type ==='date_range' ?newFormatDateRangeSales(newDateFormat):newFormatDateRange(newdate);

       window.open(`/${item.url}${item.tab ? '/' + item.tab : ''}`, "_blank");

      handleRedirectSetFilter(
        item.url,
        item.local_storage,
        item.tab,
        item.page_type,
        item.date_type,
        item.status_type,
        dateToUse,
        tblUserType = Object.keys(tblUserType).length ? tblUserType :"",
        tblLocationType = tblLocationType.length ? tblLocationType :"",
        tblCourseType = tblCourseType.length ? tblCourseType :"",
        tblCategoryType = Object.keys(tblCategoryType).length ? tblCategoryType :"",
        tblSourceType = Object.keys(tblSourceType).length ? tblSourceType :"",
        tblBranchType = tblBranchType.length?tblBranchType:"",
        item,
      );
    }
  }
  };


    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    }
    const firstStartDate = dateRangeValue[0].startDate;
    const firstEndDate = dateRangeValue[1].endDate;
    const formattedStartDate = formatDate(firstStartDate);
    const formattedEndDate = formatDate(firstEndDate);
  
      console.log(formattedStartDate,formattedEndDate);

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
 
          {/* {currentTabData?.categories && Object.values(currentTabData.categories).length > 0 && (
            Object.values(currentTabData.categories).map((category, index) => (
              <p
                key={category.name}
                className={`btn ${activeCategory === category.name ? "active" : ""}`}
                onClick={() => {handleCategoryClick(category);
                  if(category?.expandBreakdown){
                  setExpandedTabData(category?.expandBreakdown)}}}
              >
                {category.name}
                {category.percentage !== undefined && category.percentage !== null && ` (${category.percentage}%)`}
              </p>
            ))
          ) } */}

          {currentTabData?.categories && Object.values(currentTabData.categories).length > 0 && (
          Object.values(currentTabData.categories)
            .sort((a, b) => (a.name === "All" ? -1 : b.name === "All" ? 1 : 0)) 
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
                {/* {category.percentage !== undefined && category.percentage !== null && ` (${category.percentage} {!category.count_show ? '' : '%'})`} */}
                {category.percentage !== undefined && category.percentage !== null && (
  ` (${category.percentage}${category.count_show ? '' : ' %'})`
)}

              </p>
            ))
        )}

        </div>

          {/* Subcategory Buttons */}

          {/* {Object.keys(expandedTabData)?.length > 0 && (
            <div className="buttons">
            {Object.values(expandedTabData).map((expData, index) => (
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
          )} */}

          {expandedTabData && Object.keys(expandedTabData)?.length > 0 && (
            <div className="buttons">
            {Object.values(expandedTabData)
      .sort((a, b) => (a.name === "All" ? -1 : b.name === "All" ? 1 : 0)) // Sort All to top
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
          ) : (breakdownData && Object.keys(breakdownData).length === 0) ? (
            <div className="content ld-dash box-center no-data ls1">
            <SmallLoader />
            </div>
          ) : (
            <div className="content ld-dash">
              <div className="table-wrapper lead-tb">
                <table>
                  <thead>
                    <tr>
                      <th>{activeTabVal === "team" ? "Name" : "Heading"}</th>
                      {!(activeTabVal == "team" && (activeCategoryVal =='all' || activeSubCategoryVal =='all')) && <th>Total</th>}
                      {dates.map((date, index) => (
                        <th key={index}>{date}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                   
                  {breakdownData && typeof breakdownData === 'object' && Object.keys(breakdownData).length > 0 &&
                  Object.values(breakdownData).map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td
                          className={`tal v-center ls1 ${item.expandBreakdown && typeof item.expandBreakdown === 'object' && "cp fw6"}`}
                          onClick={() => {
                            if (item.expandBreakdown && typeof item.expandBreakdown === 'object') {
                              toggleExpand(index);
                            }
                          }}
                        >
                          {item.name}
                          {item.expandBreakdown && typeof item.expandBreakdown === 'object' && (
                            <button className="expand-btn">
                              {expandedRows[index] ? <FaMinus /> : <FaPlus />}
                            </button>
                          )}
                        </td>

                        {!(activeTabVal === "team" && (activeCategoryVal === 'all' || activeSubCategoryVal === 'all')) && (
                          <td
                            onClick={() => handleSegmentClick(item.redirectData, "totalCount")}
                            className="leads-tool-fix"
                          >
                            <DynamicTooltip direction="right" text={item.tooltip_name_total?.replace("#startdate", formattedStartDate)?.replace("#enddate", formattedEndDate)}>
                              <span className="lc2 text-row">{item.totalCount}</span>
                            </DynamicTooltip>
                          </td>
                        )}

                        {dates.length > 0 && dates.map((date, subIndex) => (
                          <td
                            key={subIndex}
                            onClick={() => handleSegmentClick(item.redirectData, date)}
                            className="cp"
                          >
                             {!(activeTabVal === "team" && (activeCategoryVal === 'all')) ? (
                                <DynamicTooltip
                                  direction="right"
                                  text={
                                    (item.name === "Feedback" || item.name === "Batches" || item.name === "Students" || item.name === "Pending")
                                      ?item.tooltip_name?.replace("#startdate", formattedStartDate)?.replace("#headerdate", date): item.tooltip_name?.replace("#headerdate", date)
                                  }
                                >
                                  <span className="lc2 text-row">{item.date?.[date] || "0"}</span>
                                </DynamicTooltip>
                              ) :(
                                <DynamicTooltip
                              direction="left"
                              text={date}
                            >
                              <span className="lc2 text-row">{item.date?.[date] || "0"}</span>
                            </DynamicTooltip>
                              )
                            }


                          </td>
                        ))}
                      </tr>

                      {expandedRows[index] &&
                        item.expandBreakdown &&
                        typeof item.expandBreakdown === 'object' &&
                        Object.values(item.expandBreakdown).map((subItem, subIndex) => (
                          <tr key={`${index}-${subIndex}`} className="expanded-row ml16">
                            <td className="tal">{subItem.name}</td>

                            <td
                              onClick={() => handleSegmentClick(subItem.redirectData, "totalCount")}
                              className="cp"
                            >

                           <DynamicTooltip direction="right" text={subItem.tooltip_name_total?.replace("#startdate", formattedStartDate)?.replace("#enddate", formattedEndDate)}>
                              <span className="lc2 text-row">{subItem.totalCount}</span>
                            </DynamicTooltip>

                            </td>
                            {dates.map((date, dateIndex) => (
                              <td
                                key={dateIndex}
                                onClick={() => handleSegmentClick(subItem.redirectData, date)}
                                className="cp"
                              >
                               
                                <DynamicTooltip
                                  direction="right"
                                  text={
                                    (item.name === "Feedback" || item.name === "Batches" || item.name === "Students" || item.name === "Pending")
                                      ?subItem.tooltip_name?.replace("#startdate", formattedStartDate)?.replace("#headerdate", date)
                                      : subItem.tooltip_name?.replace("#headerdate", date)
                                  }
                                >
                                  <span className="lc2 text-row">{subItem.date?.[date] || "0"}</span>
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

export default SalesNestTab;
