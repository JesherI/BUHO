"use client";
import React, { useState } from "react";
import {
    Search,
    Book,
    MessageCircle,
    Settings,
    Zap,
    Shield,
    Users,
    ChevronRight,
    Star,    Clock,ArrowLeft,} from "lucide-react";

import Image from "next/image";

// Definición de interfaces para tipado
interface Category {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    articles: number;
    color: string;
}

interface Article {
    id: string;
    title: string;
    views: string;
    time: string;
    category?: string;
    summary?: string;
    content?: string;
}

const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentView, setCurrentView] = useState<"home" | "category" | "article">("home");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const categories: Category[] = [
        {
            id: "getting-started",
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Comenzar con Buho AI",
            description: "Aprende los conceptos básicos",
            articles: 12,
            color: "bg-yellow-900 text-yellow-400",
        },
        {
            id: "advanced-features",
            icon: <Zap className="w-6 h-6" />,
            title: "Funciones Avanzadas",
            description: "Maximiza tu experiencia",
            articles: 8,
            color: "bg-yellow-900 text-yellow-400",
        },
        {
            id: "settings",
            icon: <Settings className="w-6 h-6" />,
            title: "Configuración",
            description: "Personaliza tu cuenta",
            articles: 15,
            color: "bg-yellow-900 text-yellow-400",
        },
        {
            id: "privacy-security",
            icon: <Shield className="w-6 h-6" />,
            title: "Privacidad y Seguridad",
            description: "Protege tu información",
            articles: 6,
            color: "bg-yellow-900 text-yellow-400",
        },
        {
            id: "collaboration",
            icon: <Users className="w-6 h-6" />,
            title: "Colaboración",
            description: "Trabaja en equipo",
            articles: 10,
            color: "bg-yellow-900 text-yellow-400",
        },
        {
            id: "resources",
            icon: <Book className="w-6 h-6" />,
            title: "Recursos y Guías",
            description: "Documentación completa",
            articles: 20,
            color: "bg-yellow-900 text-yellow-400",
        },
    ];

    const popularArticles: Article[] = [
        {
            id: "first-conversation",
            title: "¿Cómo empezar tu primera conversación?",
            views: "1.2k visualizaciones",
            time: "2 min de lectura",
            category: "getting-started",
            summary:
                "Aprende a iniciar tu primera conversación con Buho AI de manera sencilla y efectiva. Descubre cómo acceder a la plataforma, formular tus preguntas y obtener respuestas precisas para maximizar tu experiencia desde el primer mensaje.",
        },
        {
            id: "custom-responses",
            title: "Configurar respuestas personalizadas",
            views: "890 visualizaciones",
            time: "5 min de lectura",
            category: "advanced-features",
            summary:
                "Personaliza las respuestas de Buho AI para adaptarlas a tu estilo y necesidades. Aprende a configurar el tono, la longitud y respuestas automáticas que mejoren la interacción y la relevancia de las respuestas.",
        },
        {
            id: "integrations",
            title: "Integrar Búho AI con otras aplicaciones",
            views: "756 visualizaciones",
            time: "8 min de lectura",
            category: "advanced-features",
            summary:
                "Descubre cómo conectar Búho AI con tus aplicaciones favoritas como Microsoft Office, Google Workspace y Slack. Sigue pasos claros para autenticar y configurar integraciones que mejoren tu productividad.",
        },
        {
            id: "troubleshooting",
            title: "Solucionar problemas comunes",
            views: "634 visualizaciones",
            time: "4 min de lectura",
            category: "settings",
            summary:
                "Encuentra soluciones prácticas para problemas frecuentes como falta de respuesta, lentitud o dificultades de acceso. Sigue consejos paso a paso para resolver inconvenientes y mejorar tu experiencia con Buho AI.",
        },
    ];

    // Contenido de artículos por categoría
    const articlesByCategory: { [key: string]: Article[] } = {
        "getting-started": [
            {
                id: "first-conversation",
                title: "¿Cómo empezar tu primera conversación?",
                views: "1.2k visualizaciones",
                time: "2 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-white-800">
        <h2 class="text-xl font-semibold text-white-900">Comenzando tu primera conversación con Buho AI</h2>
        <p>Iniciar una conversación con Buho AI es muy sencillo. Aquí te explicamos paso a paso:</p>

        <h3 class="mt-4 text-lg font-semibold text-white-900">1. Acceso a la plataforma</h3>
        <p>Una vez que hayas iniciado sesión, encontrarás el chat principal en la pantalla de inicio.</p>

        <h3 class="mt-4 text-lg font-semibold text-white-900">2. Escribir tu primer mensaje</h3>
        <p>Simplemente escribe tu pregunta o solicitud en el cuadro de texto. Buho AI entiende lenguaje natural, así que puedes expresarte de manera conversacional.</p>

        <h3 class="mt-4 text-lg font-semibold text-white-900">3. Tipos de consultas que puedes hacer</h3>
        <ul class="list-disc list-inside space-y-1">
        <li>Preguntas generales sobre cualquier tema</li>
        <li>Solicitudes de ayuda con tareas específicas</li>
        <li>Análisis de documentos o textos</li>
        <li>Generación de contenido creativo</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold text-white-900">4. Consejos para mejores resultados</h3>
        <p>Para obtener respuestas más precisas, sé específico en tus preguntas y proporciona contexto cuando sea necesario.</p>
        </div>
      `,
            },

            {
                id: "interface-basics",
                title: "Navegación básica de la interfaz",
                views: "920 visualizaciones",
                time: "3 min de lectura",
                content: `
      <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
      <h2 class="text-xl font-semibold text-white">Conoce la interfaz de Buho AI</h2>
      <p>Familiarízate con los elementos principales de la interfaz:</p>

      <h3 class="mt-4 text-lg font-semibold text-white">Panel principal</h3>
      <p>El área central donde aparecen tus conversaciones y las respuestas de Buho AI.</p>

      <h3 class="mt-4 text-lg font-semibold text-white">Barra lateral</h3>
      <p>Contiene el historial de conversaciones y opciones de configuración rápida.</p>

      <h3 class="mt-4 text-lg font-semibold text-white">Barra de herramientas</h3>
      <p>Acceso rápido a funciones como adjuntar archivos, cambiar modo de conversación, etc.</p>
      </div>
    `,
            },
        ],
        "advanced-features": [
            {
                id: "custom-responses",
                title: "Configurar respuestas personalizadas",
                views: "890 visualizaciones",
                time: "5 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
        <h2 class="text-xl font-semibold">Personaliza las respuestas de Buho AI</h2>
        <p>Aprende a configurar respuestas que se adapten a tu estilo y necesidades:</p>

        <h3 class="mt-4 text-lg font-semibold">1. Acceder a la configuración</h3>
        <p>Ve a Configuración &gt; Personalización &gt; Respuestas</p>

        <h3 class="mt-4 text-lg font-semibold">2. Definir tu tono preferido</h3>
        <p>Puedes elegir entre diferentes estilos:</p>
        <ul class="list-disc list-inside">
        <li>Formal y profesional</li>
        <li>Casual y amigable</li>
        <li>Técnico y detallado</li>
        <li>Creativo y expresivo</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">3. Configurar respuestas automáticas</h3>
        <p>Establece respuestas predeterminadas para consultas frecuentes.</p>

        <h3 class="mt-4 text-lg font-semibold">4. Ajustar la longitud de respuestas</h3>
        <p>Controla si prefieres respuestas concisas o detalladas.</p>
        </div>
      `,

            },
            {
                id: "integrations",
                title: "Integrar Buho AI con otras aplicaciones",
                views: "756 visualizaciones",
                time: "8 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
        <h2 class="text-xl font-semibold">Conecta Buho AI con tus herramientas favoritas</h2>
        <p>Maximiza tu productividad integrando Buho AI con otras aplicaciones:</p>

        <h3 class="mt-4 text-lg font-semibold">Integraciones disponibles</h3>
        <ul class="list-disc list-inside">
        <li>Microsoft Office Suite</li>
        <li>Google Workspace</li>
        <li>Slack y Teams</li>
        <li>Notion y Trello</li>
        <li>Calendarios y planificadores</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">Configuración de integraciones</h3>
        <p>Para configurar una integración:</p>
        <ol class="list-decimal list-inside">
        <li>Ve a Configuración &gt; Integraciones</li>
        <li>Selecciona la aplicación que deseas conectar</li>
        <li>Sigue las instrucciones de autenticación</li>
        <li>Configura los permisos necesarios</li>
        </ol>

        <h3 class="mt-4 text-lg font-semibold">Uso de integraciones</h3>
        <p>Una vez configuradas, puedes acceder a estas funciones directamente desde el chat.</p>
        </div>
      `,

            },
        ],
        settings: [
            {
                id: "troubleshooting",
                title: "Solucionar problemas comunes",
                views: "634 visualizaciones",
                time: "4 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
        <h2 class="text-xl font-semibold">Solución de problemas frecuentes</h2>
        <p>Aquí encontrarás soluciones a los problemas más comunes:</p>

        <h3 class="mt-4 text-lg font-semibold">Problema: Buho AI no responde</h3>
        <p>Soluciones:</p>
        <ul class="list-disc list-inside">
          <li>Verifica tu conexión a internet</li>
          <li>Actualiza la página</li>
          <li>Limpia el caché del navegador</li>
          <li>Reinicia tu sesión</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">Problema: Respuestas lentas</h3>
        <p>Posibles causas y soluciones:</p>
        <ul class="list-disc list-inside">
        <li>Consultas muy complejas - simplifica tu pregunta</li>
        <li>Servidor ocupado - espera unos minutos</li>
        <li>Conexión lenta - verifica tu velocidad de internet</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">Problema: No puedo acceder a mi cuenta</h3>
        <p>Pasos para recuperar el acceso:</p>
        <ol class="list-decimal list-inside">
          <li>Verifica tu email y contraseña</li>
          <li>Usa la opción "Olvidé mi contraseña"</li>
          <li>Contacta al soporte técnico</li>
        </ol>
        </div>
      `,

            },
        ],
        "privacy-security": [
            {
                id: "data-privacy",
                title: "Privacidad de datos",
                views: "445 visualizaciones",
                time: "6 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
        <h2 class="text-xl font-semibold">Protección de tu privacidad</h2>
        <p>En Buho AI, tu privacidad es nuestra prioridad. Aquí te explicamos cómo protegemos tu información:</p>

        <h3 class="mt-4 text-lg font-semibold">Qué datos recopilamos</h3>
        <ul class="list-disc list-inside">
        <li>Información de conversaciones para mejorar el servicio</li>
        <li>Datos de uso para optimizar la experiencia</li>
        <li>Información de cuenta básica</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">Cómo protegemos tu información</h3>
        <ul class="list-disc list-inside">
        <li>Encriptación end-to-end</li>
        <li>Servidores seguros</li>
        <li>Acceso restringido al personal autorizado</li>
        <li>Auditorías de seguridad regulares</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">Tus derechos</h3>
        <p>Tienes derecho a:</p>
        <ul class="list-disc list-inside">
        <li>Acceder a tus datos</li>
        <li>Corregir información incorrecta</li>
        <li>Eliminar tu cuenta y datos</li>
        <li>Exportar tu información</li>
        </ul>
        </div>
      `,

            },
        ],
        collaboration: [
            {
                id: "team-features",
                title: "Funciones para equipos",
                views: "567 visualizaciones",
                time: "7 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
        <h2 class="text-xl font-semibold">Colabora efectivamente con tu equipo</h2>
        <p>Buho AI ofrece herramientas poderosas para la colaboración en equipo:</p>

        <h3 class="mt-4 text-lg font-semibold">Espacios de trabajo compartidos</h3>
        <p>Crea espacios donde tu equipo puede colaborar en tiempo real.</p>

        <h3 class="mt-4 text-lg font-semibold">Roles y permisos</h3>
        <ul class="list-disc list-inside">
        <li>Administrador: Control total del espacio</li>
        <li>Editor: Puede crear y modificar contenido</li>
        <li>Colaborador: Puede participar en conversaciones</li>
        <li>Visualizador: Solo puede ver el contenido</li>
        </ul>

        <h3 class="mt-4 text-lg font-semibold">Herramientas de colaboración</h3>
        <ul class="list-disc list-inside">
        <li>Comentarios en tiempo real</li>
        <li>Historial de cambios</li>
        <li>Notificaciones de equipo</li>
        <li>Integración con calendarios</li>
        </ul>
        </div>
      `,

            },
        ],
        resources: [
            {
                id: "api-documentation",
                title: "Documentación de API",
                views: "789 visualizaciones",
                time: "10 min de lectura",
                content: `
        <div class="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none text-white">
        <h2 class="text-xl font-semibold">Guía completa de la API de Buho AI</h2>
        <p>Aprende a integrar Buho AI en tus aplicaciones usando nuestra API:</p>

        <h3 class="mt-4 text-lg font-semibold">Autenticación</h3>
        <p>Todas las llamadas a la API requieren autenticación mediante token:</p>
        <pre><code>
        Headers:
        Authorization: Bearer {tu-token}
        Content-Type: application/json
        </code></pre>

        <h3 class="mt-4 text-lg font-semibold">Endpoints principales</h3>
        <ul class="list-disc list-inside">
        <li><code>POST /api/chat</code> - Enviar mensaje</li>
        <li><code>GET /api/conversations</code> - Obtener conversaciones</li>
        <li><code>GET /api/user</code> - Información del usuario</li>
        </ul>

          <h3 class="mt-4 text-lg font-semibold">Ejemplo de uso</h3>
          <pre><code>
          curl -X POST "https://api.buhoai.com/chat" \\
          -H "Authorization: Bearer {token}" \\
          -H "Content-Type: application/json" \\
          -d '{
          "message": "Hola, ¿cómo estás?",
          "conversation_id": "123"
          }'
          </code></pre>

          <h3 class="mt-4 text-lg font-semibold">Límites y restricciones</h3>
          <p>Consulta nuestros límites de uso para planificar tu implementación.</p>
          </div>
      `,

            },
        ],
    };

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setCurrentView("category");
    };

    const handleArticleClick = (article: Article) => {
        const fullArticle = articlesByCategory[article.category ?? ""]?.find((a) => a.id === article.id) || article;
        setSelectedCategory(categories.find((cat) => cat.id === article.category) || null);
        setSelectedArticle(fullArticle);
        setCurrentView("article");
    };

    const handleBack = () => {
        if (currentView === "article") {
            setCurrentView("category");
            setSelectedArticle(null);
        } else if (currentView === "category") {
            setCurrentView("home");
            setSelectedCategory(null);
        }
    };

    const handleHome = () => {
        setCurrentView("home");
        setSelectedCategory(null);
        setSelectedArticle(null);
    };

    const filteredArticles = searchTerm
        ? popularArticles.filter((article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : popularArticles;

    const filteredCategories = searchTerm
        ? categories.filter(
            (category) =>
                category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : categories;

    if (currentView === "article" && selectedArticle && selectedCategory) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] text-white">
                <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800 h-[72px]">
                    <div className="flex items-center space-x-4">
                        <button onClick={handleHome} className="flex items-center hover:text-yellow-500">
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        </button>
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-400 hover:text-yellow-500"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Volver
                        </button>
                    </div>
                </nav>

                <div className="pt-24 pb-16 px-6">
                    <div className="max-w-4xl mx-auto bg-[#0d0d0d]/70 rounded-2xl shadow-md p-6 border border-gray-800">
                        <div className="mb-8">
                            <div className="flex items-center text-sm text-gray-400 mb-4">
                                <span>{selectedCategory.title}</span>
                                <span className="px-2 select-none">&nbsp;•&nbsp;</span>
                                <span className="text-yellow-500">{selectedArticle.title}</span>
                            </div>
                            <h1 className="text-5xl font-bold mb-4 text-yellow-500">
                                {selectedArticle.title}
                            </h1>
                            <div className="flex space-x-6 text-sm text-gray-400 mb-8">
                                <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    {selectedArticle.views}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 text-yellow-500" />
                                    {selectedArticle.time}
                                </span>
                            </div>
                        </div>

                        <article className="prose prose-invert prose-yellow max-w-none">
                            <div
                                className="text-gray-200 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: selectedArticle.content ?? "" }}
                            />
                        </article>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === "category" && selectedCategory) {
        const categoryArticles = articlesByCategory[selectedCategory.id] || [];

        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] text-white">
                <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800 h-[72px]">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                            <Image
                                src="/logo.png"
                                alt="Logo Buho AI"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-400 hover:text-yellow-500"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Volver al inicio
                        </button>
                    </div>
                </nav>

                <div className="pt-24 pb-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 flex items-center">
                            <div
                                className={`${selectedCategory.color} p-3 rounded-xl mr-4 flex items-center justify-center`}
                            >
                                {selectedCategory.icon}
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold text-yellow-500">
                                    {selectedCategory.title}
                                </h1>
                                <p className="text-lg text-gray-400">{selectedCategory.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {categoryArticles.map((article, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0d0d0d]/70 border border-gray-800 rounded-2xl p-6 shadow-md hover:bg-[#1a1a1a] transition-all cursor-pointer"
                                    onClick={() => handleArticleClick({ ...article, category: selectedCategory.id })}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-yellow-900 p-3 rounded-xl text-yellow-400 flex items-center justify-center">
                                            <Star className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">
                                                {article.title}
                                            </h3>
                                            {article.summary && (
                                                <p className="text-gray-400 text-sm mb-2">
                                                    {article.summary}
                                                </p>
                                            )}
                                            <div className="flex space-x-4 text-sm text-gray-400">
                                                <span className="flex items-center">
                                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                                    {article.views}
                                                </span>
                                                <span className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1 text-yellow-500" />
                                                    {article.time}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-yellow-400 ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] text-white">
            <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center px-6 py-4 bg-black border-b border-gray-800 h-[72px]">
                <div className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo Buho AI"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                </div>
            </nav>

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-white">Centro de</span>{" "}
                        <span className="text-yellow-500">Ayuda</span>
                    </h1>
                    <p className="text-lg text-gray-400 mb-8">
                        Encuentra respuestas, guías y recursos para aprovechar al máximo Buho
                        AI
                    </p>
                    <div className="relative max-w-2xl mx-auto mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar en el centro de ayuda..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#0d0d0d]/70 rounded-2xl border border-gray-800 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 text-white placeholder-gray-500 text-lg transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="px-6 mb-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl font-bold mb-8 text-center">
                        <span className="text-white">Categorías de</span>{" "}
                        <span className="text-yellow-500">Ayuda</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-[#0d0d0d]/70 border border-gray-800 rounded-2xl p-6 shadow-md hover:bg-[#1a1a1a] transition-all cursor-pointer"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`${category.color} p-3 rounded-xl flex items-center justify-center`}
                                    >
                                        {category.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold text-lg mb-1">
                                            {category.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-2">
                                            {category.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{category.articles} artículos</span>
                                            <ChevronRight className="w-4 h-4 text-yellow-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 mb-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl font-bold mb-8 text-center">
                        <span className="text-white">Artículos</span>{" "}
                        <span className="text-yellow-500">Populares</span>
                    </h2>
                    <div className="space-y-4">
                        {filteredArticles.map((article, index) => (
                            <div
                                key={index}
                                className="bg-[#0d0d0d]/70 border border-gray-800 rounded-2xl p-6 shadow-md hover:bg-[#1a1a1a] transition-all cursor-pointer"
                                onClick={() => handleArticleClick(article)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                                            {article.title}
                                        </h3>
                                        <div className="flex space-x-4 text-sm text-gray-400">
                                            <span className="flex items-center">
                                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                                {article.views}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1 text-yellow-500" />
                                                {article.time}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-yellow-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="bg-black border-t border-gray-800 py-8 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="rounded-lg mr-3"
                        />
                    </div>
                    <p className="text-gray-400">© 2024 Buho AI. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;