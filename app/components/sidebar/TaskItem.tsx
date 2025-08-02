import React from 'react';
import { Check, Calendar, Flag, Trash2, Edit3 } from 'lucide-react';
import { Task } from './types';

interface TaskItemProps {
  task: Task;
  toggleTask: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  getPriorityColor: (priority: 'low' | 'medium' | 'high') => string;
  getPriorityBg: (priority: 'low' | 'medium' | 'high') => string;
  isTaskOverdue: (dueDate?: string) => boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleTask, onEdit, onDelete, getPriorityColor, getPriorityBg, isTaskOverdue }) => {
  return (
    <div
      className={`p-4 mx-1 rounded-xl border transition-all duration-200 group ${
        task.completed 
          ? 'bg-green-500/5 border-green-500/20' 
          : `${getPriorityBg(task.priority)} border-gray-800 hover:border-gray-200/20`
      } ${isTaskOverdue(task.dueDate) && !task.completed ? 'ring-1 ring-red-500/40' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 mt-0.5 cursor-pointer ${
            task.completed 
              ? 'bg-green-500/80 border-green-500' 
              : `border-gray-500 hover:${getPriorityColor(task.priority).split(' ')[1]}`
          }`}
        >
          {task.completed && <Check size={12} className="text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-normal select-none ${
              task.completed ? 'text-gray-400 line-through' : 'text-white'
            }`}>
              {task.text}
            </span>
            <Flag size={12} className={getPriorityColor(task.priority)} />
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {task.category && (
              <span className="bg-gray-800/60 px-2 py-1 rounded-lg font-normal select-none">
                {task.category}
              </span>
            )}
            {task.dueDate && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg font-normal select-none ${
                isTaskOverdue(task.dueDate) && !task.completed 
                  ? 'text-red-300 bg-red-500/10' 
                  : 'bg-gray-800/40'
              }`}>
                <Calendar size={10} />
                {task.dueDate}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-orange-400 transition-all duration-200 p-2 rounded-lg hover:bg-orange-500/10 cursor-pointer"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;