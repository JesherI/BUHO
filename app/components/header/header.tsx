"use client";
import React, { useEffect, useState } from "react";
import "./header.css";
import Sidebar from "../sidebar/sidebar";


const Header: React.FC = () => {
  const fullText = "Bienvenido a Buho";
  const [displayedText, setDisplayedText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); //  mostar Sidebar

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
    setShowSidebar(true); // Mostrar Sidebar al hacer clic
  };

  return (
    <>
      <header className="header">
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
      </header>

      {showSidebar && <Sidebar />} 
    </>
  );
};

export default Header;