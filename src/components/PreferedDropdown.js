
import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PreferedDropdown = ({ options, value, isDate, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [classDate, setClassDate] = useState(null);
  const [showSelect, setShowSelect] = useState(isDate && value ? false :true);
  const [showIsDate, setShowIsDate] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isDate && value && !value.label) {
      setClassDate(new Date(value));
      setShowDatePicker(false);
      setShowSelect(false);
      setSelectedOption(null);
    } else {
      setSelectedOption(value || null);
      setShowDatePicker(false);
      setShowSelect(true);  
      console.log("value = ",value);
    }
  }, [value, isDate, options]);

  const handleChange = (selected) => {
    if (selected?.value === "select_date") {
      setShowDatePicker(true);
      setShowSelect(false);
      setSelectedOption(null);
    } else {
      setSelectedOption(selected);
      setShowDatePicker(false);
      setClassDate(null);
      setShowSelect(true);
      onSelect(selected);
    }
  };

  const handleDateChange = (date) => {
    setClassDate(date);
    setShowDatePicker(false);
    setShowSelect(false);
    onSelect(date);
    setShowIsDate(true);
  };

  const handleClear = () => {
    setClassDate(null);
    setShowDatePicker(false);
    setSelectedOption(null);
    setShowSelect(true);
    onSelect(null);
  };

  const handleOpenCalendar = () => {
    setShowDatePicker(true);
    setSelectedOption(null);
    setShowSelect(false);
    setShowIsDate(false);

  };
  
  return (
    <div className="prefered-batch-calender">
      {showIsDate && classDate ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            height: "40px",
          }}
          onClick={handleOpenCalendar}
        >
          <span>{classDate.toLocaleDateString("en-GB")}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="react-datepicker__close-icon"
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
            }}
          >
          </button>
        </div>
      ) : (
        <>
          {showSelect && (
            <Select
              options={options}
              value={selectedOption}
              onChange={handleChange}
              isSearchable
              placeholder="Select or Search..."
              noOptionsMessage={() => (
                <div
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    color: "#007bff",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    setShowDatePicker(true);
                    setShowSelect(false);
                  }}
                >
                  {/*options.length === 0 ? "No Batch Available, Select Date" : "Select Date"*/}
                  No Batch Available, Select Date
                </div>
              )}
            />
          )}

          {showDatePicker && (
            <DatePicker
              selected={classDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Class Date"
              showPopperArrow={false}
              autoFocus
              onClickOutside={() => {
                setSelectedOption(null);
                setShowSelect(false);
                setShowIsDate(false);}}
              isClearable={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PreferedDropdown;