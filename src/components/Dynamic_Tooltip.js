import React from 'react';
import "../components/Dynamic_Tooltip.css";

const DynamicTooltip = ({ direction = 'top', children, text, styleCustom,onClickFunction}) => {
  return (
    <div className="dtooltip-container"  style={styleCustom} onClick={onClickFunction}>
      {children}
      <div className={`dtooltip dtooltip-${direction}`}>
        {text}
      </div>
    </div>
  );
};

export default DynamicTooltip;