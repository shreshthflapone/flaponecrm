import React, { useState } from "react";
import "./ClassCard.css";
import { MdPerson2 } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import Tooltip from "./Tooltip";

const ClassCard = ({
  classDetail,
  onClick,
  selected,
  previewOpen,
  getExistinngTopicBYID,
}) => {
  return (
    <div
      className={`class-card cp ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="class-header">
        <div
          className={`status ${classDetail.currentStatus === "Ongoing" ? "ongoing fc2" : classDetail.currentStatus === "Completed" ? "ongoing fc24" : "upcoming fc6"} fs14 ls1 br4`}
        >
          {classDetail.currentStatus}
        </div>
        {classDetail.instructor_name && (
          <div className="time fc5 fs14 v-center">
            <Tooltip title={classDetail.instructor_name}>
              <MdPerson2 className="mr4 fs14" />
              {classDetail.instructor_name.length > 20
                ? `${classDetail.instructor_name.slice(0, 20)}...`
                : classDetail.instructor_name}
            </Tooltip>
          </div>
        )}

        <div className="time fc5 fs14 v-center">
          <Tooltip title="Time">
            <FaRegClock className="mr4 fs14" />
            {classDetail.timing}
          </Tooltip>
        </div>
      </div>
      <div className="class-details df ais jcsb">
        <div>
          <p className="class-title fs16 fc14">
            {classDetail.course}{" "}
            <span className="fs14 ls1 fc5 lh16">
              ({classDetail.class_number})
            </span>
          </p>

          <p className="class-subtitle fc5 fs14">
            {classDetail.class_type}{" "}
            {classDetail.topic ? "- " + classDetail.topic : ""}
          </p>
        </div>
        {classDetail.chapter_ids != "" && (
          <div
            className="leads-tool-fix"
            onClick={() => getExistinngTopicBYID(classDetail.chapter_ids)}
          >
            <Tooltip title="View Course Material">
              <svg viewBox="0 0 21 21" fill="#888" height="24px" width="24px">
                <g
                  fill="#888"
                  fillRule="#888"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5.5 3.5h10a2 2 0 012 2v10a2 2 0 01-2 2h-10a2 2 0 01-2-2v-10a2 2 0 012-2z" />
                  <path
                    fill="#888"
                    d="M5.5 5.5h10a2 2 0 012 2v-2c0-1-.895-2-2-2h-10c-1.105 0-2 1-2 2v2a2 2 0 012-2z"
                  />
                  <path d="M7.498 10.5h1M7.498 8.5h3.997M7.498 12.5h5.997M7.498 14.5h3.997" />
                </g>
              </svg>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="class-metrics">
        <div className="metric blue v-center">
          <Tooltip title="Total">
            <MdPerson2 className="fc24 mr4" />
            {classDetail.total_student}
          </Tooltip>
        </div>
        <div className="metric green v-center">
          <Tooltip title="Present">
            <MdPerson2 className="fc2 mr4" />
            {classDetail.present_student}
          </Tooltip>
        </div>
        <div className="metric red v-center">
          <Tooltip title="Absent">
            <MdPerson2 className="fc9 mr4" />
            {classDetail.absent_student}
          </Tooltip>
        </div>
      </div>
      <div className="class-footer fww">
        {classDetail.batch && (
          <Tooltip title={classDetail.batch}>
            <div className="badge ls1 fs14 yellow mr12">
              {" "}
              {/*{classDetail.batch_type}*/}
              {classDetail.batch.slice(0, 28)}...
            </div>
          </Tooltip>
        )}
        {classDetail.location && (
          <Tooltip title="Branch">
            <div className="badge ls1 fs14  blue mr12">
              {classDetail.location}
            </div>
          </Tooltip>
        )}
        {classDetail.room_number && (
          <Tooltip title="Room Number">
            <div className="badge ls1 fs14  light-blue mr12">
              {classDetail.room_number}
            </div>
          </Tooltip>
        )}

        {classDetail.online_class_link && (
          <Tooltip title="Online Class URL">
            <a href={classDetail.online_class_link} target="_blank">
              <div className="badge ls1 fs14 ongoing fc24 mr12">URL</div>
            </a>
          </Tooltip>
        )}
        {classDetail.class_date && (
          <Tooltip title="Class Date">
            <div className="badge ls1 fs14 upcoming fc6">
              {classDetail.class_date}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
