import React, { useState, useEffect } from "react";
import "./CalendarComponent.css";
import calendarData from "../data/calendarData.json";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const years = Array.from({ length: 5 }, (_, i) => 2020 + i);
  // const currentYear = new Date().getFullYear();
  // const years = Array.from(
  //   { length: currentYear - 2000 + 1 },
  //   (_, i) => 2020 + i
  // );

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const tempDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      message: "",
      backgroundColor: "",
      color: "",
    }));

    calendarData.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        const dayIndex = eventDate.getDate() - 1;
        if (tempDays[dayIndex]) {
          tempDays[dayIndex].message = event.message;
          tempDays[dayIndex].backgroundColor = event.backgroundColor;
          tempDays[dayIndex].color = event.color;
        }
      }
    });

    const daysWithPadding = [...Array(firstDay).fill(null), ...tempDays];
    setDays(daysWithPadding);
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value, 10);
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
  };

  return (
    <div className="calendar-container">
      <div className="cust-calendar df fdc w100">
        <div className="calendar-nav bg1 pt12 pb12 fc3 v-center jcsb pl12 pr12 fs18 ls1 lh22">
          <button onClick={handlePrevMonth} className="fs24 fc3 cp v-center">
            <RiArrowLeftDoubleLine />
          </button>

          <div className="calendar-month-year">
            <select
              onChange={handleMonthChange}
              value={currentMonth.getMonth()}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            <select
              onChange={handleYearChange}
              value={currentMonth.getFullYear()}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleNextMonth} className="fs24 fc3 cp v-center">
            <RiArrowRightDoubleFill />
          </button>
        </div>

        <div className="calendar-header df fc1 fw5 fs14 ls2 bg8">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-body df fww">
          {days.map((day, index) => (
            <div
              key={index}
              className="calendar-day"
              style={{
                backgroundColor: day?.backgroundColor || "transparent",
                color: day?.color || "#000000",
              }}
            >
              {day && (
                <>
                  <div className="date fw6 mb4">{day.date.getDate()}</div>
                  <div
                    className="message-inside lh18 fs12 ls1 pt8"
                    style={{
                      color: day?.color || "#8b8f92",
                    }}
                  >
                    {day.message}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-messages mt16">
        <p className="fs14 fw6 ls1 lh16">Attendance List</p>
        {days.map(
          (day, index) =>
            day?.message && (
              <div
                key={index}
                className="message-item fc6 mb12 lh18 fs12 ls1 pt8"
              >
                <p className="fw6 fs14">{day.date.toDateString()}:</p>{" "}
                {day.message}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Calendar;
