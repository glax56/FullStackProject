import React from "react";
import { useNavigate } from "react-router-dom";

import("./index.css");

function Header() {
  const navigate = useNavigate();

  const takeHome = () => {
    navigate("/");
  };

  return (
    <div className="app__header">
      <div onClick={takeHome}>Alternakraft</div>
    </div>
  );
}

export default Header;

//Alternakraft
