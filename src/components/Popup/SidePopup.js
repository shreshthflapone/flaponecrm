import React, { useRef, useEffect } from "react";
import "../Popup/SidePopup.css";
const SidePopup = ({ show, children, onClose,totalPageNum,pageNum,autLoadreldata,className}) => {
  const formRef = useRef(null);

  const enableScroll = () => {
    document.body.style.overflow = "auto";
  };

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target) && show) {
      onClose();
      enableScroll();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (show) {
      disableScroll();
    } else {
      enableScroll();
    }
  }, [show]);
  const CloseMyPopup=()=>{
    onclose(); 
    enableScroll();
  }


  useEffect(() => {
    if(totalPageNum>0){
    const modalBody = formRef.current;

    const scrollHandler = () => {
      if (modalBody) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
        const { scrollTop, clientHeight, scrollHeight } = modalBody;
        // Adjust the scroll threshold as needed (e.g., 70 pixels from the bottom)
        if (scrollTop + clientHeight >= scrollHeight - 70) {
          autLoadreldata();
        }
      }, 200); 
     }
   };
    let scrollTimeout;
    modalBody.addEventListener('scroll', scrollHandler);

    return () => {
      if (modalBody) {
        modalBody.removeEventListener('scroll', scrollHandler);
      }
    };
  }
  }, [pageNum, totalPageNum]);
  return (
    <div className="lead-popup-overlay">
      <div
        className={`lead-popup-content pr ${show ? `slide-in-popup ${className}` : ""}`}
        ref={formRef}
      >
        <div className="modal-body pr">{children}</div>
      </div>
    </div>
  );
};
export default SidePopup;

