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

const primaryBtn =
  "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-md shadow-teal-200/50 border-none disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed";

const ghostBtn =
  "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-2xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed";

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
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 shadow-lg z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className={`${ghostBtn} px-4 py-3 flex items-center gap-2`}
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-center flex-1">
              <div className="text-sm font-semibold text-slate-800">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              {isTimedSession && (
                <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {formatTime(questionTimer)}
                </div>
              )}
            </div>

            {!showExplanation ? (
              <Button
                onClick={onSubmit}
                disabled={!selectedAnswer}
                className={`${primaryBtn} px-5 py-3`}
                data-testid="button-submit-answer"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className={`${primaryBtn} px-5 py-3 flex items-center gap-2`}
                data-testid="button-next"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div
        className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 shadow-lg z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-4xl mx-auto p-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className={`${ghostBtn} px-4 py-2 text-sm flex items-center gap-2`}
            >
              <ArrowLeft className="w-3 h-3" />
              Previous
            </Button>

            <div className="text-center flex-1">
              <div className="text-sm font-semibold text-slate-800">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              {isTimedSession && (
                <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {formatTime(questionTimer)}
                </div>
              )}
            </div>

            {!showExplanation ? (
              <Button
                onClick={onSubmit}
                disabled={!selectedAnswer}
                className={`${primaryBtn} px-5 py-2 text-sm`}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className={`${primaryBtn} px-5 py-2 text-sm flex items-center gap-2`}
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
