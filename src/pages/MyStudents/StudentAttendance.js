import React, { useState } from "react";
import "../MyStudents/StudentAttendance.css";
import Card from "../../components/Card.js";
import {
  FaLongArrowAltDown,
  FaLongArrowAltRight,
  FaFileDownload,
} from "react-icons/fa";
import { useTitle } from "../../hooks/useTitle.js";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip.js";
import { MdCall, MdOutlineMail } from "react-icons/md";
import moment from "moment";
import AttendanceData from "../../data/AttendanceData.js";

const StudentAttendance = () => {
  useTitle("Attendance List - Flapone Aviation");

  const month = "September";
  const daysInMonth = moment().month(month).daysInMonth();

  const [isAscending, setIsAscending] = useState(true);
  const [sortedData, setSortedData] = useState(AttendanceData);

  const handleSort = () => {
    const sorted = [...sortedData].sort((a, b) => {
      if (isAscending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setSortedData(sorted);
    setIsAscending(!isAscending);
  };

  return (
    <>
      <Card className="bg5 mt16 pb16">
        <div className="mylead-filters v-center jce pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
          <button className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center ls1 lh16">
            Attendance <FaFileDownload className="ml8" />
          </button>
        </div>

        <div className="attendance-table mt24 df fdc">
          <div className="table-header">
            <div className="header-item student-column v-center ">
              <p
                className={`fs14 v-center cp ${!isAscending && "fc1"}`}
                onClick={handleSort}
              >
                <FaLongArrowAltDown className="fs14" />
                Student
              </p>
              <p className="ml16 fs14 v-center">
                Date
                <FaLongArrowAltRight className="fs14 ml4" />
              </p>
            </div>
            <div className="header-item date-columns">
              {Array.from({ length: daysInMonth }, (_, i) => (
                <span key={i} className="date-item box-center">
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
          {sortedData.map((student, idx) => (
            <div key={idx} className="table-row">
              <div className="df aic attendance-row">
                <div className="avatar-sm mr8">
                  <img src={student.img ? student.img : Avatar} alt="avatar" />
                </div>
                <p className="df fdc ais">
                  <span
                    className={`ls1 fs14 pb2 ${student.pendingAmount > 0 ? "fc9":"fc2"}`}
                  >
                    {student.name && (
                      <Tooltip title={student.name}>
                        {student.name.length > 20
                          ? `${student.name.slice(0, 18)}...`
                          : student.name}
                      </Tooltip>
                    )}
                  </span>
                  <span className={"ls1 fc5 df gender-stud"}>
                    <span className="fs12 ls1">
                      {student.gender.charAt(0)} - {student.age}y{" "}
                    </span>
                    <Tooltip title={student.email}>
                      <MdOutlineMail className={`fs16 ml4`} />
                    </Tooltip>
                    <Tooltip title={student.mobile}>
                      <MdCall className={`fs16 ml4`} />
                    </Tooltip>
                  </span>
                  <span className="ls1 fc5 df fs12 mt4">
                    {student.batch && (
                      <Tooltip title={student.batch}>
                        {student.batch.length > 20
                          ? `${student.batch.slice(0, 18)}...`
                          : student.batch}
                      </Tooltip>
                    )}
                  </span>
                </p>
              </div>
              <div className="attendance-record">
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <span
                    key={i}
                    className={`attendance-item box-center ${student.attendance[month][i + 1] === "0" ? "fc9" : student.attendance[month][i + 1] === "1" ? "fc2" : student.attendance[month][i + 1] === "2" ? "fc10" : student.attendance[month][i + 1] === "3" ? "fc6" : "fc5"}`}
                  >
                    {student.attendance[month][i + 1] === "0" ? (
                       <svg
                       viewBox="0 0 21 21"
                       fill="currentColor"
                       height="20px"
                       width="20px"
                      
                     >
                       <g
                         fill="none"
                         fillRule="evenodd"
                         stroke="currentColor"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M15.5 15.5l-10-10zM15.5 5.5l-10 10" />
                       </g>
                     </svg>
                    ) : student.attendance[month][i + 1] === "1" ? (
                      <svg
                        fill="none"
                        viewBox="0 0 15 15"
                        height="16px"
                        width="16px"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="square"
                          d="M1 7l4.5 4.5L14 3"
                        />
                      </svg>
                    ) : student.attendance[month][i + 1] === "2" ? (
                        <svg
                        viewBox="0 0 21 21"
                        fill="currentColor"
                        height="20px"
                        width="20px"
                       
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15.5 15.5l-10-10zM15.5 5.5l-10 10" />
                        </g>
                      </svg>
                    ) : student.attendance[month][i + 1] === "3" ? (
                      <svg
                        fill="none"
                        viewBox="0 0 15 15"
                        height="16px"
                        width="16px"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="square"
                          d="M1 7l4.5 4.5L14 3"
                        />
                      </svg>
                    ) : (
                      "--"
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default StudentAttendance;
