import React, { useState, useEffect  } from "react";
import "../components/Toggle.css";

const Toggle = ({ initialValue, onChange }) => {
  
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

  const handleClick = () => {
    const newValue = !value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={`toggle ${value ? "active" : "inactive"}`}
      onClick={handleClick}
    >
      <div className={`toggle-circle ${value ? "active" : "inactive"}`} />
    </div>
  );
};

export default Toggle;
