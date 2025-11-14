import React, { useState, useEffect, useCallback } from "react";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import SingleDropdown from "../../components/SingleDropdown";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import MultiDropdown from "../../components/MultiDropdown";
import { FaStar } from "react-icons/fa";
import MultiImageUpload from "../../components/MultiImageUpload";
import { MdDelete } from "react-icons/md";

import axios from "axios";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import { every } from "lodash";
import TextEditor from "../../components/TextEdior.js";
import { useTitle } from "../../hooks/useTitle.js";
import NoPermission from "../../components/NoPermission.js";
import HtmlEditor from "../../components/HtmlEditor.js";

const ReviewDetail = () => {
  useTitle("Review Detail - Flapone Aviation");

  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);

  const [userType, setUserType] = useState({});
  const [student, setStudent] = useState("");
  const [status, setStatus] = useState("");
  const [homeCheckbox, setHomeCheckbox] = useState(false);
  const [imagePosition, setImagePosition] = useState("");
  const [imageList, setImageList] = useState([]);
  const [review, setReview] = useState(["course", "center"]);
  const [defeultUserType, setdefeultUserType] = useState({
    label: "Inhouse",
    value: "Inhouse",
  });
  const [reviewExtra, setReviewExtra] = useState([]);
  const [imageReviewPosition, setImageReviewPosition] = useState("");
  const [imageReviewUrl, setImageReviewUrl] = useState("");
  const [selectedOptionReviewImage, setSelectedOptionReviewImage] =
    useState("byUploadImage");
  const [selectedOptionVideo, setSelectedOptionVideo] = useState("byUrlVideo");

  const [sections, setSections] = useState([]);
  const [content, setContent] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [reviewPosition, setReviewPosition] = useState("");
  const [inhouseName, setInhouseName] = useState("");
  const [videoPosition, setVideoPosition] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [instList, setInsList] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [displayMsg, setDisplayMsg] = useState("");
  const [dataStatus, setDataStatus] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [detailRecord, setDetailRecord] = useState({
    rating: "0",
    review_title: "",
    user_type: { label: "Inhouse", value: "inhouse" },
    review_description: "",
    video: [],
    images: [],
    status: "2",
    review_type: [],
    selected_public_user: {},
    select_course: [],
    select_instructor: [],
    selected_center: [],
    display_name: "",
  });
  const navigate = useNavigate();
  const userTypeOptions = [
    { value: "", label: "Select User Type" },
    { value: "inhouse", label: "Inhouse" },
    { value: "public", label: "Public" },
  ];
  const handleStarClick = (starIndex) => {
    const updatedRecord = { ...detailRecord, rating: starIndex + 1 };
    setDetailRecord(updatedRecord);
  };
  const handleupdateTitle = (value) => {
    const updatedRecord = { ...detailRecord, review_title: value };
    setDetailRecord(updatedRecord);
  };
  const handleUserTypeSelect = (option) => {
    const updatedRecord = { ...detailRecord, user_type: option };
    setDetailRecord(updatedRecord);
  };
  const handleRadioSubBlogImageChange = (e) => {
    setSelectedOptionReviewImage(e.target.value);
  };

  const handleStatusChange = (e) => {
    const updatedRecord = { ...detailRecord, status: e.target.value };
    setDetailRecord(updatedRecord);
  };

  const handleSelectReviewFor = (value) => {
    const index = detailRecord.review_type.indexOf(value);
    if (index === -1) {
      setDetailRecord((prevState) => ({
        ...prevState,
        review_type: [...prevState.review_type, value],
      }));
    } else {
      const updatedValues = [...detailRecord.review_type];
      updatedValues.splice(index, 1);
      setDetailRecord((prevState) => ({
        ...prevState,
        review_type: updatedValues,
      }));
    }
  };
  function getOptions(item) {
    switch (item) {
      case "instructor":
        return instList;
      case "course":
        return courseList;
      case "center":
        return centerList;
      default:
        return [];
    }
  }
  function selectOptions(item) {
    switch (item) {
      case "instructor":
        return detailRecord.select_instructor;
        break;
      case "course":
        return detailRecord.select_course;
        break;
      case "center":
        return detailRecord.selected_center;
        break;
      default:
        return [];
        break;
    }
  }
  const handleReviewExtraChange = (value, field) => {
    switch (field) {
      case "instructor":
        const index = detailRecord.select_instructor.indexOf(value);
        if (index === -1) {
          setDetailRecord((prevData) => ({
            ...prevData,
            select_instructor: [...prevData.select_instructor, value],
          }));
        } else {
          detailRecord.select_instructor.splice(index, 1);
          setDetailRecord(detailRecord);
        }
        break;
      case "course":
        const index1 = detailRecord.select_course.indexOf(value);
        if (index1 === -1) {
          setDetailRecord((prevData) => ({
            ...prevData,
            select_course: [...prevData.select_course, value],
          }));
        } else {
          detailRecord.select_course.splice(index1, 1);
          setDetailRecord(detailRecord);
        }
        break;
      case "center":
        const index2 = detailRecord.selected_center.indexOf(value);
        if (index2 === -1) {
          setDetailRecord((prevData) => ({
            ...prevData,
            selected_center: [...prevData.selected_center, value],
          }));
        } else {
          detailRecord.selected_center.splice(index2, 1);
          setDetailRecord(detailRecord);
        }
        break;
      default:
        break;
    }
  };
  const toggleCodeView = useCallback(() => {
    setShowCode((prevShowCode) => !prevShowCode);
  }, [setShowCode]);

  const handleQuillChange = (value) => {
    setContent(value);
  };

  const openCategoryListPage = () => {
    navigate("/review-list");
  };
  const [studentName, setStudentName] = useState([]);
  const handleCheckboxChange = (event) => {
    const updatedRecord = {
      ...detailRecord,
      at_home_display: event.target.checked ? 1 : 0,
    };
    setDetailRecord(updatedRecord);
  };
  const handleReviewPosition = (value) => {
    const updatedRecord = { ...detailRecord, orderby: value };
    setDetailRecord(updatedRecord);
  };
  const handleStudentSelect = (option) => {
    const updatedRecord = { ...detailRecord, selected_public_user: option };
    setDetailRecord(updatedRecord);
  };
  const handleRadioVideoChange = (e) => {
    setSelectedOptionVideo(e.target.value);
  };
  const handleupdateinhouse = (value) => {
    const updatedRecord = { ...detailRecord, display_name: value };
    setDetailRecord(updatedRecord);
  };
  const handleSetWorkImages = (id, images) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, images } : section
      )
    );
  };
  const handleAddVideo = () => {
    if (videoUrl && videoPosition) {
      const isDuplicate = detailRecord.video.some(
        (video) => video.url === videoUrl
      );

      if (isDuplicate) {
        toast.warn("Video with URL already exists");
        return;
      }

      const newVideo = {
        id: Date.now() + "_new",
        url: videoUrl,
        position: videoPosition,
        status: "1",
      };

      setVideoList([...videoList, newVideo]);
      setDetailRecord((prevData) => ({
        ...prevData,
        video: [...prevData.video, newVideo],
      }));
      setVideoUrl("");
      setVideoPosition("");
    } else {
      toast.warn("Video and position required.");
      return;
    }
  };
  const handleEditVideoUrl = (id, newUrl) => {
    const updatedVideoList = videoList.map((video) => {
      if (video.id === id) {
        return { ...video, url: newUrl };
      }
      return video;
    });

    setVideoList(updatedVideoList);
    setDetailRecord((prevData) => ({
      ...prevData,
      video: updatedVideoList,
    }));
  };
  const handleEditVideoPosition = (id, newPosition) => {
    const updatedVideoList = videoList.map((video) => {
      if (video.id === id) {
        return { ...video, position: parseInt(newPosition ? newPosition : 1) };
      }
      return video;
    });
    setVideoList(updatedVideoList);
    setDetailRecord((prevData) => ({
      ...prevData,
      video: updatedVideoList,
    }));
  };
  const handleDeleteVideo = (id) => {
    const updatedList = videoList.map((video) => {
      if (video.id === id) {
        return { ...video, status: "0" };
      }
      return video;
    });
    setVideoList(updatedList);
    setDetailRecord((prevData) => ({
      ...prevData,
      video: updatedList,
    }));
  };
  const handleAddImage = () => {
    if (imageReviewUrl && imageReviewPosition) {
      const isDuplicate = detailRecord.images.some(
        (image) => image.url === imageReviewUrl
      );

      if (isDuplicate) {
        toast.warn("Image with URL already exists");
        return;
      }

      const newImage = {
        id: Date.now() + "_new",
        url: imageReviewUrl,
        position: imageReviewPosition,
        status: "1",
      };

      setImageList([...imageList, newImage]);

      setDetailRecord((prevData) => ({
        ...prevData,
        images: [...prevData.images, newImage],
      }));

      setImageReviewUrl("");
      setImageReviewPosition("");
    } else {
      toast.warn("Image and position required");
      return;
    }
  };

  const handleEditImageUrl = (id, newUrl) => {
    // Check if newUrl already exists in imageList
    const isDuplicate = imageList.some((image) => image.url === newUrl);
    if (isDuplicate) {
      toast.warn("URL already exists");
      return;
    }

    // Update imageList with new URL
    const updatedList = imageList.map((image) =>
      image.id === id ? { ...image, url: newUrl } : image
    );
    setImageList(updatedList);
    // Update blogDetailData with updated imageList
    setDetailRecord((prevData) => ({
      ...prevData,
      images: updatedList,
    }));
  };
  const handleEditImagePosition = (id, newPosition) => {
    const updatedList = imageList.map((image) => {
      if (image.id === id) {
        return { ...image, position: parseInt(newPosition ? newPosition : 1) };
      }
      return image;
    });
    setImageList(updatedList);
    setDetailRecord((prevData) => ({
      ...prevData,
      images: updatedList,
    }));
  };
  const handleDeleteImage = (id) => {
    const updatedList = imageList.map((image) => {
      if (image.id === id) {
        return { ...image, status: "0" };
      }
      return image;
    });

    setImageList(updatedList);
    setDetailRecord((prevData) => ({
      ...prevData,
      images: updatedList,
    }));
  };
  useEffect(() => {
    getallfilter();
  }, []);
  const getallfilter = async () => {
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/review_detail.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        id: id,
      },
    })
      .then(function (response) {
        if (response.data.data.status === "1") {
          setStudentName(response.data.data.data.alluser);
          setCenterList(response.data.data.data.location);
          setCourseList(response.data.data.data.allcourse);
          setInsList(response.data.data.data.instructor);
          getReviewDetail();
        } else {
          setDisplayMsg(response.data.data);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getReviewDetail = async () => {
    setDisplayMsg("");
    if (id) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/review_detail.php?fun=getreviewdetail`,
        headers: { "Auth-Id": user.auth_id },
        data: {
          id: id,
        },
      })
        .then(function (response) {
          if (response.data.data.status === "1") {
            let ddata = response.data.data.data;
            handleQuillChange(ddata.review_description);
            setDetailRecord(ddata);

            //designSourceButton();
            setDataStatus(true);
          } else {
            setDisplayMsg(response.data.data);
          }
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    }
  };
  const validateForm = () => {
    if (parseInt(detailRecord.rating) <= 0) {
      toast.warn("Rating is required.");
      return false;
    } else if (!content) {
      toast.warn("Description is required.");
      return false;
    } else if (!detailRecord.user_type || !detailRecord.user_type.value) {
      toast.warn("User Type is required.");
      return false;
    } else if (
      detailRecord.user_type.value === "public" &&
      !detailRecord.selected_public_user
    ) {
      toast.warn("name is required.");
      return false;
    } else if (
      detailRecord.user_type.value === "inhouse" &&
      !detailRecord.display_name
    ) {
      toast.warn("name is required.");
      return false;
    } else {
      return true;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    //setSubmitLoader(true);
    detailRecord.review_description = content;
    const articleData = detailRecord;

    axios({
      method: "post",
      url: `${constant.base_url}/admin/review_detail.php?fun=postreviewdata`,
      headers: { "Auth-Id": user.auth_id },
      data: articleData,
    })
      .then(function (response) {
        if (response.data.data.status === "0") {
          toast.error(response.data.data.msg);
        } else {
          toast.success(response.data.data.msg);
          navigate("/review-list");
        }
        setSubmitLoader(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  return (
    <>
      {(pageRoleAccess || pageContentAccessDept) &&
        (dataStatus || id === undefined) && (
          <>
            <InnerHeader
              heading={`${id !== undefined ? "Edit" : "Add"} Review`}
              txtSubHeading={`${id ? `Edit the details of an existing review here. Update the reviewer's name, rating, comments, and other relevant details.` : `Use this form to add a new review. Provide the reviewer's name, rating, comments, and any other relevant details.`}`}
              showButton={true}
              onClick={openCategoryListPage}
              iconText="View Reviews"
            />
            <Card className="card bg5 mt16 pl8 pr20 pt20 pb10 content-iagent-container">
              <div className="blog-main-grp-inputs bg8 pl20 pr20 pt20 pb10 mb24 box-sd1">
                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1">
                    Ratings<span className="fc4">*</span>
                  </p>
                  <div className="mt8">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`fs24 mr8 cp ${index < detailRecord.rating ? "fc12" : "fc17"}`}
                        onClick={() => handleStarClick(index)}
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group-settings title">
                  <p className="fc15 fw6 fs14 ls1">Review Title</p>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter Title"
                    autoComplete="off"
                    value={detailRecord.review_title}
                    onChange={(e) => handleupdateTitle(e.target.value)}
                  />
                </div>
                {/* <div className="mb24 editor">
            <p className="fc15 fw6 fs14 ls1 mb12">Review Description<span className="fc4">*</span> </p>
            <div className="editor-controls"> 
            <TextEditor
                initialValue={content}
                onChange={handleQuillChange}
                editorIndex={"descrr"}
              />
            </div>
          </div> */}
                <div className="form-group-settings chapter-name flx100">
                  <p className="fc15 fw6 fs14 ls1 mb8">
                    Review Description <span className="fc4">*</span>
                  </p>
                  <div className="jodit-editor">
                    <HtmlEditor
                      descValue={content}
                      onChange={(value) => handleQuillChange(value)}
                    />
                  </div>
                </div>
                <div className="form-group-settings user-type">
                  <SingleDropdown
                    label="User Type"
                    compulsory={<span className="fc4">*</span>}
                    options={userTypeOptions}
                    selectedOption={detailRecord.user_type}
                    onSelect={handleUserTypeSelect}
                    isReadOnly={1}
                  />
                </div>
                {detailRecord.user_type.value === "inhouse" && (
                  <div className="form-group-settings name">
                    <p className="fc15 fw6 fs14 ls1">Name</p>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter Name"
                      autoComplete="off"
                      value={
                        detailRecord.display_name
                          ? detailRecord.display_name
                          : user.user_name
                      }
                      onChange={(e) => handleupdateinhouse(e.target.value)}
                    />
                  </div>
                )}
                {detailRecord.user_type.value === "public" && (
                  <div className="mt24 form-group flx100">
                    <SingleDropdown
                      label="Name"
                      compulsory={<span className="fc4">*</span>}
                      options={studentName}
                      selectedOption={detailRecord.selected_public_user}
                      onSelect={handleStudentSelect}
                      search
                      isReadOnly={id !== undefined}
                    />
                  </div>
                )}
                <div className="sub-blog-images mt24">
                  <p className="fc15 fw6 fs14 ls1">Image</p>
                  <div className="df mt12 mb30 cover-image-radio">
                    <label htmlFor="byUrlImage" className="cp v-center">
                      <input
                        type="radio"
                        className="mr8 cp"
                        id="byUrlImage"
                        value="byUrlImage"
                        checked={selectedOptionReviewImage === "byUrlImage"}
                        onChange={handleRadioSubBlogImageChange}
                      />
                      By URL
                    </label>
                    <label
                      htmlFor="byUploadImage"
                      className="cp v-center mr16 ml24"
                    >
                      <input
                        type="radio"
                        className="mr8 cp"
                        id="byUploadImage"
                        value="byUploadImage"
                        checked={selectedOptionReviewImage === "byUploadImage"}
                        onChange={handleRadioSubBlogImageChange}
                      />
                      Upload
                    </label>
                  </div>
                  <div className="form-group-settings cover-img-sec mt16">
                    {selectedOptionReviewImage === "byUrlImage" ? (
                      <>
                        <div className="v-center jcsb">
                          <div className="img-urls mr16">
                            <p className="fc15 fw6 fs14 ls1">Image URL</p>
                            <input
                              type="text"
                              id="url"
                              name="url"
                              placeholder="Enter image url"
                              value={imageReviewUrl}
                              onChange={(e) =>
                                setImageReviewUrl(e.target.value)
                              }
                              autoComplete="off"
                            />
                          </div>
                          <div className="img-pos flx1">
                            <p className="fc15 fw6 fs14 ls1">Position</p>
                            <input
                              type="number"
                              id="position"
                              name="position"
                              placeholder="Position"
                              value={imageReviewPosition}
                              onChange={(e) =>
                                setImageReviewPosition(e.target.value)
                              }
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="df jce">
                          <button
                            className="h36 pt8 pb8 pl16 pr16 mt16 cp bg1 fc3 br4"
                            onClick={handleAddImage}
                          >
                            Add
                          </button>
                        </div>
                        <div className="image-list mt16 mb24">
                          {detailRecord.images.map(
                            (image, index) =>
                              image.status === "1" && (
                                <div
                                  className="v-center jcsb listing-img-url"
                                  key={image.id}
                                >
                                  <div className="img-urls mr16">
                                    <input
                                      type="text"
                                      id={`url_${image.id}`}
                                      name={`url_${image.id}`}
                                      placeholder="Enter Image URL"
                                      value={image.url}
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleEditImageUrl(
                                          image.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="img-pos-list">
                                    <input
                                      type="number"
                                      id={`position_${image.id}`}
                                      name={`position_${image.id}`}
                                      min={1}
                                      placeholder="Position"
                                      value={image.position}
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleEditImagePosition(
                                          image.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div
                                    className="fc4 cp flx1 box-center fs24 mt8"
                                    onClick={() => handleDeleteImage(image.id)}
                                  >
                                    <MdDelete />
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </>
                    ) : (
                      <MultiImageUpload
                        id="upload1"
                        setWorkImages={handleSetWorkImages}
                        setBlogDetailData={setDetailRecord}
                        blogDetailData={detailRecord}
                        setImageList={setImageList}
                      />
                    )}
                  </div>
                  <div className="video-image mt24">
                    <p className="fc15 fw6 fs14 ls1">Video</p>
                    <div className="df mt12 mb30 cover-image-radio">
                      <label htmlFor="byUrlVideo" className="cp v-center">
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="byUrlVideo"
                          value="byUrlVideo"
                          checked={selectedOptionVideo === "byUrlVideo"}
                          onChange={handleRadioVideoChange}
                        />
                        By URL
                      </label>
                      {/* <label htmlFor="uploadVideo" className="cp v-center mr16 ml24">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="uploadVideo"
                    value="uploadVideo"
                    checked={selectedOptionVideo === "uploadVideo"}
                    onChange={handleRadioVideoChange}
                  />
                  Upload
                </label> */}
                    </div>
                    <div className="form-group-settings cover-img-sec mt16">
                      {selectedOptionVideo === "byUrlVideo" ? (
                        <>
                          <div className="v-center jcsb">
                            <div className="img-urls mr16">
                              <p className="fc15 fw6 fs14 ls1">Video URL</p>
                              <input
                                type="text"
                                id="vurl"
                                name="vurl"
                                placeholder="Enter video url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                            <div className="img-pos flx1">
                              <p className="fc15 fw6 fs14 ls1">Position</p>
                              <input
                                type="number"
                                id="vposition"
                                name="vposition"
                                placeholder="Position"
                                value={videoPosition}
                                onChange={(e) =>
                                  setVideoPosition(e.target.value)
                                }
                                autoComplete="off"
                              />
                            </div>
                          </div>
                          <div className="df jce">
                            <button
                              className="h36 pt8 pb8 pl16 pr16 mt16 cp bg1 fc3 br4"
                              onClick={handleAddVideo}
                            >
                              Add
                            </button>
                          </div>
                          <div className="image-list mt16 mb24">
                            {detailRecord.video.map(
                              (video, index) =>
                                video.status === "1" && (
                                  <div
                                    className="v-center jcsb listing-img-url"
                                    key={video.id}
                                  >
                                    <div className="img-urls mr16">
                                      <input
                                        type="text"
                                        id={`url_${video.id}`}
                                        name={`url_${video.id}`}
                                        placeholder="Enter Image URL"
                                        value={video.url}
                                        autoComplete="off"
                                        onChange={(e) =>
                                          handleEditVideoUrl(
                                            video.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="img-pos-list">
                                      <input
                                        type="number"
                                        id={`position_${video.id}`}
                                        name={`position_${video.id}`}
                                        placeholder="Position"
                                        min={1}
                                        value={video.position}
                                        autoComplete="off"
                                        onChange={(e) =>
                                          handleEditVideoPosition(
                                            video.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div
                                      className="fc4 cp flx1 box-center fs24 mt8"
                                      onClick={() =>
                                        handleDeleteVideo(video.id)
                                      }
                                    >
                                      <MdDelete />
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        </>
                      ) : (
                        <MultiImageUpload
                          id="upload1"
                          setWorkImages={handleSetWorkImages}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb30 searching-drop form-group flx100">
                  <p className="fc15 fw6 fs14 ls1 mb8">Review For</p>
                  <MultiDropdown
                    label="Review for"
                    options={[
                      { value: "instructor", label: "Instructor" },
                      { value: "course", label: "Course" },
                      { value: "center", label: "Center" },
                    ]}
                    selectedValues={detailRecord.review_type}
                    onSelect={handleSelectReviewFor}
                  />
                </div>
                <div className="mb30 searching-drop form-group flx100">
                  {detailRecord.review_type.map((item) => (
                    <div className="mt24" key={item}>
                      <p className="fc15 fw6 fs14 ls1 mb8">Select {item}</p>
                      <MultiDropdown
                        label={`${item}`}
                        options={getOptions(item)}
                        selectedValues={selectOptions(item)}
                        onSelect={(selected) =>
                          handleReviewExtraChange(selected, item)
                        }
                        searchable
                      />
                    </div>
                  ))}
                </div>
                <div className="mb30 home-check">
                  <label htmlFor="home" className="cp v-center mr16 fs14">
                    <input
                      type="checkbox"
                      className="mr8 cp"
                      id="home"
                      checked={detailRecord.at_home_display}
                      onChange={handleCheckboxChange}
                    />
                    Show on Home
                  </label>
                </div>
                <div className="form-group-settings position">
                  <p className="fc15 fw6 fs14 ls1">Position</p>
                  <input
                    type="number"
                    id="position"
                    name="position"
                    placeholder="Enter Position"
                    autoComplete="off"
                    value={detailRecord.orderby}
                    onChange={(e) => handleReviewPosition(e.target.value)}
                  />
                </div>
              </div>
              <div className="radio-grp-status box-center fww mt12 mb12">
                <label htmlFor="approve" className="cp v-center mr16 fc13">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="approve"
                    value="1"
                    checked={detailRecord.status === "1"}
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
                    checked={detailRecord.status === "2"}
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
                    checked={detailRecord.status === "0"}
                    onChange={handleStatusChange}
                  />
                  Reject
                </label>
              </div>
              <div className="add-more box-center mt24">
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
            </Card>
          </>
        )}

      {!pageRoleAccess && !pageContentAccessDept && (
        <NoPermission displayMsg={"No permission to access this page"} />
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default ReviewDetail;
