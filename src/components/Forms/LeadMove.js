import React, { useState, useRef, useEffect } from "react";
import SingleDropdown from "../SingleDropdown";

const LeadMove = ({ onClose, member }) => {
  const [oldAgent, setOldAgent] = useState("");
  const [newAgent, setNewAgent] = useState("");
  const newAgentOptions = [
    { label: "Ranvijay", value: "Ranvijay" },
    { label: "Nand Jha", value: "Nand Jha" },
  ];
  const isInputDisabled = !!member;
  useEffect(() => {
    if (member) {
      setOldAgent(member.name || "");
    } else {
      setOldAgent("");
      setNewAgent("");
    }
  }, [member]);
  return (
    <>
      <div className="add-team-details">
        <div className="mt16 input-design">
          <label className="fc15 fw6 fs14 ls1">Agent (OLD)</label>
          <input
            type="text"
            placeholder="Old Agent"
            autoComplete="off"
            value={oldAgent}
            readOnly
            className="disabled-input bg6"
            disabled={isInputDisabled}

          />
        </div>
        <div className="mt16">
          <SingleDropdown
            label="Agent (NEW)"
            options={newAgentOptions}
            selectedOption={newAgent}
            onSelect={setNewAgent}
          />
        </div>
      </div>
      <div className="button-container mt32">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="update-button btn-blue">
          Save
        </button>
      </div>
    </>
  );
};

export default LeadMove;
