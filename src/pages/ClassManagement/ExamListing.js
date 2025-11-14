import React, { useState, useEffect } from "react";
import "../MyStudents/MyStudents.css";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup";
import { TfiBlackboard } from "react-icons/tfi";
import { PiStudent } from "react-icons/pi";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip";
import daysOfWeek from "../../data/DaysWeek";
import { MdCall, MdOutlineMail } from "react-icons/md";
import moment from "moment";
import ImageDropdown from "../../components/ImageDropdown.js";
import { CiCalendarDate } from "react-icons/ci";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import CalendarComponent from "../../components/CalendarComponent.js";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import constant from "../../constant/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle.js";


const ExamListing = ({recordList, setRecordList, displayMsg, allApiFilter, pageCount, handleSortByChange, activeSortColumn}) => {
  const user = useSelector((state) => state.auth);
  useTitle("Exam List - Flapone Aviation");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examList, setExamList] = useState([]);
  const [examCount, setexamCount] = useState(0);
  const [periodPopup, setPeriodPopup] = useState(false);
  const [singleBatch, setSingleBatch] = useState({});
  const [singleBatchTimeTable, setSingleBatchTimeTable] = useState({});
  const [maxPeriods, setMaxPeriods] = useState("");
  const [studentDetailsPopup, setStudentDetailsPopup] = useState(false);
  const [selectedClassRoom, setSelectedClassRoom] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState({});
  const [attendanceShow, setAttendanceShow] = useState(false);
  const [previewView, setPreviewView] = useState(false);
  const [examDataStatus, setExamDataStatus] = useState(false);
  const currentDate = moment();
  const [examStudentList, setExamStudentList] = useState([]);


  const openExamDetail = () => {
    navigate("/exam-detail");
  };

  const openUpdateForm = (id) => {
    navigate("/exam-detail/"+id);
  }

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

  
  const handleOpenStudentBatch = (batch_id, course_id) => {
    getStudentList(batch_id, course_id);
  };

  const getStudentList = async (batch_id, course_id) => {
    if(batch_id && course_id){	  
    axios({
      method: "post",
      url: `${constant.base_url}/admin/teacher_exam.php?fun=getStudentList`,
      headers: {"Auth-Id": user.auth_id },
      data: {'course_id': course_id, 'batch_id': batch_id}
    }).then(function (response) {
      if(response.data.data.status != '0'){
        setExamStudentList(response.data.data.data);
      } else {
        setExamStudentList([]);
      }
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
    }	    
  }
  const signuinStudentAccount = (user_id, tab) => {
    if (user_id) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=genrateLoginEncriptKey`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        cid: user_id,
        type: "admin",
        redirectUrl: tab
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }
        if(response.data.data){
          let urlred="https://student.flapone.com/"+"login/"+response.data.data;
          window.open(urlred);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  useEffect(() => {
    setExamList(recordList);
    setexamCount(pageCount);
    setExamDataStatus(true);
  }, [recordList]);
 
  return (
    <>
      {examDataStatus && (
	<>
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {examCount}
        <button
          className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
          onClick={openExamDetail}
        >
          Add Exam
        </button>
      </div>
      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}>
                <p className="box-center">
                  Id
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("examdate_long")} className={activeSortColumn === "examdate_long" ? "fc1" : ""}>
                <p className="box-center wsnw">
                  Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("exam_timing")} className={activeSortColumn === "exam_timing" ? "fc1" : ""}>
                <p className="box-center">
                  Timing
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

              <th onClick={() => handleSortByChange("exam_type")} className={activeSortColumn === "exam_type" ? "fc1" : ""}>
                <p className="box-center">
                  Type
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("batch")} className={activeSortColumn === "batch" ? "fc1" : ""}>
                <p className="box-center">
                  Batch
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("course")} className={activeSortColumn === "course" ? "fc1" : ""}>
                <p className="box-center">
                  Course
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

              <th onClick={() => handleSortByChange("subject")} className={activeSortColumn === "subject" ? "fc1" : ""}>
                <p className="box-center">
                  Subject
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Action
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {examList.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-students">
                  No Exam Data Available
                </td>
              </tr>
            ) : (
              examList.map((exam, index) => {
                return (
                  <tr key={index}>
                    <td>{exam.id}</td>
                    <td>
                      <span
                        style={{
                          color: giveTextColor(
                            exam.exam_date_color
                          ),
                        }}
                      >
                        {exam.examdate}
                      </span>
                    </td>
                    <td>{exam.exam_timing}</td>
                    <td style={{textTransform: "capitalize",}}>{exam.exam_type}</td>
                    <td>{exam.batch}</td>
                    <td className="leads-tool-fix scrollable-cell">
                      {exam.course ? (
                        <p>{exam.course}</p>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td>{exam.subject}</td>
                    <td>
                        <FaPencilAlt onClick={()=>openUpdateForm(exam.id)} className="icon mail-icon cp fs18 fc5 mr8" />
                        {exam.batch && exam.batch !== 'NA' ? (
                          <FaEye 
                            className="icon mail-icon cp fs18 fc5"
                            onClick={() => {
                              setPreviewView(true);
                              handleOpenStudentBatch(exam.batch_id, exam.course_id);
                            }}
                          />
                        ) : ''}
                      </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
</>
      )}

      {previewView && (
          <SidePopup
            show={previewView}
            onClose={() => {
              setPreviewView(false);
              document.body.style.overflow = "auto";
            }}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Preview</p>
              <button
                onClick={() => {
                  setPreviewView(false);
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
                      <p className="box-center">Roll No</p>
                    </th>
                    <th>
                      <p className="box-center">Student</p>
                    </th>
                    <th>
                      <p className="box-center">Parent</p>
                    </th>
                    <th>
                      <p className="box-center">Batch</p>
                    </th>
                    <th>
                      <p className="box-center">Payment Status</p>
                    </th>
                    <th>
                      <p className="box-center">Status</p>
                    </th>
                    <th>
                      <p className="box-center">Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examStudentList && examStudentList.length > 0 ? (
                    examStudentList.map((student, index) => (
                      <tr key={index}>
                        <td>
                          <p className="box-center">{student.enroll_no || "--"}</p>
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
                                {student.student_name}
                              </span>
                              <span className="ls1 fc5 df gender-stud">
                                <span className="fs12 ls1">
                                  {student.gender.charAt(0)} - {student.student_age}y{" "}
                                </span>
                                <Tooltip title={student.email_id}>
                                  <MdOutlineMail className={`fs16 ml4`} />
                                </Tooltip>
                                <Tooltip title={student.mobile_number}>
                                  <MdCall className={`fs16 ml4`} />
                                </Tooltip>
                              </span>
                            </p>
                          </div>
                        </td>
                        <td>
                          <p className="box-center">{student.guardian_name || "--"}</p>
                        </td>
                        <td>
                          <p>{student.batch_name}</p>
                        </td>
                        <td>
                          <p
                            className="box-center"
                          >
                            {student.work_order_status || "--"}
                          </p>
                        </td>
                        <td
                          style={{
                            color: giveTextColor("Success"),
                            textTransform: "capitalize",
                          }}
                        >
                          <p className="box-center">Eligible</p>
                        </td>
                        <td className="Shreshth Gahlot">
                          <FaPencilAlt 
                            className="icon cp fs18 fc5 mr8 Hello-Shreshth"
                            onClick={(e) => {signuinStudentAccount(student.student_id, "settings"); }}
                          />
                          <HiOutlineDocumentCheck
                            className={` cp fs20 mr8 fc5`}
                            onClick={(e) => {
                              e.stopPropagation();
                              signuinStudentAccount(student.student_id, "documents");
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <p className="box-center">No students available</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SidePopup>
      )}
    </>
  );
};

export default ExamListing;
