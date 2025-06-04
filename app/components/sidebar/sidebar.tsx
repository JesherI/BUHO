"use client";
import React, { useState } from "react";
import { BookOpen, PlusCircle, ListTodo, Search, Trash2 } from "lucide-react";
import "./sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [tasks, setTasks] = useState([
        { id: 1, text: "Terminar interfaz", completed: false },
        { id: 2, text: "Conectar Firebase", completed: false },
        { id: 3, text: "Agregar historial", completed: false },
    ]);
    const [newTask, setNewTask] = useState("");
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleTasks = () => setShowTasks(!showTasks);

    const handleToggleVisualTask = (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleAddTaskClick = () => {
        if (!showNewTaskInput) {
            setShowNewTaskInput(true);
            setNewTask("");
        } else if (newTask.trim() !== "") {
            const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
            setTasks([...tasks, { id: newId, text: newTask.trim(), completed: false }]);
            setNewTask("");
            setShowNewTaskInput(false);
        }
    };

    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <>
            <div className="sidebar-toggle" onClick={toggleSidebar} title="Abrir menú">
                <BookOpen size={22} color="#fff" />
            </div>

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    <div className="sidebar-top">
                        <button className="new-chat-btn">
                            <PlusCircle size={18} /> Nuevo Chat
                        </button>

                        <div className="search-input-wrapper">
                            <Search size={16} />
                            <input type="text" placeholder="Buscar..." className="search-input" />
                        </div>
                    </div>

                    <div className="sidebar-scroll">
                        <div className="sidebar-section">
                            <h2>Conversaciones</h2>
                            <ul className="conversation-list">
                                <li>Chat con amigas</li>
                                <li>Comer en clase</li>
                                <li>Hola chat c..</li>
                            </ul>
                        </div>

                        <div className="sidebar-section">
                            <button className="task-toggle" onClick={toggleTasks}>
                                <ListTodo size={16} style={{ marginRight: "6px" }} />
                                {showTasks ? "Ocultar Tareas" : "Mostrar Tareas"}
                            </button>

                            {showTasks && (
                                <>
                                    <ul className="task-list">
                                        {tasks.map(({ id, text, completed }) => (
                                            <li
                                                key={id}
                                                onClick={() => handleToggleVisualTask(id)}
                                                className={completed ? "completed" : ""}
                                            >
                                                <span>{text}</span>
                                                <Trash2
                                                    size={16}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTask(id);
                                                    }}
                                                    style={{ cursor: "pointer", color: "#d4af37" }}
                                                >
                                                    <title>Eliminar tarea</title>
                                                </Trash2>
                                            </li>
                                        ))}
                                    </ul>

                                    {showNewTaskInput && (
                                        <div className="new-task-wrapper visible">
                                            <input
                                                type="text"
                                                value={newTask}
                                                onChange={(e) => setNewTask(e.target.value)}
                                                placeholder="Nueva tarea..."
                                                className="new-task-input"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleAddTaskClick();
                                                    if (e.key === "Escape") setShowNewTaskInput(false);
                                                }}
                                            />
                                        </div>
                                    )}

                                    <button className="sidebar-button" onClick={handleAddTaskClick}>
                                        <PlusCircle size={16} />
                                        {showNewTaskInput ? "Guardar tarea" : "Añadir tarea"}
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
