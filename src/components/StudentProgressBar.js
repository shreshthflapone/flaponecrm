import React from "react";
import "./ProgressBar.css";
import { format, startOfMonth, endOfMonth } from "date-fns";
import formatDateRange from "../helpers/formatDateRange";
import newFormatDateRange from "../helpers/newFormatDateRange";
import { FaRupeeSign } from "react-icons/fa";

const StudentProgressBar = ({ breakdown, dateRangeValue ,listFilter}) => {
  // console.log(breakdown,"breakdown");
  var oldFilter = {};

  const handleRedirectSetFilter = (
      redirecturl,
      localStorageKey,
      pageTab,
      pageType,
      dateOption,
      statusType,
      dateRangeValue,
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

           if(alldata.filter =="no"){
            updateFilter = {
              page_type: pageType,
              dateOptionsselect:dateOption,
              dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
              dateRangeValuefilter: updatedateRangeValue,
              assigneeCoordinator:alldata.assigneeCoordinator?alldata.assigneeCoordinator:{},
              pymntStatus:alldata.pymntStatus?alldata.pymntStatus:{},
              certificateStatus:alldata.certificateStatus?alldata.certificateStatus:{},
              docStatus:alldata.docStatus?alldata.docStatus:{},
              batchassigneOptions:alldata.batchAssignStatus?alldata.batchAssignStatus:{},
              profileStatus:alldata.profileStatus?alldata.profileStatus:{},
            };
           }else{
            updateFilter = {
              page_type: pageType,
              dateOptionsselect:dateOption,
              categoryCheckedItems:listFilter.categoryCheckedItems,
              selectedCourses:listFilter.selectedCourses,
              selectedBatch:[],
              selectedState:listFilter.location,
              branchData:listFilter.center,
              checkedCoordinator:listFilter.checkedTeamItems,
              dateRangeValue:`${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
              dateRangeValuefilter: updatedateRangeValue,
              userType:listFilter.userType,
              leadSource:listFilter.sourceData,
              assigneeCoordinator:alldata.assigneeCoordinator?alldata.assigneeCoordinator:{},
              pymntStatus:alldata.pymntStatus?alldata.pymntStatus:{},
              certificateStatus:alldata.certificateStatus?alldata.certificateStatus:{},
              docStatus:alldata.docStatus?alldata.docStatus:{},
             };
           }
          }else if(redirecturl === "review-list"){
          updateFilter = {
               page_type: pageType,
               page_type_lable: "Review",
               starrating:alldata.rating?alldata.rating:[],
               dateMoreOptions:dateOption,
               dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
               dateRangeValuefilter:updatedateRangeValue,
               courseoption:listFilter.selectedCourses,
               filterOnOff:true,
               listStatusOptions:statusType,
            };
          }else{
          updateFilter = {
              page_type: pageType,
              statusFilter: statusType,
              batchStatus: statusType,
              dateOptionsselect: dateOption,
              dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
              dateRangeValuefilter: updatedateRangeValue,
            };
          }
            
    oldFilter[pageTab?pageTab:pageType] = updateFilter;
    localStorage.setItem(localStorageKey, JSON.stringify(oldFilter));

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

  const handleSegmentClick = (item) => {

   if(item.url){
    let DateArr=[];

    if(item.column_type ==='card_date_range'){
            const startdate = formatDateRange(item.date_range.start_date);
            const enddate = formatDateRange(item.date_range.end_date);
           
            let startDateArr=[];  let endDateArr=[];
            startDateArr = startdate.split('|').map(date => date.trim());
            endDateArr = enddate.split('|').map(date => date.trim());

            DateArr[0] = startDateArr[0];
            DateArr[1] = endDateArr[0];
            
    }
    
    const dateToUse =  item.column_type ==='card_date_range' ?newFormatDateRangeSales(DateArr):dateRangeValue;

    // window.open(`/my-finance/${item.tab}`, "_blank");
    window.open(`/${item.url}${item.tab? '/' + item.tab : ''}`, "_blank");

    handleRedirectSetFilter(
        item.url,
        item.local_storage,
        item.tab,
        item.page_type,
        item.date_type,
        item.status_type,
        dateToUse,
        item,
    );
  }
  };
  
  return (
    <div className="progress-container">
      {breakdown.map((item, index) => (
        <div
          key={index}
          className="progress-segment"
          style={{
            width: `${item.percentage}%`,
            backgroundColor: item.color,
            letterSpacing: "0.4px",
          }}
          data-tooltip={`${item.name}: ${item.count}\nPercentage: ${item.percentage}%`}
          onClick={() => handleSegmentClick(item)}
        ></div>
      ))}
    </div>
  );
};

export default StudentProgressBar;
