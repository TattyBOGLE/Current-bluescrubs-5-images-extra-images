import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, Flame } from "lucide-react";

interface GamificationBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  sessionPoints: number;
  showPointsAnimation: boolean;
  lastPointsEarned: number;
  currentStreak: number;
  timeSpent: number;
  isTimedSession: boolean;
  questionTimer: number;
  isTimerRunning: boolean;
  formatTime: (ms: number) => string;
}

export function GamificationBar({
  currentQuestionIndex,
  totalQuestions,
  sessionPoints,
  showPointsAnimation,
  lastPointsEarned,
  currentStreak,
  timeSpent,
  isTimedSession,
  questionTimer,
  isTimerRunning,
  formatTime,
}: GamificationBarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-sm">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Badge>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1 rounded-full border border-yellow-300">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-yellow-700">{sessionPoints}</span>
            <span className="text-xs text-yellow-600">pts</span>
            {showPointsAnimation && (
              <span className="absolute -top-4 right-0 text-green-600 font-bold text-sm animate-bounce">
                +{lastPointsEarned}
              </span>
            )}
          </div>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 rounded-full border border-orange-300">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-600 text-sm">{currentStreak}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{Math.round(timeSpent / 1000 / 60)}m total</span>
          </div>
          {isTimedSession && (
            <div className={`flex items-center gap-2 text-sm font-mono ${isTimerRunning ? 'text-green-600' : 'text-gray-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{formatTime(questionTimer)}</span>
            </div>
          )}
        </div>
      </div>
      <Progress
        value={((currentQuestionIndex + 1) / totalQuestions) * 100}
        className="h-2"
      />
    </div>
  );
}
