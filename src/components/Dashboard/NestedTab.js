import React, { useState } from "react";
// import "./NestedTab.css";
import LeadTeamData1 from "../../data/Dashboard/LeadTableData1";

const NestedTabs = () => {
  const [activeTab, setActiveTab] = useState(Object.keys(LeadTeamData1)[0]); // Main tabs: Categories, Teams
  const [activeSubTab, setActiveSubTab] = useState(null); // Sub-tabs for the active main tab
  const [activeBreakdownTab, setActiveBreakdownTab] = useState(null); // Nested breakdown tabs

  const getAllDates = (items) => {
    const datesSet = new Set();
    const traverse = (items) => {
      items.forEach((item) => {
        if (item.counts) {
          Object.keys(item.counts).forEach((date) => datesSet.add(date));
        }
        if (item.breakdown) {
          traverse(item.breakdown);
        }
      });
    };
    traverse(items);
    return Array.from(datesSet).sort();
  };

  // Data for the active tab and sub-tab
  const activeData = LeadTeamData1[activeTab];
  const subTabData = activeSubTab
    ? activeData.find((item) => item.name === activeSubTab)
    : null;
  const breakdownData = activeBreakdownTab
    ? subTabData?.breakdown?.find((item) => item.name === activeBreakdownTab)
    : subTabData;

  const displayedData = breakdownData?.breakdown || subTabData?.breakdown || activeData;

  // Dates for the displayed data
  const allDates = getAllDates(displayedData);

  return (
    <div className="app">
      {/* Main Tabs */}
      <div className="tabs">
        {Object.keys(LeadTeamData1).map((tabKey) => (
          <div
            key={tabKey}
            className={`tab ${activeTab === tabKey ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tabKey);
              setActiveSubTab(null);
              setActiveBreakdownTab(null); // Reset nested tabs when switching main tab
            }}
          >
            {tabKey}
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      {activeData && (
        <div className="sub-tabs">
          {activeData.map((item) => (
            <div
              key={item.name}
              className={`sub-tab ${activeSubTab === item.name ? "active" : ""}`}
              onClick={() => {
                setActiveSubTab(item.name);
                setActiveBreakdownTab(null); // Reset breakdown tabs
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* Breakdown Tabs */}
      {subTabData?.breakdown && (
        <div className="breakdown-tabs">
          {subTabData.breakdown.map((item) => (
            <div
              key={item.name}
              className={`breakdown-tab ${
                activeBreakdownTab === item.name ? "active" : ""
              }`}
              onClick={() => setActiveBreakdownTab(item.name)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="ld-dash mt12">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {allDates.map((date) => (
                  <th key={date}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  {allDates.map((date) => (
                    <td key={date}>{item.counts ? item.counts[date] || 0 : 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NestedTabs;
