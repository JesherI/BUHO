"use client";
import React, { useEffect, useState } from "react";
import "./header.css";

const Header: React.FC = () => {
  const fullText = "Bienvenido a Buho";
  const [displayedText, setDisplayedText] = useState("");

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
    alert("¡Comenzando chat inteligente!"); // ir a la siguiente pag
  };

  return (
    <header className="header">
      <h1 className="title">
        {displayedText}
        <span className="cursor">|</span>
      </h1>
      <p className="subtitle">Tu asistente inteligente para aprender y resolver dudas.</p>
      <button className="start-button" onClick={handleStart}>Comenzar</button>
    </header>
  );
};

export default Header;
