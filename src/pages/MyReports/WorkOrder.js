import React, { useState } from "react";
import "../MyReports/Booked.css";
import SingleDropdown from "../../components/SingleDropdown";
import Tooltip from "../../components/Tooltip";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { BsGraphUpArrow } from "react-icons/bs";
import SidePopup from "../../components/Popup/SidePopup";

const WorkOrder = () => {
  const [WorkOrderData, SetWorkOrderData] = useState([
    {
      company: "N R Trade Services",
      city: "Shahjahanpur",
      payment_status: "Approved",
      course_amount: "47,700",
      pending_amount: "27,700",
      service_status: "pending",
      comment: "Will pay next month",
      payment_stat: "1",
      id: "89409",
      login_id: "131914",
      wo_status: "Pending",
      show_div: 3,
      wo_stat: "0",
      plan_alloted: "0",
      plan_name: "Basic",
      plan_dur: null,
      txn_id: "pay_OOAcpjnFCDPBlM",
      pay_type: "on",
      chq_id: "Complimentary",
      credit: "15,000",
      customer_care: "Parveen Siddique",
      date_payment: "18-06-2024 02:44 PM",
      credit_tax: "17,700",
      course_name: "Aircraft Training",
      history: [
        {
          date_time: "26-06-2024 10:15 AM",
          payment_id: "89409",
          wo_id: "131914",
          course_amount: "47,700",
          paid_amount: "30,000",
          pending_amount: "17,700",
          rm_name: "Shresth",
          comment: "Partial payment made today.",
        },
        {
          date_time: "26-06-2024 11:30 AM",
          payment_id: "89393",
          wo_id: "89795",
          course_amount: "55,000",
          paid_amount: "55,000",
          pending_amount: "0",
          rm_name: "Kamlesh",
          comment: "Full payment received.",
        },
      ],
    },
    {
      company: "you and me travel talkies",
      city: "Shimla",
      payment_status: "Pending",
      course_amount: "47,700",
      pending_amount: "27,700",
      service_status: "pending",
      comment: "Will pay next month",
      payment_stat: "0",
      id: "89393",
      login_id: "89795",
      wo_status: "Approved",
      show_div: 3,
      wo_stat: "1",
      plan_alloted: "0",
      plan_name: "Platinum Pro",
      plan_dur: "Monthly",
      txn_id: "off_89393",
      pay_type: "off",
      chq_id: "Complimentary",
      credit: "0",
      customer_care: "raju yadav",
      date_payment: "13-06-2024 02:41 PM",
      credit_tax: "0",
      course_name: "Aircraft Training",
      history: [
        {
          date_time: "26-06-2024 10:15 AM",
          payment_id: "189409",
          wo_id: "131914",
          course_amount: "47,700",
          paid_amount: "30,000",
          pending_amount: "17,700",
          rm_name: "Sanjay",
          comment: "Partial payment made today.",
        },
        {
          date_time: "26-06-2024 11:30 AM",
          payment_id: "39393",
          wo_id: "89795",
          course_amount: "55,000",
          paid_amount: "55,000",
          pending_amount: "0",
          rm_name: "Naveen",
          comment: "Full payment received.",
        },
      ],
    },
  ]);
  const [assigned, setAssigned] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const [paymentHistoryPopup, setPaymentHistoryPopup] = useState(false);
  const [paymentHostoryData, setPaymentHostoryData] = useState([]);
  const navigate = useNavigate();
  const payment_status_opt = [
    { label: "Received", value: "0" },
    { label: "Approved", value: "1" },
    { label: "Rejected", value: "2" },
  ];
  const wo_status_opt = [
    { label: "Pending", value: "0" },
    { label: "Approved", value: "1" },
  ];
  const service_status_opt = [
    { label: "Pending", value: "0" },
    { label: "Done", value: "1" },
    { label: "Rejected", value: "2" },
  ];

  const currentDate = moment().format("DD/MM/YYYY");
  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.includes(leadId)) {
        return prevSelectedLeads.filter((id) => id !== leadId);
      } else {
        return [...prevSelectedLeads, leadId];
      }
    });
  };

  const handleAssignToClick = () => {
    const updatedLeads = WorkOrderData.map((lead) => {
      if (selectedLeads.includes(lead.id)) {
        return { ...lead, assignedTo: assigned };
      } else {
        return lead;
      }
    });

    SetWorkOrderData(updatedLeads);
    setSelectedLeads([]);
    setAssigned("");
    setAssignToPopupVisible(false);
  };

  const handleAssignToDropdownChange = (event, leadId, old_val) => {
    const updatedLeads = WorkOrderData.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, payment_stat: event.target.value };
      } else {
        return lead;
      }
    });
    SetWorkOrderData(updatedLeads);
  };
  const handleAssignToDropdownChange1 = (event, leadId, old_val) => {
    const updatedLeads = WorkOrderData.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, wo_stat: event.target.value };
      } else {
        return lead;
      }
    });
    SetWorkOrderData(updatedLeads);
  };
  const handleAssignToDropdownChange2 = (event, leadId, old_val) => {
    const updatedLeads = WorkOrderData.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, plan_alloted: event.target.value };
      } else {
        return lead;
      }
    });
    SetWorkOrderData(updatedLeads);
  };
  const handleRowClick = (leadId) => {
    navigate(`/my-leads/${leadId}`);
  };
  const handlePaymentHistoryPopupClose = () => {
    setPaymentHistoryPopup(false);
  };
  const handleOpenPaymentHistory = (history) => {
    setPaymentHostoryData(history);
    setPaymentHistoryPopup(!paymentHistoryPopup);
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
                <p className="box-center">History</p>
              </th>
              <th>
                <p className="box-center">
                  Name/Company Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  RM Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Course Fee
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Total Amt Received
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Amt Without Tax
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Pending Amount
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  WO Id
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Course Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Date & Time
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  WO Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Service Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {WorkOrderData.map((lead, index) => {
              const [paymentDate, paymentTime, paymentAMPM] =
                lead.date_payment.split(" ");
              const formattedPaymentDate = `${paymentDate.substring(3, 5)}-${paymentDate.substring(0, 2)}-${paymentDate.substring(6, 10)}`;

              return (
                <tr key={index} onClick={() => handleRowClick(lead.id)}>
                  <td className="leads-tool-fix">
                    <BsGraphUpArrow
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPaymentHistory(lead.history);
                      }}
                    />
                  </td>
                  <td className="leads-tool-fix">
                    {lead.company && (
                      <Tooltip title={lead.company}>
                        {lead.company.length > 20
                          ? `${lead.company.slice(0, 20)}...`
                          : lead.company}
                      </Tooltip>
                    )}
                  </td>
                  <td className="leads-tool-fix">
                    {lead.customer_care && (
                      <Tooltip title={lead.customer_care}>
                        {lead.customer_care.length > 10
                          ? `${lead.customer_care.slice(0, 10)}...`
                          : lead.customer_care}
                      </Tooltip>
                    )}
                  </td>
                  <td>{lead.course_amount}</td>
                  <td>{lead.credit_tax}</td>
                  <td>{lead.credit}</td>
                  <td>{lead.pending_amount}</td>
                  <td>{lead.txn_id}</td>
                  <td className="leads-tool-fix">
                    {lead.course_name && (
                      <Tooltip title={lead.course_name}>
                        {lead.course_name.length > 20
                          ? `${lead.course_name.slice(0, 20)}...`
                          : lead.course_name}
                      </Tooltip>
                    )}
                  </td>
                  <td>
                    {formattedPaymentDate}
                    <br />
                    <p className="mt4">
                      {paymentTime} {paymentAMPM}
                    </p>
                  </td>

                  <td className="assigned leads-tool-fix">
                    <select
                      value={
                        wo_status_opt.find(
                          (payopt) => payopt.value == lead.wo_stat
                        )?.value
                      }
                      onChange={(event) => {
                        handleAssignToDropdownChange1(
                          event,
                          lead.id,
                          lead.wo_stat
                        );
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <option value="">Select Status </option>
                      {wo_status_opt.map((leadopt, index) => (
                        <option key={index} value={leadopt.value}>
                          {leadopt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="assigned leads-tool-fix">
                    <select
                      value={
                        payment_status_opt.find(
                          (payopt) => payopt.value == lead.payment_stat
                        )?.value
                      }
                      onChange={(event) => {
                        handleAssignToDropdownChange(
                          event,
                          lead.id,
                          lead.payment_stat
                        );
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <option value="">Select Status </option>
                      {payment_status_opt.map((leadopt, index) => (
                        <option key={index} value={leadopt.value}>
                          {leadopt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {paymentHistoryPopup && (
        <SidePopup
          show={paymentHistoryPopup}
          onClose={handlePaymentHistoryPopupClose}
          className="full-width"
        >
          <div className="selected-plan-details">
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Work Order History</p>
              <button
                onClick={() => {
                  setPaymentHistoryPopup(false);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="booked p8">
              <table className="ledger-table cp w100 wsnw">
                <thead>
                  <tr>
                    <th>Date & time</th>
                    <th>WO Id</th>
                    <th>Payment Id</th>
                    <th>Course Amount</th>
                    <th>Paid Amount </th>
                    <th>Pending Amount</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHostoryData.map((lead, index) => {
                    const [paymentDate, paymentTime, paymentAMPM] =
                      lead.date_time.split(" ");
                    const formattedPaymentDate = `${paymentDate.substring(3, 5)}-${paymentDate.substring(0, 2)}-${paymentDate.substring(6, 10)}`;

                    return (
                      <tr key={index}>
                        <td>
                          {formattedPaymentDate}
                          <br />
                          <p className="mt4">
                            {paymentTime} {paymentAMPM}
                          </p>
                        </td>
                        <td>{lead.wo_id}</td>
                        <td>{lead.payment_id}</td>
                        <td>{lead.course_amount}</td>
                        <td>{lead.paid_amount}</td>
                        <td>{lead.pending_amount}</td>
                        <td>{lead.comment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </SidePopup>
      )}
    </>
  );
};

export default WorkOrder;
