import React, { useRef, useEffect, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ newMessage, setNewMessage, sendMessage }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES';
      
      recognitionInstance.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          setNewMessage(transcript);
        }
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [setNewMessage]);
  
  // Ajustar altura del textarea cuando cambia el contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = 120; 
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxHeight) + "px";
    }
  }, [newMessage]);
  
  // Enfocar el textarea al cargar el componente
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  
  // Función para manejar el reconocimiento de voz
  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert('El reconocimiento de voz no está disponible en este navegador.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };
  
  return (
    <div className="flex-shrink-0 w-full border-t border-black bg-black backdrop-blur-sm safe-area-bottom">
      <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-end gap-1 sm:gap-2 bg-black/90 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-900">
            <div className="flex-1 max-h-22 overflow-hidden">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none px-2 sm:px-3 py-2 focus:outline-none text-sm leading-relaxed overflow-y-auto"
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
              <button 
                onClick={toggleVoiceRecognition}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-all duration-200 group border ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-500' 
                    : 'bg-black hover:bg-gray-900 text-amber-400 hover:text-amber-300 border-gray-800'
                }`} 
                aria-label={isListening ? "Detener grabación" : "Grabar mensaje de voz"}
              >
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute inset-0 rounded-xl bg-red-400 animate-pulse opacity-50"></div>
                      <div className="absolute -inset-1 rounded-xl bg-red-300 animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute -inset-2 rounded-xl bg-red-200 animate-ping opacity-20" style={{animationDelay: '1s'}}></div>
                    </div>
                  </>
                )}
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-black disabled:text-gray-500 text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed border border-gray-800"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center px-2">
            {isListening ? (
              <span className="text-red-400 animate-pulse flex items-center justify-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Escuchando... Habla ahora</span>
                <span className="sm:hidden">Escuchando...</span>
              </span>
            ) : (
              <span className="hidden sm:inline">Presiona Enter para enviar, Shift+Enter para nueva línea</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
