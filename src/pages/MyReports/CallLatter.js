import React, { useEffect, useState } from "react";
import "../MyReports/Booked.css";
import { getStatusBackgroundColor } from "../../helpers/statusColors";
import SingleDropdown from "../../components/SingleDropdown";
import Tooltip from "../../components/Tooltip";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { MdCall, MdClose, MdOutlineCheck, MdOutlineMail } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import Battery from "../../assets/battery.svg";
import { useTitle } from "../../hooks/useTitle";
import DynamicTooltip from "../../components/Dynamic_Tooltip";

const CallLatter = ({
  recordList,
  setRecordList,
  displayMsg,
  allApiFilter,
  handleSortByChange,
  setAssignedToUser,
  allApidata,
  activeSortColumn,
  user,
  actionAccess
}) => {
        useTitle("Call Later - Flapone Aviation");
  
  const [followUpData, setFollowUpData] = useState(recordList);
  const [assigned, setAssigned] = useState({});
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setFollowUpData([...recordList]);
  }, [recordList]);
  const [agentOptions, setAgentOptions] = useState([
    ...JSON.parse(allApiFilter.agentOptions),
  ]);

  const currentDate = moment().format("DD/MM/YYYY");
  const handleCheckboxChange = (uid) => {
    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.includes(uid)) {
        return prevSelectedLeads.filter((userid) => userid !== uid);
      } else {
        return [...prevSelectedLeads, uid];
      }
    });
  };

  const handleAssignToClick = () => {
    if (assigned.value) {
      const updatedLeads = followUpData.map((lead) => {
        if (selectedLeads.includes(lead.userid)) {
          return { ...lead, flapone_agent_id: assigned.value };
        } else {
          return lead;
        }
      });
      setAssignedToUser(selectedLeads, assigned.value);
      setFollowUpData(updatedLeads);
      setSelectedLeads([]);
      setAssigned({});
      setAssignToPopupVisible(false);
    }
  };
  const handleAssignToDropdownChange = (event, uid) => {
    const updatedLeads = followUpData.map((lead) => {
      if (lead.userid === uid) {
        return { ...lead, flapone_agent_id: event.target.value };
      } else {
        return lead;
      }
    });
    if (event.target.value) {
      setAssignedToUser([uid], event.target.value);
    }
    setFollowUpData(updatedLeads);
  };
  const handleHeaderCheckboxChange = (event) => {
    const allLeadIds = followUpData.map((lead) => lead.userid);
    setSelectedLeads(event.target.checked ? allLeadIds : []);
  };

  const isHeaderCheckboxChecked =
    selectedLeads.length === followUpData.length && selectedLeads.length > 0;

  const handleAssignToButtonClick = () => {
    setAssignToPopupVisible(true);
  };
  const closePopup = () => {
    setAssignToPopupVisible(false);
  };
  const handleRowClick = (leadId) => {
    if(user.role=='1' || user.role=='2'){
      window.open(`/my-leads/${leadId}`, '_blank');
    }else{
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
              <th>
                <label className="checkbox-label">
                  <input
                    disabled={actionAccess}
                    type="checkbox"
                    className="cp"
                    checked={isHeaderCheckboxChecked}
                    onChange={handleHeaderCheckboxChange}
                  />
                </label>
              </th>
              {/* <th>
                <p className="box-center">
                  Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
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
                onClick={() => handleSortByChange("last_lead_status")}
                className={activeSortColumn === "last_lead_status" ? "fc1" : ""}
              >
                <p className="box-center">
                  Status
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
                onClick={() => handleSortByChange("second_page_rich")}
                className={activeSortColumn === "second_page_rich" ? "fc1" : ""}
              >
                <p className="box-center">
                  2-Step
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
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
              {/* <th
                onClick={() => handleSortByChange("signup_long")}
                className={activeSortColumn === "signup_long" ? "fc1" : ""}
              >
                <p className="box-center">
                  Signup
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th
                onClick={() => handleSortByChange("last_enquiry_posted_long")}
                className={activeSortColumn === "last_enquiry_posted_long" ? "fc1" : ""}
              >
                <p className="box-center">
                   <DynamicTooltip text="Last Enquiry Posted" direction="bottom">
                    <span>Last Enquiry</span>
                  </DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("last_status_update_date_long")}
                className={
                  activeSortColumn === "last_status_update_date_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  Last Update
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("last_followup_long")}
                style={{ width: 90 }}
                className={activeSortColumn === "last_followup_long" ? "fc1" : ""}
              >
                <p className="box-center">
                  Follow-up
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
            {followUpData.map((lead, index) => {
              return (
                <tr key={index} onClick={() => handleRowClick(lead.userid)}>
                  <td>
                    <label
                      className="checkbox-label cp p10"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <input
                        disabled={actionAccess}
                        type="checkbox"
                        className="cp"
                        checked={selectedLeads.includes(lead.userid)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(lead.userid);
                        }}
                      />
                    </label>
                   
                  </td>
                  <td>{lead.userid}</td>
                  <td
                    style={{
                      color: giveTextColor(
                        lead.last_lead_status === "-"
                          ? "News"
                          : lead.last_lead_status === "Booked"
                            ? "Running"
                            : lead.last_lead_status === "Hot"
                              ? "Running"
                              : lead.last_lead_status === "Follow-Up" || lead.last_lead_status === "Interested"
                                ? "News"
			      : lead.last_lead_status === "Call Later"
                                ? "purple"
                                : lead.last_lead_status === "Junk"
                                  ? "red"
                                  : lead.last_lead_status === "Not Interested"
                                    ? "blue"
                                    : lead.last_lead_status === "No Response"
                                      ? "Draft"
                                      : lead.last_lead_status === "New"
                                        ? "springgreen"
                                        : lead.last_lead_status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
		      {lead.last_lead_status ==="Call Later" && lead.last_lead_reason_status !==""?lead.last_lead_reason_status:lead.last_lead_status}
                  </td>
                  {/* <td
                    style={{
                      color: giveTextColor(
                        lead.last_lead_status === "-"
                        ? "News":
                        lead.last_lead_status === "booked"
                          ? "Free"
                          : lead.last_lead_status === "hot"
                            ? "Running"
                            : lead.last_lead_status === "follow-up"
                              ? "News"
                              : lead.last_lead_status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.last_lead_status}
                  </td> */}
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
                        <Tooltip title={`${lead.name} (${(lead.user_type)})`}>
                          {lead.name.length > 20
                            ? `${lead.name.slice(0, 20)}...`
                            : lead.name}
                        </Tooltip>
                      )}
                    </span>
                  </td>
                  <td className="lead-tools-fix">
                  <span
                      className={`ls1 ${lead.email_status > 0 || lead.mobile_status || lead.whatsapp_status > 0 > 0 ? "fc2" : "fc5"} box-center`}
                    >
                      {lead.email_status > 0 || lead.mobile_status || lead.whatsapp_status > 0 > 0 ? (
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
                           {lead.second_page_rich === 1 && (
                            <Tooltip title={`Filled Second Screen`}>
                              <img
                                src={Battery}
                                alt="Verified"
                                className="battery"
                              />
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
                  {/* <td><span
                      className={`ls1 ${lead.second_page_rich ? "fc2" : "fc4"} box-center`}
                    >
                    {lead.second_page_rich === 1 && (
                        <MdOutlineCheck className="fs16 fc2" />
                    )}
                    {lead.second_page_rich === 0 && (
                        <MdClose className="fs16 fc4" />
                    )}
                        
                    </span></td> */}
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
                  <td className="assigned leads-tool-fix">
                   {lead.backupRmName ?(
                    lead.backupRmName
                  ):(
                    <Tooltip
                      title={
                        lead.flapone_agent_id
                          ? agentOptions.find(
                              (agent) => agent.value == lead.flapone_agent_id
                            )?.label || "Select Agent"
                          : lead.selected_agent
                            ? agentOptions.find(
                                (agent) => agent.value == lead.flapone_agent_id
                              )?.label || lead.selected_agent
                            : "Select Agent"
                      }
                    >
                      <select
                        disabled={actionAccess}
                        value={
                          agentOptions.find(
                            (agent) => agent.value == lead.flapone_agent_id
                          )?.value
                        }
                        onChange={(event) => {
                          handleAssignToDropdownChange(event, lead.userid);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <option value="">Select Agent </option>
                        {agentOptions.map(
                          (leadopt, index) =>
                            leadopt.label != "All" && (
                              <option key={index} value={leadopt.value}>
                                {leadopt.label}
                              </option>
                            )
                        )}
                      </select>
                    </Tooltip>
                  )}
                  </td>
                  {/* <td>{lead.signup}</td> */}
                  <td>{lead.last_enquiry_posted}</td>
                  <td>{lead.last_status_update_date}</td>
                  <td className={`${lead.last_followup_cls} lh18`}>
                    {lead.last_followup}
                  </td>
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
        {selectedLeads.length > 0 && (
          <div className="df fc3 fixed-buttons-mylead">
            <button
              type="button"
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 fc3"
              onClick={handleAssignToButtonClick}
            >
              Assign To ({selectedLeads.length})
            </button>
          </div>
        )}
        {isAssignToPopupVisible && (
          <Popup onClose={closePopup} title={"Select Agent"}>
            <div className="assigned">
              <SingleDropdown
                 label="Assign To"
                placeholder="Select Agent"
                options={agentOptions}
                selectedOption={assigned}
                onSelect={setAssigned}
              />
            </div>
            <div className="button-container myteam-filters">
              <button type="button" className="btn-cancel clear" onClick={closePopup}>
                Cancel
              </button>
              <button
                className="update-button btn-blue box-center"
                onClick={handleAssignToClick}
              >
                Update
              </button>
            </div>
          </Popup>
        )}
      </div>
    </>
  );
};

export default CallLatter;
