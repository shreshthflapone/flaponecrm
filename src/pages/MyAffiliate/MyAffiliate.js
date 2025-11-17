import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Card from "../../components/Card";
import Tabs from "../../components/Tabs";
import InnerHeaderMultiButton from "../../components/InnerHeaderMultiButton.js";
import "../MyReports/MyReports.css";
import "./MyAffiliate.css";
import Dropdown from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";

import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import AffiliateList from "./AffiliateList";
import AffiliateStudent from "../../components/AffiliateStudent";
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
import MultiDropdown from "../../components/MultiDropdown.js";
import { FaFilter } from "react-icons/fa";
import SidePopup from "../../components/Popup/SidePopup.js";
import Tooltip from "../../components/Tooltip.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown";
import SearchInput from "../../components/SearchInput";

//Dummy Data
const affiliateData = [
  {
    id: 1,
    name: "Rahul Sharma",
    company_name: "Tech Innovators Pvt Ltd",
    contact_info: [
      { verified: "1", mobile_number: "+91 9876543210", email: "rahul@techinnovators.com" }
    ],
    leads_generated: 150,
    leads_converted: 45,
    conversions_breakup: { "30": 0, "60": 5, "90": 8, "180": 10, "360": 15 },
    sale_amount: 125000,
    total_commission_earned: 18500,
    pending_payout: 3500,
    last_payout_date: "2025-09-25",
    last_referral: "2025-11-08",
    user_status: "Active"
  },
  {
    id: 2,
    name: "Priya Mehta",
    company_name: "NextGen Solutions",
    contact_info: [
      { verified: "1", mobile_number: "+91 9812345678", email: "priya@nextgensol.com" }
    ],
    leads_generated: 180,
    leads_converted: 60,
    conversions_breakup: { "30": 20, "60": 15, "90": 10, "180": 10, "360": 5 },
    sale_amount: 152000,
    total_commission_earned: 23000,
    pending_payout: 4000,
    last_payout_date: "2025-10-01",
    last_referral: "2025-11-09",
    user_status: "Active"
  },
  {
    id: 3,
    name: "Amit Verma",
    company_name: "CloudMatrix",
    contact_info: [
      { mobile_number: "+91 9765432109", email: "amit@cloudmatrix.com" }
    ],
    leads_generated: 95,
    leads_converted: 25,
    conversions_breakup: { "30": 5, "60": 8, "90": 6, "180": 4, "360": 2 },
    sale_amount: 83000,
    total_commission_earned: 11500,
    pending_payout: 2500,
    last_payout_date: "2025-08-10",
    last_referral: "2025-10-29",
    user_status: "Inactive"
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    company_name: "Digital Vertex",
    contact_info: [
      { mobile_number: "+91 9988776655", email: "sneha@digivertex.com" }
    ],
    leads_generated: 200,
    leads_converted: 72,
    conversions_breakup: { "30": 18, "60": 16, "90": 14, "180": 12, "360": 12 },
    sale_amount: 198000,
    total_commission_earned: 26000,
    pending_payout: 5000,
    last_payout_date: "2025-09-18",
    last_referral: "2025-11-06",
    user_status: "Active"
  },
  {
    id: 5,
    name: "Rohit Singh",
    company_name: "BizGrow Media",
    contact_info: [
      { mobile_number: "+91 9876012345", email: "rohit@bizgrowmedia.com" }
    ],
    leads_generated: 120,
    leads_converted: 35,
    conversions_breakup: { "30": 8, "60": 10, "90": 7, "180": 5, "360": 5 },
    sale_amount: 95000,
    total_commission_earned: 14500,
    pending_payout: 3000,
    last_payout_date: "2025-10-15",
    last_referral: "2025-11-02",
    user_status: "Active"
  },
  {
    id: 6,
    name: "Tanya Bhatia",
    company_name: "AdSpark Agency",
    contact_info: [
      { mobile_number: "+91 9900123456", email: "tanya@adspark.com" }
    ],
    leads_generated: 80,
    leads_converted: 20,
    conversions_breakup: { "30": 4, "60": 5, "90": 4, "180": 3, "360": 4 },
    sale_amount: 70000,
    total_commission_earned: 10500,
    pending_payout: 2500,
    last_payout_date: "2025-07-12",
    last_referral: "2025-10-22",
    user_status: "Inactive"
  },
  {
    id: 7,
    name: "Karan Patel",
    company_name: "BrightPath Tech",
    contact_info: [
      { mobile_number: "+91 9911223344", email: "karan@brightpath.io" }
    ],
    leads_generated: 240,
    leads_converted: 95,
    conversions_breakup: { "30": 25, "60": 20, "90": 18, "180": 15, "360": 17 },
    sale_amount: 285000,
    total_commission_earned: 38000,
    pending_payout: 6500,
    last_payout_date: "2025-10-05",
    last_referral: "2025-11-09",
    user_status: "Active"
  },
  {
    id: 8,
    name: "Nikita Jain",
    company_name: "MarketWave",
    contact_info: [
      { mobile_number: "+91 9090909090", email: "nikita@marketwave.in" }
    ],
    leads_generated: 175,
    leads_converted: 50,
    conversions_breakup: { "30": 12, "60": 14, "90": 8, "180": 10, "360": 6 },
    sale_amount: 138000,
    total_commission_earned: 20000,
    pending_payout: 3500,
    last_payout_date: "2025-09-21",
    last_referral: "2025-11-07",
    user_status: "Active"
  },
  {
    id: 9,
    name: "Arjun Desai",
    company_name: "Creative Minds Co.",
    contact_info: [
      { mobile_number: "+91 9812340987", email: "arjun@creativeminds.co" }
    ],
    leads_generated: 110,
    leads_converted: 30,
    conversions_breakup: { "30": 7, "60": 6, "90": 5, "180": 7, "360": 5 },
    sale_amount: 89000,
    total_commission_earned: 12000,
    pending_payout: 2800,
    last_payout_date: "2025-08-30",
    last_referral: "2025-10-31",
    user_status: "Inactive"
  },
  {
    id: 10,
    name: "Manisha Rao",
    company_name: "Leadify Pvt Ltd",
    contact_info: [
      { mobile_number: "+91 9321456789", email: "manisha@leadify.in" }
    ],
    leads_generated: 210,
    leads_converted: 80,
    conversions_breakup: { "30": 22, "60": 20, "90": 15, "180": 13, "360": 10 },
    sale_amount: 250000,
    total_commission_earned: 32000,
    pending_payout: 5000,
    last_payout_date: "2025-09-29",
    last_referral: "2025-11-08",
    user_status: "Active"
  },
  {
    id: 11,
    name: "Neeraj Gupta",
    company_name: "BluePixel Ads",
    contact_info: [
      { mobile_number: "+91 9877098765", email: "neeraj@bluepixel.in" }
    ],
    leads_generated: 130,
    leads_converted: 40,
    conversions_breakup: { "30": 10, "60": 8, "90": 9, "180": 7, "360": 6 },
    sale_amount: 110000,
    total_commission_earned: 16000,
    pending_payout: 3000,
    last_payout_date: "2025-09-20",
    last_referral: "2025-11-03",
    user_status: "Active"
  },
  {
    id: 12,
    name: "Pooja Nair",
    company_name: "Salesly Global",
    contact_info: [
      { mobile_number: "+91 9800011223", email: "pooja@saleslyglobal.com" }
    ],
    contact_info: "📞 +91 9800011223 | ✉️ pooja@saleslyglobal.com",
    leads_generated: 170,
    leads_converted: 55,
    conversions_breakup: { "30": 15, "60": 12, "90": 10, "180": 10, "360": 8 },
    sale_amount: 140000,
    total_commission_earned: 21000,
    pending_payout: 3800,
    last_payout_date: "2025-10-03",
    last_referral: "2025-11-06",
    user_status: "Active"
  },
  {
    id: 13,
    name: "Deepak Joshi",
    company_name: "MetaEdge Pvt Ltd",
    contact_info: [
      { mobile_number: "+91 9911002233", email: "deepak@metaedge.in" }
    ],
    leads_generated: 190,
    leads_converted: 70,
    conversions_breakup: { "30": 16, "60": 18, "90": 14, "180": 12, "360": 10 },
    sale_amount: 175000,
    total_commission_earned: 24500,
    pending_payout: 4000,
    last_payout_date: "2025-09-10",
    last_referral: "2025-11-05",
    user_status: "Active"
  },
  {
    id: 14,
    name: "Simran Kaur",
    company_name: "VisionX Digital",
    contact_info: [
      { mobile_number: "+91 9810019987", email: "simran@visionx.io" }
    ],
    leads_generated: 105,
    leads_converted: 28,
    conversions_breakup: { "30": 7, "60": 6, "90": 5, "180": 5, "360": 5 },
    sale_amount: 87000,
    total_commission_earned: 12000,
    pending_payout: 2600,
    last_payout_date: "2025-08-28",
    last_referral: "2025-10-30",
    user_status: "Inactive"
  },
  {
    id: 15,
    name: "Aditya Mishra",
    company_name: "Boostify Media",
    contact_info: [
      { mobile_number: "+91 9876541230", email: "aditya@boostifymedia.com" }
    ],
    leads_generated: 155,
    leads_converted: 48,
    conversions_breakup: { "30": 12, "60": 11, "90": 9, "180": 8, "360": 8 },
    sale_amount: 132000,
    total_commission_earned: 18500,
    pending_payout: 3200,
    last_payout_date: "2025-09-26",
    last_referral: "2025-11-04",
    user_status: "Active"
  },
  {
    id: 16,
    name: "Isha Malhotra",
    company_name: "GrowReach Pvt Ltd",
    contact_info: [
      { mobile_number: "+91 9998877665", email: "isha@growreach.in" }
    ],
    leads_generated: 220,
    leads_converted: 85,
    conversions_breakup: { "30": 20, "60": 20, "90": 15, "180": 15, "360": 15 },
    sale_amount: 260000,
    total_commission_earned: 35000,
    pending_payout: 5200,
    last_payout_date: "2025-10-07",
    last_referral: "2025-11-09",
    user_status: "Active"
  },
  {
    id: 17,
    name: "Vikram Chauhan",
    company_name: "ClickBoost Agency",
    contact_info: [
      { mobile_number: "+91 9822003344", email: "vikram@clickboost.in" }
    ],
    leads_generated: 100,
    leads_converted: 30,
    conversions_breakup: { "30": 6, "60": 8, "90": 6, "180": 5, "360": 5 },
    sale_amount: 88000,
    total_commission_earned: 12000,
    pending_payout: 2600,
    last_payout_date: "2025-09-15",
    last_referral: "2025-10-28",
    user_status: "Inactive"
  },
  {
    id: 18,
    name: "Anjali Das",
    company_name: "AdNexa Marketing",
    contact_info: [
      { mobile_number: "+91 9000112233", email: "anjali@adnexa.in" }
    ],
    leads_generated: 165,
    leads_converted: 58,
    conversions_breakup: { "30": 14, "60": 12, "90": 10, "180": 12, "360": 10 },
    sale_amount: 150000,
    total_commission_earned: 21500,
    pending_payout: 4000,
    last_payout_date: "2025-09-20",
    last_referral: "2025-11-06",
    user_status: "Active"
  },
  {
    id: 19,
    name: "Ritesh Kumar",
    company_name: "AlphaDrive Digital",
    contact_info: [
      { mobile_number: "+91 9888990000", email: "ritesh@alphadrive.in" }
    ],
    leads_generated: 130,
    leads_converted: 42,
    conversions_breakup: { "30": 9, "60": 10, "90": 8, "180": 7, "360": 8 },
    sale_amount: 118000,
    total_commission_earned: 16500,
    pending_payout: 3100,
    last_payout_date: "2025-08-25",
    last_referral: "2025-10-27",
    user_status: "Active"
  },
  {
    id: 20,
    name: "Meera Khanna",
    company_name: "Zentrox Media",
    contact_info: [
      { mobile_number: "+91 9700076543", email: "meera@zentrox.in" }
    ],
    leads_generated: 250,
    leads_converted: 100,
    conversions_breakup: { "30": 25, "60": 25, "90": 18, "180": 16, "360": 16 },
    sale_amount: 310000,
    total_commission_earned: 42000,
    pending_payout: 6800,
    last_payout_date: "2025-10-10",
    last_referral: "2025-11-09",
    user_status: "Active"
  },
  {
    id: 21,
    name: "Harshita Rao",
    company_name: "AdLoom Agency",
    contact_info: [
      { mobile_number: "+91 9933445566", email: "harshita@adloom.in" }
    ],
    leads_generated: 90,
    leads_converted: 28,
    conversions_breakup: { "30": 6, "60": 7, "90": 5, "180": 5, "360": 5 },
    sale_amount: 76000,
    total_commission_earned: 11000,
    pending_payout: 2400,
    last_payout_date: "2025-08-18",
    last_referral: "2025-10-20",
    user_status: "Inactive"
  },
  {
    id: 22,
    name: "Arnav Bhattacharya",
    company_name: "PixelEdge Tech",
    contact_info: [
      { mobile_number: "+91 9811223344", email: "arnav@pixeledge.in" }
    ],
    leads_generated: 175,
    leads_converted: 62,
    conversions_breakup: { "30": 14, "60": 14, "90": 12, "180": 10, "360": 12 },
    sale_amount: 155000,
    total_commission_earned: 22500,
    pending_payout: 4200,
    last_payout_date: "2025-09-30",
    last_referral: "2025-11-05",
    user_status: "Active"
  },
  {
    id: 23,
    name: "Riya Sinha",
    company_name: "DigiCore Solutions",
    contact_info: [
      { mobile_number: "+91 9877001122", email: "riya@digicore.com" }
    ],
    leads_generated: 140,
    leads_converted: 46,
    conversions_breakup: { "30": 10, "60": 11, "90": 8, "180": 9, "360": 8 },
    sale_amount: 122000,
    total_commission_earned: 17500,
    pending_payout: 3300,
    last_payout_date: "2025-09-19",
    last_referral: "2025-11-03",
    user_status: "Active"
  },
  {
    id: 24,
    name: "Gaurav Taneja",
    company_name: "SmartReach Global",
    contact_info: [
      { mobile_number: "+91 9876060606", email: "gaurav@smartreach.com" }
    ],
    leads_generated: 160,
    leads_converted: 54,
    conversions_breakup: { "30": 13, "60": 12, "90": 10, "180": 10, "360": 9 },
    sale_amount: 145000,
    total_commission_earned: 21000,
    pending_payout: 4100,
    last_payout_date: "2025-09-28",
    last_referral: "2025-11-08",
    user_status: "Active"
  },
  {
    id: 25,
    name: "Sonal Agarwal",
    company_name: "NovaGrowth",
    contact_info: [
      { mobile_number: "+91 9999888877", email: "sonal@novagrowth.in" }
    ],
    leads_generated: 125,
    leads_converted: 38,
    conversions_breakup: { "30": 8, "60": 10, "90": 7, "180": 7, "360": 6 },
    sale_amount: 102000,
    total_commission_earned: 15000,
    pending_payout: 2800,
    last_payout_date: "2025-09-14",
    last_referral: "2025-11-01",
    user_status: "Active"
  }
];

