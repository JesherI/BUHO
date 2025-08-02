interface Message {
    text: string;
    sender: string;
}

export async function sendToGemini(message: string, conversationHistory: Message[] = []): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    // Construir el contexto de la conversación
    const contents = [];
    
    // Agregar los últimos 10 mensajes como contexto (para no sobrecargar la API)
    const recentHistory = conversationHistory.slice(-10);
    
    for (const msg of recentHistory) {
        contents.push({
            parts: [{ text: msg.text }],
            role: msg.sender === 'user' ? 'user' : 'model'
        });
    }
    
    // Agregar el mensaje actual del usuario
    contents.push({
        parts: [{ text: message }],
        role: 'user'
    });

    const body = {
        contents: contents,
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
