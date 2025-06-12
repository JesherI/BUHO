"use client";
import React, { useRef, useState } from "react";
import { FaComments, FaTasks, FaMicrophone, FaCalendarAlt, FaChevronDown, FaPlay } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const preguntasEjemplo = [
  {
    pregunta: "¿Cómo funciona Buho IA?",
    respuesta:
      "Buho IA responde tus dudas escolares mediante chat de texto o voz y te ayuda a organizar tus tareas.",
  },
  {
    pregunta: "¿Puedo añadir tareas a la agenda?",
    respuesta:
      "Sí, Buho IA incluye una agenda para que agregues recordatorios y tareas directamente desde el chat.",
  },
  {
    pregunta: "¿Es seguro usar Buho IA?",
    respuesta:
      "Sí, la privacidad y seguridad de tus datos es una prioridad en Buho IA.",
  },
  {
    pregunta: "¿Cuánto cuesta usar Buho IA?",
    respuesta:
      "Buho IA ofrece un plan totalmente gratuito con funciones básicas y características avanzadas para potenciar tu experiencia educativa.",
  },
];

const Header: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activePregunta, setActivePregunta] = useState<number | null>(null);

  const preguntasRef = useRef<HTMLDivElement>(null);

  const scrollToPreguntas = () => {
    preguntasRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFeature = (id: string) => {
    setActiveFeature(activeFeature === id ? null : id);
  };

  const togglePregunta = (index: number) => {
    setActivePregunta(activePregunta === index ? null : index);
  };

  const mainFeatures = [
    {
      id: "chat",
      icon: <FaComments className="text-2xl" />,
      title: "Chatea con Buho IA",
      description:
        "Puedes interactuar en texto o voz para resolver dudas escolares de manera sencilla.",
    },
    {
      id: "tareas",
      icon: <FaTasks className="text-2xl" />,
      title: "Optimiza tus tareas",
      description:
        "Buho IA te ayuda a organizar y mejorar la gestión de tus tareas escolares.",
    },
    {
      id: "voz",
      icon: <FaMicrophone className="text-2xl" />,
      title: "Preguntas por voz",
      description:
        "Haz preguntas usando tu voz y recibe respuestas claras y rápidas del asistente.",
    },
    {
      id: "agenda",
      icon: <FaCalendarAlt className="text-2xl" />,
      title: "Agenda personal",
      description:
        "Añade y gestiona tus tareas y recordatorios directamente desde el chat.",
    },
  ];

  return (
    <section className="bg-black text-white font-champagne min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-yellow-400/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-400/2 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Conoce a{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent font-normal">
                Buho IA
              </span>
            </motion.h1>
            
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 font-light leading-relaxed max-w-3xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Tu asistente educativo que transforma la manera de estudiar.
              Resuelve dudas, organiza tareas y potencia tu aprendizaje.
            </motion.p>

            <motion.button
              onClick={scrollToPreguntas}
              className="group inline-flex items-center gap-3 text-yellow-400 hover:text-yellow-300 transition-all duration-300 text-lg font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              whileHover={{ y: -2 }}
            >
              Preguntas
              <FaChevronDown className="group-hover:translate-y-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          
          <motion.div
            className="relative group order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/30 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-gray-600/40 transition-colors duration-300">
                    <FaPlay className="text-gray-400 text-lg sm:text-xl ml-1" />
                  </div>
                  <p className="text-gray-500 text-sm sm:text-lg font-light">
                    Video próximamente
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
          

          <motion.div
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-8 sm:mb-12">
              ¿Qué puedes hacer con{" "}
              <span className="text-yellow-400">Buho IA</span>?
            </h2>

            {mainFeatures.map(({ id, icon, title, description }, index) => {
              const isActive = activeFeature === id;
              return (
                <motion.div
                  key={id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    onClick={() => toggleFeature(id)}
                    className="cursor-pointer py-4 sm:py-6 border-b border-gray-700 hover:border-gray-600 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-gray-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg lg:text-xl font-light text-white group-hover:text-gray-100 transition-colors duration-300">
                          {title}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-500 group-hover:text-gray-300 transition-colors duration-300"
                      >
                        <FaChevronDown className="text-sm" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed mt-3 sm:mt-4 ml-10 sm:ml-14 pr-4">
                            {description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div ref={preguntasRef} className="bg-gray-950/30 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-3 sm:mb-4">
              Preguntas{" "}
              <span className="text-yellow-400">frecuentes</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg font-light">
              Resuelve tus dudas sobre Buho IA
            </p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {preguntasEjemplo.map(({ pregunta, respuesta }, i) => {
              const isOpen = activePregunta === i;
              return (
                <motion.div
                  key={i}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => togglePregunta(i)}
                      className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left hover:bg-gray-800/20 transition-colors duration-300"
                    >
                      <span className="text-sm sm:text-base lg:text-lg font-light text-white pr-4">
                        {pregunta}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-500 flex-shrink-0"
                      >
                        <FaChevronDown className="text-sm" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-gray-700"
                        >
                          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                            <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
                              {respuesta}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;