const studentData = [
  {
    user_id: 1,
    lead_status: "Hot",
    stage: "Paid",
    name: "Rahul Sharma",
    verified: "1",
    email: "rahul@flapone.com",
    mobile_number: "1234567890",
    interested_in: "Small Pilot Training",
    enroll_course: "Medium Pilot Training",
    city: "Jaipur",
    rm: "Shivam Kumar",
    followup: "",
    affiliate_name: "Nand Kumar",
    affiliate_id: "2",
    enquiry_date: "2025-09-25",
    updated_date: "2025-11-08",
    booking_date: "2025-12-25",
    sale_amount: "15,75,000",
    pending_amount: "75,000",
  },
  {
    user_id: 2,
    lead_status: "New",
    stage: "Free",
    name: "Sanjay Gupta",
    verified: "0",
    email: "shreshth@flapone.com",
    mobile_number: "1234567890",
    interested_in: "Small Pilot Training",
    enroll_course: "Medium Pilot Training",
    city: "Jaipur",
    rm: "Shivam Kumar",
    followup: "",
    affiliate_name: "Dushyant Kumar",
    affiliate_id: "3",
    enquiry_date: "2025-09-25",
    updated_date: "2025-11-08",
    booking_date: "2025-12-25",
    sale_amount: "15,75,000",
    pending_amount: "75,000",
  },
];


