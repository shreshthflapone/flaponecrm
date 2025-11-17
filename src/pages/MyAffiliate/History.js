import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaBell, FaComment, FaClock ,FaPhoneVolume ,FaHotjar,FaFrownOpen} from "react-icons/fa";
import { MdAutoDelete,MdOutlineEventBusy,MdOutlineFollowTheSigns,MdUpdate} from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import Tooltip from "../../components/Tooltip";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import Dropdown from "../../components/Dropdown";


const History = ({ recordList }) => {
    const navigate = useNavigate();
    const [historyRecords, setHistoryRecords] = useState([]);
    const [updateStatusPopup, setUpdateStatusPopup] = useState(false);
    const CONVERSION_ORDER = ["30", "60", "90", "180", "360"];
    const [historyOptions, setHistoryOptions] = useState([
        { label: "Call Not Connected", value: "call_not_connected" },
        { label: "Call After Sometime", value: "call_after_sometime" },
        { label: "Booked", value: "booked" },
        { label: "Call Later", value: "call_later" },
    ]);
    const [selectedHistoryOption, setSelectedHistoryOption] = useState({ label: "Select", value: "" },);
    const [historyOptionLabel, setHistoryOptionLabel] = useState("Select");

    const handleSelectedHistory = (option) => {
        setSelectedHistoryOption(option.value);
        setHistoryOptionLabel(option.label);
    };
    useEffect(() => {
        setHistoryRecords(recordList);
    }, [recordList]);

    return (
        <>
            <div className="lead-detail-inofs v-center w100 fww">
                <div className="sale-status box-center fdc cp">
                    <p className="brd-b1 pb4">Last Status</p>
                    <p className="fc9">
                      <span className="fc13 ">Interested</span>{" "}
                      <span className="fc16 fs12">
                            <DynamicTooltip text="Last Status Date">
                            {"(LSD: 24 Dec 2023)"}
                            </DynamicTooltip>
                        </span>
                    </p>
                </div>
                <div className="sale-status box-center fdc cp">
                    <p className="brd-b1 pb4">Total Referral</p>
                    <p className="fc13">
                      <span className="">
                            <DynamicTooltip text="Total Referral">
                            150
                            </DynamicTooltip>
                        </span>{" "}
                        <span className="fc16 fs12">
                            <DynamicTooltip text="Last Referral Date">
                            {"(LRD: 23 Dec 2023)"}
                            </DynamicTooltip>
                        </span>
                    </p>
                </div>
                <div className="sale-status box-center fdc cp">
                    <p className="brd-b1 pb4">Total Converted</p>
                    <p className="fc13">
                        <span className="">
                            <DynamicTooltip text="Total Conversions">
                            60
                            </DynamicTooltip>
                        </span>{" "}
                        <span className="fc16 fs12">
                            <DynamicTooltip text="Total Sales Amount">
                            {"(TS: ₹4,21,000)"}
                            </DynamicTooltip>
                        </span>
                    </p>
                </div>
                <div className="sale-status box-center fdc cp">
                    <p className="brd-b1 pb4">Commission</p>
                    <p className="fc13">
                        <span className="">
                            <DynamicTooltip text="Total Earned">E: ₹80,000</DynamicTooltip>
                        </span>{" / "}
                        <span className="fc6 ">
                            <DynamicTooltip text="Total Pending">P: ₹56,000</DynamicTooltip>
                        </span>
                    </p>
                </div>
                <div className="sale-status box-center fdc cp">
                    <p className="brd-b1 pb4">Conversion Breakup</p>
                    <div style={{display: "flex",borderRadius: "6px",border: "1px solid rgb(221, 221, 221)",width: "fit-content",marginTop: "5px"}}>
                        <div style={{ backgroundColor: "rgb(108, 92, 231)", color: "#fff", padding: "4px 8px", fontSize: "12px", textAlign: "center", borderRight: "1px solid #fff", }}><DynamicTooltip text="Last 30 Days">5</DynamicTooltip></div>
                        <div style={{ backgroundColor: "rgb(0, 184, 148)", color: "#fff", padding: "4px 8px", fontSize: "12px", textAlign: "center", borderRight: "1px solid #fff", }} ><DynamicTooltip text="Last 60 Days">7</DynamicTooltip></div>
                        <div style={{ backgroundColor: "rgb(9, 132, 227)", color: "#fff", padding: "4px 8px", fontSize: "12px", textAlign: "center", borderRight: "1px solid #fff", }} > <DynamicTooltip text="Last 90 Days">8</DynamicTooltip></div>
                        <div style={{ backgroundColor: "rgb(214, 48, 49)", color: "#fff", padding: "4px 8px", fontSize: "12px", textAlign: "center", borderRight: "1px solid #fff", }} ><DynamicTooltip text="Last 180 Days">10</DynamicTooltip></div>
                        <div style={{ backgroundColor: "rgb(230, 126, 34)", color: "#fff", padding: "4px 8px", fontSize: "12px", textAlign: "center", borderRight: "none", }}><DynamicTooltip text="Last 360 Days">12</DynamicTooltip></div>
                    </div>
                </div>
            </div>
            <div className="timeline history-timeline brd-t1 plr0">
                <div className="df jcsb mb12">
                    <h6 className="fc1 fs18">History</h6>
                    <div className="">
                        <Dropdown
                            label={historyOptionLabel}
                            options={historyOptions}
                            selectedValue={selectedHistoryOption}
                            onValueChange={handleSelectedHistory}
                        />
                    </div>
                </div>
                {historyRecords && Object.keys(historyRecords).length > 0 ? (
                    Object.entries(historyRecords).map(([date, messages], index) => (
                        <div key={index} className="brd-t1 pt12">
                            <button className="timeline-date bg5 fc1">{date}</button>
                            {messages.map((message, msgIndex) => (
                                <div className="timeline-box pr" key={msgIndex}>
                                    {message.lead_status === "junk" ? (
                                        <div className="timeline-icon bg9">
                                            <MdAutoDelete/>
                                        </div>
                                    ) : message.lead_status === "notinterested" ? (
                                        <div className="timeline-icon bg17">
                                            <FaFrownOpen />
                                        </div>
                                    ) : message.lead_status === "call_latter" ? (
                                        <div className="timeline-icon bg12">
                                            <MdOutlineEventBusy />
                                        </div>
                                    ) : message.lead_status === "followup" ? (
                                        <div className="timeline-icon bg">
                                            <MdOutlineFollowTheSigns />
                                        </div>
                                    ) : message.lead_status === "noresponse" ? (
                                        <div className="timeline-icon bg2">
                                            <FaPhoneVolume />
                                        </div>
                                    ) : message.lead_status === "hot" ? (
                                        <div className="timeline-icon bg12">
                                            <FaHotjar />
                                        </div>
                                    ) : message.lead_status === "booked" ? (
                                        <div className="timeline-icon bg4">
                                            <GiReceiveMoney />
                                        </div>
                                    ) : (
                                        <div className="timeline-icon bg15">
                                            <FaClock />
                                        </div>
                                    )}
                    
                                    <div className="timeline-content">
                                        <div className="comment-timeline df jcsb fww lh18">
                                            {message.sts_user_name || message.sts_user_id ? (
                                                <p>
                                                    {message.sts_user_name ? message.sts_user_name : ''}
                                                    {message.sts_user_name && message.sts_user_id ? ' (' : ''}
                                                    {message.sts_user_id ? message.sts_user_id : ''}
                                                    {message.sts_user_id ? ')' : ''}
                            
                                                </p>
                                            ) : null}
                                            <div className="df timeline-status">
                                        
                                                {message.lead_status &&(
                                                    <p className="status">
                                                    Status: 
                                                    <span className="comment-status">
                                                    {message.lead_status === "booked" ? "Payment Received" :
                                                    message.lead_status === "hot" ? "Hot" :
                                                    message.lead_status === "followup" ? "Interested" :
                                                    message.lead_status === "call_latter" ? "Ask To Call Later" :
                                                    message.lead_status === "noresponse" ? "No Response" :
                                                    message.lead_status === "notinterested" ? "Not Interested" :
                                                    message.lead_status === "junk" ? "Junk" :
                                                    message.lead_status === "update" ? "Update" :
                                                    message.lead_status === "payment_follow_up" ? "Payment Follow-up" :
                                                    message.lead_status === "batch_allotment" ? "Batch Allotment" :
                                                    message.lead_status === "course_completed" ? "Course Completed" :
                                                    message.lead_status === "call_later_co" ? "Call Later" :
                                                    message.lead_status === "docs_pending" ? "Docs Pending" :
                                                    message.lead_status}
                                                    </span>
                                                    </p>
                                                )}
                                                <p className="v-center timeline-icons">
                                                    <Tooltip title="Action time" >
                                                        {message.sts_date_time_minuteago < 2880 && (
                                                            <>
                                                            <SlCalender className="fc17 ml10 mr8" />
                                                            {message.sts_date_time_ago}
                                                            </>
                                                        )}
                                                    </Tooltip>
                                    
                                                    {message.sts_action_date  && (
                                                        <Tooltip title="Followup date" >
                                                        <FaBell className="bell-icon ml10" />
                                                        {message.sts_action_date}
                                                        </Tooltip>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="comment-message lh18 wbba">
                                            {message.lead_comment?.split('|').map((line, index) => (
                                                <div key={index}>{line}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="fs14">No History Available</p>
                )}
            </div>
        </>
        
    );
};
export default History;
