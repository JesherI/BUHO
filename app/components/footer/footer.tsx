import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="text-gray-300 px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">Búho</h3>
          <ul>
            <li><Link href="#" className="hover:underline">Acerca de: </Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Plataformas</h3>
          <ul>
            <li><Link href="#" className="hover:underline">Proximamente!!</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Recursos</h3>
          <ul>
            <li><Link href="/help" className="hover:underline">Centro de ayuda!</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Legal</h3>
          <ul>
            <li><Link href="/privacy" className="hover:underline">Privacidad</Link></li>
            <li><Link href="/terms" className="hover:underline">Términos</Link></li>
            <li><Link href="/cookies" className="hover:underline">Cookies</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Idioma</h3>
          <ul>
            <li><Link href="#" className="hover:underline">Español</Link></li>
            <li><Link href="#" className="hover:underline">Inglés</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Búho — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
