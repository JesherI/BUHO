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
  id: 'toggle' | 'chats' | 'tasks'; // puedes extender si agregas más
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  count?: number;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/champagne-limousines';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    document.body.style.fontFamily = "'Champagne & Limousines', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
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
      case 'high': return 'text-red-300 border-red-400/60';
      case 'medium': return 'text-yellow-200 border-yellow-300/60';
      case 'low': return 'text-green-300 border-green-400/60';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityBg = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-500/5';
      case 'medium': return 'bg-yellow-500/5';
      case 'low': return 'bg-green-500/5';
      default: return 'bg-gray-500/5';
    }
  };

  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'toggle', icon: Menu, label: 'Menu' },
    { id: 'chats', icon: MessageCircle, label: 'Chats', count: conversations.length },
    { id: 'tasks', icon: CheckSquare, label: 'Tareas', count: pendingTasks },
  ];
  

  return (
    <>
      <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-16 bg-black border-r border-yellow-200/10 z-40 flex flex-col py-3 shadow-xl">
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
              className={`relative p-3 flex flex-col items-center transition-all duration-200 group mb-1 rounded-r-xl mx-1 cursor-pointer ${
                isActive 
                  ? 'text-yellow-200 bg-yellow-500/8 shadow-lg' 
                  : 'text-gray-400 hover:text-yellow-100 hover:bg-gray-900/50'
              }`}
              title={item.label}
            >
              <IconComponent size={20} className="mb-1" />
              <span className="text-[9px] font-normal opacity-80">{item.label}</span>
              
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600/80 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1.5 font-medium leading-none shadow-lg">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
              
              {item.id === 'tasks' && urgentTasks > 0 && (
                <span className="absolute -bottom-1 -right-1 bg-red-500/80 text-white text-[8px] rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 font-medium leading-none shadow-lg">
                  !
                </span>
              )}
              
              {isActive && item.id !== 'toggle' && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-yellow-400/60 rounded-r-full"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className={`fixed left-16 top-[72px] h-[calc(100vh-72px)] bg-black border-r border-yellow-200/10 z-30 overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
        isOpen ? 'w-80 opacity-100 visible' : 'w-0 opacity-0 invisible'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-yellow-200/10 bg-gray-950 min-w-[320px]">
          <h2 className="text-lg font-normal text-yellow-100 select-none">
            {activeTab === 'chats' ? 'Chats' : 'Agenda de Tareas'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-yellow-200 transition-all duration-200 p-1 rounded-lg hover:bg-gray-900/50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-full overflow-y-auto pb-20 min-w-[320px] custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              cursor: pointer;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.3);
              border-radius: 10px;
              margin: 4px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(254, 240, 138, 0.3);
              border-radius: 10px;
              border: 1px solid rgba(254, 240, 138, 0.1);
              cursor: grab;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(254, 240, 138, 0.5);
              cursor: grab;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:active {
              cursor: grabbing;
            }
          `}</style>
          
          {activeTab === 'chats' && (
            <div className="p-4">
              <button className="w-full bg-yellow-600/80 hover:bg-yellow-500/80 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium mb-6 shadow-lg cursor-pointer">
                <PlusCircle size={16} />
                Nuevo Chat
              </button>
              
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-4 rounded-xl bg-gray-950/60 hover:bg-gray-900/80 border border-gray-800 hover:border-yellow-200/20 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-sm truncate group-hover:text-yellow-100 transition-colors select-none">
                        {conv.title}
                      </h3>
                      <span className="text-xs text-yellow-200/60 ml-2 flex-shrink-0 bg-yellow-500/10 px-2 py-0.5 rounded-full select-none">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate group-hover:text-gray-300 select-none">{conv.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="p-4">
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
                    className="w-full bg-gray-900/60 border border-gray-700/50 text-white px-4 py-3 rounded-lg focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/20 text-sm transition-all duration-200 cursor-text"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="bg-gray-900/60 border border-gray-700/50 text-white px-3 py-3 rounded-lg focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/20 text-sm transition-all duration-200 cursor-pointer"
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
                        ? 'bg-yellow-600/80 hover:bg-yellow-500/80 text-white cursor-pointer' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Agregar Tarea
                  </button>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3 text-xs">
                <div className="bg-gray-950/40 p-3 rounded-xl text-center border border-gray-800 select-none">
                  <div className="text-white font-medium text-lg">{tasks.length}</div>
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

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all duration-200 group ${
                      task.completed 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : `${getPriorityBg(task.priority)} border-gray-800 hover:border-yellow-200/20`
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
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 lg:hidden cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;