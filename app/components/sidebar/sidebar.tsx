'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckSquare, Menu } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../db/firebase';

import { SidebarProps, SidebarItem, Task, Conversation } from './types';

import SidebarNav from './SidebarNav';
import SidebarHeader from './SidebarHeader';
import CustomScrollbar from './CustomScrollbar';
import ChatList from './ChatList';
import TaskPanel from './TaskPanel';


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
      text: "Crear presentación para cliente", 
      completed: false, 
      priority: 'high',
      dueDate: '2023-06-15',
      category: 'Trabajo'
    },
    { 
      id: 2, 
      text: "Investigar nuevas tecnologías", 
      completed: true, 
      priority: 'medium',
      dueDate: '2023-06-10',
      category: 'Desarrollo'
    },
    { 
      id: 3, 
      text: "Actualizar documentación", 
      completed: false, 
      priority: 'low',
      dueDate: '2023-06-20',
      category: 'Documentación'
    },
    { 
      id: 4, 
      text: "Reunión con equipo de diseño", 
      completed: false, 
      priority: 'high',
      dueDate: '2023-06-12',
      category: 'Reuniones'
    },
    { 
      id: 5, 
      text: "Revisar pull requests", 
      completed: false, 
      priority: 'medium',
      dueDate: '2023-06-14',
      category: 'Desarrollo'
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  // Estado para el usuario y las conversaciones
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  
  // Efecto para manejar la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setConversations([]);
        setIsLoadingChats(false);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Efecto para cargar conversaciones cuando cambie el userId
  useEffect(() => {
    if (userId) {
      const unsubscribe = loadConversations(userId);
      return unsubscribe;
    }
  }, [userId]);

  // Función para cargar las conversaciones
  const loadConversations = (uid: string) => {
    try {
      setIsLoadingChats(true);
      
      // Consulta para obtener chats ordenados por fecha de actualización
      const chatsRef = collection(db, "users", uid, "chats");
      const q = query(chatsRef, orderBy("updatedAt", "desc"));
      
      // Configurar listener en tiempo real
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const conversationsData: Conversation[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : null;
          
          // Calcular tiempo relativo
          let timeAgo = "ahora";
          if (updatedAt) {
            const now = new Date();
            const diffMinutes = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60));
            
            if (diffMinutes < 1) {
              timeAgo = "ahora";
            } else if (diffMinutes < 60) {
              timeAgo = `${diffMinutes}m`;
            } else if (diffMinutes < 1440) {
              timeAgo = `${Math.floor(diffMinutes / 60)}h`;
            } else {
              timeAgo = `${Math.floor(diffMinutes / 1440)}d`;
            }
          }
          
          conversationsData.push({
            id: doc.id,
            title: data.title || "Chat sin título",
            preview: data.lastMessage || "No hay mensajes",
            time: timeAgo
          });
        });
        
        setConversations(conversationsData);
        setIsLoadingChats(false);
      });
      
      // Devolver función de limpieza para desuscribirse
      return () => unsubscribe();
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
      setIsLoadingChats(false);
      return () => {}; // Función de limpieza vacía en caso de error
    }
  };
  
  // Función para crear un nuevo chat
  const createNewChat = () => {
    // Redirigir a la página de chat sin ID para crear uno nuevo
    // Esto forzará la creación de un nuevo chat
    window.location.href = '/chat';
  };

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
      case 'medium': return 'text-gray-200 border-gray-300/60';
      case 'low': return 'text-green-300 border-green-400/60';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityBg = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-500/5';
      case 'medium': return 'bg-gray-500/5';
      case 'low': return 'bg-green-500/5';
      default: return 'bg-gray-500/5';
    }
  };

  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'toggle', icon: Menu, label: 'Ocultar' },
    { id: 'chats', icon: MessageCircle, label: 'Chats', count: conversations.length },
    { id: 'tasks', icon: CheckSquare, label: 'Tareas', count: pendingTasks },
  ];
  

  return (
    <>
      <SidebarNav
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        urgentTasks={urgentTasks}
      />

      <div className={`fixed left-16 top-[72px] h-[calc(100vh-72px)] bg-black border-r border-gray-800/30 z-30 overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
        isOpen ? 'w-80 opacity-100 visible' : 'w-0 opacity-0 invisible'
      }`}>
        <SidebarHeader activeTab={activeTab} setIsOpen={setIsOpen} />

        <CustomScrollbar>
          {activeTab === 'chats' && (
            <div>
              {isLoadingChats ? (
                <div className="p-4 text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <ChatList 
                  conversations={conversations} 
                  onNewChat={createNewChat} 
                  onSelectChat={(chatId) => window.location.href = `/chat?id=${chatId}`}
                />
              )}
            </div>
          )}

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