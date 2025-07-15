"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../db/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface ProfileCardProps {
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onClose }) => {
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [academicContext, setAcademicContext] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [loading, setLoading] = useState(false);

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
      alert("Perfil actualizado correctamente");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 relative text-white">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-amber-400 transition"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h1 className="text-2xl mb-4 font-semibold text-amber-300">Editar Perfil</h1>

        <div className="mb-4">
          <label className="block text-sm mb-1">Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nuevo nombre"
            className="w-full px-3 py-2 rounded bg-black/30 border border-amber-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Contexto Académico</label>
          <input
            type="text"
            value={academicContext}
            onChange={(e) => setAcademicContext(e.target.value)}
            placeholder="Ej. Ingeniería, Licenciatura..."
            className="w-full px-3 py-2 rounded bg-black/30 border border-amber-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 rounded bg-black/30 border border-amber-400 text-white file:text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-amber-500 hover:file:bg-amber-400"
          />
          {photoBase64 && (
            <img
              src={photoBase64}
              alt="Foto de perfil"
              className="w-20 h-20 mt-3 rounded-full object-cover border-2 border-amber-400 mx-auto"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-amber-400 text-black w-full py-2 rounded hover:bg-amber-300 transition"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
