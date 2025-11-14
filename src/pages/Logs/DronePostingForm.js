import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import SingleDropdown from "../../components/SingleDropdown";
import { useNavigate } from "react-router-dom";
import MultiDropdown from "../../components/MultiDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "../MyStudents/CommonForm.css";
import { format, subDays, subMonths } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { FaCalendarAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";

const DronePostingForm = () => {
  const { id }    = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState("1");
  const [selectedBatteries, setSelectedBatteries] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [branch, setBranch] = useState([]);
  const customDateFormat = "dd/MM/yyyy";
  const dateRangePickerRef = useRef(null);

  const [insuranceDateRangeValue, setInsuranceDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection1",
    },
  ]);
  const [amcDateRangeValue, setAMCDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection1",
    },
  ]);
  const [insuranceHasSelected, setInsuranceHasSelected] = useState(false);
  const [amcHasSelected, setAMCHasSelected] = useState(false);
  const [submitLoader,setSubmitLoader] = useState(false);
  const [showInsuranceDatePicker, setShowInsuranceDatePicker] = useState(false);
  const [showAMCDatePicker, setShowAMCDatePicker] = useState(false);
  const [branchListOptions, setBranchListOptions] = useState([]);
  const [usaModelNameListOptions, setUsaModelNameListOptions] = useState([]);
  const [modelTypeOptions, setModelTypeOptions] = useState([]);
  const [uasClassOptions, setUasClassOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [batteriesListOptions, setBatteriesListOptions] = useState([]);
  const [courseListOptions, setCourseListOptions] = useState([]);
  const insuranceDateRangePickerRef = useRef(null);
  const amcDateRangePickerRef = useRef(null);

  const [droneFormData, setdroneFormData] = useState({
    id: id ? id : "",
    uin: "",
    modelType: {},
    uasClass: {},
    cateogry: {},
    branch: {},
    course: [],
    batteries: [],
    insurance: insuranceHasSelected ? insuranceDateRangeValue : [{startDate: null,endDate: null,key: "selection1"}],
    amc: amcHasSelected ? amcDateRangeValue : [{startDate: null,endDate: null,key: "selection1"}],
    createDate: null,
    uas_model_name: "",
    notes: "",
    status: "2",
  });

  const handleModelTypeSelect = (option) => {
    setdroneFormData((prevValues) => ({
      ...prevValues,
      modelType: option,
    }));
  };
  const handleUasClass = (option) => {
    setdroneFormData((prevValues) => ({
      ...prevValues,
      uasClass: option,
    }));
  };
  const handleSelectCategory = (option) => {
    setdroneFormData((prevValues) => ({
      ...prevValues,
      cateogry: option,
    }));
  };
  const handleUasModelName = (option) => {
    setdroneFormData((prevValues) => ({
      ...prevValues,
      uas_model_name: option,
    }));
  };

  const validateForm = () => {
    if (!droneFormData.uin || droneFormData.uin.trim() === "") {
      toast.warning("Drone ID (UIN) is required.");
      return false;
    }
    if(droneFormData.status !== "2"){
      if (!droneFormData.cateogry?.value) {
        toast.warning("UAS Category is required.");
        return false;
      }
      if (!droneFormData.uasClass?.value) {
        toast.warning("UAS Class is required.");
        return false;
      }
      if (!droneFormData.createDate) {
        toast.warning("Registration Date is required.");
        return false;
      }
      if (!droneFormData.course || droneFormData.course.length === 0) {
        toast.warning("At least one Course must be selected.");
        return false;
      }
      if (!droneFormData.branch?.value) {
        toast.warning("Location is required.");
        return false;
      }
    }
    return true;
  }

  const dronePostingFilter = async () => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=postingFormFilter`,
      headers: { "Auth-Id": user.auth_id },
      data: droneFormData
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        console.log("data = ", response.data.data.data);
        setBranchListOptions(response.data.data.locationData);
        setUsaModelNameListOptions(response.data.data.modelNameOptions);
        setModelTypeOptions(response.data.data.modelTypeOptions);
        setUasClassOptions(response.data.data.uasClassOptions);
        setCategoryOptions(response.data.data.categoryOptions);
        setCourseListOptions(response.data.data.courseData);
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitLoader(true);
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=addDroneInventory`,
      headers: { "Auth-Id": user.auth_id },
      data: droneFormData
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        toast.success(response.data.data.msg);
        setTimeout(() => {
          openDroneLog();
        }, 1000);
      } else {
        const errors = response.data.data.errorList;
        if (Array.isArray(errors) && errors.length > 0) {
          errors.forEach((err) => {
            toast.warning(err);
          });
        } else {
          toast.warning(response.data.data.msg || "Something went wrong");
        }
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };
  const openDroneLog = () => {
    navigate("/inventory/drone");
  };
  const editPostFormData = async (id) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=editPostFormData`,
      headers: { "Auth-Id": user.auth_id },
      data: {"id":id}
    }).then(function (response) {
      checkUserLogin(response);
      let responseData = response.data.data;
      if(responseData.status === "1"){
        handleBatteryListAccBranch(responseData.data.branch.value);
        const insuranceStart = responseData.data.insurance_start_date ? new Date(responseData.data.insurance_start_date) : null;
        const insuranceEnd = responseData.data.insurance_end_date ? new Date(responseData.data.insurance_end_date) : null;

        const amcStart = responseData.data.amc_start_date ? new Date(responseData.data.amc_start_date) : null;
        const amcEnd = responseData.data.amc_end_date ? new Date(responseData.data.amc_end_date) : null;
        if (insuranceStart && insuranceEnd) {
          setInsuranceHasSelected(true);
        }
      
        if (amcStart && amcEnd) {
          setAMCHasSelected(true);
        }
        setInsuranceDateRangeValue([
          {
            startDate: insuranceStart,
            endDate: insuranceEnd,
            key: "selection1",
          },
        ]);

        setAMCDateRangeValue([
          {
            startDate: amcStart,
            endDate: amcEnd,
            key: "selection1",
          },
        ]);
        setdroneFormData((prev) => ({
          ...prev,
          ...responseData.data,
          insurance: [
            {
              startDate: insuranceStart,
              endDate: insuranceEnd,
              key: "selection1",
            },
          ],
          amc: [
            {
              startDate: amcStart,
              endDate: amcEnd,
              key: "selection1",
            },
          ],
        }));
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };

  const handleSelectBatteries = (value) => {
    setSelectedBatteries((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        updatedValues.push(value);
      } else {
        updatedValues.splice(index, 1);
      }
      setdroneFormData((prevData) => ({
        ...prevData,
        batteries: updatedValues,
      }));
      return updatedValues;
    });
  };
  const handleSelectCourses = (value) => {
    setSelectedCourses((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        updatedValues.push(value);
      } else {
        updatedValues.splice(index, 1);
      }
      setdroneFormData((prevData) => ({
        ...prevData,
        course: updatedValues,
      }));
      return updatedValues;
    });
  };
  const handleBatteryListAccBranch = (option) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=batteryListAccBranch`,
      headers: { "Auth-Id": user.auth_id },
      data: {"location":option},
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        setBatteriesListOptions(response.data.data.data);
      } else {
        toast.warning(response.data.data.msg);
        setBatteriesListOptions([]);
        setdroneFormData(prev => ({ ...prev, batteries: [] }));
      }
      setSubmitLoader(false);
    }).catch(function (error) {
      console.error(error);
      setBatteriesListOptions([]);
      setdroneFormData(prev => ({ ...prev, batteries: [] }));
      setSubmitLoader(false);
    });
  };
  const handleSelectBranch = (option) => {
    setdroneFormData((prevValues) => ({
      ...prevValues,
      branch: option,
    }));
    handleBatteryListAccBranch(option.value);
  };

  const handleDateChange = (date) => {
    setdroneFormData((prevValues) => ({
      ...prevValues,
      createDate: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setdroneFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const openDroneListPage = (e) => {
    navigate("/inventory/drone");
  }
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setdroneFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };
  useEffect(() => {
    setdroneFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  }, [status]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        insuranceDateRangePickerRef.current &&
        !insuranceDateRangePickerRef.current.contains(event.target)
      ) {
        setShowInsuranceDatePicker(false);
      }
      if (
        amcDateRangePickerRef.current &&
        !amcDateRangePickerRef.current.contains(event.target)
      ) {
        setShowAMCDatePicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  useEffect(() => {
    dronePostingFilter();
  }, []);
  useEffect(() => {
    if (id) {
      editPostFormData(id);
    }
  }, [id]);
  const clearDates = (type) => {
    const clearedRange = [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection1",
      },
    ];
  
    if (type === "insurance") {
      setInsuranceHasSelected(false);
      setInsuranceDateRangeValue(clearedRange);
      setdroneFormData((prev) => ({
        ...prev,
        insurance: clearedRange,
      }));
    } else if (type === "amc") {
      setAMCHasSelected(false);
      setAMCDateRangeValue(clearedRange);
      setdroneFormData((prev) => ({
        ...prev,
        amc: clearedRange,
      }));
    }
  };
  const handleAddBatteryOption = () => {
    window.open("/battery-form", "_blank");
  }
  return (
    <>
      <InnerHeader
        heading={id ? "Drone Edit Form" : "Drone Add Form"}
        txtSubHeading="Please provide accurate details of the drone. These details help us maintain inventory, allocate equipment effectively, and ensure proper usage tracking."
        showButton={true}
        onClick={openDroneListPage}
        iconText="View List"
      />
      <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
        <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20">
          <div className="form-group-settings cm-fr flx48">
            <p className="fc15 fw6 fs14 ls1">
              Drone ID (UIN)<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="uin"
              placeholder="UIN/Drone Id"
              autoComplete="off"
              value={droneFormData.uin}
              onChange={handleInputChange}
              readOnly={id !== undefined}
              style={{
                backgroundColor: id !== undefined ? "#f9f9f9" : "",
                cursor: id !== undefined ? "not-allowed" : "",
              }}
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="UAS Category"
              options={categoryOptions}
              selectedOption={droneFormData.cateogry}
              onSelect={handleSelectCategory}
              placeholder="Select UAS Category"
              compulsory={<span className="fc4">*</span>}
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="UAS Class"
              options={uasClassOptions}
              selectedOption={droneFormData.uasClass}
              onSelect={handleUasClass}
              placeholder="Select UAS Class"
              compulsory={<span className="fc4">*</span>}
            />
          </div>
          
          <div className="form-group-settings cm-fr flx48">
            <label className="fc15 fw6 fs14 mb12 ls1">Registration Date<span className="fc4">*</span></label>
            <DatePicker
              dateFormat={customDateFormat}
              selected={droneFormData.createDate ? moment(droneFormData.createDate, "DD/MM/YYYY").toDate() : null}
              onChange={handleDateChange}
              placeholderText="Select create date"
              showIcon
              showMonthDropdown
              showYearDropdown
              useShortMonthInDropdown
              dropdownMode="select"
              isClearable={true}
              maxDate={new Date()}
            />

          </div>
          <div className="form-group-settings cm-fr flx48">
            <SingleDropdown
              label="Model Type"
              options={modelTypeOptions}
              selectedOption={droneFormData.modelType}
              onSelect={handleModelTypeSelect}
              placeholder="Select Model Type"
            />
          </div>

          <div className="form-group-settings course-name flx48">
            <SingleDropdown
              label="UAS Model Name"
              options={usaModelNameListOptions}
              selectedOption={droneFormData.uas_model_name}
              onSelect={handleUasModelName}
              allowCustom
              search
            />
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <p className="fc15 fw6 fs14 ls1 mb8">Course<span className="fc4">*</span></p>
            <MultiDropdown
              label={`Course`}
              options={courseListOptions}
              selectedValues={droneFormData.course}
              onSelect={handleSelectCourses}
              searchable
              chips="4"
            />
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <SingleDropdown
              label="Location"
              options={branchListOptions}
              selectedOption={droneFormData.branch}
              onSelect={handleSelectBranch}
              placeholder="Select Location"
              compulsory={<span className="fc4">*</span>}
            />
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <p className="fc15 fw6 fs14 ls1 mb8">Batteries</p>
            <MultiDropdown
              label={`Batteries`}
              options={batteriesListOptions}
              selectedValues={droneFormData.batteries}
              onSelect={handleSelectBatteries}
              onAddNewOption={handleAddBatteryOption}
              searchable
              chips="4"
            />
          </div>
          <div className="form-group-settings cm-fr flx48 pr">
            <label className="fc15 fw6 fs14 mb12 ls1">Insurance Date</label>
            <div className="report-date mb8 v-center hide-second-date battery-date-range">
              <div
                className="date-range-input pr"
                onClick={() => setShowInsuranceDatePicker(!showInsuranceDatePicker)}
                style={{ cursor: "pointer", padding: "10px 18px", border: "1px solid #ccc", borderRadius: "4px", color: "#7b7b7b", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FaCalendarAlt size={16} color="#7b7b7b" />
                {insuranceHasSelected ? ( 
                  insuranceDateRangeValue?.[0]?.startDate ? (
                    `${format(insuranceDateRangeValue[0].startDate, "dd/MM/yyyy")} - ${format(insuranceDateRangeValue[0].endDate, "dd/MM/yyyy")}`
                    ) : (
                        "Select Date Range"
                      )
                  ) : (
                   "Select Date Range"
                )}
                {insuranceHasSelected ? 
                  insuranceDateRangeValue?.[0]?.startDate && insuranceDateRangeValue?.[0]?.endDate && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDates("insurance");
                      }} 
                      style={{
                        position: "absolute",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "14px",
                        cursor: "pointer",
                        zIndex: 1,
                        color: "#000000",
                      }}
                      title="Clear AMC Date"
                    >
                      ❌
                    </button>
                  ) : (
                    ""
                )}
              </div>

              {showInsuranceDatePicker && (
                <div ref={insuranceDateRangePickerRef}>
                  <DateRangePicker
                    onChange={(ranges) => {
                      const updatedRanges = insuranceDateRangeValue.map((range) => ({
                        ...range,
                        startDate:
                          ranges[range.key]?.startDate || range.startDate,
                        endDate:
                          ranges[range.key]?.endDate || range.endDate,
                      }));
                      setInsuranceDateRangeValue(updatedRanges);
                      setInsuranceHasSelected(true);
                      setdroneFormData((prev) => ({
                        ...prev,
                        insurance: updatedRanges,
                      }));
                    }}
                    
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={insuranceDateRangeValue}
                    direction="horizontal"
                    rangeColors={"#3d91ff"}
                    editableDateInputs={true}
                    isClearable={true}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="form-group-settings cm-fr flx48 pr">
            <label className="fc15 fw6 fs14 mb12 ls1">AMC Date</label>
            <div className="report-date mb8 v-center hide-second-date battery-date-range">
              <div
                className="date-range-input pr"
                onClick={() => setShowAMCDatePicker(!showAMCDatePicker)}
                style={{ cursor: "pointer", padding: "10px 18px", border: "1px solid #ccc", borderRadius: "4px", color: "#7b7b7b", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FaCalendarAlt size={16} color="#7b7b7b" />
                {amcHasSelected ? (
                  amcDateRangeValue?.[0]?.startDate ? (
                    `${format(amcDateRangeValue[0].startDate, "dd/MM/yyyy")} - ${format(amcDateRangeValue[0].endDate, "dd/MM/yyyy")}`
                  ) : (
                    "Select Date Range"
                  )
                ) : (
                  "Select Date Range"
                )}
                {amcHasSelected ? amcDateRangeValue?.[0]?.startDate && amcDateRangeValue?.[0]?.endDate && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDates("amc");
                    }} 
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      fontSize: "14px",
                      cursor: "pointer",
                      zIndex: 1,
                      color: "#000000",
                    }}
                    title="Clear AMC Date"
                  >
                    ❌
                  </button>
                ): ("")}
              </div>

              {showAMCDatePicker && (
                <div ref={amcDateRangePickerRef}>
                  <DateRangePicker
                    onChange={(ranges) => {
                      const updatedRanges = amcDateRangeValue.map((range) => ({
                        ...range,
                        startDate:
                          ranges[range.key]?.startDate || range.startDate,
                        endDate:
                          ranges[range.key]?.endDate || range.endDate,
                      }));
                      setAMCDateRangeValue(updatedRanges);
                      setAMCHasSelected(true);
                      setdroneFormData((prev) => ({
                        ...prev,
                        amc: updatedRanges,
                      }));
                    }}
                    
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={amcDateRangeValue}
                    direction="horizontal"
                    rangeColors={"#3d91ff"}
                    editableDateInputs={true}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="form-group-settings name flx100 meta-grp ">
            <p className="fc15 fw6 fs14 ls1">Description/Notes</p>
            <textarea
              id="notes"
              name="notes"
              placeholder="Enter description or notes"
              value={droneFormData.notes}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="radio-grp-status box-center fww mt12 mb12">
          <label htmlFor="available" className="cp v-center mr16 fc13">
            <input
              type="radio"
              className="mr8 cp"
              id="available"
              value="1"
              checked={droneFormData.status === "1"}
              onChange={handleStatusChange}
            />
            Available
          </label>
          <label htmlFor="under_maintenance" className="cp v-center mr16 fc6 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="under_maintenance"
              value="2"
              checked={droneFormData.status === "2"}
              onChange={handleStatusChange}
            />
            Under Maintenance
          </label>
          <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="reject"
              value="0"
              checked={droneFormData.status === "0"}
              onChange={handleStatusChange}
            />
            Damaged
          </label>
          <label htmlFor="Lost" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="Lost"
              value="3"
              checked={droneFormData.status === "3"}
              onChange={handleStatusChange}
            />
            Lost
          </label>
          <label htmlFor="out_of_service" className="cp v-center mr16 fc9 ml24">
            <input
              type="radio"
              className="mr8 cp"
              id="out_of_service"
              value="4"
              checked={droneFormData.status === "4"}
              onChange={handleStatusChange}
            />
            Out Of Service
          </label>
        </div>

        <div className="add-more box-center mt24 mb24">
          <button
            type="button"
            className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
            onClick={handleSubmit}
          >
            {id ? "Update" : "Submit"}
          </button>
        </div>
      </Card>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default DronePostingForm;
