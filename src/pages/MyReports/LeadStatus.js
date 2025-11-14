import React, { useEffect, useState } from "react";
import "../MyReports/LeadConversion.css";
import { format, startOfMonth, endOfMonth } from "date-fns";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import { useTitle } from "../../hooks/useTitle";

const LeadStatus = ({
  data,
  columnMapping,
  displayMsg,
  conversionData,
  onRedirect,
}) => {
    useTitle("Lead Report - Flapone Aviation");
  
  const [evenRows, setEvenRows] = useState([]);

  useEffect(() => {
    // Find the even rows by filtering data
    const evenRows = data.filter((_, index) => index % 2 === 0);
    setEvenRows(evenRows);
  }, [data]);

  const isDataEmpty = data.length === 0;
  var oldFilter = {};
  const formatDateRange = (dateRange) => {
    const [start, end] = dateRange.split(" | ").map((date) => {
      const [day, month, year] = date
        .split("-")
        .map((part) => parseInt(part, 10));
      return new Date(year, month - 1, day);
    });

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
  const handleRedirectSetFilterReports = (
    pageTab,
    dateOption,
    dateRangeValue
  ) => {
    const getoldfilter = localStorage.getItem("allfilteroption");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }

    var currenttabfilter = oldFilter["leadstatus"]
      ? oldFilter["leadstatus"]
      : "";
    const defaultDateRange = `${format(startOfMonth(new Date()), "dd-MM-yyyy")} | ${format(endOfMonth(new Date()), "dd-MM-yyyy")}`;

    let updatefilter = {
      page_type: pageTab,
      datetypefilter: dateOption,
      dateOption: dateOption,
      dateRangeValue:
        dateRangeValue || currenttabfilter.dateRangeValue || defaultDateRange,
      checkedTeamItems: currenttabfilter.checkedTeamItems || [],
      planStatus: {
        label: "Select Stage",
        value: "",
      },
      leadStatus: "",
      leadSource: {
        label: "Select Source",
        value: "",
      },
      selectedState: currenttabfilter.selectedState || [],
      assignee: {
        label: "Assigned Status",
        value: "",
      },
      categoryCheckedItems: currenttabfilter.categoryCheckedItems || [],
      selectedCourses: currenttabfilter.selectedCourses,
      companyType: {
        label: "User Type",
        value: "",
      },
      selectedVerified: [],
      dateRangeValuefilter:
        currenttabfilter.dateRangeValuefilter ||
        formatDateRange(dateRangeValue || defaultDateRange),
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
//onClick={handleNavLinkClickSamePage("followup", "followupdate")}

  const handleNavLinkClickSamePage =
    (pageTab, dateOption, dateRangeValue) => (e) => {
      e.preventDefault();
      handleRedirectSetFilterReports(pageTab, dateOption, dateRangeValue);
      onRedirect(pageTab);
    };
  return (
    <>
      <div className="lead-card-content card-content df pt24 brd-b1 pb24 pl24 jcc">
        <div
          className="card-item df fdc jcc br4"
        >
          <DynamicTooltip direction="bottom" text={"Total Leads Worked On"}>
            <p className="fs28 fc1 mb8">
              {conversionData && conversionData.total_sts
                ? conversionData.total_sts
                : 0}
            </p>
            <p className="fw6 fs16 fc5">Total Leads</p>
          </DynamicTooltip>
        </div>

        <div className="card-item df br4 jcc fdc">
          <p className="fs28 fc1 mb8">
            {conversionData && conversionData.total_new
              ? conversionData.total_new
              : 0}
          </p>
          <p className="fw6 fs16 fc5">New</p>
        </div>
        <div
          className="card-item df br4 jcc fdc"
        >
          <p className="fs28 fc1 mb8">
            {conversionData && conversionData.total_hot
              ? conversionData.total_hot
              : 0}
          </p>
          <p className="fw6 fs16 fc5">Hot</p>
        </div>
        <div
          className="card-item df br4 jcc fdc"
        >
          <p className="fs28 fc1 mb8">
            {conversionData && conversionData.total_followup
              ? conversionData.total_followup
              : 0}
          </p>
          <p className="fw6 fs16 fc5">Interested</p>
        </div>
        <div
          className="card-item df br4 jcc fdc"
        >
          <p className="fs28 fc1 mb8">
            {conversionData && conversionData.total_call_latter
              ? conversionData.total_call_latter
              : 0}
          </p>
          <p className="fw6 fs16 fc5">Call Later</p>
        </div>
        <div className="card-item df br4 jcc fdc">
          <p className="fs28 fc1 mb8">
            {conversionData && conversionData.total_no_intrested
              ? conversionData.total_no_intrested
              : 0}
          </p>
          <p className="fw6 fs16 fc5">Not Interested</p>
        </div>
        <div className="card-item df br4 jcc fdc">
          <p className="fs28 fc1 mb8">
            {conversionData && conversionData.total_no_response
              ? conversionData.total_no_response
              : 0}
          </p>
          <p className="fw6 fs16 fc5">No Response</p>
        </div>
        {/* <div className="card-item df br4 jcc fdc">
          <p className="fs28 fc1 mb8">{conversionData && conversionData.total_junk ? conversionData.total_junk : 0}</p>
          <p className="fw6 fs16 fc5">Junk</p>
        </div> */}
      </div>

      <div
        className="table-container df w100 fdc mt16 booked"
        style={{ overflow: "auto" }}
      >
        <p className="tdu fc1 fs16 ls1 fw6 pl16 mb16 mt16">Lead Report</p>
        {isDataEmpty ? (
          <p className="fs16 fc5 pl16 box-center">No records available</p>
        ) : (
          <table>
            <thead>
              <tr>
                {Object.keys(columnMapping).map((columnName, index) => (
                  <th key={index}>
                    {columnName === "Total Leads" ? (
                      <DynamicTooltip
                        direction="bottom"
                        text={"Total Leads Worked On"}
                      >
                        {columnName}
                      </DynamicTooltip>
                    ) : (
                      columnName
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((rowData, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={evenRows.includes(rowData) ? "even" : ""}
                >
                  {Object.values(columnMapping).map((dataKey, colIndex) => (
                    <td key={colIndex}>{rowData[dataKey]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default LeadStatus;
