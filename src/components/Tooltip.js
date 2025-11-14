import React, { useState } from "react";
import "../components/Tooltip.css";

const Tooltip = ({ title, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div
      className="icon v-center"
      style={{ position: "relative" }}
      onMouseEnter={toggleTooltip}
      onMouseLeave={toggleTooltip}
    >
      {children}
      {showTooltip && <div className="tooltip">{title}</div>}
    </div>
  );
};

export default Tooltip;
