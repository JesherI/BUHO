"use client";
import React, { useEffect, useState } from "react";
import "./header.css";
import Sidebar from "../sidebar/sidebar";
import ProfileMenu from "../profileMenu/profileMenu";

const Header: React.FC = () => {
  const fullText = "Bienvenido a Buho";
  const [displayedText, setDisplayedText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setShowSidebar(true);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1 className="title">
            {displayedText}
            <span className="cursor">|</span>
          </h1>
          <p className="subtitle">
            Tu asistente inteligente para aprender y resolver dudas.
          </p>
          <button className="start-button" onClick={handleStart}>
            Comenzar
          </button>
        </div>
        <div className="header-right">
          <ProfileMenu />
        </div>
      </header>
      {showSidebar && <Sidebar />}
    </>
  );
};

export default Header;
