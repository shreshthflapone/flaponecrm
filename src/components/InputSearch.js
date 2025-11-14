import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const InputSearch = ({ onSearch, placeholder }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      onSearch(searchValue);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.value === "" && searchValue !== "") {
      onSearch("");
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
    }
  };

  return (
    <div className="search-input df aic">
      <input
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        className="p8 brd1 outn br4 w100"
      />
      <button onClick={handleSearch} className="p6 bg1 fc3 br4 ml8 cp">
        <FiSearch className="fs20" />
      </button>
    </div>
  );
};

export default InputSearch;
