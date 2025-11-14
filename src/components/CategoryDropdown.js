import React, { useState } from "react";

const CategoryDropdown = ({ categories, onChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
    // Notify parent component of selected categories
    onChange(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId]
    );
  };

  return (
    <div className="category-dropdown">
      {categories.map((category) => (
        <div key={category.id}>
          <input
            type="checkbox"
            id={`category-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onChange={() => handleCategoryChange(category.id)}
          />
          <label htmlFor={`category-${category.id}`}>{category.name}</label>
          {category.children && category.children.length > 0 && (
            <div className="subcategory">
              {category.children.map((child) => (
                <div key={child.id}>
                  <input
                    type="checkbox"
                    id={`child-${child.id}`}
                    checked={selectedCategories.includes(child.id)}
                    onChange={() => handleCategoryChange(child.id)}
                  />
                  <label htmlFor={`child-${child.id}`}>{child.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryDropdown;
