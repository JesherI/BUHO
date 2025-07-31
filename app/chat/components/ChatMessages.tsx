// ...existing code...
import React, { useRef, useEffect, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

// GlitchReveal: animación de texto tipo "glitch" que se va revelando
const GLITCH_CHARS = "█▓▒░<>/|\\!@#$%^&*()_-=+[]{};:,.?";
function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

const GlitchReveal = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [glitch, setGlitch] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    let revealTimeout: NodeJS.Timeout;
    if (step < text.length) {
      revealTimeout = setTimeout(() => {
        setDisplayed(text.slice(0, step + 1));
        setStep(step + 1);
      }, 40 + Math.random() * 60);
      setGlitch(
        Array.from({ length: text.length - step - 1 })
          .map(() => randomGlitchChar())
          .join("")
      );
    } else {
      setGlitch("");
    }
    return () => {
      clearTimeout(revealTimeout);
    };
  }, [step, text]);

  useEffect(() => {
    setDisplayed("");
    setStep(0);
  }, [text]);

  return (
    <span className="font-mono text-amber-300 glitch-reveal">
      {displayed}
      <span className="text-gray-500/60">{glitch}</span>
      <style jsx>{`
        .glitch-reveal {
          letter-spacing: 0.03em;
          filter: contrast(1.2) brightness(1.1);
          text-shadow: 0 0 2px #fff2, 0 0 8px #fbbf24aa;
        }
      `}</style>
    </span>
  );
};

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
          // Glitch reveal animation for "Pensando..."
          if (msg.sender === "assistant" && msg.text === "Pensando...") {
            return (
              <div key={index} className="w-full mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="max-w-[80%] bg-gray-800 text-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm text-sm leading-relaxed">
                    <GlitchReveal text="Generando respuesta..." />
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
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
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
