import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import PositionImageUpload from "../../components_two/PositionImageUpload";
import TextEditor from "../../components_two/TextEdior";
import { useNavigate } from "react-router-dom";
import MultiDropdown from "../../components/MultiDropdown.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "../../components_two/TimePicker";
import "../MyStudents/CommonForm.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import SmallLoader from "../../components/SmallLoader";
import moment from "moment";
import NoPermission from "../../components/NoPermission.js";

import constant from "../../constant/constant";


const ExamForm = () => {
  const { id }    = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const limit     = 10;

  //Shreshth
  const [submitLoader,setSubmitLoader] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);
  const [pageLoadStatus, setPageLoadStatus] = useState(false);
  const [categoryListOptions, setCategoryListOptions] = useState([]); 
  const [courseListOptions, setCourseListOptions] = useState([]);
  const [batchListOptions, setBatchListOptions] = useState([]);
  const [subjectListOptions, setSubjectListOptions] = useState([]);
  const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
  const [showOtherSubject, setShowOtherSubject] = useState(false);
  const [errorListMsg, setErrorListMsg] = useState([]);
  const pageDeptAccess = user.dept_id;
  const pageRoleAccess = user.role;

  const [examFormData, setExamFormData] = useState({
    exam_type: {},
    category: [],
    courseName: [],
    batch: [],
    examDate: null,
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
    subject: {},
    othersubject: "",
    status: "2",
  });

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  const customDateFormat = "dd/MM/yyyy";

  // const courseListOptions = [
  //   { value: "smrpc", label: "Small RPC - Drone Pilot Training" },
  //   { value: "mdrpc", label: "Medium RPC - Drone Pilot Training" },
  //   {
  //     value: "ttt",
  //     label: "Train The Trainer (TTT) - Drone Instructor Pilot Training",
  //   },
  // ];
  const examTypeOptions = [
    { value: "flying_test", label: "Flying Test" },
    { value: "assessment", label: "Assessment" },
    { value: "exam", label: "Exam" },
  ];

  const handleInputChange = (e) => {
    setExamFormData((prevValues) => ({
      ...prevValues,
      othersubject: e.target.value,
    }));
  };


  const handleSubjectChange = (option) => {
    if(option.value == "1"){
      setShowOtherSubject(true);
    } else {
      setShowOtherSubject(false);
    }
    setExamFormData((prevValues) => ({
      ...prevValues,
      subject: option,
    }));
  };

  const handleExamTypeSelect = (option) => {
    setExamFormData((prevValues) => ({
      ...prevValues,
      type: option,
    }));
  };


  const openExamList = () => {
    navigate("/my-students?tab=exam");
  };

  const handleSelectCategory = (value) => {
    setExamFormData((prevData) => {
      const updatedValues = [...prevData.category];
      const index = updatedValues.indexOf(value);
  
      if (index === -1) {
        updatedValues.push(value);
      } else {
        updatedValues.splice(index, 1);
      }
      if(updatedValues.length > 0){
        getCourseDataAccCat(updatedValues);
      } else {
        setCourseListOptions([]);
        setBatchListOptions([]);
        setSubjectListOptions([]);
      }
      setShowOtherSubject(false);
      return {
        ...prevData,
        category: updatedValues,
        courseName: [],
        batch: [],
        subject: {},
        othersubject: "",
      };
    });
  };
  
  const handleSelectCourse = (value) => {
    setSelectedCourse((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        // Add selected course
        updatedValues.push(value);
      } else {
        // Remove course
        updatedValues.splice(index, 1);
      }
      setShowOtherSubject(false);
      setExamFormData((prevData) => ({
        ...prevData,
        courseName: updatedValues,
        batch: [],
        subject: {},
        othersubject: "",
      }));

      fetchBatchesForSelectedCourses(updatedValues);
      return updatedValues;
    });
  };

  const handleSelectBatch = (value) => {
    setSelectedBatch((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        // Add selected course
        updatedValues.push(value);
      } else {
        // Remove course
        updatedValues.splice(index, 1);
      }
      setExamFormData((prevData) => ({
        ...prevData,
        batch: updatedValues,
      }));
      return updatedValues;
    });
  };

  const handleDateChange = (date) => {
    setExamFormData((prevValues) => ({
      ...prevValues,
      examDate: date,
    }));
  };

  const handleTimeChange = (timeData, period) => {
    setExamFormData((prevData) => ({
      ...prevData,
      [period === "from" ? "fromTime" : "toTime"]: timeData,
    }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setExamFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };

  const getAllDataForm = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/teacher_exam.php?fun=getAllDataForm`,
      headers: {"Auth-Id": user.auth_id },
      data: {}
    }).then(function (response) {
      checkUserLogin(response);
      const responseData = response.data.data;
      if (response.data.data.status === "1") {
        setCategoryListOptions(responseData.categoryData);
      }
      setFilterStatus(true);
    })
    .catch(function (error) {
    });
  }

  const getCourseDataAccCat = async (category_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/teacher_exam.php?fun=getCourseDataAccCat`,
      headers: {"Auth-Id": user.auth_id },
      data: {"category_id" : category_id}
    }).then(function (response) {
      checkUserLogin(response);
      const responseData = response.data.data;
      if (response.data.data.status === "1") {
        setCourseListOptions(responseData.data);
      } else {
        setCourseListOptions([]);
      }
      setBatchListOptions([]);
      setSubjectListOptions([]);
    })
    .catch(function (error) {
    });
  }

  const fetchBatchesForSelectedCourses = async (course_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/teacher_exam.php?fun=fetchBatchesForSelectedCourses`,
      headers: {"Auth-Id": user.auth_id },
      data: {"course_id" : course_id}
    }).then(function (response) {
      checkUserLogin(response);
      const responseData = response.data.data;
      if (response.data.data.status === "1") {
        if(responseData.batch_data.length > 0){
          setBatchListOptions(responseData.batch_data);
        } else {
          setBatchListOptions([]);
        }
        if(responseData.subject_data.length > 0){
          setSubjectListOptions(responseData.subject_data);
        } else {
          setSubjectListOptions([]);
        }
      } else {
        setBatchListOptions([]);
        setSubjectListOptions([]);
      }
    })
    .catch(function (error) {
    });
  }

  

  const validateForm = () => {
    let isValid = true;
    let errorList = {};
    if (!examFormData.type) {
      isValid = false;
      errorList.exam_type = "Exam Type is required";
    } else {
      errorList.exam_type = "";
    }
    if (examFormData.category.length === 0) {
      isValid = false;
      errorList.category = "At least one category is required";
    } else {
      errorList.category = "";
    }
    if (examFormData.courseName.length === 0) {
      isValid = false;
      errorList.course = "At least one course is required";
    } else {
      errorList.course = "";
    }
    if (!examFormData.examDate) {
      isValid = false;
      errorList.exam_date = "Exam Date is required";
    } else {
      errorList.exam_date = "";
    }
    if (!examFormData.fromTime || !examFormData.toTime) {
      isValid = false;
      errorList.exam_time = "Both Start and End times are required";
    } else {
      errorList.exam_time = "";
    } 
    if (showOtherSubject && !examFormData.othersubject) {
      isValid = false;
      errorList.other_subject = "Other subject name is required.";
    } else {
      errorList.other_subject = "";
    }
    // if (!examFormData.status) {
    //   isValid = false;
    //   errorList.status = "Status selection is required";
    // }
    
    setErrorListMsg(errorList);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitLoader(true);
    const examInfo = {
      id:id!==undefined?id:0,
      exam_type:examFormData.type,
      category:examFormData.category,
      course:examFormData.courseName,
      batch:examFormData.batch,
      examDate:examFormData.examDate,
      fromTime:examFormData.fromTime,
      toTime:examFormData.toTime,
      subject:examFormData.subject,
      othersubject:examFormData.othersubject,
      status:examFormData.status
    };
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/teacher_exam.php?fun=postExamData`,
      headers: { "Auth-Id": user.auth_id },
      data: examInfo
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        toast.success(response.data.data.msg);
        setTimeout(() => {
          openExamList();
        }, 1000);
      } else {
        setErrorListMsg(response.data.data.errorList);
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };

  useEffect(() => {
    getAllDataForm();
  },[]);
  useEffect(() => {
    getExamDetails();
  }, [id]);
  const getExamDetails = async () => {
    if (id) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/teacher_exam.php?fun=getExamDetails`,
        headers: {"Auth-Id": user.auth_id },
        data: {"id":id}
      }).then(function (response) {
        checkUserLogin(response);
        let responseData = response.data.data;
        if(responseData.status == "1"){
          if (Array.isArray(responseData.courseList)) {
            setCourseListOptions(responseData.courseList);
          } else {
            setCourseListOptions([]);
          }
          if (Array.isArray(responseData.batchList)) {
            setBatchListOptions(responseData.batchList);
          } else {
            setBatchListOptions([]);
          }
          if (Array.isArray(responseData.subjectList)) {
            setSubjectListOptions(responseData.subjectList);
          } else {
            setSubjectListOptions([]);
          }
          if(responseData.data.subject.label === "Other"){
            setShowOtherSubject(true);
          }
          setExamFormData(responseData.data);
        }
        setPageLoadStatus(true);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
    }
  };

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  return (
    <>
      {(filterStatus || pageLoadStatus) && ((pageDeptAccess == "1" || pageDeptAccess == "3") || pageRoleAccess == "1") ? (
        <>
        <InnerHeader
          heading="Add Exams"
          txtSubHeading="Use this form to add a exams. Provide the subject details and any other relevant information."
          showButton={true}
          onClick={openExamList}
          iconText="View List"
        />      
        <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
          <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20">
          <div className="form-group-settings chapter-name cm-fr flx48">
              <label className="fc15 fw6 fs14 mb12 ls1">
                Exam Date
                <span className="fc4">*</span>
              </label>
              <DatePicker
                minDate={new Date()}
                dateFormat={customDateFormat}
                selected={examFormData.examDate ? moment(examFormData.examDate, "DD/MM/YYYY").toDate() : null}
                onChange={handleDateChange}
                placeholderText="Select exam date"
                showIcon
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable={true}
              />
              <p className="error-text">{errorListMsg.exam_date}</p>
            </div>
            <div className="form-group-settings chapter-name flx48">
              <TimePicker
                fromTime={examFormData.fromTime}
                toTime={examFormData.toTime}
                onTimeChange={handleTimeChange}
                compulsory={<span className="fc4">*</span>}
              />
              <p className="error-text">{errorListMsg.exam_time}</p>
            </div>
            <div className="form-group-settings batch-name cm-fr flx48">
              <SingleDropdown
                label="Exam Type"
                options={examTypeOptions}
                selectedOption={examFormData.type}
                onSelect={handleExamTypeSelect}
                search
                placeholder="Select Type"
                compulsory={<span className="fc4">*</span>}
              />
              <p className="error-text">{errorListMsg.exam_type}</p>
            </div>
            <div className="form-group-settings batch-name flx48 cm-fr searching-drop">
              <p className="fc15 fw6 fs14 ls1 mb8">Category<span className="fc4">*</span></p>
              <MultiDropdown
                label={`Category`}
                options={categoryListOptions}
                selectedValues={examFormData.category}
                onSelect={handleSelectCategory}
                searchable
                chips="3"
              />
              <p className="error-text">{errorListMsg.category}</p>
            </div>
            <div className="form-group-settings course-name flx48 cm-fr searching-drop">
              <p className="fc15 fw6 fs14 ls1 mb8">Course<span className="fc4">*</span></p>
              <MultiDropdown
                label={`Course`}
                options={courseListOptions}
                selectedValues={examFormData.courseName}
                onSelect={handleSelectCourse}
                searchable
                chips="3"
              />
              <p className="error-text">{errorListMsg.course}</p>
            </div>
            <div className="form-group-settings batch-name flx48 cm-fr searching-drop">
              <p className="fc15 fw6 fs14 ls1 mb8">Batch</p>
              <MultiDropdown
                label={`Batch`}
                options={batchListOptions}
                selectedValues={examFormData.batch}
                onSelect={handleSelectBatch}
                searchable
                chips="6"
              />
              <p className="error-text"></p>
            </div>
            <div className={`form-group-settings chapter-name ${showOtherSubject ? 'flx48' : 'flx100'} cm-fr`}>
              <SingleDropdown
                label="Subject"
                options={subjectListOptions}
                selectedOption={examFormData.subject}
                onSelect={handleSubjectChange}
                search
                allowCustom
              />
              <p className="error-text"></p>
            </div>
            {showOtherSubject ? (
              <div className="form-group-settings chapter-name flx48 cm-fr">
                <p className="fc15 fw6 fs14 ls1">
                  Other Subject Name<span className="fc4">*</span>
                </p>
                <input
                  type="text"
                  name="otherSubject"
                  placeholder="Enter other subject name"
                  autoComplete="off"
                  value={examFormData.othersubject}
                  onChange={handleInputChange}
                />
                <p className="error-text">{errorListMsg.other_subject}</p>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="radio-grp-status box-center fww mt24 mb12">
            <label htmlFor="approve" className="cp v-center mr16 fc13">
              <input
                type="radio"
                className="mr8 cp"
                id="approve"
                value="1"
                checked={examFormData.status === "1"}
                onChange={handleStatusChange}
              />
              Approve
            </label>
            <label htmlFor="draft" className="cp v-center mr16 fc6 ml24">
              <input
                type="radio"
                className="mr8 cp"
                id="draft"
                value="2"
                checked={examFormData.status === "2"}
                onChange={handleStatusChange}
              />
              Draft
            </label>
            <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
              <input
                type="radio"
                className="mr8 cp"
                id="reject"
                value="0"
                checked={examFormData.status === "0"}
                onChange={handleStatusChange}
              />
              Reject
            </label>
          </div>
          {Object.values(errorListMsg).length > 0 ? (
            <div className='error-text tac'>Please check required fields ({Object.values(errorListMsg).length} Error(s) found)</div>
          ) : (
              <div className='error-text tac'></div>
          )}
          <div className="add-more box-center mt24">
            {!submitLoader && <button
              type="button"
              className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
              onClick={handleSubmit}>
              {id !== undefined ? 'Update' : 'Submit'}
            </button>}
            {submitLoader && 
              <div className="box-center mb12">
                <SmallLoader className={"mb12"} />
              </div>
            }
          </div>
        </Card>
        <ToastContainer position="bottom-right" />
        </>
    ) : (
      <NoPermission displayMsg={"No permission to access this page"} />
    )}
    </>
  );
  
};

export default ExamForm;
