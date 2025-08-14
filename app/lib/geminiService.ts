import { Message, UserContext } from './types';
import { buildContextInfo, buildSystemPrompt, enhanceMessageForComplexReasoning } from './contextUtils';

// Función para enviar mensaje a Gemini
export async function sendToGeminiOriginal(
    message: string,
    conversationHistory: Message[] = [],
    userContext?: UserContext
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const contents = [];
    const contextInfo = buildContextInfo(userContext);
    const systemPrompt = buildSystemPrompt(contextInfo);

    contents.push({
        parts: [{ text: systemPrompt }],
        role: 'user'
    });
    contents.push({
        parts: [{ text: "¡Hola! 😄 Soy Buho IA 🦉 ¡Pregúntame lo que quieras! 🚀✨" }],
        role: 'model'
    });

    const recentHistory = conversationHistory.slice(-4);

    for (const msg of recentHistory) {
        contents.push({
            parts: [{ text: msg.text }],
            role: msg.sender === 'user' ? 'user' : 'model'
        });
    }

    // Mensaje actual del usuario con mejora para razonamiento complejo
    const enhancedMessage = enhanceMessageForComplexReasoning(message);

    contents.push({
        parts: [{ text: enhancedMessage }],
        role: 'user'
    });

    const body = {
        contents: contents,
        generationConfig: {
            temperature: 0.7,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 4096,
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

        if (!data?.candidates || data.candidates.length === 0) {
            return "Gemini no devolvió candidatos de respuesta. Verifica tu clave o acceso.";
        }

        return data.candidates[0]?.content?.parts?.[0]?.text || "Sin texto de respuesta.";
        // oxlint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }
}