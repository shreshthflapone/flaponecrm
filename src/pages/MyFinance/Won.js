import React, { useState } from "react";
import "../MyReports/Booked.css";
import Tooltip from "../../components/Tooltip";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";

const Won = () => {
  const [wonLeadData, setWonLeadData] = useState([
    {
      id: 8146,
      status: "free",
      name: "Anuj Kumar",
      type: "Company",
      category: "Travel",
      course: "Airline Transport Pilot Licence (ATPL)",
      city: "Mumbai",
      assigned: 92679,
      signup: "11d ago",
      last_update: "11d ago",
      followup: "01-08-2024 11:00 AM",
      lead_source: "Website",
      amount:"140000",
      payment:"01-08-2024"
    },
    {
      id: 89795,
      status: "running",
      name: "Gaurav Kumar",
      type: "individual",
      category: "Travel",
      course: "Medium RPC - Drone Pilot Training",
      city: "Shimla",
      assigned: 130057,
      signup: "11d ago",
      last_update: "16h ago",
      followup: "01-08-2024 11:00 AM",
      lead_source: "Website",
      amount:"140000",
      payment:"01-08-2024"
    },
    {
      id: 57458,
      status: "running",
      name: "Virat Kholi",
      type: "Company",
      category: "Travel",
      course: "Drone Training",
      city: "Ghaziabad",
      assigned: 132135,
      signup: "organic",
      last_update: "10m ago",
      followup: "01-08-2024 11:00 AM",
      lead_source: "Website",
      amount:"140000",
      payment:"01-08-2024"
    },
    {
      id: 93001,
      status: "running",
      name: "Rome",
      type: "Company",
      category: "Travel",
      course: "Aircraft Training",
      city: "Delhi",
      assigned: 139636,
      signup: "organic",
      last_update: "15m ago",
      followup: "01-08-2024 11:00 AM",
      lead_source: "Website",
      amount:"140000",
      payment:"01-08-2024"
    },
  ]);
  const [assigned, setAssigned] = useState("");
  const navigate = useNavigate();
  const [agentOptions, setAgentOptions] = useState([
    {
      label: "All",
      value: "",
    },
    {
      value: "92679",
      label: "Anuj Pratap Singh",
    },
    {
      value: "132135",
      label: "Ashish Kumar",
    },
    {
      value: "64967",
      label: "Bhawna Jain",
    },
    {
      value: "139636",
      label: "chhavi.tyagi ",
    },
    {
      value: "133444",
      label: "Jyoti Madan Ray",
    },
    {
      value: "130057",
      label: "Parveen Siddique",
    },
  ]);

  const handleAssignToDropdownChange = (event, leadId) => {
    const updatedLeads = wonLeadData.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, assigned: event.target.value };
      } else {
        return lead;
      }
    });

    setWonLeadData(updatedLeads);
  };
  const handleRowClick = (leadId) => {
    navigate(`/my-leads/${leadId}`);
  };
  return (
    <>
      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th>
                <p className="box-center">
                  Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Type
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Category
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Course
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  City
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Assigned
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                Amount
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                Payment Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Lead Source
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {wonLeadData.map((lead, index) => {
              const [followupDate, followupTime, followupAMPM] =
                lead.followup.split(" ");
              const formattedFollowupDate = `${followupDate.substring(3, 5)}-${followupDate.substring(0, 2)}-${followupDate.substring(6, 10)}`;

              return (
                <tr key={index} onClick={() => handleRowClick(lead.id)}>
                  
                  <td
                    style={{
                      color: giveTextColor(
                        lead.status === "free"
                          ? "Free"
                          : lead.status === "running"
                            ? "Running"
                            : lead.status === "news"
                              ? "News"
                              : lead.status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.status}
                  </td>
                  <td className="leads-tool-fix">
                    {lead.name && (
                      <Tooltip title={lead.name}>
                        {lead.name.length > 10
                          ? `${lead.name.slice(0, 10)}...`
                          : lead.name}
                      </Tooltip>
                    )}
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        lead.type === "Company"
                          ? "Company"
                          : lead.status === "individual"
                            ? "Individual"
                            : lead.status === "news"
                              ? "News"
                              : lead.status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {lead.type}
                  </td>
                  <td>{lead.category}</td>
                  <td className="leads-tool-fix">
                    {lead.course && (
                      <Tooltip title={lead.course}>
                        {lead.course.length > 20
                          ? `${lead.course.slice(0, 20)}...`
                          : lead.course}
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
                    <Tooltip
                      title={
                        assigned.value
                          ? agentOptions.find(
                              (agent) => agent.value == assigned.value
                            )?.label || "Select Agent"
                          : lead.assigned
                            ? agentOptions.find(
                                (agent) => agent.value == lead.assigned
                              )?.label || lead.assigned
                            : "Select Agent"
                      }
                    >
                      <select
                        value={
                          agentOptions.find(
                            (agent) => agent.value == lead.assigned
                          )?.value
                        }
                        onChange={(event) => {
                          handleAssignToDropdownChange(event, lead.id);
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
                  </td>
                  <td>{lead.amount}</td>
                  <td>{lead.payment}</td>
                  <td>{lead.lead_source}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Won;
