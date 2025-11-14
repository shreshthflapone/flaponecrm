import React, { useRef, useEffect, useState } from "react";
import "../MyReports/Booked.css";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import Popup from "../../components/Popup/Popup.js";
import moment from "moment";
import { FaRegEye, FaFileInvoice, FaFileDownload } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { RiArrowUpDownFill } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { giveTextColor } from "../../helpers/textColors.js";
import { BsGraphUpArrow } from "react-icons/bs";
import SidePopup from "../../components/Popup/SidePopup.js";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constant from "../../constant/constant.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoReceipt } from "react-icons/io5";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useTitle } from "../../hooks/useTitle.js";

const All = ({
  expandRowByFilter,
  recordList,
  loginData,
  outStandingDataCount,
  sortBy,
  sortDirection,
  sortList,
  outStandingHeadData,
  WorkOrderDisableViaPaymentId,
  handleNavLinkClick,
  handleCommonNavClick
}) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Sales - Flapone Aviation");
  
  const [recordData, setRecordData] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const [paymentHistoryPopup, setPaymentHistoryPopup] = useState(false);
  const [paymentHostoryData, setPaymentHostoryData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "last_payment_date_long", direction: "desc" });
  const [activeSortColumn, setActiveSortColumn] = useState("last_payment_date_long");
  const [activeHistorySortColumn, setActiveHistorySortColumn] = useState("");
  const [openDropdown, setOpenDropdown] = useState({ leadIndex: null, paymentIndex: null });

  const [expanded, setExpanded] = useState(null);
  const toggleExpanded = (index) => {
    setExpanded(expanded === index ? null : index);
  };
  useEffect(()=>{
    if(expandRowByFilter){
      toggleExpanded(0);
    }else{
      toggleExpanded(null);
   }
  },[expandRowByFilter])

  const [addCommentPopup, setAddCommentPopup] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [leadId, setLeadId] = useState("");
  const [enquiry_id, setEnquiryId] = useState("");
  const [user_id, setUserId] = useState("");
  const [labelName, setLabelName] = useState("");
  const [labelIndex, setLabelIndex] = useState("");
  const [workIndex, setWorkIndex] = useState("");
  const [historyName, setHistoryName] = useState("");
  const [commentError, setCommentError] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const viewRef = useRef(null);
  const [userDetail, setUserDetail] = useState([]);
  const sendMailRef = useRef(null);
  const [oldFilter, setOldFilter] = useState({});

  const fkDeptId = loginData.dept_id;
  const wo_status_opt = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "success" },
    { label: "Rejected", value: "reject" },
  ];
  const service_status_opt = [
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "success" },
    { label: "Rejected", value: "rejected" },
  ];
  const [paymentStatusOpt, setPaymentStatusOpt] = useState([
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "success" },
    { label: "Rejected", value: "rejected" },
  ]);
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const currentDate = moment().format("DD/MM/YYYY");
  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.includes(leadId)) {
        return prevSelectedLeads.filter((id) => id !== leadId);
      } else {
        return [...prevSelectedLeads, leadId];
      }
    });
  };
