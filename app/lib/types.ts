export interface Message {
    text: string;
    sender: string;
}

export interface UserContext {
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

export const AI_PROVIDERS = {
    GEMINI: 'gemini',
    ZAI: 'zai'
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

export type DifficultyLevel = 'easy' | 'medium' | 'hard';