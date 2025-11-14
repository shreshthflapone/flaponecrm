import React from "react";
import "./CourseMaterial.css";
import { FaCalendarDay } from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";
import { MdOutlineFlight } from "react-icons/md";
import Category from "../../assets/category.svg";
import Course from "../../assets/course.svg";
import Subject from "../../assets/subject.svg";
import Chapter from "../../assets/chapter.svg";

const CourseHeader = ({ details }) => {
  return (
    <div className="course-header">
      <h1 className="box-center pt12 pb12 bg10 fw6 fs16 lh18 ls1">
        {details.chapter?.label ? details.chapter?.label : "Course Material"}
      </h1>
      <div className="header-details df fww p8">
        {/* <div className="df ais w100 flx33 mt8 mb8">
          <FaCalendarDay className="mr8 mt2" />
          <p className="df fdc">
            <span className="fw6 fs14">{details.day}</span>
            <span className="fs12 ls1 fc17">No. of Class</span>
          </p>
        </div> */}
        {details.category?.label && (
          <div className="df ais w100 flx33 mt8 mb8">
            <img src={Category} alt="Category" className="mr8 mt2" />

            <p className="df fdc ttc">
              <span className="fw6 fs14">{details.category?.label}</span>
              <span className="fs12 ls1 fc17">Category</span>
            </p>
          </div>
        )}

        {details.courseName?.label && (
          <div className="df ais w100 flx33 mt8 mb8">
            <img src={Course} alt="Course" className="mr8 mt2" />
            <p className="df fdc">
              <span className="fw6 fs14">{details.courseName?.label}</span>
              <span className="fs12 ls1 fc17">Course</span>
            </p>
          </div>
        )}
        {details.subject?.label && (
          <div className="df ais w100 flx33 mt8 mb8">
            <img src={Subject} alt="Subject" className="mr8 mt2" />
            <p className="df fdc ttc">
              <span className="fw6 fs14">{details.subject?.label}</span>
              <span className="fs12 ls1 fc17">Subject</span>
            </p>
          </div>
        )}
        {details.chapter?.label && (
          <div className="df ais w100 flx33 mt8 mb8">
            <MdOutlineFlight className="mr8 mt2 fs24" />
            <p className="df fdc ttc">
              <span className="fw6 fs14">{details.chapter?.label}</span>
              <span className="fs12 ls1 fc17">Chapter</span>
            </p>
          </div>
        )}
        {details.course_name && (
          <div className="df ais w100 flx33 mt8 mb8">
            <MdOutlineFlight className="mr8 mt2 fs24" />
            <p className="df fdc">
              <span className="fw6 fs14">{details.course_name}</span>
              <span className="fs12 ls1 fc17">Selected Courses</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
