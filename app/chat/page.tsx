"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../db/firebase";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import ProfileCard from "../profile/page";
import { sendToGemini } from "../lib/gemini";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

// 🔧 Crea o recupera chat por título y categoría
async function getOrCreateChat(title: string, category: string, userId: string) {
  try {
    // Buscar chat existente
    const chatsRef = collection(db, "users", userId, "chats");
    const q = query(chatsRef, where("title", "==", title), where("category", "==", category));
    const snapshot = await getDocs(q);

    // Si existe, devolver su ID
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    // Si no existe, crear uno nuevo
    const newChatRef = await addDoc(chatsRef, {
      title,
      category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return newChatRef.id;
  } catch (error) {
    console.error("Error al crear o recuperar chat:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
}

// 💬 Guarda un mensaje
async function saveMessage(userId: string, chatId: string, text: string, sender: "user" | "assistant") {
  try {
    // Referencia a la colección de mensajes
    const messagesRef = collection(db, "users", userId, "chats", chatId, "messages");
    
    // Añadir el mensaje
    const docRef = await addDoc(messagesRef, {
      text,
      sender,
      timestamp: serverTimestamp(),
    });
    
    // Actualizar timestamp del chat para ordenar por último mensaje
    const chatRef = doc(db, "users", userId, "chats", chatId);
    await updateDoc(chatRef, {
      updatedAt: serverTimestamp(),
      lastMessage: text.substring(0, 100) // Guardar una vista previa del último mensaje
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    throw error;
  }
}

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

  
  // Obtener el ID del chat de la URL si existe
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const chatId = searchParams.get('id');
    
    if (chatId) {
      setCurrentChatId(chatId);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  // Efecto para manejar la autenticación
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

  // Efecto para cargar o crear chat cuando cambie el usuario o el chatId de la URL
  useEffect(() => {
    const loadChat = async () => {
      if (!userId) return;
      
      setLoading(true);
      
      try {
        let chatId = currentChatId;
        
        // Si ya tenemos un ID de chat (de la URL), cargar ese chat
        if (chatId) {
          try {
            // Verificar que el chat existe y pertenece al usuario
            const chatRef = doc(db, "users", userId, "chats", chatId);
            const chatDoc = await getDoc(chatRef);
            
            if (chatDoc.exists()) {
              const chatData = chatDoc.data();
              setChatTitle(chatData.title || "Chat sin título");
            } else {
              // Si el chat no existe, crear uno nuevo
              chatId = await getOrCreateChat("Nuevo Chat", "General", userId);
              setCurrentChatId(chatId);
              setChatTitle("Nuevo Chat");
              window.history.replaceState(null, '', `/chat?id=${chatId}`);
            }
          } catch (error) {
            console.error("Error al verificar el chat:", error);
            // Si hay error, crear un nuevo chat
            chatId = await getOrCreateChat("Nuevo Chat", "General", userId);
            setCurrentChatId(chatId);
            setChatTitle("Nuevo Chat");
            window.history.replaceState(null, '', `/chat?id=${chatId}`);
          }
        } else {
          // Si no hay ID de chat, crear uno nuevo
          chatId = await getOrCreateChat("Nuevo Chat", "General", userId);
          setCurrentChatId(chatId);
          setChatTitle("Nuevo Chat");
          
          // Actualizar la URL con el ID del chat sin recargar la página
          window.history.replaceState(null, '', `/chat?id=${chatId}`);
        }
        
        // Cargar mensajes existentes
        const messagesRef = collection(db, "users", userId, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const messagesSnapshot = await getDocs(q);
        const loadedMessages = messagesSnapshot.docs.map(doc => doc.data());
        
        // Filtrar y mapear mensajes
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
    // Validar que hay un mensaje para enviar y que tenemos los datos necesarios
    if (!newMessage.trim() || !userId || !currentChatId || isSubmitting) return;

    const userMessage = newMessage.trim();
    
    // Establecer estado de envío
    setIsSubmitting(true);

    try {
      // Añadir mensaje del usuario a la interfaz
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setNewMessage("");
      
      // Si es el primer mensaje y el título es genérico, actualizarlo con el contenido del mensaje
      if (messages.length === 0 && chatTitle === "Nuevo Chat") {
        // Limitar el título a 50 caracteres
        const newTitle = userMessage.length > 50 
          ? userMessage.substring(0, 47) + "..."
          : userMessage;
        
        setChatTitle(newTitle);
        
        // Actualizar el título del chat en Firestore
        try {
          const chatRef = doc(db, "users", userId, "chats", currentChatId);
          await updateDoc(chatRef, { title: newTitle });
        } catch (error) {
          console.error("Error al actualizar el título del chat:", error);
        }
      }
      
      // Guardar mensaje del usuario en Firestore
      try {
        await saveMessage(userId, currentChatId, userMessage, "user");
      } catch (error) {
        console.error("Error al guardar mensaje del usuario:", error);
        // Continuar con el flujo aunque falle el guardado
      }

      // Mostrar indicador de carga
      setMessages((prev) => [...prev, { text: "Pensando...", sender: "assistant" }]);

      try {
        // Obtener respuesta de Gemini
        const response = await sendToGemini(userMessage);
        
        // Actualizar la interfaz con la respuesta
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: response, sender: "assistant" },
        ]);
        
        // Guardar respuesta en Firestore
        await saveMessage(userId, currentChatId, response, "assistant");
      } catch (err) {
        console.error("Error al generar respuesta:", err);
        
        // Mostrar mensaje de error en lugar del indicador de carga
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: "Lo siento, ha ocurrido un error al generar la respuesta. Por favor, intenta de nuevo.", sender: "assistant" },
        ]);
      }
    } finally {
      // Siempre restablecer el estado de envío
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
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
                        className="bg-white/10 hover:bg-white/20 text-left px-4 py-3 rounded-xl text-sm text-white transition-colors"
                        onClick={() => {
                          setNewMessage(suggestion);
                          // Enfocar el textarea después de establecer el mensaje
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
