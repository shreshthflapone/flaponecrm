import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPencilAlt, FaThList } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import DynamicTooltip from "../../components/Dynamic_Tooltip";
import Tooltip from "../../components/Tooltip";
import { giveTextColor } from "../../helpers/textColors";
import { MdCall, MdOutlineMail } from "react-icons/md";

const StudentList = ({ recordList, allApidata, handleSortByChange, activeSortColumn, pageCount }) => {
    const navigate = useNavigate();
    const [allStudentData, setAllStudentData] = useState([]);
    const [openMenuRow, setOpenMenuRow] = useState(null);
    const [studentCount, setStudentCount] = useState(0);

    const CONVERSION_ORDER = ["30", "60", "90", "180", "360"];

    const toggleMenu = (rowIndex) => {
        setOpenMenuRow(openMenuRow === rowIndex ? null : rowIndex);
    };

    const handleUpdateStatus = (student) => {
        console.log("Update Status for:", student.id);
    };

    const handleAddStudent = (student) => {
        console.log("Add student for:", student.id);
    };

    const handleToggleActive = (student) => {
        console.log("Toggle status:", student.id);
    };


    useEffect(() => {
        setAllStudentData([...recordList]);
        setStudentCount(pageCount);
    }, [recordList]);

    const getBoxColor = (index) => {
        const colors = ["#6C5CE7", "#00B894", "#0984E3", "#D63031", "#E67E22", "#2D3436"];
        return colors[index % colors.length];
    };

    return (
        <>
            <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
                Total Results: {studentCount}
            </div>
            <div
                className="booked table-container df w100 fdc mt16"
                style={{ overflow: "auto" }}
            >
                <table className="mylead-table log-table cp wsnw">
                    <thead className="w100">
                    <tr>
                        <th onClick={() => handleSortByChange("user_id")} className={activeSortColumn === "user_id" ? "fc1" : ""}><p className="box-center">User Id <RiArrowUpDownFill className="cp ml4"/></p></th>
                        <th onClick={() => handleSortByChange("lead_status")} className={activeSortColumn === "lead_status" ? "fc1" : ""}>
                        <p className="box-center">
                            <DynamicTooltip direction="right" text="Status"> Status</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th onClick={() => handleSortByChange("stage")} className={activeSortColumn === "stage" ? "fc1 min-w100" : "min-w100"}><p className="box-center">Stage<RiArrowUpDownFill className="cp ml4" /></p>
                        </th>
                        <th onClick={() => handleSortByChange("name")} className={activeSortColumn === "name" ? "fc1" : ""}><p className="box-center">Name</p></th>
                        <th onClick={() => handleSortByChange("verified")} className={activeSortColumn === "verified" ? "fc1" : ""}>
                            <p className="box-center">
                                <DynamicTooltip direction="left" text="Verified"> Verified</DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                            </p>
                        </th>
                        <th onClick={() => handleSortByChange("interested_in")} className={activeSortColumn === "interested_in" ? "fc1" : ""}>
                            <p className="box-center">
                                <DynamicTooltip direction="left" text="Interested In"> Interested In</DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                            </p>
                        </th>
                        <th onClick={() => handleSortByChange("enroll_course")} className={activeSortColumn === "enroll_course" ? "fc1" : ""}>
                            <p className="box-center">
                                <DynamicTooltip direction="left" text="Enroll Course"> Enroll <br /> Course</DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                            </p>
                        </th>
                        <th onClick={() => handleSortByChange("city")} className={activeSortColumn === "city" ? "fc1" : ""}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="City">City</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th onClick={() => handleSortByChange("rm")} className={activeSortColumn === "rm" ? "fc1" : ""}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Relationship Manager">RM</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th onClick={() => handleSortByChange("booking_date")} className={activeSortColumn === "booking_date" ? "fc1 amc-col" : "amc-col"}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Booking Date">Booking <br /> Date</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th onClick={() => handleSortByChange("enquiry_date")} className={activeSortColumn === "enquiry_date" ? "fc1 amc-col" : "amc-col"}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Enquiry Date">Enquiry <br /> Date</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th onClick={() => handleSortByChange("updated_date")} className={activeSortColumn === "updated_date" ? "fc1 amc-col" : "amc-col"}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Updated Date">Updated <br /> Date</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th onClick={() => handleSortByChange("followup")} className={activeSortColumn === "followup" ? "fc1" : ""}>
                        <p className="box-center">
                            <DynamicTooltip direction="left" text="Followup">Followup <br />Date</DynamicTooltip>
                            <RiArrowUpDownFill className="cp ml4" />
                        </p>
                        </th>
                        <th className="action-col">Action</th>
                    </tr>
                    </thead>
                    <tbody className="subject-list">
                        {allStudentData.length === 0 ? (
                            <tr>
                            <td colSpan="15" className="no-students">
                                No Data Available
                            </td>
                            </tr>
                        ) : (
                            allStudentData.map((student, index) => (
                                <tr key={student.user_id}>
                                    <td>{student.user_id}</td>
                                    <td
                                        style={{
                                            color: giveTextColor(
                                            student.lead_status === "-"
                                                ? "News"
                                                : student.lead_status === "Booked"
                                                ? "Running"
                                                : student.lead_status === "Hot"
                                                    ? "Running"
                                                    : student.lead_status === "Follow-Up" || student.lead_status === "Interested"
                                                    ? "News"
                                        : student.lead_status === "Call Later"
                                                    ? "purple"
                                                    : student.lead_status === "Junk"
                                                        ? "red"
                                                        : student.lead_status === "Not Interested"
                                                        ? "blue"
                                                        : student.lead_status === "No Response"
                                                            ? "Draft"
                                                            : student.lead_status === "New"
                                                            ? "springgreen"
                                                            : student.lead_status
                                            ),
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {student.lead_status ==="Call Later" && student.lead_status !==""?student.lead_status:student.lead_status}
                                    </td>
                                    <td
                                        style={{
                                            color: giveTextColor(
                                            student.stage === "Free"
                                                ? "Free"
                                                : student.stage === "Running"
                                                ? "Running"
                                                : student.stage === "Paid"
                                                    ? "News"
                                                    : student.stage
                                            ),
                                            textTransform: "capitalize",
                                        }}
                                    >{student.stage}</td>
                                    <td>{student.name ? student.name : "--"}</td>
                                    <td>
                                        <div className="df jcc">
                                            <Tooltip
                                                title={
                                                    student.verified === "1" && student.mobile_number != ""
                                                    ? student.mobile_number
                                                    : "Not Verified"
                                                }
                                            >
                                                <MdCall
                                                    className={`${
                                                    student.verified === "1" && student.mobile_number != "" ? "fc13" : "fc17"
                                                    } fs18 ml4`}
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                title={
                                                    student.verified === "1" && student.email != ""
                                                    ? student.email
                                                    : "Not Verified"
                                                }
                                            >
                                                <MdOutlineMail
                                                    className={`${
                                                    student.verified === "1" && student.email != "" ? "fc13" : "fc17"
                                                    } fs18 ml4`}
                                                />
                                            </Tooltip>
                                        </div>
                                    </td>
                                    <td>{student.interested_in ? student.interested_in : "--"}</td>
                                    <td>{student.enroll_course ? student.enroll_course : "--"}</td>
                                    <td>{student.city ? student.city : "--"}</td>
                                    <td className="leads-tool-fix">
                                    {student.rm && (
                                        <Tooltip title={student.rm}>
                                        {student.rm.length > 15
                                            ? `${student.rm.slice(0, 15)}...`
                                            : student.rm}
                                        </Tooltip>
                                    )}
                                    </td>
                                    <td>{student.booking_date ? student.booking_date : "--"}</td>
                                    <td>{student.enquiry_date ? student.enquiry_date : "--"}</td>
                                    <td>{student.updated_date ? student.updated_date : "--"}</td>
                                    <td>{student.followup ? student.followup : "--"}</td>
                                    <td className="action-col">
                                        <FaEye
                                            className="cp mr12"
                                            title="View Details"
                                            style={{ verticalAlign: "super" }}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default StudentList;