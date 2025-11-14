import React from "react";
import "./ProgressBar.css";
import { format, startOfMonth, endOfMonth } from "date-fns";
import formatDateRange from "../helpers/formatDateRange";
import newFormatDateRange from "../helpers/newFormatDateRange";
import { FaRupeeSign } from "react-icons/fa";

const ProgressBar = ({ breakdown, dateRangeValue ,listFilter}) => {
  var oldFilter = {};

  const handleRedirectSetFilter = (
    pageTab,
    dateOption,
    status_type,
    dateRangeValue,
    amountType,
    checkedItemCat,
    filterStatus,
  ) => {
    const updatedDate = dateRangeValue
    .slice(0, 1)
    .map(item => ({
      ...item,
      key: "selection" 
    }));

    let updatefilter = {
      page_type: pageTab,
      searchtext: "",
      searchByOptions: "",
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
      categoryCheckedItems: filterStatus ==="no"?[]:checkedItemCat?checkedItemCat:listFilter.categoryCheckedItems,
      amountType: filterStatus ==="no"?[]:amountType || [],
      leadVerified: filterStatus ==="no"?[]:listFilter.leadVerified,
      center: filterStatus ==="no"?[]:listFilter.center,
      sourceData: filterStatus ==="no"?[]:listFilter.sourceData,
      userType: filterStatus ==="no"?[]:listFilter.userType,
    };

    oldFilter[pageTab] = updatefilter;
    localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));
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

    window.open(`/my-finance/${item.tab}`, "_blank");
    handleRedirectSetFilter(
      item.tab,
      item.date_type,
      item.status_type,
      dateToUse,
      item.amountType,
      item.checkedItemCat,
      item.filter
    );
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

export default ProgressBar;
