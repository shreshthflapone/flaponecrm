import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SingleDropdown from "../SingleDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import DocUpload from "../DocUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AffiliateUpdateStatusForm = ({ onClose }) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState({});
    const [paymentAmount, setPaymentAmount] = useState("");
    const [comment, setComment] = useState("");
    const [followupDate, setFollowupDate] = useState("");
    const [file, setFile] = useState(null);
    const statusOptions = [
        { label: "Paid", value: "paid" },
        { label: "Followup", value: "followup" },
        { label: "No Response", value: "no_response" }
    ];
    const customDateFormat = "dd/MM/yyyy h:mm aa";
    const expectedDateFormat = "dd/MM/yyyy";
    const handleStatusChange = (option) => {
      setStatus(option);
    };
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentAmount(value);
    };
    const handleFollowupDateChange = (date) => {
        setFollowupDate(date);
    };
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
        } else {
            toast.warn(
                "Invalid file type. Please upload a valid file (doc, pdf, jpg, jpeg)."
            );
            e.target.value = null;
        }
    };
    return (
        <>
            <div className="update-status-form">
                <div className="df up-st-form jcsb fww">
                    <div 
                        className={
                            Object.keys(status).length === 0 ? "flx100" : "up-status"
                        }
                    >
                        <SingleDropdown
                            label="Status"
                            options={statusOptions}
                            selectedOption={status}
                            onSelect={handleStatusChange}
                        />
                    </div>
                    {status.value === "paid" && (
                        <div className="form-group-settings up-status">
                            <p className="fc15 fw6 fs14 ls1">Payment Amount<span className="fc4">*</span></p>
                            <input
                                type="text"
                                name="payment_amount"
                                placeholder="Payment Amount"
                                autoComplete="off"
                                value={paymentAmount}
                                onChange={handlePaymentChange}
                            />
                        </div>
                    )}
                    {(status.value === "paid" || status.value === "followup" || status.value === "no_response" ) && (
                        <div
                            className="calendar calendar-input"
                        >
                            <label className="fc15 fw6 fs14 mb12 ls1">
                                {status.value === "paid"?"Next Payment Date":"Next Follow-up Date"}
                                <span className="fc4">*</span>
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
                    {status.value === "paid" && (
                        <div className="up-status">
                            <label className="fc15 fw6 fs14 mb12 ls1">Upload Bill<span className="fc4">*</span></label>
                            <input
                                className="mt12"
                                type="file"
                                accept=".pdf, .jpg, .jpeg, .doc"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                    <div className="flx100 comments-input mt24">
                        <p className="fc15 fw6 fs14 mb8 ls1">Comment</p>
                        <textarea
                            className="comments p12 br4"
                            placeholder="Any Comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                        />
                    </div>
                </div>
                <div className="button-container mt32 myteam-filters">
                    <button type="button" className="btn-cancel clear" onClick={onClose}>Cancel</button>
                    <button type="button" className="update-button btn-blue">Update</button>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </>
    );
};
export default AffiliateUpdateStatusForm;
