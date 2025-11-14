import React, { useState, useEffect } from "react";
import "./SearchInput.css";

function SearchInput({
  onSearchChange,
  clearSignal,
  placeholder,
  workOrderID,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (clearSignal) {
      setInputValue("");
      onSearchChange("");
    }
  }, [clearSignal, onSearchChange]);

  useEffect(() => {
    if (workOrderID) {
      setInputValue(workOrderID);
    }
  }, [workOrderID]);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    onSearchChange(value);
  };

  return (
    <div className="search-input">
      <input
        type="text"
        placeholder={`Search ${placeholder}`}
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchInput;
