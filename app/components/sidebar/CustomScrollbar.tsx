import React from 'react';

interface CustomScrollbarProps {
  children: React.ReactNode;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ children }) => {
  return (
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
          background: rgba(107, 114, 128, 0.3);
          border-radius: 10px;
          border: 1px solid rgba(107, 114, 128, 0.1);
          cursor: grab;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.5);
          cursor: grab;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          cursor: grabbing;
        }
      `}</style>
      {children}
    </div>
  );
};

export default CustomScrollbar;