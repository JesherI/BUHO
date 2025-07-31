"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/firebase";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import ProfileCard from "../profile/page";
import { sendToGemini } from "../lib/gemini";

import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";


export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return; 
    const userMessage = newMessage.trim();
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setNewMessage("");
    setMessages((prev) => [...prev, { text: "Pensando...", sender: "assistant" }]);
    const response = await sendToGemini(userMessage);
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { text: response, sender: "assistant" },
    ]);
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
      <div className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-80" : "ml-0"}`}>
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
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-white">¡Hola! ¿En qué puedo ayudarte?</h1>
                <p className="text-gray-400 text-sm">Escribe tu mensaje o usa el micrófono para empezar</p>
              </div>
            </div>
          )}
          <ChatMessages messages={messages} isSidebarOpen={isSidebarOpen} />
          <ChatInput newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />
        </div>
      </div>

      {showProfile && <ProfileCard key={Date.now()} onClose={() => setShowProfile(false)} />}
    </div>
  );
}
