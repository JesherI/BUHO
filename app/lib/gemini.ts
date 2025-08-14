import { Message, UserContext, AI_PROVIDERS } from './types';
import { getAIProvider } from './aiProvider';
import { sendToZai } from './zaiService';
import { sendToGeminiOriginal } from './geminiService';
import { generateChatTitleWithZai, generateChatTitleWithGemini } from './titleGenerator';



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



export async function sendToGemini(
    message: string,
    conversationHistory: Message[] = [],
    userContext?: UserContext
): Promise<string> {
    const provider = getAIProvider(message);

    try {
        if (provider === AI_PROVIDERS.ZAI) {
            const response = await sendToZai(message, conversationHistory, userContext);
            return response;
        } else {
            const response = await sendToGeminiOriginal(message, conversationHistory, userContext);
            return response;
        }
    } catch {
        // Fallback: intentar con el otro proveedor
        try {
            if (provider === AI_PROVIDERS.ZAI) {
                const response = await sendToGeminiOriginal(message, conversationHistory, userContext);
                return response;
            } else {
                const response = await sendToZai(message, conversationHistory, userContext);
                return response;
            }
        } catch {
            // Último recurso: mensaje de error
            return "Lo siento, no pude procesar tu mensaje en este momento. Por favor, intenta de nuevo más tarde.";
        }
    }
}
