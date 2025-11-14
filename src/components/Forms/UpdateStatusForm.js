import React, { useEffect, useState, useRef } from "react";
import "./UpdateStatusForm.css";
import {
  FaAngleDown
} from "react-icons/fa";
import SingleDropdown from "../SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { addDays, format } from "date-fns";
import PreferedDropdown from "../PreferedDropdown";

const UpdateStatusForm = ({
  newPendingStatus,
  userLoginData,
  setUpdateStausPopup,
  onClose,
  toast,
  categoryOptions,
  subcategoryOptions,
  courseOptions,
  getSubcategoryData,
  getCatByCourseData,
  getCoursePriceData,
  amount,
  setAmount,
  category,
  subcategory,
  selectedCourses,
  setCategory,
  setSubcategory,
  setSelectedCourses,
  saveUpdateData,
  setUpdateBtnStatus,
  updateBtnStatus,
  studentNo,
  setStudentNo,
  finalAmount,
  setFinalAmount,
  partialAmount,
  setPartialAmount,
  workorderStatus,
  scholarStatus,
  userDetail,
  otherDetail,
  handleUploadAttachment,
  attachment,
  setSelectedCoursesIds,
  selectedCoursesIds,
  handleLeadForm,
  coursePriceTax,
  coursePriceWithTax,
  optionBatchs,
  errorMsg,
  handleClickNavigte
}) => {
  
  let woamount;
  let wototalAmountt;
  let taxAmount = 0;
  const taxRate = 0.18;

  if(workorderStatus){
    woamount = amount;
    wototalAmountt = coursePriceWithTax;
  }else{
    woamount = amount * studentNo;
    //taxAmount = Math.round(woamount * taxRate, 10); 
    wototalAmountt = woamount + taxAmount; 
  }

  
  
  const [wototalAmount, setWototalAmount] = useState(wototalAmountt); 
   // useEffect to update totalAmount whenever amount or taxAmount changes
   useEffect(() => {
    if(workorderStatus){
      setWototalAmount(coursePriceWithTax);
    }else{
     //const updatedTaxAmount = Math.round(woamount * taxRate, 10);
     const updatedTaxAmount =0; 
     const updatedTotalAmount = woamount + updatedTaxAmount; 
     setWototalAmount(updatedTotalAmount); 
    }
   }, [woamount, taxRate,coursePriceWithTax]); 

  const [status, setStatus] = useState({});
  const [followupDate, setFollowupDate] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [amountDate, setAmountDate] = useState("");
  const [comment, setComment] = useState("");
const [paymentReceived, setPaymentReceived] = useState( { label: "Discount", value: "discount_amount"});
  const [rating, setRating] = useState("");
  const dropdownRef = useRef(null);
  const [junkStatus, setJunkStatus] = useState({});
  const [noResponse, setNoResponse] = useState({});
  const [notInterested, setNotInterested] = useState({});
  const [scholarship, setScholarship] = useState({});
  const [extraValidity, setExtraValidity] = useState("");
  const [extraValidityDays, setExtraValidityDays] = useState("");
  const [extraValidityMonth, setExtraValidityMonth] = useState("");
  const [course, setCourse] = useState({});
  const [expectedDate, setExpectedDate] = useState("");
  const [makrBatchCourseComplete, setMakrBatchCourseComplete] = useState({});
  
  const [discount, setDiscount] = useState(
    otherDetail && otherDetail.discount_amount
      ? otherDetail.discount_amount
      : ""
  );
  const [showHotSection, setShowHotSection] = useState(false);
  const [tds, setTds] = useState(false);
  const [complementary, setComplementary] = useState(false);
  const [discLeadPrice, setDiscLeadPrice] = useState(false);
  const [showFunnelSection, setShowFunnelSection] = useState(false);
  const [showProformaSection, setShowProformaSection] = useState(false);
  const [showDiscount, setShowDiscount] = useState(
    otherDetail && otherDetail.showdiscountfield ? true : false
  );
  const [showGst, setShowGst] = useState(
    userDetail && userDetail.gst ? true : false
  );
  const [gst, setGst] = useState(
    userDetail && userDetail.gst ? userDetail.gst : ""
  );

  const [file, setFile] = useState(null);
  const [categoryValue, setCategoryValue] = useState("");
  const [subcategoryValue, setSubcategoryValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [theoryBatch, setTheoryBatch] = useState("");
  const [flyingBatch, setFlyingBatch] = useState("");
  const [batchLocation, setBatchLocation] = useState("");
  const [courseBatchSelections, setCourseBatchSelections] = useState({});
  const [selectedBatchs, setSelectedBatchs] = useState(otherDetail && otherDetail.prefered_batch ? otherDetail.prefered_batch : "");
 
  
  const [pendingAmount, setPendingAmount] = useState(
    otherDetail.workorder_pending_amount === 0 ?otherDetail.workorder_pending_amount: 
       otherDetail.workorder_pending_amount?otherDetail.workorder_pending_amount
      : wototalAmount
  );
  // const [pendingAmount, setPendingAmount] = useState(
  //   otherDetail.workorder_pending_amount
  //     ? otherDetail.workorder_pending_amount
  //     : woamount
  // );

  const [woReceivedAmount, setWoReceivedAmount] = useState(
    otherDetail.workorder_amount_received
      ? otherDetail.workorder_amount_received
      : 0
  );
  const [woReceivedTaxAmount, setWoReceivedTaxAmount] = useState(
    otherDetail.workorder_taxamount_received
      ? otherDetail.workorder_taxamount_received
      : 0
  );
  const [woReceivedWithoutTaxAmount, setWoReceivedWithoutTaxAmount] = useState(
    otherDetail.workorder_amount_received
      ? otherDetail.workorder_amount_received
      : 0
  );
  

  const [receivedAmount, setReceivedAmount] = useState(0);
  const [receivedTaxAmount, setReceivedTaxAmount] = useState(0);
  const [receivedWithTaxAmount, setReceivedWithTaxAmount] = useState(0);

  let paymentMethodOptions = [
    { label: "Cash", value: "cash" },
    { label: "UPI", value: "upi" },
    { label: "Net Banking", value: "net_banking" },
    { label: "Credit Card", value: "credit_card" },
    { label: "Debit Card", value: "debit_card" },
    { label: "Cheque", value: "cheque" },
    { label: "Demand Draft", value: "demand_draft" },
  ];



  const discountTypeOptions = [
    { label: "Discount", value: "discount_amount" },
    { label: "Scholarship", value: "scholarship" },
  ];

  const handleSelect = (selected) => {
    setSelectedBatchs(selected);
  };


  let statusOptions1 =
   userDetail?.all_batch_alloted_data && userDetail?.all_batch_alloted_data.length > 0
   ?[
          { label: "Hot", value: "hot" },
          { label: "Interested", value: "followup" },
          { label: "Ask To Call Later", value: "call_latter" },
          { label: "Batch Allotment", value: "batch_allotment"},
          { label: "Payment Received", value: "booked" },
          { label: "No Response", value: "noresponse" },
          { label: "Not Interested", value: "notinterested" },
          { label: "Junk ", value: "junk" },
   ]:
    selectedCourses && selectedCourses.length > 0
      ? [
          { label: "Hot", value: "hot" },
          { label: "Interested", value: "followup" },
          { label: "Ask To Call Later", value: "call_latter" },
          { label: "Payment Received", value: "booked" },
          { label: "No Response", value: "noresponse" },
          { label: "Not Interested", value: "notinterested" },
          { label: "Junk ", value: "junk" },
        ]
      : selectedCourses && selectedCourses.length > 0 && workorderStatus
        ? [
           
            { label: "Hot", value: "hot" },
            { label: "Interested", value: "followup" },
            { label: "Ask To Call Later", value: "call_latter" },
            { label: "Payment Received", value: "booked" },
            { label: "No Response", value: "noresponse" },
            { label: "Not Interested", value: "notinterested" },
            { label: "Junk ", value: "junk" },
          ]
        : [
            { label: "Interested", value: "followup" },
            { label: "Ask To Call Later", value: "call_latter" },
            { label: "No Response", value: "noresponse" },
            { label: "Not Interested", value: "notinterested" },
            { label: "Junk ", value: "junk" },
          ];

    let statusOptions3 = [];
    if( otherDetail?.workorder_pending_amount>0 && selectedCourses && selectedCourses.length > 0){
      statusOptions3 = [
          { label: "Payment Received", value: "booked" },
          { label: "Payment Follow-up", value: "payment_follow_up" },
         
        ];
    }else if(otherDetail?.workorder_pending_amount>0){
        statusOptions3 = [{ label: "Payment Received", value: "booked" },
        { label: "Payment Follow-up", value: "payment_follow_up" }];
    }
    let statusOptions6 = [];
    if(userDetail?.all_batch_alloted_data && userDetail?.all_batch_alloted_data.length > 0){
      statusOptions6 = [{ label: "Batch Allotment", value: "batch_allotment"}];
    }
    let statusOptions7 = [];
    if(userDetail?.all_course_batch_complete && userDetail?.all_course_batch_complete.length > 1){
      statusOptions7 = [{ label: "Course Completed", value: "course_completed"}];
    }
     let statusOptions4 = [];
    if(selectedCourses && selectedCourses.length > 0 ){
       statusOptions4 =[
          { label: "Follow-up Call", value: "follow_up_call" },
          { label: "Call Later", value: "call_later_co" },
          { label: "No Response", value: "noresponse" },
          // { label: "Refused", value: "refused"}
       ];
    }
     let statusOptions5 = [];
    if(userDetail.check_doc_pending<=0){
      statusOptions5 = [
        { label: "Docs Pending", value: "docs_pending"}
      ];
    }
    let statusOptions2 = [
          { label: "Follow-up Call", value: "follow_up_call" },
          { label: "Call Later", value: "call_later_co" },
          { label: "No Response", value: "noresponse" },
          // { label: "Refused", value: "refused" }
        ];
   
   
   
function getUniqueOptions(options) {
  const seen = new Set();
  return options.filter(option => {
    if (seen.has(option.value)) {
      return false;
    }
    seen.add(option.value);
    return true;
  });
}
let combinetemp = [...statusOptions3,...statusOptions6,...statusOptions7,...statusOptions4,...statusOptions2,...statusOptions5];
statusOptions2 = getUniqueOptions(combinetemp);
let combinedOptions = userLoginData.role === '1'
  ? [...statusOptions1, ...statusOptions2]
  : (userLoginData.dept_id === '3' || userLoginData.dept_id === '9')
    ? statusOptions2
    : statusOptions1;

let statusOptions = getUniqueOptions(combinedOptions);


    if (
      userDetail && (userDetail.last_lead_status	 === 'Followup' ||
      userDetail.last_lead_status	 === 'Hot' ||
      userDetail.last_lead_status	 === 'Booked'
    )) {
      statusOptions = statusOptions.filter(option => option.value !== 'junk');
    }

 const paymentReceivedOptions =
    otherDetail && otherDetail.workorder_amount_received > 0
      ? [
          { label: "Discount", value: "discount_amount" },
        ]
      : [
          { label: "Discount", value: "discount_amount" },
          { label: "Scholarship", value: "scholarship" },
        ];
  const [theoryBatchOptions, setTheoryBatchOptions] = useState(userDetail.allbatchlist);
  const [batchLocationOptions, setbatchLocationOptions] = useState(userDetail.location_object_option);
   
 
  const flyingBatchOptions = [
    { label: "Flying Batch1", value: "fb1" },
    { label: "Flying Batch2", value: "fb2" },
    { label: "Flying Batch3", value: "fb3" },
    { label: "Flying Batch4", value: "fb4" },
    { label: "Flying Batch5", value: "fb5" },
  ];
 
  const ratingOptions = [
    { label: "5 Star", value: "5 Star" },
    { label: "4 Star", value: "4 Star" },
    { label: "3 Star", value: "3 Star" },
    { label: "2 Star", value: "2 Star" },
    { label: "1 Star", value: "1 Star" },
  ];
  let notInterestedStatus = [
    { label: "Fund Issue", value: "fundissue" },
    { label: "Location Out of Scope", value: "location_out_of_scope" },
    { label: "Joined Other Institute", value: "joined_other_institute" },
    { label: "Not Eligible", value: "not_eligible" },
    { label: "No Response", value: "noresponse"},
    { label: "Not Aware", value: "not_aware" },
    { label: "Drone Buyer", value: "drone_buyer" },
    { label: "Job Seeker", value: "job_seeker" },
    { label: "Only Exploring", value: "only_exploring" },
    { label: "Reason Not Shared", value: "reason_not_shared" },
  ];

  let noResponseStatusOptions = [
    { label: "Ringing", value: "ringing" },
    { label: "Not Reachable", value: "not_reachable" },
    { label: "Switch Off", value: "switch_off" },
    { label: "Incoming barred", value: "incoming_barred" },
    { label: "Out of Service", value: "out_of_service" },
    { label: "Busy", value: "busy" },
    { label: "Voice mail", value: "voice_mail" },
  ];

  let junkStatusOptions = [
    { label: "Wrong Number", value: "wrong_number" },
    { label: "Wrong Email", value: "wrong_email" },
    { label: "Test Lead", value: "test_lead" },
    { label: "Spam", value: "spam" },
  ];


  const [discountDropdown, setDiscountDropdown] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handlePaymentMethod = (selectedPaymentMethod) => {
    setPaymentMethod(selectedPaymentMethod);
  };
  const handleTheoryBatch = (courseValue, theoryBatch) => {
    setCourseBatchSelections(prev => ({
      ...prev,
      [courseValue]: {
        ...prev[courseValue],
        theoryBatch,
      }
    }));
  };
  
  const handleFlyingBatch = (courseValue, flyingBatch) => {
   
    setCourseBatchSelections(prev => ({
      ...prev,
      [courseValue]: {
        ...prev[courseValue],
        flyingBatch,
      }
    }));
  };
  
  const handleBatchLocation = (courseValue, batchLocation) => {

    setCourseBatchSelections(prev => ({
      ...prev,
      [courseValue]: {
        ...prev[courseValue],
        batchLocation,
      }
    }));
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategoryValue(selectedCategory.value);
    setCategory(selectedCategory);
    setSubcategory("");
    setSubcategoryValue("");
    setSelectedCourses([]);
    getSubcategoryData(selectedCategory.value);
  };

  const handleSubcategoryChange = (selectedSubcategory) => {
    setSubcategoryValue(selectedSubcategory.value);
    setSubcategory(selectedSubcategory);
    setSelectedCourses([]);
    getCatByCourseData(selectedSubcategory.value);
  };

  const handleCourseChange = (selectedOptions) => {
    setReceivedWithTaxAmount(0);
    setPendingAmount(0);
    setDiscount(0);
    setSelectedCourses(selectedOptions);
    const course_ids = selectedOptions.map((obj) => obj.value);
    setSelectedCoursesIds(course_ids);
    getCoursePriceData(course_ids);

    handleLeadForm("course_id", course_ids);
  }; 

  const customDateFormat = "dd/MM/yyyy h:mm aa";
  const expectedDateFormat = "dd/MM/yyyy";

  const handleFollowupDateChange = (date) => {
    setFollowupDate(date);
  };

  const handlePaymentDateChange = (date) => {
    setPaymentDate(date);
  };

  const handleAmountDateChange = (date) => {
    setAmountDate(date);
  };
  const handleExpectedDateChange = (date) => {
    setExpectedDate(date);
  };
  const handleCommentsChange = (e) => {
    setComment(e.target.value);
  };

  const handleCheckboxChange = () => {
    setShowHotSection(!showHotSection);
  };
  const handleFunnelCheckboxChange = () => {
    setShowFunnelSection(!showFunnelSection);
    setShowProformaSection(false);
  };

  const handleProformaCheckboxChange = () => {
    setShowProformaSection(!showProformaSection);
    setShowFunnelSection(false);
  };

  const handleDiscountCheckboxChange = () => {
    setShowDiscount(!showDiscount);
  };

  const handleGstCheckboxChange = () => {
    setShowGst(!showGst);
  };

  const setWototalAmountFun=(value) =>{
   setReceivedWithTaxAmount(0);
   setPendingAmount(0);
   setWototalAmount(value);

    let pendingamt;
    let courseAmountUpdate = value;
     if(Math.round(courseAmountUpdate) < (Math.round(receivedWithTaxAmount) +Math.round(discount))){
      toast.error("Amount should be match");
          return false;
     }else{
      pendingamt = Math.round(courseAmountUpdate) - (Math.round(receivedWithTaxAmount) + Math.round(discount))
     }
    
    setPendingAmount(pendingamt);
  }
  useEffect(() => {
    setPaymentReceived( { label: "Discount", value: "discount_amount" });
    setShowProformaSection(false);
    setShowFunnelSection(false);
    if(newPendingStatus){
      setPendingAmount(wototalAmountt);
    }

  }, [status,newPendingStatus,wototalAmountt]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "application/msword",
    ];
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      handleUploadAttachment(selectedFile);
    } else {
      alert(
        "Invalid file type. Please upload a valid file (doc, pdf, jpg, jpeg)."
      );
      e.target.value = null;
    }
  };

  const setScholarshipFun = (selectedScholar) => {
    setScholarship(selectedScholar);
    const calculatedAmount = (finalAmount * selectedScholar.value) / 100;
    const scholarlessAmount = finalAmount - calculatedAmount;
    setReceivedAmount(scholarlessAmount);
  };

  const setDiscountFun = (discountval) => {
    let pendingamt;

    if (!(isNaN(receivedAmount) && receivedAmount !== undefined)) {
      if (discountval && !isNaN(discountval)) {
        if (
          wototalAmount <
          (Math.round(discountval) +
            Math.round(receivedWithTaxAmount) +
            Math.round(woReceivedWithoutTaxAmount))
        ) {
          toast.error("Amount should be match");
          return false;
        }
        if (receivedAmount) {
          pendingamt =
            Math.round(wototalAmount) -
            (Math.round(discountval) +
              Math.round(receivedWithTaxAmount) +
              Math.round(woReceivedWithoutTaxAmount));
        } else {
          if (
            wototalAmount <
            (Math.round(discountval) + Math.round(woReceivedWithoutTaxAmount))
          ) {
            toast.error("Amount should be match");
            return false;
          }

          pendingamt =
            Math.round(wototalAmount) -
            (Math.round(discountval) + Math.round(woReceivedWithoutTaxAmount));
        }
      } else {
        if (wototalAmount < Math.round(receivedWithTaxAmount)) {
          toast.error("Amount should be match");
          return false;
        }
        if (receivedAmount) {
          pendingamt =
            Math.round(wototalAmount) -
            (Math.round(receivedWithTaxAmount) + Math.round(woReceivedWithoutTaxAmount));
        } else {
          pendingamt =
            Math.round(wototalAmount) - Math.round(woReceivedWithoutTaxAmount);
        }
      }
    } else {
      if (discountval && !isNaN(discountval)) {
        if (wototalAmount < Math.round(discountval)) {
          toast.error("Amount should be match");
          return false;
        }

        if (woReceivedWithoutTaxAmount) {
          pendingamt =
            wototalAmount -
            (Math.round(discountval) + Math.round(woReceivedWithoutTaxAmount));
        } else {
          pendingamt = wototalAmount - Math.round(discountval);
        }
      } else {
        pendingamt = wototalAmount - Math.round(woReceivedWithoutTaxAmount);
      }
    }
    setDiscount(discountval);
    setPendingAmount(pendingamt);
  };

  const setPartialAmountFun = (partialval) => {
    let pendingamt;

    if (discount && !isNaN(discount)) {
      if (
        wototalAmount <
        Math.round(discount) +
          Math.round(partialval) +
          Math.round(woReceivedWithoutTaxAmount)
      ) {
        toast.error("amount does not match");
        return false;
      }
      if (partialval) {
        pendingamt =
          Math.round(wototalAmount) -
          (Math.round(discount) +
            Math.round(partialval) +
            Math.round(woReceivedWithoutTaxAmount));
      } else {
	      pendingamt =pendingAmount;
      /*  pendingamt =
          parseInt(wototalAmount) -
          (parseInt(discount) + parseInt(woReceivedWithoutTaxAmount));*/
      }
    } else {
      if (wototalAmount < Math.round(partialval)) {
        toast.error("amount does not match");
        return false;
      }
      if (partialval) {
        pendingamt =
          Math.round(wototalAmount) -
          (Math.round(partialval) + Math.round(woReceivedWithoutTaxAmount));
      } else {
        pendingamt = Math.round(wototalAmount) - Math.round(woReceivedWithoutTaxAmount);
      }
    }

    const partialvalTax = Math.round(partialval * 100/118); // Calculate the tax and round down to an integer
    const partialvalWithTax = partialval;// parseInt(partialval) + parseInt(partialvalTax); // Add the tax to the original

    setReceivedTaxAmount(partialvalWithTax-partialvalTax);
    setReceivedWithTaxAmount(partialvalWithTax);
    setReceivedAmount(partialvalTax );
    setPendingAmount(pendingamt);
  };
  useEffect(()=>{
    
    if(status.value=='booked' || status.value=='batch_allotment' || status.value=='course_completed'){
      if(!userDetail.email_id){
         toast.error("Please add email id first");
         setUpdateStausPopup(false);
      }
    }
  },[status,setStatus])
  const hadleUpdateBatchAllotmen=()=>{
    setUpdateBtnStatus(true);
    saveUpdateData(courseBatchSelections,'batch_allotment');
  }
  const markCourseComplated = async (makrBatchCourseComplete)=>{
    let param = {
      "url":"my-students",
      "storage":"allfilterstudent",
      "key":"classesended",
      "object":{
        "page_type":"classesended",
        "searchByValue":userDetail.user_id,
        "searchBy":"user_id",
        "selectedCourses":[makrBatchCourseComplete.value],
        "trigger":"complete"
      }
    }
    handleClickNavigte(param);
  }
  const handleStatusUpdate = () => {
    
    if (finalAmount < 1 && status.value === "hot") {
      toast.error(`Please enter valid course amount`);
      return false;
    }
    if(status?.value=='course_completed'){
      markCourseComplated(makrBatchCourseComplete);
      return false;
    }
    if (status.value) {
      const flpdt = followupDate
        ? format(new Date(followupDate), "yyyy-MM-dd HH:mm:ss")
        : "";
      const exptdt = expectedDate
        ? format(new Date(expectedDate), "yyyy-MM-dd HH:mm:ss")
        : "";
      let reason = "";

      const pmtdt = paymentDate
          ? format(new Date(paymentDate), "yyyy-MM-dd HH:mm:ss")
          : "";

      if (status.value === "junk") {
        if (junkStatus.value) {
          reason = junkStatus;
        } else {
          toast.error(`Please select ${status.label} reason`);
          return false;
        }
      } else if (status.value === "noresponse") {
        if (noResponse.value) {
          reason = noResponse;
        } else {
          toast.error(`Please select ${status.label} reason`);
          return false;
        }

        if (flpdt) {
        } else {
          toast.error(`Please select followup date`);
          return false;
        }
      } else if (status.value === "notinterested") {
        if (notInterested.value) {
          reason = notInterested;
        } else {
          toast.error(`Please select ${status.label} reason`);
          return false;
        }
      } else if (status.value === "booked") {

        if (paymentReceived.value) {
          reason = paymentReceived;
        } 
       
       }else if (status.value === "hot") {
        if (flpdt) {
        } else {
          toast.error(`Please select Followup date`);
          return false;
        }

        if (exptdt) {
        } else if (!exptdt && (showFunnelSection || showProformaSection)) {
          //toast.error(`Please select Expected date`);
          //return false;
        }
      } else if (status.value === "followup" || status.value === "call_latter") {
        if (flpdt) {
        } else {
          toast.error(`Please select ${status.label} date`);
          return false;
        }
      }else if (["payment_follow_up","docs_pending"].some(val => status.value.includes(val))) {
        if (!flpdt) {
          if(status.value=='payment_follow_up'){
            toast.error(`Please select next payment date`);
            return false;
          }else{
            toast.error(`Please select ${status.label} date`);
            return false;
          }
        } 
      }


      if(status.value === "booked"){  
           if(receivedAmount > 0){
            if(paymentMethod && paymentMethod.value){
             }else{
              toast.error(
                "Please select Payment method"
              );
              return false;
            }
          }

          let tot_amount = pendingAmount+receivedAmount;
          if (Math.round(tot_amount) < Math.round(receivedAmount)) {
            toast.error(
              "Received amount should be less or equal to course amount"
            );
            return false;
          }
      }
    

      setUpdateBtnStatus(true);

      let updatedata = {};
      if (showFunnelSection || showProformaSection || status.value === "hot" || status.value === "followup") {
        const exptdt = expectedDate
          ? format(new Date(expectedDate), "yyyy-MM-dd HH:mm:ss")
          : "";
        updatedata = {
          status: status.value,
          comment: comment,
          reason_status: reason.value,
          followupdate: flpdt,
          funnel: showFunnelSection,
          profarma: showProformaSection,
          expected_date: exptdt,
          course: selectedCourses,
          amount: finalAmount,
	        course_amount:wototalAmount,
        };
      } else {
        if (status.value === "booked"){
            updatedata = {
              status: status.value,
              comment: comment,
              reason_status: reason.value,
              followupdate: flpdt,
              course: selectedCourses,
              amountchk: amount,
              amount: wototalAmount,
              woAmount: wototalAmount,
              finalAmount: finalAmount,
              receivedAmount: receivedAmount+receivedTaxAmount,
              payment_date:pmtdt,
              discount: !showDiscount?discount:0,
              gst: gst,
              studentNo: studentNo,
              file: attachment,
              scholarship: scholarship.value,
              payment_mode: paymentMethod.value ? paymentMethod.value : "cash",
              batch_info: selectedBatchs,
            };
        } else {
          updatedata = {
            status: status.value,
            comment: comment,
            reason_status: reason.value,
            followupdate: flpdt,
            payment_mode: paymentMethod.value,
          };
        }
      }
      saveUpdateData(updatedata);
    } else {
      toast.error(`Please select status field`);
      return false;
    }
  };

  return (
    <>
      <div className="update-status-form">
        <div className="df up-st-form jcsb fww">
	  {status.value !== "booked" && (
            <div
              className={
                Object.keys(status).length === 0 ? "flx100" : "up-status"
              }
            >
              <SingleDropdown
                label="Status"
                options={statusOptions}
                selectedOption={status}
                onSelect={setStatus}
              />
            </div>
          )}
          {status.value === "junk" && (
            <div className="up-status">
              <SingleDropdown
                compulsory={<span className="fc4">*</span>}
                label="Reason"
                options={junkStatusOptions}
                selectedOption={junkStatus}
                onSelect={setJunkStatus}
              />
            </div>
          )}
          {status.value === "noresponse" && (
            <div className="up-status">
              <SingleDropdown
                compulsory={<span className="fc4">*</span>}
                label="Reason"
                options={noResponseStatusOptions}
                selectedOption={noResponse}
                onSelect={setNoResponse}
              />
            </div>
          )}

          {status.value === "notinterested" && (
            <div className="up-status">
              <SingleDropdown
                compulsory={<span className="fc4">*</span>}
                label="Reason"
                options={notInterestedStatus}
                selectedOption={notInterested}
                onSelect={setNotInterested}
              />
            </div>
          )}
           {status.value === "course_completed" && (
            <div className="up-status">
              <SingleDropdown
                compulsory={<span className="fc4">*</span>}
                label="Select Course"
                options={userDetail.all_course_batch_complete}
                selectedOption={makrBatchCourseComplete}
                onSelect={setMakrBatchCourseComplete}
              />
            </div>
          )}
          
         

          {(status.value === "notinterested" ||
            status.value === "noresponse" ||
            status.value === "followup" ||
            status.value === "call_latter" ||
            status.value === "hot" ||
            status.value === "payment_follow_up" ||
            status.value === "follow_up_call" ||
            status.value === "call_latter" ||
            status.value === "call_later_co" ||
            status.value === "noresponse" ||
            status.value === "refused" ||
            status.value ==="docs_pending"
            ) && (
            <div
              className={`${status.value === "notinterested" || status.value === "noresponse" ? "flx100 calendar-input mt24" : "calendar calendar-input "}`}
            >
              <label className="fc15 fw6 fs14 mb12 ls1">
                 {status.value === "payment_follow_up"?"Next Payment Date":"Follow-up Date"}
                {status.value !== "notinterested" && (
                  <span className="fc4">*</span>
                )}
              </label>
              <DatePicker
                minDate={new Date()}
                dateFormat={customDateFormat}
                selected={followupDate}
                onChange={handleFollowupDateChange}
                placeholderText="-- Select Date --"
                showIcon
                isClearable={true}
                showTimeSelect
              />
            </div>
          )}
          
        </div>
       {status.value === 'batch_allotment' && (
        userDetail.all_batch_alloted_data.map((course, index) => {
        const selected = courseBatchSelections[course.course_id+"-"+course.work_order_id] || {};
        const locationKey = selected.batchLocation?.value || course?.branch?.value;
        const primaryLocation = userDetail.location_object?.[locationKey]?.[course.course_id];
        const fallbackLocation = Object.values(userDetail.location_object)?.[0]?.[0];
        const flyinglocation = primaryLocation ?? fallbackLocation ?? [];


        return (
      <React.Fragment key={course.course_id+"-"+course.work_order_id}>
        {userDetail.all_batch_alloted_data.length > 0 && (
          <div className="fc15 fs14 ls1 mt16">
            Select Batch for <b>{course.course_name}</b> <span className='error-text'>{errorMsg[userDetail.user_id+"|"+course.work_order_id+"|"+course.course_id]?errorMsg[userDetail.user_id+"|"+course.work_order_id+"|"+course.course_id]:""}</span>
          </div>
        )}
        <div className={`df amt-gst jcsb brd-b1 pb16 ${userDetail.all_batch_alloted_data.length? 'mt12' : ''}`}>
          <div className="input-design sp flx31">
            <SingleDropdown
              label="Theory Batch"
              options={course.batch_list_option}
              selectedOption={selected.theoryBatch?.value?selected.theoryBatch:course.batch_obj}
              onSelect={(val) => handleTheoryBatch(course.course_id+"-"+course.work_order_id, val)}
              isReadOnly={!course?.batch_allot_enable}
            />
          </div>
          <div className="input-design sp flx31">
            <SingleDropdown
              label="Flying Location"
              options={batchLocationOptions}
              selectedOption={selected.batchLocation?.value?selected.batchLocation:course.branch}
              onSelect={(val) => handleBatchLocation(course.course_id+"-"+course.work_order_id, val)}
              isReadOnly={!course?.fly_batch_allot_enable}
            />
          </div>
          <div className="input-design sp flx31">
            <SingleDropdown
                label={`Flying Batch`}
                options={flyinglocation}
                selectedOption={selected.flyingBatch?.value?selected.flyingBatch:flyinglocation.length!=1?course.batchflying_obj:{}}
                onSelect={(val) =>
                  handleFlyingBatch(`${course.course_id}-${course.work_order_id}`, val)
                }
                isReadOnly={flyinglocation.length==1 || !course?.fly_batch_allot_enable}
              />


          </div>
        </div>
      </React.Fragment>
    );
  })
)}

        {status.value === "booked" && (
          
          <>
           <div className="df mt16 jcsb pay-validity">
              <div className="up-status1">
                <SingleDropdown
                  label="Status"
                  options={statusOptions}
                  selectedOption={status}
                  onSelect={setStatus}
                />
              </div>
              <div className="up-status1 sp">
                <SingleDropdown
                  label="Category"
                  options={categoryOptions}
                  selectedOption={category}
                  onSelect={handleCategoryChange}
                  isReadOnly={workorderStatus}
                />
              </div>

              <div className="up-status1 course-list-drop sp">
                <SingleDropdown
                  label="Subcategory"
                  options={subcategoryOptions}
                  selectedOption={subcategory}
                  onSelect={handleSubcategoryChange}
                  isReadOnly={!category || workorderStatus}
                />
              </div>
            </div>
            <div className="form-group form-group-segment flx100 mt24">
              <label className="fc15 fw6 fs14 mb12 ls1">Course Name</label>
              <div className="form-group-segment course-full mt8 crs-nm">
                <Select
                  isMulti
                  name="segment"
                  options={courseOptions}
                  value={selectedCourses}
                  onChange={handleCourseChange}
                  placeholder="Select Course"
                  isDisabled={workorderStatus}
                />
              </div>
            </div>

            <div className="df mt16 amt-gst jcsb">
              {studentNo && (
                <div className="up-status1 input-design">
                  <label className="fc15 fw6 fs14 mb12 ls1">Course MRP</label>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    autoComplete="off"
                    // value={finalAmount}
                    value={wototalAmount}
                    //disabled={workorderStatus ? workorderStatus : (userLoginData.role === '1' || userLoginData.dept_id === '5') ? false : true}
                    disabled={workorderStatus}

                   
                    onChange={(e) => setWototalAmountFun(e.target.value)}
                    min={0}
                  />
                  {/* <span className="fc13 fw6 fs12  ls1 mt10 mr10">
                    {formatter.format(woamount)} (Fee) +{" "}
                    {formatter.format(taxAmount)} (18% GST) =
                    {formatter.format(wototalAmount)}
                  </span> */}
                  {/*otherDetail.workorder_course_amount > 0 && (
                  <p>
                    <span className="fc18 fw6 fs12  ls1 mt10">
                      Selling Amount:{" "}
                      {formatter.format(otherDetail.workorder_course_amount)}
                    </span>
                  </p>
                  )*/}
                  {woReceivedWithoutTaxAmount > 0 && 
                  <p>
                    <span className="fc6 fw6 fs12  ls1 mt10 ">
                      Approved Amount:{" "}
                      {formatter.format(woReceivedWithoutTaxAmount)}
                    </span>
                  </p>}
                  {otherDetail.pending_approval_amount > 0 && 

                  <p>
                  <span className="fc18 fw6 fs12  ls1 mt10">
                    Pending For Approval:{" "}
                    {formatter.format(otherDetail.pending_approval_amount)}
                  </span>
                </p>}
                </div>
              )}
              {status.value === "booked" &&
                !showDiscount &&
                !(
                  otherDetail.workorder_amount_received >=
                  otherDetail.workorder_course_amount
                ) ? (
                  <div className="left-inp sp">
                    <label
                      htmlFor="discount"
                      className="fc15 fw6 fs14 mb12 ls1"
                    >
                      Discount
                    </label>
                    <div className="mob-conatiner df mob-drop">
                      <SingleDropdown
                        options={paymentReceivedOptions}
                        selectedOption={paymentReceived}
                        onSelect={setPaymentReceived}
                      />

                      <input
                        type="text"
                        placeholder="Enter Amount"
                        autoComplete="off"
                        value={discount}
                        onChange={(e) => setDiscountFun(e.target.value)}
                        //readOnly={workorderStatus}
                      />
                    </div>
                  </div>
                ):(
                  <div className="left-inp sp">
                  <label htmlFor="discount" className="fc15 fw6 fs14 mb12 ls1">
                    Sales Amount
                  </label>
                  <div className="df sell-input">
                    <input
                      type="text"
                      autoComplete="off"
                      value={formatter.format(otherDetail.workorder_course_amount)}
                      readOnly
                      className="bg10 disabled-input pl8"
                    />
                  </div>
                  {discount > 0 && 

                  <p>
                    <span className="fc13 fw6 fs12  ls1 mt10 ">
                      Discount Amount: {formatter.format(discount)}
                    </span>
                  </p>}
                </div>
              )}


              <div className="up-status1 input-design payment-plan">
                <label className="fc15 fw6 fs14 mb12 ls1">
                  Amount Received
                </label>
                <input
                  type="text"
                  placeholder="Enter Amount Received"
                  autoComplete="off"
                  value={receivedWithTaxAmount}
                  // onChange={(e) => setPartialAmount(e.target.value)}
                  onChange={(e) => setPartialAmountFun(e.target.value)}
                />

                {/* {receivedAmount > 0 && (
                  <span className="fc13 fw6 fs12  ls1 mt10">
                    ({formatter.format(receivedAmount)} +{" "}
                    {formatter.format(receivedTaxAmount)} (GST) ={" "}
                    {formatter.format(receivedWithTaxAmount)})
                  </span>
                )} */}
                <p>
                  <span className="fc9 fw6 fs12  ls1 mt10">
                    Pending Amount : {formatter.format(pendingAmount)}
                  </span>
                </p>

              </div>
            </div>

            <div className="df mt16 amt-gst jcsb">
              {/* {userDetail.user_type !== 'company' && (
                <div className="up-status1 input-design">
                  <label className="fc15 fw6 fs14 mb12 ls1">Prefered Batch</label>
                  <PreferedDropdown
                    options={optionBatchs}
                    value={selectedBatchs}
                    isDate={otherDetail.prefered_batch_is_date}
                    onSelect={handleSelect}
                  />
                </div>
              )} */}
              <div 
                className={`input-design sp flx48`}
              >
                <SingleDropdown
                  label="Payment Mode"
                  options={paymentMethodOptions}
                  selectedOption={paymentMethod}
                  onSelect={handlePaymentMethod}
                />
              </div>
              
              <div 
                className={`input-design flx48`}
              >
                <div className="calendar-input">
                  <label className="fc15 fw6 fs14 mb12 ls1">
                    Payment Date
                  </label>
                  <DatePicker
                    minDate={
                      userLoginData.dept_id === '7'
                        ? new Date(new Date().setDate(new Date().getDate() - 3))
                        : (userLoginData.role === '1' || userLoginData.dept_id === '5'
                            ? new Date(new Date().setDate(new Date().getDate() - 465))
                            : new Date(new Date().setDate(new Date().getDate() - 30)) 
                          )
                    }
                    maxDate={new Date()} 
                    dateFormat={customDateFormat}
                    selected={paymentDate}
                    onChange={handlePaymentDateChange}
                    placeholderText="-- Select Date --"
                    showIcon
                    isClearable={true}
                    showTimeSelect
                  />
                </div>
              </div>
            </div>
           


            {/*<div className="df mt16 amt-gst">
              <div className="up-status mr24 flx48 pm">
                <SingleDropdown
                  label="Payment Mode"
                  options={paymentMethodOptions}
                  selectedOption={paymentMethod}
                  onSelect={handlePaymentMethod}
                />
              </div>

              <div className="calendar calendar-input">
              <label className="fc15 fw6 fs14 mb12 ls1">
                  Payment Date
                </label>
                  <DatePicker
		    minDate={ userLoginData.dept_id === '7' ? new Date(new Date().setDate(new Date().getDate() - 3)):userLoginData.role === '1' || userLoginData.dept_id === '5' ? new Date(new Date().setDate(new Date().getDate() - 465)) : new Date(new Date().setDate(new Date().getDate() - 30))}  
		    maxDate ={new Date()}
                    dateFormat={customDateFormat}
                    selected={paymentDate}
                    onChange={handlePaymentDateChange}
                    placeholderText="-- Select Date --"
                    showIcon
                    isClearable={true}
                    showTimeSelect
                  />
            </div>
              
            </div>*/}

          <div className="df mt16 amt-gst">
          <div className="w100">
              <div className ="">
                <label className="fc15 fw6 fs14 ls1 v-center cp">
                  <input
                    type="checkbox"
                    className="cp"
                    checked={showGst}
                    onChange={handleGstCheckboxChange}
                  />
                  <span className="ml8">GST Number</span>
                </label>
                {showGst && (
                
                  <input
                    type="text"
                    placeholder="Enter GST Number"
                    autoComplete="off"
                    className="inp-des"
                    defaultValue={gst}
                    onBlur={(e) => setGst(e.target.value)}
                    readOnly={workorderStatus && gst}
                  />
              )}
              </div>
            </div>
          </div>

           
          </>
        )}
        

        {/* {paymentReceived.value === "scholarship" && (
          <>
            <div className="df mt16 pay-validity">
              <div className="up-status">
                <SingleDropdown
                  label="Category"
                  options={categoryOptions}
                  selectedOption={category}
                  onSelect={handleCategoryChange}
                  isReadOnly={true}
                />
              </div>

              <div className="up-status ml24 course-list-drop">
                <SingleDropdown
                  label="Subcategory"
                  options={subcategoryOptions}
                  selectedOption={subcategory}
                  onSelect={handleSubcategoryChange}
                  isReadOnly={!category || true}
                />
              </div>
            </div>
            <div className="form-group form-group-segment flx100 mt24">
              <label className="fc15 fw6 fs14 mb12 ls1">Course Name</label>
              <div className="form-group form-group-segment course-full mt8">
                <Select
                  isMulti
                  name="segment"
                  options={courseOptions}
                  value={selectedCourses}
                  onChange={handleCourseChange}
                  placeholder="Select Course"
                  isDisabled={true}
                />
              </div>
            </div>
            <div className="form-group form-group-segment flx100 mt24">
              <SingleDropdown
                label="Scholarship "
                options={scholarshipOptions}
                selectedOption={scholarship}
                onSelect={setScholarshipFun}
              />
            </div>
            <div className="df mt16 amt-gst">
              {studentNo && (
                <div className="up-status input-design">
                  <label className="fc15 fw6 fs14 mb12 ls1">
                    Course Fee
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    autoComplete="off"
                    // value={finalAmount}
                    value={woamount}
                    readOnly={true}
                    // onChange={(e) => setFinalAmount(e.target.value)}
                    min={0}
                  />
                </div>
              )}
              <div className="up-status input-design ml24 payment-plan">
                <label className="fc15 fw6 fs14 mb12 ls1">
                  Amount Received (inc GST)
                </label>

                <input
                  type="text"
                  placeholder="Enter Amount Received"
                  autoComplete="off"
                  value={receivedAmount}
                  onChange={(e) => setPartialAmountFun(e.target.value)}
                />
              </div>
            </div>
          </>
        )} */}


        {status.value === "hot" && (
          <div className="v-center">
		     {/*<div className="mt24">
              <label className="fc15 fw6 fs14 ls1 v-center cp">
                <input
                  type="checkbox"
                  className="cp"
                  checked={showFunnelSection}
                  onChange={handleFunnelCheckboxChange}
                />
                <span className="ml8">Funnel</span>
              </label>
            </div>*/}
            <div className="mt24">
              <label className="fc15 fw6 fs14 ls1 v-center cp">
                <input
                  type="checkbox"
                  className="cp"
                  checked={showProformaSection}
                  onChange={handleProformaCheckboxChange}
                />
                <span className="ml8">Send Proforma Invoice</span>
              </label>
            </div>
          </div>
        )}
        {(showFunnelSection || showProformaSection) && (
          <>
            <div className="df mt16 pay-validity">
              <div className="up-status">
                <SingleDropdown
                  label="Category"
                  options={categoryOptions}
                  selectedOption={category}
                  onSelect={handleCategoryChange}
                  isReadOnly={true}
                />
              </div>

              <div className="up-status ml24 course-list-drop">
                <SingleDropdown
                  label="Subcategory"
                  options={subcategoryOptions}
                  selectedOption={subcategory}
                  onSelect={handleSubcategoryChange}
                  isReadOnly={!category || true}
                />
              </div>
            </div>
            <div className="form-group form-group-segment flx100 mt24">
              <label className="fc15 fw6 fs14 mb12 ls1">Course Name</label>
              <div className="form-group-segment course-full mt8">
                <Select
                  isMulti
                  name="segment"
                  options={courseOptions}
                  value={selectedCourses}
                  onChange={handleCourseChange}
                  placeholder="Select Course"
                  isDisabled={true}
                />
              </div>
            </div>
            <div className="df mt16 amt-gst">
              <div className="up-status input-design">
                <label className="fc15 fw6 fs14 mb12 ls1">
                  Amount (inc GST)<span className="fc4">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Amount"
                  autoComplete="off"
                  value={finalAmount}
                  //readOnly={workorderStatus}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  min={0}
                />
              </div>
		{/* <div className="calendar calendar-input ml24">
                <label className="fc15 fw6 fs14 mb12 ls1">
                  Expected Date{<span className="fc4">*</span>}
                </label>
                <DatePicker
                  minDate={new Date()}
                  dateFormat={expectedDateFormat}
                  selected={expectedDate}
                  onChange={handleExpectedDateChange}
                  placeholderText="-- Select Date --"
                  showIcon
                />
              </div>*/}
            </div>
          </>
        )}
        {status.value === "Service Call" && (
          <div className="mt24">
            <SingleDropdown
              label="Rating"
              options={ratingOptions}
              selectedOption={rating}
              onSelect={setRating}
            />
          </div>
        )}

        {(status.value !== "batch_allotment"  && status.value!=='course_completed') && (<div className="comments-input mt24">
          <label className="fc15 fw6 fs14 mb12 ls1">Comments</label>
          <textarea
            className="comments p12 br4"
            value={comment}
            onChange={handleCommentsChange}
            placeholder="Any Comments..."
          />
        </div>)}
        {status.value === "booked" && (
          <div className="df fdc mt16">
            <label className="fc15 fw6 fs14 mb12 ls1">Attachment</label>
            <input
              type="file"
              accept=".pdf, .jpg, .jpeg, .doc"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      <div className="button-container mt32 myteam-filters">
        <button type="button" className="btn-cancel clear" onClick={onClose}>
          Cancel
        </button>

    
      <button type="button" 
        className={`update-button  ${updateBtnStatus ? 'disabled-input' : 'btn-blue'}`}
        onClick={() => {
          if(status.value=='batch_allotment' && !updateBtnStatus){
            hadleUpdateBatchAllotmen();
          }
          else if (!updateBtnStatus) {
            handleStatusUpdate();
          }
        }}>
        Update
        </button>
      </div>
    </>
  );
};

export default UpdateStatusForm;
