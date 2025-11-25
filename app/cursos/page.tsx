"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: number;
}

const courses: Course[] = [
  { id: "math-basics", title: "Matemáticas Básicas", description: "Operaciones, fracciones y porcentajes.", level: "Básico", lessons: 12 },
  { id: "js-intro", title: "Introducción a JavaScript", description: "Fundamentos del lenguaje y DOM.", level: "Intermedio", lessons: 18 },
  { id: "ai-concepts", title: "Conceptos de IA", description: "Modelos, aprendizaje y ética.", level: "Avanzado", lessons: 10 },
];

export default function CursosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const found = courses.find((c) => c.id === id);
    setSelectedCourse(found || null);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      <div className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300" onClick={toggleSidebar} />
      )}

      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-80" : "ml-0"}`}>
        <div className="fixed top-0 left-0 w-full z-40">
          <Navbar showAuth={false} toggleSidebar={toggleSidebar}>
            <ProfileMenu onProfileClick={() => {}} />
          </Navbar>
        </div>

        <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {!selectedCourse ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Cursos disponibles</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <a
                    key={course.id}
                    href={`/cursos?id=${course.id}`}
                    className="border border-gray-800/50 rounded-2xl p-4 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-800/60 border border-gray-700/50 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold">{course.title[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-medium truncate">{course.title}</h2>
                        <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                        <div className="text-xs text-gray-500 mt-2">{course.level} • {course.lessons} lecciones</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <button onClick={() => setSelectedCourse(null)} className="text-sm text-amber-400 hover:text-amber-300 mb-4">Volver</button>
              <h1 className="text-2xl font-semibold mb-2">{selectedCourse.title}</h1>
              <div className="text-gray-400 mb-4">{selectedCourse.description}</div>
              <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: selectedCourse.lessons }).map((_, i) => (
                  <div key={i} className="border border-gray-800/50 rounded-xl p-3 bg-gray-900/40">
                    <div className="text-sm text-white">Lección {i + 1}</div>
                    <div className="text-xs text-gray-500">Contenido de la lección...</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
