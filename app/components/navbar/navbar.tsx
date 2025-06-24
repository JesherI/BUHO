"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
}) => {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";

  // 👇 Fondo negro en la ruta /chat
  const backgroundClass = isChatPage
    ? "bg-black text-white border-b border-amber-500/20"
    : background === 'transparent'
      ? "bg-black/60 backdrop-blur-md"
      : "bg-black bg-opacity-100";

  const navHeightClass = "h-[72px]";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 shadow-md ${backgroundClass} ${navHeightClass}`}
    >
      <div className="flex items-center space-x-4">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
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
