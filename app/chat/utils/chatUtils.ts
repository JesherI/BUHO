import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../db/firebase";
import { encrypt, decrypt } from "../../lib/encryptionService";

// Clave de encriptación para mensajes (en una aplicación real, esto debería estar en un lugar seguro)
const MESSAGE_ENCRYPTION_KEY = "BUHO_SECURE_ENCRYPTION_KEY_2024";

export async function getOrCreateChat(title: string, category: string, userId: string, forceNew: boolean = false) {
  try {
    const chatsRef = collection(db, "users", userId, "chats");
    
    if (!forceNew) {
      const q = query(chatsRef, where("title", "==", title), where("category", "==", category));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs[0].id;
      }
    }

    const newChatRef = await addDoc(chatsRef, {
      title,
      category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return newChatRef.id;
  } catch (error) {
    console.error("Error al crear o recuperar chat:", error);
    throw error;
  }
}

export async function saveMessage(userId: string, chatId: string, text: string, sender: "user" | "assistant") {
  try {
    const messagesRef = collection(db, "users", userId, "chats", chatId, "messages");
    
    // Encriptar el texto del mensaje
    const { ciphertext, iv, key } = await encrypt(text, MESSAGE_ENCRYPTION_KEY);
    
    const docRef = await addDoc(messagesRef, {
      encryptedText: ciphertext,
      iv: iv,
      text: text.substring(0, 10) + "...", // Guardamos una versión truncada en texto plano para referencia
      sender,
      encrypted: true,
      timestamp: serverTimestamp(),
    });
    
    const chatRef = doc(db, "users", userId, "chats", chatId);
    await updateDoc(chatRef, {
      updatedAt: serverTimestamp(),
      lastMessage: text.substring(0, 100)
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    throw error;
  }
}

export async function saveConversationSummary(userId: string, chatId: string, firstMessage: string, title: string) {
  try {

    let topic = "General";
    const lowerMessage = firstMessage.toLowerCase();
    if (lowerMessage.includes("matemática") || lowerMessage.includes("cálculo") || lowerMessage.includes("álgebra")) {
      topic = "Matemáticas";
    } else if (lowerMessage.includes("historia") || lowerMessage.includes("histórico")) {
      topic = "Historia";
    } else if (lowerMessage.includes("ciencia") || lowerMessage.includes("física") || lowerMessage.includes("química")) {
      topic = "Ciencias";
    } else if (lowerMessage.includes("idioma") || lowerMessage.includes("inglés") || lowerMessage.includes("gramática")) {
      topic = "Idiomas";
    } else if (lowerMessage.includes("tarea") || lowerMessage.includes("proyecto")) {
      topic = "Tareas";
    } else if (lowerMessage.includes("programación") || lowerMessage.includes("código") || lowerMessage.includes("javascript")) {
      topic = "Programación";
    }
    
    const chatRef = doc(db, "users", userId, "chats", chatId);
    await updateDoc(chatRef, {
      summary: firstMessage.length > 100 ? firstMessage.substring(0, 97) + "..." : firstMessage,
      topic: topic,
      firstMessage: firstMessage,
      title: title,
      summarizedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`Resumen guardado para chat ${chatId}: ${topic}`);
  } catch (error) {
    console.error("Error al guardar resumen de conversación:", error);
    throw error;
  }
}

/**
 * Función para obtener y descifrar mensajes de un chat
 * @param userId ID del usuario
 * @param chatId ID del chat
 * @returns Array de mensajes descifrados
 */
export async function getDecryptedMessages(userId: string, chatId: string) {
  try {
    const messagesRef = collection(db, "users", userId, "chats", chatId, "messages");
    const q = query(messagesRef);
    const messagesSnapshot = await getDocs(q);
    
    const messages = [];
    
    for (const messageDoc of messagesSnapshot.docs) {
      const messageData = messageDoc.data();
      
      // Verificar si el mensaje está encriptado
      if (messageData.encrypted && messageData.encryptedText && messageData.iv) {
        try {
          // Descifrar el mensaje
          const decryptedText = await decrypt(
            messageData.encryptedText,
            messageData.iv,
            MESSAGE_ENCRYPTION_KEY
          );
          
          messages.push({
            text: decryptedText,
            sender: messageData.sender,
            timestamp: messageData.timestamp
          });
        } catch (decryptError) {
          console.error("Error al descifrar mensaje:", decryptError);
          // Si hay error al descifrar, usar el texto truncado
          messages.push({
            text: messageData.text || "[Mensaje encriptado]",
            sender: messageData.sender,
            timestamp: messageData.timestamp
          });
        }
      } else {
        // Mensaje no encriptado (compatibilidad con mensajes antiguos)
        messages.push({
          text: messageData.text,
          sender: messageData.sender,
          timestamp: messageData.timestamp
        });
      }
    }
    
    // Ordenar mensajes por timestamp
    return messages.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(0);
      const timeB = b.timestamp?.toDate?.() || new Date(0);
      return timeA.getTime() - timeB.getTime();
    });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return [];
  }
}

export function formatTimestamp(updatedAt: { toDate?: () => Date } | Date | string | null | undefined): string {
  let timestamp = "Reciente";
  if (updatedAt) {
    const date = updatedAt && typeof updatedAt === 'object' && 'toDate' in updatedAt && typeof updatedAt.toDate === 'function' 
      ? updatedAt.toDate() 
      : new Date(updatedAt as string | number | Date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      timestamp = "Hoy";
    } else if (diffDays === 1) {
      timestamp = "Ayer";
    } else if (diffDays < 7) {
      timestamp = `Hace ${diffDays} días`;
    } else {
      timestamp = date.toLocaleDateString();
    }
  }
  return timestamp;
}