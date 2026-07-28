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

    const isCorrect = useMemo(() => {
        if (!currentQuestion || !submitted) {
            return false;
        }

        return isSelectionCorrect(selectedOptionIds, currentQuestion.correctOptionIds);
    }, [currentQuestion, selectedOptionIds, submitted]);

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

    const submit = () => {
        if (!currentQuestion || selectedOptionIds.length === 0) {
            return;
        }

        setSubmitted(true);
        setCompletedQuestionIds((prev) =>
            prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]
        );
        if (isSelectionCorrect(selectedOptionIds, currentQuestion.correctOptionIds)) {
            setCorrectQuestionIds((prev) =>
                prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]
            );
        }
    };

    const next = () => {
        if (!submitted || index >= questions.length - 1) {
            return;
        }

        setIndex((value) => value + 1);
        setSelectedOptionIds([]);
        setSubmitted(false);
    };

    const previous = () => {
        if (index === 0) {
            return;
        }

        setIndex((value) => value - 1);
        setSelectedOptionIds([]);
        setSubmitted(false);
    };

    const restart = () => {
        setIndex(0);
        setSelectedOptionIds([]);
        setSubmitted(false);
        setCompletedQuestionIds([]);
        setCorrectQuestionIds([]);
        if (persistKey) localStorage.removeItem(persistKey);
    };

    return {
        currentQuestion,
        index,
        total: questions.length,
        selectedOptionIds,
        submitted,
        isCorrect,
        isComplete: finished,
        correctCount: correctQuestionIds.length,
        hasNext: index < questions.length - 1,
        hasPrevious: index > 0,
        selectOption,
        submit,
        next,
        previous,
        restart
    };
};
