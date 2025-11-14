import React, { useRef, useEffect, useState } from "react";
import "../MyReports/Booked.css";
import SingleDropdown from "../../components/SingleDropdown";
import Tooltip from "../../components/Tooltip";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import { RiArrowUpDownFill } from "react-icons/ri";
import {
  FaRegEye,
  FaFileInvoice,
  FaFileDownload
} from "react-icons/fa";
import { giveTextColor } from "../../helpers/textColors";
import { IoReceipt } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import SidePopup from "../../components/Popup/SidePopup";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constant from "../../constant/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle.js";

const Payments = ({PaymentDataTab, loginData, paymentDataCount, sortBy, sortDirection, sortList, PaymentHeadTabData, handleNavLinkPaymentClick,handleNavLinkPaymentClickDiscount}) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Collections - Flapone Aviation");
  
  const [paymentData, setPaymentData] = useState([]);
  const [paymentHeadTabData, setPaymentHeadTabData] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAssignToPopupVisible, setAssignToPopupVisible] = useState(false);
  const [paymentHistoryPopup, setPaymentHistoryPopup] = useState(false);
  const [paymentHostoryData, setPaymentHostoryData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "payment_date_long", direction: "desc" });
  const [activeSortColumn, setActiveSortColumn] = useState("payment_date_long");
  const [activeHistorySortColumn, setActiveHistorySortColumn] = useState("");
  const [paymentStatusOpt, setPaymentStatusOpt] = useState([
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "success" },
    { label: "Rejected", value: "rejected" },
  ]);
  
  const [addCommentPopup, setAddCommentPopup] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedValue, setSelectedValue] = useState('');
  const [leadId, setLeadId] = useState('');
  const [enquiry_id, setEnquiryId] = useState('');
  const [user_id, setUserId] = useState('');
  const [commentError, setCommentError] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const viewRef = useRef(null);
  const [userDetail, setUserDetail] = useState([]);
  const sendMailRef = useRef(null)
  const [historyName, setHistoryName] = useState('');

  const fkDeptId = loginData.dept_id;
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };
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
  // const handleAssignToDropdownChange = (event, leadId, enquiry_id, user_id) => {
  //   updatePaymentStatusChange(event.target.value, leadId, enquiry_id, user_id);
  // };

  const handleAssignToDropdownChange = (event, leadId, enquiry_id, user_id) => {
    const selectedValue = event.target.value;
    if (selectedValue === "success" || selectedValue === "rejected") {
      openAddCommentPopup(selectedValue, leadId, enquiry_id, user_id);
    } else {
      updatePaymentStatusChange(selectedValue, leadId, enquiry_id, user_id);
    }
  };

  const handleWorkOrderClick = (work_order_id) => {
    //window.open(`/my-finance/${work_order_id}?tab=workorder`, "_blank");
    window.open(`/my-finance/${work_order_id}?tab=workorder`);
  };

  const toggleDropdown = (index, type) => {
    const key = `${index}-${type}`;
    setDropdownOpen(dropdownOpen === key ? null : key);
  };
  const isDropdownOpen = (index, type) => {
    return dropdownOpen === `${index}-${type}`;
  };

  const [paymentFileName, setPaymentFileName] = useState("");
  const getReceiptPdfUrl = async (receiptId) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=getReceiptPdf`,
      headers: { "Auth-Id": user.auth_id },
      data: {'user_id': user.user_id, 'receiptId': receiptId},
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
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const handleSendReceipt = async (receiptId) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=sendReceipt`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        'user_id': user.user_id,
        'receiptId': receiptId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          toast.success(response.data.data.msg);
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

  const getInvoicePdfUrl = async (invoiceId) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=getInvoicePdf`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        'user_id': user.user_id,
        'invoiceId': invoiceId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          setInvoiceFileName(response.data.data.invoice_file_name);
		if(response.data.data.invoice_file_name){
	      window.open(
              constant.invoicepdfurl + response.data.data.invoice_file_name
            );
		}

          toast.success(response.data.data.msg);
        } else {
          toast.error(response.data.data.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  const handleSendInvoice = async (invoiceId) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/mylead_detail.php?fun=sendIvoice`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        'user_id': userDetail.user_id,
        'invoiceId': invoiceId,
      },
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        if (response.data.data.status) {
          toast.success(response.data.data.msg);
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

  const handlePopupSubmit = () => {
    if (!comment.trim()) {
      setCommentError(true);
      return;
    }
  
    setCommentError(false);
    updatePaymentStatusChange(selectedValue, leadId, enquiry_id, user_id, comment);
    setAddCommentPopup(false);
    setComment("");
  };

  const openAddCommentPopup = (selectedValue, leadId, enquiry_id, user_id) => {
    setSelectedValue(selectedValue);
    setLeadId(leadId);
    setEnquiryId(enquiry_id);
    setUserId(user_id);
    setAddCommentPopup(true);
  };
  
  const closeAddCommentPopup = () => {
    setAddCommentPopup(false);
    setComment(""); 
  };

  const handleRowClick = (leadId) => {
    navigate(`/my-leads/${leadId}`);
  };
  
  const handlePaymentHistoryPopupClose = () => {
    setPaymentHistoryPopup(false);
    setHistoryName('');
  };

  const handleOpenPaymentHistory = (id, workorder_id, username) => {
    getPaymentHistoryAccWO(id, workorder_id);
    setHistoryName(username);
  };

  const getPaymentHistoryAccWO = async (id, workorder_id) => {
    if(id){	  
    axios({
      method: "post",
      url: `${constant.base_url}/admin/payment_details.php?fun=getPaymentHistoryAccWO`,
      headers: {"Auth-Id": user.auth_id },
      data: {'user_id': id, 'workorder_id': workorder_id}
    }).then(function (response) {
      if(response.data.data.status != '0'){
      let responseData = response.data.data.payment_list;
        setPaymentHistoryPopup(true);
        /*if (sortConfig.key) {
          sortPaymentHistoryData(sortConfig.key, sortConfig.direction);
        }else{*/
        setPaymentHostoryData(responseData);
	/*}*/
      }
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
    }	    
  }

  
  const getUserData = async (id) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/payment_details.php?fun=getUserData`,
      headers: {"Auth-Id": user.auth_id },
      data: {'user_id': id}
    }).then(function (response) {
      let responseData = response.data.data;
      if(responseData.status != '0'){
        setUserDetail(responseData.list);
      }
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error during login:", error);
    });
  }

  const updatePaymentStatusChange = async (value, id, enquiry_id, user_id, comment) => {
    try {
        const response = await axios.post(`${constant.base_url}/admin/payment_details.php?fun=updatePaymentStatus`, {
            status: value,
            id: id,
            enquiry_id: enquiry_id,
            user_id: user_id,
            comment: comment,
        }, {
            headers: { "Auth-Id": user.auth_id }
        });

        const responseData = response.data.data;
        if (responseData.status !== "0") {
            setPaymentData((prevData) =>
                prevData.map((lead) =>
                    lead.id === id ? { ...lead, payment_status: value, approver_comment: comment, } : lead
                )
            );
            toast.success(responseData.msg);
        } else {
          toast.error(responseData.msg);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
};

  const openAttachmentFile = (value) => {
    window.open(value, '_blank', 'noopener,noreferrer');
  }

  const formatDate = (dateStr) => {
    const [day, month, year, time, period] = dateStr.split(' ');
    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${time} ${period}`;
    
    return {
      formattedDate,
      formattedTime
    };
  };

const handleSortByChange = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setActiveSortColumn(key);
    setSortConfig({ key, direction });
    sortPaymentData(key, direction);
  };
  const handleHistorySortByChange = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setActiveHistorySortColumn(key);
    setSortConfig({ key, direction });
    sortPaymentHistoryData(key, direction);
  }

  const sortPaymentHistoryData = (key, direction) => {
    const sortedData = [...paymentHostoryData].sort((a, b) => {
	   const aValue = a[key] || '';
      const bValue = b[key] || '';
      if (key === 'id' || key === 'position' || key === 'payment_date_long' ||  key === 'payment_amount_long') {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }else{
        const comparison = aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
              return direction === "asc" ? comparison : -comparison;
      }
/*
      if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
      */
    });
/*
	  const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      if (sortBy === 'id' || sortBy === 'position' || sortBy === 'payment_date_long' ||  sortBy === 'payment_amount_long') {
        return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
      } else {
        const comparison = aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      }
  */
    setPaymentHostoryData(sortedData);
  };

  const sortPaymentData = (key, direction) => {
    const sortedData = [...PaymentDataTab].sort((a, b) => {
/*      if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });*/
	 const aValue = a[key] || '';
      const bValue = b[key] || '';
        if (key === 'id' || key === 'position' || key === 'payment_date_long' ||  key === 'payment_amount_long') {
                return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
        }else{
          const comparison = aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
          return  direction === "asc" ? comparison : -comparison;
        }
    });


    setPaymentData(sortedData);
  };
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });  

  useEffect(() => {
    //setPaymentData(PaymentDataTab);
    if (sortConfig.key) {
      sortPaymentData(sortConfig.key, sortConfig.direction);
    }
  }, [PaymentDataTab]);

  // useEffect(() => {
  //   setPaymentData(PaymentDataTab);
  // }, [PaymentDataTab]);

  useEffect(() => {
    setPaymentHeadTabData(PaymentHeadTabData);
  }, [PaymentHeadTabData]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !viewRef.current?.contains(event.target) &&
        !sendMailRef.current?.contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {paymentDataCount || 0}
      </div>
      <div className="card-content df pt24 brd-b1 pb24 pl24 jcc">
        <div 
          className="card-item finance-card df fdc jcc br4 cp"
          onClick={paymentHeadTabData.total_count > 0 ? handleNavLinkPaymentClick([]) : undefined}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {paymentHeadTabData && paymentHeadTabData.total_amount
              ? paymentHeadTabData.total_amount
              : 0}
          </span>
          <p className="fw6  fs16 fc5 ">
            Received Amount
            {paymentHeadTabData && paymentHeadTabData.total_count ? (
              ` (${paymentHeadTabData.total_count})`
            ) : ''}
          </p>
        </div>
        <div 
          className="card-item finance-card df fdc jcc br4 cp"
          onClick={paymentHeadTabData.total_approved_count > 0 ? handleNavLinkPaymentClick(['success']) : undefined}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {paymentHeadTabData && paymentHeadTabData.total_approved_amount
              ? paymentHeadTabData.total_approved_amount
              : 0}
          </span>
          <p className="fw6  fs16 fc5">
            Approved Amount
            {paymentHeadTabData && paymentHeadTabData.total_approved_count ? (
              ` (${paymentHeadTabData.total_approved_count})`
            ) : ''}
          </p>
        </div>
        <div 
          className="card-item finance-card df fdc jcc br4 cp"
          onClick={paymentHeadTabData.total_pending_count > 0 ? handleNavLinkPaymentClick(['pending']) : undefined}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {paymentHeadTabData && paymentHeadTabData.total_pending_amount
              ? paymentHeadTabData.total_pending_amount
              : 0}
          </span>
          <p className="fw6 fs16 fc5">
            Pending Amount
            {paymentHeadTabData && paymentHeadTabData.total_pending_count ? (
              ` (${paymentHeadTabData.total_pending_count})`
            ) : ''}
          </p>
        </div>
        <div 
          className="card-item finance-card df fdc jcc br4 cp"
          onClick={paymentHeadTabData.total_reject_count > 0 ? handleNavLinkPaymentClick(['rejected']) : undefined}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {paymentHeadTabData && paymentHeadTabData.total_reject_amount
              ? paymentHeadTabData.total_reject_amount
              : 0}
          </span>
          <p className="fw6 fs16 fc5">
            Rejected Amount
            {paymentHeadTabData && paymentHeadTabData.total_reject_count ? (
              ` (${paymentHeadTabData.total_reject_count})`
            ) : ''}
          </p>
        </div>
	<div 

          className="card-item finance-card df fdc jcc br4 cp"
          onClick={paymentHeadTabData.schloarship_count > 0 ? handleNavLinkPaymentClickDiscount({label: "Scholarship", value: "scholarship"}) : undefined}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {paymentHeadTabData && paymentHeadTabData.schloarship_count
              ? paymentHeadTabData.schloarship_amount
              : 0}
          </span>
          <p className="fw6 fs16 fc5">
            Scholarship Amount
            {paymentHeadTabData && paymentHeadTabData.schloarship_count ? (
              ` (${paymentHeadTabData.schloarship_count})`
            ) : ''}
          </p>
        </div>
	<div 

          className="card-item finance-card df fdc jcc br4 cp"
          onClick={paymentHeadTabData.discount_count > 0 ? handleNavLinkPaymentClickDiscount({label: "Discount", value: "discount"}) : undefined}
        >
          <span className="fs28 fc1 mb8 v-center">
            <LiaRupeeSignSolid />
            {paymentHeadTabData && paymentHeadTabData.discount_count
              ? paymentHeadTabData.discount_amount
              : 0}
          </span>
          <p className="fw6 fs16 fc5">
            Discount Amount
            {paymentHeadTabData && paymentHeadTabData.discount_count ? (
              ` (${paymentHeadTabData.discount_count})`
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
              {/* <th>
                <p className="box-center">Hist.</p>
              </th> */}
              <th onClick={() => handleSortByChange("user_id")} className={activeSortColumn === "user_id" ? "fc1" : ""}>
                <p className="box-center">
                  User ID
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("username")} className={activeSortColumn === "username" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Student/Company Name">Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("agent_name")} className={activeSortColumn === "agent_name" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Sales Excutive Name">RM Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("course_name")} className={activeSortColumn === "course_name" ? "fc1" : ""}>
                <p className="box-center">
                  Course Name
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
	        <th onClick={() => handleSortByChange("discount_type")} className={activeSortColumn === "discount_type" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Amount Type">Amt Type</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>

              <th onClick={() => handleSortByChange("payment_amount_long")} className={activeSortColumn === "payment_amount_long" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Received Amount">Recd Amt</DynamicTooltip>
                
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("payment_type")} className={activeSortColumn === "payment_type" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Payment Type">Type</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("payment_mode")} className={activeSortColumn === "payment_mode" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Payment Mode">Mode</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th>
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Attachment">Att.</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("workorder_id")} className={activeSortColumn === "workorder_id" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="WorkOrder ID">WO Id</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("txn_id")} className={activeSortColumn === "txn_id" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Payment ID">Pymt Id</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("approver_comment")} className={activeSortColumn === "approver_comment" ? "fc1" : ""}>
                <p className="box-center">
                Comment
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th style={{ width: "82px" }} onClick={() => handleSortByChange("payment_date_long")} className={activeSortColumn === "payment_date_long" ? "fc1" : ""}>
                <p className="box-center">
                <DynamicTooltip direction="bottom" text="Payment Date">Date</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th onClick={() => handleSortByChange("payment_status")} className={activeSortColumn === "payment_status" ? "fc1" : ""}>
                <p className="box-center">
                  Status
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
            </tr>
          </thead>

          <tbody>
            {paymentData.length > 0 ? (
              paymentData.map((lead, index) => {
                const { formattedDate, formattedTime } = formatDate(lead.payment_date);

                return (
                  <tr key={index} onClick={() => handleRowClick(lead.user_id)}>
                    {/* <td className="leads-tool-fix">
                      <label className="checkbox-label cp p10"  onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPaymentHistory(lead.user_id, lead.workorder_id,lead.username);
                        }}>
                        <BsGraphUpArrow
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPaymentHistory(lead.user_id, lead.workorder_id,lead.username);
                          }}
                        />
                      </label>
                    </td> */}

                    <td>{lead.user_id ? lead.user_id : "--"}</td>

                    <td className="leads-tool-fix">
                      <div className="v-center fdc">
                        <span
                          style={{
                            color: giveTextColor(
                              lead.user_type === 'Student'
                                ? "Approve"
                                : lead.user_type === 'Company'
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

                    <td className="leads-tool-fix">
                      {lead.agent_name && (
                              <DynamicTooltip direction="right" text={lead.agent_name}><span className="lc2 text-row">{lead.agent_name}</span></DynamicTooltip>
                            )}
                    </td>

                    <td className="leads-tool-fix">
                      {lead.course_name && (
                              <DynamicTooltip direction="right" text={lead.course_name}><span className="lc2 text-row">{lead.course_name}</span></DynamicTooltip>
                            )}
                    </td>
		    <td>
                      <span
                        style={{
                          color: giveTextColor(
                            lead.discount_type === 'Discount'
                              ? "Draft"
                              : "Completed"
                          ),
                        }}
                      >{lead.discount_type ? lead.discount_type : "--"}</span>
                    </td>
                    <td>{lead.payment_amount ? lead.payment_amount : "--"}</td>
                    
                    <td>
                      <span
                        style={{
                          color: giveTextColor(
                            lead.payment_type === 'Offline'
                              ? "Awards"
                              : "red"
                          ),
                        }}
                      >{lead.payment_type ? lead.payment_type : "--"}</span>
                    </td>
                    
                    <td>
                      <span
                        style={{
                          color: giveTextColor(
                            lead.payment_mode === 'Cash'
                              ? "red"
                              : lead.payment_mode === 'Upi'
                              ? "teal"
                              : lead.payment_mode === 'Net Banking'
                              ? "News"
                              : lead.payment_mode === 'Credit Card'
                              ? "purple"
                              : lead.payment_mode === 'Debit Card'
                              ? "pink"
                              : lead.payment_mode === 'Cheaque'
                              ? "violet"
                              : lead.payment_mode === 'Demand Draft'
                              ? "blue"
                              : ""
                          ),
                        }}
                      >{lead.payment_mode ? lead.payment_mode : "--"}</span>
                    </td>
                    
                    <td className="leads-tool-fix">
                      {lead.attachment ? (
                        <Tooltip title="View Attachment">
                          <FaRegEye
                            className="icon edit-icon cp fs18 fc8"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAttachmentFile(lead.attachment)
                            }}
                          />
                        </Tooltip>
                      ) : (
                        "--"
                      )}
                    </td>
                    
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkOrderClick(lead.workorder_id)
                      }}
                      style={{
                        color: giveTextColor("blue"),
                      }}
                      className="tdu cp"
                    >{lead.workorder_id ? `WO-${lead.workorder_id}` : "--"}</td>
                    
                    <td>{lead.txn_id ? lead.txn_id : "--"}</td>
				<td className="leads-tool-fix scrollable-cell">
                      {lead.approver_comment ? (
                        <p>{lead.approver_comment}</p>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td>
                      <div style={{ display: "block" }}>
                        <span>{lead.formattedDate}</span>
                        <span className="mt-4" style={{ display: "block", marginTop: "4px" }}>
                          {lead.formattedTime}
                        </span>
                      </div>
                    
                    </td>
                    <td className="assigned leads-tool-fix">
                    {((fkDeptId === '5' && lead.discount_type !== 'Discount') || 
                          ((lead.discount_type === 'Discount' || lead.discount_type === 'Scholarship') && fkDeptId !== '4' && fkDeptId !== '10' &&  user.role === '1') || (lead.discount_type === 'Discount' && fkDeptId==='7' && user.role==='2'  && lead.approved_permission === '1')
                        ) ? (
                          <select
                            value={
                              paymentStatusOpt.find((payopt) => payopt.value === lead.payment_status)?.value
                            }
                            onChange={(event) => {
                              handleAssignToDropdownChange(
                                event,
                                lead.id,
                                lead.enquiry_id,
                                lead.user_id
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            disabled={lead.payment_status === 'success'}
                          >
                            <option value="">Select Status</option>
                            {paymentStatusOpt.map((leadopt, index) => (
                              <option key={index} value={leadopt.value}>
                                {leadopt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                        <span
                          style={{
                            color: giveTextColor(
                              lead.payment_status === 'success'
                                ? "Approve"
                                : lead.payment_status === 'pending'
                                ? "Draft"
                                : lead.payment_status === 'rejected'
                                ? "red"
                                : ""
                            ),
                          }}
                        >
                          {paymentStatusOpt.find(
                            (payopt) => payopt.value === lead.payment_status
                          ) ?.label || "Status Not Found"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="14" style={{ textAlign: 'center' }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {paymentHistoryPopup && (
        <SidePopup
          show={paymentHistoryPopup}
          onClose={handlePaymentHistoryPopupClose}
          className="full-width"
        >
          <div className="selected-plan-details">
            <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
              <p className="fs18 fc1 ">{historyName.trim()}'s Payment History</p>
              <button
                onClick={() => {
                  setPaymentHistoryPopup(false);
                  document.body.style.overflow = "auto";
                }}
                className="lead-close-button"
              >
                X
              </button>
            </div>
            <div className="booked p8">
              <table className="ledger-table cp w100 wsnw">
                <thead>
                  <tr>
                    <th onClick={() => handleHistorySortByChange("payment_date")} className={activeHistorySortColumn === "payment_date" ? "fc1" : ""}>
                      <p className="box-center">
                        Date
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("flapone_work_order_id")} className={activeHistorySortColumn === "workorder_id" ? "fc1" : ""}>
                      <p className="box-center">
                        WO Id
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("payment_gateway_id")} className={activeHistorySortColumn === "payment_gateway_id" ? "fc1" : ""}>
                      <p className="box-center">
                        Pymt ID
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("invoice_receipt_id")} className={activeHistorySortColumn === "invoice_receipt_id" ? "fc1" : ""}>
                      <p className="box-center">
                        Invoice No.
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("course_name")} className={activeHistorySortColumn === "course_name" ? "fc1" : ""}>
                      <p className="box-center">
                        Course Name
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("amount_type")} className={activeHistorySortColumn === "course_amount" ? "fc1" : ""}>
                      <p className="box-center">
                        Amt Type
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("course_amount")} className={activeHistorySortColumn === "course_amount" ? "fc1" : ""}>
                      <p className="box-center">
                        Course Amt
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("amount")} className={activeHistorySortColumn === "payment_amount" ? "fc1" : ""}> 
                      <p className="box-center">
                        Recd Amt
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    {/* <th onClick={() => handleHistorySortByChange("discount_amount")} className={activeHistorySortColumn === "discount_amount" ? "fc1" : ""}> 
                      <p className="box-center">
                        Discount
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th> */}
                    <th onClick={() => handleHistorySortByChange("pending_amount")} className={activeHistorySortColumn === "pending_amount" ? "fc1" : ""}>
                      <p className="box-center">
                        Pending Amt
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("payment_gateway_type")} className={activeHistorySortColumn === "payment_type" ? "fc1" : ""}>
                      <p className="box-center">
                        Type
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("payment_mode")} className={activeHistorySortColumn === "payment_mode" ? "fc1" : ""}>
                      <p className="box-center">
                        Mode
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th >
                      <p className="box-center">
                        Att.
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("approver_comment")} className={activeHistorySortColumn === "approver_comment" ? "fc1" : ""}>
                      <p className="box-center">
                        Comment
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("payment_gateway_status")} className={activeHistorySortColumn === "payment_status" ? "fc1" : ""}>
                      <p className="box-center">
                        Pymt Status
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("work_order_status")} className={activeHistorySortColumn === "work_order_status" ? "fc1" : ""}>
                      <p className="box-center">
                        WO Status
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th onClick={() => handleHistorySortByChange("service_status")} className={activeHistorySortColumn === "service_status" ? "fc1" : ""}>
                      <p className="box-center">
                        Course Status
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHostoryData.length > 0 ? (
                    paymentHostoryData.map((lead, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div style={{ display: "block" }}>
                              <span>{lead.payment_date}</span>
                            </div>
                          </td>
                          {/* <td>
                            <div className="v-center fdc">
                              <span>
                                {lead.username && (
                                  <Tooltip title={capitalizeWords(lead.username)}>
                                    {capitalizeWords(lead.username).length > 20
                                      ? `${capitalizeWords(lead.username).slice(0, 20)}...`
                                      : capitalizeWords(lead.username)}
                                  </Tooltip>
                                )}
                              </span>
                              <span className="mt4">
                                {lead.user_type && (
                                  <Tooltip title={capitalizeWords(lead.user_type)}>
                                    {capitalizeWords(lead.user_type).length > 20
                                      ? `${capitalizeWords(lead.user_type).slice(0, 20)}...`
                                      : capitalizeWords(lead.user_type)}
                                  </Tooltip>
                                )}
                              </span>
                            </div>
                          </td> */}
                          <td>{lead.flapone_work_order_id ? `WO-${lead.flapone_work_order_id}` : "--"}</td>
                          <td>{lead.payment_gateway_id ? lead.payment_gateway_id : "--"}</td>
                          <td>{lead.invoice_receipt_id ? lead.invoice_receipt_id : "--"}</td>
                          <td>
                            {lead.course_name && (
                              <Tooltip title={lead.course_name}>
                                {lead.course_name.length > 20
                                  ? `${lead.course_name.slice(0, 20)}...`
                                  : lead.course_name}
                              </Tooltip>
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                color: giveTextColor(
                                  lead.discount_type === 'Discount'
                                    ? "Draft"
                                    : "Completed"
                                ),
                              }}
                            >
                            {lead.discount_type}</span>
                          </td>
                          <td>{lead.course_amount ? formatter.format(lead.course_amount) : "--"}</td>
                          <td> {(lead.discount_type === "Discount" || lead.discount_type === "Scholarship") ? (
                              formatter.format(lead.discount_amount)
                            ) : (
                              formatter.format(lead.amount)
                            )}
                          </td>

                          {/* <td
                            style={{
                              color: giveTextColor(
                                lead.discount_amount === "0"
                                  ? ""
                                  : "success"
                              ),
                              textTransform: "capitalize",
                            }}
                          >
                            {formatter.format(lead.discount_amount)}
                          </td> */}
                          <td
                            style={{
                              color: giveTextColor(
                                lead.pending_amount === "0"
                                  ? "success"
                                  : "red"
                              ),
                              textTransform: "capitalize",
                            }}
                          >
                            {formatter.format(lead.pending_amount)}
                          </td>
                          <td>
                            <span
                              style={{
                                color: giveTextColor(
                                  lead.payment_gateway_type === 'Offline'
                                    ? "Awards"
                                    : "red"
                                ),
                              }}
                            >{lead.payment_gateway_type ? lead.payment_gateway_type : "--"}</span>
                          </td>
                          <td>
                            <span
                              style={{
                                color: giveTextColor(
                                  lead.payment_mode === 'Cash'
                                    ? "red"
                                    : lead.payment_mode === 'Upi'
                                    ? "teal"
                                    : lead.payment_mode === 'Net Banking'
                                    ? "News"
                                    : lead.payment_mode === 'Credit Card'
                                    ? "purple"
                                    : lead.payment_mode === 'Debit Card'
                                    ? "pink"
                                    : lead.payment_mode === 'Cheaque'
                                    ? "violet"
                                    : lead.payment_mode === 'Demand Draft'
                                    ? "blue"
                                    : ""
                                ),
                              }}
                            >{lead.payment_mode ? lead.payment_mode : "--"}</span>
                          </td>
                          <td>
                            {lead.attachment ? (
                              <Tooltip title="View Attachment">
                                <FaRegEye
                                  className="icon edit-icon cp fs18 fc8"
                                  onClick={() =>
                                    openAttachmentFile(lead.attachment)
                                  }
                                />
                              </Tooltip>
                            ) : (
                              "--"
                            )}
                          </td>
                          <td className="leads-tool-fix">
                            {lead.approver_comment && (
                              lead.approver_comment.length > 25 ? (
                                <Tooltip title={lead.approver_comment}>
                                  {`${lead.approver_comment.slice(0, 25)}...`}
                                </Tooltip>
                              ) : (
                                lead.approver_comment
                              )
                            )}
                          </td>
                          <td
                            style={{
                              color: giveTextColor(
                                lead.payment_gateway_status
                              ),
                              textTransform: "capitalize",
                            }}
                          >
                            {lead.payment_gateway_status}
                          </td>
                          <td
                            style={{
                              color: giveTextColor(lead.work_order_status),
                              textTransform: "capitalize",
                            }}
                          >
                            {lead.work_order_status}
                          </td>
                          <td
                            style={{
                              color: giveTextColor(lead.service_status),
                              textTransform: "capitalize",
                            }}
                          >
                            {lead.service_status === "Success"
                              ? "Completed"
                              : lead.service_status}
                          </td>
                        <td>
                          <div className="box-center" ref={dropdownRef}>
                            {lead.payment_gateway_status !== "Rejected" && ( 
                              <Tooltip title="Receipt">
                                <IoReceipt
                                  className="icon edit-icon cp fs18 fc8"
                                  style={{ verticalAlign: "middle", cursor: "pointer" }}
                                  onClick={() => toggleDropdown(index, "receipt")}
                                />
                              </Tooltip>
                            )}

                            {lead.payment_gateway_status !== "Rejected" && lead.work_order_status === "Success" && (
                              <Tooltip title="Invoice">
                                <FaFileInvoice
                                  className="fc8 fs18 mr8 cp ml12"
                                  onClick={() => toggleDropdown(index, "invoice")}
                                />
                              </Tooltip>
                            )}
                          </div>
                          {isDropdownOpen(index, "receipt") && (
                            <div className="bill-menu">
                              <p
                                className="bill-item cp ls1"
                                onClick={() => getReceiptPdfUrl(lead.payment_id)}
                                ref={viewRef}
                              >
                                <FaRegEye className="mr4 fc8" /> View
                              </p>
                              <p
                                className="bill-item cp ls1"
                                onClick={() => handleSendReceipt(lead.payment_id)}
                                ref={sendMailRef} 
                              >
                                <FaFileDownload className="mr4 fc8" /> Send Mail
                              </p>
                            </div>
                          )}
                          {isDropdownOpen(index, "invoice") && (
                            <div className="bill-menu">
                              <p
                                className="bill-item cp ls1"
                                onClick={() => getInvoicePdfUrl(lead.flapone_work_order_id)}
                                ref={viewRef}
                              >
                                <FaRegEye className="mr4 fc8" /> View
                              </p>
                              <p
                                className="bill-item cp ls1"
                                onClick={() => handleSendInvoice(lead.flapone_work_order_id)}
                                ref={sendMailRef} 
                              >
                                <FaFileDownload className="mr4 fc8" /> Send Mail
                              </p>
                            </div>
                          )}
                        </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="14" style={{ textAlign: 'center' }}>
                        No records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SidePopup>
      )}
      {addCommentPopup && (
        <Popup
          onClose={closeAddCommentPopup}
          title="Add Comment(s)"
          txtSubHeading={""}
        >
          <div className="comments-input">
            <label className="fc15 fw6 fs14 mb12 ls1">Comment</label>
            <textarea
              className="comments p12 br4"
              placeholder="Any Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {commentError && <p className="form-error-messages error mt10 fc4">Comment cannot be blank</p>}
          </div>
          <div className="button-container brd-none myteam-filters">
            <button className="update-button  btn-blue" onClick={handlePopupSubmit}>Submit</button>
            <button className="btn-cancel clear" onClick={() => setAddCommentPopup(false)}>Cancel</button>
          </div>
        </Popup>
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Payments;
