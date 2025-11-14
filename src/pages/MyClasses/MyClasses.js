import React, { useRef, useEffect, useState } from "react";
import Card from "../../components/Card";
import "../MyClasses/MyClasses.css";
import Popup from "../../components/Popup/Popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SingleDropdown from "../../components/SingleDropdown";
import TimePicker from "../../components/TimePicker.js";
import { IoIosPeople } from "react-icons/io";
import ClassCard from "../../components/ClassCard.js";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { FaFilter, FaTimes } from "react-icons/fa";
import { MdCall, MdOutlineMail, MdVerified, MdPerson2 } from "react-icons/md";
import Tooltip from "../../components/Tooltip";
import Avatar from "../../assets/profile.png";
import SmallLoader from "../../components/SmallLoader";
import SidePopup from "../../components/Popup/SidePopup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import axios from "axios";
import moment from "moment";
import constant from "../../constant/constant.js";
import {formatAmount} from "../../helpers/formatAmount.js";
import {
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  subMonths,
  addMonths,
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import CourseHeader from "../../components/CourseMaterial/CourseHeader.js";
import ContentSection from "../../components/CourseMaterial/CourseContentSection.js";
import { ToastContainer, toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";


const MyClasses = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    useTitle("My Classes - Flapone Aviation");
  
  const limit = 10;
  const [recordList, setRecordList] = useState([]);
  const [recordListHistory, setRecordListHistory] = useState([]);
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [allApidata, setAllApiData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(0);
  const [leaveForm, setLeaveForm] = useState({
    leaveDate: [null, null],
    type: {},
    reason: "",
    fromTime: {
      hour: "09",
      minute: "00",
      ampm: "AM",
    },
    toTime: {
      hour: "06",
      minute: "00",
      ampm: "PM",
    },
  });
  const formRef = useRef(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendancePercentage, setAattendancePercentage] = useState(0);
  const [attendanceFilter, setAttendanceFilter] = useState({
    label: "All",
    value: "all",
  });
  const [listFilter, setListFilter] = useState({});
  const [faculty, setFaculty] = useState({
    value: "",
    label: "Select Faculty",
  });
  const [loading, setLoading] = useState(false);
  const [classDate, setClassDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("classlist");
  const [previewView, setPreviewView] = useState(false);
  const [instructorOptions, setInstructorOptions] = useState([]);

  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const [classDateDefault,setClassDateDefault] = useState(1);

  const [categoryDataOptions, setCategoryDataOptions] = useState([]);
	const [categoryCheckedItems, setCategoryCheckedItems] =
	useState([]);

	const [courseListOptions, setCourseListOption] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState([]);

	const [centerOptions, setCenterOptions] = useState([]);
	const [center, setCenter] = useState([]);
  const [filterCount, setFilterCount] = useState(0);
  const [filterApplyStatus, setFilterApplyStatus] = useState(false);
 
  const handleFilterCountChange = (count) => {
     setFilterCount(count);
  };

  const closeFilter = () => {
        setShowFilterPopup(false);
        document.body.style.overflow = "auto";
  };

  const handleFilterClick = () => {
      setShowFilterPopup(true);
  };
  
  const closeMoreFilter = () => {
      setShowFilterPopup(false);
      document.body.style.overflow = "auto";
  };

  	 const handleCourseChange = (value) => {
      const index = selectedCourse.indexOf(value);
      if (index === -1) {
        setSelectedCourse([...selectedCourse, value]);
      } else {
        const updatedValues = [...selectedCourse];
        updatedValues.splice(index, 1);
        setSelectedCourse(updatedValues);
      }
    };

     const handleCenterChange = (value) => {
      const index = center.indexOf(value);
      if (index === -1) {
        setCenter([...center, value]);
      } else {
        const updatedValues = [...center];
        updatedValues.splice(index, 1);
        setCenter(updatedValues);
      }
    };

   const checkAnyCheckedTrue = (data) => {
    return data.some(item => {
        if (item.checked === true) {
            return true;
        }
        if (item.children && item.children.length > 0) {
            return item.children.some(child => child.checked === true);
        }
        return false;
    });
   };  

  const updateFilterCount = () => {
      const count =
        (selectedCourse.length > 0 ? 1 : 0) +
        (center.length > 0 ? 1 : 0) +
        (checkAnyCheckedTrue(categoryCheckedItems) ? 1 : 0);
         setFilterCount(count);
    };

  const [subjectFormDataPreview, setSubjectFormDataPreview] = useState({
    category: "",
    course_name: "",
    prev_id: "",
    next_id: "",
    subject: "",
    chapter: null,
    showAfter: "",
    chapterstatus: "2",
    topics: [
      {
        id: Date.now() + "_new",
        topic: "",
        position: "1",
        duration: "",
        description: "",
        status: "1",
        images: [],
        videos: [],
      },
    ],
  });

  const initial_obj = {
    page_type: id ? id : selectedTab,
    instructorselect: "",
    classDate: `${format(classDate, "dd-MM-yyyy")}`,
    course:selectedCourse,
    categoryCheckedItems:categoryCheckedItems,
    center:center,
    classDateDefault:classDateDefault
  };
  
  var oldFilter = {};

  const applyFilter = async () => {
    setFilterApplyStatus(true);
    setSelectedClass(null);
    setAllApiData([]);
    let updatefilter = {
      ...listFilter,
      page_type: id ? id : selectedTab,
      instructorselect: faculty,
      classDate: `${format(classDate, "dd-MM-yyyy")}`,
      classDateDisplay: classDate,
      course:selectedCourse,
      categoryCheckedItems:categoryCheckedItems,
      center:center,
      classDateDefault:classDateDefault
    };
    var getoldfilter = localStorage.getItem("allfilterstudent");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilterstudent", JSON.stringify(oldFilter));
   
    setListFilter(updatefilter);
    setPageNum(1);
  };

  const clearFilter = () => {
    FilterAllStateClear(1);
    let getOldFilterclear = localStorage.getItem("allfilterstudent");
    let oldFilterValclear = getOldFilterclear
      ? JSON.parse(getOldFilterclear)
      : {};
    let currentTabFilterValclear = oldFilterValclear[selectedTab]
      ? { ...oldFilterValclear }
      : null;

    if (currentTabFilterValclear) {
      delete currentTabFilterValclear[selectedTab];
      localStorage.setItem(
        "allfilterstudent",
        JSON.stringify(currentTabFilterValclear)
      );
    }
    getAllFilter();
    updateSetListingFilter(1);
    closeFilter();
  };
  
  const updateSetListingFilter = async (clear = 0) => {
    if (clear == 1) {
      let updatefilter = {
        ...listFilter,
        ...initial_obj,
        page_type: id ? id : selectedTab,
        course:[],
        categoryCheckedItems:[],
        center:[],
      };
      setListFilter({ ...updatefilter });
    } else {
      let updatefilter = {
        ...listFilter,
        ...initial_obj,
        page_type: id ? id : selectedTab,
      };
      setListFilter({ ...updatefilter });
    }
  };

  const FilterAllStateClear = (clear = 0) => {
    setFilterApplyStatus(false);
    setClassDate(new Date());
    setFaculty({ value: "", label: "Select Faculty" });
    setCenter([]);
    setSelectedCourse([]);
    setCategoryCheckedItems(categoryDataOptions);
    setPageNum(1);
    setTotalPageNum(0);
    setAllApiData([]);
    setDataStatus(false);
    setSelectedClass(null);
    setAattendancePercentage(0);
    setVisible(false);
    setFilterCount(0);
  };

  
  useEffect(() => {
    if (filterApiStatus && listFilter.page_type == selectedTab) {
      getListRecord();
    }
  }, [selectedTab, filterApiStatus, listFilter]);

  useEffect(() => {
    if (listFilter.page_type == selectedTab) {
      getAllFilter();
    }
  }, [selectedTab, listFilter]);

  useEffect(() => {
    FilterAllStateClear();
    setLocalStorage();
  }, [selectedTab]);


  useEffect(() => {
    if (totalPageNum > 0) {
      const modalBody = formRef.current;

      const scrollHandler = () => {
        if (modalBody) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const { scrollLeft, clientWidth, scrollWidth } = modalBody;
            // Adjust the scroll threshold as needed (e.g., 70 pixels from the right)
            if (scrollLeft + clientWidth >= scrollWidth - 70 && !isFetching) {
              setIsFetching(true);
              if (pageNum <= totalPageNum) {
                getListRecord();
              }
            }
          }, 200);
        }
      };

      let scrollTimeout;
      modalBody.addEventListener("scroll", scrollHandler);

      return () => {
        if (modalBody) {
          modalBody.removeEventListener("scroll", scrollHandler);
        }
      };
    }
  }, [pageNum, totalPageNum]);

  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myclasses_list.php?fun=getlistrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { page_num: pageNum, limit: limit, filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          if (pageNum === 1) {
            setAllApiData(response.data.data);
            setTotalPageNum(response.data.data.total_page);
            setRecordList([...response.data.data.list]);
          } else {
            setRecordList([...recordList, ...response.data.data.list]);
          }
          setPageNum((prevPageNum) => prevPageNum + 1);
          setDataStatus(true);
        } else {
          setRecordList([]);
          setDisplayMsg(response.data.data.msg);
        }
        setFilterStatus(response.data.data.filter_status);
        setAutoLoader(false);
        setIsFetching(false);
        setDataStatus(true);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const setLocalStorage = async () => {
    var getoldfilter = localStorage.getItem("allfilterstudent");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab]
        ? oldFilter[selectedTab]
        : "";
      if (currenttabfilter) {
        setFilterApplyStatus(true);
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["classDateDisplay"]) {
          setClassDate(new Date(currenttabfilter["classDateDisplay"]));
        }
        if (currenttabfilter && currenttabfilter["instructorselect"]) {
          handleFacultySelect(currenttabfilter["instructorselect"]);
        }
      } else {
        updateSetListingFilter();
      }
    } else {
      updateSetListingFilter();
    }
  };

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myclasses_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          const filterList = response.data.data.filterlist;

          setAllApiFilter(filterList);
          setInstructorOptions([...JSON.parse(filterList.facultyoption)]);
          setCategoryDataOptions([
            ...JSON.parse(filterList.categoryDataOptions),
          ]);

           if (categoryCheckedItems.length == 0) {
            setCategoryCheckedItems([
              ...JSON.parse(filterList.categoryDataOptions),
            ]);
          }

          setCourseListOption([
            ...JSON.parse(filterList.courseListOptions)
          ]);

          setCenterOptions([
            ...JSON.parse(response.data.data.filterlist.LocationData),
          ]);

          setFilterApiStatus(true);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getExistinngTopicBYID = async (chapter_id) => {
    if (chapter_id > 0 && chapter_id != undefined) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/myclasses_list.php?fun=getsubjecttopic`,
        headers: { "Auth-Id": user.auth_id },
        data: { id: chapter_id },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1") {
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              category: response.data.data.category_select,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              prev_id: response.data.data.prev_id,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              next_id: response.data.data.next_id,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              chapter: response.data.data.chapter_select,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              course_name: response.data.data.course_name,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              topics: [...JSON.parse(response.data.data.data)],
            }));

            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              subject: response.data.data.subject_select,
            }));

            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              subjectstatus: response.data.data.chapter_status,
            }));
          } else {
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              topics: [...JSON.parse(response.data.data.data)],
            }));
          }
          setPreviewView(true);
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    }
  };
  const leaveTypeOptions = [
    { value: "full", label: "Full Day" },
    { value: "half", label: "Half Day" },
  ];

  const closePopup = () => {
    setShowLeaveForm(false);
  };

  const handleLeaveButtonClick = () => {
    setShowLeaveForm(true);
  };

  const handleSubmitLeave = () => {
    setShowLeaveForm(false);
    setLeaveForm({
      leaveDate: [null, null],
      type: {},
      reason: "",
      fromTime: {
        hour: "09",
        minute: "00",
        ampm: "AM",
      },
      toTime: {
        hour: "06",
        minute: "00",
        ampm: "PM",
      },
    });
  };

  const handleClassClick2 = (classDetail, index) => {
    if (classDetail.studentList.length > 0) {
      let total_student = classDetail.total_student;
      let present_student = classDetail.present_student;
      let percentage = (present_student / total_student) * 100;
      let percentageWithTwoDecimal = percentage.toFixed();
      setAattendancePercentage(percentageWithTwoDecimal);
      setSelectedClass(classDetail);
    } else {
      let total_student = classDetail.total_student;
      let present_student = classDetail.present_student;
      let percentage = (present_student / total_student) * 100;
      let percentageWithTwoDecimal = percentage.toFixed();
      setAattendancePercentage(percentageWithTwoDecimal);
      axios({
        method: "post",
        url: `${constant.base_url}/admin/myclasses_list.php?fun=getstudentlistrecord`,
        headers: { "Auth-Id": user.auth_id },
        data: { classDetail: classDetail },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1") {
            setLoading(true);
            setSelectedClass(response.data.data.list);
            setLoading(false);
            recordList[index]["studentList"] =
              response.data.data.list.studentList;
            setRecordList([...recordList]);
          }
          //setVisible(true);
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    }
  };

  const handleClassClick = (classDetail, index) => {
    setLoading(true);
   
      let total_student = classDetail.total_student;
      let present_student = classDetail.present_student;
      let percentage = (present_student / total_student) * 100;
      let percentageWithTwoDecimal = percentage.toFixed();
      setAattendancePercentage(percentageWithTwoDecimal);
      axios({
        method: "post",
        url: `${constant.base_url}/admin/myclasses_list.php?fun=getstudentlistrecord`,
        headers: { "Auth-Id": user.auth_id },
        data: { classDetail: classDetail, listFilter: listFilter },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1") {
            recordList[index]["studentList"] =
              response.data.data.list.studentList;
            setRecordList([...recordList]);
            setSelectedClass(recordList[index]);
            //setVisible(true);
          } else {
            setSelectedClass(recordList[index]);
          }
          setLoading(false);
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
  };
  const customDateFormat = "dd/MM/yyyy";

  const handleDateChange = (date) => {
    setLeaveForm((prevValues) => ({
      ...prevValues,
      leaveDate: date,
    }));
  };
  const handleClassDateChange = (date) => {
    setClassDate(date);
    setClassDateDefault(0);
  };

  const handleLeaveTypeSelect = (option) => {
    setLeaveForm((prevValues) => ({
      ...prevValues,
      type: option,
    }));
  };

  const handleTimeChange = (timeData, period) => {
    setLeaveForm((prevData) => ({
      ...prevData,
      [period === "from" ? "fromTime" : "toTime"]: timeData,
    }));
  };

  const handleReasonChange = (e) => {
    const { value } = e.target;
    setLeaveForm((prevValues) => ({
      ...prevValues,
      reason: value,
    }));
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    if (currentIndex < recordList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const hadleDetailLink = (studentID) => {
    if (studentID) {
      navigate(`/my-leads/${studentID}`);
    }
  };
  const handleCellClick = (studentdata, key) => {
    if (key === "wid") {
      let updatefilter = {
        searchByOptions: "wid",
        searchtext: studentdata.workOrderId,
        page_type: "workorder",
        selectedTab: "workorder",
      };

      var filterobj = {};
      filterobj["workorder"] = updatefilter;
      localStorage.setItem("allfilteroption", JSON.stringify(filterobj));
      window.open('/my-finance', "_blank");
    }
  };
  const closeNotification = () => {
    setVisible(false);
  };
  const attendanceOptions = [
    { value: "all", label: "All" },
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
  ];

  const handleAttendanceFilterSelect = (option) => {
    setAttendanceFilter(option);
  };
  const handleFacultySelect = (option) => {
    setFaculty(option);
  };

  // const handleAttendanceChange = (studentID, value) => {
  //   const updatedStudents = selectedClass.studentList.map((student) => {
  //     if (student.fsbcmid === studentID) {
  //       return {
  //         ...student,
  //         attendanceStatus:
  //           value === "mark"
  //             ? "Mark Attendance"
  //             : value.charAt(0).toUpperCase() + value.slice(1),
  //       };
  //     }

  //     return student;
  //   });

  //   // Update the state with the new student list
  //   setSelectedClass((prevClass) => ({
  //     ...prevClass,
  //     studentList: updatedStudents,
  //   }));
  //   handleUpdateAttendance(studentID, value);
  // };

  const handleAttendanceChange = (studentID, value) => {
  const updatedStudents = selectedClass.studentList.map((student) => {
    if (student.fsbcmid === studentID) {
      return {
        ...student,
        attendanceStatus: {
          value: value, 
        },
      };
    }

    return student;
  });

  setSelectedClass((prevClass) => ({
    ...prevClass,
    studentList: updatedStudents,
  }));

  handleUpdateAttendance(studentID, value);
};


  
  const handleUpdateAttendance = (studentID, value) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myclasses_list.php?fun=updateattendace`,
      headers: { "Auth-Id": user.auth_id },
      data: { studentID: studentID, value: value },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          toast.success(response.data.data.msg);
        } else {
          toast.warn(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const filterLabels = {
    page_type: "Page Type",
    datetypefilter: "Date Type",
    dateOption: "Date Type",
    instructorselect:"Faculty",
    classDate:"Class date"
  };

  

  return (
    <>
      <div className="df aic pt8 pb8 inner-header fww">
        <div className={`df fdc flx75`}>
          <div className="flx1 fs22 fw6 fc14 df">
            <h1>My Classes</h1>
          </div>
          <div className="fs14 fc5 fw4 mt8 lh18">
            Access and organize your upcoming, ongoing, and completed classes.
            Stay updated on schedules, materials, and class status.
          </div>
        </div>
        {/* <div className="myteam-button v-center jce flx1">
          <button className="btn-blue" onClick={handleLeaveButtonClick}>
            Apply Leave
          </button>
        </div> */}
      </div>
      <Card className="card bg5 pl8 pr8 pt8 pb10">
        {visible && (
          <div className="notification-bar mb16 ">
            <div className="notification-content v-center">
              <MdVerified className="mr8 fs18 fc2" />
              <div className="not-content df fdc">
                <p className="fs18 fc1">Congratulations!</p>
                <p className="fs14 ls1 lh16 mt4 fc5">
                  {attendancePercentage}% attendance {listFilter.classDate}!
                </p>
              </div>
            </div>
            <button className="close-btn" onClick={closeNotification}>
              <FaTimes />
            </button>
          </div>
        )}
        <div className="myteam-filters mylead-filters v-center jcsb brd-b1 pb12 mt8 fww ">
          <div className="left-side-filter v-center fww">
            <div className="class-calendar mr8 mt8">
              <DatePicker
                dateFormat={customDateFormat}
                selected={classDate}
                onChange={handleClassDateChange}
                placeholderText="Select Class Date"
                showIcon
              />
            </div>
            <div className="instructor-filter mt8">
              <SingleDropdown
                options={instructorOptions}
                selectedOption={faculty}
                onSelect={handleFacultySelect}
                placeholder="Select Faculty"
                noLabel
              />
            </div>
             {user.role === "1" && (
              <div className="filter-icon-container pr mt12" onClick={handleFilterClick}>
                        <FaFilter className="cp fs18 ml8 fc5 df aic mr8" />
                        { filterCount > 0 && (
                          <span className="notification-count pa br50 fc1 fw6">
                            {filterCount}
                          </span>
                        )} 
              </div>     
             )}
            <button
              className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mt8"
              onClick={applyFilter}
            >
              Apply
            </button>
            {filterStatus > 0 && (
              <button
                className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mt8"
                onClick={clearFilter}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {filterApplyStatus && (
              <FilteredDataDisplay
                filterData={listFilter}
                labels={filterLabels}
                onClearAll={clearFilter}
                onFilterCountChange={handleFilterCountChange}
                listOptions={{
                  instructorOptions,
                }}
                border={true}
              />
            )}
        <div className="slider-container jcsb w100 mt24">
          {recordList.length > 0 ? <div className="slider" ref={formRef}>
            <div
              className="classes-list v-center w100 jcsb"
              style={{
                transform: `translateX(calc(-100% /3 * ${currentIndex}))`,
              }}
            >
              {recordList.map((classDetail, index) => (
                <ClassCard
                  key={index}
                  classDetail={classDetail}
                  onClick={() => handleClassClick(classDetail, index)}
                  previewOpen={() => (e) => {
                    e.stopPropagation();
                    setPreviewView(true);
                  }}
                  getExistinngTopicBYID={getExistinngTopicBYID}
                  selected={selectedClass && selectedClass.id == classDetail.id}
                />
              ))}
            </div>
            <div className="slider-controls">
              {currentIndex > 0 && (
                <button className="prev-button" onClick={prevSlide}>
                  <GrFormPrevious />
                </button>
              )}
              {currentIndex < recordList.length - 3 && (
                <button className="next-button" onClick={nextSlide}>
                  <GrFormNext />
                </button>
              )}
            </div>
          </div>:"No Class Available"}
         
        </div>

        <div className="table-stud-list mt32 v-center jcsb">
          <div className="stud-count v-center">
            <IoIosPeople className="fs30 mr8 fc1" />
            <p className="fc14 fs14 lh16 ls1 fw6">
              Students ({selectedClass ? selectedClass.studentList.length : "0"}
              )
            </p>
          </div>
          <div className="stud-filter">
            <SingleDropdown
              options={attendanceOptions}
              selectedOption={attendanceFilter}
              onSelect={handleAttendanceFilterSelect}
              placeholder="Select Attendance"
              noLabel
            />
          </div>
        </div>

        <div
          className="booked table-container df w100 fdc mt16"
          style={{ overflow: "auto" }}
        >
          <table className="mylead-table cp wsnw">
            <thead className="w100">
              <tr>
                <th>
                  <p className="box-center">Id</p>
                </th>
                <th>
                  <p className="box-center wsnw">Student</p>
                </th>
                <th>
                  <p className="box-center">Parent</p>
                </th>
                <th>
                  <p className="box-center">Last 7 Classes</p>
                </th>
                <th>
                  <p className="box-center">Pending Amt.</p>
                </th>
                <th>
                  <p className="box-center">Status  <br/>(A = Absent, P = Present)</p>
                 

                </th>
              </tr>
            </thead>
            {selectedClass ? (
              <tbody className="subject-list">
                {selectedClass.studentList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-holidays">
                      There are currently no students enrolled for this class
                    </td>
                  </tr>
                ) : (
                  selectedClass.studentList.map((student, index) => {
                    // Check if the student's attendance matches the filter condition
                    if (
                      attendanceFilter.value === "all" ||
                      (attendanceFilter.value === "present" &&
                        student.attendanceStatus?.value === "present") ||
                      (attendanceFilter.value === "absent" &&
                        student.attendanceStatus?.value === "absent")
                    ) {
                      const isPastDate = moment(
                        selectedClass.class_date
                      ).isBefore(moment(), "day");
                      return (
                        <tr key={index}>
                          <td
                            onClick={() => hadleDetailLink(student.studentID)}
                          >
                            {student.studentID}
                          </td>
                          <td className="student-info">
                            <div className="df aic">
                              <div className="avatar-sm mr8">
                                <img
                                  src={student.img ? student.img : Avatar}
                                  alt="avatar"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = Avatar;
                                  }}
                                />
                              </div>
                              <p className="df fdc ais">
                                <span className="ls1 fs14 pb2">
                                  {student.name}
                                </span>
                                <span className="ls1 fc5 df gender-stud">
                                  <span className="fs12 ls1">
                                    {student.gender?.charAt(0)}
                                    {student.gender ? "-" : ""}
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
                          <td>{student.parent}</td>
                          <td className="leads-tool-fix">
                           {/* <p className="box-center w100">
                              {student.attendance.map((day, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    color:
                                      day.attendance === "present"
                                      ? "green"
                                      : day.attendance === "absent"
                                      ? "red"
                                      : "gray",
                                    marginRight: "6px",
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      day.attendance === "present"
                                        ? "Present (" + day.class_date + ")"
                                        : "Absent (" + day.class_date + ")"
                                    }
                                  >
                                    {day.day.charAt(0)}
                                  </Tooltip>
                                </span>
                              ))}
                            </p>*/}
                            <p className="box-center w100">
                              {student.attendance.map((day, idx) => {
                                const attendance = day.attendance?.toLowerCase();

                                let color = "gray";
                                let tooltip = `Not Marked - ${day.day} (${day.class_date})`;

                                if (attendance === "present") {
                                  color = "green";
                                  tooltip = `Present - ${day.day} (${day.class_date})`;
                                } else if (attendance === "absent") {
                                  color = "red";
                                  tooltip = `Absent - ${day.day} (${day.class_date})`;
                                }

                                return (
                                  <span key={idx} style={{ color, marginRight: "6px" }}>
                                    <Tooltip title={tooltip}>
                                      {day.day.charAt(0)}
                                    </Tooltip>
                                  </span>
                                );
                              })}
                            </p>
                          </td>
                          <td
                            className={`ls1 fs14 pb2 ${student.pendingAmount > 0 ? "fc9" : "fc2"}`}
                            onClick={() => handleCellClick(student, "wid")}
                          >
                            {student.pendingAmount > 0 ? `${formatAmount(student.pendingAmount)}` : "--"}
                          </td>

               <td className="attendance-st">
                  <div className="box-center">
                    <span
                      className={`${
                        student.attendanceStatus?.value === "present"
                          ? "fc2"
                          : student.attendanceStatus?.value === "absent"
                          ? "fc9"
                          : "fc14"
                      } mr8 ls1`}
                    >
                      <label className="checkbox-label present-label">
                        <input
                          type="radio"
                          name={`attendance-${student.fsbcmid}`}
                          value="present"
                          className="attendance-checkbox"
                          checked={student.attendanceStatus?.value === "present"}
                          onChange={(e) =>
                            handleAttendanceChange(student.fsbcmid, e.target.value)
                          }
                          // disabled={
                          //   student.attendace_dropdown || student.attendanceStatus?.value !== ""
                          // }

                          disabled={
                            student.attendace_dropdown
                          }
                        />
                        P
                      </label>
                     
                      <label className="checkbox-label absent-label">
                        <input
                          type="radio"
                          name={`attendance-${student.fsbcmid}`}
                          value="absent"
                          className="attendance-checkbox"
                          checked={student.attendanceStatus?.value === "absent"}
                          onChange={(e) =>
                            handleAttendanceChange(student.fsbcmid, e.target.value)
                          }

                          disabled={
                            student.attendace_dropdown
                          }
                          // disabled={
                          //   student.attendace_dropdown || student.attendanceStatus?.value !== ""
                          // }
                        />
                        A
                      </label>
                    </span>
                  </div>



                          </td>
                        </tr>
                      );
                    }
                    return null; 
                  })
                )}
              </tbody>
            ) : loading ? (
              <tr>
                <td colSpan="6" className="loading-message">
                  <SmallLoader />
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="6" className="no-students">
                  Please select a class to view the student list
                </td>
              </tr>
            )}
          </table>
        </div>

        {showLeaveForm && (
          <Popup onClose={closePopup} title={"Apply Leave"}>
            <div className="apply-leave-form v-center fww jcsb">
              <div className="form-group-settings chapter-name cm-fr flx48">
                <label className="fc15 fw6 fs14 mb12 ls1">
                  Leave Date
                  <span className="fc4">*</span>
                </label>
                <DatePicker
                  selectsRange
                  startDate={leaveForm.leaveDate[0]}
                  endDate={leaveForm.leaveDate[1]}
                  onChange={handleDateChange}
                  placeholderText="Select Date Range"
                  dateFormat={customDateFormat}
                  isClearable={true}
                  showIcon
                />
              </div>
              <div className="form-group-settings batch-name cm-fr flx48">
                <SingleDropdown
                  label="Type"
                  options={leaveTypeOptions}
                  selectedOption={leaveForm.type}
                  onSelect={handleLeaveTypeSelect}
                  placeholder="Select Type"
                />
              </div>
              {leaveForm.type.value === "half" && (
                <div className="form-group-settings chapter-name flx100 ">
                  <TimePicker
                    fromTime={leaveForm.fromTime}
                    toTime={leaveForm.toTime}
                    onTimeChange={handleTimeChange}
                  />
                </div>
              )}
              <div className="comments-input flx100">
                <label className="fc15 fw6 fs14 mb12 ls1">Reason</label>
                <textarea
                  className="comments p12 br4"
                  placeholder="Enter Reason"
                  value={leaveForm.reason}
                  onChange={handleReasonChange}
                />
              </div>
            </div>
            <div className="button-container myteam-filters mt32">
              <button
                type="button"
                className="clear btn-cancel"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="update-button btn-blue box-center"
                onClick={handleSubmitLeave}
              >
                Submit
              </button>
            </div>
          </Popup>
        )}
        {previewView && (
          <SidePopup
            show={previewView}
            onClose={() => {
              setPreviewView(false);
              document.body.style.overflow = "auto";
            }}
            className="full-width"
          >
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">Preview</p>
              <button
                onClick={() => {
                  setPreviewView(false);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="pt8 pb8 pl16 pr16 w100">
              <div className="mb8 df jce ">
                {subjectFormDataPreview.prev_id > 0 && (
                  <button
                    onClick={() =>
                      getExistinngTopicBYID(subjectFormDataPreview.prev_id)
                    }
                    className={`cp fc3 bg1 pagination-btn br4 mr8`}
                  >
                    Previous
                  </button>
                )}
                {subjectFormDataPreview.next_id > 0 && (
                  <button
                    onClick={() =>
                      getExistinngTopicBYID(subjectFormDataPreview.next_id)
                    }
                    className={`cp fc3 bg1 pagination-btn br4`}
                  >
                    Next
                  </button>
                )}
              </div>
              <CourseHeader details={subjectFormDataPreview} />

              <ContentSection sections={subjectFormDataPreview.topics} />
            </div>
          </SidePopup>
        )}
      </Card>


         {showFilterPopup && (
              <SidePopup show={showFilterPopup} onClose={closeMoreFilter}>
                <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                  <p className="fs18 fc1 ">Filters</p>
                  <button className="lead-close-button" onClick={closeMoreFilter}>
                    X
                  </button>
                </div>
                <div className="filter-lists pl16 pt16 pr16">
                  <div className="filter">
                   
                    <div className="ct-f service-status-filter mr8 searching-drop mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Select Category</p>
                      <MultiLevelDropdown
                        placeholder="Category"
                        data={categoryDataOptions}
                        checkedItems={categoryCheckedItems}
                        setCheckedItems={setCategoryCheckedItems}
                        updateFilterCount={updateFilterCount}
                      />
                    </div>
                    <div className="service-status-filter mr8 searching-drop mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Select Course</p>
                      <MultiDropdown
                        label="Course"
                        options={courseListOptions}
                        selectedValues={selectedCourse}
                        onSelect={handleCourseChange}
                        updateFilterCount={updateFilterCount}
                        chips={3}
                      />
                    </div>
                    <div className="service-status-filter mr8 searching-drop mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Select Location</p>
                      <MultiDropdown
                        label="Location"
                        options={centerOptions}
                        selectedValues={center}
                        onSelect={handleCenterChange}
                        updateFilterCount={updateFilterCount}
                        chips={3}
                      />
                    </div>
                   
                  </div>
                  <div className="filter-button-container mt16 pt16 box-center myteam-filters ">
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                      onClick={closeMoreFilter}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                      onClick={applyFilter}
                    >
                      Apply
                    </button>
                    <button
                      className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                      onClick={clearFilter}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </SidePopup>
            )}

      <ToastContainer position="bottom-right" />
    </>
  );
};

export default MyClasses;
