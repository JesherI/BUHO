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
    previousConversations?: Array<{
        timestamp: string;
        summary: string;
        topic?: string;
    }>;
}

const AI_PROVIDERS = {
    GEMINI: 'gemini',
    ZAI: 'zai'
} as const;

type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

function analyzeDifficulty(message: string): 'easy' | 'medium' | 'hard' {
    const text = message.toLowerCase();

    // Palabras clave para preguntas difíciles
    const hardKeywords = [
        'analiza', 'analizar', 'análisis', 'compara', 'comparar', 'comparación',
        'evalúa', 'evaluar', 'evaluación', 'critica', 'criticar', 'crítica',
        'demuestra', 'demostrar', 'demostración', 'justifica', 'justificar',
        'argumenta', 'argumentar', 'argumento', 'razona', 'razonar', 'razonamiento',
        'sintetiza', 'sintetizar', 'síntesis', 'integra', 'integrar', 'integración',
        'diseña', 'diseñar', 'diseño', 'crea', 'crear', 'creación', 'desarrolla',
        'estrategia', 'metodología', 'algoritmo', 'optimiza', 'optimizar',
        'resuelve problema complejo', 'problema avanzado', 'teorema', 'demostración',
        'investigación', 'hipótesis', 'tesis', 'ensayo académico', 'paper',
        'diferencias entre', 'ventajas y desventajas', 'pros y contras',
        'implicaciones', 'consecuencias', 'causas y efectos', 'factores',
        'perspectiva crítica', 'punto de vista', 'enfoque multidisciplinario'
    ];

    // Palabras clave para preguntas medianas
    const mediumKeywords = [
        'explica', 'explicar', 'explicación', 'describe', 'describir',
        'cómo funciona', 'por qué', 'para qué', 'cuál es la diferencia',
        'qué significa', 'define', 'definir', 'definición',
        'procedimiento', 'proceso', 'pasos', 'método',
        'ejemplo', 'ejemplos', 'ilustra', 'ilustrar',
        'resumen', 'resumir', 'resumen de', 'principales características',
        'tipos de', 'clasificación', 'categorías'
    ];

    // Palabras clave para preguntas fáciles
    const easyKeywords = [
        'qué es', 'quién es', 'cuándo', 'dónde', 'cuánto',
        'lista', 'enumera', 'menciona', 'nombra',
        'verdadero o falso', 'sí o no', 'correcto o incorrecto',
        'fecha', 'año', 'lugar', 'nombre', 'título',
        'fórmula', 'ecuación simple', 'conversión',
        'traducir', 'traducción', 'significado de palabra'
    ];

    // Contar coincidencias
    const hardCount = hardKeywords.filter(keyword => text.includes(keyword)).length;
    const mediumCount = mediumKeywords.filter(keyword => text.includes(keyword)).length;
    const easyCount = easyKeywords.filter(keyword => text.includes(keyword)).length;

    // Factores adicionales de complejidad
    const hasMultipleQuestions = (text.match(/\?/g) || []).length > 1;
    const hasLongText = message.length > 200;
    const hasTechnicalTerms = /\b(algoritmo|teorema|hipótesis|metodología|paradigma|epistemología)\b/i.test(text);
    const hasAcademicLevel = /\b(universidad|doctorado|maestría|investigación|tesis|paper)\b/i.test(text);

    // Lógica de decisión
    if (hardCount > 0 || hasTechnicalTerms || hasAcademicLevel) {
        return 'hard';
    } else if (mediumCount > 0 || hasMultipleQuestions || hasLongText) {
        return 'medium';
    } else if (easyCount > 0) {
        return 'easy';
    }

    // Por defecto, considerar mediano
    return 'medium';
}

