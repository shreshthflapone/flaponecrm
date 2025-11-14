import React, { useRef, useEffect, useState } from "react";
import "../MyReports/Booked.css";
import DynamicTooltip from "../../components/Dynamic_Tooltip.js";
import Popup from "../../components/Popup/Popup";
import moment from "moment";
import { FaRegEye, FaFileInvoice, FaFileDownload } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { RiArrowUpDownFill } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { giveTextColor } from "../../helpers/textColors";
import { BsGraphUpArrow } from "react-icons/bs";
import SidePopup from "../../components/Popup/SidePopup";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constant from "../../constant/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoReceipt } from "react-icons/io5";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useTitle } from "../../hooks/useTitle.js";

const WorkOrder = ({
  expandRowByFilter,
  WorkOrderDataTab,
  loginData,
  workOrderDataCount,
  sortBy,
  sortDirection,
  sortList,
  WorkOrderHeadTabData,
  WorkOrderDisableViaPaymentId,
  handleNavLinkClick,
  handleCommonNavClick
}) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Sales - Flapone Aviation");
  
  const [WorkOrderData, SetWorkOrderData] = useState([]);
  const [workOrderHeadTabData, setWorkOrderHeadTabData] = useState([]);
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
	
  const handleAssignToClick = () => {
    const updatedLeads = WorkOrderData.map((lead) => {
      if (selectedLeads.includes(lead.id)) {
        return { ...lead, assignedTo: assigned };
      } else {
        return lead;
      }
    });

    SetWorkOrderData(updatedLeads);
    setSelectedLeads([]);
    setAssigned("");
    setAssignToPopupVisible(false);
  };

  const toggleDropdown = (index, type) => {
    const key = `${index}-${type}`;
    setDropdownOpen(dropdownOpen === key ? null : key);
  };
  const isDropdownOpen = (index, type) => {
    return dropdownOpen === `${index}-${type}`;
  };

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

  const handlePopupSubmit = () => {
    if (!comment.trim()) {
      setCommentError(true);
      return;
    }

    setCommentError(false);
    if (labelName === "Work Order Status") {
      updateWorkOrderStatusChange(
        selectedValue,
        leadId,
        enquiry_id,
        user_id,
        comment
      );
    } else if (labelName === "Payment Status") {
      updatePaymentStatusChange(
        selectedValue,
        leadId,
        enquiry_id,
        user_id,
        comment
      );
    } else {
      updateWorkOrderServiceStatusChange(
        selectedValue,
        leadId,
        enquiry_id,
        user_id,
        comment
      );
    }
    setAddCommentPopup(false);
    setComment("");
  };

  const openAddCommentPopup = (
    selectedValue,
    leadId,
    enquiry_id,
    user_id,
    label
  ) => {
    setSelectedValue(selectedValue);
    setLeadId(leadId);
    setEnquiryId(enquiry_id);
    setUserId(user_id);
    setAddCommentPopup(true);
    setLabelName(label);
  };

  const closeAddCommentPopup = () => {
    setAddCommentPopup(false);
    setComment("");
    setLabelName("");
    setLabelIndex("");
    setWorkIndex("");
    setCommentError(false);
  };

  const handleAssignToDropdownChange = (
    event,
    leadId,
    enquiry_id,
    user_id,
    label
  ) => {
    const selectedValue = event.target.value;
    if (
      selectedValue === "success" ||
      selectedValue === "rejected" ||
      selectedValue === "reject"
    ) {
      openAddCommentPopup(selectedValue, leadId, enquiry_id, user_id, label);
    } else {
      if (label === "Work Order Status") {
        updateWorkOrderStatusChange(
          event.target.value,
          leadId,
          enquiry_id,
          user_id
        );
      } else {
        updateWorkOrderServiceStatusChange(
          event.target.value,
          leadId,
          enquiry_id,
          user_id
        );
      }
    }
  };
  const handleAssignToPaymentDropdownChange = (
    event,
    leadId,
    enquiry_id,
    user_id,
    label,
    index,
    workOrder_index
  ) => {
    const selectedValue = event.target.value;
    if (selectedValue === "success" || selectedValue === "rejected") {
      openAddCommentPopup(
        selectedValue,
        leadId,
        enquiry_id,
        user_id,
        label,
        index,
        workOrder_index
      );
    } else {
      updatePaymentStatusChange(
        selectedValue,
        leadId,
        enquiry_id,
        user_id,
        "",
        index,
        workOrder_index
      );
    }
  };
  const updatePaymentStatusChange = async (
    value,
    id,
    enquiry_id,
    user_id,
    comment,
    index,
    workOrder_index
  ) => {
    try {
      const response = await axios.post(
        `${constant.base_url}/admin/workorder_details.php?fun=updatePaymentStatus`,
        {
          status: value,
          id: id,
          enquiry_id: enquiry_id,
          user_id: user_id,
          comment: comment,
        },
        {
          headers: { "Auth-Id": user.auth_id },
        }
      );

      const responseData = response.data.data;
      if (responseData.status !== "0") {
        // SetWorkOrderData((prevData) =>
        //   prevData.map((workOrder, wIndex) => wIndex === workOrder_index ? {
        //       ...workOrder,
        //       PaymentDetails: workOrder.PaymentDetails.map((paymentDetail, pIndex) =>
        //         pIndex === index ? {
        //           ...paymentDetail,
        //           payment_status: value,
        //           approver_comment: comment,
        //         } : paymentDetail
        //       ),
        //     } : workOrder
        //   )
        // );
        SetWorkOrderData((prevData) => {
          return prevData.map((workOrder, wIndex) => {
            if (wIndex === workOrder_index) {
              return {
                ...workOrder,
                PaymentDetails: workOrder.PaymentDetails.map(
                  (paymentDetail, pIndex) => {
                    if (pIndex === index) {
                      return {
                        ...paymentDetail,
                        payment_status: value,
                        approver_comment: comment,
                      };
                    } else {
                      return paymentDetail;
                    }
                  }
                ),
              };
            } else {
              return workOrder;
            }
          });
        });

        toast.success(responseData.msg);
      } else {
        toast.error(responseData.msg);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  //Unique Function
  const handleAssignToServiceStatus = (event, leadId, enquiry_id, user_id) => {
    // const updatedLeads = WorkOrderData.map((lead) => {
    //   if (lead.id === leadId) {
    //     return { ...lead, payment_stat: event.target.value };
    //   } else {
    //     return lead;
    //   }
    // });
    // SetWorkOrderData(updatedLeads);
    updateWorkOrderServiceStatusChange(
      event.target.value,
      leadId,
      enquiry_id,
      user_id
    );
  };
  const handleAssignToWorkStatus = (event, leadId, enquiry_id, user_id) => {
    updateWorkOrderStatusChange(
      event.target.value,
      leadId,
      enquiry_id,
      user_id
    );
  };
  //Unique Function

  const handleRowClick = (leadId) => {
    window.open(`/my-leads/${leadId}`, "_blank");
  };
  const handlePaymentRowClick = (work_order_id) => {
    window.open(`/my-finance/${work_order_id}?tab=payments`, "_blank");
   // window.open(`/my-finance/${work_order_id}?tab=payments`);
  };
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const handlePaymentHistoryPopupClose = () => {
    setPaymentHistoryPopup(false);
    setHistoryName("");
  };
  const handleOpenPaymentHistory = (id, username) => {
    getPaymentHistoryAccWO(id);
    setHistoryName(username);
  };
  const formatDate = (dateStr) => {
    const [day, month, year, time, period] = dateStr.split(" ");
    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${time} ${period}`;

    return {
      formattedDate,
      formattedTime,
    };
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

  const updateWorkOrderStatusChange = async (
    value,
    id,
    enquiry_id,
    user_id,
    comment
  ) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/workorder_details.php?fun=updateWorkOrderStatusChange`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        status: value,
        id: id,
        enquiry_id: enquiry_id,
        user_id: user_id,
        comment: comment,
      },
    })
      .then(function (response) {
        let responseData = response.data.data;
        if (responseData.status != "0") {
          let updatedLeads = WorkOrderData.map((lead) => {
            if (lead.id === id) {
              return {
                ...lead,
                work_order_status: value,
                approved_comment: comment,
              };
            } else {
              return lead;
            }
          });
          SetWorkOrderData(updatedLeads);
          toast.success(responseData.msg);
        } else {
          toast.error(responseData.msg);
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
  const updateWorkOrderServiceStatusChange = async (
    value,
    id,
    enquiry_id,
    user_id,
    comment
  ) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/workorder_details.php?fun=updateWorkOrderServiceStatusChange`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        status: value,
        id: id,
        enquiry_id: enquiry_id,
        user_id: user_id,
        comment: comment,
      },
    })
      .then(function (response) {
        let responseData = response.data.data;
        if (responseData.status != "0") {
          let updatedLeads = WorkOrderData.map((lead) => {
            if (lead.id === id) {
              return {
                ...lead,
                service_status: value,
                approved_comment: comment,
              };
            } else {
              return lead;
            }
          });
          SetWorkOrderData(updatedLeads);
          toast.success(responseData.msg);
        } else {
          toast.error(responseData.msg);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  };

  useEffect(() => {
    SetWorkOrderData(WorkOrderDataTab);
  }, [WorkOrderDataTab]);

  const handleSortByChange = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setActiveSortColumn(key);
    setSortConfig({ key, direction });
    sortWorkOrderData(key, direction);
  };

  const sortWorkOrderData = (key, direction) => {
    const sortedData = [...WorkOrderDataTab].sort((a, b) => {
      /*     if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
   */
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
    SetWorkOrderData(sortedData);
  };

  const togglePaymentDropdown = (index) => {
    setOpenDropdown(prev => ({
      leadIndex: prev.leadIndex,
      paymentIndex: prev.paymentIndex === index ? null : index
    }));
  };

  const handleHistorySortByChange = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setActiveHistorySortColumn(key);
    setSortConfig({ key, direction });
    sortPaymentHistoryData(key, direction);
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
    //SetWorkOrderData(WorkOrderDataTab);
    if (sortConfig.key) {
      sortWorkOrderData(sortConfig.key, sortConfig.direction);
    }
  }, [WorkOrderDataTab]);
  useEffect(() => {
    setWorkOrderHeadTabData(WorkOrderHeadTabData);
  }, [WorkOrderHeadTabData]);

  return (
    <>
      <div className="mylead-filters v-center jcsb pl16 brd-b1 pb8 pt8 fww fs12 ">
        Total Results: {workOrderDataCount || 0}
      </div>
      {WorkOrderDisableViaPaymentId && 
        <div className="card-content df pt24 brd-b1 pb24 pl24 jcc">
          <div 
            className="card-item work-order-section df fdc jcc br4 bg-outstanding"
          >
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.outstanding_amount
                ? formatter.format(workOrderHeadTabData.outstanding_amount)
                : 0}
            </span>
            <p className="fw6 fs14 fc5">
              Total Outstanding
              {workOrderHeadTabData && workOrderHeadTabData.outstanding_count ? (
                ` (${workOrderHeadTabData.outstanding_count})`
              ) : ''}
            </p>
          </div>
          <div className="card-item work-order-section df fdc jcc br4">
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.course_amount
                ? formatter.format(workOrderHeadTabData.course_amount)
                : 0}
            </span>
            <p className="fw6  fs14 fc5 ">
              Course MRP
              {workOrderHeadTabData && workOrderHeadTabData.course_count ? (
                ` (${workOrderHeadTabData.course_count})`
              ) : ''}
            </p>
          </div>
          <div className="card-item work-order-section df fdc jcc br4">
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.sale_amount
                ? formatter.format(workOrderHeadTabData.sale_amount)
                : 0}
            </span>
            <p className="fw6  fs14 fc5">
              Sales Amount
              {workOrderHeadTabData && workOrderHeadTabData.course_count ? (
                ` (${workOrderHeadTabData.course_count})`
              ) : ''}
            </p>
          </div>
          <div 
            className="card-item work-order-section df fdc jcc br4 cp"
            onClick={workOrderHeadTabData.amount_received_count > 0 ? handleNavLinkClick(["success", "pending"]) : undefined}
          >
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.amount_received
                ? formatter.format(workOrderHeadTabData.amount_received)
                : 0}
            </span>
            <p className="fw6 fs14 fc5">
            Received Amount
            {workOrderHeadTabData && workOrderHeadTabData.amount_received_count ? (
                ` (${workOrderHeadTabData.amount_received_count})`
              ) : ''}
            </p>
          </div>
          <div
            className="card-item work-order-section df fdc jcc br4 cp"
            onClick={workOrderHeadTabData.scholar_amount > 0 ? handleCommonNavClick("scholar",{ label: "Scholarship", value: "scholarship"}) : undefined}
          >
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.scholar_amount
                ? formatter.format(workOrderHeadTabData.scholar_amount)
                : 0}
            </span>
            <p className="fw6 fs14 fc5">
              Scholarship
              {workOrderHeadTabData && workOrderHeadTabData.scholar_count ? (
                ` (${workOrderHeadTabData.scholar_count})`
              ) : ''}
            </p>
          </div>

 
          <div
            className="card-item work-order-section df fdc jcc br4 cp"
            onClick={workOrderHeadTabData.pending_amount_count > 0 ? handleNavLinkClick(["pending"]) : undefined}
          >
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.pending_amount
                ? formatter.format(workOrderHeadTabData.pending_amount)
                : 0}
            </span>
            <p className="fw6 fs14 fc5">
              Pending Amount
              {workOrderHeadTabData && workOrderHeadTabData.pending_amount_count ? (
                ` (${workOrderHeadTabData.pending_amount_count})`
              ) : ''}
            </p>
          </div>
          {/* <div className="card-item work-order-section df fdc jcc br4">
            <span className="fs28 fc1 mb8 v-center">
              <LiaRupeeSignSolid />
              {workOrderHeadTabData && workOrderHeadTabData.discount_amount
                ? workOrderHeadTabData.discount_amount
                : 0}
            </span>
            <p className="fw6  fs14 fc5">
              Discount Amount
              {workOrderHeadTabData && workOrderHeadTabData.discount_count ? (
                ` (${workOrderHeadTabData.discount_count})`
              ) : ''}
            </p>
          </div> */}
          <div 
            className="card-item work-order-section df fdc jcc br4 cp"
            onClick={workOrderHeadTabData.reject_amount_count > 0 ? handleNavLinkClick(["reject"]) : undefined}
          >
            <span className="fs28 fc1 mb8 v-center">
              {workOrderHeadTabData && workOrderHeadTabData.reject_amount
                ? formatter.format(workOrderHeadTabData.reject_amount)
                : 0}
            </span>
            <p className="fw6  fs14 fc5">
              Rejected WO
              {workOrderHeadTabData && workOrderHeadTabData.reject_amount_count ? (
                ` (${workOrderHeadTabData.reject_amount_count})`
              ) : ''}
            </p>
          </div>
        </div>
      }
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
                onClick={() => handleSortByChange("username")}
                className={activeSortColumn === "username" ? "fc1" : ""}
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Username">Name</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
              <th
                onClick={() => handleSortByChange("invoice_receipt_id")}
                className={
                  activeSortColumn === "invoice_receipt_id" ? "fc1" : ""
                }
              >
                <p className="box-center">
                  <DynamicTooltip direction="bottom" text="Invoice Number">Invoice</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
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
                onClick={() => handleSortByChange("gst_no")}
                className={activeSortColumn === "gst_no" ? "fc1" : ""}
              >
                <p className="box-center">
                  
                  <DynamicTooltip direction="bottom" text="GST Number Available">GST</DynamicTooltip>
                  <RiArrowUpDownFill className="cp ml4" />
                </p>
              </th>
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
              <th>
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
              </th>
            </tr>
          </thead>
          <tbody>
            {WorkOrderData.length > 0 ? (
              WorkOrderData.map((lead, index) => {
                return (
                  <>
                    <tr
                      key={index}
                      onClick={() => handleRowClick(lead.user_id)}
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
                      <td className="leads-tool-fix">
                        <div className="v-center fdc">
                          <span
                            style={{
                              color: giveTextColor(
                                lead.user_type === "Student"
                                  ? "Approve"
                                  : lead.user_type === "Company"
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
                      <td ref={dropdownRef}>
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
                      </td>

			
                      <td className="leads-tool-fix">
                        {lead.agent_name && (
                          <DynamicTooltip direction="right" text={lead.agent_name}>
                            <span className="lc2 text-row">{lead.agent_name}</span>
                          </DynamicTooltip>
                        )}
                      </td>
                      <td>
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
                      </td>
                      <td className="leads-tool-fix ">
                        {lead.course_name && (
                          <DynamicTooltip direction="right" text={lead.course_name}>
                            <span className="lc2 text-row">{lead.course_name}</span>
                          </DynamicTooltip>
                        )}
                      </td>
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
                      <td className="assigned leads-tool-fix">
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
                      </td>
                      <td className="assigned leads-tool-fix">
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
                      </td>
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

      {/* {paymentHistoryPopup && (
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
                    <th
                      onClick={() => handleHistorySortByChange("payment_date")}
                      className={
                        activeHistorySortColumn === "payment_date" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        Date
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("flapone_work_order_id")
                      }
                      className={
                        activeHistorySortColumn === "workorder_id" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        WO Id
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("payment_gateway_id")
                      }
                      className={
                        activeHistorySortColumn === "payment_gateway_id"
                          ? "fc1"
                          : ""
                      }
                    >
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
                    <th
                      onClick={() => handleHistorySortByChange("course_name")}
                      className={
                        activeHistorySortColumn === "course_name" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        Course Name
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleHistorySortByChange("course_amount_long")}
                      className={
                        activeHistorySortColumn === "course_amount_long" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        Course Amt
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleHistorySortByChange("amount")}
                      className={
                        activeHistorySortColumn === "payment_amount"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center">
                        Recd Amt
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("discount_amount")
                      }
                      className={
                        activeHistorySortColumn === "discount_amount"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center">
                        Discount
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("pending_amount")
                      }
                      className={
                        activeHistorySortColumn === "pending_amount"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center">
                        Pending Amt
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("payment_gateway_type")
                      }
                      className={
                        activeHistorySortColumn === "payment_type" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        Type
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() => handleHistorySortByChange("payment_mode")}
                      className={
                        activeHistorySortColumn === "payment_mode" ? "fc1" : ""
                      }
                    >
                      <p className="box-center">
                        Mode
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th>
                      <p className="box-center">Att.</p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("approver_comment")
                      }
                      className={
                        activeHistorySortColumn === "approver_comment"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center">
                        Comment
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("payment_gateway_status")
                      }
                      className={
                        activeHistorySortColumn === "payment_status"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center">
                        Pymt Status
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("work_order_status")
                      }
                      className={
                        activeHistorySortColumn === "work_order_status"
                          ? "fc1"
                          : ""
                      }
                    >
                      <p className="box-center">
                        WO Status
                        <RiArrowUpDownFill className="cp ml4" />
                      </p>
                    </th>
                    <th
                      onClick={() =>
                        handleHistorySortByChange("service_status")
                      }
                      className={
                        activeHistorySortColumn === "service_status"
                          ? "fc1"
                          : ""
                      }
                    >
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
                          <td>
                            {lead.flapone_work_order_id
                              ? `WO-${lead.flapone_work_order_id}`
                              : "--"}
                          </td>
                          <td>
                            {lead.payment_gateway_id
                              ? lead.payment_gateway_id
                              : "--"}
                          </td>
                          <td>{lead.invoice_receipt_id ? lead.invoice_receipt_id : "--"}</td>
                          <td>
                            {lead.course_name && (
                              <DynamicTooltip text={lead.course_name}>
                                {lead.course_name.length > 20
                                  ? `${lead.course_name.slice(0, 20)}...`
                                  : lead.course_name}
                              </DynamicTooltip>
                            )}
                          </td>
                          <td>
                            {lead.course_amount
                              ? formatter.format(lead.course_amount)
                              : "--"}
                          </td>
                          <td>
                            {lead.amount ? formatter.format(lead.amount) : "--"}
                          </td>
                          <td
                            style={{
                              color: giveTextColor(
                                lead.discount_amount === "0" ? "" : "success"
                              ),
                              textTransform: "capitalize",
                            }}
                          >
                            {formatter.format(lead.discount_amount)}
                          </td>
                          <td
                            style={{
                              color: giveTextColor(
                                lead.pending_amount == 0 ? "success" : "red"
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
                                  lead.payment_gateway_type === "Offline"
                                    ? "Awards"
                                    : "red"
                                ),
                              }}
                            >
                              {lead.payment_gateway_type
                                ? lead.payment_gateway_type
                                : "--"}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                color: giveTextColor(
                                  lead.payment_mode === "Cash"
                                    ? "red"
                                    : lead.payment_mode === "Upi"
                                      ? "teal"
                                      : lead.payment_mode === "Net Banking"
                                        ? "News"
                                        : lead.payment_mode === "Credit Card"
                                          ? "purple"
                                          : lead.payment_mode === "Debit Card"
                                            ? "pink"
                                            : lead.payment_mode === "Cheaque"
                                              ? "violet"
                                              : lead.payment_mode ===
                                                  "Demand Draft"
                                                ? "blue"
                                                : ""
                                ),
                              }}
                            >
                              {lead.payment_mode ? lead.payment_mode : "--"}
                            </span>
                          </td>
                          <td className="leads-tool-fix">
                            {lead.attachment ? (
                              <DynamicTooltip text="View Attachment">
                                <FaRegEye
                                  className="icon edit-icon cp fs18 fc8"
                                  onClick={() =>
                                    openAttachmentFile(lead.attachment)
                                  }
                                />
                              </DynamicTooltip>
                            ) : (
                              "--"
                            )}
                          </td>
                          <td className="leads-tool-fix">
                            {lead.approver_comment && (
                              lead.approver_comment.length > 25 ? (
                                <DynamicTooltip text={lead.approver_comment}>
                                  {`${lead.approver_comment.slice(0, 25)}...`}
                                </DynamicTooltip>
                              ) : (
                                lead.approver_comment
                              )
                            )}
                          </td>
                          <td
                            style={{
                              color: giveTextColor(lead.payment_gateway_status),
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
                                <DynamicTooltip text="Receipt">
                                  <IoReceipt
                                    className="icon edit-icon cp fs18 fc8"
                                    style={{ verticalAlign: "middle", cursor: "pointer" }}
                                    onClick={() => toggleDropdown(index, "receipt")}
                                  />
                                </DynamicTooltip>
                              )}

                              {lead.payment_gateway_status !== "Rejected" && lead.work_order_status === "Success" && (
                                <DynamicTooltip text="Invoice">
                                  <FaFileInvoice
                                    className="fc8 fs18 mr8 cp ml12"
                                    onClick={() => toggleDropdown(index, "invoice")}
                                  />
                                </DynamicTooltip>
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
                      <td colSpan="15" style={{ textAlign: "center" }}>
                        No records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SidePopup>
      )} */}
      {addCommentPopup && (
        <Popup
          onClose={closeAddCommentPopup}
          title={`Add ${labelName} Comment`}
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
            {commentError && (
              <p className="form-error-messages error mt10 fc4">
                Please enter a comment before submitting.
              </p>
            )}
          </div>
          <div className="button-container brd-none myteam-filters">
            <button
              className="update-button  btn-blue"
              onClick={handlePopupSubmit}
            >
              Submit
            </button>
            <button
              className="btn-cancel clear"
              onClick={() => closeAddCommentPopup()}
            >
              Cancel
            </button>
          </div>
        </Popup>
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default WorkOrder;
