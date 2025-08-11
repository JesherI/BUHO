import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../db/firebase";
import { formatTimestamp } from "./chatUtils";

interface UserContext {
  profile?: {
    username?: string;
    academicContext?: string;
  };
  tasks?: Array<{
    text: string;
    completed: boolean;
    priority?: string;
    dueDate?: string;
    category?: string;
  }>;
  previousConversations?: Array<{
    timestamp: string;
    summary: string;
    topic?: string;
  }>;
}

export async function getUserContext(userId: string): Promise<UserContext> {
  try {
    const userContext: UserContext = {};

    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userContext.profile = {
          username: userData.username || userData.displayName,
          academicContext: userData.academicContext
        };
      }
    } catch (error) {
      console.error("Error al obtener perfil del usuario:", error);
    }

    try {
      const tasksRef = collection(db, "users", userId, "tasks");
      const tasksSnapshot = await getDocs(tasksRef);
      
      const tasks = tasksSnapshot.docs.map(doc => {
        const taskData = doc.data();
        return {
          text: taskData.text,
          completed: taskData.completed || false,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
          category: taskData.category
        };
      });
      
      userContext.tasks = tasks;
    } catch (error) {
      console.error("Error al obtener tareas del usuario:", error);
      userContext.tasks = [];
    }

    try {
      const chatsRef = collection(db, "users", userId, "chats");
      const chatsQuery = query(
        chatsRef, 
        orderBy("updatedAt", "desc")
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      
      const previousConversations = [];
      
      for (const chatDoc of chatsSnapshot.docs.slice(0, 5)) {
        const chatData = chatDoc.data();

        if (chatData.summary && chatData.topic) {
          previousConversations.push({
            timestamp: formatTimestamp(chatData.updatedAt),
            summary: chatData.summary,
            topic: chatData.topic
          });
        } else if (chatData.title && chatData.title !== "Nuevo Chat") {
          previousConversations.push({
            timestamp: formatTimestamp(chatData.updatedAt),
            summary: chatData.title,
            topic: "General"
          });
        }
      }
      
      userContext.previousConversations = previousConversations;
    } catch (error) {
      console.error("Error al obtener conversaciones previas:", error);
      userContext.previousConversations = [];
    }
    
    return userContext;
  } catch (error) {
    console.error("Error al obtener contexto del usuario:", error);
    return {};
  }
}