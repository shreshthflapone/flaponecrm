import React, { useEffect, useState } from "react";
import "../MyStudents/MyStudents.css";
import SingleDropdown from "../../components/SingleDropdown";
import Tooltip from "../../components/Tooltip";
import Popup from "../../components/Popup/Popup";
import CalendarComponent from "../../components/CalendarComponent";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { RiLoader2Fill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import SidePopup from "../../components/Popup/SidePopup";
import axios from "axios";
import StudentHistroy from "./StudentHistroy";
import { IoIosAirplane, IoMdListBox } from "react-icons/io";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import AddLogForm from "../../components/Forms/AddLog";

const AllStudents = ({
  recordList,
  setRecordList,
  displayMsg,
  allApiFilter,
  handleSortByChange,
  signuinStudentAccount,
  handleGenrateRoll,
  setAssignedToUser,
  handleStudentHistory,
  setCoordinatorToUser,
  recordListHistory,
  setBatchToUser,
  allApidata,
  activeSortColumn,
  user,
  applyFilter,
  handleCellClick
  }) => {
                useTitle("Batch Running - Flapone Aviation");
    
  const [allStudentsData, setAllStudentsData] = useState([]);


  const [rollNoInput, setRollNoInput] = useState({});
  const [assigned, setAssigned] = useState({});
  const [assignedBatch, setAssignedBatch] = useState({});
  const [assignedCoordinator, setAssignedCoordinator] = useState({});
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const [attendanceShow, setAttendanceShow] = useState(false);
  const [studentHistory, setStudentHistory] = useState(false);
  const [sameCourseCheck, setSameCourseCheck] = useState("");
  const [courseBaseBatchOption, setCourseBaseBatchOption] = useState(null);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] =useState(false);
  const [addLogPopup, setAddLogPopup] = useState(false);
  const [studnetUserDetail, setStudnetUserDetail] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAllStudentsData([...recordList]);
  }, [recordList]);
 

  const [agentOptions, setAgentOptions] = useState([...JSON.parse(allApiFilter.agentOptions)]);
  const [coordinatorOptions, setCoordinatorOptions] = useState([...JSON.parse(allApiFilter.coordinatorassignlist)]);
  const [batchOptions, setBatchOptions] = useState(allApiFilter.allbatchlist);
  const [FlyingBatchOptions, setFlyingBatchOptions] = useState(allApiFilter.allflyingbatchlist);


  const currentDate = moment().format("DD/MM/YYYY");
 
  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prevSelectedLeads) => {
     
      if (prevSelectedLeads.includes(leadId.id)) {
        if(selectedLeads.length ==1){
          setSameCourseCheck("");
        }
        return prevSelectedLeads.filter((id) => id !== leadId.id);
      } else {
        
        // if (selectedLeads.length > 0) {
          
        //   if (leadId.courseId !== sameCourseCheck) {
        //     toast.warn("Please select leads from the same course");
        //     return prevSelectedLeads; 
        //   } else {
            
        //     return [...prevSelectedLeads, leadId.id];
        //   }
        // } else {
         
        //   if (sameCourseCheck === '') {
        //     setSameCourseCheck(leadId.courseId);
        //     setCourseBaseBatchOption(
        //       Array.isArray(batchOptions[leadId.courseId])
        //         ? batchOptions[leadId.courseId]
        //         : batchOptions[0]
        //     );
        //   }
          
        //   return [...prevSelectedLeads, leadId.id];
        // }

        return [...prevSelectedLeads, leadId.id];
      }
    });
  };

    const handleAssignToClick = () => {
    const updates = {};
  
    if (assigned.value > 0) {
      updates.rmid = assigned.value;
    }
    if (assignedBatch.value > 0) {
      updates.allotted_batch = assignedBatch.value;
    }
    if (assignedCoordinator.value > 0) {
      updates.coordinatorid = assignedCoordinator.value;
    }
  
    if (Object.keys(updates).length > 0) {
      setAllStudentsData(prevData =>
        prevData.map(lead => {
          if (selectedLeads.includes(lead.id)) {
            return { ...lead, ...updates };
          }
          return lead;
        })
      );
  
      if (assigned.value > 0) {
        setAssignedToUser(selectedLeads, assigned.value);
      }
      if (assignedBatch.value > 0) {
        var allstudentid = [];
        allStudentsData.map((lead) => {
          if (selectedLeads.includes(lead.id)) {
            allstudentid.push(lead.id+"|"+lead.wo_id+"|"+lead.courseId);
          }
        });
        setBatchToUser(allstudentid, assignedBatch.value);
      }
      if (assignedCoordinator.value > 0) {
        setCoordinatorToUser(selectedLeads, assignedCoordinator.value);
      }
    }
  
    setSelectedLeads([]);
    setAssigned({});
    setAssignedCoordinator({});
    setAssignedBatch({});
    setAssignToPopupVisible(false);
  };
  
  
  const handleAssignToDropdownChange = (event, leadId,keytype) => {
    if(keytype==='allotted_batch' || keytype==='allottedflying_batch'){
      let split_lead_id = leadId.split("|")[0];
      const updatedLeads = allStudentsData.map((lead) => {
        if (lead.id === split_lead_id) {
          return { ...lead, [keytype==='allottedflying_batch'?"fly_batch_id":keytype]: event.target.value };
        } else {
          return lead;
        }
      });
      setAllStudentsData(updatedLeads);
    }else{
      const updatedLeads = allStudentsData.map((lead) => {
        if (lead.id === leadId) {
          return { ...lead, [keytype]: event.target.value };
        } else {
          return lead;
        }
      });
      setAllStudentsData(updatedLeads);
    }
    if (event.target.value && keytype==='rmid') {
      setAssignedToUser([leadId], event.target.value);
    }else if(event.target.value && keytype==='coordinatorid'){
        setCoordinatorToUser([leadId], event.target.value);
    }
    else if(event.target.value && keytype==='allotted_batch'){
        setBatchToUser([leadId], event.target.value,keytype);
    }
    else if(event.target.value && keytype==='allottedflying_batch'){
        setBatchToUser([leadId], event.target.value,keytype);
    }
  };
  const handleHeaderCheckboxChange = (event) => {
    let temp_coursid = 0;
    if(event.target.checked){
    let  allLeadIds = allStudentsData.map((lead) => {
      if (temp_coursid === 0) {
        temp_coursid = lead.courseId; 
        setSameCourseCheck(lead.courseId); 
        setCourseBaseBatchOption(Array.isArray(batchOptions[temp_coursid]) ? batchOptions[temp_coursid] : batchOptions[0]);
      }
      return lead.id;
      // if (lead.courseId === temp_coursid ) {
      //   return lead.id; 
      // }
    }).filter(Boolean);
      setIsHeaderCheckboxChecked(allLeadIds.length>0); 
      setSelectedLeads(event.target.checked ? allLeadIds : []); 
    }else{
      setIsHeaderCheckboxChecked(false); 
      setSelectedLeads([]);
      setSameCourseCheck(""); 
    }
  };

  const handleAssignToButtonClick = () => {
    setAssignToPopupVisible(true);
  };
  const closePopup = () => {
    setAssignToPopupVisible(false);
  };
  const handleRowClick = (leadId) => {
    if(user.role=='1' || user.role=='2'){
      window.open(`/my-leads/${leadId}`, '_blank');
    }else{
      navigate(`/my-leads/${leadId}`);
    }
  };
  const handleRollNoChange = (e, studentId) => {
    const value = e.target.value;

    setRollNoInput((prev) => ({ ...prev, [studentId]: value }));
  };

  // const handleRollNoSubmit = (studentId) => { 
  //   const updatedStudents = allStudentsData.map((student) =>
  //     student.id === studentId
  //       ? { ...student, roll_no: rollNoInput[studentId] }
  //       : student
  //   );
  //   setAllStudentsData(updatedStudents);
  //   setRollNoInput((prev) => ({ ...prev, [studentId]: "" }));
  // };

   const handleAddLogs = (student) => {
   
  setStudnetUserDetail({
    studentListOption: [
      { value: "", label: "Select Student" },
      {
        value: student.id,
        label: student.name,
        name: student.name,
      }
    ],
    name:student.name,
    user_type: student.user_type,
    company_type: student.company_name!=="-"?student.company_name:"",
    student_id: student.user_id
  });

  setAddLogPopup(true);
};

  const handleAddLogPopupClose = () => {
    setAddLogPopup(false);
  }
  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results:  {allApidata.total_count || 0}
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
              <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}>
                <p className="box-center">
                  ID
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th onClick={() => handleSortByChange("course_status_student")} className={activeSortColumn === "course_status_student" ? "fc1" : ""}>
                <p className="box-center">
                  Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("workorder_payment_status_text")} className={activeSortColumn === "workorder_payment_status_text" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Payment">Pymt</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("name")} className={activeSortColumn === "name" ? "fc1" : ""}>
                <p className="box-center">
                  Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
               <th onClick={() => handleSortByChange("company_name")} className={activeSortColumn === "company_name" ? "fc1" : ""}>
                              <p className="box-center">
                                 <DynamicTooltip direction="bottom" text="Company Name">Company <br/>Name</DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                              </p>
                            </th>
              {/* <th onClick={() => handleSortByChange("roll_no")} className={activeSortColumn === "roll_no" ? "fc1" : ""}>
                <p className="box-center">
                  Roll No.
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("course")} className={activeSortColumn === "course" ? "fc1" : ""}>
                <p className="box-center">
                  Course
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("rm_obj")} className={activeSortColumn === "rm_obj" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Relationship Manager">RM</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("co_obj")} className={activeSortColumn === "co_obj" ? "fc1" : ""}>
                <p className="box-center">
                  Coordinator
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th onClick={() => handleSortByChange("preferred_batch")} className={activeSortColumn === "preferred_batch" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="preferred Batch">P.Batch</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("batch_obj")} className={activeSortColumn === "batch_obj" ? "fc1" : ""}>
                <p className="box-center">
                  Theory
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("flying_obj")} className={activeSortColumn === "flying_obj" ? "fc1" : ""}>
                <p className="box-center">
                  Flying
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("branch")} className={activeSortColumn === "branch" ? "fc1" : ""}>
                <p className="box-center">
                  Branch
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("batch_start_date_long")} className={activeSortColumn === "batch_start_date_long" ? "fc1" : ""}>
                <p className="box-center">
                  Start Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("batch_end_date_long")} className={activeSortColumn === "batch_end_date_long" ? "fc1" : ""}>
                <p className="box-center">
                  End Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center mr5">
                  Action
                  
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {allStudentsData.length === 0 ? (
              <tr>
                <td colSpan="20" className="no-students">
                  No Students Available
                </td>
              </tr>
            ) : (
              allStudentsData.map((student, index) => {
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
                            handleCheckboxChange(student);
                          }}
                        />
                      </label>
                    </td>
                    <td>{student.id}</td>

                    {/* <td
                      style={{
                        color: giveTextColor(
                          student.course_status_student === "New"
                            ? "blue"
                            : student.course_status_student === "Running"
                              ? "Running"
                              : student.course_status_student === "Dropped"
                                ? "red"
                                : student.course_status_student === "Batch Allotted"
                                  ? "Running"
                                  : student.course_status_student
                        ),
                        textTransform: "capitalize",
                      }}
                    >
                      {student.course_status_student}
                    </td> */}
                    <td
                      style={{
                        color: giveTextColor(
                          student.workorder_payment_status_text.includes("Pending")
                            ? "Pending"
                            : student.workorder_payment_status_text === "Completed"
                              ? "Completed"
                              : student.workorder_payment_status_text
                                ? "Rejected"
                                : student.payment_status
                        ),
                        textTransform: "capitalize",
                      }}
                      onClick={(e) => {e.preventDefault();
                        e.stopPropagation(); handleCellClick(student,'wid')}}
                    >
                      {student.workorder_payment_status_text}
                    </td>
                    <td className="leads-tool-fix fs15">
                      <span
                        style={{
                          color: giveTextColor(
                            student.user_type === "student"
                              ? ""
                              : student.user_type === "company"
                                ? "Draft"
                                : ""
                          ),
                        }}
                      >
                      {student.name && (
                          <Tooltip title={student.name}>
                            {student.name.length > 13
                              ? `${student.name.slice(0, 13)}...`
                              : student.name}
                          </Tooltip>
                        )}
                      </span>
                    </td>

                    <td className="leads-tool-fix fs15">
                      {student.company_name && (
                          <Tooltip title={student.company_name}>
                            {student.company_name.length > 13
                              ? `${student.company_name.slice(0, 13)}...`
                              : student.company_name}
                          </Tooltip>
                        )}
                    </td>

                    {/* <td className="roll-input leads-tool-fix">
                      {student.roll_no ? (
                        student.roll_no
                      ) : (
                        <Tooltip title="Genrate Roll Number">
                        <RiLoader2Fill 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenrateRoll(student.id);
                        }}
                        />
                        </Tooltip>
                      )}
                    </td> */}

                    <td className="leads-tool-fix">
                      {student.course && (
                        <Tooltip title={student.course}>
                          {student.course.length > 20
                            ? `${student.course.slice(0, 20)}...`
                            : student.course}
                        </Tooltip>
                      )}
                    </td>
                    <td className="assigned leads-tool-fix ttc">
                       {student.rm_obj && student.rm_obj.label?student.rm_obj.label:"-"}
                    {/* {student.rmid ? agentOptions.find(agent => agent.value === student.rmid)?.label || "-" : "-"} */}
                      {/* <Tooltip
                        title={
                            student.rmid
                              ? agentOptions.find(
                                  (agent) => agent.value == student.rmid
                                )?.label || "Select Agent"
                              : "Select Agent"
                        }
                      >
                        <select
                          value={
                            student.rmid
                          }
                          onChange={(event) => {
                            handleAssignToDropdownChange(event, student.id,'rmid');
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {agentOptions.map(
                            (leadopt, index) =>
                              leadopt.label != "All" && (
                                <option key={index} value={leadopt.value}>
                                  {leadopt.label}
                                </option>
                              )
                          )}
                        </select>
                      </Tooltip> */}
                    </td>
                    <td className="assigned leads-tool-fix">
                      <Tooltip
                        title={
                         student.coordinatorid
                              ? coordinatorOptions.find(
                                  (cord) => cord.value == student.coordinatorid
                                )?.label || "Select Coordinator"
                              : "Select Coordinator"
                        }
                      >
                        <select
                          value={
                           student.coordinatorid
                          }
                          onChange={(event) => {
                            handleAssignToDropdownChange(event, student.id,'coordinatorid');
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {coordinatorOptions.map(
                            (leadopt, index) =>
                              leadopt.label != "All" && (
                                <option key={index} value={leadopt.value}>
                                  {leadopt.label}
                                </option>
                              )
                          )}
                        </select>
                      </Tooltip>
                    </td>
                    {/* <td>{student.preferred_batch}</td> */}
                    <td className="assigned leads-tool-fix">
                      {student.batch_obj?.label ? student.batch_obj?.label : Array.isArray(student.courseId>0 && student.allotted_batch && batchOptions[student.courseId])
                      ? batchOptions[student.courseId]?.find((batchopt) => batchopt.value === student.allotted_batch)?.label || "-":  student.course_status_student!='Course Completed' && <Tooltip
                      title={
                        student.allotted_batch
                            ? (Array.isArray(batchOptions[student.courseId]) ? batchOptions[student.courseId] : batchOptions[0])?.find(
                                (batchopt) => batchopt.value == student.allotted_batch
                              )?.label || "Select Batch"
                            : "Select Batch"
                      }
                    >
                      <select
                        value={
                          student.allotted_batch
                        }
                        onChange={(event) => {
                          handleAssignToDropdownChange(event, student.id+"|"+student.wo_id+"|"+student.courseId,'allotted_batch');
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {(Array.isArray(batchOptions[student.courseId]) ? batchOptions[student.courseId] : batchOptions[0])?.map(
                          (leadopt, index) =>
                            leadopt.label != "All" && (
                              <option key={index} value={leadopt.value}>
                                {leadopt.label}
                              </option>
                            )
                        )}
                      </select>
                    </Tooltip> || "-"}
                    
                    </td>
                    <td className="assigned leads-tool-fix">
                    {student.batchflying_obj?.label ? student.batchflying_obj?.label : Array.isArray(student.courseId>0 && student.fly_batch_id>0 && FlyingBatchOptions[student.courseId])
                      ? FlyingBatchOptions[student.courseId]?.find((batchopt) => batchopt.value ==student.fly_batch_id)?.label  || '-':
                      student.course_status_student!='Course Completed' && <Tooltip
                        title={
                          student.fly_batch_id
                            ? (
                                Array.isArray(FlyingBatchOptions[student.courseId]) 
                                ? FlyingBatchOptions[student.courseId] 
                                : []
                              )?.find(batchopt => batchopt.value === student.fly_batch_id)?.label 
                            || "Select Batch"
                            : "Select Batch"
                        }
                      >
                        <select
                          value={student.fly_batch_id || ""}
                          onChange={(event) => {
                            handleAssignToDropdownChange(event, `${student.id}|${student.wo_id}|${student.courseId}`, 'allottedflying_batch');
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          
                             {(Array.isArray(FlyingBatchOptions[student.courseId]) ? FlyingBatchOptions[student.courseId] : FlyingBatchOptions[0])?.map((leadopt, index) => (
                                leadopt.label !== "All" && (
                                  <option key={index} value={leadopt.value}>
                                    {leadopt.label}
                                  </option>
                                )
                              ))
                          }
                        </select>
                      </Tooltip> || "-"}
                    </td>

                    <td>{student.branch}</td>
                    <td>{student.batch_start_date}</td>
                    <td>{student.batch_end_date}</td>
                    <td>
                      <p className="v-center">
                      <Tooltip
                        title={
                          `${student.doc_status === "1" ? "Documentation Complete" : "Documentation Incomplete"}`
                        }
                      >
                      <HiOutlineDocumentCheck
                        className={` cp fs20 mr8 ${student.doc_status === "1" ? "fc2" : "fc5"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          signuinStudentAccount(student.id);
                        }}
                      />
                      </Tooltip>
                      {/* <CiCalendarDate
                        className="icon cp fs20 fc5 mr8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAttendanceShow(true);
                        }}
                      /> */}
                      <Tooltip
                        title={'Course History'}
                      >
                       <IoMdListBox
                        className="icon cp fs20 fc5 mr8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStudentHistory(true);
                          handleStudentHistory(student.id);
                        }}
                      />
                      </Tooltip>
                       {((user.role === '1' || user.dept_id === "3" || user.dept_id === "9") && student?.course_category_name==='drone' && student.fly_batch_id>0 && student.activeflyingbatch>0) &&<DynamicTooltip
                          text={'Add Flying Log'}
                          direction="left"
                        >
                          <IoIosAirplane
                          className="icon cp fs20 fc5 "
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddLogs(student);
                          }}
                        />
                        </DynamicTooltip>}
                      </p>
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
          <Popup onClose={closePopup} title={"Assigned"}>
            <div className="v-center jcsb ">
              <div className=" course-name flx100">
                <div className="assigned mb12">
                  <SingleDropdown
                    label="Assign Coordinator"
                    options={coordinatorOptions}
                    selectedOption={assignedCoordinator}
                    onSelect={setAssignedCoordinator}
                    placeholder="Select Coordinator"
                  />
                </div>
              </div>
              {/* <div className=" course-name flx48">
                <div className="assigned mb12">
                  <SingleDropdown
                    label="Assign Batch"
                    options={courseBaseBatchOption}
                    selectedOption={assignedBatch}
                    placeholder="Select Batch"
                    onSelect={setAssignedBatch}
                  />
                </div>
              </div> */}
            </div>

            {/* <div className="assigned">
              <SingleDropdown
                label="Assign RM"
                options={agentOptions}
                selectedOption={assigned}
                placeholder="Select RM"
                onSelect={setAssigned}
              />
            </div> */}
            <div className="button-container myteam-filters">
              <button
                type="button"
                className="clear btn-cancel"
                onClick={closePopup}
              >
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
            customClass={"top"}
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
         {studentHistory && (
          <SidePopup
            show={studentHistory}
            onClose={() => {
              setStudentHistory(false);
              document.body.style.overflow = "auto";
            }}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Student Course History</p>
              <button
                onClick={() => {
                  setStudentHistory(false);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="p8 w100">
                <StudentHistroy
                recordListHistory={recordListHistory}
                setAttendanceShow={setAttendanceShow}
                agentOptions={agentOptions}
                coordinatorOptions={coordinatorOptions}
                batchOptions={batchOptions}
                FlyingBatchOptions={FlyingBatchOptions}
                handleCellClick={handleCellClick}


                />
            </div>
          </SidePopup>
        )}
        {addLogPopup && (
        <Popup 
          onClose={handleAddLogPopupClose} 
          title={
            studnetUserDetail && (studnetUserDetail.name || studnetUserDetail.company_name)
              ? `${
                  studnetUserDetail.user_type === "company"
                    ? studnetUserDetail.company_name || studnetUserDetail.name
                    : studnetUserDetail.name
                }'s Flying Log - Add`
              : "Student Flying Log - Add"
          }
        >
          <AddLogForm
            onClose={handleAddLogPopupClose}
            userDetail={studnetUserDetail}
          />
        </Popup>
      )}
      </div>
    </>
  );
};

export default AllStudents;
