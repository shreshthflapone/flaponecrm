import React, { useState, useEffect, useMemo } from "react";
import { CiSquareChevDown } from "react-icons/ci";

const FilteredDataDisplay = ({
  filterData,
  onClearAll,
  labels,
  onFilterCountChange,
  listOptions,
  border
}) => {
  console.log(filterData);
  const [showFilters, setShowFilters] = useState(false);

  const dateTypeMap = {
    enquirydate: "Enquiry Date",
    updated: "Updated",
    followupdate: "Followup Date",
    notupdated: "Not Updated",
    paymentdate: "Payment Date",
    workorderdate: "Sales Order Date",
    wo_create_date: "WO Created Date",
    last_payment_date: "Last Payment Date",
    invoice_date: "Invoice Date",
    exam_date:"Exam Date",
    holiday_date:"Holiday Date",
    "start-date":"Batch Start Date",
    "batch-start-date":"Batch Start Date",
    "end-date":"Batch End Date",
    class_date:"Class Date",
    "join-date":"Booking Date",  
    "class-date":"Class Date",
    "batch-end-date":"Batch End Date",
    enquiry_date:"Enquiry Date",
    "by-mobile":"Mobile",
    "updatedate":"Updated Date",
    created_date:"Created Date",
    registration_date:"Registration Date",
    purchase_date:"Purchase Date",
    amc_Date:"AMC Date",
    insurance_date: "Insurance Date",
    updated_date: "Updated Date",
    log_date: "Flying Log Date",
    payment_followup_date: "Payment Followup Date",
  };
  const formattedData = useMemo(() => {
    const updatedData = { ...filterData };
    delete updatedData.dateTimeType;
    if (
      filterData.page_type !== "leadstatus" &&
      filterData.page_type !== "conversionreport"
    ) {
      delete updatedData.dateMonthOptions;
    }

    const result = {};
    Object.entries(updatedData).forEach(([key, value]) => {
      if (
        key === "dateRangeTimeType" ||
        key === "page_type" ||
        key === "selectedTab" ||
        key === "datetypefilterlabel" ||
        key === "dateTimeType" ||
        key === "classDateDisplay"||
        key === "page_type_lable"||
        value === ""
      )
        return;
      if (
        key === "dateRangeValue" &&
        !updatedData.datetypefilter &&
        !updatedData.dateMonthOptions &&
        !updatedData.dateOption &&
        !updatedData.dateOptionsselect && 
        !updatedData.dateMoreOptions && 
        !updatedData.dronedateOptionsselect && 
        !updatedData.exercisedateOptionsselect && 
        !updatedData.batterydateOptionsselect &&
        !updatedData.date &&  
        filterData.page_type !== "funnel" &&
        filterData.page_type !== "studroaster"
      ) {
        return;
      }

      let label = labels[key] || key;

      if (key === "datetypefilter" || key === "dateOption" || key === "dateOptionsselect" || key==="dateMoreOptions" || key === "dronedateOptionsselect" || key === "exercisedateOptionsselect" || key === "batterydateOptionsselect" || key === "date") {
        label = "Date Type";
        value = dateTypeMap[value] || value;
      }
      if (key === "dateRangeValue" && filterData.page_type === "funnel" ) {
        label = "Date Range"; 
      }
      if (key === "selectedCourses" && Array.isArray(value)) {
        const courseLabels = value?.map((courseId) => {
          const course = listOptions?.courseListOptions?.find(
            (c) => c.value === courseId
          );
          return course ? course.label : courseId;
        });

        if (courseLabels.length > 0) {
          result[label] = courseLabels;
        }
      }
      if (key === "selectedDroneCourses" && Array.isArray(value)) {
        const courseLabels = value?.map((courseId) => {
          const course = listOptions?.courseListOptions?.find(
            (c) => c.value === courseId
          );
          return course ? course.label : courseId;
        });

        if (courseLabels.length > 0) {
          result[label] = courseLabels;
        }
      }
      
      if (key === "selectedBranch" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.branchListOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectedCategory" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.categoryOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectedClass" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.classOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectedModelType" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.modelTypeOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectedModelName" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.modelNameOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectStatus" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.droneStatusOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectExerciseStatus" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.exerciseStatusOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "batteryStatus" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.batteryStatusOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectedDrone" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.droneListOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "selectedBattery" && Array.isArray(value)) {
        const branchLabels = value?.map((branchId) => {
          const branch = listOptions?.batteryListOptions?.find(
            (c) => c.value === branchId
          );
          return branch ? branch.label : branchId;
        });

        if (branchLabels.length > 0) {
          result[label] = branchLabels;
        }
      }
      if (key === "workOrderStatus" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.workOrderStatusOption?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      
      if (key === "paymentMode" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.paymentModeItems?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "batchs" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.batchOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      
      if (key === "selectedBatch" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.batchOptionsRoster?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "holidayType" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.holidayTypeOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "departmentList" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.departmentOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "examType" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.examTypeOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }      
      if (key === "paymentMode" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.paymentModeItems?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "statusFilter" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.statusOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }

      if (key === "courseoption" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.courseOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "starrating" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.starOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }
      if (key === "listStatusOptions" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.listStatusOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }

      if (key === "categoryOptions" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.categoryOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      }



      if (key === "selectedCenter" && Array.isArray(value)) {
        const stateLabels = value?.map((stateId) => {
          const state = listOptions?.centerOptions?.find(
            (s) => s.value === stateId
          );
          return state ? state.label : stateId;
        });

        if (stateLabels.length > 0) {
          result[labels[key] || key] = stateLabels;
        }
      } else if (key === "selectedState" && Array.isArray(value)) {
        const stateLabels = value?.map((item1) => item1.label).filter(Boolean);
        if (stateLabels.length > 0) {
          result[label] = stateLabels;
        }
      }
      if (Array.isArray(value) && value.length > 0) {
        const checkeditem1s = value
          .flatMap((item1) => [item1, ...(item1.children || [])])
          .filter((item1) => item1.checked)
          .map((item1) => item1.label);

        if (checkeditem1s.length > 0) {
          result[label] = (result[label] || []).concat(checkeditem1s);
        }
      } else if (typeof value === "object" && value !== null) {
        if ("label" in value && value.label !== "" && value.value !== "") {
          result[label] = (result[label] || []).concat(value.label);
        }
      } else if (typeof value === "string" && value !== "") {
        result[label] = (result[label] || []).concat(value);
      }
    });

    return result;
  }, [filterData, labels, listOptions]);

  useEffect(() => {
    onFilterCountChange(Object.keys(formattedData).length);
  }, [formattedData, onFilterCountChange]);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    
    <>
    {Object.keys(formattedData).length > 0 && 
    <div className="p12 bg5 brd1 mt16 mb16">
      <div className="fs14 ls1 mr4 df jcsb w100">
        <span className="fw6 v-center cp" onClick={toggleFilters}>
          <CiSquareChevDown
            className={`mr4 ${showFilters ? "rotate-180" : ""}`}
          />
          Filters Applied ({Object.keys(formattedData).length})
        </span>
        <span className="fc9 cp" onClick={() => onClearAll()}>
          x Clear
        </span>
      </div>

      {showFilters && Object.keys(formattedData).length > 0 && (
        <div className="v-center mt8 dash-chip-container fww">
          {Object.entries(formattedData).map(([label, values]) => (
            <>
              <span className="fs14 ml10 mt10">{label}:</span>
              {values.map((val, index) => (
                <div
                  key={index}
                  className="dash-chip p10 br24 mt10 fc5 closefilter fs12 ml10 df jcsb"
                >
                  {val}
                </div>
              ))}
            </>
          ))}
        </div>
      )}
    </div>}
     {border &&  <div className="brd-b1"></div>}
    </>

  );
};

export default FilteredDataDisplay;
