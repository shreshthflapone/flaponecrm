import React, {
  useState,
  useRef,
  useEffect,
  Component,
  useCallback,
} from "react";
import "../Courses/CourseDetail.css";
import axios from "axios";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import SingleDropdown from "../../components/SingleDropdown";
import MultiselectDropdown from "../../components/MultiSelectDropdown";
import SidePopup from "../../components/Popup/SidePopup";
import InputSearch from "../../components/InputSearch";
import ImageUpload from "../../components/ImageUpload";
import MultiImageUpload from "../../components/MultiImageUpload";
import ReactQuill from "react-quill";
import { Controlled as CodeMirror } from "react-codemirror2";
import "react-quill/dist/quill.snow.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "react-quill/dist/quill.bubble.css";
import { FaCode } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import constant from "../../constant/constant";
import TextEditor from "../../components/TextEdior.js";
import SmallLoader from "../../components/SmallLoader.js";
import Toggle from "../../components/Toggle";
import Tooltip from "../../components/Tooltip";
import { FaPlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle.js";
import WebsiteUrl from "../../components/WebsiteUrl.js";
import NoPermission from "../../components/NoPermission.js";
import HtmlEditor from "../../components/HtmlEditor.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import { logout } from "../../store/authSlice.js";

const CourseDetail = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useTitle("Course Detail - Flapone Aviation");

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);

  const [selectedOptionsTags, setSelectedOptionsTags] = useState([]);
  const [showBlogsManually, setShowBlogsManually] = useState(false);
  const [showRelCourseManually, setShowRelCourseManually] = useState(false);
  const [showAdvanceCourseManually, setShowAdvanceCourseManually] = useState(false);
  const [selectedIntructor, setSelectedIntructor] = useState([]);
  const [selectedRelCourse, setSelectedRelCourse] = useState([]);
  const [selectedAdvanceCourse, setSelectedAdvanceCourse] = useState([]);
  const [searchBlog, setSearchBlog] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [selectedOptionCoverImage, setSelectedOptionCoverImage] =useState("uploadCover");
  const [selectedPackageType, setSelectedPackageType] =useState("byinduval");
  const [selectedOptionGalleryImage, setSelectedOptionGalleryImage] =
    useState("uploadGall");
  const [courseListOptions,setCourseListOptions] = useState([]); 
  //byUrlCover
  //byUrlUpload

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
  const [imageSubCourseUrl, setImageSubCourseUrl] = useState("");
  const [imageSubCoursePosition, setImageSubCoursePosition] = useState("");
  const [subBlogList, setSubBlogList] = useState([]);
  const [selectedSubBlogOptionVideo, setSelectedSubBlogOptionVideo] =
    useState("byUrlSubBlogVideo");
  const [subBlogVideoUrl, setSubBlogVideoUrl] = useState("");
  const [subBlogVideoPosition, setSubBlogVideoPosition] = useState("");
  const [videoSubBlogList, setVideoSubBlogList] = useState([]);

  const [subCourseHighlightText, setCourseHighlightText] = useState("");
  const [subCourseHighlightValue, setCourseHighlightValue] = useState("");
  const [subCourseHighlightPosition, setCourseHighlightPosition] = useState("");
  const [CourseHighlightList, setCourseHighlightList] = useState([]);

  const [courseName, setCourseName] = useState("");
  const [courseURL, setCourseURL] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [smallTitle, setSmallTitle] = useState("");
  const [courseApiData, setCourseApiData] = useState({});
  const [instructorData, setAllInstructorData] = useState([]);
  const [relCourseData, setRelCourseData] = useState([]);
  const [advanceCourseData, setAdvanceCourseData] = useState([]);
  const [pageNum, setPageNum] = useState("1");
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [displayMsg, setDisplayMsg] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [displayStatus, setDisplayStatus] = useState({ label: "For Listing Only", value: "2" });
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  const [currency, setCurrency] = useState({});
  const [selectedOptionCurrency, setSelectedOptionCurrency] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState("");
  const [taxStatus, setTaxStatus] = useState(false);
  const [includeStatus, setIncludeStatus] = useState(false);
  const [foodStatus, setFoodStatus] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [paymentURL, setPaymentURL] = useState("");
  const [PriceSectionList, setPriceSectionList] = useState([]);
  const [taxOnOff, setTaxOnOff] = useState(false);
  const [includeOnOff, setIncludeOnOff] = useState(false);
  const [foodOnOff, setFoodOnOff] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedOptionsMetaKeyword, setSelectedOptionsMetaKeyWord] = useState([]);
  const [mainCoverImageUrl, setMainCoverImageUrl] = useState("");
  const [courseDetailData, setCourseDetailData] = useState({
    images: [],
    video: [],
    coverimage: "",
  });
  const [courseRPTOName, setCourseRPTOName] = useState("");
  const [courseFlag, setCourseFlag] = useState(false);

  const [sections, setSections] = useState([]);
  const [categoryOverview, setCategoryOverview] = useState([
    {
      id: Date.now().toString(),
      title: "",
      overview: "",
      position: 1,
    },
  ]);

  const [relInstructorList, setRelInstructorList] = useState({
    id: id,
    searchtext: "",
    pagenum: pageNum,
  });
  const [relCoursesList, setRelCoursesList] = useState({
    id: id,
    category: category.value,
    searchtext: "",
    pagenum: pageNum,
  });
  const [advaceCoursesList, setAdvanceCoursesList] = useState({
    id: id,
    category: category.value,
    searchtext: "",
    pagenum: pageNum,
  });

  //getLeadDetail(id);

  const quillRef = useRef(null);
  const navigate = useNavigate();

  // const categoryOptions = [
  //   { value: "aircrafts", label: "Aircrafts" },
  //   { value: "drone", label: "Drone" },
  //   { value: "others", label: "Others" },
  // ];
  const optionsTags = [
    { label: "Tag 1", value: "Tag1" },
    { label: "Tag 2", value: "Tag2" },
    { label: "Tag 3", value: "Tag3" },
  ];
  const optionsCurrency = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
  ];

  const optionsDisplay = [
    { label: "Do Not Display", value: "3" },
    { label: "For Enquiry Only", value: "1" },
    { label: "For Listing Only", value: "0" },
    { label: "For Listing + Enquiry", value: "2" },
  ];
  const handleCategorySelect = (option) => {
    setCategory(option);
    getSubCategoryOptions(option.value);
  };
  const handleSubCategorySelect = (option) => {
    setSubCategory(option);
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
  const handleCurrencySelect = (option) => {
    setCurrency(option);
  };
   const handleDisplaySelect = (option) => {
    setDisplayStatus(option);
  };
  const handleSelectedTagsOptionsChange = (newSelectedOptions) => {
    setSelectedOptionsTags(newSelectedOptions);
  };
  const handleSelectedCurrencyOptionsChange = (newSelectedCurrencyOptions) => {
    setCurrency(newSelectedCurrencyOptions);
  };

  const resetAPIHeader = (id) => {
    setRelInstructorList({
      id: id,
      searchtext: "",
      pagenum: pageNum,
    });
  };
  const resetRelAPIHeader = (id) => {
    setRelCoursesList({
      id: id,
      category: category,
      searchtext: "",
      pagenum: pageNum,
    });
  };
  const resetAdvanceAPIHeader = (id)=>{
    setAdvanceCoursesList({
      id: id,
      category: category,
      searchtext: "",
      pagenum: pageNum,
    });
  }
  const taxHandle = (e) => {
    setTaxStatus((prev) => !prev);
  };
  const includeHandle = (e) => {
    setIncludeStatus((prev) => !prev);
  };
  const foodHandle = (e) => {
    setFoodStatus((prev) => !prev);
  };
  const handleCourseFlag = (e) => {
    setCourseFlag((prev) => !prev);
  };
  const removeSelectedBlogs = (id) => {
    setSelectedIntructor(
      selectedIntructor.filter((item) => item.user_id !== id)
    );
  };
  const removeSelectedCourse = (id) => {
    setSelectedRelCourse(
      selectedRelCourse.filter((item) => item.course_id !== id)
    );
  };
  const removeAdvanceSelectedCourse = (id) => {
    setSelectedAdvanceCourse(
      selectedAdvanceCourse.filter((item) => item.course_id !== id)
    );
  };
  const handleSelectedMetaKeyWordOptionsChange = (newSelectedOptions) => {
    setSelectedOptionsMetaKeyWord(newSelectedOptions);
  };
  const handleBlogSearch = (searchQuery) => {
    relInstructorList.searchtext = searchQuery;
    getAllInstructorData();
  };
  const handleRelCourseSearch = (searchQuery) => {
    relCoursesList.searchtext = searchQuery;
    getRelCourseList();
  };
  const handleAdvacneCourseSearch = (searchQuery) =>{
    advaceCoursesList.searchtext = searchQuery;
    getAdvanceCourseList();
  }
  const handleBlogSelection = (pkg) => {
    setSelectedIntructor((prevSelectedPackages) => {
      const isSelected = prevSelectedPackages.some(
        (selectedPackage) => selectedPackage.user_id === pkg.user_id
      );
      if (isSelected) {
        return prevSelectedPackages.filter(
          (selectedPackage) => selectedPackage.user_id !== pkg.user_id
        );
      } else {
        return [...prevSelectedPackages, pkg];
      }
    });
  };
  const handleRelCourseSelection = (pkg) => {
    setSelectedRelCourse((prevSelectedPackages) => {
      const isSelected = prevSelectedPackages.some(
        (selectedPackage) => selectedPackage.course_id === pkg.course_id
      );
      if (isSelected) {
        return prevSelectedPackages.filter(
          (selectedPackage) => selectedPackage.course_id !== pkg.course_id
        );
      } else {
        return [...prevSelectedPackages, pkg];
      }
    });
  };
  const handleAdvanceCourseSelection = (pkg) => {
    setSelectedAdvanceCourse((prevSelectedPackages) => {
      const isSelected = prevSelectedPackages.some(
        (selectedPackage) => selectedPackage.course_id === pkg.course_id
      );
      if (isSelected) {
        return prevSelectedPackages.filter(
          (selectedPackage) => selectedPackage.course_id !== pkg.course_id
        );
      } else {
        return [...prevSelectedPackages, pkg];
      }
    });
  };
  const handleRadioCoverImageChange = (e) => {
    setSelectedOptionCoverImage(e.target.value);
  };
  const handlePackageType = (e) => {
    setSelectedPackageType(e.target.value);
  };

  const handleRadioGalleryImageChange = (e) => {
    setSelectedOptionGalleryImage(e.target.value);
  };

  const handleRadioVideoChange = (e) => {
    setSelectedOptionVideo(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleAddImage = () => {
    if (imageUrl && imagePosition) {
      const isDuplicate = imageList.some((image) => image.url === imageUrl);

      if (isDuplicate) {
        toast.warn("Image with URL already exists");
        return;
      }

      const newImage = {
        id: Date.now() + "_new",
        url: imageUrl,
        position: imagePosition,
        status: "1",
      };

      setImageList([...imageList, newImage]);

      setCourseDetailData((prevData) => ({
        ...prevData,
        images: [...prevData.images, newImage],
      }));

      // Clear input fields
      setImageUrl("");
      setImagePosition("");
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
    setCourseDetailData((prevData) => ({
      ...prevData,
      images: updatedList,
    }));
  };

  const handleEditImagePosition = (id, newPosition) => {
    const updatedList = imageList.map((image) => {
      if (image.id === id) {
        return {
          ...image,
          position: parseInt(newPosition ? newPosition : 555555),
        };
      }
      return image;
    });
    setImageList(updatedList);
    setCourseDetailData((prevData) => ({
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
    setCourseDetailData((prevData) => ({
      ...prevData,
      images: updatedList,
    }));
  };

  const handleAddVideo = () => {
    if (videoUrl && videoPosition) {
      const isDuplicate = videoList.some((video) => video.url === videoUrl);

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
      setCourseDetailData((prevData) => ({
        ...prevData,
        video: [...prevData.video, newVideo],
      }));
      setVideoUrl("");
      setVideoPosition("");
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
    setCourseDetailData((prevData) => ({
      ...prevData,
      video: updatedVideoList,
    }));
  };

  const handleEditVideoPosition = (id, newPosition) => {
    const updatedVideoList = videoList.map((video) => {
      if (video.id === id) {
        return { ...video, position: newPosition };
      }
      return video;
    });
    setVideoList(updatedVideoList);
    setCourseDetailData((prevData) => ({
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
    setCourseDetailData((prevData) => ({
      ...prevData,
      video: updatedList,
    }));
  };

  const handleAddCategoryOverview = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "",
      overview: "",
      position: categoryOverview.length + 1,
    };
    setCategoryOverview([...categoryOverview, newSection]);
  };

  const handleDeleteCategoryOverview = (id) => {
    const updatedList = categoryOverview.filter(
      (highlight, index) => index !== id
    );
    setCategoryOverview(updatedList);
  };

  const handleCategoryOverviewChange = (id, field, value) => {
    const updatedSections = categoryOverview.map((section, index) =>
      index === id ? { ...section, [field]: value } : section
    );
    setCategoryOverview(updatedSections);
  };

  const handleSetWorkImages = (id, images) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, images } : section
      )
    );
  };

  const toggleCodeView = useCallback(() => {
    setShowCode((prevShowCode) => !prevShowCode);
  }, [setShowCode]);

  useEffect(() => {
    getCategoryOptions();
  }, []);

  useEffect(() => {
    getCourseDetails();
  }, [id]);

  useEffect(() => {}, [selectedRelCourse]);

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

  const openCourseListPage = () => {
    navigate("/course-list");
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
  };

  // const handleAddCourseHighlight = () => {
  //   if(subCourseHighlightText && subCourseHighlightValue && subCourseHighlightPosition) {
  //     const newHightlightDetail = {
  //       id: CourseHighlightList.length + 1,
  //       text: subCourseHighlightText,
  //       value: subCourseHighlightValue,
  //       position: subCourseHighlightPosition
  //     };
  //     setCourseHighlightList([...CourseHighlightList, newHightlightDetail]);
  //     setCourseHighlightText("");
  //     setCourseHighlightValue("");
  //     setCourseHighlightPosition("");
  //   }
  // };

  // const handleDeleteCourseHighLight = (id) => {
  //   const updatedList = CourseHighlightList.filter((course_hilgt_text) => course_hilgt_text.id !== id);
  //   setCourseHighlightList(updatedList);
  // };

  const handleAddCourseHighlight = () => {
    if (
      subCourseHighlightText &&
      subCourseHighlightValue &&
      subCourseHighlightPosition
    ) {
      const newHighlight = {
        id: CourseHighlightList.length + 1,
        text: subCourseHighlightText,
        value: subCourseHighlightValue,
        position: subCourseHighlightPosition,
      };
      setCourseHighlightList([...CourseHighlightList, newHighlight]);
      setCourseHighlightText("");
      setCourseHighlightValue("");
      setCourseHighlightPosition("");
    }
  };

  const handleAddPriceSection = () => {
    if (currency.label && currencyPrice) {
      let CurrencyValue = currency.label;
      const newPriceSection = {
        [currency.label]: {
          id: Date.now() + "_new",
          price: currencyPrice,
          tax_status: taxStatus ? "1" : "",
          discount: discountValue,
          payment_url: paymentURL,
          include: includeStatus ? "1" : "",
          food: foodStatus ? "1" : "",
        },
      };
      setPriceSectionList({ ...PriceSectionList, ...newPriceSection });
      setCurrency({ label: "" });
      setCurrencyPrice("");
      setTaxStatus(false);
      setDiscountValue("");
      setPaymentURL("");
      setIncludeStatus(false);
      setFoodStatus(false);
    }
  };

  const handleEditPriceSection = (currencyLabel, newText, field) => {
    setPriceSectionList((prevList) => {
      const updatedList = { ...prevList };
      if (updatedList[currencyLabel]) {
        updatedList[currencyLabel] = {
          ...updatedList[currencyLabel],
          [field]: newText,
        };
      }

      return updatedList;
    });
  };
  // const handleEditCourseHighLight = (id, key, value) => {
  //   const updatedHighlights = CourseHighlightList.map((highlight) => {
  //       if (highlight.id === id) {
  //           return { ...highlight, [key]: value };
  //       }
  //       return highlight;
  //   });
  //   setCourseHighlightList(updatedHighlights);
  // };

  const handleDeleteCourseHighLight = (id) => {
    const updatedHighlights = CourseHighlightList.filter(
      (highlight, index) => highlight.id !== id
    );
    setCourseHighlightList(updatedHighlights);
  };
  const handleDeletePriceSection = (currencyLabel) => {
    const { [currencyLabel]: _, ...updatedPriceSection } = PriceSectionList;
    setPriceSectionList(updatedPriceSection);
  };

  const handleEditCourseHighLight = (id, newText, field, indexp) => {
    CourseHighlightList[indexp][field] = newText;
    setCourseHighlightList([...CourseHighlightList]);
  };
  /*
  const handleEditCourseHighLight = (id, newText,field) => {
    const updatedSections = CourseHighlightList.map((section,index) =>
      index === id ? { ...section, [field]: newText } : section
    );
     setCourseHighlightList(updatedSections);

  };
*/
  // const handleEditPriceSection = (currencyLabel, newText, field) => {
  //   setPriceSectionList(prevList =>
  //     prevList.map(priceSection =>
  //       priceSection[currencyLabel]
  //         ? { ...priceSection, [currencyLabel]: { ...priceSection[currencyLabel], [field]: newText } }
  //         : priceSection
  //     )
  //   );
  // };
  useEffect(() => {
    getCourseList();
  }, [subCategory]);
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const getCategoryOptions = async () => {
    setShowSubCategoryDropdown(false);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/course_details.php?fun=getCategoryOptions`,
      headers: { "Auth-Id": user.auth_id },
    })
      .then(function (response) {
        let responseData = response.data.data;
        setCategoryOptions(responseData.list);
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };
  const getCourseList = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/courseDetails.php?fun=getcourselist`,
      headers: { "Auth-Id": user.auth_id },
      data: { coursesubcategory: subCategory },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setCourseListOptions([...response.data.data.data]);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const getSubCategoryOptions = async (category_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/course_details.php?fun=getSubCategoryOptions`,
      headers: { "Auth-Id": user.auth_id },
      data: { category_id: category_id },
    })
      .then(function (response) {
        let responseData = response.data.data;
        if (responseData.list != "") {
          setSubCategoryOptions(responseData.list);
          setShowSubCategoryDropdown(true);
        } else {
          setShowSubCategoryDropdown(false);
        }
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };

  const getCourseDetails = async () => {
    if (id) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/course_details.php?fun=CourseEdit`,
        headers: { "Auth-Id": user.auth_id },
        data: { course_id: id },
      })
        .then(function (response) {
          let responseData = response.data.data.data;
          let coursePrice = JSON.parse(responseData.course_price);

          setCourseDetailData(responseData);
          if (responseData.category_id) {
            handleCategorySelect(responseData.category_id);
          }
          setSelectedPackageType(responseData.combo_type);
          setSelectedCourses(responseData.combo_course_list);
         
          if (responseData.sub_category_id) {
            setShowSubCategoryDropdown(true);
            handleSubCategorySelect(responseData.sub_category_id);
          }
          let metadataparse = JSON.parse(responseData.meta_keywords);
          if (metadataparse[1].meta_desc) {
            setMetaDescription(metadataparse[1].meta_desc);
          }
          if (metadataparse[0].meta_title) {
            setMetaTitle(metadataparse[0].meta_title);
          }
          if (metadataparse[2].meta_keywords) {
            let allmetakeyword = metadataparse[2].meta_keywords.split(",");
            let keywordobj = allmetakeyword.map((keyword) => ({
              value: keyword.trim(),
              label: keyword.trim(),
            }));
            handleSelectedMetaKeyWordOptionsChange(keywordobj);
          }
          setStatus(responseData.course_status);
          if (responseData.title) {
            setCourseName(responseData.title);
          }
          //setSections(JSON.parse(responseData.course_overview));
          if (responseData.course_overview) {
            setCategoryOverview(JSON.parse(responseData.course_overview));
          }
          if (responseData.course_url) {
            setCourseURL(responseData.course_url);
          }
          if (responseData.course_duration) {
            setCourseDuration(responseData.course_duration);
          }
          if(responseData.rpto_course_name){
            setCourseRPTOName(responseData.rpto_course_name);
          }
          if(responseData.certificate_flag){
            setCourseFlag(responseData.certificate_flag == "1" ? true : false);
          }
          if (responseData.small_title) {
            setSmallTitle(responseData.small_title);
          }
          if (responseData.related_course_list) {
            setSelectedRelCourse(responseData.related_course_list);
          }
          if (responseData.advance_courses) {
            setSelectedAdvanceCourse(responseData.advance_courses);
          }
          if (responseData.list) {
            setSelectedIntructor(responseData.list);
          }
          if (responseData.coverimage) {
            setMainCoverImageUrl(responseData.coverimage);
          }
          if (responseData.tags) {
            setSelectedOptionsTags(JSON.parse(responseData.tags));
          }

          /*const coursePriceArray = Object.entries(coursePrice).map(([key, value], index) => ({
          [key]: {
            id: index + 1,
            price: value.price,
            tax_status: value.tax_status,
            discount: value.discount,
            payment_url: value.payment_url,
            food: value.food || "",
            include: value.include || ""
          }
        }));
        if(coursePriceArray && coursePriceArray.length>0){
          setPriceSectionList(coursePriceArray);
        }
	*/
          if (coursePrice && Object.keys(coursePrice).length > 0) {
            setPriceSectionList(coursePrice);
          }
          let courseHighlight = JSON.parse(responseData.course_highlights);
          const courseHighlightArray = Object.entries(courseHighlight).map(
            ([key, value], index) => ({
              id: index + 1,
              text: key,
              value: value,
              position: index + 1,
            })
          );
          if (courseHighlightArray && courseHighlightArray.length > 0) {
            setCourseHighlightList(courseHighlightArray);
          }

           
           if (responseData.is_display) {
            setDisplayStatus(
              optionsDisplay.find(
                (option) => option.value === responseData.is_display
              )
            );
          }

          setDataStatus(true);
        })
        .catch(function (error) {
          // Handle errors
          console.error("Error during login:", error);
        });
    }
  };

  const getAllInstructorData = () => {
    setLoading(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/course_details.php?fun=getInstructorList`,
      headers: { "Auth-Id": user.auth_id },
      data: { instructorlist: relInstructorList },
    })
      .then(function (response) {
        let responseData = response.data.data;
        if (responseData.status === 1) {
          setAllInstructorData(responseData.list);
        } else {
          setAllInstructorData([]);
          setDisplayMsg(responseData);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
        setLoading(false);
      });
  };

  const makeUrlForURL = (Url) => {
    const pattern = /[^a-zA-Z0-9\s]+/g;
    let cleanedString = Url.replace(pattern, " ");
    cleanedString = cleanedString.replace(/\s+/g, "-").replace(/-+$/, "");
    setCourseURL(cleanedString.toLowerCase());
  };
  const makeTitleForTitle = (value) => {
    setSmallTitle(value);
  };

  const getRelCourseList = () => {
    setLoading(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/course_details.php?fun=getRelCourseList`,
      headers: { "Auth-Id": user.auth_id },
      data: { relCoursesList: relCoursesList },
    })
      .then(function (response) {
        let responseData = response.data.data;
        if (responseData.status === 1) {
          setRelCourseData(responseData.list);
        } else {
          setRelCourseData([]);
          setDisplayMsg(responseData);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
        setLoading(false);
      });
  };
  const getAdvanceCourseList = () => {
    setLoading(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/course_details.php?fun=getAdvanceCourseList`,
      headers: { "Auth-Id": user.auth_id },
      data: { subcoursetype: subCategory,advaceCoursesList:advaceCoursesList},
    })
      .then(function (response) {
        let responseData = response.data.data;
        if (responseData.status === 1) {
          setAdvanceCourseData(responseData.list);
        } else {
          setAdvanceCourseData([]);
          setDisplayMsg(responseData);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
        setLoading(false);
      });
  };

  const validateForm = () => {
    // Check if mainTitle is empty
    if (Object.keys(category).length == 0) {
      toast.warn("Category is required.");
      return false;
    }
    if (showSubCategoryDropdown == true) {
      if (Object.keys(subCategory).length == 0) {
        toast.warn("Sub Category is required.");
        return false;
      }
    }
    if (!courseName) {
      toast.warn("Course Title is required.");
      return false;
    }
    if (!courseURL) {
      toast.warn("Course URL is required.");
      return false;
    }

  if(subCategory?.value == 3 || subCategory?.value == 4){
      if (!courseDuration) {
        toast.warn("Course Duration is required.");
        return false;
      }
      if(!courseRPTOName) {
        toast.warn("RPTO Course Name is required.");
        return false;
      }
    }

    if (selectedOptionCoverImage == "byUrlCover") {
      if (!mainCoverImageUrl) {
        toast.warn("Cover image URL is required.");
        return false;
      }
    } else {
      if (coverImage === null && courseDetailData.coverimage === "") {
        toast.warn("Cover image is required.");
        return false;
      }
    }

    if (categoryOverview.length === 0) {
      toast.warn("At least one Course Overview section is required.");
      return false;
    }
    for (let overview of categoryOverview) {
      if (!overview.title || !overview.overview) {
        toast.warn("Each Course Overview must have a Title and Description.");
        return false;
      }
    }

    if (CourseHighlightList.length === 0) {
      toast.warn("At least one Course Highlight is required.");
      return false;
    }
    for (let highlight of CourseHighlightList) {
      if (!highlight.text || !highlight.value || !highlight.position) {
        toast.warn(
          "Each Course Highlight must have text, value, and position."
        );
        return false;
      }
    }

    if (Object.keys(PriceSectionList).length == 0) {
      toast.warn("Price Currency is required.");
      return false;
    }
    if (!smallTitle) {
      toast.warn("Small title is required.");
      return false;
    }
    // if(!metaTitle){
    //   toast.warn('Meta title is required.');
    //   return false;
    // }
    // if(!metaTitle.length>30){
    //   toast.warn('Meta title should be 30 character.');
    //   return false;
    // }
    // if(!metaTitle){
    //   toast.warn('Meta description is required.');
    //   return false;
    // }

    return true; // Return true if all validations pass
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    //setSubmitLoader(true);
    const courseData = {
      id: id !== undefined ? id : 0,
      select_type:selectedPackageType,
      selectedCourses:selectedCourses,
      category_id: category,
      sub_category_id: subCategory,
      course_name: courseName,
      course_url: courseURL,
      course_duration: courseDuration,
      optionbycoverimage: selectedOptionCoverImage,
      coverimage:
        selectedOptionCoverImage === "byUrlCover"
          ? mainCoverImageUrl
          : coverImage && coverImage.url
            ? coverImage.url
            : courseDetailData.coverimage || "",
      optionbygallimg: selectedOptionGalleryImage,
      images:
        selectedOptionGalleryImage === "byUrlUpload"
          ? JSON.stringify(imageList)
          : JSON.stringify(courseDetailData.images),
      video: JSON.stringify(courseDetailData.video),
      subdata: JSON.stringify(categoryOverview),
      course_highlight: JSON.stringify(CourseHighlightList),
      course_price: JSON.stringify(PriceSectionList),
      small_title: smallTitle,
      tags_list: JSON.stringify(selectedOptionsTags),
      related_course_list: JSON.stringify(selectedRelCourse),
      advance_course_list: JSON.stringify(selectedAdvanceCourse),
      instructor_list: JSON.stringify(selectedIntructor),
      meta_title: metaTitle,
      meta_desc: metaDescription,
      meta_keywords: JSON.stringify(selectedOptionsMetaKeyword),
      courseRPTOName: courseRPTOName,
      courseFlag: courseFlag ? "1" : "0",
      status: status,
      is_display:displayStatus.value,
    };
    axios({
      method: "post",
      url: `${constant.base_url}/admin/course_details.php?fun=postCourseData`,
      headers: { "Auth-Id": user.auth_id },
      data: courseData,
    })
      .then(function (response) {
        if (response.data.data.status === "0") {
          toast.error(response.data.data.msg);
        } else {
          toast.success(response.data.data.msg);
          navigate("/course-list");
        }

        /* const responseData = JSON.parse(response.data);
      if(responseData.status === "0"){
        toast.error(responseData.msg);
      } else {
         toast.success(responseData.msg);
         navigate("/course-list");
      }
      */
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
            {" "}
            
            <InnerHeader
              heading={`${id !== undefined ? "Edit" : "Add"} Course`}
              txtSubHeading={`${id !== undefined ? "Edit the details of an existing course here. Update the course title, description, duration, instructor details, and other relevant information." : "Use this form to add a new course. Provide the course title, description, duration, instructor details, and any other relevant information."}`}
              showButton={true}
              onClick={openCourseListPage}
              iconText="View Course List"
            />
            <Card className="card bg5 mt16 pl8 pr20 pt20 pb10 content-iagent-container">
              <div className="blog-main-grp-inputs bg8 pl20 pr20 pt20 pb10 mb24">
                   
              
                  
                <div className="v-center jcsb mb24">
              
                  
                  <div
                    className={`${showSubCategoryDropdown ? "flx50 mr16" : "flx100"} `}
                  >
                    <SingleDropdown
                      label="Category"
                      options={categoryOptions}
                      selectedOption={category}
                      onSelect={handleCategorySelect}
                      compulsory={<span className="fc4">*</span>}
                    />
                  </div>
                  {showSubCategoryDropdown && (
                    <div className="img-pos flx48">
                      <SingleDropdown
                        label="Sub Category"
                        options={subCategoryOptions}
                        selectedOption={subCategory}
                        onSelect={handleSubCategorySelect}
                        compulsory={<span className="fc4">*</span>}
                      />
                    </div>
                  )}
                  
                </div>
                <p className="fc15 fw6 fs14 ls1">
                    Select Type <span className="fc4">*</span>{" "}
                    </p>
                    <div className="df mt12 mb30 cover-image-radio">
                      <label htmlFor="byinduval" className="cp v-center">
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="byinduval"
                          value="byinduval"
                          checked={selectedPackageType === "byinduval"}
                          onChange={handlePackageType}
                        />
                        Individual
                      </label>
                      <label
                        htmlFor="bycombo"
                        className="cp v-center mr16 ml24"
                      >
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="bycombo"
                          value="bycombo"
                          checked={selectedPackageType === "bycombo"}
                          onChange={handlePackageType}
                        />
                        Combo
                      </label>
                    </div>
                <div className="form-group-settings name">
                {selectedPackageType === "bycombo" && subCategory.label && (
                     <div className="mb8 assign flx100">
                       <p className="fc15 fw6 fs14 ls1 mb8">
                         Select Courses
                       </p>
                       <MultiDropdown
                         label="Course"
                         options={courseListOptions}
                         selectedValues={selectedCourses}
                         onSelect={handleSelectCourse}
                         chips={4}
                       />
                     </div>
                  )}
                </div>
                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1">
                    Title <span className="fc4">*</span>
                  </p>
                  <input
                    type="text"
                    id="course_name"
                    name="course_name"
                    value={courseName}
                    placeholder="Enter Name"
                    autoComplete="off"
                    onChange={(e) => {
                      const value = e.target.value;
                      setCourseName(value);
                      if (id == undefined) {
                        makeUrlForURL(value);
                        makeTitleForTitle(value);
                      }
                    }}
                  />
                </div>
                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1">
                    Url<span className="fc4">*</span>{" "}
                  </p>
                  <input
                    type="text"
                    id="course_url"
                    name="course_url"
                    placeholder="Enter Url"
                    style={{
                      backgroundColor: id !== undefined ? "#f9f9f9" : "",
                      cursor: id !== undefined ? "not-allowed" : "",
                    }}
                    autoComplete="off"
                    value={courseURL}
                    onChange={(e) => makeUrlForURL(e.target.value)}
                    readOnly={id !== undefined}
                  />
                </div>
                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1">
                    Duration (In Days) 
                    {(subCategory?.value == 3 || subCategory?.value == 4) && (
                    <span className="fc4">*</span>
                     )}
                  </p>
                  <input
                    type="number"
                    id="course_duration"
                    name="course_duration"
                    value={courseDuration}
                    placeholder="Enter Course Duration"
                    autoComplete="off"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 4) {
                        setCourseDuration(value);
                      }
                    }}
                  />
                </div>

                 {(subCategory?.value == 3 || subCategory?.value == 4) && (
                   <div className="v-center jcsb course-cur">
                  <div className="flx48 mr16">
                    <div className="form-group-settings name">
                      <p className="fc15 fw6 fs14 ls1">
                        RPTO Course name
                      {(subCategory?.value == 3 || subCategory?.value == 4 )&& (
                         <span className="fc4">*</span>
                       )}
                      </p>
                      <input
                        type="text"
                        id="rpto_course_name"
                        name="rpto_course_name"
                        value={courseRPTOName}
                        placeholder="Enter RPTO Course Name"
                        autoComplete="off"
                        onChange={(e) => {
                          const value = e.target.value;
                          setCourseRPTOName(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flx48 mr16">
                    <div className="form-group-settings name mb8">
                      <label htmlFor="course_flag" className="v-center">
                        <input
                          type="checkbox"
                          className="mr8 cp food-checkbox"
                          id="course_flag"
                          checked={courseFlag}
                          value={courseFlag}
                          name="course_flag"
                          onChange={handleCourseFlag}
                        />
                        Course Flag
                      </label>
                    </div>
                  </div>
                </div>
                 )}
                
                {/* <div className="mb24 editor">
            <p className="fc15 fw6 fs14 ls1 mb12">Eligibility</p>
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
                    [{ header: "1" }, { header: "2" }],
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

                <div className="images-upload-grp">
                  <div className="cover-image brd-b2">
                    <p className="fc15 fw6 fs14 ls1">
                      Cover Image <span className="fc4">*</span>{" "}
                    </p>
                    <div className="df mt12 mb30 cover-image-radio">
                      <label htmlFor="byUrlCover" className="cp v-center">
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="byUrlCover"
                          value="byUrlCover"
                          checked={selectedOptionCoverImage === "byUrlCover"}
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
                          checked={selectedOptionCoverImage === "uploadCover"}
                          onChange={handleRadioCoverImageChange}
                        />
                        Upload
                      </label>
                    </div>
                    <div className="form-group-settings cover-img-sec mt16">
                      {selectedOptionCoverImage === "byUrlCover" ? (
                        <>
                          <p className="fc15 fw6 fs14 ls1">Cover Image URL</p>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={mainCoverImageUrl}
                            placeholder="Enter Image URL"
                            autoComplete="off"
                            onChange={(e) => {
                              let newImageUrl = e.target.value;
                              setMainCoverImageUrl(newImageUrl);
                              setCourseDetailData((prevData) => ({
                                ...prevData,
                                coverimage: newImageUrl,
                              }));
                            }}
                          />
                        </>
                      ) : (
                        <ImageUpload
                          setWorkImage={setCoverImage}
                          setMainCoverImageUrl={setMainCoverImageUrl}
                          blogDetailData={courseDetailData}
                          setBlogDetailData={setCourseDetailData}
                          imgData={coverImage}
                        />
                      )}
                    </div>
                  </div>
                  <div className="gall-image mt24 brd-b2">
                    <p className="fc15 fw6 fs14 ls1">Image</p>
                    <div className="df mt12 mb30 cover-image-radio">
                      <label htmlFor="byUrlUpload" className="cp v-center">
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="byUrlUpload"
                          value="byUrlUpload"
                          checked={selectedOptionGalleryImage === "byUrlUpload"}
                          onChange={handleRadioGalleryImageChange}
                        />
                        By URL
                      </label>
                      <label
                        htmlFor="uploadGall"
                        className="cp v-center mr16 ml24"
                      >
                        <input
                          type="radio"
                          className="mr8 cp"
                          id="uploadGall"
                          value="uploadGall"
                          checked={selectedOptionGalleryImage === "uploadGall"}
                          onChange={handleRadioGalleryImageChange}
                        />
                        Upload
                      </label>
                    </div>
                    <div className="form-group-settings cover-img-sec mt16">
                      {selectedOptionGalleryImage === "byUrlUpload" ? (
                        <>
                          <div className="v-center jcsb">
                            <div className="img-urls mr16">
                              <p className="fc15 fw6 fs14 ls1">Image URL</p>
                              <input
                                type="text"
                                id="url"
                                name="url"
                                placeholder="Enter image url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                            <div className="img-pos flx1">
                              <p className="fc15 fw6 fs14 ls1">Position</p>
                              <input
                                type="number"
                                id="position"
                                name="position"
                                min={1}
                                placeholder="Position"
                                value={imagePosition}
                                onInput={(e) => {
                                  if (e.target.value.length > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                  }
                                }}
                                onChange={(e) =>
                                  setImagePosition(e.target.value)
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
                            {imageList.map(
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
                                        placeholder="Position"
                                        min={1}
                                        max={99}
                                        value={image.position}
                                        autoComplete="off"
                                        onInput={(e) => {
                                          if (e.target.value.length > 2) {
                                            e.target.value =
                                              e.target.value.slice(0, 2);
                                          }
                                        }}
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
                                      onClick={() =>
                                        handleDeleteImage(image.id)
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
                          setBlogDetailData={setCourseDetailData}
                          blogDetailData={courseDetailData}
                          setWorkImages={handleSetWorkImages}
                          setImageList={setImageList}
                        />
                      )}
                    </div>
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
                                min={1}
                                value={videoPosition}
                                onInput={(e) => {
                                  if (e.target.value.length > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                  }
                                }}
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
                            {videoList.map(
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
                          setBlogDetailData={setCourseDetailData}
                          blogDetailData={courseDetailData}
                          setSections={setSections}
                          subtype={true}
                          setWorkImages={handleSetWorkImages}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {categoryOverview.length < 1 && (
                <div className="show-sub-section df jce ">
                  <button
                    type="button"
                    className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 mb16 v-center"
                    onClick={handleAddCategoryOverview}
                  >
                    <FaPlus className="mr4" />
                    Add Category Overview
                  </button>
                </div>
              )}
              <div className="bg8 box-sd1 blog-sub-container mb24 pb24">
                {categoryOverview.map((section, index) => (
                  <>
                    <div
                      key={section.id}
                      className="blog-sub-sections pl20 pr20 brd-t2 brd-b2 pt16"
                    >
                      <p className="pr20 pt20 fs18 ls1 lh24 mb8 fw6">
                        Course Overview - {index + 1}{" "}
                      </p>
                      <div className="form-group-settings title-name">
                        <div className="df aic jcsb pos-inp mb8">
                          <p className="fc15 fw6 fs14 ls1 pos-inp">
                            Title <span className="fc4">*</span>{" "}
                          </p>
                          <div className="number-input">
                            <label className="fc15 fw6 fs14 ls1 pos-inp">
                              Position : &nbsp;{" "}
                            </label>
                            <input
                              type="number"
                              name="position"
                              onInput={(e) => {
                                if (e.target.value.length > 2) {
                                  e.target.value = e.target.value.slice(0, 2);
                                }
                              }}
                              autoComplete="off"
                              placeholder="Position"
                              value={section.position}
                              onChange={(e) =>
                                handleCategoryOverviewChange(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          placeholder="Enter title"
                          autoComplete="off"
                          value={section.title}
                          onChange={(e) =>
                            handleCategoryOverviewChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group-settings chapter-name flx100">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                          Short Title
                        </p>
                        <input
                          type="text"
                          id="short_title"
                          name="short_title"
                          placeholder="Enter short title"
                          autoComplete="off"
                          value={section.short_title}
                          onChange={(e) =>
                            handleCategoryOverviewChange(
                              index,
                              "short_title",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* <div className="form-group-settings sub-sec-desc editor mb64">
                <p className="fc15 fw6 fs14 ls1 mb12">Description <span className='fc4'>*</span></p>
                <TextEditor
                  initialValue={section.overview}
                  onChange={(value) => handleCategoryOverviewChange(index,"overview", value)}
                />
              </div> */}
                      <div className="form-group-settings chapter-name flx100">
                        <p className="fc15 fw6 fs14 ls1 mb8">
                          Description<span className="fc4">*</span>
                        </p>
                        <div className="jodit-editor">
                          <HtmlEditor
                            descValue={section.overview}
                            onChange={(value) =>
                              handleCategoryOverviewChange(
                                index,
                                "overview",
                                value
                              )
                            }
                          />
                        </div>
                      </div>
                      {categoryOverview.length > 1 && (
                        <div className="df jce aic mt48 mb24">
                          <MdDelete
                            onClick={() => handleDeleteCategoryOverview(index)}
                            className="fs24 cp fc9"
                          />
                        </div>
                      )}
                    </div>
                  </>
                ))}
                {categoryOverview.length >= 1 && (
                  <div className="add-more df jce aic mt24 mr24">
                    <button
                      type="button"
                      onClick={handleAddCategoryOverview}
                      className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10"
                    >
                      <FaPlus className="mr4" />
                      Add More
                    </button>
                  </div>
                )}
              </div>

              <div className="blog-main-grp-inputs bg8 pl20 pr20 pt20 pb10 mb24">
                <p className="fc15 fw6 fs18 ls22 ls1">Course Highlight </p>
                <div className="form-group-settings cover-img-sec mt16">
                  <div className="v-center jcsb course-highlight">
                    <div className="flx50 mr16">
                      <p className="fc15 fw6 fs14 ls1">
                        Text <span className="fc4">*</span>
                      </p>
                      <input
                        type="text"
                        id="highlight_text"
                        name="highlight_text"
                        placeholder="Enter Text"
                        value={subCourseHighlightText}
                        onChange={(e) => setCourseHighlightText(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    <div className="img-pos flx1 cr-img-pos">
                      <div className="v-center jcsb">
                        <div className="flx75 mr16">
                          <p className="fc15 fw6 fs14 ls1">
                            Value <span className="fc4">*</span>
                          </p>
                          <input
                            type="text"
                            id="highlight_value"
                            name="highlight_value"
                            placeholder="Enter Value"
                            value={subCourseHighlightValue}
                            onChange={(e) =>
                              setCourseHighlightValue(e.target.value)
                            }
                            autoComplete="off"
                          />
                        </div>
                        <div className="img-pos flx1">
                          <p className="fc15 fw6 fs14 ls1">
                            Position <span className="fc4">*</span>
                          </p>
                          <input
                            type="number"
                            id="highlight_position"
                            name="highlight_position"
                            placeholder="Position"
                            value={subCourseHighlightPosition}
                            onInput={(e) => {
                              if (e.target.value.length > 2) {
                                e.target.value = e.target.value.slice(0, 2);
                              }
                            }}
                            onChange={(e) =>
                              setCourseHighlightPosition(e.target.value)
                            }
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="df jce">
                    <button
                      className="h36 pt8 pb8 pl16 pr16 mt16 cp bg1 fc3 br4"
                      onClick={handleAddCourseHighlight}
                    >
                      Add
                    </button>
                  </div>
                  <div className="image-list mt16 mb24">
                    {CourseHighlightList.map((course_hilgt_text, index) => (
                      <div
                        className="v-center jcsb listing-img-url"
                        key={course_hilgt_text.id}
                      >
                        <div className="flx50 mr16">
                          <input
                            type="text"
                            id={`highlight_text_${course_hilgt_text.id}`}
                            name={`highlight_text_${course_hilgt_text.id}`}
                            placeholder="Enter Text"
                            value={course_hilgt_text.text}
                            autoComplete="off"
                            onChange={(e) =>
                              handleEditCourseHighLight(
                                course_hilgt_text.id,
                                e.target.value,
                                "text",
                                index
                              )
                            }
                          />
                        </div>
                        <div className="img-pos flx1">
                          <div className="v-center jcsb">
                            <div className="flx75 mr16">
                              <input
                                type="text"
                                id={`highlight_value_${course_hilgt_text.id}`}
                                name={`highlight_value_${course_hilgt_text.id}`}
                                placeholder="Value"
                                value={course_hilgt_text.value}
                                autoComplete="off"
                                onChange={(e) =>
                                  handleEditCourseHighLight(
                                    course_hilgt_text.id,
                                    e.target.value,
                                    "value",
                                    index
                                  )
                                }
                              />
                            </div>
                            <div className="img-pos flx1">
                              <input
                                type="number"
                                id={`highlight_position_${course_hilgt_text.id}`}
                                name={`highlight_position_${course_hilgt_text.id}`}
                                value={course_hilgt_text.position}
                                placeholder="Position"
                                onInput={(e) => {
                                  if (e.target.value.length > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                  }
                                }}
                                onChange={(e) =>
                                  handleEditCourseHighLight(
                                    course_hilgt_text.id,
                                    e.target.value,
                                    "position",
                                    index
                                  )
                                }
                              />
                            </div>
                            <div
                              className="fc4 cp flx1 box-center fs24 mt8"
                              onClick={() =>
                                handleDeleteCourseHighLight(
                                  course_hilgt_text.id
                                )
                              }
                            >
                              <MdDelete />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Section Start Here */}

              <div className="blog-main-grp-inputs bg8 pl20 pr20 pt20 pb10 mb24">
                <p className="fc15 fw6 fs18 ls22 ls1">Price</p>
                <div className="form-group-settings cover-img-sec mt16">
                  {Object.keys(PriceSectionList).length < 2 && (
                    <>
                      <div className="v-center jcsb course-cur">
                        <div className="flx30 mr16">
                          <SingleDropdown
                            label="Currency"
                            options={optionsCurrency}
                            selectedOption={currency}
                            onSelect={handleCurrencySelect}
                            compulsory={<span className="fc4">*</span>}
                          />
                        </div>
                        <div className="flx30 mr16 amt">
                          <p className="fc15 fw6 fs14 ls1">
                            Amount <span className="fc4">*</span>
                          </p>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter Price"
                            value={currencyPrice}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCurrencyPrice(e.target.value);
                              setTaxStatus(true);
                            }}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flx30 mr16 disc">
                          <p className="fc15 fw6 fs14 ls1">Discount</p>
                          <input
                            type="number"
                            id="discount"
                            name="discount"
                            placeholder="Enter Discount"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="v-center jcsb mt20 mb20">
                        <div className="flx100 mr16">
                          <p className="fc15 fw6 fs14 ls1">Payment URL</p>
                          <input
                            type="text"
                            id="payment_url"
                            name="payment_url"
                            placeholder="Enter Payment"
                            value={paymentURL}
                            onChange={(e) => setPaymentURL(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="df food-acc">
                        <div className="flx50 df jcs mr16">
                          <div className="add-more-sec df aic">
                            <label htmlFor="food_status" className="v-center">
                              <input
                                type="checkbox"
                                className="mr8 cp food-checkbox"
                                id="food_status"
                                value={foodStatus}
                                name="food_status"
                                onChange={foodHandle}
                              />
                              Food & Accommodation at the flying location
                            </label>
                          </div>
                        </div>
                        <div className="flx50 df jce">
                          <button
                            className="h36 pt8 pb8 pl16 pr16 mt16 cp bg1 fc3 br4 mr16"
                            onClick={handleAddPriceSection}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="image-list mt16 mb24">
                    {Object.entries(PriceSectionList).map(
                      ([currencyLabel, value]) => (
                        <div className="mb32" key={value.id}>
                          <div className="v-center jcsb listing-img-url">
                            <div className="flx30 mr16 ">
                              <p className="fc15 fw6 fs14 ls1 mb8">Currency</p>
                              <p className="fc15 fw6 fs14 bg5 br4 w100 ls22 price-section-currency disabled-input">
                                {currencyLabel}
                              </p>
                            </div>
                            <div className="flx30 mr16">
                              <p className="fc15 fw6 fs14 ls1 mb8">Amount</p>
                              <input
                                type="number"
                                id={`price_${value.id}`}
                                name={`price_${value.id}`}
                                placeholder="Enter Price"
                                value={value.price}
                                autoComplete="off"
                                onChange={(e) =>
                                  handleEditPriceSection(
                                    currencyLabel,
                                    e.target.value,
                                    "price"
                                  )
                                }
                              />
                            </div>
                            <div className="flx30 mr16">
                              <p className="fc15 fw6 fs14 ls1">Discount</p>
                              <input
                                type="number"
                                id={`discount_${value.id}`}
                                name={`discount_${value.id}`}
                                placeholder="Enter Discount"
                                value={value.discount}
                                onChange={(e) =>
                                  handleEditPriceSection(
                                    currencyLabel,
                                    e.target.value,
                                    "discount"
                                  )
                                }
                                autoComplete="off"
                              />
                            </div>
                          </div>
                          <div className="v-center jcsb mt20">
                            <div className="flx100 mr16">
                              <p className="fc15 fw6 fs14 ls1">Payment URL</p>
                              <input
                                type="text"
                                id={`payment_url_${value.id}`}
                                name={`payment_url_${value.id}`}
                                placeholder="Enter Payment"
                                value={value.payment_url}
                                onChange={(e) =>
                                  handleEditPriceSection(
                                    currencyLabel,
                                    e.target.value,
                                    "payment_url"
                                  )
                                }
                                autoComplete="off"
                              />
                            </div>
                          </div>
                          <div className="df">
                            <div className="flx50 df jcs mr16">
                              <div className="add-more-sec df aic">
                                <label
                                  htmlFor={`food_${value.id}`}
                                  className="v-center"
                                >
                                  <input
                                    type="checkbox"
                                    className="mr8 cp food-checkbox"
                                    id={`food_${value.id}`}
                                    name={`food_${value.id}`}
                                    checked={value.food === "1"}
                                    onChange={(e) =>
                                      handleEditPriceSection(
                                        currencyLabel,
                                        e.target.checked ? "1" : "",
                                        "food"
                                      )
                                    }
                                  />
                                  Food & Accommodation at the flying location
                                </label>
                              </div>
                            </div>
                            <div className="flx50 df jce">
                              <div
                                className="fc4 cp fs24 mt8 mr16"
                                onClick={() =>
                                  handleDeletePriceSection(currencyLabel)
                                }
                              >
                                <MdDelete />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Price Section End Here */}

              <div className="meta-grp bg8 pl20 pr20 pt20 pb10 mb24 mt24">
                <div className="form-group-settings name">
                  <p className="fc15 fw6 fs14 ls1 mb8">
                    Small Title <span className="fc4">*</span>
                  </p>
                  <input
                    type="text"
                    id="smallTitle"
                    name="smallTitle"
                    value={smallTitle}
                    placeholder="Enter Small title"
                    onChange={(e) => setSmallTitle(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="tags mb30">
                  <p className="fc15 fw6 fs14 ls1 mb8">Tags</p>
                  <MultiselectDropdown
                    options={optionsTags}
                    selectedOptions={selectedOptionsTags}
                    onSelectedOptionsChange={handleSelectedTagsOptionsChange}
                    showDropdown={true}
                  />
                </div>
                <div className="form-group-settings name rel-blogs">
                  <p className="fc15 fw6 fs14 ls1 mb12">Instructor</p>
                  <div
                    className="chips-container cp"
                    onClick={() => {
                      getAllInstructorData();
                      setShowBlogsManually(true);
                    }}
                  >
                    {selectedIntructor && selectedIntructor.length === 0 ? (
                      <p className="fs16 fc5">Select Instructor </p>
                    ) : (
                      selectedIntructor &&
                      selectedIntructor.map((blg) => (
                        <div key={blg.user_id} className="chip ls1 lh14">
                          {blg.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedBlogs(blg.user_id);
                            }}
                            className="close-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="form-group-settings name rel-blogs">
                  <p className="fc15 fw6 fs14 ls1 mb12">Advance Course</p>
                  <div
                    className="chips-container cp"
                    onClick={() => {
                      getAdvanceCourseList();
                      setShowAdvanceCourseManually(true);
                    }}
                  >
                    {selectedAdvanceCourse && selectedAdvanceCourse.length === 0 ? (
                      <p className="fs16 fc5">Select Advance Course </p>
                    ) : (
                      selectedAdvanceCourse &&
                      selectedAdvanceCourse.map((RelCourse) => (
                        <div
                          key={RelCourse.course_id}
                          className="chip ls1 lh14"
                        >
                          {RelCourse.course_name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAdvanceSelectedCourse(RelCourse.course_id);
                            }}
                            className="close-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="form-group-settings name rel-blogs">
                  <p className="fc15 fw6 fs14 ls1 mb12">Related Course</p>
                  <div
                    className="chips-container cp"
                    onClick={() => {
                      getRelCourseList();
                      setShowRelCourseManually(true);
                    }}
                  >
                    {selectedRelCourse && selectedRelCourse.length === 0 ? (
                      <p className="fs16 fc5">Select Related Course </p>
                    ) : (
                      selectedRelCourse &&
                      selectedRelCourse.map((RelCourse) => (
                        <div
                          key={RelCourse.course_id}
                          className="chip ls1 lh14"
                        >
                          {RelCourse.course_name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedCourse(RelCourse.course_id);
                            }}
                            className="close-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
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
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group-settings name">
                      <p className="fc15 fw6 fs14 ls1">Meta Description</p>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        placeholder="Enter meta description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        autoComplete="off"
                      ></textarea>
                    </div>
                    <div className="tags mb30">
                      <p className="fc15 fw6 fs14 ls1 mb12">Meta Keywords</p>
                      <MultiselectDropdown
                        options={optionsTags}
                        selectedOptions={selectedOptionsMetaKeyword}
                        onSelectedOptionsChange={
                          handleSelectedMetaKeyWordOptionsChange
                        }
                        showDropdown={false}
                      />
                    </div>

                     <div className="flx30 mr16">
                          <SingleDropdown
                            label="Display Status"
                            options={optionsDisplay}
                            selectedOption={displayStatus}
                            onSelect={handleDisplaySelect}
                            compulsory={<span className="fc4">*</span>}
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
                    checked={status === "1"}
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
                    checked={status === "2"}
                    onChange={handleStatusChange}
                  />
                  Draft
                </label>
                <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="reject"
                    value="3"
                    checked={status === "0"}
                    onChange={handleStatusChange}
                  />
                  Reject
                </label>
              </div>
              <div className="add-more box-center mt24">
                <button
                  type="button"
                  className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
                  onClick={handleSubmit}
                >
                  {id !== undefined ? "Update" : "Submit"}
                </button>
              </div>
              {showBlogsManually && (
                <SidePopup
                  show={showBlogsManually}
                  onClose={() => {
                    setShowBlogsManually(false);
                    resetAPIHeader();
                  }}
                >
                  <div className="p12">
                    <div className="sidepop-top">
                      <div className="v-center jcsb">
                        <p>Select Instructor</p>
                        <button
                          onClick={() => {
                            enableScroll();
                            setShowBlogsManually(false);
                            resetAPIHeader();
                          }}
                          className="fs18 fc1 bg5 cp"
                        >
                          X
                        </button>
                      </div>
                      <div className="builder-filters blog-popup mt12">
                        <InputSearch
                          onSearch={handleBlogSearch}
                          placeholder={"Search.."}
                        />
                      </div>
                    </div>
                    <div className="grp-packages">
                      {loading && (
                        <div className="box-center mt24">
                          <SmallLoader />
                        </div>
                      )}
                      {instructorData && instructorData.length < 1 && (
                        <div className="no-record-found-text">
                          {displayMsg.message}
                        </div>
                      )}
                      {instructorData &&
                        !loading &&
                        instructorData.map((blogItem) => (
                          <div
                            key={blogItem.user_id}
                            className={`popup-card-wrapper brd1 pt16 pb16 pl8 pr8 df mt24 mb24 cp ${
                              selectedIntructor &&
                              selectedIntructor.some(
                                (selectedIntructor) =>
                                  selectedIntructor.user_id === blogItem.user_id
                              )
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleBlogSelection(blogItem)}
                          >
                            <div className="left-package-image">
                              <img
                                src={blogItem.user_image}
                                alt={blogItem.name}
                              />
                            </div>
                            <div className="right-package-image pl16">
                              <div className="fs14 fw5 fc1 ls1 captw lh18">
                                {blogItem.name}
                                <a
                                  href={blogItem.url}
                                  target="_blank"
                                  className="fc5 fs12 ml8"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FaExternalLinkAlt />
                                </a>
                              </div>
                              <div className="fs14 pt24 fc5 ls1 lh22 text-row lc2">
                                {blogItem.experts_in}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </SidePopup>
              )}
              {showRelCourseManually && (
                <SidePopup
                  show={showRelCourseManually}
                  onClose={() => {
                    setShowRelCourseManually(false);
                    resetRelAPIHeader();
                  }}
                >
                  <div className="p12">
                    <div className="sidepop-top">
                      <div className="v-center jcsb">
                        <p>Select Instructor</p>
                        <button
                          onClick={() => {
                            enableScroll();
                            setShowRelCourseManually(false);
                            resetRelAPIHeader();
                          }}
                          className="fs18 fc1 bg5 cp"
                        >
                          X
                        </button>
                      </div>
                      <div className="builder-filters blog-popup mt12">
                        <InputSearch
                          onSearch={handleRelCourseSearch}
                          placeholder={"Search.."}
                        />
                      </div>
                    </div>
                    <div className="grp-packages">
                      {loading && (
                        <div className="box-center mt24">
                          <SmallLoader />
                        </div>
                      )}
                      {relCourseData && relCourseData.length < 1 && (
                        <div className="no-record-found-text">
                          {displayMsg.message}
                        </div>
                      )}
                      {relCourseData &&
                        !loading &&
                        relCourseData.map((relCourse) => (
                          <div
                            key={relCourse.course_id}
                            className={`popup-card-wrapper brd1 pt16 pb16 pl8 pr8 df mt24 mb24 cp ${
                              selectedRelCourse &&
                              selectedRelCourse.some(
                                (selectedRelCourse) =>
                                  selectedRelCourse.course_id ===
                                  relCourse.course_id
                              )
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleRelCourseSelection(relCourse)}
                          >
                            <div className="left-package-image ">
                              <img
                                src={relCourse.coverimage}
                                alt={relCourse.course_name}
                              />
                            </div>
                            <div className="right-package-image pl16">
                              <div className="fs14 fw5 fc1 ls1 captw lh18">
                                {relCourse.course_name}
                                <a
                                  href={relCourse.course_url}
                                  target="_blank"
                                  className="fc5 fs12 ml8"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FaExternalLinkAlt />
                                </a>
                              </div>
                              <div
                                className="fs14 pt24 fc5 ls1 lh22 text-row lc2 sub-overview"
                                dangerouslySetInnerHTML={{
                                  __html: relCourse.content,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </SidePopup>
              )}
               {showAdvanceCourseManually && (
                <SidePopup
                  show={showAdvanceCourseManually}
                  onClose={() => {
                    setShowAdvanceCourseManually(false);
                    resetAdvanceAPIHeader();
                  }}
                >
                  <div className="p12">
                    <div className="sidepop-top">
                      <div className="v-center jcsb">
                        <p>Select Courses</p>
                        <button
                          onClick={() => {
                            enableScroll();
                            setShowAdvanceCourseManually(false);
                            resetAdvanceAPIHeader();
                          }}
                          className="fs18 fc1 bg5 cp"
                        >
                          X
                        </button>
                      </div>
                      <div className="builder-filters blog-popup mt12">
                        <InputSearch
                          onSearch={handleAdvacneCourseSearch}
                          placeholder={"Search.."}
                        />
                      </div>
                    </div>
                    <div className="grp-packages">
                      {loading && (
                        <div className="box-center mt24">
                          <SmallLoader />
                        </div>
                      )}
                      {advanceCourseData && advanceCourseData.length < 1 && (
                        <div className="no-record-found-text">
                          {displayMsg.message}
                        </div>
                      )}
                      {advanceCourseData &&
                        !loading &&
                        advanceCourseData.map((relCourse) => (
                          <div
                            key={relCourse.course_id}
                            className={`popup-card-wrapper brd1 pt16 pb16 pl8 pr8 df mt24 mb24 cp ${
                              selectedAdvanceCourse &&
                              selectedAdvanceCourse.some(
                                (selectedAdvanceCourse) =>
                                  selectedAdvanceCourse.course_id ===
                                  relCourse.course_id
                              )
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleAdvanceCourseSelection(relCourse)}
                          >
                            <div className="left-package-image ">
                              <img
                                src={relCourse.coverimage}
                                alt={relCourse.course_name}
                              />
                            </div>
                            <div className="right-package-image pl16">
                              <div className="fs14 fw5 fc1 ls1 captw lh18">
                                {relCourse.course_name}
                                <a
                                  href={relCourse.course_url}
                                  target="_blank"
                                  className="fc5 fs12 ml8"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FaExternalLinkAlt />
                                </a>
                              </div>
                              <div
                                className="fs14 pt24 fc5 ls1 lh22 text-row lc2 sub-overview"
                                dangerouslySetInnerHTML={{
                                  __html: relCourse.content,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </SidePopup>
              )}
            </Card>
            {id !== undefined &&
              courseDetailData.course_status === "1" &&
              courseDetailData.detail_page_url && (
                <WebsiteUrl url={courseDetailData.detail_page_url} />
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

export default CourseDetail;
