'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Task } from './types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, task }) => {
  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo con gradiente radial oscuro */}
      <div className="absolute inset-0 bg-gradient-radial from-red-950/20 via-black/80 to-black backdrop-blur-md">
        {/* Partículas de alerta sutiles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Modal container */}
      <div className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-red-950/60 border border-red-700/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Confirmar Eliminación</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/30 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            ¿Estás seguro de que quieres eliminar esta tarea?
          </p>
          
          {/* Task preview */}
          <div className="bg-gray-800/40 border border-gray-600/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{task.text}</p>
                {(task.category || task.dueDate) && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    {task.category && (
                      <span className="bg-gray-700/50 px-2 py-1 rounded">
                        {task.category}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="bg-gray-700/50 px-2 py-1 rounded">
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-red-300 text-sm mt-4">
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700/30 hover:bg-gray-600/30 text-gray-300 rounded-lg transition-all duration-200 font-medium border border-gray-600/20"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-red-600/80 hover:bg-red-500/80 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default DeleteConfirmModal;