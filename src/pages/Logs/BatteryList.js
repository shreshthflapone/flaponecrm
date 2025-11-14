import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCommentMedical, FaEye, FaPencilAlt } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import Card from "../../components/Card";
import { giveTextColor } from "../../helpers/textColors";
import SingleDropdown from "../../components/SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAddChart, MdBatteryChargin60 } from "react-icons/md";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import ChargingLogForm from "../../components/Forms/ChargingLogForm.js";
import { FaCommentDots } from "react-icons/fa6";
import CommentTimeline from "./CommentTimeline";
import Popup from "../../components/Popup/Popup";
import { TbBatteryCharging2 } from "react-icons/tb";
import { MdBatteryCharging80 } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "../../components/Tooltip";


const BatteryList = ({
  recordList,
  allApidata,
  handleSortByChange,
  activeSortColumn
}) => {
  const [batteryList, setBatteryList] = useState([]);
  const navigate = useNavigate();
  const [batteryStatus, setBatteryStatus] = useState({});
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [openChargingPopup, setOpenChargingPopup] = useState(false);
  const [selecteddroneUid, setSelecteddroneUid] = useState([]);
  const [openCommentPopup, setOpenCommentPopup] = useState(false);
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [droneStatus, setDroneStatus] = useState({});
  const [openBattery, setOpenBattery] = useState({});

  const droneStatusOptions = [
    { value: "In Use", label: "In Use" },
    { value: "Under Maintenance", label: "Under Maintenance" },
    { value: "Damaged", label: "Damaged" },
    { value: "Lost", label: "Lost" },
    { value: "Out of Service", label: "Out of Service" },
  ];
  const handleLogView = (type, droneId) => {
    navigate(`/battery-inventory/${type}/${droneId}`);
  };
  const handleAddBattery = () => {
    navigate(`/battery-form`);
  };
  const handleOpenChargingPopup = (type,battery) => {
    setOpenBattery(battery);
    setOpenChargingPopup(true);
  };
  const closeChargingPopup = () => {
    setOpenChargingPopup(false);
  };

  const handleOpenCommentPopup = () => {
    setOpenCommentPopup(true);
  };
  const handleOpenViewCommentPopup = () => {
    setOpenViewCommentPopup(true);
  };
  const closeCommentPopup = () => {
    setDroneStatus([]);
    setDate("");
    setComment("");
    setOpenCommentPopup(false);
  };
  const closeViewCommentPopup = () => {
    setDroneStatus([]);
    setDate("");
    setComment("");
    setOpenViewCommentPopup(false);
  };
  const customDateFormat = "dd/MM/yyyy";
  const handleDateChange = (date) => {
    setDate(date);
  };
  const handleCommentsChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitCommentPopup = () => {
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
    setBatteryList([...recordList]);
  }, [recordList]);
  const openDetailPage = (id) =>{
    navigate("/battery-form/"+id);
  }
  return (
    <Card className="bg5 mt16 pb16">
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12">
        Total Result: {allApidata.total_count || 0}
        <button
          className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10"
          onClick={handleAddBattery}
        >
          Add Battery
        </button>
      </div>

      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th onClick={() => handleSortByChange("id")} className={activeSortColumn === "id" ? "fc1" : ""}><p className="box-center">Id <RiArrowUpDownFill /></p></th>
              <th onClick={() => handleSortByChange("branch")} className={activeSortColumn === "branch" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Place of operation">Location</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" /> 
                </p>
              </th>
              <th onClick={() => handleSortByChange("battery")} className={activeSortColumn === "battery" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="right" text="Battery Number">Battery <br/>Number</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("uin")} className={activeSortColumn === "uin" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Drone ID (UIN)">Drone <br/>ID (UIN)</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("purchase_date")} className={activeSortColumn === "purchase_date" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Battery Purchase Date">Purchase <br/> Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("insurance_start_date")} className={activeSortColumn === "insurance_start_date" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Insurance Date">Insurance Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("amc_start_date")} className={activeSortColumn === "amc_start_date" ? "fc1 amc-col" : "amc-col"}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="AMC Date">AMC Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("remarks")} className={activeSortColumn === "remarks" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Remarks">Remarks</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("status")} className={activeSortColumn === "status" ? "fc1" : ""}>
                <p className="box-center">
                  <DynamicTooltip direction="left" text="Status">Status</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th width="80px">Logs</th>
              {/*<th>Comment</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="subject-list">
            {batteryList.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-students">
                  No Data Available
                </td>
              </tr>
            ) : (
              batteryList.map((battery, index) => (
                <tr key={battery.id}>
                  <td>{battery.id}</td>
                  <td>{battery.branch}</td>
                  <td>{battery.battery}</td>
                  <td className="leads-tool-fix">
                    {battery.uin && battery.uin !== "--" ? (
                      <Tooltip title={battery.uin}>
                        {battery.uin.length > 10
                          ? `${battery.uin.slice(0, 10)}...`
                          : battery.uin}
                      </Tooltip>
                    ) : ("--")}
                  </td>
                  <td>{battery.createDate}</td>
                  <td>{battery.insuranceDate}</td>
                  <td>{battery.amcDate}</td>
                  <td className="feedback-inquiry scrollable-cell"><p>{battery.remarks}</p></td>
                  <td
                    style={{
                      color: giveTextColor(
                        battery.status === "Available"
                          ? "Completed"
                          : battery.status === "Under Maintenance"
                           ? "Pending"
                            : battery.status !== ''
                            ? "Rejected"
                            : battery.status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {battery.status}
                  </td>
                  <td>
                    <DynamicTooltip direction="top" text="Add Battery Charging Log">
                      <TbBatteryCharging2
                        className="fs18 mr12 fc16"  
                        onClick={()=>handleOpenChargingPopup("charging",battery)}
                      />
                    </DynamicTooltip>
                    {battery.checkBatteryChargingLog > 0 && (
                      <DynamicTooltip direction="top" text="View Battery Charging Log">
                        <MdBatteryCharging80 
                          className="fs18 mr12 fc16"
                          onClick={() => handleLogView('charging', battery.id)}
                        />
                      </DynamicTooltip>
                    )}
                    {battery.checkLog > 0 && (
                      <DynamicTooltip direction="top" text="View Battery Use Log">
                        <MdOutlineAddChart
                          className="fs18 fc16"
                          onClick={() => handleLogView('user', battery.id)}
                        />
                      </DynamicTooltip>
                    )}
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
                  <td>
                    <DynamicTooltip direction="left" text="Edit">
                      <FaPencilAlt
                        title="Edit"
                        className="icon edit-icon cp fs18 fc5"
                        style={{ verticalAlign: "middle", cursor: "pointer" }}
                        onClick={() => openDetailPage(battery.id)}
                      />
                    </DynamicTooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {openChargingPopup && (
          <ChargingLogForm 
            openChargingPopup={openChargingPopup}
            closeChargingPopup={closeChargingPopup}
            openBattery={openBattery} 
            >
          </ChargingLogForm>
        )}
        
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

                <button type="button" className={`update-button btn-blue`} onClick={handleSubmitCommentPopup}>
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

export default BatteryList;
