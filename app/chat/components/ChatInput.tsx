import React, { useRef, useEffect } from "react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ newMessage, setNewMessage, sendMessage }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Ajustar altura del textarea cuando cambia el contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + "px";
    }
  }, [newMessage]);
  
  // Enfocar el textarea al cargar el componente
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  
  return (
    <div className="flex-shrink-0 w-full border-t border-black bg-black backdrop-blur-sm">
      <div className="w-full px-4 py-4">
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-black/90 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-900">
            <div className="flex-1 min-h-[44px] max-h-32 overflow-y-auto">
              <textarea
                ref={textareaRef}
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
              />
            </div>
            <div className="flex gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-black hover:bg-gray-900 text-amber-400 hover:text-amber-300 transition-all duration-200 group border border-gray-800" aria-label="Grabar mensaje de voz">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-black disabled:text-gray-500 text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed border border-gray-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
