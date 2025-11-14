import React, { useEffect, useState } from "react";

const CourseDropdown = ({ courses, selectedCategories }) => {
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const allCourses = courses.flatMap((category) => category.courses);

    const filtered =
      selectedCategories.length === 0
        ? allCourses
        : allCourses.filter((course) =>
            selectedCategories.includes(course.categoryId)
          );

    setFilteredCourses(filtered);
  }, [courses, selectedCategories]);

  return (
    <div className="course-dropdown">
      <label htmlFor="courseDropdown">Select Course:</label>
      <select id="courseDropdown">
        <option value="">Select Course</option>
        {filteredCourses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseDropdown;
