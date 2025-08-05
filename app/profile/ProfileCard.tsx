"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "../db/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Check, X } from "lucide-react";

interface ProfileCardProps {
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onClose }) => {
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [academicContext, setAcademicContext] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    if (!user) {
      resetForm();
      return;
    }

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUsername(data.username || "");
          setAcademicContext(data.academicContext || "");
          setPhotoBase64(data.photoBase64 || "");
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        resetForm();
      }
    };

    fetchProfile();

    return () => {
      resetForm();
      setLoading(false);
    };
  }, [user]);

  const resetForm = () => {
    setUsername("");
    setAcademicContext("");
    setPhotoBase64("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username,
        academicContext,
        photoBase64,
      });
      setNotification({type: 'success', message: 'Successful'});
      setTimeout(() => {
        setNotification(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setNotification({type: 'error', message: 'Error al actualizar el perfil'});
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border flex items-center gap-3 transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-600/90 text-white border-emerald-500/30' 
            : 'bg-red-600/90 text-white border-red-500/30'
        }`}>
          {notification.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
      
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4" style={{
      background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 50%, #000000 100%)'
    }}>
      <div className="relative max-w-md w-full">
        {/* Fondo más oscuro */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 25%, #0a0a0a 50%, #050505 75%, #000000 100%)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(20, 20, 20, 0.3)'
        }}></div>
        
        {/* Estrellas más sutiles */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute top-4 left-8 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-12 right-12 w-0.5 h-0.5 bg-gray-500 rounded-full opacity-30"></div>
          <div className="absolute top-20 left-16 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-16 right-8 w-0.5 h-0.5 bg-gray-500 rounded-full opacity-30"></div>
          <div className="absolute bottom-8 left-12 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-40 animate-pulse"></div>
        </div>

        <div className="relative p-8 text-white">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors text-xl"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Avatar central con foto del usuario */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-gray-600 shadow-lg">
                {(photoBase64 || user?.photoURL) ? (
                  <Image
                    src={photoBase64 || user?.photoURL || ''}
                    alt="Foto de perfil"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover"
                    priority
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
              {/* Icono de lápiz para editar */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-800 cursor-pointer hover:bg-gray-600 transition-colors"
                   onClick={() => document.getElementById('photo-input')?.click()}>
                <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-xl mb-6 font-light text-center text-gray-300">Editar Perfil</h1>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <label className="text-sm text-gray-400">Username</label>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg bg-black/30 backdrop-blur-sm border border-gray-700 placeholder-gray-500 text-gray-200 focus:outline-none focus:border-gray-500 focus:bg-black/40 transition-all"
                autoComplete="off"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zM18.82 9L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
                <label className="text-sm text-gray-400">Academic Context</label>
              </div>
              <input
                type="text"
                value={academicContext}
                onChange={(e) => setAcademicContext(e.target.value)}
                placeholder="E.g. Engineering, Bachelor's..."
                className="w-full px-4 py-3 rounded-lg bg-black/30 backdrop-blur-sm border border-gray-700 placeholder-gray-500 text-gray-200 focus:outline-none focus:border-gray-500 focus:bg-black/40 transition-all"
                autoComplete="off"
              />
            </div>

            {/* Input de archivo oculto */}
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-600"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfileCard;