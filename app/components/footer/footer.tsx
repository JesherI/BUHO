import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">Búho</h3>
          <ul>
            <li><a href="#" className="hover:underline">Acerca de</a></li>
            <li><a href="#" className="hover:underline">Equipo</a></li>
            <li><a href="#" className="hover:underline">Empleo</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Plataforma</h3>
          <ul>
            <li><a href="#" className="hover:underline">Precios</a></li>
            <li><a href="#" className="hover:underline">Documentación</a></li>
            <li><a href="#" className="hover:underline">API</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Recursos</h3>
          <ul>
            <li><a href="#" className="hover:underline">Centro de ayuda</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Historias</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Legal</h3>
          <ul>
            <li><a href="#" className="hover:underline">Privacidad</a></li>
            <li><a href="#" className="hover:underline">Términos</a></li>
            <li><a href="#" className="hover:underline">Cookies</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Idioma</h3>
          <ul>
            <li><a href="#" className="hover:underline">Español</a></li>
            <li><a href="#" className="hover:underline">Inglés</a></li>
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
