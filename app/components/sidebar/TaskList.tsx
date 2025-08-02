import React from 'react';
import { Task } from './types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  getPriorityColor: (priority: 'low' | 'medium' | 'high') => string;
  getPriorityBg: (priority: 'low' | 'medium' | 'high') => string;
  isTaskOverdue: (dueDate?: string) => boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, onEdit, onDelete, getPriorityColor, getPriorityBg, isTaskOverdue }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              onEdit={onEdit}
              onDelete={onDelete}
              getPriorityColor={getPriorityColor}
              getPriorityBg={getPriorityBg}
              isTaskOverdue={isTaskOverdue}
            />
      ))}
    </div>
  );
};

export default TaskList;