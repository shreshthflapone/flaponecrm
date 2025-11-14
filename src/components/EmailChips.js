import React, { useState, useRef, useEffect } from "react";

const EmailChips = ({
  email,
  onAddChip,
  onDeleteChip,
  isDisabled,
  editedMember,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newEmail = inputValue.trim();
      if (newEmail) {
        onAddChip(newEmail);
        setInputValue("");
      }
    }
  };

  const handleChipDelete = (index) => {
    onDeleteChip(index);
  };
  useEffect(() => {
    inputRef.current.focus();
  }, [email]);
  return (
    <div style={{ position: "relative" }}>
      {!editedMember &&
        email.map((e, index) => (
          <div key={index} className="chip v-center">
            {e}
            <span
              className="chip-delete pl4 cp"
              onClick={() => handleChipDelete(index)}
            >
              &times;
            </span>
          </div>
        ))}
      <input
        type="email"
        placeholder={
          email.length > 0 ? "" : "Enter email address separated by enter"
        }
        autoComplete="off"
        value={editedMember ? editedMember.email : inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className={`${isDisabled ? "disabled-input bg6" : ""}`}
        disabled={isDisabled}
        ref={inputRef}
      />
    </div>
  );
};

export default EmailChips;
