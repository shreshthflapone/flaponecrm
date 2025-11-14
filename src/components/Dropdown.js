import React, { useState, useEffect, useRef } from "react";
import "./Dropdown.css";

const Dropdown = ({
  label,
  options,
  selectedValue,
  onValueChange,
  clearSignal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(label);
  const dropdownRef = useRef();

  useEffect(() => {
    setSelectedLabel(label);
  }, [label]);

  useEffect(() => {
    if (clearSignal) {
      setSelectedLabel("");
    }
  }, [clearSignal]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onValueChange(option);
    setIsOpen(false);
    setSelectedLabel(option.label);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-container-second">
      <div className="dropdown-label" onClick={toggleDropdown}>
        <p>
          {(selectedValue && selectedValue.label) ||
            selectedLabel ||
            `${label}`}
        </p>
        <span className={`custom-arrow`}></span>
      </div>
      {isOpen && (
        <div className="dropdown-options" ref={dropdownRef}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-option ${
                selectedValue.value === option.value
                  ? "selected"
                  : selectedValue === option.value
                    ? "selected"
                    : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
