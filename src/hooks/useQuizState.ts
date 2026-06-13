import { useMemo, useState } from 'react';
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

export const useQuizState = (questions: QuizQuestion[]) => {
    const [index, setIndex] = useState(0);
    const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>([]);

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
    };

    const isComplete = questions.length > 0 && completedQuestionIds.length === questions.length;

    return {
        currentQuestion,
        index,
        total: questions.length,
        selectedOptionIds,
        submitted,
        isCorrect,
        isComplete,
        hasNext: index < questions.length - 1,
        hasPrevious: index > 0,
        selectOption,
        submit,
        next,
        previous,
        restart
    };
};
