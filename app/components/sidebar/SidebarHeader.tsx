import React from 'react';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  activeTab: 'chats' | 'tasks';
  setIsOpen: (open: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ activeTab, setIsOpen }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800/30 bg-black min-w-[320px]">
      <h2 className="text-lg font-normal text-gray-100 select-none">
        {activeTab === 'chats' ? 'Chats' : 'Agenda de Tareas'}
      </h2>
      <button
        onClick={() => setIsOpen(false)}
        className="text-gray-400 hover:text-gray-200 transition-all duration-200 p-1 rounded-lg hover:bg-gray-900/50 cursor-pointer"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default SidebarHeader;