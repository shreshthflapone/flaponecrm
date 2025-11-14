import React, { useState, useEffect, useMemo } from "react";
import "../MyTeam/MyTeam.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import { FaPencilAlt, FaEye, FaCopy } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowUpDownFill } from "react-icons/ri";
import SearchInput from "../../components/SearchInput.js";
import { useTitle } from "../../hooks/useTitle.js";
import { giveTextColor } from "../../helpers/textColors.js";
import SubjectListData from "../../data/SubjectListData";
import { useNavigate, useParams } from "react-router-dom";
import Dropdown from "../../components/Dropdown.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import SidePopup from "../../components/Popup/SidePopup.js";
import Popup from "../../components/Popup/Popup.js";
import SingleDropdown from "../../components/SingleDropdown.js";
import { useDispatch, useSelector } from "react-redux";
import { addDays,subDays, endOfMonth, endOfWeek, format, startOfMonth, startOfToday, startOfWeek, startOfYesterday, subMonths, subWeeks } from "date-fns";
import axios from "axios";
import { logout } from "../../store/authSlice.js";
import constant from "../../constant/constant.js";
import CourseHeader from "../../components/CourseMaterial/CourseHeader.js";
import ContentSection from "../../components/CourseMaterial/CourseContentSection.js";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import SmallLoader from "../../components/SmallLoader.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const Subjects = () => {
  useTitle("Subjects - Flapone Aviation");
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
 

  const [subjectList, setSubjectList] = useState(SubjectListData);
  const [searchValue, setSearchValue] = useState("");
  const [previewView, setPreviewView] = useState(false);
  const [assignSubject, setAssignSubject] = useState(false);

  const limit = 10;
  const [recordList, setRecordList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("subjectlist");
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [clearSignal, setClearSignal] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [allApidata, setAllApiData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});

  const [sortBy, setSortBy] = useState("chapter_id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeSortColumn, setActiveSortColumn] = useState("chapter_id");
 
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(0);
  const [listFilter, setListFilter] = useState({});
  const [subjectFormDataPreview, setSubjectFormDataPreview] = useState({
    "category": "",
    "course_name": "",
    "subject": "",
    "chapter": null,
    "showAfter": "",
    "chapterstatus": "2",
    "topics": [
      {
        "id": Date.now() + "_new",
        "topic": "",
        "position": "1",
        "duration": "",
        "description": "",
        "status": "1",
        "images": [],
        "videos": []
      }
    ]
  });

  const navigate = useNavigate();
  const [categoryDataOptions, setCategoryDataOptions] = useState([]);
  const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
  const [subjectListOption, setSubjectListOption] = useState([]);
  const [courseListOptions,setCourseListOptions] = useState([]);
  const [courseListOptionsAssign,setCourseListOptionsAssign] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCoursesForAssign, setSelectedCoursesForAssign] = useState([]);
  const [subject, setSubject] = useState({label:"Select subject", value:""});
  const [subjectForAssign, setSubjectForAssign] = useState({});

  var oldFilter = {};
  const initial_obj = {
    page_type: id ? id : selectedTab,
    categoryCheckedItems:"",
    selectedCourses:[],
    subject:"",
    searchByValue:"",    
  }

  const applyFilter = async () => {
    setAllApiData([]);
    let updatefilter = {
      ...listFilter,
      page_type: id ? id : selectedTab,
      categoryCheckedItems:categoryCheckedItems,
      selectedCourses:selectedCourses,
      subject:subject,
      searchByValue:searchValue,   
    };
    var getoldfilter = localStorage.getItem("allfilterstudent");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilterstudent", JSON.stringify(oldFilter));
    
    setListFilter(updatefilter);
    setPageNum(1);
    setFilterApplyStatus(true);
    //closeFilter();
  }

  const clearFilter = () => {
    setFilterApplyStatus(false);
    FilterAllStateClear();
    let getOldFilterclear = localStorage.getItem("allfilterstudent");
    let oldFilterValclear = getOldFilterclear
      ? JSON.parse(getOldFilterclear)
      : {};
    let currentTabFilterValclear = oldFilterValclear[selectedTab]
      ? { ...oldFilterValclear }
      : null;

    if(currentTabFilterValclear){
      delete currentTabFilterValclear[selectedTab];
      localStorage.setItem(
        "allfilterstudent",
        JSON.stringify(currentTabFilterValclear)
      );
    }
    getAllFilter();
    updateSetListingFilter();
    //closeFilter();
  };
  const updateSetListingFilter = async () => {
    let updatefilter = {
      ...listFilter,
      ...initial_obj,
    };
    setListFilter(updatefilter);
  }
  const FilterAllStateClear=()=>{
    setCategoryCheckedItems(categoryDataOptions);
    setSelectedCourses([]);
    setSearchValue("");
    setSubject({label:"Select subject", value:""});
    setClearSignal(true);
    setTimeout(() => setClearSignal(false), 0);
    setPageNum(1);
    setTotalPageNum(0);
    setAllApiData([]);
  }
  
  useEffect(() => {
    if(filterApiStatus){
      FilterAllStateClear();
      setLocalStorage();
    }
  }, [filterApiStatus]);

  useEffect(()=>{
    if(listFilter.page_type!==undefined){
      getAllFilter();
    }
  },[selectedTab]);

  useEffect(() => {
    getAllFilter();
  }, []);

  useEffect(() => {
    if(listFilter.page_type!==undefined){
      getListRecord();
    }
  }, [listFilter]);

  const setLocalStorage = async () =>  {
    var getoldfilter = localStorage.getItem("allfilterstudent");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
      var currenttabfilter = oldFilter[selectedTab] ? oldFilter[selectedTab]:"";
      if (currenttabfilter) {
        setListFilter(currenttabfilter);
        if (currenttabfilter && currenttabfilter["categoryCheckedItems"]) {
            setCategoryCheckedItems(currenttabfilter["categoryCheckedItems"]);
        }
        if (currenttabfilter && currenttabfilter["selectedCourses"]) {
            setSelectedCourses(currenttabfilter["selectedCourses"]);
        }
        if (currenttabfilter && currenttabfilter["subject"]) {
            setSubject(currenttabfilter["subject"]);
        }
        if (currenttabfilter && currenttabfilter["searchByValue"]) {
          handleSearchChange(currenttabfilter["searchByValue"]);
        }
      }else{
        updateSetListingFilter();
      }
    }else{
      updateSetListingFilter();
    }
  }

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  const openSubjectDetail = () => {
    navigate("/course-material-detail");
  };

  const handleSelectCourse = (value) => {
    const index = selectedCourses.indexOf(value);
    if (index === -1) {
      setSelectedCourses([...selectedCourses, value]);
    } else {
      const updatedValues = [...selectedCourses];
      updatedValues.splice(index, 1);
      setSelectedCourses(updatedValues);
    }
  };
  const handleSelectCourseForAssign = (value)=>{
    const index = selectedCoursesForAssign.indexOf(value);
    if (index === -1) {
      setSelectedCoursesForAssign([...selectedCoursesForAssign, value]);
    } else {
      const updatedValues = [...selectedCoursesForAssign];
      updatedValues.splice(index, 1);
      setSelectedCoursesForAssign(updatedValues);
    }
  }
  const handleSubjectChange = (value) => {
    setSubject(value);
  };
  const closeAssignSubjectPopup = () => {
    setAssignSubject(false);
    setSelectedCoursesForAssign([]);
    setSubjectForAssign({});
  };

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleClickOPenEdit = async(chapter_id)=>{
    //window.open(`${constant.weburl}enquiry?prvt_id=${user.userid}&spl_type=${type}`, "_blank");
    navigate("/course-material-detail/"+chapter_id);
  }
 
  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/subject_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { filter: listFilter },
     })  
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          const filterList = response.data.data.filterlist;
          setAllApiFilter(filterList);
          setCategoryDataOptions([
            ...JSON.parse(filterList.categories_list),
          ]);
          if (categoryCheckedItems.length == 0) {
            setCategoryCheckedItems([
              ...JSON.parse(filterList.categories_list),
            ]);
          }
          setSubjectListOption([
            ...JSON.parse(filterList.subjectlistopt),
          ]);
          setCourseListOptions([
            ...JSON.parse(filterList.courseListOptions),
          ]);
          setCourseListOptionsAssign([
            ...JSON.parse(filterList.courseListOptions),
          ]);

          setFilterApiStatus(true);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  useEffect(() => {
    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const { scrollHeight, scrollTop, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 70 && !isFetching) {
          setIsFetching(true);
          if (pageNum <= totalPageNum) {
            getListRecord();
          }
        }
      }, 200); // Adjust the debounce delay as needed
    };

    let scrollTimeout;

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isFetching, pageNum]);

  
  const handleSortByChange = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setActiveSortColumn(field);
  };

  const sortList = useMemo(() => {
    let sortedList = [...recordList];
    sortedList.sort((a, b) => {
        // Handle null or undefined values for sortBy field
        const aValue = a[sortBy] ? a[sortBy]: ""; // Use nullish coalescing to handle null/undefined
        const bValue = b[sortBy] ? b[sortBy]:  ""; // Use nullish coalescing to handle null/undefined

        // Use localeCompare for string comparison, numeric for id
        if (
            sortBy === "chapter_id" ||
            sortBy === "create_date_long" ||
            sortBy === "create_date_long"
        ) {
            return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]; 
        } else if ((sortBy === "subject")) {
          const labelA = aValue.label || ''; 
          const labelB = bValue.label || ''; 
      
          const comparison = labelA.localeCompare(labelB, undefined, {
              numeric: true,
          });
      
          return sortDirection === "asc" ? comparison : -comparison;
        } else {
            const comparison = aValue
                .toString()
                .localeCompare(bValue.toString(), undefined, { numeric: true });
            return sortDirection === "asc" ? comparison : -comparison;
        }
    });

    return sortedList;
}, [recordList, sortBy, sortDirection]);

  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/subject_list.php?fun=getlistrecord`,
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
  const getExistinngTopicBYID = async (chapter_id) => {

    if (chapter_id > 0 && chapter_id != undefined) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/subject_topic_detail.php?fun=getsubjecttopic`,
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
  function validateInput() {
    const errors = {};
    if (subjectForAssign.value==undefined) {
      errors.subjectForAssign = "Please Select Subject";
    }
    if (selectedCoursesForAssign.length==0) {
      errors.selectedCoursesForAssign = "Please select course first";
    }
    setErrorMsg(errors);
    return Object.keys(errors).length > 0 ? 1 : 0;
  }
  const handleAssignSubjectToCourse = ()=>{
    if (validateInput()) {
      return;
    }
    setSubmitLoader(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/subject_list.php?fun=assignsubject`,
      headers: { "Auth-Id": user.auth_id },
      data: {subjectdata: subjectForAssign,coursedata:selectedCoursesForAssign},
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
            toast.success(response.data.data.msg);
            applyFilter();
        } else {
            toast.error(response.data.data.msg);
        }
        setSubmitLoader(false);
        closeAssignSubjectPopup();
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  }
  const handleassignupdatesubject = async(subject)=>{
        setCourseListOptionsAssign(subject.course_cat_option);
        setSubjectForAssign(subject.subject);
        setSelectedCoursesForAssign(subject.all_course_id);
        setAssignSubject(true);
  }

  const filterLabels = {
             page_type: "Page Type",
             datetypefilter: "Date Type",
             dateMoreOptions: "Date Type",
             instructorselect:"Faculty",
             dateRangeValue: "Date Range",
             listStatusOptions:"Status",
             searchByOptions:"Search By",
             searchByValue:"Chapter",
             checkedTeamItems:"Team",
             categoryOptions:"Location Type",
             selectedCourses:"Course",
             subject:"Subject",
             categoryCheckedItems:"Category"
             
           };
           const [filterCount, setFilterCount] = useState(0);
          
            const [filterApplyStatus, setFilterApplyStatus] = useState(false);
          
            const handleFilterCountChange = (count) => {
              setFilterCount(count);
            };
        
  return (
    <>
      {(dataStatus && filterApiStatus) && (
    <>
      <InnerHeader
        heading="Course Material"
        txtSubHeading="View and manage all study materials here. Use the options provided to add new course materials or edit existing ones."
        showButton={true}
        iconText="Add Course Material"
        onClick={openSubjectDetail}
      />

      <Card className="bg5 mt16 pb16">
        <div className="myteam-filters v-center pl16 brd-b1 pb12 pt12 fww">
          <div className="team-filter mr8 searching-drop v-center">
            <div className="category-filter mr8 searching-drop mb8">
              <MultiLevelDropdown
                placeholder="Category"
                data={categoryDataOptions}
                checkedItems={categoryCheckedItems}
                setCheckedItems={setCategoryCheckedItems}
              />
            </div>
            <div className="status-filter mb8">
              <MultiDropdown
                label="Course"
                options={courseListOptions}
                selectedValues={selectedCourses}
                onSelect={handleSelectCourse}
                chips={2}
              />
            </div>
          </div>
          <div className="mr8 plan-status mb8">
            <Dropdown
              label="Select Subject"
              options={subjectListOption}
              selectedValue={subject}
              onValueChange={handleSubjectChange}
            />
          </div>
          <div className="student-filter mb8 v-center ">
            <SearchInput
              onSearchChange={handleSearchChange}
              placeholder={"Chapter"}
              workOrderID = {searchValue}
            />
          </div>

          <button className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mb8" onClick={applyFilter}>
            Apply
          </button>
          {filterStatus>0 && <button className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb8" onClick={clearFilter}>
            Clear
          </button>}
        </div>

        {filterApplyStatus && (
                      <FilteredDataDisplay
                        filterData={listFilter}
                        labels={filterLabels}
                        onClearAll={clearFilter}
                        onFilterCountChange={handleFilterCountChange}
                        listOptions={{
                          categoryDataOptions, 
                          courseListOptions,
                          subjectListOption
                        }}
                      />
                    )}
        <div class="mylead-filters v-center jcsb pl16 pt16 fww fs12 ">
          Total Results: {allApidata.total_count}
        </div>
        <div
          className="booked table-container df w100 fdc mt16"
          style={{ overflow: "auto" }}
        >
          <table className="mylead-table cp wsnw">
            <thead className="w100">
              <tr>
                <th onClick={() => handleSortByChange("chapter_id")} className={activeSortColumn === "chapter_id" ? "fc1" : ""}>
                  <p className="box-center">
                    ID
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("course_category")} className={activeSortColumn === "course_category" ? "fc1" : ""}>
                  <p className="box-center wsnw">
                    Category
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("course")} className={activeSortColumn === "course" ? "fc1" : ""}>
                  <p className="box-center">
                    Course Name
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th onClick={() => handleSortByChange("subject")} className={activeSortColumn === "subject" ? "fc1" : ""}>
                  <p className="box-center">
                    Subject
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("chapter_name")} className={activeSortColumn === "chapter_name" ? "fc1" : ""}>
                  <p className="box-center">
                    Chapter
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("create_date_long")} className={activeSortColumn === "create_date_long" ? "fc1" : ""}>
                  <p className="box-center">
                    Create Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th onClick={() => handleSortByChange("update_date_long")} className={activeSortColumn === "update_date_long" ? "fc1" : ""}>
                  <p className="box-center">
                    Update Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("course_status_student")} className={activeSortColumn === "course_status_student" ? "fc1" : ""}>
                  <p className="box-center">
                    Status
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Action
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="subject-list">
              {recordList.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-subjects">
                    No Subjects Available
                  </td>
                </tr>
              ) : (
                sortList.map((subject, index) => {
                  return (
                    <tr key={index}>
                      <td>{subject.chapter_id}</td>
                      <td>{subject.course_category}</td>
                      <td>{subject.course}</td>
                      <td className="ttc">{subject.subject.label}</td>
                      <td className="ttc">{subject.chapter_name}</td>
                      <td>{subject.create_date}</td>
                      <td>{subject.update_date}</td>
                      <td
                        style={{
                          color: giveTextColor(
                            subject.status === "draft"
                              ? "Pending"
                              : subject.status === "published"
                                ? "Completed"
                                : subject.status === "unpublished"
                                  ? "Rejected"
                                  : subject.status
                          ),
                          textTransform: "capitalize",
                        }}
                      >
                        {subject.status}
                      </td>
                      <td>
                        <FaPencilAlt className="icon mail-icon cp fs18 fc5 mr8" onClick={()=>handleClickOPenEdit(subject.chapter_id)}/>
                        <FaEye
                          className="icon mail-icon cp fs18 fc5 mr8"
                          onClick={()=>getExistinngTopicBYID(subject.chapter_id)}
                        />
                        <MdOutlineAssignmentTurnedIn
                          className="icon mail-icon cp fs18 fc5"
                          onClick={() => {
                            handleassignupdatesubject(subject)
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
            <div className="pt8 pb8 pl16 pr16 preview-pop-show">
              <CourseHeader details={subjectFormDataPreview} />

              <ContentSection sections={subjectFormDataPreview.topics} />
            </div>
          </SidePopup>
        )}
        {assignSubject && (
          <Popup onClose={closeAssignSubjectPopup} title={"Assign Subject"}>
            <div className="mb24">
              <SingleDropdown
                label="Subject"
                options={subjectListOption}
                selectedOption={subjectForAssign}
                onSelect={handleSubjectChange}
                isReadOnly
              />
              {errorMsg.subjectForAssign && (
                <p className="form-error-messages fc4">{errorMsg.subjectForAssign}</p>
              )}
            </div>
            <div className="">
              <label className="fc15 fw6 fs14 ls1 course-label">Courses</label>
              <MultiDropdown
                label="Course"
                options={courseListOptionsAssign}
                selectedValues={selectedCoursesForAssign}
                onSelect={handleSelectCourseForAssign}
              />
              {errorMsg.selectedCoursesForAssign && (
                <p className="form-error-messages fc4">{errorMsg.selectedCoursesForAssign}</p>
              )}
            </div>
            <div className="button-container mt32 myteam-filters">
              <button
                type="button"
                className="btn-cancel clear"
                onClick={closeAssignSubjectPopup}
              >
                Cancel
              </button>
              {!submitLoader && (<button type="button" className={`update-button btn-blue`} onClick={handleAssignSubjectToCourse}>
                Update
              </button>)}
              {submitLoader && (
                  <div className="box-center mb12">
                    <SmallLoader className={"mb12"} />
                  </div>
                )}
            </div>
          </Popup>
        )}
      </Card>
      <ToastContainer position="bottom-right" />
      </>
    )}
    </>
    
  );
};

export default Subjects;
