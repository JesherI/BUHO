import React from 'react';

interface TaskStatsProps {
  totalTasks: number;
  pendingTasks: number;
  urgentTasks: number;
}

const TaskStats: React.FC<TaskStatsProps> = ({ totalTasks, pendingTasks, urgentTasks }) => {
  return (
    <div className="mb-6 grid grid-cols-3 gap-3 text-xs">
      <div className="bg-gray-950/40 p-3 rounded-xl text-center border border-gray-800 select-none">
        <div className="text-white font-medium text-lg">{totalTasks}</div>
        <div className="text-gray-400 font-normal">Total</div>
      </div>
      <div className="bg-yellow-500/5 p-3 rounded-xl text-center border border-yellow-500/20 select-none">
        <div className="text-yellow-200 font-medium text-lg">{pendingTasks}</div>
        <div className="text-yellow-300/80 font-normal">Pendientes</div>
      </div>
      <div className="bg-red-500/5 p-3 rounded-xl text-center border border-red-500/20 select-none">
        <div className="text-red-300 font-medium text-lg">{urgentTasks}</div>
        <div className="text-red-300/80 font-normal">Urgentes</div>
      </div>
    </div>
  );
};

export default TaskStats;