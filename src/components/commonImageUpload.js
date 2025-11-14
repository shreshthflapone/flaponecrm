import React, { useState, useRef, useEffect } from "react";
import "../components/commonImageUpload.css";

const CommonImageUpload = ({
  setWorkImage,
  imgData,
  uploadImg,
  delstatus,
  disabled,
}) => {
  let imgobj;

  if (imgData !== "") {
    imgobj = {
      url: imgData.IMAGEURL,
      name: imgData.IMAGE,
    };
  } else {
    imgobj = null;
  }

  const [selectedImage, setSelectedImage] = useState(imgobj);

  const fileInputRef = useRef();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage({
        url: URL.createObjectURL(file),
        name: file.name,
      });
      // Set the selected image in the parent component using the prop
      setWorkImage(file);

      uploadImg(file);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteButtonClick = () => {
    setSelectedImage(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage({
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className="image-preview"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadButtonClick}
        style={{
          cursor: "pointer",
          border: selectedImage ? "2px solid #ccc" : "2px dashed #ccc",
          padding: selectedImage ? "20px" : "20px",
          backgroundColor: selectedImage ? "transparent" : "#f9f9f9",
          maxWidth: "320px",
          minWidth: "100%",
          height: selectedImage ? "160px" : "160px",
          display: selectedImage ? "flex" : "flex",
          alignItems: selectedImage ? "center" : "center",
          justifyContent: selectedImage ? "center" : "center",
        }}
      >
        {selectedImage && selectedImage.url ? (
          <>
            <img src={selectedImage.url} alt="Selected" />
            <div className="image-overlay">
              <p>{selectedImage.name}</p>
            </div>
          </>
        ) : (
          <p className="box-center">Click or drag & drop an image here</p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      {delstatus && selectedImage && (
        <button onClick={handleDeleteButtonClick} className="df mt8 ls1">
          Delete
        </button>
      )}
    </div>
  );
};

export default CommonImageUpload;
