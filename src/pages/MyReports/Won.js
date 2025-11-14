import React, { useEffect, useState } from "react";
import "../MyReports/Booked.css";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import Tooltip from "../../components/Tooltip";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { MdCall, MdOutlineMail } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { useTitle } from "../../hooks/useTitle";
const Won = ({
  recordList,
  setRecordList,
  displayMsg,
  allApiFilter,
  handleSortByChange,
  setAssignedToUser,
  allApidata,
  activeSortColumn,
  user,
}) => {
    useTitle("Booked - Flapone Aviation");
  
  const [wonLeadData, setWonLeadData] = useState(recordList);
  const [assigned, setAssigned] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setWonLeadData([...recordList]);
  }, [recordList]);
  const [agentOptions, setAgentOptions] = useState([
    ...JSON.parse(allApiFilter.agentOptions),
  ]);
  const handleAssignToDropdownChange = (event, uid) => {
    const updatedLeads = wonLeadData.map((lead) => {
      if (lead.userid === uid) {
        return { ...lead, flapone_agent_id: event.target.value };
      } else {
        return lead;
      }
    });
    if (event.target.value) {
      setAssignedToUser([uid], event.target.value);
    }
    setWonLeadData(updatedLeads);
  };
  const handleRowClick = (leadId) => {
    if (user.role == "1" || user.role == "2") {
      window.open(`/my-leads/${leadId}`, "_blank");
    } else {
      navigate(`/my-leads/${leadId}`);
    }
  };
  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {allApidata.total_count || 0}
      </div>
      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th
                onClick={() => handleSortByChange("userid")}
                className={activeSortColumn === "userid" ? "fc1" : ""}
              >
                <p className="box-center">
                  User ID
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("workorder_payment_status")}
                className={
                  activeSortColumn === "workorder_payment_status" ? "fc1" : ""
                }
              >
                <p className="box-center">
                Pymt Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("stage")}
                className={activeSortColumn === "stage" ? "fc1" : ""}
              >
                <p className="box-center">
                  Stage
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("name")}
                className={activeSortColumn === "name" ? "fc1" : ""}
              >
                <p className="box-center">
                  Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("mbl_eml_long")}
                className={activeSortColumn === "mbl_eml_long" ? "fc1" : ""}
              >
                <p className="box-center">
                  Verified
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th
                onClick={() => handleSortByChange("user_type")}
                className={activeSortColumn === "user_type" ? "fc1" : ""}
              >
                <p className="box-center">
                  Type
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("course_category")}
                className={activeSortColumn === "course_category" ? "fc1" : ""}
              >
                <p className="box-center">
                  Category
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th
                onClick={() => handleSortByChange("course_name")}
                className={activeSortColumn === "course_name" ? "fc1" : ""}
              >
                <p className="box-center">
                  Course
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("city")}
                className={activeSortColumn === "city" ? "fc1" : ""}
              >
                <p className="box-center">
                  City
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("selected_agent")}
                className={activeSortColumn === "selected_agent" ? "fc1" : ""}
              >
                <p className="box-center">
                  Assigned
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("total_amount_long")}
                className={
                  activeSortColumn === "total_amount_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                Total Received
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("last_amount_rec_long")}
                className={
                  activeSortColumn === "last_amount_rec_long" ? "fc1" : ""
                }
              >
                <DynamicTooltip direction="bottom" text={"Last Payment Date"}>
                <p className="box-center">
                LP Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
                </DynamicTooltip>
              </th>
              <th
                onClick={() => handleSortByChange("first_payment_date_long")}
                className={
                  activeSortColumn === "first_payment_date_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  Sales Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> 
              <th
                onClick={() => handleSortByChange("source")}
                className={activeSortColumn === "source" ? "fc1" : ""}
              >
                <p className="box-center">
                  Source
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {wonLeadData.map((lead, index) => {
              return (
                <tr key={index} onClick={() => handleRowClick(lead.userid)}>
                  <td>{lead.userid}</td>
                  <td className="ttc">
                    <span
                      style={{
                        color: giveTextColor(
                          lead.workorder_payment_status === "Completed"
                            ? "Approve"
                            : lead.workorder_payment_status === "Pending"
                              ? "Pending"
                              : lead.workorder_payment_status ===
                                  "Partial Amount"
                                ? "pending"
                                : lead.workorder_payment_status ===
                                    "Scholarship"
                                  ? "News"
                                  : "black"
                        ),
                      }}
                      className="v-center fdc"
                    >
                      {lead.workorder_payment_status
                        ? lead.workorder_payment_status
                        : "--"}
                    </span>
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        lead.stage === "Free"
                          ? "Free"
                          : lead.stage === "Running"
                            ? "Running"
                            : lead.stage === "Paid"
                              ? "News"
                              : lead.stage
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.stage}
                  </td>
                  <td className="leads-tool-fix">
                    <span
                      style={{
                        color: giveTextColor(
                          lead.user_type === "student"
                            ? "Approve"
                            : lead.user_type === "company"
                              ? "Draft"
                              : ""
                        ),
                      }}
                      className="v-center fdc"
                    >
                      {lead.name && (
                        <Tooltip title={`${lead.name} (${lead.user_type})`}>
                          {lead.name.length > 20
                            ? `${lead.name.slice(0, 20)}...`
                            : lead.name}
                        </Tooltip>
                      )}
                    </span>
                  </td>
                  <td className="lead-tools-fix">
                    <span
                      className={`ls1 ${lead.email_status > 0 || lead.mobile_status > 0  || lead.whatsapp_status > 0 ? "fc2" : "fc5"} box-center`}
                    >
                      {lead.email_status > 0 || lead.mobile_status > 0 || lead.whatsapp_status > 0 ? (
                        <>
                          {lead.email_status > 0 && (
                            <Tooltip title={`Email Verified`}>
                              <MdOutlineMail className="fs16 mr12" />
                            </Tooltip>
                          )}
                          {lead.mobile_status > 0 && (
                            <Tooltip title={`Mobile Verified`}>
                              <MdCall className="fs16" />
                            </Tooltip>
                          )}
                          
                          {lead.whatsapp_status > 0 && (
                            <Tooltip title={`Responded via WhatsApp`}>
                              <IoLogoWhatsapp className="ml12 fs16" />
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        "-"
                      )}
                    </span>
                  </td>
                  {/* <td
                    style={{
                      color: giveTextColor(
                        lead.user_type === "company"
                          ? "Company"
                          : lead.user_type === "student"
                            ? "Individual"
                            : lead.user_type === "news"
                              ? "News"
                              : lead.user_type
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.user_type}
                  </td>
                  <td>{lead.course_category}</td> */}
                  <td className="leads-tool-fix">
                    {lead.course_name && (
                      <Tooltip title={lead.course_name}>
                        {lead.course_name.length > 20
                          ? `${lead.course_name.slice(0, 20)}...`
                          : lead.course_name}
                      </Tooltip>
                    )}
                  </td>
                  <td className="leads-tool-fix">
                    {lead.city && (
                      <Tooltip title={lead.city}>
                        {lead.city.length > 10
                          ? `${lead.city.slice(0, 10)}...`
                          : lead.city}
                      </Tooltip>
                    )}
                  </td>
                  <td>
                    {agentOptions.map((leadopt, index) => {
                      if (leadopt.value == lead.flapone_agent_id) {
                        return <span key={index}>{leadopt.label}</span>;
                      }
                    })}
                  </td>
                  <td>{lead.total_amount}</td>
                  <td className="lp-date">{lead.last_amount_rec}</td>
                  <td className="lp-date">{lead.first_payment_date}</td>
                  <td
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.source ? lead.source : "-"}
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayMsg && <div className="box-center mt12">{displayMsg}</div>}
      </div>
    </>
  );
};

export default Won;
