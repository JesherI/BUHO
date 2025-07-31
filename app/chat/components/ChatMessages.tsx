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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div
      className={`flex-1 w-full px-4 overflow-y-auto transition-all duration-500 ease-in-out transform ${isSidebarOpen ? "md:scale-[0.97] md:translate-x-2" : "scale-100 translate-x-0"}`}
      style={{ minHeight: 0 }}
    >
      <div className="py-4 max-w-3xl mx-auto">
        {messages.map((msg, index) => {
          if (msg.sender === "assistant" && msg.text === "Pensando...") {
            return (
              <div key={index} className="w-full mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                  </div>
                  <div className="max-w-[80%] bg-gray-800 text-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm text-sm leading-relaxed">
                    Generando respuesta...
                  </div>
                </div>
              </div>
            );
          }
          // Mensaje normal
          return (
            <div key={index} className="w-full mb-6">
              {msg.sender === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-gradient-to-r from-[#f5deb3] via-[#d4af37] to-[#cfae7b] text-black px-4 py-3 rounded-2xl rounded-br-md shadow-md">
                    <p className="text-sm leading-relaxed font-medium break-words">{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                  </div>
                  <div className="max-w-[80%] bg-gray-800 text-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm text-sm leading-relaxed">
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
