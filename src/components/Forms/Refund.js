import React, { useState, useRef, useEffect } from "react";
import SingleDropdown from "../SingleDropdown";

const Refund = ({ onClose }) => {
  const [reason, setReason] = useState("Basic");
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");

  const refundReasons = [
    "Lead Converstion 0",
    "Lead Converstion Less",
    "RM Service Not Good",
    "Miscommitment",
    "Business Closed",
    "Other",
  ];
  const handleCommentsChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <>
      <div className="refund-details">
        <SingleDropdown
          label="Refund Reason"
          options={refundReasons}
          selectedOption={reason}
          onSelect={setReason}
        />
        <div className="comments-input mt16">
          <label className="fc15 fw6 fs14 mb12 ls1">Comments</label>
          <textarea
            className="comments p12 br4"
            value={comment}
            onChange={handleCommentsChange}
            placeholder="Any Comments..."
          />
        </div>
        <div className="mt16 input-design">
          <label className="fc15 fw6 fs14 mb12 ls1">Amount</label>
          <input
            type="number"
            placeholder="Enter Amount"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
          />
        </div>
      </div>
      <div className="button-container mt32">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="update-button btn-blue">
          Refund
        </button>
      </div>
    </>
  );
};

export default Refund;
