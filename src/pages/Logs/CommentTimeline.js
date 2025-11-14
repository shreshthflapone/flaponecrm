import React, { useState } from "react";
import {
  FaEnvelope,
  FaBell,
  FaComment,
  FaClock,
  FaPhoneVolume,
  FaHotjar,
  FaFrownOpen,
} from "react-icons/fa";
import {
  MdAutoDelete,
  MdOutlineEventBusy,
  MdOutlineFollowTheSigns,
  MdUpdate,
} from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import "../../components/Timeline.css";
import Tooltip from "../../components/Tooltip";

const CommentTimeline = () => {
  const [commentData, setCommentData] = useState({
    "09 Apr 2025": [
      {
        id: "223976",
        user_id: "53823",
        lead_id: null,
        agent_id: "43",
        lead_status: "update",
        lead_comment: "Gender update:  New Value 'Female'",
        sts_date: "2025-04-09 11:37:33",
        sts_action_date: "09 Apr 2025 11:37 AM",
        sts_type: "agent",
        sts_user_name: "Capt. Mirzad Azeez",
        sts_user_id: "43",
        sts_date_time_ago: "15d ago",
        sts_date_new: "09 Apr 2025 11:37 AM",
        sts_date_time_minuteago: 21840,
      },
      {
        id: "223976",
        user_id: "53823",
        lead_id: null,
        agent_id: "43",
        lead_status: "update",
        lead_comment: "Gender update:  New Value 'Female'",
        sts_date: "2025-04-09 11:37:33",
        sts_action_date: "09 Apr 2025 11:37 AM",
        sts_type: "agent",
        sts_user_name: "Capt. Mirzad Azeez",
        sts_user_id: "43",
        sts_date_time_ago: "15d ago",
        sts_date_new: "09 Apr 2025 11:37 AM",
        sts_date_time_minuteago: 21840,
      },
    ],
    "07 Apr 2025": [
      {
        id: "221054",
        user_id: "53823",
        lead_id: null,
        agent_id: "32",
        lead_status: "AccessAgentPage",
        lead_comment: "Access Page User-id 53823 my-account?tab=documents",
        sts_date: "2025-04-07 14:55:30",
        sts_action_date: "07 Apr 2025 02:55 PM",
        sts_type: "agent",
        sts_user_name: "Shreshth Gahlot",
        sts_user_id: "32",
        sts_date_time_ago: "17d ago",
        sts_date_new: "07 Apr 2025 02:55 PM",
        sts_date_time_minuteago: 24522,
      },
    ],
  });

  return (
    <div className="timeline w100">
      {commentData && Object.keys(commentData).length > 0 ? (
        Object.entries(commentData).map(([date, messages], index) => (
          <div key={index}>
            <button className="timeline-date bg5 fc1">{date}</button>
            {messages.map((message, msgIndex) => (
              <div className="timeline-box pr" key={msgIndex}>
                <div className="timeline-icon bg15">
                  <FaClock />
                </div>

                <div className="timeline-content">
                  <div className="comment-timeline df jcsb fww lh18">
                    {message.sts_user_name || message.sts_user_id ? (
                      <p>
                        {message.sts_user_name ? message.sts_user_name : ""}
                        {message.sts_user_name && message.sts_user_id
                          ? " ("
                          : ""}
                        {message.sts_user_id ? message.sts_user_id : ""}
                        {message.sts_user_id ? ")" : ""}
                      </p>
                    ) : null}

                    <div className="df timeline-status">
                      {message.lead_status && (
                        <p className="status">
                          Status:
                          <span className="comment-status">
                            {message.lead_status === "booked"
                              ? "Payment Received"
                              : message.lead_status === "hot"
                                ? "Hot"
                                : message.lead_status === "followup"
                                  ? "Interested"
                                  : message.lead_status === "call_latter"
                                    ? "Ask To Call Later"
                                    : message.lead_status === "noresponse"
                                      ? "No Response"
                                      : message.lead_status === "notinterested"
                                        ? "Not Interested"
                                        : message.lead_status === "junk"
                                          ? "Junk"
                                          : message.lead_status === "update"
                                            ? "Update"
                                            : message.lead_status}
                          </span>
                        </p>
                      )}

                      <p className="v-center timeline-icons">
                        <Tooltip title="Action time">
                          {message.sts_date_time_minuteago < 2880 && (
                            <>
                              <SlCalender className="fc17 ml10 mr8" />
                              {message.sts_date_time_ago}
                            </>
                          )}
                        </Tooltip>

                        {message.sts_action_date && (
                          <Tooltip title="Followup date">
                            <FaBell className="bell-icon ml10" />
                            {message.sts_action_date}
                          </Tooltip>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="comment-message lh18">
                    {message.lead_comment}
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
  );
};

export default CommentTimeline;
