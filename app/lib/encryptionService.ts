/**
 * Servicio de encriptación para mensajes
 * Utiliza AES-256 para cifrar y descifrar mensajes
 */

// Verificamos que estamos en el cliente antes de usar Web Crypto API
const isBrowser = typeof window !== 'undefined';

// Utilizamos la API Web Crypto para operaciones criptográficas
const encoder = isBrowser ? new TextEncoder() : null;
const decoder = isBrowser ? new TextDecoder() : null;

// Función de utilidad para verificar el entorno
function checkBrowserEnvironment() {
  if (!isBrowser) {
    throw new Error("Esta función solo puede ejecutarse en el navegador");
  }
}

/**
 * Genera una clave AES-256 a partir de una contraseña
 * @param password Contraseña para generar la clave
 * @returns Clave AES-256 derivada
 */
export async function generateKey(password: string): Promise<CryptoKey> {
  checkBrowserEnvironment();
  
  // Convertir la contraseña a un array de bytes
  const passwordData = encoder!.encode(password);
  
  // Crear un material de clave a partir de la contraseña
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Generar una sal aleatoria (en una aplicación real, deberías almacenar esta sal)
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  
  // Derivar una clave AES-256 a partir del material de clave
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  return key;
}

/**
 * Genera una clave AES-256 aleatoria
 * @returns Clave AES-256 y su exportación en base64
 */
export async function generateRandomKey(): Promise<{key: CryptoKey, exportedKey: string}> {
  checkBrowserEnvironment();
  
  // Generar una clave AES-256 aleatoria
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Exportar la clave para poder almacenarla
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  const exportedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
  
  return { key, exportedKey: exportedKeyBase64 };
}

/**
 * Importa una clave AES-256 desde su representación en base64
 * @param keyBase64 Clave en formato base64
 * @returns Clave AES-256 importada
 */
export async function importKey(keyBase64: string): Promise<CryptoKey> {
  checkBrowserEnvironment();
  
  const keyData = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
  
  return key;
}

/**
 * Cifra un texto utilizando AES-256-GCM
 * @param text Texto a cifrar
 * @param key Clave AES-256
 * @returns Objeto con el texto cifrado en base64 y el IV utilizado
 */
export async function encryptText(text: string, key: CryptoKey): Promise<{ciphertext: string, iv: string}> {
  checkBrowserEnvironment();
  
  // Generar un IV aleatorio
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Cifrar el texto
  const data = encoder!.encode(text);
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    data
  );
  
  // Convertir a base64 para almacenamiento
  const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  const ivBase64 = btoa(String.fromCharCode(...iv));
  
  return { ciphertext: ciphertextBase64, iv: ivBase64 };
}

/**
 * Descifra un texto cifrado con AES-256-GCM
 * @param ciphertextBase64 Texto cifrado en base64
 * @param ivBase64 IV en base64
 * @param key Clave AES-256
 * @returns Texto descifrado
 */
export async function decryptText(ciphertextBase64: string, ivBase64: string, key: CryptoKey): Promise<string> {
  checkBrowserEnvironment();
  
  // Convertir de base64
  const ciphertext = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  
  // Descifrar
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    ciphertext
  );
  
  // Convertir el resultado a texto
  return decoder!.decode(decrypted);
}

/**
 * Función simplificada para cifrar texto (para uso directo)
 * @param text Texto a cifrar
 * @param keyBase64 Clave en formato base64 (opcional, se genera si no se proporciona)
 * @returns Objeto con el texto cifrado, IV y clave utilizada
 */
export async function encrypt(text: string, keyBase64?: string): Promise<{ciphertext: string, iv: string, key: string}> {
  checkBrowserEnvironment();
  
  let key: CryptoKey;
  let exportedKey: string;
  
  if (keyBase64) {
    key = await importKey(keyBase64);
    exportedKey = keyBase64;
  } else {
    const keyData = await generateRandomKey();
    key = keyData.key;
    exportedKey = keyData.exportedKey;
  }
  
  const { ciphertext, iv } = await encryptText(text, key);
  
  return { ciphertext, iv, key: exportedKey };
}

/**
 * Función simplificada para descifrar texto (para uso directo)
 * @param ciphertext Texto cifrado en base64
 * @param iv IV en base64
 * @param keyBase64 Clave en formato base64
 * @returns Texto descifrado
 */
export async function decrypt(ciphertext: string, iv: string, keyBase64: string): Promise<string> {
  checkBrowserEnvironment();
  
  const key = await importKey(keyBase64);
  return await decryptText(ciphertext, iv, key);
}