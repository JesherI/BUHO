'use client';

import React from 'react';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  lessons: number;
}

const sampleCourses: Course[] = [
  { id: 'math-basics', title: 'Matemáticas Básicas', description: 'Operaciones, fracciones y porcentajes.', level: 'Básico', lessons: 12 },
  { id: 'js-intro', title: 'Introducción a JavaScript', description: 'Fundamentos del lenguaje y DOM.', level: 'Intermedio', lessons: 18 },
  { id: 'ai-concepts', title: 'Conceptos de IA', description: 'Modelos, aprendizaje y ética.', level: 'Avanzado', lessons: 10 },
];

export default function CoursesPanel() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Contenidos</h2>
        <a href="/cursos" className="text-xs text-amber-400 hover:text-amber-300">Ver todos</a>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sampleCourses.map((course) => (
          <a
            key={course.id}
            href={`/cursos?id=${course.id}`}
            className="group border border-gray-800/50 rounded-xl p-3 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800/60 border border-gray-700/50 flex items-center justify-center">
                <Image src="/logo.png" alt="Course" width={24} height={24} className="opacity-80" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm text-white truncate">{course.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-200 border border-gray-600/50">
                    {course.level}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                <div className="text-[10px] text-gray-500 mt-2">{course.lessons} lecciones</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
