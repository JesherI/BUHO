import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Conversation } from './types';

interface ChatListProps {
  conversations: Conversation[];
}

const ChatList: React.FC<ChatListProps> = ({ conversations }) => {
  return (
    <div className="p-4">
      <button className="w-full bg-yellow-600/80 hover:bg-yellow-500/80 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium mb-6 shadow-lg cursor-pointer">
        <PlusCircle size={16} />
        Nuevo Chat
      </button>
      
      <div className="space-y-3">
        {conversations.map((conv) => (
          <div
            key={conv.id}
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
        ))}
      </div>
    </div>
  );
};

export default ChatList;