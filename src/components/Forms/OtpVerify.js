import React, { useState, useRef, useEffect } from "react";
import "../Forms/OtpVerify.css";
const OtpVerify = ({onClose,varifyOTPFun,otpVerifyMsgStatus,otpStatusVerify,phoneNumber}) => {
  const [otp, setOtp] = useState(["", "", "", ""]); 
  const inputRefs = useRef([]); 

  // Function to handle input change
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) && index >= 0 && index < 4) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) {
        inputRefs.current[index + 1].focus(); 
      }
    }
  };

  // Function to handle backspace
const handleBackspace = (e, index) => {
    if (e.keyCode === 8) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
  
      if (index > 0) {
        inputRefs.current[index - 1].focus(); 
      }
    }
  };
 
  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    // Set up a timeout to call onClose after 1 minute if otpStatusVerify is '0'
    if (otpStatusVerify === '1') {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 1000); // 60,000 milliseconds = 1 minute

      // Make sure to clear the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [otpStatusVerify, onClose]);

  const otpHandleVarify = () => {
    varifyOTPFun(otp);
  };


  return (
    <>
      <div className="df aic jcc fdc">
        <p className="fw6 fc14 fs18 ls1 lh22 enter-otp-text">Please enter the One-Time Password to verfiy</p>
        <p className="ls1 fc16 fs14 mt8 lh22 enter-otp-subtext">A One-Time Password has been sent to {phoneNumber}</p>
      </div>
      <div className="otp-form df aic jcc mt24">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            className="otp-input"
            value={value}
            maxLength="1"
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            ref={(input) => (inputRefs.current[index] = input)}
          />
        ))}
      </div>
      
      {otpStatusVerify === "0" && (
        <div className="form-error-messages error mt8 blink-text-normal-error tac">
          {otpVerifyMsgStatus}
        </div>
      )}

      {otpStatusVerify === "1" && (
        <div className="form-error-messages error mt8 blink-text-normal-success tac">
          {otpVerifyMsgStatus}
        </div>
      )}

      <div className="box-center mt32 mb32">
      <button type="button" className="btn-confirm ls3 " onClick={otpHandleVarify}>
          Validate
        </button>
      </div>
      <div className="button-container myteam-filters">
        <button type="button" className="btn-cancel clear" onClick={onClose}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default OtpVerify;
