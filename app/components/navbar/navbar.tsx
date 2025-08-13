import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

interface NavbarProps {
  showAuth?: boolean;
  children?: React.ReactNode;
  background?: 'transparent' | 'solid';
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  showAuth = true,
  children,
  background = 'transparent',
  toggleSidebar,
}) => {
  const backgroundClass =
    background === 'transparent'
      ? 'bg-black/60 backdrop-blur-md'
      : 'bg-black bg-opacity-100';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 shadow-md ${backgroundClass} border-b border-amber-500/20 h-[72px]`}
    >
      <div className="flex items-center space-x-4">
        {/* Botón hamburguesa para sidebar - solo visible cuando toggleSidebar está disponible */}
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800/90 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Abrir menú"
          >
            <Menu size={18} />
          </button>
        )}
        <Image src="/logonoo.png" alt="Logo" width={50} height={50} />
        {children}
      </div>

      {showAuth && (
        <div className="flex items-center space-x-4">
          <Link
            href="/log-in"
            className="text-white border-b-2 border-transparent hover:border-amber-400 transition"
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="text-white border-b-2 border-transparent hover:border-amber-400 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
