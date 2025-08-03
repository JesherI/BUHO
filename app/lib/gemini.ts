interface Message {
    text: string;
    sender: string;
}

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
}

export async function sendToGemini(
    message: string, 
    conversationHistory: Message[] = [], 
    userContext?: UserContext
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const contents = [];
    
    // Construir contexto del usuario
    let contextInfo = '';
    
    if (userContext?.profile?.username) {
        contextInfo += `\n\n📚 **Contexto del estudiante:**\n`;
        contextInfo += `- Nombre: ${userContext.profile.username}\n`;
        
        if (userContext.profile.academicContext) {
            contextInfo += `- Contexto académico: ${userContext.profile.academicContext}\n`;
        }
    }
    
    if (userContext?.tasks && userContext.tasks.length > 0) {
        contextInfo += `\n📝 **Tareas actuales del estudiante:**\n`;
        
        const pendingTasks = userContext.tasks.filter(task => !task.completed);
        const completedTasks = userContext.tasks.filter(task => task.completed);
        
        if (pendingTasks.length > 0) {
            contextInfo += `\n🔄 **Tareas pendientes (${pendingTasks.length}):**\n`;
            pendingTasks.slice(0, 5).forEach((task, index) => {
                const priority = task.priority ? ` [${task.priority}]` : '';
                const dueDate = task.dueDate ? ` (Vence: ${task.dueDate})` : '';
                const category = task.category ? ` - ${task.category}` : '';
                contextInfo += `${index + 1}. ${task.text}${priority}${dueDate}${category}\n`;
            });
        }
        
        if (completedTasks.length > 0) {
            contextInfo += `\n✅ **Tareas completadas recientemente (${completedTasks.length}):**\n`;
            completedTasks.slice(-3).forEach((task, index) => {
                contextInfo += `${index + 1}. ${task.text}\n`;
            });
        }
        
        contextInfo += `\n💡 **Usa esta información para:**\n`;
        contextInfo += `- Entender mejor las preguntas del estudiante\n`;
        contextInfo += `- Ofrecer ayuda específica con sus tareas\n`;
        contextInfo += `- Sugerir organización y priorización\n`;
        contextInfo += `- Motivar según su progreso\n`;
    }
    
    const systemPrompt = `Eres Buho IA 🦉, un asistente súper inteligente y divertido que ayuda a estudiantes. Tu personalidad es:

✨ **Amigable y juvenil**: Habla como un amigo que sabe mucho
🎯 **Inteligente pero accesible**: Explica cosas complejas de forma simple
😊 **Divertido**: Usa emojis, caritas y expresiones que hagan sonreír
🤝 **Comprensivo**: Entiende que los estudiantes a veces se frustran
🚀 **Motivador**: Siempre anima y da ánimos

Cuando respondas:
- 🤔 Usa MUCHOS emojis relevantes (😄 😅 🎉 💡 ⭐ 🔥 👍 💪 🎯 etc.)
- 😊 Incluye expresiones como "¡Genial!", "¡Súper!", "¡Qué cool!"
- 💭 Para pensar usa: "Mmm, déjame pensar..." "Analizando esto..." "Veamos..."
- 🎉 Celebra los logros: "¡Excelente pregunta!" "¡Vas súper bien!"
- 😅 Sé empático: "Sé que puede ser confuso..." "No te preocupes..."
- 🔥 Usa jerga juvenil apropiada: "está genial", "súper cool", "increíble"

¡Haz que aprender sea divertido y emocionante! 🌟${contextInfo}`;
    
    contents.push({
        parts: [{ text: systemPrompt }],
        role: 'user'
    });
    contents.push({
        parts: [{ text: "¡Hola! 😄 Soy Buho IA 🦉 y estoy súper emocionado de ayudarte! 🎉 Vamos a hacer que aprender sea divertido y genial. ¡Pregúntame lo que quieras! 🚀✨" }],
        role: 'model'
    });
    
    const recentHistory = conversationHistory.slice(-8);
    
    for (const msg of recentHistory) {
        contents.push({
            parts: [{ text: msg.text }],
            role: msg.sender === 'user' ? 'user' : 'model'
        });
    }
    
    const complexReasoningKeywords = [
        'por qué', 'cómo', 'explica', 'analiza', 'compara', 'evalúa', 'resuelve',
        'problema', 'estrategia', 'plan', 'diferencia', 'ventajas', 'desventajas',
        'causa', 'efecto', 'consecuencia', 'implicación', 'alternativa'
    ];
    
    const needsComplexReasoning = complexReasoningKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
    );
    
    let enhancedMessage = message;
    if (needsComplexReasoning) {
        enhancedMessage = `${message}\n\n[¡Genial! Esta pregunta está súper interesante 🤔✨ Muestra tu proceso de pensamiento de forma divertida y usa muchos emojis 😊🎉]`;
    }
    
    contents.push({
        parts: [{ text: enhancedMessage }],
        role: 'user'
    });

    const body = {
        contents: contents,
        generationConfig: {
            temperature: 0.7, 
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048, 
            candidateCount: 1
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                "X-goog-api-key": apiKey || "",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        console.log("Respuesta completa de Gemini:", data);

        if (!data?.candidates || data.candidates.length === 0) {
            return "Gemini no devolvió candidatos de respuesta. Verifica tu clave o acceso.";
        }

        return data.candidates[0]?.content?.parts?.[0]?.text || "Sin texto de respuesta.";
    } catch (error) {
        console.error("Error al comunicarse con Gemini:", error);
        return "Error en la conexión con Gemini.";
    }
}
