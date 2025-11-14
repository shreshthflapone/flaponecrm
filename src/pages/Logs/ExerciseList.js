import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import Card from "../../components/Card";
import { giveTextColor } from "../../helpers/textColors";
import SingleDropdown from "../../components/SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAddChart } from "react-icons/md";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import ChargingLogForm from "../../components/Forms/ChargingLogForm.js";
import { useSelector } from "react-redux";
import constant from "../../constant/constant.js";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import Tooltip from "../../components/Tooltip";

const ExerciseList = ({
  recordList,
  allApidata,
  handleSortByChange,
  activeSortColumn
}) => {
  const user = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();

  const [exerciseList, setExerciseList] = useState([]);
  const handleLogView = (type, droneId) => {
    navigate(`/excerise-logs/${type}/${droneId}`);
  };
  const updateExercisePosition = (index,value,id) => {
     const updatedSections =  recordList.map((section) => {
      if (section.id === id) {
        return { ...section, ['position']: value };
      }
      return section;
    });
    setExerciseList(updatedSections);
    updateExercisePostion(id,value);
  }
  const updateExercisePostion = async (id,value) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=positionUpdateExercise`,
      headers: { "Auth-Id": user.auth_id },
      data: {"exercise_id": id,"value":value}
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === 1) {
      }
    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }
  const checkUserLogin = (response) =>{
    if(response.data.login.status===0){
      dispatch(logout());
      navigate("/login");
    }
  }
  const handleAddExercise = () => {
    navigate(`/exercise-form`);
  };
  const openDetailPage = (id) =>{
    navigate("/exercise-form/"+id);
  }
  useEffect(() => {
    setExerciseList([...recordList]);
  }, [recordList]);
  return (
    <Card className="bg5 mt16 pb16">
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12">
        Total Result: {allApidata.total_count || 0}
        <button
          className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10"
          onClick={handleAddExercise}
        >
          Add Exercise
        </button>
      </div>

      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}><p className="box-center">S.No. <RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("exercise")} className={activeSortColumn === "exercise" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="right" text="Exercise Name">Exercise <br/>Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("duration")} className={activeSortColumn === "duration" ? "fc1" : ""}>
                <p className="box-center">Duration<RiArrowUpDownFill className="cp ml4"/></p>
              </th>
              <th onClick={() => handleSortByChange("student")} className={activeSortColumn === "student" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Exercise Type For Student">
                  Ex. Type <br/>Student</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4"/>
                </p> 
              </th>
              <th onClick={() => handleSortByChange("instructor")} className={activeSortColumn === "instructor" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Exercise Type For Instructor">
                  Ex. Type <br/>Instructor</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4"/>
                </p>
              </th>
              <th onClick={() => handleSortByChange("courses")} className={activeSortColumn === "courses" ? "fc1" : ""}><p className="box-center">Course<RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("time")} className={activeSortColumn === "time" ? "fc1" : ""}><p className="box-center">Period<RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("updatedDate")} className={activeSortColumn === "updatedDate" ? "fc1" : ""}><p className="box-center">Updated Date <RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("status")} className={activeSortColumn === "status" ? "fc1" : ""}><p className="box-center">Status<RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("remarks")} className={activeSortColumn === "remarks" ? "fc1" : ""}><p className="box-center">Remarks<RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("position")} className={activeSortColumn === "position" ? "fc1" : ""}><p className="box-center">Position<RiArrowUpDownFill className="cp ml4"/></p></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="subject-list">
            {exerciseList.length === 0 ? (
              <tr>
                <td colSpan="11" className="no-students">
                  No Data Available
                </td>
              </tr>
            ) : (
              exerciseList.map((exercise, index) => (
                <tr key={exercise.id}>
                  <td>{exercise.id}</td>
                  <td>{exercise.exercise}</td>
                  <td>{exercise.duration}</td>
                  <td>{exercise.student}</td>
                  <td>{exercise.instructor}</td>
                  <td className="leads-tool-fix">
                    {exercise.courses && (
                      <Tooltip title={exercise.courses}>
                        {exercise.courses.length > 20
                          ? `${exercise.courses.slice(0, 20)}...`
                          : exercise.courses}
                      </Tooltip>
                    )}
                  </td>
                  <td>{exercise.time}</td>
                  <td>{exercise.updated_date} </td>
                  <td
                    style={{
                      color: giveTextColor(
                        exercise.status === "Active"
                          ? "Completed"
                          : exercise.status === "Inactive"
                            ? "Rejected"
                            :  exercise.status === "Draft"
                            ? "Pending"
                            :  exercise.status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {exercise.status}
                  </td>
                  <td className="feedback-inquiry scrollable-cell"><p>{exercise.remarks}</p></td>
                  <td>
		                {user.role === '1'?
                      <input
                        type="number"
                        id="position"
                        name="position"
                        min={1}
                        max={99}
                        placeholder="Position"
                        value={exercise.position}
                        style={{ 
                          backgroundColor: exercise.status!=="Active" ? '#f9f9f9' : '',
                          cursor: exercise.status!=="Active" ? 'not-allowed' : '' 
                        }}
                        onInput={(e) => {
                          if (e.target.value.length > 2) {
                            e.target.value = e.target.value.slice(0, 2); 
                          }
                        }}

                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 2) {
                            updateExercisePosition(index,value,exercise.id); 
                          }
                        }}
                        onFocus={(e) => {
                          if (exercise.status === "Active") {
                            e.target.select(); 
                          }
                        }}
                        autoComplete="off"
                        readOnly={exercise.status!=="Active"}
                        className="input-field-number-pos"
                      />:exercise.position
		                }	   
                  </td>
                  <td onClick={()=>openDetailPage(exercise.id)}>
                    <DynamicTooltip direction="left" text="Edit">
                      <FaPencilAlt
                        title="Edit"
                        className="icon edit-icon cp fs18 fc5"
                        style={{ verticalAlign: "middle", cursor: "pointer" }}
                      />
                    </DynamicTooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ExerciseList;
