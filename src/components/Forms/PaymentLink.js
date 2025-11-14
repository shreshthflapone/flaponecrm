import React, { useState, useRef, useEffect } from "react";
import SingleDropdown from "../SingleDropdown";
import { MdCurrencyRupee } from "react-icons/md";
import Toggle from "../Toggle";
import { BiLink } from "react-icons/bi";
import "./PaymentLink.css";
import { MdModeEdit } from "react-icons/md";
import Select from "react-select";
import { toast } from "react-toastify";

const PaymentLink = ({
  userLoginData,
  onClose,
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
  selectedCoursesIds,
  setSelectedCoursesIds,
  generatePaymentLink,
  paymentLink,
  setPaymentLink,
  studentNo,
  finalAmount,
  setFinalAmount,
  partialAmount,
  setPartialAmount,
  workorderStatus,
  scholarStatus,
  otherDetail,
  handleLeadForm,
  coursePriceTax,
  coursePriceWithTax
}) => {
  
  let totalAmountt;
  let taxAmount = 0;
  const taxRate = 0.18;
  
  if(workorderStatus){
 //   taxAmount = coursePriceTax;
    totalAmountt = coursePriceWithTax;
  }else{
    amount = amount; 
   // taxAmount = Math.round(amount * taxRate, 10); 
   // totalAmountt = amount + taxAmount;
    totalAmountt = amount * studentNo;
  }



  const [totalAmount, setTotalAmount] = useState(totalAmountt);

   useEffect(() => {
    if(workorderStatus){
      setTotalAmount(coursePriceWithTax);
    }else{
     //const updatedTaxAmount = Math.round(amount * taxRate, 10); 
     //const updatedTotalAmount = Math.round(amount) + updatedTaxAmount; 
     const updatedTotalAmountWithstuNo = amount * studentNo; 
     setTotalAmount(updatedTotalAmountWithstuNo); 
    }
   }, [studentNo, amount, taxRate,coursePriceWithTax]); 
 

  const [receivedAmount, setReceivedAmount] = useState(0);
  const [receivedAmountGst, setReceivedAmountGst] = useState(0);
  const [receivedAmountWithOutGst, setReceivedAmountWithOutGst] = useState(0);
  const [receivedAmountWithGst, setReceivedAmountWithGst] = useState(0);

  const [categoryValue, setCategoryValue] = useState("");
  const [subcategoryValue, setSubcategoryValue] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [emi, setEmi] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [dealType, setDealType] = useState(false);
  const [discountType, setdiscountType] = useState(false);
  const inputRef = useRef(null);
  const [scholarship, setScholarship] = useState({});

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const scholarshipOptions = [
    { label: "100%", value: 100 },
    { label: "90%", value: 90 },
    { label: "80%", value: 80 },
    { label: "70%", value: 70 },
    { label: "60%", value: 60 },
    { label: "50%", value: 50 },
    { label: "40%", value: 40 },
    { label: "30%", value: 30 },
    { label: "20%", value: 20 },
    { label: "10%", value: 10 },
  ];

  const setTotalAmountFun = (value) => {
     setTotalAmount(Math.round(value) || 0);
    // setFinalAmount(Math.round(value) || 0);
  };

  const setPartialAmountFun = (value) => {
    setPartialAmount(Math.round(value) || 0);
  };

  const setReceivedAmountFun = (value) => {
    const taxAmount = Math.round(Math.round(parseFloat(value) * 100/118, 10));
    const receiveAmountWithTax = Math.round(parseFloat(value) + taxAmount, 10);
    setReceivedAmount(value);
	  setReceivedAmountWithOutGst(taxAmount); 
    setReceivedAmountGst(value-taxAmount);
    setReceivedAmountWithGst(value);
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
    setSelectedCourses(selectedOptions);
    const course_ids = selectedOptions.map((obj) => obj.value);
    setSelectedCoursesIds(course_ids);
    getCoursePriceData(course_ids);
    handleLeadForm("course_id", course_ids);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const generateURL = () => {
    if (discountType) {
      if (scholarship && scholarship.value === undefined) {
        toast.error(`Please select scholarship %`);
        return false;
      }
    }

    if (selectedCourses.length === 0) {
      toast.error("Select Course First");
      return false;
    }

    // if (dealType && !discountType) {
    //   if (finalAmount !== partialAmount && !workorderStatus) {
    //     toast.error("Both amount should be equal");
    //     return false;
    //   }
    // }

    if (receivedAmount < 1) {
      toast.error("Please Enter valid Amount");
      return false;
    }

    // if (finalAmount < partialAmount) {
    //   toast.error("Final amount always greater");
    //   return false;
    // }

    let updatedata = {};
      updatedata = {
        courses: selectedCourses,
        amountchk : totalAmountt,
        amount: totalAmount,
        course_amount: amount,
        course_gst: taxAmount,
        receivedAmount: receivedAmount-receivedAmountGst,
        receivedAmountGst: receivedAmountGst,
        receivedAmountWithGst: receivedAmountWithGst,
      };
   generatePaymentLink(updatedata);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopied(true);
    setIsEditing(false);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const emiHandle = () => {
    setEmi((prevEmi) => {
      const newEmi = !prevEmi;

      return newEmi;
    });
  };

  const dealHandle = () => {
    if (!dealType) {
      if (
        otherDetail.workorder_amountwithouttax_received < 1 &&
        otherDetail.discount_amount > 0
      ) {
        setReceivedAmountFun(totalAmount);
      } else if (otherDetail.workorder_pending_amount > 0) {
        setReceivedAmountFun(otherDetail.workorder_pending_amount);
      } else {
        setReceivedAmountFun(totalAmount);
      }
    }
    
    setDealType((prevDealType) => {
      const newDealType = !prevDealType;
      return newDealType;
    });
  };

  const discountHandle = () => {
    setdiscountType((prevDiscountType) => {
      const newDiscountType = !prevDiscountType;
      return newDiscountType;
    });

    setFinalAmount(totalAmount);
  };

  const setScholarshipFun = (selectedScholar) => {
    setScholarship(selectedScholar);
    const calculatedAmount = (amount * selectedScholar.value) / 100;
    const scholarlessAmount = amount - calculatedAmount;

    const taxAmount = Math.round(scholarlessAmount * taxRate, 10);
    const receiveAmountWithTax = Math.round(scholarlessAmount + taxAmount, 10);
    setReceivedAmount(scholarlessAmount);
    setReceivedAmountGst(taxAmount);
    setReceivedAmountWithGst(receiveAmountWithTax);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  return (
    <>
      <div className="paymeny-link-details ">
        <div className="payment-plan v-center jcsb">
          <div className="plan-name mr16">
            <SingleDropdown
              label="Category"
              options={categoryOptions}
              selectedOption={category}
              onSelect={handleCategoryChange}
              isReadOnly={workorderStatus}
            />
          </div>
          <div className="plan-validity">
            <SingleDropdown
              label="Subcategory"
              options={subcategoryOptions}
              selectedOption={subcategory}
              onSelect={handleSubcategoryChange}
              isReadOnly={!category || workorderStatus}
            />
          </div>
        </div>
        <div className="form-group-segment course-full mt24">
          <label className="fc15 fw6 fs14 mb8 ls1">Course Name</label>
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

        {!scholarStatus && (
          <>
            <div className="amt-label fc15 fw6 fs14 mb8 ls1 mt24">
              Course MRP
            </div>

            <div className="amount-input v-center jcsb">
              <input
                type="number"
                value={totalAmount}
                className="brd1 pt8 pb8 pl16 pr16 flx1 br4"
                onChange={(e) => setTotalAmountFun(e.target.value)}
                min={0}
                //readOnly={workorderStatus || discountType}
                //disabled={workorderStatus ? workorderStatus : (userLoginData.role === '1' || userLoginData.dept_id === '5') ? false : true}
                disabled={workorderStatus}
              />
              {/* <div className="emi-input df jce flx33">
                <Toggle initialValue={discountType} onChange={discountHandle} />
                <p className="price-emi fc5 ls1 v-center ml12">
                  {discountType ? "Scholarship" : " Scholarship"}
                </p>
              </div> */}
            </div>
            {/* <p className="price-sub-text fs12 fc5 mt4 ls1 lh18 v-center">
              {formatter.format(amount)} (Course Fee) +{" "}
              {formatter.format(taxAmount)} ({18}% GST) ={" "}
              {formatter.format(totalAmount)}
            </p> */}

            <div className="flx1 mt16">
              {discountType && (
                <SingleDropdown
                  label="Scholarship "
                  options={scholarshipOptions}
                  selectedOption={scholarship}
                  onSelect={setScholarshipFun}
                  noLabel={false}
                />
              )}
            </div>
          </>
        )}

        <div className="amount-input df ais mt32 fdc ">
          {workorderStatus &&
          otherDetail &&
          otherDetail.workorder_pending_amount !== 0 ? (
            <span className="fc9 fw6 fs12 ls1 mb12">
              {/* Pending amount {otherDetail.workorder_pending_amount} */}
            </span>
          ) : workorderStatus &&
            otherDetail &&
            otherDetail.workorder_course_amount ===
              otherDetail.workorder_amount_received ? (
            <span className="fc9 fw6 fs12 ls1 mb12">
              Paid amount {otherDetail.workorder_paid_amount}
            </span>
          ) : null}

          <div className="df fdc w100 ais">
            <div className="amt-label fc15 fw6 fs14 mb8 ls1 df">
              Amount for payment link
              {otherDetail && otherDetail.workorder_pending_amount ? (
                <span className="fc4 v-center ml4">
                  (Pending Amt: <MdCurrencyRupee />{" "}
                  {otherDetail.workorder_pending_amount})
                </span>
              ) : (
                <span></span>
              )}
            </div>
            <div className="df w100 full-amt-grp jcsb">
              <div className="v-center flx1">
                <p
                  className={`pay-price brd1 p16 v-center w100 ${dealType ? "bg6 disabled-input" : ""}`}
                  onClick={handleEditClick}
                >
                  <MdCurrencyRupee className="fc5 fs24" />
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="number"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmountFun(e.target.value)}
                      onBlur={() => setIsEditing(false)}
                      min={0}
                      className={`flx1 ${dealType ? "bg6 disabled-input" : ""}`}
                    />
                  ) : (
                    <span className={`price-pay-link fs28 `}>
                      {receivedAmount}
                    </span>
                  )}
                </p>
                {/* {!dealType && (
                  <MdModeEdit
                    className={`fc14 fs24 ml16 cp df jce ${isEditing ? "hidden" : ""}`}
                    onClick={handleEditClick}
                  />
                )} */}
              </div>

              {/* <div className="emi-input aic df jce flx33">
                <Toggle initialValue={dealType} onChange={dealHandle} />
                <p className="price-emi fc5 ls1 v-center ml12">
                  {dealType ? "Full Payment" : " Part Payment"}
                </p>
              </div> */}

            </div>
          </div>

          {/* {receivedAmount > 0 && (
            <p className="price-sub-text fs12 fc5 mt4 ls1 lh18 v-center">
              {formatter.format(receivedAmountWithOutGst)} (Course Fee) +{" "}
              {formatter.format(receivedAmountGst)} ({18}% GST) ={" "}
              {formatter.format(receivedAmountWithGst)}
            </p>
          )} */}
        </div>

       {/* {workorderStatus &&
        otherDetail &&
        otherDetail.workorder_pending_amount !== 0 ? ( */}
        <div className="box-center mt32">
            <button
              className="bg9 pt8 pb8 pl12 pr12 fc3 cp"
              onClick={generateURL}
            >
              Generate URL
            </button>
          </div>
        {/* ) : workorderStatus &&
          otherDetail &&
          otherDetail.workorder_course_amount ===
            otherDetail.workorder_amount_received ? null : (
          <div className="box-center mt32">
            <button
              className="bg9 pt8 pb8 pl12 pr12 fc3 cp"
              onClick={generateURL}
            >
              Generate URL
            </button>
            <div className="emi-input box-center mt12 mb12 ml12">
              <Toggle initialValue={emi} onChange={emiHandle} />
              <p className="price-emi fc5 ls1 v-center ml12">
                {emi ? "With EMI" : "Without EMI"}
              </p>
            </div>
          </div>
        )} */}

        {paymentLink && (
          <div className="share-package-form mt24">
            <div className="form-input df">
              <input
                type="text"
                value={paymentLink}
                readOnly
                placeholder="Payment Link URL"
              />
              <button
                type="submit"
                className="v-center ml16 "
                onClick={copyToClipboard}
              >
                <span className="ls1">
                  {isCopied ? "Copied!" : "Copy link"}
                </span>
                <BiLink className="ml8 fs18" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="button-container mt32 myteam-filters">
        <button
          type="button"
          className="btn-cancel clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default PaymentLink;
