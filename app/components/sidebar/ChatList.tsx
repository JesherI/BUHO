import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Conversation } from './types';

interface ChatListProps {
  conversations: Conversation[];
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, onNewChat, onSelectChat }) => {
  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      // Si no se proporciona una función, navegar a la página de chat
      window.location.href = '/chat';
    }
  };
  
  const handleSelectChat = (chatId: string) => {
    if (onSelectChat) {
      onSelectChat(chatId);
    } else {
      // Si no se proporciona una función, navegar a la página de chat con el ID
      window.location.href = `/chat?id=${chatId}`;
    }
  };
  
  return (
    <div className="p-4">
      <button 
        onClick={handleNewChat}
        className="w-full bg-yellow-600/80 hover:bg-yellow-500/80 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium mb-6 shadow-lg cursor-pointer"
      >
        <PlusCircle size={16} />
        Nuevo Chat
      </button>
      
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm">No hay conversaciones aún</p>
            <p className="text-gray-500 text-xs mt-1">Inicia un nuevo chat para comenzar</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectChat(conv.id)}
              className="p-4 rounded-xl bg-gray-950/60 hover:bg-gray-900/80 border border-gray-800 hover:border-yellow-200/20 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium text-sm truncate group-hover:text-yellow-100 transition-colors select-none">
                  {conv.title}
                </h3>
                <span className="text-xs text-yellow-200/60 ml-2 flex-shrink-0 bg-yellow-500/10 px-2 py-0.5 rounded-full select-none">
                  {conv.time}
                </span>
              </div>
              <p className="text-gray-400 text-xs truncate group-hover:text-gray-300 select-none">{conv.preview}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;