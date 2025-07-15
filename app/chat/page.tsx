"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/firebase";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import ProfileCard from "../profile/page";

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true); // <--- NUEVO estado
  const messagesEndRef = useRef(null);
  const router = useRouter();

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

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/log-in");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
        <p className="text-gray-300">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-900/65 text-white overflow-hidden relative">
      <div
        className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
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
        <div className="fixed top-0 left-0 w-full z-40">
          <Navbar showAuth={false} toggleSidebar={toggleSidebar}>
            <ProfileMenu onProfileClick={handleProfileClick} />
          </Navbar>
        </div>

        <div className="flex-1 flex flex-col min-h-0 pt-16 transition-all duration-300">
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

          {messages.length > 0 && (
            <div
              className={`flex flex-col flex-1 transition-all duration-500 ease-in-out transform ${isSidebarOpen
                  ? "md:ml-80 md:scale-[0.97] md:translate-x-2"
                  : "scale-100 translate-x-0"
                }`}
            >
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

          <div className="flex-shrink-0 w-full border-t border-gray-800 bg-neutral-900/65 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="relative">
                <div className="flex items-end gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-neutral-900/25">
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
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 128) + "px";
                      }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 text-amber-400 hover:text-amber-300 transition-all duration-200 group"
                      aria-label="Grabar mensaje de voz"
                    >

                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                    >

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

      {showProfile && <ProfileCard key={Date.now()} onClose={() => setShowProfile(false)} />}
    </div>
  );
}
