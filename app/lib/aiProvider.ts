import { AIProvider, AI_PROVIDERS, DifficultyLevel } from './types';

export function analyzeDifficulty(message: string): DifficultyLevel {
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
        'perspectiva crítica', 'punto de vista', 'enfoque multidisciplinario', 'análisis crítico',
        'análisis de datos', 'estadística', 'modelo', 'simulación', 'proyecto', 'proyecto de investigación',
        'investigación científica', 'investigación experimental', 'investigación teórica', 'investigación aplicada',
        'investigación social', 'investigación política', 'investigación económica', 'investigación ambiental'
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

export function getAIProvider(message?: string): AIProvider {
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