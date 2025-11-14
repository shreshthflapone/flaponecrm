import React, { useState, useRef, useEffect, useCallback } from "react";
import "./LocationDetail.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import MultiselectDropdown from "../../components/MultiSelectDropdown";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NoPermission from "../../components/NoPermission.js";
import { useTitle } from "../../hooks/useTitle.js";
import SingleDropdown from "../../components/SingleDropdown";
import TimePicker from "../../components/TimePicker.js";
import { weekdays } from "moment/moment.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import MultiSearchSelectDropdown from "../../components/SearchMultiSelectDropdown.js";
import { MdDelete } from "react-icons/md";

const LocationDetail = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Location Detail - Flapone Aviation");

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [position, setPosition] = useState("");
  const [authorizationNo, setAuthorizationNo] = useState("");
  const [emails, setEmails] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [locationType, setLocationType] = useState("");
  const [selectedShowPage, setSelectedShowPage] =
    useState("all");
  const [selectedLaunchStatus, setSelectedLaunchStatus] =
    useState("upcoming");

  const [startTime, setStartTime] = useState({
      hour: "09",
      minute: "00",
      ampm: "AM",
    });

  const [endTime, setEndTime] = useState({
      hour: "07",
      minute: "00",
      ampm: "PM",
    });
  
  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const [courseListOptions,setCourseListOptions] = useState([]);


  const facilitiesOptions =  [
  { label: "Flight Simulators", value: "Flight Simulators" },
  { label: "Drone Labs", value: "Drone Labs" },
  { label: "Practical Training Ground", value: "Practical Training Ground" },
  { label: "Accommodation Facilities", value: "Accommodation Facilities" },
  { label: "Locker Facilities", value: "Locker Facilities" },
  { label: "24×7 Security & CCTV Surveillance", value: "24×7 Security & CCTV Surveillance" },
  { label: "Power Backup & Air-Conditioned Spaces", value: "Power Backup & Air-Conditioned Spaces" },
  { label: "Free Wifi", value: "Free Wifi" },
  { label: "Parking", value: "Parking" },
  { label: "First Aid", value: "First Aid" }
];

  const [selectedDays,setSelectedDays] = useState([]);
  const [selectedCourses,setSelectedCourses] = useState([]);
  const [description,setDescription] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const handleSelectedFacOptionsChange = (newSelectedOptions) => {
    setSelectedFacilities(newSelectedOptions);
  };

  const [subOfferingTitle, setOfferingTitle] = useState("");
  const [subOfferingUrl, setOfferingUrl] = useState("");
  const [subOfferingPosition, setOfferingPosition] = useState("");
  const [OfferingList, setOfferingList] = useState([]);


  function isValidURL(url) {
  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    return regex.test(url);
  } catch (e) {
    return false;
  }
}


  const handleAddOffering = () => {

   if(subOfferingUrl){ 
    const urlcheck = isValidURL(subOfferingUrl);
     if(urlcheck === false){
          toast.warning("Url Should be Valid");
          return false;
     }
    }

    if(!subOfferingTitle){
      toast.warning("Title Should not be blank");
    }else if (!subOfferingUrl){
      toast.warning("Url Should not be blank");
    }else if (!subOfferingPosition){
      toast.warning("Position Should not be blank");
    }else {
    
      const newOffering = {
        id: OfferingList.length + 1,
        name: subOfferingTitle,
        url: subOfferingUrl,
        position: subOfferingPosition,
      };

      setOfferingList([...OfferingList, newOffering]);
      setOfferingTitle("");
      setOfferingUrl("");
      setOfferingPosition("");
    }

    
  };

    const handleEditOffering = (id, newText, field, indexp) => {
    OfferingList[indexp][field] = newText;
    setOfferingList([...OfferingList]);
  };

    const handleDeleteOffering = (id) => {
    const updatedOfferings = OfferingList.filter(
      (offering, index) => offering.id !== id
    );
    setOfferingList(updatedOfferings);
  };

  const [status, setStatus] = useState("draft");
  const [errorMsgTitle, setErrorMsgTitle] = useState("");
  const [errorMsgMapUrl, setErrorMsgMapUrl] = useState("");
  
  const [formErrors, setFormErrors] = useState({});
  const [errorStatus, setErrorStatus] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);


  const [showEmployeeData, setShowEmployeeData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  
  const handleLogout = () => {
    // Dispatch the logout action to clear user data
    dispatch(logout());
    // Redirect to the login page
    navigate("/login");
  };

  
  const handleLaunchStatus = (e) => {
    setSelectedLaunchStatus(e.target.value);
  };
  
  const handleShowChange = (e) => {
    setSelectedShowPage(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleLocationTypeChange = (e) => {
    setLocationType(e.target.value);
  };


  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleLandmark = (e) => {
    setLandmark(e.target.value);
  };

  const handleLocality = (e) => {
    setLocality(e.target.value);
  };

  const handleState = (e) => {
    setState(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };


  const handlePincode = (e) => {
    setPincode(e.target.value);
  };

  const handleMapUrl = (e) => {
      setMapUrl(e.target.value); 
  };


  const handlePosition = (e) => {
    setPosition(e.target.value);
  };

  const handleAuthorizationNo = (e) => {
    setAuthorizationNo(e.target.value);
  };
 
  const handleEmailsChange = (newEmail) => {
     setEmails(newEmail);
  };
  

  const handleMobilesChange = (newMobile) => {
    setMobiles(newMobile);
    
  };


  const locationValidate = (
    locationType,
    title,
    address,
    city,
    state,
    pincode,
    locality,
    landmark,
    mobileValues,
    emailValues,
    mapUrl,
    selectedShowPage,
    selectedLaunchStatus,
    status
  ) => {
    const errors = {};
    errors.locationType =[];
    errors.title =[];
    errors.address =[];
    errors.city =[];
    errors.state =[];
    errors.pincode =[];
    errors.locality =[];
    errors.landmark =[];
    errors.mobileValues =[];
    errors.emailValues =[];
    errors.mapUrl =[];
    errors.position =[];
    errors.authorizationNo =[];
    errors.selectedShowPage =[];
    errors.status =[];

    if (locationType.length === 0) {
      errors.locationType.push("Location Type is empty!");
      setErrorStatus(true);
    }

    if (title.length === 0) {
      errors.title.push("Location Title is empty!");
      setErrorStatus(true);
    }else {
      const titleRegex = /^[0-9a-zA-Z,.-\s#\/()&]+$/;
      const isValid = titleRegex.test(title);
      if (!isValid) {
        errors.title.push(
          "Only these special characters are allowed:- , . # / () & Including 0-9 and a-z."
        );
        setErrorStatus(true);
      } 
    }

    if (address.length === 0) {
      errors.address.push("Address is empty!");
      setErrorStatus(true);
    }else {
      const addressRegex = /^[0-9a-zA-Z,.-\s#\/()&]+$/;
      const isValid = addressRegex.test(address);
      if (!isValid) {
        errors.address.push(
          "Only these special characters are allowed:- , . # / () & Including 0-9 and a-z."
        );
        setErrorStatus(true);
      } 
    }

    if (state.length === 0) {
      errors.state.push("State is empty!");
      setErrorStatus(true);
    }else {
      const stateRegex = /^[a-zA-Z\s.\-&]+$/;
      const isValid = stateRegex.test(state);
      if (!isValid) {
        errors.state.push(
          "Only a-z,A-Z . - & Allowed"
        );
        setErrorStatus(true);
      } 
    }

    if (city.length === 0) {
      errors.city.push("City is empty!");
      setErrorStatus(true);
    }else {
      const cityRegex = /^[a-zA-Z\s.\-&]+$/;
      const isValid = cityRegex.test(city);
      if (!isValid) {
        errors.city.push(
          "Only a-z,A-Z . - & Allowed"
        );
        setErrorStatus(true);
      } 
    }

   
   
  if(landmark!==null && landmark.length > 0) {
      const landmarkRegex = /^[0-9a-zA-Z,.-\s#\/()&]+$/;
      const isValid = landmarkRegex.test(landmark);
      if (!isValid) {
        errors.landmark.push(
          "Only these special characters are allowed:- , . # / () & Including 0-9 and a-z."
        );
        setErrorStatus(true);
      } 
    }

    if (locality.length === 0) {
      errors.locality.push("Locality is empty!");
      setErrorStatus(true);
    }else {
      const localityRegex = /^[0-9a-zA-Z,.-\s#\/()&]+$/;
      const isValid = localityRegex.test(locality);
      if (!isValid) {
        errors.locality.push(
          "Only these special characters are allowed:- , . # / () & Including 0-9 and a-z."
        );
        setErrorStatus(true);
      } 
    }

  
    if(pincode === null){
      errors.pincode.push("Pincode is empty!");
      setErrorStatus(true);
    }else if (pincode.length === 0) {
      errors.pincode.push("Pincode is empty!");
      setErrorStatus(true);
    } else {
      if (pincode.length < 4 || pincode.length > 12) {
        errors.pincode.push("Invalid Pincode: " + pincode);
        setErrorStatus(true);
      }
    }
   
    if (mobileValues.length === 0) {
      errors.mobileValues.push("Enter Mobile and (press enter ↵  OR  Comma (,) )");
      setErrorStatus(true);
    }else {
      const mobileValuesRegex = /^[\d+\-\s]+$/;
      mobileValues.forEach((em) => {
        if (!mobileValuesRegex.test(em)) {
          setErrorStatus(true);
          errors.mobileValues.push("Only digit 0-9 and + - Allowed "  +  " (Invalid Mobile:" +em +")");
        }
      });
    }

    if (emailValues.length === 0) {
      errors.emailValues.push("Enter email and (press enter ↵  OR  Comma (,) )");
      setErrorStatus(true);
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      emailValues.forEach((em) => {
        if (!emailRegex.test(em)) {
          setErrorStatus(true);
          errors.emailValues.push("Invalid email: " + em);
        }
      });
    }
    

    if (mapUrl.length === 0) {
      errors.mapUrl.push("Map Url is empty!");
      setErrorStatus(true);
    }else {
      const mapUrlRegex = /^(https?:\/\/)?([^\s$.?#].[^\s]*)$/i;
      const isValid = mapUrlRegex.test(mapUrl);
      if (!isValid) {
        errors.mapUrl.push(
          "Url Are not Valid"
        );
        setErrorStatus(true);
      } 
    }

    if (status.length === 0) {
      errors.status.push("Please select status!");
      setErrorStatus(true);
    }

    if (selectedShowPage.length === 0) {
      errors.selectedShowPage.push("Please select anyone!");
      setErrorStatus(true);
    }
    
    
    
    const returnError = {};
      if (
        errors.locationType.length === 0 &&
        errors.title.length === 0 &&
        errors.address.length === 0 &&
        errors.city.length === 0 &&
        errors.state.length === 0 &&
        errors.pincode.length === 0 &&
        errors.locality.length === 0 &&
        errors.landmark.length === 0 &&
        errors.mobileValues.length === 0 &&
        errors.emailValues.length === 0 &&
        errors.mapUrl.length === 0 &&
        errors.selectedShowPage.length === 0 &&
        errors.status.length === 0
      ) {
        returnError.status = false;
        setErrorStatus(false);
      } else {
        returnError.status = true;
      }
    

    returnError.errors = errors;

    return returnError;
  };

   //add a new Location
   function saveLocationData() {
    setFormSubmitted(true);
    const emailValues = emails.map(obj => obj.value);
    const mobileValues = mobiles.map(obj => obj.value);
      const locErData = locationValidate(
        locationType,
        title,
        address,
        city,
        state,
        pincode,
        locality,
        landmark,
        mobileValues,
        emailValues,
        mapUrl,
        selectedShowPage,
        selectedLaunchStatus,
        status
      );

      if (locErData.status === true) {
        setFormErrors(locErData.errors);
        toast.error("Please fill all required fields");
      }else{
        
      const newLocation = {
        locid:id?id:"",
        location_type: locationType,
        location_title: title,
        full_address: address,
        city: city,
        state: state,
        pincode: pincode,
        locality: locality,
        landmark: landmark,
        mobiles: mobileValues,
        emails: emailValues,
        mapUrl: mapUrl,
        position: position,
        authorizationNo: authorizationNo,
        selectedShowPage: selectedShowPage,
        selectedLaunchStatus:selectedLaunchStatus,
        status: status,
        selectedEmployee:selectedEmployee,
        selectedCourses:selectedCourses,
        description:description,
        offerings:OfferingList,
        selectedDays:selectedDays,
        startTime:startTime,
        endTime:endTime,
        selectedFacilities:selectedFacilities,
      };

    axios({
      method: "post",
      url: `${constant.base_url}/admin/location.php?fun=createLocation`,
      headers: {"Auth-Id": user.auth_id},
      data: newLocation,
    }).then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }

      const respdata = response.data;
      if(respdata.data.status === "0"){
          toast.error(respdata.data.msg); 
       }else{
         toast.success(respdata.data.msg);
         navigate("/location-list");
       }

    });
   }
  }


  const getLocationDetail = async () => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/location.php`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        "locid": id
      }
    }).then(function (response) {

      if (response.data.login.status === 0) {
        handleLogout();
       return false;
      }

      const locationData = response.data.data.detail;
      setEmails(locationData.emails);
      setMobiles(locationData.mobile);
      setTitle(locationData.location_title);
      setAddress(locationData.full_address);
      setState(locationData.state);
      setCity(locationData.city);
      setPincode(locationData.pincode);
      setLocality(locationData.locality);
      setLandmark(locationData.landmark);
      setMapUrl(locationData.location_url);
      setLocationType(locationData.location_type);
      setPosition(locationData.orderby);
      setAuthorizationNo(locationData.rpto_authorization_no);
      setStatus(locationData.location_status);
      setSelectedShowPage(locationData.location_show);
      setSelectedLaunchStatus(locationData.status);
      setSelectedEmployee(locationData.accountable_manager_id);
     
      setSelectedDays(locationData.on_days);
      setDescription(locationData.description);
      if(locationData.startTime!=null){
      setStartTime(locationData.startTime);
      }
      if(locationData.startTime!=null){
      setEndTime(locationData.endTime);
      }
      setOfferingList(locationData.offering);
      setSelectedFacilities(locationData.facilities);
      setSelectedCourses(locationData.selectedCourse);

    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }

  useEffect(() => {
    if(id!==undefined){
      getLocationDetail();
    }
  }, [id]);


  const handleSubmitLocation =()=>{
     saveLocationData();
  }

  const openLocationListPage = () => {
     navigate("/location-list");
  };

  
    useEffect(() => {
      locationPostingFilter();
    }, []);
    const locationPostingFilter = async () => {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/location.php?fun=postingFormFilter`,
        headers: { "Auth-Id": user.auth_id },
        data: {  },
      }).then(function (response) {
        if (response.data.data.status === "1") {
          const filterList = response.data.data;
          setShowEmployeeData(filterList.employeeData);
          setCourseListOptions(filterList.courseData);
        }
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
    };
  const handleSelectedEmployee = (option) => {
    setSelectedEmployee(option);
    
  }



   const handleDaySelection = (value) => {
    const index = selectedDays.indexOf(value);
    if (index === -1) {
      setSelectedDays([...selectedDays, value]);
    } else {
      const updatedValues = [...selectedDays];
      updatedValues.splice(index, 1);
      setSelectedDays(updatedValues);
    }
  };

  const handleTimeChange = (timeData, period) => {
    if(period === 'from' ){
      setStartTime(timeData);
    }else{
      setEndTime(timeData);
    }
  };

    const handleCourseNameSelect = (selectedoptions) => {
    const courseValues = selectedoptions.map((obj) => obj.value);
     setSelectedCourses(selectedoptions);
  };

  return (
    <>
    {(pageRoleAccess || pageContentAccessDept) && (<>
      <InnerHeader
        heading={`${id?"Edit Branch":"Add Branch"}`}
        txtSubHeading={id !== undefined ? "Edit the details of an existing branch here. Update the branch name, address, contact information, and other relevant details. ":"Use this form to add a new branch. Provide the branch name, address, contact information, and any other relevant details."}
        showButton={true}
        onClick={openLocationListPage}
        iconText="View List"
      />
    
      <Card className="card bg5  pl8 pr20 pt20 pb10 content-iagent-container">
     
        <div className="meta-grp bg8 pl20 pr20 pt20 pb10 mb24 mt24 box-sd1">
        <div className="radio-grp-parent-status fww mt12 mb12 df fdc mb30">
            <p className="fc15 fw6 fs14 ls1 ">Location Type<span className="fc4">*</span></p>
            <div className="v-center fs14 mt12">
              <label htmlFor="headoffice" className="cp v-center mr16">
                <input
                  type="radio"
                  className="mr8 cp"
                  id="headoffice"
                  value="headoffice"
                  checked={locationType === "headoffice"}
                  onChange={handleLocationTypeChange}
                />
               Head Office
              </label>
              <label htmlFor="branch" className="cp v-center mr16 ml24">
                <input
                  type="radio"
                  className="mr8 cp"
                  id="branch"
                  value="branch"
                  checked={locationType === "branch"}
                  onChange={handleLocationTypeChange}
                />
                 Branch
              </label>

              <label htmlFor="center" className="cp v-center mr16 ml24">
                <input
                  type="radio"
                  className="mr8 cp"
                  id="center"
                  value="center"
                  checked={locationType === "center"}
                  onChange={handleLocationTypeChange}
                />
                 Center
              </label>
            </div>
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "locationType" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          
          </div>
          
        <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Location Title<span className="fc4">*</span></p>
            <input
              type="text"
              id="locationTitle"
              name="locationTitle"
              placeholder="Enter Location Title"
              autoComplete="off"
              value={title}
              onChange={handleTitle}
            />
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "title" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Full Address<span className="fc4">*</span></p>
            <textarea
              id="fullAddress"
              name="fullAddress"
              placeholder="Enter Full Address"
              autoComplete="off"
              value={address}
              onChange={handleAddress}
            ></textarea>
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "address" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          
          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Landmark</p>
            <input
              type="text"
              id="landmark"
              name="landmark"
              placeholder="Enter Landmark"
              autoComplete="off"
              value={landmark}
              onChange={handleLandmark}
            />
             {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "landmark" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
         
          <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Locality<span className="fc4">*</span></p>
            <input
              type="text"
              id="locality"
              name="locality"
              placeholder="Enter Locality"
              autoComplete="off"
              value={locality}
              onChange={handleLocality}
            />
             {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "locality" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
         
          <div className="form-group-settings city-pin df jcsb">
           <div className="city flx1">
              <p className="fc15 fw6 fs14 ls1">City<span className="fc4">*</span></p>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter City"
                autoComplete="off"
                value={city}
                onChange={handleCity}
                />
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "city" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
         

          <div className="state flx1 ml16">
              <p className="fc15 fw6 fs14 ls1">State<span className="fc4">*</span></p>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="Enter state"
                autoComplete="off"
                value={state}
                onChange={handleState}
                />
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "state" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
	           {/*   <div className="city flx1 ml16">
              <p className="fc15 fw6 fs14 ls1">City<span className="fc4">*</span></p>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter City"
                autoComplete="off"
                value={city}
                onChange={handleCity}
                />
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "city" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>*/}
         

          <div className="img-pos flx1 ml16">
            <p className="fc15 fw6 fs14 ls1">Pincode<span className="fc4">*</span></p>
            <input
              type="number"
              id="pincode"
              name="pincode"
              placeholder="Enter Pincode"
              min={1}
              autoComplete="off"
              value={pincode}
              onChange={handlePincode}
              
            />
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "pincode" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>

        <div className="form-group-settings name">
            <p className="fc15 fw6 fs14 ls1">Location URL (Embed map url only)<span className="fc4">*</span></p>
            <input
              type="text"
              id="mapUrl"
              name="mapUrl"
              placeholder="Embed Google Map URL"
              autoComplete="off"
              value={mapUrl}
              onChange={handleMapUrl}
            />
            {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "mapUrl" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>

        <div className="mt16 df fdc h40 mb30">
          <label className="fc15 fw6 fs14 ls1 mb8">Email Address(es)<span className="fc4">*</span></label>
          <MultiselectDropdown
            options={[]}
            selectedOptions={emails}
            onSelectedOptionsChange={handleEmailsChange}
            showDropdown={false}
          />
          {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "emailValues" &&
                      formErrors[key].map((error, index) => (
                        <p key={index} className="lh22">{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
         </div>

         <div className="mt16 df fdc h40 mb30">
          <label className="fc15 fw6 fs14 ls1 mb8">Mobile(es)<span className="fc4">*</span></label>
          <MultiselectDropdown
            options={[]}
            selectedOptions={mobiles}
            onSelectedOptionsChange={handleMobilesChange}
            showDropdown={false}
          /> 
          {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "mobileValues" &&
                      formErrors[key].map((error, index) => (
                        <p key={index} className="lh22">{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
         </div>

         <div className="inp-design course-name ">
            <label className="fc15 fw6 fs14  ls1 mb12">
                Course Name
              </label>
               <div className="mt12 batch-course-name course-name">
                  <MultiSearchSelectDropdown
                    options={courseListOptions}
                    selectedOption={selectedCourses}
                    placeholder={"Search Courses"}
                    onSelectionChange={handleCourseNameSelect}
                    noChip={true}
                  />
                  </div>
            </div>

          <div className="form-group-settings name mt32">
            <p className="fc15 fw6 fs14 ls1"> About Branch</p>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            ></textarea>
          </div>

           <div className="form-group-settings df fww ">
            <div className="inp-design searching-drop flx48 mr16 mt16">
                <p className="fc15 fw6 fs14 ls1 mb8">
                  Working/Open Days
                </p>
                <MultiDropdown
                  label="Working Days"
                  options={dayOptions}
                  selectedValues={selectedDays}
                  onSelect={handleDaySelection}
                />
               </div>

              <TimePicker
                className="ml12"
                fromTime={startTime}
                toTime={endTime}
                onTimeChange={handleTimeChange}
                />     
          </div>

    
                 <p className="brd-b2 mb20"> </p>
                    <div className="blog-main-grp-inputs bg8 pb10 mb10">
                      <p className="fc15 fw6 fs18 ls22 ls1">Offering </p>
                      <div className="form-group-settings cover-img-sec mt16">
                        <div className="v-center jcsb course-highlight">
                          <div className="flx50 mr16">
                            <p className="fc15 fw6 fs14 ls1">
                              Title <span className="fc4">*</span>
                            </p>
                            <input
                              type="text"
                              id="offering_title"
                              name="offering_title"
                              placeholder="Enter Title"
                              value={subOfferingTitle}
                              onChange={(e) => setOfferingTitle(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="img-pos flx1 cr-img-pos">
                            <div className="v-center jcsb">
                              <div className="flx75 mr16">
                                <p className="fc15 fw6 fs14 ls1">
                                  Url <span className="fc4">*</span>
                                </p>
                                <input
                                  type="text"
                                  id="offering_url"
                                  name="offering_url"
                                  placeholder="Enter Url"
                                  value={subOfferingUrl}
                                  onChange={(e) =>
                                    setOfferingUrl(e.target.value)
                                  }
                                  autoComplete="off"
                                />
                              </div>
                              <div className="img-pos flx1">
                                <p className="fc15 fw6 fs14 ls1">
                                  Position <span className="fc4">*</span>
                                </p>
                                <input
                                  type="number"
                                  id="offering_position"
                                  name="offering_position"
                                  placeholder="Position"
                                  value={subOfferingPosition}
                                  onInput={(e) => {
                                    if (e.target.value.length > 2) {
                                      e.target.value = e.target.value.slice(0, 2);
                                    }
                                  }}
                                  onChange={(e) =>
                                    setOfferingPosition(e.target.value)
                                  }
                                  autoComplete="off"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="df jce">
                          <button
                            className="h36 pt8 pb8 pl16 pr16 mt16 cp bg1 fc3 br4"
                            onClick={handleAddOffering}
                          >
                            Add
                          </button>
                        </div>
                        <div className="image-list mt16 mb24">
                          {OfferingList.map((offering_data, index) => (
                            <div
                              className="v-center jcsb listing-img-url"
                              key={offering_data.id}
                            >
                              <div className="flx50 mr16">
                                <input
                                  type="text"
                                  id={`offering_title_${offering_data.id}`}
                                  name={`offering_title_${offering_data.id}`}
                                  placeholder="Enter Title"
                                  value={offering_data.name}
                                  autoComplete="off"
                                  onChange={(e) =>
                                    handleEditOffering(
                                      offering_data.id,
                                      e.target.value,
                                      "name",
                                      index
                                    )
                                  }
                                />
                              </div>
                              <div className="img-pos flx1">
                                <div className="v-center jcsb">
                                  <div className="flx75 mr16">
                                    <input
                                      type="text"
                                      id={`offering_url_${offering_data.id}`}
                                      name={`offering_url_${offering_data.id}`}
                                      placeholder="Enter Url"
                                      value={offering_data.url}
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleEditOffering(
                                          offering_data.id,
                                          e.target.value,
                                          "url",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="img-pos flx1">
                                    <input
                                      type="number"
                                      id={`offering_position_${offering_data.id}`}
                                      name={`offering_position_${offering_data.id}`}
                                      value={offering_data.position}
                                      placeholder="Position"
                                      onInput={(e) => {
                                        if (e.target.value.length > 2) {
                                          e.target.value = e.target.value.slice(0, 2);
                                        }
                                      }}
                                      onChange={(e) =>
                                        handleEditOffering(
                                          offering_data.id,
                                          e.target.value,
                                          "position",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div
                                    className="fc4 cp flx1 box-center fs24 mt8"
                                    onClick={() =>
                                      handleDeleteOffering(
                                        offering_data.id
                                      )
                                    }
                                  >
                                    <MdDelete />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  <p className="brd-b2 mb20"> </p>
      
           
            <div className="tags mb30">
              <p className="fc15 fw6 fs14 ls1 mb8">Facilities / Amenities</p>
              <MultiselectDropdown
                options={facilitiesOptions}
                selectedOptions={selectedFacilities}
                onSelectedOptionsChange={handleSelectedFacOptionsChange}
                showDropdown={true}
              />
            </div>


            <p className="fc15 fw6 fs14 ls1">Branch Status<span className="fc4">*</span></p>
              <div className="df mt12 mb30 cover-image-radio mb30">
                <label htmlFor="operational" className="cp v-center">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="operational"
                    value="operational"
                    checked={selectedLaunchStatus === "operational"}
                    onChange={handleLaunchStatus}
                  />
                  Operational
                </label>
                <label htmlFor="upcoming" className="cp v-center mr16 ml24">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="upcoming"
                    value="upcoming"
                    checked={selectedLaunchStatus === "upcoming"}
                    onChange={handleLaunchStatus}
                  />
                  Upcoming
                </label>
                {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "selectedLaunchStatus" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
           </div>


            {/* <p className="fc15 fw6 fs14 ls1 mt12 ">Show<span className="fc4">*</span></p>
              <div className="df mt12 mb30 cover-image-radio mb30">
                <label htmlFor="all" className="cp v-center">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="all"
                    value="all"
                    checked={selectedShowPage === "all"}
                    onChange={handleShowChange}
                  />
                  Location Page
                </label>
                <label htmlFor="footer" className="cp v-center mr16 ml24">
                  <input
                    type="radio"
                    className="mr8 cp"
                    id="footer"
                    value="footer"
                    checked={selectedShowPage === "footer"}
                    onChange={handleShowChange}
                  />
                  Footer (Including location page)
                </label>
                {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "selectedShowPage" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}
              </div> */}

             
          <div className="form-group-settings df jcsb">
            <div className="flx1 m30 mr8">
              <SingleDropdown
                label={"Accountable Manager"}
                options={showEmployeeData}
                selectedOption={selectedEmployee}
                onSelect={handleSelectedEmployee}
              />
            </div>
            <div className="flx1  m30 mr8">
              <p className="fc15 fw6 fs14 ls1">RPTO Authorization No.</p>
              <input
                type="text"
                id="authorizationNo"
                name="authorizationNo"
                placeholder="Enter Authorization No"
                autoComplete="off"
                value={authorizationNo}
                onChange={handleAuthorizationNo}
                readOnly={authorizationNo !== ''}
              />
            </div>

             <div className="flx1  mb30 ">
              <p className="fc15 fw6 fs14 ls1">Position</p>
              <input
                type="number"
                id="position"
                name="position"
                placeholder="Enter Position"
                min={1}
                autoComplete="off"
                value={position}
                onChange={handlePosition}
              />
            </div>
          </div>

        </div>
      

      
      


        {formSubmitted && (
              <div className="form-error-messages error blink-text-normal-error mt8 tac">
                {Object.keys(formErrors).map((key) => (
                  <div key={key}>
                    {key === "status" &&
                      formErrors[key].map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                ))}
              </div>
            )}

     
        <div className="radio-grp-status box-center fww mt12 mb12">
          <label htmlFor="approve" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="approve"
              value="approve"
              checked={status === "approve"}
              onChange={handleStatusChange}
            />
            Approve
          </label>
          <label htmlFor="draft" className="cp v-center mr16 fc6 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="draft"
              value="draft"
              checked={status === "draft"}
              onChange={handleStatusChange}
            />
            Draft
          </label>
          <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="reject"
              value="reject"
              checked={status === "reject"}
              onChange={handleStatusChange}
            />
            Reject
          </label>
        </div>
      
        
     
      
     
        <div className="add-more box-center mt24">
          <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
            onClick={handleSubmitLocation}
          >
           {id !== undefined ? "Update" : "Submit"}
          </button>
          </div>
        </Card>
       </>
      )}
      {!pageRoleAccess && !pageContentAccessDept  && (
            <NoPermission displayMsg={"No permission to access this page"} />
       )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default LocationDetail;
