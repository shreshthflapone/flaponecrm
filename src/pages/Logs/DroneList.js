import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCommentMedical, FaEye, FaPencilAlt } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import Card from "../../components/Card";
import { giveTextColor } from "../../helpers/textColors";
import { FaCommentDots } from "react-icons/fa6";
import Popup from "../../components/Popup/Popup";
import SingleDropdown from "../../components/SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommentTimeline from "./CommentTimeline";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "../../components/Tooltip";

const DroneList = ({
  recordList,
  allApidata,
  handleSortByChange,
  activeSortColumn
}) => {
  const navigate = useNavigate();
  const [openCommentPopup, setOpenCommentPopup] = useState(false);
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [droneStatus, setDroneStatus] = useState({});
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [allDroneData, setAllDroneData] = useState([]);

  const handleLogView = (droneId) => {
    navigate(`/drone-inventory/${droneId}`);
  };
  const handleAddDrone = () => {
    navigate(`/drone-form`);
  };
  const handleOpenCommentPopup = () => {
    setOpenCommentPopup(true);
  };
  const handleOpenViewCommentPopup = () => {
    setOpenViewCommentPopup(true);
  };
  const closeCommentPopup = () => {
    setOpenCommentPopup(false);
  };
  const closeViewCommentPopup = () => {
    setOpenViewCommentPopup(false);
  };
  const droneStatusOptions = [
    { value: "Available / In Use", label: "Available / In Use" },
    { value: "Under Maintenance", label: "Under Maintenance" },
    { value: "Damaged", label: "Damaged" },
    { value: "Lost", label: "Lost" },
    { value: "Out of Service", label: "Out of Service" },
  ];
  const customDateFormat = "dd/MM/yyyy";
  const handleDateChange = (date) => {
    setDate(date);
  };
  const handleCommentsChange = (e) => {
    setComment(e.target.value);
  };
  const handleViewStudentLog = () => {
    navigate(`/student-logs/all`);
  }
  const handleUpdateComment = () => {
    if (!droneStatus?.value) {
      toast.warning("Please select a comment status");
      return;
    }
  
    if (!date) {
      toast.warning("Please select a comment date");
      return;
    }
  
    if (!comment.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }
  
    const data = {
      droneStatus,
      date,
      comment,
    };
  
    toast.success("Comment submitted successfully");
    closeCommentPopup();
  };

  useEffect(() => {
    setAllDroneData([...recordList]);
  }, [recordList]);
  const openDetailPage = (id) =>{
    navigate("/drone-form/"+id);
  }
  return (
    <Card className="bg5 mt16 pb16">
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12">
        Total Result: {allApidata.total_count || 0}
        <div className="v-center">
          <button
            className="btn-blue bg1 br24 mr12 fs14 cp pl16 pr16 pt10 pb10 ls1"
            onClick={handleAddDrone}
          >
            Add Drone
          </button>
           <button
            className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10"
            onClick={handleViewStudentLog}
          >
            Student Logs
          </button> 
        </div>
      </div>

      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table log-table cp wsnw">
          <thead className="w100">
            <tr>
              <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}><p className="box-center">Id <RiArrowUpDownFill className="cp ml4"/></p></th>
              <th onClick={() => handleSortByChange("drone_id")} className={activeSortColumn === "drone_id" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="right" text="Drone ID (UIN)"> Drone ID <br /> (UIN)</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("course")} className={activeSortColumn === "course" ? "fc1 min-w100" : "min-w100"}><p className="box-center">Course<RiArrowUpDownFill className="cp ml4" /></p></th>
              <th onClick={() => handleSortByChange("batteries")} className={activeSortColumn === "batteries" ? "fc1" : ""}><p className="box-center">Batteries<RiArrowUpDownFill className="cp ml4" /></p></th>
              <th onClick={() => handleSortByChange("uasModelName")} className={activeSortColumn === "uasModelName" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="UAS Model Names"> Model <br /> Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th onClick={() => handleSortByChange("modelType")} className={activeSortColumn === "modelType" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Model Type">Model <br /> Type</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("uasClass")} className={activeSortColumn === "uasClass" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="UAS Class">UAS <br /> Class</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th onClick={() => handleSortByChange("category")} className={activeSortColumn === "category" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="UAS Category">UAS <br />Category</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("registrationDate")} className={activeSortColumn === "registrationDate" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Registration Date">Reg. <br /> Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("insurance_start_date")} className={activeSortColumn === "insurance_start_date" ? "fc1 amc-col" : "amc-col"}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Insurance Date">Insurance <br /> Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("amc_start_date")} className={activeSortColumn === "amc_start_date" ? "fc1 amc-col" : "amc-col"}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="AMC Date">AMC Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("branch")} className={activeSortColumn === "branch" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Place of operation">Location</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("status")} className={activeSortColumn === "status" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Status">Status</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("remarks")} className={activeSortColumn === "remarks" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Remarks">Remarks</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th className="action-col">Action</th>
              {/* <th>Comments</th> */}
            </tr>
          </thead>
          <tbody className="subject-list">
            {allDroneData.length === 0 ? (
              <tr>
                <td colSpan="15" className="no-students">
                  No Data Available
                </td>
              </tr>
            ) : (
              allDroneData.map((drone, index) => (
                <tr key={drone.id}>
                  <td>{drone.id}</td>
                  <td>{drone.drone_id}</td>
                  <td className="leads-tool-fix">
                    {drone.course && (
                      <Tooltip title={drone.course}>
                        {drone.course.length > 20
                          ? `${drone.course.slice(0, 20)}...`
                          : drone.course}
                      </Tooltip>
                    )}
                  </td>
                  <td className="leads-tool-fix">
                    {drone.batteries && drone.batteries !== "--" ? (
                      <Tooltip title={drone.batteries}>
                        {drone.batteries.length > 10
                          ? `${drone.batteries.slice(0, 10)}...`
                          : drone.batteries}
                      </Tooltip>
                    ) : ("--")}
                  </td>
                  <td>{drone.uasModelName}</td>
                  {/* <td>{drone.modelType}</td>
                  <td>{drone.uasClass}</td>
                  <td>{drone.category}</td> */}
                  <td><DynamicTooltip direction="left" text={drone.uasClass_tooltip}>{drone.uasClass}</DynamicTooltip></td>
                  <td>{drone.createDate}</td>
                  <td>{drone.insuranceDate}</td>
                  <td>{drone.amcDate}</td>
                  <td>{drone.branch}</td>
                  <td
                    style={{
                      color: giveTextColor(
                        drone.status === "Available"
                          ? "Completed"
                          : drone.status === "Under Maintenance"
                            ? "Pending"
                            : "Rejected"
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {drone.status}
                  </td>
                  <td className="feedback-inquiry scrollable-cell"><p>{drone.remarks}</p></td>
                  <td className="action-col">
                    {drone.checkLog > 0 && (
                      <DynamicTooltip direction="left" text="View Drone Use Logs">
                        <FaEye
                          className="fs18 fc16"
                          onClick={() => handleLogView(drone.drone_id)}
                          style={{ verticalAlign: "middle", cursor: "pointer" }}
                        />
                      </DynamicTooltip>
                    )}
                    <DynamicTooltip direction="left" text="Edit">
                      <FaPencilAlt
                        title="Edit"
                        className="icon edit-icon ml12 cp fs18 fc5"
                        style={{ verticalAlign: "middle", cursor: "pointer" }}
                        onClick={() => openDetailPage(drone.id)}
                      />
                    </DynamicTooltip>
                  </td>
                  {/* <td>
                    <DynamicTooltip direction="left" text="Add Comments">
                      <FaCommentMedical
                        className="fs18 mr12 fc16"
                        onClick={handleOpenCommentPopup}
                      />
                    </DynamicTooltip>
                    <DynamicTooltip direction="left" text="View Comments">
                      <FaCommentDots
                        className="fs18 fc16"
                        onClick={handleOpenViewCommentPopup}
                      />
                    </DynamicTooltip>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {openCommentPopup && (
          <Popup onClose={closeCommentPopup} title={"Add Comments"}>
            <div className="df up-st-form jcsb fww">
              <div className={"up-status"}>
                <SingleDropdown
                  label="Status"
                  options={droneStatusOptions}
                  selectedOption={droneStatus}
                  onSelect={setDroneStatus}
                  compulsory={<span className="fc4">*</span>}
                />
              </div>
              <div className={`calendar calendar-input`}>
                <label className="fc15 fw6 fs14 mb12 ls1">Date<span className="fc4">*</span></label>
                <DatePicker
                  minDate={new Date()}
                  dateFormat={customDateFormat}
                  selected={date}
                  onChange={handleDateChange}
                  placeholderText="-- Select Date --"
                  showIcon
                  isClearable={true}
                />
              </div>
              <div className="comments-input mt24 w100">
                <label className="fc15 fw6 fs14 mb12 ls1">Comments<span className="fc4">*</span></label>
                <textarea
                  className="comments p12 br4"
                  value={comment}
                  onChange={handleCommentsChange}
                  placeholder="Any Comments..."
                />
              </div>
              <div className="button-container mt32 myteam-filters w100">
                <button
                  type="button"
                  className="btn-cancel clear"
                  onClick={closeCommentPopup}
                >
                  Cancel
                </button>

                <button type="button" className={`update-button btn-blue`} onClick={handleUpdateComment}>
                  Update
                </button>
              </div>
            </div>
          </Popup>
        )}
        {openViewCommentPopup && (
          <Popup
            onClose={closeViewCommentPopup}
            title={"Comments"}
            close={true}
          >
            <div className="df up-st-form jcsb fww">
              <CommentTimeline />
              <div className="button-container mt32 myteam-filters w100">
                <button
                  type="button"
                  className="btn-cancel clear"
                  onClick={closeViewCommentPopup}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Popup>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </Card>
  );
};

export default DroneList;
