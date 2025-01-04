import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
const Button = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="link" onClick={() => navigate("/betting")}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      {title}
    </div>
  );
};

export default Button;
