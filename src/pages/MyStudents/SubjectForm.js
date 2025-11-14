import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import PositionImageUpload from "../../components_two/PositionImageUpload";
import "./SubjectForm.css";
import TextEditor from "../../components_two/TextEdior";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { logout } from "../../store/authSlice.js";
import { useTitle } from "../../hooks/useTitle.js";
import NoPermission from "../../components/NoPermission.js";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import HtmlEditor from "../../components_two/HtmlEditor";
import { MdDelete } from "react-icons/md";
import { error } from "jodit/esm/core/helpers/index.js";
import SidePopup from "../../components/Popup/SidePopup.js";
import CourseHeader from "../../components_two/CourseMaterial/CourseHeader.js"
import ContentSection from "../../components_two/CourseMaterial/CourseContentSection.js"


const SubjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dataStatus, setDataStatus] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const isInitialRender = useRef(true);
  const [previewView, setPreviewView] = useState(false);
  const durationOption = [
    { label: "15 Min", value: "15" },
    { label: "30 Min", value: "30" },
    { label: "45 Min", value: "45" },
    { label: "1 Hour", value: "60" },
    { label: "1.5 Hour", value: "90" },
    { label: "2 Hour", value: "120" },
    { label: "2.5 Hour", value: "150" },
    { label: "3 Hour", value: "180" },
    { label: "3.5 Hour", value: "210" },
    { label: "4 Hour", value: "240" },
  ];

  const [subjectFormData, setSubjectFormData] = useState({
    id: Date.now() + "_new",
    category: "",
    courseName: "",
    subject: "",
    chapter: null,
    showAfter: "",
    subjectstatus: "2",
    courseMaterials: [
      {
        id: Date.now() + "_new",
        topic: "",
        position: 1,
        status: "1",
        duration: "",
        description: "",
        images: [],
        videos: [],
      },
    ],
  });
  const [subjectFormDataPreview, setSubjectFormDataPreview] = useState({
    "category": "",
    "courseName": "",
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

  const [categoryListOptions, setCategoryListOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [showAfterOptions, setshowAfterOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [sError, setSError] = useState({});
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const handleQuillChange = (value, index) => {
    const updatedMaterials = [...subjectFormData.courseMaterials];
    updatedMaterials[index].description = value;

    setSubjectFormData((prevValues) => ({
      ...prevValues,
      courseMaterials: updatedMaterials,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      topics: updatedMaterials,
    }));
  };

  const handleInputChange = (e, index, key) => {
    const { name, value } = e.target;
    const courseMaterialsUp = [...subjectFormData.courseMaterials];
    courseMaterialsUp[index][name] = value;

    setSubjectFormData((prevValues) => ({
      ...prevValues,
      courseMaterials: courseMaterialsUp,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      topics: courseMaterialsUp,
    }));
  };
  const handleDeleteTopic = (id) => {
    const updatedRecords = subjectFormData.courseMaterials.map((record) =>
      record.id === id ? { ...record, status: "0" } : record
    );
    setSubjectFormData({ ...subjectFormData, courseMaterials: updatedRecords });
    setSubjectFormDataPreview({ ...subjectFormData, topics: updatedRecords });
  };
  const handleDurationChange = (option, index) => {
    const courseMaterialsUp = [...subjectFormData.courseMaterials];
    courseMaterialsUp[index]["duration"] = option;
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      courseMaterials: courseMaterialsUp,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      topics: courseMaterialsUp,
    }));
  };

  const handleCourseNameSelect = (option) => {
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      courseName: option,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      courseName: option,
    }));
  };
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      subjectstatus: value,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      chapterstatus: value,
    }));
  };
  const handleCourseSubject = (option) => {
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      subject: option,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      subject: option,
    }));
  
    if (!isNaN(option.value)) {
      getallchapterList(option.value);
    }
    checkvalidationOnChange("subject",option.value);
  };
  
  const handleChapterChange = (option) => {
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      chapter: option,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      chapter: option,
    }));
    checkvalidationOnChange("chapter",option.value);
  };

  const handleShowAfter = (option) => {
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      showAfter: option,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      showAfter: option,
    }));
  };

  const handleCategorySelect = (option) => {
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      category: option,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      category: option,
    }));
  };
  function checkvalidationOnChange(field, value, index=0) {
    const errors = { ...sError };
    if(field=='subject' || field=='chapter'){
      if (!value) {
        errors[field] = "This field is required.";
      } else if (!/^\d+$/.test(value) && !/^[a-zA-Z]+$/.test(value)) {
        errors[field] = "Invalid Input";
      }else{
        delete errors[field];
      }
    }else if (field === 'topic') {
      if (!value) {
        errors[`topic${index}`] = "This field is required.";
      } /*else if (!/^[a-zA-Z0-9\-&\s]+$/.test(value)) {
        errors[`topic${index}`] = "Invalid topic.";
      }*/ else {
        delete errors[`topic${index}`]; 
      }
    }else if(field==='position'){
      if (!value) {
        errors[`position${index}`] = "This field is required.";
      } else if (!isFinite(value)) {
        errors[`position${index}`] = "Position must be a number";
      }else {
        delete errors[`position${index}`]; 
      }
    }else if(field==='duration'){
      if (!value?.value) {
        errors[`duration${index}`] = "This field is required.";
      }else{
        delete errors[`duration${index}`];
      }
    }else if(field==='description'){
      if (!value) {
        errors[`description${index}`] = "Description can't be empty";
      }else{
        delete errors[`description${index}`];
      }
    }/*else if(field==='images'){
      if (!value || value.length === 0) {
        errors[`images${index}`] = "At least one image must be provided";
      }else{
        delete errors[`images${index}`];
      }
    }*/
    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== "")
    );
    // Update state if there are any errors
    if (Object.keys(filteredErrors).length > 0) {
      setSError(filteredErrors);
    }else{
      setSError({});
    } 
  }
  
  function validateSubjectFormData() {
    // Initialize an object to hold error messages
    const errors = {};
    setSError({});

    // Validate required fields
    const requiredFields = [
      "subjectstatus",
      "category",
      "subject",
      "chapter",
      "showAfter",
    ];
    requiredFields.forEach((field) => {
      if (field === "subjectstatus") {
        // Check if subjectstatus is a number
        if (
          typeof subjectFormData[field] === "undefined" ||
          !isFinite(subjectFormData[field])
        ) {
          errors[field] = "This field must be a number.";
        }
      } else {
        // For other fields, check if they are empty
        if (
          !subjectFormData[field] &&
          field !== "showAfter" &&
          field !== "category"
        ) {
          errors[field] = "This field is required.";
        } else {
          // Additional regex validation for subject and chapter
          if (["subject", "chapter"].includes(field)) {
            if (!subjectFormData[field]?.value) {
              errors[field] = "This field is required.";
            } else if (
              !/^\d+$/.test(subjectFormData[field].value) &&
              !/^[a-zA-Z]+$/.test(subjectFormData[field].value)
            ) {
              errors[field] = "Invalid Input";
            }
          } else {
            if (subjectFormData[field]?.value) {
              if (!/^\d+$/.test(subjectFormData[field].value)) {
                errors[field] = "Invalid Input";
              }
            }
          }
        }
      }
    });

    // Validate course materials
    if (subjectFormData.courseMaterials) {
      subjectFormData.courseMaterials.forEach((material, index) => {
        // Validate Topic
        if (!material.topic) {
          errors[`topic${index}`] = "This field is required.";
        } /*else if (!/^[a-zA-Z0-9\-&\s]+$/.test(material.topic)) {
          errors[`topic${index}`] = "Invalid topic";
        }*/

        // Validate Description
        if (!material.description) {
          errors[`description${index}`] = "Description can't be empty";
        }

        // Validate Position
        if (!material.position) {
          errors[`position${index}`] = "This field is required.";
        } else if (!isFinite(material.position)) {
          errors[`position${index}`] = "Position must be a number";
        }

        // Validate Position
        if (!material["duration"].value) {
          errors[`duration${index}`] = "This field is required.";
        }

        // Validate Images and Videos
        // if (!material.images || material.images.length === 0) {
        //   errors[`images${index}`] = "At least one image must be provided";
        // }
      });
    } else {
      errors.coursematerial = "Course materials are missing.";
    }
    if (Object.keys(errors).length > 0) {
      setSError(errors);
      return false;
    }
    return true;
  }
  function getallchapterList(subjectid){
    axios({
      method: "post",
      url: `${constant.base_url}/admin/subject_topic_detail.php?fun=getallchaterlist`,
      headers: { "Auth-Id": user.auth_id },
      data: { subid: subjectid },
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
         setChapterOptions([...JSON.parse(response.data.data.chapterlist)]);
         handleCategorySelect(response.data.data.category_select);
      } else {
        if (response.data.data.error !== undefined) {
          setSError(response.data.data.error);
        }
      }
      setSubmitLoader(false);
    }).catch(function (error) {
      console.error("Error during login:", error);
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateSubjectFormData()) {
      //setSubmitLoader(true);
      axios({
        method: "post",
        url: `${constant.base_url}/admin/subject_topic_detail.php?fun=postsubject`,
        headers: { "Auth-Id": user.auth_id },
        data: { subjectformdata: subjectFormData },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1") {
            navigate("/course-material");
          } else {
            if (response.data.data.error !== undefined) {
              setSError(response.data.data.error);
            }
          }
          setSubmitLoader(false);
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    }
    else{
        toast.error(`Invalid Form Data Please Check`);
    }
  };
  const getExistinngTopic = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/subject_topic_detail.php?fun=getsubjecttopic`,
      headers: { "Auth-Id": user.auth_id },
      data: { subjectformdata: subjectFormData },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          let updatesubjectmaterial = subjectFormData.courseMaterials = [...JSON.parse(response.data.data.data)]
          setSubjectFormData((prevValues) => ({
            ...prevValues,
            courseMaterials: [...JSON.parse(response.data.data.data)],
          }));
          setSubjectFormDataPreview((prevValues) => ({
            ...prevValues,
            topics: [...JSON.parse(response.data.data.data)],
          }));
          handleShowAfter(response.data.data.chater_show_after);
          handleCategorySelect(response.data.data.category_select);
          validateSubjectFormData(updatesubjectmaterial);
        } else {
          setSubjectFormData((prevValues) => ({
            ...prevValues,
            courseMaterials: [...JSON.parse(response.data.data.data)],
          }));
          setSubjectFormDataPreview((prevValues) => ({
            ...prevValues,
            topics: [...JSON.parse(response.data.data.data)],
          }));
          setSubjectFormData((prevValues) => ({
            ...prevValues,
            showAfter: "",
          }));
          setSubjectFormDataPreview((prevValues) => ({
            ...prevValues,
            showAfter: "",
          }));
        }
        setSubmitLoader(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getExistinngTopicBYID = async () => {
    if (id > 0 && id != undefined) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/subject_topic_detail.php?fun=getsubjecttopic`,
        headers: { "Auth-Id": user.auth_id },
        data: { id: id },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1") {
            setSubjectFormData((prevValues) => ({
              ...prevValues,
              courseMaterials: [...JSON.parse(response.data.data.data)],
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              topics: [...JSON.parse(response.data.data.data)],
            }));
            setChapterOptions(response.data.data.all_chapter_list);
            setshowAfterOptions(response.data.data.all_chapter_list);
            handleShowAfter(response.data.data.chater_show_after);
            handleCategorySelect(response.data.data.category_select);
            setSubjectFormData((prevValues) => ({
              ...prevValues,
              subject: response.data.data.subject_select,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              subject: response.data.data.subject_select,
            }));
            handleChapterChange(response.data.data.chapter_select);
            setSubjectFormData((prevValues) => ({
              ...prevValues,
              subjectstatus: response.data.data.chapter_status,
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              subjectstatus: response.data.data.chapter_status,
            }));
          } else {
            openCourseMaterialListPage();
            setSubjectFormData((prevValues) => ({
              ...prevValues,
              courseMaterials: [...JSON.parse(response.data.data.data)],
            }));
            setSubjectFormDataPreview((prevValues) => ({
              ...prevValues,
              topics: [...JSON.parse(response.data.data.data)],
            }));
          }
          setSubmitLoader(false);
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    }
  };
  useEffect(() => {
    if (id !== undefined) {
      getExistinngTopicBYID();
    }
  }, [id]);
  const handleUploadImageVideo = (id, content, mediaType, index) => {
    const updatedMaterials = [...subjectFormData.courseMaterials];
    if (mediaType === "image") {
      updatedMaterials[index].images = content;
    } else if (mediaType === "video") {
      updatedMaterials[index].videos = content;
    } else {
      alert("Invalid media type");
    }
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      courseMaterials: updatedMaterials,
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      topics: updatedMaterials,
    }));
  };
  const addMoreMaterial = () => {
    setSubjectFormData((prevValues) => ({
      ...prevValues,
      courseMaterials: [
        ...prevValues.courseMaterials,
        {
          id: Date.now() + "_new",
          topic: "",
          status: "1",
          position: subjectFormData.courseMaterials.length + 1,
          duration: "",
          description: "",
          images: [],
          videos: [],
        },
      ],
    }));
    setSubjectFormDataPreview((prevValues) => ({
      ...prevValues,
      topics: [
        ...prevValues.topics,
        {
          id: Date.now() + "_new",
          topic: "",
          status: "1",
          position: subjectFormData.courseMaterials.length + 1,
          duration: "",
          description: "",
          images: [],
          videos: [],
        },
      ],
    }));
  };
  const openCourseMaterialListPage = () => {
    navigate("/course-material");
  };
  useEffect(() => {
    getSubjectRecord();
  }, []);
  const getSubjectRecord = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/subject_topic_detail.php?fun=getsubject`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        id: id,
      },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setDataStatus(true);
        } else {
        }
        setCategoryListOptions([
          ...JSON.parse(response.data.data.categorylist),
        ]);
        setSubjectOptions([...JSON.parse(response.data.data.subjectlist)]);
        if (id === undefined) {
          setChapterOptions([...JSON.parse(response.data.data.chapterlist)]);
          setshowAfterOptions([...JSON.parse(response.data.data.chapterlist)]);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  useEffect(() => {
  }, [subjectFormData]);
  {/*useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // Set it to false after the first render
      return; // Skip validation on initial render
    }

    validateSubjectFormData(); // Call your validation function on updates
  }, [subjectFormData]);*/}
  useEffect(() => {
    if (
      subjectFormData["chapter"]?.value &&
      subjectFormData["subject"]?.value
    ) {
      getExistinngTopic();
      //validateSubjectFormData();
    }
  }, [subjectFormData["chapter"]?.value, subjectFormData["subject"]?.value]);
  
  let displayIndex = 1;
  return (
    <>
      <InnerHeader
        heading="Add Chapter Material"
        txtSubHeading="Use this form to add a new Chapter. Provide the Chapter details and any other relevant information."
        showButton={true}
        onClick={openCourseMaterialListPage}
        iconText="View List"
      />
      <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
        <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20 course-grp-container">
          <div className="form-group-settings batch-name flx48">
            <SingleDropdown
              label="Category"
              options={categoryListOptions}
              selectedOption={subjectFormData.category}
              onSelect={handleCategorySelect}
              search
            />
            {/* <p className="error-text">{"This field is Required"}</p> */}
            {<p className="error-text">{sError.category}</p>}
          </div>
          <div className="form-group-settings chapter-name flx48">
            <SingleDropdown
              label="Subject"
              options={subjectOptions}
              selectedOption={subjectFormData.subject}
              onSelect={handleCourseSubject}
              search
              allowCustom
              isReadOnly={id!==undefined}
              compulsory={<span className="fc4">*</span>}
            />
            {<p className="error-text">{sError.subject}</p>}
          </div>
          <div className="form-group-settings chapter-name flx48">
            <SingleDropdown
              label="Chapter"
              options={chapterOptions}
              selectedOption={subjectFormData.chapter}
              onSelect={handleChapterChange}
              search
              allowCustom
              isReadOnly={id!==undefined}
              compulsory={<span className="fc4">*</span>}
            />
            {<p className="error-text">{sError.chapter}</p>}
          </div>
        </div>
        {subjectFormData.courseMaterials.map((material, index) => {
          if (material.status !== "0") {
            let currentDisplayIndex = displayIndex; // Capture the current index
            displayIndex++;
            return (
              <>  
                <div
                  key={material.id}
                  className="course-materials-grp w100 box-sd1 bg8 pl20 pr20 pt20 pb20"
                >
                  <div className="v-center jcsb">
                    <div className="form-group-settings batch-name flx66">
                      <p className="fc15 fw6 fs14 ls1">
                        Topic {currentDisplayIndex}
                        <span className="fc4">*</span>
                      </p>
                      <input
                        type="text"
                        name="topic"
                        placeholder="Enter Topic"
                        autoComplete="off"
                        onChange={(e) =>{handleInputChange(e, index);checkvalidationOnChange("topic",material.topic,index)}}
                        value={material.topic}
                      />
                      {<p className="error-text">{sError[`topic${index}`]}</p>}
                    </div>
                    <div className="form-group-settings batch-name flx1 v-center ml16">
                    <div>
                        <SingleDropdown
                          label="Duration"
                          options={durationOption}
                          selectedOption={material.duration}
                          onSelect={(e) => {handleDurationChange(e, index);checkvalidationOnChange("duration",material.duration,index)}}
                          search
                          compulsory={<span className="fc4">*</span>}
                        />
                        {
                          <p className="error-text">
                            {sError[`duration${index}`]}
                          </p>
                        }
                      </div>
                      <div className="topic-pos ml16">
                        <p className="fc15 fw6 fs14 ls1">
                          Position<span className="fc4">*</span>
                        </p>
                        <input
                          type="number"
                          name="position"
                          placeholder="Enter position"
                          autoComplete="off"
                          onChange={(e) => {handleInputChange(e, index);checkvalidationOnChange("position",material.position,index)}}
                          value={material.position}
                        />
                        {
                          <p className="error-text">
                            {sError[`position${index}`]}
                          </p>
                        }
                      </div>
                      
                    </div>
                  </div>
                  <div className="form-group-settings chapter-name flx100">
                    <p className="fc15 fw6 fs14 ls1 mb8">
                      Description <span className="fc4">*</span>
                    </p>
                    <div className="jodit-editor">
                      <HtmlEditor
                        onChange={(value) => {handleQuillChange(value, index);checkvalidationOnChange("description",material.description,index)}}
                        descValue={material.description}
                      />
                      {
                        <p className="error-text">
                          {sError[`description${index}`]}
                        </p>
                      }
                    </div>
                  </div>
                  <div className="form-group-settings chapter-name flx100 pos-img">
                    <p className="fc15 fw6 fs14 ls1 mb8">
                      Upload Images 
                    </p>
                    <PositionImageUpload
                      id={`image-${index}`}
                      setWorkImages={(id, content) =>
                        {handleUploadImageVideo(id, content, "image", index)}
                      }
                      mediaType="image"
                      allimages={material.images}
                      toast={toast}
                    />
                    {
                      <p className="blink-text-normal-error">
                        {sError[`images${index}`]}
                      </p>
                    }
                  </div>
                  {/*<div className="form-group-settings chapter-name flx100">
                    <p className="fc15 fw6 fs14 ls1 mb8">
                       Upload Video
                    </p>
                    <PositionImageUpload
                      id={`video-${index}`}
                      setWorkImages={(id, content) =>
                        handleUploadImageVideo(id, content, "video", index)
                      }
                      allimages={material.videos}
                      mediaType="video"
                      toast={toast}
                    />
                    </div>*/}
                  {subjectFormData.courseMaterials.filter(
                    (r) => r.status === "1"
                  ).length > 1 && (
                    <div className="df jce mb12 w100">
                      <button
                        className="df jce aic p8 brd1 br4 fc9 cp"
                        onClick={() => handleDeleteTopic(material.id)}
                      >
                        <MdDelete className="fs20 cp fc9" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
            
          }
         
          return null; // Return null for materials that don't match the status
        })}
        <div className="df jce w100 mt24">
          <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
            onClick={addMoreMaterial}
          >
            Add More
          </button>
        </div>

        <div className="form-group-settings course-name flx100 bg8 pl20 pr20 pt20 pb20 course-grp-container">
          <SingleDropdown
            label="Show After"
            options={showAfterOptions}
            selectedOption={subjectFormData.showAfter}
            onSelect={handleShowAfter}
            search
          />
          {<p className="error-text">{sError.showAfter}</p>}
        </div>
        <div className="fixed-buttons ">
        <div className="radio-grp-status box-center fww mt16 ">
          <label htmlFor="approve" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="approve"
              value="1"
              checked={subjectFormData.subjectstatus === "1"}
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
              checked={subjectFormData.subjectstatus === "2"}
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
              checked={subjectFormData.subjectstatus === "0"}
              onChange={handleStatusChange}
            />
            Reject
          </label>
        </div>
        
        <div className="add-more box-center mt16">
           <button
            type="button"
            className="fc1 bg5 br24 fs14 cp pr24 pt10 pb10 ls2"
            onClick={() => {
              setPreviewView(true);
            }}
          >
            Preview
          </button>
          {!submitLoader && (
            <button
              type="button"
              className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
          {submitLoader && (
            <div className="box-center mb12">
              <SmallLoader className={"mb12"} />
            </div>
          )}
        </div>
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
            <div className="pt8 pb8 pl16 pr16 w100">
              <CourseHeader details={subjectFormDataPreview} />

              <ContentSection sections={subjectFormDataPreview.topics} />
            </div>
          </SidePopup>
        )}
      </Card>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default SubjectForm;
