import React from "react";
import "../components/Box.css";

const Box = ({
  course,
  currentPlanName,
  className,
  planData,
  onViewAllClick,
}) => {
  const calculateGST = (price) => {
    const gstPercentage = 18;
    const gstAmount = (price * gstPercentage) / 100;
    return gstAmount;
  };

  const basePrice = parseInt(course.coursePrice.INR.price, 10);
  const gstAmount = calculateGST(basePrice);
  const finalPrice = basePrice + gstAmount;

  return (
    <div className={`boxbd p12 ${className}`}>
      <div className="v-center">
        <p className="fs16 fw5 fc15 lh22">{course.courseName}</p>
      </div>
      <div className="plan mt16">
        <ul className="pl16 list-unstyled fs14">
          {Object.keys(course.courseHighlights).map((key) => (
            <li className="mb8 fc16 lh22 ls1" key={key}>
              {key}: {course.courseHighlights[key]}
            </li>
          ))}
        </ul>
      </div>
      {course.coursePrice.INR.price && (
        <div id="price" className="mt16 fc17 mb8">
          {course.coursePrice.INR.price &&
            (course.coursePrice.INR.tax_status === "1" ? (
              <div className="df w100 mt16 mb8 fww box-container jce">
                {/*
                <div className="box-center fdc">
                  <p className="label fc8 fs14 ls1 lh18 mb4 fw6">Course Fee</p>
                  <p className="value fc5 fs16 ls1 lh18">
                    ₹{course.coursePrice.INR.price}
                  </p>
                </div>

                <div className="box-center fdc ml12">
                  <p className="label fc8 fs18 ls1 lh18">+</p>
                </div>
                <div className="box-center fdc ml12">
                  <p className="label fc8 fs14 ls1 lh18 mb4 fw6">GST (18%)</p>
                  <p className="value fc5 fs16 ls1 lh18">
                    ₹{course.coursePrice.INR.gstprice}
                  </p>
                </div>
                <div className="box-center fdc ml12">
                  <p className="label fc6 fs18 ls1 lh18">=</p>
                </div>
	    */}
                {course.coursePrice.INR.totalprice && <div className="v-center ml12 total-fee">
                  <p className="label fc8 fs14 ls1 lh18 fw6 mr8">Course Fee:</p>
                  <p className="value total-price fc1 ml4 fs20">
                    ₹{course.coursePrice.INR.totalprice}
                  </p>
                </div>}
              </div>
            ) : (
              <div className="df w100 mt16 mb8 jce">
                {/* <div className="box-center fdc">
                  <p className="label fc8 fs14 ls1 lh18 mb4 fw6">Course Fee</p>
                  <p className="value fc5 fs16 ls1 lh18">
                    ₹{course.coursePrice.INR.price}
                  </p>
                </div>

                <div className="box-center fdc ml12">
                  <p className="label fc8 fs18 ls1 lh18">+</p>
                </div>
                <div className="box-center fdc ml12">
                  <p className="label fc8 fs14 ls1 lh18 mb4 fw6">GST (18%)</p>
                  <p className="value fc5 fs16 ls1 lh18">(Including)</p>
                </div>
                <div className="box-center fdc ml12">
                  <p className="label fc6 fs18 ls1 lh18">=</p>
                </div>
		*/}
                <div className="v-center ml12">
                  <p className="label fc8 fs14 ls1 lh18 fw6 mr8">Course Fee:</p>
                  <p className="value total-price fc1 ml4 fs20">
                    ₹{course.coursePrice.INR.totalprice}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="df jce mt16 ls3 aic">
        <p className="fs14 cp tdu fc1" onClick={() => onViewAllClick(course)}>
          View
        </p>
      </div>
    </div>
  );
};

export default Box;
