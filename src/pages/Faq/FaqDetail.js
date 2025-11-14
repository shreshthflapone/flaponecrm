import React, {
  useState,
  useRef,
  useEffect,
  Component,
  useCallback,
} from "react";
import "./FaqDetail.css";
import InnerHeader from "../../components/InnerHeader";
import axios from "axios";
import Card from "../../components/Card";
import SingleDropdown from "../../components/SingleDropdown";
import MultiselectDropdown from "../../components/MultiSelectDropdown";
import SidePopup from "../../components/Popup/SidePopup";
import InputSearch from "../../components/InputSearch";
import ImageUpload from "../../components/ImageUpload";
import MultiImageUpload from "../../components/MultiImageUpload";
import ReactQuill from "react-quill";
import { Controlled as CodeMirror } from "react-codemirror2";
import MultiDropdown from "../../components/MultiDropdown";
import "react-quill/dist/quill.snow.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "react-quill/dist/quill.bubble.css";
import { FaCode } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Select from "react-select";
import Toggle from "../../components/Toggle";
import { useParams } from "react-router-dom";
import constant from "../../constant/constant";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SmallLoader from "../../components/SmallLoader";
import TextEditor from "../../components/TextEdior.js";
import NoPermission from "../../components/NoPermission.js";
import HtmlEditor from "../../components/HtmlEditor.js";

