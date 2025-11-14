import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import { useNavigate } from "react-router-dom";
import MultiDropdown from "../../components/MultiDropdown.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "../ClassManagement/CommonForm.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import SmallLoader from "../../components/SmallLoader";
import NoPermission from "../../components/NoPermission.js";

import constant from "../../constant/constant";
import { useTitle } from "../../hooks/useTitle.js";

const HolidayForm = () => {
  const { id }    = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
      useTitle("Holiday Detail - Flapone Aviation");
  

  const [holidayFormData, setHolidayFormData] = useState({
    holidayName: "",
    holidayDate: null,
    dayWeek: "",
    holidayType: {},
    center: [],
    departments: [],
    batch: [],
    recurring: null,
    notes: "",
    status: "2",
  });

  const [submitLoader,setSubmitLoader] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const customDateFormat = "dd/MM/yyyy";
  const pageDeptAccess = user.dept_id;
  const pageRoleAccess = user.role;

  const [centerListOptions,setCenterListOptions] = useState([]);
  const [departmentsListOptions,setDepartmentsListOptions] = useState([]);
  const [batchListOptions,setBatchListOptions] = useState([]);
  const [errorListMsg, setErrorListMsg] = useState([]);
  const [pageLoadStatus, setPageLoadStatus] = useState(false);
  const holidayTypeOptions = [
    { value: "batch_holiday", label: "Batch Holiday" },
    { value: "public_holiday", label: "Public Holiday" },
    { value: "institute_holiday", label: "Institute Holiday" },
    { value: "national_holiday", label: "National Holiday" },
    { value: "religious_holiday", label: "Religious Holiday" },
  ];

  const handleHolidayTypeSelect = (option) => {
    setHolidayFormData((prevValues) => ({
      ...prevValues,
      holidayType: option,
    }));
  };

  const handleSelectBatch = (option) => {
    setHolidayFormData((prevValues) => ({
      ...prevValues,
      batch: option,
    }));
  };

 

  const validateForm = () => {
    let isValid = true;
    let errorList = {};

    if (!holidayFormData.holidayName) {
      errorList.holiday_name = "Holiday name is required.";
      isValid = false;
    }
  
    if (!holidayFormData.holidayDate) {
      errorList.holiday_date = "Holiday date is required.";
      isValid = false;
    } 
    
    setErrorListMsg(errorList);
    return isValid;
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitLoader(true);
    const holidayInfo = {
      holiday_id:id!==undefined?id:0,
      holidayName:holidayFormData.holidayName,
      holidayDate:holidayFormData.holidayDate,
      dayWeek:holidayFormData.dayWeek,
      holidayType:holidayFormData.holidayType,
      center:holidayFormData.center,
      departments:holidayFormData.departments,
      batch:holidayFormData.batch,
      recurring:holidayFormData.recurring,
      notes:holidayFormData.notes,
      status:holidayFormData.status
    };
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/holiday.php?fun=postHolidayData`,
      headers: { "Auth-Id": user.auth_id },
      data: holidayInfo
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        toast.success(response.data.data.msg);
        setTimeout(() => {
          openHolidayList();
        }, 1000);
      } else {
        setErrorListMsg(response.data.data.errorList);
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };

  const openHolidayList = () => {
    navigate("/class-management/holiday");	  
  };

  const handleSelectCenter = (value) => {
    setSelectedCenter((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        // Add selected course
        updatedValues.push(value);
      } else {
        // Remove course
        updatedValues.splice(index, 1);
      }
      setHolidayFormData((prevData) => ({
        ...prevData,
        center: updatedValues,
      }));

      return updatedValues;
    });
  };
  const handleSelectDepartments = (value) => {
    setSelectedDepartments((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        // Add selected course
        updatedValues.push(value);
      } else {
        // Remove course
        updatedValues.splice(index, 1);
      }
      setHolidayFormData((prevData) => ({
        ...prevData,
        departments: updatedValues,
      }));

      return updatedValues;
    });
  };

  

  const handleDateChange = (date) => {
    setHolidayFormData((prevValues) => ({
      ...prevValues,
      holidayDate: date,
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHolidayFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleRecurringChange = (event) => {
    setHolidayFormData((prevData) => ({
      ...prevData,
      recurring: event.target.checked,
    }));
  };

  const getAllDataForm = async () => {
    axios({
      method: "post",
      url: `${constant.base_url}/admin/holiday.php?fun=getAllDataForm`,
      headers: {"Auth-Id": user.auth_id },
      data: {}
    }).then(function (response) {
      checkUserLogin(response);
      let responseData = response.data.data;
      if(responseData.status === "1"){
        setCenterListOptions(responseData.locationData);
        setDepartmentsListOptions(responseData.departmentData);
        setBatchListOptions(responseData.batchList);
      }
      setFilterStatus(true);
    })
    .catch(function (error) {
    });
  }

  const getHolidayDetails = async () => {
    if (id) {
      axios({
        method: "post",
        url: `${constant.base_url}/admin/holiday.php?fun=getHolidayDetails`,
        headers: {"Auth-Id": user.auth_id },
        data: {"id":id}
      }).then(function (response) {
        checkUserLogin(response);
        let responseData = response.data.data;
        if(responseData.status === "1"){
          setHolidayFormData(responseData.data);
        }
        setPageLoadStatus(true);
      })
      .catch(function (error) {
      });
    }
  }

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setHolidayFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };

  useEffect(() => {
    getAllDataForm();
  },[]);

  useEffect(() => {
    getHolidayDetails();
  }, [id]);

  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  return (
    <>
    {(filterStatus !== null && pageLoadStatus !== null) &&
        (filterStatus || pageLoadStatus) && 
        ((pageDeptAccess === "1" || pageDeptAccess === "3") || pageRoleAccess === "1") ? (
        <>
      <InnerHeader
        heading="Add Holiday"
        txtSubHeading="Use this form to add a holiday. Specify the details to ensure proper scheduling and visibility for all Students & Team."
        showButton={true}
        onClick={openHolidayList}
        iconText="View List"
      />
      <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
        <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20">
          <div className="form-group-settings cm-fr flx48">
            <p className="fc15 fw6 fs14 ls1">
              Holiday Name<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="holidayName"
              placeholder="Enter holiday name"
              autoComplete="off"
              value={holidayFormData.holidayName}
              onChange={handleInputChange}
            />
            <p className="error-text">{errorListMsg.holiday_name}</p>
          </div>
          <div className="form-group-settings cm-fr flx48">
            <label className="fc15 fw6 fs14 mb12 ls1">
              Holiday Date
              <span className="fc4">*</span>
            </label>
            <DatePicker
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dateFormat={customDateFormat}
              selected={holidayFormData.holidayDate ? moment(holidayFormData.holidayDate, "DD/MM/YYYY").toDate() : null} 
              onChange={(date) => handleDateChange(date)}
              placeholderText="Select holiday date"
              showIcon={false}
              isClearable={false}
            />
            <p className="error-text">{errorListMsg.holiday_date}</p>
          </div>
          {/* <div className="form-group-settings cm-fr flx48">
            <p className="fc15 fw6 fs14 ls1">Day of the Week</p>
            <input
              type="text"
              name="dayweek"
              placeholder="Day of the Week"
              autoComplete="off"
              className="disabled-input"
              value={holidayFormData.dayWeek || ""}
              readOnly
            />
          </div> */}
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="Holiday Type"
              options={holidayTypeOptions}
              selectedOption={holidayFormData.holidayType}
              onSelect={handleHolidayTypeSelect}
              search
              placeholder="Select Holiday Type"
            />
            <p className="error-text"></p>
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <p className="fc15 fw6 fs14 ls1 mb8">Center</p>
            <MultiDropdown
              label={`Center`}
              options={centerListOptions}
              selectedValues={holidayFormData.center}
              onSelect={handleSelectCenter}
              searchable
              chips="3"
            />
            <p className="error-text"></p>
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <p className="fc15 fw6 fs14 ls1 mb8">Department</p>
            <MultiDropdown
              label={`Department`}
              options={departmentsListOptions}
              selectedValues={holidayFormData.departments}
              onSelect={handleSelectDepartments}
              searchable
              chips="3"
            />
            <p className="error-text"></p>
          </div>

           <div className="form-group-settings cm-fr flx48">
                 <SingleDropdown
                  label={`Batch`}
                  options={batchListOptions}
                  selectedOption={holidayFormData.batch}
                  onSelect={handleSelectBatch}
                  search
                  placeholder="Select Batch"
                />

                <p className="error-text"></p>
              </div>


          <div className="course-name flx48 searching-drop mt24 mb30">
            <label className="fc15 fw6 fs14 ls1 v-center cp">
              <input
                type="checkbox"
                className="cp"
                checked={holidayFormData.recurring || false}
                onChange={handleRecurringChange}
              />
              <span className="ml8">Recurring Holiday</span>
            </label>
            <p className="error-text"></p>
          </div>
          <div className="form-group-settings name flx100 meta-grp ">
            <p className="fc15 fw6 fs14 ls1">Notes</p>
            <textarea
              id="notes"
              name="notes"
              placeholder="Enter description or notes"
              value={holidayFormData.notes}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="radio-grp-status box-center fww mt24 mb12">
          <label htmlFor="approve" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="approve"
              value="1"
              checked={holidayFormData.status === "1"}
              onChange={handleStatusChange}
            />
            Approve
          </label>
          <label htmlFor="draft" className="cp v-center mr16 fc6 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="draft"
              value="2"
              checked={holidayFormData.status === "2"}
              onChange={handleStatusChange}
            />
            Draft
          </label>
          <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="reject"
              value="0"
              checked={holidayFormData.status === "0"}
              onChange={handleStatusChange}
            />
            Reject
          </label>
        </div>
        <div className="add-more box-center mt24">
          {!submitLoader && <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
          onClick={handleSubmit}>
            {id !== undefined ? 'Update' : 'Submit'}
          </button>}
          {submitLoader && 
              <div className="box-center mb12">
                <SmallLoader className={"mb12"} />
              </div>
          }
        </div>
      </Card>
      <ToastContainer position="bottom-right" /> 
      </>
    ) : (
      <NoPermission displayMsg={"No permission to access this page"} />
    )}
    </>
  );
};

export default HolidayForm;
