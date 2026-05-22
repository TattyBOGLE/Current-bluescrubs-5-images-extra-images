import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Bookmark, Flag, CheckCircle, XCircle } from "lucide-react";
import type { Question, QuizSession } from "@/lib/types";

interface MCQInterfaceProps {
  questions: Question[];
  onAnswerSubmit: (questionId: number, answer: string, timeSpent: number) => void;
  onQuizComplete: (results: { correct: number; total: number; timeSpent: number }) => void;
  timeLimit?: number; // in minutes
}

export function MCQInterface({ questions, onAnswerSubmit, onQuizComplete, timeLimit }: MCQInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { answer: string; isCorrect: boolean; timeSpent: number }>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - quizStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStartTime]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Record the answer
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        answer: selectedAnswer,
        isCorrect,
        timeSpent: questionTimeSpent
      }
    }));

    // Submit to parent
    onAnswerSubmit(currentQuestion.id, selectedAnswer, questionTimeSpent);

    // Show explanation
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      // Quiz complete
      const correctAnswers = Object.values(userAnswers).filter(a => a.isCorrect).length;
      const totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
      onQuizComplete({
        correct: correctAnswers,
        total: questions.length,
        timeSpent: totalTimeSpent
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    if (!timeLimit) return null;
    const totalTimeLimit = timeLimit * 60; // convert to seconds
    const remaining = totalTimeLimit - timeSpent;
    return Math.max(0, remaining);
  };

  const remainingTime = getRemainingTime();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question Header */}
      <Card className="overflow-hidden">
        <div className="gradient-medical p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">Q{currentQuestionIndex + 1}</span>
              </div>
              <div>
                <div className="font-semibold capitalize">{currentQuestion.category}</div>
                <div className="text-sm opacity-90">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {remainingTime !== null ? formatTime(remainingTime) : formatTime(timeSpent)}
              </div>
              <div className="text-sm opacity-90">
                {remainingTime !== null ? "Time remaining" : "Time elapsed"}
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </Card>

      {/* Question Content */}
      <Card>
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-teal-600/10 text-teal-600">
                {currentQuestion.category}
              </Badge>
              <Badge variant="outline" className={
                currentQuestion.difficulty === 'easy' ? 'border-emerald-500 text-emerald-500' :
                currentQuestion.difficulty === 'medium' ? 'border-amber-500 text-amber-500' :
                'border-rose-500 text-rose-500'
              }>
                {currentQuestion.difficulty}
              </Badge>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {currentQuestion.content}
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options && (currentQuestion.options as string[]).map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const isIncorrect = showExplanation && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(option)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showExplanation
                      ? isCorrect
                        ? 'border-emerald-500 bg-green-50'
                        : isIncorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : isSelected
                      ? 'border-teal-600 bg-blue-50'
                      : 'border-gray-200 hover:border-teal-600 hover:bg-blue-50'
                  } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-sm shrink-0">
                      {showExplanation && isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showExplanation && isIncorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        optionLetter
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-teal-600 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
              <div className="mt-3 text-sm text-gray-600">
                <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-between">
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => console.log('Question bookmarked for review')}
              >
                <Bookmark className="w-4 h-4" />
                <span>Save for Later</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => console.log('Question issue reported')}
              >
                <Flag className="w-4 h-4" />
                <span>Report Issue</span>
              </Button>
            </div>
            
            <div className="flex space-x-3">
              {currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestionIndex(prev => prev - 1);
                    setSelectedAnswer("");
                    setShowExplanation(false);
                  }}
                  disabled={showExplanation}
                >
                  Previous
                </Button>
              )}
              
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="btn-medical"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="btn-medical">
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Quiz"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
