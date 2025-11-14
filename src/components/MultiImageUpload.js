import React, { useState, useRef, useEffect } from "react";
import "../components/MultiImageUpload.css";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import axios from "axios";
import constant from "../constant/constant";
import SmallLoader from "./SmallLoader";

const MultiImageUpload = ({
  id,
  setWorkImages,
  blogDetailData,
  blogsubdata,
  subtype,
  setSections,
  setBlogDetailData,
  setImageList,
  subsectionposition,
  sections,
}) => {
  const user = useSelector((state) => state.auth);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef();

  const debouncedSetWorkImages = useRef(
    debounce((images) => {
      setWorkImages(id, images);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedSetWorkImages(selectedImages.map((image) => image));
  }, [selectedImages]);

  useEffect(() => {
    if (
      subtype &&
      blogsubdata &&
      blogsubdata.images !== undefined &&
      blogsubdata.images.length > 0
    ) {
      setSelectedImages(blogsubdata.images);
    }
    if (!subtype && blogDetailData && blogDetailData.images !== undefined) {
      setSelectedImages(blogDetailData.images);
    }
  }, [blogDetailData, subtype]);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"]; // List of image MIME types
    const newImages = files
      .filter((file) => imageTypes.includes(file.type)) // Filter only image files
      .map((file, index) => {
        return {
          id: Date.now() + index + 1 + "_new",
          url: "",
          name: file.name,
          position: selectedImages.length + index + 1,
          status: "1",
          file: file,
        };
      });
    newImages.forEach((image) => {
      const formData = new FormData();
      formData.append("file", image.file);
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
          let uploadedUrl = response.data.data.image.url; // Assuming the response has the URL
          image.url = uploadedUrl;
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error
        });
    });

    if (!subtype) {
      // blogDetailData.images.push(newImages[0]);
      // setBlogDetailData(blogDetailData);
      setBlogDetailData((prevData) => {
        const updatedImages = [...prevData.images, ...newImages];
        setImageList(updatedImages); // Update imageList at the same time
        return {
          ...prevData,
          images: updatedImages,
        };
      });
    } else {
      let updatedImages = [...blogsubdata.images, ...newImages];
      sections[subsectionposition]["images"] = updatedImages;
      setSections([...sections]);
    }
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleEditImagePosition = (index, newPosition) => {
    const updatedList = selectedImages.map((image, pos) => {
      if (parseInt(pos) === index) {
        return { ...image, position: parseInt(newPosition ? newPosition : 1) };
      }
      return image;
    });
    setSelectedImages([...updatedList]);
    if (!subtype) {
      blogDetailData.images = updatedList;
      setBlogDetailData(blogDetailData);
      setImageList(blogDetailData.images);
    } else {
      sections[subsectionposition]["images"] = updatedList;
      setSections([...sections]);
    }
  };
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteButtonClick = (id) => {
    const updatedList = selectedImages.map((image) => {
      if (image.id === id) {
        return { ...image, status: "0" };
      }
      return image;
    });
    setSelectedImages([...updatedList]);
    if (!subtype) {
      blogDetailData.images = updatedList;
      setBlogDetailData(blogDetailData);
      setImageList(blogDetailData.images);
    } else {
      sections[subsectionposition]["images"] = updatedList;
      setSections([...sections]);
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
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
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
          border: "2px dashed #ccc",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          minWidth: "100%",
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="box-center">Click or drag & drop images here</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <div className="image-lists">
        {selectedImages.map(
          (image, index) =>
            image.status === "1" && (
              <div className="v-center fdc mr12">
                <div key={image.name} className="image-wrapper">
                  {image.url ? (
                    <img src={image.url} alt="Selected" />
                  ) : (
                    <div className="box-center mb12">
                      <SmallLoader className={"mb12"} />
                    </div>
                  )}
                  <div className="image-overlay">
                    <p>{image.name}</p>
                    <button
                      onClick={() => handleDeleteButtonClick(image.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="input-multi-pos">
                  <input
                    type="number"
                    id={`position-${index}`}
                    name={`position-${index}`}
                    placeholder="Position"
                    min={1}
                    value={image.position} // Bind input value to image.position
                    onChange={(e) =>
                      handleEditImagePosition(index, e.target.value)
                    }
                    autoComplete="off"
                  />
                </div>
              </div>
            )
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default MultiImageUpload;
