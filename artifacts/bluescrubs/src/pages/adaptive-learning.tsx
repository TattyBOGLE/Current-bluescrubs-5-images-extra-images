import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ChevronRight,
  HeartPulse,
  Droplets,
  Activity,
  Stethoscope,
  Pill,
  Microscope,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type Analytics = {
  overallPerformance?: Array<{ accuracy: number; topic: string }>;
  sessionHistory?: Array<{ questionsAnswered: number; accuracy: number; topicsExplored?: string[] }>;
  weaknessAnalysis?: {
    criticalWeaknesses?: Array<{ topic: string; weaknessScore: number; questionsAttempted: number }>;
    moderateWeaknesses?: Array<{ topic: string; weaknessScore: number }>;
    improvingAreas?: Array<{ topic: string }>;
    overallWeaknessScore: number;
  };
  examPrediction?: {
    successProbability: number;
    readinessLevel: string;
    timeToReadiness: number;
  };
};

const USER_ID = 1;

const FOCUS_ICONS = [HeartPulse, Droplets, Activity, Stethoscope, Pill, Microscope];

const SESSION_PRESETS = [
  { count: 5,  label: "Quick",     mins: "~5 min"  },
  { count: 10, label: "Standard",  mins: "~10 min" },
  { count: 20, label: "Deep",      mins: "~20 min" },
];

