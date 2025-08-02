import React from 'react';
import { Task } from './types';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import TaskList from './TaskList';

interface TaskPanelProps {
  tasks: Task[];
  newTask: string;
  setNewTask: (value: string) => void;
  newTaskPriority: 'low' | 'medium' | 'high';
  setNewTaskPriority: (value: 'low' | 'medium' | 'high') => void;
  newTaskDueDate: string;
  setNewTaskDueDate: (value: string) => void;
  newTaskCategory: string;
  setNewTaskCategory: (value: string) => void;
  addTask: () => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  pendingTasks: number;
  urgentTasks: number;
  getPriorityColor: (priority: 'low' | 'medium' | 'high') => string;
  getPriorityBg: (priority: 'low' | 'medium' | 'high') => string;
  isTaskOverdue: (dueDate?: string) => boolean;
}

const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  newTask,
  setNewTask,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  newTaskCategory,
  setNewTaskCategory,
  addTask,
  toggleTask,
  deleteTask,
  pendingTasks,
  urgentTasks,
  getPriorityColor,
  getPriorityBg,
  isTaskOverdue
}) => {
  return (
    <div className="p-4">
      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        newTaskPriority={newTaskPriority}
        setNewTaskPriority={setNewTaskPriority}
        newTaskDueDate={newTaskDueDate}
        setNewTaskDueDate={setNewTaskDueDate}
        newTaskCategory={newTaskCategory}
        setNewTaskCategory={setNewTaskCategory}
        addTask={addTask}
      />

      <TaskStats
        totalTasks={tasks.length}
        pendingTasks={pendingTasks}
        urgentTasks={urgentTasks}
      />

      <TaskList
        tasks={tasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        getPriorityColor={getPriorityColor}
        getPriorityBg={getPriorityBg}
        isTaskOverdue={isTaskOverdue}
      />
    </div>
  );
};

export default TaskPanel;