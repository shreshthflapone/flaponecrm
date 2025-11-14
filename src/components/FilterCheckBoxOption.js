import React, { useState } from "react";
import "./FilterCheckBoxOption.css";

const FilterCheckBoxOption = ({
  label,
  options,
  selectedOptions,
  onChange,
  multiSelect = true,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const visibleOptions =
    options.length === 7 ? options : showMore ? options : options.slice(0, 6);

  const handleOptionChange = (value) => {
    if (multiSelect) {
      // For multi-select, toggle the selection
      const updatedOptions = selectedOptions.includes(value)
        ? selectedOptions.filter((item) => item !== value)
        : [...selectedOptions, value];
      onChange(updatedOptions);
    } else {
      // For single select, replace the selection
      const updatedOptions = selectedOptions.includes(value) ? [] : [value];
      onChange(updatedOptions);
      //onChange([value]);
    }
  };

  return (
    <div className="filter-option">
      <p className="fs14 fw6 fc14 pt8 pt16 pb16">{label}</p>

      <div className="filter-checkboxes df fww">
        {visibleOptions.map((option) => (
          <label
            key={option.value}
            className="checkbox-label-buy-lead ls1 fc5 fs14 cp"
          >
            <input
              type="checkbox"
              name="filterOption"
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={() => handleOptionChange(option.value)}
              className="custom-checkbox-buy-lead"
            />
            {option.label}
          </label>
        ))}
        {options.length > 6 && options.length !== 7 && (
          <div
            className="show-more fc22 fs14 cp ls1 mt4"
            onClick={toggleShowMore}
          >
            {showMore ? "Show Less" : `+ ${options.length - 6} More`}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCheckBoxOption;
