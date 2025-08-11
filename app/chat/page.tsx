"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getDoc, query, orderBy, doc, updateDoc, } from "firebase/firestore";
import { auth, db } from "../db/firebase";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import ProfileCard from "../profile/ProfileCard";
import { sendToGemini, generateChatTitle } from "../lib/gemini";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { getOrCreateChat, saveMessage, saveConversationSummary } from "./utils/chatUtils";
import { getUserContext } from "./utils/userContext";





export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState("Nuevo Chat");

  useEffect(() => {
    const updateChatFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const chatId = searchParams.get('id');
      setCurrentChatId(chatId);
    };

    updateChatFromUrl();

    window.addEventListener('popstate', updateChatFromUrl);

    const handleUrlChange = () => {
      setTimeout(updateChatFromUrl, 0);
    };

    window.addEventListener('urlchange', handleUrlChange);


    return () => {
      window.removeEventListener('popstate', updateChatFromUrl);
      window.removeEventListener('urlchange', handleUrlChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/log-in");
        return;
      }
      setUserId(user.uid);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadChat = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        let chatId = currentChatId;

        if (chatId) {
          try {
            const chatRef = doc(db, "users", userId, "chats", chatId);
            const chatDoc = await getDoc(chatRef);

            if (chatDoc.exists()) {
              const chatData = chatDoc.data();
              setChatTitle(chatData.title || "Chat sin título");
            } else {
              chatId = await getOrCreateChat("Nuevo Chat", "General", userId, true);
              setCurrentChatId(chatId);
              setChatTitle("Nuevo Chat");
              window.history.replaceState(null, '', `/chat?id=${chatId}`);
            }
          } catch (error) {
            console.error("Error al verificar el chat:", error);
            chatId = await getOrCreateChat("Nuevo Chat", "General", userId, true);
            setCurrentChatId(chatId);
            setChatTitle("Nuevo Chat");
            window.history.replaceState(null, '', `/chat?id=${chatId}`);
          }
        } else {
          chatId = await getOrCreateChat("Nuevo Chat", "General", userId, true);
          setCurrentChatId(chatId);
          setChatTitle("Nuevo Chat");

          window.history.replaceState(null, '', `/chat?id=${chatId}`);
        }

        const messagesRef = collection(db, "users", userId, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const messagesSnapshot = await getDocs(q);
        const loadedMessages = messagesSnapshot.docs.map(doc => doc.data());

        const sortedMessages = loadedMessages
          .filter(msg => msg.text && msg.sender)
          .map(msg => ({
            text: msg.text,
            sender: msg.sender
          }));

        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error al inicializar el chat:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [userId, currentChatId]);
  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !currentChatId || isSubmitting) return;

    const userMessage = newMessage.trim();

    setIsSubmitting(true);

    try {
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setNewMessage("");

      if (messages.length === 0 && chatTitle === "Nuevo Chat") {
        try {
          const aiGeneratedTitle = await generateChatTitle(userMessage);
          setChatTitle(aiGeneratedTitle);

          const chatRef = doc(db, "users", userId, "chats", currentChatId);
          await updateDoc(chatRef, { title: aiGeneratedTitle });
        } catch (error) {
          console.error("Error al generar o actualizar el título del chat:", error);
          const fallbackTitle = userMessage.length > 30 ? userMessage.substring(0, 27) + "..." : userMessage;
          setChatTitle(fallbackTitle);
          
          try {
            const chatRef = doc(db, "users", userId, "chats", currentChatId);
            await updateDoc(chatRef, { title: fallbackTitle });
          } catch (updateError) {
            console.error("Error al actualizar título de respaldo:", updateError);
          }
        }
      }

      try {
        await saveMessage(userId, currentChatId, userMessage, "user");
      } catch (error) {
        console.error("Error al guardar mensaje del usuario:", error);
      }


      setMessages((prev) => [...prev, { text: "Pensando...", sender: "assistant" }]);

      try {
        const userContext = await getUserContext(userId);

        const response = await sendToGemini(userMessage, messages, userContext);

        console.log("Respuesta de Gemini:", response);

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: response, sender: "assistant" },
        ]);

        await saveMessage(userId, currentChatId, response, "assistant");

        if (messages.length <= 2) {
          try {
            await saveConversationSummary(userId, currentChatId, userMessage, chatTitle);
          } catch (error) {
            console.error("Error al guardar resumen de conversación:", error);
          }
        }
      } catch (err) {
        console.error("Error al generar respuesta:", err);

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: "Lo siento, ha ocurrido un error al generar la respuesta. Por favor, intenta de nuevo.", sender: "assistant" },
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="text-gray-300 mt-4 text-lg">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
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
              <div className="text-center space-y-6 max-w-md px-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-white">¡Hola! ¿En qué puedo ayudarte hoy?</h1>
                <p className="text-gray-400 text-sm">Escribe tu mensaje para comenzar una conversación con el asistente</p>
                <div className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {[
                      "¿Cómo puedo mejorar mi productividad?",
                      "Dame ideas para mi próximo proyecto",
                      "Explícame un concepto complejo de forma sencilla",
                      "Ayúdame a resolver un problema"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        className="bg-black/50 hover:bg-gray-900 text-left px-4 py-3 rounded-xl text-sm text-white transition-colors border border-gray-800"
                        onClick={() => {
                          setNewMessage(suggestion);
                          setTimeout(() => {
                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                              textarea.focus();
                            }
                          }, 0);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
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
