import React, { useState, useEffect, useRef } from "react";
import CommonImageUpload from "../../components/commonImageUpload";
import "./Settings.css";
import { TiTick } from "react-icons/ti";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  FaAngleDown,
  FaFacebook,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import countryCodeOptions from "../../data/CountryCodes";
import Popup from "../../components/Popup/Popup";
import OtpVerify from "../../components/Forms/OtpVerify";
import SmallLoader from "../../components/SmallLoader";
import SingleDropdown from "../../components/SingleDropdown";
import Toggle from "../../components/Toggle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import TextEditor from "../../components/TextEdior";
import MultiselectDropdown from "../../components/SearchMultiSelectDropdown.js";

import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTitle } from "../../hooks/useTitle.js";
import HtmlEditor from "../../components/HtmlEditor.js";
import MultiSearchSelectDropdown from "../../components/MultiSelectDropdown";

const Settings = () => {
  const user = useSelector((state) => state.auth);
  useTitle("Settings - Flapone Aviation");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prefLang, setPrefLang] = useState([]);
  const [dataStatus, setDataStatus] = useState(false);

  const initialSections = [
    { id: "smalloverview", label: "Small Overview", value: "" },
    { id: "biography", label: "Biography", value: "" },
    { id: "expert", label: "Experience", value: "" },
    { id: "education", label: "Specializations", value: "" },
    { id: "teaching", label: "Qualifications", value: "" },
    { id: "acadExperience", label: "Academic Experience", value: "" },
    { id: "profExperience", label: "Professional Experience", value: "" },
    { id: "flyExperience", label: "Flying Experience", value: "" },
    { id: "certification", label: "Certifications", value: "" },
    { id: "books", label: "Books I Like", value: "" },
    { id: "hobby", label: "Hobby", value: "" },
  ];

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [displayNameStatus, setDisplayNameStatus] = useState("0");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [altNumber, setAltNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [countryCodeAlt, setCountryCodeAlt] = useState("91");
  const [gender, setGender] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isPhoneVerificationOpen, setIsPhoneVerificationOpen] = useState(false);
  const [loadingPhoneVerification, setLoadingPhoneVerification] =
    useState(false);
  const [countryCodeDropdown, setCountryCodeDropdown] = useState(false);
  const [countryCodeAltDropdown, setCountryCodeAltDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [passwordOnOff, setPasswordOnOff] = useState(false);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [sections, setSections] = useState([]);
  const [additionalSections, setAdditionalSections] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const [profileApproved, setProfileApproved] = useState(0);

  const [experienceYear, setExperienceYear] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState([]);
  const [selectedAchievementInstructor, setSelectedAchievementInstructor] = useState([]);


  const [errorMsgName, setErrorMsgName] = useState("");
  const [errorMsgDisplayName, setErrorMsgDisplayName] = useState("");
  const [errorMsgPass, setErrorMsgPass] = useState("");
  const [errorMsgEmail, setErrorMsgEmail] = useState("");
  const [errorMsgMobile, setErrorMsgMobile] = useState("");
  const [errorMsgAltMobile, setErrorMsgAltMobile] = useState("");
  const [errorMsgAddress, setErrorMsgAddress] = useState("");
  const [errorMsgState, setErrorMsgState] = useState("");
  const [errorMsgCity, setErrorMsgCity] = useState("");
  const [errorMsgPincode, setErrorMsgPincode] = useState("");
  const [initialDataCheck, setInitialDataCheck] = useState(false);
  const [additionalDataCheck, setAdditionalDataCheck] = useState(false);

  const [emailVerify, setEmailVerify] = useState("0");
  const [phoneVerify, setPhoneVerify] = useState("0");
  const [otpVerify, setOtpVerify] = useState("");
  const [otpStatusVerify, setOtpStatusVerify] = useState("");

  const [errorMsgInstagram, setErrorMsgInstagram] = useState("");
  const [errorMsgFacebook, setErrorMsgFacebook] = useState("");
  const [errorMsgLinkedIn, setErrorMsgLinkedIn] = useState("");

  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [instructor, setInstructor] = useState([]);

 const [achievementOptions,setAchievementOptions] =  useState([]);

  const handleEmailVerification = () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myaccount.php?fun=emailVarify`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        type: "admin",
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }

      if (response.data.data.status === "1") {
        setEmailVerified(true);
      }
    });
  };

  const openPhoneVerification = () => {
    setIsPhoneVerificationOpen(true);
  };

  const closePhoneVerification = () => {
    setIsPhoneVerificationOpen(false);
  };

  const handleMobileVerification = () => {
    if (countryCode === null) {
      setErrorMsgMobile("Select country code first");
      return false;
    }
    setLoadingPhoneVerification(true);
    setTimeout(() => {
      setLoadingPhoneVerification(false);
      openPhoneVerification();
    }, 2000);

    otpHandler(phoneNumber);
  };

  function otpHandler(mobile) {
    setOtpStatusVerify("0");
    setOtpVerify("");

    axios({
      method: "post",
      url: `${constant.base_url}/admin/myaccount.php?fun=OTPSEND`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        mobile: mobile,
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
    });
  }

  const varifyOTPFunHandle = (otp) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myaccount.php?fun=OTPAuth`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        otp: otp,
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      setOtpVerify(response.data.data.msg);
      setOtpStatusVerify(response.data.data.status);
      setPhoneVerify(response.data.data.status);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleCountryCodeSelect = (selectedCountry) => {
  //   setCountryCode(selectedCountry);
  //   setCountryCodeDropdown(false);
  // };
  const handleCountryCodeSelect = (selectedCountry) => {
    setCountryCode(selectedCountry);

    if (selectedCountry.length === 0) {
      setErrorMsgMobile("Please select country code!");
      return false;
    } else {
      setErrorMsgMobile("");
    }

    handleFormSetting("countrycode", selectedCountry);
    setCountryCodeDropdown(false);
  };

  const handleCountryCodeAltSelect = (selectedCountry) => {
    setCountryCodeAlt(selectedCountry);
    setCountryCodeAltDropdown(false);
  };
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Prefer Not to Say", value: "Prefer Not to Say" },
  ];
  const preferredLanguages = [
    { label: "Hindi", value: "Hindi" },
    { label: "English", value: "English" },
    { label: "Marathi", value: "Marathi" },
    { label: "Bengali", value: "Bengali" },
    { label: "Punjabi", value: "Punjabi" },
    { label: "Gujarati", value: "Gujarati" },
    { label: "Assamese", value: "Assamese" },
    { label: "Kannada", value: "Kannada" },
    { label: "Kashmiri", value: "Kashmiri" },
    { label: "Konkani", value: "Konkani" },
    { label: "Malayalam", value: "Malayalam" },
    { label: "Manipuri", value: "Manipuri" },
    { label: "Nepali", value: "Nepali" },
    { label: "Oriya", value: "Oriya" },
    { label: "Sanskrit", value: "Sanskrit" },
    { label: "Sindhi", value: "Sindhi" },
    { label: "Tamil", value: "Tamil" },
    { label: "Telugu", value: "Telugu" },
    { label: "Urdu", value: "Urdu" },
    { label: "Bodo", value: "Bodo" },
    { label: "Santhali", value: "Santhali" },
    { label: "Maithili", value: "Maithili" },
    { label: "Dogri", value: "Dogri" },
    { label: "Other", value: "Other" },
  ];
  const passwordHandle = () => {
    if (passwordOnOff === false) {
      setPasswordOnOff(true);
    } else {
      setPasswordOnOff(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCountryCodeDropdown(false);
      }

      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setCountryCodeAltDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function validateContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/(<br\s*\/?>|&nbsp;|\s+)/gi, '');
    if (text === '') {
      html = "";
    }
    return html;
  }


  const handleChange = (id, value, type ,label) => {
    
    value = validateContent(value);

    if(id =='expert'){
       label ='Experience';
    }else if(id =='education'){
       label ='Specializations';
    }else if(id =='teaching'){
       label ='Qualifications';
    }

    if (type === "initial") {
      const updatedSections = sections.map((section) =>
        section.id === id ? { ...section, value , label} : section
      );

      console.log(updatedSections);

      setSections(updatedSections);
      handleFormSetting(type, updatedSections);
    }

    if (type === "additional") {
      const updatedAdditionalSections = additionalSections.map((section) =>
        section.id === id ? { ...section, value , label} : section
      );
      setAdditionalSections(updatedAdditionalSections);
      handleFormSetting(type, updatedAdditionalSections);
    }
  };

  const addSection = () => {
     setAdditionalSections([
      { id: "smalloverview1", label: "Small Overview", value: "" },
      { id: "biography1", label: "Biography", value: "" },
      { id: "expert1", label: "Experience", value: "" },
      { id: "education1", label: "Specializations", value: "" },
      { id: "teaching1", label: "Qualifications", value: "" },
      { id: "acadExperience1", label: "Academic Experience", value: "" },
      { id: "profExperience1", label: "Professional Experience", value: "" },
      { id: "flyExperience1", label: "Flying Experience", value: "" },
      { id: "certification1", label: "Certifications", value: "" },
      { id: "books1", label: "Books I Like", value: "" },
      { id: "hobby1", label: "Hobby", value: "" },
    ]);
  };
  const toggleCheckbox = () => {
    handleFormSetting("isChecked", !isChecked);
    setIsChecked(!isChecked);
    if (!isChecked) {
      if (!additionalDataCheck) {
        addSection();
      }
    }
  };

  const handleSelectedInstructorOptionsChange = (newSelectedOptions) => {
    setSelectedInstructor(newSelectedOptions);
    const courseValues = newSelectedOptions.map((obj) => obj.value);
    handleFormSetting("instructorcourse", courseValues);
  };

  // Function to render TextEditor for each section

  const renderTextEditor = (label, initialValue, id, type) => (
    <div className="form-group-settings jodit-editor" key={id}>
      <p className="fc15 fw6 fs14 ls1 mb12">{label}</p>
      <TextEditor
        initialValue={initialValue}
        onChange={(value) => handleChange(id, value, type ,label)}
        editorIndex={id}
        readOnly={id == "smalloverview" && initialValue && profileApproved == 1}
      />
      {/* <HtmlEditor
        descValue={initialValue}
        onChange={(value) => handleChange(id, value, type)}
        readonly={id=='smalloverview' && initialValue && profileApproved==1}
      /> */}
    </div>
  );

  const handleLogout = () => {
    // Dispatch the logout action to clear user data
    dispatch(logout());
    // Redirect to the login page
    navigate("/login");
  };

  function getSettingData() {
    setLoading(true);
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myaccount.php?fun=settingData`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    })
      .then(function (response) {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }

        const settingData = response.data.data.detail;

        setProfileImg(settingData);
        setDisplayName(settingData.display_name);
        if (settingData.display_name != "") {
          setDisplayNameStatus("1");
        }
        setName(settingData.name);
        setEmail(settingData.email_id);
        setPhoneNumber(settingData.mobile_number);
        setProfileApproved(settingData.profile_update_status);
        setAltNumber(settingData.alternate_mobile);
        setState(settingData.state);
        setCity(settingData.city);
        setPincode(settingData.pincode);
        setAddress(settingData.address);
        setCountryCode(settingData.country_code);
        setEmailVerify(settingData.email_status);
        
        setIsChecked(settingData.isChecked);
        if (settingData.isChecked) {
          addSection();
        }

        if (
          settingData.mobile_status === "0" &&
          settingData.mobile_number === ""
        ) {
          setPhoneVerify("2");
        } else {
          setPhoneVerify(settingData.mobile_status);
        }

        setLinkedin(settingData.in);
        setInstagram(settingData.insta);
        setFacebook(settingData.fb);

        if (settingData.initialSections != "") {
          setInitialDataCheck(true);
          setSections(settingData.initialSections);
        } else {
          setSections([...initialSections]);
        }

        if (settingData.additionalSections != "") {
          setAdditionalDataCheck(true);
          //setIsChecked(true);
          setAdditionalSections(settingData.additionalSections);
        }

        if (settingData.selectedcourse) {
          const foundCourses = settingData.selectedcourse.map((course) =>
            response.data.data.courselist.find(
              (option) => option.value === course
            )
          );
          setSelectedInstructor(foundCourses);
        }

        setInstructor(response.data.data.courselist);

        if (settingData.gender) {
          setGender(
            genderOptions.find((option) => option.value === settingData.gender)
          );
        }

        if (settingData.language !== null) {
          setPrefLang(settingData.language);
        }
        
         if (settingData?.achievementInstructor) {
          setSelectedAchievementInstructor(settingData.achievementInstructor);
         }

         if (settingData?.achievement) {
          setSelectedAchievement(settingData.achievement);
         }

         if (settingData?.experienceYear) {
          setExperienceYear(settingData.experienceYear);
         }

        setDataStatus(true);
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getSettingData();
  }, []);

  const handleFormSetting = (key, value) => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/myaccount.php?fun=settingUpdate`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        key: key,
        value: value,
      },
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }

      const respdata = response.data;
      if (respdata.data.status === 0) {
        if (key === "email") {
          setErrorMsgEmail(respdata.data.msg);
        } else if (key === "mobile_number") {
          setErrorMsgMobile(respdata.data.msg);
        }
      } else {
        if (key === "mobile_number") {
          getSettingData();
        }
      }
    });
  };

  const setNameFun = (value) => {
    value = value.trim();
    if (value.length === 0) {
      setErrorMsgName("Name field is empty!");
      return false;
    } else {
      setErrorMsgName("");
    }

    handleFormSetting("name", value);
    setName(value);
    if (displayNameStatus === "0") {
      handleFormSetting("display_name", value);
      setDisplayName(value);
      setDisplayNameStatus("1");
    }
  };

  const setDisplayNameFunData = (value) => {
    value = value.trim();
    if (value.length === 0) {
      setErrorMsgName("Name field is empty!");
      return false;
    } else {
      setErrorMsgName("");
    }
    if (displayNameStatus === 0) {
      setDisplayName(value);
    }
  };

  const setDisplayNameFun = (value) => {
    value = value.trim();
    if (value.length === 0) {
      setErrorMsgDisplayName("Display Name field is empty!");
      return false;
    } else {
      setErrorMsgDisplayName("");
    }

    handleFormSetting("display_name", value);
    setDisplayName(value);
  };

  const setEmailFun = (value) => {
    value = value.trim();
    if (value.length === 0) {
      setErrorMsgEmail("Email field is empty!");
      return false;
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(value)) {
        setErrorMsgEmail("Invalid email: " + value);
        return false;
      } else {
        setErrorMsgEmail("");
      }
    }

    handleFormSetting("email", value);
    setEmail(value);
  };

  const setPhoneNumberFun = (value) => {
    value = value.trim();
    if (value.length === 0) {
      setErrorMsgMobile("Mobile no is empty!");
      return false;
    } else {
      setPhoneNumber((prevPhoneNumber) => {
        if (countryCode === "91") {
          const mobileRegex = /^[6789]\d{9}$/i;

          if (!mobileRegex.test(value)) {
            setErrorMsgMobile("Invalid Mobile No: " + value);
            return prevPhoneNumber;
          } else {
            setErrorMsgMobile("");
          }
        } else {
          const mobileRegex = /^\d{5,20}$/i;

          if (!mobileRegex.test(value)) {
            setErrorMsgMobile("Invalid Mobile No: " + value);
            return prevPhoneNumber;
          } else {
            setErrorMsgMobile("");
          }
        }
        return value;
      });
    }

    handleFormSetting("mobile_number", value);
  };

  const setAltNumberFun = (value) => {
    value = value.trim();
    setErrorMsgAltMobile("");
    handleFormSetting("alternate_mobile", value);
    setAltNumber(value);
  };

  const setAddressFun = (value) => {
    value = value.trim();
    if (value.length === 0) {
      setErrorMsgAddress("Address field is empty!");
      return false;
    } else {
      const addressRegex = /^[0-9a-zA-Z,.-\s#\/()&]+$/;
      const isValid = addressRegex.test(value);

      if (!isValid) {
        setErrorMsgAddress(
          "Allow some char like , . # / () & in address including 0-9,a-z"
        );
        return false;
      } else {
        setErrorMsgAddress("");
      }
    }

    handleFormSetting("address", value);
    setAddress(value);
  };

  const setPincodeFun = (value) => {
    value = value.trim();

    if (value.length === 0) {
      setErrorMsgPincode("Pincode field is empty!");
      return false;
    } else {
      if (value.length < 4 || value.length > 12) {
        setErrorMsgPincode("Invalid Pincode: " + value);
        return false;
      } else {
        setErrorMsgPincode("");
      }
    }

    handleFormSetting("pincode", value);
    setPincode(value);
  };

  const setCityFun = (value) => {
    value = value.trim();

    if (value.length === 0) {
      setErrorMsgCity("City field is empty!");
      return false;
    } else {
      setErrorMsgCity("");
    }

    handleFormSetting("city", value);
    setCity(value);
  };

  const setStateFun = (value) => {
    value = value.trim();

    if (value.length === 0) {
      setErrorMsgState("State field is empty!");
      return false;
    } else {
      setErrorMsgState("");
    }

    handleFormSetting("state", value);
    setState(value);
  };

  const handleGenderSelect = (label, option) => {
    handleFormSetting("gender", option.value);
  };

  const handlePrefChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setPrefLang(selectedValues);
    handleFormSetting("language", selectedValues);
  };

  const setInstagramFun = (value) => {
    value = value.trim();
    const instagramRegex =
      /^(https?:\/\/)?(www\.)?(instagram\.com)\/[A-Za-z0-9._%+-]+$/;
    if (value) {
      if (!instagramRegex.test(value)) {
        toast.warn("Enter valid insta url");
        return false;
      }
      value = value.trim();
      handleFormSetting("insta", value);
      setInstagram(value);
    }
  };

  const setFacebookFun = (value) => {
    value = value.trim();
    const facebookRegex =
      /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.me)\/[A-Za-z0-9._%+-]+$/;
    if (value) {
      if (!facebookRegex.test(value)) {
        toast.warn("Enter valid facebook url");
        return false;
      }
      value = value.trim();
      handleFormSetting("fb", value);
      setFacebook(value);
    }
  };

  const setLinkedinFun = (value) => {
    value = value.trim();
    const linkedinRegex =
      /^(https?:\/\/)?(www\.)?(linkedin\.com)\/in\/[A-Za-z0-9-]+$/;
    if (value) {
      if (!linkedinRegex.test(value)) {
        toast.warn("Enter valid linkedin url");
        return false;
      }
      value = value.trim();
      handleFormSetting("in", value);
      setLinkedin(value);
    }
  };

   const setExperienceYearFun = (value) => {
    value = value.trim();
    if (value) {
      value = value.trim();
      handleFormSetting("experienceYear", value);
      setExperienceYear(value);
    }
  };

  const handleUploadProfileImg = (file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.set("auth_id", user.auth_id);
    formData.set("fun", "uploadImg");

    axios
      .post(
        `${constant.base_url}/admin/myaccount.php?fun=uploadImg&type=profile`,
        formData,
        {
          headers: {
            "Auth-Id": user.auth_id,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.login.status === 0) {
          handleLogout();
          return false;
        }
        toast.success("Image Uploaded Successfully");
      })
      .catch((error) => {
        toast.error("Failed to Upload");
      });
  };

  const handlePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length === 0) {
      setErrorMsgPass("New Password field is empty!");
      return false;
    }

    if (newPassword.length > 0) {
      const pattern = /^([A-Za-z\d\@\$\!\%\*\?]{8,})$/;
      const isValid = pattern.test(newPassword);

      if (isValid) {
        setErrorMsgPass("");
        toast.success("Password Updated Successfully");
      } else {
        setErrorMsgPass(
          "Minimum 8 characters, alphanumeric and symbols (@ $ ! % * ?) allowed!"
        );
        return false;
      }
    }

    handleFormSetting("newPassword", newPassword);
  };


  const handleSelectedAchievementsChange = (newSelectedOptions) => {
    handleFormSetting("achievement", newSelectedOptions);
    setSelectedAchievement(newSelectedOptions);
  };

  const handleSelectedAchievementsInstructorChange = (newSelectedOptions) => {
    handleFormSetting("achievementInstructor", newSelectedOptions);
    setSelectedAchievementInstructor(newSelectedOptions);
  };

  return (
    <div className="account-details  pl20 pr20 df w66 fdc settings">
      <h3 className="fc1 fw5 fs20 mt24 mb24">
        Settings
        <div className="fs14 fc16 mt8 fw4">
          Update & ensure the profile information is accurate and up-to-date to
          maintain account integrity
        </div>
      </h3>
      <div className="upload-image v-center">
        <p className="flx33 fc15 fw6 fs14 mb12 ls1">Upload Photo</p>
        {dataStatus && (
          <div className="image-upload-compoenent">
            <CommonImageUpload
              setWorkImage={setProfileImg}
              imgData={profileImg}
              uploadImg={handleUploadProfileImg}
              delstatus={false}
              disabled={profileApproved == 1}
            />
          </div>
        )}
      </div>
      <div className="form-group-settings name">
        <p className="fc15 fw6 fs14 ls1">Name</p>
        <input
          type="text"
          id="name"
          placeholder="Enter Name"
          defaultValue={name}
          onChange={(e) => setDisplayNameFunData(e.target.value)}
          onBlur={(e) => setNameFun(e.target.value)}
          autoComplete="off"
        />
        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgName}</p>
      </div>

      <div className="form-group-settings disp-name">
        <p className="fc15 fw6 fs14 ls1">Display Name</p>
        <input
          type="text"
          id="name"
          placeholder="Display Name"
          defaultValue={displayName}
          onBlur={(e) => setDisplayNameFun(e.target.value)}
          autoComplete="off"
          readOnly={displayName && profileApproved == 1}
        />
      </div>
      <div className="form-group-settings email">
        <div className="df jcsb aic">
          <p className="fc15 fw6 fs14 ls1">Email Address</p>
          <span
            className={` fc1 fs14 ls1 ${emailVerified ? "verified" : ""}`}
            onClick={() => {
              if (!emailVerified) {
                handleEmailVerification();
              }
            }}
          >
            <div className="loader-container df aic">
              {emailVerify === "1" ? (
                <p className="v-center verification-status verified">
                  Verified <TiTick className="fs14" />
                </p>
              ) : emailVerified ? (
                <p className={`v-center verification-status verified`}>
                  Sent an email <TiTick className="fs14" />
                </p>
              ) : (
                <p className="cp fc1 fs14">Verify</p>
              )}
            </div>
          </span>
        </div>
        <input
          type="text"
          id="email"
          placeholder="Enter email address"
          defaultValue={email}
          onBlur={(e) => setEmailFun(e.target.value)}
          autoComplete="off"
          disabled={emailVerify === "1" ? true : false}
        />
        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgEmail}</p>
      </div>

      <div className="form-group-settings mobile">
        <div className="df jcsb aic">
          <p className="fc15 fw6 fs14 ls1">
            Phone Number ( With country code )
          </p>

          {/* <p className="loader-container df aic">
            {loadingPhoneVerification ? (
              <SmallLoader />
            ) : (
              <span className="cp fc1 fs14" onClick={handleMobileVerification}>
                Verify
              </span>
            )}
          </p> */}

          {(countryCode === "91" && phoneVerify === "0" && phoneNumber.length  === 10) ? (
            <p className="loader-container df aic">
              {loadingPhoneVerification ? (
                <SmallLoader />
              ) : (
                <p className="cp fc1 fs14" onClick={handleMobileVerification}>
                  Verify
                </p>
              )}
            </p>
          ) : (
            <p
              className={` cp fc1 fs14 ${
                phoneVerify === "1"
                  ? "v-center verification-status verified"
                  : ""
              }`}
            >
              {countryCode === "91"
                ? phoneVerify === "1"
                  ? "Verified"
                  : phoneVerify === "0"  && phoneNumber.length === 10
                    ? "Verify"
                    : ""
                : ""}
              {countryCode === "91" && phoneVerify === "1" && (
                <TiTick className="fs14" />
              )}
            </p>
          )}
        </div>
        <div className="input-group df pr w100 fww aisc">
          <div className="input-group-prepend df">
            <div className="role-dropdown" ref={dropdownRef}>
              <div
                className="selected-role fs14 h40 country-code"
                onClick={() => setCountryCodeDropdown(!countryCodeDropdown)}
              >
                {countryCode || "Country Code"}
                <FaAngleDown className="fc16 fs14" />
              </div>
              {countryCodeDropdown && (
                <ul className="role-options fs14">
                  {countryCodeOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleCountryCodeSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <input
            type="text"
            className="form-control br4"
            maxLength={15}
            placeholder="Enter phone number"
            id="phone"
            name="phone"
            defaultValue={phoneNumber}
            onChange={(e) => setPhoneNumberFun(e.target.value)}
          />
        </div>
        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgMobile}</p>
      </div>

      <div className="form-group-settings alt-number">
        <div className="df jcsb aic">
          <p className="fc15 fw6 fs14 ls1">Alternate Number</p>
        </div>
        <div className="input-group df pr w100 fww aisc">
          <input
            type="number"
            className="form-control br4"
            maxLength={15}
            placeholder="Enter Alternate number"
            id="alternate"
            name="alternate number"
            defaultValue={altNumber}
            onBlur={(e) => setAltNumberFun(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group-settings gender">
        <SingleDropdown
          label="Gender"
          options={genderOptions}
          selectedOption={gender}
          onSelect={setGender}
          handleClickUpdate={handleGenderSelect}
          extraProps={true}
        />
      </div>
      <div className="form-group-settings address">
        <p className="fc15 fw6 fs14 ls1">Address</p>
        <input
          type="text"
          id="address"
          placeholder="Enter Address"
          defaultValue={address}
          onBlur={(e) => setAddressFun(e.target.value)}
          autoComplete="off"
        />
        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgAddress}</p>
      </div>

      <div className="form-group-settings city-pin df jcsb">
        <div className="state flx1">
          <p className="fc15 fw6 fs14 ls1">State</p>
          <input
            type="text"
            id="city"
            placeholder="Enter state"
            defaultValue={state}
            onBlur={(e) => setStateFun(e.target.value)}
            autoComplete="off"
          />
          <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgState}</p>
        </div>
        <div className="city flx1 ml16">
          <p className="fc15 fw6 fs14 ls1">City</p>
          <input
            type="text"
            id="city"
            placeholder="Enter City"
            defaultValue={city}
            onBlur={(e) => setCityFun(e.target.value)}
            autoComplete="off"
          />
          <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgCity}</p>
        </div>
        <div className="pincode flx1 ml16">
          <p className="fc15 fw6 fs14 ls1">Pincode</p>
          <input
            type="number"
            id="pincode"
            placeholder="Enter Pincode"
            defaultValue={pincode}
            onBlur={(e) => setPincodeFun(e.target.value)}
            autoComplete="off"
          />
          <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgPincode}</p>
        </div>
      </div>
      <div className="mb30 h40 pref-lang">
        <p className="fc15 fw6 fs14 ls1 mb12">Languages Spoken</p>

        <Select
          isMulti
          name="languages"
          options={preferredLanguages}
          value={preferredLanguages.filter((option) =>
            prefLang.includes(option.value)
          )}
          onChange={handlePrefChange}
          placeholder="Select Languages"
        />
      </div>

      <div className="form-group-settings social">
        <p className="fc15 fw6 fs14 ls1">Social Links</p>
        <div className="facebook-container">
          <input
            type="text"
            id="facebook"
            placeholder="Facebook url"
            defaultValue={facebook}
            onBlur={(e) => setFacebookFun(e.target.value)}
            autoComplete="off"
            className="facebook-input"
            readOnly={facebook && profileApproved == 1}
          />
          <FaFacebook className="facebook-icon" />
        </div>
        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgFacebook}</p>
        <div className="facebook-container">
          <input
            type="text"
            id="linkedin"
            placeholder="Linkedin url"
            defaultValue={linkedin}
            onBlur={(e) => setLinkedinFun(e.target.value)}
            autoComplete="off"
            readOnly={linkedin && profileApproved == 1}
          />
          <FaLinkedinIn className="facebook-icon" />
        </div>
        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgLinkedIn}</p>
        <div className="facebook-container">
          <input
            type="text"
            id="instagram"
            placeholder="Instagram url"
            defaultValue={instagram}
            onBlur={(e) => setInstagramFun(e.target.value)}
            autoComplete="off"
            readOnly={instagram && profileApproved == 1}
          />
          <FaInstagram className="instagram-icon" />
        </div>

        <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgInstagram}</p>
      </div>

      <div className="form-group-settings disp-name">
        <p className="fc15 fw6 fs14 ls1">Experience year</p>
        <input
          type="number"
          id="name"
          placeholder="Enter Experience year"
          defaultValue={experienceYear}
          onBlur={(e) => setExperienceYearFun(e.target.value)}
          autoComplete="off"
        />
      </div>

       <div className="tags mb30">
        <p className="fc15 fw6 fs14 ls1 mb8">Key Achievements</p>
        <MultiSearchSelectDropdown
          options={achievementOptions}
          selectedOptions={selectedAchievement}
          onSelectedOptionsChange={handleSelectedAchievementsChange}
          showDropdown={true}
        />
      </div>

      <div className="editors-container">
        {sections &&
          sections.map((section) =>
            renderTextEditor(
              section.label,
              section.value,
              section.id,
              "initial"
            )
          )}
      </div>
      {(user.role === "1" || user.dept_id === "6") && (
        <div className="df jce aic mb10">
          <label htmlFor="addMore" className="v-center">
            <input
              type="checkbox"
              className="cp mr8"
              id="addMore"
              checked={isChecked}
              onChange={toggleCheckbox}
            />
            {isChecked === true ? "Unmark" : "Mark"} Profile as Instructor
          </label>
        </div>
      )}

      {(user.role === "1" || user.dept_id === "6") && isChecked && (
      <>
      
       <div className="tags mb30">
        <p className="fc15 fw6 fs14 ls1 mb8">Key Achievements</p>
        <MultiSearchSelectDropdown
          options={achievementOptions}
          selectedOptions={selectedAchievementInstructor}
          onSelectedOptionsChange={handleSelectedAchievementsInstructorChange}
          showDropdown={true}
        />
      </div>

        <div className="editor-container2">
          {additionalSections &&
            additionalSections.map((section) =>
              renderTextEditor(
                section.label,
                section.value,
                section.id,
                "additional"
              )
            )}
        </div>
        </>
      )}

      {(user.role === "1" || user.dept_id === "6") && isChecked && (
        <div className="tags mb30 settings-course">
          <p className="fc15 fw6 fs14 ls1 mb8">Select Courses</p>

          <MultiselectDropdown
            options={instructor}
            selectedOption={selectedInstructor}
            placeholder={"Search Courses"}
            disabled={true}
            onSelectionChange={handleSelectedInstructorOptionsChange}
            noChip={true}
          />
        </div>
      )}

      <div className="reset-password mt10">
        <div className="reset-pass-head mt24">
          <div className="v-center">
            <p className=" fc1 fs18 ls1 lh22 mr8">Reset Your Password</p>
            <Toggle onChange={passwordHandle} />
          </div>
          <p className="ls1 fc16 fs14 mt4 mb24 lh22">
            Secure your account with a new password
          </p>
        </div>
        {passwordOnOff && (
          <div className="form-group-settings">
            <p className="fc15 fw6 fs14 ls1">New Password</p>
            <div className="password-input pr">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Reset your password"
                defaultValue={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="off"
              />
              <span onClick={togglePasswordVisibility}>
                {!showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p className="fs14 fc4 fw4 ls1 mt10">{errorMsgPass}</p>
            <div className="button-container born">
              <button
                type="button"
                className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 fc3 "
                onClick={handlePassword}
              >
                Save
              </button>
            </div>
          </div>
        )}
        {user.role === "admin" && (
          <div className="button-container reset-password">
            <button
              type="button"
              className="btn-blue bg1 br24 fs14 cp pl16 pr16 pt10 pb10 fc3"
            >
              Approve
            </button>
          </div>
        )}
      </div>
      {isPhoneVerificationOpen && (
        <Popup
          onClose={closePhoneVerification}
          title={"Mobile Phone Verification"}
        >
          <OtpVerify
            onClose={closePhoneVerification}
            varifyOTPFun={varifyOTPFunHandle}
            otpVerifyMsgStatus={otpVerify}
            otpStatusVerify={otpStatusVerify}
            phoneNumber={phoneNumber}
          />
        </Popup>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Settings;
