import React, { useEffect, useState } from "react";
import "../MyStudents/MyStudents.css";
import Avatar from "../../assets/profile.png";
import { FaEye, FaFileSignature, FaThList } from "react-icons/fa";
import { MdCall, MdEdit, MdOutlineGridOn, MdOutlineMail } from "react-icons/md";
import Tooltip from "../../components/Tooltip";
import { IoIosArrowDropdown } from "react-icons/io";
import "./InstructorRoaster.css";
import { giveTextColor } from "../../helpers/textColors";
import daysOfWeek from "../../data/DaysWeek";
import CalendarComponent from "../../components/CalendarComponent.js";
import SidePopup from "../../components/Popup/SidePopup";
import SingleDropdown from "../../components/SingleDropdown";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import axios from "axios";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import constant from "../../constant/constant.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { ToastContainer, toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle.js";

const InstructorRoaster = ({recordList, setRecordList, displayMsg, allApiFilter, pageCount,handleSortByChange, activeSortColumn,setlocation,setroomtoclass,setclassmeetlink,setclasstaken,assignInstructor}) => {
  //return false;
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Instructor Roster - Flapone Aviation");
  
  const [employeeData, setEmployeeData] = useState([]);
  const [studentList, setStudentList] = useState([]);
  // const [employeeData, setEmployeeData] = useState([
  //   {
  //     emp_details: {
  //       emp_id: "123112",
  //       emp_name: "Naveen Kumar Tiwari",
  //       age: "26y",
  //       gender: "Male",
  //       designation: "Drone Instructor",
  //     },
  //     classes: [
  //       {
  //         batch_id: "1",
  //         batch_name: "Class 10",
  //         date: "17 Oct 2024",
  //         timings: "9:30Am - 10:30Am",
  //         subject: "Radio",
  //         chapter: "Radio",
  //         roomNumber: "G-303",
  //         location: "Dwarka",
  //         batch: "AP22Sep2024",
  //         assigned: "123112",
  //         oneline_link: "https://zoom.us/signin#/login",
  //         classTaken: { label: "Yes", value: "yes" },
  //         studentList: [
  //           {
  //             id: "S101",
  //             studentName: "Virat Kholi",
  //             img: "https://www.hlimg.com/images/flapone-crm/assets//images/user_img/WhatsApp-Image-2024-09-16-at-12.50.46-PM_1726471371.jpeg",
  //             email: "Virat@flapone.com",
  //             mobile: "9818250039",
  //             gender: "Male",
  //             age: 22,
  //             paymentStatus: "Paid",
  //             docStatus: "Complete",
  //             pendinAmount: 0,
  //             attendance: ["Tuesday", "Thursday"],
  //           },
  //           {
  //             id: "S102",
  //             studentName: "Rohit",
  //             img: "https://www.hlimg.com/images/flapone-crm/assets//images/user_img/WhatsApp-Image-2024-09-16-at-12.50.46-PM_1726471371.jpeg",
  //             email: "rohiy@example.com",
  //             mobile: "0987654321",
  //             gender: "Female",
  //             age: 23,
  //             paymentStatus: "Pending",
  //             docStatus: "Pending",
  //             pendinAmount: "200Rs",
  //             attendance: ["Sunday", "Friday"],
  //           },
  //           {
  //             id: "S103",
  //             img: "",
  //             studentName: "Alice Johnson",
  //             email: "alice.johnson@ht.com",
  //             mobile: "1122334455",
  //             gender: "Female",
  //             age: 24,
  //             paymentStatus: "Pending",
  //             docStatus: "Pending",
  //             pendinAmount: "500Rs",
  //             attendance: ["Sunday", "Monday"],
  //           },
  //         ],
  //       },
  //       {
  //         batch_id: "2",
  //         batch_name: "Class 2",
  //         timings: "9:30Am - 10:30Am",
  //         date: "31 Oct 2024",
  //         subject: "Radio",
  //         chapter: "Radio",
  //         roomNumber: "G-303",
  //         location: "Dwarka",
  //         batch: "AP22Sep2024",
  //         assigned: "123112",
  //         oneline_link: "https://zoom.us/signin#/login",
  //         classTaken: { label: "Upcoming", value: "upcoming" },
  //         studentList: [
  //           {
  //             id: "S101",
  //             studentName: "Virat Kholi",
  //             img: "https://www.hlimg.com/images/flapone-crm/assets//images/user_img/WhatsApp-Image-2024-09-16-at-12.50.46-PM_1726471371.jpeg",
  //             email: "Virat@flapone.com",
  //             mobile: "9818250039",
  //             gender: "Male",
  //             age: 22,
  //             paymentStatus: "Paid",
  //             docStatus: "Complete",
  //             pendinAmount: 0,
  //             attendance: ["Tuesday", "Thursday"],
  //           },
  //           {
  //             id: "S102",
  //             studentName: "Rohit",
  //             img: "https://www.hlimg.com/images/flapone-crm/assets//images/user_img/WhatsApp-Image-2024-09-16-at-12.50.46-PM_1726471371.jpeg",
  //             email: "rohiy@example.com",
  //             mobile: "0987654321",
  //             gender: "Female",
  //             age: 23,
  //             paymentStatus: "Pending",
  //             docStatus: "Pending",
  //             pendinAmount: "500Rs",
  //             attendance: ["Sunday", "Friday"],
  //           },
  //           {
  //             id: "S103",
  //             img: "",
  //             studentName: "Alice Johnson",
  //             email: "alice.johnson@ht.com",
  //             mobile: "1122334455",
  //             gender: "Female",
  //             age: 24,
  //             paymentStatus: "Pending",
  //             docStatus: "Pending",
  //             pendinAmount: "500Rs",
  //             attendance: ["Sunday", "Monday"],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     emp_details: {
  //       emp_id: "123113",
  //       emp_name: "Kamlesh Gupta",
  //       age: "26y",
  //       gender: "Male",
  //       designation: "Pilot Instructor",
  //     },
  //     classes: [
  //       {
  //         batch_id: "3",
  //         batch_name: "Batch 2",
  //         timings: "11:30 - 12:30",
  //         date: "18 Oct 2024",
  //         subject: "Radio",
  //         roomNumber: "G-303",
  //         location: "Dwarka",
  //         batch: "AP22Sep2024",
  //         chapter: "Radio",
  //         assigned: "123113",
  //         classTaken: "No",
  //         studentList: [
  //           {
  //             id: "S101",
  //             studentName: "Virat Kholi",
  //             img: "https://www.hlimg.com/images/flapone-crm/assets//images/user_img/WhatsApp-Image-2024-09-16-at-12.50.46-PM_1726471371.jpeg",
  //             email: "Virat@flapone.com",
  //             mobile: "9818250039",
  //             gender: "Male",
  //             age: 22,
  //             paymentStatus: "Paid",
  //             docStatus: "Complete",
  //             pendinAmount: 0,
  //             attendance: ["Tuesday", "Thursday"],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [attendanceShow, setAttendanceShow] = useState(false);
  const [studentAttendanceShow, setStudentAttendanceShow] = useState(false);
  const [expandedClassRow, setExpandedClassRow] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const [assigned, setAssigned] = useState("");
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [changeType, setChangeType] = useState("");
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLinkPopupVisible, setIsLinkPopupVisible] = useState(false);
  var classDetail = {
      id: null
  };

  const toggleRow = (empId) => {
    setExpandedRow(expandedRow === empId ? null : empId);
  };
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const toggleClassRow = (classIndex,class_detail_id) => {
    setExpandedClassRow(expandedClassRow === classIndex ? null : classIndex);
    if(expandedClassRow !== classIndex ){
    classDetail.id = class_detail_id;
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myclasses_list.php?fun=getstudentlistrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { classDetail: classDetail},
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setStudentList([...response.data.data.list.studentList]);
        }else{
          //toast.warn(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
    }
  };
  // const handleCheckboxChange = (leadId) => {
  //   setSelectedInstructor((prevselectedInstructor) => {
  //     if (prevselectedInstructor.includes(leadId)) {
  //       return prevselectedInstructor.filter((id) => id !== leadId);
  //     } else {
  //       return [...prevselectedInstructor, leadId];
  //     }
  //   });
  // };
  useEffect(() => {
    
      setEmployeeData([...recordList]);
    
  }, [recordList]);
  const handleStudentRowClick = (stId) => {
    window.open(`/my-leads/${stId}`, "_blank");
  };
  const handleCheckboxChange = (empId) => {
    const isChecked = selectedInstructor.includes(empId);
    const currentInstructor = employeeData.find(
      (emp) => emp.emp_details.emp_id === empId
    );

    setSelectedInstructor((prev) => {
      if (isChecked) {
        // If unchecked, remove instructor and all their batch selections
        const updatedBatches = selectedBatch.filter(
          (class_detail_id) =>
            !currentInstructor.classes.some(
              (classDetail) => classDetail.class_detail_id === class_detail_id
            )
        );
        setSelectedBatch(updatedBatches);
        return prev.filter((id) => id !== empId);
      } else {
        // If checked, add instructor and all their batch selections
        const newBatches = currentInstructor.classes
          .filter((classDetail) =>
            moment(classDetail.date).isSameOrAfter(moment(), "day")
          )
          .map((classDetail) => classDetail.class_detail_id);

        setSelectedBatch((prevBatches) => [
          ...new Set([...prevBatches, ...newBatches]),
        ]);
        return [...prev, empId];
      }
    });
  };
  

  const handleBatchAssigned = (batchId) => {
    setSelectedBatch((prev) => {
      if (prev.includes(batchId)) {
        return prev.filter((id) => id !== batchId);
      } else {
        return [...prev, batchId];
      }
    });
  };

  const handleAssignToButtonClick = () => {
    setAssignToPopupVisible(true);
  };
  const closePopup = () => {
    setAssignToPopupVisible(false);
  };
  

  const roomNumbers = JSON.parse(allApiFilter['class_room']);
  const locationOptions = JSON.parse(allApiFilter['locationListOptions']);
  const classTakenOptions = JSON.parse(allApiFilter['classTakenOptions']);
  const classTakenOptions2 = JSON.parse(allApiFilter['classTakenOptions2']);
  const agentOptions = JSON.parse(allApiFilter['agentoption']);

  const handleSubjectChange = (e, batchId) => {
    const newSubject = e.target.value;
    setPendingChange({ type: 'subject', batchId, newValue: newSubject });
    setShowConfirmation(true);
  };
  
  const handleChapterChange = (e, batchId) => {
    const newChapter = e.target.value;
    setPendingChange({ type: 'chapter', batchId, newValue: newChapter });
    setShowConfirmation(true);
  };
  
  const handleRoomChange = (e, class_detail_id) => {
    const newRoom = e.target.value;
    setPendingChange({ type: 'roomNumber', class_detail_id, newValue: newRoom });
    setShowConfirmation(true);
  };
  const handlelinkChange = (e, class_detail_id) => {
    const link_meet = e.target.value;
    setPendingChange({ type: 'online_link', class_detail_id, newValue: link_meet });
    const type="online_link";
    setEmployeeData((prevData) =>
      prevData.map((emp) => ({
        ...emp,
        classes: emp?.classes?.map((cls) =>
          cls.class_detail_id === class_detail_id 
            ? { 
                ...cls, 
                [type]: link_meet 
              } 
            : cls
        ),
      }))
    );
  };

  const handleLocationChange = (e, class_detail_id) => {
    const newLocation = e.target.value;
    setPendingChange({ type: 'location', class_detail_id, newValue: newLocation });
   
    setShowConfirmation(true);
  };
  
  const confirmChange = () => {
    const { type, class_detail_id, newValue } = pendingChange;
    setEmployeeData((prevData) =>
      prevData.map((emp) => ({
        ...emp,
        classes: emp?.classes?.map((cls) =>
          cls.class_detail_id === class_detail_id 
            ? { 
                ...cls, 
                [type]: newValue 
              } 
            : cls
        ),
      }))
    );
    if(type==='location'){
      setlocation(class_detail_id,newValue);
    }else if(type==='roomNumber'){
      setroomtoclass(class_detail_id,newValue);
    }
    setShowConfirmation(false);
    setPendingChange(null);
  };
  
  const cancelChange = () => {
    setShowConfirmation(false);
    setPendingChange(null);
  };

  const handleClassTakenChange = (e, class_detail_id) => {
    const classTakenStatus = e.target.value;
    setclasstaken(class_detail_id,classTakenStatus);
    setEmployeeData((prevData) =>
      prevData.map((emp) => ({
        ...emp,
        classes: emp.classes.map((cls) =>
          cls.class_detail_id === class_detail_id 
            ? { 
                ...cls, 
                ['classTaken']: classTakenStatus 
              } 
            : cls
        ),
      }))  );

  };
  const handleOpenLink = (link) => {
    window.open(link, "_blank");
  };

  const handleEditClick = (index) => {
    setEditingLinkIndex(index);
  };

  const handleSaveClick = (index) => {
    setEditingLinkIndex(null);
    setIsLinkPopupVisible(false)
    const { type, class_detail_id, newValue } = pendingChange;
    if(newValue!=''){
    setEmployeeData((prevData) =>
      prevData.map((emp) => ({
        ...emp,
        classes: emp.classes.map((cls) =>
          cls.class_detail_id === class_detail_id 
            ? { 
                ...cls, 
                [type]: newValue 
              } 
            : cls
        ),
      }))
    );
    if(type==='online_link'){
      setclassmeetlink(class_detail_id,newValue);
    }
  }else{
    toast.warn("Field is Empty!");
  }

  };
  const handleAssignToClick = () => {
    assignInstructor(selectedBatch,selectedInstructor,assigned);
    setIsConfirmVisible(false);
    setAssignToPopupVisible(false);
    setSelectedBatch([]);
  };
  
  return (
  
      <><div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {employeeData.length}
      </div>
      <div
        className=" table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="instructor-table wsnw">
          <thead>
            <tr>
              <th></th>
              <th>Employee Id</th>
              <th>Instructor Name</th>
              <th>Scheduled Classes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((emp) => (
              <React.Fragment key={emp.emp_details.emp_id}>
                <tr>
                  <td>
                    <label className="checkbox-label cp p10">
                      {emp.classes!==undefined && <input
                        type="checkbox"
                        checked={selectedInstructor.includes(
                          emp.emp_details.emp_id
                        )}
                        onChange={() =>
                          handleCheckboxChange(emp.emp_details.emp_id)
                        }
                      />}
                    </label>
                  </td>
                  <td>{emp.emp_details.emp_id}</td>
                  <td>
                    <div className="instructor-info">
                    <img
                        src={emp.emp_details?.user_image ? emp.emp_details?.user_image : Avatar}
                        alt="Instructor"
                        className="instructor-image"
                        onError={(e) => e.target.src = Avatar}
                      />
                      <div className="instructor-details df fdc ais">
                        <p className="ls1 v-center">
                          <p className="pb2 fw6 fs16 ls1 lh18">
                            {emp.emp_details.emp_name}
                          </p>
                          <Tooltip title="mobile">
                            <a href={`tel:${emp.emp_details.mobile_number}`}>
                              <MdCall className="fs16 ml4 fc5" />
                            </a>
                          </Tooltip>
                        </p>
                        <p className="fs12 lh16 ls1 fc5">
                          {emp.emp_details.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{(emp.classes && emp.classes.length) || 0}</td>
                  <td className="cp">
                  {emp.classes && emp.classes.length>0 &&  <FaThList
                      className="icon mail-icon fs18 fc5 p8"
                      onClick={() => toggleRow(emp.emp_details.emp_id)}
                    />}
                  {/* <MdOutlineGridOn
                      className="icon mail-icon fs18 fc5 pr8 pt8 pb8"
                      onClick={() => setAttendanceShow(true)}
                    /> */}
                  </td>
                </tr>

                {expandedRow === emp.emp_details.emp_id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="class-details mb16">
                        <p className="fw6 mb8 tal fs16 ls1 tdu">
                          Clasess Details
                        </p>
                        <table className="w100">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Date</th>
                              <th>Classes</th>
                              <th>Batch</th>
                              <th>Timings</th>
                              <th>Class Type</th> 
                              <th>Subject</th>
                              <th>Chapter</th>
                              {/* <th>Mode</th> */}
                              <th>Location</th>
                              <th>Room No.</th>
                              <th>Link</th>
                              <th>No of Students</th>
                              <th>Class Taken</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emp.classes && emp.classes.map((classDetail, index) => {
                              const isPastDate = moment(
                                classDetail.date
                              ).isBefore(moment(), "day");

                              return (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td>
                                      <label
                                        className={`${isPastDate ? "disabled-input" : "cp"} checkbox-label p10`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedBatch.includes(
                                            classDetail.class_detail_id
                                          )}
                                          onChange={() =>
                                            handleBatchAssigned(
                                              classDetail.class_detail_id
                                            )
                                          }
                                          disabled={isPastDate}
                                          className={`${isPastDate ? "disabled-input" : ""}`}
                                        />
                                      </label>
                                    </td>
                                    <td>{classDetail.date || "N/A"}</td>
                                    <td>{classDetail.batch_name || "N/A"}</td>
                                    <td>{classDetail.batch || "N/A"}</td>
                                    <td>{classDetail.timings || "N/A"}</td>
                                    <td className="assigned">
                                      {classDetail.class_type}
                                    </td>
                                    <td className="assigned">
                                      {classDetail.subject}
                                      {/* <select
                                        value={classDetail.subject}
                                        onChange={(e) =>
                                          handleSubjectChange(
                                            e,
                                            classDetail.batch_id
                                          )
                                        }
                                      >
                                        {subjects.map((subject) => (
                                          <option
                                            key={subject.value}
                                            value={subject.value}
                                          >
                                            {subject.label}
                                          </option>
                                        ))}
                                      </select> */}
                                    </td>
                                    <td className="assigned">
                                    {classDetail.chapter_name || "N/A"}
                                      {/* <select
                                        value={classDetail.chapter_name}
                                        onChange={(e) =>
                                          handleChapterChange(
                                            e,
                                            classDetail.batch_id
                                          )
                                        }
                                      >
                                        {chapters.map((chapter) => (
                                          <option
                                            key={chapter.value}
                                            value={chapter.value}
                                          >
                                            {chapter.label}
                                          </option>
                                        ))}
                                      </select> */}
                                    </td>
                                    {/* <td className="assigned">
                                      <select
                                        value={classDetail.location}
                                        onChange={(e) =>
                                          handleLocationChange(
                                            e,
                                            classDetail.class_detail_id
                                          )
                                        }
                                         disabled={isPastDate}
                                      >
                                        {locationOptions.map((location) => (
                                          <option
                                            key={location.value}
                                            value={location.value}
                                          >
                                            {location.label}
                                          </option>
                                        ))}
                                      </select>
                                    </td> */}
                                    <td className="assigned">
                                    {classDetail.location>0
                      ? locationOptions?.find((location) => location.value == classDetail.location)?.label || '-': "-"}
                                      {/* <select
                                        value={classDetail.location}
                                        onChange={(e) =>
                                          handleLocationChange(
                                            e,
                                            classDetail.class_detail_id
                                          )
                                        }
                                         disabled={isPastDate}
                                      >
                                        {locationOptions.map((location) => (
                                          <option
                                            key={location.value}
                                            value={location.value}
                                          >
                                            {location.label}
                                          </option>
                                        ))}
                                      </select> */}
                                    </td>
                                    <td className="assigned">
                                      <select
                                        value={classDetail.roomNumber}
                                        onChange={(e) =>
                                          handleRoomChange(
                                            e,
                                            classDetail.class_detail_id
                                          )
                                        }
                                         disabled={isPastDate}
                                      >
                                      {classDetail.location && roomNumbers[classDetail.location].map((room) => (
                                        <option
                                          key={room.value}
                                          value={room.value}
                                        >
                                          {room.label}
                                        </option>
                                      ))}
                                      </select>
                                    </td>
                                    <td className="cp one-line-link">
                                      {editingLinkIndex === index ? (
                                        <div>
                                          <input
                                            type="text"
                                            value={classDetail.online_link}
                                            onChange={(e) =>
                                              handlelinkChange(
                                                e,
                                                classDetail.class_detail_id
                                              ) 
                                            }
                                          />
                                          <div className="mt8">
                                            <button
                                              onClick={() =>
                                                setIsLinkPopupVisible(true)
                                              }
                                              className="mr8 bg1 fc3 pl8 pr8 pt4 pb4 br4 ls1 fs12 cp"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={() =>
                                                setEditingLinkIndex(null)
                                              }
                                              className="mr8 bg1 fc3 pl8 pr8 pt4 pb4 br4 ls1 fs12 cp"
                                            >
                                              Cancel
                                            </button>
                                          </div>

                                          {isLinkPopupVisible && (
                                            <div className="student-roaster">
                                              <Popup
                                                onClose={() =>
                                                  setIsLinkPopupVisible(false)
                                                }
                                                title="Confirmation"
                                              >
                                                <p className="mb16 ls1">
                                                  Are you sure you want to
                                                  update the link?
                                                </p>
                                                <div className="df jcc">
                                                  <button
                                                    onClick={() =>
                                                      handleSaveClick(index)
                                                    }
                                                    className="update-button btn-blue box-center mr24"
                                                  >
                                                    Yes
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      setIsLinkPopupVisible(
                                                        false
                                                      )
                                                    }
                                                    className="btn-cancel"
                                                  >
                                                    No
                                                  </button>
                                                </div>
                                              </Popup>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="v-center">
                                          {classDetail.online_link ? (
                                            <a
                                              href={classDetail.online_link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                color: "blue",
                                                textDecoration: "underline",
                                              }}
                                            >
                                              Zoom Link
                                            </a>
                                          ) : (
                                            "N/A"
                                          )}
                                          {!isPastDate && <MdEdit
                                            className="fs18 ml8 fc5"
                                            onClick={() =>
                                              handleEditClick(index)
                                            } // Edit karne ke liye
                                          />}
                                        </div>
                                      )}
                                    </td>

                                     <td onClick={() => {if (classDetail.alloted_student > 0) {toggleClassRow(index, classDetail.fk_daywaise_class_mapping_id);}}}>
                                      <span
                                        className={`box-center cp ${expandedClassRow === index ? "highlight" : ""}`}
                                      >
                                        {classDetail.alloted_student}
                                        {classDetail.alloted_student>0 &&<IoIosArrowDropdown
                                          className={`ml4 fs18 ${expandedClassRow === index ? "rotate highlight" : ""}`}
                                        />}
                                      </span>
                                    </td>
                                    <td className="assigned">
                                      {classDetail.classTaken?.value ===
                                      "upcoming" ? (
                                        <span className="ls1">
                                          {classDetail.classTaken?.label}
                                        </span>
                                      ) : (
                                        <select
                                          value={classDetail.classTaken}
                                          onChange={(e) =>
                                            handleClassTakenChange(e, classDetail.class_detail_id)
                                          }
                                          disabled={!isPastDate}
                                        >
                                          {(isPastDate ? classTakenOptions2 : classTakenOptions).map((option) => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    </td>
                                  </tr>
                                  {expandedClassRow === index && (
                                    <tr>
                                      <td colSpan={12}>
                                        <p className="fw6 mt8 tal fs16 ls1 tdu">
                                          Student Details
                                        </p>

                                        <table className="w100 mt12">
                                          <thead>
                                            <tr>
                                              <th>ID</th>
                                              <th>Student Name</th>
                                              <th>Payment Status</th>
                                              <th>Attendance</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {studentList.map(
                                              (student) => (
                                                <tr key={student.studentID}>
                                                  <td>{student.studentID}</td>
                                                  <td
                                                    className="student-info name-ellipsis cp"
                                                    onClick={() =>
                                                      handleStudentRowClick(
                                                        student.studentID
                                                      )
                                                    }
                                                  >
                                                    <div className="df aic">
                                                      <div className="avatar-sm mr8">
                                                        <img
                                                          src={
                                                            student.img ||
                                                            Avatar
                                                          }
                                                          alt="avatar"
                                                        />
                                                      </div>
                                                      <p className="df fdc ais">
                                                        <span className="ls1 fs14 pb2">
                                                          {student.name}
                                                        </span>
                                                        <span className="ls1 fc5 df gender-stud">
                                                          <span className="fs12 ls1">
                                                          {student.gender?.charAt(0)}{" "}
                                                          {student.gender ? "-" : ""}{" "}
                                                          {student.age || ""}
                                                          {student.age > 0 ? "y" : ""}
                                                          </span>
                                                          {student.email && (
                                                            <Tooltip title={student.email}>
                                                              <MdOutlineMail className={`fs16 ml4`} />
                                                            </Tooltip>
                                                          )}
                                                          {student.mobile && (
                                                            <Tooltip title={student.mobile}>
                                                              <MdCall className={`fs16 ml4`} />
                                                            </Tooltip>
                                                          )}
                                                        </span>
                                                      </p>
                                                    </div>
                                                  </td>
                                                  <td
                                                    style={{
                                                      color: giveTextColor(
                                                        student.paymentStatus ===
                                                          "Pending"
                                                          ? "Pending"
                                                          : student.paymentStatus ===
                                                              "Paid"
                                                            ? "Completed"
                                                            : student.paymentStatus ===
                                                                "Unpaid"
                                                              ? "Rejected"
                                                              : student.paymentStatus
                                                      ),
                                                      textTransform:
                                                        "capitalize",
                                                    }}
                                                  >
                                                    {student.paymentStatus ===
                                                    "Pending" ? (
                                                      <a
                                                        href={`https://secure.ccavenue.com/txn/S30155`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                          color: "inherit",
                                                          textDecoration:
                                                            "none",
                                                        }}
                                                      >
                                                        {`${student.paymentStatus} (${student.pendingAmount})`}
                                                      </a>
                                                    ) : (
                                                      student.paymentStatus
                                                    )}
                                                  </td>
                                                  <td>
                                                  <p className="box-center w100">
                              {student.attendance.map((day, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    color:
                                      day.attendance === "present"
                                        ? "green"
                                        : "red",
                                    marginRight: "6px",
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      day.attendance === "present"
                                        ? "Present"
                                        : "Absent"
                                    }
                                  >
                                    {day.day.charAt(0)}
                                  </Tooltip>
                                </span>
                              ))}
                           
                                                    <span
                                                      className="ml4 cp fc1 tdu ls1"
                                                      onClick={() =>
                                                        setStudentAttendanceShow(
                                                          true
                                                        )
                                                      }
                                                    >
                                                      (View all)
                                                    </span>
                                                    </p>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                        {studentList.length<=0 && <div className="box-center mt12">No Record Found</div>}
                                      </td>
                                    </tr>
                                  )}
                                  
                                </React.Fragment>
                              );
                            })}
                            
                          </tbody>
                        </table>
                       
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
         
        </table>
        
        {employeeData.length<=0 && <div className="box-center mt12">No Record Found...</div>}
        {(selectedInstructor.length > 0 || selectedBatch.length > 0) && (
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
        {showConfirmation && (
          <div className="student-roaster">
            <Popup title="" onClose={cancelChange}>
              <p className="ls1 lh18 fs16 mb24 tac">
                Are you sure you want to change the room?
              
              </p>
              <div className="popup-buttons df jcc">
                <button
                  onClick={confirmChange}
                  className="update-button btn-blue box-center mr24"
                >
                  Yes
                </button>
                <button onClick={cancelChange} className="btn-cancel">
                  No
                </button>
              </div>
            </Popup>
          </div>
        )}
        {isAssignToPopupVisible && (
          <Popup
            onClose={closePopup}
            title={!isConfirmVisible ? "Select Instructor" : "Confirmation "}
          >
            {!isConfirmVisible ? (
              <>
                <div className="assigned">
                  <SingleDropdown
                    label="Select new instructor"
                    options={agentOptions}
                    selectedOption={assigned}
                    onSelect={setAssigned}
                    placeholder="Select Instructor"
                  />
                </div>
                <div className="button-container">
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
                  Are you sure you want to update the instructor?
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
              <CalendarComponent />
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
     
  );
};

export default InstructorRoaster;