const FaqDetail = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);


  const [type, setType] = useState({});
  const [selectedOptionsTags, setSelectedOptionsTags] = useState([]);
  const [searchBlog, setSearchBlog] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [selectedOptionCoverImage, setSelectedOptionCoverImage] =
    useState("byUrlCover");
  const [selectedOptionGalleryImage, setSelectedOptionGalleryImage] =
    useState("byUrlUpload");
  const [selectedOptionVideo, setSelectedOptionVideo] = useState("byUrlVideo");
  const [status, setStatus] = useState("2");
  const [imageList, setImageList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState("");
  const [videoPosition, setVideoPosition] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [multiImages, setMultiImages] = useState([]);
  const [content, setContent] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [selectedOptionSubBlogImage, setSelectedOptionSubBlogImage] =
    useState("byUrlSubBlog");
  const [imageSubAnswerUrl, setImageSubAnswerUrl] = useState("");
  const [imageAnswerPosition, setImageAnswerPosition] = useState("");
  const [subAnswerList, setSubAnswerList] = useState([]);
  const [selectedSubBlogOptionVideo, setSelectedSubBlogOptionVideo] =
    useState("byUrlSubBlogVideo");
  const [subBlogVideoUrl, setSubBlogVideoUrl] = useState("");
  const [subBlogVideoPosition, setSubBlogVideoPosition] = useState("");
  const [showSubSectionVisibility, setShowSubSectionVisibility] =
    useState(false);
  const [author, setAuthor] = useState("");
  const quillRef = useRef(null);
  const navigate = useNavigate();

  
  const [selectedType, setSelectedType] = useState([]);
  const [statusOnOff, setStatusOnOff] = useState(false);
  const [toggleStatus, setToggleStatus] = useState("");
  const [createdBy, setCreatedBy]  = useState({ label: "Inhouse", value: "inhouse" });
  const [showNameInput, setShowNameInput] = useState(false);
  const [showPublicNameInput, setShowPublicNameInput] = useState(false);
  const [showSubNameInput, setShowSubNameInput] = useState(false);
  const [showSubPublicNameInput, setShowSubPublicNameInput] = useState(false);
  const [studentNameInput, setStudentNameInput] = useState([]);
  const [optionsTags, setOptionTags] = useState([]);
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory]  = useState("");
  const [selectedCourse, setSelectedCourse]  = useState("");
  const [selectedInstructor, setSelectedInstructor]  = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [publicName, setPublicName] = useState("");
  const [publicNameOption, setPublicNameOption] = useState([]);
  const [showGetPublicName, setShowGetPublicName] = useState("");
  const [dataStatus, setDataStatus] = useState(false);
  const [faqsDetailData, setFaqsDetailData] = useState({images:[],video:[],coverimage:""});
  const [selectedOptionsMetaKeyword, setSelectedOptionsMetaKeyWord] = useState([]);
  const [submitLoader,setSubmitLoader] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [imageSubBlogUrl, setImageSubBlogUrl] = useState("");
  const [imageSubBlogPosition, setImageSubBlogPosition] = useState("");
  const [subBlogList, setSubBlogList] = useState([]);
  const [inhouseName, setInhouseName] = useState('');
  const [review, setReview] = useState([]);
  const [reviewExtra, setReviewExtra] = useState([]);

  //Forms Related State
  const [mainQuestion, setMainQuestion] = useState('');
  const [mainURL, setMainURL] = useState('');
  const [mainPosition, setMainPosition] = useState('');
  const [answerDescriptionDetails, setAnswerDescriptionDetails] = useState([]);
  
  const handleTypeSelect = (value) => {
    const index = selectedType.indexOf(value);
    if (index === -1) {
      setSelectedType([...selectedType, value]);
    } else {
      const updatedValues = [...selectedType];
      updatedValues.splice(index, 1);
      setSelectedType(updatedValues);
    }
  };
  const handleReviewExtraChange = (type, value) => {
    setReviewExtra((prevState) => {
      const prevValues = prevState[type] || [];
      const index = prevValues.indexOf(value);
      const updatedValues =
        index === -1
          ? [...prevValues, value]
          : prevValues.filter((val) => val !== value);
      return { ...prevState, [type]: updatedValues };
    });
  };
  const getOptions = (item) => {
    switch (item) {
      case 'category':
        return categoryOptions;
      case 'course':
        return courseOptions;
      case 'instructor':
        return instructorOptions;
      default:
        return [];
    }
  };

  const typeOptions = [
    { value: "common", label: "Common" },
    { value: "course", label: "Course" },
    { value: "category", label: "Category" },
    { value: "instructor", label: "Instructor" },
  ];
  const optionsCreated = [
    { label: "Inhouse", value: "inhouse" },
    { label: "Public", value: "Public" },
  ];
  const handleCreatedBySelect = (option) => {
    if(option.value == 'inhouse'){
      setShowNameInput(true);
      setShowPublicNameInput(false);
    } else if(option.value == 'public'){
      setShowPublicNameInput(true);
      setShowNameInput(false);
    } else {
      setShowPublicNameInput(false);
      setShowNameInput(false);
    }
    setCreatedBy(option);
  };
  
  const handleSelectedTagsOptionsChange = (newSelectedOptions) => {
    setSelectedOptionsTags(newSelectedOptions);
  };
  const handleSelectedMetaKeyWordOptionsChange = (newSelectedOptions) => {
    setSelectedOptionsMetaKeyWord(newSelectedOptions);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  
  const [sections, setSections] = useState([]);


  const handleAddSection = () => {
    const newSection = {
      id: Date.now() + "_new",
      answer_id: "",
      position: sections.length + 1,
      answer_description: "",
      images: [],
      video: [],
      status: "1",
      imagechangeopt: "byUploadSubBlog",
      subcreatedBy: JSON.stringify(optionsCreated[0]),  
      sub_inhouseName: user.user_name,
      sub_publicName: "",
      showSubNameInput: true,
      showSubPublicNameInput: false,
    };
    setSections([...sections, newSection]);
  };
  
  const handleChange = (sectionId, field, value) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {

        if (field === "subcreatedBy") {
          return {
            ...section,
            subcreatedBy: JSON.stringify(value),
            showSubNameInput: value.value === "inhouse",
            showSubPublicNameInput: value.value === "public",
          };
        }
        return { ...section, [field]: value };
      }
      return section;
    });
  
    setSections(updatedSections);
  };

  const handleDeleteSection = (id) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
  };

  const handleAnswerDescriptionDetailsChange = (id, field, value) => {
  
    sections[id][field] = value;
    setSections([...sections]);
  };

  const handlePositionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const toggleCodeView = useCallback(() => {
    setShowCode((prevShowCode) => !prevShowCode);
  }, [setShowCode]);

 
  useEffect(() => {
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
  }, [toggleCodeView, showCode]);

  const openFaqListPage = () => {
    navigate("/faq-list");
  };

  useEffect(() => {
    getAllCourseInfo();
    getAllCategoryInfo();
    getAllInstructorInfo();
    getAllStudentInfo();
    getTagSugglist();
    getallfilter();
  },[]);


  const getAllCourseInfo = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/faq_details.php?fun=getAllCourseInfo`,
      headers: {"Auth-Id": user.auth_id }
    }).then(function (response) {
      let responseData = response.data.data;
      setCourseOptions(responseData.list);
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }

  const getAllCategoryInfo = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/faq_details.php?fun=getAllCategoryInfo`,
      headers: {"Auth-Id": user.auth_id }
    }).then(function (response) {
      let responseData = response.data.data;
      setCategoryOptions(responseData.list);
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
  }

 const getAllStudentInfo = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/faq_details.php?fun=getAllStudentInfo`,
      headers: {"Auth-Id": user.auth_id }
    }).then(function (response) {
      let responseData = response.data.data;
      setPublicNameOption(responseData.list);
      setInhouseName(response.data.login.data.name);
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
  }


  const getAllInstructorInfo = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/faq_details.php?fun=getAllInstructorInfo`,
      headers: {"Auth-Id": user.auth_id }
    }).then(function (response) {
      let responseData = response.data.data;
      setInstructorOptions(responseData.list);
      setInhouseName(response.data.login.data.name);
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
  }

  const getallfilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/faq_details.php?fun=getallfilter`,
      headers: {"Auth-Id": user.auth_id }
    }).then(function (response) {
      let responseData = response.data.data;
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
  }

  const getTagSugglist = async () =>{
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/blog_detail.php?fun=gettagsugglist`,
      headers: { "Auth-Id": user.auth_id },
      data: { }
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === 1) {
        setOptionTags(JSON.parse(response.data.data.list))
      }
    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }
  const checkUserLogin = (response) =>{
    if(response.data.login.status===0){
      dispatch(logout());
      navigate("/login");
    }
}
  useEffect(() => {
    getFaqsDetails();
  }, [id]);

  const getFaqsDetails = async () => {
    if (id) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/faq_details.php?fun=getFaqsDetails`,
        headers: {"Auth-Id": user.auth_id },
        data: {"id":id}
      }).then(function (response) {
        let responseData = response.data.data.data;
        setFaqsDetailData(responseData.subdata);
        if(responseData.type){
          setSelectedType(responseData.type);
        }
        if(responseData.course_list || responseData.category_list || responseData.instructor_list){
          setReviewExtra({
            category: responseData.category_list?responseData.category_list:[], 
            course: responseData.course_list?responseData.course_list:[],   
            instructor: responseData.instructor_list?responseData.instructor_list:[],
          })
        }
        if(responseData.created_by){
          setCreatedBy(JSON.parse(responseData.created_by));
        }
        if(responseData.author_name){
          setShowNameInput(true);
          setInhouseName(responseData.author_name);
        }
        if(responseData.author_id && responseData.author_id.length > 0){
          setShowPublicNameInput(true);
          setPublicName(responseData.author_name);
        }
        if(responseData.title){
          setMainQuestion(responseData.title);
        }
        if(responseData.url){
          setMainURL(responseData.url);
        }
        if(responseData.position){
          setMainPosition(responseData.position);
        }
	if(responseData.meta_keywords){      
        let metadataparse = JSON.parse(responseData.meta_keywords);
        if(metadataparse[1].meta_desc){
          setMetaDescription(metadataparse[1].meta_desc);
        }
        if(metadataparse[0].meta_title){
          setMetaTitle(metadataparse[0].meta_title);
        }
        if (metadataparse[2].meta_keywords) {
          let allmetakeyword = metadataparse[2].meta_keywords.split(",");
          let keywordobj = allmetakeyword.map((keyword) => ({
            value: keyword.trim(),
            label: keyword.trim()
          }));
          handleSelectedMetaKeyWordOptionsChange(keywordobj);
        }
        }		
        if(responseData.question_status){
          setStatus(responseData.question_status);
        }
        if(responseData.tags_list){
          setSelectedOptionsTags(JSON.parse(responseData.tags_list));
        }
        if(responseData.subdata && responseData.subdata.length>0){
          setSections(responseData.subdata);
          if(responseData.subdata.images){
            setSubBlogList(responseData.subdata.images);
          }
        }

        setDataStatus(true);
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
    }
  };

  const handleCheckStudentExistsOrNot = (event) => {
    setPublicName(event);
  }

  const makeUrlForURL = (Url) => {
    const pattern = /[^a-zA-Z0-9\s]+/g;
    let cleanedString = Url.replace(pattern, ' ');
    cleanedString = cleanedString.replace(/\s+/g, '-').replace(/-+$/, ''); // Remove trailing hyphens
    setMainURL(cleanedString.toLowerCase());
  };

  const validateForm = () => {
    if (!mainQuestion) {
      toast.warn('Question is required.');
      return false;
    }
    if (!mainURL) {
      toast.warn('URL is required.');
      return false;
    }
    if(Object.keys(selectedType).length == 0) {
      toast.warn('Select Type.');
      return false;
    }
    if(Object.keys(createdBy).length == 0) {
      toast.warn('Select Created By.');
      return false;
    }
    for (let answer of sections) {
      if (!answer.answer_description || !answer.subcreatedBy) {
        toast.warn('Each Answer Section Must Have Answer Description And Created By.');
        return false;
      }
      if (answer.showSubPublicNameInput && !answer.sub_publicName) {
        toast.warn('Public Name is required.');
        return false;
      }
      if (answer.showSubNameInput && !answer.sub_inhouseName) {
        toast.warn('Inhouse Name is required.');
        return false;
      }

    }
  
    return true; // Return true if all validations pass
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitLoader(true);
    const faqData = {
      id:id!==undefined?id:0,
      title:mainQuestion,
      url: mainURL,
      inhouse_name: inhouseName,
      type: JSON.stringify(selectedType),
      createdBy: createdBy,
      subdata:JSON.stringify(sections),
      tags_list:JSON.stringify(selectedOptionsTags),
      meta_title:metaTitle,
      meta_desc:metaDescription,
      meta_keywords:JSON.stringify(selectedOptionsMetaKeyword),
      status:status,
      images:selectedOptionGalleryImage === 'byUrlUpload' ? JSON.stringify(imageList) : (JSON.stringify(faqsDetailData.images)),
      video:JSON.stringify(faqsDetailData.video),
      reviewExtra: reviewExtra,
    };
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/faq_details.php?fun=postFaqData`,
      headers: { "Auth-Id": user.auth_id },
      data: faqData
    }).then(function (response) {
      if(response.data.status==='0'){
        toast.error(response.data.msg);
      } else {
        toast.success(response.data.msg);
        navigate("/faq-list");
      }
      setSubmitLoader(false);
    }).catch(function (error) {
      console.error('Error during login:', error);
    });

  }
  return (
    <>
      {(pageRoleAccess || pageContentAccessDept) && (dataStatus || id===undefined) && ( <>  <InnerHeader
        heading={`${id !== undefined ? "Edit" : "Add"} FAQ`}
        txtSubHeading={`${id !== undefined ? "Edit the details of an existing FAQ here. Modify the question or answer to ensure the information remains clear and up-to-date." : "Use this form to add a new FAQ. Provide a clear question and a concise answer to help users quickly find the information they need."}`}
        showButton={true}
        onClick={openFaqListPage}
        iconText="View FAQs List"
      />
      <Card className="card bg5 mt16 pl8 pr20 pt20 pb10 content-iagent-container">
        <div className="blog-main-grp-inputs bg8 pl20 pr20 pt20 pb10 mb24 box-sd1">
          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Question <span className="fc4">*</span></p>
            <input
              type="text"
              id="question"
              name="question"
              placeholder="Enter Question"
              autoComplete="off"
              value={mainQuestion}
              onChange={(e) => {
                const value = e.target.value;
                setMainQuestion(value);
                if(id==undefined){
                  makeUrlForURL(value);
                }
              }}
            />
          </div>
          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Url <span className="fc4">*</span></p>
            <input
              type="text"
              id="mainUrl"
              name="mainUrl"
              placeholder="Enter Url"
              autoComplete="off"
              value={mainURL}
              style={{ 
                backgroundColor: id !== undefined ? '#f9f9f9' : '',
                cursor: id !== undefined ? 'not-allowed' : '' 
              }}
              readOnly={id!==undefined}
              onChange={(e) =>
                makeUrlForURL(e.target.value)
              }
            />
            {/* <div className="v-center jcsb">
              <div className="img-urls mr16">
                
              </div>
              <div className="img-pos flx1">
                <p className="fc15 fw6 fs14 ls1">Position</p>
                <input
                  type="number"
                  id="position"
                  name="position"
                  value={mainPosition}
                  placeholder="Position"
                  autoComplete="off"
                  onChange={(e)=>setMainPosition(e.target.value)}
                />
              </div>
            </div> */}
          </div>
          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1 mb8">Type <span className="fc4">*</span></p>
            <MultiDropdown 
              label="Type"
              options={typeOptions}
              selectedValues={selectedType}
              onSelect={handleTypeSelect}
              chips="6"
            />
          </div>
          <div className="mb30 searching-drop form-group flx100">
            {selectedType.map((item) => (
              item !== 'common' && (
		courseOptions.length> 0 && item==='course'?(      
                <div className="mt24" key={item}>
                  <p className="fc15 fw6 fs14 ls1 mb8">Search {item}</p>
                  <MultiDropdown
                    label={`${item}`}
		     options={courseOptions}
                    selectedValues={reviewExtra[item] || []}
                    onSelect={(value) => handleReviewExtraChange(item, value)}
                    searchable
                    chips="6"
                  />
                </div>):(categoryOptions.length > 0 &&  item==='category'?(
			 <div className="mt24" key={item}>
                  <p className="fc15 fw6 fs14 ls1 mb8">Search {item}</p>
                  <MultiDropdown
                    label={`${item}`}
                     options={categoryOptions}
                    selectedValues={reviewExtra[item] || []}
                    onSelect={(value) => handleReviewExtraChange(item, value)}
                    searchable
                    chips="6"
                  />
                </div>
		):(instructorOptions.length > 0 && item==='instructor'?(
                         <div className="mt24" key={item}>
                  <p className="fc15 fw6 fs14 ls1 mb8">Search {item}</p>
                  <MultiDropdown
                    label={`${item}`}
                     options={instructorOptions}
                    selectedValues={reviewExtra[item] || []}
                    onSelect={(value) => handleReviewExtraChange(item, value)}
                    searchable
                    chips="6"
                  />
                </div>
                ):"" ))
              )
            ))}
          </div>
          <div className="form-group-settings name">
            <div className="v-center jcsb">
              <div className="flx50 mr16">
                <SingleDropdown
                  label="Created By"
                  options={optionsCreated}
                  selectedOption={createdBy}
	          isReadOnly={1}
	          isOtions={!id?1:0}
                  onSelect={handleCreatedBySelect}
                  mandatory
                />
              </div>     
              {(showNameInput) && (
                <div className="img-pos flx48">
                  <p className="fc15 fw6 fs14 ls1">Name</p>
                  <input
                    type="text"
                    id="inhouse_name"
                    name="inhouse_name"
                    placeholder="Enter Name"
                    autoComplete="off"
                    value={inhouseName}
                    onChange={(e)=>setInhouseName(e.target.value)}
                  />
                </div>
              )}
              {showPublicNameInput && (
                <div className="img-pos flx48">
                  <span>{showGetPublicName}</span>
                  <SingleDropdown
                    label="Public Name"
                    options={publicNameOption}
                    selectedOption={publicName}
                    onSelect={handleCheckStudentExistsOrNot}
                    isReadOnly={id!==undefined && publicName != ''}
                    search
                    compulsory={<span className="fc4">*</span>}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {sections.length < 1 && (
          <div className="show-sub-section df jce ">
            <button
              type="button"
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 mt16 mb16 v-center"
              onClick={handleAddSection}
            >
              <FaPlus className="mr4" />
              Add Answer
            </button>
          </div>
        )}

      <div className="bg8 box-sd1 blog-sub-container">
        {sections.map((section, index) => (
          <React.Fragment key={section.id}>

            <div className="df aic jcsb pos-inp form-group-settings mb8" style={{marginBottom:"8px"}}>
              <p className="pl20 pr20 pt20 fs18 ls1 lh22 fw6">Answer {index + 1}</p>
              <div className="number-input mr24 mt10">
                <label className="fc15 fw6 fs14 ls1 pos-inp">
                  Position : &nbsp;
                </label>
                <input
                  type="number"
                  name="position"
                  autoComplete="off"
                  placeholder="Position"
                  value={section.position === null ? (section.answer_id || '') : section.position}
                  onChange={(e) =>
                    handlePositionChange(index, "position", e.target.value)
                  }
                />
              </div>

            </div>
            <div className="blog-sub-sections pl20 pr20 brd-b2 pt16">
              {/* <div className="mb24 editor">
                <p className="fc15 fw6 fs14 ls1 mb12">Answer <span className="fc4">*</span> </p>
                <TextEditor
                  initialValue={section.answer_description}
                  onChange={(value) => handleChange(section.id, "answer_description", value)}
                />
              </div> */}
              <div className="form-group-settings chapter-name flx100">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                        Answer<span className="fc4">*</span>
                        </p>
                        <div className="jodit-editor">
                          <HtmlEditor
                            descValue={section.answer_description}
                            onChange={(value) => handleChange(section.id, "answer_description", value)}
                          />
                        </div>
                      </div>
              <div className="form-group-settings name">
                <div className="v-center jcsb">
                  <div className="flx50 mr16">
                    <SingleDropdown
                      label="Created By"
                      options={optionsCreated}
		      isReadOnly={1}
		      selectedOption={JSON.parse(section.subcreatedBy)}
                      onSelect={(value) => handleChange(section.id, "subcreatedBy", value)}
                      mandatory
                    />
                  </div>
                  {section.showSubNameInput && (
                    <div className="img-pos flx48">
                      <p className="fc15 fw6 fs14 ls1">Name</p>
                      <input
                        type="text"
                        id="inhouse_name"
                        name="inhouse_name"
                        placeholder="Enter Name"
                        autoComplete="off"
                        value={section.sub_inhouseName}
                        onChange={(e) => handleChange(section.id, "sub_inhouseName", e.target.value)}
                      />
                    </div>
                  )}
                  {section.showSubPublicNameInput && (
                    <div className="img-pos flx48">
                      <span>{showGetPublicName}</span>
                      <SingleDropdown
                        label="Public Name"
                        options={publicNameOption}
                        selectedOption={section.sub_publicName}
                        onSelect={(value) => handleChange(section.id, "sub_publicName", value)}
                        isReadOnly={section.answer_id !== ""}
                        search
                        compulsory={<span className="fc4">*</span>}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Rest of your code for images and videos */}
              <div className="df jce mb12">
                <div className="radio-grp-status box-center fww mt12 mb12">
                  <label htmlFor={`approve_${index}`} className="cp v-center mr16 fc13">
                    <input
                      type="radio"
                      className="mr8 cp"
                      id={`approve_${index}`}
                      value="1"
                      checked={section.status === "1"}
                      onChange={(e) => handleAnswerDescriptionDetailsChange(index, 'status', e.target.value)}
                    />
                    Approve
                  </label>
                  <label htmlFor={`reject_${index}`} className="cp v-center mr32 fc9">
                    <input
                      type="radio"
                      className="mr8 cp"
                      id={`reject_${index}`}
                      value="0"
                      checked={section.status === "0"}
                      onChange={(e) => handleAnswerDescriptionDetailsChange(index, 'status', e.target.value)}
                    />
                    Reject
                  </label>
                </div>
                <button className="df jce aic p8 brd1 br4 fc9 cp" onClick={() => handleDeleteSection(section.id)}>
                  <MdDelete className="fs20 cp fc9" />
                  Delete
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
        {sections.length >= 1 && (
          <div className="add-more df jce aic mt24 mr16">
            <button
              type="button"
              onClick={handleAddSection}
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 mb24 v-center"
            >
              <FaPlus className="mr4" />
              Add More Answer
            </button>
          </div>
        )}
      </div>

        <div className="meta-grp bg8 pl20 pr20 pt20 pb10 mb24 mt24 box-sd1">
          <div className="tags mb30">
            <p className="fc15 fw6 fs14 ls1 mb8">Tags</p>
            <MultiselectDropdown
              options={optionsTags}
              selectedOptions={selectedOptionsTags}
              onSelectedOptionsChange={handleSelectedTagsOptionsChange}
              showDropdown={true}
            />
          </div>
          {((user.role === '2' && user.dept_id === '6') || (user.role === '1'))  && (
                <>
	      <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Meta Title</p>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              placeholder="Enter title"
              autoComplete="off"
              value={metaTitle}
              onChange={(e)=>setMetaTitle(e.target.value)}
            />
          </div>
          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Meta Description</p>
            <textarea
              id="metaDescription"
              name="metaDescription"
              placeholder="Enter meta description"
              value={metaDescription}
              onChange={(e)=>setMetaDescription(e.target.value)}
              autoComplete="off"
            ></textarea>
          </div>
          <div className="tags mb30">
            <p className="fc15 fw6 fs14 ls1 mb8">Meta Keywords</p>
            <MultiselectDropdown
              options={optionsTags}
              selectedOptions={selectedOptionsMetaKeyword}
              onSelectedOptionsChange={handleSelectedMetaKeyWordOptionsChange}
              showDropdown={false}
            />
          </div>
		</>
	  )}
        </div>

        <div className="radio-grp-status box-center fww mt12 mb12">
          <label htmlFor="approve_status" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="approve_status"
              value="1"
              checked={status === "1"}
              onChange={handleStatusChange}
            />
            Approve
          </label>
          <label htmlFor="draft_status" className="cp v-center mr16 fc6 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="draft_status"
              value="2"
              checked={status === "2"}
              onChange={handleStatusChange}
            />
            Draft
          </label>
          <label htmlFor="reject_status" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="reject_status"
              value="0"
              checked={status === "0"}
              onChange={handleStatusChange}
            />
            Reject
          </label>
        </div>
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
      </>
     )}
     {!pageRoleAccess && !pageContentAccessDept  && (
            <NoPermission displayMsg={"No permission to access this page"} />
      )}
     <ToastContainer position="bottom-right" />
    </>
  );
};

export default FaqDetail;
