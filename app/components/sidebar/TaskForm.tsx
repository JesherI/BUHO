import React from 'react';
import { PlusCircle } from 'lucide-react';

interface TaskFormProps {
  newTask: string;
  setNewTask: (value: string) => void;
  newTaskPriority: 'low' | 'medium' | 'high';
  setNewTaskPriority: (value: 'low' | 'medium' | 'high') => void;
  newTaskDueDate: string;
  setNewTaskDueDate: (value: string) => void;
  newTaskCategory: string;
  setNewTaskCategory: (value: string) => void;
  addTask: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  setNewTask,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  newTaskCategory,
  setNewTaskCategory,
  addTask
}) => {
  return (
    <div className="mb-6 p-5 bg-gray-950/40 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-yellow-200 font-medium mb-4 flex items-center gap-2 select-none">
        <PlusCircle size={16} />
        Nueva Tarea
      </h3>
      
      <div className="space-y-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="¿Qué necesitas hacer?"
          className="w-full bg-gray-900/60 border border-gray-700/50 text-white px-4 py-3 rounded-lg focus:border-gray-400/50 focus:outline-none focus:ring-1 focus:ring-gray-400/20 text-sm transition-all duration-200 cursor-text"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="bg-gray-900/60 border border-gray-700/50 text-white px-3 py-3 rounded-lg focus:border-gray-400/50 focus:outline-none focus:ring-1 focus:ring-gray-400/20 text-sm transition-all duration-200 cursor-pointer"
          >
            <option value="low">Baja prioridad</option>
            <option value="medium">Media prioridad</option>
            <option value="high">Alta prioridad</option>
          </select>
          
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="bg-gray-900/60 border border-gray-700/50 text-white px-3 py-3 rounded-lg focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/20 text-sm transition-all duration-200 cursor-pointer"
          />
        </div>
        
        <input
          type="text"
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          placeholder="Categoría (opcional)"
          className="w-full bg-gray-900/60 border border-gray-700/50 text-white px-4 py-3 rounded-lg focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/20 text-sm transition-all duration-200 cursor-text"
        />
        
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className={`w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg ${
            newTask.trim() 
              ? 'bg-gray-600/80 hover:bg-gray-500/80 text-white cursor-pointer' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Agregar Tarea
        </button>
      </div>
    </div>
  );
};

export default TaskForm;