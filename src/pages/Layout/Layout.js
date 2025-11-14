import React, { useState, useEffect, useRef } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./Layout.css";
import {
  MdWidgets,
  MdArrowUpward,
  MdGroup,
  MdLogout,
  MdOutlinePrivacyTip,
  MdLibraryBooks,
  MdContactPhone,
  MdDashboard
} from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { RxReader } from "react-icons/rx";
import { IoMdMenu } from "react-icons/io";
import logoImage from "../../assets/flapone-logo.png";
import mobileImage from "../../assets/mobile-logo.png";
import profileImage from "../../assets/profile.png";
import MyAccount from "../MyAccount/MyAccount";
import MyTeam from "../MyTeam/MyTeam";
import BlogList from "../Blogs/BlogList";
import MyAffiliate from "../MyAffiliate/MyAffiliate";
import AffiliateDetails from "../MyAffiliate/AffiliateDetails.js";
import BlogDetail from "../Blogs/BlogDetail";
import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LocationList from "../Locations/LocationList";
import LocationDetail from "../Locations/LocationDetail";


import CourseList from "../Courses/CourseList";
import CourseDetail from "../Courses/CourseDetail";
import LeadDetail from "../MyLeads/LeadDetail";
import MyReports from "../MyReports/MyReports";
import FaqList from "../Faq/FaqList";
import FaqDetail from "../Faq/FaqDetail";
import { TbReport, TbReportAnalytics } from "react-icons/tb";
import CategoryList from "../Category/CategoryList"
import CategoryDetail from "../Category/CategoryDetail";
import Tooltip from "../../components/Tooltip";
import { FaSearch } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import ReviewDetail from "../Review/ReviewDetail";
import ReviewList from "../Review/ReviewList";
import axios from "axios";
import ManageAccount from "../MyAccount/ManageAccount.js";
import { giveTextColor } from "../../helpers/textColors";
import MyFinance from "../MyFinance/MyFinance";
import MyOutStanding from "../MyOutstanding/MyOutstanding.js";

import MyStudents from "../MyStudents/MyStudents.js";
import Subjects from "../CourseMaterial/Subjects.js";
import SubjectForm from "../CourseMaterial/SubjectForm.js";
import BatchForm from "../ClassManagement/BatchForm.js";

import { PiStudent } from "react-icons/pi";
import ExamListing from "../ClassManagement/ExamListing.js";
import ExamForm from "../ClassManagement/ExamForm.js";
import HolidayForm from "../ClassManagement/HolidayForm.js";
import HolidayListing from "../ClassManagement/HolidayListing.js";
import StudentAttendance from "../MyStudents/StudentAttendance.js";
import { SiGoogleclassroom } from "react-icons/si";
import MyClasses from "../MyClasses/MyClasses.js";
import ClassManagement from "../ClassManagement/ClassManagement.js";
import Feedback from "../Feedback/Feedback.js";
import { VscFeedback } from "react-icons/vsc";
import DashboardPage from "../Dashboard/DashboardPage.js";
import MainLogs from "../Logs/MainLogs.js";
import ViewDroneLogs from "../Logs/ViewDroneLogs.js";
import StudentLogs from "../Logs/ViewStudentLogs.js";
import ViewChargingBatteryLogs from "../Logs/ViewChargingBatteryLogs.js";
import ViewUserBatteryLogs from "../Logs/ViewUserBatteryLogs.js";
import DronePostingForm from "../Logs/DronePostingForm.js";
import BatteryPostingForm from "../Logs/BatteryPostingForm.js";
import ExercisePostingForm from "../Logs/ExercisePostingForm.js";
import ViewTeamLogs from "../Logs/ViewTeamLogs.js";
import ViewBranchLogs from "../Logs/ViewBranchLogs.js";
import AffiliateForm from "../MyAffiliate/AffiliateForm.js";
import { GrCatalog } from "react-icons/gr";



const ScrollToTopButton = ({ show }) => {
	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div
		className={`scroll-to-top df fdc ${show ? "show" : ""}`}
		onClick={handleScrollToTop}
		>
		<MdArrowUpward />
		</div>
	);
};

