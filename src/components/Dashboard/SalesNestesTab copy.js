import React, { useState, useEffect } from "react";
import "./NestTab.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import SalesLeadTabData from "../../data/Dashboard/SalesLeadTabData";
import SmallLoader from "../SmallLoader";
import { format } from "date-fns";
import formatDateRange from "../../helpers/formatDateRange";
import newFormatDateRange from "../../helpers/newFormatDateRange";
import DynamicTooltip from "../../components/Dynamic_Tooltip";

const SalesNestTab = ({ dateRangeValue, leadVerified, }) => {
  const [activeTab, setActiveTab] = useState(SalesLeadTabData[0].tabName);
  const [activeCategory, setActiveCategory] = useState("All");
  const [breakdownData, setBreakdownData] = useState([]);
  const [dates, setDates] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTabData, setExpandedTabData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  var oldFilter = {};

  useEffect(() => {
    setIsLoading(true);
    const currentTabData = SalesLeadTabData.find((tab) => tab.tabName === activeTab);
    const defaultCategory = currentTabData.categories.find(
      (category) => category.name === "All"
    );

    setTimeout(() => {
      if (defaultCategory?.breakdown) {
        setBreakdownData(defaultCategory.breakdown);

        const allDates = defaultCategory.breakdown.flatMap((item) =>
          Object.keys(item.date)
        );
        setDates([...new Set(allDates)]);
      }
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setActiveCategory("All");
    setSelectedIndex(null);
    setExpandedTabData([]);
  };

  const handleCategoryClick = (categoryName) => {
    setIsLoading(true);
    setActiveCategory(categoryName);
    setSelectedIndex(null);
    setExpandedTabData([]);

    const currentTabData = SalesLeadTabData.find((tab) => tab.tabName === activeTab);
    const selectedCategory = currentTabData.categories.find(
      (category) => category.name === categoryName
    );

    setTimeout(() => {
      if (selectedCategory?.breakdown) {
        setBreakdownData(selectedCategory.breakdown);

        const allDates = selectedCategory.breakdown.flatMap((item) =>
          Object.keys(item.date)
        );
        setDates([...new Set(allDates)]);
      } else {
        setBreakdownData([]);
        setDates([]);
      }
      setIsLoading(false);
    }, 500);
  };
  const hanldeSubCategoryItemClick = (categoryName, index) => {
    console.log(categoryName);
    setIsLoading(true);
    setSelectedIndex(index);
    const currentTabData = SalesLeadTabData.find((tab) => tab.tabName === activeTab);
    console.log(currentTabData);
    const selectedCategory = currentTabData?.categories?.find(
      (category) => category.name === activeCategory
    );
    console.log(selectedCategory);

    setTimeout(() => {
      if (selectedCategory?.expandBreakdown) {
        const filterData = selectedCategory?.expandBreakdown?.find(
          (person) => person.name === categoryName
        );

        setBreakdownData(filterData?.breakdown || []);
        console.log(filterData?.breakdown);

        const allDates = selectedCategory?.breakdown?.flatMap((item) =>
          Object.keys(item?.date || {})
        );
        console.log(allDates);
        setDates([...new Set(allDates)]);
      } else {
        setBreakdownData([]);
        setDates([]);
      }
      setIsLoading(false);
    }, 500);
  };

  const toggleExpand = (index) => {
    setExpandedRows((prevState) => ({
      [index]: !prevState[index],
    }));
  };

  const currentTabData = SalesLeadTabData.find((tab) => tab.tabName === activeTab);
  const handleRedirectSetFilter = (pageTab, dateOption, dateRangeValue) => {
    let updatefilter = {
      page_type: pageTab,
      datetypefilter: dateOption,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      checkedTeamItems: [],
      planStatus: {
        label: "Select Stage",
        value: "",
      },
      leadStatus: "",
      leadSource: {
        label: "Select Source",
        value: "",
      },
      selectedState: [],
      assignee: {
        label: "Assigned Status",
        value: "",
      },
      categoryCheckedItems: [],
      selectedCourses: [],
      companyType: {
        label: "User Type",
        value: "",
      },
      selectedVerified: leadVerified,
      dateRangeValuefilter: dateRangeValue,
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
  const handleSegmentClick = (item, date) => {
    if (item) {
      const dateToUse =
        date === "totalCount"
          ? dateRangeValue
          : newFormatDateRange(formatDateRange(date));

      window.open(`/${item.url}/${item.tab}`, "_blank");
      handleRedirectSetFilter(item.tab, item.date_type, dateToUse);
    }
  };

  return (
    <div className="container">
      <div className="tabs">
        {SalesLeadTabData.map((tab) => (
          <div
            key={tab.tabName}
            className={`tab ${activeTab === tab.tabName ? "active" : ""}`}
            onClick={() => handleTabClick(tab.tabName)}
          >
            {tab.tabName}
          </div>
        ))}
      </div>

      <div className="buttons">
        {currentTabData.categories.map((category) => (
          <p
            key={category.name}
            className={`btn ${activeCategory === category.name ? "active" : ""}`}
            onClick={() => {
              handleCategoryClick(category.name);
              setExpandedTabData(category.expandBreakdown);
            }}
          >
            {category.name}
            {category.percentage !== null && ` (${category.percentage}%)`}
          </p>
        ))}
      </div>
      {(activeTab === "Team" || activeTab === "Category") && expandedTabData?.length > 0 && (
        <div className="buttons">
          {expandedTabData.map((expData, index) => (
            <p
              key={expData.name}
              className={`btn ${selectedIndex === index ? "active" : ""}`}
              onClick={() => hanldeSubCategoryItemClick(expData.name, index)}
            >
              {expData.name}
            {expData.percentage !== null && ` (${expData.percentage}%)`}

            </p>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="content ld-dash box-center loader">
          <SmallLoader />
        </div>
      ) : breakdownData.length === 0 ? (
        <div className="content ld-dash box-center no-data ls1">
          <p>No data available</p>
        </div>
      ) : (
        <div className="content ld-dash">
          <div className="table-wrapper lead-tb">
            <table>
              <thead>
                <tr>
                  <th> {activeTab === "Team" ? "Name" : "Heading"}</th>
                  {activeTab !== "Team" && <th>Total</th>}
                  {dates.map((date, index) => (
                    <th key={index}>{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdownData.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        className={`tal v-center ls1 ${item.expandBreakdown && "cp fw6"}`}
                        onClick={() => toggleExpand(index)}
                      >
                        {item.name}
                        {item.expandBreakdown && (
                          <button className="expand-btn">
                            {expandedRows[index] ? <FaMinus /> : <FaPlus />}
                          </button>
                        )}
                      </td>
                      {activeTab !== "Team" && (
                        <td
                          className={`${item.expandBreakdown && "fw6"} ${!item.expandBreakdown && "cp"} leads-tool-fix`}
                          onClick={() =>
                            handleSegmentClick(item.redirectData, "totalCount")
                          }
                        >
                          <DynamicTooltip
                            direction="left"
                            text={"Total count as per filter"}
                          >
                            <span className="lc2 text-row">
                              {item.totalCount}
                            </span>
                          </DynamicTooltip>
                        </td>
                      )}
                      {dates.map((date, subIndex) => (
                        <td
                          key={subIndex}
                          className={`${item.expandBreakdown && "fw6"} ${!item.expandBreakdown && "cp"} `}
                          onClick={() =>
                            handleSegmentClick(item.redirectData, date)
                          }
                        >
                          <DynamicTooltip
                            direction="left"
                            text={`Lead ${item.name} on 19 Jan 25`}
                          >
                            <span className="lc2 text-row">
                              {item.date[date] !== undefined
                                ? item.date[date]
                                : "-"}
                            </span>
                          </DynamicTooltip>
                        </td>
                      ))}
                    </tr>
                    {expandedRows[index] &&
                      item.expandBreakdown?.map((subItem, subIndex) => (
                        <tr
                          key={`${index}-${subIndex}`}
                          className={`expanded-row ml16 ${item.expandBreakdown && "fw5"}`}
                        >
                          <td className="tal">{`${subItem.name}`}</td>
                          <td
                            onClick={() =>
                              handleSegmentClick(
                                subItem.redirectData,
                                "totalCount"
                              )
                            }
                            className="cp"
                          >
                            {subItem.totalCount}
                          </td>
                          {dates.map((date, dateIndex) => (
                            <td
                              key={dateIndex}
                              onClick={() =>
                                handleSegmentClick(subItem.redirectData, date)
                              }
                              className="cp"
                            >
                              <DynamicTooltip
                                direction="left"
                                text={"Dynamic message"}
                              >
                                <span className="lc2 text-row">
                                  {subItem.date[date] !== undefined
                                    ? subItem.date[date]
                                    : "-"}
                                </span>
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
  );
};

export default SalesNestTab;
