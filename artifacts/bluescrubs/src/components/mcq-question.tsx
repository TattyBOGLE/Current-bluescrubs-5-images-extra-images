import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Flag, Bookmark } from "lucide-react";
import { cn, formatTime, getCategoryIcon, getDifficultyColor } from "@/lib/utils";
import type { Question } from "@/lib/types";

interface MCQQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string, timeSpent: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  timeLimit?: number; // in seconds
}

export default function MCQQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  timeLimit = 120, // 2 minutes default
}: MCQQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer("");
    setIsAnswered(false);
    setTimeSpent(0);
  }, [question.id]);

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsAnswered(true);
      onAnswer(selectedAnswer, timeSpent);
    }
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;
  const timeRemaining = Math.max(0, timeLimit - timeSpent);

  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="gradient-primary text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">Q{questionNumber}</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(question.category)}</span>
                  <span className="font-semibold capitalize">{question.category}</span>
                </div>
                <div className="text-sm opacity-90">
                  Question {questionNumber} of {totalQuestions}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
              <div className="text-sm opacity-90">Time remaining</div>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="bg-white/20" />
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-medical-blue/10 text-medical-blue">
                {question.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("border-current", getDifficultyColor(question.difficulty))}
              >
                {question.difficulty}
              </Badge>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-medical-blue mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">{question.question}</p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all group",
                    isAnswered
                      ? isCorrect
                        ? "border-mint-green bg-mint-green/10"
                        : isSelected && !isCorrect
                        ? "border-deep-rose bg-deep-rose/10"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-medical-blue bg-medical-blue/5"
                      : "border-gray-200 hover:border-medical-blue hover:bg-medical-blue/5"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-white text-black flex items-center justify-center font-semibold text-sm shrink-0">
                      {optionLetter}
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {isAnswered && (
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-medical-blue rounded-lg animate-fade-in">
              <h4 className="font-semibold text-medical-blue mb-2">Explanation</h4>
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Action Buttons - Only utility buttons at top */}
          <div className="flex justify-center space-x-3 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => console.log('Question bookmarked for later review')}
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
        </CardContent>
      </Card>

      {/* Fixed Bottom Navigation - Sticky to the very bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={questionNumber === 1}
              className="min-w-[100px] h-12"
            >
              Previous
            </Button>
            
            <div className="text-center flex-1 mx-4">
              <div className="text-sm font-medium text-gray-700">
                {questionNumber} of {totalQuestions}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(timeSpent)}
              </div>
            </div>
            
            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="bg-medical-blue hover:bg-medical-blue/90 min-w-[100px] h-12"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className="bg-medical-blue hover:bg-medical-blue/90 min-w-[100px] h-12"
              >
                {questionNumber === totalQuestions ? "Complete" : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Add bottom padding to prevent content from being hidden behind fixed navigation */}
      <div className="pb-20"></div>
    </div>
  );
}
