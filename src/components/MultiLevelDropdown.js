import React, { useState, useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import "./MultiLevelDropdown.css";

const MultiLevelDropdown = ({
  data,
  checkedItems,
  setCheckedItems,
  placeholder,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleParentChange = (parentIndex) => {
    const updatedCheckedItems = [...checkedItems];
    const parent = updatedCheckedItems[parentIndex];
    const isChecked = !parent.checked;

    if (expandedIndex === parentIndex) {
      // Only toggle the parent itself if expanded
      parent.checked = isChecked;
    } else {
      // Toggle parent and all children if not expanded
      parent.checked = isChecked;
      if (parent.children) {
        parent.children.forEach((child) => {
          child.checked = isChecked;
        });
      }
    }

    setCheckedItems(updatedCheckedItems);
  };

  const handleChildChange = (parentIndex, childIndex) => {
    const updatedCheckedItems = [...checkedItems];
    const parent = updatedCheckedItems[parentIndex];
    const child = parent.children[childIndex];

    child.checked = !child.checked;
    parent.checked = parent.children.every((child) => child.checked);

    setCheckedItems(updatedCheckedItems);
  };

  const handleAllChange = (parentIndex) => {
    const updatedCheckedItems = [...checkedItems];
    const parent = updatedCheckedItems[parentIndex];
    const isChecked = !parent.children.every((child) => child.checked);

    parent.children.forEach((child) => {
      child.checked = isChecked;
    });
    parent.checked = isChecked;

    setCheckedItems(updatedCheckedItems);
  };

  const getCheckedItems = () => {
    const checkedItemsList = [];
    checkedItems.forEach((parent) => {
      if (parent.checked) {
        checkedItemsList.push(parent.label);
      }
      if (parent.children) {
        parent.children.forEach((child) => {
          if (child.checked) {
            checkedItemsList.push(child.label);
          }
        });
      }
    });
    return checkedItemsList;
  };

  const checkedItemsList = getCheckedItems();
  const visibleCheckedItems = checkedItemsList.slice(0, 2);
  const extraCount = checkedItemsList.length - visibleCheckedItems.length;

  return (
    <div className="multi-level-dropdown" ref={dropdownRef}>
      <div className="dropbtn" onClick={toggleDropdown}>
        {checkedItemsList.length === 0 ? `${placeholder}` : null}
        <div className="chips v-center">
          {visibleCheckedItems.map((item, index) => (
            <span key={index} className="chip">
              {item}
            </span>
          ))}
          {extraCount > 0 && <span className="chip">+{extraCount}</span>}
        </div>
      </div>
      {dropdownVisible && (
        <div className="multi-level-dropdown-content">
          <ul>
            {checkedItems.map((parent, parentIndex) => (
              <li key={parent.value}>
                <div className="v-center jcsb">
                  <label className="v-center">
                    <input
                      type="checkbox"
                      checked={parent.checked}
                      onChange={() => handleParentChange(parentIndex)}
                    />
                    {parent.label}
                  </label>
                  {parent.children && (
                    <MdExpandMore
                      className="cp fs18"
                      onClick={() => toggleExpand(parentIndex)}
                    />
                  )}
                </div>
                {expandedIndex === parentIndex && parent.children && (
                  <ul className="children">
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          className="child-checkbox"
                          checked={parent.children.every(
                            (child) => child.checked
                          )}
                          onChange={() => handleAllChange(parentIndex)}
                        />
                        All
                      </label>
                    </li>
                    {parent.children.map((child, childIndex) => (
                      <li key={child.value}>
                        <label>
                          <input
                            type="checkbox"
                            className="child-checkbox"
                            checked={child.checked}
                            onChange={() =>
                              handleChildChange(parentIndex, childIndex)
                            }
                          />
                          {child.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiLevelDropdown;
