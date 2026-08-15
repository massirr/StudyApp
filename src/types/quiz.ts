export type QuizQuestionType = 'single' | 'multiple' | 'freeText' | 'shortText';

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
    // One illustration shown with the question. `alt` is mandatory when present:
    // these are describe-what-you-see questions, so missing alt text makes them
    // impossible rather than merely worse. Enforced by validateSubject.
    image?: { src: string; alt: string };
    level?: number; // reserved for future tiered quizzes; unused in this release
    // freeText only: the model answer revealed on submit. The learner self-grades
    // against it — the app never string-matches it (see design.md).
    sampleAnswer?: string;
    // shortText only: every answer counted correct, compared after normalisation
    // (case, whitespace, apostrophe style, trailing punctuation). Required and
    // non-empty for shortText; the app grades these itself, with no self-grade.
    acceptedAnswers?: string[];
}

export interface QuizResult {
    submitted: boolean;
    isCorrect: boolean;
}
