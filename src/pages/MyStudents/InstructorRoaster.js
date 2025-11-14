import React, { useState } from "react";
import "../MyStudents/MyStudents.css";
import SingleDropdown from "../../components/SingleDropdown";
import Tooltip from "../../components/Tooltip";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import CalendarComponent from "../../components_two/CalendarComponent";
import SidePopup from "../../components/Popup/SidePopup";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import { MdCall, MdOutlineMail } from "react-icons/md";
import Avatar from "../../assets/profile.png";
import { useTitle } from "../../hooks/useTitle.js";

const InstructorRoaster = () => {
    useTitle("Instructor Roster - Flapone Aviation");
  
  const [runningData, setRunningData] = useState([
    {
      id: 8146,
      status: "New",
      payment_status: "Partial",
      name: "Amit Kumar",
      course: "Aircraft Training",
      roll_no: "",
      rm: "Ashish Kumar Singh",
      coordinator: "Jane Smith",
      preferred_batch: "Batch A",
      allotted_batch: "Batch B",
      batch_status: "Running",
      branch: "Mumbai",
      batch_start_date: "4 June 2024",
      batch_end_date: "9 June 2024",
      assigned: 92679,
      user_type: "Student",
      doc_status: 1,
    },
    {
      id: 89795,
      status: "Batch Allotted",
      payment_status: "Completed",
      name: "Mahesh Kumar",
      course: "Aircraft Training",
      roll_no: "RK89795",
      rm: "Bhawna Jain",
      coordinator: "Jane Smith",
      preferred_batch: "Batch B",
      allotted_batch: "Batch B",
      batch_status: "Running",
      branch: "Shimla",
      batch_start_date: "13 June 2024",
      batch_end_date: "23 June 2024",
      user_type: "Student",
      doc_status: 0,
      assigned: 130057,
    },
    {
      id: 57458,
      status: "Dropped",
      payment_status: "Partial",
      name: "Virat Kholi",
      course: "Aircraft Training",
      roll_no: "RK57458",
      rm: "Vikash Singh",
      coordinator: "Jane Smith",
      preferred_batch: "Batch C",
      allotted_batch: "Batch A",
      batch_status: "Upcoming",
      branch: "Ghaziabad",
      batch_start_date: "3 June 2024",
      batch_end_date: "5 June 2024",
      user_type: "Student",
      doc_status: 0,
      assigned: 132135,
    },
    {
      id: 93001,
      status: "Running",
      payment_status: "Completed",
      name: "Prakash Jha",
      course: "Aircraft Training",
      roll_no: "RK93001",
      rm: "Anirudh Jha",
      coordinator: "Jane Smith",
      preferred_batch: "Batch D",
      allotted_batch: "Batch B",
      batch_status: "Running",
      branch: "Delhi",
      batch_start_date: "1 June 2024",
      batch_end_date: "8 June 2024",
      user_type: "Company",
      doc_status: 0,
      assigned: 139636,
    },
  ]);
  const [rollNoInput, setRollNoInput] = useState({});
  const [attendanceShow, setAttendanceShow] = useState(false);

  const [assigned, setAssigned] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const navigate = useNavigate();
  const [agentOptions, setAgentOptions] = useState([
    {
      label: "All",
      value: "",
    },
    {
      value: "92679",
      label: "Anuj Pratap Singh",
    },
    {
      value: "132135",
      label: "Ashish Kumar",
    },
    {
      value: "64967",
      label: "Bhawna Jain",
    },
    {
      value: "139636",
      label: "chhavi.tyagi ",
    },
    {
      value: "133444",
      label: "Jyoti Madan Ray",
    },
    {
      value: "130057",
      label: "Parveen Siddique",
    },
  ]);

  const currentDate = moment().format("DD/MM/YYYY");
  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.includes(leadId)) {
        return prevSelectedLeads.filter((id) => id !== leadId);
      } else {
        return [...prevSelectedLeads, leadId];
      }
    });
  };

  const handleAssignToClick = () => {
    const updatedLeads = runningData.map((lead) => {
      if (selectedLeads.includes(lead.id)) {
        return { ...lead, assignedTo: assigned };
      } else {
        return lead;
      }
    });

    setRunningData(updatedLeads);
    setSelectedLeads([]);
    setAssigned("");
    setAssignToPopupVisible(false);
  };
  const handleAssignToDropdownChange = (event, leadId) => {
    const updatedLeads = runningData.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, assigned: event.target.value };
      } else {
        return lead;
      }
    });

    setRunningData(updatedLeads);
  };
  const handleHeaderCheckboxChange = (event) => {
    const allLeadIds = runningData.map((lead) => lead.id);
    setSelectedLeads(event.target.checked ? allLeadIds : []);
  };

  const isHeaderCheckboxChecked =
    selectedLeads.length === runningData.length && selectedLeads.length > 0;

  const handleAssignToButtonClick = () => {
    setAssignToPopupVisible(true);
  };
  const closePopup = () => {
    setAssignToPopupVisible(false);
  };
  const handleRowClick = (studentID) => {
    navigate(`/my-leads/${studentID}`);
  };
  const handleRollNoChange = (e, studentId) => {
    const value = e.target.value;

    setRollNoInput((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleRollNoSubmit = (studentId) => {
    const updatedStudents = runningData.map((student) =>
      student.id === studentId
        ? { ...student, roll_no: rollNoInput[studentId] }
        : student
    );
    setRunningData(updatedStudents);
    setRollNoInput((prev) => ({ ...prev, [studentId]: "" }));
  };
  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: 77415
      </div>
      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="cp"
                    checked={isHeaderCheckboxChecked}
                    onChange={handleHeaderCheckboxChange}
                  />
                </label>
              </th>
              <th>
                <p className="box-center">
                  ID
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {runningData.length === 0 ? (
              <tr>
                <td colSpan="20" className="no-students">
                  No Data Available
                </td>
              </tr>
            ) : (
              runningData.map((student, index) => {
                return (
                  <tr key={index} onClick={() => handleRowClick(student.id)}>
                    <td>
                      <label className="checkbox-label cp p10">
                        <input
                          type="checkbox"
                          className="cp"
                          checked={selectedLeads.includes(student.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckboxChange(student.id);
                          }}
                        />
                      </label>
                    </td>
                    <td>{student.id}</td>
                    <td className="leads-tool-fix">
                      <div className="df aic attendance-row">
                        <div className="avatar-sm mr8">
                          <img
                            src={student.img ? student.img : Avatar}
                            alt="avatar"
                          />
                        </div>
                        <p className="df fdc ais">
                          <span
                            className={`ls1 fs14 pb2 ${student.pendingAmount > 0 ? "fc9" : "fc2"}`}
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
                              {/* {student.gender.charAt(0)} - {student.age}y{" "} */}
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {selectedLeads.length > 0 && (
          <div className="df fc3 fixed-buttons-mylead">
            <button
              type="button"
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 fc3"
              onClick={handleAssignToButtonClick}
            >
              Assign To
            </button>
          </div>
        )}
        {isAssignToPopupVisible && (
          <Popup onClose={closePopup} title={"Select Agent"}>
            <div className="assigned">
              <SingleDropdown
                label="Assign To"
                options={agentOptions}
                selectedOption={assigned}
                onSelect={setAssigned}
              />
            </div>
            <div className="button-container">
              <button type="button" className="btn-cancel" onClick={closePopup}>
                Cancel
              </button>
              <button
                className="update-button btn-blue box-center"
                onClick={handleAssignToClick}
              >
                Update
              </button>
            </div>
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
              <p className="fs18 fc1 ">Student Attendance</p>
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
              <CalendarComponent />
            </div>
          </SidePopup>
        )}
      </div>
    </>
  );
};

export default InstructorRoaster;