const Layout = () => {
	const user = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
  const [showSignupDropdown, setSignupShowDropdown] = useState(false);


	const [showScrollToTop, setShowScrollToTop] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [openSubmenuId, setOpenSubmenuId] = useState(null);
	const [showSearch, setShowSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [dropdownOptions, setDropdownOptions] = useState([]);

  const [submenuStyle, setSubmenuStyle] = useState({});
  const navItemRefs = useRef({});



	const profileRef = useRef(null);
	const sidebarRef = useRef(null); 
	const searchRef = useRef(null);
  const toggleSignupDropdown = () => {
    setSignupShowDropdown(!showSignupDropdown);
  };


	const handleLogout = () => {
		// Dispatch the logout action to clear user data
		dispatch(logout());
		// Redirect to the login page
		navigate("/login");
	};


	const navItems = (user.role ==='1')?[
    {
      id: 32,
      to: "/dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },

		{
			id: 25,
			to: "/my-students",
			label: "My Students",
			icon: <PiStudent />,
		},
		{
			id: 26,
			to: "/my-classes",
			label: "My Classes",
			icon: <SiGoogleclassroom />,
		},
    {
      id: 27,
      to: "/class-management",
      label: "Class Mgmt",
      icon: <SiGoogleclassroom />,
    },

    { id: 1, to: "/my-reports", label: "My Leads", icon: <TbReport /> },
    { id: 2,to: "/my-finance",label: "My Revenue",icon: <TbReportAnalytics />},
    { id:29,to: "/my-outstanding",label: "Outstanding",icon: <TbReportAnalytics />},
    {
      id: 3,
      label: "Content",
      icon: <MdLibraryBooks />,
      subItems: [
        {
          id: 4,
          label: "Articles",
          to: "/blog-list",
          subItems: [
            { id: 5, to: "/blog-list", label: "Blog List" },
            { id: 6, to: "/blog-detail", label: "Blog Detail" },
          ],
        },
        {
          id: 7,
          label: "Courses",
          to: "/course-list",
          subItems: [
            { id: 8, to: "/course-list", label: "Course List" },
            { id: 9, to: "/course-detail", label: "Course Detail" },
          ],
        },
        {
          id: 7,
          label: "Course Material",
          to: "/course-material",
          subItems: [
            { id: 8, to: "/course-list", label: "Course List" },
            { id: 9, to: "/course-detail", label: "Course Detail" },
          ],
        },
        {
          id: 10,
          label: "Branches",
          to: "/location-list",
          subItems: [
            { id: 11, to: "/location-list", label: "location List" },
            { id: 12, to: "/location-detail", label: "location Detail" },
          ],
        },
        {
          id: 13,
          label: "Categories",
          to: "/category-list",
          subItems: [
            { id: 14, to: "/category-list", label: "category-list" },
            { id: 15, to: "/category-detail", label: "category Detail" },
          ],
        },
        {
          id: 16,
          label: "FAQs",
          to: "/faq-list",
          subItems: [
            { id: 17, to: "/faq-list", label: "Faq-list" },
            { id: 18, to: "/Faq-detail", label: "Faq Detail" },
          ],
        },
	     {
          id: 19,
          label: "Reviews",
          to: "/review-list",
          subItems: [
            { id: 20, to: "/course-list", label: "Course List" },
            { id: 21, to: "/course-detail", label: "Course Detail" },
          ],
        },

      ],
    },
    {
      id: 321,
      to: "/inventory",
      label: "Inventory/Ex.",
      icon: <GrCatalog />,
    },
    { id: 23, to: "/my-team", label: "My Team", icon: <MdGroup /> },
    { id: 24, to: "/my-account", label: "My Account", icon: <BiUser /> },
    {id: 28,  to: "/feedbacks", label: "Feedbacks",icon: <VscFeedback />},
    {id: 121,  to: "/my-affiliate", label: "My Affiliate",icon: <MdGroup />},
  ]:(user.dept_id ==='9')?[
    {
      id: 32,
      to: "/dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
		{
			id: 25,
			to: "/my-students",
			label: "My Students",
			icon: <PiStudent />,
		},
		{
			id: 26,
			to: "/my-classes",
			label: "My Classes",
			icon: <SiGoogleclassroom />,
		},
    {
      id: 27,
      to: "/class-management",
      label: "Class Mgmt",
      icon: <SiGoogleclassroom />,
    },

    {
      id: 3,
      label: "Content",
      icon: <MdLibraryBooks />,
      subItems: [
        {
          id: 7,
          label: "Courses",
          to: "/course-list",
          subItems: [
            { id: 8, to: "/course-list", label: "Course List" },
            { id: 9, to: "/course-detail", label: "Course Detail" },
          ],
        },
        {
          id: 7,
          label: "Course Material",
          to: "/course-material",
          subItems: [
            { id: 8, to: "/course-list", label: "Course List" },
            { id: 9, to: "/course-detail", label: "Course Detail" },
          ],
        },
       
        {
          id: 16,
          label: "FAQs",
          to: "/faq-list",
          subItems: [
            { id: 17, to: "/faq-list", label: "Faq-list" },
            { id: 18, to: "/Faq-detail", label: "Faq Detail" },
          ],
        },
	     {
          id: 19,
          label: "Reviews",
          to: "/review-list",
          subItems: [
            { id: 20, to: "/course-list", label: "Course List" },
            { id: 21, to: "/course-detail", label: "Course Detail" },
          ],
        },

      ],
    },
    {
      id: 321,
      to: "/inventory",
      label: "Inventory/Ex.",
      icon: <GrCatalog />,
    },
    { id: 23, to: "/my-team", label: "My Team", icon: <MdGroup /> },
    { id: 24, to: "/my-account", label: "My Account", icon: <BiUser /> },
    {id: 28,  to: "/feedbacks", label: "Feedbacks",icon: <VscFeedback />},

  ]:(user.dept_id ==='6')?[
    {
      id: 3,
      label: "Content",
      icon: <MdLibraryBooks />,
      subItems: [
        {
          id: 4,
          label: "Articles",
          to: "/blog-list",
          subItems: [
            { id: 5, to: "/blog-list", label: "Blog List" },
            { id: 6, to: "/blog-detail", label: "Blog Detail" },
          ],
        },
        {
          id: 7,
          label: "Courses",
          to: "/course-list",
          subItems: [
            { id: 8, to: "/course-list", label: "Course List" },
            { id: 9, to: "/course-detail", label: "Course Detail" },
          ],
        },
        {
          id: 7,
          label: "Course Material",
          to: "/course-material",
          subItems: [
            { id: 8, to: "/course-list", label: "Course List" },
            { id: 9, to: "/course-detail", label: "Course Detail" },
          ],
        },
        {
          id: 10,
          label: "Branches",
          to: "/location-list",
          subItems: [
            { id: 11, to: "/location-list", label: "location List" },
            { id: 12, to: "/location-detail", label: "location Detail" },
          ],
        },
        {
          id: 13,
          label: "Categories",
          to: "/category-list",
          subItems: [
            { id: 14, to: "/category-list", label: "category-list" },
            { id: 15, to: "/category-detail", label: "category Detail" },
          ],
        },
        {
          id: 16,
          label: "FAQs",
          to: "/faq-list",
          subItems: [
            { id: 17, to: "/faq-list", label: "Faq-list" },
            { id: 18, to: "/Faq-detail", label: "Faq Detail" },
          ],
        },
	     {
          id: 19,
          label: "Reviews",
          to: "/review-list",
          subItems: [
            { id: 20, to: "/course-list", label: "Course List" },
            { id: 21, to: "/course-detail", label: "Course Detail" },
          ],
        },

      ],
    },
    { id: 23, to: "/my-team", label: "My Team", icon: <MdGroup /> },
    { id: 24, to: "/my-account", label: "My Account", icon: <BiUser /> },
    {id: 25,  to: "/feedbacks", label: "Feedbacks",icon: <VscFeedback />},

  ]: (user.role ==='1' || user.dept_id ==='7' || user.dept_id ==='3' || user.dept_id ==='5')?[
    {
      id: 5,
      to: "/dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    { id: 1, to: "/my-reports", label: "My Leads", icon: <TbReport /> },
    { id: 2,to: "/my-finance",label: "My Payments",icon: <TbReportAnalytics />},
    { id: 2,to: "/my-outstanding",label: "Outstanding",icon: <TbReportAnalytics />},
    { id: 3, to: "/my-team", label: "My Team", icon: <MdGroup /> },
    { id: 4, to: "/my-account", label: "My Account", icon: <BiUser /> },

    ...(user.dept_id === '3'
    ? [{
        id: 321,
        to: "/inventory",
        label: "Inventory/Ex.",
        icon: <GrCatalog />,
      }]
    : []),
   
  ]:(user.dept_id ==='8')?[
    {
      id: 5,
      to: "/dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    { id: 2,to: "/my-finance",label: "My Payments",icon: <TbReportAnalytics />},
    { id: 1, to: "/my-reports", label: "My Leads", icon: <TbReport /> },
    { id: 1, to: "/my-team", label: "My Team", icon: <MdGroup /> },
    { id: 2, to: "/my-account", label: "My Account", icon: <BiUser /> },
  ]:[
    { id: 1, to: "/my-team", label: "My Team", icon: <MdGroup /> },
    { id: 2, to: "/my-account", label: "My Account", icon: <BiUser /> },
  ];


const redirectRef = useRef(null);

const handleUserOptionSelect = () => {
    setDropdownOptions([]); 
    setSearchValue("");
    setShowSearch(false);
  };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShowSidebar(false);
      setOpenSubmenuId(null);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false); 
    }
    if (redirectRef.current && !redirectRef.current.contains(event.target)) {
      setSignupShowDropdown(false); 
    }
  };
  const getcompanyrecordbyidnamemobile = async (value) => {
    try {
      const response = await axios.post(`${constant.base_url}/admin/layout_details.php?fun=getcompanyrecordbyidnamemobile`, {
          value: value
      }, {
          headers: { "Auth-Id": user.auth_id }
      });

      const responseData = response.data.data;
      if (responseData.status !== "0") {
        setDropdownOptions(responseData.list);
      } else {
        setDropdownOptions([]);
      }
    } catch (error) {
        console.error("Error during login:", error);
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setShowScrollToTop(scrollY > 400);
  };

  // const toggleSubmenu = (itemId) => {
  //   setOpenSubmenuId(openSubmenuId === itemId ? null : itemId);
  // };

  const toggleSubmenu = (itemId) => {
    if (openSubmenuId === itemId) {
      setOpenSubmenuId(null);
    } else {
      const rect = navItemRefs.current[itemId].getBoundingClientRect();
      setSubmenuStyle({
        top: rect.top + "px",
        left: rect.right + "px"
      });
      setOpenSubmenuId(itemId);
    }
  };
  const handleInputChange = async (e) => {
    const query = e.target.value;
    getcompanyrecordbyidnamemobile(query);
    setSearchValue(query);
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  function handleClickCreateAgentUser(type) {
    window.open(`${constant.weburl}enquiry?prvt_id=${user.userid}&spl_type=${type}`, "_blank");
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
 
  // useEffect(() => {
  //   if (showSearch) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [showSearch]);
  return (
    <section className="layout">
      <header className="appbar">
        <div className="left-appbar v-center">
          <div
            className="hamburger-icon"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <IoMdMenu className="fc5 fs24 cp" />
          </div>
          <div className="logo">
            <img src={logoImage} alt="Logo" className="logo" />
          </div>
          <div className="mobile-logo">
            <img src={mobileImage} alt="Logo" />
          </div>
        </div>
        <div className="appbar-actions">
          <ul className="v-center">
	          {!showSearch  && 1==2 ? (
              <li className="today-follow brd1 pl8 pr8 pt4 pb4  v-center blink-text-follow">
                <Tooltip title={"Today Follow-up"}>
                  <MdContactPhone className=" mr8 fs20 " /> 08/10
                </Tooltip>
              </li>
            ) : (
              ""
            )}

            <li className="v-center pr" ref={searchRef}>
              {showSearch && (
                <div className="placeholderstyle">
                  <input
                    type="text"
                    placeholder="Name, Co.name, Email, Mobile"
                    value={searchValue}
                    onChange={handleInputChange}
                    className="pr p8 brd1 outn br4 pl12 fs14 slide-inc search-header pr32"
                  />
                  {dropdownOptions.length > 0 && (
                    <ul className="searchuser_list">
                      {dropdownOptions.map((option, index) => (
                       <NavLink to={`my-leads/${option.user_id}`} onClick={handleUserOptionSelect}>
                       <li key={index} className="dropdown-item">
                          {option.name} - {option.user_id} 
                          <span
                            className="ml4"
                            style={{
                              color: giveTextColor(
                                option.stage === 'Free'
                                ? "Awards"
                                : option.stage === 'Running'
                                ? "News"
                                : option.stage === 'Paid'
                                ? "red"
                                : ""
                              ),
                            }}
                          >({option.stage})</span>
                        </li></NavLink>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {!showSearch ? (
                <Tooltip title="Search">
                  <FaSearch
                    className="fc5 ml12 mr12 cp bg5"
                    onClick={toggleSearch}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Search">
                  <FaSearch
                    className="fc1 mr8 cp pa r0"
                    onClick={toggleSearch}
                  />
                </Tooltip>
              )}
            </li>
               <div className="sdropdown-container">
            <li className={`signin ${showSearch && "ml8"}`}>
              <Tooltip title="Create Self SignUp">
                <FaUserPlus
                  onClick={toggleSignupDropdown}
                  className="fc5 fs20 cp"
                />
              </Tooltip>
            </li>
            {showSignupDropdown && (
              <div className="sdropdown" ref={redirectRef}>
                <div
                  className="sdropdown-option"
                  onClick={() => handleClickCreateAgentUser('referral')}
                >
                  Referral
                </div>
                <div
                  className="sdropdown-option"
                  onClick={() => handleClickCreateAgentUser('walk-in')}
                >
                  Walk-in
                </div>
		 <div
                  className="sdropdown-option"
                  onClick={() => handleClickCreateAgentUser('pns-call')}
                >
                  PNS Call 
                </div>

              </div>
            )}
            </div>
           
            
          </ul>

          <div
            className="profile box-center ml12"
            ref={profileRef}
            onClick={toggleDropdown}
          >
            <img src={user.user_image?user.user_image:profileImage} alt="profile" />
            <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
              <div className="profie-name-email">
                <ul>
                  <li className="fs14">{user.user_name}</li>
                  <li className="fs14 mt4 fc5 ls1">{user.email}</li>
                </ul>
              </div>
              <ul className="profile-list-items">
                <NavLink to="/my-account?tab=settings">
                  <li className="v-center">
                    <BiUser className="fs20 mr24 fc5" />
                    My Account
                  </li>
                </NavLink>
                <NavLink to="/my-team">
                  <li className="v-center">
                    <MdGroup className="fs20 mr24 fc5" />
                    My Team
                  </li>
                </NavLink>
                <NavLink to={constant.weburl+"terms"}>
                  <li className="v-center">
                    <RxReader className="fs20 mr24 fc5" />
                    Term & Conditions
                  </li>
                </NavLink>
                <NavLink to={constant.weburl+"privacy-policy"}>
                  <li className="v-center">
                    <MdOutlinePrivacyTip className="fs20 mr24 fc5" />
                    Privacy Policy
                  </li>
                </NavLink>
              </ul>
              <ul className="logout-btn">
                <NavLink to="">
                  <li className="v-center" onClick={handleLogout}>
                    <MdLogout className="fs20 mr24 fc5" />
                    Logout
                  </li>
                </NavLink>
              </ul>
            </div>
          </div>
          <div
            className="fc5 fs14 ml8 profile-name cp"
            onClick={toggleDropdown}
          >
            <p className="ls1">{user.user_name}</p>
            <p className="mt4 fs12 v-center fw5 ls2">
              Active<span className="login-status"></span>
            </p>
          </div>
        </div>
        {showSidebar && (
          <div className="overlay" onClick={() => setShowSidebar(false)}></div>
        )}
      </header>
      <div className="content-container lhd">
        <nav className={`sidebar ${showSidebar ? "show" : "hide"}`} ref={sidebarRef}>
          <div className="nav-scroll">
            {navItems.map((item) => (
              <div
              className="nav-item-container"
              key={item.id}
              ref={(el) => (navItemRefs.current[item.id] = el)}
            >
              <NavLink
                to={item.to}
                className="nav-item"
                onClick={() => {
                  if (item.subItems) {
                    toggleSubmenu(item.id);
                  } else {
                    setOpenSubmenuId(null);
                    setShowSidebar(false);
                  }
                }}
              >
                <span className="tooltip-sb box-center">{item.label}</span>
                {item.icon}
              </NavLink>
            
              {item.subItems && item.id === openSubmenuId && (
                <div className="submenu" style={submenuStyle}>
                  {item.subItems.map((subItem) => (
                    <NavLink
                      to={subItem.to}
                      key={subItem.id}
                      className="nav-subitem-link"
                      onClick={() => {
                        setShowSidebar(false);
                        setOpenSubmenuId(null);
                      }}
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            ))}
          </div>
        </nav>

        <div className="main-container">
          <main className="main-content">
            <Routes>
              <Route path="/blog-list" element={<BlogList />} />
              <Route path="/blog-detail" element={<BlogDetail />} />
              <Route path="/my-leads/:id" element={<LeadDetail />} />
              
              <Route path="/category-detail/:id" element={<CategoryDetail />} />
              <Route path="/category-detail" element={<CategoryDetail />} />
              <Route path="/category-list" element={<CategoryList />} />
              <Route path="/review-detail" element={<ReviewDetail />} />
              <Route path="/review-detail/:id" element={<ReviewDetail />} />
              <Route path="/review-list" element={<ReviewList />} />

              <Route path="/faq-list" element={<FaqList />} />
              <Route path="/faq-detail" element={<FaqDetail />} />
              <Route path="/faq-detail/:id" element={<FaqDetail />} />
              <Route path="/location-detail" element={<LocationDetail />} />
              <Route path="/location-list" element={<LocationList />} />
              <Route path="/location-detail/:id" element={<LocationDetail />} />
              <Route path="/blog-detail/:id" element={<BlogDetail />} />
              <Route path="/course-list" element={<CourseList />} />
	            <Route path="/course-detail" element={<CourseDetail />} />
              <Route path="/course-detail/:id" element={<CourseDetail />} />
              <Route path="/lead-detail" element={<LeadDetail />} />
              <Route path="/my-reports" element={<MyReports />} />

             <Route path="/my-account" element={<MyAccount />} />
             <Route path="/my-team" element={<MyTeam />} />
             <Route path="/my-finance" element={<MyFinance />} />
             <Route path="/my-finance/:id" element={<MyFinance />} />
             <Route path="/my-outstanding" element={<MyOutStanding />} />
             <Route path="/my-outstanding/:id" element={<MyOutStanding />} />
	           <Route path="/manage-profile/:id" element={<ManageAccount />} />
	           <Route path="/my-reports/:id" element={<MyReports />} />
             <Route path="/my-students/:id" element={<MyStudents />} />

             <Route path="/my-students" element={<MyStudents />} />
             <Route path="/batch-detail" element={<BatchForm />} />
             <Route path="/batch-detail/:id" element={<BatchForm />} />
              <Route path="/exam-detail" element={<ExamForm />} />
              <Route path="/holiday-detail" element={<HolidayForm />} />
              <Route path="/holiday-list" element={<HolidayListing />} />
              <Route path="/attendance" element={<StudentAttendance />} />
              <Route path="/my-classes" element={<MyClasses />} />
              <Route path="/class-management" element={<ClassManagement />} />
              <Route path="/class-management/:id" element={<ClassManagement />} />
	      <Route path="/course-material" element={<Subjects />} />
              <Route path="/course-material-detail/:id" element={<SubjectForm />} />
              <Route path="/course-material-detail" element={<SubjectForm />} />
              <Route path="/feedbacks" element={<Feedback />} />
	       <Route path="/exam-detail/:id" element={<ExamForm />} />
              <Route path="/holiday-detail/:id" element={<HolidayForm />} />             
              <Route path="/dashboard" element={<DashboardPage />} />
              
              <Route path="/inventory" element={<MainLogs />} />
              <Route path="/inventory" element={<MainLogs />} />
              <Route path="/inventory/:id" element={<MainLogs />} />
              <Route path="/drone-inventory/:droneId" element={<ViewDroneLogs />} />
              <Route path="/battery-inventory/charging/:batteryId" element={<ViewChargingBatteryLogs />} />
              <Route path="/battery-inventory/user/:batteryId" element={<ViewUserBatteryLogs />} />
              <Route path="/drone-form" element={<DronePostingForm />} />
              <Route path="/drone-form/:id" element={<DronePostingForm />} />
              <Route path="/battery-form" element={<BatteryPostingForm />} />
              <Route path="/exercise-form" element={<ExercisePostingForm />} />
              <Route path="/battery-form/:id" element={<BatteryPostingForm />} />
              <Route path="/exercise-form/:id" element={<ExercisePostingForm />} />
              <Route path="/student-logs/:StudentId" element={<StudentLogs />} />
              <Route path="/team-log/:InstructorId" element={<ViewTeamLogs />} />
              <Route path="/location-log/:LocationId" element={<ViewBranchLogs />} />

              
              <Route path="/my-affiliate" element={<MyAffiliate />} />
              <Route path="/my-affiliate/:id" element={<MyAffiliate />} />
              <Route path="/affiliate-details" element={<AffiliateDetails />} />
              <Route path="/affiliate-details/:alias" element={<AffiliateDetails />} />
              <Route path="/affiliate-details/:alias/:id" element={<AffiliateDetails />} />
              <Route path="/affiliate-details/:alias/:id/:viewStatus" element={<AffiliateDetails />} />
            </Routes>
          </main>
        </div>
      </div>
      <ScrollToTopButton show={showScrollToTop} />
    </section>
  );
};

export default Layout;
