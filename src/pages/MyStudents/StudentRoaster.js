import React, { useEffect, useState } from "react";
import "../MyStudents/MyStudents.css";
import "../MyStudents/StudentRoaster.css";
import Avatar from "../../assets/profile.png";
import { FaEye, FaThList } from "react-icons/fa";
import { MdCall, MdEdit, MdEmail, MdOutlineGridOn } from "react-icons/md";
import Tooltip from "../../components/Tooltip";
//import { IoIosArrowDropdown } from "react-icons/io";
import { RiArrowUpDownFill } from "react-icons/ri";
import "./InstructorRoaster.css";
import { giveTextColor } from "../../helpers/textColors";
import daysOfWeek from "../../data/DaysWeek";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarComponent from "../../components/CalendarComponent.js";
import SidePopup from "../../components/Popup/SidePopup";
import SingleDropdown from "../../components/SingleDropdown";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import { useNavigate } from "react-router-dom";
import constant from "../../constant/constant.js";
import { useTitle } from "../../hooks/useTitle.js";
const StudentRoaster = ({
  allApiFilter,
  allApidata,
  recordList,
  displayMsg,
  setRecordList,
  checkUserLogin,
  user,
  handleSortByChange,
  activeSortColumn
}) => {
          useTitle("Student Roster - Flapone Aviation");
  
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    if (recordList) {
      setEmployeeData([...recordList]);
    }
  }, [recordList]);

  const [expandedRow, setExpandedRow] = useState(null);
  const [attendanceShow, setAttendanceShow] = useState(false);
  const [studentAttendanceShow, setStudentAttendanceShow] = useState(false);
  const [expandedClassRow, setExpandedClassRow] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const [assigned, setAssigned] = useState({});
  const [attendanceOptions, setAttendanceOptions] = useState([
    {
      label: "Present",
      value: "present",
    },
    {
      label: "Absent",
      value: "absent",
    },
  ]);
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [batchChangeDetails, setBatchChangeDetails] = useState({
    stdId: null,
    newBatch: "",
    batchType: "",
  });
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // const [batchOptions, setBatchOptions] = useState([...JSON.parse(allApiFilter.allbatchlist)]);

  const [selectedStudentdata, setSelectedStudentdata] = useState([]);

  const navigate = useNavigate();

  const toggleRow = (empId) => {
    setExpandedRow(expandedRow === empId ? null : empId);
  };

  const handleCheckboxChange = (empId) => {
    const isChecked = selectedInstructor.includes(empId);
    const currentInstructor = employeeData.find(
      (emp) => emp.std_details.student_batch_id === empId
    );

    setSelectedInstructor((prev) => {
      if (isChecked) {
        // If unchecked, remove instructor and all their batch selections
        const updatedBatches = selectedClass.filter(
          (id) =>
            !currentInstructor.classes.some(
              (classDetail) => classDetail.id === id
            )
        );
        setSelectedClass(updatedBatches);
        return prev.filter((id) => id !== empId);
      } else {
        // If checked, add instructor and all their batch selections
        const newBatches = currentInstructor.classes
          .filter((classDetail) =>
            !moment(classDetail.class_date).isAfter(moment(), "day")
          )
          .map((classDetail) => classDetail.id);

        setSelectedClass((prevBatches) => [
          ...new Set([...prevBatches, ...newBatches]),
        ]);
        return [...prev, empId];
      }
    });
  };

  const handleBatchAssigned = (Id) => {
    setSelectedClass((prev) => {
      if (prev.includes(Id)) {
        return prev.filter((id) => id !== Id);
      } else {
        return [...prev, Id];
      }
    });
  };

  const handleAssignToButtonClick = () => {
    setAssignToPopupVisible(true);
  };
  const closePopup = () => {
    setAssignToPopupVisible(false);
  };
  const subjects = [
    { label: "Maths", value: "Maths" },
    { label: "Science", value: "Science" },
    { label: "English", value: "English" },
  ];
  const handleStudentRowClick = (Id) => {
    navigate(`/my-leads/${Id}`);
  };

  const handleBatchChange = (e, studentDetails, batchTypeVal) => {
    setSelectedStudentdata(studentDetails);
    const studentId = studentDetails.id;
    const newBatch = e.target.value;
    const batchType = batchTypeVal;
    const student = employeeData.find(
      (emp) => emp.std_details.id === studentId
    );

    if (student.std_details.batch_id !== newBatch) {
      setBatchChangeDetails({ stdId: studentId, newBatch, batchType });
      setShowConfirmation(true);
    }
  };

  const confirmBatchChange = () => {
    const { stdId, newBatch } = batchChangeDetails;
    setEmployeeData((prevData) =>
      prevData.map((emp) =>
        emp.std_details.id === stdId
          ? { ...emp, std_details: { ...emp.std_details, batch_id: newBatch } }
          : emp
      )
    );

    batchChange(batchChangeDetails, selectedStudentdata);
    //setBatchChangeDetails({ stdId: null, newBatch: "" });
    setShowConfirmation(false);
  };

  const cancelBatchChange = () => {
    setBatchChangeDetails({ stdId: null, newBatch: "", batchType: "" });
    setShowConfirmation(false);
  };

  const handleOpenLink = (link) => {
    window.open(link, "_blank");
  };

  const handleEditClick = (index) => {
    setEditingLinkIndex(index);
  };

  const handleSaveClick = (index) => {
    setEditingLinkIndex(null);
  };

  const handleAssignToClick = () => {
    markAttendance(selectedClass, assigned);
    setIsConfirmVisible(false);
  };

  const markAttendance = async (selectedClass, attedance) => {
    
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_roaster.php?fun=markattendance`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        classes: selectedClass,
        attedance: attedance.value,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          toast.success(response.data.data.msg);

          const classIdsToUpdate = selectedClass; 

          const updatedData = employeeData.map((student) => ({
            ...student,
            classes: student.classes.map((cls) =>
              classIdsToUpdate.includes(cls.id) ? { ...cls, attendance: attedance.label } : cls
            ),
          }));

          setEmployeeData(updatedData);
          setAssignToPopupVisible(false);
          setSelectedClass([]);
          setSelectedInstructor([]);
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const batchChange = async (batchChangeDetails, selectedStudentdata) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/student_roaster.php?fun=batchange`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        batchdata: batchChangeDetails,
        studentdata: selectedStudentdata,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          toast.success(response.data.data.msg);
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  return (
    <>
      
        <>
          <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
            Total Results: {allApidata.total_count||0}
          </div>
          <div
            className=" table-container df w100 fdc mt16 "
            style={{ overflow: "auto" }}
          >
            <table className="instructor-table wsnw">
              <thead>
                <tr>
                  <th></th>
                  <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}>
                  <p className="box-center cp">
                   ID
                    <RiArrowUpDownFill className=" ml4" />
                  </p>
                  </th>
                  <th onClick={() => handleSortByChange("std_name")} className={activeSortColumn === "std_name" ? "fc1" : ""}>
                  <p className="box-center cp">
                  Student Name
                    <RiArrowUpDownFill className=" ml4" />
                  </p>
                  </th>
                  <th onClick={() => handleSortByChange("batch_id")} className={activeSortColumn === "batch_id" ? "fc1" : ""}>
                  <p className="box-center cp">
                  Theory
                    <RiArrowUpDownFill className=" ml4" />
                  </p> 
                  </th>
                  <th onClick={() => handleSortByChange("fly_batch_id")} className={activeSortColumn === "fly_batch_id" ? "fc1" : ""}>
                  <p className="box-center cp">
                  Flying
                    <RiArrowUpDownFill className=" ml4" />
                  </p> 
                  </th>
                  <th>Scheduled Classes</th>
                  <th>
                  <p className="box-center">
                  Action
                    
                  </p> 
                  </th>
                </tr>
              </thead>

              {employeeData.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-students">
                  No Student Available
                </td>
              </tr>
              ) : (
                <tbody>
                  {employeeData.map((emp, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>
                          <label className="checkbox-label cp p10">
                            <input
                              type="checkbox"
                              checked={selectedInstructor.includes(
                                emp.std_details.student_batch_id
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  emp.std_details.student_batch_id
                                )
                              }
                            />
                          </label>
                        </td>
                        <td>{emp.std_details.id}</td>
                        <td
                          className="cp"
                          onClick={() =>
                            handleStudentRowClick(emp.std_details.id)
                          }
                        >
                          <div className="instructor-info">
                            <img
                              src={Avatar}
                              alt="Instructor"
                              className="instructor-image"
                            />
                            <div className="instructor-details df fdc ais">
                              <p className="ls1 ">
                                <p className="pb2 fw6 fs16 ls1 lh18 ais df">
                                  {emp.std_details.std_name}
                                </p>
                                <p className="df ais mt2">
                                  <span className="fs12 ls1 fc5">
                                    {emp.std_details.gender &&
                                      emp.std_details.gender.charAt(0)}
                                    {emp.std_details.gender &&
                                      emp.std_details.age &&
                                      "-"}
                                    {emp.std_details.age > 0
                                      ? `${emp.std_details.age}y`
                                      : ""}
                                  </span>
                                  {emp.std_details.email && (
                                    <Tooltip title={emp.std_details.email}>
                                      <a
                                        href={`mailto:${emp.std_details.email}`}
                                      >
                                        <MdEmail className="fs16 ml4 fc5" />
                                      </a>
                                    </Tooltip>
                                  )}
                                  {emp.std_details.mobile && (
                                    <Tooltip title={emp.std_details.mobile}>
                                      <a href={`tel:${emp.std_details.mobile}`}>
                                        <MdCall className="fs16 ml4 fc5" />
                                      </a>
                                    </Tooltip>
                                  )}
                                </p>
                              </p>
                              <p className="fs12 lh16 ls1 fc5">
                                {emp.std_details.course_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="assigned assigned-batch">
                          <DynamicTooltip
                            direction="bottom"
                            text={emp.std_details.batch_id_text}
                          >
                            <select
                              value={emp.std_details.batch_id}
                              onChange={(e) =>
                                handleBatchChange(e, emp.std_details, "theory")
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              disabled={
                                emp?.std_details?.batch_start_status ===
                                "running"
                                  ? true
                                  : false
                              }
                            >
                              {emp.std_details.batch_list.map(
                                (opt, index) =>
                                  opt.label != "All" && (
                                    <option key={index} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  )
                              )}
                            </select>
                          </DynamicTooltip>
                        </td>

                        <td className="assigned assigned-batch">
                          <DynamicTooltip
                            direction="bottom"
                            text={emp.std_details.fly_batch_id_text}
                          >
                            <select
                              value={emp.std_details.fly_batch_id}
                              onChange={(e) =>
                                handleBatchChange(e, emp.std_details, "flying")
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              disabled={
                                emp?.std_details?.batch_start_status ===
                                "running"
                                  ? true
                                  : false
                              }
                            >
                              {emp.std_details.fly_batch_list.map(
                                (opt, index) =>
                                  opt.label != "All" && (
                                    <option key={index} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  )
                              )}
                            </select>
                          </DynamicTooltip>
                        </td>

                        <td>{emp.classes.length}</td>
                        <td className="cp">
                          <FaThList
                            className="icon mail-icon fs18 fc5 p8"
                            onClick={() =>
                              toggleRow(emp.std_details.student_batch_id)
                            }
                          />
                          {/* <MdOutlineGridOn
                      className="icon mail-icon fs18 fc5 pr8 pt8 pb8"
                      onClick={() => setAttendanceShow(true)}
                    /> */}
                        </td>
                      </tr>

                      {expandedRow === emp.std_details.student_batch_id && (
                        <tr>
                          <td colSpan={8}>
                            <div className="class-details mb16">
                              <p className="fw6 mb8 tal fs16 ls1 tdu">
                              Classes Details
                              </p>
                              <table className="w100">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Date</th>
                                    <th>Batch Type</th>
                                    <th>Batch Name</th>
                                    <th>Classes</th>
                                    <th>Timings</th>
                                    <th>Instructor</th>
                                    <th>Mode</th>
                                    <th>Class Type</th>
                                    <th>Subject</th>
                                    <th>Chapter</th>
                                    <th>Location</th>
                                    <th>Room </th>
                                    <th>Link</th>
                                    <th>Attendance</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {emp &&
                                  emp.classes &&
                                  emp.classes.length > 0 ? (
                                    emp.classes.map((classDetail, index) => {
                                      const classDate = moment(classDetail.class_date);
                                      const isFutureDate = classDate.isAfter(moment(), "day");
                                      return (
                                        <React.Fragment
                                          key={index + classDetail.id}
                                        >
                                           <tr>
                                            <td>
                                            <label
                                              className={`${isFutureDate ? "disabled-input" : "cp"
                                              } checkbox-label p10`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={!isFutureDate && selectedClass.includes(classDetail.id)}
                                                onChange={() => handleBatchAssigned(classDetail.id)}
                                                className={`${isFutureDate ? "disabled-input" : ""}`}
                                                disabled={isFutureDate} // Disable checkbox if past or future
                                              />
                                            </label>
                                            </td>
                                            <td>
                                            {classDetail.class_date ? moment(classDetail.class_date).format("DD MMM YYYY") : "N/A"}
                                            </td>
                                            <td
                                             style={{
                                                    color: giveTextColor(
                                                      classDetail.batch_type === "Theory"
                                                        ? "blue"
                                                        : classDetail.batch_type === "Flying"
                                                          ? "indigo"
                                                            : classDetail.batch_type
                                                    ),
                                                    textTransform: "capitalize",
                                                  }}
                                            >
                                              {classDetail.batch_type || "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.batch_name || "N/A"}
                                            </td>
                                            <td>
                                              {`Class ${index+1}` || "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.timings || "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.instructor_name ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.class_mode ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.class_type ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.subject_name ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.chapter_name ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.location_name ||
                                                "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.room_no || "N/A"}
                                            </td>
                                            <td>
                                              {classDetail.class_link	 ? (
                                                <a
                                                  href={
                                                    classDetail.class_link	
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  style={{
                                                    color: "blue",
                                                    textDecoration: "underline",
                                                  }}
                                                >
                                                  Link
                                                </a>
                                              ) : (
                                                "N/A"
                                              )}
                                            </td>
                                            <td
                                              className={
                                                classDetail.attendance ===
                                                "Absent"
                                                  ? "fc9"
                                                  : classDetail.attendance ===
                                                      "Present"
                                                    ? "fc13"
                                                    : ""
                                              }
                                            >
                                              {classDetail.attendance || "N/A"}
                                            </td>
                                          </tr>
                                        </React.Fragment>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan="15" className="text-center">
                                        No class available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              )}
            </table>

            {(selectedInstructor.length > 0 || selectedClass.length > 0) && (
              <div className="df fc3 fixed-buttons-mylead">
                <button
                  type="button"
                  className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 fc3"
                  onClick={handleAssignToButtonClick}
                >
                  Mark Attendance
                </button>
              </div>
            )}
            {showConfirmation && (
              <div className="student-roaster">
                <Popup title="" onClose={cancelBatchChange}>
                  <p className="ls1 lh18 fs16 mb24">
                    Are you sure you want to change the batch?
                  </p>
                  <div className="popup-buttons">
                    <button
                      onClick={confirmBatchChange}
                      className="update-button btn-blue box-center mr24"
                    >
                      Yes
                    </button>
                    <button onClick={cancelBatchChange} className="btn-cancel">
                      No
                    </button>
                  </div>
                </Popup>
              </div>
            )}
            {isAssignToPopupVisible && (
              <Popup
                onClose={closePopup}
                title={!isConfirmVisible ? "Mark Attendance" : "Confirmation "}
              >
                {!isConfirmVisible ? (
                  <>
                    <div className="assigned mb16">
                      <SingleDropdown
                        label="Mark Attendance"
                        options={attendanceOptions}
                        selectedOption={assigned}
                        onSelect={setAssigned}
                        placeholder="Mark Attendance"
                      />
                    </div>
                    <div className="button-container ">
                      <button
                        className="update-button btn-blue box-center"
                        onClick={() => setIsConfirmVisible(true)}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={closePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="confirmation-container">
                    <p className="tac mb24">
                      Are you sure you want to update the attendance?
                    </p>
                    <div className="df jcc">
                      <button
                        className="update-button btn-blue box-center"
                        onClick={handleAssignToClick}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setIsConfirmVisible(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
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
                  <p className="fs18 fc1 ">Attendance</p>
                  <button
                    onClick={() => {
                      setAttendanceShow(false);
                      document.body.style.overflow = "auto";
                    }}
                    className="lead-close-button"
                  >
                    X
                  </button>
                </div>
                <div className="p8 w100">
                  <CalendarComponent month={1} year={2024} />
                </div>
              </SidePopup>
            )}
            {studentAttendanceShow && (
              <SidePopup
                show={studentAttendanceShow}
                onClose={() => {
                  setAttendanceShow(false);
                  document.body.style.overflow = "auto";
                }}
                className="full-width"
              >
                <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
                  <p className="fs18 fc1 ">Attendance</p>
                  <button
                    onClick={() => {
                      setStudentAttendanceShow(false);
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
      
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default StudentRoaster;
