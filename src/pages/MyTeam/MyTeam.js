import React, { useState, useEffect, useMemo } from "react";
import "../MyTeam/MyTeam.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { BsTrash, BsToggleOn, BsToggleOff } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { BiTransferAlt } from "react-icons/bi";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { MdEmail, MdEditDocument } from "react-icons/md";
import { HiDocumentAdd } from "react-icons/hi";
import axios from "axios";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../../components/Dropdown";
import Popup from "../../components/Popup/Popup";
import AddTeam from "../../components/Forms/AddTeam";
import { RiArrowUpDownFill } from "react-icons/ri";
import SearchInput from "../../components/SearchInput";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoPermission from "../../components/NoPermission.js";
import { useTitle } from "../../hooks/useTitle.js";
import { CiSquareChevDown } from "react-icons/ci";
import SingleDropdown from "../../components/SingleDropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdownTeam.js";
import { toUpper } from "lodash";
import MultiSearchSelectDropdown from "../../components/SearchMultiSelectDropdown";

const MyTeam = () => {
  const user = useSelector((state) => state.auth);
  useTitle("My Team - Flapone Aviation");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessRoleLimit = ["1", "2", "3","5"];
  const accessDeptLimit = ["1", "2", "3"];
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageAccess = accessRoleLimit.includes(userRole);
  const pageAccessDept = accessDeptLimit.includes(userDept);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [displayMsg, setDisplayMsg] = useState("");
  const [teamCount, setTeamCount] = useState(0);
  const [teamPageLimit, setTeamPageLimit] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [overview, setOverview] = useState("");
  const [updateBtnStatus, setUpdateBtnStatus] = useState(false);
  const [autoCheckedStatus, setautoCheckedStatus] = useState(false);
  const [autoTeamRecord, setautoTeamRecord] = useState([]);
  const [courseListOptions,setCourseListOption] = useState([]); 
  const [categoryDataOptions, setCategoryDataOptions] = useState([]);
  const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
  const [checkAssignrmco, setAssignrmco] = useState([]);
  const [agentlistoption, setAgentlistoption] = useState([]);
  const [selectAgentOption, setSelectAgentOption] = useState([]);
  const [coordinatorlistoption, setCoordinatorlistoption] = useState([]);
  const [selectCoordinatoroption, setSelectCoordinatoroption] = useState([]);

  const [leadCount, setLeadCount] = useState(0);
  const [leadCountStatus, setLeadCountStatus] = useState(false);

  
  const [param, setParam] = useState({
    status: "",
    department: "",
    role: "",
    searchby: "",
    search: "",
    overview: "",
  });
  const [isFilter, setIsFilter] = useState(false);
  const [activeSortColumn, setActiveSortColumn] = useState("");
  function getLabel(options, value) {
    const found = options.find(option => option.value === value);
    return found ? found.label : "Not Selected";
  }
  
  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
    { label: "Invited", value: "2" },
    { label: "Decline", value: "3" },
  ];

  const teamSortByOverview = [
    { label: "All", value: "" },
    { label: "Available", value: "1" },
    { label: "Not available", value: "0" },
  ];

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);

  const [locationOptions, setLocationOptions] = useState([]);

  const [status, setStatus] = useState("");
  const [department, SetDepartment] = useState("");
  const [role, setRole] = useState("");
  const [addTeamPopup, setAddTeamPopup] = useState(false);
  const [editedMember, setEditedMember] = useState(null);
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [deptLabel, setDeptLabel] = useState("Department");
  const [roleLabel, setRoleLabel] = useState("Role");
  const [statusLabel, setStatusLabel] = useState("Status");
  const [searchBy, setSearchBy] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);
  const [activePopup, setActivePopup] = useState(false);
  const [userIdToActivate, setUserIdToActivate] = useState([]);
  const [dataStatus, setDataStatus] = useState(false);
  const [filterApplyStatus, setFilterApplyStatus] = useState(false);
  const [showAutoAssignPopup, setShowAutoAssignPopup] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showEmpTransferPop, setShowEmpTransferPop] = useState(false);
  const [oldFilter, setOldFilter] = useState({});

  const handleLogout = () => {
    // Dispatch the logout action to clear user data
    dispatch(logout());
    // Redirect to the login page
    navigate("/login");
  };

  function getTeamData(pagenum, param) {
    setLoading(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        param: param,
        page_num: pagenum,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.page_number === 1) {
          setStatusLabel("Active");
          setDepartmentOptions([...response.data.data.departments]);
          setRoleOptions([...response.data.data.roles]);
          setManagerOptions([...response.data.data.managers]);
          setLocationOptions([...response.data.data.locations]);
          setTeamMembers([...response.data.data.list]);
          setTeamCount(response.data.data.total_count);
          setTeamPage(response.data.data.page_number);
          setTeamPageLimit(response.data.data.total_page);
          setDataStatus(true);
          setIsFetching(false);
          //setAutoLoader(false);
        }else{
	
        setTeamMembers([...teamMembers, ...response.data.data.list]);
	}
        setDataStatus(true);
        setIsFetching(false);
        //setAutoLoader(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  //==============Start handleScroll data====================//
  useEffect(() => {
    const scrollHandler = (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 70 && !isFetching) {
        setIsFetching(true);
        // Increment the counter using setTeamPage and use the updated value
        setTeamPage((prevPage) => {
          const newPage = prevPage + 1;
          if (newPage <= teamPageLimit) {
            getTeamData(newPage, param);
          }
          return newPage;
        });
      }
    };

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [param, isFetching, teamPageLimit]);

  //==============End handleScroll data====================//

  useEffect(() => {
    getTeamData();
  }, []);

  const handleSearchByChange = (option) => {
    const updatedParam = { ...param, searchby: option.label };
    setParam(updatedParam);
    setIsFilter(true);
setFilterApplyStatus(false);
    setSearchBy(option.value);
    setSearchLabel(option.label);

    if (option.value) {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
  };
  const searchByOptions = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Mobile", value: "mobile" },
  ];
  const handleStatusChange = (status) => {
    const updatedParam = { ...param, status: status.value };
    setParam(updatedParam);
    setStatus(status);
    setIsFilter(true);
    setFilterApplyStatus(false);
  };
  const handleDepartmentChange = (dep) => {
    const updatedParam = { ...param, department: dep.value };
    setParam(updatedParam);
    SetDepartment(dep);
    setFilterApplyStatus(false);
    setIsFilter(true);
  };
  const handleRoleChange = (role) => {
    const updatedParam = { ...param, role: role.value };
    setParam(updatedParam);
    setRole(role);
    setFilterApplyStatus(false);
    setIsFilter(true);
  };

const handleOverviewChange = (overview) => {
    const updatedParam = { ...param, overview: overview.value };
    setParam(updatedParam);
    setOverview(overview);
    setFilterApplyStatus(false);
    setIsFilter(true);
  };


  const handleSearchChange = (value) => {
    const updatedParam = { ...param, search: value };
    setParam(updatedParam);
    setFilterApplyStatus(false);
    setIsFilter(true);
  };

  const teamDataFilterChange = () => {
    getTeamData("1", param);
    setFilterApplyStatus(true);

  };
  const categoryOptions = [
    { value: "blog", label: "Blog" },
    { value: "news", label: "News" },
    { value: "awards", label: "Awards" },
    { value: "stories", label: "Success Stories" },
  ];
  const clearFilter = () => {
    setFilterApplyStatus(false);
    setShowSearchInput(false);
    setClearSignal(true);
    setTimeout(() => setClearSignal(false), 0);
    setRoleLabel("Role");
    setDeptLabel("Department");
    setStatusLabel("Status");
    setSearchLabel("Search By");
    setStatus("");
    SetDepartment("");
    setRole("");
    setOverview("");
    setIsFilter(false);
    const updatedParam = {
      ...param,
      role: "",
      department: "",
      status: "",
      searchby: "",
      search: "",
      overview: "",
    };
    setParam(updatedParam);
    getTeamData("1", updatedParam);
  };

  const openAddTeamPopup = () => {
    setAddTeamPopup(true);
  };
  const closeAddTeamPopup = () => {
    setAddTeamPopup(false);
    setEditedMember(null);
  };

  

  const handleEditTeamMember = (member) => {
    setEditedMember(member);
    setAddTeamPopup(true);
  };

  
  const toggleLeadviewStatus = (e, teamMem) => {
    if (e.target.checked) {
      teamManage(teamMem, "TeamViewStatus", 1);
      
    } else {
      teamManage(teamMem, "TeamViewStatus", 0);
    }

    if (user.role === "1") {
      setTeamMembers((prevState) =>
        prevState.map((member) =>
          member.id === teamMem.id
            ? { ...member, viewStatus: !member.viewStatus }
            : member
        )
      );
    }
  };

  const handleDeleteTeamMember = (teamMem) => {
    openActivePopup();
    setUserIdToActivate(teamMem);
  };

  const handleConfirmActive = () => {
    closeActivePopup();
    if (userIdToActivate) {
      const updatedTeamMembers = teamMembers.filter(
        (member) => member.id !== userIdToActivate.id
      );
      setTeamMembers(updatedTeamMembers);
      if (userIdToActivate) {
        teamManage(userIdToActivate, "TeamStatus", 4);
      }
    }
  };

  const closeActivePopup = () => {
    setUserIdToActivate([]);
    setActivePopup(false);
  };

  const openActivePopup = () => {
    setActivePopup(true);
  };

  const setMemberPosition = (e, teamMem) => {
    let newPosition = parseInt(e.target.value);
    setTeamMembers((prevState) =>
      prevState.map((member) =>
        member.id === teamMem.id ? { ...member, orderby: newPosition } : member
      )
    );
    teamManage(teamMem, "Position", newPosition);
  };

  function teamManage(teamMem, type, action,categoryCheckedItemsVal=[],selectedCourses=[]) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=teamManage`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        id: teamMem.id,
        type: type,
        action: action,
        categoryCheckedItemsVal:categoryCheckedItemsVal,
        selectedCourses:selectedCourses,
        leadCount:leadCount,
        leadCountStatus:leadCountStatus
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      const respdata = response.data;
      if (respdata.data.status === "0") {
        toast.error(respdata.data.msg);
      } else {
        if (respdata.data.statusonoff === "1") {
          toast.success(respdata.data.msg);
        } else if (respdata.data.statusonoff === "0") {
          toast.error(respdata.data.msg);
        }
      }
    });
  }

  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const handleSortByChange = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setActiveSortColumn(field);
  };

  const sortedTeamMembers = useMemo(() => {
    let sortedMembers = [...teamMembers];
    if (sortBy) {
      sortedMembers.sort((a, b) => {
        if (sortBy === "orderby") {
          return sortDirection === "asc"
            ? a.orderby - b.orderby
            : b.orderby - a.orderby;
        } else if (sortBy === "mobile_number") {
          return sortDirection === "asc"
            ? a.mobile_number - b.mobile_number
            : b.mobile_number - a.mobile_number;
        } else if (sortBy === "viewStatus") {
          return sortDirection === "asc"
            ? a.viewStatus - b.viewStatus
            : b.viewStatus - a.viewStatus;
        } else if (sortBy === "leadAutoAssign") {
          return sortDirection === "asc"
            ? a.leadAutoAssign - b.leadAutoAssign
            : b.leadAutoAssign - a.leadAutoAssign;
        } else if (
          a[sortBy] !== null &&
          b[sortBy] !== null &&
          a[sortBy] !== undefined &&
          b[sortBy] !== undefined
        ) {
          const comparison = a[sortBy].localeCompare(b[sortBy]);
          return sortDirection === "asc" ? comparison : -comparison;
        }
      });
    }
    return sortedMembers;
  }, [teamMembers, sortBy, sortDirection]);

  const handleTeamMember = (formData) => {
    if (editedMember) {
      const editData = {};
      editData.role_name = formData.selectRolename;
      editData.department = formData.selectDeptname;
      editData.manager = formData.selectMngrname;
      editData.role = formData.selectRole;
      editData.designation = formData.designation;
      editData.experts_in = formData.designation;
      editData.instructorAsUser = formData.instructorAsUser;

      setTeamMembers((prevState) =>
        prevState.map((member) =>
          member.id === editedMember.id ? { ...member, ...editData } : member
        )
      );

      updateUser(formData);
    } else {
      saveUsers(formData);
    }
  };

  //add a new member
  function saveUsers(formData) {
    const newMember = {
      email: formData.email,
      status: "2",
      role: formData.selectRole,
      department: formData.selectDept,
      manager: formData.selectMngr,
      rolename: formData.selectRolename,
      departmentname: formData.selectDeptname,
      managername: formData.selectMngrname,
      designation: formData.designation,
      locations: formData.locations,
      lastLogin: "",
    };

    axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=createTeamMember`,
      headers: { "Auth-Id": user.auth_id },
      data: newMember,
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }

      const respData = response.data.data;

      if (respData.error) {
        toast.error(respData.error.msg);
      }

      if (respData.created) {
        if (respData.created.length > 0) {
          toast.success(respData.created);
        }
      }

      if (respData.exist) {
        if (respData.exist.length > 0) {
          toast.error(respData.exist);
        }
      }

      if (respData.invalidmail) {
        if (respData.invalidmail.length > 0) {
          toast.error(respData.invalidmail);
        }
      }

      if (respData.createdUser) {
        respData.createdUser.map((r, i) => {
          setTeamMembers((prevState) => {
            const updatedMembers = [...prevState, r];
            return updatedMembers;
          });
        });
      }
    });
  }

  //update a user
  function updateUser(formData) {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=updateTeamMember`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        formData: formData,
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      const resp = response.data.data;
      if (resp.status === "1") {
        toast.success(resp.msg);
        if(resp.msg2){
          toast.warn(resp.msg2);
        }
      } else if (resp.status === "0") {
        toast.error(resp.msg);
      } else {
        toast.error("something went wrong try again");
      }
    });
  }

  const resendInvitaionEmail = (member) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=resendInvitationMail`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        formData: member,
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      const resp = response.data.data;
      if (resp.status === "1") {
        toast.success(resp.msg);
      } else {
        toast.error("something went wrong try again");
      }
    });
  };

  const handleOverview = (Member) => {
    navigate("/manage-profile/" + Member.id);
  };
  const appliedFilters = [
    ...(param.status ? [{ key: "Status", value: getLabel(statusOptions, param.status) }] : []),
    ...(param.department ? [{ key: "Department", value: getLabel(departmentOptions, param.department) }] : []),
    ...(param.role ? [{ key: "Role", value: getLabel(roleOptions, param.role) }] : []),
    ...(param.overview ? [{ key: "Overview", value: getLabel(teamSortByOverview, param.overview) }] : []),
    ...(param.searchby ? [{ key: "Search By", value: param.searchby }] : []),
    ...(param.search ? [{ key: "Search", value: param.search }] : []),
  ];
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  
  const handleLogView = (id) => {
    if (id) {
      navigate("/team-log/" + id);
    } else {
      toast.error("No log available for this member");
    }
  };
  const cancelAutoAssign = () =>{
    setShowAutoAssignPopup(false);
    setautoCheckedStatus(false);
    setautoTeamRecord([]);
    setCategoryCheckedItems([...categoryDataOptions]);
  }
   const checkUserLogin = (response) => {
      if (response.data.login.status === 0) {
        dispatch(logout());
        navigate("/login");
      }
    };
    useEffect(()=>{
      getAllFilter();
    },[])
    const getAllFilter = async () => {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/team.php?fun=getallfilter`,
        headers: { "Auth-Id": user.auth_id },
      })
        .then(function (response) {
          checkUserLogin(response);
          if (response.data.data.status === "1") {
            const filterList = response.data.data.filterlist;
            setCategoryDataOptions([
            ...JSON.parse(filterList.categoryDataOptions),
            ]);
            if (categoryCheckedItems.length === 0) {
            setCategoryCheckedItems([
              ...JSON.parse(filterList.categoryDataOptions),
            ]);
           
          }
            setCourseListOption([...JSON.parse(filterList.courseListOptions)]);
            setAgentlistoption([...JSON.parse(filterList.agentOptions)]);
            setCoordinatorlistoption([...JSON.parse(filterList.coordinatorassignlist)]);
          }
        })
        .catch(function (error) {
          console.error("Error during login:", error);
        });
    };

    // useEffect(() => {
    //   getCourseList();
    // }, [categoryCheckedItems]);

  const getCourseList = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_list.php?fun=getcourselist`,
      headers: { "Auth-Id": user.auth_id },
      data: { coursecategory: categoryCheckedItems },
    })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setCourseListOption([...response.data.data.data]);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };



    const handleSelectCourse = (selectedoptions) => {
     setSelectedCourses(selectedoptions);
  };


  const toggleLeadAutoAssign = (e, teamMem) => {
    if (e.target.checked) {
      setautoCheckedStatus(e.target.checked);
      setautoTeamRecord(teamMem);
      //teamManage(teamMem, "TeamAutoAssign", 1);
      setShowAutoAssignPopup(true);
    } else {
      teamManage(teamMem, "TeamAutoAssign", 0);
    }

    if (teamMem.fk_dept_id === "7" && !e.target.checked) {
      setTeamMembers((prevState) =>
        prevState.map((member) =>
          member.id === teamMem.id
            ? { ...member, leadAutoAssign: !member.leadAutoAssign }
            : member
        )
      );
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

  const handleAutoAssinedPopup = (member)=>{
      setSelectedCourses([]);
      setLeadCount(0);
      setLeadCountStatus(false);
   
      axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=getexistingcategoryassign`,
      headers: { "Auth-Id": user.auth_id },
      data: { member: member },
      })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          setLeadCount(response.data.data.data.lead_count);
          setLeadCountStatus(response.data.data.data.lead_count_status);
          setCategoryCheckedItems([...response.data.data.data.cat_arr]);
          setSelectedCourses(response?.data?.data?.data?.course_arr?.length > 0 
  ? response.data.data.data.course_arr 
  : []);

        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
      setautoCheckedStatus(true);
      setautoTeamRecord(member);
      setShowAutoAssignPopup(true);
  }
  const handleAutoAssined = () =>{
    if (!checkAnyCheckedTrue(categoryCheckedItems) && selectedCourses.length === 0) {
      toast.warn("Please Select at least Category or Course");
      return false;
    }

    if (leadCountStatus === true && leadCount < 1) {
      toast.warn("Please Enter lead count");
      return false;
    }

    if (autoTeamRecord.fk_dept_id === "7") {
      setTeamMembers((prevState) =>
        prevState.map((member) =>
          member.id === autoTeamRecord.id
            ? { ...member, leadAutoAssign: 1 }
            : member
        )
      );
    }
    teamManage(autoTeamRecord, "TeamAutoAssign", 1,categoryCheckedItems,selectedCourses);
    setautoCheckedStatus(false);
    setautoTeamRecord([]);
    setCategoryCheckedItems([...categoryDataOptions]);
    // setLeadCount(0);
    // setLeadCountStatus(false);
    setShowAutoAssignPopup(false);
  }
  const closeMovePopup = ()=>{
    setShowEmpTransferPop(false);
  }
  const handleTransferRecord = ()=>{
    setUpdateBtnStatus(true);
    if(checkAssignrmco.rm===1 && (selectAgentOption?.value===undefined || selectAgentOption?.value==="0")){
      toast.warn("Please select RM");
      setUpdateBtnStatus(false);
      return false;
    }
    if(checkAssignrmco.co===1 && (selectCoordinatoroption?.value===undefined || selectCoordinatoroption?.value==="0")){
      toast.warn("Please select Coordinator");
      setUpdateBtnStatus(false);
      return false;
    }
    axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=transferrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: { member: autoTeamRecord,selectAgentOption:selectAgentOption,selectCoordinatoroption:selectCoordinatoroption },
      })
      .then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
          toast.success(response.data.data.msg);
          teamManage(autoTeamRecord, "TeamStatus", 0);
           const updatedTeamMembers = teamMembers.map((member) =>
            member.id === autoTeamRecord.id
              ? { ...member, isToggled: 0 }
              : member
          );
          setTeamMembers(updatedTeamMembers);
          setautoTeamRecord([]);
        }else{
          toast.warn(response.data.data.msg);
        }
        setSelectAgentOption([]);
        setSelectCoordinatoroption([]);
        setShowEmpTransferPop(false);
        setUpdateBtnStatus(false);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
        setUpdateBtnStatus(false);
      });    

  }
  const handleAgentSelect = (option) => {
    setSelectAgentOption(option);
  };
  const handleCoordSelect = (option) =>{
    setSelectCoordinatoroption(option);
  }
  const toggleSwitch = (e, teamMem) => {
    if (e.target.checked) {
      teamManage(teamMem, "TeamStatus", 1);
      const updatedTeamMembers = teamMembers.map((member) =>
      member.id === teamMem.id
        ? { ...member, isToggled: !member.isToggled }
        : member
    );
    setTeamMembers(updatedTeamMembers);
    } else {
      inActiveCheckAssign(teamMem);
      setautoTeamRecord(teamMem);
      //teamManage(teamMem, "TeamStatus", 0);
    }
  };
  const inActiveCheckAssign = (teamMem) =>{
      axios({
      method: "post",
      url: `${constant.base_url}/admin/team.php?fun=checkassignornot`,
      headers: { "Auth-Id": user.auth_id },
      data: { member: teamMem },
      })
    .then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        setAssignrmco(response.data.data.data);
        if(response.data.data.data.class===1){
          handleRedirectSetFilter("batches",teamMem);
          toast.warn("Please transfer all classes from this instructor to another.")
        }
        else if(response.data.data.data.rm===1 || response.data.data.data.co===1){
          setShowEmpTransferPop(true);
        }else{
          teamManage(teamMem, "TeamStatus", 0);
           const updatedTeamMembers = teamMembers.map((member) =>
            member.id === teamMem.id
              ? { ...member, isToggled: 0 }
              : member
          );
          setTeamMembers(updatedTeamMembers);
          setautoTeamRecord([]);
        }
      }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
 


  const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
  };

const handleRedirectSetFilter = (pageTab, selectedMember) => {
  if (!selectedMember || !selectedMember.name || !selectedMember.user_id) {
    console.error("Invalid selectedMember:", selectedMember);
    return;
  }

  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setFullYear(currentDate.getFullYear() + 2);

  const dateRangeValue = `${formatDate(currentDate)} | ${formatDate(futureDate)}`;

  const updateFilter = {
    page_type: pageTab,
    instructorselect: {
      label: selectedMember.name,
      value: selectedMember.user_id,
    },
    datetypefilter: "end-date",
    dateRangeValue: dateRangeValue,
    dateRangeValuefilter: [
      {
        startDate: currentDate,
        endDate: futureDate,
        key: "selection",
      },
    ],
    datetypefilterlabel: "Batch End Date",
  };

  setOldFilter((prevState) => {
    const newFilter = {
      ...prevState,
      [pageTab]: updateFilter,
    };
    localStorage.setItem("allfilterclassmanagementoption", JSON.stringify(newFilter));
    return newFilter;
  });

   window.open("/class-management", "_blank");
};



  const handleLeadCountCheckChange = (e) => {
    setLeadCountStatus(e.target.checked);
  };


  return (
    <>
      {(pageAccess || pageAccessDept) && (
        <InnerHeader
          heading="My Team"
          txtSubHeading="Effortlessly set up your team, inviting and efficiently managing members with different roles."
          showButton={true}
          iconText="Add New Member"
          onClick={openAddTeamPopup}
        />
      )}
      <Card className="bg5 mt16 pb16">
        {pageAccess && (
          <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww">
            <div className="left-side-filter v-center fww">
              <div className="status-filter mr8">
                {statusOptions.length > 0 && (
                  <Dropdown
                    label={statusLabel}
                    options={statusOptions}
                    selectedValue={status}
                    onValueChange={handleStatusChange}
                    clearSignal={clearSignal}
                  />
                )}
              </div>

              <div className="dept-filter mr8">
                {departmentOptions.length > 0 && (
                  <Dropdown
                    label={deptLabel}
                    options={[
                      { label: "All", value: "" },
                      ...departmentOptions,
                    ]}
                    selectedValue={department}
                    onValueChange={handleDepartmentChange}
                    clearSignal={clearSignal}
                  />
                )}
              </div>

              <div className="role-filter mr12">
                {roleOptions.length > 0 && (
                  <Dropdown
                    label={roleLabel}
                    options={[{ label: "All", value: "" }, ...roleOptions]}
                    selectedValue={role}
                    onValueChange={handleRoleChange}
                    clearSignal={clearSignal}
                  />
                )}
              </div>
              <div className="overview-filter mr12">
                <Dropdown
                  label={"Overview"}
                  options={teamSortByOverview}
		  selectedValue={overview}
                  onValueChange={handleOverviewChange}
                  clearSignal={clearSignal}
                />
              </div>

              <div className="search-by-drp  mr8">
                <Dropdown
                  label={searchLabel}
                  options={searchByOptions}
                  selectedValue={searchBy}
                  onValueChange={handleSearchByChange}
                />
              </div>
              <div className="search-filter v-center mr16">
                {showSearchInput && (
                  <SearchInput
                    onSearchChange={handleSearchChange}
                    clearSignal={clearSignal}
                    placeholder={searchLabel}
                  />
                )}
              </div>
              <button
                className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8"
                onClick={teamDataFilterChange}
              >
                GO
              </button>
              {isFilter && (
                <button
                  className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                  onClick={clearFilter}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
        {(filterApplyStatus && appliedFilters.length > 0) && 
<div className="p12 bg5 brd1 mt16 mb16">
  <div className="fs14 ls1 mr4 df jcsb w100">
    <span className="fw6 v-center cp" onClick={toggleFilters}>
      <CiSquareChevDown
        className={`mr4 ${showFilters ? "rotate-180" : ""}`}
      />
      Filters Applied ({appliedFilters.length})
    </span>
    <span className="fc9 cp" onClick={() => clearFilter()}>
      x Clear
    </span>
  </div>

  { showFilters && appliedFilters.length > 0 && (
    <div className="v-center mt8 dash-chip-container fww">
      {appliedFilters.map((filter, index) => (
        <React.Fragment key={index}>
          <span className="fs14 ml10 mt10">{filter.key}:</span>
          <div
            className="dash-chip p10 br24 mt10 fc5 closefilter fs12 ml10 df jcsb"
          >
            {filter.value}
          </div>
        </React.Fragment>
      ))}
    </div>
  )}
</div>}

        <div className="mylead-filters v-center jcsb pl16 pt16 fww fs12 ">
          {"Total Results: " + teamCount}
        </div>
        <div
          className="booked table-container df w100 fdc mt16"
          style={{ overflow: "auto" }}
        >
          {!pageAccess && !pageAccessDept && (
            <NoPermission displayMsg={"No permission to access this page"} />
          )}

          {(pageAccess || pageAccessDept) && (
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortByChange("name")}
                    className={
                      activeSortColumn === "name" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    }
                  >
                    <p className="box-center cp">
                      Name&nbsp;/&nbsp;Email
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>
                  {/* <th onClick={() => handleSortByChange("mobile_number")}>
                  <p className="box-center cp">
                    Mobile
                    <RiArrowUpDownFill className="ml4" />
                  </p>
                </th>*/}
                  <th
                    onClick={() => handleSortByChange("role_name")}
                    className={
                      activeSortColumn === "role_name" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    }
                  >
                    <p className="box-center cp">
                      Role&nbsp;/&nbsp;Dept.
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>
                  <th
                    onClick={() => handleSortByChange("manager")}
                    className={
                      activeSortColumn === "manager" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    }
                  >
                    <p className="box-center cp">
                      Manager
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>
                  <th
                    onClick={() => handleSortByChange("experts_in")}
                    className={
                      activeSortColumn === "experts_in" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    }
                  >
                    <p className="box-center cp">
                      Designation
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>
                  <th
                    onClick={() => handleSortByChange("leadAutoAssign")}
                    className={`${
                      activeSortColumn === "leadAutoAssign" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    } auto-assign`}
                  >
                    <p className="box-center cp">
                      Auto&nbsp;Assign
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>

                  <th onClick={() => handleSortByChange("viewStatus")} className={
                      activeSortColumn === "viewStatus" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    }>
                    <p className="box-center cp">
                      Team Visibility
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>
                  <th
                    style={{ minWidth: "80px" }}
                    onClick={() => handleSortByChange("lastLoginDate")} className={
                      activeSortColumn === "lastLoginDate" && sortDirection === "asc"
                        ? "fc1"
                        : ""
                    }
                  >
                    <p className="box-center cp">
                      Login
                      <RiArrowUpDownFill className="ml4" />
                    </p>
                  </th>
                  {user.role === "1" && (
                    <th
                      style={{ maxWidth: "80px" }}
                      onClick={() => handleSortByChange("orderby")}
                      className={
                        activeSortColumn === "orderby" && sortDirection === "asc"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center cp">
                        Order
                        <RiArrowUpDownFill className="ml4" />
                      </p>
                    </th>
                  )}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr className="tac">
                    <td colSpan={"8"}>
                      <SmallLoader />
                    </td>
                  </tr>
                )}

                {sortedTeamMembers &&
                  sortedTeamMembers.length > 0 &&
                  sortedTeamMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <span
                          style={{
                            color: "#76838f",
                            display: "block",
                            fontWeight: 700,
                            fontSize: "14px",
                          }}
                           className="ttc"
                        >
                          {member.name}
                        </span>
                        <span style={{ fontSize: "11px" }}>
                          {member.email_id}
                        </span>
                      </td>
                      {/* <td>{member.mobile_number}</td>*/}
                      <td>
                        <span
                          style={{
                            color: "#f4836c",
                            display: "block",
                            fontWeight: 700,
                            fontSize: "14px",
                          }}
                        >
                          {member.role_name}
                        </span>
                        <span style={{ fontSize: "11px" }}>
                          {member.department}
                        </span>
                      </td>
                      <td className="lh18 ttc">
                        {member.manager.split("(")[0]}
                      </td>
                      <td className="lh18 ttc">{member.experts_in}</td>
                      <td>
                        <label
                          className={`custom-checkbox ${
                            member.fk_dept_id !== "7" ? "disabled" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={member.leadAutoAssign}
                            disabled={member.fk_dept_id !== "7"}
                            onChange={(e) => toggleLeadAutoAssign(e, member)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <label
                          className={`custom-checkbox ${
                            user.role !== "1" ? "disabled" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={member.viewStatus}
                            disabled={user.role !== "1"}
                            onChange={(e) => toggleLeadviewStatus(e, member)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        {member.status === "2" ? (
                          <span className="fc10 ls1 fw6">Invited</span>
                        ) : member.status === "3" ? (
                          <span className="fc9 ls1 fw6">Decline</span>
                        ) : (
                          <>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#76838f",
                                display: "block",
                              }}
                            >
                              {member.lastLoginDate}
                            </span>
                            <span
                              style={{
                                fontWeight: 400,
                                fontSize: "11px",
                                opacity: "0.9",
                                color: "#748391",
                              }}
                            >
                              {member.lastLoginTime}
                            </span>
                          </>
                        )}
                      </td>
                      {user.role === "1" ? (
                        <td>
                          <input
                            className="input-field-position"
                            type="number"
                            min={1}
                            max={3}
                            placeholder="Position"
                            id={`position_${member.id}`}
                            name={`position_${member.id}`}
                            value={member.orderby}
                            readOnly={userRole !== "1"}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 3) {
                                setMemberPosition(e, member);
                              }
                            }}
                            onInput={(e) => {
                              if (e.target.value.length > 3) {
                                e.target.value = e.target.value.slice(0, 3);
                              }
                            }}
                          />
                        </td>
                      ) : (
                        ""
                      )}

                      <td className="df bbn">
                        {((pageAccess && user.dept_id === member.fk_dept_id) ||
                          user.role === "1") && (
                          <Tooltip
                            title={
                              member.isToggled
                                ? "Active Member"
                                : "Inactive Member"
                            }
                          >
                            <label>
                              <input
                                type="checkbox"
                                checked={member.isToggled}
                                onChange={(e) => toggleSwitch(e, member)}
                                style={{
                                  display: "none",
                                }}
                              />

                              <span
                                className={`custom-toggle ${
                                  member.isToggled ? "toggle-on" : "toggle-off"
                                }`}
                              >
                                {member.isToggled ? (
                                  <BsToggleOn />
                                ) : (
                                  <BsToggleOff />
                                )}
                              </span>
                            </label>
                          </Tooltip>
                        )}
                        <div className="action-icons v-center">
                          {((pageAccess &&
                            user.dept_id === member.fk_dept_id) ||
                            user.role === "1") && (
                            <Tooltip title="Edit">
                              <FaPencilAlt
                                title="Edit"
                                className="icon edit-icon ml12 cp fs18 fc5"
                                style={{
                                  verticalAlign: "middle",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleEditTeamMember(member)}
                              />
                            </Tooltip>
                          )}
                          {(user.dept_id === "6" || user.role === "1") &&
                          member &&
                          member.small_overview &&
                          member.small_overview !== null ? (
                            <Tooltip title="Update Overview">
                              <MdEditDocument
                                className="icon mail-icon ml12 cp fs20 fc5"
                                style={{ verticalAlign: "middle" }}
                                onClick={() => handleOverview(member)}
                              />
                            </Tooltip>
                          ) : user.dept_id === "6" || user.role === "1" ? (
                            <Tooltip title="Add Overview">
                              <HiDocumentAdd
                                className="icon mail-icon ml12 cp fs20 fc5"
                                style={{ verticalAlign: "middle" }}
                                onClick={() => handleOverview(member)}
                              />
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          {user.role === "1" && (
                            <Tooltip title="Delete">
                              <BsTrash
                                title="Delete"
                                className="icon delete-icon ml12 cp fs18 fc5"
                                style={{ verticalAlign: "middle" }}
                                onClick={() => handleDeleteTeamMember(member)}
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Resend Email">
                            {(member.statusname === "Invited" ||
                              member.statusname === "Decline") && (
                              <MdEmail
                                title="Resend Email"
                                className="icon mail-icon ml12 cp fs18 fc5"
                                style={{ verticalAlign: "middle" }}
                                onClick={() => resendInvitaionEmail(member)}
                              />
                            )}
                          </Tooltip>
                          {member.logFlag === 1 && (
                            <Tooltip title="View Logs">
                              <FaEye
                                className="fs18 fc16 ml12 cp icon"
                                onClick={() => handleLogView(member.id)}
                                style={{ verticalAlign: "middle", cursor: "pointer" }}
                              />
                            </Tooltip>
                          )}
                          {member.leadAutoAssign && (
                            <Tooltip title="Edit Auto Assign">
                             
                               <BiTransferAlt
                                title=""
                                className="icon edit-icon ml12 cp fs18 fc5"
                                style={{
                                  verticalAlign: "middle",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleAutoAssinedPopup(member)}
                              />
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {!loading &&
                  (!dataStatus ||
                    !sortedTeamMembers ||
                    sortedTeamMembers.length === 0) && (
                    <tr className="tac">
                      <td colSpan={"8"}>No team members available</td>
                    </tr>
                  )}
              </tbody>
            </table>
          )}
        </div>
        {addTeamPopup && (
          <Popup
            onClose={closeAddTeamPopup}
            title={editedMember ? "Update Team Member" : "Add New Member(s)"}
            txtSubHeading={
              "Add new team members - an invite email is sent to each to accept and join the team"
            }
          >
            <AddTeam
              onClose={closeAddTeamPopup}
              editedMember={editedMember}
              roleOptions={roleOptions}
              departmentOptions={departmentOptions}
              managerOptions={managerOptions}
              locationOptions={locationOptions}
              onSubmit={handleTeamMember}
            />
          </Popup>
        )}
        {activePopup && (
          <div className="confirmation-overlay">
            <div className="confirmation-dialog">
              <div className="confirmation-content">
                <p className="fs16 mb48 lh28">
                  Are you sure you want to Delete {userIdToActivate.name} ?
                </p>
                <div className="confirmation-buttons">
                  <button className="btn-cancel" onClick={closeActivePopup}>
                    Cancel
                  </button>
                  <button className="btn-confirm" onClick={handleConfirmActive}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAutoAssignPopup && (
          <div className="log-popup">
            <Popup title="Auto Lead Assignment" 
            onClose={cancelAutoAssign}
            txtSubHeading={"Automatically assign incoming leads based on their category/course. Ensure each lead reaches the right team member for faster follow-up."}>
             <div className="ct-f category-filter mr8 searching-drop mb16">
                <p className="fc15 fw6 fs14 ls1 mb8">Select Categories</p>
                <MultiLevelDropdown
                  placeholder="Select Categories"
                  data={categoryDataOptions}
                  checkedItems={[...categoryCheckedItems]}
                  setCheckedItems={setCategoryCheckedItems}
                  chips={4}
                />
              </div>

              <div className="service-status-filter searching-drop mb16">
                <p className="fc15 fw6 fs14 ls1 mb8">Select Courses</p>
                
             <MultiSearchSelectDropdown
                options={courseListOptions}
                selectedOption={selectedCourses}
                placeholder={"Search Course"}
                onSelectionChange={handleSelectCourse}
              /> 
              </div>

            <div className="df fww mb20">
             <p className="fc15 fw6 fs14 ls1  mr12">Lead Limit Assign Status</p> 
               <input
                type="checkbox"
                checked={leadCountStatus}
                onChange={handleLeadCountCheckChange}
              />
            </div>
              
              {leadCountStatus && (
                  <div className="form-group-settings name">
                    <p className="fc15 fw6 fs14 ls1">Max Lead Assign (Daily)</p>
                        <input
                          type="number"
                          placeholder="Enter Lead Count"
                          defaultValue={leadCount}
                          onChange={(e) => setLeadCount(e.target.value)}
                          autoComplete="off"
                        />
                  </div>
              )}

              
              <div className="popup-buttons mb24 df jcc">
                <button onClick={cancelAutoAssign} className="btn-cancel">
                  Cancel
                </button>
                <button onClick={()=>{handleAutoAssined()}}  className={`update-button box-center mr24  ${updateBtnStatus ? 'disabled-input' : 'btn-blue'}`}>
                  Update
                </button>
              </div>
            </Popup>
          </div>
          )}
          {showEmpTransferPop && (
          <Popup
            onClose={closeMovePopup}
            title={"Reassign Responsibilities Before Disabling"}
            txtSubHeading={"Please reassign this team member’s responsibilities to another active member before disabling. This ensures no tasks or leads are left unassigned."}
          >
            <div className="add-team-details">
                {checkAssignrmco?.rm === 1 && (
                  <>
                    <SingleDropdown
                      label="Transfer Leads"
                      placeholder="Select RM"
                      compulsory={<span className="fc4">*</span>}
                      options={agentlistoption}
                      selectedOption={selectAgentOption} 
                      onSelect={handleAgentSelect}
                    />
                    <br />
                  </>
                )}
                {checkAssignrmco?.co === 1 && (
                  <>
                <SingleDropdown
                  label="Transfer Students"
                  compulsory={<span className="fc4">*</span>}
                   placeholder="Select Coordinator"
                  options={coordinatorlistoption}
                  selectedOption={selectCoordinatoroption}
                  onSelect={handleCoordSelect} 
                /><br/></>)}
               
                
              
            </div>
            <div className="button-container mt32">
              <button
                type="button"
                className="btn-cancel"
                onClick={closeMovePopup}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`update-button ${updateBtnStatus ? 'disabled-input' : 'btn-blue'}`}
                onClick={() => {
                  if (!updateBtnStatus) {
                    handleTransferRecord();
                  }
                }}
              >
                Transfer
              </button>
            </div>
          </Popup>
        )}

        <ToastContainer position="bottom-right" />
      </Card>
    </>
  );
};

export default MyTeam;
