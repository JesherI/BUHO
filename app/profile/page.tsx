"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../db/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ProfileCard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [academicContext, setAcademicContext] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsername(data.username || "");
        setAcademicContext(data.academicContext || "");
        setPhotoBase64(data.photoBase64 || "");
      }
    };

    fetchProfile();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoBase64(base64String);
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
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-black rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-amber-500"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h1 className="text-2xl mb-4 text-white">Editar Perfil</h1>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nuevo nombre"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Contexto Académico</label>
          <input
            type="text"
            value={academicContext}
            onChange={(e) => setAcademicContext(e.target.value)}
            placeholder="Ej. Ingeniería, Licenciatura..."
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-white">Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded text-white"
          />
          {photoBase64 && (
            <img
              src={photoBase64}
              alt="Foto de perfil"
              className="w-20 h-20 mt-3 rounded-full object-cover border"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-amber-300 text-black px-4 py-2 rounded hover:bg-amber-500 transition w-full"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
