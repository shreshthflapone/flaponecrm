import React, { useState, useRef, useEffect } from "react";
import "./ImageDropdown.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const ImageDropdown = ({
  options,
  onChange,
  image,
  className,
  showImage,
  label,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const defaultOption = { label: `Select ${label}`, value: "" };

  const handleSelect = (option) => {
    setIsOpen(false);
    if (value?.value === option.value) {
      onChange(defaultOption);
    } else {
      onChange(option);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.getElementById("search-input")?.focus();
    }
  }, [isOpen]);

  return (
    <div className={`img-dropdown w100 pr dib ${className}`} ref={dropdownRef}>
      <button
        className="img-dropdown-toggle cp w100 tal bg5 br4 fs14 ls1"
        onClick={handleToggle}
      >
        <div className="selected-chips-container df fww jcsb">
          {value?.value ? (
            <div className="fc14 v-center fs14 jcsb w100">
              {showImage && value.image && (
                <img
                  src={value.image}
                  alt={value.label}
                  className="img-chip-image br50"
                />
              )}
              <span className="img-chip-label">{value.label}</span>
              <MdOutlineKeyboardArrowDown />
            </div>
          ) : (
            <>
              <span>{defaultOption.label}</span>
              <MdOutlineKeyboardArrowDown />
            </>
          )}
        </div>
      </button>
      {isOpen && (
        <div className="img-dropdown-menu pa fs14 bg5 l0 r0 ls1">
          <input
            id="search-input"
            type="text"
            className="search-inputs fs14"
            placeholder={`Search ${label}`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`img-dropdown-item v-center cp fs12 ls1 lh16 ${
                  value?.value === option.value ? "img-selected" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {image && (
                  <img
                    src={option.image}
                    alt={option.label}
                    className="dropdown-image"
                  />
                )}
                {option.label}
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
