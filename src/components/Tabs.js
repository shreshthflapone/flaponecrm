import React, { useState } from "react";
import "./Tabs.css";

const Tabs = ({
  tabs,
  filters,
  onTabChange,
  showCheckboxes,
  showFilter,
  className,
  count,
  selectedTab,
}) => {
  const [activeTab, setActiveTab] = useState(
    tabs && tabs.length > 0 ? tabs[0].value : ""
  );
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div className="tabs-container">
      {tabs && tabs.length > 0 && (
        <div className="tab-buttons ">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`tab-button ${
                selectedTab === tab.value ? "active" : ""
              } ${className}`}
              onClick={() => handleTabClick(tab.value)}
            >
              {[
                "Batch Running",
                "Batch Completed",
                "Course Completed",
                "New",
                "Batch Allotted",
                "Classes Ended",
                "All",
                "Running",
                "Completed",
                "Student Roster",
                "Batches",
                "Exams",
                "Holiday",
                "Instructor Roster",
                "Call Later",
                "Follow-up",
                "Interested",
                "Hot",
                "Booked",
                "Funnel",
              ].includes(tab.label) ? (
                <p>
                  {tab.label} (
                  {tab.label === "New"
                    ? count.new
                    : tab.label === "Batch Completed"
                      ? count.classesended
                      : tab.label === "Batch Allotted"
                        ? count.batchalloted
                        : tab.label === "All"
                          ? count.all
                          : tab.label === "Batch Running"
                            ? count.running
                            : tab.label === "Course Completed"
                              ? count.completed
                              : tab.label === "Student Roster"
                                ? count.studroaster
                                : tab.label === "Batches"
                                  ? count.batches
                                  : tab.label === "Instructor Roster"
                                    ? count.instroaster
                                    : tab.label === "Exams"
                                      ? count.exam
                                      : tab.label === "Holiday"
                                        ? count.holiday
                                        : tab.label === "Call Later"
                                          ? count.call_latter
                                          : tab.label === "Interested" ||
                                              tab.label === "Follow-up"
                                            ? count.followup
                                            : tab.label === "Hot"
                                              ? count.hot
                                              : tab.label === "Funnel"
                                                ? count.funnel
                                                : count.booked}
                  )
                </p>
              ) : (
                <p>{tab.label}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tabs;
