import React, { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import "./SingleDropdown.css";

const SingleDropdownMultiSearch = ({
  label,
  compulsory,
  options,
  selectedOption,
  onSelect,
  isReadOnly,
  search = false,
  handleClickUpdate,
  extraProps,
  isOtions,
  noLabel = "true",
  placeholder = "Select",
  allowCustom,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  if (!selectedOption && isOtions === 1) {
    selectedOption = options[0];
  }

  if (label === "Chapter Position After") {
    placeholder = "Select Chapter";
  }

  const handleSelect = (option) => {
    onSelect(option);
    setShowDropdown(false);
    setSearchTerm("");
    if (extraProps) {
      handleClickUpdate(label, option);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showDropdown]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options?.filter((option) => {
  const search = searchTerm.toLowerCase();
  return (
    option.label?.toLowerCase().includes(search) ||
    option.name?.toLowerCase().includes(search) ||
    option.mobile?.toLowerCase().includes(search) ||
    option.email?.toLowerCase().includes(search) ||
    option.value?.toString().toLowerCase().includes(search)
  );
});

  const handleAddCustomOption = () => {
    const newOption = { label: searchTerm, value: "0" };
    handleSelect(newOption);
  };

  return (
    <div className="dropdown-container">
      {noLabel && (
        <label htmlFor="dropdown" className="fc15 fw6 fs14 mb12 ls1">
          {label}
          {compulsory}
        </label>
      )}
      <div className="role-dropdown" ref={dropdownRef}>
        <div
          className={`selected-role fs14 ls1 ttc ${isReadOnly ? " bg6 " : ""}`}
          onClick={() => !isReadOnly && setShowDropdown(!showDropdown)}
        >
          {(selectedOption && selectedOption.label) || `${placeholder}`}{" "}
          <FaAngleDown className="fc16 fs14" />
        </div>
        {showDropdown && (
          <div className="dropdown-content searching-drop">
            {search && (
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder={`Search ${label}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxLength={150}
              />
            )}
            <ul className="role-options fs14">
              {filteredOptions.map((option) => (
                <li key={option.value} onClick={() => handleSelect(option)}>
                  {option.label}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="no-results">No results found</li>
              )}
            </ul>
            {allowCustom &&
              searchTerm &&
              filteredOptions.length === 0 &&
              !filteredOptions.some(
                (option) => option.label === searchTerm
              ) && (
                <div
                  className="add-custom-option p10 tac cp brd-b1 bg1 fc3"
                  onClick={handleAddCustomOption}
                >
                  Add "{searchTerm}"
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDropdownMultiSearch;