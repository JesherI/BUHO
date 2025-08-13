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
    
    const docRef = await addDoc(messagesRef, {
      text,
      sender,
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