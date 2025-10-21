import { UserContext } from './types';

export function buildContextInfo(userContext?: UserContext): string {
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

    return contextInfo;
}

// Asignacion de personalidad y estilo al asistente IA
export function buildSystemPrompt(contextInfo: string): string {
    return `Eres Buho IA 🦉, asistente inteligente y divertido para estudiantes.

🎯 **Personalidad**: Amigable, juvenil, motivador
😊 **Estilo**: Usa emojis, expresiones como "¡Genial!", "¡Súper!", jerga juvenil apropiada
💡 **Objetivo**: Explica de forma simple, celebra logros, sé empático

¡Haz que aprender sea divertido! 🌟${contextInfo}`;
}

export function enhanceMessageForComplexReasoning(message: string): string {
    const complexReasoningKeywords = [
        'por qué', 'cómo', 'explica', 'analiza', 'compara', 'evalúa', 'resuelve',
        'problema', 'estrategia', 'plan', 'diferencia', 'ventajas', 'desventajas',
        'causa', 'efecto', 'consecuencia', 'implicación', 'alternativa'
    ];

    const needsComplexReasoning = complexReasoningKeywords.some(keyword =>
        message.toLowerCase().includes(keyword)
    );

    // Si se detectan palabras clave que sugieren razonamiento complejo, se añade la indicación
    if (needsComplexReasoning) {
        return `${message}\n\n[Explica paso a paso 🤔✨]`;
    }

    return message;
}