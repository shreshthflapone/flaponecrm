import React from "react";
import "../components/InnerHeader.css";

const InnerHeaderMultiButton = ({
  heading,
  txtSubHeading,
  buttons = [],
}) => {
  return (
    <>
      <div className="df aic pt8 pb8 inner-header fww">
        <div className={`df fdc ${buttons.length ? "flx75" : "flx100"}`}>
          <div className="flx1 fs22 fw6 fc14 df">
            <h1>{heading}</h1>
          </div>
          <div className="fs14 fc5 fw4 mt8 lh18">
            {txtSubHeading
              ? txtSubHeading
              : "Unlocking possibilities: Explore the potential and personalization of 'My Packages'"}
          </div>
        </div>
        
        <div className="myteam-button v-center jce flx1 df gap12">
          {buttons.map((btn, index) => (
            <button key={index} onClick={btn.onClick} className="btn-blue mr8">
              {btn.icon} {btn.text}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default InnerHeaderMultiButton;
