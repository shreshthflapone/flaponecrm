import React, { useState, useRef, useEffect } from "react";
import SingleDropdown from "../SingleDropdown";
import { BiLink } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
const Certificate = ({ onClose }) => {
  const [courseCertificate, setCourseCertificate] = useState("");
  const [student, setStudent] = useState("");
  const [url, setUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const completedCourse = [
    { label: "Small RPC", value: "1" },
    { label: "Medium RPC", value: "2" },
    { label: "Large RPC", value: "3" },
  ];
  const studentName = [
    { label: "Naveen", value: "1" },
    { label: "Rahul", value: "2" },
    { label: "Kamlesh", value: "3" },
  ];
  const generateURL = () => {
    setUrl(`https://certicate.com`);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setIsEditing(false);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <>
      <div className="refund-details form-group flx100">
        <SingleDropdown
          label="Completed Course"
          options={completedCourse}
          selectedOption={courseCertificate}
          onSelect={setCourseCertificate}
          search
        />
        <div className="mt24">
          <SingleDropdown
            label="Student Name"
            options={studentName}
            selectedOption={student}
            onSelect={setStudent}
            search
          />
        </div>
        {url && (
          <>
            <div className="share-package-form mt24">
              <div className="form-input df">
                <input
                  type="text"
                  value={url}
                  readOnly
                  placeholder="Payment Link URL"
                />
                <button
                  type="submit"
                  className="v-center ml16 mt8"
                  onClick={copyToClipboard}
                >
                  <span className="ls1">
                    {isCopied ? "Copied!" : "Copy link"}
                  </span>
                  <BiLink className="ml8 fs18" />
                </button>
              </div>
            </div>
          </>
        )}
        <div className="box-center mt32">
          <button
            className="bg9 pt8 pb8 pl12 pr12 fc3 cp fs14 ls1"
            onClick={generateURL}
          >
            Generate URL For Downlaoad
          </button>
          <div className="v-center ml8">
            Or <MdEmail className="fs36 cp ml8" />
          </div>
        </div>
      </div>
      <div className="button-container mt32 mylead-filters">
        <button type="button" className="btn-cancel clear" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="update-button btn-blue">
          Send
        </button>
      </div>
    </>
  );
};

export default Certificate;