const MyAffiliate = () => {
    const { id } = useParams();
    const user      = useSelector((state) => state.auth);
    const dispatch  = useDispatch();
    const navigate = useNavigate();
    const dateRangePickerRef = useRef(null);

    const tabs = [
        { label: "Affiliate List", value: "affiliate" },
        { label: "Student List", value: "student" },
    ];
    const [selectedTab, setSelectedTab] = useState(id ? id : "affiliate");
    const [sortBy, setSortBy] = useState("id");
    const [sortDirection, setSortDirection] = useState("desc");
    const [activeSortColumn, setActiveSortColumn] = useState("id");
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [dateLabel, setDateLabel] = useState();
    const [date, setDate] = useState({ label: "Select Date", value: "" });
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [showDateInput, setShowDateInput] = useState(false);
    const [dateTimeType, setDateTimeType] = useState("");
    const [dateOptions, setDateOptions] = useState([
      { label: "Select Date", value: "" },
      { label: "Create Date", value: "created_date" },
      { label: "Referral Date", value: "referral_date" },
      { label: "Conversion Date", value: "conversion_date" },
      { label: "Payout Date", value: "payout_date" },
      { label: "Updated Date", value: "updated_date" },
    ]);
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
    const [activeDaysLabel, setActiveDaysLabel] = useState();
    const [activeDays, setActiveDays] = useState({ label: "Select Active Days", value: "" });
    const [activeDaysOptions, setActiveDaysOptions] = useState([
      { label: "Select Active Days", value: "" },
      { label: "30", value: "30" },
      { label: "60", value: "60" },
      { label: "90", value: "90" },
      { label: "180", value: "180" },
      { label: "360", value: "360" },
    ]);
    const [inactiveDaysLabel, setInactiveDaysLabel] = useState();
    const [inactiveDays, setInactiveDays] = useState({ label: "Select Inactive Days", value: "" });
    const [inactiveDaysOptions, setInactiveDaysOptions] = useState([
      { label: "Select Active Days", value: "" },
      { label: "30", value: "30" },
      { label: "60", value: "60" },
      { label: "90", value: "90" },
      { label: "180", value: "180" },
      { label: "360", value: "360" },
    ]);
    const [searchLabel, setSearchLabel] = useState("Search By");
    const [workOrderID, setWorkOrderID] = useState("Search By");
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [clearSignal, setClearSignal] = useState(false);
    const [searchLead, setSearchLead] = useState("");
    const searchByOptions = [
      { label: "Search By", value: "" },
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Mobile No.", value: "mobile_number" },
      { label: "Company Name", value: "company_name" },
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
    const handleSearchChange = (value) => {
      setSearchLead(value);
    };


    const handleTabChange = (value) => {
        navigate(`/my-affiliate/`+value);
        setSelectedTab(value);
    };

    useEffect(()=>{
        if(selectedTab==='affiliate'){
            handleSortByChange('id');
        }else{
            handleSortByChange('id');
        }
    },[selectedTab]);
    const handleSortByChange = (field) => {
        console.log("field", field);
    if (field === sortBy) {
        setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
        setSortBy(field);
        setSortDirection("desc");
    }
    setActiveSortColumn(field);
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
    const handleFilterClick = () => {
      setShowFilterPopup(true);
    };
    const closeMoreFilter = () => {
      setShowFilterPopup(false);
      document.body.style.overflow = "auto";
    };
    const handleActiveDaysChange = (option) => {
      setActiveDays(option.value);
      setActiveDaysLabel(option.label);
    };
    const handleInactiveDaysChange = (option) => {
      setInactiveDays(option.value);
      setInactiveDaysLabel(option.label);
    };

    const openAffiliatesDetail = () => {
      navigate("/affiliate-details/affiliate_form");
    };

    const handleAddStudent = () => {
      window.open("https://www.flapone.com/enquiry", "_blank");
    };

    return (
        <>
            <InnerHeaderMultiButton
                heading="My Affiliates"
                txtSubHeading="View, manage, and analyze all affiliates in one place."
                buttons={[
                  {
                    text: "Add Affiliates",
                    icon: "",
                    onClick: openAffiliatesDetail,
                  },
                  {
                    text: "Add Student",
                    icon: "",
                    onClick: handleAddStudent,
                  }
                ]}
            />
            <Card className="bg5 mt16 pb16">
              <Tabs
                tabs={tabs}
                showCheckboxes={false}
                showFilter={false}
                onTabChange={handleTabChange}
                selectedTab={selectedTab}
              />
              {selectedTab === "affiliate" && (
                <>
                  <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww ">
                    <div className="left-side-filter v-center fww">
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
                      <div className="mr8 wo-status mb8 hide-mobile student-batch-filter searching-drop">
                        <MultiDropdown
                          label="Team"
                          options={teamOptions}
                          selectedValues={selectedTeamOptions}
                          onSelect={handleTeamChange}
                          chips={2}
                          searchable={true}
                        />
                      </div>
                    
                      <Tooltip title={"More Filter"}>
                        <FaFilter
                          className="cp fs16 ml12 fc5"
                          onClick={handleFilterClick}
                        />
                      </Tooltip>
                      <button
                        className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 ml12"
                      >
                        Go
                      </button>
                      <button
                        className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </>
              )}
              {selectedTab === "affiliate" && 
                <AffiliateList 
                    recordList={affiliateData}
                    allApidata=""
                    handleSortByChange={handleSortByChange}
                    activeSortColumn={activeSortColumn}
                    pageCount={25}
                />
              }
              {selectedTab === "student" && 
                <AffiliateStudent 
                    recordList={studentData}
                    allApidata=""
                    handleSortByChange={handleSortByChange}
                    activeSortColumn={activeSortColumn}
                    pageCount={2}
                />
              }
            </Card>
            {showFilterPopup && (
              <SidePopup show={showFilterPopup} onClose={closeMoreFilter}>
                <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                  <p className="fs18 fc1 ">Filters</p>
                  <button className="lead-close-button" onClick={closeMoreFilter}>
                    X
                  </button>
                </div>
                <div className="filter-lists pl16 pt16 pr16">
                  <div class="filter">
                    <div className="ct-f category-filter searching-drop mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Category</p>
                      <MultiLevelDropdown
                        placeholder="Select Category"
                        data={categoryData}
                        checkedItems={categoryCheckedItems}
                        setCheckedItems={setCategoryCheckedItems}
                      />
                    </div>
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
                    <div className="ct-f category-filter searching-drop mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Active Days</p>
                      <Dropdown
                        label={activeDaysLabel}
                        options={activeDaysOptions}
                        selectedValue={activeDays}
                        onValueChange={handleActiveDaysChange}
                      />
                    </div>
                    <div className="ct-f category-filter searching-drop mb16">
                      <p className="fc15 fw6 fs14 ls1 mb8">Inactive Days</p>
                      <Dropdown
                        label={inactiveDaysLabel}
                        options={inactiveDaysOptions}
                        selectedValue={inactiveDays}
                        onValueChange={handleInactiveDaysChange}
                      />
                    </div>
                    <div className="search-filter mb8">
                      <p className="fc15 fw6 fs14 ls1 mb8">Search By</p>
                      <Dropdown
                        label={searchLabel}
                        options={searchByOptions}
                        selectedValue={searchBy}
                        onValueChange={handleSearchByChange}
                      />
                    </div>
                    <div className="search-filter mb8 v-center search-filter-finance">
                      {showSearchInput && (
                        <SearchInput
                          onSearchChange={handleSearchChange}
                          clearSignal={clearSignal}
                          placeholder={searchLabel}
                          workOrderID={searchLead}
                        />
                      )}
                    </div>
                  </div>
                  <div className="filter-button-container mt16 pt16 box-center myteam-filters ">
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                      onClick={closeMoreFilter}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 cp"
                    >
                      Apply
                    </button>
                    <button
                      className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </SidePopup>
            )}
        </>
    );

};
export default MyAffiliate;
