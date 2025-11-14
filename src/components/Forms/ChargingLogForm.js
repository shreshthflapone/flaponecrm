import React, {  useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SidePopup from "../../components/Popup/SidePopup";
import TimePicker from "../../components/TimePicker.js";
import MultiDropdown from "../../components/MultiDropdown";
import constant from "../../constant/constant";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import SingleDropdown from "../SingleDropdown.js";

const ChargingLogForm = ({openChargingPopup, closeChargingPopup,openBattery,openBatteryEdit}) => {
    const [selecteddroneUid, setSelecteddroneUid] = useState([]);
    const [errorMsgData, setErrorMsgData] = useState([]);
    const [batteryListOption, setBatteryListOPtion] = useState([]);
    const [battery_no, setBatteryNo] = useState("");
    const { batteryId } = useParams();
    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var errorMsg = {};

    const [chargingLogData, setchargingLogData] = useState({
        date: new Date(),
        batteryno: "",
        batteryid: "",
        batterynoopt: {},
        drone_location_name:"",
        start_time:{
            hour: "09",
            minute: "00",
            ampm: "AM",
        },
        end_time: {
            hour: "10",
            minute: "00",
            ampm: "AM",
        },
        startVoltage: "",
        finalVoltage: "",
        chargingVoltage: "",
        droneUid: selecteddroneUid,
        remarks:"",
    });
    const [droneListOptions,setDroneListOptions] = useState([]);
    

    const handleSelectBatteries = (value) => {
        setSelecteddroneUid((prevSelected) => {
            const index = prevSelected.indexOf(value);
            const updatedValues = [...prevSelected];

            if (index === -1) {
            updatedValues.push(value);
            } else {
            updatedValues.splice(index, 1);
            }
            setchargingLogData((prevData) => ({
            ...prevData,
            droneUid: updatedValues,
            }));

            return updatedValues;
        });
    };
    const customDateFormat = "dd/MM/yyyy";
    const handleDateChange = (date) => {
        setchargingLogData((prevValues) => ({
            ...prevValues,
            date: date,
        }));
    };
   

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setchargingLogData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleChargingTimeChange = (timeData, period) => {
        setchargingLogData((prevData) => ({
            ...prevData,
            [period === "from" ? "start_time" : "end_time"]: timeData,
        }));

        validateBatchFields(
            period === "from" ? "start_time" : "end_time",
            timeData
        );
    };
    function validateBatchFields(id, value) {
        errorMsg = errorMsgData;
        if (id === "start_time") {
            if (!value) {
            errorMsg[id] = "Start Time field can't be empty!";
            } else {
            if (value && chargingLogData["end_time"]) {
                const getstime = getConvertedTime(value);
                const stime = formatTo24Hour(getstime);
            
                const getetime = getConvertedTime(chargingLogData["end_time"]);
                const etime = formatTo24Hour(getetime);
                if (stime && etime) {
                
                if (stime === etime) {
                    errorMsg.start_time = "Start Time must be less than End Time!";
                    errorMsg.end_time = "End Time must be greater than Start Time!";
                } else if (stime > etime) {
                    errorMsg.start_time = "Start Time must be less than End Time!";
                    errorMsg.end_time = "End Time must be greater than Start Time!";
                } else {
                    errorMsg.start_time = "";
                    errorMsg.end_time = "";
                }
                }
            }
            }
        } else if (id === "end_time") {
            if (!value) {
            errorMsg[id] = "End Time field can't be empty!";
            } else {
            if (value && chargingLogData["start_time"]) {
                const getstime = getConvertedTime(chargingLogData["start_time"]);
                const stime = formatTo24Hour(getstime);

                const getetime = getConvertedTime(value);
                const etime = formatTo24Hour(getetime);
                if (stime && etime) {
                if (stime === etime) {
                    errorMsg.start_time = "Start Time must be less than End Time!";
                    errorMsg.end_time = "End Time must be greater than Start Time!";
                } else if (stime > etime) {
                    errorMsg.start_time = "Start Time must be less than End Time!";
                    errorMsg.end_time = "End Time must be greater than Start Time!";
                } else {
                    errorMsg.start_time = "";
                    errorMsg.end_time = "";
                }
                }
            }
            }
        } else {
            if (id) {
            value = value.trim();
            if (value.length === 0) {
                errorMsg[id] = id + " field is empty!";
            } else {
                errorMsg[id] = "";
            }
            }
        }

        if (Object.keys(errorMsg).length > 0) {
            setErrorMsgData(errorMsg);
            return false;
        }
    }
    const getConvertedTime = (time) => {
        const hours = time.hour.toString().padStart(2, "0");
        const minute = time.minute.toString().padStart(2, "0");
        return `${hours}:${minute} ${time.ampm}`;
    };

    const formatTo24Hour = (timeString) => {
        const [time, ampm] = timeString.split(" ");
        let [hours, minutes] = time.split(":");

        hours = parseInt(hours, 10);
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, "0")}:${minutes}`;
    };
    const handleSelectbatteryOption = (selectedOption) => {
         setchargingLogData((prevValues) => ({
            ...prevValues,
            ['batteryno']: selectedOption?.value,
            ['batterynoopt']: selectedOption,
        }));  
        setBatteryNo(selectedOption?.battery_id);  
    }
    const validateChargingForm = (formData) => {
        if (!formData.date) return "Please select a date";
        if (!formData.batteryno) return "Please enter the battery number.";

        const st = formData.start_time;
        if (!st.hour || !st.minute || !st.ampm) return "Start time is incomplete. Please select hour, minute, and AM/PM.";

        const et = formData.end_time;
        if (!et.hour || !et.minute || !et.ampm) return "End time is incomplete. Please select hour, minute, and AM/PM.";

        if (!formData.startVoltage) return "Please enter the start voltage.";
        if (parseFloat(formData.startVoltage) > 50) return "Start voltage must not exceed 50V.";
        if (!formData.finalVoltage) return "Please enter the final voltage.";
        if (parseFloat(formData.finalVoltage) > 50) return "Final voltage must not exceed 50V.";
        if (!formData.chargingVoltage) return "Please enter the charging voltage.";
        if (parseFloat(formData.chargingVoltage) > 50000) return "Charging voltage must not exceed 50000V.";
        //if (!formData.droneUid || formData.droneUid.length === 0) return "At least one Drone must be selected";

        return null;
    };
     useEffect(() => {
        const battery_number = openBattery?.id? openBattery?.id: batteryId? batteryId : "";
        if (battery_number!=='all') {
            getdronebattery(battery_number);
        }else{
            getAllBatteryListOption();
        }
    }, [batteryId, openBattery]);

    useEffect(() => {
        const battery_number = battery_no;
        if (battery_number) {
            getdronebattery(battery_number);
        }
    }, [battery_no]);

    useEffect(() => {
        const chardingid = openBatteryEdit?.id;
        if (!isNaN(chardingid) && Number(chardingid) > 0 && batteryListOption.length) {
            getEditModeForm(chardingid);
        }
    }, [openBatteryEdit,batteryListOption]);

    const getEditModeForm = async (editid)=>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/battery_charging_log.php?fun=geteditmodedata`,
      headers: { "Auth-Id": user.auth_id },
      data:{
        editid:editid
      }
    })
    .then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
    if (response.data.data.status === "1") {
        
        let dataf = response?.data?.data?.data;
        setBatteryNo(dataf.ch_battery_no)
        let filterdateobj = batteryListOption.find(
            (item) => item.value === response.data.data.data.ch_battery_no
          );
       
        
        setchargingLogData((prevValues) => ({
            ...prevValues,
            batteryno: dataf.ch_battery_no,
            batterynoopt: filterdateobj?filterdateobj:{},
            start_time:dataf?.start_time,
            end_time: dataf?.end_time,
            date:new Date(dataf.ch_date),
            startVoltage: dataf.ch_start_voltage,
            finalVoltage: dataf.ch_final_voltage,
            chargingVoltage: dataf.ch_after_charging,
            droneUid: dataf.ch_drone_id?dataf.ch_drone_id:[],
            remarks:dataf.remarks,
        }));
        
    }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
    const getAllBatteryListOption = async ()=>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/battery_charging_log.php?fun=getAllBatteryListOption`,
      headers: { "Auth-Id": user.auth_id },
    })
    .then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
    if (response.data.data.status === "1") {
        setBatteryListOPtion([...response.data.data.list]);
    }
    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
    const handleAddChargingCommentPopup = async (e) => {
        e.preventDefault();
        const error = validateChargingForm(chargingLogData);

        if (error) {
            toast.warning(error);
        } else {
            axios({
            method: "post",
            url: `${constant.base_url}/admin/battery_charging_log.php?fun=insertstudentlog`,
            headers: { "Auth-Id": user.auth_id },
            data: {
                chargingLogData: chargingLogData,
                editid:openBatteryEdit?.id?openBatteryEdit?.id:0
            },
            })
            .then(function (response) {
                if (response.data.login.status === 0) {
                handleLogout();
                return false;
                }
                if (response.data.data.status === "1") {
                    toast.success(response.data.data.msg);
                    closeChargingPopup();
                } 
                else{
                    toast.error(response.data.data.msg);
                }
            })
            .catch(function (error) {
                console.error("Error during login:", error);
            });
        }

    };
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };
    const getdronebattery = async (battery_no)=>{
    axios({
      method: "post",
      url: `${constant.base_url}/admin/battery_charging_log.php?fun=getDroneDataBattery`,
      headers: { "Auth-Id": user.auth_id },
      data: {
        battery_no: battery_no,
      },
    })
    .then(function (response) {
      if (response.data.login.status === 0) {
        handleLogout();
        return false;
      }
      if (response.data.data.status === "1") {
        setDroneListOptions([...response.data.data.list.drone_list]);
        setchargingLogData((prevValues) => ({
            ...prevValues,
            batteryno: response.data.data.list.battery_num,
            batteryid: battery_no,
            drone_location_name: response.data.data.list.drone_location_name,
        }));
    }else{
        setDroneListOptions([]);
         setchargingLogData((prevValues) => ({
            ...prevValues,
            batteryno: "",
            drone_location_name: "",
        }));
    }

    })
    .catch(function (error) {
      console.error("Error during login:", error);
    });
  }
    return (
        <>
            <SidePopup show={openChargingPopup} onClose={closeChargingPopup} className="full-width" >
                <div className="df jcsb profile-card-header brd-b1 p12 box-center bg7  w100 fc1 ls2 lh22">
                    <p className="fs18 fc1 ">Charging Log Form</p>
                    <button
                        onClick={closeChargingPopup}
                        className="lead-close-button"
                    >
                        X
                    </button>
                </div>
                <div className="pl32 w100 inst-upload-form">
                    <div className="df fww inst-form-upload jcsb mt16">
                        <div className="flx22 form-group-settings mr32 w100">
                            <label className="fc15 fw6 fs14 mb12 ls1">Date<span className="fc4">*</span></label>
                            <DatePicker
                                minDate={new Date()}
                                dateFormat={customDateFormat}
                                selected={chargingLogData.date}
                                onChange={handleDateChange}
                                placeholderText="-- Select Date --"
                                showIcon
                                isClearable={true}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                            />
                        </div>
                        {batteryId === 'all' ? (
                            <div className="flx22 form-group-settings mr32 w100">
                                <SingleDropdown
                                label="Battery Number"
                                options={batteryListOption}
                                selectedOption={chargingLogData.batterynoopt}
                                onSelect={handleSelectbatteryOption}
                                placeholder="Select battery number"
                                compulsory={<span className="fc4">*</span>}
                                />
                            
                            </div>
                        ) : (
                            <div className="flx22 form-group-settings mr32 w100">
                                <label className="df fc15 fs14 ls1 fw6">
                                Battery No.<span className="fc4">*</span>{' '}
                                <span className="fc12">{chargingLogData.drone_location_name && `(${chargingLogData.drone_location_name})`}</span>
                                </label>
                                <input
                                type="text"
                                name="batteryno"
                                
                                placeholder={`Enter Battery No. ${chargingLogData.drone_location_name || ''}`}
                                autoComplete="off"
                                className={`bg1 br4 h40 mt8 fs14 w100 p16 ${
                                    openBattery?.id || batteryId ? 'disabled-input bg10' : ''
                                }`}
                                value={chargingLogData.batteryno}
                                onChange={handleInputChange}
                                readOnly={(openBattery?.id || batteryId)}
                                />
                            </div>
                        )}
                        <div className="form-group-settings address-proof flx48 mr24 w100">
                            <TimePicker
                                fromTime={chargingLogData.start_time}
                                toTime={chargingLogData.end_time}
                                onTimeChange={handleChargingTimeChange}
                                compulsory={<span className="fc4">*</span>}
                            />
                        </div>
                        <div className="flx22 form-group-settings mr32 w100">
                            <label className="df fc15 fs14 ls1 fw6">
                            Start Voltage<span className="fc4">*</span>
                            </label>
                            <input
                                type="number"
                                name="startVoltage"
                                placeholder="Enter Start Voltage"
                                autoComplete="off"
                                max={100}
                                className="bg1 br4 h40 mt8 fs14 w100 p16"
                                value={chargingLogData.startVoltage}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flx22 form-group-settings mr32 w100">
                            <label className="df fc15 fs14 ls1 fw6">
                            Final Voltage<span className="fc4">*</span>
                            </label>
                            <input
                                type="number"
                                name="finalVoltage"
                                placeholder="Enter Final Voltage"
                                autoComplete="off"
                                className="bg1 br4 h40 mt8 fs14 w100 p16"
                                value={chargingLogData.finalVoltage}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flx22 form-group-settings mr32 w100">
                            <label className="df fc15 fs14 ls1 fw6">
                            After Charging (mAH)<span className="fc4">*</span>
                            </label>
                            <input
                                type="number"
                                name="chargingVoltage"
                                placeholder="Enter After Charging Voltage"
                                autoComplete="off"
                                className="bg1 br4 h40 mt8 fs14 w100 p16"
                                value={chargingLogData.chargingVoltage}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flx22 form-group-settings mr32 w100">
                            <p className="fc15 fw6 fs14 ls1 mb8">Drone ID (UIN)</p>
                            <MultiDropdown
                                label={`Drone UIN`}
                                options={droneListOptions}
                                selectedValues={chargingLogData.droneUid}
                                onSelect={handleSelectBatteries}
                                searchable
                                chips="4"
                            />
                        </div>
                        <div className="form-group-settings searching-drop meta-grp w100">
                            <p className="fc15 fw6 fs14 ls1">Remarks</p>
                            <textarea
                                id="remarks"
                                name="remarks"
                                placeholder="Enter description or notes"
                                value={chargingLogData.remarks}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="button-container charging-status mt32 tac w100">
                            {openBatteryEdit?.id ? 
                            (<button type="button" onClick={handleAddChargingCommentPopup} className={`update-button btn-blue`}>Update</button>)
                            :(<button type="button" onClick={handleAddChargingCommentPopup} className={`update-button btn-blue`}>Add</button>)}
                            
                            <button
                                type="button"
                                className="btn-cancel clear"
                                onClick={closeChargingPopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </SidePopup>
            <ToastContainer position="bottom-right" />
        </>
    )
}

export default ChargingLogForm;