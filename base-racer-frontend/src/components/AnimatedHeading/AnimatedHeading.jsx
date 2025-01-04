import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import TimerComponent from './../TimerComponent'

const AnimatedHeadings = ({ title, startDate = '' }) => {
  const navigate = useNavigate();
  return (
    <div className="link">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      {title}
      {startDate && <TimerComponent startDate={startDate} />}
    </div>
  );
};

export default AnimatedHeadings;
