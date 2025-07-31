import React from "react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ newMessage, setNewMessage, sendMessage }) => {
  return (
    <div className="flex-shrink-0 w-full border-t border-gray-800 bg-neutral-900/65 backdrop-blur-sm">
      <div className="w-full px-4 py-4">
        <div className="relative max-w-3xl mx-auto">
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
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 128) + "px";
                }}
              />
            </div>
            <div className="flex gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-600 text-amber-400 hover:text-amber-300 transition-all duration-200 group" aria-label="Grabar mensaje de voz">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
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
