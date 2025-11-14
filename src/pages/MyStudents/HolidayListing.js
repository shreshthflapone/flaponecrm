import React, { useState } from "react";
import "../MyTeam/MyTeam.css";
import Card from "../../components/Card";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowUpDownFill } from "react-icons/ri";
import { useTitle } from "../../hooks/useTitle.js";
import { giveTextColor } from "../../helpers/textColors.js";
import HolidayListData from "../../data/HolidayListData";
import { useNavigate } from "react-router-dom";
import SidePopup from "../../components/Popup/SidePopup.js";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import Avatar from "../../assets/profile.png";
import Tooltip from "../../components/Tooltip.js";
import { MdCall, MdOutlineMail } from "react-icons/md";

const HolidayListing = () => {
  useTitle("Exam List - Flapone Aviation");
  const [holidayList, setHolidayList] = useState(HolidayListData);
  const [previewView, setPreviewView] = useState(false);

  const navigate = useNavigate();

  const openHolidayDetail = () => {
    navigate("/holiday-detail");
  };

  return (
    <>
      <Card className="bg5 pb16">
        <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
          Total Results: 77415
          <button
            className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 v-center"
            onClick={openHolidayDetail}
          >
            Add Holiday
          </button>
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
                    Id
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center wsnw">
                    Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Holiday Name
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th>
                  <p className="box-center">
                    Regions
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Departments
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th>
                  <p className="box-center">
                    Type
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>

                <th>
                  <p className="box-center">
                    Comment
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
              {holidayList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-holidays">
                    No Holidays Available
                  </td>
                </tr>
              ) : (
                holidayList.map((holiday, index) => {
                  return (
                    <tr key={index}>
                      <td>{holiday.id}</td>
                      <td>{holiday.date}</td>
                      <td>{holiday.holidayName}</td>
                      <td>{holiday.regions.join(", ")}</td>
                      <td>{holiday.departments.join(", ")}</td>
                      <td
                        style={{
                          color: giveTextColor(
                            holiday.type === "Institute Holiday"
                              ? "Pending"
                              : holiday.type === "Religious Holiday"
                                ? "Completed"
                                : holiday.type === "Public Holiday"
                                  ? "Rejected"
                                  : holiday.type === "National Holiday"
                                    ? "blue"
                                    : holiday.type
                          ),
                          textTransform: "capitalize",
                        }}
                      >
                        {holiday.type}
                      </td>
                      <td>{holiday.comment}</td>
                      <td>
                        <FaPencilAlt className="icon mail-icon cp fs18 fc5 mr8" />
                        <FaEye
                          className="icon mail-icon cp fs18 fc5"
                          onClick={() => {
                            setPreviewView(true);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default HolidayListing;
