import React, { useEffect, useState } from "react";
import "../MyReports/LeadConversion.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth } from "date-fns";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import { useTitle } from "../../hooks/useTitle";

const LeadConversion = ({
  data,
  columnMapping,
  conversionData,
  displayMsg,
  onRedirect,
}) => {
  const [evenRows, setEvenRows] = useState([]);
  const navigate = useNavigate();
  useTitle("Conversion Report - Flapone Aviation");
  

  useEffect(() => {
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

  const dateRange = "01-11-2024 | 30-11-2024";
  const formattedRange = formatDateRange(dateRange);

  const handleRedirectSetFilter = (pageTab, dateOption, dateRangeValue) => {
    const getoldfilter = localStorage.getItem("allfilteroption");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }

    var currenttabfilter = oldFilter["conversionreport"]
      ? oldFilter["conversionreport"]
      : "";

    const defaultDateRange = `${format(startOfMonth(new Date()), "dd-MM-yyyy")} | ${format(endOfMonth(new Date()), "dd-MM-yyyy")}`;

    let updatefilter = {
      page_type: pageTab,
      searchtext: "",
      searchByOptions: "",
      listStatusOptions: [],
      serviceStatus: "",
      leadSource: "",
      dateRangeValue:
        dateRangeValue || currenttabfilter.dateRangeValue || defaultDateRange,
      dateRangeValuefilter:
        currenttabfilter.dateRangeValuefilter ||
        formatDateRange(dateRangeValue || defaultDateRange),
      paymentType: "",
      paymentMode: [],
      paymentStatus: [],
      teamSearch: currenttabfilter.checkedTeamItems || [],
      workOrderStatus: [],
      dateOption: dateOption,
      selectedTab: pageTab,
      selectedCourses: currenttabfilter.selectedCourses,
      categoryCheckedItems: currenttabfilter.categoryCheckedItems || [],
    };

    oldFilter[pageTab] = updatefilter;
    localStorage.setItem("allfilteroption", JSON.stringify(oldFilter));
  };

  const handleNavLinkClick = (pageTab, dateOption, dateRangeValue) => (e) => {
    e.preventDefault();
    handleRedirectSetFilter(pageTab, dateOption, dateRangeValue);
    navigate(`/my-finance/${pageTab}`);
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

    var currenttabfilter = oldFilter["conversionreport"]
      ? oldFilter["conversionreport"]
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

  const handleNavLinkClickSamePage =
    (pageTab, dateOption, dateRangeValue) => (e) => {
      e.preventDefault();
      handleRedirectSetFilterReports(pageTab, dateOption, dateRangeValue);
      onRedirect(pageTab);
    };

  return (
    <>
      <div className="card-content df pt24 brd-b1 pb24 pl24 jcc">
        <div
          className="card-item df fdc jcc br4"
        >
          <span className="fs28 fc1 mb8">{conversionData?.total_sts || 0}</span>
          <p className="fw6 fs16 fc5">Total Leads Worked On</p>
        </div>
         <div
          className="card-item df fdc jcc br4"
        >
          <span className="fs28 fc1 mb8">{conversionData?.total_gensts || 0}</span>
          <p className="fw6 fs16 fc5">Total Generated Leads</p>
        </div>
        <div
          className="card-item df fdc jcc br4 cp"
          onClick={handleNavLinkClickSamePage("booked", "workorderdate")}
        >
          <span className="fs28 fc1 mb8">
            {conversionData?.total_booked || 0}
          </span>
          <p className="fw6 fs16 fc5">Total Booked</p>
        </div>
        <div
          className="card-item df fdc jcc br4 value-link w100 cp"
          onClick={handleNavLinkClick("workorder", "wo_create_date")}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {conversionData?.total_amount || 0}
          </span>
          <p className="fw6 fs16 fc5">Sales Amount</p>
        </div>
        <div
          className="card-item df fdc jcc br4 cp"
          onClick={handleNavLinkClick("payments")}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {conversionData?.total_amount_received || 0}
          </span>
          <p className="fw6 fs16 fc5">Received Amount</p>
        </div>
        <div className="card-item df fdc jcc br4">
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {conversionData?.filesize_total || 0}
          </span>
          <p className="fw6 fs16 fc5">Avg Ticket Size</p>
        </div>
      </div>
      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <p className="tdu fc1 fs16 ls1 fw6 pl16 mb16 mt16">Lead Conversion</p>
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
                      ):columnName === "Genrated Leads" ? (
                        <DynamicTooltip
                        direction="bottom"
                        text={"Total Genrated Leads"}
                      >
                       {columnName}
                      </DynamicTooltip> 
                    ):columnName === "Conversion (%)" ? (
                        <DynamicTooltip
                        direction="bottom"
                        text={"Lead conversion as per worked leads"}
                      >
                       <span>Conversion (%)</span><br/> Work Leads
                      </DynamicTooltip> 
                    ):columnName === "Conversion Gen Leads (%)" ? (
                        <DynamicTooltip
                        direction="bottom"
                        text={"Lead conversion as per generated leads"}
                      >
                       <span>Conversion (%)</span><br/> Generated Leads
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
                    <td
                      key={colIndex}
                      className={
                        ["filesize", "conversion","conversion_gen", "date","totalLeads","genLeads"].includes(dataKey)
                          ? ""
                          : dataKey === "totalLeads" || dataKey === "totalBooked" || 
                            dataKey === "totalAmount" || dataKey === "totalAmountReceived"
                          ? "cp"
                          : ""
                      }
                      onClick={
                        ["filesize", "conversion","conversion_gen", "date","totalLeads","genLeads"].includes(dataKey)
                          ? null
                          : dataKey === "totalLeads" ||
                              dataKey === "totalBooked"
                            ? handleNavLinkClickSamePage(
                                dataKey === "totalLeads"
                                  ? "all"
                                  : dataKey === "totalBooked"
                                    ? "booked"
                                    : "",
                                dataKey === "totalLeads"
                                  ? "updated"
                                  : dataKey === "totalBooked"
                                    ? "workorderdate"
                                    : "",
                                rowData["daterange"]
                              )
                            : handleNavLinkClick(
                                dataKey === "totalAmount"
                                  ? "workorder"
                                  : dataKey === "totalAmountReceived"
                                    ? "payments"
                                    : "",
                                dataKey === "totalAmount"
                                  ? "wo_create_date"
                                  : "",
                                rowData["daterange"]
                              )
                      }
                    >
                      {rowData[dataKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {displayMsg && <div className="box-center mt12">{displayMsg}</div>}
      </div>
    </>
  );
};

export default LeadConversion;
