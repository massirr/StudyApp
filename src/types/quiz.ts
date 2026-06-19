export type QuizQuestionType = 'single' | 'multiple';

export interface QuizOption {
    id: string;
    label: string;
}

export interface QuizQuestion {
    id: string;
    topicId: string;
    prompt: string;
    type: QuizQuestionType;
    options: QuizOption[];
    correctOptionIds: string[];
    explanation: string;
    sourceUrls: string[];
    codeSnippet?: { language: string; code: string };
}

export interface QuizResult {
    submitted: boolean;
    isCorrect: boolean;
}
