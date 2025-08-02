export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
}

export interface SidebarItem {
  id: 'toggle' | 'chats' | 'tasks'; 
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  count?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}