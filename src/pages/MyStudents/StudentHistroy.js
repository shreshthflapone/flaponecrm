import React from 'react'
import { giveTextColor } from '../../helpers/textColors';
import Tooltip from "../../components/Tooltip";
import { CiCalendarDate } from "react-icons/ci";

const StudentHistroy = ({recordListHistory,setAttendanceShow,agentOptions,coordinatorOptions,batchOptions,FlyingBatchOptions,handleCellClick}) => {
  return (
    <table className="w100">
    <thead className="w100">
      <tr>
        <th >
          <p className="box-center">
            ID
           
          </p>
        </th>
        <th>
          <p className="box-center">
            Status
            
          </p>
        </th>
        <th>
          <p className="box-center">
            Pymt
            
          </p>
        </th>
        <th>
          <p className="box-center">
            Name
           
          </p>
        </th>
        {/* <th>
          <p className="box-center">
            Roll No.
           
          </p>
        </th> */}
        <th>
          <p className="box-center">
            Course
           
          </p>
        </th>
        <th>
          <p className="box-center">
            RM
           
          </p>
        </th>
        <th>
          <p className="box-center">
            Coordinator
           
          </p>
        </th>
        {/* <th>
          <p className="box-center">
            P.Batch
           
          </p>
        </th> */}
        <th>
          <p className="box-center">
            Prefered Batch   
          </p>
        </th>
        <th>
          <p className="box-center">
            Theory
          </p>
        </th>
        <th>
          <p className="box-center">
            Flying
          </p>
        </th>
        <th>
          <p className="box-center">
            Branch
           
          </p>
        </th>
        <th>
          <p className="box-center">
            Start Date
           
          </p>
        </th>
        <th>
          <p className="box-center">
            End Date
           
          </p>
        </th>
        {/* <th>
          <p className="box-center">
            Action
           
          </p>
        </th> */}
      </tr>
    </thead>
    <tbody>
      {recordListHistory.length === 0 ? (
        <tr>
          <td colSpan="20" className="no-students">
            No Students History Available
          </td>
        </tr>
      ) : (
        recordListHistory.map((student, index) => {
          return (
            <tr>
              
              <td>{student.id}</td>

              <td
                style={{
                  color: giveTextColor(
                    student.course_status_student === "New"
                    ? "blue"
                    : student.course_status_student === "Batch Running"
                      ? "Running"
                      : student.course_status_student === "Dropped"
                        ? "red"
                        : student.course_status_student === "Batch Allotted"
                          ? "Running"
                          :student.course_status_student === "Batch Completed"
                          ? "gray"
                          :student.course_status_student === "Course Completed"
                          ? "darkgreen"
                          : student.course_status_student
                  ),
                  textTransform: "capitalize",
                }}
              >
                {student.course_status_student}
              </td>
              <td
                style={{
                  color: giveTextColor(
                    student.workorder_payment_status_text.includes("Pending")
                      ? "Pending"
                      : student.workorder_payment_status_text === "Completed"
                        ? "Completed"
                        : student.workorder_payment_status_text
                          ? "Rejected"
                          : student.workorder_payment_status_text
                  ),
                  textTransform: "capitalize",
                }}
                className="cp"
                onClick={(e) => {e.preventDefault();
                  e.stopPropagation(); handleCellClick(student,'wid')}}
              >
                {student.workorder_payment_status_text}
              </td>
              <td className="leads-tool-fix">
                <span
                  style={{
                    color: giveTextColor(
                      student.user_type === "Student"
                        ? "Approve"
                        : student.user_type === "Company"
                          ? "Draft"
                          : ""
                    ),
                  }}
                >
                  {student.name && (
                    <Tooltip title={student.name}>
                      {student.name.length > 10
                        ? `${student.name.slice(0, 10)}...`
                        : student.name}
                    </Tooltip>
                  )}
                </span>
              </td>

              {/* <td className="roll-input">
                {student.roll_no ? (
                  student.roll_no
                ) : (
                  "Not Available"
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
              <td className="assigned leads-tool-fix">
                      {student.rmid
                        ? agentOptions.find(
                            (agent) => agent.value == student.rmid
                          )?.label || "-"
                        : "-"}
              </td>
              <td className="assigned leads-tool-fix">
              {
                   student.coordinatorid
                        ? coordinatorOptions.find(
                            (cord) => cord.value == student.coordinatorid
                          )?.label || "-"
                        : "-"
                  }
              </td>
              <td>{student.prefered_batch}</td>
              <td className="assigned leads-tool-fix">
              {student.batch_obj?.label ? student.batch_obj?.label : Array.isArray(student.courseId>0 && student.allotted_batch>0 && batchOptions[student.courseId])
                      ? batchOptions[student.courseId]?.find((batchopt) => batchopt.value === student.allotted_batch)?.label || "-":"-"}
              </td>
              <td className="assigned leads-tool-fix">
              {student.batchflying_obj?.label ? student.batchflying_obj?.label : Array.isArray(student.courseId>0 && student.fly_batch_id>0 && FlyingBatchOptions[student.courseId])
                      ? FlyingBatchOptions[student.courseId]?.find((batchopt) => batchopt.value ==student.fly_batch_id)?.label || '-':"-"}
                    </td>
              <td>{student.branch}</td>
              <td>{student.batch_start_date}</td>
              <td>{student.batch_end_date}</td>
              {/* <td>
                <CiCalendarDate
                  className="icon cp fs20 fc5 "
                  onClick={(e) => {
                    e.stopPropagation();
                    setAttendanceShow(true);
                  }}
                />
              </td> */}
            </tr>
          );
        })
      )}
    </tbody>
  </table>
  )
}

export default StudentHistroy
