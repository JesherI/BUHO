import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Camera, Shield, FileText, ChevronRight, ExternalLink } from "lucide-react";

const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveSection(null);
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const menuItems = {
    profile: [
      { icon: Camera, label: "Cambiar foto", action: () => console.log("Cambiar foto") },
    ],

    legal: [
      { icon: FileText, label: "Términos de uso", action: () => window.open('/terms', '_blank') },
      { icon: Shield, label: "Política de privacidad", action: () => window.open('/privacy', '_blank') },
    ]
  };

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="relative group cursor-pointer"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-lg hover:shadow-amber-400/20 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-400">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFs3xGXDwyPFZ7ZwCqakei5NnEC9X57paPg&s"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      </button>

      {isOpen && (
        <div className="absolute top-11 sm:top-12 right-0 w-64 sm:w-72 bg-black/95 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-2xl border border-amber-400/20 overflow-hidden transform transition-all duration-300 ease-out">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-900 p-3 sm:p-4 border-b border-amber-400/20 select-none">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400/40 flex-shrink-0">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFs3xGXDwyPFZ7ZwCqakei5NnEC9X57paPg&s"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">CHUKI</h3>
                <p className="text-gray-400 text-xs sm:text-sm truncate">CHUCKIREAL@Gmail.com</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    BUHO IA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-56 sm:max-h-64 overflow-y-auto">
            <div>
              <button
                onClick={() => handleSectionClick('profile')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-amber-300 group-hover:text-amber-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  <span className="font-medium text-white text-sm group-hover:text-amber-100">Mi Perfil</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:text-amber-400 ${activeSection === 'profile' ? 'rotate-90 text-amber-400' : ''}`}
                />
              </button>

              {activeSection === 'profile' && (
                <div className="bg-gray-900/30 border-t border-gray-800/50">
                  {menuItems.profile.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full flex items-center space-x-3 px-8 py-2.5 hover:bg-white/5 transition-colors text-left group cursor-pointer"
                    >
                      <item.icon className="w-4 h-4 text-gray-300 group-hover:text-amber-400" />
                      <span className="text-gray-300 text-sm group-hover:text-white">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => handleSectionClick('legal')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-amber-300 group-hover:text-amber-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  <span className="font-medium text-white text-sm group-hover:text-amber-100">Legal y Soporte</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:text-amber-400 ${activeSection === 'legal' ? 'rotate-90 text-amber-400' : ''}`}
                />
              </button>

              {activeSection === 'legal' && (
                <div className="bg-gray-900/30 border-t border-gray-800/50">
                  {menuItems.legal.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-8 py-2.5 hover:bg-white/5 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4 text-gray-300 group-hover:text-amber-400" />
                        <span className="text-gray-300 text-sm group-hover:text-white">{item.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="border-t border-gray-800/50">
            <button
              onClick={() => console.log("Cerrar sesión")}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-600/10 transition-colors group cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
              <span className="font-medium text-red-400 text-sm group-hover:text-red-300">Cerrar Sesión</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfileMenu;