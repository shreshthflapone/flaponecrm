import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import "../MyAccount/MyAccount.css";
import MyPlan from "../MyAccount/MyPlan";
import { useLocation } from "react-router-dom";
import Settings from "./Settings";
import InnerHeader from "../../components/InnerHeader";
import { useTitle } from "../../hooks/useTitle.js";

const MyAccount = () => {
  const tabs = [
    { label: "Courses", value: "my-courses" },
    { label: "Settings", value: "settings" },
  ];
  const [selectedTab, setSelectedTab] = useState("my-courses");
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
        heading="My Account"
        txtSubHeading="Effortlessly take control of your account and customize your preferences and settings to your liking."
        showButton={false}
        iconText="Add New Lead"
      />
      <Card className="bg5 mt16">
        <Tabs
          tabs={tabs}
          showCheckboxes={false}
          showFilter={false}
          onTabChange={handleTabChange}
          selectedTab={selectedTab}
          nextActiveTab={nextActiveTab}
        />
        {selectedTab === "my-courses" && <MyPlan />}
        {selectedTab === "settings" && <Settings />}
      </Card>
    </>
  );
};

export default MyAccount;
