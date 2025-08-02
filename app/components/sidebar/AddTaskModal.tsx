'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Calendar, Flag, Edit3 } from 'lucide-react';
import { Task } from './types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    text: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    category?: string;
  }) => void;
  editingTask?: Task | null;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit, editingTask, onUpdate }) => {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const isEditing = !!editingTask;

  // Efecto para cargar datos de la tarea cuando se está editando
  useEffect(() => {
    if (editingTask) {
      setTaskText(editingTask.text);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate || '');
      setCategory(editingTask.category || '');
    } else {
      // Limpiar formulario cuando no se está editando
      setTaskText('');
      setPriority('medium');
      setDueDate('');
      setCategory('');
    }
  }, [editingTask, isOpen]);

  const handleSubmit = () => {
    if (taskText.trim()) {
      if (isEditing && editingTask && onUpdate) {
        // Actualizar tarea existente
        onUpdate(editingTask.id, {
          text: taskText.trim(),
          priority,
          dueDate: dueDate || undefined,
          category: category || undefined
        });
      } else {
        // Crear nueva tarea
        onSubmit({
          text: taskText.trim(),
          priority,
          dueDate: dueDate || undefined,
          category: category || undefined
        });
      }
      
      // Limpiar formulario
      setTaskText('');
      setPriority('medium');
      setDueDate('');
      setCategory('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo con gradiente radial oscuro y partículas sutiles */}
      <div className={`absolute inset-0 backdrop-blur-md ${
        isEditing 
          ? 'bg-gradient-radial from-orange-950/20 via-black/80 to-black'
          : 'bg-gradient-radial from-blue-950/20 via-black/80 to-black'
      }`}>
        {/* Partículas de galaxia sutiles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              isEditing ? 'bg-orange-400/10' : 'bg-blue-400/10'
            }`}
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
      <div className={`relative border border-gray-700/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl backdrop-blur-sm ${
        isEditing 
          ? 'bg-gradient-to-br from-black/60 via-gray-900/60 to-orange-950/60'
          : 'bg-gradient-to-br from-black/60 via-gray-900/60 to-blue-950/60'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isEditing ? 'bg-orange-500/10' : 'bg-blue-500/10'
            }`}>
              {isEditing ? (
                <Edit3 className="w-5 h-5 text-orange-400" />
              ) : (
                <Plus className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/30 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Texto de la tarea */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ¿Qué necesitas hacer?
            </label>
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe tu tarea..."
              className="w-full bg-gray-800/40 border border-gray-600/30 text-white px-4 py-3 rounded-lg focus:border-blue-400/50 focus:outline-none focus:ring-1 focus:ring-blue-400/20 text-sm transition-all duration-200 resize-none"
              rows={3}
              autoFocus
            />
          </div>

          {/* Prioridad y fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full bg-gray-800/40 border border-gray-600/30 text-white px-3 py-3 rounded-lg focus:border-blue-400/50 focus:outline-none focus:ring-1 focus:ring-blue-400/20 text-sm transition-all duration-200"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha límite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-800/40 border border-gray-600/30 text-white px-3 py-3 rounded-lg focus:border-blue-400/50 focus:outline-none focus:ring-1 focus:ring-blue-400/20 text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría (opcional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Trabajo, Estudio, Personal..."
              className="w-full bg-gray-800/40 border border-gray-600/30 text-white px-4 py-3 rounded-lg focus:border-blue-400/50 focus:outline-none focus:ring-1 focus:ring-blue-400/20 text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700/30 hover:bg-gray-600/30 text-gray-300 rounded-lg transition-all duration-200 font-medium border border-gray-600/20"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!taskText.trim()}
            className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              taskText.trim()
                ? isEditing 
                  ? 'bg-orange-600/80 hover:bg-orange-500/80 text-white shadow-lg'
                  : 'bg-blue-600/80 hover:bg-blue-500/80 text-white shadow-lg'
                : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isEditing ? 'Actualizar Tarea' : 'Crear Tarea'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default AddTaskModal;