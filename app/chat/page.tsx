"use client";

import { useState } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { text: "¡Hola! ¿En qué puedo ayudarte?", sender: "bot" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { text: newMessage, sender: "user" }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-black">
        <header className="bg-black text-yellow-400 text-base font-light p-4 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo Buho Chat"
            className="w-12 h-12 object-contain"
          />
            Buho Chat
        </header>


      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              i === 0
                ? "text-center text-white font-semibold text-lg py-4"
                : `max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gray-200 text-black self-end ml-auto"
                      : "bg-white text-gray-900 self-start mr-auto border"
                  }`
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2 border-t">
        <input
          type="text"
          className="flex-1 border border-amber-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 bg-transparent"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* Ícono micrófono */}
        <button
          className="group bg-transparent border border-amber-500 hover:border-amber-400 hover:bg-amber-500/20 active:border-white px-3 py-2 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Grabar mensaje de voz"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-amber-500 group-hover:text-amber-400 transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
        <path d="M12 1.75a2.75 2.75 0 00-2.75 2.75v6a2.75 2.75 0 105.5 0v-6A2.75 2.75 0 0012 1.75z" />
        <path
          fillRule="evenodd"
          d="M5 10.5a7 7 0 0014 0 .75.75 0 011.5 0 8.5 8.5 0 01-7.25 8.42v2.08h2a.75.75 0 010 1.5h-5a.75.75 0 010-1.5h2v-2.08A8.5 8.5 0 013.5 10.5a.75.75 0 011.5 0z"
          clipRule="evenodd"
        />
        </svg>
      </button>



        {/* Botón enviar */}
        <button
        onClick={sendMessage}
        className="group bg-transparent border border-amber-500 hover:border-amber-400 hover:bg-amber-500/10 active:border-white px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-200"
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-amber-500 group-hover:text-amber-400 transition-colors duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
        </button>
      </div>
    </div>
  );
}
