import React, { useState, useRef, useEffect, useMemo } from "react";
import "../Feedback/Feedback.css";
import Card from "../../components/Card";
import { FaReply, FaHistory, FaFilter } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowUpDownFill } from "react-icons/ri";
import SearchInput from "../../components/SearchInput.js";
import { useTitle } from "../../hooks/useTitle.js";
import { giveTextColor } from "../../helpers/textColors.js";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip.js";
import { MdCall, MdOutlineMail } from "react-icons/md";
import Popup from "../../components/Popup/Popup.js";
import SingleDropdown from "../../components/SingleDropdown.js";
import MultiselectDropdown from "../../components/MultiSelectDropdown.js";
import Dropdown from "../../components/Dropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import {
  addDays,
  subDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subMonths,
  subWeeks,
} from "date-fns";
import SidePopup from "../../components/Popup/SidePopup.js";
import CommentHistory from "./CommentHistory.js";
import axios from "axios";
import constant from "../../constant/constant.js";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import SmallLoader from "../../components/SmallLoader.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MultiDropdown from "../../components/MultiDropdown.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const Feedback = () => {
  useTitle("Feeback List - Flapone Aviation");
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const limit = 10;
  const [recordList, setRecordList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("feedback");
  const [recordListHistory, setRecordListHistory] = useState([]);
  const [allApiFilter, setAllApiFilter] = useState([]);
  const [clearSignal, setClearSignal] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [holdLastPop, setHoldLastPop] = useState("");
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [date, setDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateOptions, setDateOptions] = useState([]);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [allApidata, setAllApiData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [filterApiStatus, setFilterApiStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState(0);
  var oldFilter = {};
  const initial_obj = {
    page_type: id ? id : selectedTab,
    dateOptionsselect: "",
    dateRangeValue: `${format(subDays(new Date(), 30), "dd-MM-yyyy")} | ${format(new Date(), "dd-MM-yyyy")}`,
    dateRangeValuefilter: "",
    dateTimeType: "",
    statusFilter: "",
    typeFilter: "",
    checkedTeamItems: "",
    searchBy: "",
    searchByValue: "",
  };
  const [listFilter, setListFilter] = useState({});
  const [teamsData, setTeamsData] = useState([]);
  const [checkedTeamItems, setCheckedTeamItems] = useState([]);
  const [commentData, setCommentData] = useState({});
  const [replyFormData, setreplyFormData] = useState({
    tid: "",
    status: {},
    comment: "",
    attachment: "",
    email: [],
    cc: [],
  });
  const [replyForm, setReplyForm] = useState(false);
  const [dateTimeType, setDateTimeType] = useState("Custom");
  const [commentHistoryPopup, setCommentHistoryPopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [email, setEmail] = useState([]);

  const [sortBy, setSortBy] = useState("date_long");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeSortColumn, setActiveSortColumn] = useState("date_long");

  const applyFilter = async () => {
    setFilterApplyStatus(true);
    setAllApiData([]);
    let updatefilter = {
      ...listFilter,
      page_type: selectedTab,
      dateOptionsselect: date,
      dateRangeValue: `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      dateRangeValuefilter: dateRangeValue,
      dateTimeType: dateTimeType,
      statusFilter: statusFilter,
      typeFilter: typeFilter,
      checkedTeamItems: checkedTeamItems,
      searchBy: searchBy,
      searchByValue: searchValue,
    };
    var getoldfilter = localStorage.getItem("allfilterstudent");
    if (getoldfilter) {
      oldFilter = JSON.parse(getoldfilter);
    }
    oldFilter[selectedTab] = updatefilter;
    localStorage.setItem("allfilterstudent", JSON.stringify(oldFilter));

    setListFilter(updatefilter);
    setPageNum(1);
    closeFilter();
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

  const updateSetListingFilter = async (clearcall = 0) => {
    let updatefilter = {
      ...listFilter,
      ...initial_obj,
      page_type: id ? id : selectedTab,
      dateRangeValue:
        clearcall === 0
          ? `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`
          : "",
      statusFilter:
        clearcall === 0
          ? ["open", "follow-up", "on-hold", "transferred", "under_review"]
          : [],
    };
    setListFilter(updatefilter);
  };

  const FilterAllStateClear = (clearcall = 0) => {
    setDate("");
    setDateLabel("Select Date");
    setShowDateInput(false);
    setCheckedTeamItems([...teamsData]);
    setSearchBy("");
    setSearchLabel("Search By");
    setSearchValue("");
    if (clearcall === 1) {
      setDateTimeType("Today");
    } else {
      setDateTimeType("Custom");
    }
    if (clearcall === 1) {
      setStatusFilter([]);
    } else {
      setStatusFilter([
        "open",
        "follow-up",
        "on-hold",
        "transferred",
        "under_review",
      ]);
    }

    setTypeFilter({ label: "Select Status", value: "" });
    setClearSignal(true);
    setTimeout(() => setClearSignal(false), 0);
    setPageNum(1);
    setTotalPageNum(0);
    setAllApiData([]);
    if (clearcall === 1) {
      setDateRangeValue([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
  };

  useEffect(() => {
    if (filterApiStatus) {
      FilterAllStateClear();
      setLocalStorage();
    }
  }, [selectedTab, filterApiStatus]);

  useEffect(() => {
    if (listFilter.page_type !== undefined) {
      getAllFilter();
    }
  }, [selectedTab]);

  const handleDateChange = (option) => {
    setDate(option.value);
    setDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
      setShowDateInput(true);
    } else {
      setShowDateRangePicker(false);
      setShowDateInput(false);
    }
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
        if (currenttabfilter && currenttabfilter["dateOptionsselect"]) {
          let filterdateobj = dateOptions.find(
            (item) => item.value === currenttabfilter["dateOptionsselect"]
          );
          if (filterdateobj) {
            handleDateChange(filterdateobj);
            setShowDateRangePicker(false);
            setShowDateRangeCalendar(false);
          }
        }
        if (currenttabfilter && currenttabfilter["statusFilter"]) {
          setStatusFilter(currenttabfilter["statusFilter"]);
        }
        if (currenttabfilter && currenttabfilter["typeFilter"]) {
          setTypeFilter(currenttabfilter["typeFilter"]);
        }
        if (currenttabfilter && currenttabfilter["dateRangeValuefilter"]) {
          setDateRangeValue(currenttabfilter["dateRangeValuefilter"]);
        }
        if (currenttabfilter && currenttabfilter["dateTimeType"]) {
          setDateTimeType(currenttabfilter["dateTimeType"]);
        }
        if (currenttabfilter && currenttabfilter["checkedTeamItems"]) {
          setCheckedTeamItems(currenttabfilter["checkedTeamItems"]);
        }
        if (currenttabfilter && currenttabfilter["searchBy"]) {
          let filterdateobj = searchByOptions.find(
            (item) => item.value === currenttabfilter["searchBy"]
          );
          if (filterdateobj) {
            handleSearchByChange(filterdateobj);
            setShowSearchInput(true);
          }
        }
        if (currenttabfilter && currenttabfilter["searchByValue"]) {
          setSearchValue(currenttabfilter["searchByValue"]);
        }
      } else {
        updateSetListingFilter();
      }
    } else {
      updateSetListingFilter();
    }
  };
  const handleEmailChange = (newEmail) => {
    setreplyFormData((prevData) => ({
      ...prevData,
      email: newEmail,
    }));
  };

  const handleCCEmailChange = (newccEmail) => {
    setreplyFormData((prevData) => ({
      ...prevData,
      cc: newccEmail,
    }));
  };
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [searchBy, setSearchBy] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState({
    label: "Select Status",
    value: "",
  });
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [emailOptions, setEmailOptionsSug] = useState([]);
  const [searchByOptions, setSearchByOptions] = useState([]);
  const dateRangePickerRef = useRef(null);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  const closeReplyForm = () => {
    setReplyForm(false);
    setreplyFormData({
      tid: "",
      status: {},
      comment: "",
      attachment: "",
      email: [],
      cc: [],
    });
    setSubmitLoader(false);
    setErrorMsg({});
  };
  const handleReplyForm = (ticketId) => {
    let finddata = recordList.find((item) => item.id === ticketId);
    if (finddata) {
      replyFormData["email"] = finddata.email_to;
      replyFormData["cc"] = finddata.reply_to;
      replyFormData["tid"] = ticketId;
      setreplyFormData(replyFormData);
    }
  };

  const handleAssignedChange = (ticketId, newAssigned) => {
    setRecordList((prevList) =>
      prevList.map((feedback) =>
        feedback.ticketId === ticketId
          ? { ...feedback, assigned: newAssigned }
          : feedback
      )
    );
    assignEnquiry(ticketId, newAssigned);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setreplyFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
    ];
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      uploadAttacment(selectedFile);
    } else {
      alert(
        "Invalid file type. Please upload a valid file (doc, pdf, jpg, jpeg, png)."
      );
      e.target.value = null;
    }
  };
  function validateInput(obj) {
    const errors = {};

    // Validate 'status'
    if (
      !obj.status ||
      typeof obj.status.value !== "string" ||
      ![
        "open",
        "closed",
        "resolved",
        "follow-up",
        "on-hold",
        "transferred",
        "under_review",
        "spam",
      ].includes(obj.status.value)
    ) {
      errors.status = "Status must be a valid string value.";
    }

    // Validate 'comment'
    if (typeof obj.comment !== "string" || obj.comment.trim() === "") {
      errors.comment = "Comment must be a non-empty string.";
    }

    // Validate 'email'
    if (Array.isArray(obj.email) && obj.email.length > 0) {
      obj.email.forEach((em) => {
        if (!validateEmail(em.value)) {
          if (!errors.email) errors.email = []; // Initialize array if not already
          errors.email.push("Invalid email: " + em.value);
        }
      });
    } else if (!Array.isArray(obj.email) || obj.email.length === 0) {
      errors.email = "Enter email and (press enter ↵ OR Comma (,))";
    }

    // Validate 'cc'
    if (Array.isArray(obj.cc) && obj.cc.length > 0) {
      obj.cc.forEach((ccItem) => {
        if (
          typeof ccItem.value !== "string" ||
          ccItem.value.trim() === "" ||
          !validateEmail(ccItem.value)
        ) {
          if (!errors.cc) errors.cc = []; // Initialize array if not already
          errors.cc.push("Invalid email: " + ccItem.value);
        }
      });
    }

    // Convert errors in cc and email to strings
    if (Array.isArray(errors.email)) errors.email = errors.email.join(", ");
    if (Array.isArray(errors.cc)) errors.cc = errors.cc.join(", ");
    setErrorMsg(errors);
    return Object.keys(errors).length > 0 ? 1 : 0;
  }

  // Helper function to validate email format using regular expression
  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  const handleCommentHistoryPopup = (ticketId) => {
    setHoldLastPop(ticketId);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/feedback_list.php?fun=getcommunicationhis`,
      headers: { "Auth-Id": user.auth_id },
      data: { ticketid: ticketId },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setCommentData({ ...response.data.data.list });
        } else {
          setCommentData({});
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const handleSubmit = () => {
    if (validateInput(replyFormData)) {
      return;
    }
    setSubmitLoader(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/feedback_list.php?fun=postreply`,
      headers: { "Auth-Id": user.auth_id },
      data: replyFormData,
    })
      .then(function (response) {
        if (response.data.data.status === "0") {
          if (Object.keys(response.data.data.error).length > 0) {
            setErrorMsg(response.data.data.error);
          } else {
            toast.error(response.data.data.msg);
          }
        } else {
          toast.success(response.data.data.msg);
          setreplyFormData({
            tid: "",
            status: {},
            comment: "",
            attachment: "",
            email: [],
            cc: [],
          });
          setReplyForm(false);
          applyFilter();
        }
        setSubmitLoader(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  function uploadAttacment(file) {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        `${constant.base_url}/admin/feedback_list.php?fun=upload_images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Auth-Id": user.auth_id,
          },
        }
      )
      .then((response) => {
        if (response.data.data.status == "1") {
          let uploadedUrl = response.data.data.image.url;
          replyFormData["attachment"] = uploadedUrl;
          setreplyFormData(replyFormData);
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Handle error
      });
  }

  const handleSearchByChange = (option) => {
    setSearchBy(option.value);
    setSearchLabel(option.label);
    if (option.value) {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
  };

  const handleStatusFilterChange = (value) => {
    const index = statusFilter.indexOf(value);
    if (index === -1) {
      setStatusFilter([...statusFilter, value]);
    } else {
      const updatedValues = [...statusFilter];
      updatedValues.splice(index, 1);
      setStatusFilter(updatedValues);
    }
  };
  const handleTypeFilterChange = (option) => {
    setTypeFilter(option);
  };
  const toggleDateRangeCalendar = () => {
    setShowDateRangeCalendar(!showDateRangeCalendar);
  };
  const handleDateRangeChange = (item) => {
    setDateTimeType("");
    setDateRangeValue([item.selection]);
  };
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const handleClickOutside = (event) => {
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target)
    ) {
      setShowDateRangePicker(false);
      setShowDateRangeCalendar(false);
    }
  };
  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };
  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };
  useEffect(() => {
    if (showDateRangePicker || showDateRangeCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateRangePicker, showDateRangeCalendar]);

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
      const aValue = a[sortBy] ? a[sortBy] : ""; // Use nullish coalescing to handle null/undefined
      const bValue = b[sortBy] ? b[sortBy] : ""; // Use nullish coalescing to handle null/undefined

      // Use localeCompare for string comparison, numeric for id
      if (sortBy === "id" || sortBy === "date_long") {
        return sortDirection === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      } else if (sortBy === "rm_obj") {
        const labelA = aValue.label || "";
        const labelB = bValue.label || "";

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

  useEffect(() => {
    getAllFilter();
  }, []);

  useEffect(() => {
    if (listFilter.page_type !== undefined) {
      getListRecord();
    }
  }, [listFilter]);

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

  const assignEnquiry = async (enqid, assignid) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/feedback_list.php?fun=assignedenqtoagent`,
      headers: { "Auth-Id": user.auth_id },
      data: { enquiry_id: enqid, agent_id: assignid },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: "post",
      url: `${constant.base_url}/admin/feedback_list.php?fun=getlistrecord`,
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
  const getAllFilter = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/feedback_list.php?fun=getallfilter`,
      headers: { "Auth-Id": user.auth_id },
      data: { filter: listFilter },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          const filterList = response.data.data.filterlist;

          setAllApiFilter(filterList);
          setTeamsData([...JSON.parse(filterList.teamsData)]);
          if (checkedTeamItems.length <= 0) {
            setCheckedTeamItems([...JSON.parse(filterList.teamsData)]);
          }

          setDateOptions([...JSON.parse(filterList.dateMoreOptions)]);
          setStatusOptions([...JSON.parse(filterList.statusOptions)]);
          setTypeOptions([...JSON.parse(filterList.statusOptions)]);
          setAgentOptions([...JSON.parse(filterList.agentOptions)]);
          setSearchByOptions([...JSON.parse(filterList.searchByOptions)]);
          setEmailOptionsSug([...JSON.parse(filterList.all_email_ids)]);

          setFilterApiStatus(true);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };
  const staticRanges = [
    {
      label: "Today",
      range: () => ({
        startDate: startOfToday(),
        endDate: new Date(),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[0].range();
        if (dateTimeType === "Today") {
          return true;
        } else if (!dateTimeType) {
          if (dateRangeValue[0].startDate.getTime() === startDate.getTime()) {
            setDateTimeType("Today");
            return true;
          }
        }
        return false; // Explicitly return false if condition is not met
      },
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: startOfYesterday(),
        endDate: startOfYesterday(),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[1].range();
        if (dateTimeType === "Yesterday") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("Yesterday");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "This Week",
      range: () => ({
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[2].range();
        if (dateTimeType === "This Week") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("This Week");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "Last Week",
      range: () => ({
        startDate: startOfWeek(subWeeks(new Date(), 1)),
        endDate: endOfWeek(subWeeks(new Date(), 1)),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[3].range();
        if (dateTimeType === "Last Week") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("Last Week");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[4].range();
        if (dateTimeType === "This Month") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("This Month");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
      isSelected: () => {
        const { startDate, endDate } = staticRanges[5].range();
        if (dateTimeType === "Last Month") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() === startDate.getTime() &&
            dateRangeValue[0].endDate.getTime() === endDate.getTime()
          ) {
            setDateTimeType("Last Month");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "All Time",
      range: () => ({
        startDate: new Date(2021, 0, 1),
        endDate: new Date(),
      }),
      hasCustomRendering: true,
      isSelected: () => {
        const { startDate, endDate } = staticRanges[6].range();
        if (dateTimeType === "All Time") {
          return true;
        } else if (!dateTimeType) {
          if (dateRangeValue[0].startDate.getTime() === startDate.getTime()) {
            setDateTimeType("All Time");
            return true;
          }
        }
        return false;
      },
    },
    {
      label: "Custom",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      hasCustomRendering: true,
      isSelected: () => {
        const { startDate, endDate } = staticRanges[7].range();
        if (dateTimeType === "Custom") {
          return true;
        } else if (!dateTimeType) {
          if (
            dateRangeValue[0].startDate.getTime() &&
            dateRangeValue[0].endDate.getTime()
          ) {
            setDateTimeType("Custom");
            return true;
          }
        }
        return false;
      },
    },
  ];

  const selectRange = () => {
    for (let i = 0; i < staticRanges.length; i++) {
      if (staticRanges[i].isSelected()) {
        // Once a match is found, exit the loop
        break; // Exit the loop after the first successful match
      }
    }
  };
  // Call the function to start the check
  selectRange();

  const filterLabels = {
    page_type: "Page Type",
    datetypefilter: "Date Type",
    dateOption: "Date Type",
    instructorselect: "Faculty",
    dateRangeValue: "Date Range",
    statusFilter: "Status",
    searchBy: "Search By",
    searchByValue: "Search Value",
    checkedTeamItems: "Team",
  };
  const [filterCount, setFilterCount] = useState(0);

  const [filterApplyStatus, setFilterApplyStatus] = useState(false);

  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };
  return (
    <>
      {filterApiStatus && (
        <>
          <div className="df aic pt8 pb8 inner-header fww">
            <div className={`df fdc flx75`}>
              <div className="flx1 fs22 fw6 fc14 df">
                <h1>Feedback</h1>
              </div>
              <div className="fs14 fc5 fw4 mt8 lh18">
                Access and organize your upcoming, ongoing, and completed
                classes. Stay updated on schedules, materials, and class status.
              </div>
            </div>
          </div>
          <Card className="bg5 mt16 pb16">
            <div className="myteam-filters v-center  pl16 brd-b1 pb12 pt12 fww">
              <div className="left-side-filter v-center fww">
                <div className="date-label mb8 ">
                  <Dropdown
                    label={dateLabel}
                    options={dateOptions}
                    selectedValue={date}
                    onValueChange={handleDateChange}
                  />
                </div>

                <div
                  className={`report-date ${showDateInput && "ml8"} mr8 mb8`}
                >
                  {showDateInput && dateRangeValue && (
                    <div
                      className="date-range-input"
                      onClick={toggleDateRangeCalendar}
                      style={{
                        cursor: "pointer",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        color: "#7b7b7b",
                        fontSize: "14px",
                      }}
                    >
                      {`${format(
                        dateRangeValue[0].startDate,
                        "dd/MM/yyyy"
                      )} - ${format(dateRangeValue[0].endDate, "dd/MM/yyyy")}`}
                    </div>
                  )}

                  {showDateRangePicker && (
                    <div ref={dateRangePickerRef}>
                      <DateRangePicker
                        onChange={handleDateRangeChange}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={dateRangeValue}
                        direction="horizontal"
                        staticRanges={staticRanges}
                        renderStaticRangeLabel={(range) => (
                          <span>{range.label}</span>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className=" mb8 hide-mobile">
                <MultiDropdown
                  label={"Status"}
                  options={statusOptions}
                  selectedValues={statusFilter}
                  onSelect={handleStatusFilterChange}
                  chips={2}
                />
              </div>

              <Tooltip title={"More Filter"}>
                <FaFilter
                  className="cp fs16 mb8 ml12 fc5"
                  onClick={handleFilterClick}
                />
              </Tooltip>
              <button
                className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mb8"
                onClick={applyFilter}
              >
                Apply
              </button>
              {filterStatus > 0 && (
                <button
                  className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb8"
                  onClick={clearFilter}
                >
                  Clear
                </button>
              )}
            </div>
            {filterApplyStatus && (
              <FilteredDataDisplay
                filterData={listFilter}
                labels={filterLabels}
                onClearAll={clearFilter}
                onFilterCountChange={handleFilterCountChange}
                listOptions={{
                  statusOptions,
                }}
                border={true}
              />
            )}
            <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
              Total Results: {allApidata.total_count}
            </div>
            <div
              className="booked table-container df w100 fdc mt16"
              style={{ overflow: "auto" }}
            >
              <table className="mylead-table cp wsnw">
                <thead className="w100">
                  <tr>
                    <th
                      onClick={() => handleSortByChange("ticketId")}
                      className={activeSortColumn === "ticketId" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        ID
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("date_long")}
                      className={activeSortColumn === "date_long" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        Date
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("name")}
                      className={activeSortColumn === "name" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        Student
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("issueType")}
                      className={activeSortColumn === "issueType" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        Type
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("inquiry")}
                      className={activeSortColumn === "inquiry" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        Inquiry
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("lastComment")}
                      className={
                        activeSortColumn === "lastComment" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        Comment
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("status")}
                      className={activeSortColumn === "status" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        Status
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleSortByChange("rm_obj")}
                      className={activeSortColumn === "rm_obj" ? "fc1" : ""}
                    >
                      <p className="box-center">
                        Assigned
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th>
                      <p className="box-center">Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody className="subject-list">
                  {recordList.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-holidays p20">
                        No Data Available
                      </td>
                    </tr>
                  ) : (
                    sortList.map((feedback, index) => (
                      <tr key={index}>
                        <td>{feedback.ticketId}</td>
                        <td>{feedback.date}</td>
                        <td>
                          <div className="instructor-info ">
                            <img
                              src={feedback.photo ? feedback.photo : Avatar}
                              alt="Instructor"
                              className="instructor-image"
                            />
                            <div className="instructor-details df fdc ais">
                              <p className="pb2">
                                {feedback.name && (
                                  <Tooltip title={feedback.name}>
                                    {feedback.name.length > 10
                                      ? `${feedback.name.slice(0, 10)}...`
                                      : feedback.name}
                                  </Tooltip>
                                )}
                              </p>
                              <span className="ls1 fc5 df gender-stud pb2">
                                <span className="fs12 ls1">
                                  {feedback.user_gender_age}
                                </span>
                                {feedback.email && (
                                  <Tooltip title={feedback.email}>
                                    <MdOutlineMail className={`fs16 ml8`} />
                                  </Tooltip>
                                )}
                                {feedback.mobile && (
                                  <Tooltip title={feedback.mobile}>
                                    <MdCall className={`fs16 ml8`} />
                                  </Tooltip>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{feedback.issueType}</td>
                        <td className="feedback-inquiry scrollable-cell">
                          <p>{feedback.inquiry}</p>
                        </td>
                        <td className="feedback-last-comment scrollable-cell">
                          <p>{feedback.lastComment}</p>
                        </td>
                        <td>
                          <span
                            style={{
                              color: giveTextColor(
                                feedback.status === "Open"
                                  ? "News"
                                  : feedback.status === "Under Review"
                                    ? "yellow"
                                    : feedback.status === "Resolved"
                                      ? "Completed"
                                      : "News"
                              ),
                            }}
                          >
                            {feedback.status}
                          </span>
                        </td>
                        <td className="attendance-st feed-assign">
                          <span>
                            <select
                              value={feedback.assigned}
                              className={`attendance-dropdown cp`}
                              onChange={(e) =>
                                handleAssignedChange(
                                  feedback.ticketId,
                                  e.target.value
                                )
                              }
                            >
                              {agentOptions.map((agent) => (
                                <option key={agent.value} value={agent.value}>
                                  {agent.label}
                                </option>
                              ))}
                            </select>
                          </span>
                        </td>
                        <td className="leads-tool-fix ">
                          <div className="box-center">
                            <Tooltip title={"Reply"}>
                              <FaReply
                                className="icon cp fs16 fc5 mr8"
                                onClick={() => {
                                  setReplyForm(true);
                                  handleReplyForm(feedback.ticketId);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title={"History"}>
                              <FaHistory
                                className="icon cp fs16 fc5"
                                onClick={() => {
                                  setCommentHistoryPopup(true);
                                  handleCommentHistoryPopup(feedback.ticketId);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {autoLoader && (
                <div className="box-center mb12">
                  <SmallLoader className={"mb12"} />
                </div>
              )}
            </div>
            {replyForm && (
              <Popup onClose={closeReplyForm} title={"Reply"}>
                <div className="contact-rm-form">
                  <div className="v-center jcsb mb24 reply-input">
                    <div className="w100 flx48 reply-to">
                      <p className="fc15 fw6 fs14 mb8 ls1">
                        Reply To <span className="fc4">*</span>
                      </p>
                      <MultiselectDropdown
                        options={emailOptions}
                        selectedOptions={replyFormData.email}
                        onSelectedOptionsChange={handleEmailChange}
                        showDropdown={true}
                      />
                      {errorMsg.email && (
                        <p className="form-error-messages fc4">
                          {errorMsg.email}
                        </p>
                      )}
                    </div>

                    <div className="w100 flx48">
                      <p className="fc15 fw6 fs14 mb8 ls1">Add cc</p>
                      <MultiselectDropdown
                        options={emailOptions}
                        selectedOptions={replyFormData.cc}
                        onSelectedOptionsChange={handleCCEmailChange}
                        showDropdown={true}
                      />
                      {errorMsg.cc && (
                        <p className="form-error-messages fc4">{errorMsg.cc}</p>
                      )}
                    </div>
                  </div>
                  <div className="issue w100 mb24">
                    <SingleDropdown
                      label="Select Status"
                      placeholder="Select Status"
                      options={statusOptions}
                      selectedOption={replyFormData.status}
                      onSelect={(option) =>
                        setreplyFormData({ ...replyFormData, status: option })
                      }
                      compulsory={<span className="fc4">*</span>}
                      required
                    />
                    {errorMsg.status && (
                      <p className="form-error-messages fc4">
                        {errorMsg.status}
                      </p>
                    )}
                  </div>
                  <div className="form-group-settings desc-area w100 mt12">
                    <p className="fc15 fw6 fs14 ls1">
                      Describe your concern
                      <span className="fc4">*</span>
                    </p>
                    <textarea
                      id="comment"
                      placeholder={"Describe your concern"}
                      autoComplete="off"
                      className="br4 mt8 fs14 w100 p16"
                      onChange={handleChange}
                      value={replyFormData.comment}
                    />
                    {errorMsg.comment && (
                      <p className="form-error-messages fc4">
                        {errorMsg.comment}
                      </p>
                    )}
                  </div>
                  <div className="df fdc mt16">
                    <label className="fc15 fw6 fs14 mb12 ls1">
                      Attachment(if any)
                    </label>
                    <input
                      type="file"
                      accept=".pdf, .jpg, .jpeg, .doc,.png"
                      onChange={handleFileChange}
                      className="cp"
                    />
                  </div>
                  <div className="button-container mt32 df jce">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={closeReplyForm}
                    >
                      Cancel
                    </button>
                    {!submitLoader && (
                      <button
                        type="button"
                        className="btn-blue pl16 pr16 br24 ls1 update-button"
                        onClick={() => handleSubmit()}
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
              </Popup>
            )}
            {commentHistoryPopup && (
              <Popup
                onClose={() => {
                  setCommentHistoryPopup(false);
                }}
                showButton={() => {
                  setCommentHistoryPopup(false);
                  setReplyForm(true);
                  handleReplyForm(holdLastPop);
                }}
                title={"Comment History"}
              >
                <div className="contact-rm-form">
                  <CommentHistory commentData={commentData} Tooltip={Tooltip} />

                  <div className="button-container mt32 df jce">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setCommentHistoryPopup(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Popup>
            )}

            {showFilterPopup && (
              <SidePopup show={showFilterPopup} onClose={closeFilter}>
                <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                  <p className="fs18 fc1 ">Filters</p>
                  <button className="lead-close-button" onClick={closeFilter}>
                    X
                  </button>
                </div>
                <div className="filter-lists pl16 pt16 pr16 ">
                  <>
                    {/* <div className="plan-status mb16">
                  <p className="fc15 fw6 fs14 ls1 mb8">Type</p>
                  <Dropdown
                    label={"Type"}
                    options={typeOptions}
                    selectedValue={typeFilter}
                    onValueChange={handleTypeFilterChange}
                  />
                </div> */}
                    <div className=" mb8 hide-desktop">
                      <p className="fc15 fw6 fs14 ls1 mb8">Status</p>
                      <MultiDropdown
                        label={"Status"}
                        options={statusOptions}
                        selectedValues={statusFilter}
                        onSelect={handleStatusFilterChange}
                        chips={2}
                      />
                    </div>
                    <div className="team-filter searching-drop  mb16 flx100 w100 rm">
                      <p className="fc15 fw6 fs14 ls1 mb8">Team</p>
                      <MultiLevelDropdown
                        placeholder="RM"
                        data={teamsData}
                        checkedItems={checkedTeamItems}
                        setCheckedItems={setCheckedTeamItems}
                      />
                    </div>
                    <div className="search-by-drp  mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                      <Dropdown
                        label={searchLabel}
                        options={searchByOptions}
                        selectedValue={searchBy}
                        onValueChange={handleSearchByChange}
                      />
                    </div>
                    {showSearchInput && (
                      <div className="student-filter mb8 v-center">
                        <SearchInput
                          onSearchChange={handleSearchChange}
                          placeholder={searchLabel}
                          workOrderID={searchValue}
                        />
                      </div>
                    )}
                    <div className="box-center myteam-filters">
                      <button
                        type="button"
                        className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1  cp"
                        onClick={closeFilter}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1  cp"
                        onClick={applyFilter}
                      >
                        Apply
                      </button>
                      {filterStatus > 0 && (
                        <button
                          type="button"
                          className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 cp"
                          onClick={clearFilter}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </>
                </div>
              </SidePopup>
            )}
          </Card>
          <ToastContainer position="bottom-right" />
        </>
      )}
    </>
  );
};

export default Feedback;
