import React, { useState } from "react";
import { MessageCircle, CheckSquare, Menu, X, PlusCircle, Trash2, Check, Calendar, Flag } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
}

interface Conversation {
  id: number;
  title: string;
  preview: string;
  time: string;
}

interface SidebarItem {
  id: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  count?: number;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'tasks'>('chats');
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      text: "Terminar interfaz", 
      completed: false, 
      priority: 'high',
      dueDate: '2025-06-15',
      category: 'Desarrollo'
    },
    { 
      id: 2, 
      text: "Conectar Firebase", 
      completed: false, 
      priority: 'medium',
      dueDate: '2025-06-16',
      category: 'Backend'
    },
    { 
      id: 3, 
      text: "Agregar historial", 
      completed: true, 
      priority: 'low',
      category: 'Features'
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");

  const conversations: Conversation[] = [
    { id: 1, title: "Chat con amigas", preview: "Hola, ¿cómo están?", time: "2 min" },
    { id: 2, title: "Proyecto universidad", preview: "Necesito ayuda con...", time: "1 h" },
    { id: 3, title: "Recetas de cocina", preview: "¿Tienes alguna receta fácil?", time: "3 h" },
  ];

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks([...tasks, { 
        id: newId, 
        text: newTask.trim(), 
        completed: false,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || undefined,
        category: newTaskCategory || undefined
      }]);
      setNewTask("");
      setNewTaskDueDate("");
      setNewTaskCategory("");
      setNewTaskPriority('medium');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const urgentTasks = tasks.filter(t => !t.completed && t.priority === 'high').length;

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-amber-400 border-amber-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityBg = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-500/10';
      case 'medium': return 'bg-amber-500/10';
      case 'low': return 'bg-green-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'toggle', icon: Menu, label: 'Menu' },
    { id: 'chats', icon: MessageCircle, label: 'Chats', count: conversations.length },
    { id: 'tasks', icon: CheckSquare, label: 'Tareas', count: pendingTasks }
  ];

  return (
    <>
      <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-12 bg-black border-r border-amber-500/20 z-40 flex flex-col py-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'toggle') {
                  setIsOpen(!isOpen);
                } else {
                  setActiveTab(item.id as 'chats' | 'tasks');
                  setIsOpen(true);
                }
              }}
              className={`relative p-2.5 flex flex-col items-center transition-colors group ${
                isActive ? 'text-amber-400' : 'text-gray-400 hover:text-white'
              }`}
              title={item.label}
            >
              <IconComponent size={16} />
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-black text-[10px] rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 font-bold leading-none">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
              {item.id === 'tasks' && urgentTasks > 0 && (
                <span className="absolute -bottom-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full min-w-[12px] h-[12px] flex items-center justify-center px-1 font-bold leading-none">
                  !
                </span>
              )}
              {isActive && item.id !== 'toggle' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-r-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {isOpen && (
        <div className="fixed left-12 top-[72px] h-[calc(100vh-72px)] w-80 bg-black border-r border-amber-500/20 z-30 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-black">
            <h2 className="text-lg font-semibold text-white">
              {activeTab === 'chats' ? 'Chats' : 'Agenda de Tareas'}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-amber-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-full overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
            {activeTab === 'chats' && (
              <div className="p-4">
                <button className="w-full bg-amber-500 hover:bg-amber-400 text-black py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium mb-4 shadow-lg">
                  <PlusCircle size={16} />
                  Nuevo Chat
                </button>
                
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-amber-500/30 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-white font-medium text-sm truncate group-hover:text-amber-400">
                          {conv.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-gray-400 text-xs truncate">{conv.preview}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="p-4">
                <div className="mb-6 p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                  <h3 className="text-amber-400 font-medium mb-3 flex items-center gap-2">
                    <PlusCircle size={16} />
                    Nueva Tarea
                  </h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      placeholder="¿Qué necesitas hacer?"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
                      >
                        <option value="low">Baja prioridad</option>
                        <option value="medium">Media prioridad</option>
                        <option value="high">Alta prioridad</option>
                      </select>
                      
                      <input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
                      />
                    </div>
                    
                    <input
                      type="text"
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      placeholder="Categoría (opcional)"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
                    />
                    
                    <button
                      onClick={addTask}
                      disabled={!newTask.trim()}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Agregar Tarea
                    </button>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-900/50 p-2 rounded text-center">
                    <div className="text-white font-bold">{tasks.length}</div>
                    <div className="text-gray-400">Total</div>
                  </div>
                  <div className="bg-amber-500/10 p-2 rounded text-center">
                    <div className="text-amber-400 font-bold">{pendingTasks}</div>
                    <div className="text-gray-400">Pendientes</div>
                  </div>
                  <div className="bg-red-500/10 p-2 rounded text-center">
                    <div className="text-red-400 font-bold">{urgentTasks}</div>
                    <div className="text-gray-400">Urgentes</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all group ${
                        task.completed 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : `${getPriorityBg(task.priority)} border-gray-800 hover:border-amber-500/30`
                      } ${isTaskOverdue(task.dueDate) && !task.completed ? 'ring-1 ring-red-500/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                            task.completed 
                              ? 'bg-green-500 border-green-500' 
                              : `border-gray-500 hover:${getPriorityColor(task.priority).split(' ')[1]}`
                          }`}
                        >
                          {task.completed && <Check size={10} className="text-black" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${
                              task.completed ? 'text-gray-400 line-through' : 'text-white'
                            }`}>
                              {task.text}
                            </span>
                            <Flag size={10} className={getPriorityColor(task.priority)} />
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {task.category && (
                              <span className="bg-gray-800 px-2 py-0.5 rounded">
                                {task.category}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className={`flex items-center gap-1 ${
                                isTaskOverdue(task.dueDate) && !task.completed ? 'text-red-400' : ''
                              }`}>
                                <Calendar size={10} />
                                {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;