import React, { useState, useRef,useEffect } from "react";
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
import { DateRangePicker } from "react-date-range";
import { FaCalendarAlt } from "react-icons/fa";
import { format, subDays, subMonths } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";

const BatteryPostingForm = () => {
  const { id }    = useParams();
  const user      = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate = useNavigate();

  const [submitLoader,setSubmitLoader] = useState(false);
  const [status, setStatus] = useState("2");
  const [selectedDrone, setSelectedDrone] = useState([]);
  const [branch, setBranch] = useState([]);
  const customDateFormat = "dd/MM/yyyy";
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const dateRangePickerRef = useRef(null);
  const [branchListOptions, setBranchListOptions] = useState([]);
  const [droneListOptions, setDroneListOptions] = useState([]);
  const [usaModelNameListOptions, setUsaModelNameListOptions] = useState([]);
  const [modelTypeOptions, setModelTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
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

  
  const [batteryFormData, setbatteryFormData] = useState({
    id: id ? id : "",
    battery: "",
    uin: [],
    branch: "",
    createDate: null,
    insurance: insuranceHasSelected ? insuranceDateRangeValue : [{startDate: null,endDate: null,key: "selection1"}],
    amc: amcHasSelected ? amcDateRangeValue : [{startDate: null,endDate: null,key: "selection1"}],
    remarks: null,
    status: "2",
  });

  const [showInsuranceDatePicker, setShowInsuranceDatePicker] = useState(false);
  const [showAMCDatePicker, setShowAMCDatePicker] = useState(false);

  const insuranceDateRangePickerRef = useRef(null);
  const amcDateRangePickerRef = useRef(null);

  const toggleDateRangePicker = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };
  const handleSelectStatus = (option) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      status: option,
    }));
  };
  const handleModelTypeSelect = (option) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      modelType: option,
    }));
  };
  const handleUasClass = (option) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      uasClass: option,
    }));
  };
  const handleSelectCategory = (option) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      cateogry: option,
    }));
  };
  const handleUasModelName = (option) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      uas_model_name: option,
    }));
  };
  const validateForm = () => {
    if (!batteryFormData.battery || batteryFormData.battery.trim() === "") {
      toast.warning("Battery No. is required.");
      return false;
    }
    if (batteryFormData.status !== "2") {
      if (!batteryFormData.branch?.value) {
        toast.warning("Branch is required.");
        return false;
      }
      {/*if (!batteryFormData.uin || batteryFormData.uin.length === 0) {
        toast.warning("At least one Drone Id must be selected.");
        return false;
      }*/}
      if (!batteryFormData.createDate) {
        toast.warning("Purchase Date is required.");
        return false;
      }
    }
    return true;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitLoader(true);
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=addBatteryInventory`,
      headers: { "Auth-Id": user.auth_id },
      data: batteryFormData
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        toast.success(response.data.data.msg);
        setTimeout(() => {
          openBatteryLog();
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
  const openBatteryLog = () => {
    navigate("/inventory/battery");
  };
  const handleSelectDrones = (value) => {
    setSelectedDrone((prevSelected) => {
      const index = prevSelected.indexOf(value);
      const updatedValues = [...prevSelected];

      if (index === -1) {
        updatedValues.push(value);
      } else {
        updatedValues.splice(index, 1);
      }
      setbatteryFormData((prevData) => ({
        ...prevData,
        uin: updatedValues,
      }));

      return updatedValues;
    });
  };

  const handleDateChange = (date) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      createDate: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const openBatteryListPage = () => {
    navigate("/inventory/battery");
  };
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
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };
  const clearDates = (type) => {
    const clearedRange = [
      {
        startDate: null,
        endDate: null,
        key: "selection1",
      },
    ];
  
    if (type === "insurance") {
      setInsuranceHasSelected(false);
      setInsuranceDateRangeValue(clearedRange);
      setbatteryFormData((prev) => ({
        ...prev,
        insurance: clearedRange,
      }));
    } else if (type === "amc") {
      setAMCHasSelected(false);
      setAMCDateRangeValue(clearedRange);
      setbatteryFormData((prev) => ({
        ...prev,
        amc: clearedRange,
      }));
    }
  };
  useEffect(() => {
    setbatteryFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  }, [status]);
  useEffect(() => {
    batteryPostingFilter();
  }, []);
  const batteryPostingFilter = async () => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=postingFormFilter`,
      headers: { "Auth-Id": user.auth_id },
      data: {},
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        setBranchListOptions(response.data.data.locationData);
        setUsaModelNameListOptions(response.data.data.modelNameOptions);
        setModelTypeOptions(response.data.data.modelTypeOptions);
        setCategoryOptions(response.data.data.categoryOptions);
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  }
  const handleSelectBranch = (option) => {
    setbatteryFormData((prevValues) => ({
      ...prevValues,
      branch: option,
    }));
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=droneListAccBranch`,
      headers: { "Auth-Id": user.auth_id },
      data: {"location":option},
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        setDroneListOptions(response.data.data.data);
      } else {
        toast.warning(response.data.data.msg);
        setDroneListOptions([]);
      }
      setSubmitLoader(false);
    }).catch(function (error) {
    });
  };
  const editBatteryFormData = async (id) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/inventory_forms.php?fun=editBatteryFormData`,
      headers: { "Auth-Id": user.auth_id },
      data: {"id":id}
    }).then(function (response) {
      checkUserLogin(response);
      let responseData = response.data.data;
        if(responseData.status === "1"){
          handleSelectBranch(responseData.data.branch);
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
          setbatteryFormData((prev) => ({
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
  const checkUserLogin = (response) => {
    if (response.data.login.status === 0) {
      dispatch(logout());
      navigate("/login");
    }
  };
  const handleAddDroneOption = () => {
    window.open("/drone-form", "_blank");
  }
  useEffect(() => {
    if (id) {
      editBatteryFormData(id);
    }
  }, [id]);
  useEffect(() => {
    if (!id) {
      const today = new Date();
      setAMCDateRangeValue([
        {
          startDate: today,
          endDate: today,
          key: "selection1",
        },
      ]);
      setInsuranceDateRangeValue([
        {
          startDate: today,
          endDate: today,
          key: "selection1",
        },
      ]);
    }
  }, []);
  return (
    <>
      <InnerHeader
        heading={id ? "Battery Edit Form" : "Battery Add Form"}
        txtSubHeading="Enter the battery specifications and usage details. Keeping this information up-to-date is essential for tracking performance, ensuring safety, and managing replacements."
        showButton={true}
        onClick={openBatteryListPage}
        iconText="View List"
      />
      <Card className="card bg5 mt16 pl8 pr8 pt20 pb10 ">
        <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20">
          <div className="form-group-settings cm-fr flx48">
            <p className="fc15 fw6 fs14 ls1">
              Battery No.<span className="fc4">*</span>
            </p>
            <input
              type="text"
              name="battery"
              placeholder="Battery No"
              autoComplete="off"
              value={batteryFormData.battery}
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
              label="Branch"
              options={branchListOptions}
              selectedOption={batteryFormData.branch}
              onSelect={handleSelectBranch}
              compulsory={<span className="fc4">*</span>}
              isReadOnly={id !== undefined}
            />
          </div>
          <div className="form-group-settings cm-fr flx48 searching-drop">
            <p className="fc15 fw6 fs14 ls1 mb8">UIN/Drone Id</p>
            <MultiDropdown
              label={`Drone UIN`}
              options={droneListOptions}
              selectedValues={batteryFormData.uin}
              onSelect={handleSelectDrones}
              onAddNewOption={handleAddDroneOption}
              searchable
              chips="4"
            />
          </div>
          <div className="form-group-settings cm-fr flx48">
            <label className="fc15 fw6 fs14 mb12 ls1">Purchase Date<span className="fc4">*</span></label>
            <DatePicker
              dateFormat={customDateFormat}
              selected={batteryFormData.createDate ? moment(batteryFormData.createDate, "DD/MM/YYYY").toDate() : null} 
              onChange={handleDateChange}
              placeholderText="Select purchase date"
              showIcon
              showMonthDropdown
              showYearDropdown
              useShortMonthInDropdown
              dropdownMode="select"
              isClearable={true}
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
                  )
                }
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
                      setbatteryFormData((prev) => ({
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
                ) :(
                  "Select Date Range"
                )}
                {amcHasSelected ? 
                  amcDateRangeValue?.[0]?.startDate && amcDateRangeValue?.[0]?.endDate && (
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
                  ) :  (
                    ""
                  )
                }
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
                      setbatteryFormData((prev) => ({
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
            <p className="fc15 fw6 fs14 ls1">Remarks</p>
            <textarea
              id="remarks"
              name="remarks"
              placeholder="Enter description or notes"
              value={batteryFormData.remarks}
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
              checked={batteryFormData.status === "1"}
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
              checked={batteryFormData.status === "2"}
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
              checked={batteryFormData.status === "0"}
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
              checked={batteryFormData.status === "3"}
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
              checked={batteryFormData.status === "4"}
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

export default BatteryPostingForm;
