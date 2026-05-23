import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdaptiveDashboardProps {
  userId: number;
}

type AnalyticsShape = {
  overallPerformance?: Array<{ accuracy: number; topic: string }>;
  sessionHistory?: Array<{
    questionsAnswered: number;
    accuracy: number;
    topicsExplored?: string[];
  }>;
  weaknessAnalysis?: {
    criticalWeaknesses?: Array<{
      topic: string;
      weaknessScore: number;
      questionsAttempted: number;
      commonMistakes?: string[];
    }>;
    moderateWeaknesses?: Array<{
      topic: string;
      weaknessScore: number;
      questionsAttempted: number;
      improvementTrend?: string;
    }>;
    improvingAreas?: Array<{ topic: string }>;
    overallWeaknessScore: number;
    recommendedActions?: string[];
  };
  examPrediction?: {
    successProbability: number;
    readinessLevel: string;
    confidenceInterval: { min: number; max: number };
    timeToReadiness: number;
    strengthAreas?: string[];
    keyImprovementAreas?: string[];
  };
  adaptiveRecommendations?: {
    nextDifficulty: string;
    recommendedQuestions: number;
    confidenceScore: number;
    focusTopics?: string[];
  };
};

type StatsShape = {
  initialized?: boolean;
  activeSessions?: number;
  questionBankSize?: number;
  generationStats?: { totalTemplates?: number };
};

