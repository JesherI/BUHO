'use client';

import React, { useState} from "react";
import { MessageCircle, CheckSquare, Menu } from "lucide-react";

// Importar tipos
import { SidebarProps, SidebarItem, Task, Conversation } from "./types";

// Importar componentes
import SidebarNav from "./SidebarNav";
import SidebarHeader from "./SidebarHeader";
import CustomScrollbar from "./CustomScrollbar";
import ChatList from "./ChatList";
import TaskPanel from "./TaskPanel";

// Las utilidades se implementarán directamente en este componente



const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  React.useEffect(() => {
    const link = document.createElement('link');
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

  /**
   * Obtiene el color de texto y borde según la prioridad de la tarea
   */
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-300 border-red-400/60';
      case 'medium': return 'text-yellow-200 border-yellow-300/60';
      case 'low': return 'text-green-300 border-green-400/60';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  /**
   * Obtiene el color de fondo según la prioridad de la tarea
   */
  const getPriorityBg = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-500/5';
      case 'medium': return 'bg-yellow-500/5';
      case 'low': return 'bg-green-500/5';
      default: return 'bg-gray-500/5';
    }
  };

  /**
   * Verifica si una tarea está vencida
   */
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
      {/* Barra de navegación lateral */}
      <SidebarNav
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        urgentTasks={urgentTasks}
      />

      {/* Panel principal del sidebar */}
      <div className={`fixed left-16 top-[72px] h-[calc(100vh-72px)] bg-black border-r border-yellow-200/10 z-30 overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
        isOpen ? 'w-80 opacity-100 visible' : 'w-0 opacity-0 invisible'
      }`}>
        {/* Encabezado del panel */}
        <SidebarHeader activeTab={activeTab} setIsOpen={setIsOpen} />

        {/* Contenido con scrollbar personalizado */}
        <CustomScrollbar>
          {/* Panel de chats */}
          {activeTab === 'chats' && <ChatList conversations={conversations} />}

          {/* Panel de tareas */}
          {activeTab === 'tasks' && (
            <TaskPanel
              tasks={tasks}
              newTask={newTask}
              setNewTask={setNewTask}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              newTaskDueDate={newTaskDueDate}
              setNewTaskDueDate={setNewTaskDueDate}
              newTaskCategory={newTaskCategory}
              setNewTaskCategory={setNewTaskCategory}
              addTask={addTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              pendingTasks={pendingTasks}
              urgentTasks={urgentTasks}
              getPriorityColor={getPriorityColor}
              getPriorityBg={getPriorityBg}
              isTaskOverdue={isTaskOverdue}
            />
          )}
        </CustomScrollbar>
      </div>

      {/* Overlay para cerrar el sidebar en dispositivos móviles */}
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