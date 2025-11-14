import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { IoReturnDownBackOutline, IoHome } from "react-icons/io5";
import DynamicTooltip from "../Dynamic_Tooltip";
import { FaRupeeSign } from "react-icons/fa";
import { format } from "date-fns";
import { shortFormatIndianNumber } from "../../helpers/shortFormatIndianNumber";
import { formatAmount } from "../../helpers/formatAmount";
const ReusablePieChart = ({
  data,
  title,
  dataKey,
  nameKey,
  colors,
  height = 280,
  legendPosition = "bottom",
  rupees = false,
  outerRadius = 100,
  legend = true,
  showBread,
  isSecondDateVisible,
  dateRangeValue,
  subHeading,
  Count,
  showInitialBreakdown = false,
  listFilter
}) => {
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [colorMapping, setColorMapping] = useState({});
  const [currentLegendPosition, setCurrentLegendPosition] = useState(legendPosition);
  
  const [oldFilter, setOldFilter] = useState({});

  const getRandomColor = () => {
    const availableColors = colors.filter(
      (color) => !usedColors.includes(color)
    );

    if (availableColors.length === 0) {
      usedColors = [];
      return getRandomColor();
    }

    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const selectedColor = availableColors[randomIndex];
    usedColors.push(selectedColor);
    return selectedColor;
  };

  let usedColors = [];

  const traverseData = (breadcrumb) => {
    let currentData = data;

    breadcrumb.forEach((level) => {
      const found = currentData.find(
        (item) => item.name === level || item.source === level
      );
      currentData = found?.breakdown || [];
    });

    return currentData;
  };

  const handleClick = (entry) => {
    const nextBreadcrumb = [...breadcrumb, entry[nameKey] || entry.source];
    const nextLevelData = traverseData(nextBreadcrumb);

    if (nextLevelData.length > 0) {
      setBreadcrumb(nextBreadcrumb);
      setColorMapping((prev) => ({
        ...prev,
        [nextBreadcrumb.join(" > ")]: nextLevelData?.map(() => getRandomColor()),
      }));
    } else {
      //   alert("No more data");
    }
  };

  const handleBack = () => {
    const newBreadcrumb = [...breadcrumb];
    newBreadcrumb.pop();
    setBreadcrumb(newBreadcrumb);
  };

  const handleHome = () => {
    setBreadcrumb([]);
  };



  
  const handleRedirectSetFilter = (
      pageTab,
      pageType,
      dateOption,
      status_type,
      dateRangeValue,
      checkedItem,
      sourceType
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
            leadSource:sourceType?sourceType: listFilter.sourceData,
            dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
            dateRangeValuefilter: updatedDate,
            paymentType: "",
            paymentMode: [],
            teamSearch: [],
            workOrderStatus: status_type,
            paymentStatus: status_type,
            dateOption: dateOption,
            selectedTab: pageTab,
            categoryCheckedItems:checkedItem?checkedItem:listFilter.categoryCheckedItems,
            selectedCourses:listFilter.selectedCourses,
            teamSearch:listFilter.checkedTeamItems,
            amountType: [],
            leadVerified:listFilter.leadVerified,
            center:listFilter.center,
            sourceData:sourceType?sourceType: listFilter.sourceData,
            userType:listFilter.userType,
          };
  
      setOldFilter((prevState) => {
        const newFilter = { ...prevState, [pageTab]: updateFilter };
        localStorage.setItem("allfilteroption", JSON.stringify(newFilter));
        return newFilter;
      });
    };

  const handleSegmentClick = (item) => {
    if (item.redirectData) {
      const { tab, page_type, date_type , status_type ,source_type} = item.redirectData;
      window.open(`/my-finance/${tab}`, "_blank");
      handleRedirectSetFilter(
        tab, page_type, date_type , status_type, dateRangeValue ,item.checkedItem, source_type
      );
    } 
  };
  const chartData = traverseData(breadcrumb);
  const currentColors =
    colorMapping[breadcrumb.join(" > ")] ||
    chartData?.map(() => getRandomColor());

  useEffect(() => {
    if (breadcrumb.length === 0 && showInitialBreakdown) {
      const initialData = data.find(item => item.breakdown && item.breakdown.length > 0);
      if (initialData) {
        setBreadcrumb([initialData.name || initialData.source]);
      }
    } else if (breadcrumb.length === 0) {
      setColorMapping({
        "": data?.map(() => getRandomColor()),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadcrumb, data, showInitialBreakdown]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="cstm_tooltip bg5 v-center w100 p12">
          <p className="tooltip-label fs16">{payload[0].name}: </p>
          <p className="tooltip-value v-center">
            
            {(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const updateLegendPosition = () => {
      if (window.innerWidth < 768) {
        setCurrentLegendPosition("bottom");
      } else {
        setCurrentLegendPosition(legendPosition);
      }
    };

    // Initial check
    updateLegendPosition();

    // Add resize event listener
    window.addEventListener("resize", updateLegendPosition);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", updateLegendPosition);
    };
  }, [legendPosition]);

  return (
    <div className={`chart`}>
      <>
        <div
          className={`v-center ${showBread ? "jce" : "jcsb"} ${isSecondDateVisible && "mb16"} `}
        >
          {title && <p className="dash-head ls1 fw6 mb16">{title}</p>}
          {!showInitialBreakdown && <div style={{ marginBottom: "10px" }} className="v-center jcse">
            {breadcrumb.length > 0 && (
              <>
                <DynamicTooltip direction="bottom" text="Back">
                  <IoReturnDownBackOutline
                    onClick={handleBack}
                    className="cp pr24 fc1 fs18"
                  />
                </DynamicTooltip>

                <DynamicTooltip direction="bottom" text="Home">
                  <IoHome
                    onClick={breadcrumb.length > 0 ? handleHome : null}
                    className={`fc1 fs18 ${
                      breadcrumb.length === 0 ? "disabled-input" : "cp"
                    }`}
                  />
                </DynamicTooltip>
              </>
            )}
          </div>}
        </div>
        <div className="box-center fc5">
          {subHeading} {Count}
        </div>
        <div
          className={` ${legend && "chart-placeholder"}`}
          style={{ width: "100%", height: `${height}px` }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey={breadcrumb.length ? "amount" : dataKey}
                nameKey={breadcrumb.length ? "source" : nameKey}
                outerRadius={outerRadius}
                fill="#8884d8"
                onClick={handleClick}
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentColors[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              
              {legend && (
                <Legend
                  payload={chartData?.map((item, index) => {
                    const name = item.source || item.name;
                    const amount = item.amount || item.value;
                    const percentage = item.percentage || "0";

                    return {
                      value:
                        currentLegendPosition === "right" ? (
                          <>
                          <span
                            style={{
                              display: "inline-flex",
                              justifyContent: "space-between",
                              // alignItems:"center",
                              fontFamily: "Montserrat, sans-serif",
                              fontSize: "13px",
                              maxWidth: "240px",
                            
                            }}
                          >
                            <span
                              style={{
                                // flexBasis: "75%",
                                cursor:
                                  item.breakdown &&
                                  item.breakdown.length > 0 > 0
                                    ? "pointer"
                                    : "default",
                                    whiteSpace: "pre-wrap",
                                marginRight:"12px",

                              }}
                              onClick={() =>
                                item.breakdown &&
                                item.breakdown.length > 0 &&
                                handleClick(item)
                              }
                            >
                              {name}
                            </span>
                            <span
                              style={{
                                // flexBasis: "12.5%",
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "14px",
                                cursor:
                                  item.redirectData &&
                                  Object.keys(item.redirectData).length > 0
                                    ? "pointer"
                                    : "default",
                              }}
                              onClick={() =>
                                item.redirectData &&
                                Object.keys(item.redirectData).length > 0 &&
                                handleSegmentClick(item)
                              }
                            >
                              {(amount)}
                            </span>

                            
                          </span>
                          <span
                          style={{
                            // flexBasis: "12.5%",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "12px",
                            color: "#ccc",
                            padding: "2px",
                            border: percentage ? "1px solid #ccc" : "none",
                            marginLeft: "12px",
                            borderRadius: "4px",
                            cursor:
                              item.redirectData &&
                              Object.keys(item.redirectData).length > 0
                                ? "pointer"
                                : "default",
                          }}
                          onClick={() =>
                            item.redirectData &&
                            Object.keys(item.redirectData).length > 0 &&
                            handleSegmentClick(item)
                          }
                        >
                          {percentage}
                          {percentage && (
                            "%"
                          )}
                        </span>
                          </>
                        ) : (
                          <span onClick={() => handleClick(item)}>{name}</span>
                        ),
                      type: "circle",
                      color: currentColors[index],
                      redirectData: item.redirectData,
                    };
                  })}
                  iconSize={14}
                  layout={currentLegendPosition === "right" ? "vertical" : "horizontal"}
                  verticalAlign={currentLegendPosition === "right" ? "middle" : "bottom"}
                  align={currentLegendPosition === "right" ? "right" : "center"}
                  wrapperStyle={{
                    fontSize: "14px",
                    paddingTop: "10px",
                    fontFamily: "Montserrat, sans-serif",
                    ...(currentLegendPosition === "right"
                      ? { marginBottom: 10 }
                      : {}),
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    </div>
  );
};

export default ReusablePieChart;
