import React from 'react';
import { Task } from './types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  getPriorityColor: (priority: 'low' | 'medium' | 'high') => string;
  getPriorityBg: (priority: 'low' | 'medium' | 'high') => string;
  isTaskOverdue: (dueDate?: string) => boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, deleteTask, getPriorityColor, getPriorityBg, isTaskOverdue }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          getPriorityColor={getPriorityColor}
          getPriorityBg={getPriorityBg}
          isTaskOverdue={isTaskOverdue}
        />
      ))}
    </div>
  );
};

export default TaskList;