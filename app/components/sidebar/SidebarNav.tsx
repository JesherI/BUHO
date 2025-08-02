import React from 'react';
import { SidebarItem } from './types';

interface SidebarNavProps {
  sidebarItems: SidebarItem[];
  activeTab: 'chats' | 'tasks';
  setActiveTab: (tab: 'chats' | 'tasks') => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  urgentTasks: number;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  sidebarItems,
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  urgentTasks
}) => {
  return (
    <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-16 bg-black border-r border-gray-800/30 z-40 flex flex-col py-3 shadow-xl">
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
                ? 'text-white bg-gray-800/50 shadow-lg' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
            }`}
            title={item.label}
          >
            <IconComponent size={20} className="mb-1" />
            <span className="text-[9px] font-normal opacity-80">{item.label}</span>
            
            {item.count !== undefined && item.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-700/80 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1.5 font-medium leading-none shadow-lg">
                {item.count > 99 ? '99+' : item.count}
              </span>
            )}
            
            {item.id === 'tasks' && urgentTasks > 0 && (
              <span className="absolute -bottom-1 -right-1 bg-red-500/80 text-white text-[8px] rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 font-medium leading-none shadow-lg">
                !
              </span>
            )}
            
            {isActive && item.id !== 'toggle' && (
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-gray-600/60 rounded-r-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SidebarNav;