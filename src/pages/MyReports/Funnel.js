import React, { useState, useRef, useEffect } from "react";
import "../MyReports/Booked.css";
import { MdDelete, MdOutlineClose, MdExpandMore } from "react-icons/md";
import more from "../../assets/more1.png";
import Tooltip from "../../components/Tooltip";
import { giveTextColor } from "../../helpers/textColors";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import constant from "../../constant/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle";

const Funnel = ({
  FunnalDataTab,
  loginData,
  onFunnelRowClick,
  onCloseDetailFunnel,
  selectedLeadId,
  getAgentName,
  scrollToCommentHistory,
  detailFunnel,
  onFunnalStatusUpdate,
  allApidata,
  activeSortColumn,
}) => {
  const user = useSelector((state) => state.auth);
          useTitle("Funnel - Flapone Aviation");
  
  const navigate = useNavigate();
  const [funnelData, setFunnelData] = useState([]);
  const [activePopup, setActivePopup] = useState(false);
  const [funnelDeleteStatus, setFunnelDeleteStatus] = useState({});

  // const [detailDataFunnel, setDetailDataFunnel] = useState([]);

  const commentHistoryRef = useRef(null);
  const handleRowClick = (agent_id, name, filter) => {
    if (onFunnelRowClick) {
      onFunnelRowClick(agent_id, name, filter);
    }
  };
  const handleDetailFunnelRowClick = (leadId) => {
    navigate(`/my-leads/${leadId}`);
  };

  const handleAgentHistory = (id, user_id, agent_id, lead_id) => {
    if (onFunnalStatusUpdate) {
      onFunnalStatusUpdate(id, user_id, agent_id, lead_id);
    }
  };
  useEffect(() => {
    if (scrollToCommentHistory && commentHistoryRef.current) {
      commentHistoryRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [scrollToCommentHistory]);

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Reject";
      case "F":
        return "Pending";
      case "M":
        return "Matured";
      default:
        return "Unknown";
    }
  };

  const handleDeleteFunnel = (objectData) => {
    setActivePopup(true);
    setFunnelDeleteStatus(objectData);
  };
  const handleConfirmActive = () => {
    if(Object.keys(funnelDeleteStatus).length>0){
     let leadobj = funnelDeleteStatus;    
     handleAgentHistory(leadobj.id,leadobj.user_id,leadobj.agent_id,leadobj.lead_id);
    }
    setActivePopup(false);
  };

  const closeActivePopup = () => {
    setFunnelDeleteStatus({});
    setActivePopup(false);
  };

  const openActivePopup = () => {
    setActivePopup(true);
  };

  useEffect(() => {
    setFunnelData(FunnalDataTab);
  }, [FunnalDataTab]);
  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {allApidata.total_count || 0}
      </div>
      <div
        className="booked table-container df w100 fdc mt16 funnel-table"
        style={{ overflow: "auto" }}
      >
        <table style={{ overflow: "auto" }} className="mylead-table cp">
          <thead>
            <tr>
              <th>RM</th>
              <th colSpan="2">Total</th>
              <th colSpan="2">Today</th>
              <th colSpan="2">This Week</th>
              <th colSpan="2">This Month</th>
              <th colSpan="2">Conversion %</th>
            </tr>
            <tr className="funnel-sub-head">
              <th>Name</th>
              <th>Count</th>
              <th>Amount (&#8377;)</th>
              <th>Count</th>
              <th>Amount (&#8377;)</th>
              <th>Count</th>
              <th>Amount (&#8377;)</th>
              <th>Count</th>
              <th>Amount (&#8377;)</th>
              <th>Count (%)</th>
              <th>Amount (%)</th>
            </tr>
          </thead>
          <tbody>
            {funnelData.length > 0 ? (
              funnelData.map((lead, index) =>
                lead.agent_name === "Total" ? (
                  <tr
                    key={index}
                    className="cp total-row"
                    onClick={() =>
                      handleRowClick(
                        lead.agent_all_id,
                        "All Records",
                        lead.filter
                      )
                    }
                  >
                    <td className="ttc">
                      <b>{lead.agent_name ? lead.agent_name : "--"}</b>
                    </td>
                    <td>{lead.total_all_count}</td>
                    <td>{lead.total_all_amount}</td>
                    <td>{lead.today_all_count}</td>
                    <td>{lead.today_all_amount}</td>
                    <td>{lead.weekly_all_count}</td>
                    <td>{lead.weekly_all_amount}</td>
                    <td>{lead.monthly_all_count}</td>
                    <td>{lead.monthly_all_amount}</td>
                    <td
                      style={{
                        color: giveTextColor(
                          lead.conversion_all_percentage > 70
                            ? "Approve"
                            : lead.conversion_all_percentage > 30 &&
                                lead.conversion_all_percentage <= 70
                              ? "Draft"
                              : "red"
                        ),
                      }}
                    >
                      {lead.conversion_all_percentage}
                    </td>
                    <td
                      style={{
                        color: giveTextColor(
                          lead.conversion_all_amount > 70
                            ? "Approve"
                            : lead.conversion_all_amount > 30 &&
                                lead.conversion_all_amount <= 70
                              ? "Draft"
                              : "red"
                        ),
                      }}
                    >
                      {lead.conversion_all_amount}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={index}
                    className="cp"
                    onClick={() =>
                      handleRowClick(
                        lead.agent_id,
                        lead.agent_name,
                        lead.filter
                      )
                    }
                  >
                    <td className="ttc">
                      {lead.agent_name ? lead.agent_name : "--"}
                    </td>
                    <td>{lead.total_count}</td>
                    <td>{lead.total_amount}</td>
                    <td>{lead.today_count}</td>
                    <td>{lead.today_amount}</td>
                    <td>{lead.weekly_count}</td>
                    <td>{lead.weekly_amount}</td>
                    <td>{lead.monthly_count}</td>
                    <td>{lead.monthly_amount}</td>
                    <td
                      style={{
                        color: giveTextColor(
                          lead.conversion_percentage > 70
                            ? "Approve"
                            : lead.conversion_percentage > 30 &&
                                lead.conversion_percentage <= 70
                              ? "Draft"
                              : "red"
                        ),
                      }}
                    >
                      {lead.conversion_percentage}
                    </td>
                    <td
                      style={{
                        color: giveTextColor(
                          lead.conversion_amount > 70
                            ? "Approve"
                            : lead.conversion_amount > 30 &&
                                lead.conversion_amount <= 70
                              ? "Draft"
                              : "red"
                        ),
                      }}
                    >
                      {lead.conversion_amount}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={11}>No Records Found</td>
              </tr>
            )}
          </tbody>
        </table>
        {selectedLeadId && (
          <div
            className="detail-funnel-conatiner mt24 w100"
            ref={commentHistoryRef}
          >
            <div className="detail-funnel-img box-center more-funnel">
              <img src={more} alt="More" className="r90 pa" />
            </div>
            {getAgentName && (
              <div className="pl16 pt16 v-center w100">
                <p className="fc1 fs14 fw6 ls1 ttc">{getAgentName} Agent</p>
                <Tooltip title={"Close"}>
                  <div className="close-icon-container box-center cp bg9 ml8">
                    <MdOutlineClose
                      className="fw6 fc3  fs16"
                      onClick={onCloseDetailFunnel}
                    />
                  </div>
                </Tooltip>
              </div>
            )}
            <table className="detail-funnel mt12 w100 mylead-table cp">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Course</th>
                  <th>Amount (&#8377;)</th>
                  <th>Expected Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {detailFunnel.length > 0 ? (
                  detailFunnel.map((lead, index) => {
                    const isStatusTwo = lead.status === "2";
                    return (
                      <tr
                        key={index}
                        onClick={() => handleDetailFunnelRowClick(lead.user_id)}
                      >
                        <td>{index + 1}</td>
                        <td className="ttc">
                          <span
                            style={{
                              color: giveTextColor(
                                lead.type === "student"
                                  ? "Approve"
                                  : lead.type === "company"
                                    ? "Draft"
                                    : ""
                              ),
                            }}
                            className="v-center fdc"
                          >
                            {" "}
                            {lead.client_name && (
                              <Tooltip
                                title={`${lead.client_name} (${lead.type})`}
                              >
                                {lead.client_name.length > 20
                                  ? `${lead.client_name.slice(0, 20)}...`
                                  : lead.client_name}
                              </Tooltip>
                            )}
                          </span>
                        </td>
                        {/* <td style={{ textTransform: "capitalize" }}>{lead.type}</td> */}
                        <td>{lead.source_name ? lead.source_name : "--"}</td>

                        <td className="leads-tool-fix">
                          {lead.course_name && (
                            <Tooltip title={lead.course_name}>
                              {lead.course_name.length > 35
                                ? `${lead.course_name.slice(0, 35)}...`
                                : lead.course_name}
                            </Tooltip>
                          )}
                        </td>
                        <td>{lead.amount}</td>
                        <td
                          style={
                            lead.matured_followup === "M"
                              ? {
                                  color: giveTextColor("Approve"),
                                }
                              : {
                                  color: giveTextColor(
                                    lead.payment_expected_date_color
                                  ),
                                }
                          }
                        >
                          {lead.payment_expected_date}
                        </td>

                        <td
                          style={{
                            color: giveTextColor(
                              lead.status === "0"
                                ? "red"
                                : lead.matured_followup === "F"
                                  ? "Pending"
                                  : lead.matured_followup === "M"
                                    ? "Approve"
                                    : ""
                            ),
                            textTransform: "capitalize",
                          }}
                        >
                          {getStatusText(lead.matured_followup)}
                        </td>
                        {lead.funnel_delete===1 ? (
                          <td className="box-center">
                            <Tooltip title={"Delete"}>
                              <MdDelete
                                className="fc4 fs20 cp"
                                onClick={(e) => {
                                  e.stopPropagation();
				                          handleDeleteFunnel(lead) 
				                          /*	
                                  handleAgentHistory(
                                    lead.id,
                                    lead.user_id,
                                    lead.agent_id,
                                    lead.lead_id
                                  );*/
                                }}
                              />
                            </Tooltip>
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>No Records Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {activePopup && (
          <div className="confirmation-overlay">
            <div className="confirmation-dialog">
              <div className="confirmation-content">
                <p className="fs16 mb48 lh28">
                  Are you sure you want to Delete ?
                </p>
                <div className="confirmation-buttons">
                  <button className="btn-cancel" onClick={closeActivePopup}>
                    Cancel
                  </button>
                  <button className="btn-confirm" onClick={handleConfirmActive}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Funnel;