function getAIProvider(message?: string): AIProvider {
    const zaiApiKey = process.env.NEXT_PUBLIC_ZAI_API_KEY;
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;



    // Si no hay mensaje, usar lógica original
    if (!message) {
        if (zaiApiKey && zaiApiKey.trim() !== '') {
            return AI_PROVIDERS.ZAI;
        } else if (geminiApiKey && geminiApiKey.trim() !== '') {
            return AI_PROVIDERS.GEMINI;
        }
        return AI_PROVIDERS.GEMINI;
    }

    // Analizar dificultad del mensaje
    const difficulty = analyzeDifficulty(message);

    // Selección basada en dificultad
    if (difficulty === 'hard') {
        // Preguntas difíciles -> Z.ai (más potente)
        if (zaiApiKey && zaiApiKey.trim() !== '') {
            return AI_PROVIDERS.ZAI;
        } else if (geminiApiKey && geminiApiKey.trim() !== '') {
            return AI_PROVIDERS.GEMINI;
        }
    } else {
        // Preguntas fáciles y medianas -> Gemini (más rápido y eficiente)
        if (geminiApiKey && geminiApiKey.trim() !== '') {
            return AI_PROVIDERS.GEMINI;
        } else if (zaiApiKey && zaiApiKey.trim() !== '') {
            return AI_PROVIDERS.ZAI;
        }
    }


    return AI_PROVIDERS.GEMINI;
}

// Función para generar título con Z.ai
async function generateChatTitleWithZai(
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
async function generateChatTitleWithGemini(
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

// Función para enviar mensaje a Z.ai
async function sendToZai(
    message: string,
    conversationHistory: Message[] = [],
    userContext?: UserContext
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_ZAI_API_KEY;
    const endpoint = "https://api.z.ai/api/paas/v4/chat/completions";

    const messages = [];

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

    if (userContext?.previousConversations && userContext.previousConversations.length > 0) {
        contextInfo += `\n💬 **Conversaciones previas del estudiante:**\n`;
        userContext.previousConversations.slice(-3).forEach((conv, index) => {
            const topic = conv.topic ? ` (${conv.topic})` : '';
            contextInfo += `${index + 1}. ${conv.timestamp}${topic}: ${conv.summary}\n`;
        });
        contextInfo += `\n🧠 **Recuerda:**\n`;
        contextInfo += `- Hacer referencia a conversaciones anteriores cuando sea relevante\n`;
        contextInfo += `- Dar continuidad a temas previos\n`;
        contextInfo += `- Mostrar que recuerdas el progreso del estudiante\n`;
    }

    const systemPrompt = `Eres Buho IA 🦉, asistente inteligente y divertido para estudiantes.

🎯 **Personalidad**: Amigable, juvenil, motivador
😊 **Estilo**: Usa emojis, expresiones como "¡Genial!", "¡Súper!", jerga juvenil apropiada
💡 **Objetivo**: Explica de forma simple, celebra logros, sé empático

¡Haz que aprender sea divertido! 🌟${contextInfo}`;

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

    // Mensaje actual del usuario
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
        enhancedMessage = `${message}\n\n[Explica paso a paso 🤔✨]`;
    }

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

// Función para enviar mensaje a Gemini (función original)
async function sendToGeminiOriginal(
    message: string,
    conversationHistory: Message[] = [],
    userContext?: UserContext
): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const contents = [];

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

    if (userContext?.previousConversations && userContext.previousConversations.length > 0) {
        contextInfo += `\n💬 **Conversaciones previas del estudiante:**\n`;
        userContext.previousConversations.slice(-3).forEach((conv, index) => {
            const topic = conv.topic ? ` (${conv.topic})` : '';
            contextInfo += `${index + 1}. ${conv.timestamp}${topic}: ${conv.summary}\n`;
        });
        contextInfo += `\n🧠 **Recuerda:**\n`;
        contextInfo += `- Hacer referencia a conversaciones anteriores cuando sea relevante\n`;
        contextInfo += `- Dar continuidad a temas previos\n`;
        contextInfo += `- Mostrar que recuerdas el progreso del estudiante\n`;
    }

    const systemPrompt = `Eres Buho IA 🦉, asistente inteligente y divertido para estudiantes.

🎯 **Personalidad**: Amigable, juvenil, motivador
😊 **Estilo**: Usa emojis, expresiones como "¡Genial!", "¡Súper!", jerga juvenil apropiada
💡 **Objetivo**: Explica de forma simple, celebra logros, sé empático

¡Haz que aprender sea divertido! 🌟${contextInfo}`;

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
        enhancedMessage = `${message}\n\n[Explica paso a paso 🤔✨]`;
    }

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
            throw new Error('Error en ambos proveedores de IA');
        }
    }
}