export default function AdaptiveLearning() {
  const [, setLocation] = useLocation();
  const [selectedCount, setSelectedCount] = useState(10);
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: [`/api/adaptive/analytics/${USER_ID}`],
  });

  const startSession = useMutation({
    mutationFn: async () => {
      const r = await apiRequest("POST", "/api/adaptive/start-session", {
        userId: USER_ID,
        existingPerformance: analytics?.overallPerformance ?? [],
      });
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/adaptive/analytics/${USER_ID}`] });
      setLocation(`/plab1?mode=adaptive&count=${selectedCount}`);
    },
  });

  const stats = useMemo(() => {
    const perf = analytics?.overallPerformance ?? [];
    const total = perf.length;
    const avgAccuracy = total
      ? Math.round((perf.reduce((s, p) => s + p.accuracy, 0) / total) * 100)
      : 0;
    const topicsCovered = new Set(perf.map((p) => p.topic)).size;
    const knowledge = analytics?.weaknessAnalysis
      ? 100 - analytics.weaknessAnalysis.overallWeaknessScore
      : null;
    return { total, avgAccuracy, topicsCovered, knowledge };
  }, [analytics]);

  const weakSpots = useMemo(() => {
    const w = analytics?.weaknessAnalysis;
    if (!w) return [];
    const list = [
      ...(w.criticalWeaknesses?.map((x) => ({ topic: x.topic, score: x.weaknessScore, severity: "high" as const })) ?? []),
      ...(w.moderateWeaknesses?.map((x) => ({ topic: x.topic, score: x.weaknessScore, severity: "medium" as const })) ?? []),
    ];
    return list.slice(0, 6);
  }, [analytics]);

  const prediction = analytics?.examPrediction;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-[680px] mx-auto px-4 pt-6 space-y-5">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white shadow-sm shadow-teal-200">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-50">
                Smart Practice
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">Adaptive Learning</h1>
            <p className="text-sm text-teal-50 mt-1 max-w-[34ch]">
              Practice that learns from your performance and targets your gaps.
            </p>
          </div>
        </section>

        {/* Start a session card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Start a session</h2>
              <p className="text-xs text-slate-500">Pick a length — difficulty adapts as you go.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-teal-700" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {SESSION_PRESETS.map((p) => {
              const active = selectedCount === p.count;
              return (
                <button
                  key={p.count}
                  type="button"
                  onClick={() => setSelectedCount(p.count)}
                  className={`rounded-xl p-3 text-left border transition-all ${
                    active
                      ? "border-teal-600 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  data-testid={`preset-${p.count}`}
                >
                  <div className={`text-lg font-bold tabular-nums ${active ? "text-teal-700" : "text-slate-900"}`}>
                    {p.count}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">{p.label}</div>
                  <div className="text-[10px] text-slate-400">{p.mins}</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => startSession.mutate()}
            disabled={startSession.isPending}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold text-sm shadow-sm shadow-teal-200 disabled:opacity-60 flex items-center justify-center gap-2"
            data-testid="button-start-adaptive"
          >
            {startSession.isPending ? "Starting…" : `Start ${selectedCount}-question session`}
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            label="Questions done"
            value={stats.total}
            tone="teal"
            Icon={Target}
            loading={isLoading}
          />
          <StatCard
            label="Avg. accuracy"
            value={`${stats.avgAccuracy}%`}
            tone="emerald"
            Icon={TrendingUp}
            loading={isLoading}
          />
          <StatCard
            label="Topics covered"
            value={stats.topicsCovered}
            tone="slate"
            Icon={Brain}
            loading={isLoading}
          />
          <StatCard
            label="Knowledge"
            value={stats.knowledge !== null ? `${stats.knowledge}%` : "—"}
            tone="teal"
            Icon={CheckCircle}
            loading={isLoading}
          />
        </section>

        {/* Readiness */}
        {prediction && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">Exam readiness</h2>
              <ReadinessBadge level={prediction.readinessLevel} />
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-bold text-teal-700 tabular-nums leading-none">
                {prediction.successProbability}%
              </span>
              <span className="text-xs text-slate-500">
                {prediction.timeToReadiness === 0
                  ? "Ready now"
                  : `~${prediction.timeToReadiness} days to 80%`}
              </span>
            </div>
            <Progress value={prediction.successProbability} className="h-2" />
          </section>
        )}

        {/* Focus areas */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Focus areas</h2>
              <p className="text-xs text-slate-500">
                {weakSpots.length > 0 ? "Topics needing the most work" : "Practise more to surface gaps"}
              </p>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>

          {weakSpots.length > 0 ? (
            <div className="space-y-2">
              {weakSpots.map((w, i) => {
                const Icon = FOCUS_ICONS[i % FOCUS_ICONS.length];
                return (
                  <button
                    key={`${w.topic}-${i}`}
                    onClick={() => setLocation(`/plab1?category=${encodeURIComponent(w.topic)}&mode=adaptive&count=10`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    data-testid={`focus-${i}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      w.severity === "high" ? "bg-rose-50" : "bg-amber-50"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        w.severity === "high" ? "text-rose-600" : "text-amber-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate capitalize">
                        {w.topic}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {Math.round(w.score)}% error rate
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">
                Run a few sessions and your weak topics will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Recent sessions */}
        {(analytics?.sessionHistory?.length ?? 0) > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Recent sessions</h2>
            <div className="space-y-2">
              {analytics!.sessionHistory!.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {s.questionsAnswered} questions
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {s.topicsExplored?.length ?? 0} topics
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-teal-700 tabular-nums">
                      {Math.round(s.accuracy * 100)}%
                    </div>
                    <div className="text-[11px] text-slate-500">accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  tone,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "teal" | "emerald" | "slate";
  loading?: boolean;
}) {
  const toneMap = {
    teal: { bg: "bg-teal-50", color: "text-teal-700" },
    emerald: { bg: "bg-emerald-50", color: "text-emerald-700" },
    slate: { bg: "bg-slate-100", color: "text-slate-700" },
  }[tone];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className={`w-9 h-9 rounded-xl ${toneMap.bg} flex items-center justify-center mb-2`}>
        <Icon className={`w-4 h-4 ${toneMap.color}`} />
      </div>
      <div className="text-2xl font-bold text-slate-900 tabular-nums leading-tight">
        {loading ? "—" : value}
      </div>
      <div className="text-[11px] text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function ReadinessBadge({ level }: { level: string }) {
  const cfg =
    level === "highly-ready" || level === "likely-ready"
      ? { tone: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100", label: "On track" }
      : level === "needs-work"
      ? { tone: "bg-amber-100 text-amber-800 hover:bg-amber-100", label: "Needs work" }
      : level === "not-ready"
      ? { tone: "bg-rose-100 text-rose-800 hover:bg-rose-100", label: "Not ready" }
      : { tone: "bg-slate-100 text-slate-700 hover:bg-slate-100", label: "—" };
  return <Badge className={`${cfg.tone} border-none text-xs`}>{cfg.label}</Badge>;
}
