import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { HiUserAdd } from "react-icons/hi";
import { FaEye, FaPencilAlt, FaThList } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import Tooltip from "../../components/Tooltip";
import { giveTextColor } from "../../helpers/textColors";
import { MdCall, MdOutlineMail } from "react-icons/md";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import Popup from "../../components/Popup/Popup";
import AffiliateUpdateStatusForm from "../../components/Forms/AffiliateUpdateStatusForm";

//Dummy Data

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
  },
];

const AffiliateList = ({ recordList, allApidata, handleSortByChange, activeSortColumn, pageCount }) => {
    const navigate = useNavigate();
    const [allAffiliateData, setAllAffiliateData] = useState([]);
    const [openMenuRow, setOpenMenuRow] = useState(null);
    const [affiliatesCount, setAffiliatesCount] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [inactiveComment, setInactiveComment] = useState(false);
    const [comment, setComment] = useState("");
    const [updateStatusPopup, setUpdateStatusPopup] = useState(false);

    const CONVERSION_ORDER = ["30", "60", "90", "180", "360", "all"];

    const toggleMenu = (rowIndex) => {
        setOpenMenuRow(openMenuRow === rowIndex ? null : rowIndex);
    };
    const handleClickOutside = () => {
        alert(1);
        setOpenMenuRow(openMenuRow === null);
    };
    
    useEffect(() => {
        document.removeEventListener("mousedown", handleClickOutside);
    });

    const handleAddStudent = (affiliate) => {
        window.open("https://www.flapone.com/enquiry", "_blank");
    };

    const handleEditAffiliate = () => {
        navigate("/affiliate-details/overview/1/view");
    };

    const handleViewAffiliate = () => {
        navigate("/affiliate-details/overview/1/view");
    };

    const handleToggleActive = (affiliate) => {
        console.log("Toggle status:", affiliate.id);
    };


    useEffect(() => {
        setAllAffiliateData([...recordList]);
        setAffiliatesCount(pageCount);
    }, [recordList]);

    const getBoxColor = (index) => {
        const colors = ["#4CAF50", "#66BB6A", "#29B6F6", "#0288D1", "#3949AB", "#6A1B9A"];
        return colors[index % colors.length];
    };
    const toggleSwitch = (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        if(newStatus == "Active"){
            setShowConfirmation(true);
        } else {
            setInactiveComment(true);
        }
        setAllAffiliateData(prev =>
            prev.map(a =>
            a.id === id ? { ...a, user_status: newStatus } : a
            )
        );
    };
    const handleOverviewList = (id) => {
        navigate("/affiliate-details/overview/"+id+"/view");
    }
    const handleStudentList = (id, action) => {
        navigate("/affiliate-details/student_list/"+id+"/"+action);
    }
    const handleDaysAction = (id, days) => {
        navigate("/affiliate-details/student_list/"+id+"/"+days);
    }
    const cancelConfirmationChange = () => {
        setShowConfirmation(false);
    };
    const cancelInactivePopup = () => {
        setInactiveComment(false);
    };

    const handleShowUpdateForm = () => {
        setUpdateStatusPopup(true);
    }
    const closeUpdateStatusPopup = () => {
        setUpdateStatusPopup(false);
    }
    return (
        <>
        <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
            Total Results: {affiliatesCount}
        </div>
        <div
            className="booked table-container df w100 fdc mt16"
            style={{ overflow: "auto" }}
        >
            <table className="mylead-table log-table cp wsnw">
                <thead className="w100">
                <tr>
                    <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}><p className="box-center">Id <RiArrowUpDownFill className="cp ml4"/></p></th>
                    <th onClick={() => handleSortByChange("name")} className={activeSortColumn === "name" ? "fc1" : ""}>
                    <p className="box-center">
                        <DynamicTooltip direction="right" text="Name"> Name</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("company_name")} className={activeSortColumn === "company_name" ? "fc1 min-w100" : "min-w100"}><p className="box-center">Company <br />Name<RiArrowUpDownFill className="cp ml4" /></p></th>
                    <th onClick={() => handleSortByChange("rm")} className={activeSortColumn === "rm" ? "fc1" : ""}>
                        <DynamicTooltip direction="right" text="Relationship Manager"> RM</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </th>
                    <th><p className="box-center">Contact <br/> Info</p></th>
                    <th onClick={() => handleSortByChange("leads_generated")} className={activeSortColumn === "leads_generated" ? "fc1" : ""}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Leads Generated"> Leads <br /> Generated</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                    </th>
                    <th onClick={() => handleSortByChange("leads_converted")} className={activeSortColumn === "leads_converted" ? "fc1" : ""}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Leads Booked"> Leads <br /> Booked</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                    </th>
                    <th onClick={() => handleSortByChange("conversions_breakup")} className={activeSortColumn === "conversions_breakup" ? "fc1" : ""}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="Conversions Breakup">Conversions <br /> Breakup</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("sale_amount")} className={activeSortColumn === "sale_amount" ? "fc1" : ""}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="Net Sale">Net <br /> Sale Amt.</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("total_commission_earned")} className={activeSortColumn === "total_commission_earned" ? "fc1 amc-col" : "amc-col"}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="Total Earned">Total Comm. <br /> Earned</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("pending_payout")} className={activeSortColumn === "pending_payout" ? "fc1 amc-col" : "amc-col"}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="Pending Payout">Pending <br/> Payout</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("last_payout_date")} className={activeSortColumn === "last_payout_date" ? "fc1" : ""}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="Last Payout Date">Last Payout <br/> Date</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("last_referral")} className={activeSortColumn === "last_referral" ? "fc1" : ""}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="Last Referral">Last <br /> Referral</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th onClick={() => handleSortByChange("user_status")} className={activeSortColumn === "user_status" ? "fc1" : ""}>
                    <p className="box-center">
                        <DynamicTooltip direction="left" text="User Status">User <br /> Status</DynamicTooltip>
                        <RiArrowUpDownFill className="cp ml4" />
                    </p>
                    </th>
                    <th className="action-col">Action</th>
                </tr>
                </thead>
                <tbody className="subject-list">
                    {allAffiliateData.length === 0 ? (
                        <tr>
                        <td colSpan="15" className="no-students">
                            No Data Available
                        </td>
                        </tr>
                    ) : (
                        allAffiliateData.map((affiliate, index) => (
                            <tr key={affiliate.id}>
                                <td onClick={()=>handleOverviewList(affiliate.id)}>{affiliate.id}</td>
                                <td onClick={()=>handleOverviewList(affiliate.id)}>{affiliate.name}</td>
                                <td onClick={()=>handleOverviewList(affiliate.id)} className="leads-tool-fix">
                                {affiliate.company_name && (
                                    <Tooltip title={affiliate.company_name}>
                                    {affiliate.company_name.length > 15
                                        ? `${affiliate.company_name.slice(0, 15)}...`
                                        : affiliate.company_name}
                                    </Tooltip>
                                )}
                                </td>
                                <td className="leads-tool-fix">{affiliate.rm || "--"}</td>
                                <td>
                                    {Array.isArray(affiliate.contact_info) && affiliate.contact_info.length > 0 ? (
                                        <div className="df jcc">
                                            {affiliate.contact_info[0].mobile_number ? (
                                                <Tooltip
                                                    title={affiliate.contact_info[0].mobile_number}
                                                >
                                                    <MdCall
                                                    className={`${
                                                        affiliate.contact_info[0].verified === "1" && affiliate.contact_info[0].mobile_number !== ""
                                                        ? "fc13"
                                                        : "fc17"
                                                    } fs18 ml4`}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                "--"
                                            )}
                                            {affiliate.contact_info[0].email ? (
                                                <Tooltip
                                                    title={affiliate.contact_info[0].email}
                                                >
                                                    <MdOutlineMail
                                                    className={`${
                                                        affiliate.contact_info[0].verified === "1" && affiliate.contact_info[0].email !== ""
                                                        ? "fc13"
                                                        : "fc17"
                                                    } fs18 ml4`}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                "--"
                                            )}
                                        </div>
                                    ) : (
                                        "--"
                                    )}
                                </td>
                                <td
                                    onClick={
                                        affiliate.leads_generated !== ""
                                        ? () => handleStudentList(affiliate.id, affiliate.leads_generated)
                                        : undefined
                                    }
                                    className={affiliate.leads_generated !== "" ? "cp" : ""}
                                    >
                                    {affiliate.leads_generated ? affiliate.leads_generated : "--"}
                                </td>
                                <td
                                    onClick={
                                        affiliate.leads_converted !== ""
                                        ? () => handleStudentList(affiliate.id, affiliate.leads_converted)
                                        : undefined
                                    }
                                    className={affiliate.leads_converted !== "" ? "cp" : ""}
                                    >
                                    {affiliate.leads_converted ? affiliate.leads_converted : "--"}
                                </td>
                                <td>
                                    {affiliate.conversions_breakup ? (
                                        <div style={{
                                            display: "flex",
                                            borderRadius: "6px",
                                            border: "1px solid #ddd",
                                            width: "fit-content"
                                        }}>
                                            {CONVERSION_ORDER.map((days, idx) => {
                                                const count = affiliate.conversions_breakup[days] ? affiliate.conversions_breakup[days] : 0;
                                                return (
                                                    count > 0 ?
                                                    <>
                                                    <Tooltip title={days !== "all" ? "Last "+days+" Days" : "Total"}>
                                                    <div
                                                        key={idx}
                                                        onClick={
                                                            () => handleDaysAction(affiliate.id, days)
                                                        }
                                                        style={{
                                                            backgroundColor: getBoxColor(idx),
                                                            color: "#fff",
                                                            padding: "4px 8px",
                                                            fontSize: "12px",
                                                            textAlign: "center",
                                                            borderRight: idx < CONVERSION_ORDER.length - 1 ? "1px solid #fff" : "none"
                                                        }}
                                                    >
                                                        {count}
                                                    </div>
                                                    </Tooltip>
                                                    </>
                                                    : 
                                                    <>
                                                    <Tooltip title={"Last "+days+" Days"}>
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            backgroundColor: "#808080",
                                                            color: "#fff",
                                                            padding: "4px 8px",
                                                            fontSize: "12px",
                                                            textAlign: "center",
                                                            borderRight: idx < CONVERSION_ORDER.length - 1 ? "1px solid #fff" : "none"
                                                        }}
                                                    >
                                                        0
                                                    </div>
                                                    </Tooltip>
                                                    </>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        "--"
                                    )}
                                </td>
                                <td 
                                    onClick={
                                        affiliate.sale_amount !== ""
                                        ? () => handleStudentList(affiliate.id, affiliate.sale_amount)
                                        : undefined
                                    }    
                                >{affiliate.sale_amount ? affiliate.sale_amount : "--"}</td>
                                <td>{affiliate.total_commission_earned ? affiliate.total_commission_earned : "--"}</td>
                                
                                <td 
                                    onClick={
                                        affiliate.pending_payout !== ""
                                        ? () => handleStudentList(affiliate.id, affiliate.pending_payout)
                                        : undefined
                                    }    
                                    className="fc6"
                                >{affiliate.pending_payout ? affiliate.pending_payout : "--"}</td>
                                <td>{affiliate.last_payout_date || "--"}</td>
                                <td>{affiliate.last_referral || "--"}</td>
                                <td>
                                    <div className="df jcc">
                                        <Tooltip
                                            title={affiliate.user_status === "Active" ? "Active" : "Inactive"}
                                        >
                                            <label style={{ cursor: "pointer" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={affiliate.user_status === "Active"}
                                                    onChange={() =>
                                                    toggleSwitch(affiliate.id, affiliate.user_status)
                                                    }
                                                    style={{ display: "none" }}
                                                />

                                                <span
                                                    className={`custom-toggle ${
                                                    affiliate.user_status === "Active" ? "toggle-on" : "toggle-off"
                                                    }`}
                                                >
                                                    {affiliate.user_status === "Active" ? (
                                                    <BsToggleOn />
                                                    ) : (
                                                    <BsToggleOff />
                                                    )}
                                                </span>
                                            </label>
                                        </Tooltip>
                                    </div>
                                </td>

                                <td className="action-col">
                                    <FaEye
                                        className="cp mr12"
                                        title="View Affiliates"
                                        onClick={() => handleViewAffiliate()}
                                    />
                                    <FaPencilAlt
                                        className="cp mr12"
                                        title="Edit Affiliates"
                                        onClick={() => handleEditAffiliate()}
                                    />
                                    <HiUserAdd
                                        className="fs18 cp"
                                        title="Add Student"
                                        onClick={() => handleAddStudent()}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {showConfirmation && (
                <div className="student-roaster">
                    <Popup title="Active Affiliate" onClose={cancelConfirmationChange}>
                        <p className="ls1 lh22 fs16 mb24 tac">
                            Are you sure you want to
                            <strong>active this affiliate</strong>?
                        </p>
                        <div className="popup-buttons df jcc">
                            <button
                                onClick={cancelConfirmationChange}
                                className="update-button btn-blue box-center mr24"
                            >
                                Yes
                            </button>
                            <button onClick={cancelConfirmationChange} className="btn-cancel">
                                No
                            </button>
                        </div>
                    </Popup>
                </div>
            )}
            {inactiveComment && (
                <div className="inactive-affiliate">
                    <Popup title="Inactive Affiliate" onClose={cancelInactivePopup}>
                        <div className="df">
                            <div className="flx100 comments-input mt24">
                                <p className="fc15 fw6 fs14 mb8 ls1">Comment</p>
                                <textarea
                                    className="comments p12 br4"
                                    placeholder="Any Reason..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="popup-buttons df jce">
                            <button onClick={cancelInactivePopup} className="btn-cancel">
                                Cancel
                            </button>
                            <button
                                onClick={cancelInactivePopup}
                                className="update-button btn-blue box-center"
                            >
                                Update
                            </button>
                        </div>
                    </Popup>
                </div>
            )}
            {updateStatusPopup && (
                <Popup
                    onClose={closeUpdateStatusPopup}
                    title={"Update Status"}
                >
                    <AffiliateUpdateStatusForm
                        onClose={closeUpdateStatusPopup}
                    />
                </Popup>
            )};
        </div>
        </>
    );
};

export default AffiliateList;
