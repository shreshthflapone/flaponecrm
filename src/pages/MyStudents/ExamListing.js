import React, { useState, useEffect, useMemo } from "react";
import "../MyTeam/MyTeam.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowUpDownFill } from "react-icons/ri";
import SearchInput from "../../components/SearchInput.js";
import { useTitle } from "../../hooks/useTitle.js";
import { giveTextColor } from "../../helpers/textColors.js";
import ExamListData from "../../data/ExamListData";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import SidePopup from "../../components/Popup/SidePopup.js";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip.js";
import { MdCall, MdOutlineMail } from "react-icons/md";

const ExamListing = () => {
  useTitle("Exam List - Flapone Aviation");
  const [examList, setExamList] = useState(ExamListData);
  const [examStudentList, setExamStudentList] = useState({});
  const [previewView, setPreviewView] = useState(false);
  const navigate = useNavigate();

  const openExamDetail = () => {
    navigate("/exam-detail");
  };

  const handleStudentRowClick = (leadId) => {
    navigate(`/my-leads/${leadId}`);
  };

  return (
    <>
      <Card className="bg5 mt16 pb16">
        <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
          Total Results: 77415
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
                <th>
                  <p className="box-center">
                    Id
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center wsnw">
                    Date
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
                    Type
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Batch
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Course
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th>
                  <p className="box-center">
                    Subject
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
            <tbody className="subject-list">
              {examList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-students">
                    No Exams Available
                  </td>
                </tr>
              ) : (
                examList.map((exam, index) => {
                  return (
                    <tr key={index}>
                      <td>{exam.id}</td>
                      <td>{exam.date}</td>
                      <td>{exam.timing}</td>
                      <td
                        style={{
                          color: giveTextColor(
                            exam.type === "Assessment"
                              ? "Pending"
                              : exam.type === "Flying Test"
                                ? "Completed"
                                : exam.type === "Exam"
                                  ? "Rejected"
                                  : exam.type
                          ),
                          textTransform: "capitalize",
                        }}
                      >
                        {exam.type}
                      </td>
                      <td>{exam.batch}</td>
                      <td>{exam.course}</td>
                      <td>{exam.subject}</td>
                      <td>
                        <FaPencilAlt className="icon mail-icon cp fs18 fc5 mr8" />
                        <FaEye
                          className="icon mail-icon cp fs18 fc5 "
                          onClick={() => {
                            setPreviewView(true);
                            setExamStudentList(exam);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
                      <p className="box-center">Pending(Rs.)</p>
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
                  {examStudentList && examStudentList.studentList.length > 0 ? (
                    examStudentList.studentList.map((student, index) => (
                      <tr
                        key={index}
                        onClick={() => handleStudentRowClick(student.id)}
                      >
                        <td>
                          <p className="box-center">{student.rollNo || "--"}</p>
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
                        <td>
                          <p className="box-center">{student.parent || "--"}</p>
                        </td>
                        <td>
                          <p>{student.batch}</p>
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
                              student.status === "Pending"
                                ? "Pending"
                                : student.status === "Eligible"
                                  ? "Completed"
                                  : student.status === "Not Eligible"
                                    ? "Rejected"
                                    : student.status
                            ),
                            textTransform: "capitalize",
                          }}
                        >
                          <p className="box-center">{student.status || "--"}</p>
                        </td>

                        <td>
                          <FaPencilAlt className="icon cp fs18 fc5 mr8" />
                          <HiOutlineDocumentCheck
                            className={` cp fs20 mr8 fc5`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                "https://studentcrm.vercel.app/my-account",
                                "_blank"
                              );
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
      </Card>
    </>
  );
};

export default ExamListing;
