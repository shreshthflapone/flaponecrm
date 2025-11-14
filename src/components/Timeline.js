import React from "react";
import { FaEnvelope, FaBell, FaComment, FaClock ,FaPhoneVolume ,FaHotjar,FaFrownOpen} from "react-icons/fa";
import { MdAutoDelete,MdOutlineEventBusy,MdOutlineFollowTheSigns,MdUpdate} from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import "./Timeline.css";

const Timeline = ({ commentData ,Tooltip}) => {
  
  return (
    <div className="timeline">
      {commentData && Object.keys(commentData).length > 0 ? (
        Object.entries(commentData).map(([date, messages], index) => (
        <div key={index}>
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
  );
};

export default Timeline;
