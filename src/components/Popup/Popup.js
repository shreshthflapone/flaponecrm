import React, { useRef, useEffect } from "react";
import "./Popup.css";

const Popup = ({ onClose, title, children, txtSubHeading }) => {
  const popupRef = useRef();

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [onClose]);

  return (
    <div className="popup">
      <div className="popup-content" ref={popupRef}>
        <div className="modal-header" style={{ borderBottom: "0px none" }}>
          <h3>{title && title}</h3>
        </div>
        <div className="fs14 fc5 fw4 lh18">{txtSubHeading && txtSubHeading}</div>
        <div className="modal-body pr">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
