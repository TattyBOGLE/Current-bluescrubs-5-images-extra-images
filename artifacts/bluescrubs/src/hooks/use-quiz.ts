import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { QuizState } from "@/lib/types";
import type { McqQuestion, InsertUserProgress } from "@shared/schema";

export function useQuiz(questions: McqQuestion[], userId: number, timeLimit: number = 120) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: timeLimit,
    isActive: false,
    score: 0,
    totalQuestions: questions.length,
  });

  const queryClient = useQueryClient();

  const submitProgressMutation = useMutation({
    mutationFn: async (progress: InsertUserProgress) => {
      const response = await apiRequest("POST", "/api/progress", progress);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizState.isActive && quizState.timeRemaining > 0) {
      interval = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (quizState.timeRemaining <= 0 && quizState.isActive) {
      // Auto-submit when time runs out
      handleSubmitAnswer();
    }

    return () => clearInterval(interval);
  }, [quizState.isActive, quizState.timeRemaining]);

  const startQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isActive: true,
      timeRemaining: timeLimit,
    }));
  }, [timeLimit]);

  const selectAnswer = useCallback((answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: answerIndex,
      },
    }));
  }, []);

  const handleSubmitAnswer = useCallback(async () => {
    const currentQ = questions[quizState.currentQuestion];
    const selectedAnswer = quizState.answers[quizState.currentQuestion];
    
    if (currentQ && selectedAnswer !== undefined) {
      const isCorrect = selectedAnswer === currentQ.correctAnswer;
      const timeTaken = timeLimit - quizState.timeRemaining;

      // Submit progress to backend
      await submitProgressMutation.mutateAsync({
        userId,
        questionId: currentQ.id,
        isCorrect,
        timeTaken,
      });

      // Update local state
      setQuizState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
      }));
    }
  }, [questions, quizState, userId, timeLimit, submitProgressMutation]);

  const nextQuestion = useCallback(() => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeRemaining: timeLimit,
      }));
    } else {
      // Quiz completed
      setQuizState(prev => ({
        ...prev,
        isActive: false,
      }));
    }
  }, [quizState.currentQuestion, questions.length, timeLimit]);

  const previousQuestion = useCallback(() => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        timeRemaining: timeLimit,
      }));
    }
  }, [quizState.currentQuestion, timeLimit]);

  const resetQuiz = useCallback(() => {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      timeRemaining: timeLimit,
      isActive: false,
      score: 0,
      totalQuestions: questions.length,
    });
  }, [timeLimit, questions.length]);

  const currentQuestion = questions[quizState.currentQuestion];
  const selectedAnswer = quizState.answers[quizState.currentQuestion];
  const isLastQuestion = quizState.currentQuestion === questions.length - 1;
  const hasAnswered = selectedAnswer !== undefined;

  return {
    quizState,
    currentQuestion,
    selectedAnswer,
    isLastQuestion,
    hasAnswered,
    startQuiz,
    selectAnswer,
    handleSubmitAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    isSubmitting: submitProgressMutation.isPending,
  };
}
