import React, { useState, useEffect } from "react";
import "./NestTab.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import SmallLoader from "../SmallLoader";
import { format } from "date-fns";
import formatDateRange from "../../helpers/formatDateRange";
import newFormatDateRange from "../../helpers/newFormatDateRange";
import DynamicTooltip from "../../components/Dynamic_Tooltip";

const SalesNestTab = ({ dateRangeValue, leadVerified, isSecondDateVisible, allTabRecord, listFilter, setListFilter, activeTab, setActiveTab, activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory, applyFilter, activeTabVal, activeCategoryVal, activeSubCategoryVal, setActiveTabVal, setActiveCategoryVal, setActiveSubCategoryVal,dataStatus }) => {
  
  const [breakdownData, setBreakdownData] = useState({});
  const [dates, setDates] = useState([]);
  // const [expandedRows, setExpandedRows] = useState({4:4});
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
        setExpandedRows({4:4});
      }else{
        setExpandedRows({});
      }

      setLeadTaData({ ...allTabRecord });
      if (!activeTab) {
        setActiveTab(allTabRecord['source'].tabName);
        setActiveTabVal(allTabRecord['source'].value);
        setCurrentTabData({ ...allTabRecord['source'] });
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
    pageTab,
    pageType,
    dateOption,
    status_type,
    dateRangeValue,
    amountType,
    tblUserType,
    tblVerifyType,
    tblLocationType,
    tblCourseType,
    tblCategoryType,
    tblSourceType,
    item
  ) => {

 const updatedDate = dateRangeValue
  .slice(0, 1)
  .map(item => ({
    ...item,
    key: "selection" 
  }));


    let updateFilter = {
          page_type: pageType,
          searchtext: "",
          listStatusOptions: [],
          serviceStatus: "",
          leadSource: tblSourceType?tblSourceType:listFilter.sourceData,
          dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
          dateRangeValuefilter: updatedDate,
          paymentType: "",
          paymentMode: [],
          teamSearch: [],
          workOrderStatus: status_type,
          paymentStatus: status_type,
          dateOption: dateOption,
          selectedTab: pageTab,
          categoryCheckedItems:tblCategoryType?tblCategoryType: listFilter.categoryCheckedItems,
          selectedCourses:tblCourseType?tblCourseType:listFilter.selectedCourses,
          teamSearch:listFilter.checkedTeamItems,
          amountType: amountType || [],
          leadVerified:tblVerifyType?tblVerifyType:listFilter.leadVerified,
          center:tblLocationType?tblLocationType:listFilter.center,
          sourceData:tblSourceType?tblSourceType:listFilter.sourceData,
          userType:tblUserType?tblUserType:listFilter.userType,
          scholarStatus:item.scholarStatus?item.scholarStatus:[],
          teamSearch:item.teamSearch?item.teamSearch:[],

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

  const handleSegmentClick = (item, date) => {

    if(item.key_tab === 'yes'){
      date = "totalCount";
    }
    
    let tblUserType = {};  let tblVerifyType = {};let tblLocationType =[]; let tblCourseType =[];
    let tblCategoryType = []; let tblSourceType = {};

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

  

    if (activeTabVal === "verified" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblVerifyType = {
          label: activeCategory,
          value: activeCategoryVal
        };
      }
    }


    if (activeTabVal === "location" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblLocationType = [activeCategory];
      }
    }

    if (activeTabVal === "course" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategory) {
        tblCourseType = [activeCategoryVal];
      }
    }


    if (activeTabVal === "category" && activeCategoryVal !== "") {
      if (activeCategoryVal !== "all" && activeCategoryVal ==='2') {
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":false,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":false}]},{"label":"Drone","value":"2","checked":true,"children":[{"label":"Drone Pilot Training","value":"3","checked":true},{"label":"Drone Services","value":"6","checked":true},{"label":"Drone Products","value":"7","checked":true}]}] ;
      }

      if(activeCategoryVal !== "all" && activeCategoryVal ==='1'){
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":true,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":true}]},{"label":"Drone","value":"2","checked":false,"children":[{"label":"Drone Pilot Training","value":"3","checked":false},{"label":"Drone Services","value":"6","checked":false},{"label":"Drone Products","value":"7","checked":false}]}];
        }

        if (activeCategoryVal !== "all" && activeCategoryVal ==='2' && activeSubCategoryVal!='' && activeSubCategoryVal!='all') {
          tblCategoryType = [{"label":"Aircraft","value":"1","checked":false,"children":[{"label":"Aircraft Pilot Training","value":"4","checked":false}]},{"label":"Drone","value":"2","checked":true,"children":[{"label":"Drone Pilot Training","value":"3","checked":activeSubCategoryVal === "3"?true:false},{"label":"Drone Services","value":"6","checked":activeSubCategoryVal === "6"?true:false},{"label":"Drone Products","value":"7","checked":activeSubCategoryVal === "7"?true:false}]}] ;
      }

      if(activeCategoryVal !== "all" && activeCategoryVal ==='1'  && activeSubCategoryVal!=''  && activeSubCategoryVal!='all'){
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

      window.open(`/${item.url}/${item.tab}`, "_blank");
      handleRedirectSetFilter(
        
        item.tab,
        item.page_type,
        item.date_type,
        item.status_type,
        dateToUse,
        item.amountType,
        tblUserType = Object.keys(tblUserType).length ? tblUserType :"",
        tblVerifyType = Object.keys(tblVerifyType).length ? tblVerifyType :"",
        tblLocationType = tblLocationType.length ? tblLocationType :"",
        tblCourseType = tblCourseType.length ? tblCourseType :"",
        tblCategoryType = Object.keys(tblCategoryType).length ? tblCategoryType :"",
        tblSourceType = Object.keys(tblSourceType).length ? tblSourceType :"",
        item
      );
    }
  };


    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    }
    const firstStartDate = dateRangeValue[0].startDate;
    const formattedStartDate = formatDate(firstStartDate);
  
    // console.log(formattedStartDate);

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
                {category.percentage !== undefined && category.percentage !== null && ` (${category.percentage}%)`}
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
                      <th>{activeTab === "Team" ? "Name" : "Heading"}</th>
                      {!(activeTab == "Team" && (activeCategoryVal =='all' || activeSubCategoryVal =='all')) && <th>Total</th>}
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

                        {!(activeTab === "Team" && (activeCategoryVal === 'all' || activeSubCategoryVal === 'all')) && (
                          <td
                            onClick={() => handleSegmentClick(item.redirectData, "totalCount")}
                            className="leads-tool-fix"
                          >
                            <DynamicTooltip direction="left" text={`Total ${item.tooltip_name}  as per filter`}>
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
                             {!(activeTab === "Team" && (activeCategoryVal === 'all' || activeSubCategoryVal === 'all')) ? (
                                <DynamicTooltip
                                  direction="left"
                                  text={
                                    (item.name === "Total Pending" || item.name === "Approval Pending")
                                      ? `${item.tooltip_name} - ${formattedStartDate} To ${date}`
                                      : `${item.tooltip_name} - ${date}`
                                  }
                                >
                                  <span className="lc2 text-row">{item.date?.[date] || "0"}</span>
                                </DynamicTooltip>
                              ) :(
                                <DynamicTooltip
                              direction="left"
                              text={date === "Overall Sales"?`Total Sales Amount`:`${date} `}
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

                            <DynamicTooltip direction="left" text={`Total ${subItem.tooltip_name}  as per filter`}>
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
                                  direction="left"
                                  text={
                                    (subItem.name === "Total Pending" ||
                                      subItem.name === "Approval Pending" ||
                                      subItem.name === "Payment" ||
                                      subItem.name === "Scholarship" ||
                                      subItem.name === "Discount")
                                      ? `${subItem.tooltip_name} - ${formattedStartDate} To ${date}`
                                      : `${subItem.tooltip_name} - ${date}`
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
