import { AI_PROVIDERS } from './types';
import { getAIProvider } from './aiProvider';

// Función para generar título con Z.ai
export async function generateChatTitleWithZai(
    firstMessage: string,
    conversationContext?: string
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_ZAI_API_KEY;
    const endpoint = "https://api.z.ai/api/paas/v4/chat/completions";

    const prompt = `Genera un título corto y descriptivo (máximo 4 palabras) para un chat basado en este mensaje: "${firstMessage}"

${conversationContext ? `Contexto adicional: ${conversationContext}` : ''}

El título debe ser:
- Conciso y claro
- En español
- Sin comillas
- Descriptivo del tema principal
- Máximo 4 palabras

Ejemplos:
- "Ayuda con Matemáticas"
- "Consulta de Historia"
- "Proyecto de Ciencias"
- "Dudas de Programación"

Título:`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept-Language': 'es-ES,es',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "glm-4.5-flash",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 20,
                thinking: {
                    type: 'disabled'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error en Z.ai API: ${response.status}`);
        }

        const data = await response.json();

        // Intentar diferentes estructuras de respuesta según la documentación de Z.ai
        const generatedTitle = data.choices?.[0]?.message?.content?.trim() ||
            data.choices?.[0]?.message?.reasoning_content?.trim() ||
            data.choices?.[0]?.text?.trim() ||
            data.choices?.[0]?.content?.trim();

        if (generatedTitle) {
            const cleanTitle = generatedTitle.replace(/["']/g, '').substring(0, 50);
            return cleanTitle;
        } else {
            throw new Error('No se generó título');
        }
        // oxlint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }
}

// Función para generar título con Gemini
export async function generateChatTitleWithGemini(
    firstMessage: string,
    conversationContext?: string
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const prompt = `Genera un título corto y descriptivo (máximo 4 palabras) para un chat basado en este mensaje: "${firstMessage}"

${conversationContext ? `Contexto adicional: ${conversationContext}` : ''}

El título debe ser:
- Conciso y claro
- En español
- Sin comillas
- Descriptivo del tema principal
- Máximo 4 palabras

Ejemplos:
- "Ayuda con Matemáticas"
- "Consulta de Historia"
- "Proyecto de Ciencias"
- "Dudas de Programación"

Título:`;

    try {
        const response = await fetch(`${endpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    topK: 20,
                    topP: 0.8,
                    maxOutputTokens: 20,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error en Gemini API: ${response.status}`);
        }

        const data = await response.json();
        const generatedTitle = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (generatedTitle) {
            return generatedTitle.replace(/["']/g, '').substring(0, 50);
        } else {
            throw new Error('No se generó título');
        }
        // oxlint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    }
}

export async function generateChatTitle(
    firstMessage: string,
    conversationContext?: string
): Promise<string> {
    const provider = getAIProvider(firstMessage);

    try {
        if (provider === AI_PROVIDERS.ZAI) {
            const title = await generateChatTitleWithZai(firstMessage, conversationContext);
            return title;
        } else {
            const title = await generateChatTitleWithGemini(firstMessage, conversationContext);
            return title;
        }
    } catch {
        // Fallback: intentar con el otro proveedor
        try {
            if (provider === AI_PROVIDERS.ZAI) {
                const title = await generateChatTitleWithGemini(firstMessage, conversationContext);
                return title;
            } else {
                const title = await generateChatTitleWithZai(firstMessage, conversationContext);
                return title;
            }
        } catch {
            // Último recurso: título basado en el mensaje
            const fallbackTitle = firstMessage.length > 30 ? firstMessage.substring(0, 27) + "..." : firstMessage;
            return fallbackTitle;
        }
    }
}