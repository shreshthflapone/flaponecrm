import React from "react";
import "./TimePicker.css";


const TimePicker = ({ fromTime, toTime, onTimeChange, compulsory ,isDisabled=false}) => {
  const handleTimeChange = (e, field, period) => {
    const { name, value } = e.target;
    let newValue = value.replace(/\D/g, ""); // Extract digits only
  
    if (name === "hour") {
      newValue = Math.min(12, Math.max(1, parseInt(newValue, 10) || 1)).toString().padStart(2, '0');
    } else if (name === "minute") {
      newValue = Math.min(59, Math.max(0, parseInt(newValue, 10) || 0)).toString().padStart(2, '0');
    } else if (name === "ampm") {
      newValue = value;
    }
  
    const time = period === "from" ? { ...fromTime } : { ...toTime };
    time[name] = newValue;
    onTimeChange(time, period);
  };

  return (
    <div className="time-picker fww">
      <div className="time-row df fdc">
        <label className="fc15 fw6 fs14 ls1">Start Time: {compulsory}</label>
        <div className="time-inp mt12 custom-select">
          <select
            name="hour"
            value={fromTime.hour}
            onChange={(e) => handleTimeChange(e, "hour", "from")}
            className={`mr4 bg5 ${isDisabled ? "disabled-input bg6" : ""}`}
            disabled={isDisabled}
          >
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          :
          <select
            name="minute"
            value={fromTime.minute}
            onChange={(e) => handleTimeChange(e, "minute", "from")}
            className={`ml4 bg5 ${isDisabled ? "disabled-input bg6" : ""}`}
            disabled={isDisabled}
          >
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <select
            name="ampm"
            value={fromTime.ampm}
            onChange={(e) => handleTimeChange(e, "ampm", "from")}
            className={`ml8 bg5 ${isDisabled ? "disabled-input bg6" : ""}`}
            disabled={isDisabled}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div className="time-row df fdc">
        <label className="fc15 fw6 fs14 ls1 ml16">End Time: {compulsory}</label>
        <div className="time-inp v-center mt12 custom-select">
          <p className="hy">-</p>
          <select
            name="hour"
            value={toTime.hour}
            onChange={(e) => handleTimeChange(e, "hour", "to")}
            className={`mr4 bg5 ${isDisabled ? "disabled-input bg6" : ""}`}
            disabled={isDisabled}
          >
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          :
          <select
            name="minute"
            value={toTime.minute}
            onChange={(e) => handleTimeChange(e, "minute", "to")}
            className={`ml4 bg5 ${isDisabled ? "disabled-input bg6" : ""}`}
            disabled={isDisabled}
          >
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <select
            name="ampm"
            value={toTime.ampm}
            onChange={(e) => handleTimeChange(e, "ampm", "to")}
            className={`ml8 bg5 ${isDisabled ? "disabled-input bg6" : ""}`}
            disabled={isDisabled}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
