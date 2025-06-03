"use client";
import React, { useState } from "react";
import { BookOpen, PlusCircle, ListTodo, Search } from "lucide-react";
import "./sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTasks, setShowTasks] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleTasks = () => setShowTasks(!showTasks);

    return (
        <>
            {/* Botón abrir/cerrar sidebar */}
            <div className="sidebar-toggle" onClick={toggleSidebar} title="Abrir menú">
                <BookOpen size={22} color="#fff" />
            </div>

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    {/* Sección fija arriba */}
                    <div className="sidebar-top">
                        {/* Botón Nuevo Chat con ícono */}
                        <button className="new-chat-btn">
                            <PlusCircle size={18} /> Nuevo Chat
                        </button>

                        {/* Input de búsqueda con ícono */}
                        <div className="search-input-wrapper">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Contenido con scroll (historial, tareas, etc.) */}
                    <div className="sidebar-scroll">
                        {/* Conversaciones */}
                        <div className="sidebar-section">
                            <h2>Conversaciones</h2>
                            <ul className="conversation-list">
                                <li>Chat con amigas</li>
                                <li>Comer en clase</li>
                                <li>Hola chat c..</li>
                            </ul>
                        </div>

                        {/* Tareas */}
                        <div className="sidebar-section">
                            <button className="task-toggle" onClick={toggleTasks}>
                                <ListTodo size={16} style={{ marginRight: "6px" }} />
                                {showTasks ? "Ocultar Tareas" : "Mostrar Tareas"}
                            </button>
                            {showTasks && (
                                <>
                                    <ul className="task-list">
                                        <li>Terminar interfaz</li>
                                        <li>Conectar Firebase</li>
                                        <li>Agregar historial</li>
                                    </ul>

                                    {/* Botón Agregar Tarea */}
                                    <button className="sidebar-button" onClick={() => { /* lógica que despues hara jeche*/ }}>
                                        <PlusCircle size={16} />
                                        Agregar tarea
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
