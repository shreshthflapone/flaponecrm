import React, { useState, useRef } from "react";
import "../components/ImageUpload.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import axios from "axios";
import constant from "../constant/constant";

const ImageUpload = ({
  setWorkImage,
  blogDetailData,
  setBlogDetailData,
  setMainCoverImageUrl,
}) => {
  const user = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(
    blogDetailData &&
      blogDetailData.coverimage !== undefined &&
      blogDetailData.coverimage !== ""
      ? { url: blogDetailData.coverimage, name: blogDetailData.title }
      : { url: "", name: "" }
  );
  const fileInputRef = useRef();
  //setWorkImage(blogDetailData.coverimage!==undefined && blogDetailData.coverimage!==''?blogDetailData.coverimage:"");

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!isValidImageType(file.type)) {
        alert("Please select a valid image file.");
        return;
      }

      // Set the selected image state
      setSelectedImage({
        url: "",
        name: file.name,
      });
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post(
          `${constant.base_url}/admin/blog_detail.php?fun=upload_images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Auth-Id": user.auth_id,
            },
          }
        )
        .then((response) => {
          let uploadedUrl = response.data.data.image.url;
          selectedImage.url = uploadedUrl;
          setMainCoverImageUrl(uploadedUrl);
          if (blogDetailData) {
            blogDetailData.coverimage = uploadedUrl;
            setBlogDetailData(blogDetailData);
          }
          setSelectedImage(selectedImage);
          setWorkImage(selectedImage);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error
        });
    }
  };

  const isValidImageType = (fileType) => {
    const acceptedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
    ]; // Add more types as needed
    return acceptedImageTypes.includes(fileType);
  };
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteButtonClick = () => {
    setSelectedImage({ url: "", name: "" });
    setWorkImage(null);
    setMainCoverImageUrl("");
    if (blogDetailData) {
      blogDetailData.coverimage = "";
      setBlogDetailData(blogDetailData);
    }
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
          border: selectedImage.url ? "2px solid #ccc" : "2px dashed #ccc",
          padding: selectedImage.url ? "20px" : "20px",
          backgroundColor: selectedImage.url ? "transparent" : "#f9f9f9",
          maxWidth: "320px",
          minWidth: "100%",
          height: selectedImage.url ? "160px" : "160px",
          display: selectedImage.url ? "flex" : "flex",
          alignItems: selectedImage.url ? "center" : "center",
          justifyContent: selectedImage.url ? "center" : "center",
        }}
      >
        {selectedImage.url ? (
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
      />
      {selectedImage.url && (
        <button onClick={handleDeleteButtonClick} className="df mt8 ls1">
          Delete
        </button>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ImageUpload;
