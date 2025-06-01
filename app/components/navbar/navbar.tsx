import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 shadow-md bg-black">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>

      <div className="flex items-center space-x-4">
        <a href="/login" className="text-white border-b-2 border-transparent hover:border-amber-400 transition">
          Log In
        </a>
        <a href="/signup" className="text-white border-b-2 border-transparent hover:border-amber-400 transition">
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
