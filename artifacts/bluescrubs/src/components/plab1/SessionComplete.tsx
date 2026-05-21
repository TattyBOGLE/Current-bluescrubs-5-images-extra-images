import { Button } from "@/components/ui/button";
import { RotateCcw, Home, CheckCircle2, XCircle, Clock, Tag } from "lucide-react";

interface TopicStat {
  topic: string;
  correct: number;
  total: number;
}

interface SessionCompleteProps {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  avgTimePerQuestion: number;
  timeSpent: number;
  selectedCategory: string;
  topicBreakdown?: TopicStat[];
  onRestart: () => void;
  onHome: () => void;
}

export function SessionComplete({
  totalQuestions,
  correctAnswers,
  percentage,
  avgTimePerQuestion,
  timeSpent,
  selectedCategory,
  topicBreakdown = [],
  onRestart,
  onHome,
}: SessionCompleteProps) {
  const incorrectCount = totalQuestions - correctAnswers;

  const circleStyle =
    percentage >= 80
      ? { bg: "bg-green-100", text: "text-green-700", ring: "ring-green-300" }
      : percentage >= 60
      ? { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" }
      : { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-300" };

  const feedbackText =
    percentage >= 80
      ? "Excellent — you're well prepared for PLAB 1"
      : percentage >= 60
      ? "Good effort — review the topics you missed"
      : "Keep practising — focus on your weak areas";

  const multiTopic = topicBreakdown.length >= 2;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-lg mx-auto space-y-5 mt-6">

        {/* Score circle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center gap-3">
          <div
            className={`w-36 h-36 rounded-full ${circleStyle.bg} ${circleStyle.ring} ring-4 flex flex-col items-center justify-center`}
          >
            <span className={`text-5xl font-extrabold ${circleStyle.text}`}>{percentage}%</span>
            <span className={`text-xs font-medium ${circleStyle.text} mt-0.5`}>Score</span>
          </div>
          <p className="text-sm text-gray-600 text-center mt-1">{feedbackText}</p>
        </div>

        {/* 2×2 stat grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Correct</p>
              <p className="text-xl font-bold text-gray-900">{correctAnswers} <span className="text-sm font-normal text-gray-400">/ {totalQuestions}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Incorrect</p>
              <p className="text-xl font-bold text-gray-900">{incorrectCount} <span className="text-sm font-normal text-gray-400">/ {totalQuestions}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Avg per question</p>
              <p className="text-xl font-bold text-gray-900">{avgTimePerQuestion}<span className="text-sm font-normal text-gray-400">s</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <Tag className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Category</p>
              <p className="text-base font-bold text-gray-900 capitalize leading-tight mt-0.5">{selectedCategory || "All"}</p>
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        {multiTopic && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Topic Breakdown</p>
            <div className="space-y-2.5">
              {topicBreakdown.map(({ topic, correct, total }) => {
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                const barColor =
                  pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
                return (
                  <div key={topic}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 capitalize font-medium truncate pr-3">{topic}</span>
                      <span className="text-sm text-gray-500 flex-shrink-0">{correct}/{total} · {pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onRestart} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Session
          </Button>
          <Button variant="outline" onClick={onHome} className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

      </div>
    </div>
  );
}
