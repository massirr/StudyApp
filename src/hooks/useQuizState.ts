import { useEffect, useMemo, useState } from 'react';
import { QuizQuestion } from '../types/quiz';

const isSelectionCorrect = (
    selectedOptionIds: string[],
    correctOptionIds: string[]
): boolean => {
    if (selectedOptionIds.length !== correctOptionIds.length) {
        return false;
    }

    const selected = [...selectedOptionIds].sort();
    const correct = [...correctOptionIds].sort();
    return selected.every((id, index) => id === correct[index]);
};

// Pure + exported for the same reason as parsePersistedQuizState below: the
// vitest env is `node`, so the rules get tested here rather than through a DOM.

/** Question types where the learner types instead of picking options. */
export const isTypedQuestion = (question: QuizQuestion): boolean =>
    question.type === 'freeText' || question.type === 'shortText';

/**
 * Normalises a short answer before comparison. Only differences that cannot be
 * a Dutch mistake are erased: case, surrounding and repeated whitespace,
 * curly-vs-straight apostrophes (phone keyboards produce ’ in "'s morgens"),
 * and trailing sentence punctuation. Spelling and accents are left alone —
 * `werkde` must stay wrong (see design.md).
 */
export const normalizeAnswer = (value: string): string =>
    value
        .replace(/[‘’ʼ]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/\s+/gu, ' ')
        .trim()
        .toLowerCase()
        .replace(/[.,!?;:]+$/, '')
        .trim();

/** Whether the current answer is complete enough to submit. */
export const isAnswerSubmittable = (
    question: QuizQuestion,
    selectedOptionIds: string[],
    answerText: string
): boolean =>
    isTypedQuestion(question)
        ? answerText.trim().length > 0
        : selectedOptionIds.length > 0;

/**
 * Correctness of a question. `null` means "not decided yet" — a free-text answer
 * is revealed on submit but stays ungraded until the learner taps ✓/✗.
 * Free-text text is never string-matched against sampleAnswer (see design.md);
 * shortText is the opposite — the app grades it and never asks the learner.
 */
export const gradeQuestion = (
    question: QuizQuestion,
    selectedOptionIds: string[],
    selfGrade: boolean | null,
    answerText = ''
): boolean | null => {
    if (question.type === 'freeText') {
        return selfGrade;
    }

    if (question.type === 'shortText') {
        const typed = normalizeAnswer(answerText);
        return (question.acceptedAnswers ?? []).some(
            (accepted) => normalizeAnswer(accepted) === typed
        );
    }

    return isSelectionCorrect(selectedOptionIds, question.correctOptionIds);
};

export const scorePercent = (correctCount: number, total: number): number =>
    total > 0 ? Math.round((correctCount / total) * 100) : 0;

export interface PersistedQuizState {
    index: number;
    completedQuestionIds: string[];
    correctQuestionIds: string[];
}

// ponytail: stores position + answered/correct question ids so a resumed quiz
// survives a tab close. Question ids (not indices) keep it valid if the data
// is later reordered; the resume `index` is best-effort if questions change.
// Pure + exported so the parse/validation is unit-testable without a DOM.
export const parsePersistedQuizState = (raw: string | null): PersistedQuizState | null => {
    if (!raw) return null;
    try {
        const p = JSON.parse(raw) as Partial<PersistedQuizState>;
        if (
            typeof p.index === 'number' &&
            Array.isArray(p.completedQuestionIds) &&
            Array.isArray(p.correctQuestionIds)
        ) {
            return {
                index: p.index,
                completedQuestionIds: p.completedQuestionIds,
                correctQuestionIds: p.correctQuestionIds
            };
        }
    } catch {
        /* corrupt entry — start fresh */
    }
    return null;
};

const loadPersistedQuizState = (key?: string): PersistedQuizState | null =>
    key ? parsePersistedQuizState(localStorage.getItem(key)) : null;

