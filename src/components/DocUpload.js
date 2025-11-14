import React, { useState, useRef } from "react";
import "./DocUpload.css";
import pdf from "../assets/pdf.png";


const DocUpload = ({
  onImageUpload,
  acceptedFormats = "image/*,application/pdf",
  allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ],
  defaultMessage = "Click here to upload",
  imgData,
  imgstatus,
  toast,
  warnmsg,
  handledocStatusChange,
  disabled,
  imagedoctrel,
  admin,
  comment
}) => {
  const [selectedImage, setSelectedImage] = useState(imgData || null);
  const fileInputRef = useRef();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedImage({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      });
      onImageUpload(file,imagedoctrel);
    } else {
      toast.error(warnmsg);
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
    <div className="image-upload-container pr ofh">
       {imgstatus==="1" && (
         <p className="error-message mb8"><b>Rejected Reason:</b> {comment}</p>
        )}
      <div
        className="image-preview"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadButtonClick}
        style={{
          cursor: "pointer",
          border: selectedImage?.url ? "2px solid #ccc" : "2px dashed #ccc",
          padding: selectedImage?.url ? "20px" : "20px",
          backgroundColor: selectedImage?.url ? "transparent" : "#f9f9f9",
          maxWidth: "320px",
          minWidth: "100%",
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selectedImage?.url ? (
          <>
            {selectedImage.type === "application/pdf" || selectedImage.type === "pdf"  ? (
              <img
                src={pdf}
                alt={selectedImage.name}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            )}
           
            {imgstatus === "4" ? (
              <div className="status-img pa bg-green badge-status badge box-center">
                Approved
              </div>
            ) : imgstatus === "3" ? (
              <div className="status-img pa bg-orange  badge-status badge box-center">
                Pre Aproved
              </div>
            ) : imgstatus ==="2" ? (
              <div className="status-img pa bg-orange badge-status badge box-center">
                Pending
              </div>
            ) : imgstatus ==="1" ? (
              <div className="status-img pa bg-red badge-status badge box-center">
                Rejected
              </div>
            ):(
              <div className="status-img pa bg-orange badge-status badge box-center">
                Pending
              </div>
            )}

            <div className="image-overlay">
              <p>{selectedImage.name}</p>
            </div>
          </>
        ) : (
          <p className="box-center">{defaultMessage}</p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      
        <div className="w100 df jcc mt8">
         {selectedImage && admin===1 && <label className="radio-label cp mr10">
            <input
              type="radio"
              value="4"
              checked={imgstatus === "4"}
              className="mr4"
            />
            Approve
          </label>}
          {selectedImage && admin===1 &&  <label className="radio-label cp">
            <input
              type="radio"
              value="1"
              checked={imgstatus === "1"}
              className="mr4"
            />
            Reject
        </label>}
        {/* <label className="radio-label cp ml10">
            <input
              type="radio"
              value="3"
              checked={imgstatus === "3"}
              onChange={(e) => handledocStatusChange(imagedoctrel, "doc_verify_status", e.target.value)}
              className="mr4"
            />
            Hold Approve
        </label> */}
        {selectedImage &&  <button
            onClick={() => window.open(selectedImage.url, "_blank")}
            className="ls1 fs14 fc1 tdu ml12"
          >
            View
          </button>}

          {/* Uncomment this if you want to enable the Remove button */}
          {/* <button
            onClick={() => {
              setSelectedImage(null);
              onImageUpload(null); 
            }}
            className="ls1 tdu fs14"
          >
            Remove
          </button> */}
        </div>
      
    </div>
  );
};

export default DocUpload;
