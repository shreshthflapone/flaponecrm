import React, { useState, useRef, useEffect } from "react";
import "./SearchMultiSelectDropdown.css";

const MultiSearchSelectDropdown = ({
  options,
  placeholder,
  onSelectionChange,
  clearSignal,
  selectedOption,
  noChip = false,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  useEffect(() => {
    if (selectedOption) {
      setSelectedOptions(selectedOption);
    }
  }, [selectedOption]);

  const handleSelectOption = (option) => {
    if (isOptionSelected(option)) {
      handleRemoveOption(option);
    } else {
      const newSelectedOptions = [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      onSelectionChange(newSelectedOptions);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveOption = (option) => {
    const newSelectedOptions = selectedOptions.filter(
      (selected) => selected.value !== option.value
    );
    setSelectedOptions(newSelectedOptions);
    onSelectionChange(newSelectedOptions);
  };

  const isOptionSelected = (option) => {
    return selectedOptions.some((selected) => selected.value === option.value);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  useEffect(() => {
    if (clearSignal) {
      setSelectedOptions([]);
      setSearchTerm("");
    }
  }, [clearSignal]);
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [selectedOptions]);

  const visibleOptions = showExtraOptions ? options.length : 100;

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="input-container">
        {selectedOptions.slice(0, visibleOptions).map((option, index) => (
          <div key={index} className="chip">
            {option?.label}
            <span
              className="closebtn"
              onClick={() => handleRemoveOption(option)}
            >
              &times;
            </span>
          </div>
        ))}
        {selectedOptions.length > 3 && !noChip && !showExtraOptions && (
          <div className="chip">+{selectedOptions.length - 3}</div>
        )}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          ref={inputRef}
          disabled={disabled}
          className={`${disabled ? "disabled-input" : "cp"}`}
        />
      </div>
      {showDropdown && searchTerm && (
        <div className="dropdown-content">
          {filteredOptions.length === 0 ? (
            <div className="dropdown-item">No results found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`dropdown-item ${isOptionSelected(option) ? "selected-val" : ""}`}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSearchSelectDropdown;