export function AdaptiveLearningDashboard({ userId }: AdaptiveDashboardProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsShape>({
    queryKey: [`/api/adaptive/analytics/${userId}`],
    enabled: !!userId,
  });

  const { data: aiStats } = useQuery<StatsShape>({
    queryKey: ["/api/adaptive/stats"],
  });

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/adaptive/start-session", {
        userId,
        existingPerformance: analytics?.overallPerformance || [],
      });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.sessionId);
      queryClient.invalidateQueries({ queryKey: [`/api/adaptive/analytics/${userId}`] });
    },
  });

  const processAnswerMutation = useMutation({
    mutationFn: async ({
      questionId,
      answer,
      timeSpent,
    }: {
      questionId: string;
      answer: string;
      timeSpent: number;
    }) => {
      const response = await apiRequest("POST", "/api/adaptive/process-answer", {
        sessionId: activeSession,
        questionId,
        selectedAnswer: answer,
        timeSpent,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentQuestion(null);
      setSelectedAnswer("");
      queryClient.invalidateQueries({ queryKey: [`/api/adaptive/analytics/${userId}`] });
      if (data.nextQuestions && data.nextQuestions.length > 0) {
        setCurrentQuestion(data.nextQuestions[0]);
        setStartTime(Date.now());
      }
    },
  });

  const handleStartSession = () => {
    setStartTime(Date.now());
    startSessionMutation.mutate();
  };

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !selectedAnswer || !activeSession) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    processAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      timeSpent,
    });
  };

  const readinessTone = (level: string) => {
    if (level === "highly-ready" || level === "likely-ready")
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    if (level === "needs-work") return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    if (level === "not-ready") return "bg-rose-100 text-rose-800 hover:bg-rose-100";
    return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  };

  const formatReadinessLevel = (level: string) =>
    level.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-600" />
        <span className="ml-3 text-sm text-slate-600">Loading analytics…</span>
      </div>
    );
  }

  const accuracyAvg = analytics?.overallPerformance?.length
    ? Math.round(
        (analytics.overallPerformance.reduce((s, p) => s + p.accuracy, 0) /
          analytics.overallPerformance.length) *
          100,
      )
    : 0;

  return (
    <div className="space-y-5">
      {/* Session starter / active question */}
      {!activeSession ? (
        <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white shadow-sm shadow-teal-200">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5" />
            <h3 className="text-base font-semibold">Start Adaptive Session</h3>
          </div>
          <p className="text-sm text-teal-50 mb-4">
            A session that tunes itself to your strengths and gaps in real time.
          </p>
          <button
            onClick={handleStartSession}
            disabled={startSessionMutation.isPending}
            className="w-full h-11 rounded-xl bg-white text-teal-700 font-semibold text-sm hover:bg-teal-50 disabled:opacity-60"
          >
            {startSessionMutation.isPending ? "Starting…" : "Start Session"}
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-900">Adaptive Question</span>
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 border-none">
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mb-3">{currentQuestion.category}</p>
          <p className="text-[15px] text-slate-900 mb-4">{currentQuestion.question}</p>
          <div className="space-y-2 mb-4">
            {currentQuestion.options?.map((option: string, index: number) => (
              <label
                key={index}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="accent-teal-600"
                />
                <span className="text-sm text-slate-800">{option}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleAnswerSubmit}
            disabled={!selectedAnswer || processAnswerMutation.isPending}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold text-sm disabled:opacity-60"
          >
            {processAnswerMutation.isPending ? "Processing…" : "Submit Answer"}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-700" />
          <p className="text-sm text-teal-800">Session active — preparing the next question…</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-xl p-1">
          <TabsTrigger value="performance" className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-teal-700">
            Performance
          </TabsTrigger>
          <TabsTrigger value="weaknesses" className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-teal-700">
            Weaknesses
          </TabsTrigger>
          <TabsTrigger value="prediction" className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-teal-700">
            Prediction
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-teal-700">
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Performance */}
        <TabsContent value="performance" className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white border border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Overall Performance</h3>
              <div className="space-y-3">
                <Row label="Total Questions" value={analytics?.overallPerformance?.length ?? 0} />
                <Row label="Average Accuracy" value={`${accuracyAvg}%`} />
                <Row
                  label="Topics Covered"
                  value={
                    analytics?.overallPerformance
                      ? new Set(analytics.overallPerformance.map((p) => p.topic)).size
                      : 0
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Session History</h3>
              <div className="space-y-2">
                {analytics?.sessionHistory?.slice(0, 3).map((session, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-50"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-900">
                        {session.questionsAnswered} questions
                      </span>
                      <p className="text-xs text-slate-500">
                        {Math.round(session.accuracy * 100)}% accuracy
                      </p>
                    </div>
                    <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none">
                      {session.topicsExplored?.length || 0} topics
                    </Badge>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500">No sessions yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-700" />
                Engine Status
              </h3>
              <div className="space-y-2">
                <Row
                  label="Status"
                  value={
                    <Badge className={`${aiStats?.initialized ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"} border-none`}>
                      {aiStats?.initialized ? "Active" : "Inactive"}
                    </Badge>
                  }
                />
                <Row label="Active Sessions" value={aiStats?.activeSessions ?? 0} />
                <Row label="Question Bank" value={aiStats?.questionBankSize ?? 0} />
                <Row label="Templates" value={aiStats?.generationStats?.totalTemplates ?? 0} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Weaknesses */}
        <TabsContent value="weaknesses" className="mt-4">
          <div className="rounded-2xl bg-white border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-semibold text-slate-900">Weakness Analysis</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Knowledge gaps to focus on next.</p>

            {analytics?.weaknessAnalysis ? (
              <div className="space-y-5">
                {(analytics.weaknessAnalysis.criticalWeaknesses?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-rose-700 mb-2">Critical</h4>
                    <div className="space-y-2">
                      {analytics.weaknessAnalysis.criticalWeaknesses!.map((w, i) => (
                        <div key={i} className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="text-sm font-medium text-slate-900">{w.topic}</h5>
                            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none">
                              {Math.round(w.weaknessScore)}% errors
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">
                            {w.questionsAttempted} questions attempted
                          </p>
                          {(w.commonMistakes?.length ?? 0) > 0 && (
                            <ul className="mt-2 text-xs text-slate-700 space-y-0.5">
                              {w.commonMistakes!.slice(0, 2).map((m, idx) => (
                                <li key={idx}>• {m}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(analytics.weaknessAnalysis.moderateWeaknesses?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">Improve</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analytics.weaknessAnalysis.moderateWeaknesses!.slice(0, 4).map((w, i) => (
                        <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-sm font-medium text-slate-900">{w.topic}</h5>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
                              {Math.round(w.weaknessScore)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">
                            {w.questionsAttempted} questions • {w.improvementTrend}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(analytics.weaknessAnalysis.improvingAreas?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-700 mb-2">Improving</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analytics.weaknessAnalysis.improvingAreas!.slice(0, 4).map((a, i) => (
                        <div key={i} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-slate-900">{a.topic}</h5>
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                              On track
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-teal-700" />
                    <span className="text-sm font-medium text-slate-900">Overall Knowledge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={100 - analytics.weaknessAnalysis.overallWeaknessScore}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {100 - analytics.weaknessAnalysis.overallWeaknessScore}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Complete more questions to generate weakness analysis.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Prediction */}
        <TabsContent value="prediction" className="mt-4">
          <div className="rounded-2xl bg-white border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-semibold text-slate-900">Exam Success Prediction</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Your readiness, modelled from your data.</p>

            {analytics?.examPrediction ? (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="text-5xl font-bold text-teal-700 mb-2 tabular-nums">
                    {analytics.examPrediction.successProbability}%
                  </div>
                  <Badge
                    className={`${readinessTone(analytics.examPrediction.readinessLevel)} hover:bg-current border-none`}
                  >
                    {formatReadinessLevel(analytics.examPrediction.readinessLevel)}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-2">
                    Confidence: {analytics.examPrediction.confidenceInterval.min}% –{" "}
                    {analytics.examPrediction.confidenceInterval.max}%
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      Time to Readiness
                    </h4>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xl font-bold text-slate-900">
                        {analytics.examPrediction.timeToReadiness === 0
                          ? "Ready now"
                          : `${analytics.examPrediction.timeToReadiness} days`}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {analytics.examPrediction.timeToReadiness === 0
                          ? "On track based on current performance."
                          : "Estimated time to reach 80% readiness."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-slate-500" />
                      Strengths
                    </h4>
                    <div className="space-y-1.5">
                      {(analytics.examPrediction.strengthAreas?.length ?? 0) > 0 ? (
                        analytics.examPrediction.strengthAreas!.map((s, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm text-slate-800">{s}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Practise more to surface strengths.</p>
                      )}
                    </div>
                  </div>
                </div>

                {(analytics.examPrediction.keyImprovementAreas?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Improvement Areas</h4>
                    <div className="space-y-2">
                      {analytics.examPrediction.keyImprovementAreas!.map((area, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-700" />
                          <span className="text-sm text-slate-800">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Complete more questions to generate an exam prediction.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="mt-4">
          <div className="rounded-2xl bg-white border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-semibold text-slate-900">Recommendations</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Personal study guidance.</p>

            {analytics?.adaptiveRecommendations || analytics?.weaknessAnalysis ? (
              <div className="space-y-5">
                {(analytics?.weaknessAnalysis?.recommendedActions?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Immediate Actions</h4>
                    <div className="space-y-2">
                      {analytics!.weaknessAnalysis!.recommendedActions!.map((action, i) => (
                        <div
                          key={i}
                          className="flex gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100"
                        >
                          <Lightbulb className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-800">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analytics?.adaptiveRecommendations && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Study Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <h5 className="text-xs font-medium text-slate-500 mb-1">Next Difficulty</h5>
                        <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 border-none capitalize">
                          {analytics.adaptiveRecommendations.nextDifficulty}
                        </Badge>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <h5 className="text-xs font-medium text-slate-500 mb-1">Recommended Questions</h5>
                        <span className="text-lg font-bold text-slate-900 tabular-nums">
                          {analytics.adaptiveRecommendations.recommendedQuestions}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <h5 className="text-xs font-medium text-slate-500 mb-2">Confidence</h5>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={analytics.adaptiveRecommendations.confidenceScore}
                            className="flex-1"
                          />
                          <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {analytics.adaptiveRecommendations.confidenceScore}%
                          </span>
                        </div>
                      </div>
                      {(analytics.adaptiveRecommendations.focusTopics?.length ?? 0) > 0 && (
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                          <h5 className="text-xs font-medium text-slate-500 mb-2">Focus Topics</h5>
                          <div className="flex flex-wrap gap-1">
                            {analytics.adaptiveRecommendations.focusTopics!.slice(0, 3).map((t, i) => (
                              <Badge key={i} className="bg-white text-slate-700 hover:bg-white border border-slate-200 text-xs">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Start a session to receive personal recommendations.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}