const dropdownPaymentRef = useRef(null);
const billMenuRef = useRef(null);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
      (dropdownPaymentRef.current && !dropdownPaymentRef.current.contains(event.target)) &&
      (billMenuRef.current && !billMenuRef.current.contains(event.target)) 
    ) {
      setDropdownOpen(null);
      setOpenDropdown({ leadIndex: null, paymentIndex: null });
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
	




  const [paymentFileName, setPaymentFileName] = useState("");
  const getReceiptPdfUrl = async (receiptId,user_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=getReceiptPdf`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        user_id: user_id,
        receiptId: receiptId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          setPaymentFileName(response.data.data.payment_file_name);
          toast.success(response.data.data.msg);
          if (response.data.data.payment_file_name) {
            window.open(
              constant.invoicepdfurl + response.data.data.payment_file_name
            );
          }
          setDropdownOpen(null);
          setOpenDropdown({ leadIndex: null, paymentIndex: null });
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const handleSendReceipt = async (receiptId,user_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=sendReceipt`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        user_id: user_id,
        receiptId: receiptId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          toast.success(response.data.data.msg);
          setDropdownOpen(null);
          setOpenDropdown({ leadIndex: null, paymentIndex: null });
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  //==================getInvoicePdfUrl Api Request==================
  const [invoiceFileName, setInvoiceFileName] = useState("");

  const getInvoicePdfUrl = async (invoiceId,user_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=getInvoicePdf`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        user_id: user_id,
        invoiceId: invoiceId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          setInvoiceFileName(response.data.data.invoice_file_name);
          if (response.data.data.invoice_file_name) {
            window.open(
              constant.invoicepdfurl + response.data.data.invoice_file_name
            );
          }
          setDropdownOpen(null);
          setOpenDropdown({ leadIndex: null, paymentIndex: null });
          toast.success(response.data.data.msg);
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const handleSendInvoice = async (invoiceId,user_id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=sendIvoice`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        user_id: user_id,
        invoiceId: invoiceId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          toast.success(response.data.data.msg);
          setDropdownOpen(null);
          setOpenDropdown({ leadIndex: null, paymentIndex: null });
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const handleLogout = () => {
    // Dispatch the logout action to clear user data
    dispatch(logout());
    // Redirect to the login page
    navigate("/login");
  };


 
  const handleRowClick = (leadId) => {
    if(leadId.user_type=='Company'){
      window.open(`/my-leads/${leadId.user_id}`, "_blank");
    }else{
      window.open(`/my-students/all`, "_blank");
      handleRedirectSetFilter("all",leadId.user_id)
    }
    
  };
  const handleRedirectSetFilter = (pageTab,user_id) => {
    const updateFilter = {
      page_type: pageTab,
      searchBy: "user_id",
      searchByValue: user_id
    };

    setOldFilter((prevState) => {
      const newFilter = { ...prevState, [pageTab]: updateFilter };
      localStorage.setItem("allfilterstudent", JSON.stringify(newFilter));
      return newFilter;
    });
  };
  const handlePaymentRowClick = (work_order_id) => {
    window.open(`/my-finance/${work_order_id}?tab=payments`, "_blank");
   // window.open(`/my-finance/${work_order_id}?tab=payments`);
  };
  
  
  const getPaymentHistoryAccWO = async (id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/workorder_details.php?fun=getPaymentHistoryAccWO`,
      headers: { "Auth-Id": user.auth_id },
      data: { user_id: id },
    })
      .then(function (response) {
        let responseData = response.data.data.payment_list;
        if (responseData.status != "0") {
          setPaymentHistoryPopup(true);
          setPaymentHostoryData(responseData);
        }
      })
      .catch(function (error) {
        // Handle errors
        console.error("Error during login:", error);
      });
  };

  
  const openAttachmentFile = (value) => {
    window.open(value, "_blank", "noopener,noreferrer");
  };
  const openInvoiceReceiptAttachmentFile = (value) => {
    window.open(
      constant.invoicepdfurl + value,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const openInvoiceAttachmentFile = (value) => {
    window.open(
      constant.invoicepdfurl + value,
      "_blank",
      "noopener,noreferrer"
    );
  };


  useEffect(() => {
    setRecordData(recordList);
  }, [recordList]);

  const handleSortByChange = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setActiveSortColumn(key);
    setSortConfig({ key, direction });
    sortRecordData(key, direction);
  };

  const sortRecordData = (key, direction) => {
    const sortedData = [...recordList].sort((a, b) => {
      if (
        key === "id" ||
        key === "credit_tax_long" ||
        key == "total_amount_long" ||
        key === "discount_amount_long" ||
        key === "pending_amount_long" ||
        key === "created_date_long"
      ) {
        const aValue = a[key] || 0;
        const bValue = b[key] || 0;

        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else {
        const aValue = a[key] || "";
        const bValue = b[key] || "";

        const comparison = aValue
          .toString()
          .localeCompare(bValue.toString(), undefined, { numeric: true });
        return direction === "asc" ? comparison : -comparison;
      }
    });
    setRecordData(sortedData);
  };

  const togglePaymentDropdown = (index) => {
    setOpenDropdown(prev => ({
      leadIndex: prev.leadIndex,
      paymentIndex: prev.paymentIndex === index ? null : index
    }));
  };

  

  const sortPaymentHistoryData = (key, direction) => {
    const sortedData = [...paymentHostoryData].sort((a, b) => {
      if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setPaymentHostoryData(sortedData);
  };
  const handleInvoiceRecepitDownloadFile = (fileName) => {
    const url = constant.invoicepdfurl + fileName; 
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const toggleClassRow = () => {};

  useEffect(() => {
    //setRecordData(recordList);
    if (sortConfig.key) {
      sortRecordData(sortConfig.key, sortConfig.direction);
    }
  }, [recordList]);
  

  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {outStandingDataCount || 0}
      </div>
       
        <div className="card-content df pt24 brd-b1 pb24 pl24 jcc">
        
        <div 
            className="card-item work-order-section df fdc jcc br4"
            
          >
            <DynamicTooltip direction="bottom" text="All pending payments based on selected filters.">
            <span className="fs26 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData.total_outstanding.outstanding
                ? formatter.format(outStandingHeadData.total_outstanding.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6 fs14 fc5">
              OutStanding
              {outStandingHeadData && outStandingHeadData.total_outstanding.total_student ? (
                ` (${outStandingHeadData.total_outstanding.total_student})`
              ) : ''}
            </p>
          </div>
         
          <div 
            className="card-item work-order-section df fdc jcc br4 cp"
            
            onClick={outStandingHeadData.course_completed.outstanding > 0 ? handleNavLinkClick(
              {label: 'Course Completed', value: 'course-completed'}) : undefined}
          >
             <DynamicTooltip direction="bottom" text="Students who finished their course but still owe payment.">
            <span className="fs28 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData.course_completed.outstanding
                ? formatter.format(outStandingHeadData.course_completed.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6 fs14 fc5">
              Course Completed
              {outStandingHeadData && outStandingHeadData.course_completed.total_student ? (
                ` (${outStandingHeadData.course_completed.total_student})`
              ) : ''}
            </p>
          </div>
          <div className="card-item work-order-section df fdc jcc br4 cp"  
         
          onClick={outStandingHeadData.batch_completed.outstanding > 0 ? handleNavLinkClick({label: 'Batch Completed', value: 'batch-completed'}) : undefined}>
             <DynamicTooltip direction="bottom" text="Students whose batch has ended but payment is not fully received.">
            <span className="fs28 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData.batch_completed.outstanding
                ? formatter.format(outStandingHeadData.batch_completed.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6  fs14 fc5 ">
            Batch Completed
              {outStandingHeadData && outStandingHeadData.batch_completed.total_student ? (
                ` (${outStandingHeadData.batch_completed.total_student})`
              ) : ''}
            </p>
          </div>
          <div className="card-item work-order-section df fdc jcc br4 cp" 
         
          onClick={outStandingHeadData.batch_running.outstanding > 0 ? handleNavLinkClick({label: 'Batch Running', value: 'batch-running'}) : undefined}>
             <DynamicTooltip direction="bottom" text="Students currently attending classes but pending payment.">
            <span className="fs28 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData.batch_running.outstanding
                ? formatter.format(outStandingHeadData.batch_running.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6  fs14 fc5">
              Batch Running
              {outStandingHeadData && outStandingHeadData.batch_running.total_student ? (
                ` (${outStandingHeadData.batch_running.total_student})`
              ) : ''}
            </p>
          </div>
          <div 
            className="card-item work-order-section df fdc jcc br4 cp"
            
            onClick={outStandingHeadData.batch_alloted.outstanding > 0 ? handleNavLinkClick({label: 'Batch Alloted', value: 'batch-alloted'}) : undefined}
          >
             <DynamicTooltip direction="bottom" text="Students assigned to a batch but pending full payment.">

            <span className="fs28 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData.batch_alloted.outstanding
                ? formatter.format(outStandingHeadData.batch_alloted.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6 fs14 fc5">
            Batch Alloted
            {outStandingHeadData && outStandingHeadData.batch_alloted.total_student ? (
                ` (${outStandingHeadData.batch_alloted.total_student})`
              ) : ''}
            </p>
          </div>
          <div
            className="card-item work-order-section df fdc jcc br4 cp"
           
            onClick={outStandingHeadData.new_student_outstanding.outstanding > 0 ? handleNavLinkClick({label: 'New', value: 'new'}) : undefined}
          >
             <DynamicTooltip direction="bottom" text="Students yet to be assigned to any batch and payment is pending.">
            <span className="fs26 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData.new_student_outstanding.outstanding
                ? formatter.format(outStandingHeadData.new_student_outstanding.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6 fs14 fc5">
            New 
              {outStandingHeadData && outStandingHeadData.new_student_outstanding.total_student ? (
                ` (${outStandingHeadData.new_student_outstanding.total_student})`
              ) : ''}
            </p>
          </div>
          <div
            className="card-item work-order-section df fdc jcc br4 cp"
            onClick={outStandingHeadData.student_entry_missing.outstanding > 0 ? handleNavLinkClick({label: 'Student Missing', value: 'student-missing'}) : undefined}
          >
             <DynamicTooltip direction="bottom" text="Partial payment received but student record is missing or incomplete.">
            <span className="fs28 fc1 mb8 v-center">
              {outStandingHeadData && outStandingHeadData?.student_entry_missing?.outstanding
                ? formatter.format(outStandingHeadData?.student_entry_missing?.outstanding)
                : 0}
            </span>
            </DynamicTooltip>
            <p className="fw6 fs14 fc5">
             Student Missing
              {outStandingHeadData && outStandingHeadData?.student_entry_missing?.total_student ? (
                ` (${outStandingHeadData?.student_entry_missing?.total_student})`
              ) : ''}
            </p>
          </div>
        </div>
      
      <div
        className="booked table-container df w100 fdc mt16"
        style={{ overflow: "auto" }}
      >
        <table className="mylead-table cp wsnw">
          <thead className="w100">
            <tr>
              <th>
                <p className="box-center"></p>
              </th>
              <th
                onClick={() => handleSortByChange("id")}
                className={activeSortColumn === "id" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Work Order Id">WO ID</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("user_id")}
                className={activeSortColumn === "user_id" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="User Id">UserID</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("course_status")}
                className={activeSortColumn === "course_status" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Course Status">Course Status</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("username")}
                className={activeSortColumn === "username" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Username">Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th
                onClick={() => handleSortByChange("invoice_receipt_id")}
                className={
                  activeSortColumn === "invoice_receipt_id" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Invoice Number">Invoice</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th
                onClick={() => handleSortByChange("agent_name")}
                className={activeSortColumn === "agent_name" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Sales Excutive Name">RM Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("cord_name")}
                className={activeSortColumn === "cord_name" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Coordinator Name">Coordinator</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th
                onClick={() => handleSortByChange("gst_no")}
                className={activeSortColumn === "gst_no" ? "fc1" : ""}
              >
                <p className="box-center">
                  
                  <DynamicTooltip direction="bottom" text="GST Number Available">GST</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
                
              </th> */}
              
             
              <th
                onClick={() => handleSortByChange("course_name")}
                className={activeSortColumn === "course_name" ? "fc1" : ""}
              >
                <p className="box-center">
                  Course Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("no_of_student")}
                className={activeSortColumn === "no_of_student" ? "fc1" : ""}
              >
                <p className="box-center">
                  
                <DynamicTooltip direction="left" text="No of Student in Company">No of <br/>Student</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
               
              <th
                onClick={() => handleSortByChange("total_amount_long")}
                className={
                  activeSortColumn === "total_amount_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Course MRP">MRP</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              
              <th
                onClick={() => handleSortByChange("discount_amount_long")}
                className={
                  activeSortColumn === "discount_amount_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Discount / Scholarship Given">Disc.</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("sale_amount")}
                className={activeSortColumn === "sale_amount" ? "fc1" : ""}
              >
                <p className="box-center">
                  
                <DynamicTooltip direction="left" text="Sales Amount (MRP-Discount)">Sales <br/>Amt</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("credit_tax_long")}
                className={activeSortColumn === "credit_tax_long" ? "fc1" : ""}
              >
                <p className="box-center">
                <DynamicTooltip direction="left" text="Received Amount">Recd <br/>Amt</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("pending_amount_long")}
                className={
                  activeSortColumn === "pending_amount_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                <DynamicTooltip direction="left" text="Pending/Outstanding Amount">Pend.<br/> Amt</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
               <th
                onClick={() => handleSortByChange("last_comment")}
                className={
                  activeSortColumn === "last_comment" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Remarks">Remarks</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

               <th
                onClick={() => handleSortByChange("payment_followup_date")}
                className={
                  activeSortColumn === "payment_followup_date" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Payment Followup">Payment Followup</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("created_date_long")}
                className={
                  activeSortColumn === "created_date_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="WorkOrder Create Date">WO Date</DynamicTooltip>
                  
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th
                onClick={() => handleSortByChange("approved_comment")}
                className={activeSortColumn === "approved_comment" ? "fc1" : ""}
              >
                <p className="box-center">
                  Comment
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
              <th
                onClick={() => handleSortByChange("last_payment_date_long")}
                className={
                  activeSortColumn === "last_payment_date_long" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Last Payment Date">LP Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("last_payment_status")}
                className={
                  activeSortColumn === "last_payment_status" ? "fc1" : ""
                }
              >
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Last Payment Status">LP Status</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              {/* <th>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="WorkOrder Status">WO Status</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("service_status")}
                className={activeSortColumn === "service_status" ? "fc1" : ""}
              >
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Course Status">Course<br /> Status</DynamicTooltip>
                  
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {recordData.length > 0 ? (
              recordData.map((lead, index) => {
                return (
                  <>
                    <tr
                      key={index}
                      onClick={() => handleRowClick(lead)}
                    >
                      {/* */}
                      {/* <td className="leads-tool-fix">
                        <label
                          className="checkbox-label cp p10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPaymentHistory(
                              lead.user_id,
                              lead.workorder_id,
                              lead.username
                            );
                          }}
                        >
                          <BsGraphUpArrow
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPaymentHistory(
                                lead.user_id,
                                lead.workorder_id,
                                lead.username
                              );
                            }}
                          />
                        </label>
                      </td> */}
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(index);
                        }}
                        className="leads-tool-fix cp"
                      >
                        {expanded === index ? (
                          <MdExpandLess className="fs20" />
                        ) : (
                          <MdExpandMore className="fs20" />
                        )}
                      </td>
                      <td>{lead.id ? lead.id : "--"}</td>
                      <td>{lead.user_id ? lead.user_id : "--"}</td>
                      <td className="leads-tool-fix"
                      style={{
                        color: giveTextColor(
                          lead.course_status === "New"
                            ? "blue"
                            : lead.course_status === "Batch Running"
                              ? "Batch_Running"
                              : lead.course_status === "Dropped"
                                ? "red"
                                : lead.course_status === "Batch Allotted"
                                  ? "Batch_Allotted"
                                  :lead.course_status === "Batch Completed"
                                  ? "Batch_Completed"
                                  :lead.course_status === "Course Completed"
                                  ? "darkgreen"
                                  : lead.course_status
                        ),
                        textTransform: "capitalize",
                      }}
                    >
                      {lead.course_status}
                    </td>
                      <td className="leads-tool-fix">
                        <div className="v-center fdc">
                          <span
                            style={{
                              color: giveTextColor(
                               lead.user_type === "Company"
                                    ? "Draft"
                                    : ""
                              ),
                            }}
                          >
                            {lead.username && (
                              <DynamicTooltip text={lead.user_type}><span className="lc2 text-row">{lead.username}</span></DynamicTooltip>
                            )}
                          </span>
                        </div>
                      </td>
			{/* <td
                        onClick={
                          lead.invoice_file_name &&
                          lead.invoice_file_name !== null
                            ? (e) => {
                                e.stopPropagation();
                                openInvoiceAttachmentFile(
                                  lead.invoice_file_name
                                );
                              }
                            : ""
                        }
                      >
                        {lead.invoice_file_name ? (
                          <span>
                            {lead.invoice_receipt_id
                              ? lead.invoice_receipt_id
                              : "--"}
                          </span>
                        ) : (
                          <>
                            {lead.invoice_receipt_id
                              ? lead.invoice_receipt_id
                              : "--"}
                          </>
                        )}
                      </td>*/}
                      {/* <td ref={dropdownRef}>
                        {lead.invoice_receipt_id && lead.work_order_status=== 'success'? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(index, "receipt");
                            }}
                            style={{
                              color: giveTextColor("blue"),
                            }}
                            className="tdu cp"
                          >
                            {lead.invoice_receipt_id || '--'}
                          </span>
                        ) : (
                          <>{lead.invoice_receipt_id ? lead.invoice_receipt_id : '--'}</>
                        )}

                        {lead.work_order_status === 'success' &&  isDropdownOpen(index, "receipt") && (
                          <div className="pr">
                            <div className="bill-menu finance-invoice-btn" ref={billMenuRef}>
                              <p
                                className="bill-item cp ls1"
				onClick={(e) => {
                                  e.stopPropagation();
                                  getInvoicePdfUrl(lead.id,lead.user_id);
                                }}
                              >
                                <FaRegEye className="mr4 fc8" /> View
                              </p>
				<p
                                className="bill-item cp ls1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendInvoice(lead.id,lead.user_id)
                                }}
                                ref={sendMailRef} 
                              >
                                <IoMdMail className="mr4 fc8" /> Send Mail
                              </p>
                            </div>
                          </div>
                        )}
                      </td> */}
                      <td className="leads-tool-fix">
                        {lead.agent_name && (
                          <DynamicTooltip direction="right" text={lead.agent_name}>
                            <span className="lc2 text-row">{lead.agent_name}</span>
                          </DynamicTooltip>
                        )}
                      </td>
                      <td className="leads-tool-fix">
                        {lead.cord_name && (
                          <DynamicTooltip direction="right" text={lead.cord_name}>
                            <span className="lc2 text-row">{lead.cord_name}</span>
                          </DynamicTooltip>
                        )}
                      </td>
                      {/* <td>
                        <span
                          style={{
                            color: giveTextColor(
                              lead.gst_no !== "" && lead.gst_no != null
                                ? "Approve"
                                : "red"
                            ),
                          }}
                        >
                          {lead.gst_no && lead.gst_no != null ? "Yes" : "No"}
                        </span>
                      </td> */}
                     
                      <td className="leads-tool-fix ">
                        {lead.course_name && (
                          <DynamicTooltip direction="right" text={lead.course_name}>
                            <span className="lc2 text-row">{lead.course_name}</span>
                          </DynamicTooltip>
                        )}
                      </td>
                      <td> {lead.no_of_student || 0}</td>
                      <td>{lead.total_amount}</td>
                      <td
                        style={{
                          color: giveTextColor(
                            lead.discount_amount === "0" ? "" : "success"
                          ),
                          textTransform: "capitalize",
                        }}
                      >
                        {lead.discount_amount}
                      </td>
                      <td>{lead.sale_amount ? lead.sale_amount : "--"}</td>
                      <td>{lead.credit_tax}</td>
                      <td>
                        <span
                          style={{
                            color: giveTextColor(
                              lead.pending_amount === "0" ? "Approve" : "red"
                            ),
                          }}
                        >
                          {lead.pending_amount ? lead.pending_amount : "--"}
                        </span>
                      </td>
                      <td className="leads-tool-fix scrollable-cell">
                        {lead.last_comment ? (
                            <p>{lead.last_comment}</p>
                            ) : (
                              '--'
                            )}
                      </td>
                      <td>{lead.payment_followup_date}</td>
                      <td>
                        <div style={{ display: "block" }}>
                          <span>{lead.formattedDate}</span>
                          <span
                            className="mt-4"
                            style={{ display: "block", marginTop: "4px" }}
                          >
                            {/*lead.formattedTime*/}
                          </span>
                        </div>
                      </td>
                      {/* <td>{lead.location_title ? lead.location_title : "--"}</td> */}
                      {/* <td className="leads-tool-fix">
                        {lead.approved_comment &&
                          (lead.approved_comment.length > 25 ? (
                            <DynamicTooltip text={lead.approved_comment}>
                              {`${lead.approved_comment.slice(0, 25)}...`}
                            </DynamicTooltip>
                          ) : (
                            lead.approved_comment
                          ))}
                      </td> */}
                      <td>
                        {lead.last_payment_date ? lead.last_payment_date : "--"}
                      </td>
                      <td>
                        <span
                          style={{
                            color: giveTextColor(
                              lead.last_payment_status === "Success"
                                ? "Approve"
                                : "red"
                            ),
                          }}
                        >
                          {lead.last_payment_status
                            ? lead.last_payment_status
                            : "--"}
                        </span>
                      </td>
                      {/* <td className="assigned leads-tool-fix">
                        {fkDeptId === '5' ? (
                          <select
                            value={
                              wo_status_opt.find(
                                (payopt) =>
                                  payopt.value == lead.work_order_status
                              )?.value
                            }
                            onChange={(event) => {
                              handleAssignToDropdownChange(
                                event,
                                lead.id,
                                lead.enquiry_id,
                                lead.user_id,
                                "Work Order Status"
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            disabled={
                              lead.work_order_status === "success" ||
                              lead.work_order_status === "reject"
                            }
                          >
                            <option value="">Select Status </option>
                            {wo_status_opt.map((leadopt, index) => (
                              <option key={index} value={leadopt.value}>
                                {leadopt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            style={{
                              color: giveTextColor(
                                lead.work_order_status === "success"
                                  ? "Approve"
                                  : lead.work_order_status === "pending"
                                    ? "Draft"
                                    : lead.work_order_status === "reject"
                                      ? "red"
                                      : ""
                              ),
                            }}
                          >
                            {wo_status_opt.find(
                              (payopt) =>
                                payopt.value === lead.work_order_status
                            )?.label || "Status Not Found"}
                          </span>
                        )}
                      </td> */}
                      {/* <td className="assigned leads-tool-fix">
                        {fkDeptId == 5 || user.role === "1" ? (
                          <select
                            value={
                              service_status_opt.find(
                                (payopt) => payopt.value == lead.service_status
                              )?.value
                            }
                            onChange={(event) => {
                              handleAssignToDropdownChange(
                                event,
                                lead.id,
                                lead.enquiry_id,
                                lead.user_id,
                                "Service Status"
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            disabled={
                              lead.service_status === "success" ||
                              lead.work_order_status === "reject"
                            }
                          >
                            <option value="">Select Status </option>
                            {service_status_opt.map((leadopt, index) => (
                              <option key={index} value={leadopt.value}>
                                {leadopt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            style={{
                              color: giveTextColor(
                                lead.service_status === "Success"
                                  ? "Approve"
                                  : lead.service_status === "Pending"
                                    ? "Draft"
                                    : lead.service_status === "Reject"
                                      ? "red"
                                      : ""
                              ),
                            }}
                          >
                            {service_status_opt.find(
                              (payopt) => payopt.value === lead.service_status
                            )?.label || "Status Not Found"}
                          </span>
                        )}
                      </td> */}
                    </tr>
                    {expanded === index && (
                      <tr className="expanded-row">
                        <td colSpan="19">
                          <table className="w100 tac common-table">
                            <thead>
                              <tr>
                                <th>Payment Date</th>
                                <th>Pymt Id</th>
                                <th>Receipt Id</th>
                                <th>Amount Type</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Mode</th>
                                <th>Attach</th>
                                <th>Comment</th>
                                <th>Pymt Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lead.PaymentDetails.map((payment, idx) => (
                                <tr
                                  key={idx}
                                  onClick={() =>
                                    handlePaymentRowClick(payment.id)
                                  }
                                >
                                  <td>{payment.payment_date}</td>
                                  <td>{payment.id}</td>
                                
				    {/* <td>
                                    {payment.payment_file_name ? (
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openInvoiceReceiptAttachmentFile(
                                            payment.payment_file_name
                                          );
                                        }}
                                      >
                                        {payment.invoice_receipt_id
                                          ? payment.invoice_receipt_id
                                          : "--"}
                                      </span>
                                    ) : (
                                      <>
                                        {payment.invoice_receipt_id
                                          ? payment.invoice_receipt_id
                                          : "--"}
                                      </>
                                    )}
                                  </td>*/}
                                  <td  ref={dropdownPaymentRef}>
                                    {payment.invoice_receipt_id && payment.payment_status ==='success'? (
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          togglePaymentDropdown(idx); // Use the new function here
                                        }}
                                        style={{
                                          color: giveTextColor("blue"),
                                        }}
                                        className="tdu cp"
                                      >
                                        {payment.invoice_receipt_id || '--'}
                                      </span>
                                    ) : (
                                      <>{payment.invoice_receipt_id ? payment.invoice_receipt_id : '--'}</>
                                    )}

                                    {payment.payment_status ==='success' && openDropdown.paymentIndex === idx && (
                                      <div className="pr">
                                        <div className="bill-menu finance-invoice-btn" ref={billMenuRef}>
                                          <p
                                            className="bill-item cp ls1"
				    onClick={(e) => {
                                              e.stopPropagation();
                                              getReceiptPdfUrl(payment.id,payment.user_id);
                                              
                                            }}
                                          >
                                            <FaRegEye className="mr4 fc8" /> View
                                          </p>
					    <p
                                            className="bill-item cp ls1"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSendReceipt(payment.id,payment.user_id);
                                            }}
                                            ref={sendMailRef} 
                                          >
                                            <IoMdMail className="mr4 fc8" /> Send Mail
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <span
                                     style={{
                                      color: giveTextColor(
                                        payment.discount_type === 'Discount'
                                          ? "Draft"
                                          : payment.discount_type === 'Scholarship'
                                          ? "blue"
                                          : "Completed"
                                      ),
                                    }}

                                    >{payment.discount_type ? payment.discount_type : '--'}</span>
                                  </td>
                                  <td>{payment.payment_amount}</td>
                                  <td>
                                    <span
                                      style={{
                                        color: giveTextColor(
                                          payment.payment_type === "Offline"
                                            ? "Awards"
                                            : "red"
                                        ),
                                      }}
                                    >
                                      {payment.payment_type
                                        ? payment.payment_type
                                        : "--"}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      style={{
                                        color: giveTextColor(
                                          payment.payment_mode === "Cash"
                                            ? "red"
                                            : payment.payment_mode === "Upi"
                                              ? "teal"
                                              : payment.payment_mode ===
                                                  "Net Banking"
                                                ? "News"
                                                : payment.payment_mode ===
                                                    "Credit Card"
                                                  ? "purple"
                                                  : payment.payment_mode ===
                                                      "Debit Card"
                                                    ? "pink"
                                                    : payment.payment_mode ===
                                                        "Cheaque"
                                                      ? "violet"
                                                      : payment.payment_mode ===
                                                          "Demand Draft"
                                                        ? "blue"
                                                        : ""
                                        ),
                                      }}
                                    >
                                      {payment.payment_mode
                                        ? payment.payment_mode
                                        : "--"}
                                    </span>
                                  </td>
                                  <td className="leads-tool-fix">
                                    {payment.attachment ? (
                                      <DynamicTooltip text="View Attachment">
                                        <FaRegEye
                                          className="icon edit-icon cp fs18 fc8"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openAttachmentFile(
                                              payment.attachment
                                            );
                                          }}
                                        />
                                      </DynamicTooltip>
                                    ) : (
                                      "--"
                                    )}
                                  </td>
				      <td className="leads-tool-fix scrollable-cell">
                                    {payment.approver_comment ? (
                                      <p>{payment.approver_comment}</p>
                                    ) : (
                                      '--'
                                    )}
                                  </td>
                                  {/* <td className="assigned leads-tool-fix">
                                    {fkDeptId == 5 || user.role === '1' ? (
                                      payment.payment_status === 'success' ? (
                                        <span style={{color: giveTextColor('Approve'),textTransform: "capitalize", }}>{payment.payment_status}</span>
                                      ) : (
                                        <select
                                          value={
                                            paymentStatusOpt.find((payopt) => payopt.value === payment.payment_status)?.value || ""
                                          }
                                          onChange={(event) => {
                                            handleAssignToPaymentDropdownChange(
                                              event,
                                              lead.id,
                                              lead.enquiry_id,
                                              lead.user_id,
                                              'Payment Status',
                                              idx,
                                              index
                                            );
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                          disabled={payment.payment_status === 'success'}
                                        >
                                          <option value="">Select Status</option>
                                          {paymentStatusOpt.map((leadopt, StatusOptionindex) => (
                                            <option key={StatusOptionindex} value={leadopt.value}>
                                              {leadopt.label}
                                            </option>
                                          ))}
                                        </select>
                                      )
                                    ) : (
                                      <span
                                        style={{
                                          color: giveTextColor(
                                            payment.payment_status === 'success'
                                              ? "Approve"
                                              : payment.payment_status === 'pending'
                                              ? "Draft"
                                              : payment.payment_status === 'rejected'
                                              ? "red"
                                              : ""
                                          ),
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {paymentStatusOpt.find((payopt) => payopt.value === payment.payment_status)?.label ||
                                          "Status Not Found"}
                                      </span>
                                    )}
                                  </td> */}
                                  <td className="assigned leads-tool-fix">
                                    {payment.payment_status !== "" ? (
                                      <span
                                        style={{
                                          color: giveTextColor(
                                            payment.payment_status === "success"
                                              ? "Approve"
                                              : payment.payment_status ===
                                                  "pending"
                                                ? "Draft"
                                                : payment.payment_status ===
                                                    "rejected"
                                                  ? "red"
                                                  : ""
                                          ),
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {payment.payment_status}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan="19" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> 
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default All;
