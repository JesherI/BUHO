import { Message, UserContext } from './types';
import { buildContextInfo, buildSystemPrompt, enhanceMessageForComplexReasoning } from './contextUtils';

// Función para enviar mensaje a Z.ai
export async function sendToZai(
    message: string,
    conversationHistory: Message[] = [],
    userContext?: UserContext
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_ZAI_API_KEY;
    const endpoint = "https://api.z.ai/api/paas/v4/chat/completions";

    const messages = [];
    const contextInfo = buildContextInfo(userContext);
    const systemPrompt = buildSystemPrompt(contextInfo);

    // Mensaje del sistema
    messages.push({
        role: "system",
        content: systemPrompt
    });

    // Historial de conversación reciente (reducido para mayor velocidad)
    const recentHistory = conversationHistory.slice(-4);

    for (const msg of recentHistory) {
        messages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        });
    }

    // Mensaje actual del usuario con mejora para razonamiento complejo
    const enhancedMessage = enhanceMessageForComplexReasoning(message);

    messages.push({
        role: "user",
        content: enhancedMessage
    });

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Accept-Language": "es-ES,es",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "glm-4.5-flash",
                messages: messages,
                temperature: 0.7,
                max_tokens: 4096,
                stream: false,
                thinking: {
                    type: 'disabled'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error en Z.ai API: ${response.status}`);
        }

        const data = await response.json();

        if (!data?.choices || data.choices.length === 0) {
            throw new Error("Z.ai no devolvió respuestas válidas");
        }

        return data.choices[0]?.message?.content || "Sin texto de respuesta.";
        // oxlint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }
}