import React from "react";
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
  MdOutlineFollowTheSigns,
  MdUpdate,
} from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import "../../components/Timeline.css";

const CommentHistory = ({ commentData, Tooltip }) => {
  return (
    <div className="timeline">
      {commentData && Object.keys(commentData).length > 0 ? (
        Object.entries(commentData).map(([date, messages], index) => (
          <div key={index}>
            <button className="timeline-date bg1">{date}</button>
            {messages.map((message, msgIndex) => (
              <div className="timeline-box pr" key={msgIndex}>
                {message.lead_status === "Open" ? (
                  <div className="timeline-icon bg9">
                    <MdAutoDelete />
                  </div>
                ) : message.lead_status === "Closed" ? (
                  <div className="timeline-icon bg17">
                    <FaFrownOpen />
                  </div>
                ) : message.lead_status === "Follow-up" ? (
                  <div className="timeline-icon bg">
                    <MdOutlineFollowTheSigns />
                  </div>
                ) : message.lead_status === "Resolved" ? (
                  <div className="timeline-icon bg2">
                    <FaPhoneVolume />
                  </div>
                ) : message.lead_status === "On Hold" ? (
                  <div className="timeline-icon bg12">
                    <FaHotjar />
                  </div>
                ) : message.lead_status === "Transferred" ? (
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
                                  ? "Follow-up"
                                  : message.lead_status === "noresponse"
                                    ? "No Response"
                                    : message.lead_status === "notintrested"
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
                        {message.sts_action_date && (
                          <Tooltip title="Reply Time">
                            <SlCalender className="fc17 ml10 mr8" />
                            {message.sts_action_date}
                          </Tooltip>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="comment-message lh18" dangerouslySetInnerHTML={{ __html: message.lead_comment }} />
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

export default CommentHistory;
