export type QuizQuestionType = 'single' | 'multiple' | 'freeText';

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
    level?: number; // reserved for future tiered quizzes; unused in this release
    // freeText only: the model answer revealed on submit. The learner self-grades
    // against it — the app never string-matches it (see design.md).
    sampleAnswer?: string;
}

export interface QuizResult {
    submitted: boolean;
    isCorrect: boolean;
}
