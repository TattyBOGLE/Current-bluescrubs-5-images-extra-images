import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SessionNavBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  showExplanation: boolean;
  selectedAnswer: string;
  isTimedSession: boolean;
  questionTimer: number;
  onPrevious: () => void;
  onSubmit: () => void;
  onNext: () => void;
  formatTime: (ms: number) => string;
}

export function SessionNavBar({
  currentQuestionIndex,
  totalQuestions,
  showExplanation,
  selectedAnswer,
  isTimedSession,
  questionTimer,
  onPrevious,
  onSubmit,
  onNext,
  formatTime,
}: SessionNavBarProps) {
  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-center flex-1">
              <div className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              {isTimedSession && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(questionTimer)}
                </div>
              )}
            </div>

            {!showExplanation ? (
              <Button
                onClick={onSubmit}
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto p-3">
          <div className="flex items-center justify-between">
            <Button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-3 h-3" />
              Previous
            </Button>

            <div className="text-center flex-1">
              <div className="text-xs font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>

            {!showExplanation ? (
              <Button
                onClick={onSubmit}
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:text-gray-500 text-sm"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
