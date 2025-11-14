import React, { useState, useEffect, useMemo } from "react";
import "../MyTeam/MyTeam.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import { FaPencilAlt, FaEye, FaCopy } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowUpDownFill } from "react-icons/ri";
import SearchInput from "../../components/SearchInput.js";
import { useTitle } from "../../hooks/useTitle.js";
import { giveTextColor } from "../../helpers/textColors.js";
import SubjectListData from "../../data/SubjectListData";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import SidePopup from "../../components/Popup/SidePopup.js";

const Subjects = () => {
  useTitle("Subjects - Flapone Aviation");
  const [subjectList, setSubjectList] = useState(SubjectListData);
  const [searchValue, setSearchValue] = useState("");
  const [previewView, setPreviewView] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  const openSubjectDetail = () => {
    navigate("/course-material-detail");
  };
  const categoryDataOptions = [
    {
      label: "Aircraft",
      value: "1",
      checked: false,
      children: [
        {
          label: "Aircraft Pilot Training",
          value: "4",
          checked: false,
        },
      ],
    },
    {
      label: "Drone",
      value: "2",
      checked: false,
      children: [
        {
          label: "Drone Pilot Training",
          value: "3",
          checked: false,
        },
      ],
    },
  ];
  const courseListOptions = [
    {
      label: "Small RPC - Drone Pilot Training",
      value: "1",
    },
    {
      label: "Medium RPC - Drone Pilot Training",
      value: "2",
    },
    {
      label: "Train The Trainer (TTT) - Drone Instructor Pilot Training",
      value: "3",
    },
    {
      label: "Small & Medium RPC - Drone Pilot Training",
      value: "4",
    },
    {
      label: "Commercial Pilot Licence - Ground Classes (CPL)",
      value: "5",
    },
    {
      label: "Airline Transport Pilot Licence (ATPL)",
      value: "6",
    },
    {
      label: "Small RPC & TTT - Drone Instructor Pilot Training",
      value: "7",
    },
    {
      label:
        "Small RPC, TTT & Medium RPC  - Medium Drone Instructor Pilot Training",
      value: "8",
    },
    {
      label: "Weekend Batch - Drone Pilot Training",
      value: "9",
    },
    {
      label: "Aircraft Air Navigation",
      value: "10",
    },
    {
      label: "Cabin Crew/Air Hostess Training",
      value: "11",
    },
    {
      label: "Aircraft Air Regulation",
      value: "13",
    },
    {
      label: "Aircraft Aviation Meteorology",
      value: "14",
    },
    {
      label: "Technical General",
      value: "15",
    },
    {
      label: "Radio Telephony",
      value: "16",
    },
    {
      label: "Skyeair Mobility Cadet Pilot Program powered by Flapone Aviation",
      value: "17",
    },
    {
      label: "Private Pilot Licence (Ground Classes)",
      value: "18",
    },
  ];
  const subjectOptions = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Running", value: "Running" },
    { label: "Completed", value: "Completed" },
    { label: "Hold", value: "Hold" },
  ];
  const [categoryCheckedItems, setCategoryCheckedItems] =
    useState(categoryDataOptions);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [subject, setBatchStatus] = useState("");

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
  const handleSubjectChange = (value) => {
    setBatchStatus(value);
  };
  return (
    <>
      <InnerHeader
        heading="Course Material"
        txtSubHeading="View and manage all study materials here. Use the options provided to add new course materials or edit existing ones."
        showButton={true}
        iconText="Add Course Material"
        onClick={openSubjectDetail}
      />

      <Card className="bg5 mt16 pb16">
        <div className="myteam-filters v-center pl16 brd-b1 pb12 pt12 fww">
          <div className="team-filter mr8 searching-drop v-center">
            <div className="category-filter mr8 searching-drop mb8">
              <MultiLevelDropdown
                placeholder="Category"
                data={categoryDataOptions}
                checkedItems={categoryCheckedItems}
                setCheckedItems={setCategoryCheckedItems}
              />
            </div>
            <div className="status-filter mb8">
              <MultiDropdown
                label="Course"
                options={courseListOptions}
                selectedValues={selectedCourses}
                onSelect={handleSelectCourse}
                chips={2}
              />
            </div>
          </div>
          <div className="mr8 plan-status mb8">
            <Dropdown
              label="Select Subject"
              options={subjectOptions}
              selectedValue={subject}
              onValueChange={handleSubjectChange}
            />
          </div>
          <div className="student-filter mb8 v-center ">
            <SearchInput
              onSearchChange={handleSearchChange}
              placeholder={"Topic"}
            />
          </div>

          <button className="apply bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml8 mb8">
            Apply
          </button>
          <button className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb8">
            Clear
          </button>
        </div>

        <div class="mylead-filters v-center jcsb pl16 pt16 fww fs12 ">
          {"Total Results: 4500"}
        </div>
        <div
          className="booked table-container df w100 fdc mt16"
          style={{ overflow: "auto" }}
        >
          <table className="mylead-table cp wsnw">
            <thead className="w100">
              <tr>
                <th>
                  <p className="box-center">
                    Class
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center wsnw">
                    Category
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Course Name
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th>
                  <p className="box-center">
                    Subject
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Chapter
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Topic
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th>
                  <p className="box-center">
                    Create Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th>
                  <p className="box-center">
                    Update Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Status
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Action
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="subject-list">
              {subjectList.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-subjects">
                    No Subjects Available
                  </td>
                </tr>
              ) : (
                subjectList.map((subject, index) => {
                  return (
                    <tr key={index}>
                      <td>Class {subject.s_no}</td>
                      <td>{subject.category}</td>
                      <td>{subject.course}</td>
                      <td>{subject.subject}</td>
                      <td>{subject.chapter}</td>
                      <td>{subject.topic}</td>
                      <td>{subject.createDate}</td>
                      <td>{subject.updateDate}</td>
                      <td
                        style={{
                          color: giveTextColor(
                            subject.status === "draft"
                              ? "Pending"
                              : subject.status === "published"
                                ? "Completed"
                                : subject.status === "unpublished"
                                  ? "Rejected"
                                  : subject.status
                          ),
                          textTransform: "capitalize",
                        }}
                      >
                        {subject.status}
                      </td>
                      <td>
                        <FaPencilAlt className="icon mail-icon cp fs18 fc5 mr8" />
                        <FaEye
                          className="icon mail-icon cp fs18 fc5 mr8"
                          onClick={() => {
                            setPreviewView(true);
                          }}
                        />
                        <FaCopy className="icon mail-icon cp fs18 fc5" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
            <div className="p8 w100"></div>
          </SidePopup>
        )}
      </Card>
    </>
  );
};

export default Subjects;
