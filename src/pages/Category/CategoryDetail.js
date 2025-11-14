import React, { useState, useRef, useEffect, useCallback } from "react";
import "./CategoryDetail.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import SingleDropdown from "../../components/SingleDropdown";
import MultiselectDropdown from "../../components/MultiSelectDropdown";
import SidePopup from "../../components/Popup/SidePopup";
import InputSearch from "../../components/InputSearch";
import ImageUpload from "../../components/ImageUpload";
import MultiImageUpload from "../../components/MultiImageUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import axios from "axios";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import { useTitle } from "../../hooks/useTitle.js";
import WebsiteUrl from "../../components/WebsiteUrl.js";

import NoPermission from "../../components/NoPermission.js";
import HtmlEditor from "../../components/HtmlEditor.js";
const CategoryDetail = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Category Detail - Flapone Aviation");

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);

  const [selectedOptionsTags, setSelectedOptionsTags] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [mainCoverImageUrl, setMainCoverImageUrl] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);
  let meta_keywords = [];
  meta_keywords.push({ meta_title: "" });
  meta_keywords.push({ meta_desc: "" });
  meta_keywords.push({ meta_keywords: [] });
  const [detailRecord, setDetailRecord] = useState({
    category_name: "",
    category_url: "",
    parentcat: {},
    overview: "",
    coverimage: "",
    tag_name: [],
    categorimages: [],
    video: [],
    coverimage: "",
    all_cat: [],
    status: "2",
    category_type: "main",
    coverimgby: "uploadCover",
    meta_keywords: meta_keywords,
  });
  const [displayMsg, setDisplayMsg] = useState("");
  const [dataStatus, setDataStatus] = useState(false);

  const [status, setStatus] = useState("");

  const [content, setContent] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [optionsTags, setOptionTags] = useState([]);
  const handleCategorySelect = (option) => {
    const updatedRecord = { ...detailRecord, parentcat: option };
    setDetailRecord(updatedRecord);
  };
  const handleUpdateCategoryName = (value) => {
    const pattern = /[^a-zA-Z0-9\s]+/g;
    let cleanedString = value.replace(pattern, " ");
    cleanedString = cleanedString.replace(/^\s+/g, "");
    cleanedString = cleanedString.replace(/\s+/g, " ");
    cleanedString = cleanedString.replace(/\s([a-zA-Z0-9])/g, "-$1"); // Corrected regex here
    const updatedCategoryName = cleanedString.toLowerCase();
    const updatedRecord = {
      ...detailRecord,
      category_name: value,
      category_url:
        id === undefined ? updatedCategoryName : detailRecord.category_url,
    };
    setDetailRecord(updatedRecord);
  };

  const makeUrlForURL = (value) => {
    if (value === "") {
      value = detailRecord.category_name;
    }
    const pattern = /[^a-zA-Z0-9\s]+/g;
    let cleanedString = value.replace(pattern, " ");
    cleanedString = cleanedString.replace(/^\s+/g, "");
    cleanedString = cleanedString.replace(/\s+/g, " ");
    cleanedString = cleanedString.replace(/\s+$/g, "");
    cleanedString = cleanedString.replace(/\s([a-zA-Z0-9])/g, "-$1");
    const updatedRecord = {
      ...detailRecord,
      category_url: cleanedString.toLowerCase(),
    };
    setDetailRecord(updatedRecord);
  };
  const handleUpdateCategoryUrl = (value) => {
    makeUrlForURL(value);
  };
  const handleSelectedTagsOptionsChange = (newSelectedOptions) => {
    const updatedRecord = { ...detailRecord, tag_name: newSelectedOptions };
    setDetailRecord(updatedRecord);
  };
  const handleMetaDesc = (value) => {
    // Create a copy of detailRecord using spread operator
    const updatedRecord = {
      ...detailRecord,
      meta_keywords: [
        ...detailRecord.meta_keywords.slice(0, 1),
        { ...detailRecord.meta_keywords[1], meta_desc: value },
        ...detailRecord.meta_keywords.slice(2),
      ],
    };
    setDetailRecord(updatedRecord);
  };
  const handleMetaTitle = (value) => {
    // Create a copy of detailRecord using spread operator
    const updatedRecord = {
      ...detailRecord,
      meta_keywords: [
        {
          ...detailRecord.meta_keywords[0], // Copy all properties of the first object in meta_keywords array
          meta_title: value, // Update meta_title with the new value
        },
        ...detailRecord.meta_keywords.slice(1), // Keep the rest of the meta_keywords array unchanged
      ],
    };
    setDetailRecord(updatedRecord);
  };

  const handleSelectedTagsOptionsChangeMeta = (newSelectedOptions) => {
    // Create a copy of detailRecord using spread operator
    const updatedRecord = {
      ...detailRecord,
      meta_keywords: [
        ...detailRecord.meta_keywords.slice(0, 2),
        { meta_keywords: newSelectedOptions },
        ...detailRecord.meta_keywords.slice(3),
      ],
    };
    setDetailRecord(updatedRecord);
  };

  const handleRadioCoverImageChange = (e) => {
    const updatedRecord = { ...detailRecord, coverimgby: e.target.value };
    setDetailRecord(updatedRecord);
  };
  const handleUpdateCoverImage = (value) => {
    const updatedRecord = { ...detailRecord, coverimage: value };
    setDetailRecord(updatedRecord);
  };
  const handleStatusChange = (e) => {
    const updatedRecord = { ...detailRecord, status: e.target.value };
    setDetailRecord(updatedRecord);
  };
  const handleParentCategoryChange = (value) => {
    const updatedRecord = { ...detailRecord, category_type: value };
    setDetailRecord(updatedRecord);
  };
  const toggleCodeView = useCallback(() => {
    setShowCode((prevShowCode) => !prevShowCode);
  }, [setShowCode]);

  const handleQuillChange = (value) => {
    setContent(value);
  };

  useEffect(() => {
    if (dataStatus) {
      const toolbar = document.querySelector(".ql-toolbar");

      if (toolbar) {
        const customButton = document.createElement("button");
        customButton.classList.add("ql-custom-button");
        customButton.innerHTML = "Source";
        customButton.addEventListener("click", toggleCodeView);
        toolbar.appendChild(customButton);

        return () => {
          customButton.removeEventListener("click", toggleCodeView);
          toolbar.removeChild(customButton);
        };
      }
    }
  }, [toggleCodeView, showCode, dataStatus]);
  const openCategoryListPage = () => {
    navigate("/category-list");
  };
  //kamlesh
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  useEffect(() => {}, []);
  useEffect(() => {
    getCategoryDetail();
    getTagSugglist();
  }, []);

  const getTagSugglist = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/blog_detail.php?fun=gettagsugglist`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === 1) {
          setOptionTags(JSON.parse(response.data.data.list));
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const getCategoryDetail = async () => {
    setDisplayMsg("");
    if (id) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/category_detail.php?fun=getcategorydetail`,
        headers: { "Auth-Id": user.auth_id },
        data: {
          id: id,
        },
      })
        .then(function (response) {
          if (response.data.data.status === "1") {
            response.data.data.data.meta_keywords = JSON.parse(
              response.data.data.data.meta_keywords
            );
            let allmetakeyword =
              response.data.data.data.meta_keywords[2].meta_keywords.split(",");
            allmetakeyword = allmetakeyword.filter(function (el) {
              return el != "";
            });
            let keywordobj = allmetakeyword.map((keyword) => ({
              value: keyword.trim(),
              label: keyword.trim(),
            }));
            response.data.data.data.meta_keywords[2].meta_keywords = keywordobj;
            let ddata = response.data.data.data;
            handleQuillChange(ddata.overview);
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
    } else {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/category_detail.php?fun=getcategorylist`,
        headers: { "Auth-Id": user.auth_id },
        data: {},
      })
        .then(function (response) {
          if (response.data.data.status === "1") {
            const updatedRecord = {
              ...detailRecord,
              all_cat: response.data.data.data,
            };
            setDetailRecord(updatedRecord);
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
    if (!detailRecord.category_name) {
      toast.warn("Category Name is required.");
      return false;
    }
    if (!detailRecord.category_url) {
      toast.warn("URL is required.");
      return false;
    }
    if (!detailRecord.coverimage) {
      toast.warn("Cover image URL is required.");
      return false;
    }

    return true; // Return true if all validations pass
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    //setSubmitLoader(true);
    detailRecord.overview = content;
    const articleData = detailRecord;

    axios({
      method: "post",
      url: `${constant.base_url}/admin/category_detail.php?fun=postcategorydata`,
      headers: { "Auth-Id": user.auth_id },
      data: articleData,
    })
      .then(function (response) {
        if (response.data.data.status === "0") {
          toast.error(response.data.data.msg);
        } else {
          toast.success(response.data.data.msg);
          navigate("/category-list");
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
              heading={`${id ? "Edit Category" : "Add Category"}`}
              txtSubHeading={`${id ? "Edit the details of an existing category here. Make sure to review your changes for accuracy before saving." : "Use this form to add a new category. Ensure the category name is unique and relevant before saving."}`}
              showButton={true}
              onClick={openCategoryListPage}
              iconText="View List"
            />
            <Card className="card bg5 mt16 pl8 pr20 pt20 pb10 content-iagent-container">
              <div className="blog-main-grp-inputs bg8 pl20 pr20 pt20 pb10 mb24 box-sd1">
                <div className="radio-grp-parent-status fww mt12 mb12 df fdc mb30">
                  <p className="fc15 fw6 fs14 ls1 ">Categorized as:</p>
                  <div className="v-center fs14 mt12">
                    <label htmlFor="main" className="cp v-center mr16">
                      <input
                        type="radio"
                        className="mr8 cp"
                        id="main"
                        disabled={id && user.role !== "1"}
                        value="main"
                        checked={detailRecord.category_type === "main"}
                        onChange={(e) =>
                          handleParentCategoryChange(e.target.value)
                        }
                      />
                      Parent Category
                    </label>
                    <label htmlFor="sub-cat" className="cp v-center mr16 ml24">
                      <input
                        type="radio"
                        className="mr8 cp"
                        id="sub-cat"
                        value="sub-cat"
                        disabled={id && user.role !== "1"}
                        checked={detailRecord.category_type === "sub-cat"}
                        onChange={(e) =>
                          handleParentCategoryChange(e.target.value)
                        }
                      />
                      Sub Category
                    </label>
                  </div>
                </div>
                {detailRecord.category_type === "sub-cat" && (
                  <div className="form-group-settings sub-category">
                    <SingleDropdown
                      label="Category"
                      isReadOnly={id && user.role !== "1"}
                      options={detailRecord.all_cat}
                      selectedOption={detailRecord.parentcat}
                      onSelect={handleCategorySelect}
                    />
                  </div>
                )}

                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1">
                    {detailRecord.category_type === "sub-cat" ? "Sub" : ""}{" "}
                    Category Name<span className="fc4">*</span>
                  </p>
                  <input
                    type="text"
                    id="mainUrl"
                    name="mainUrl"
                    disabled={id && user.role !== "1"}
                    value={detailRecord.category_name}
                    placeholder={`Enter ${detailRecord.category_type === "sub-cat" ? "Sub" : ""} Category Name`}
                    autoComplete="off"
                    onChange={(e) => handleUpdateCategoryName(e.target.value)}
                  />
                </div>
                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1">
                    Url<span className="fc4">*</span>
                  </p>
                  <input
                    type="text"
                    id="mainUrl"
                    name="mainUrl"
                    placeholder="Enter Url"
                    value={detailRecord.category_url}
                    onChange={(e) => handleUpdateCategoryUrl(e.target.value)}
                    autoComplete="off"
                    style={{
                      backgroundColor: id !== undefined ? "#f9f9f9" : "",
                      cursor: id !== undefined ? "not-allowed" : "",
                    }}
                    readOnly={id !== undefined}
                  />
                </div>
                {/* <div className="mb24 editor">
            <p className="fc15 fw6 fs14 ls1 mb12">Category Overview</p>
            <div className="editor-controls">
              {showCode && (
                <IoMdArrowBack
                  onClick={() => setShowCode(!showCode)}
                  className="cp mb8"
                />
              )}
            </div>
            {showCode ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  minHeight: "200px",
                  width: "100%",
                  padding: "8px",
                  resize: "none",
                }}
              />
            ) : (
              <ReactQuill
                modules={{
                  toolbar: [
                    [{ header: "2" }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image", "video"],
                    ["custom-button"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "link",
                  "image",
                  "video",
                ]}
                placeholder="Main description ...."
                value={content}
                onChange={handleQuillChange}
                style={{ maxHeight: "200px", width: "100%" }}
              />
            )}
          </div> */}
                <div className="form-group-settings chapter-name flx100">
                  <p className="fc15 fw6 fs14 ls1 mb8">
                    Category Overview <span className="fc4">*</span>
                  </p>
                  <div className="jodit-editor">
                    <HtmlEditor
                      descValue={content}
                      onChange={(value) => handleQuillChange(value)}
                    />
                  </div>
                </div>

                <div className="images-upload-grp">
                  <div className="cover-image">
                    <p className="fc15 fw6 fs14 ls1">
                      Cover Image<span className="fc4">*</span>
                    </p>
                    <div className="df mt12 mb30 cover-image-radio">
                      <label htmlFor="byUrlCover" className="cp v-center">
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="byUrlCover"
                          value="byUrlCover"
                          checked={detailRecord.coverimgby === "byUrlCover"}
                          onChange={handleRadioCoverImageChange}
                        />
                        By URL
                      </label>
                      <label
                        htmlFor="uploadCover"
                        className="cp v-center mr16 ml24"
                      >
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="uploadCover"
                          value="uploadCover"
                          checked={detailRecord.coverimgby === "uploadCover"}
                          onChange={handleRadioCoverImageChange}
                        />
                        Upload
                      </label>
                    </div>
                    <div className="form-group-settings cover-img-sec mt16">
                      {detailRecord.coverimgby === "byUrlCover" ? (
                        <>
                          <p className="fc15 fw6 fs14 ls1">Cover Image URL</p>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={detailRecord.coverimage}
                            placeholder="Enter Image URL"
                            autoComplete="off"
                            onChange={(e) => {
                              handleUpdateCoverImage(e.target.value);
                            }}
                          />
                        </>
                      ) : (
                        <ImageUpload
                          setWorkImage={setCoverImage}
                          imgData={coverImage}
                          blogDetailData={detailRecord}
                          setBlogDetailData={setDetailRecord}
                          setMainCoverImageUrl={setMainCoverImageUrl}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="meta-grp bg8 pl20 pr20 pt20 pb10 mb24 mt24 box-sd1">
                <div className="tags mb30">
                  <p className="fc15 fw6 fs14 ls1 mb8">Tags</p>
                  <MultiselectDropdown
                    options={optionsTags}
                    selectedOptions={
                      detailRecord.tag_name ? detailRecord.tag_name : []
                    }
                    onSelectedOptionsChange={handleSelectedTagsOptionsChange}
                    showDropdown={true}
                  />
                </div>
                {((user.role === "2" && user.dept_id === "6") ||
                  user.role === "1") && (
                  <>
                    <div className="form-group-settings name">
                      <p className="fc15 fw6 fs14 ls1">Meta Title</p>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        placeholder="Enter title"
                        value={
                          (detailRecord.meta_keywords &&
                            detailRecord.meta_keywords[0]?.meta_title) ||
                          ""
                        }
                        autoComplete="off"
                        onChange={(e) => handleMetaTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group-settings name">
                      <p className="fc15 fw6 fs14 ls1">Meta Description</p>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        placeholder="Enter meta description"
                        value={
                          (detailRecord.meta_keywords &&
                            detailRecord.meta_keywords[1]?.meta_desc) ||
                          ""
                        }
                        autoComplete="off"
                        onChange={(e) => handleMetaDesc(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="tags mb30">
                      <p className="fc15 fw6 fs14 ls1 mb8">Meta Keywords</p>
                      <MultiselectDropdown
                        options={optionsTags}
                        selectedOptions={
                          (detailRecord.meta_keywords &&
                            detailRecord.meta_keywords[2]?.meta_keywords) ||
                          []
                        }
                        onSelectedOptionsChange={
                          handleSelectedTagsOptionsChangeMeta
                        }
                        showDropdown={false}
                      />
                    </div>
                  </>
                )}
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
            {id !== undefined &&
              detailRecord.status === "1" &&
              detailRecord.detail_page_url && (
                <WebsiteUrl url={detailRecord.detail_page_url} />
              )}
          </>
        )}
      {!pageRoleAccess && !pageContentAccessDept && (
        <NoPermission displayMsg={"No permission to access this page"} />
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default CategoryDetail;
