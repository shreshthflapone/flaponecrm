import React, { useState, useRef, useEffect } from "react";
import SingleDropdown from "../SingleDropdown";
import { BiLink } from "react-icons/bi";
import { MdEmail } from "react-icons/md";

const Invoice = ({ onClose,workorderList,sendInvoice,toast,getInvoicePdfUrl,invoicepdfurl,invoiceFileName}) => {
  const [courseInvoice, setCourseInvoice] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [url, setUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

 const  handleInvoiceChange=(invoice)=>{
      setInvoiceNo(invoice);
      setUrl("");
 }

 const handleSendInvoice =()=>{
  if(invoiceNo){
  sendInvoice(invoiceNo.value);
  }else{
    toast.error("Please choose invoice first");
  }
 }

  const generateURL = () => {
    if(invoiceNo){
      getInvoicePdfUrl(invoiceNo.value);
      if(invoiceFileName){
        setUrl(invoicepdfurl+invoiceFileName);
      }else{
        toast.error("Something went wrong try again later");
      }
      }else{
        toast.error("Please choose invoice first"); 
      }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setIsEditing(false);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <>
      <div className="refund-details">
        {/* <SingleDropdown
          label="Courses Name"
          options={completedCourse}
          selectedOption={courseInvoice}
          onSelect={setCourseInvoice}
        /> */}
        <div className="mt24">
          <SingleDropdown
            label="Invoice No"
            options={workorderList}
            selectedOption={invoiceNo}
            onSelect={handleInvoiceChange}
          />
        </div>
        {invoiceFileName  && url && (
          <div className="share-package-form mt24">
            <div className="form-input df mt8">
              <input
                type="text"
                value={url}
                readOnly
                placeholder="Payment Link URL"
              />
              <button
                type="submit"
                className="v-center ml16"
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
        <div className="box-center mt32">
          <button
            className="bg9 pt8 pb8 pl12 pr12 fc3 cp fs14 ls1"
            onClick={generateURL}
          >
           Preview Invoice
          </button>
          <div className="v-center ml8" onClick={handleSendInvoice}>
            Or 
            <MdEmail className="fs36 cp ml8"
           />
          </div>
        </div>
      </div>
      <div className="button-container mt32 myteam-filters">
        <button type="button" className="btn-cancel clear" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="update-button btn-blue" onClick={handleSendInvoice}>
          Send
        </button>
      </div>
    </>
  );
};

export default Invoice;
