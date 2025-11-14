import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import "../MyAccount/MyAccount.css";
import { useLocation } from "react-router-dom";
import InnerHeader from "../../components/InnerHeader";
import StudentDashboard from "./StudentDashboard.js";
import LeadDashboard from "./LeadDashboard.js";
import SalesDashboard from "./SalesDashboard.js";
import {useSelector } from "react-redux";
const DashboardPage = () => {

  const user = useSelector((state) => state.auth);

  const tabs = [
    { label: "Leads", value: "leads" },
    { label: "Students", value: "students" },
    { label: "Sales", value: "sales" },
  ];


  const [selectedTab, setSelectedTab] = useState(user.role === '1' || (user.dept_id === '5')?"sales":"leads");

  const [nextActiveTab, setNextActiveTab] = useState("1");
  const location = useLocation();
  const handleTabChange = (value) => {
    setSelectedTab(value);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam && tabs.some((tab) => tab.value === tabParam)) {
      setSelectedTab(tabParam);
    }
    // eslint-disable-next-line
  }, [location.search]);

  return (
    <>
      <InnerHeader
        heading="Dashboard"
        txtSubHeading="Here, you can quickly access key insights and manage critical areas of your operations"
        showButton={false}
        iconText="Add New Lead"
      />
      <Card className="bg5 mt16 crm-dashboard">
        <Tabs
          tabs={tabs}
          showCheckboxes={false}
          showFilter={false}
          onTabChange={handleTabChange}
          selectedTab={selectedTab}
          nextActiveTab={nextActiveTab}
        />
        {selectedTab === "sales" && <SalesDashboard />}
        {selectedTab === "students" && <StudentDashboard />}
        {selectedTab === "leads" && <LeadDashboard />}
      </Card>
    </>
  );
};

export default DashboardPage;
