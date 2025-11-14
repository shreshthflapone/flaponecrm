import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import InnerHeader from "../../components/InnerHeader";
import AffiliateForm from "./AffiliateForm";
import AffiliateStudent from "../../components/AffiliateStudent";
import StudentHistory from "./History";
import Tooltip from "../../components/Tooltip";
import { MdOutlineVerified, MdCall, MdOutlineMail } from "react-icons/md";

import "../MyReports/MyReports.css";
import "./MyAffiliate.css";

const studentData = [
  {
    user_id: 1,
    lead_status: "Hot",
    stage: "Paid",
    name: "Rahul Sharma",
    verified: "1",
    interested_in: "Books, Cricket",
    city: "Jaipur",
    rm: "Shivam Kumar",
    followup: "",
    enquiry_date: "2025-09-25",
    updated_date: "2025-11-08",
    booking_date: "2025-12-25",
  },
  {
    user_id: 2,
    lead_status: "New",
    stage: "Free",
    name: "Sanjay Gupta",
    verified: "0",
    interested_in: "Books, Cricket",
    city: "Jaipur",
    rm: "Shivam Kumar",
    followup: "",
    enquiry_date: "2025-09-25",
    updated_date: "2025-11-08",
    booking_date: "2025-12-25",
  },
];

const studentHistoryData = {
  "12 Nov 2025": [
    {
      id: "449627",
      user_id: "126488",
      lead_status: "interested",
      lead_comment: "Comment: Interested via Email",
      sts_date: "2025-11-12 14:57:44",
      sts_user_name: "System",
      sts_date_time_ago: "2h ago",
      sts_date_new: "12 Nov 2025 02:57 PM",
    },
  ],
};

const AffiliateDetails = () => {
  const { alias, id, viewStatus } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tabs = viewStatus
    ? [
        { label: "Overview", value: "overview" },
        { label: "Student List", value: "student_list" },
        { label: "Affiliate Details", value: "affiliate_form" },
      ]
    : [
        { label: "Affiliate Details", value: "affiliate_form" },
        { label: "Student List", value: "student_list" },
        { label: "Overview", value: "overview" },
      ];

  const [selectedTab, setSelectedTab] = useState(alias || "affiliate_form");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeSortColumn, setActiveSortColumn] = useState("id");

  const handleTabChange = (value) => {
    let path = `/affiliate-details/${value}`;
    
    if (id && viewStatus) {
      path = `/affiliate-details/${value}/${id}/${viewStatus}`;
    } else if (id) {
      path = `/affiliate-details/${value}/${id}`;
    }

    navigate(path);
    setSelectedTab(value);
  };

  useEffect(() => {
    if (selectedTab === "student_list") {
      handleSortByChange("id");
    }
  }, [selectedTab]);

  const handleSortByChange = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
    setActiveSortColumn(field);
  };

  return (
    <>
      {id || viewStatus ? (
        <div className="lead-detail-container df">
            <div className="left-side-detail">
              <div className="detail-header mb16 df jcsb fww pl12 desk-lead-detail">
                <div className="header-left v-center left-header-tooltip">
                  <Tooltip
                    title={"Login"}
                    place={"bottom"}
                  >
                    <div className="green-status mr8 "></div>
                  </Tooltip>
                  <div className="comp-details">
                    <div className="comp-name v-center fww">
                      <p className="fs20 fw6 mr4 ls1">Shreshth Gahlot</p>
                      <p className="fs16 propship ttc">(Agency)</p>
                      <p className="ml8 mt4">
                        <Tooltip title={"KYC Completed"}>
                          <MdOutlineVerified
                            className="fc13 fs18"
                          />
                        </Tooltip>
                      </p>
                    </div>
                    <div className="comp-address df mt4 fs14 aic">
                      <p className="fs10 ls2 pl12 pr12 pt4 pb4 fc2 brd4 mr8 br24">
                        Active
                      </p>
                      <p className="agent-city mr4 v-center">
                        <span className="lead-id">65803</span>
                        <span className="ml4">|</span>
                      </p>
                      <p className="agent-city mr4 ttc">
                        <span className="lead-id">Jaipur</span>
                        <span className="ml4">|</span>
                      </p>
                      <p className="agent-city ml4 ttc">
                        <Tooltip title={"1234567890"}>
                          <MdCall className="cp fc1 mr8" size={18} />
                        </Tooltip>
                      </p>
                      <p className="agent-city mr4 ttc">
                        <Tooltip title={"shreshth@flapone.com"}>
                          <MdOutlineMail className="cp fc1 mr8" size={18} />
                        </Tooltip>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      ) : (
        <InnerHeader
          heading="Inventory & Activity Records"
          txtSubHeading="A centralized log of drones, batteries, and training exercises. Keeping these records up-to-date is critical for efficient resource management and training effectiveness."
          showButton={false}
          iconText="Add New Lead"
        />
      )}

      <Card className="bg5 mt16 pb16">
        {id || viewStatus ? (
          <Tabs
            tabs={tabs}
            showCheckboxes={false}
            showFilter={false}
            onTabChange={handleTabChange}
            selectedTab={selectedTab}
          />
        ) : (null)}

        {selectedTab === "affiliate_form" && (
          <AffiliateForm view={viewStatus} affiliateid={id} />
        )}
        {selectedTab === "student_list" && (
          <AffiliateStudent
            recordList={studentData}
            allApidata=""
            handleSortByChange={handleSortByChange}
            activeSortColumn={activeSortColumn}
            pageCount={2}
            hiddenFilters={['affiliates']}
            hiddenColumns={['affiliate_name']}
          />
        )}
        {selectedTab === "overview" && (
          <StudentHistory recordList={studentHistoryData} />
        )}
      </Card>
    </>
  );
};

export default AffiliateDetails;