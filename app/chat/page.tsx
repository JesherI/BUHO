"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/firebase"; // Ajusta la ruta si es diferente

import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import ProfileCard from "../profile/page";

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [loading, setLoading] = useState(true);

  const openProfileCard = () => setShowProfileCard(true);
  const closeProfileCard = () => setShowProfileCard(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/header");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const scrollToBottom = () => {
    (messagesEndRef.current as HTMLDivElement | null)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { text: newMessage, sender: "user" }]);
    setNewMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Esta es una respuesta de ejemplo del asistente.",
          sender: "assistant",
        },
      ]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-gray-900">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-80" : "ml-0"
          }`}
      >
        {/* Navbar fijo */}
        <div className="fixed top-0 left-0 w-full z-40">
          <Navbar showAuth={false} toggleSidebar={toggleSidebar}>
            <ProfileMenu onProfileClick={openProfileCard} />
          </Navbar>
        </div>

        {/* Agrega padding-top para no tapar el contenido */}
        <div className="flex-1 flex flex-col min-h-0 pt-16 transition-all duration-300">
          {/* Estado vacío */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md px-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-white">
                  ¡Hola! ¿En qué puedo ayudarte?
                </h1>
                <p className="text-gray-400 text-sm">
                  Escribe tu mensaje o usa el micrófono para empezar
                </p>
              </div>
            </div>
          )}

          {/* Contenedor de mensajes con scroll */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="w-full max-w-3xl mx-auto px-4 py-4 space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className="w-full">
                    {msg.sender === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-gradient-to-r from-[#f5deb3] via-[#d4af37] to-[#cfae7b] text-black px-4 py-3 rounded-2xl rounded-br-md shadow-md">
                          <p className="text-sm leading-relaxed font-medium break-words">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <div className="max-w-[80%] bg-gray-800 text-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>
          )}

          {/* Input de chat */}
          <div className="flex-shrink-0 w-full border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="relative">
                <div className="flex items-end gap-2 bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-700">
                  <div className="flex-1 min-h-[44px] max-h-32 overflow-y-auto">
                    <textarea
                      className="w-full bg-transparent text-white placeholder-gray-400 resize-none px-3 py-2 focus:outline-none text-sm leading-relaxed"
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      rows={1}
                      style={{
                        height: "auto",
                        minHeight: "44px",
                      }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height =
                          Math.min(e.target.scrollHeight, 128) + "px";
                      }}
                    />
                  </div>

                  <div className="flex gap-1">
                    <button
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 text-amber-400 hover:text-amber-300 transition-all duration-200 group"
                      aria-label="Grabar mensaje de voz"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 1.75a2.75 2.75 0 00-2.75 2.75v6a2.75 2.75 0 105.5 0v-6A2.75 2.75 0 0012 1.75z" />
                        <path
                          fillRule="evenodd"
                          d="M5 10.5a7 7 0 0014 0 .75.75 0 011.5 0 8.5 8.5 0 01-7.25 8.42v2.08h2a.75.75 0 010 1.5h-5a.75.75 0 010-1.5h2v-2.08A8.5 8.5 0 013.5 10.5a.75.75 0 011.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Presiona Enter para enviar, Shift+Enter para nueva línea
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfileCard && <ProfileCard onClose={closeProfileCard} />}

      {/* Scrollbar styles */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}
