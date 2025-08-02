import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatTitle: string;
  isDeleting?: boolean;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  chatTitle, 
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{
        background: 'radial-gradient(ellipse at center, rgba(15, 30, 70, 0.08) 0%, rgba(0, 0, 0, 0.92) 60%, rgba(0, 0, 0, 0.98) 100%)',
        backdropFilter: 'blur(8px)'
      }}>
      {/* Subtle galaxy particles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '5s'}}></div>
      </div>
      <div className="relative bg-gray-950/90 border border-gray-800/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden backdrop-blur-sm" style={{
        background: 'linear-gradient(135deg, rgba(8, 12, 25, 0.98) 0%, rgba(15, 20, 35, 0.95) 50%, rgba(8, 12, 25, 0.98) 100%)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center border border-red-500/15">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Eliminar Chat</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            ¿Estás seguro de que quieres eliminar este chat?
          </p>
          <div className="bg-gray-950/80 border border-gray-900/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900/80 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-800/40">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18l.64-2.13c.23-.77-.16-1.58-.93-1.81-.77-.23-1.58.16-1.81.93L15.36 4H8.64l-.36-1.01c-.23-.77-1.04-1.16-1.81-.93-.77.23-1.16 1.04-.93 1.81L6.18 6H4c-.55 0-1 .45-1 1s.45 1 1 1h1v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8h1c.55 0 1-.45 1-1s-.45-1-1-1zM8 19c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm truncate">{chatTitle}</p>
                <p className="text-gray-400 text-xs mt-1">Esta acción no se puede deshacer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-4">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              Se eliminarán todos los mensajes de esta conversación permanentemente.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-800/30">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-gray-950/80 hover:bg-gray-900/80 text-gray-200 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-gray-900/50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-600/60 hover:bg-red-500/60 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/25"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;