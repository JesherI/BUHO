"use client";

import { useState, useEffect } from "react";
import { encrypt, decrypt } from "../lib/encryptionService";

export default function EncryptionTestPage() {
  const [originalText, setOriginalText] = useState("Hola, este es un mensaje de prueba para encriptar");
  const [encryptedData, setEncryptedData] = useState<{ciphertext: string, iv: string, key: string} | null>(null);
  const [decryptedText, setDecryptedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEncrypt = async () => {
    if (!originalText) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await encrypt(originalText);
      setEncryptedData(result);
      console.log("Texto encriptado:", result);
    } catch (err) {
      setError("Error al encriptar: " + (err instanceof Error ? err.message : String(err)));
      console.error("Error al encriptar:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedData) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await decrypt(
        encryptedData.ciphertext,
        encryptedData.iv,
        encryptedData.key
      );
      setDecryptedText(result);
      console.log("Texto desencriptado:", result);
    } catch (err) {
      setError("Error al desencriptar: " + (err instanceof Error ? err.message : String(err)));
      console.error("Error al desencriptar:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-amber-400">Prueba de Encriptación AES-256</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Texto Original</h2>
          <textarea
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            rows={4}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Escribe un texto para encriptar..."
          />
          <button
            onClick={handleEncrypt}
            disabled={isLoading || !originalText}
            className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Procesando..." : "Encriptar"}
          </button>
        </div>
        
        {encryptedData && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Datos Encriptados</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <div className="mb-3">
                <span className="font-medium text-amber-400">Texto cifrado (base64):</span>
                <p className="mt-1 break-all text-sm">{encryptedData.ciphertext}</p>
              </div>
              <div className="mb-3">
                <span className="font-medium text-amber-400">Vector de inicialización (IV):</span>
                <p className="mt-1 break-all text-sm">{encryptedData.iv}</p>
              </div>
              <div>
                <span className="font-medium text-amber-400">Clave (base64):</span>
                <p className="mt-1 break-all text-sm">{encryptedData.key}</p>
              </div>
            </div>
            <button
              onClick={handleDecrypt}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:opacity-50"
            >
              {isLoading ? "Procesando..." : "Desencriptar"}
            </button>
          </div>
        )}
        
        {decryptedText && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Texto Desencriptado</h2>
            <div className="bg-gray-800 border border-green-700 rounded-lg p-4">
              <p>{decryptedText}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <div className="mt-12 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Información Técnica</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Algoritmo: <span className="text-amber-400">AES-256-GCM</span></li>
            <li>Longitud de clave: <span className="text-amber-400">256 bits</span></li>
            <li>Vector de inicialización (IV): <span className="text-amber-400">Aleatorio de 12 bytes</span></li>
            <li>Codificación: <span className="text-amber-400">Base64</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}