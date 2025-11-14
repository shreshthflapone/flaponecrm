import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import "../MyAccount/MyPlan.css";
import Box from "../../components/Box";
import userImg from "../../assets/profile.png";
import { GiLaurelsTrophy } from "react-icons/gi";
import SidePopup from "../../components/Popup/SidePopup";
import axios from "axios";
import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NoPermission from "../../components/NoPermission.js";
import { useTitle } from "../../hooks/useTitle.js";
import moment from "moment";
import { NavLink } from "react-router-dom";

const MyPlan = () => {
  const user = useSelector((state) => state.auth);
  useTitle("My Courses - Flapone Aviation");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessRoleLimit = ["1", "2", "3","5"];
  const userRole = user.role;
  const pageAccess = accessRoleLimit.includes(userRole);

  const handleLogout = () => {
    // Dispatch the logout action to clear user data
    dispatch(logout());
    // Redirect to the login page
    navigate("/login");
  };

  const [courseData, setCourseData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  const handleViewAllClick = (course) => {
    setShowCourseDetails(true);
    setSelectedCourse(course);
  };

  const viewCourseHandle = () => {
    window.open(constant.weburl + selectedCourse.courseUrl, "_blank");
  };

  const getPlanDetail = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myaccount.php`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        const planData = response.data.data;
        setCourseData(planData);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  useEffect(() => {
    getPlanDetail();
  }, []);

  return (
    <div className="df mr20">
      <div className="w66">
        <div className="account-details df pl20 fdc">
          <h3 className=" fc1 fw5 fs20 mt24 mb24">
            Performance & Courses
            <div className="fs14 fc16 mt8 fw4">
              View course details and track your & team performance metrics in
              one place.
            </div>
          </h3>
          <div className="card-wrapper">
            <Card className="card-info bg17 df fdc aic p20">
              <div className="pimg text-center">
                <img
                  src={courseData.logo ? courseData.logo : userImg}
                  alt="user profile"
                  width="70"
                  height="70"
                />
              </div>

              <div className="text-center fc3 fs18 fw6 mt4 ls1 lh22">
                {user.user_name}
              </div>

              {courseData.department && courseData.experts_in && (
                <div className="text-center fc3 fs14 fw5 mt12 v-center">
                  {courseData.experts_in} ({courseData.department})
                </div>
              )}

              <div className="brd-b1 w100 mt24 mb24"></div>

              <div className="df jcsb w100">
                <div className="df fdc lead-credits">
                  {courseData.managername && (
                    <>
                      <p className="fc3 fs14 v-center ls1">Reporting Manager</p>
                      <p className="fc3 fs14 fw5 lh18 mt8 ls1 df fdc">
                        {courseData.managername}
                        <span className="fc3 mt4 fs12">
                          {courseData.manager_country_code &&
                            `+${courseData.manager_country_code}-`}
                          {courseData.manager_mobile_number}
                        </span>
                      </p>
                    </>
                  )}
                </div>
                <div className="best-performer df">
                  <div className="pr16">
                    <p className="fc3 fs14 v-center ls1 ml">
                      {courseData.bestperformername}
                    </p>
                    {/* <p className="fc3 fs12 fw5 lh18 mt8 ls1">NSD Team</p> */}
                  </div>
                  <GiLaurelsTrophy className="fs24 fc10" />
                </div>
              </div>
            </Card>
            {(user.dept_id === "7" || userRole === "1") && (
              <Card className="card-info bg7 ml24 plan-extra-details">
                <table className="side-highlights-table w100">
                  <thead>
                    <tr className="table-headings">
                      <th className="highlight-name-heading">
                        Highlight{" "}
                        <span className="fc1">({moment().format("MMMM")})</span>
                      </th>
                      <th className="highlight-value-heading">My</th>
                      {userRole !== "4" && (
                        <th className="highlight-value-heading">Team </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.sideHighlights &&
                      courseData.sideHighlights.map((highlight, index) => (
                        <tr className="highlight-row" key={index}>
                          <td className="highlight-name fs14 pb16 pt16 df jcsb fc16 ls1 lh22">
                            {highlight.name}
                          </td>
                          <td className="p12 individual-value-row">
                            <NavLink
			      to={`${highlight.name === "Total Inprogress Leads" ? "/my-reports/all" : highlight.name === "Total Booked" ? "/my-reports/booked" : highlight.name === "Total Available Funnel" ? "/my-reports/funnel" : highlight.name === "Total Amount Received" ? "/my-reports/conversionreport" : "/my-reports/all"}`}
                              className="value-link"
                            >
                              <span className="individual-value">
                                {highlight.name === "Total Amount Received" &&  "₹"}{highlight.individualValue}
                              </span>
                            </NavLink>
                          </td>
                          {userRole !== "4" && (
                            <td className="p12 team-value-row">
                              <NavLink
			      to={`${highlight.name === "Total Inprogress Leads" ? "/my-reports/all" : highlight.name === "Total Booked" ? "/my-reports/booked" : highlight.name === "Total Available Funnel" ? "/my-reports/funnel" : highlight.name === "Total Amount Received" ? "/my-reports/conversionreport" : "/my-reports/all"}`}
                                className="value-link"
                              >
                                <span className="team-value">
                                   {highlight.name === "Total Amount Received" &&  "₹"}{highlight.teamValue}
                                </span>
                              </NavLink>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
          <div className="available-plans">
            <div className="available-plans-heading mb24 mt24">
              <h3 className="fc15 fs20 fw5">Available Courses </h3>
            </div>
            <div className="card-wrapper fww">
              {courseData.availableCourses &&
                courseData.availableCourses.map((course, index) => (
                  <Box
                    className="card-info"
                    course={course}
                    key={index}
                    currentPlanName={courseData.currentPlanName}
                    courseData={courseData}
                    onViewAllClick={() => handleViewAllClick(course)}
                  />
                ))}
            </div>
          </div>
          {/* <div className="available-addons">
            <div className="available-addons-heading mb24 mt24">
              <h3 className="fc15 fs20 fw5">Available Addons </h3>
            </div>
            <div className="card-wrapper fww">
              {courseData.addons.map((addon, index) => (
                <Addons
                  className="card-info"
                  addon={addon}
                  key={index}
                  courseData={courseData}
                />
              ))}
            </div>
          </div> */}
        </div>
      </div>
      {showCourseDetails && (
        <SidePopup
          show={showCourseDetails}
          onClose={() => {
            setShowCourseDetails(false);
          }}
        >
          <div className="selected-plan-details">
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg10 w100 fc12 ls2 lh22">
              <p className="fs18 fc1 ">{selectedCourse.courseName}</p>
              <button
                onClick={() => {
                  setShowCourseDetails(false);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="pop-main">
              <div className="course-details">
                {selectedCourse.overviews &&
                  selectedCourse.overviews.map((overview, index) => (
                    <div
                      className={`course-section bg10 mb24 ${overview.title.toLowerCase().replace(/ /g, "-")}`}
                      key={index}
                    >
                      <h2>{overview.title}</h2>
                      <div
                        className="sub-overview"
                        dangerouslySetInnerHTML={{ __html: overview.overview }}
                      />
                    </div>
                  ))}
                <div className="course-highlights bg10">
                  <h2>Course Highlights</h2>
                  <ul className="highlight-list">
                    {selectedCourse.courseHighlights &&
                      Object.keys(selectedCourse.courseHighlights).map(
                        (key, index) => (
                          <li
                            key={index}
                            className="profile-info-item df jcsb aic pt8 pb8 lh16"
                          >
                            <span>{key}</span>
                            {selectedCourse.courseHighlights[key]}
                          </li>
                        )
                      )}
                  </ul>
                </div>

                {selectedCourse && (
                  <div className="course-price v-center jcc fdc">
                    <div className="v-center jcc fww">
                      {selectedCourse.coursePrice.INR.price &&
                        (selectedCourse.coursePrice.INR.tax_status === "1" ? (
                          <div className="v-center jcc courser-view-2 mb8">
				{/*  <div className="box-center fdc">
			  
                              <p className="label fc8 fs14 ls1 lh18 mb4 fw6">
                                Course Fee
                              </p>
                              <p className="value fc5 fs16 ls1 lh18">
                                ₹{selectedCourse.coursePrice.INR.price}
                              </p>
                            </div>
                            <div className="box-center fdc ml12">
                              <p className="label fc8 fs18 ls1 lh18">+</p>
                            </div>
                            <div className="box-center fdc ml12">
                              <p className="label fc8 fs14 ls1 lh18 mb4 fw6">
                                GST (18%)
                              </p>
                              <p className="value fc5 fs16 ls1 lh18">
                                ₹{selectedCourse.coursePrice.INR.gstprice}
                              </p>
                            </div>
                            <div className="box-center fdc ml12">
                              <p className="label fc8 fs18 ls1 lh18">=</p>
                            </div>
			   */}
                            {selectedCourse.coursePrice.INR.totalprice && <div className="v-center  ml12">
                              <p className="label fc8 fs14 ls1 lh18 fw6">
                                Course Fee:
                              </p>
                              <p className="value total-price fc1 ml4 fs20">
                                ₹{selectedCourse.coursePrice.INR.totalprice}
                              </p>
                            </div>}
                          </div>
                        ) : (
                          <div className="v-center jcc courser-view-2">
			{/*
                            <div className="box-center fdc">
                              <p className="label fc8 fs14 ls1 lh18 mb4 fw6">
                                Course Fee
                              </p>
                              <p className="value fc5 fs16 ls1 lh18">
                                ₹{selectedCourse.coursePrice.INR.totalprice}
                              </p>
                            </div>
                            <div className="box-center fdc ml12">
                              <p className="label fc8 fs18 ls1 lh18">+</p>
                            </div>
                            <div className="box-center fdc ml12">
                              <p className="label fc8 fs14 ls1 lh18 mb4 fw6">
                                GST (18%)
                              </p>
                              <p className="value fc5 fs16 ls1 lh18">
                                (Including GST)
                              </p>
                            </div>
                            <div className="box-center fdc ml12">
                              <p className="label fc8 fs18 ls1 lh18">=</p>
                            </div>
			*/}
                            <div className="v-center  ml12">
                              <p className="label fc8 fs14 ls1 lh18 fw6">
                                Course Fee
                              </p>
                              <p className="value total-price fc1 ml4 fs20">
                                ₹{selectedCourse.coursePrice.INR.totalprice}
                              </p>
                            </div>
                          </div>
                        ))}

                      <button
                        type="button"
                        className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 fc3 ml16 ls2 mb8"
                        onClick={viewCourseHandle}
                      >
                        View
                      </button>
                    </div>
		{/*
                    <p className="price-sub-text fs14 fc5 mt12 ls1 lh18">
                      (
                      {selectedCourse.coursePrice.INR.food === "1"
                        ? "including GST, Food & Accommodation at the flying location"
                        : "including GST"}
                      )
                    </p>
		   */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidePopup>
      )}
    </div>
  );
};

export default MyPlan;
