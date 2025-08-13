import React, { useRef, useEffect } from "react";
import Image from "next/image";
import MarkdownRenderer from "./MarkdownRenderer";

interface Message {
  text: string;
  sender: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isSidebarOpen: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isSidebarOpen }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Desplazamiento automático al último mensaje
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div
      className={`flex-1 w-full px-3 sm:px-4 overflow-y-auto transition-all duration-500 ease-in-out transform ${isSidebarOpen ? "md:scale-[0.97] md:translate-x-2" : "scale-100 translate-x-0"}`}
      style={{ minHeight: 0 }}
    >
      <div className="py-3 sm:py-4 max-w-3xl mx-auto">
        {messages.map((msg, index) => {
          if (msg.sender === "assistant" && msg.text === "Pensando...") {
            return (
              <div key={index} className="w-full mb-4 sm:mb-6">
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} priority className="sm:w-8 sm:h-8" />
                  </div>
                  <div className="max-w-[85%] sm:max-w-[80%] bg-black text-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-tl-md shadow-sm text-sm leading-relaxed border border-amber-500">
                    <div className="flex items-center">
                      <span>Generando respuesta</span>
                      <span className="ml-1 inline-flex">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          // Mensaje normal
          return (
            <div key={index} className="w-full mb-4 sm:mb-6">
              {msg.sender === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[80%] bg-gradient-to-r from-black via-gray-900 to-black text-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-br-md shadow-md border border-gray-700">
                    <p className="text-sm leading-relaxed font-medium break-words whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} priority className="sm:w-8 sm:h-8" />
                  </div>
                  <div className="max-w-[85%] sm:max-w-[80%] bg-black text-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-tl-md shadow-sm text-sm leading-relaxed overflow-auto border border-amber-500">
                    <MarkdownRenderer content={msg.text} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
