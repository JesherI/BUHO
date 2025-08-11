"use client";
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, Mic, ChevronDown, Play, Star, Check, Send, Brain, Zap } from "lucide-react";
import Image from "next/image";

const preguntasEjemplo = [
  {
    pregunta: "¿Cómo funciona Buho IA?",
    respuesta: "Buho IA responde tus dudas escolares mediante chat de texto o voz y te ayuda a organizar tus tareas.",
  },
  {
    pregunta: "¿Puedo añadir tareas a la agenda?",
    respuesta: "Sí, Buho IA incluye una agenda para que agregues recordatorios y tareas directamente desde el chat.",
  },
  {
    pregunta: "¿Es seguro usar Buho IA?",
    respuesta: "Sí, la privacidad y seguridad de tus datos es una prioridad en Buho IA.",
  },
  {
    pregunta: "¿Cuánto cuesta usar Buho IA?",
    respuesta: "Buho IA ofrece un plan totalmente gratuito con funciones básicas y características avanzadas para potenciar tu experiencia educativa.",
  },
];

const useIntersectionObserver = (options = {}): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);

        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isVisible];
};

const Header: React.FC = () => {
  const [activePregunta, setActivePregunta] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [heroRef, heroVisible] = useIntersectionObserver();
  const [videoSectionRef, videoSectionVisible] = useIntersectionObserver();
  const [featuresSectionRef, featuresSectionVisible] = useIntersectionObserver();
  const [faqSectionRef, faqSectionVisible] = useIntersectionObserver();

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const scrollToSection = (sectionName: string) => {
    let targetElement: HTMLElement | null = null;
    
    switch (sectionName) {
      case 'video':
        targetElement = videoSectionRef.current;
        break;
      case 'features':
        targetElement = featuresSectionRef.current;
        break;
      case 'faq':
        targetElement = faqSectionRef.current;
        break;
    }
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const togglePregunta = (index: number) => {
    setActivePregunta(activePregunta === index ? null : index);
  };

  const features = [
    "Respuestas inteligentes a preguntas académicas",
    "Interacción por voz y texto",
    "Organización automática de tareas",
    "Agenda personal integrada",
    "Recordatorios inteligentes",
    "Disponible 24/7",
  ];

  const stats = [
    { number: "24/7", label: "Disponible" },
    { number: "∞", label: "Preguntas" },
    { number: "100%", label: "Gratis" },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 -z-10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-yellow-500/3 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-400/4 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-500/2 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
      </div>

      <section className="min-h-screen flex items-center relative z-10">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto">

            <div className={`mb-8 transition-all duration-1000 ${heroVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} ref={heroRef}>
              <div className="inline-flex items-center gap-2 border border-amber-500/30 rounded-full px-4 py-2 text-sm backdrop-blur-sm bg-amber-500/5">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400">
                  Asistente educativo inteligente
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div className="space-y-8">
                <div className={`space-y-6 transition-all duration-1000 delay-200 ${heroVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                  <h1 className="text-4xl md:text-6xl font-light leading-tight">
                    Conoce a{" "}
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-normal animate-pulse">
                      Buho IA
                    </span>
                  </h1>

                  <p className="text-xl text-gray-300 leading-relaxed">
                    Tu compañero inteligente para el aprendizaje. Resuelve dudas,
                    organiza tareas y potencia tu educación con inteligencia artificial.
                  </p>
                </div>

                <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400 ${heroVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                  <button
                    onClick={() => scrollToSection('video')}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 transform hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    Ver Demo
                  </button>

                  <button
                    onClick={() => scrollToSection('features')}
                    className="border border-gray-600 hover:border-amber-500/50 hover:bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg cursor-pointer"
                  >
                    Conocer más
                  </button>
                </div>
              </div>

              <div className={`space-y-8 transition-all duration-1000 delay-600 ${heroVisible ? 'animate-fade-in-left' : 'opacity-0 translate-x-8'}`}>
                <div className="grid grid-cols-3 gap-8">
                  {stats.map(({ number, label }, i) => (
                    <div key={i} className={`text-center group cursor-default transition-all duration-500 ${heroVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: `${700 + i * 100}ms` }}>
                      <div className="text-3xl font-light text-amber-100 mb-2 group-hover:text-amber-300 transition-colors duration-300 group-hover:scale-110 transform">{number}</div>
                      <div className="text-sm text-gray-400 uppercase tracking-wide group-hover:text-gray-300 transition-colors duration-300">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-300">¿Qué incluye?</h3>
                  <div className="space-y-3">
                    {features.map((feature, i) => (
                      <div key={i} className={`flex items-center gap-3 group transition-all duration-500 ${heroVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-4'}`} style={{ animationDelay: `${1000 + i * 100}ms` }}>
                        <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400/30 transition-colors duration-300">
                          <Check className="w-3 h-3 text-amber-400" />
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-800/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-1000 ${videoSectionVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} ref={videoSectionRef}>
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Mira <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Buho IA</span> en acción
              </h2>
              <p className="text-lg text-gray-400">
                Descubre cómo funciona nuestra inteligencia artificial
              </p>
            </div>

            <div className={`aspect-video bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden hover:border-amber-200/30 transition-all duration-1000 delay-300 backdrop-blur-sm relative ${videoSectionVisible ? 'animate-fade-in-scale' : 'opacity-0 scale-95'}`}>
              <video 
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <source src="/BUHO.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento video.
              </video>
              
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 border border-gray-700 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:border-amber-200 hover:bg-amber-400/10 transition-all duration-300 group">
                    <Play className="w-6 h-6 text-gray-400 group-hover:text-amber-200 ml-0.5 transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Demo de Buho IA</h3>
                    <p className="text-gray-500">Haz clic para reproducir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-800/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div className={`space-y-8 transition-all duration-1000 ${featuresSectionVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-8'}`} ref={featuresSectionRef}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-light mb-6">
                    Diseñado para{" "}
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">estudiantes</span>
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Buho IA comprende tus necesidades académicas y se adapta a tu forma de aprender.
                    No es solo un chatbot, es tu compañero de estudios inteligente.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: MessageCircle, title: "Conversación natural", desc: "Pregunta como si hablaras con un compañero de clase. Buho IA entiende el contexto y te responde de manera clara." },
                    { icon: Brain, title: "Aprendizaje personalizado", desc: "Se adapta a tu nivel y estilo de aprendizaje para ofrecerte explicaciones que realmente entiendas." },
                    { icon: Zap, title: "Siempre disponible", desc: "No importa la hora, Buho IA está listo para ayudarte cuando lo necesites." }
                  ].map(({ icon: Icon, title, desc }, i) => (
                    <div key={i} className={`flex gap-4 group transition-all duration-700 ${featuresSectionVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: `${300 + i * 200}ms` }}>
                      <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-amber-400/30 transition-colors duration-300">
                        <Icon className="w-3 h-3 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 group-hover:text-amber-400 transition-colors duration-300">{title}</h3>
                        <p className="text-gray-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`relative transition-all duration-1000 delay-400 ${featuresSectionVisible ? 'animate-fade-in-left' : 'opacity-0 translate-x-8'}`}>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-6 space-y-4 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      <Image 
                        src="/logo.png" 
                        alt="Buho IA Logo" 
                        width={32} 
                        height={32} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Buho IA</div>
                      <div className="text-sm text-green-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        En línea
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-end animate-slide-in-right">
                      <div className="bg-gradient-to-r from-[#f5deb3] via-[#d4af37] to-[#cfae7b] text-black px-4 py-2 rounded-lg max-w-xs shadow-md">
                        ¿Puedes ayudarme con matemáticas?
                      </div>
                    </div>

                    <div className="flex animate-slide-in-left">
                      <div className="bg-gray-800/70 border border-gray-700/50 px-4 py-2 rounded-lg max-w-xs shadow-lg backdrop-blur-sm">
                        ¡Por supuesto! ¿Qué tema específico te gustaría repasar?
                      </div>
                    </div>

                    <div className="flex justify-end animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
                      <div className="bg-gradient-to-r from-[#f5deb3] via-[#d4af37] to-[#cfae7b] text-black px-4 py-2 rounded-lg max-w-xs shadow-md">
                        Ecuaciones cuadráticas
                      </div>
                    </div>

                    <div className="flex animate-slide-in-left" style={{ animationDelay: '1s' }}>
                      <div className="bg-gray-800/70 border border-gray-700/50 px-4 py-2 rounded-lg max-w-sm shadow-lg backdrop-blur-sm">
                        Perfecto. Te explicaré paso a paso cómo resolver ecuaciones cuadráticas...
                      </div>
                    </div>

                    <div className="flex animate-slide-in-left" style={{ animationDelay: '1.5s' }}>
                      <div className="bg-gray-800/70 border border-gray-700/50 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-700/50">
                    <div className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-gray-500 transition-colors duration-300 focus-within:border-amber-400 backdrop-blur-sm">
                      Escribe tu pregunta...
                    </div>
                    <button className="p-2 text-amber-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-amber-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-800/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${faqSectionVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} ref={faqSectionRef}>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Preguntas <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">frecuentes</span>
            </h2>
            <p className="text-lg text-gray-400">Resuelve tus dudas sobre Buho IA</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {preguntasEjemplo.map(({ pregunta, respuesta }, i) => {
              const isOpen = activePregunta === i;
              return (
                <div key={i} className={`group transition-all duration-700 ${faqSectionVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: `${300 + i * 150}ms` }}>
                  <button
                    onClick={() => togglePregunta(i)}
                    className="w-full flex justify-between items-center py-6 text-left border-b border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 cursor-pointer hover:bg-gray-900/20 px-4 rounded-lg"
                  >
                    <span className="font-medium pr-4 text-gray-200 group-hover:text-amber-300 transition-colors duration-300">{pregunta}</span>
                    <div className={`text-gray-400 flex-shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-amber-400' : 'group-hover:text-amber-400'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="animate-slide-down border-b border-gray-700/50">
                      <div className="py-4 px-4 bg-gray-900/10 rounded-b-lg">
                        <p className="text-gray-300 leading-relaxed pl-2 border-l-2 border-amber-400/30">{respuesta}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Header;