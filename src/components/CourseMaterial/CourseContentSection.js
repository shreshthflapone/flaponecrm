import React from "react";
import "./CourseMaterial.css";
import { FaRegClock } from "react-icons/fa";

const ContentSection = ({ sections }) => {
  let displayIndex = 1;
  return (
    <div>
     {sections.map((section, index) => {
      if (section.status !== "0") {
        let currentDisplayIndex = displayIndex; 
        displayIndex++;
    return (
      <div className="content-section pb24 mt24" key={index}>
        <div className="pt12 pb12 v-center jcsb">
          <p className="fw6 fs16 lh18 ls1">
            {currentDisplayIndex}. {section.topic}
          </p>
          <p className="v-center fc5 fs14">
            <FaRegClock className="mr4" />
            {section.duration.label}
          </p>
        </div>

        {/* Image Gallery Section */}
        <div className="image-gallery w100">
          {section.images
            .filter((image) => image.status === "1")
            .map((image, imgIndex) => (
              <div className="gallery-course w100 pb48" key={image.id}>
                <img
                  src={image.url}
                  loading="lazy"
                  alt={image.title || `Image ${imgIndex + 1}`}
                />
                <p className="box-center ls1 lh18 fw6 mt4">
                  {imgIndex + 1}. {image.title}
                </p>
              </div>
            ))}
        </div>

        {/* Text Content Section */}
        <div className="course-material-content mt24 course-left-right">
          <div dangerouslySetInnerHTML={{ __html: section.description }} />
        </div>
      </div>
    );
  }
  return null; // Return null if the condition is not met
})}

    </div>
  );
};

export default ContentSection;