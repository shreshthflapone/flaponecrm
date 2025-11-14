import React, { useState, useEffect, useRef } from "react";
// import "./CardSlider.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ImArrowDown, ImArrowUp } from "react-icons/im";

const CardSlider = () => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedCardData, setSelectedCardData] = useState(null); // Store selected card data

  const cardData = [
    {
      title: "Worked Leads",
      value: "8000",
      percentage: "45%",
      progress: false,
      color: "#f1856d",
      breakdown: [],
    },
    {
      title: "New",
      value: "200",
      percentage: "10%",
      progress: true,
      color: "#f9c82a",
      breakdown: [
        {
          name: "Worked",
          progress: 80,
          count: 12000,
          color: "#f9c82a",
          tab: "payments",
          status_type: ["success"],
        },
        {
          name: "Pending",
          progress: 20,
          count: 1500,
          color: "#b5e51d",
          tab: "payments",
          status_type: ["pending"],
        },
      ],
    },
    {
      title: "Booked",
      value: "3",
      percentage: "13%",
      progress: true,
      color: "#35a653",
      breakdown: [
        { name: "Received Amount", progress: 50, count: 2, color: "#4caf50" },
        { name: "Pending", progress: 50, count: 1, color: "#ff9800" },
      ],
    },
    {
      title: "Hot",
      value: "25",
      percentage: "",
      progress: true,
      color: "#f1856d",
      breakdown: [
        { name: "Missed Followup", progress: 60, count: 15, color: "#ff5722" },
        {
          name: "Upcoming Follow-up",
          progress: 40,
          count: 10,
          color: "#60c364e3",
        },
      ],
    },
    {
      title: "Interested",
      value: "125",
      percentage: "",
      progress: true,
      color: "#f1856d",
      breakdown: [
        { name: "Missed Followup", progress: 70, count: 88, color: "#ff5722" },
        {
          name: "Upcoming Follow-up",
          progress: 30,
          count: 37,
          color: "#60c364e3",
        },
      ],
    },
    {
      title: "Call Later",
      value: "600",
      percentage: "",
      progress: true,
      color: "#f1856d",
      breakdown: [
        { name: "Missed Followup", progress: 50, count: 300, color: "#ff5722" },
        {
          name: "Upcoming Follow-up",
          progress: 50,
          count: 300,
          color: "#60c364e3",
        },
      ],
    },
    {
      title: "No Response",
      value: "150",
      percentage: "",
      progress: true,
      color: "#e91e63",
      breakdown: [
        { name: "Missed Followup", progress: 60, count: 90, color: "#ff5722" },
        {
          name: "Upcoming Follow-up",
          progress: 40,
          count: 60,
          color: "#60c364e3",
        },
      ],
    },
    {
      title: "Not Interested",
      value: "75",
      percentage: "",
      progress: true,
      color: "#9c27b0",
      breakdown: [
        { name: "Wrong Number", progress: 35, count: 35, color: "#f47952" },
        { name: "Wrong Email", progress: 15, count: 15, color: "#ff5f2ca8" },
        { name: "Spam", progress: 18, count: 18, color: "#e55122" },
        { name: "Test Leads", progress: 32, count: 22, color: "#ff5722" },
      ],
    },
    {
      title: "Junk",
      value: "50",
      percentage: "",
      progress: false,
      color: "#607d8b",
      breakdown: [
        { name: "Wrong Number", progress: 35, count: 35, color: "#f47952" },
        { name: "Wrong Email", progress: 15, count: 15, color: "#ff5f2ca8" },
        { name: "Spam", progress: 18, count: 18, color: "#e55122" },
        { name: "Test Leads", progress: 32, count: 22, color: "#ff5722" },
      ],
    },
  ];

  const slideLeft = () => {
    sliderRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const updateScrollState = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateScrollState();
    const slider = sliderRef.current;
    slider.addEventListener("scroll", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
    };
  }, []);
  const handleCardClick = (index) => {
    if (selectedCard === index) {
      setSelectedCard(null);
      setSelectedCardData(null);
    } else {
      console.log("Select card",cardData[index])
      setSelectedCard(index);
      setSelectedCardData(cardData[index]);
    }
  };

  return (
    <div className="ld-slider-container">
      <button
        className="ld-slide-btn ld-slide-left box-center"
        onClick={slideLeft}
        disabled={!canScrollLeft}
      >
        <FaChevronLeft className="fs14" />
      </button>
      <div className="ld-slider" ref={sliderRef}>
        {cardData.map((card, index) => (
          <div
            className={`ld-card pr ${selectedCard === index ? "bg6" : "bg5"}`}
            key={index}
            onClick={() => handleCardClick(index)}
          >
            <div className="p8">
              <h3>{card.title}</h3>
              <p className="ld-value box-center">
                {card.value}
                {card.percentage && (
                  <span className={`ml8 ld-percentage ld-negative v-center`}>
                    {card.percentage}
                  </span>
                )}
              </p>
            </div>

            {card.breakdown.length > 0 && (
              <div className="progress-container">
                {card.breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="progress-segment"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                      letterSpacing: "0.4px",
                    }}
                    data-tooltip={`${item.name}: ${item.count}\nPercentage: ${item.progress}%`}
                    // onClick={() => handleSegmentClick(item)}
                  ></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="ld-slide-btn ld-slide-right box-center"
        onClick={slideRight}
        disabled={!canScrollRight}
      >
        <FaChevronRight className="fs14" />
      </button>
    </div>
  );
};

export default CardSlider;
