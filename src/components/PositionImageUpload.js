import React, { useState, useRef, useEffect } from "react";
import "../components/PositionImageUpload.css";
import { debounce } from "lodash";
import axios from "axios";
import constant from "../constant/constant.js";
import { useSelector } from "react-redux";
// import SmallLoader from "./SmallLoader";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice.js";
import SmallLoader from "./SmallLoader.js";





const PositionImageUpload = ({ id, setWorkImages, mediaType,toast,allimages}) => {
  const user = useSelector((state) => state.auth);
  const [selectedMedia, setSelectedMedia] = useState(allimages.length > 0 ? allimages:[]);
  const fileInputRef = useRef();
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
  const videoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const debouncedSetWorkImages = useRef(
    debounce((media) => {
      setWorkImages(id, media);
    }, 500)
  ).current;

  useEffect(() => {
    if(selectedMedia.length>0){
      debouncedSetWorkImages(
        selectedMedia
          .map(({ file, position, title, url, name, status,id,type}) => ({
            file,
            position,
            title,
            url,
            name,
            status,
            id,
            type,
          }))
      );
    }
      
  }, [selectedMedia, debouncedSetWorkImages]);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file, index) => {
      // Check if the file type matches the allowed media type
      const isValidImage = mediaType === 'image' && imageTypes.includes(file.type);
      const isValidVideo = mediaType === 'video' && videoTypes.includes(file.type);
      
      if (isValidImage || isValidVideo) {
        return {
          id: Date.now() + index + 1 + "_new",
          url: "",
          name: file.name,
          file,
          type:file.type,
          type: isValidImage ? "image" : "video",
          position: selectedMedia.length + index + 1,
          title: "",
          status: "1",
        };
      } else {
        toast(`Invalid file type: ${file.type}. Please upload a ${mediaType}.`);
        return null; // Return null for invalid files
      }
    }).filter(media => media !== null); // Filter out null values
  
    // Create an array of promises for each upload
    const uploadPromises = newMedia.map(image => {
      const formData = new FormData();
      formData.append('file', image.file);
      formData.append('type', mediaType);
      
      return axios.post(`${constant.base_url}/admin/subject_topic_detail.php?fun=upload_media`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Auth-Id": user.auth_id
        },
      }).then(response => {
	      if (response.data.data.status === "0") {
            toast.error(response.data.data.msg);
            dispatch(logout());
            navigate("/login");
          } else {
            let uploadedUrl = response.data.data.image.url; // Assuming the response has the URL
            image.url = uploadedUrl; // Update image object with URL
          }

      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle error appropriately
      });
    });
  
    // Wait for all uploads to finish before updating state
    Promise.all(uploadPromises)
      .then(() => {
        setSelectedMedia((prevMedia) => [...prevMedia, ...newMedia]);
      })
      .catch(error => {
        console.error('Error during uploads:', error);
        // Handle overall error if needed
      });
  };
  

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteButtonClick = (id) => {
    const updatedMedia = selectedMedia.map((media) => {
      if (media.id === id) {
        return { ...media, status: "0" };
      }
      return media;
    });
    setSelectedMedia([ ...updatedMedia]);
  };

  const handlePositionChange = (e, id) => {
    const { value } = e.target;

    // Check if the input value is a valid number (using regex)
    if (!/^\d*$/.test(value)) {
        return; // Ignore invalid input
    }

    const updatedMedia = selectedMedia.map((media) => {
        if (media.id === id) {
            return { ...media, position: value };
        }
        return media;
    });

    setSelectedMedia(updatedMedia);
};


  const handleTitleChange = (e, id) => {
    const { value } = e.target;

    // Update the selected media based on the id
    const updatedMedia = selectedMedia.map((media) => {
      if (media.id === id) {
        // Return a new object with the updated title
        return { ...media, title: value };
      }
      // Return the original media object if the id does not match
      return media;
    });

    // Set the state with the updated media array
    setSelectedMedia(updatedMedia);
};


  const handleViewButtonClick = (mediaUrl) => {
    window.open(mediaUrl, "_blank");
  };

  return (
    <div className="media-upload-container">
      <div
        className="media-preview"
        onDragOver={(e) => e.preventDefault()}
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
        <p className="box-center">{`Click to upload the ${mediaType === "image" ? "images" : "videos"} here`}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={mediaType === "image" ? "image/*" : "video/*"}
        multiple
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />

      <div className="df fww">
        {selectedMedia
          .filter((media) => media.status === "1")
          .map((media, index) => (
            <div key={index} className="v-center fdc mr12 brd1 p12 pos-img-list">
              <div className="pos-image-wrapper">
                {media.type === "image" ? (
                  media.url ? (
                    <img src={media.url} alt="Selected" />
                  ) : (
                    <div className="box-center mb12">
                        <SmallLoader className={"mb12"} />
                    </div>
                  )
                ) : (
                  <video width="160" height="160" controls>
                     media.url ? (
                      <source src={media.url} type={media.type} />
                  ) : (
                    <div className="box-center mb12">
                        <SmallLoader className={"mb12"} />
                    </div>
                  )
                  Your browser does not support the video tag.
                  </video>
                )}
                <div className="image-overlay">
                  <p>{media.title}</p>
                </div>
              </div>

              <div className="df jcse w100 mb8 ml10 mr10 view-del">
                <p
                  onClick={() => handleViewButtonClick(media.url)}
                  className="fc2 fs14 cp"
                >
                  View
                </p>
                <p
                  onClick={() => handleDeleteButtonClick(media.id)}
                  className="fc4 fs14 cp"
                >
                  Delete
                </p>
              </div>

              <div className="v-center brd-t2">
                <div className="input-fields mr16 pt8">
                  <input
                    type="text"
                    id={`title-${media.id}`}
                    name="title"
                    placeholder="Title"
                    value={media.title}
                    onChange={(e) => handleTitleChange(e, media.id)}
                    autoComplete="off"
                  />
                </div>

                <div className="input-fields-img-pos pt8">
                  <input
                    type="text"
                    id={`position-${media.id}`}
                    name="position"
                    value={media.position}
                    onChange={(e) => handlePositionChange(e, media.id)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PositionImageUpload;