export const useQuizState = (questions: QuizQuestion[], persistKey?: string) => {
    const [restored] = useState(() => loadPersistedQuizState(persistKey));
    const [index, setIndex] = useState(restored?.index ?? 0);
    const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
    const [answerText, setAnswerText] = useState('');
    const [selfGrade, setSelfGrade] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(
        restored?.completedQuestionIds ?? []
    );
    const [correctQuestionIds, setCorrectQuestionIds] = useState<string[]>(
        restored?.correctQuestionIds ?? []
    );

    const finished = questions.length > 0 && completedQuestionIds.length === questions.length;

    useEffect(() => {
        if (!persistKey) return;
        // Resume only applies to in-progress quizzes; drop the entry once finished.
        if (finished) {
            localStorage.removeItem(persistKey);
            return;
        }
        localStorage.setItem(
            persistKey,
            JSON.stringify({ index, completedQuestionIds, correctQuestionIds })
        );
    }, [persistKey, index, completedQuestionIds, correctQuestionIds, finished]);

    const currentQuestion = questions[index];

    const isFreeText = currentQuestion?.type === 'freeText';
    // A revealed free-text answer the learner has not yet marked ✓/✗. Deliberately
    // keyed to freeText, not "is typed": a shortText answer is already graded, so
    // waiting on a self-grade here would block Finish Quiz forever.
    const awaitingSelfGrade = !!isFreeText && submitted && selfGrade === null;

    const isCorrect = useMemo(() => {
        if (!currentQuestion || !submitted) {
            return false;
        }

        return gradeQuestion(currentQuestion, selectedOptionIds, selfGrade, answerText) === true;
    }, [currentQuestion, selectedOptionIds, selfGrade, submitted, answerText]);

    const record = (questionId: string, correct: boolean) => {
        setCompletedQuestionIds((prev) =>
            prev.includes(questionId) ? prev : [...prev, questionId]
        );
        if (correct) {
            setCorrectQuestionIds((prev) =>
                prev.includes(questionId) ? prev : [...prev, questionId]
            );
        }
    };

    const selectOption = (optionId: string) => {
        if (!currentQuestion || submitted) {
            return;
        }

        if (currentQuestion.type === 'single') {
            setSelectedOptionIds([optionId]);
            return;
        }

        setSelectedOptionIds((prev) =>
            prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
        );
    };

    const setAnswer = (text: string) => {
        if (submitted) return;
        setAnswerText(text);
    };

    const submit = () => {
        if (!currentQuestion || !isAnswerSubmittable(currentQuestion, selectedOptionIds, answerText)) {
            return;
        }

        setSubmitted(true);

        // Free-text only reveals here; it is scored (and counted complete) by
        // gradeSelf once the learner marks ✓/✗. shortText returns a real boolean,
        // so it is recorded immediately like an MCQ.
        const graded = gradeQuestion(currentQuestion, selectedOptionIds, selfGrade, answerText);
        if (graded === null) return;
        record(currentQuestion.id, graded);
    };

    const gradeSelf = (correct: boolean) => {
        if (!currentQuestion || !awaitingSelfGrade) {
            return;
        }

        setSelfGrade(correct);
        record(currentQuestion.id, correct);
    };

    // Shared reset for any move off the current question.
    const goTo = (nextIndex: number) => {
        setIndex(nextIndex);
        setSelectedOptionIds([]);
        setAnswerText('');
        setSelfGrade(null);
        setSubmitted(false);
    };

    const next = () => {
        if (!submitted || awaitingSelfGrade || index >= questions.length - 1) {
            return;
        }

        goTo(index + 1);
    };

    const previous = () => {
        if (index === 0) {
            return;
        }

        goTo(index - 1);
    };

    const restart = () => {
        goTo(0);
        setCompletedQuestionIds([]);
        setCorrectQuestionIds([]);
        if (persistKey) localStorage.removeItem(persistKey);
    };

    return {
        currentQuestion,
        index,
        total: questions.length,
        selectedOptionIds,
        answerText,
        submitted,
        isCorrect,
        isFreeText: !!isFreeText,
        isShortText: currentQuestion?.type === 'shortText',
        awaitingSelfGrade,
        selfGrade,
        canSubmit: !!currentQuestion && isAnswerSubmittable(currentQuestion, selectedOptionIds, answerText),
        isComplete: finished,
        correctCount: correctQuestionIds.length,
        hasNext: index < questions.length - 1,
        hasPrevious: index > 0,
        selectOption,
        setAnswer,
        gradeSelf,
        submit,
        next,
        previous,
        restart
    };
};
