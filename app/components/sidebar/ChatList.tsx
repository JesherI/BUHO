import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Conversation } from './types';
import DeleteChatModal from './DeleteChatModal';

interface ChatListProps {
  conversations: Conversation[];
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string, chatTitle?: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, onNewChat, onSelectChat, onDeleteChat }) => {
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

  const handleDeleteClick = (e: React.MouseEvent, chatId: string, chatTitle: string) => {
    e.stopPropagation();
    if (onDeleteChat) {
      onDeleteChat(chatId, chatTitle);
    }
  };
  
  return (
    <div className="p-4">
      <div className="mx-1">
        <button 
          onClick={handleNewChat}
          className="w-full bg-gray-950/60 hover:bg-gray-900/80 text-gray-200 hover:text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium mb-6 border border-gray-800 hover:border-gray-200/20 cursor-pointer"
        >
          <PlusCircle size={16} />
          Nuevo Chat
        </button>
      </div>
      
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
              className="relative p-4 rounded-xl bg-gray-950/60 hover:bg-gray-900/80 border border-gray-800 hover:border-gray-200/20 cursor-pointer transition-all duration-200 group"
            >
              <div onClick={() => handleSelectChat(conv.id)} className="flex-1 pr-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium text-sm truncate group-hover:text-gray-100 transition-colors select-none">
                    {conv.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-xs truncate group-hover:text-gray-300 select-none">{conv.preview}</p>
                  <span className="text-xs text-gray-200/60 ml-2 flex-shrink-0 bg-gray-500/10 px-2 py-0.5 rounded-full select-none">
                    {conv.time}
                  </span>
                </div>
              </div>
              
              {/* Menu button */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={(e) => handleDeleteClick(e, conv.id, conv.title)}
                  className="opacity-100 text-red-400 hover:text-red-200 transition-all duration-200 p-1.5 rounded-lg hover:bg-red-500/10 bg-red-500/20 border border-red-500/30"
                  title="Eliminar chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      

    </div>
  );
};

// Modal renderizado fuera del contenedor principal
const ChatListWithModal: React.FC<ChatListProps> = (props) => {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; chatId: string; chatTitle: string }>({ 
    isOpen: false, 
    chatId: '', 
    chatTitle: '' 
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (chatId: string, chatTitle?: string) => {
    setDeleteModal({ isOpen: true, chatId, chatTitle: chatTitle || '' });
  };

  const handleConfirmDelete = async () => {
    if (!props.onDeleteChat) return;
    
    setIsDeleting(true);
    try {
      await props.onDeleteChat(deleteModal.chatId);
      setDeleteModal({ isOpen: false, chatId: '', chatTitle: '' });
    } catch (error) {
      console.error('Error al eliminar chat:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ChatList {...props} onDeleteChat={handleDeleteClick} />
      
      {/* Delete confirmation modal - rendered outside sidebar using portal */}
      {typeof window !== 'undefined' && createPortal(
        <DeleteChatModal
          isOpen={deleteModal.isOpen}
          onClose={() => {
            setDeleteModal({ isOpen: false, chatId: '', chatTitle: '' });
          }}
          onConfirm={handleConfirmDelete}
          chatTitle={deleteModal.chatTitle}
          isDeleting={isDeleting}
        />,
        document.body
      )}
    </>
  );
};
export default ChatListWithModal;