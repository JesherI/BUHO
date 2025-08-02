export const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high': return 'text-red-300 border-red-400/60';
    case 'medium': return 'text-gray-200 border-gray-300/60';
    case 'low': return 'text-green-300 border-green-400/60';
    default: return 'text-gray-400 border-gray-400';
  }
};

export const getPriorityBg = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high': return 'bg-red-500/5';
    case 'medium': return 'bg-gray-500/5';
    case 'low': return 'bg-green-500/5';
    default: return 'bg-gray-500/5';
  }
};

export const isTaskOverdue = (dueDate?: string) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};