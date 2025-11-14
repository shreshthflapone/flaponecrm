import React, { useState, useRef, useEffect } from "react";
import "./MultiDropdown.css";

const MultiDropdown = ({
  label,
  options,
  selectedValues,
  onSelect,
  chips,
  searchable = false,
  isReadOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const toggleDropdown = () => {
    if (!isReadOnly) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value) => {
    if (!isReadOnly) {
      setSearchTerm("");
      onSelect(value);
    }
  };

  const handleChipRemove = (value) => {
    if (!isReadOnly) {
      onSelect(value);
    }
  };

  const renderSelectedChips = () => {
    let chipscount = 2;
    if (chips !== "") {
      chipscount = chips;
    }

    const visibleChips = selectedValues.slice(0, chipscount);
    const additionalCount = selectedValues.length - visibleChips.length;

    return (
      <>
        {visibleChips.map((value,index) => (
          <div
            key={index}
            className="chip"
            onClick={() => handleChipRemove(value)}
          >
            {options.find((option) => option.value === value)?.label}
            <span className="closebtn">&times;</span>
          </div>
        ))}
        {additionalCount > 0 && (
          <div className="chip more-chip" onClick={toggleDropdown}>
            +{additionalCount}
          </div>
        )}
      </>
    );
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`dropdown-container  ${isReadOnly ? "bg6 " : "bg5"}`}
      ref={dropdownRef}
    >
      <div
        className={`dropdown-header ${isReadOnly ? "disabled-input " : ""}`}
        onClick={toggleDropdown}
      >
        {selectedValues.length > 0 ? renderSelectedChips() : `Select ${label}`}
      </div>
      {isOpen && !isReadOnly && (
        <div className="dropdown-menus">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dropdown-search-input"
              ref={searchInputRef}
            />
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option,index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option.value)}
                className={`dropdown-item lh18 ${
                  selectedValues.includes(option.value) ? "selected" : ""
                }`}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="no-data-found p10">No data found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
