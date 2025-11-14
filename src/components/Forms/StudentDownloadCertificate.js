import React, {useState, useEffect } from 'react'
import Popup from '../Popup/Popup';
import axios from "axios";
import { toast } from 'react-toastify';
import SingleDropdown from '../SingleDropdown';

function StudentDownloadCertificate({id,constant,user,userDetail,checkingDownloadCertificateSts,setCheckingDownloadCertificateSts}) {
   const [showCertificatePopup, setShowCertificatePopup] = useState(false);
   const [certificateCourseList, setCertificateCourseList] = useState([]);
   const [selectedCertificateCourseId, setSelectedCertificateCourseId] = useState({});
   const [certificateRollNoList, setCertificateRollNoList] = useState([]);
   const [registrationRollNoList, setRegistrationRollNoList] = useState([]);
   const [selectedRegistrationRollNo, setSelectedRegistrationRollNo] = useState("");
   const [selectedCertificateRollNo, setSelectedCertificateRollNo] = useState("");
   const [certificateFormStatus, setCertificateFormStatus] = useState(false);

useEffect(() => {
  if(checkingDownloadCertificateSts){
    checkingDownloadCertificate();
 }
 
},[checkingDownloadCertificateSts])


    const closeCertificatePopup = () => {
    setCertificateCourseList([]);
    setSelectedCertificateCourseId({});
    setSelectedCertificateRollNo("");
    setCertificateFormStatus(false);
    setShowCertificatePopup(false);
   }

   const handleSelectedCertificateCourseId = (option) => {
       setSelectedCertificateCourseId(option);
       const rollNoList = registrationRollNoList[option?.value] || [];
   
       if (rollNoList.length === 1) {
         setSelectedRegistrationRollNo(rollNoList[0].value);
       } else {
         setSelectedRegistrationRollNo("");
       }
     };

     const checkingDownloadCertificate = async () => {
        setCheckingDownloadCertificateSts(false);
       axios({
         method: "post",
         url: `${constant.base_url}/admin/mylead_detail.php?fun=checkDownloadCertificate`,
         headers: { "Auth-Id": user.auth_id },
         data: {
           user_id: userDetail.user_id,
         },
       }).then(function (response) {
         const resData = response.data.data;
         if(response.data.data.status === "1") {
           const courseList = resData.data.course_list;
           const roll_no_list = resData.data.roll_no_list;
           setCertificateCourseList(courseList);
           setCertificateRollNoList(roll_no_list);
           if (courseList.length === 1) {
             const selectedCourse = courseList[0];
             setSelectedCertificateCourseId(selectedCourse);
   
             const rollNoList = resData.data.roll_no_list[selectedCourse.value] || [];
             if (rollNoList.length === 1) {
               setSelectedCertificateRollNo(rollNoList[0].value);
             } else {
               setSelectedCertificateRollNo("");
             }
           } else {
             setSelectedCertificateCourseId({});
             setSelectedCertificateRollNo("");
           }
           setShowCertificatePopup(true);
         } else {
           toast.warning(response.data.data.msg);
         }
       }).catch(function (error) {
         console.error("Error during login:", error);
       });
     }


       const handleCertificateDownloadClick = () => {
         if (!selectedCertificateCourseId || !selectedCertificateCourseId.value) {
           toast.warning("Please select a course.");
           return;
         }
         if (!selectedCertificateRollNo || selectedCertificateRollNo.trim() === "") {
           toast.warning("Please enter registration id.");
           return;
         }
         if (selectedCertificateCourseId && selectedCertificateRollNo) {
           setCertificateFormStatus(true);
           axios({
             method: "post",
             url: `${constant.base_url}/admin/mylead_detail.php?fun=downloadCertificatePdf`,
             headers: { "Auth-Id": user.auth_id },
             data: {
               user_id: userDetail.user_id,
               course_id: selectedCertificateCourseId.value,
               roll_no: selectedCertificateRollNo,
             },
           }).then(async function (response) {
             const resData = response.data.data;
             if (resData.status === "1" && resData.pdf_link) {
               //window.open(resData.pdf_link, "_blank");
               const response = await fetch(resData.pdf_link);
               if (!response.ok) {
                 console.error('Network response was not ok.');
                 return;
               }
               const blob = await response.blob();
               const url = window.URL.createObjectURL(blob);
               const urlParts = response.url.split('/');
               const filename = urlParts[urlParts.length - 1] || 'download.pdf';
     
               const anchor = document.createElement('a');
               anchor.href = url;
               anchor.download = filename;
               document.body.appendChild(anchor);
               anchor.click();
               document.body.removeChild(anchor);
               window.URL.revokeObjectURL(url);
               closeCertificatePopup();
             } else {
               toast.error(resData.msg);
             }
             setCertificateFormStatus(false);
           }).catch(function (error) {
             console.error("Error during login:", error);
           });
         } else {
           toast.error("Please select course and roll no.");
         }
       }

  return (
      <>
      {showCertificatePopup && (
          <div className="log-popup">
            <Popup title="Download Certificate" onClose={closeCertificatePopup}>
             
              {certificateCourseList?.length > 0 && (
                <div className="batch-options">
                  <SingleDropdown
                    label="Select Courses"
                    options={certificateCourseList}
                    selectedOption={selectedCertificateCourseId}
                    onSelect={handleSelectedCertificateCourseId}
                    compulsory={<span className="fc4">*</span>}
                    isReadOnly={certificateCourseList.length === 1}
                  />
                </div>
              )}
              {selectedCertificateCourseId?.value && (
                <div className="batch-options mt16">
                  <div className="form-group-settings cm-fr">
                    <p className="fc15 fw6 fs14 ls1">
                      Enter Registration Id <span className="fc4">*</span>
                    </p>
                    {certificateRollNoList[selectedCertificateCourseId.value]?.length === 1 ? (
                      <input
                        type="text"
                        name="registration_id"
                        placeholder="Enter Your Registration Id"
                        value={certificateRollNoList[selectedCertificateCourseId?.value]?.[0]?.value || ""}
                        readOnly
                        style={{
                          backgroundColor: id !== undefined ? "#f9f9f9" : "",
                          cursor: id !== undefined ? "not-allowed" : "",
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        name="roll_no"
                        placeholder="Enter Your Registration Id"
                        value={selectedCertificateRollNo}
                        onChange={(e) => setSelectedCertificateRollNo(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}             
              <div className="popup-buttons mb24 df jcc">
                <button 
                  onClick={() => {
                    if (!certificateFormStatus) {
                      handleCertificateDownloadClick();
                    }
                  }}
                  className={`update-button  box-center mr8 ${
                    certificateFormStatus ? "disabled-input bg10 fc5" : "btn-blue"
                  }`}
                  disabled={certificateFormStatus}
                >Download</button>
                <button onClick={closeCertificatePopup} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </Popup>
          </div>
      )}
      </> 
  )
}

export default StudentDownloadCertificate
