import React, {useState, useEffect } from 'react'
import Popup from '../Popup/Popup';
import axios from "axios";
import { toast } from 'react-toastify';
import SingleDropdown from '../SingleDropdown';

function StudentRegistrationForm({id,constant,user,userDetail,checkingDownloadRegFormSts,setCheckingDownloadRegFormSts}) {

  const [showRegFormPopup, setShowRegFormPopup] = useState(false);
  const [registrationCourseList, setRegistrationCourseList] = useState([]);
  const [selectedRegistrationCourseId, setSelectedRegistrationCourseId] = useState({});
  const [registrationRollNoList, setRegistrationRollNoList] = useState([]);
  const [selectedRegistrationRollNo, setSelectedRegistrationRollNo] = useState("");
  const [registrationFormStatus, setRegistrationFormStatus] = useState(false);

useEffect(() => {
 if(checkingDownloadRegFormSts){
    checkingDownloadRegForm();
 }
}, [checkingDownloadRegFormSts])


const closeRegistrationPopup = () => {
    setRegistrationCourseList([]);
    setSelectedRegistrationCourseId({});
    setSelectedRegistrationRollNo("");
    setShowRegFormPopup(false);
    setRegistrationFormStatus(false);
  }

    const checkingDownloadRegForm = async () => {
      setCheckingDownloadRegFormSts(false);
      axios({
        method: "post",
        url: `${constant.base_url}/admin/mylead_detail.php?fun=checkDownloadRegForm`,
        headers: { "Auth-Id": user.auth_id },
        data: {
          user_id: userDetail.user_id,
        },
      }).then(function (response) {
        const resData = response.data.data;
        if(response.data.data.status === "1") {
          const courseList = resData.data.course_list;
          const roll_no_list = resData.data.roll_no_list;
          setRegistrationCourseList(courseList);
          setRegistrationRollNoList(roll_no_list);
          if (courseList.length === 1) {
            const selectedCourse = courseList[0];
            setSelectedRegistrationCourseId(selectedCourse);
  
            const rollNoList = resData.data.roll_no_list[selectedCourse.value] || [];
            if (rollNoList.length === 1) {
              setSelectedRegistrationRollNo(rollNoList[0].value);
            } else {
              setSelectedRegistrationRollNo("");
            }
          } else {
            setSelectedRegistrationCourseId({});
            setSelectedRegistrationRollNo("");
          }
          setShowRegFormPopup(true);
  
        } else {
          toast.error(resData.message);
        }
      }).catch(function (error) {
        console.error("Error during login:", error);
      });
    }

    const handleSelectedRegistrationCourseId = (option) => {
        setSelectedRegistrationCourseId(option);
        const rollNoList = registrationRollNoList[option?.value] || [];
    
        if (rollNoList.length === 1) {
          setSelectedRegistrationRollNo(rollNoList[0].value);
        } else {
          setSelectedRegistrationRollNo("");
        }
      };
    
      
      const handleDownloadClick = () => {
        if (!selectedRegistrationCourseId || !selectedRegistrationCourseId.value) {
          toast.warning("Please select a course.");
          return;
        }
        
        if (!selectedRegistrationRollNo || selectedRegistrationRollNo.trim() === "") {
          toast.warning("Please enter registration id.");
          return;
        }
        if (selectedRegistrationCourseId && selectedRegistrationRollNo) {
          setRegistrationFormStatus(true);
          axios({
            method: "post",
            url: `${constant.base_url}/admin/mylead_detail.php?fun=downloadRegForm`,
            headers: { "Auth-Id": user.auth_id },
            data: {
              user_id: userDetail.user_id,
              course_id: selectedRegistrationCourseId.value,
              roll_no: selectedRegistrationRollNo,
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
             closeRegistrationPopup();
            } else {
              toast.error(resData.message);
            }
            setRegistrationFormStatus(false);
          }).catch(function (error) {
            console.error("Error during login:", error);
          });
        } else {
          toast.error("Please select course and roll no.");
        }
      }

  return (
    <>
     {showRegFormPopup && (
        <div className="log-popup">
        <Popup title="Download Registration Form" onClose={closeRegistrationPopup}>
            
            {registrationCourseList?.length > 0 && (
            <div className="batch-options">
                <SingleDropdown
                label="Select Courses"
                options={registrationCourseList}
                selectedOption={selectedRegistrationCourseId}
                onSelect={handleSelectedRegistrationCourseId}
                compulsory={<span className="fc4">*</span>}
                isReadOnly={registrationCourseList.length === 1}
                />
            </div>
            )}
            {selectedRegistrationCourseId?.value && (
            <div className="batch-options mt16">
                <div className="form-group-settings cm-fr">
                <p className="fc15 fw6 fs14 ls1">
                    Enter Registration Id <span className="fc4">*</span>
                </p>
                {registrationRollNoList[selectedRegistrationCourseId.value]?.length === 1 ? (
                    <input
                    type="text"
                    name="registration_id"
                    placeholder="Enter Your Registration Id"
                    value={registrationRollNoList[selectedRegistrationCourseId?.value]?.[0]?.value || ""}
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
                    value={selectedRegistrationRollNo}
                    onChange={(e) => setSelectedRegistrationRollNo(e.target.value)}
                    />
                )}
                </div>
            </div>
            )}             
            <div className="popup-buttons mb24 df jcc">
            <button 
                onClick={() => {
                if (!registrationFormStatus) {
                    handleDownloadClick();
                }
                }}
                className={`update-button  box-center mr8 ${
                registrationFormStatus ? "disabled-input bg10 fc5" : "btn-blue"
                }`}
                disabled={registrationFormStatus}
            >Download</button>
            <button onClick={closeRegistrationPopup} className="btn-cancel">
                Cancel
            </button>
            </div>
        </Popup>
        </div>
     )}
     </>
  )
}

export default StudentRegistrationForm
