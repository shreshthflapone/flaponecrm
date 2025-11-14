import React, { useState,useEffect } from "react";
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
import ImageDropdown from "../../components/ImageDropdown";
import { CiCalendarDate } from "react-icons/ci";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import CalendarComponent from "../../components/CalendarComponent";
import { useTitle } from "../../hooks/useTitle.js";


const HolidayListing = ({recordList, setRecordList, displayMsg, allApiFilter, pageCount,handleSortByChange, activeSortColumn}) => {

  const [holidayList, setHolidayList] = useState([]);
  const [examCount, setexamCount] = useState(pageCount);
  const [periodPopup, setPeriodPopup] = useState(false);
  const [singleBatch, setSingleBatch] = useState({});
  const [singleBatchTimeTable, setSingleBatchTimeTable] = useState({});
  const [maxPeriods, setMaxPeriods] = useState("");
  const [studentDetailsPopup, setStudentDetailsPopup] = useState(false);
  const [selectedClassRoom, setSelectedClassRoom] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState({});
  const [attendanceShow, setAttendanceShow] = useState(false);
  const [holidayDataStatus, setHolidayDataStatus] = useState(false);
  const currentDate = moment();
  const [examStudentList, setExamStudentList] = useState([]);

  const navigate = useNavigate();
  useTitle("Holiday List - Flapone Aviation");


  const openHolidayDetail = () => {
    navigate("/holiday-detail");
  };

  const openUpdateForm = (id) => {
    navigate("/holiday-detail/"+id);
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
 
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  useEffect(() => {
    setHolidayList(recordList);
    setexamCount(pageCount);
    setHolidayDataStatus(true);
  }, [recordList]);

  return (
    <>
    {holidayDataStatus && (
      <>
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {examCount}
        <button
          className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
          onClick={openHolidayDetail}
        >
          Add Holiday
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
                <th onClick={() => handleSortByChange("holidaydate_long")} className={activeSortColumn === "holidaydate_long" ? "fc1" : ""}>
                  <p className="box-center wsnw">
                    Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("holiday_name")} className={activeSortColumn === "holiday_name" ? "fc1" : ""}>
                  <p className="box-center">
                    Holiday Name
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th onClick={() => handleSortByChange("center_name")} className={activeSortColumn === "center_name" ? "fc1" : ""}>
                  <p className="box-center">
                    Center
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("department_name")} className={activeSortColumn === "department_name" ? "fc1" : ""}>
                  <p className="box-center">
                    Departments
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("holiday_type")} className={activeSortColumn === "holiday_type" ? "fc1" : ""}>
                  <p className="box-center">
                    Type
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th onClick={() => handleSortByChange("description")} className={activeSortColumn === "description" ? "fc1" : ""}>
                  <p className="box-center">
                    Comment
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                
                <th onClick={() => handleSortByChange("holiday_status")} className={activeSortColumn === "holiday_status" ? "fc1" : ""}>
                  <p className="box-center">
                    Status
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">Action</p>
                </th>
              </tr>
          </thead>
          <tbody>
            {holidayList.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-students">
                  No Holidays Data Available
                </td>
              </tr>
            ) : (
              holidayList.map((holiday, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <span
                        style={{
                          color: giveTextColor(
                            holiday.holiday_date_color
                          ),
                        }}
                      >
                        {holiday.holiday_date}
                      </span>
                    </td>
                    <td style={{textTransform: "capitalize",}}>{holiday.holiday_name}</td>
                    <td style={{textTransform: "capitalize",}}>{holiday.center_name}</td>
                    <td>{holiday.department_name}</td>
                    <td>{holiday.holiday_type}</td>
                    <td>{holiday.description}</td>
			              <td>
                      {holiday.holiday_status !== "" ? (
                        <span
                          style={{
                            color: giveTextColor(
                              holiday.holiday_status === "Success"
                                ? "Approve"
                                : holiday.holiday_status === "Draft"
                                  ? "Draft"
                                  : holiday.holiday_status === "Reject"
                                    ? "red"
                                    : ""
                            ),
                            textTransform: "capitalize",
                          }}
                        >
                          {holiday.holiday_status}
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                        <FaPencilAlt onClick={()=>openUpdateForm(holiday.holiday_id)} className="icon mail-icon cp fs18 fc5 mr8" />
                        {/* <FaEye
                          className="icon mail-icon cp fs18 fc5 "
                        /> */}
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

    </>
  );
};

export default HolidayListing;
