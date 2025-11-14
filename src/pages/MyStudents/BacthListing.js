import React, { useState } from "react";
import "../MyStudents/MyStudents.css";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { FaPencilAlt, FaCalendar } from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup";
import { TfiBlackboard } from "react-icons/tfi";
import { PiStudent } from "react-icons/pi";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip";
import BatchListData from "../../data/BatchListData";
import daysOfWeek from "../../data/DaysWeek";
import { MdCall, MdOutlineMail } from "react-icons/md";
import moment from "moment";
import ImageDropdown from "../../components/ImageDropdown";
import { CiCalendarDate } from "react-icons/ci";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import CalendarComponent from "../../components_two/CalendarComponent";

const BatchListing = () => {
  const [batchList, setBatchList] = useState(BatchListData);
  const [periodPopup, setPeriodPopup] = useState(false);
  const [singleBatch, setSingleBatch] = useState({});
  const [singleBatchTimeTable, setSingleBatchTimeTable] = useState({});
  const [maxPeriods, setMaxPeriods] = useState("");
  const [studentDetailsPopup, setStudentDetailsPopup] = useState(false);
  const [selectedClassRoom, setSelectedClassRoom] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState({});
  const [attendanceShow, setAttendanceShow] = useState(false);
  const currentDate = moment();

  const navigate = useNavigate();

  const roomsOptions = [
    { value: "101", label: "Room 101" },
    { value: "102", label: "Room 102" },
    { value: "103", label: "Room 103" },
    { value: "104", label: "Room 104" },
  ];

  const facultiesOptions = [
    {
      value: "1",
      label: "Naveen Kumar Tiwari",
      image:
        "https://hellocity.vercel.app/static/media/user.5faf09a7795d28bf5a2b.png",
    },
    {
      value: "2",
      label: "Kamlesh Gupta",
      image:
        "https://hellocity.vercel.app/static/media/user.5faf09a7795d28bf5a2b.png",
    },
    {
      value: "3",
      label: "Sanjay Gupta",
      image:
        "https://hellocity.vercel.app/static/media/user.5faf09a7795d28bf5a2b.png",
    },
  ];

  const openBatchDetail = () => {
    navigate("/batch-detail");
  };
  const closePeriodPopup = () => {
    setPeriodPopup(false);
    document.body.style.overflow = "auto";
  };
  const handleClassRoomChange = (selected, dayIndex, periodIndex) => {
    const updatedTimeTable = [...singleBatchTimeTable.timeTable];
    updatedTimeTable[dayIndex].periods[periodIndex].room = selected;
    setSingleBatchTimeTable({
      ...singleBatchTimeTable,
      timeTable: updatedTimeTable,
    });
  };

  const handleFacultyChange = (selected, dayIndex, periodIndex) => {
    const updatedTimeTable = [...singleBatchTimeTable.timeTable];
    updatedTimeTable[dayIndex].periods[periodIndex].faculty = selected;
    setSingleBatchTimeTable({
      ...singleBatchTimeTable,
      timeTable: updatedTimeTable,
    });
  };
  const handleStudentRowClick = (leadId) => {
    navigate(`/my-leads/${leadId}`);
  };
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 7;
  const timeTableData = singleBatchTimeTable?.timeTable || [];

  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTimetable = timeTableData.slice(startIndex, endIndex);
  const goToNextPage = () => {
    if (endIndex < timeTableData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: 77415
        <button
          className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
          onClick={openBatchDetail}
        >
          Add New Batch
        </button>
      </div>
      {batchList.length > 1 && (
        <div className="card-content df pt24 brd-b1 pb24 pl24 jcc">
          <div className="card-item df fdc jcc br4">
            <span className="fs28 fc1 mb8">100</span>
            <p className="fw6  fs16 fc5 ">Total Batch</p>
          </div>
          <div className="card-item df fdc jcc br4">
            <span className="fs28 fc1 mb8 v-center">50</span>
            <p className="fw6 fs16 fc5">Running</p>
          </div>
          <div className="card-item df fdc jcc br4">
            <span className="fs28 fc1 mb8">20</span>
            <p className="fw6  fs16 fc5 ">Completed</p>
          </div>

          <div className="card-item df fdc jcc br4">
            <span className="fs28 fc1 mb8 v-center">20</span>
            <p className="fw6  fs16 fc5">Hold</p>
          </div>

          <div className="card-item df fdc jcc br4">
            <span className="fs28 fc1 mb8 v-center">10</span>
            <p className="fw6 fs16 fc5">Upcoming</p>
          </div>
        </div>
      )}

      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th>
                <p className="box-center">
                  Id
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center wsnw">
                  Batch Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Status
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
                  Start Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  End Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Timing
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Sts. Joined
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Max Sts.
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Days
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Center
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Created Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Updated Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

              <th>
                <p className="box-center">
                  Action
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="batch-list">
            {batchList.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-students">
                  No Batchs Available
                </td>
              </tr>
            ) : (
              batchList.map((batch, index) => {
                const startDate = moment(batch.startDate, "DD MMM YYYY");
                const endDate = moment(batch.endDate, "DD MMM YYYY");
                const className = endDate.isBefore(currentDate)
                  ? "fc2"
                  : endDate.isSameOrAfter(currentDate) &&
                      startDate.isSameOrBefore(currentDate)
                    ? "fc19"
                    : startDate.isAfter(currentDate)
                      ? "fc12"
                      : "fc16";
                return (
                  <tr key={index}>
                    <td>{batch.batchId}</td>
                    <td className={className}>{batch.batchName}</td>

                    <td
                      style={{
                        color: giveTextColor(
                          batch.status === "Draft"
                            ? "Pending"
                            : batch.status === "Published"
                              ? "Completed"
                              : batch.status === "Unpublished"
                                ? "Rejected"
                                : batch.status
                        ),
                        textTransform: "capitalize",
                      }}
                    >
                      {batch.status}
                    </td>
                    <td>{batch.courseName}</td>
                    <td className={className}>{batch.startDate}</td>
                    <td className={className}>{batch.endDate}</td>
                    <td>{batch.timing}</td>
                    <td
                      onClick={() => {
                        setStudentDetailsPopup(true);
                        setSingleBatch(batch);
                      }}
                      className={`${
                        batch.studentsJoined < batch.minStudent
                          ? "fc24"
                          : batch.studentsJoined >= batch.maxStudents
                            ? "fc4"
                            : "fc2"
                      }`}
                    >
                      {batch.studentsJoined}
                    </td>

                    <td>{batch.maxStudents}</td>
                    <td className="leads-tool-fix ">
                      <p className="box-center w100">
                        {daysOfWeek.map((day, i) => (
                          <span
                            key={i}
                            style={{
                              color: batch.onDays.includes(day)
                                ? "green"
                                : "red",
                              marginRight: "6px",
                            }}
                          >
                            <Tooltip
                              title={batch.onDays.includes(day) ? "On" : "Off"}
                            >
                              {day.charAt(0)}
                            </Tooltip>
                          </span>
                        ))}
                      </p>
                    </td>
                    <td>{batch.center}</td>
                    <td>{batch.createDate}</td>
                    <td>{batch.updateDate}</td>
                    <td>
                      <PiStudent
                        className="icon mail-icon cp fs18 fc5 mr8"
                        onClick={() => {
                          setStudentDetailsPopup(true);
                          setSingleBatch(batch);
                        }}
                      />
                      <TfiBlackboard
                        className="icon mail-icon cp fs18 fc5 mr8"
                        onClick={() => {
                          setPeriodPopup(true);
                          setSingleBatchTimeTable(batch);
                          setMaxPeriods(
                            Math.max(
                              ...batch.timeTable.map(
                                (daySchedule) => daySchedule.periods.length
                              )
                            )
                          );
                        }}
                      />

                      <FaPencilAlt className="icon mail-icon cp fs18 fc5 " />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {periodPopup && (
          <SidePopup
            show={periodPopup}
            onClose={closePeriodPopup}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Time Table</p>
              <button onClick={closePeriodPopup} className="lead-close-button">
                X
              </button>
            </div>
            <div className="period p8 ">
              <table className="ledger-table cp w100 wsnw">
                <thead>
                  <tr>
                    <th>
                      <p className="box-center">Day & Date</p>
                    </th>

                    {Array.from({ length: maxPeriods }, (_, i) => (
                      <th key={i}>
                        <p className="box-center">Class {i + 1}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTimetable.map((daySchedule, index) => (
                    <tr key={index}>
                      <td>
                        {/* {moment(daySchedule.date, "DD-MM-YYYY").format("dddd")}{" "} */}
                        {/* ({daySchedule.date}) */}
                        Mon, 22 Jun 2024
                      </td>
                      {Array.from({ length: maxPeriods }).map((_, idx) => {
                        const period = daySchedule.periods[idx] || {};
                        return (
                          <td key={idx} className="assigned">
                            {period.subject && period.time ? (
                              <div className="df fdc">
                                <p className="fw6 ls1 lh18">
                                  {period.subject || "--"}
                                </p>
                                <p className="fc5 mt4">{period.time || "--"}</p>
                              </div>
                            ) : (
                              "--"
                            )}

                            {period.subject && (
                              <div className="mt12 leads-tool-fix box-center">
                                <ImageDropdown
                                  options={roomsOptions}
                                  onChange={(selected) =>
                                    handleClassRoomChange(selected, index, idx)
                                  }
                                  image={false}
                                  className={"mr8"}
                                  label="Room"
                                  value={period.room}
                                />

                                <ImageDropdown
                                  options={facultiesOptions}
                                  onChange={(selected) =>
                                    handleFacultyChange(selected, index, idx)
                                  }
                                  image={true}
                                  showImage={false}
                                  label="Faculty"
                                  value={period.faculty}
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-controls mt24 df jce ">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className={`${currentPage === 0 ? "disabled-input bg14 fc3" : "cp fc3 bg1"} pagination-btn br4 mr8`}
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={endIndex >= singleBatchTimeTable.timeTable.length}
                className={`${endIndex >= singleBatchTimeTable.timeTable.length ? "disabled-input bg14 fc3" : "cp fc3 bg1"} pagination-btn br4`}
              >
                Next
              </button>
            </div>
          </SidePopup>
        )}
        {studentDetailsPopup && (
          <SidePopup
            show={studentDetailsPopup}
            onClose={() => {
              setStudentDetailsPopup(false);
              document.body.style.overflow = "auto";
            }}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Student Details</p>
              <button
                onClick={() => {
                  setStudentDetailsPopup(false);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="booked p8">
              <table className="student-table cp w100 wsnw">
                <thead>
                  <tr>
                    <th>
                      <p className="box-center">ID</p>
                    </th>
                    <th>
                      <p className="box-center">Student</p>
                    </th>
                    <th>
                      <p className="box-center">Payment Status</p>
                    </th>
                    <th>
                      <p className="box-center">Pending Amount</p>
                    </th>
                    <th>
                      <p className="box-center">Doc. Status</p>
                    </th>

                    <th>
                      <p className="box-center">Attendance</p>
                    </th>
                    <th>
                      <p className="box-center">Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {singleBatch && singleBatch.studentList.length > 0 ? (
                    singleBatch.studentList.map((student, index) => (
                      <tr
                        key={index}
                        onClick={() => handleStudentRowClick(student.id)}
                      >
                        <td>
                          <p className="box-center">{student.id || "--"}</p>
                        </td>
                        <td className="student-info">
                          <div className="df aic">
                            <div className="avatar-sm mr8">
                              <img
                                src={student.img ? student.img : Avatar}
                                alt="avatar"
                              />
                            </div>
                            <p className="df fdc ais">
                              <span className="ls1 fs14 pb2">
                                {student.studentName}
                              </span>
                              <span className="ls1 fc5 df gender-stud">
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
                            </p>
                          </div>
                        </td>
                        <td
                          style={{
                            color: giveTextColor(
                              student.paymentStatus === "Pending"
                                ? "Pending"
                                : student.paymentStatus === "Paid"
                                  ? "Completed"
                                  : student.paymentStatus === "Unpaid"
                                    ? "Rejected"
                                    : student.paymentStatus
                            ),
                            textTransform: "capitalize",
                          }}
                        >
                          <p className="box-center">
                            {student.paymentStatus || "--"}
                          </p>
                        </td>
                        <td>
                          <p
                            className={`box-center ${student.pendinAmount > 0 && "fc4"}`}
                          >
                            {student.pendinAmount || "--"}
                          </p>
                        </td>
                        <td
                          style={{
                            color: giveTextColor(
                              student.docStatus === "Pending"
                                ? "Pending"
                                : student.docStatus === "Complete"
                                  ? "Completed"
                                  : student.docStatus === "Rejected"
                                    ? "Rejected"
                                    : student.docStatus
                            ),
                            textTransform: "capitalize",
                          }}
                        >
                          <p className="box-center">
                            {student.docStatus || "--"}
                          </p>
                        </td>
                        <td>
                          {daysOfWeek.map((day, i) => (
                            <span
                              key={i}
                              style={{
                                color: student.attendance.includes(day)
                                  ? "green"
                                  : "red",
                                marginRight: "6px",
                              }}
                            >
                              {day.charAt(0)}
                            </span>
                          ))}
                        </td>
                        <td>
                          <FaPencilAlt className="icon cp fs18 fc5 mr8" />
                          <HiOutlineDocumentCheck
                            className={` cp fs20 mr8 ${student.docStatus === "Complete" ? "fc2" : "fc5"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                "https://studentcrm.vercel.app/my-account",
                                "_blank"
                              );
                            }}
                          />
                          <CiCalendarDate
                            className="icon cp fs20 fc5 "
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttendanceShow(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <p className="box-center">No students available</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SidePopup>
        )}
        {attendanceShow && (
          <SidePopup
            show={attendanceShow}
            onClose={() => {
              setAttendanceShow(false);
              document.body.style.overflow = "auto";
            }}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Student Attendance</p>
              <button
                onClick={() => {
                  setAttendanceShow(false);
                  setStudentDetailsPopup(true);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="p8 w100">
              <CalendarComponent />
            </div>
          </SidePopup>
        )}
      </div>
    </>
  );
};

export default BatchListing;
