import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPencilAlt, FaThList } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import DynamicTooltip from "../components/Dynamic_Tooltip";
import Tooltip from "../components/Tooltip";
import { giveTextColor } from "../helpers/textColors";
import { MdCall, MdOutlineMail } from "react-icons/md";
import { DateRangePicker } from "react-date-range";
import {
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  subMonths,
  addMonths,
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import subDays from "date-fns/subDays";
import Dropdown from "../components/Dropdown.js";
import "react-datepicker/dist/react-datepicker.css";
import MultiDropdown from "../components/MultiDropdown.js";
import { FaFilter } from "react-icons/fa";
import SidePopup from "../components/Popup/SidePopup.js";
import MultiLevelDropdown from "../components/MultiLevelDropdown";
import SearchInput from "../components/SearchInput";
import SingleDropdown from "../components/SingleDropdown";

const AffiliateStudent = ({ recordList, allApidata, handleSortByChange, activeSortColumn, pageCount, hiddenFilters = [], hiddenColumns = [] }) => {
    const dateRangePickerRef = useRef(null);
    const navigate = useNavigate();
    const [allStudentData, setAllStudentData] = useState([]);
    const [openMenuRow, setOpenMenuRow] = useState(null);
    const [studentCount, setStudentCount] = useState(0);

    const CONVERSION_ORDER = ["30", "60", "90", "180", "360"];

    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [dateLabel, setDateLabel] = useState();
    const [date, setDate] = useState({ label: "Select Date", value: "" });
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [showDateInput, setShowDateInput] = useState(false);
    const [dateTimeType, setDateTimeType] = useState("");
    const [dateOptions, setDateOptions] = useState([
        { label: "Select Date", value: "" },
        { label: "Booking Date", value: "booking_date" },
        { label: "Enquiry Date", value: "enquiry_date" },
        { label: "Followup Date", value: "followup_date" },
        { label: "Updated Date", value: "updated_date" },
    ]);
    const [typeOptions, setTypeOptions] = useState([
        { label: "Select Type", value: "" },
        { label: "Enquiry", value: "enquiry" },
        { label: "Enroll", value: "enroll" },
    ]);
    const [paymentOptions, setPaymentOptions] = useState([
        { label: "Select Payment", value: "" },
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
        { label: "Free User", value: "free_user" },
    ]);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState();
    const [selectedType, setSelectedType] = useState({ label: "Enquiry", value: "enquiry" });
    const [showDateRangeCalendar, setShowDateRangeCalendar] = useState(false);
    const [dateRangeValue, setDateRangeValue] = useState([
        {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
        },
    ]);
    const [selectedTeamOptions, setSelectedTeamOptions] = useState([]);
    const teamOptions = [
        { label: "Shivam Kumar", value: "1" },
        { label: "Nand Kumar", value: "2" },
        { label: "Dushyant Kumar", value: "3" },
        { label: "Kamlesh Gupta", value: "4" },
        { label: "Sanjay Gupta", value: "5" },
        { label: "Naveen Kumar", value: "6" },
    ];
    const [selectedLocationOptions, setSelectedLocationOptions] = useState([]);
    const locationOptions = [
        { label: "Dwarka", value: "1" },
        { label: "Sonipat", value: "2" },
        { label: "Gurgaon", value: "3" },
        { label: "Noida", value: "4" },
        { label: "Shimla", value: "5" },
        { label: "Jaipur", value: "6" },
    ];
    const [selectedAffiliatesOptions, setSelectedAffiliatesOptions] = useState([]);
    const affiliatesOptions = [
        { label: "Shivam Kumar", value: "1" },
        { label: "Nand Kumar", value: "2" },
        { label: "Dushyant Kumar", value: "3" },
        { label: "Kamlesh Gupta", value: "4" },
        { label: "Sanjay Gupta", value: "5" },
        { label: "Naveen Kumar", value: "6" },
    ];
    //
    const [selectedCourseOptions, setSelectedCourseOptions] = useState([]);
    const courseOptions = [
        { label: "Small Drone Pilot", value: "1" },
        { label: "CPL", value: "2" },
        { label: "Air Aviation Training", value: "3" },
        { label: "Drone Instructor", value: "4" },
    ];
    const [categoryCheckedItems, setCategoryCheckedItems] = useState([]);
    const categoryData = [
        {
            label: "Aircraft",
            value: "1",
            checked: false,
            children: [
                {
                    label: "Aircraft Training",
                    value: "4",
                    checked: false
                }
            ]
        },
        {
            label: "Drone",
            value: "2",
            checked: false,
            children: [
                {
                    label: "Drone Training",
                    value: "3",
                    checked: false
                },
                {
                    label: "Drone Services",
                    value: "6",
                    checked: false
                },
                {
                    label: "Drone Products",
                    value: "7",
                    checked: false
                },
                {
                    label: "Partner With Us",
                    value: "8",
                    checked: false
                }
            ]
        }
    ];

    const [searchLabel, setSearchLabel] = useState("Search By");
    const [workOrderID, setWorkOrderID] = useState("Search By");
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [clearSignal, setClearSignal] = useState(false);
    const [searchLead, setSearchLead] = useState("");
    const searchByOptions = [
        { label: "Search By", value: "" },
        { label: "Affiliate ID", value: "affiliate_id" },
        { label: "Affiliate mobile", value: "affiliate_mobile" },
        { label: "Affiliate Email", value: "affiliate_email" },
        { label: "Affiliate Name", value: "affiliate_name" },
        { label: "Affiliate Company name", value: "affiliate_company_name" },
        { label: "User ID", value: "user_id" },
        { label: "User mobile", value: "user_mobile_number" },
        { label: "User Email", value: "user_email" },
        { label: "User Name", value: "user_name" },
    ];
    const [searchBy, setSearchBy] = useState("");
    const handleSearchByChange = (option) => {
        setSearchBy(option.value);
        setSearchLabel(option.label);
        if (option.value) {
        setShowSearchInput(true);
        } else {
        setShowSearchInput(false);
        }
    };
    const filteredSearchByOptions = hiddenFilters.includes("affiliates")
        ? searchByOptions.filter(opt => !opt.value.startsWith("affiliate_"))
        : searchByOptions;
    const handleSearchChange = (value) => {
        setSearchLead(value);
    };

    const handleDateChange = (option) => {
        setDate(option.value);

        setDateLabel(option.label);
        if (option.value !== "") {
        setShowDateInput(true);
        setShowDateRangePicker(true);
        } else {
        setShowDateInput(false);
        setShowDateRangePicker(false);
        }
    };
    const toggleDateRangeCalendar = () => {
        setShowDateRangeCalendar(!showDateRangeCalendar);
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
    const handleDateRangeChange = (item) => {
        setDateRangeValue([item.selection]);
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
            return false;
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
            break;
        }
        }
    };
    selectRange();

    useEffect(() => {
        if (
        showDateRangePicker ||
        showDateRangeCalendar
        ) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDateRangePicker, showDateRangeCalendar]);

    const handleTeamChange = (value) => {
        const index = selectedTeamOptions.indexOf(value);
        if (index === -1) {
        setSelectedTeamOptions([...selectedTeamOptions, value]);
        } else {
        const updatedValues = [...selectedTeamOptions];
        updatedValues.splice(index, 1);
        setSelectedTeamOptions(updatedValues);
        }
    };
    const handleFilterClick = () => {
      setShowFilterPopup(true);
    };
    const closeMoreFilter = () => {
      setShowFilterPopup(false);
      document.body.style.overflow = "auto";
    };
    const handleTypeChange = (option) => {
        setSelectedType(option);
    }
    const handlePaymentChange = (option) => {
        setSelectedPaymentOption(option);
    }

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

    const handleLocationChange = (value) => {
      const index = selectedLocationOptions.indexOf(value);
      if (index === -1) {
        setSelectedLocationOptions([...selectedLocationOptions, value]);
      } else {
        const updatedValues = [...selectedLocationOptions];
        updatedValues.splice(index, 1);
        setSelectedLocationOptions(updatedValues);
      }
    };

    const handleAffiliatesChange = (value) => {
      const index = selectedAffiliatesOptions.indexOf(value);
      if (index === -1) {
        setSelectedAffiliatesOptions([...selectedAffiliatesOptions, value]);
      } else {
        const updatedValues = [...selectedAffiliatesOptions];
        updatedValues.splice(index, 1);
        setSelectedAffiliatesOptions(updatedValues);
      }
    };
    //
    const handleCourseChange = (value) => {
      const index = selectedCourseOptions.indexOf(value);
      if (index === -1) {
        setSelectedCourseOptions([...selectedCourseOptions, value]);
      } else {
        const updatedValues = [...selectedCourseOptions];
        updatedValues.splice(index, 1);
        setSelectedCourseOptions(updatedValues);
      }
    };
    //
    useEffect(() => {
        setAllStudentData([...recordList]);
        setStudentCount(pageCount);
    }, [recordList]);

    const getBoxColor = (index) => {
        const colors = ["#6C5CE7", "#00B894", "#0984E3", "#D63031", "#E67E22", "#2D3436"];
        return colors[index % colors.length];
    };

    const handleAffiliateList = (affiliate_id) => () => {
        navigate(`/my-affiliate/affiliate/${affiliate_id}`);
    }
     const handleLeadDetails = (id) => {
        navigate("/my-leads/"+id);
    }

    return (
        <>
            <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww ">
                <div className="left-side-filter v-center fww">
                    {!hiddenFilters.includes("date") && (
                        <>
                            <div className="date-label mb8 ">
                                <Dropdown
                                    label={dateLabel}
                                    options={dateOptions}
                                    selectedValue={date}
                                    onValueChange={handleDateChange}
                                />
                            </div>
                            <div className="report-date mb8 ml8 mr8">
                                {showDateInput && (
                                    <>
                                        <div
                                            onClick={toggleDateRangeCalendar}
                                            className="date-range-input"
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

                                        {showDateRangeCalendar && (
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
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    {!hiddenFilters.includes("rm") && (
                        <div className="mr8 wo-status mb8 hide-mobile student-batch-filter searching-drop">
                            <MultiDropdown
                                label="RM"
                                options={teamOptions}
                                selectedValues={selectedTeamOptions}
                                onSelect={handleTeamChange}
                                chips={2}
                                searchable={true}
                            />
                        </div>
                    )}
                
                    <Tooltip title={"More Filter"}>
                        <FaFilter
                            className="cp fs16 ml12 fc5"
                            onClick={handleFilterClick}
                        />
                    </Tooltip>
                    <button className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml12">Go</button>
                    <button className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6">Clear</button>
                </div>
            </div>
            <div className="mylead-filters v-center jcsb pl16 pr16 brd-b1 pb8 pt8 fww fs12 ">
                Total Results: {studentCount}
            </div>
            <div className="booked table-container df w100 fdc mt16" style={{ overflow: "auto" }}>
                <table className="mylead-table log-table cp wsnw">
                    <thead className="w100">
                        <tr>
                            {!hiddenColumns.includes("user_id") && (
                            <th
                                onClick={() => handleSortByChange("user_id")}
                                className={activeSortColumn === "user_id" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                Id <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("lead_status") && (
                            <th
                                onClick={() => handleSortByChange("lead_status")}
                                className={activeSortColumn === "lead_status" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="right" text="Status">
                                    Status
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("stage") && (
                            <th
                                onClick={() => handleSortByChange("stage")}
                                className={
                                activeSortColumn === "stage" ? "fc1 min-w100" : "min-w100"
                                }
                            >
                                <p className="box-center">
                                Stage <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("name") && (
                            <th
                                onClick={() => handleSortByChange("name")}
                                className={activeSortColumn === "name" ? "fc1" : ""}
                            >
                                <p className="box-center">Name</p>
                            </th>
                            )}

                            {!hiddenColumns.includes("verified") && (
                            <th
                                onClick={() => handleSortByChange("verified")}
                                className={activeSortColumn === "verified" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Verified">
                                    Verified
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("interested_in") && (
                            <th
                                onClick={() => handleSortByChange("interested_in")}
                                className={activeSortColumn === "interested_in" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Interested In">
                                    Interested In
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("enroll_course") && (
                            <th
                                onClick={() => handleSortByChange("enroll_course")}
                                className={activeSortColumn === "enroll_course" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Enroll Course">
                                    Enroll <br /> Course
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("city") && (
                            <th
                                onClick={() => handleSortByChange("city")}
                                className={activeSortColumn === "city" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="City">
                                    City
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("rm") && (
                            <th
                                onClick={() => handleSortByChange("rm")}
                                className={activeSortColumn === "rm" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Relationship Manager">
                                    RM
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("sale_amount") && (
                            <th
                                onClick={() => handleSortByChange("sale_amount")}
                                className={activeSortColumn === "sale_amount" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Net Sale Amount">
                                    Sale <br/> Amount
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("pending_amount") && (
                            <th
                                onClick={() => handleSortByChange("pending_amount")}
                                className={activeSortColumn === "pending_amount" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Pending Amount">
                                    Pending <br /> Amount
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("booking_date") && (
                            <th
                                onClick={() => handleSortByChange("booking_date")}
                                className={
                                activeSortColumn === "booking_date" ? "fc1 amc-col" : "amc-col"
                                }
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Booking Date">
                                    Booking <br /> Date
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("enquiry_date") && (
                            <th
                                onClick={() => handleSortByChange("enquiry_date")}
                                className={
                                activeSortColumn === "enquiry_date" ? "fc1 amc-col" : "amc-col"
                                }
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Enquiry Date">
                                    Enquiry <br /> Date
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("updated_date") && (
                            <th
                                onClick={() => handleSortByChange("updated_date")}
                                className={
                                activeSortColumn === "updated_date" ? "fc1 amc-col" : "amc-col"
                                }
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Updated Date">
                                    Updated <br /> Date
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("followup") && (
                            <th
                                onClick={() => handleSortByChange("followup")}
                                className={activeSortColumn === "followup" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Followup">
                                    Followup <br /> Date
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

                            {!hiddenColumns.includes("affiliate_name") && (
                            <th
                                onClick={() => handleSortByChange("affiliate_name")}
                                className={activeSortColumn === "affiliate_name" ? "fc1" : ""}
                            >
                                <p className="box-center">
                                <DynamicTooltip direction="left" text="Affiliate Name">
                                    Affiliate <br /> Name
                                </DynamicTooltip>
                                <RiArrowUpDownFill className="cp ml4" />
                                </p>
                            </th>
                            )}

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
                            allStudentData.map((student) => (
                                <tr onClick={()=>handleLeadDetails(student.user_id)} key={student.user_id}>
                                    {!hiddenColumns.includes("user_id") && <td>{student.user_id}</td>}

                                    {!hiddenColumns.includes("lead_status") && (
                                    <td
                                        style={{
                                        color: giveTextColor(student.lead_status),
                                        textTransform: "capitalize",
                                        }}
                                    >
                                        {student.lead_status || "--"}
                                    </td>
                                    )}

                                    {!hiddenColumns.includes("stage") && (
                                    <td
                                        style={{
                                        color: giveTextColor(student.stage),
                                        textTransform: "capitalize",
                                        }}
                                    >
                                        {student.stage}
                                    </td>
                                    )}

                                    {!hiddenColumns.includes("name") && <td>{student.name || "--"}</td>}

                                    {!hiddenColumns.includes("verified") && (
                                    <td>
                                        <div className="df jcc">
                                            <Tooltip
                                                title={
                                                student.verified === "1" && student.mobile_number !== ""
                                                    ? student.mobile_number
                                                    : "Not Verified"
                                                }
                                            >
                                                <MdCall
                                                className={`${
                                                    student.verified === "1" && student.mobile_number !== ""
                                                    ? "fc13"
                                                    : "fc17"
                                                } fs18 ml4`}
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                title={
                                                student.verified === "1" && student.email !== ""
                                                    ? student.email
                                                    : "Not Verified"
                                                }
                                            >
                                                <MdOutlineMail
                                                className={`${
                                                    student.verified === "1" && student.email !== ""
                                                    ? "fc13"
                                                    : "fc17"
                                                } fs18 ml4`}
                                                />
                                            </Tooltip>
                                        </div>
                                    </td>
                                    )}

                                    {!hiddenColumns.includes("interested_in") && (
                                    <td>{student.interested_in || "--"}</td>
                                    )}

                                    {!hiddenColumns.includes("enroll_course") && (
                                    <td>{student.enroll_course || "--"}</td>
                                    )}

                                    {!hiddenColumns.includes("city") && <td>{student.city || "--"}</td>}

                                    {!hiddenColumns.includes("rm") && (
                                    <td className="leads-tool-fix">
                                        {student.rm && (
                                        <Tooltip title={student.rm}>
                                            {student.rm.length > 15
                                            ? `${student.rm.slice(0, 15)}...`
                                            : student.rm}
                                        </Tooltip>
                                        )}
                                    </td>
                                    )}
                                    {!hiddenColumns.includes("sale_amount") && (
                                    <td>{student.sale_amount || "--"}</td>
                                    )}
                                    {!hiddenColumns.includes("pending_amount") && (
                                    <td>{student.pending_amount || "--"}</td>
                                    )}
                                    {!hiddenColumns.includes("booking_date") && (
                                    <td>{student.booking_date || "--"}</td>
                                    )}
                                    {!hiddenColumns.includes("enquiry_date") && (
                                    <td>{student.enquiry_date || "--"}</td>
                                    )}
                                    {!hiddenColumns.includes("updated_date") && (
                                    <td>{student.updated_date || "--"}</td>
                                    )}
                                    {!hiddenColumns.includes("followup") && (
                                    <td>{student.followup || "--"}</td>
                                    )}
                                    {!hiddenColumns.includes("affiliate_name") && (
                                    <td onClick={handleAffiliateList(student.affiliate_id)}>{student.affiliate_name || "--"}</td>
                                    )}

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
            {showFilterPopup && (
                <SidePopup show={showFilterPopup} onClose={closeMoreFilter}>
                    <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                        <p className="fs18 fc1">Filters</p>
                        <button className="lead-close-button" onClick={closeMoreFilter}>
                            X
                        </button>
                    </div>

                    <div className="filter-lists pl16 pt16 pr16">
                        <div className="filter">
                            {!hiddenFilters.includes("type") && (
                                <div className="ct-f category-filter searching-drop mb16">
                                    <p className="fc15 fw6 fs14 ls1 mb8">Type</p>
                                    <Dropdown
                                        label={"Select Type"}
                                        options={typeOptions}
                                        selectedValue={selectedType}
                                        onValueChange={handleTypeChange}
                                    />
                                </div>
                            )}
                            
                            {!hiddenFilters.includes("category") && (
                                <div className="ct-f category-filter searching-drop mb16">
                                    <p className="fc15 fw6 fs14 ls1 mb8">Category</p>
                                    <MultiLevelDropdown
                                        placeholder="Select Category"
                                        data={categoryData}
                                        checkedItems={categoryCheckedItems}
                                        setCheckedItems={setCategoryCheckedItems}
                                    />
                                </div>
                            )}
                            
                            {!hiddenFilters.includes("course") && (
                                <div className="ct-f category-filter searching-drop mb16">
                                    <p className="fc15 fw6 fs14 ls1 mb8">Course</p>
                                    <MultiDropdown
                                        label="Course"
                                        options={courseOptions}
                                        selectedValues={selectedCourseOptions}
                                        onSelect={handleCourseChange}
                                        chips={2}
                                    />
                                </div>
                            )}
                            
                            {!hiddenFilters.includes("payment_status") && (
                                <div className="ct-f category-filter searching-drop mb16">
                                    <SingleDropdown
                                        label="Payment Status"
                                        options={paymentOptions}
                                        selectedOption={selectedPaymentOption}
                                        onSelect={handlePaymentChange}
                                        placeholder="Select Payment Status"
                                    />
                                </div>
                            )}

                            {!hiddenFilters.includes("location") && (
                                <div className="ct-f category-filter searching-drop mb16">
                                    <p className="fc15 fw6 fs14 ls1 mb8">Location</p>
                                    <MultiDropdown
                                        label="Location"
                                        options={locationOptions}
                                        selectedValues={selectedLocationOptions}
                                        onSelect={handleLocationChange}
                                        chips={2}
                                    />
                                </div>
                            )}

                            {!hiddenFilters.includes("affiliates") && (
                                <div className="ct-f category-filter searching-drop mb16">
                                    <p className="fc15 fw6 fs14 ls1 mb8">Affiliates</p>
                                    <MultiDropdown
                                        label="Affiliates"
                                        options={affiliatesOptions}
                                        selectedValues={selectedAffiliatesOptions}
                                        onSelect={handleAffiliatesChange}
                                        chips={2}
                                    />
                                </div>
                            )}
                            
                            {!hiddenFilters.includes("search") && (
                                <>
                                    <div className="search-filter mb8">
                                        <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                                        <Dropdown
                                            label={searchLabel}
                                            options={filteredSearchByOptions}
                                            selectedValue={searchBy}
                                            onValueChange={handleSearchByChange}
                                        />
                                    </div>

                                    {showSearchInput && (
                                        <div className="search-filter mb8 v-center search-filter-finance">
                                            <SearchInput
                                            onSearchChange={handleSearchChange}
                                            clearSignal={clearSignal}
                                            placeholder={searchLabel}
                                            workOrderID={searchLead}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="filter-button-container mt16 pt16 box-center myteam-filters">
                            <button type="button" className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp" onClick={closeMoreFilter} >Close</button>
                            <button type="button" className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp" >Apply</button>
                            <button className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6">Clear</button>
                        </div>
                    </div>
                </SidePopup>
            )}
        </>
    );
};

export default AffiliateStudent;
