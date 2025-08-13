'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckSquare, Menu } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, deleteDoc, getDocs, addDoc, updateDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../db/firebase';

import { SidebarProps, SidebarItem, Task, Conversation } from './types';

import SidebarNav from './SidebarNav';
import SidebarHeader from './SidebarHeader';
import CustomScrollbar from './CustomScrollbar';
import ChatListWithModal from './ChatList';
import TaskPanel from './TaskPanel';
import AddTaskModal from './AddTaskModal';


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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
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

  // Efecto para cargar tareas cuando cambie el userId
  useEffect(() => {
    if (userId) {
      const unsubscribe = loadTasks(userId);
      return unsubscribe;
    } else {
      setTasks([]);
      setIsLoadingTasks(false);
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

  // Función para cargar las tareas
  const loadTasks = (uid: string) => {
    try {
      setIsLoadingTasks(true);
      
      // Consulta para obtener tareas ordenadas por fecha de creación
      const tasksRef = collection(db, "users", uid, "tasks");
      const q = query(tasksRef, orderBy("createdAt", "desc"));
      
      // Configurar listener en tiempo real
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData: Task[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : null;
          const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : null;
          
          tasksData.push({
            id: doc.id,
            text: data.text || "",
            completed: data.completed || false,
            priority: data.priority || 'medium',
            dueDate: data.dueDate || undefined,
            category: data.category || undefined,
            createdAt: createdAt || undefined,
            updatedAt: updatedAt || undefined
          });
        });
        
        setTasks(tasksData);
        setIsLoadingTasks(false);
      });
      
      // Devolver función de limpieza para desuscribirse
      return () => unsubscribe();
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      setIsLoadingTasks(false);
      return () => {}; // Función de limpieza vacía en caso de error
    }
  };

  // Función para agregar una nueva tarea
  const handleAddTask = async (taskData: {
    text: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    category?: string;
  }) => {
    try {
      if (!userId) {
        console.error('No hay usuario autenticado');
        return;
      }

      const tasksRef = collection(db, "users", userId, "tasks");
      await addDoc(tasksRef, {
        text: taskData.text,
        completed: false,
        priority: taskData.priority,
        dueDate: taskData.dueDate || null,
        category: taskData.category || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  // Función para alternar el estado completado de una tarea
  const handleToggleTask = async (taskId: string) => {
    try {
      if (!userId) {
        console.error('No hay usuario autenticado');
        return;
      }

      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Tarea no encontrada');
        return;
      }

      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !task.completed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!userId) {
        console.error('No hay usuario autenticado');
        return;
      }

      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  // Función para actualizar una tarea
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      if (!userId) {
        console.error('No hay usuario autenticado');
        return;
      }

      const taskRef = doc(db, "users", userId, "tasks", taskId);
      const updateData: Partial<Omit<Task, 'updatedAt'>> & { updatedAt: FieldValue } = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Remover campos undefined para evitar errores en Firestore
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };
  
  // Función para crear un nuevo chat
  const createNewChat = () => {
    // Redirigir a la página de chat sin ID para crear uno nuevo sin recargar
    window.history.pushState(null, '', '/chat');
    // Disparar evento de navegación para que el componente de chat se actualice
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.dispatchEvent(new CustomEvent('urlchange'));
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      if (!userId) {
        console.error('No hay usuario autenticado');
        return;
      }
      
      // Verificar si el chat que se está eliminando es el actualmente activo
      const currentUrl = window.location.href;
      const isCurrentChat = currentUrl.includes(`id=${chatId}`);
      
      // Primero eliminar todos los mensajes del chat
      const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      
      // Eliminar cada mensaje individualmente
      const deletePromises = messagesSnapshot.docs.map(messageDoc => 
        deleteDoc(doc(db, 'users', userId, 'chats', chatId, 'messages', messageDoc.id))
      );
      
      await Promise.all(deletePromises);
      
      // Luego eliminar el chat mismo
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      await deleteDoc(chatRef);
      
      // Si el chat eliminado era el activo, redirigir a otro chat o crear uno nuevo
      if (isCurrentChat) {
        // Buscar otro chat disponible (excluyendo el que acabamos de eliminar)
        const otherChat = conversations.find(conv => conv.id !== chatId);
        
        if (otherChat) {
          // Redirigir al primer chat disponible sin recargar la página
          window.history.pushState(null, '', `/chat?id=${otherChat.id}`);
          // Disparar evento de navegación para que el componente de chat se actualice
          window.dispatchEvent(new PopStateEvent('popstate'));
          window.dispatchEvent(new CustomEvent('urlchange'));
        } else {
          // Si no hay otros chats, ir a la página de chat para crear uno nuevo
          window.history.pushState(null, '', '/chat');
          window.dispatchEvent(new PopStateEvent('popstate'));
          window.dispatchEvent(new CustomEvent('urlchange'));
        }
      }
      
      // El estado local se actualizará automáticamente gracias al listener onSnapshot
    } catch (error) {
      console.error('Error al eliminar chat:', error);
      // Opcional: mostrar un mensaje de error al usuario
    }
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
      {/* Sidebar Navigation - Oculto en móviles */}
      <div className="hidden lg:block">
        <SidebarNav
          sidebarItems={sidebarItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          urgentTasks={urgentTasks}
        />
      </div>

      {/* Sidebar Content */}
       <div className={`fixed top-[72px] h-[calc(100vh-72px)] bg-black border-r border-gray-800/30 z-30 overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
         isOpen 
           ? 'left-0 lg:left-16 w-80 opacity-100 visible' 
           : 'left-0 lg:left-16 w-0 opacity-0 invisible'
       }`}>
         <SidebarHeader activeTab={activeTab} setIsOpen={setIsOpen} />
         
         <div className="lg:hidden border-b border-gray-800/30 px-4 py-2">
           <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1">
             <button
               onClick={() => setActiveTab('chats')}
               className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                 activeTab === 'chats'
                   ? 'bg-gray-700/70 text-white shadow-sm'
                   : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
               }`}
             >
               <MessageCircle size={16} />
               <span>Chats</span>
               {conversations.length > 0 && (
                 <span className="bg-gray-600/80 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5">
                   {conversations.length > 99 ? '99+' : conversations.length}
                 </span>
               )}
             </button>
             <button
               onClick={() => setActiveTab('tasks')}
               className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                 activeTab === 'tasks'
                   ? 'bg-gray-700/70 text-white shadow-sm'
                   : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
               }`}
             >
               <CheckSquare size={16} />
               <span>Tareas</span>
               {pendingTasks > 0 && (
                 <span className="bg-gray-600/80 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5">
                   {pendingTasks > 99 ? '99+' : pendingTasks}
                 </span>
               )}
               {urgentTasks > 0 && (
                 <span className="bg-red-500/80 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                   !
                 </span>
               )}
             </button>
           </div>
         </div>

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
                <ChatListWithModal 
                  conversations={conversations} 
                  onNewChat={createNewChat} 
                  onSelectChat={(chatId) => {
                    window.history.pushState(null, '', `/chat?id=${chatId}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.dispatchEvent(new CustomEvent('urlchange'));
                  }}
                  onDeleteChat={handleDeleteChat}
                />
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskPanel
              tasks={tasks}
              isLoading={isLoadingTasks}
              onAddTask={handleAddTask}
              toggleTask={handleToggleTask}
              onEdit={(task) => {
                handleUpdateTask(task.id, {
                  text: task.text,
                  priority: task.priority,
                  dueDate: task.dueDate,
                  category: task.category
                });
              }}
              onDelete={(taskId) => {
                handleDeleteTask(taskId);
              }}
              getPriorityColor={getPriorityColor}
              getPriorityBg={getPriorityBg}
              isTaskOverdue={isTaskOverdue}
            />
          )}
        </CustomScrollbar>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden cursor-pointer backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
};

export default Sidebar;