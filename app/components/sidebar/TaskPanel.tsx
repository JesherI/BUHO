import React, { useState } from 'react';
import { Task } from './types';
import { Loader2, Plus } from 'lucide-react';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface TaskPanelProps {
  tasks: Task[];
  isLoading: boolean;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => void;
  toggleTask: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  getPriorityColor: (priority: 'low' | 'medium' | 'high') => string;
  getPriorityBg: (priority: 'low' | 'medium' | 'high') => string;
  isTaskOverdue: (dueDate?: string) => boolean;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ 
  tasks, 
  isLoading, 
  onAddTask, 
  toggleTask, 
  onEdit, 
  onDelete, 
  getPriorityColor, 
  getPriorityBg, 
  isTaskOverdue 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        ...taskData,
        updatedAt: new Date()
      };
      onEdit(updatedTask);
      setIsEditModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      onDelete(taskToDelete.id);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };
  return (
    <>
      <div className="h-full flex flex-col">
        {/* Botón para agregar nueva tarea */}
        <div className="mb-6 mx-1">
          <button
            onClick={handleAddTask}
            className="w-full flex items-center justify-center gap-3 p-4 bg-gray-800/60 hover:bg-gray-800/80 border border-gray-600/50 hover:border-gray-500/70 rounded-xl transition-all duration-200 text-gray-300 hover:text-white font-medium"
          >
            <Plus className="w-5 h-5" />
            Agregar Tarea
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            toggleTask={toggleTask}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getPriorityColor={getPriorityColor}
            getPriorityBg={getPriorityBg}
            isTaskOverdue={isTaskOverdue}
          />
        )}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={handleAddCancel}
        onSubmit={onAddTask}
      />

      <AddTaskModal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        onSubmit={handleEditSubmit}
        editingTask={editingTask}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        task={taskToDelete}
      />
    </>
  );
};

export default TaskPanel;