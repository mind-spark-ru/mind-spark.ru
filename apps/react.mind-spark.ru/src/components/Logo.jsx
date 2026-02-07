import React from "react";
import logo from "../assets/images/LogoText.svg";
import "./Logo.css";

export default function Logo() {
  return (
    <div className="logo-page">
      <img src={logo} alt="MindSpark Logo" className="logo-img" />
    </div>
  );
}


