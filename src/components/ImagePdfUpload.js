import React, { useState, useRef } from "react";
import "./ImageUpload.css";
import { compact } from "lodash";
import { useSelector } from "react-redux";
import axios from "axios";
import constant from "../constant/constant";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice.js";


const ImagePdfUpload = ({
  onImageUpload,
  acceptedFormats = "image/*,application/pdf,application/msword",
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf","application/msword"],
  defaultMessage = "Click here to upload",
  imgData,
  holdMarkRecord,
  instructorSubmitForm,
  setInstructorSubmitForm,
  filedName,
  title,
  complusory,
  editdata
}) => {
  
  const [selectedImage, setSelectedImage] = useState(editdata || {
    url: "",
    name: "",
    type: "",
  });
  const fileInputRef = useRef();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && allowedTypes.includes(file.type)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('data', JSON.stringify(holdMarkRecord));

      return axios.post(`${constant.base_url}/admin/mystudent_list.php?fun=upload_images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Auth-Id": user.auth_id
        },
      }).then(response => {
	      if (response.data.data.status === "0") {
            dispatch(logout());
            navigate("/login");
          } else {
            var uploadedUrl = response.data.data.image.url; 
            var uploadeNane = response.data.data.image.name; 

            selectedImage.url = uploadedUrl;
            selectedImage.name = uploadeNane;
            selectedImage.type = file.type;

            instructorSubmitForm[filedName] = uploadedUrl
            setInstructorSubmitForm({...instructorSubmitForm});
            setSelectedImage(selectedImage);
            onImageUpload(selectedImage);
          }

      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle error appropriately
      });
      
    } else {
      alert("Unsupported file type. Please upload an image or PDF.");
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDragEnter = (e) => e.preventDefault();
  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && allowedTypes.includes(file.type)) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedImage({ url: fileUrl, name: file.name, type: file.type });
      onImageUpload(file);
    } else {
      alert("Unsupported file type. Please upload an image or PDF.");
    }
  };

  return (
    <>
      <div className="v-center jcsb">
        <p className="fc15 fw6 fs14 ls1">{title}{complusory==1 && <span className="fc4">*</span>}</p>
        {selectedImage.url!='' && (
          <div className="v-center">
            <button
              onClick={() => window.open(selectedImage.url, "_blank")}
              className="ls1 fs14 fc1 tdu mr12 bg5 cp"
            >
              View
            </button>
          </div>
        )}
      </div>
      <div className="image-upload-container pr ofh">
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
            padding: selectedImage ? "8px" : "8px",
            backgroundColor: selectedImage ? "transparent" : "#f9f9f9",
            maxWidth: "320px",
            minWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            fontSize:"14px"
          }}
        >
          {selectedImage.name!="" ? (
            <>
              <div className="">
                <p>{selectedImage.name}</p>
              </div>
            </>
          ) : (
            <p className="box-center fs14">{defaultMessage}</p>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
      </div>
    </>
  );
};

export default ImagePdfUpload;
