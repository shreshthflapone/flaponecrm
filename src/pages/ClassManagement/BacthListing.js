import React, { useEffect, useState } from "react";
import "../MyStudents/MyStudents.css";
import { useNavigate } from "react-router-dom";
import { RiArrowUpDownFill } from "react-icons/ri";
import { giveTextColor } from "../../helpers/textColors";
import { FaPencilAlt, FaCalendar, FaLink , FaSortAlphaDown,
  FaSortAlphaUp,} from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup";
import { TfiBlackboard } from "react-icons/tfi";
import { PiStudent } from "react-icons/pi";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip";
import daysOfWeek from "../../data/DaysWeek";
import { MdCall, MdOutlineMail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import ImageDropdown from "../../components/ImageDropdown.js";
import { CiCalendarDate } from "react-icons/ci";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import CalendarComponent from "../../components/CalendarComponent.js";

import axios from "axios";
import constant from "../../constant/constant.js";
import { useSelector } from "react-redux";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import { useTitle } from "../../hooks/useTitle.js";

const BatchListing = (
  {recordList,
  setRecordList,
  displayMsg,
  allApiFilter,
  allApidata,
  pageCount,
  handleSortByChange,
  activeSortColumn,
  checkUserLogin,
  handleNavLinkFilterClick,
  listFilter}
) => {

 
  const user = useSelector((state) => state.auth);
  useTitle("Batch List - Flapone Aviation");
  
  const [sortOrder, setSortOrder] = useState("asc");

  const [batchList, setBatchList] = useState([]);
  const [periodPopup, setPeriodPopup] = useState(false);
  const [singleBatch, setSingleBatch] = useState({});
  const [singleBatchTimeTable, setSingleBatchTimeTable] = useState({});
  const [maxPeriods, setMaxPeriods] = useState("");
  const [studentDetailsPopup, setStudentDetailsPopup] = useState(false);
  const [selectedClassRoom, setSelectedClassRoom] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState({});
  const [attendanceShow, setAttendanceShow] = useState(false);

  const [tabFilterStatus, setTabFilterStatus] = useState(false);

  useEffect(() => {
    setTabFilterStatus(
      listFilter?.batchStatus?.value === undefined ? false : true
    );

  }, [listFilter,setTabFilterStatus,tabFilterStatus]);
  

  const currentDate = moment();

  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  useEffect(()=>{
    setBatchList([...recordList]);
  },[recordList])

  useEffect(() => {
    getDropdownList();
  }, []);



  const [roomsOptions,setRoomsOptions] = useState([]);
  const [facultiesOptions,setFacultiesOptions] = useState([]);

  const openBatchDetail = () => {
    navigate("/batch-detail");
  };
  const openUpdateBatch = (batch_id) => {
    navigate("/batch-detail/"+batch_id);
  };
  const closePeriodPopup = () => {
    setPeriodPopup(false);
    document.body.style.overflow = "auto";
  };

  const handleClassRoomChange = (selected, dayIndex, periodIndex,period) => {
    
    const updatedTimeTable = [...singleBatchTimeTable.timeTable];
    updatedTimeTable[dayIndex].periods[periodIndex].room = selected;
    setSingleBatchTimeTable({
      ...singleBatchTimeTable,
      timeTable: updatedTimeTable,
    });

    upadteDaywiseClass(period,selected,"room_id","classroom");
  };

  const handleFacultyChange = (selected, dayIndex, periodIndex, period) => {
    const updatedTimeTable = [...singleBatchTimeTable.timeTable];
    updatedTimeTable[dayIndex].periods[periodIndex].faculty = selected;
    setSingleBatchTimeTable({
      ...singleBatchTimeTable,
      timeTable: updatedTimeTable,
    });
   
    upadteDaywiseClass(period,selected,"instructor_id","instructor");
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
    if (timeTableData && endIndex < timeTableData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };


  


  const getDropdownList = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch_list.php?fun=getDropdownList`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setFacultiesOptions(response.data.data.instructor);
          //setRoomsOptions(response.data.data.classroom);
         
        setRoomsOptions(JSON.parse(allApiFilter['class_room']));
          
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  


  const upadteDaywiseClass = async (classData,value,field,type) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/batch_list.php?fun=daywiseClassUpdate`,
      headers: { "Auth-Id": user.auth_id },
      data: {
         type:type,
         field:field,
         value:value,
         classData:classData,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
          if (response.data.data.status === "1") {
            toast.success(response.data.data.msg);
          }else{
            toast.error(response.data.data.msg);
          }
        
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };





const signuinStudentAccount = (user_id) => {
  if (user_id) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=genrateLoginEncriptKey`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        cid: user_id,
        type: "admin",
        redirectUrl:"my-account?tab=documents"
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data) {
          let urlred =
            "https://student.flapone.com/" + "login/" + response.data.data;
          window.open(urlred);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  }
};
const sortedStudents = singleBatch.studentList && singleBatch.studentList.sort((a, b) => {
  return sortOrder === "asc"
    ? a.studentName.localeCompare(b.studentName)
    : b.studentName.localeCompare(a.studentName);
});



const handleWorkOrderClick = (work_order_id) => {
  //window.open(`/my-finance/${work_order_id}?tab=workorder`, "_blank");
  window.open(`/my-finance/${work_order_id}?tab=workorder`);
};

  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
       Total Results:  {allApidata.total_count || 0}
        <button
          className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
          onClick={openBatchDetail}
        >
          Add New Batch
        </button>
      </div>

       {allApidata && (


         <div className="card-content df pt24 brd-b1 pb24 pl24 jcc">
         {allApidata && allApidata.batchcountbysts && (allApidata.batchcountbysts.total_batch !=="0" && allApidata.batchcountbysts.total_batch !== 0) && tabFilterStatus === false ?(
          <div className="card-item df fdc jcc br4 cp" 
          onClick={handleNavLinkFilterClick({label: "All", value: ""})}
          >
            <span className="fs36 fc1 mb8">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.total_batch||0}</span>
            <p className="fw6  fs16 fc5 ">Total Batch</p>
          </div>
         ):(
          <div className="card-item df fdc jcc br4 ">
            <span className="fs36 fc1 mb8">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.total_batch||0}</span>
            <p className="fw6  fs16 fc5 ">Total Batch</p>
          </div>
         )}

          {allApidata && allApidata.batchcountbysts && (allApidata.batchcountbysts.running !=="0" && allApidata.batchcountbysts.running !== 0) && tabFilterStatus === false ?(
          <div className="card-item df fdc jcc br4 cp"
          onClick={handleNavLinkFilterClick({ label: "Running", value: "2" }) }
          >
            <span className="fs36 fc1 mb8 v-center">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.running||0}</span>
            <p className="fw6 fs16 fc5">Running</p>
          </div>
          ):(
            <div className="card-item df fdc jcc br4"
          
          >
            <span className="fs36 fc1 mb8 v-center">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.running||0}</span>
            <p className="fw6 fs16 fc5">Running</p>
          </div>
          )}

          {allApidata && allApidata.batchcountbysts && (allApidata.batchcountbysts.completed !=="0" && allApidata.batchcountbysts.completed !== 0) && tabFilterStatus === false ?(
          <div className="card-item df fdc jcc br4 cp"
          onClick={handleNavLinkFilterClick({ label: "Completed", value: "3" })}
          >
            <span className="fs36 fc1 mb8">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.completed||0}</span>
            <p className="fw6  fs16 fc5 ">Completed</p>
          </div>
          ):(
            <div className="card-item df fdc jcc br4 "
          >
            <span className="fs36 fc1 mb8">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.completed||0}</span>
            <p className="fw6  fs16 fc5 ">Completed</p>
          </div>

          )}


          {allApidata && allApidata.batchcountbysts && (allApidata.batchcountbysts.hold !=="0" && allApidata.batchcountbysts.hold !== 0) && tabFilterStatus ===false ?(
          <div className="card-item df fdc jcc br4 cp"
          onClick={handleNavLinkFilterClick({ label: "Hold", value: "4" })}
          >
            <span className="fs36 fc1 mb8 v-center">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.hold || 0}</span>
            <p className="fw6  fs16 fc5">Hold</p>
          </div>
          ):(
            <div className="card-item df fdc jcc br4"
          >
             <span className="fs36 fc1 mb8 v-center">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.hold || 0}</span>
            <p className="fw6  fs16 fc5">Hold</p>
          </div>
          )}

          {allApidata && allApidata.batchcountbysts && (allApidata.batchcountbysts.upcoming !=="0" && allApidata.batchcountbysts.upcoming !== 0) && tabFilterStatus === false ?(
          <div className="card-item df fdc jcc br4 cp"
          onClick={handleNavLinkFilterClick({ label: "Upcoming", value: "1" })}
          >
            <span className="fs36 fc1 mb8 v-center">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.upcoming || 0}</span>
            <p className="fw6 fs16 fc5">Upcoming</p>
          </div>
          ):(
            <div className="card-item df fdc jcc br4 "
          >
            <span className="fs36 fc1 mb8 v-center">{allApidata && allApidata.batchcountbysts && allApidata.batchcountbysts.upcoming || 0}</span>
            <p className="fw6 fs16 fc5">Upcoming</p>
          </div>
          )}


        </div>
      )}

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
              <th onClick={() => handleSortByChange("batch_type")} className={activeSortColumn === "batch_type" ? "fc1" : ""}>
                <p className="box-center">
                  Type
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("batch_name")} className={activeSortColumn === "batch_name" ? "fc1" : ""}>
                <p className="box-center wsnw">
                  Batch Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("start_date_long")} className={activeSortColumn === "start_date_long" ? "fc1" : ""}>
                <p className="box-center">
                  Start Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("end_date_long")} className={activeSortColumn === "end_date_long" ? "fc1" : ""}>
                <p className="box-center">
                  End Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th onClick={() => handleSortByChange("timing")} className={activeSortColumn === "timing" ? "fc1" : ""}>
                <p className="box-center">
                  Timing
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("max_allow_stu")} className={activeSortColumn === "max_allow_stu" ? "fc1" : ""}>
                <p className="box-center">
                Max Student
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("students_joined")} className={activeSortColumn === "students_joined" ? "fc1" : ""}>
                <p className="box-center">
                  Joined
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th onClick={() => handleSortByChange("examdate_long")} className={activeSortColumn === "examdate_long" ? "fc1" : ""}>
                <p className="box-center">
                  Days
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("location")} className={activeSortColumn === "location" ? "fc1" : ""}>
                <p className="box-center">
                  Center
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              
              <th onClick={() => handleSortByChange("instructor_name")} className={activeSortColumn === "instructor_name" ? "fc1" : ""}>
                <p className="box-center">
                Instructor Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

              {/* <th onClick={() => handleSortByChange("create_date")} className={activeSortColumn === "create_date" ? "fc1" : ""}>
                <p className="box-center">
                  Created Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th onClick={() => handleSortByChange("course_name")} className={activeSortColumn === "course_name" ? "fc1" : ""}>
                <p className="box-center">
                  Course Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("status")} className={activeSortColumn === "status" ? "fc1" : ""}>
                <p className="box-center">
                  Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("update_date_long")} className={activeSortColumn === "update_date_long" ? "fc1" : ""}>
                <p className="box-center">
                  Updated Date
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

              <th >
                <p className="box-center">
                  Action
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="batch-list">
            {batchList && batchList.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-students">
                  No Batchs Available
                </td>
              </tr>
            ) : (
              batchList && batchList.map((batch, index) => {
                const startDate = moment(batch.start_date, "DD MMM YYYY");
                const endDate = moment(batch.end_date, "DD MMM YYYY");
               

                const className = endDate.isBefore(currentDate)
                  ? "fc19"
                  : endDate.isSameOrAfter(currentDate) &&
                      startDate.isSameOrBefore(currentDate)
                    ? "fc2"
                    : startDate.isAfter(currentDate)
                      ? "fc12"
                      : "fc16";

                return (
                  <tr key={index}>
                    <td>{batch.id}</td>
                    <td
                    style={{
                        color: giveTextColor(
                          batch.batch_type === "Theory"
                            ? "blue"
                            : batch.batch_type === "Flying"
                              ? "indigo"
                                : batch.batch_type
                        ),
                        textTransform: "capitalize",
                      }}
                    >{batch.batch_type}</td>
                     

                    <td className="wrap-txt">
                      {batch.batch_name && (
                        <Tooltip title={batch.batch_name}>
                          {batch.batch_name}
                        </Tooltip>
                      )}
                    </td>


                    <td className={className}>{batch.start_date}</td>
                    <td className={className}>{batch.end_date}</td>
                    {/* <td>{batch.timing}</td> */}
                    <td>{batch.max_allow_stu}</td>
                    <td
                      onClick={() => {
                        if (batch.students_joined > 0) {
                          setStudentDetailsPopup(true);
                          setSingleBatch(batch);
                        }
                      }}
                      className={`${
                        Number(batch.students_joined) === 0
                          ? "fc14 cursor-auto"
                          : Number(batch.students_joined) < Number(batch.min_stu_req)
                          ? "fc24"
                          : Number(batch.students_joined) > Number(batch.max_allow_stu)
                          ? "fc4"
                          : "fc2"
                      }`}
                      
                    >
                      {batch.students_joined}
                    </td>


                   
                    {/* <td className="leads-tool-fix ">
                      <p className="box-center w100">
                        {daysOfWeek.map((day, i) => (
                          <span
                            key={i}
                            style={{
                              color: batch && batch.on_days && batch.on_days.includes(day)
                                ? "green"
                                : "red",
                              marginRight: "6px",
                            }}
                          >
                            <Tooltip
                              title={batch && batch.on_days && batch.on_days.includes(day) ? "On" : "Off"}
                            >
                              {day.charAt(0)}
                            </Tooltip>
                          </span>
                        ))}
                      </p>
                    </td> */}
                    <td>
                    {batch.location && (
                                <Tooltip title={batch.location}>
                                  {batch.location.length > 20
                                    ? `${batch.location.slice(0, 20)}...`
                                    : batch.location}
                                </Tooltip>
                              )}
                    </td>
                    {/* <td>{batch.create_date}</td> */}
                    <td>{batch.instructor_name}</td>
                    <td>
                    {batch.course_name && (
                                <Tooltip title={batch.course_name}>
                                  {batch.course_name.length > 20
                                    ? `${batch.course_name.slice(0, 20)}...`
                                    : batch.course_name}
                                </Tooltip>
                              )}
                    </td>
                    <td
                      style={{
                        color: giveTextColor(
                          batch.status === "Draft"
                            ? "Pending"
                            : batch.status === "Published"
                              ? "Completed"
                              : batch.status === "Unpublished"
                                ? "Rejected"
                                : batch.status
                        ),
                        textTransform: "capitalize",
                      }}
                    >
                      {batch.status}
                    </td>
                    <td>{batch.update_date}</td>
                    <td>
                      <PiStudent
                        className="icon mail-icon cp fs18 fc5 mr8"
                        onClick={() => {
                          setStudentDetailsPopup(true);
                          setSingleBatch(batch);
                        }}
                      />
                      <TfiBlackboard
                        className="icon mail-icon cp fs18 fc5 mr8"
                        onClick={() => {
                          setPeriodPopup(true);
                          setSingleBatchTimeTable(batch);
                          setMaxPeriods(
                            Math.max(
                              ...batch.timeTable.map(
                                (daySchedule) => daySchedule.periods.length
                              )
                            )
                          );
                        }}
                      />

                      <FaPencilAlt className="icon mail-icon cp fs18 fc5 " 
                        onClick={(e) => openUpdateBatch(batch.id)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {periodPopup && (
          <SidePopup
            show={periodPopup}
            onClose={closePeriodPopup}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Time Table</p>
              <button onClick={closePeriodPopup} className="lead-close-button">
                X
              </button>
            </div>
            <div className="period p8 ">
              <table className=" cp w100 wsnw">
                <thead>
                  <tr>
                    <th>
                      <p className="box-center">Date</p>
                    </th>

                    {Array.from({ length: maxPeriods }, (_, i) => (
                      <th key={i}>
                        <p className="box-center">Class {i + 1}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTimetable.map((daySchedule, index) => (
                    <tr key={index}>
                      <td>
                      {moment(daySchedule.date, "YYYY-MM-DD").format("ddd, DD MMM YYYY")}
                      </td>
                      {Array.from({ length: maxPeriods }).map((_, idx) => {
                        const period = daySchedule.periods[idx] || {};
                        return (
                          <td key={idx} className="assigned">
                            <div className="df fdc">

                            <p className="fw6 ls1 lh18">
                                {period.class_type} 
                                {period.class_type && (period.subject || period.mode) && " - "}
                                {period.subject} 
                                {period.subject || period.mode ? ` (${period.mode}) ` : ""}
                              </p>


                              <p className="fc5 mt4 df jcc">
                              {period.time}
                              <span className="v-center">
                                {period.location_name || period.link ? (
                                  <>
                                  &nbsp;(
                                    {period.location_name && <>{period.location_name}</>}
                                    {period.location_name && period.link && " "} 
                                    {period.link && (
                                      <>
                                      <Tooltip title="Online Class link">
                                    
                                      <a
                                        href={period.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "blue", textDecoration: "underline" }}
                                      >
                                        <FaLink className="ml4" />
                                      </a> 
                                      </Tooltip>
                                      &nbsp;
                                      </>
                                    )}
                                    )
                                  </>
                                ) : null}
                              </span>
                            </p>


                              </div>
                            

                            {period.id && (
                              <div className="mt12 leads-tool-fix box-center fww">
                              
                            {period.location &&(
                                <ImageDropdown
                                 options={roomsOptions[period.location]||[roomsOptions[1]]}
                                  onChange={(selected) =>
                                    handleClassRoomChange(selected, index, idx,period)
                                  }
                                  image={false}
                                  className={"mb8 mr8"}
                                  label="Room"
                                  value={period.room}
                                />
                              )}
                                <ImageDropdown
                                  options={facultiesOptions}
                                  onChange={(selected) =>
                                    handleFacultyChange(selected, index, idx,period)
                                  }
                                  image={true}
                                  showImage={false}
                                  className={"mb8 mr8"}
                                  label="Faculty"
                                  value={period.faculty}
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-controls mt24 df jce ">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className={`${currentPage === 0 ? "disabled-input bg14 fc3" : "cp fc3 bg1"} pagination-btn br4 mr8`}
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={endIndex >= singleBatchTimeTable.timeTable.length}
                className={`${endIndex >= singleBatchTimeTable.timeTable.length ? "disabled-input bg14 fc3" : "cp fc3 bg1"} pagination-btn br4`}
              >
                Next
              </button>
            </div>
          </SidePopup>
        )}
        {studentDetailsPopup && (
          <SidePopup
            show={studentDetailsPopup}
            onClose={() => {
              setStudentDetailsPopup(false);
              document.body.style.overflow = "auto";
            }}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Student Details</p>
              <button
                onClick={() => {
                  setStudentDetailsPopup(false);
                  document.body.style.overflow = "auto";
                  setSortOrder("asc")
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="booked p8">
              <table className="student-table cp w100 wsnw list-stud-popup">
                <thead>
                  <tr>
                    <th>
                      <p className="box-center">ID</p>
                    </th>
                    <th onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }>
                      <p className="box-center df aic">
                        Student
                        <span
                          className="ml4 cp"
                          
                        >
                          {sortOrder === "asc" ? (
                            <FaSortAlphaDown />
                          ) : (
                            <FaSortAlphaUp />
                          )}
                        </span>
                      </p>
                    </th>
                    <th>
                      <p className="box-center">Payment Status</p>
                    </th>
                    <th>
                      <p className="box-center">Pending Amount</p>
                    </th>
                    <th>
                      <p className="box-center">Doc. Status</p>
                    </th>

                    {/* <th>
                      <p className="box-center">Attendance</p>
                    </th> */}
                    <th>
                      <p className="box-center">Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                {sortedStudents.length > 0 ? (
                    sortedStudents.map((student, index) => (
                      <tr key={index}>
                        <td
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/my-leads/${student.id}`, "_blank");
                          }}
                        >
                          <p className="box-center">{student.id || "-"}</p>
                        </td>
                        <td
                          className="student-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/my-leads/${student.id}`, "_blank");
                          }}
                        >
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
                              {(student.gender ||
                                student.age ||
                                student.email ||
                                student.mobile) && (
                                <span className="ls1 fc5 df gender-stud">
                                  {(student.gender || student.age > 0) && (
                                    <span className="fs12 ls1">
                                      {student.gender && (
                                        <>
                                          {student.gender.charAt(0)}
                                          {student.age > 0 ? "-" : ""}
                                        </>
                                      )}
                                      {student.age > 0 ? `${student.age}y` : ""}
                                    </span>
                                  )}
                                  {student.email && (
                                    <Tooltip title={student.email}>
                                      <MdOutlineMail className="fs16 ml4" />
                                    </Tooltip>
                                  )}
                                  {student.mobile && (
                                    <Tooltip title={student.mobile}>
                                      <MdCall className="fs16 ml4" />
                                    </Tooltip>
                                  )}
                                </span>
                              )}
                            </p>
                          </div>

                        </td>
                        <td
                        onClick={(e) => {
                            e.stopPropagation();
                            handleWorkOrderClick(student.work_order_id)
                          }}
                          style={{
                            color: giveTextColor(
                              student.paymentStatus === "Pending"
                                ? "Pending"
                                : student.paymentStatus === "Completed"
                                  ? "Completed"
                                  : student.paymentStatus === "Rejected"
                                    ? "Rejected"
                                    : student.paymentStatus
                            ),
                            textTransform: "capitalize",
                          }}
                        >
                          <p className="box-center">
                          {student.paymentStatus || "-"}
                          </p>
                        </td>
                        {student.workorder_id}
                        <td
                          onClick={(e) => {
                            e.stopPropagation();
                          if(student.pendinAmount > 0){
                            handleWorkOrderClick(student.work_order_id)
                          }
                          }}
                        >
                          <p
                            className={`box-center ${student.pendinAmount > 0 && "fc4"}`}

                          >
                            {student.pendinAmount > 0? formatter.format(student.pendinAmount || "-"):"0"}

                        
                          </p>
                        </td>
                        <td
                          style={{
                            color: giveTextColor(
                              student.docStatus === "Pending"
                                ? "Pending"
                                : student.docStatus === "Completed"
                                  ? "Completed"
                                  : student.docStatus === "Rejected"
                                    ? "Rejected"
                                    : student.docStatus
                            ),
                            textTransform: "capitalize",
                          }}

                          onClick={(e) => {
                            signuinStudentAccount(student.id);
                          }}

                        >
                          <p className="box-center">
                            {student.docStatus || "-"}
                          </p>
                        </td>
                        {/* <td>
                          {daysOfWeek.map((day, i) => (
                            <span
                              key={i}
                              style={{
                                color: student.attendance.includes(day)
                                  ? "green"
                                  : "red",
                                marginRight: "6px",
                              }}
                            >
                              {day.charAt(0)}
                            </span>
                          ))}
                        </td> */}
                        <td>
                          <DynamicTooltip direction="bottom" text="Edit">
                            <FaPencilAlt
                              className="icon cp fs18 fc5 mr8"
                              onClick={() => handleStudentRowClick(student.id)}
                            />
                          </DynamicTooltip>

                          <DynamicTooltip direction="bottom" text="Documents">
                            <HiOutlineDocumentCheck
                              className={` cp fs20 mr8 ${student.docStatus === "Approved" ? "fc2" : "fc5"}`}
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   window.open(
                              //     "https://studentcrm.vercel.app/my-account",
                              //     "_blank"
                              //   );
                              // }}

                              onClick={(e) => {
                                signuinStudentAccount(student.id);
                              }}
                            />
                          </DynamicTooltip>
                          {/* <CiCalendarDate
                            className="icon cp fs20 fc5 "
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttendanceShow(true);
                            }}
                          /> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <p className="box-center">No students available</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SidePopup>
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
                  setStudentDetailsPopup(true);
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
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

export default BatchListing;
