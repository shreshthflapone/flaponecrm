import React, { useState, useEffect, useRef } from "react";
import "./MultiselectDropdown.css";

const MultiselectDropdown = ({
  options,
  selectedOptions,
  onSelectedOptionsChange,
  showDropdown,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const toggleOption = (option) => {
    if (selectedOptions.some((item) => item.value === option.value)) {
      onSelectedOptionsChange(
        selectedOptions.filter((item) => item.value !== option.value)
      );
    } else {
      onSelectedOptionsChange([...selectedOptions, option]);
    }
    setInputValue("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (showDropdown) {
      setDropdownOpen(true);
    }

    if (value.endsWith(",")) {
      const trimmedValue = value.trim();
      if (trimmedValue !== ",") {
        toggleOption({ label: trimmedValue, value: trimmedValue });
      }
      setInputValue("");
    } else {
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      toggleOption({ label: inputValue.trim(), value: inputValue.trim() });
    } else if (e.key === "," && inputValue.trim() !== "") {
      e.preventDefault();
      toggleOption({ label: inputValue.trim(), value: inputValue.trim() });
    }
  };

  const handleOptionClick = (option) => {
    toggleOption(option);
    setDropdownOpen(false);
  };

  const handleDeleteOption = (option) => {
    onSelectedOptionsChange(
      selectedOptions.filter((item) => item.value !== option.value)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputValue === "") {
      onSelectedOptionsChange(selectedOptions.slice(0, -1));
    }
  };

  const handleDropdownClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="multiselect-dropdown" onClick={handleDropdownClick}>
      <div className="selected-optionsm">
        {selectedOptions &&
          selectedOptions.map((option) => (
            <div
              key={option.value}
              className="chipmulti"
              onClick={() => handleDeleteOption(option)}
            >
              {option.label}
              <span className="close-btn">×</span>
            </div>
          ))}
        <input
          ref={inputRef}
          type="text"
          placeholder="Type and press comma or enter"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onKeyDown={handleKeyDown}
        />
      </div>
      {dropdownOpen && (
        <div className="dropdownmulti" ref={dropdownRef}>
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="optionmulti"
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

export default MultiselectDropdown;
