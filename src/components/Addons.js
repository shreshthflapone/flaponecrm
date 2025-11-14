import React from "react";
import "../components/Box.css";

const Addons = ({ addon, className }) => {
  return (
    <div className={`boxbd p20 ${className}`}>
      <div className="v-center">
        <p className="fs20 fw5 fc15">{addon.name}</p>
      </div>
      <div className="plan mt16 fc16 lh22 ls1 fs14">{addon.text}</div>
      <div id="price" className="mt16 fw6 fc17">
        Rs
        <span className="real-price" style={{ textDecoration: "line-through" }}>
          ({addon.price})
        </span>
        <span className="offer-price">{addon.inauguralOffer}</span> / month
      </div>
    </div>
  );
};

export default Addons;
