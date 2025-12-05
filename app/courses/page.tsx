'use client';

import React, { useState } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import Navbar from '../components/navbar/navbar';
import ProfileMenu from '../components/profileMenu/profileMenu';
import ProfileCard from '../profile/ProfileCard';

export default function CoursesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleProfileClick = () => setShowProfile(true);
    const handleCloseProfile = () => setShowProfile(false);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden relative">
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main content */}
            <div
                className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-80' : 'ml-0 md:ml-20'
                    }`}
            >
                {/* Navbar */}
                <div className="fixed top-0 w-full z-40">
                    <Navbar showAuth={false} toggleSidebar={toggleSidebar}>
                        <ProfileMenu onProfileClick={handleProfileClick} />
                    </Navbar>
                </div>

                {/* Page content */}
                <main className="flex-1 pt-16 overflow-y-auto safe-area-inset p-4 md:p-8">
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Cursos</h1>
                        <p className="text-gray-400 text-base md:text-lg mb-6">
                            Bienvenido a la sección de cursos.
                        </p>
                        <div className="w-full max-w-2xl bg-gray-900/50 rounded-xl border border-gray-800 p-4 md:p-6">
                            <p className="text-gray-300 text-base md:text-lg">
                                Próximamente encontrarás contenido educativo aquí.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Profile Card modal */}
            {showProfile && <ProfileCard key={Date.now()} onClose={handleCloseProfile} />}
        </div>
    );
}
